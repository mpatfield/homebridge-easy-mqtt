import { PlatformAccessory, Service } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, LeakSensorConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class LeakSensorAccessory extends SensorAccessory<LeakSensorConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: LeakSensorConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log);

    this.setupCharacteristic(CharacteristicKey.LeakDetected, 0, 'topicGetLeakDetected',
      this.bindOnUpdateNumericBoolean(
        CharacteristicKey.LeakDetected,
        'valueLeakDetected',
        strings.sensor.leak.active, strings.sensor.leak.inactive),
      true);
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.LeakSensor) || this.accessory.addService(this.Service.LeakSensor);
  }
}