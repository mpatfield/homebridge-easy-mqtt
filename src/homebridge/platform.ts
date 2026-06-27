import { API, DynamicPlatformPlugin, Logger, PlatformAccessory } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings.js';

import { HomeKitAccessory } from '../homekit/abstract/base.js';
import { GroupAccessory } from '../homekit/abstract/group.js';
import { createHomeKitAccessory, createIdentifier } from '../homekit/abstract/helper.js';

import { initEveCharacteristics } from '../homekit/characteristic/eve.js';

import { setLanguage, strings } from '../i18n/i18n.js';

import { Protocol } from '../model/enums.js';
import { History } from '../model/history.js';
import { AccessoryDependency, BaseAccessoryConfig, PlatformConfig } from '../model/types.js';

import { Log } from '../tools/log.js';
import { Properties } from '../tools/properties.js';
import { assert, printableValues } from '../tools/validation.js';
import getVersion from '../tools/version.js';

export class HomebridgeEasyMQTT implements DynamicPlatformPlugin {

  private readonly log: Log;

  private readonly platformAccessories: Map<string, PlatformAccessory> = new Map();
  private readonly homekitAccessories: (HomeKitAccessory<BaseAccessoryConfig> | GroupAccessory)[] = [];

  constructor(
    logger: Logger,
    private readonly config: PlatformConfig,
    private readonly api: API,
  ) {

    setLanguage(api.user.configPath());

    this.log = new Log(logger, config.verbose);

    this.log.ifVerbose(
      'v%s | System %s | Node %s | HB v%s | HAPNodeJS v%s | Matter %s',
      getVersion(),
      process.platform,
      process.version,
      api.serverVersion,
      api.hap.HAPLibraryVersion(),
      !this.api.isMatterAvailable?.() ? 'unavailable' : ( !this.api.isMatterEnabled?.() ? 'disabled' : 'enabled' ),
    );

    this.api.on('didFinishLaunching', () => {
      this.setup();
    });

    this.api.on('shutdown', () => {
      this.teardown();
    });
  }

  configureAccessory(accessory: PlatformAccessory): void {
    this.log.ifVerbose(strings.startup.homekitRestoringAccessory, accessory.displayName);
    this.platformAccessories.set(accessory.context.identifier, accessory);
  }

  private teardown() {
    this.homekitAccessories.forEach( accessory => {
      accessory.teardown();
    });
  }

  private async setup(): Promise<void> {

    await Properties.initStorage(this.api.user.persistPath());

    if (!this.config.accessories) {
      this.config.accessories = [];
    }

    const keepHomeKitIdentifiers = new Set<string>();
    const homekitGroups = new Map<string, BaseAccessoryConfig[]>();

    for (const accessoryConfig of this.config.accessories) {

      if (!assert(this.log, PLATFORM_NAME, accessoryConfig, 'info') ||
        !assert(this.log, PLATFORM_NAME, accessoryConfig.info, 'name', 'type')) {
        continue;
      }

      if (accessoryConfig.info.protocol === undefined) {
        accessoryConfig.info.protocol = Protocol.HomeKit;
      }

      if (accessoryConfig.info.protocol === Protocol.HomeKit) {

        initEveCharacteristics(this.api);

        const groupName = accessoryConfig.info.group;
        if (groupName !== undefined) {

          const group = homekitGroups.get(groupName) ?? [];
          group.push(accessoryConfig);
          homekitGroups.set(groupName, group);

          continue;
        }

        const id = createIdentifier(accessoryConfig.info);
        const uuid = this.api.hap.uuid.generate(id);

        const platformAccessory = this.createHomeKitAccessory(accessoryConfig.info.name, uuid);
        const dependency: AccessoryDependency = {
          Service: this.api.hap.Service,
          Characteristic: this.api.hap.Characteristic,
          HapStatusError: this.api.hap.HapStatusError,
          platformAccessory,
          log: this.log,
          history: History.instance(this.api, this.log),
        };

        const accessory = createHomeKitAccessory(dependency, accessoryConfig);
        if (accessory === undefined) {
          continue;
        }

        keepHomeKitIdentifiers.add(uuid);
        this.homekitAccessories.push(accessory);

      } else if (accessoryConfig.info.protocol === Protocol.Matter) {
        // TODO

      } else {
        this.log.warning(strings.startup.unsupportedProtocol, `'${accessoryConfig.info.protocol}'`, printableValues(Protocol));
      }
    }

    for (const groupName of homekitGroups.keys()) {

      const uuid = this.api.hap.uuid.generate(groupName);
      const platformAccessory = this.createHomeKitAccessory(groupName, uuid);
      const dependency: AccessoryDependency = {
        Service: this.api.hap.Service,
        Characteristic: this.api.hap.Characteristic,
        HapStatusError: this.api.hap.HapStatusError,
        platformAccessory,
        log: this.log,
        history: History.instance(this.api, this.log),
      };

      const configs = homekitGroups.get(groupName)!;
      const groupAccessory = new GroupAccessory(dependency, groupName, configs);

      keepHomeKitIdentifiers.add(uuid);
      this.homekitAccessories.push(groupAccessory);
    }

    this.platformAccessories.forEach(accessory => {
      if (!keepHomeKitIdentifiers.has(accessory.context.identifier)) {
        this.removeHomeKitAccessory(accessory);
      }
    });

    this.log.always(strings.startup.complete);
  }

  private createHomeKitAccessory(name: string, uuid: string): PlatformAccessory {

    let platformAccessory = this.platformAccessories.get(uuid);
    if (!platformAccessory) {

      platformAccessory = new this.api.platformAccessory(name, uuid);
      platformAccessory.context.identifier = uuid;

      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [platformAccessory]);

      this.platformAccessories.set(uuid, platformAccessory);

      this.log.always(strings.startup.homekitNewAccessory, name);
    }

    if (name !== platformAccessory.displayName) {
      platformAccessory.updateDisplayName(name);
    }

    return platformAccessory;
  }

  private removeHomeKitAccessory(accessory: PlatformAccessory) {
    this.log.always(strings.startup.homekitRemoveAccessory, accessory.displayName);
    this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    this.platformAccessories.delete(accessory.context.identifier);
  }
}
