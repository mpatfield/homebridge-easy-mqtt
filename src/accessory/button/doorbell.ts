import { ButtonAccessory } from './button.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey } from '../../model/enums.js';
import { DoorbellConfig, MQTTAccessoryDependency } from '../../model/types.js';

export class DoorbellAccessory extends ButtonAccessory<DoorbellConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.Doorbell;
  }

  constructor(dependency: MQTTAccessoryDependency<DoorbellConfig>) {
    super(dependency);

    if (!dependency.config.maximumBrightness || !this.assertType('number', 'maximumBrightness')) {
      dependency.config.maximumBrightness = 100;
    }

    if (!dependency.config.maximumVolume || !this.assertType('number', 'maximumVolume')) {
      dependency.config.maximumVolume = 100;
    }

    const brightnessGetTemplate = dependency.config.maximumBrightness < 100 ? strings.doorbell.brightnessValue : strings.doorbell.brightnessPercent;
    const brightnessSetTemplate = dependency.config.maximumBrightness < 100 ? strings.doorbell.brightnessValueFuture : strings.doorbell.brightnessPercentFuture;

    this.setup(HKCharacteristicKey.Brightness, dependency.config.maximumBrightness,
      'topicGetBrightness',
      this.bindOnUpdateNumeric(HKCharacteristicKey.Brightness, brightnessGetTemplate), false,
      'topicSetBrightness',
      this.bindOnSetNumeric(HKCharacteristicKey.Brightness, 'topicSetBrightness', brightnessSetTemplate),
    )?.setProps({ maxValue: dependency.config.maximumBrightness });

    this.setup(HKCharacteristicKey.Mute, true,
      'topicGetMuted',
      this.bindOnUpdateBoolean(HKCharacteristicKey.Mute, 'valueMuted', 'valueUnmuted', strings.doorbell.muted, strings.doorbell.unmuted),
      false,
      'topicSetMuted',
      this.bindOnSetBoolean(HKCharacteristicKey.Mute, 'topicSetMuted', 'valueMuted', 'valueUnmuted',
        true, strings.doorbell.mutedFuture, strings.doorbell.unmutedFuture),
    );

    const volumeGetTemplate = dependency.config.maximumVolume < 100 ? strings.doorbell.volumeValue : strings.doorbell.volumePercent;
    const volumeSetTemplate = dependency.config.maximumVolume < 100 ? strings.doorbell.volumeValueFuture : strings.doorbell.volumePercentFuture;

    this.setup(HKCharacteristicKey.Volume, dependency.config.maximumVolume,
      'topicGetVolume',
      this.bindOnUpdateNumeric(HKCharacteristicKey.Volume, volumeGetTemplate), false,
      'topicSetVolume',
      this.bindOnSetNumeric(HKCharacteristicKey.Volume, 'topicSetVolume', volumeSetTemplate),
    )?.setProps({ maxValue: dependency.config.maximumVolume });
  }
}