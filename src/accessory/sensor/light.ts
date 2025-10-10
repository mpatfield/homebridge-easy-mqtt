import { SensorAccessory } from './sensor.js';

import { MQTTAccessoryDependency } from '../abstract/mqtt.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { LightSensorConfig } from '../../model/types.js';

export class LightSensorAccessory extends SensorAccessory<LightSensorConfig> {

  constructor(dependency: MQTTAccessoryDependency<LightSensorConfig>) {
    super(dependency);

    this.setup(
      CharacteristicKey.CurrentAmbientLightLevel, 0.0001,
      'topicGetCurrentAmbientLightLevel', this.bindOnUpdateNumeric(CharacteristicKey.CurrentAmbientLightLevel, strings.sensor.light.level),
      true);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.LightSensor;
  }
}