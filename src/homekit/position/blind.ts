import { PositionAccessory } from './position.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey } from '../../model/enums.js';
import { BlindConfig, MQTTAccessoryDependency } from '../../model/types.js';

export class BlindAccessory extends PositionAccessory<BlindConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.WindowCovering;
  }

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
      this.bindOnSetNumeric(HKCharacteristicKey.TargetHorizontalTiltAngle, 'topicSetTargetHorizontalTiltAngle',
        strings.position.blind.targetHorizontalSet, true));

    this.setup(HKCharacteristicKey.TargetVerticalTiltAngle, 0,
      'topicGetTargetVerticalTiltAngle',
      this.bindOnUpdateNumeric(HKCharacteristicKey.TargetVerticalTiltAngle, strings.position.blind.targetVertical), false,
      'topicSetTargetVerticalTiltAngle',
      this.bindOnSetNumeric(HKCharacteristicKey.TargetVerticalTiltAngle, 'topicSetTargetVerticalTiltAngle',
        strings.position.blind.targetVerticalSet, true));
  }
}