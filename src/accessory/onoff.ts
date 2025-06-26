import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import { makeHandler, MQTTAccessory, TopicHandler } from './base.js';

import { strings } from '../i18n/i18n.js';

import { CharacteristicType, OnOffConfig, Primitive, ServiceType, toPrimitive } from '../model/types.js';

import { Log } from '../tools/log.js';

export abstract class OnOffAccessory extends MQTTAccessory {
  protected readonly accessoryService: Service;

  private active: CharacteristicValue = true;
  private on: CharacteristicValue = false;

  constructor(
    Service: ServiceType,
    Characteristic: CharacteristicType,
    accessory: PlatformAccessory,
    private readonly config: OnOffConfig,
    log: Log,
    className: string,
  ) {
    super(Service, Characteristic, accessory, config, log, className);

    this.accessoryService = this.getAccessoryService();

    this.accessoryService.getCharacteristic(Characteristic.StatusActive)
      .onGet(this.getActive.bind(this));

    this.accessoryService.getCharacteristic(Characteristic.On)
      .onGet(this.getOn.bind(this))
      .onSet(this.setOn.bind(this));
  }

  protected abstract getAccessoryService(): Service;

  protected get topicHandlers(): TopicHandler[] {

    if (!this.assert('topicGetOn')) {
      return [];
    }

    return [
      makeHandler(this.config.topicGetOn, this.onStateUpdate.bind(this)),
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

  private async onStateUpdate(topic: string, value: Primitive): Promise<void> {

    if (!this.assert('valueOn')) {
      return;
    }

    const on = value === toPrimitive(this.config.valueOn);
    if (on === this.on) {
      return;
    }

    this.on = on;
    this.accessoryService.updateCharacteristic(this.Characteristic.On, this.on);

    this.logIfDesired(this.stringForState(this.on), this.config.info.name);
  }

  private async getActive(): Promise<CharacteristicValue> {
    return this.active;
  }

  private async getOn(): Promise<CharacteristicValue> {
    return this.on;
  }

  private async setOn(value: CharacteristicValue) {

    if (!this.assert('topicSetOn', 'valueOn', 'valueOff')) {
      return;
    }

    const on = value ? this.config.valueOn : this.config.valueOff;

    this.on = value;

    this.logIfDesired(this.stringForState(this.on, true), this.config.info.name);

    this.accessoryService.updateCharacteristic(this.Characteristic.On, this.on);

    this.publish(this.config.topicSetOn, on);
  }

  private stringForState(on: CharacteristicValue, future: boolean = false): string {
    if (on) {
      return future ? strings.onOff.stateFutureOn : strings.onOff.stateOn;
    } else {
      return future ? strings.onOff.stateFutureOff : strings.onOff.stateOff;
    }
  }

  protected logIfDesired(message: string, ...parameters: string[]) {

    if (this.config.disableLogging) {
      return;
    }

    this.log.always(message, ...parameters);
  }
}
