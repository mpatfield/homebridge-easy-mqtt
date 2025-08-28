import { CharacteristicValue, PlatformAccessory, PrimitiveTypes, Service } from 'homebridge';

import { StatusActiveAccessory } from './abstract/statusActive.js';

import { strings } from '../i18n/i18n.js';

import { CharacteristicKey } from '../model/enums.js';
import { CharacteristicType, LockMechanismConfig, ServiceType } from '../model/types.js';

import { Log } from '../tools/log.js';

export class LockMechanismAccessory extends StatusActiveAccessory<LockMechanismConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: LockMechanismConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log, LockMechanismAccessory.name);

    this.set(CharacteristicKey.LockCurrentState, Characteristic.LockCurrentState.UNKNOWN);
    this.set(CharacteristicKey.LockTargetState, Characteristic.LockTargetState.SECURED);

    this.accessoryService.getCharacteristic(this.Characteristic.LockCurrentState)
      .onGet(this.getCurrentState.bind(this));

    this.accessoryService.getCharacteristic(this.Characteristic.LockTargetState)
      .onGet(this.getTargetState.bind(this))
      .onSet(this.onSetTargetState.bind(this));
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.LockMechanism) || this.accessory.addService(this.Service.LockMechanism);
  }

  override addTopicHandlers(): void {
    super.addTopicHandlers();
    this.addTopicHandler('topicGetLockCurrentState', this.onCurrentStateUpdate.bind(this));
    this.addTopicHandler('topicGetLockTargetState', this.onTargetStateUpdate.bind(this));
  }

  private async getCurrentState(): Promise<CharacteristicValue> {
    return this.get(CharacteristicKey.LockCurrentState);
  }

  private async getTargetState(): Promise<CharacteristicValue> {
    return this.get(CharacteristicKey.LockTargetState);
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
      this.log.error(this.stringForState(current), this.name);
    } else {
      this.logIfDesired(this.stringForState(current));
    }
  }

  private async onTargetStateUpdate(topic: string, value: PrimitiveTypes): Promise<void> {
    const target = this.targetStateFromValue(value);
    this.onUpdate(CharacteristicKey.LockTargetState, target, this.stringForState(target, true));
  }

  private async onSetTargetState(value: CharacteristicValue) {

    const target = this.valueFromTargetState(value);
    if (target === undefined) {
      return;
    }

    this.onSet(CharacteristicKey.LockTargetState, value, target, 'topicSetTargetState', this.stringForState(value, true));
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
    default:
      this.log.error(strings.lock.badTarget, this.name, `'${value}'`);
      return undefined;
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
