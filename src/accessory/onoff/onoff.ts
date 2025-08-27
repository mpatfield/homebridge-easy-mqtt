import { CharacteristicValue, PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { makeHandler, TopicHandler } from '../abstract/base.js';
import { StatusActiveAccessory } from '../abstract/statusActive.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicType, OnOffConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';
import { toPrimitive } from '../../tools/primitive.js';

export abstract class OnOffAccessory<C extends OnOffConfig = OnOffConfig> extends StatusActiveAccessory<C> {

  private on: CharacteristicValue = false;

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: C, log: Log, className: string) {
    super(Service, Characteristic, accessory, config, log, className);

    this.accessoryService.getCharacteristic(Characteristic.On)
      .onGet(this.getOn.bind(this))
      .onSet(this.setOn.bind(this));
  }

  override get topicHandlers(): TopicHandler[] {
    const topicHandlers = super.topicHandlers;

    if (!this.assert('topicGetOn')) {
      return topicHandlers;
    }

    topicHandlers.push(makeHandler(this.config.topicGetOn, this.onOnUpdate.bind(this)));

    return topicHandlers;
  }


  private async onOnUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    if (!this.assert('valueOn')) {
      return;
    }

    const on = value === toPrimitive(this.config.valueOn);
    if (on === this.on) {
      return;
    }

    this.on = on;
    this.accessoryService.updateCharacteristic(this.Characteristic.On, this.on);

    this.logIfDesired(this.stringForState(this.on));
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

    this.logIfDesired(this.stringForState(this.on, true));

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
}
