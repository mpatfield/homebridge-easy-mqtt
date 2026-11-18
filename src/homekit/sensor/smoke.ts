import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { HKAccessoryType, HKCharacteristicKey, MQTTAccessoryDependency } from '../../model/homekit.js';
import { SmokeSensorConfig } from '../../model/types.js';

export class SmokeSensorAccessory extends SensorAccessory<SmokeSensorConfig> {

  protected getAccessoryType(): HKAccessoryType {
    return HKAccessoryType.SmokeSensor;
  }

  constructor(dependency: MQTTAccessoryDependency<SmokeSensorConfig>) {
    super(dependency);

    this.setup(HKCharacteristicKey.SmokeDetected, dependency.Characteristic.SmokeDetected.SMOKE_NOT_DETECTED,
      'topicGetSmokeDetected',
      this.bindOnUpdateNumericBoolean(HKCharacteristicKey.SmokeDetected, 'valueSmokeDetected',
        strings.sensor.smoke.active, strings.sensor.smoke.inactive, true),
      true);
  }
}