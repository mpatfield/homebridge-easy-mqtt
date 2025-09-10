import { PlatformAccessory, Service } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, CO2SensorConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class CO2SensorAccessory extends SensorAccessory<CO2SensorConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: CO2SensorConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log);

    this.setupCharacteristic(CharacteristicKey.CarbonDioxideDetected, 0, 'topicGetCarbonDioxideDetected',
      this.bindOnUpdateNumericBoolean(
        CharacteristicKey.CarbonDioxideDetected,
        'valueCarbonDioxideDetected',
        strings.sensor.carbonDioxide.active, strings.sensor.carbonDioxide.inactive),
      true);

    this.setupCharacteristic(CharacteristicKey.CarbonDioxideLevel, 0,
      'topicGetCarbonDioxideLevel', this.bindOnUpdateNumeric(CharacteristicKey.CarbonDioxideLevel, strings.sensor.carbonDioxide.level), false);

    this.setupCharacteristic(CharacteristicKey.CarbonDioxidePeakLevel, 0,
      'topicGetCarbonDioxidePeakLevel', this.bindOnUpdateNumeric(CharacteristicKey.CarbonDioxidePeakLevel, strings.sensor.carbonDioxide.peakLevel), false);
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.CarbonDioxideSensor) || this.accessory.addService(this.Service.CarbonDioxideSensor);
  }
}