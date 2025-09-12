import { PlatformAccessory } from 'homebridge';

import { BaseAccessory } from './base.js';

import { BaseAccessoryConfig, CharacteristicType, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';
import { createAccessory } from './helper.js';
import { PLATFORM_NAME } from '../../homebridge/settings.js';
import getVersion from '../../tools/version.js';

export class GroupAccessory {

  private readonly accessories: (BaseAccessory<BaseAccessoryConfig>)[] = [];

  constructor(
    Service: ServiceType,
    Characteristic: CharacteristicType,
    platformAccessory: PlatformAccessory,
    log: Log,
    name: string,
    configs: BaseAccessoryConfig[],
  ) {

    if (configs.length === 0) {
      throw new Error('Trying to create a group with no accessories');
    }

    platformAccessory.getService(Service.AccessoryInformation)!
      .setCharacteristic(Characteristic.Name, name)
      .setCharacteristic(Characteristic.ConfiguredName, name)
      .setCharacteristic(Characteristic.Manufacturer, configs[0].info.manufacturer ?? PLATFORM_NAME)
      .setCharacteristic(Characteristic.Model, configs[0].info.model ?? GroupAccessory.name)
      .setCharacteristic(Characteristic.SerialNumber, configs[0].info.serialNumber ?? name)
      .setCharacteristic(Characteristic.FirmwareRevision, configs[0].info.version ?? getVersion());

    const keepSubtypes = new Set<string>();

    for (const config of configs) {

      const accessory = createAccessory(Service, Characteristic, platformAccessory, config, log, true);
      if (!accessory) {
        continue;
      }

      keepSubtypes.add(accessory.subtype!);
      this.accessories.push(accessory);
    };

    for (const service of [...platformAccessory.services]) {
      if (service.subtype && !keepSubtypes.has(service.subtype)) {
        platformAccessory.removeService(service);
      }
    }
  }

  public teardown() {
    this.accessories.forEach( accessory => {
      accessory.teardown();
    });
  }
}