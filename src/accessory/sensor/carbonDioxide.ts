
import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey } from '../../model/enums.js';
import { CO2SensorConfig, MQTTAccessoryDependency } from '../../model/types.js';

export class CO2SensorAccessory extends SensorAccessory<CO2SensorConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.CarbonDioxideSensor;
  }

  constructor(dependency: MQTTAccessoryDependency<CO2SensorConfig>) {
    super(dependency);

    this.setup(HKCharacteristicKey.CarbonDioxideDetected, dependency.Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL,
      'topicGetCarbonDioxideDetected',
      this.bindOnUpdateNumericBoolean(
        HKCharacteristicKey.CarbonDioxideDetected,
        'valueCarbonDioxideDetected',
        strings.sensor.carbonDioxide.active, strings.sensor.carbonDioxide.inactive),
      true);

    this.setup(HKCharacteristicKey.CarbonDioxideLevel, 0,
      'topicGetCarbonDioxideLevel', this.bindOnUpdateNumeric(HKCharacteristicKey.CarbonDioxideLevel, strings.sensor.carbonDioxide.level), false);

    this.setup(HKCharacteristicKey.CarbonDioxidePeakLevel, 0,
      'topicGetCarbonDioxidePeakLevel', this.bindOnUpdateNumeric(HKCharacteristicKey.CarbonDioxidePeakLevel, strings.sensor.carbonDioxide.peakLevel), false);
  }
}