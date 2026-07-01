import { CharacteristicValue } from 'homebridge';

import { HomeKitAccessory } from '../abstract/base.js';

import { strings } from '../../i18n/i18n.js';

import { HKCharacteristicKey, MQTTAccessoryDependency } from '../../model/homekit.js';
import { TemperatureControlConfig } from '../../model/types.js';

import { debounce } from '../../tools/debounce.js';
import { fromCelsius, temperatureUnits, TemperatureUnits } from '../../tools/temperature.js';

export const DEFAULT_TEMPERATURE = 10;
const DEFAULT_COOLING_THRESHOLD = 25;
const DEFAULT_HEATING_THRESHOLD = 20;

export abstract class TemperatureControlAccessory<C extends TemperatureControlConfig = TemperatureControlConfig> extends HomeKitAccessory<C> {

  constructor(dependency: MQTTAccessoryDependency<C>) {
    super(dependency);
  }

  protected setupTemperatureControlCharacteristics() {

    const temperatureDisplayUnits = this.temperatureUnits === TemperatureUnits.FAHRENHEIT
      ? this.Characteristic.TemperatureDisplayUnits.FAHRENHEIT : this.Characteristic.TemperatureDisplayUnits.CELSIUS;
    this.setCharacteristicValue(HKCharacteristicKey.TemperatureDisplayUnits, temperatureDisplayUnits);

    this.setup(HKCharacteristicKey.CurrentTemperature, DEFAULT_TEMPERATURE, 'topicGetCurrentTemperature',
      this.bindOnUpdateTemperature(this.config, HKCharacteristicKey.CurrentTemperature, strings.climate.temperatureUpdate), true);

    this.setup(HKCharacteristicKey.CoolingThresholdTemperature, DEFAULT_COOLING_THRESHOLD,
      'topicGetCoolingThresholdTemperature',
      this.bindOnUpdateTemperature(this.config, HKCharacteristicKey.CoolingThresholdTemperature, strings.climate.coolingThreshold), false,
      'topicSetCoolingThresholdTemperature',
      this.bindOnSetTemperature(HKCharacteristicKey.CoolingThresholdTemperature, 'topicSetCoolingThresholdTemperature', strings.climate.coolingThresholdFuture),
    );

    this.setup(HKCharacteristicKey.HeatingThresholdTemperature, DEFAULT_HEATING_THRESHOLD,
      'topicGetHeatingThresholdTemperature',
      this.bindOnUpdateTemperature(this.config, HKCharacteristicKey.HeatingThresholdTemperature, strings.climate.heatingThreshold), false,
      'topicSetHeatingThresholdTemperature',
      this.bindOnSetTemperature(HKCharacteristicKey.HeatingThresholdTemperature, 'topicSetHeatingThresholdTemperature', strings.climate.heatingThresholdFuture),
    );
  }

  protected get temperatureUnits(): TemperatureUnits {
    return temperatureUnits(this.config.temperatureUnits);
  }

  protected bindOnSetTemperature(charKey: HKCharacteristicKey, topic: keyof C, logTemplate: string) {
    return (async (value: CharacteristicValue) => {
      const temperature = this.temperatureFromCV(value);
      const logString = logTemplate.replace('%d°%s', `${temperature}°${this.temperatureUnits}`);
      debounce(`${this.identifier}_${charKey}`, () => {
        this.onSet(charKey, value, temperature, topic, logString);
      });
    }).bind(this);
  }

  protected temperatureFromCV(value: CharacteristicValue): number {
    const celsiusTemperature = value as number;
    return fromCelsius(celsiusTemperature, this.temperatureUnits);
  }
}