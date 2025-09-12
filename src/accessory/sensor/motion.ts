import { PlatformAccessory } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, MotionSensorConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class MotionSensorAccessory extends SensorAccessory<MotionSensorConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: MotionSensorConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log);

    this.setupCharacteristic(CharacteristicKey.MotionDetected, 0, 'topicGetMotionDetected',
      this.bindOnUpdateNumericBoolean(
        CharacteristicKey.MotionDetected,
        'valueMotionDetected',
        strings.sensor.motion.active, strings.sensor.motion.inactive),
      true);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.MotionSensor;
  }
}