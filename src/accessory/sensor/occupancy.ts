import { SensorAccessory } from './sensor.js';

import { MQTTAccessoryDependency } from '../abstract/mqtt.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { OccupancySensorConfig } from '../../model/types.js';

export class OccupancySensorAccessory extends SensorAccessory<OccupancySensorConfig> {

  constructor(
    dependency: MQTTAccessoryDependency<OccupancySensorConfig>) {
    super(dependency);

    this.setup(CharacteristicKey.OccupancyDetected, dependency.Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED,
      'topicGetOccupancyDetected',
      this.bindOnUpdateNumericBoolean(
        CharacteristicKey.OccupancyDetected,
        'valueOccupancyDetected',
        strings.sensor.occupancy.active, strings.sensor.occupancy.inactive),
      true);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.OccupancySensor;
  }
}