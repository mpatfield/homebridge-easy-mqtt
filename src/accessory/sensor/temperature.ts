import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey } from '../../model/enums.js';
import { MQTTAccessoryDependency, TemperatureSensorConfig } from '../../model/types.js';

export class TemperatureSensorAccessory extends SensorAccessory<TemperatureSensorConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.TemperatureSensor;
  }

  constructor(
    dependency: MQTTAccessoryDependency<TemperatureSensorConfig>) {
    super(dependency);

    this.setup(HKCharacteristicKey.CurrentTemperature, 0, 'topicGetCurrentTemperature',
      this.bindOnUpdateTemperature(dependency.config, HKCharacteristicKey.CurrentTemperature, strings.climate.temperatureUpdate), true);
  }
}
