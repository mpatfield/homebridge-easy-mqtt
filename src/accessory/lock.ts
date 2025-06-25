import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import { makeHandler, MQTTAccessory, TopicHandler } from './base.js';

import { strings } from '../i18n/i18n.js';

import { LockConfig, Primitive, toPrimitive } from '../model/types.js';

import { Log } from '../tools/log.js';

export class LockAccessory extends MQTTAccessory {
  private readonly accessoryService: Service;

  private active: CharacteristicValue;
  private current: CharacteristicValue;
  private target: CharacteristicValue;

  constructor(
    Service: typeof import('homebridge').Service,
    Characteristic: typeof import('homebridge').Characteristic,
    accessory: PlatformAccessory,
    private readonly config: LockConfig,
    log: Log,
  ) {
    super(Service, Characteristic, accessory, config, log, LockAccessory.name);

    this.accessoryService = accessory.getService(Service.LockMechanism) || accessory.addService(Service.LockMechanism);

    this.active = true;
    this.current = this.Characteristic.LockCurrentState.UNKNOWN;
    this.target = this.Characteristic.LockTargetState.SECURED;

    this.accessoryService.getCharacteristic(this.Characteristic.StatusActive)
      .onGet(this.getActive.bind(this));

    this.accessoryService.getCharacteristic(this.Characteristic.LockCurrentState)
      .onGet(this.getCurrentState.bind(this));

    this.accessoryService.getCharacteristic(this.Characteristic.LockTargetState)
      .onGet(this.getTargetState.bind(this))
      .onSet(this.setTargetState.bind(this));
  }

  protected get topicHandlers(): TopicHandler[] {

    if (!this.assert('topicGetCurrent', 'topicGetTarget')) {
      return [];
    }

    return [
      makeHandler(this.config.topicGetCurrent, this.onCurrentUpdate.bind(this)),
      makeHandler(this.config.topicGetTarget, this.onTargetUpdate.bind(this)),
      ...(this.config.topicGetActive ? [makeHandler(this.config.topicGetActive, this.onActiveUpdate.bind(this))]: []),
    ];
  }
  
  private async onActiveUpdate(topic: string, value: Primitive): Promise<void> {

    if (!this.assert('valueActive')) {
      return;
    }

    const active = value === toPrimitive(this.config.valueActive);
    if (active === this.active) {
      return;
    }

    this.active = active;
    this.accessoryService.updateCharacteristic(this.Characteristic.StatusActive, this.active);

    if (this.active) {
      this.logIfDesired(strings.accessory.statusActive, this.config.info.name);
    } else {
      this.log.warning(strings.accessory.statusInactive, this.config.info.name);
    }
  }

  private async onCurrentUpdate(topic: string, value: Primitive): Promise<void> {

    const current = this.currentStateFromValue(value);
    if (current === this.current) {
      return;
    }

    this.current = current;
    this.accessoryService.updateCharacteristic(this.Characteristic.LockCurrentState, this.current);

    if (this.current === this.Characteristic.LockCurrentState.JAMMED) {
      this.log.error(this.stringForState(this.current), this.config.info.name);
    } else {
      this.logIfDesired(this.stringForState(this.current), this.config.info.name);
    }
  }

  private async onTargetUpdate(topic: string, value: Primitive): Promise<void> {

    const target = this.targetStateFromValue(value);
    if (target === this.target) {
      return;
    }

    this.target = target;
    this.accessoryService.updateCharacteristic(this.Characteristic.LockTargetState, this.target);

    this.logIfDesired(this.stringForState(this.target, true), this.config.info.name);
  }

  private async getActive(): Promise<CharacteristicValue> {
    return this.active;
  }

  private async getCurrentState(): Promise<CharacteristicValue> {
    return this.current;
  }

  private async getTargetState(): Promise<CharacteristicValue> {
    return this.target;
  }

  private async setTargetState(value: CharacteristicValue) {

    if (!this.assert('topicSetTarget')) {
      return;
    }

    const target = this.valueFromState(value);
    if (target === undefined) {
      this.log.error(strings.lock.badTarget, this.config.info.name, value);
      return;
    }

    this.target = value;

    this.logIfDesired(this.stringForState(this.target, true), this.config.info.name);

    this.accessoryService.updateCharacteristic(this.Characteristic.LockTargetState, this.target);

    this.current = this.target;
    this.accessoryService.updateCharacteristic(this.Characteristic.LockCurrentState, this.current);

    this.publish(this.config.topicSetTarget, target);
  }

  private valueFromState(value: CharacteristicValue): Primitive | undefined {

    if (value === undefined || !this.assert('valueSecured', 'valueUnsecured')) {
      return undefined;
    }

    switch (value) {
    case this.Characteristic.LockTargetState.SECURED:
      return toPrimitive(this.config.valueSecured);
    case this.Characteristic.LockTargetState.UNSECURED:
      return toPrimitive(this.config.valueUnsecured);
    default:
      return undefined;
    }
  }

  private currentStateFromValue(value: Primitive | undefined): CharacteristicValue {

    if (value === undefined || !this.assert('valueSecured', 'valueUnsecured')) {
      return this.Characteristic.LockCurrentState.UNKNOWN;
    }

    switch (value) {
    case toPrimitive(this.config.valueSecured):
      return this.Characteristic.LockCurrentState.SECURED;
    case toPrimitive(this.config.valueUnsecured):
      return this.Characteristic.LockCurrentState.UNSECURED;
    case toPrimitive(this.config.valueJammed):
      return this.Characteristic.LockCurrentState.JAMMED;
    default:
      return this.Characteristic.LockCurrentState.UNKNOWN;
    }
  }

  private targetStateFromValue(value: Primitive | undefined): CharacteristicValue {

    if (value === undefined || !this.assert('valueSecured', 'valueUnsecured')) {
      return this.Characteristic.LockTargetState.SECURED;
    }

    switch (value) {
    case toPrimitive(this.config.valueUnsecured):
      return this.Characteristic.LockTargetState.UNSECURED;
    case toPrimitive(this.config.valueSecured):
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

  private logIfDesired(message: string, ...parameters: string[]) {

    if (this.config.disableLogging) {
      return;
    }

    this.log.always(message, ...parameters);
  }
}
