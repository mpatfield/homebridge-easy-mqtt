import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey } from '../../model/enums.js';
import { MQTTAccessoryDependency, OccupancySensorConfig } from '../../model/types.js';

export class OccupancySensorAccessory extends SensorAccessory<OccupancySensorConfig> {

  constructor(
    dependency: MQTTAccessoryDependency<OccupancySensorConfig>) {
    super(dependency);

    this.setup(HKCharacteristicKey.OccupancyDetected, dependency.Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED,
      'topicGetOccupancyDetected',
      this.bindOnUpdateNumericBoolean(
        HKCharacteristicKey.OccupancyDetected,
        'valueOccupancyDetected',
        strings.sensor.occupancy.active, strings.sensor.occupancy.inactive),
      true);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.OccupancySensor;
  }
}