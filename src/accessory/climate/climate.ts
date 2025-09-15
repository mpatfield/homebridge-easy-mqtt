import { CharacteristicValue, PlatformAccessory } from 'homebridge';

import { BaseAccessory } from '../abstract/base.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey, TemperatureUnits } from '../../model/enums.js';
import { CharacteristicType, ClimateControlConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';
import { fromCelsius } from '../../tools/temperature.js';

export const DEFAULT_TEMPERATURE = 10;
const DEFAULT_COOLING_THRESHOLD = 25;
const DEFAULT_HEATING_THRESHOLD = 20;

export abstract class ClimateControlAccessory<C extends ClimateControlConfig = ClimateControlConfig> extends BaseAccessory<C> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: C, log: Log, isGrouped: boolean) {
    super(Service, Characteristic, accessory, config, log, isGrouped);

    this.setCharacteristicValue(CharacteristicKey.TemperatureDisplayUnits, this.temperatureUnits === TemperatureUnits.FAHRENHEIT ? 1 : 0);

    this.setupCharacteristic(CharacteristicKey.CurrentTemperature, DEFAULT_TEMPERATURE, 'topicGetCurrentTemperature',
      this.bindTemperatureUpdate(config, CharacteristicKey.CurrentTemperature, strings.climate.temperatureUpdate), true);

    this.setupCharacteristic(CharacteristicKey.CoolingThresholdTemperature, DEFAULT_COOLING_THRESHOLD,
      'topicGetCoolingThresholdTemperature',
      this.bindTemperatureUpdate(config, CharacteristicKey.CoolingThresholdTemperature, strings.climate.coolingThreshold), false,
      'topicSetCoolingThresholdTemperature',
      this.bindOnSetThreshold(CharacteristicKey.CoolingThresholdTemperature, 'topicSetCoolingThresholdTemperature', strings.climate.coolingThresholdFuture),
    );

    this.setupCharacteristic(CharacteristicKey.HeatingThresholdTemperature, DEFAULT_HEATING_THRESHOLD,
      'topicGetHeatingThresholdTemperature',
      this.bindTemperatureUpdate(config, CharacteristicKey.HeatingThresholdTemperature, strings.climate.heatingThreshold), false,
      'topicSetHeatingThresholdTemperature',
      this.bindOnSetThreshold(CharacteristicKey.HeatingThresholdTemperature, 'topicSetHeatingThresholdTemperature', strings.climate.heatingThresholdFuture),
    );
  }

  protected get temperatureUnits(): TemperatureUnits {
    return this.config.temperatureUnits ?? TemperatureUnits.CELSIUS;
  }

  private bindOnSetThreshold(charKey: CharacteristicKey, topic: keyof ClimateControlConfig, logTemplate: string) {
    return (async (value: CharacteristicValue) => {
      const temperature = this.temperatureFromCV(value);
      const logString = logTemplate.replace('%d°%s', `${temperature}°${this.temperatureUnits}`);
      this.onSet(charKey, value, temperature, topic, logString);
    }).bind(this);
  }

  protected temperatureFromCV(value: CharacteristicValue): number {
    const celsiusTemperature = value as number;
    return this.temperatureUnits === TemperatureUnits.FAHRENHEIT ? fromCelsius(celsiusTemperature, this.temperatureUnits) : celsiusTemperature;
  }
}