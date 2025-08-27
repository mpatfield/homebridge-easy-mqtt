import { CharacteristicValue, PlatformAccessory, PrimitiveTypes, Service } from 'homebridge';

import { OnOffAccessory } from './onoff.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicType, LightbulbConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';
import { CharacteristicKey } from '../../model/enums.js';

export class LightbulbAccessory extends OnOffAccessory<LightbulbConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: LightbulbConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log, LightbulbAccessory.name);

    this.set(CharacteristicKey.Brightness, 100);
    this.set(CharacteristicKey.ColorTemperature, 500);
    this.set(CharacteristicKey.Hue, 0);
    this.set(CharacteristicKey.Saturation, 100);

    this.accessoryService.getCharacteristic(this.Characteristic.Brightness)
      .onGet(this.getBrightness.bind(this))
      .onSet(this.onSetBrightness.bind(this));

    this.accessoryService.getCharacteristic(this.Characteristic.ColorTemperature)
      .onGet(this.getColorTemperature.bind(this))
      .onSet(this.onSetColorTemperature.bind(this));

    this.accessoryService.getCharacteristic(this.Characteristic.Hue)
      .onGet(this.getHue.bind(this))
      .onSet(this.onSetHue.bind(this));

    this.accessoryService.getCharacteristic(this.Characteristic.Saturation)
      .onGet(this.getSaturation.bind(this))
      .onSet(this.onSetSaturation.bind(this));
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.Lightbulb) || this.accessory.addService(this.Service.Lightbulb);
  }

  override addTopicHandlers(): void {
    super.addTopicHandlers();
    this.addTopicHandler('topicGetBrightness', this.onBrightnessUpdate.bind(this), false);
    this.addTopicHandler('topicGetColorTemperature', this.onColorTemperatureUpdate.bind(this), false);
    this.addTopicHandler('topicGetHue', this.onHueUpdate.bind(this), false);
    this.addTopicHandler('topicGetSaturation', this.onSaturationUpdate.bind(this), false);
  }

  private async getBrightness(): Promise<CharacteristicValue> {
    return this.get(CharacteristicKey.Brightness);
  }

  private async onBrightnessUpdate(topic: string, value: PrimitiveTypes): Promise<void> {
    this.onUpdate(CharacteristicKey.Brightness, value, strings.lightbulb.brightness);
  }

  private async onSetBrightness(value: CharacteristicValue) {
    this.onSet(CharacteristicKey.Brightness, value, 'topicSetBrightness', strings.lightbulb.futureBrightness);
  }

  private async getColorTemperature(): Promise<CharacteristicValue> {
    return this.get(CharacteristicKey.ColorTemperature);
  }

  private async onColorTemperatureUpdate(topic: string, value: PrimitiveTypes): Promise<void> {
    this.onUpdate(CharacteristicKey.ColorTemperature, value, strings.lightbulb.colorTemperature);
  }

  private async onSetColorTemperature(value: CharacteristicValue) {
    this.onSet(CharacteristicKey.ColorTemperature, value, 'topicSetColorTemperature', strings.lightbulb.futureColorTemperature);
  }

  private async getHue(): Promise<CharacteristicValue> {
    return this.get(CharacteristicKey.Hue);
  }

  private async onHueUpdate(topic: string, value: PrimitiveTypes): Promise<void> {
    this.onUpdate(CharacteristicKey.Hue, value, strings.lightbulb.hue);
  }

  private async onSetHue(value: CharacteristicValue) {
    this.onSet(CharacteristicKey.Hue, value, 'topicSetHue', strings.lightbulb.futureHue);
  }

  private async getSaturation(): Promise<CharacteristicValue> {
    return this.get(CharacteristicKey.Saturation);
  }

  private async onSaturationUpdate(topic: string, value: PrimitiveTypes): Promise<void> {
    this.onUpdate(CharacteristicKey.Saturation, value, strings.lightbulb.saturation);
  }

  private async onSetSaturation(value: CharacteristicValue) {
    this.onSet(CharacteristicKey.Saturation, value, 'topicSetSaturation', strings.lightbulb.futureSaturation);
  }
}