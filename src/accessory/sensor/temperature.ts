import { PlatformAccessory, PrimitiveTypes, Service } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicType, ServiceType, TemperatureSensorConfig } from '../../model/types.js';

import { Log } from '../../tools/log.js';
import { toNumber } from '../../tools/primitive.js';
import { toCelsius } from '../../tools/temperature.js';
import { CharacteristicKey, TemperatureUnits } from '../../model/enums.js';

export class TemperatureSensorAccessory extends SensorAccessory<TemperatureSensorConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: TemperatureSensorConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log);

    this.setupCharacteristic(CharacteristicKey.CurrentTemperature, 0, 'topicGetCurrentTemperature', this.onCurrentTemperatureUpdate.bind(this), true);
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.TemperatureSensor) || this.accessory.addService(this.Service.TemperatureSensor);
  }

  private async onCurrentTemperatureUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    if (typeof value !== 'number') {
      this.log.error(strings.sensor.temperature.badValue, this.name, `'${value}'`);
      return;
    }

    const units = this.config.temperatureUnits ?? TemperatureUnits.CELSIUS;
    const temperature = toCelsius(toNumber(value), units);

    this.onUpdate(CharacteristicKey.CurrentTemperature, temperature);

    this.logIfDesired(strings.sensor.temperature.update, value.toString(), units);
  }
}
