import { PlatformAccessory } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, ServiceType, TemperatureSensorConfig } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class TemperatureSensorAccessory extends SensorAccessory<TemperatureSensorConfig> {

  constructor(
    Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: TemperatureSensorConfig, log: Log, isGrouped: boolean) {
    super(Service, Characteristic, accessory, config, log, isGrouped);

    this.setupCharacteristic(CharacteristicKey.CurrentTemperature, 0, 'topicGetCurrentTemperature',
      this.bindTemperatureUpdate(config, CharacteristicKey.CurrentTemperature, strings.climate.temperatureUpdate), true);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.TemperatureSensor;
  }
}
