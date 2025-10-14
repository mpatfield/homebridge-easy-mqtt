import { CharacteristicValue } from 'homebridge';

import { PositionAccessory } from './position.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey } from '../../model/enums.js';
import { BlindConfig, MQTTAccessoryDependency } from '../../model/types.js';

export class BlindAccessory extends PositionAccessory<BlindConfig> {

  constructor(
    dependency: MQTTAccessoryDependency<BlindConfig>) {
    super(dependency);

    this.setup(HKCharacteristicKey.CurrentHorizontalTiltAngle, 0, 'topicGetCurrentHorizontalTiltAngle',
      this.bindOnUpdateNumeric(HKCharacteristicKey.CurrentHorizontalTiltAngle, strings.position.blind.currentHorizontal), false);

    this.setup(HKCharacteristicKey.CurrentVerticalTiltAngle, 0, 'topicGetCurrentVerticalTiltAngle',
      this.bindOnUpdateNumeric(HKCharacteristicKey.CurrentVerticalTiltAngle, strings.position.blind.currentVertical), false);

    this.setup(HKCharacteristicKey.TargetHorizontalTiltAngle, 0,
      'topicGetTargetHorizontalTiltAngle',
      this.bindOnUpdateNumeric(HKCharacteristicKey.TargetHorizontalTiltAngle, strings.position.blind.targetHorizontal), false,
      'topicSetTargetHorizontalTiltAngle',
      this.onSetTilt(HKCharacteristicKey.TargetHorizontalTiltAngle, 'topicSetTargetHorizontalTiltAngle', strings.position.blind.targetHorizontalSet));

    this.setup(HKCharacteristicKey.TargetVerticalTiltAngle, 0,
      'topicGetTargetVerticalTiltAngle',
      this.bindOnUpdateNumeric(HKCharacteristicKey.TargetVerticalTiltAngle, strings.position.blind.targetVertical), false,
      'topicSetTargetVerticalTiltAngle',
      this.onSetTilt(HKCharacteristicKey.TargetVerticalTiltAngle, 'topicSetTargetVerticalTiltAngle', strings.position.blind.targetVerticalSet));
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.WindowCovering;
  }

  private onSetTilt(key: HKCharacteristicKey, topic: keyof BlindConfig, logTemplate: string) {
    return (async (value: CharacteristicValue) => {
      const logString = logTemplate.replace('%d', value.toString());
      this.onSet(key, value, value as number, topic, logString);
    }).bind(this);
  }
}