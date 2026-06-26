import { CharacteristicValue, PrimitiveTypes } from 'homebridge';

import { HomeKitAccessory } from './abstract/base.js';

import { strings } from '../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey } from '../model/enums.js';
import { LockConfig, MQTTAccessoryDependency } from '../model/types.js';

import { LogType } from '../tools/log.js';

export class LockMechanismAccessory<C extends LockConfig = LockConfig> extends HomeKitAccessory<C> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.LockMechanism;
  }

  constructor(dependency: MQTTAccessoryDependency<C>, requireTopics: boolean = true) {
    super(dependency);

    this.setup(HKCharacteristicKey.LockCurrentState, dependency.Characteristic.LockCurrentState.UNKNOWN,
      'topicGetCurrentLockState', this.onCurrentStateUpdate.bind(this), requireTopics);

    const targetStates = new Map<keyof LockConfig, number>([
      ['valueLockStateSecured', dependency.Characteristic.LockTargetState.SECURED],
      ['valueLockStateUnsecured', dependency.Characteristic.LockTargetState.UNSECURED],
    ]);

    const targetStrings = new Map([
      [dependency.Characteristic.LockCurrentState.SECURED, strings.lock.stateSecuredFuture],
      [dependency.Characteristic.LockCurrentState.UNSECURED, strings.lock.stateUnsecuredFuture],
    ]);

    this.setup(HKCharacteristicKey.LockTargetState, dependency.Characteristic.LockTargetState.SECURED,
      'topicGetTargetLockState',
      this.bindOnUpdateState(HKCharacteristicKey.LockTargetState, targetStates, targetStrings, strings.lock.stateUnknown),
      requireTopics,
      'topicSetTargetLockState',
      this.bindOnSetState(HKCharacteristicKey.LockTargetState, 'topicSetTargetLockState', targetStates, targetStrings, strings.lock.badValue),
    );
  }

  private async onCurrentStateUpdate(_topic: string, value: PrimitiveTypes): Promise<void> {

    const current = this.currentStateFromValue(value);

    if (current as number <= this.Characteristic.LockTargetState.SECURED) {
      this.onUpdate(HKCharacteristicKey.LockTargetState, current);
    }

    if (!this.onUpdate(HKCharacteristicKey.LockCurrentState, current)) {
      return;
    }

    if (current === this.Characteristic.LockCurrentState.JAMMED) {
      this.logIfDesired(LogType.ERROR, this.stringForState(current));
    } else {
      this.logIfDesired(this.stringForState(current));
    }

    if (current === this.Characteristic.LockCurrentState.UNSECURED) {
      this.startTimeout( () => {
        this.service.getCharacteristic(this.Characteristic.LockTargetState).handleSetRequest(this.Characteristic.LockTargetState.SECURED);
      });
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

  private stringForState(state: CharacteristicValue): string {
    switch(state) {
    case this.Characteristic.LockCurrentState.SECURED:
      return strings.lock.stateSecured;
    case this.Characteristic.LockCurrentState.UNSECURED:
      return strings.lock.stateUnsecured;
    case this.Characteristic.LockCurrentState.JAMMED:
      return strings.lock.stateJammed;
    default:
      return strings.lock.stateUnknown;
    }
  }
}
