import { SensorAccessory } from './sensor.js';

import { MQTTAccessoryDependency } from '../abstract/mqtt.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { MotionSensorConfig } from '../../model/types.js';

export class MotionSensorAccessory extends SensorAccessory<MotionSensorConfig> {

  constructor(
    dependency: MQTTAccessoryDependency<MotionSensorConfig>) {
    super(dependency);

    this.setup(CharacteristicKey.MotionDetected, false,
      'topicGetMotionDetected',
      this.bindOnUpdateNumericBoolean(CharacteristicKey.MotionDetected, 'valueMotionDetected', strings.sensor.motion.active, strings.sensor.motion.inactive),
      true);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.MotionSensor;
  }
}