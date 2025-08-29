import { CharacteristicValue, PlatformAccessory, PrimitiveTypes, Service } from 'homebridge';

import { BaseAccessory } from './abstract/base.js';

import { strings } from '../i18n/i18n.js';

import { CharacteristicType, ServiceType, TemperatureSensorConfig } from '../model/types.js';

import { Log } from '../tools/log.js';
import { toNumber } from '../tools/primitive.js';
import { toCelsius } from '../tools/temperature.js';
import { TemperatureUnits } from '../model/enums.js';

export class TemperatureSensorAccessory extends BaseAccessory<TemperatureSensorConfig> {

  private currentTemperature: number = 0;

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: TemperatureSensorConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log, TemperatureSensorAccessory.name);

    this.accessoryService.getCharacteristic(Characteristic.CurrentTemperature)
      .onGet(this.getCurrentTemperature.bind(this));
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.TemperatureSensor) || this.accessory.addService(this.Service.TemperatureSensor);
  }

  override addTopicHandlers(): void {
    super.addTopicHandlers();
    this.addTopicHandler('topicGetCurrentTemperature', this.onCurrentTemperatureUpdate.bind(this));
  }

  private async onCurrentTemperatureUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    if (!this.assertNumber(value, strings.temperatureSensor.badValue)) {
      return;
    }

    const units = this.config.temperatureUnits ?? TemperatureUnits.CELSIUS;
    const temperature = toCelsius(toNumber(value), units);
    if (temperature === this.currentTemperature) {
      return;
    }

    this.currentTemperature = temperature;

    this.accessoryService.updateCharacteristic(this.Characteristic.CurrentTemperature, this.currentTemperature);

    this.logIfDesired(strings.temperatureSensor.temperature, value.toString(), units);
  }

  private async getCurrentTemperature(): Promise<CharacteristicValue> {
    return this.currentTemperature;
  }
}
