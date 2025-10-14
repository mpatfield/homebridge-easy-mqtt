import { CharacteristicValue } from 'homebridge';

import { PositionAccessory } from './position.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { BlindConfig, MQTTAccessoryDependency } from '../../model/types.js';

export class BlindAccessory extends PositionAccessory<BlindConfig> {

  constructor(
    dependency: MQTTAccessoryDependency<BlindConfig>) {
    super(dependency);

    this.setup(CharacteristicKey.CurrentHorizontalTiltAngle, 0, 'topicGetCurrentHorizontalTiltAngle',
      this.bindOnUpdateNumeric(CharacteristicKey.CurrentHorizontalTiltAngle, strings.position.blind.currentHorizontal), false);

    this.setup(CharacteristicKey.CurrentVerticalTiltAngle, 0, 'topicGetCurrentVerticalTiltAngle',
      this.bindOnUpdateNumeric(CharacteristicKey.CurrentVerticalTiltAngle, strings.position.blind.currentVertical), false);

    this.setup(CharacteristicKey.TargetHorizontalTiltAngle, 0,
      'topicGetTargetHorizontalTiltAngle',
      this.bindOnUpdateNumeric(CharacteristicKey.TargetHorizontalTiltAngle, strings.position.blind.targetHorizontal), false,
      'topicSetTargetHorizontalTiltAngle',
      this.onSetTilt(CharacteristicKey.TargetHorizontalTiltAngle, 'topicSetTargetHorizontalTiltAngle', strings.position.blind.targetHorizontalSet));

    this.setup(CharacteristicKey.TargetVerticalTiltAngle, 0,
      'topicGetTargetVerticalTiltAngle',
      this.bindOnUpdateNumeric(CharacteristicKey.TargetVerticalTiltAngle, strings.position.blind.targetVertical), false,
      'topicSetTargetVerticalTiltAngle',
      this.onSetTilt(CharacteristicKey.TargetVerticalTiltAngle, 'topicSetTargetVerticalTiltAngle', strings.position.blind.targetVerticalSet));
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.WindowCovering;
  }

  private onSetTilt(key: CharacteristicKey, topic: keyof BlindConfig, logTemplate: string) {
    return (async (value: CharacteristicValue) => {
      const logString = logTemplate.replace('%d', value.toString());
      this.onSet(key, value, value as number, topic, logString);
    }).bind(this);
  }
}