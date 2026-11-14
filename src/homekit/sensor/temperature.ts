import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType } from '../../model/enums.js';
import { HKCharacteristicKey, MQTTAccessoryDependency } from '../../model/homekit.js';
import { HistoryType } from '../../model/history.js';
import { TemperatureUnits, temperatureUnits, toCelsius } from '../../tools/temperature.js';
import { TemperatureSensorConfig } from '../../model/types.js';

export class TemperatureSensorAccessory extends SensorAccessory<TemperatureSensorConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.TemperatureSensor;
  }

  constructor(
    dependency: MQTTAccessoryDependency<TemperatureSensorConfig>) {
    super(dependency);

    this.setup(HKCharacteristicKey.CurrentTemperature, 0, 'topicGetCurrentTemperature',
      this.bindOnUpdateTemperature(dependency.config, HKCharacteristicKey.CurrentTemperature, strings.climate.temperatureUpdate, (value) => {
        this.recordHistory(HistoryType.WEATHER, { temp: value } );
      }), true)?.setProps({
      minValue: dependency.config.minimumTemperature ? toCelsius(dependency.config.minimumTemperature, this.temperatureUnits) : undefined,
      maxValue: dependency.config.maximumTemperature ? toCelsius(dependency.config.maximumTemperature, this.temperatureUnits) : undefined,
    });
  }

  private get temperatureUnits(): TemperatureUnits {
    return temperatureUnits(this.config.temperatureUnits);
  }
}
