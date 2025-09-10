import { PlatformAccessory, Service } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, OccupancySensorConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class OccupancySensorAccessory extends SensorAccessory<OccupancySensorConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: OccupancySensorConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log);

    this.setupCharacteristic(CharacteristicKey.OccupancyDetected, 0, 'topicGetOccupancyDetected',
      this.bindOnUpdateNumericBoolean(
        CharacteristicKey.OccupancyDetected,
        'valueOccupancyDetected',
        strings.sensor.occupancy.active, strings.sensor.occupancy.inactive),
      true);
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.OccupancySensor) || this.accessory.addService(this.Service.OccupancySensor);
  }
}