import { SensorAccessory } from './sensor.js';

import { MQTTAccessoryDependency } from '../abstract/mqtt.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { SmokeSensorConfig } from '../../model/types.js';

export class SmokeSensorAccessory extends SensorAccessory<SmokeSensorConfig> {

  constructor(dependency: MQTTAccessoryDependency<SmokeSensorConfig>) {
    super(dependency);

    this.setup(CharacteristicKey.SmokeDetected, dependency.Characteristic.SmokeDetected.SMOKE_NOT_DETECTED,
      'topicGetSmokeDetected',
      this.bindOnUpdateNumericBoolean(CharacteristicKey.SmokeDetected, 'valueSmokeDetected', strings.sensor.smoke.active, strings.sensor.smoke.inactive),
      true);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.SmokeSensor;
  }
}