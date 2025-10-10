import { SensorAccessory } from './sensor.js';

import { MQTTAccessoryDependency } from '../abstract/mqtt.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { LeakSensorConfig } from '../../model/types.js';

export class LeakSensorAccessory extends SensorAccessory<LeakSensorConfig> {

  constructor(dependency: MQTTAccessoryDependency<LeakSensorConfig>) {
    super(dependency);

    this.setup(CharacteristicKey.LeakDetected, dependency.Characteristic.LeakDetected.LEAK_NOT_DETECTED,
      'topicGetLeakDetected',
      this.bindOnUpdateNumericBoolean(CharacteristicKey.LeakDetected, 'valueLeakDetected', strings.sensor.leak.active, strings.sensor.leak.inactive), true);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.LeakSensor;
  }
}