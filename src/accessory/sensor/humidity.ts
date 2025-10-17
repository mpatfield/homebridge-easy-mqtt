import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey } from '../../model/enums.js';
import { HistoryType } from '../../model/history.js';
import { HumiditySensorConfig, MQTTAccessoryDependency } from '../../model/types.js';

export class HumiditySensorAccessory extends SensorAccessory<HumiditySensorConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.HumiditySensor;
  }

  constructor(
    dependency: MQTTAccessoryDependency<HumiditySensorConfig>) {
    super(dependency);

    this.setup(HKCharacteristicKey.CurrentRelativeHumidity, 0,
      'topicGetCurrentRelativeHumidity',
      this.bindOnUpdateNumeric(HKCharacteristicKey.CurrentRelativeHumidity, strings.climate.humidityUpdate, (value) => {
        this.recordHistory(HistoryType.WEATHER, { humidity: value } );
      }), true);
  }
}