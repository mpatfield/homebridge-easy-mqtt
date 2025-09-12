import { CharacteristicValue, PlatformAccessory } from 'homebridge';

import { OnOffAccessory } from './onoff.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, LightbulbConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class LightbulbAccessory extends OnOffAccessory<LightbulbConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: LightbulbConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log);

    this.setupCharacteristic(CharacteristicKey.Brightness, 100,
      'topicGetBrightness', this.bindOnUpdateNumeric(CharacteristicKey.Brightness, strings.lightbulb.brightness), false,
      'topicSetBrightness', this.onSetValue(CharacteristicKey.Brightness, 'topicSetBrightness', strings.lightbulb.brightnessFuture),
    );

    this.setupCharacteristic(CharacteristicKey.ColorTemperature, 500,
      'topicGetColorTemperature', this.bindOnUpdateNumeric(CharacteristicKey.ColorTemperature, strings.lightbulb.colorTemperature), false,
      'topicSetColorTemperature', this.onSetValue(CharacteristicKey.ColorTemperature, 'topicSetColorTemperature', strings.lightbulb.colorTemperatureFuture),
    );

    this.setupCharacteristic(CharacteristicKey.Hue, 0,
      'topicGetHue', this.bindOnUpdateNumeric(CharacteristicKey.Hue, strings.lightbulb.hue), false,
      'topicSetHue', this.onSetValue(CharacteristicKey.Hue, 'topicSetHue', strings.lightbulb.hueFuture),
    );

    this.setupCharacteristic(CharacteristicKey.Saturation, 100,
      'topicGetSaturation', this.bindOnUpdateNumeric(CharacteristicKey.Saturation, strings.lightbulb.saturation), false,
      'topicSetSaturation', this.onSetValue(CharacteristicKey.Saturation, 'topicSetSaturation', strings.lightbulb.saturationFuture),
    );
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.Lightbulb;
  }

  private onSetValue(key: CharacteristicKey, topic: keyof LightbulbConfig, logTemplate: string) {
    return (async (value: CharacteristicValue) => {
      const logString = logTemplate.replace('%d', value.toString());
      this.onSet(key, value, value as number, topic, logString);
    }).bind(this);
  }
}