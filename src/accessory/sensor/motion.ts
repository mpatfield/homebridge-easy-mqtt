import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey } from '../../model/enums.js';
import { HistoryType } from '../../model/history.js';
import { MotionSensorConfig, MQTTAccessoryDependency } from '../../model/types.js';

export class MotionSensorAccessory extends SensorAccessory<MotionSensorConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.MotionSensor;
  }

  constructor(
    dependency: MQTTAccessoryDependency<MotionSensorConfig>) {
    super(dependency);

    this.setup(HKCharacteristicKey.MotionDetected, false,
      'topicGetMotionDetected',
      this.bindOnUpdateNumericBoolean(HKCharacteristicKey.MotionDetected, 'valueMotionDetected', strings.sensor.motion.active, strings.sensor.motion.inactive,
        (value) => {
          this.recordHistory(HistoryType.MOTION, { status: value }, true);
        },
      ),
      true);
  }
}