import { CharacteristicValue, PrimitiveTypes } from 'homebridge';

import { BaseAccessory } from './abstract/base.js';

import { strings } from '../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../model/enums.js';
import { MQTTAccessoryDependency, SecurityConfig } from '../model/types.js';

import { LogType } from '../tools/log.js';

export class SecuritySystemAccessory extends BaseAccessory<SecurityConfig> {

  private readonly STATE_MAP: Map<keyof SecurityConfig, number>;

  constructor(dependency: MQTTAccessoryDependency<SecurityConfig>) {
    super(dependency);

    this.STATE_MAP = new Map([
      ['valueArmStay', dependency.Characteristic.SecuritySystemCurrentState.STAY_ARM],
      ['valueArmAway', dependency.Characteristic.SecuritySystemCurrentState.AWAY_ARM],
      ['valueArmNight', dependency.Characteristic.SecuritySystemCurrentState.NIGHT_ARM],
      ['valueDisarm', dependency.Characteristic.SecuritySystemCurrentState.DISARMED],
      ['valueAlarmTriggered', dependency.Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED],
    ]);

    const validCurrentStates = Array.from(this.STATE_MAP.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validCurrentStates.length === 0) {
      this.log.error(strings.security.noStateValues, this.name);
      return;
    }

    this.setup(CharacteristicKey.SecuritySystemCurrentState, dependency.Characteristic.SecuritySystemCurrentState.DISARMED,
      'topicGetCurrentSecurityState', this.onCurrentStateUpdate.bind(this), true,
    )?.setProps({ validValues: validCurrentStates.map((key) => this.STATE_MAP.get(key)!) });

    const validTargetStates = validCurrentStates.filter((key) => key !== 'valueAlarmTriggered');

    this.setup(CharacteristicKey.SecuritySystemTargetState, dependency.Characteristic.SecuritySystemTargetState.DISARM,
      'topicGetTargetSecurityState', this.onTargetStateUpdate.bind(this), true,
      'topicSetTargetSecurityState', this.onSetTargetState.bind(this),
    )?.setProps({ validValues: validTargetStates.map((key) => this.STATE_MAP.get(key)!) });

    this.setup(CharacteristicKey.StatusTampered, dependency.Characteristic.StatusTampered.NOT_TAMPERED, 'topicGetStatusTampered',
      this.bindOnUpdateNumericBoolean(CharacteristicKey.StatusTampered, 'valueTampered', strings.error.isTampered, strings.error.notTampered),
      false,
    );

    this.setup(CharacteristicKey.StatusFault, dependency.Characteristic.StatusFault.NO_FAULT, 'topicGetStatusFault',
      this.bindOnUpdateNumericBoolean(CharacteristicKey.StatusFault, 'valueFault', strings.error.hasFault, strings.error.noFault),
      false,
    );
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.SecuritySystem;
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
      this.logIfDesired(LogType.ERROR, this.stateStringForCV(current));
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
      this.log.error(strings.security.badValue, this.name, `'${value}'`);
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

    this.logIfDesired(strings.security.unknownValue, `'${value}'`);
  }

  private stateStringForCV(state: CharacteristicValue, future: boolean = false): string {
    switch(state) {
    case this.Characteristic.SecuritySystemCurrentState.STAY_ARM:
      return future ? strings.security.stateStayFuture : strings.security.stateStay;
    case this.Characteristic.SecuritySystemCurrentState.AWAY_ARM:
      return future ? strings.security.stateAwayFuture : strings.security.stateAway;
    case this.Characteristic.SecuritySystemCurrentState.NIGHT_ARM:
      return future ? strings.security.stateNightFuture : strings.security.stateNight;
    case this.Characteristic.SecuritySystemCurrentState.DISARMED:
      return future ? strings.security.stateDisarmFuture : strings.security.stateDisarmed;
    case this.Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED:
      return strings.security.stateTriggered;
    default:
      return strings.security.stateUnknown;
    }
  }
}
