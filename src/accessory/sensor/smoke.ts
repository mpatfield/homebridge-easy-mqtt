import { PlatformAccessory } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, SmokeSensorConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class SmokeSensorAccessory extends SensorAccessory<SmokeSensorConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: SmokeSensorConfig, log: Log, isGrouped: boolean) {
    super(Service, Characteristic, accessory, config, log, isGrouped);

    this.setupCharacteristic(CharacteristicKey.SmokeDetected, Characteristic.SmokeDetected.SMOKE_NOT_DETECTED,
      'topicGetSmokeDetected',
      this.bindOnUpdateNumericBoolean(CharacteristicKey.SmokeDetected, 'valueSmokeDetected', strings.sensor.smoke.active, strings.sensor.smoke.inactive),
      true);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.SmokeSensor;
  }
}