import { PlatformAccessory, Service } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, HumiditySensorConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class HumiditySensorAccessory extends SensorAccessory<HumiditySensorConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: HumiditySensorConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log);

    this.setupCharacteristic(CharacteristicKey.CurrentRelativeHumidity, 0, 'topicGetCurrentRelativeHumidity',
      this.bindOnUpdateNumeric(CharacteristicKey.CurrentRelativeHumidity, strings.sensor.humidity.update), true);
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.HumiditySensor) || this.accessory.addService(this.Service.HumiditySensor);
  }
}