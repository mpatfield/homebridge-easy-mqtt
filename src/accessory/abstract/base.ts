import { MQTTAccessory } from './mqtt.js';

import { PLATFORM_NAME } from '../../homebridge/settings.js';

import { isOptionalHKCharacteristic } from '../characteristic/characteristic.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey, HKCharacteristicKey } from '../../model/enums.js';
import { BaseAccessoryConfig, MQTTAccessoryDependency } from '../../model/types.js';

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

    this.setup(HKCharacteristicKey.BatteryLevel, 100,
      'topicGetBatteryLevel', this.bindOnUpdateNumeric(HKCharacteristicKey.BatteryLevel, strings.accessory.batteryLevel), false);

    this.setup(HKCharacteristicKey.StatusLowBattery, dependency.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL,
      'topicGetBatteryLow',
      this.bindOnUpdateBooleanSingle(HKCharacteristicKey.StatusLowBattery, 'valueBatteryLow',
        strings.accessory.batteryLow, strings.accessory.batteryNotLow, LogType.WARNING),
      false,
    );

    this.setup(HKCharacteristicKey.StatusActive, true,
      'topicGetStatusActive',
      this.bindOnUpdateBooleanSingle(HKCharacteristicKey.StatusActive, 'valueStatusActive',
        strings.accessory.statusActive, strings.accessory.statusInactive, LogType.ALWAYS, LogType.WARNING),
      false);
  }

  override isOptionalCharacteristic(key: CharacteristicKey): boolean {
    return super.isOptionalCharacteristic(key) || isOptionalHKCharacteristic(key, this.config.info.type);
  }
}