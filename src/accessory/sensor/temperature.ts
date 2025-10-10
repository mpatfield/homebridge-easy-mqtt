import { SensorAccessory } from './sensor.js';

import { MQTTAccessoryDependency } from '../abstract/mqtt.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { TemperatureSensorConfig } from '../../model/types.js';

export class TemperatureSensorAccessory extends SensorAccessory<TemperatureSensorConfig> {

  constructor(
    dependency: MQTTAccessoryDependency<TemperatureSensorConfig>) {
    super(dependency);

    this.setup(CharacteristicKey.CurrentTemperature, 0, 'topicGetCurrentTemperature',
      this.bindTemperatureUpdate(dependency.config, CharacteristicKey.CurrentTemperature, strings.climate.temperatureUpdate), true);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.TemperatureSensor;
  }
}
