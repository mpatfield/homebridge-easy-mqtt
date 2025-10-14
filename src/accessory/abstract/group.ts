import { BaseAccessory } from './base.js';

import { AccessoryDependency, BaseAccessoryConfig } from '../../model/types.js';

import { createAccessory } from './helper.js';
import { PLATFORM_NAME } from '../../homebridge/settings.js';
import getVersion from '../../tools/version.js';

export class GroupAccessory {

  private readonly accessories: (BaseAccessory<BaseAccessoryConfig>)[] = [];

  constructor(
    dependency: AccessoryDependency,
    name: string,
    configs: BaseAccessoryConfig[],
  ) {

    if (configs.length === 0) {
      throw new Error('Trying to create a group with no accessories');
    }

    dependency.platformAccessory.getService(dependency.Service.AccessoryInformation)!
      .setCharacteristic(dependency.Characteristic.Name, name)
      .setCharacteristic(dependency.Characteristic.ConfiguredName, name)
      .setCharacteristic(dependency.Characteristic.Manufacturer, configs[0].info.manufacturer ?? PLATFORM_NAME)
      .setCharacteristic(dependency.Characteristic.Model, configs[0].info.model ?? GroupAccessory.name)
      .setCharacteristic(dependency.Characteristic.SerialNumber, configs[0].info.serialNumber ?? name)
      .setCharacteristic(dependency.Characteristic.FirmwareRevision, configs[0].info.version ?? getVersion());

    const keepSubtypes = new Set<string>();

    for (const config of configs) {

      const accessory = createAccessory(dependency, config, true);
      if (!accessory) {
        continue;
      }

      keepSubtypes.add(accessory.subtype!);
      this.accessories.push(accessory);
    };

    for (const service of [...dependency.platformAccessory.services]) {
      if (service.subtype && !keepSubtypes.has(service.subtype)) {
        dependency.platformAccessory.removeService(service);
      }
    }
  }

  public teardown() {
    this.accessories.forEach( accessory => {
      accessory.teardown();
    });
  }
}