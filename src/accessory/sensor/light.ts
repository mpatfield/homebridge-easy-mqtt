import { PlatformAccessory } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, LightSensorConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class LightSensorAccessory extends SensorAccessory<LightSensorConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: LightSensorConfig, log: Log, isGrouped: boolean) {
    super(Service, Characteristic, accessory, config, log, isGrouped);

    this.setupCharacteristic(
      CharacteristicKey.CurrentAmbientLightLevel, 0.0001,
      'topicGetCurrentAmbientLightLevel', this.bindOnUpdateNumeric(CharacteristicKey.CurrentAmbientLightLevel, strings.sensor.light.level),
      true);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.LightSensor;
  }
}