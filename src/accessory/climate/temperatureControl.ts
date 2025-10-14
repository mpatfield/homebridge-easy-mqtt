import { CharacteristicValue } from 'homebridge';

import { BaseAccessory } from '../abstract/base.js';
import { strings } from '../../i18n/i18n.js';

import { HKCharacteristicKey } from '../../model/enums.js';
import { MQTTAccessoryDependency, TemperatureControlConfig } from '../../model/types.js';

import { fromCelsius, temperatureUnits, TemperatureUnits } from '../../tools/temperature.js';

export const DEFAULT_TEMPERATURE = 10;
const DEFAULT_COOLING_THRESHOLD = 25;
const DEFAULT_HEATING_THRESHOLD = 20;

export abstract class TemperatureControlAccessory<C extends TemperatureControlConfig = TemperatureControlConfig> extends BaseAccessory<C> {

  constructor(dependency: MQTTAccessoryDependency<C>) {
    super(dependency);
  }

  protected setupTemperatureControlCharacteristics() {

    const temperatureDisplayUnits = this.temperatureUnits === TemperatureUnits.FAHRENHEIT
      ? this.Characteristic.TemperatureDisplayUnits.FAHRENHEIT : this.Characteristic.TemperatureDisplayUnits.CELSIUS;
    this.setCharacteristicValue(HKCharacteristicKey.TemperatureDisplayUnits, temperatureDisplayUnits);

    this.setup(HKCharacteristicKey.CurrentTemperature, DEFAULT_TEMPERATURE, 'topicGetCurrentTemperature',
      this.bindTemperatureUpdate(this.config, HKCharacteristicKey.CurrentTemperature, strings.climate.temperatureUpdate), true);

    this.setup(HKCharacteristicKey.CoolingThresholdTemperature, DEFAULT_COOLING_THRESHOLD,
      'topicGetCoolingThresholdTemperature',
      this.bindTemperatureUpdate(this.config, HKCharacteristicKey.CoolingThresholdTemperature, strings.climate.coolingThreshold), false,
      'topicSetCoolingThresholdTemperature',
      this.bindOnSetThreshold(HKCharacteristicKey.CoolingThresholdTemperature, 'topicSetCoolingThresholdTemperature', strings.climate.coolingThresholdFuture),
    );

    this.setup(HKCharacteristicKey.HeatingThresholdTemperature, DEFAULT_HEATING_THRESHOLD,
      'topicGetHeatingThresholdTemperature',
      this.bindTemperatureUpdate(this.config, HKCharacteristicKey.HeatingThresholdTemperature, strings.climate.heatingThreshold), false,
      'topicSetHeatingThresholdTemperature',
      this.bindOnSetThreshold(HKCharacteristicKey.HeatingThresholdTemperature, 'topicSetHeatingThresholdTemperature', strings.climate.heatingThresholdFuture),
    );
  }

  protected get temperatureUnits(): TemperatureUnits {
    return temperatureUnits(this.config.temperatureUnits);
  }

  private bindOnSetThreshold(charKey: HKCharacteristicKey, topic: keyof TemperatureControlConfig, logTemplate: string) {
    return (async (value: CharacteristicValue) => {
      const temperature = this.temperatureFromCV(value);
      const logString = logTemplate.replace('%d°%s', `${temperature}°${this.temperatureUnits}`);
      this.onSet(charKey, value, temperature, topic, logString);
    }).bind(this);
  }

  protected temperatureFromCV(value: CharacteristicValue): number {
    const celsiusTemperature = value as number;
    return fromCelsius(celsiusTemperature, this.temperatureUnits);
  }
}