
import { SensorAccessory } from './sensor.js';

import { MQTTAccessoryDependency } from '../abstract/mqtt.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { CO2SensorConfig } from '../../model/types.js';

export class CO2SensorAccessory extends SensorAccessory<CO2SensorConfig> {

  constructor(dependency: MQTTAccessoryDependency<CO2SensorConfig>) {
    super(dependency);

    this.setup(CharacteristicKey.CarbonDioxideDetected, dependency.Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL,
      'topicGetCarbonDioxideDetected',
      this.bindOnUpdateNumericBoolean(
        CharacteristicKey.CarbonDioxideDetected,
        'valueCarbonDioxideDetected',
        strings.sensor.carbonDioxide.active, strings.sensor.carbonDioxide.inactive),
      true);

    this.setup(CharacteristicKey.CarbonDioxideLevel, 0,
      'topicGetCarbonDioxideLevel', this.bindOnUpdateNumeric(CharacteristicKey.CarbonDioxideLevel, strings.sensor.carbonDioxide.level), false);

    this.setup(CharacteristicKey.CarbonDioxidePeakLevel, 0,
      'topicGetCarbonDioxidePeakLevel', this.bindOnUpdateNumeric(CharacteristicKey.CarbonDioxidePeakLevel, strings.sensor.carbonDioxide.peakLevel), false);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.CarbonDioxideSensor;
  }
}