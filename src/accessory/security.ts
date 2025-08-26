import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import { makeHandler } from './abstract/base.js';
import { StatusActiveAccessory } from './abstract/statusActive.js';

import { strings } from '../i18n/i18n.js';

import { CharacteristicType, SecuritySystemConfig, ServiceType } from '../model/types.js';

import { Log } from '../tools/log.js';
import { TopicHandler } from './abstract/base.js';
import { Primitive, toPrimitive } from '../tools/primitive.js';

export class SecuritySystemAccessory extends StatusActiveAccessory<SecuritySystemConfig> {

  private currentState: CharacteristicValue;
  private targetState: CharacteristicValue;

  private isTampered: CharacteristicValue = 0;
  private hasStatusFault: CharacteristicValue = 0;

  private readonly STATE_MAP: Map<keyof SecuritySystemConfig, number>;

  constructor(
    Service: ServiceType,
    Characteristic: CharacteristicType,
    accessory: PlatformAccessory,
    config: SecuritySystemConfig,
    log: Log,
  ) {
    super(Service, Characteristic, accessory, config, log, SecuritySystemAccessory.name);

    this.currentState = Characteristic.SecuritySystemCurrentState.DISARMED;
    this.targetState = Characteristic.SecuritySystemTargetState.DISARM;

    this.STATE_MAP = new Map([
      ['valueArmStay', Characteristic.SecuritySystemCurrentState.STAY_ARM],
      ['valueArmAway', Characteristic.SecuritySystemCurrentState.AWAY_ARM],
      ['valueArmNight', Characteristic.SecuritySystemCurrentState.NIGHT_ARM],
      ['valueDisarm', Characteristic.SecuritySystemCurrentState.DISARMED],
      ['valueAlarmTriggered', Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED],
    ]);

    const validCurrentStates = Array.from(this.STATE_MAP.keys()).filter((key) => this.config[key] !== undefined);
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
      .onSet(this.setTargetState.bind(this));

    this.accessoryService.getCharacteristic(Characteristic.StatusTampered)
      .onGet(this.getIsTampered.bind(this));

    this.accessoryService.getCharacteristic(Characteristic.StatusFault)
      .onGet(this.getHasStatusFault.bind(this));
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.SecuritySystem) || this.accessory.addService(this.Service.SecuritySystem);
  }

  override get topicHandlers(): TopicHandler[] {

    const topicHandlers = super.topicHandlers;

    if (!this.assert('topicGetCurrentSecurityState', 'topicGetTargetSecurityState')) {
      return topicHandlers;
    }

    topicHandlers.push(makeHandler(this.config.topicGetCurrentSecurityState, this.onCurrentStateUpdate.bind(this)));
    topicHandlers.push(makeHandler(this.config.topicGetTargetSecurityState, this.onTargetStateUpdate.bind(this)));

    if (this.config.topicGetStatusTampered) {
      topicHandlers.push(makeHandler(this.config.topicGetStatusTampered, this.onTamperedUpdate.bind(this)));
    }

    if (this.config.topicGetStatusFault) {
      topicHandlers.push(makeHandler(this.config.topicGetStatusFault, this.onStatusFaultUpdate.bind(this)));
    }

    return topicHandlers;
  }

  private async getCurrentState(): Promise<CharacteristicValue> {
    return this.currentState;
  }

  private async getTargetState(): Promise<CharacteristicValue> {
    return this.targetState;
  }

  private async getIsTampered(): Promise<CharacteristicValue> {
    return this.isTampered;
  }

  private async getHasStatusFault(): Promise<CharacteristicValue> {
    return this.hasStatusFault;
  }

  private async onCurrentStateUpdate(topic: string, value: Primitive): Promise<void> {

    const current = this.toCVState(value);
    if (current === undefined || current === this.currentState) {
      return;
    }

    this.currentState = current;
    this.accessoryService.updateCharacteristic(this.Characteristic.SecuritySystemCurrentState, this.currentState);

    this.targetState = this.currentState;
    this.accessoryService.updateCharacteristic(this.Characteristic.SecuritySystemTargetState, this.targetState);

    if (this.currentState === this.Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED) {
      this.log.error(this.stateStringForCV(this.currentState), this.name);
    } else {
      this.logIfDesired(this.stateStringForCV(this.currentState));
    }
  }

  private async onTargetStateUpdate(topic: string, value: Primitive): Promise<void> {

    const target = this.toCVState(value);
    if (target === undefined || target === this.targetState) {
      return;
    }

    this.targetState = target;
    this.accessoryService.updateCharacteristic(this.Characteristic.SecuritySystemTargetState, this.targetState);

    this.logIfDesired(this.stateStringForCV(this.targetState, true));
  }

  private async onTamperedUpdate(topic: string, value: Primitive): Promise<void> {

    if (!this.assert('valueTampered')) {
      return;
    }

    const isTampered = value === toPrimitive(this.config.valueTampered) ? 1 : 0;
    if (isTampered === this.isTampered) {
      return;
    }

    this.isTampered = isTampered;
    this.accessoryService.updateCharacteristic(this.Characteristic.StatusTampered, this.isTampered);

    this.logIfDesired(this.isTampered ? strings.security.isTampered : strings.security.notTampered);
  }

  private async onStatusFaultUpdate(topic: string, value: Primitive): Promise<void> {

    if (!this.assert('valueFault')) {
      return;
    }

    const hasStatusFault = value === toPrimitive(this.config.valueFault) ? 1 : 0;
    if (hasStatusFault === this.hasStatusFault) {
      return;
    }

    this.hasStatusFault = hasStatusFault;
    this.accessoryService.updateCharacteristic(this.Characteristic.StatusFault, this.hasStatusFault);

    this.logIfDesired(this.hasStatusFault ? strings.security.hasFault : strings.security.noFault);
  }

  private async setTargetState(value: CharacteristicValue) {

    if (!this.assert('topicSetTargetSecurityState')) {
      return;
    }

    const target = this.fromCVState(value);
    if (target === undefined) {
      return;
    }

    if (this.targetState !== value) {
      this.logIfDesired(this.stateStringForCV(value, true));
    }

    this.targetState = value;

    this.accessoryService.updateCharacteristic(this.Characteristic.SecuritySystemTargetState, this.targetState);

    this.publish(this.config.topicSetTargetSecurityState, target);
  }

  private fromCVState(value: CharacteristicValue): Primitive | undefined {

    let primative = undefined;
    this.STATE_MAP.forEach( (test, key) => {
      if (value === test) {
        primative = toPrimitive(this.config[key]);
      }
    });

    if (primative === undefined) {
      this.log.error(strings.security.badTarget, this.name, value);
    }

    return primative;
  }

  private toCVState(value: Primitive): CharacteristicValue | undefined {
    switch (value) {
    case toPrimitive(this.config.valueArmStay):
      return this.STATE_MAP.get('valueArmStay');
    case toPrimitive(this.config.valueArmAway):
      return this.STATE_MAP.get('valueArmAway');
    case toPrimitive(this.config.valueArmNight):
      return this.STATE_MAP.get('valueArmNight');
    case toPrimitive(this.config.valueDisarm):
      return this.STATE_MAP.get('valueDisarm');
    case toPrimitive(this.config.valueAlarmTriggered):
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
