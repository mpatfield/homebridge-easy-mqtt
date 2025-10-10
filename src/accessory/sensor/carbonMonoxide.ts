import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { COSensorConfig, MQTTAccessoryDependency } from '../../model/types.js';

export class COSensorAccessory extends SensorAccessory<COSensorConfig> {

  constructor(dependency: MQTTAccessoryDependency<COSensorConfig>) {
    super(dependency);

    this.setup(CharacteristicKey.CarbonMonoxideDetected, dependency.Characteristic.CarbonMonoxideDetected.CO_LEVELS_NORMAL,
      'topicGetCarbonMonoxideDetected',
      this.bindOnUpdateNumericBoolean(
        CharacteristicKey.CarbonMonoxideDetected,
        'valueCarbonMonoxideDetected',
        strings.sensor.carbonMonoxide.active, strings.sensor.carbonMonoxide.inactive),
      true);

    this.setup(CharacteristicKey.CarbonMonoxideLevel, 0,
      'topicGetCarbonMonoxideLevel', this.bindOnUpdateNumeric(CharacteristicKey.CarbonMonoxideLevel, strings.sensor.carbonMonoxide.level), false);

    this.setup(CharacteristicKey.CarbonMonoxidePeakLevel, 0,
      'topicGetCarbonMonoxidePeakLevel', this.bindOnUpdateNumeric(CharacteristicKey.CarbonMonoxidePeakLevel, strings.sensor.carbonMonoxide.peakLevel), false);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.CarbonMonoxideSensor;
  }
}