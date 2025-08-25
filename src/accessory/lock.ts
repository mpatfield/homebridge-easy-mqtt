import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import { makeHandler, TopicHandler } from './abstract/base.js';
import { StatusActiveAccessory } from './abstract/statusActive.js';

import { strings } from '../i18n/i18n.js';

import { CharacteristicType, LockMechanismConfig, ServiceType } from '../model/types.js';

import { Log } from '../tools/log.js';
import { Primitive, toPrimitive } from '../tools/primitive.js';

export class LockMechanismAccessory extends StatusActiveAccessory<LockMechanismConfig> {

  private currentState: CharacteristicValue;
  private targetState: CharacteristicValue;

  constructor(
    Service: ServiceType,
    Characteristic: CharacteristicType,
    accessory: PlatformAccessory,
    config: LockMechanismConfig,
    log: Log,
  ) {
    super(Service, Characteristic, accessory, config, log, LockMechanismAccessory.name);

    this.currentState = this.Characteristic.LockCurrentState.UNKNOWN;
    this.targetState = this.Characteristic.LockTargetState.SECURED;

    this.accessoryService.getCharacteristic(this.Characteristic.LockCurrentState)
      .onGet(this.getCurrentState.bind(this));

    this.accessoryService.getCharacteristic(this.Characteristic.LockTargetState)
      .onGet(this.getTargetState.bind(this))
      .onSet(this.setTargetState.bind(this));
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.LockMechanism) || this.accessory.addService(this.Service.LockMechanism);
  }


  override get topicHandlers(): TopicHandler[] {

    const topicHandlers = super.topicHandlers;

    if (!this.assert('topicGetLockCurrentState', 'topicGetLockTargetState')) {
      return topicHandlers;
    }

    topicHandlers.push(makeHandler(this.config.topicGetLockCurrentState, this.onCurrentStateUpdate.bind(this)));
    topicHandlers.push(makeHandler(this.config.topicGetLockTargetState, this.onTargetStateUpdate.bind(this)));

    return topicHandlers;
  }

  private async getCurrentState(): Promise<CharacteristicValue> {
    return this.currentState;
  }

  private async getTargetState(): Promise<CharacteristicValue> {
    return this.targetState;
  }

  private async onCurrentStateUpdate(topic: string, value: Primitive): Promise<void> {

    const current = this.currentStateFromValue(value);
    if (current === this.currentState) {
      return;
    }

    this.currentState = current;
    this.accessoryService.updateCharacteristic(this.Characteristic.LockCurrentState, this.currentState);

    this.targetState = this.currentState;
    this.accessoryService.updateCharacteristic(this.Characteristic.LockTargetState, this.targetState);

    if (this.currentState === this.Characteristic.LockCurrentState.JAMMED) {
      this.log.error(this.stringForState(this.currentState), this.name);
    } else {
      this.logIfDesired(this.stringForState(this.currentState), this.name);
    }
  }

  private async onTargetStateUpdate(topic: string, value: Primitive): Promise<void> {

    const target = this.targetStateFromValue(value);
    if (target === this.targetState) {
      return;
    }

    this.targetState = target;
    this.accessoryService.updateCharacteristic(this.Characteristic.LockTargetState, this.targetState);

    this.logIfDesired(this.stringForState(this.targetState, true), this.name);
  }

  private async setTargetState(value: CharacteristicValue) {

    if (!this.assert('topicSetTargetState')) {
      return;
    }

    const target = this.valueFromTargetState(value);
    if (target === undefined) {
      this.log.error(strings.lock.badTarget, this.name, value);
      return;
    }

    if (this.targetState !== value) {
      this.logIfDesired(this.stringForState(value, true), this.name);
    }

    this.targetState = value;

    this.accessoryService.updateCharacteristic(this.Characteristic.LockTargetState, this.targetState);

    this.publish(this.config.topicSetTargetState, target);
  }

  private valueFromTargetState(value: CharacteristicValue): Primitive | undefined {

    if (value === undefined || !this.assert('valueLockStateSecured', 'valueLockStateUnsecured')) {
      return undefined;
    }

    switch (value) {
    case this.Characteristic.LockTargetState.SECURED:
      return toPrimitive(this.config.valueLockStateSecured);
    case this.Characteristic.LockTargetState.UNSECURED:
      return toPrimitive(this.config.valueLockStateUnsecured);
    default:
      return undefined;
    }
  }

  private currentStateFromValue(value: Primitive | undefined): CharacteristicValue {

    if (value === undefined || !this.assert('valueLockStateSecured', 'valueLockStateUnsecured')) {
      return this.Characteristic.LockCurrentState.UNKNOWN;
    }

    switch (value) {
    case toPrimitive(this.config.valueLockStateSecured):
      return this.Characteristic.LockCurrentState.SECURED;
    case toPrimitive(this.config.valueLockStateUnsecured):
      return this.Characteristic.LockCurrentState.UNSECURED;
    case toPrimitive(this.config.valueLockStateJammed):
      return this.Characteristic.LockCurrentState.JAMMED;
    default:
      return this.Characteristic.LockCurrentState.UNKNOWN;
    }
  }

  private targetStateFromValue(value: Primitive | undefined): CharacteristicValue {

    if (value === undefined || !this.assert('valueLockStateSecured', 'valueLockStateUnsecured')) {
      return this.Characteristic.LockTargetState.SECURED;
    }

    switch (value) {
    case toPrimitive(this.config.valueLockStateUnsecured):
      return this.Characteristic.LockTargetState.UNSECURED;
    case toPrimitive(this.config.valueLockStateSecured):
    default:
      return this.Characteristic.LockTargetState.SECURED;
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
