import { PlatformAccessory } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, LeakSensorConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class LeakSensorAccessory extends SensorAccessory<LeakSensorConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: LeakSensorConfig, log: Log, isGrouped: boolean) {
    super(Service, Characteristic, accessory, config, log, isGrouped);

    this.setupCharacteristic(CharacteristicKey.LeakDetected, 0, 'topicGetLeakDetected',
      this.bindOnUpdateNumericBoolean(
        CharacteristicKey.LeakDetected,
        'valueLeakDetected',
        strings.sensor.leak.active, strings.sensor.leak.inactive),
      true);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.LeakSensor;
  }
}