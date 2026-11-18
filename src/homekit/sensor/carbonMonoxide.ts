import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { HKAccessoryType, HKCharacteristicKey, MQTTAccessoryDependency } from '../../model/homekit.js';
import { COSensorConfig } from '../../model/types.js';

export class COSensorAccessory extends SensorAccessory<COSensorConfig> {

  protected getAccessoryType(): HKAccessoryType {
    return HKAccessoryType.CarbonMonoxideSensor;
  }

  constructor(dependency: MQTTAccessoryDependency<COSensorConfig>) {
    super(dependency);

    this.setup(HKCharacteristicKey.CarbonMonoxideDetected, dependency.Characteristic.CarbonMonoxideDetected.CO_LEVELS_NORMAL,
      'topicGetCarbonMonoxideDetected',
      this.bindOnUpdateNumericBoolean(
        HKCharacteristicKey.CarbonMonoxideDetected,
        'valueCarbonMonoxideDetected',
        strings.sensor.carbonMonoxide.active, strings.sensor.carbonMonoxide.inactive,
        true),
      true);

    this.setup(HKCharacteristicKey.CarbonMonoxideLevel, 0,
      'topicGetCarbonMonoxideLevel', this.bindOnUpdateNumeric(HKCharacteristicKey.CarbonMonoxideLevel, strings.sensor.carbonMonoxide.level), false);

    this.setup(HKCharacteristicKey.CarbonMonoxidePeakLevel, 0,
      'topicGetCarbonMonoxidePeakLevel', this.bindOnUpdateNumeric(HKCharacteristicKey.CarbonMonoxidePeakLevel, strings.sensor.carbonMonoxide.peakLevel), false);
  }
}