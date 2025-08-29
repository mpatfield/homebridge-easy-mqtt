import { CharacteristicValue, PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { MQTTAccessory } from './mqtt.js';

import { PLATFORM_NAME } from '../../homebridge/settings.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, BaseAccessoryConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';
import getVersion from '../../tools/version.js';

export abstract class BaseAccessory<C extends BaseAccessoryConfig = BaseAccessoryConfig> extends MQTTAccessory<C> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: C, log: Log, className: string) {
    super(Service, Characteristic, accessory, config, log);

    accessory.getService(Service.AccessoryInformation)!
      .setCharacteristic(Characteristic.Name, config.info.name)
      .setCharacteristic(Characteristic.ConfiguredName, config.info.name)
      .setCharacteristic(Characteristic.Manufacturer, config.info.manufacturer ?? 'Homebridge')
      .setCharacteristic(Characteristic.SerialNumber, config.info.serialNumber ?? `${PLATFORM_NAME}:${config.info.name}`)
      .setCharacteristic(Characteristic.Model, config.info.model ?? className)
      .setCharacteristic(Characteristic.FirmwareRevision, config.info.version ?? getVersion());

    this.set(CharacteristicKey.StatusActive, true);

    this.bind(Characteristic.StatusActive, 'topicGetStatusActive', this.getStatusActive.bind(this));
  }

  protected addTopicHandlers(): void {
    this.addTopicHandler('topicGetStatusActive', this.onStatusActiveUpdate.bind(this), false);
  }

  private async getStatusActive(): Promise<CharacteristicValue> {
    return this.get(CharacteristicKey.StatusActive);
  }

  private async onStatusActiveUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    const statusActive = value === this.getPrimitiveValue('valueStatusActive');
    if (!this.onUpdate(CharacteristicKey.StatusActive, statusActive)) {
      return;
    }

    if (statusActive) {
      this.logIfDesired(strings.accessory.statusActive);
    } else {
      this.log.warning(strings.accessory.statusInactive, this.name);
    }
  }
}
