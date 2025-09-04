import { PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { MQTTAccessory, OnUpdateHandler } from './mqtt.js';

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

    this.setup(CharacteristicKey.BatteryLevel, 100,
      'topicGetBatteryLevel', this.onUpdateNumeric(CharacteristicKey.BatteryLevel, strings.accessory.batteryLevel), false);

    this.setup(CharacteristicKey.StatusLowBattery, false,
      'topicGetBatteryLow', this.onBatteryLowUpdate.bind(this), false);

    this.setup(CharacteristicKey.StatusActive, true,
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

  protected onUpdateNumeric(charKey: CharacteristicKey, logTemplate: string): OnUpdateHandler {
    return (async (_topic: string, value: PrimitiveTypes) => {

      if (typeof value !== 'number') {
        this.log.error(strings.accessory.badNumericValue, this.name, charKey, `'${value.toString()}'`);
        return;
      }

      const logString = logTemplate.replace('%d', value.toString());
      this.onUpdate(charKey, value, logString);

    }).bind(this);
  }

  protected onUpdateNumericBoolean(charKey: CharacteristicKey, valueKey: keyof C, logTrue: string, logFalse: string): OnUpdateHandler {
    return (async (_topic: string, value: PrimitiveTypes) => {
      const numeric = value === this.getPrimitiveValue(valueKey) ? 1 : 0;
      this.onUpdate(charKey, numeric, numeric ? logTrue : logFalse);
    }).bind(this);
  }
}