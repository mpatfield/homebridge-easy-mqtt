import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import { makeHandler, TopicHandler } from '../abstract/base.js';
import { OnOffAccessory } from './onoff.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicType, LightbulbConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';
import { Primitive, toPrimitive } from '../../tools/primitive.js';

type PropertyKey = 'brightness' | 'hue' | 'colorTemperature' | 'saturation';
type CharacteristicKey = 'Brightness' | 'Hue' | 'ColorTemperature' | 'Saturation';
type TopicSetKey = 'topicSetBrightness' | 'topicSetHue' | 'topicSetColorTemperature' | 'topicSetSaturation';

export class LightbulbAccessory extends OnOffAccessory<LightbulbConfig> {

  private brightness: CharacteristicValue = 100;
  private hue: CharacteristicValue = 0;
  private colorTemperature: CharacteristicValue = 500;
  private saturation: CharacteristicValue = 100;

  constructor(
    Service: ServiceType,
    Characteristic: CharacteristicType,
    accessory: PlatformAccessory,
    config: LightbulbConfig,
    log: Log,
  ) {
    super(Service, Characteristic, accessory, config, log, LightbulbAccessory.name);

    this.accessoryService.getCharacteristic(this.Characteristic.Brightness)
      .onGet(this.getBrightness.bind(this))
      .onSet(this.setBrightness.bind(this));

    this.accessoryService.getCharacteristic(this.Characteristic.Hue)
      .onGet(this.getHue.bind(this))
      .onSet(this.setHue.bind(this));

    this.accessoryService.getCharacteristic(this.Characteristic.ColorTemperature)
      .onGet(this.getColorTemperature.bind(this))
      .onSet(this.setColorTemperature.bind(this));

    this.accessoryService.getCharacteristic(this.Characteristic.Saturation)
      .onGet(this.getSaturation.bind(this))
      .onSet(this.setSaturation.bind(this));
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.Lightbulb) || this.accessory.addService(this.Service.Lightbulb);
  }

  override get topicHandlers(): TopicHandler[] {
    const topicHandlers = super.topicHandlers;

    if (this.config.topicGetBrightness) {
      topicHandlers.push(makeHandler(this.config.topicGetBrightness, this.onBrightnessUpdate.bind(this)));
    }

    if (this.config.topicGetHue) {
      topicHandlers.push(makeHandler(this.config.topicGetHue, this.onHueUpdate.bind(this)));
    }

    if (this.config.topicGetColorTemperature) {
      topicHandlers.push(makeHandler(this.config.topicGetColorTemperature, this.onColorTemperatureUpdate.bind(this)));
    }

    if (this.config.topicGetSaturation) {
      topicHandlers.push(makeHandler(this.config.topicGetSaturation, this.onSaturationUpdate.bind(this)));
    }

    return topicHandlers;
  }

  private async getBrightness(): Promise<CharacteristicValue> {
    return this.brightness;
  }

  private async getHue(): Promise<CharacteristicValue> {
    return this.hue;
  }

  private async getColorTemperature(): Promise<CharacteristicValue> {
    return this.colorTemperature;
  }

  private async getSaturation(): Promise<CharacteristicValue> {
    return this.saturation;
  }

  private async onBrightnessUpdate(topic: string, value: Primitive): Promise<void> {
    this._onUpdate('brightness', value, strings.lightbulb.brightness);
  }

  private async setBrightness(value: CharacteristicValue) {
    this._set('topicSetBrightness', 'brightness', value, strings.lightbulb.futureBrightness);
  }

  private async onHueUpdate(topic: string, value: Primitive): Promise<void> {
    this._onUpdate('hue', value, strings.lightbulb.hue);
  }

  private async setHue(value: CharacteristicValue) {
    this._set('topicSetHue', 'hue', value, strings.lightbulb.futureHue);
  }

  private async onColorTemperatureUpdate(topic: string, value: Primitive): Promise<void> {
    this._onUpdate('colorTemperature', value, strings.lightbulb.colorTemperature);
  }

  private async setColorTemperature(value: CharacteristicValue) {
    this._set('topicSetColorTemperature', 'colorTemperature', value, strings.lightbulb.futureColorTemperature);
  }

  private async onSaturationUpdate(topic: string, value: Primitive): Promise<void> {
    this._onUpdate('saturation', value, strings.lightbulb.saturation);
  }

  private async setSaturation(value: CharacteristicValue) {
    this._set('topicSetSaturation', 'saturation', value, strings.lightbulb.futureSaturation);
  }

  private async _onUpdate(propertyKey: PropertyKey, value: Primitive, logString: string) {

    if (value === this[propertyKey as keyof this]) {
      return;
    }

    this[propertyKey] = value;

    const characteristicKey = this.toCharacteristicKey(propertyKey);
    this.accessoryService.updateCharacteristic(this.Characteristic[characteristicKey], value);

    this.logIfDesired(logString, this.name, value.toString());
  }

  private _set(topic: TopicSetKey, propertyKey: PropertyKey, value: CharacteristicValue, logString: string) {

    if (!this.assert(topic)) {
      return;
    }

    this[propertyKey] = value;

    this.logIfDesired(logString, this.name, value.toString());

    const characteristicKey = this.toCharacteristicKey(propertyKey);
    this.accessoryService.updateCharacteristic(this.Characteristic[characteristicKey], value);

    this.publish(this.config[topic]!, toPrimitive(value));
  }

  private toCharacteristicKey(key: PropertyKey): CharacteristicKey {
    const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
    return capitalized as CharacteristicKey;
  }
}