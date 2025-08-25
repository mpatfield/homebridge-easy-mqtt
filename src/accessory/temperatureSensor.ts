import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import { makeHandler, TopicHandler } from './abstract/base.js';
import { StatusActiveAccessory } from './abstract/statusActive.js';

import { strings } from '../i18n/i18n.js';

import { CharacteristicType, ServiceType, TemperatureSensorConfig } from '../model/types.js';

import { Log } from '../tools/log.js';
import { Primitive, toNumber } from '../tools/primitive.js';
import { toCelsius } from '../tools/temperature.js';
import { TemperatureUnits } from '../model/enums.js';

export class TemperatureSensorAccessory extends StatusActiveAccessory<TemperatureSensorConfig> {

  private currentTemperature: number = 0;

  constructor(
    Service: ServiceType,
    Characteristic: CharacteristicType,
    accessory: PlatformAccessory,
    config: TemperatureSensorConfig,
    log: Log,
  ) {
    super(Service, Characteristic, accessory, config, log, TemperatureSensorAccessory.name);

    this.accessoryService.getCharacteristic(Characteristic.CurrentTemperature)
      .onGet(this.getCurrentTemperature.bind(this));
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.TemperatureSensor) || this.accessory.addService(this.Service.TemperatureSensor);
  }

  override get topicHandlers(): TopicHandler[] {
    const topicHandlers = super.topicHandlers;

    if (!this.assert('topicGetCurrentTemperature')) {
      return topicHandlers;
    }

    topicHandlers.push(makeHandler(this.config.topicGetCurrentTemperature, this.onCurrentTemperatureUpdate.bind(this)));

    return topicHandlers;
  }


  private async onCurrentTemperatureUpdate(topic: string, value: Primitive): Promise<void> {

    const units = this.config.temperatureUnits ?? TemperatureUnits.CELSIUS;
    const temperature = toCelsius(toNumber(value), units);
    if (temperature === this.currentTemperature) {
      return;
    }

    this.currentTemperature = temperature;

    this.accessoryService.updateCharacteristic(this.Characteristic.CurrentTemperature, this.currentTemperature);

    this.logIfDesired(strings.temperatureSensor.temperature, this.name, value.toString(), units);
  }

  private async getCurrentTemperature(): Promise<CharacteristicValue> {
    return this.currentTemperature;
  }
}
