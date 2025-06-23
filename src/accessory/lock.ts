import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import { makeHandler, MQTTAccessory, TopicHandler } from './base.js';

import { strings } from '../i18n/i18n.js';

import { LockConfig, Primitive } from '../model/types.js';

import { Log } from '../tools/log.js';

export class LockAccessory extends MQTTAccessory {
  private readonly accessoryService: Service;

  private active: CharacteristicValue | undefined = undefined;
  private current: CharacteristicValue | undefined = undefined;
  private target: CharacteristicValue | undefined = undefined;

  constructor(
    Service: typeof import('homebridge').Service,
    Characteristic: typeof import('homebridge').Characteristic,
    accessory: PlatformAccessory,
    private readonly config: LockConfig,
    log: Log,
  ) {

    super(Service, Characteristic, accessory, config, log, LockAccessory.name);

    this.accessoryService = accessory.getService(Service.LockMechanism) || accessory.addService(Service.LockMechanism);

    this.accessoryService.setCharacteristic(Characteristic.LockCurrentState, Characteristic.LockCurrentState.SECURED);

    this.accessoryService.getCharacteristic(Characteristic.LockCurrentState)
      .onGet(this.getCurrentState.bind(this));

    this.accessoryService.setCharacteristic(Characteristic.LockTargetState, Characteristic.LockTargetState.SECURED);

    this.accessoryService.getCharacteristic(Characteristic.LockTargetState)
      .onGet(this.getTargetState.bind(this))
      .onSet(this.setTargetState.bind(this));

    this.accessoryService.updateCharacteristic(Characteristic.StatusActive, false);
  }

  protected get topicHandlers(): TopicHandler[] {
    return [
      makeHandler(this.config.topicGetCurrent, this.onCurrentUpdate.bind(this)),
      makeHandler(this.config.topicGetTarget, this.onTargetUpdate.bind(this)),
      ...(this.config.topicGetStatus ? [makeHandler(this.config.topicGetStatus, this.onStatusUpdate.bind(this))]: []),
    ];
  }
  
  private async onStatusUpdate(topic: string, status: Primitive): Promise<void> {

    const active = status === this.config.valueActive;
    if (active === this.active) {
      return;
    }

    this.active = active;
    this.accessoryService.updateCharacteristic(this.Characteristic.StatusActive, this.active);

    if (this.active) {
      this.log.always(strings.lock.statusActive, this.config.info.name);
    } else {
      this.log.warning(strings.lock.statusInactive, this.config.info.name);
    }
  }

  private async onCurrentUpdate(topic: string, value: Primitive): Promise<void> {

    const current = this.stateFromValue(value);
    if (current === this.current) {
      return;
    }

    this.current = value;
    this.accessoryService.updateCharacteristic(this.Characteristic.LockCurrentState, this.current);

    this.log.ifVerbose(strings.lock.stateCurrent, this.config.info.name, this.stringForState(this.current));
  }

  private async onTargetUpdate(topic: string, value: Primitive): Promise<void> {

    const target = this.stateFromValue(value);
    if (target === this.target) {
      return;
    }

    this.target = target;
    this.accessoryService.updateCharacteristic(this.Characteristic.LockTargetState, this.target);

    this.log.ifVerbose(strings.lock.stateTarget, this.config.info.name, this.stringForState(this.target));
  }

  private async getCurrentState(): Promise<CharacteristicValue> {
    return this.current ?? this.Characteristic.LockCurrentState.UNKNOWN;
  }

  private async getTargetState(): Promise<CharacteristicValue> {
    return this.target ?? this.Characteristic.LockCurrentState.UNKNOWN;
  }

  private async setTargetState(value: CharacteristicValue) {

    const target = this.valueFromState(value);
    if (!target) {
      this.log.error(strings.lock.badTarget, value);
      return;
    }

    this.target = target;

    this.log.ifVerbose(strings.lock.stateSet, this.config.info.name, this.stringForState(this.target));

    this.accessoryService.updateCharacteristic(this.Characteristic.LockTargetState, this.stateFromValue(this.target));
    this.publish(this.config.topicSetTarget, this.target);
  }

  private valueFromState(value: CharacteristicValue): string | undefined {
    switch (value) {
    case this.Characteristic.LockTargetState.SECURED:
      return this.config.valueSecured;
    case this.Characteristic.LockTargetState.UNSECURED:
      return this.config.valueUnsecured;
    default:
      return undefined;
    }
  }

  private stateFromValue(value: Primitive | undefined): CharacteristicValue {

    if (!value) {
      return this.Characteristic.LockCurrentState.UNKNOWN;
    }

    switch (value) {
    case this.config.valueSecured:
      return this.Characteristic.LockCurrentState.SECURED;
    case this.config.valueUnsecured:
      return this.Characteristic.LockCurrentState.UNSECURED;
    case this.config.valueJammed:
      return this.Characteristic.LockCurrentState.JAMMED;
    default:
      return this.Characteristic.LockCurrentState.UNKNOWN;
    }
  }

  private stringForState(state: CharacteristicValue): string {
    switch(state) {      
    case this.config.valueSecured:
      return strings.lock.stateSecured;
    case this.config.valueUnsecured:
      return strings.lock.stateUnsecured;
    case this.config.valueJammed:
      return strings.lock.stateJammed;
    default:
      return strings.lock.stateUnknown;
    }
  }
}
