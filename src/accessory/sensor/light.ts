import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey } from '../../model/enums.js';
import { LightSensorConfig, MQTTAccessoryDependency } from '../../model/types.js';

export class LightSensorAccessory extends SensorAccessory<LightSensorConfig> {

  constructor(dependency: MQTTAccessoryDependency<LightSensorConfig>) {
    super(dependency);

    this.setup(
      HKCharacteristicKey.CurrentAmbientLightLevel, 0.0001,
      'topicGetCurrentAmbientLightLevel', this.bindOnUpdateNumeric(HKCharacteristicKey.CurrentAmbientLightLevel, strings.sensor.light.level),
      true);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.LightSensor;
  }
}