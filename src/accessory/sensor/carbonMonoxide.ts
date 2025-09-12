import { PlatformAccessory } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, COSensorConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class COSensorAccessory extends SensorAccessory<COSensorConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: COSensorConfig, log: Log, isGrouped: boolean) {
    super(Service, Characteristic, accessory, config, log, isGrouped);

    this.setupCharacteristic(CharacteristicKey.CarbonMonoxideDetected, 0, 'topicGetCarbonMonoxideDetected',
      this.bindOnUpdateNumericBoolean(
        CharacteristicKey.CarbonMonoxideDetected,
        'valueCarbonMonoxideDetected',
        strings.sensor.carbonMonoxide.active, strings.sensor.carbonMonoxide.inactive),
      true);

    this.setupCharacteristic(CharacteristicKey.CarbonMonoxideLevel, 0,
      'topicGetCarbonMonoxideLevel', this.bindOnUpdateNumeric(CharacteristicKey.CarbonMonoxideLevel, strings.sensor.carbonMonoxide.level), false);

    this.setupCharacteristic(CharacteristicKey.CarbonMonoxidePeakLevel, 0,
      'topicGetCarbonMonoxidePeakLevel', this.bindOnUpdateNumeric(CharacteristicKey.CarbonMonoxidePeakLevel, strings.sensor.carbonMonoxide.peakLevel), false);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.CarbonMonoxideSensor;
  }
}