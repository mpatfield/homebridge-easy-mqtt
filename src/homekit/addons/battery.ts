import { Service } from 'homebridge';

import { Addon } from './addon.js';

import { TopicHandler } from '../abstract/common.js';
import { MQTTAccessory } from '../abstract/mqtt.js';

import { strings } from '../../i18n/i18n.js';

import { AddonType, HKCharacteristicKey, ServiceType } from '../../model/homekit.js';
import { BatteryConfig, MQTTAccessoryConfig } from '../../model/types.js';

import { LogType } from '../../tools/log.js';

export class Battery extends Addon<BatteryConfig> {

  static topicHandlers(
    Service: ServiceType,
    parentAccessory: MQTTAccessory<MQTTAccessoryConfig>,
    config: BatteryConfig,
  ): TopicHandler[] {
    const BatteryService = Service[AddonType.Battery];
    const battery =
        Addon.new(parentAccessory, BatteryService, config, ['topicGetBatteryLevel', 'topicGetBatteryLow'], Battery);
    return battery?.topicHandlers ?? [];
  }

  public constructor(
    service: Service,
    parentAccessory: MQTTAccessory<MQTTAccessoryConfig>,
    config: BatteryConfig,
  ) {
    super(parentAccessory, service, config);

    this.setup(HKCharacteristicKey.BatteryLevel, 100,
      'topicGetBatteryLevel', this.bindOnUpdateNumeric(HKCharacteristicKey.BatteryLevel, strings.accessory.batteryLevel), false);

    this.setup(HKCharacteristicKey.StatusLowBattery, this.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL,
      'topicGetBatteryLow',
      this.bindOnUpdateBooleanSingle(HKCharacteristicKey.StatusLowBattery, 'valueBatteryLow',
        strings.accessory.batteryLow, strings.accessory.batteryNotLow, LogType.WARNING),
      false,
    );
  }
}