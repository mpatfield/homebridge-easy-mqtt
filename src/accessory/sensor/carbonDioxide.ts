import { PlatformAccessory } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, CO2SensorConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class CO2SensorAccessory extends SensorAccessory<CO2SensorConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: CO2SensorConfig, log: Log, isGrouped: boolean) {
    super(Service, Characteristic, accessory, config, log, isGrouped);

    this.setup(CharacteristicKey.CarbonDioxideDetected, Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL,
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