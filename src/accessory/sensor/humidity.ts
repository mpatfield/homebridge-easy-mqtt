import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { HumiditySensorConfig, MQTTAccessoryDependency } from '../../model/types.js';

export class HumiditySensorAccessory extends SensorAccessory<HumiditySensorConfig> {

  constructor(
    dependency: MQTTAccessoryDependency<HumiditySensorConfig>) {
    super(dependency);

    this.setup(CharacteristicKey.CurrentRelativeHumidity, 0,
      'topicGetCurrentRelativeHumidity', this.bindOnUpdateNumeric(CharacteristicKey.CurrentRelativeHumidity, strings.climate.humidityUpdate), true);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.HumiditySensor;
  }
}