import { CharacteristicValue, PrimitiveTypes } from 'homebridge';

import { HomeKitAccessory } from './abstract/base.js';

import { strings } from '../i18n/i18n.js';

import { AccessoryType } from '../model/enums.js';
import { HKCharacteristicKey, MQTTAccessoryDependency } from '../model/homekit.js';
import { SecurityConfig } from '../model/types.js';

import { LogType } from '../tools/log.js';

export class SecuritySystemAccessory extends HomeKitAccessory<SecurityConfig> {

  private readonly STATES: Map<keyof SecurityConfig, number>;
  private readonly CURRENT_STRINGS: Map<CharacteristicValue, string>;

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.SecuritySystem;
  }

  constructor(dependency: MQTTAccessoryDependency<SecurityConfig>) {
    super(dependency);

    this.STATES = new Map([
      ['valueArmStay', dependency.Characteristic.SecuritySystemCurrentState.STAY_ARM],
      ['valueArmAway', dependency.Characteristic.SecuritySystemCurrentState.AWAY_ARM],
      ['valueArmNight', dependency.Characteristic.SecuritySystemCurrentState.NIGHT_ARM],
      ['valueDisarm', dependency.Characteristic.SecuritySystemCurrentState.DISARMED],
      ['valueAlarmTriggered', dependency.Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED],
    ]);

    this.CURRENT_STRINGS = new Map([
      [dependency.Characteristic.SecuritySystemCurrentState.STAY_ARM, strings.security.stateStay],
      [dependency.Characteristic.SecuritySystemCurrentState.AWAY_ARM, strings.security.stateAway],
      [dependency.Characteristic.SecuritySystemCurrentState.NIGHT_ARM, strings.security.stateNight],
      [dependency.Characteristic.SecuritySystemCurrentState.DISARMED, strings.security.stateDisarmed],
      [dependency.Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED, strings.security.stateTriggered],
    ]);

    const validCurrentStates = Array.from(this.STATES.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validCurrentStates.length === 0) {
      this.log.error(strings.security.noStateValues, this.name);
      return;
    }

    this.setup(HKCharacteristicKey.SecuritySystemCurrentState, dependency.Characteristic.SecuritySystemCurrentState.DISARMED,
      'topicGetCurrentSecurityState', this.onCurrentStateUpdate.bind(this), true,
    )?.setProps({ validValues: validCurrentStates.map((key) => this.STATES.get(key)!) });

    const validTargetStates = validCurrentStates.filter((key) => key !== 'valueAlarmTriggered');

    const futureStrings = new Map([
      [dependency.Characteristic.SecuritySystemCurrentState.STAY_ARM, strings.security.stateStayFuture],
      [dependency.Characteristic.SecuritySystemCurrentState.AWAY_ARM, strings.security.stateAwayFuture],
      [dependency.Characteristic.SecuritySystemCurrentState.NIGHT_ARM, strings.security.stateNightFuture],
      [dependency.Characteristic.SecuritySystemCurrentState.DISARMED, strings.security.stateDisarmFuture],
    ]);

    this.setup(HKCharacteristicKey.SecuritySystemTargetState, dependency.Characteristic.SecuritySystemTargetState.DISARM,
      'topicGetTargetSecurityState',
      this.bindOnUpdateState(HKCharacteristicKey.SecuritySystemTargetState, this.STATES, futureStrings, strings.security.unknownValue),
      true,
      'topicSetTargetSecurityState',
      this.bindOnSetState(HKCharacteristicKey.SecuritySystemTargetState, 'topicSetTargetSecurityState', this.STATES, futureStrings, strings.security.badValue),
    )?.setProps({ validValues: validTargetStates.map((key) => this.STATES.get(key)!) });

    this.setup(HKCharacteristicKey.StatusTampered, dependency.Characteristic.StatusTampered.NOT_TAMPERED, 'topicGetStatusTampered',
      this.bindOnUpdateNumericBoolean(HKCharacteristicKey.StatusTampered, 'valueTampered', strings.error.isTampered, strings.error.notTampered),
      false,
    );

    this.setup(HKCharacteristicKey.StatusFault, dependency.Characteristic.StatusFault.NO_FAULT, 'topicGetStatusFault',
      this.bindOnUpdateNumericBoolean(HKCharacteristicKey.StatusFault, 'valueFault', strings.error.hasFault, strings.error.noFault),
      false,
    );
  }

  private async onCurrentStateUpdate(_topic: string, value: PrimitiveTypes): Promise<void> {

    let current: CharacteristicValue | undefined;
    for (const valueKey of this.STATES.keys()) {
      if (value === this.getPrimitiveValue(valueKey, false)) {
        current = this.STATES.get(valueKey);
        break;
      }
    }

    if (current === undefined) {
      this.log.ifVerbose(strings.security.unknownValue, `'${value}'`);
      return;
    }

    if (current as number <= this.Characteristic.SecuritySystemTargetState.DISARM) {
      this.onUpdate(HKCharacteristicKey.SecuritySystemTargetState, current);
    }

    if (!this.onUpdate(HKCharacteristicKey.SecuritySystemCurrentState, current)) {
      return;
    }

    const logString = this.CURRENT_STRINGS.get(current);
    if (!logString) {
      return;
    }

    if (current === this.Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED) {
      this.logIfDesired(LogType.ERROR, logString);
    } else {
      this.logIfDesired(logString);
    }
  }
}
