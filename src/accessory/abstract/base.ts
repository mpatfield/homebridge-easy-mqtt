import { CharacteristicValue, PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { MQTTAccessory } from './mqtt.js';

import { PLATFORM_NAME } from '../../homebridge/settings.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, BaseAccessoryConfig, ServiceType } from '../../model/types.js';

import { Log, LogType } from '../../tools/log.js';
import getVersion from '../../tools/version.js';

export abstract class BaseAccessory<C extends BaseAccessoryConfig = BaseAccessoryConfig> extends MQTTAccessory<C> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: C, log: Log) {
    super(Service, Characteristic, accessory, config, log);

    accessory.getService(Service.AccessoryInformation)!
      .setCharacteristic(Characteristic.Name, config.info.name)
      .setCharacteristic(Characteristic.ConfiguredName, config.info.name)
      .setCharacteristic(Characteristic.Manufacturer, config.info.manufacturer ?? PLATFORM_NAME)
      .setCharacteristic(Characteristic.Model, config.info.model ?? config.info.type)
      .setCharacteristic(Characteristic.SerialNumber, config.info.serialNumber ?? config.info.id)
      .setCharacteristic(Characteristic.FirmwareRevision, config.info.version ?? getVersion());

    this.set(CharacteristicKey.BatteryLevel, 100);
    this.bind(Characteristic.BatteryLevel, 'topicGetBatteryLevel', this.getBatteryLevel.bind(this));
    this.addTopicHandler('topicGetBatteryLevel', this.onBatteryLevelUpdate.bind(this), false);

    this.set(CharacteristicKey.StatusLowBattery, false);
    this.bind(Characteristic.StatusLowBattery, 'topicGetBatteryLow', this.getBatteryLow.bind(this));
    this.addTopicHandler('topicGetBatteryLow', this.onBatteryLowUpdate.bind(this), false);

    this.set(CharacteristicKey.StatusActive, true);
    this.bind(Characteristic.StatusActive, 'topicGetStatusActive', this.getStatusActive.bind(this));
    this.addTopicHandler('topicGetStatusActive', this.onStatusActiveUpdate.bind(this), false);
  }

  private async getBatteryLevel(): Promise<CharacteristicValue> {
    return this.get(CharacteristicKey.BatteryLevel);
  }

  private async getBatteryLow(): Promise<CharacteristicValue> {
    return this.get(CharacteristicKey.StatusLowBattery);
  }

  private async getStatusActive(): Promise<CharacteristicValue> {
    return this.get(CharacteristicKey.StatusActive);
  }

  private async onBatteryLevelUpdate(topic: string, value: PrimitiveTypes): Promise<void> {
    if (this.assertNumber(value, strings.accessory.badBatteryLevel)) {
      const logString = strings.accessory.batteryLevel.replace('%d', `${value.toString()}%`);
      this.onUpdate(CharacteristicKey.BatteryLevel, value, logString);
    }
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