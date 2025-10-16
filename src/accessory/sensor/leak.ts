import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey } from '../../model/enums.js';
import { LeakSensorConfig, MQTTAccessoryDependency } from '../../model/types.js';

export class LeakSensorAccessory extends SensorAccessory<LeakSensorConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.LeakSensor;
  }

  constructor(dependency: MQTTAccessoryDependency<LeakSensorConfig>) {
    super(dependency);

    this.setup(HKCharacteristicKey.LeakDetected, dependency.Characteristic.LeakDetected.LEAK_NOT_DETECTED,
      'topicGetLeakDetected',
      this.bindOnUpdateNumericBoolean(HKCharacteristicKey.LeakDetected, 'valueLeakDetected', strings.sensor.leak.active, strings.sensor.leak.inactive), true);
  }
}