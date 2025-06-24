import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import { makeHandler, MQTTAccessory, TopicHandler } from './base.js';

import { strings } from '../i18n/i18n.js';

import { SwitchConfig, Primitive, toPrimitive } from '../model/types.js';

import { Log } from '../tools/log.js';

export class SwitchAccessory extends MQTTAccessory {
  private readonly accessoryService: Service;

  private active: CharacteristicValue;
  private on: CharacteristicValue;

  constructor(
    Service: typeof import('homebridge').Service,
    Characteristic: typeof import('homebridge').Characteristic,
    accessory: PlatformAccessory,
    private readonly config: SwitchConfig,
    log: Log,
  ) {
    super(Service, Characteristic, accessory, config, log, SwitchAccessory.name);

    this.accessoryService = accessory.getService(Service.Switch) || accessory.addService(Service.Switch);

    this.active = true;
    this.on = false;

    this.accessoryService.getCharacteristic(this.Characteristic.StatusActive)
      .onGet(this.getActive.bind(this));

    this.accessoryService.getCharacteristic(this.Characteristic.On)
      .onGet(this.getOn.bind(this))
      .onSet(this.setOn.bind(this));
  }

  protected get topicHandlers(): TopicHandler[] {

    if (!this.require(this.config, 'topicGetOn')) {
      return [];
    }

    return [
      makeHandler(this.config.topicGetOn, this.onStateUpdate.bind(this)),
      ...(this.config.topicGetActive ? [makeHandler(this.config.topicGetActive, this.onActiveUpdate.bind(this))]: []),
    ];
  }
  
  private async onActiveUpdate(topic: string, value: Primitive): Promise<void> {

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

    if (!this.require(this.config, 'valueOn')) {
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

    if (!this.require(this.config, 'topicSetOn', 'valueOn', 'valueOff')) {
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
      return future ? strings.switch.stateFutureOn : strings.switch.stateOn;
    } else {
      return future ? strings.switch.stateFutureOff : strings.switch.stateOff;
    }
  }

  private logIfDesired(message: string, ...parameters: string[]) {

    if (this.config.disableLogging) {
      return;
    }

    this.log.always(message, ...parameters);
  }
}
