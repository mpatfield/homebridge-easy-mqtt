import { PrimitiveTypes } from 'homebridge';

import { MQTTAccessory, MQTTAccessoryDependency } from './mqtt.js';

import { PLATFORM_NAME } from '../../homebridge/settings.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { BaseAccessoryConfig } from '../../model/types.js';

import { LogType } from '../../tools/log.js';
import getVersion from '../../tools/version.js';

export abstract class BaseAccessory<C extends BaseAccessoryConfig = BaseAccessoryConfig> extends MQTTAccessory<C> {

  constructor(dependency: MQTTAccessoryDependency<C>) {
    super(dependency);

    if (!dependency.isGrouped) {
    this.platformAccessory.getService(dependency.Service.AccessoryInformation)!
      .setCharacteristic(dependency.Characteristic.Name, dependency.config.info.name)
      .setCharacteristic(dependency.Characteristic.ConfiguredName, dependency.config.info.name)
      .setCharacteristic(dependency.Characteristic.Manufacturer, dependency.config.info.manufacturer ?? PLATFORM_NAME)
      .setCharacteristic(dependency.Characteristic.Model, dependency.config.info.model ?? dependency.config.info.type)
      .setCharacteristic(dependency.Characteristic.SerialNumber, dependency.config.info.serialNumber ?? this.identifier)
      .setCharacteristic(dependency.Characteristic.FirmwareRevision, dependency.config.info.version ?? getVersion());
    }

    this.setup(CharacteristicKey.BatteryLevel, 100,
      'topicGetBatteryLevel', this.bindOnUpdateNumeric(CharacteristicKey.BatteryLevel, strings.accessory.batteryLevel), false);

    this.setup(CharacteristicKey.StatusLowBattery, dependency.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL,
      'topicGetBatteryLow', this.onBatteryLowUpdate.bind(this), false);

    this.setup(CharacteristicKey.StatusActive, true,
      'topicGetStatusActive', this.onStatusActiveUpdate.bind(this), false);
  }

  private async onBatteryLowUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    const batteryLow = value === this.getPrimitiveValue('valueBatteryLow') ? 1 : 0;
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