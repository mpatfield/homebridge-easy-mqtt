import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { HKAccessoryType, HKCharacteristicKey, MQTTAccessoryDependency } from '../../model/homekit.js';
import { LightSensorConfig } from '../../model/types.js';

export class LightSensorAccessory extends SensorAccessory<LightSensorConfig> {

  protected getAccessoryType(): HKAccessoryType {
    return HKAccessoryType.LightSensor;
  }

  constructor(dependency: MQTTAccessoryDependency<LightSensorConfig>) {
    super(dependency);

    this.setup(
      HKCharacteristicKey.CurrentAmbientLightLevel, 0.0001,
      'topicGetCurrentAmbientLightLevel', this.bindOnUpdateNumeric(HKCharacteristicKey.CurrentAmbientLightLevel, strings.sensor.light.level),
      true);
  }
}