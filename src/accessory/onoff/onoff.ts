import { CharacteristicValue, PlatformAccessory } from 'homebridge';

import { makeHandler, TopicHandler } from '../abstract/base.js';
import { StatusActiveAccessory } from '../abstract/statusActive.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicType, OnOffConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';
import { Primitive, toPrimitive } from '../../tools/primitive.js';

export abstract class OnOffAccessory extends StatusActiveAccessory {

  private on: CharacteristicValue = false;

  constructor(
    Service: ServiceType,
    Characteristic: CharacteristicType,
    accessory: PlatformAccessory,
    private readonly onOffConfig: OnOffConfig,
    log: Log,
    className: string,
  ) {
    super(Service, Characteristic, accessory, onOffConfig, log, className);

    this.accessoryService.getCharacteristic(Characteristic.On)
      .onGet(this.getOn.bind(this))
      .onSet(this.setOn.bind(this));
  }

  protected get topicHandlers(): TopicHandler[] {
    const topicHandlers = super.topicHandlers;

    if (!this.assert('topicGetOn')) {
      return topicHandlers;
    }

    topicHandlers.push(makeHandler(this.onOffConfig.topicGetOn, this.onOnUpdate.bind(this)));

    return topicHandlers;
  }


  private async onOnUpdate(topic: string, value: Primitive): Promise<void> {

    if (!this.assert('valueOn')) {
      return;
    }

    const on = value === toPrimitive(this.onOffConfig.valueOn);
    if (on === this.on) {
      return;
    }

    this.on = on;
    this.accessoryService.updateCharacteristic(this.Characteristic.On, this.on);

    this.logIfDesired(this.stringForState(this.on), this.name);
  }

  private async getOn(): Promise<CharacteristicValue> {
    return this.on;
  }

  private async setOn(value: CharacteristicValue) {

    if (!this.assert('topicSetOn', 'valueOn', 'valueOff')) {
      return;
    }

    const on = value ? this.onOffConfig.valueOn : this.onOffConfig.valueOff;

    this.on = value;

    this.logIfDesired(this.stringForState(this.on, true), this.name);

    this.accessoryService.updateCharacteristic(this.Characteristic.On, this.on);

    this.publish(this.onOffConfig.topicSetOn, on);
  }

  private stringForState(on: CharacteristicValue, future: boolean = false): string {
    if (on) {
      return future ? strings.onOff.stateFutureOn : strings.onOff.stateOn;
    } else {
      return future ? strings.onOff.stateFutureOff : strings.onOff.stateOff;
    }
  }
}
