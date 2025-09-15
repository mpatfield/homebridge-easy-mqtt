import { PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { MQTTAccessory } from './mqtt.js';

import { PLATFORM_NAME } from '../../homebridge/settings.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, BaseAccessoryConfig, ServiceType } from '../../model/types.js';

import { Log, LogType } from '../../tools/log.js';
import getVersion from '../../tools/version.js';

export abstract class BaseAccessory<C extends BaseAccessoryConfig = BaseAccessoryConfig> extends MQTTAccessory<C> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: C, log: Log, isGrouped: boolean) {
    super(Service, Characteristic, accessory, config, log, isGrouped);

    if (!isGrouped) {
    accessory.getService(Service.AccessoryInformation)!
      .setCharacteristic(Characteristic.Name, config.info.name)
      .setCharacteristic(Characteristic.ConfiguredName, config.info.name)
      .setCharacteristic(Characteristic.Manufacturer, config.info.manufacturer ?? PLATFORM_NAME)
      .setCharacteristic(Characteristic.Model, config.info.model ?? config.info.type)
      .setCharacteristic(Characteristic.SerialNumber, config.info.serialNumber ?? config.info.id)
      .setCharacteristic(Characteristic.FirmwareRevision, config.info.version ?? getVersion());
    }

    this.setupCharacteristic(CharacteristicKey.BatteryLevel, 100,
      'topicGetBatteryLevel', this.bindOnUpdateNumeric(CharacteristicKey.BatteryLevel, strings.accessory.batteryLevel), false);

    this.setupCharacteristic(CharacteristicKey.StatusLowBattery, Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL,
      'topicGetBatteryLow', this.onBatteryLowUpdate.bind(this), false);

    this.setupCharacteristic(CharacteristicKey.StatusActive, true,
      'topicGetStatusActive', this.onStatusActiveUpdate.bind(this), false);
  }

  private async onBatteryLowUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    const batteryLow = value === this.getPrimitiveValue('valueBatteryLow');
    if (!this.onUpdate(CharacteristicKey.StatusLowBattery, batteryLow)) {
      return;
    }

    if (batteryLow) {
      this.logIfDesired(LogType.WARNING, strings.accessory.batteryLow);
    } else {
      this.logIfDesired(strings.accessory.batteryNotLow);
    }
  }

  private async onStatusActiveUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    const statusActive = value === this.getPrimitiveValue('valueStatusActive');
    if (!this.onUpdate(CharacteristicKey.StatusActive, statusActive)) {
      return;
    }

    if (statusActive) {
      this.logIfDesired(strings.accessory.statusActive);
    } else {
      this.logIfDesired(LogType.WARNING, strings.accessory.statusInactive);
    }
  }
}