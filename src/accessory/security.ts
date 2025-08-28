import { CharacteristicValue, PlatformAccessory, PrimitiveTypes, Service } from 'homebridge';

import { StatusActiveAccessory } from './abstract/statusActive.js';

import { strings } from '../i18n/i18n.js';

import { CharacteristicType, SecuritySystemConfig, ServiceType } from '../model/types.js';

import { Log } from '../tools/log.js';
import { CharacteristicKey } from '../model/enums.js';

export class SecuritySystemAccessory extends StatusActiveAccessory<SecuritySystemConfig> {

  private readonly STATE_MAP: Map<keyof SecuritySystemConfig, number>;

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: SecuritySystemConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log, SecuritySystemAccessory.name);

    this.set(CharacteristicKey.SecuritySystemCurrentState, Characteristic.SecuritySystemCurrentState.DISARMED);
    this.set(CharacteristicKey.SecuritySystemTargetState, Characteristic.SecuritySystemTargetState.DISARM);

    this.set(CharacteristicKey.StatusTampered, 0);
    this.set(CharacteristicKey.StatusFault, 0);

    this.STATE_MAP = new Map([
      ['valueArmStay', Characteristic.SecuritySystemCurrentState.STAY_ARM],
      ['valueArmAway', Characteristic.SecuritySystemCurrentState.AWAY_ARM],
      ['valueArmNight', Characteristic.SecuritySystemCurrentState.NIGHT_ARM],
      ['valueDisarm', Characteristic.SecuritySystemCurrentState.DISARMED],
      ['valueAlarmTriggered', Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED],
    ]);

    const validCurrentStates = Array.from(this.STATE_MAP.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validCurrentStates.length === 0) {
      this.log.error(strings.security.noStateValues, this.name);
      return;
    }

    this.accessoryService.getCharacteristic(Characteristic.SecuritySystemCurrentState)
      .setProps({ validValues: validCurrentStates.map((key) => this.STATE_MAP.get(key)!) })
      .onGet(this.getCurrentState.bind(this));

    const validTargetStates = validCurrentStates.filter((key) => key !== 'valueAlarmTriggered');

    this.accessoryService.getCharacteristic(Characteristic.SecuritySystemTargetState)
      .setProps({ validValues: validTargetStates.map((key) => this.STATE_MAP.get(key)!) })
      .onGet(this.getTargetState.bind(this))
      .onSet(this.onSetTargetState.bind(this));

    this.bind(Characteristic.StatusTampered, 'topicGetStatusTampered', this.getIsTampered.bind(this));
    this.bind(Characteristic.StatusFault, 'topicGetStatusFault', this.getHasStatusFault.bind(this));
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.SecuritySystem) || this.accessory.addService(this.Service.SecuritySystem);
  }

  override addTopicHandlers(): void {
    super.addTopicHandlers();

    this.addTopicHandler('topicGetCurrentSecurityState', this.onCurrentStateUpdate.bind(this));
    this.addTopicHandler('topicGetTargetSecurityState', this.onTargetStateUpdate.bind(this));

    this.addTopicHandler('topicGetStatusTampered', this.onTamperedUpdate.bind(this), false);
    this.addTopicHandler('topicGetStatusFault', this.onStatusFaultUpdate.bind(this), false);
  }

  private async getCurrentState(): Promise<CharacteristicValue> {
    return this.get(CharacteristicKey.SecuritySystemCurrentState);
  }

  private async getTargetState(): Promise<CharacteristicValue> {
    return this.get(CharacteristicKey.SecuritySystemTargetState);
  }

  private async getIsTampered(): Promise<CharacteristicValue> {
    return this.get(CharacteristicKey.StatusTampered);
  }

  private async getHasStatusFault(): Promise<CharacteristicValue> {
    return this.get(CharacteristicKey.StatusFault);
  }

  private async onCurrentStateUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    const current = this.toCVState(value);
    if (current === undefined) {
      return;
    }

    if (current as number <= this.Characteristic.SecuritySystemTargetState.DISARM) {
      this.onUpdate(CharacteristicKey.SecuritySystemTargetState, current);
    }

    if (!this.onUpdate(CharacteristicKey.SecuritySystemCurrentState, current)) {
      return;
    }

    if (current === this.Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED) {
      this.log.error(this.stateStringForCV(current), this.name);
    } else {
      this.logIfDesired(this.stateStringForCV(current));
    }
  }

  private async onTargetStateUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    const target = this.toCVState(value);
    if (target === undefined) {
      return;
    }

    this.onUpdate(CharacteristicKey.SecuritySystemTargetState, target, this.stateStringForCV(target, true));
  }

  private async onTamperedUpdate(topic: string, value: PrimitiveTypes): Promise<void> {
    const statusTampered = value === this.getPrimitiveValue('valueTampered') ? 1 : 0;
    this.onUpdate(CharacteristicKey.StatusTampered, statusTampered, statusTampered ? strings.security.isTampered : strings.security.notTampered);
  }

  private async onStatusFaultUpdate(topic: string, value: PrimitiveTypes): Promise<void> {
    const statusFault = value === this.getPrimitiveValue('valueFault') ? 1 : 0;
    this.onUpdate(CharacteristicKey.StatusFault, statusFault, statusFault ? strings.security.hasFault : strings.security.noFault);
  }

  private async onSetTargetState(value: CharacteristicValue) {

    const target = this.fromCVState(value);
    if (target === undefined) {
      return;
    }

    this.onSet(CharacteristicKey.SecuritySystemTargetState, value, target, 'topicSetTargetSecurityState', this.stateStringForCV(value, true));
  }

  private fromCVState(value: CharacteristicValue): PrimitiveTypes | undefined {

    let primative = undefined;
    this.STATE_MAP.forEach( (test, key) => {
      if (value === test) {
        primative = this.getPrimitiveValue(key);
      }
    });

    if (primative === undefined) {
      this.log.error(strings.security.badTarget, this.name, `'${value}'`);
    }

    return primative;
  }

  private toCVState(value: PrimitiveTypes): CharacteristicValue | undefined {
    switch (value) {
    case this.getPrimitiveValue('valueArmStay', false):
      return this.STATE_MAP.get('valueArmStay');
    case this.getPrimitiveValue('valueArmAway', false):
      return this.STATE_MAP.get('valueArmAway');
    case this.getPrimitiveValue('valueArmNight', false):
      return this.STATE_MAP.get('valueArmNight');
    case this.getPrimitiveValue('valueDisarm', false):
      return this.STATE_MAP.get('valueDisarm');
    case this.getPrimitiveValue('valueAlarmTriggered', false):
      return this.STATE_MAP.get('valueAlarmTriggered');
    }

    this.log.error(strings.security.unknownValue, this.name, value);
  }

  private stateStringForCV(state: CharacteristicValue, future: boolean = false): string {
    switch(state) {
    case this.Characteristic.SecuritySystemCurrentState.STAY_ARM:
      return future ? strings.security.stateFutureArmStay : strings.security.stateCurrentArmStay;
    case this.Characteristic.SecuritySystemCurrentState.AWAY_ARM:
      return future ? strings.security.stateFutureArmAway : strings.security.stateCurrentArmAway;
    case this.Characteristic.SecuritySystemCurrentState.NIGHT_ARM:
      return future ? strings.security.stateFutureArmNight : strings.security.stateCurrentArmNight;
    case this.Characteristic.SecuritySystemCurrentState.DISARMED:
      return future ? strings.security.stateFutureDisarm : strings.security.stateCurrentDisarm;
    case this.Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED:
      return strings.security.stateCurrentAlarmTriggered;
    default:
      return strings.security.stateUnknown;
    }
  }
}
