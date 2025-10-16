import { OnOffAccessory } from './onoff.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey } from '../../model/enums.js';
import { LightbulbConfig, MQTTAccessoryDependency } from '../../model/types.js';

export class LightbulbAccessory extends OnOffAccessory<LightbulbConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.Lightbulb;
  }

  constructor(dependency: MQTTAccessoryDependency<LightbulbConfig>) {
    super(dependency);

    if (!dependency.config.maximumBrightness || !this.assertType('number', 'maximumBrightness')) {
      dependency.config.maximumBrightness = 100;
    }

    const getLogString = dependency.config.maximumBrightness < 100 ? strings.lightbulb.brightnessValue : strings.lightbulb.brightnessPercent;
    const setLogString = dependency.config.maximumBrightness < 100 ? strings.lightbulb.brightnessValueFuture : strings.lightbulb.brightnessPercentFuture;

    this.setup(HKCharacteristicKey.Brightness, 100,
      'topicGetBrightness', this.bindOnUpdateNumeric(HKCharacteristicKey.Brightness, getLogString), false,
      'topicSetBrightness', this.bindOnSetNumeric(HKCharacteristicKey.Brightness, 'topicSetBrightness', setLogString),
    )?.setProps({ maxValue: dependency.config.maximumBrightness });

    this.setup(HKCharacteristicKey.ColorTemperature, 500,
      'topicGetColorTemperature',
      this.bindOnUpdateNumeric(HKCharacteristicKey.ColorTemperature, strings.lightbulb.colorTemperature),
      false,
      'topicSetColorTemperature',
      this.bindOnSetNumeric(HKCharacteristicKey.ColorTemperature, 'topicSetColorTemperature', strings.lightbulb.colorTemperatureFuture),
    );

    this.setup(HKCharacteristicKey.Hue, 0,
      'topicGetHue', this.bindOnUpdateNumeric(HKCharacteristicKey.Hue, strings.lightbulb.hue), false,
      'topicSetHue', this.bindOnSetNumeric(HKCharacteristicKey.Hue, 'topicSetHue', strings.lightbulb.hueFuture),
    );

    this.setup(HKCharacteristicKey.Saturation, 100,
      'topicGetSaturation', this.bindOnUpdateNumeric(HKCharacteristicKey.Saturation, strings.lightbulb.saturation), false,
      'topicSetSaturation', this.bindOnSetNumeric(HKCharacteristicKey.Saturation, 'topicSetSaturation', strings.lightbulb.saturationFuture),
    );
  }
}