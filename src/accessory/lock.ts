import { CharacteristicValue, PlatformAccessory, PrimitiveTypes, Service } from 'homebridge';

import { BaseAccessory } from './abstract/base.js';

import { strings } from '../i18n/i18n.js';

import { CharacteristicKey } from '../model/enums.js';
import { CharacteristicType, LockMechanismConfig, ServiceType } from '../model/types.js';

import { Log, LogType } from '../tools/log.js';

export class LockMechanismAccessory extends BaseAccessory<LockMechanismConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: LockMechanismConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log);

    const getTopicCurrent = this.config.topicGetLockCurrentState !== undefined && this.config.topicGetCurrentLockState === undefined
      ? 'topicGetLockCurrentState' : 'topicGetCurrentLockState';
    this.setupCharacteristic(CharacteristicKey.LockCurrentState, Characteristic.LockCurrentState.UNKNOWN,
      getTopicCurrent, this.onCurrentStateUpdate.bind(this), true);

    let getTargetTopic: keyof LockMechanismConfig, setTargetTopic : keyof LockMechanismConfig;
    if (this.config.topicGetLockTargetState !== undefined && this.config.topicGetTargetLockState === undefined) {
      getTargetTopic = 'topicGetLockTargetState';
      setTargetTopic = 'topicSetTargetState';
    } else {
      getTargetTopic = 'topicGetTargetLockState';
      setTargetTopic = 'topicSetTargetLockState';
    }

    this.setupCharacteristic(CharacteristicKey.LockTargetState, Characteristic.LockTargetState.SECURED,
      getTargetTopic, this.onTargetStateUpdate.bind(this), true,
      setTargetTopic, this.onSetTargetState.bind(this),
    );
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.LockMechanism) || this.accessory.addService(this.Service.LockMechanism);
  }

  private async onCurrentStateUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    const current = this.currentStateFromValue(value);

    if (current as number <= this.Characteristic.LockTargetState.SECURED) {
      this.onUpdate(CharacteristicKey.LockTargetState, current);
    }

    if (!this.onUpdate(CharacteristicKey.LockCurrentState, current)) {
      return;
    }

    if (current === this.Characteristic.LockCurrentState.JAMMED) {
      this.logIfDesired(LogType.ERROR, this.stringForState(current));
    } else {
      this.logIfDesired(this.stringForState(current));
    }
  }

  private async onTargetStateUpdate(topic: string, value: PrimitiveTypes): Promise<void> {
    const target = this.targetStateFromValue(value);
    this.onUpdate(CharacteristicKey.LockTargetState, target, this.stringForState(target, true));
  }

  private async onSetTargetState(value: CharacteristicValue) {

    if (!this.assert('valueLockStateSecured', 'valueLockStateUnsecured')) {
      return;
    }

    const target = this.valueFromTargetState(value);
    if (target === undefined) {
      this.log.error(strings.lock.badValue, this.name, `'${value}'`);
      return;
    }

    if (this.config.topicSetTargetState !== undefined && this.config.topicSetTargetLockState === undefined) {
      this.onSet(CharacteristicKey.LockTargetState, value, target, 'topicSetTargetState', this.stringForState(value, true));
    } else {
      this.onSet(CharacteristicKey.LockTargetState, value, target, 'topicSetTargetLockState', this.stringForState(value, true));
    }
  }

  private currentStateFromValue(value: PrimitiveTypes | undefined): CharacteristicValue {

    if (value === undefined) {
      return this.Characteristic.LockCurrentState.UNKNOWN;
    }

    switch (value) {
    case this.getPrimitiveValue('valueLockStateSecured'):
      return this.Characteristic.LockCurrentState.SECURED;
    case this.getPrimitiveValue('valueLockStateUnsecured'):
      return this.Characteristic.LockCurrentState.UNSECURED;
    case this.getPrimitiveValue('valueLockStateJammed', false):
      return this.Characteristic.LockCurrentState.JAMMED;
    default:
      return this.Characteristic.LockCurrentState.UNKNOWN;
    }
  }

  private targetStateFromValue(value: PrimitiveTypes | undefined): CharacteristicValue {

    if (value === undefined) {
      return this.Characteristic.LockTargetState.SECURED;
    }

    switch (value) {
    case this.getPrimitiveValue('valueLockStateUnsecured'):
      return this.Characteristic.LockTargetState.UNSECURED;
    case this.getPrimitiveValue('valueLockStateSecured'):
    default:
      return this.Characteristic.LockTargetState.SECURED;
    }
  }

  private valueFromTargetState(value: CharacteristicValue): PrimitiveTypes | undefined {
    switch (value) {
    case this.Characteristic.LockTargetState.SECURED:
      return this.getPrimitiveValue('valueLockStateSecured');
    case this.Characteristic.LockTargetState.UNSECURED:
      return this.getPrimitiveValue('valueLockStateUnsecured');
    }
  }

  private stringForState(state: CharacteristicValue, future: boolean = false): string {
    switch(state) {
    case this.Characteristic.LockCurrentState.SECURED:
      return future ? strings.lock.stateFutureSecured : strings.lock.stateCurrentSecured;
    case this.Characteristic.LockCurrentState.UNSECURED:
      return future ? strings.lock.stateFutureUnsecured : strings.lock.stateCurrentUnsecured;
    case this.Characteristic.LockCurrentState.JAMMED:
      return strings.lock.stateJammed;
    default:
      return strings.lock.stateUnknown;
    }
  }
}
