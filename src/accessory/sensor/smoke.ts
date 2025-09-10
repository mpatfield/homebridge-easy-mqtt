import { PlatformAccessory, Service } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, SmokeSensorConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class SmokeSensorAccessory extends SensorAccessory<SmokeSensorConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: SmokeSensorConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log);

    this.setupCharacteristic(CharacteristicKey.SmokeDetected, 0, 'topicGetSmokeDetected',
      this.bindOnUpdateNumericBoolean(
        CharacteristicKey.SmokeDetected,
        'valueSmokeDetected',
        strings.sensor.smoke.active, strings.sensor.smoke.inactive),
      true);
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.SmokeSensor) || this.accessory.addService(this.Service.SmokeSensor);
  }
}