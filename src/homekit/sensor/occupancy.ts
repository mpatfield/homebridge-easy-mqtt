import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType } from '../../model/enums.js';
import { HKCharacteristicKey, MQTTAccessoryDependency } from '../../model/homekit.js';
import { OccupancySensorConfig } from '../../model/types.js';

export class OccupancySensorAccessory extends SensorAccessory<OccupancySensorConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.OccupancySensor;
  }

  constructor(
    dependency: MQTTAccessoryDependency<OccupancySensorConfig>) {
    super(dependency);

    this.setup(HKCharacteristicKey.OccupancyDetected, dependency.Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED,
      'topicGetOccupancyDetected',
      this.bindOnUpdateNumericBoolean(
        HKCharacteristicKey.OccupancyDetected,
        'valueOccupancyDetected',
        strings.sensor.occupancy.active, strings.sensor.occupancy.inactive,
        true),
      true);
  }
}