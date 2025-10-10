import { CharacteristicValue } from 'homebridge';

import { OnOffAccessory } from './onoff.js';

import { MQTTAccessoryDependency } from '../abstract/mqtt.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { LightbulbConfig } from '../../model/types.js';

export class LightbulbAccessory extends OnOffAccessory<LightbulbConfig> {

  constructor(dependency: MQTTAccessoryDependency<LightbulbConfig>) {
    super(dependency);

    if (!dependency.config.maximumBrightness || !this.assertType('number', 'maximumBrightness')) {
      dependency.config.maximumBrightness = 100;
    }

    const getLogString = dependency.config.maximumBrightness < 100 ? strings.lightbulb.brightnessValue : strings.lightbulb.brightnessPercent;
    const setLogString = dependency.config.maximumBrightness < 100 ? strings.lightbulb.brightnessValueFuture : strings.lightbulb.brightnessPercentFuture;

    this.setup(CharacteristicKey.Brightness, 100,
      'topicGetBrightness', this.bindOnUpdateNumeric(CharacteristicKey.Brightness, getLogString), false,
      'topicSetBrightness', this.onSetValue(CharacteristicKey.Brightness, 'topicSetBrightness', setLogString),
    )?.setProps({ maxValue: dependency.config.maximumBrightness });

    this.setup(CharacteristicKey.ColorTemperature, 500,
      'topicGetColorTemperature', this.bindOnUpdateNumeric(CharacteristicKey.ColorTemperature, strings.lightbulb.colorTemperature), false,
      'topicSetColorTemperature', this.onSetValue(CharacteristicKey.ColorTemperature, 'topicSetColorTemperature', strings.lightbulb.colorTemperatureFuture),
    );

    this.setup(CharacteristicKey.Hue, 0,
      'topicGetHue', this.bindOnUpdateNumeric(CharacteristicKey.Hue, strings.lightbulb.hue), false,
      'topicSetHue', this.onSetValue(CharacteristicKey.Hue, 'topicSetHue', strings.lightbulb.hueFuture),
    );

    this.setup(CharacteristicKey.Saturation, 100,
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