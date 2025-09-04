import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import { OnOffAccessory } from './onoff.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicType, LightbulbConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';
import { CharacteristicKey } from '../../model/enums.js';

export class LightbulbAccessory extends OnOffAccessory<LightbulbConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: LightbulbConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log);

    this.setup(CharacteristicKey.Brightness, 100,
      'topicGetBrightness', this.onUpdateNumeric(CharacteristicKey.Brightness, strings.lightbulb.brightness), false,
      'topicSetBrightness', this.onSetValue(CharacteristicKey.Brightness, 'topicSetBrightness', strings.lightbulb.futureBrightness),
    );

    this.setup(CharacteristicKey.ColorTemperature, 500,
      'topicGetColorTemperature', this.onUpdateNumeric(CharacteristicKey.ColorTemperature, strings.lightbulb.colorTemperature), false,
      'topicSetColorTemperature', this.onSetValue(CharacteristicKey.ColorTemperature, 'topicSetColorTemperature', strings.lightbulb.futureColorTemperature),
    );

    this.setup(CharacteristicKey.Hue, 0,
      'topicGetHue', this.onUpdateNumeric(CharacteristicKey.Hue, strings.lightbulb.hue), false,
      'topicSetHue', this.onSetValue(CharacteristicKey.Hue, 'topicSetHue', strings.lightbulb.futureHue),
    );

    this.setup(CharacteristicKey.Saturation, 100,
      'topicGetSaturation', this.onUpdateNumeric(CharacteristicKey.Saturation, strings.lightbulb.saturation), false,
      'topicSetSaturation', this.onSetValue(CharacteristicKey.Saturation, 'topicSetSaturation', strings.lightbulb.futureSaturation),
    );
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.Lightbulb) || this.accessory.addService(this.Service.Lightbulb);
  }

  private onSetValue(key: CharacteristicKey, topic: keyof LightbulbConfig, logTemplate: string) {
    return (async (value: CharacteristicValue) => {
      const logString = logTemplate.replace('%d', value.toString());
      this.onSet(key, value, value as number, topic, logString);
    }).bind(this);
  }
}