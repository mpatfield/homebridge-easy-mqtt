import { API, DynamicPlatformPlugin, Logger, MatterAccessory, PlatformAccessory } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings.js';

import { HomeKitAccessory } from '../homekit/abstract/base.js';
import { GroupAccessory } from '../homekit/abstract/group.js';
import { createHomeKitAccessory, createIdentifier } from '../homekit/abstract/helper.js';
import { initEveCharacteristics } from '../homekit/characteristic/eve.js';

import { setLanguage, strings } from '../i18n/i18n.js';

import { BaseMatterAccessory } from '../matter/abstract/base.js';
import { createMatterAccessory } from '../matter/helper.js';

import { Protocol } from '../model/enums.js';
import { History } from '../model/history.js';
import { HomeKitAccessoryDependency } from '../model/homekit.js';
import { BaseAccessoryConfig, PlatformConfig } from '../model/types.js';

import { Log } from '../tools/log.js';
import { Properties } from '../tools/properties.js';
import { assert, printableValues } from '../tools/validation.js';
import getVersion from '../tools/version.js';

export class HomebridgeEasyMQTT implements DynamicPlatformPlugin {

  private readonly log: Log;

  private readonly homekitPlatformAccessories: Map<string, PlatformAccessory> = new Map();
  private readonly homekitAccessories: (HomeKitAccessory<BaseAccessoryConfig> | GroupAccessory)[] = [];

  private readonly matterPlatformAccessories: Map<string, MatterAccessory> = new Map();
  private readonly matterAccessories: (BaseMatterAccessory<BaseAccessoryConfig>)[] = [];

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

    this.api.on('didFinishLaunching', () => this.setup());

    this.api.on('shutdown', () => this.teardown());
  }

  configureAccessory(accessory: PlatformAccessory): void {
    this.log.ifVerbose(strings.startup.homekitRestoringAccessory, accessory.displayName);
    this.homekitPlatformAccessories.set(accessory.context.identifier, accessory);
  }

  configureMatterAccessory(accessory: MatterAccessory) {
    this.log.ifVerbose(strings.startup.matterRestoringAccessory, accessory.displayName);
    this.matterPlatformAccessories.set(accessory.UUID, accessory);
  }

  private teardown() {
    this.homekitAccessories.forEach(accessory => accessory.teardown());
    this.matterAccessories.forEach(accessory => accessory.teardown());
  }

  private async setup(): Promise<void> {

    await Properties.initStorage(this.api.user.persistPath());

    if (!this.config.accessories) {
      this.config.accessories = [];
    }

    const homekitKeepIdentifiers = new Set<string>();
    const homekitGroups = new Map<string, BaseAccessoryConfig[]>();

    const matterKeepIdentifiers = new Set<string>();

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

        const platformAccessory = this.createHomeKitPlatformAccessory(accessoryConfig.info.name, uuid);
        const dependency: HomeKitAccessoryDependency = {
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

        homekitKeepIdentifiers.add(uuid);
        this.homekitAccessories.push(accessory);

      } else if (accessoryConfig.info.protocol === Protocol.Matter) {

        if (!this.api.isMatterAvailable?.()) {
          this.log.warning(strings.startup.matterUnavailable, PLATFORM_NAME);
          continue;
        }

        if (!this.api.isMatterEnabled?.()) {
          this.log.warning(strings.startup.matterDisabled, PLATFORM_NAME);
          continue;
        }

        if (accessoryConfig.info.group) {
          this.log.warning(strings.startup.matterGroups);
          continue;
        }

        if (!this.api.matter) {
          throw new Error('Unable to get MatterAPI instance');
        }

        const accessory = createMatterAccessory({
          matter: this.api.matter,
          config: accessoryConfig,
          log: this.log,
        });

        if (accessory === undefined) {
          continue;
        }

        await this.registerMatterPlatformAccessory(accessory.toMatterAccessory());

        matterKeepIdentifiers.add(accessory.UUID);
        this.matterAccessories.push(accessory);

      } else {
        this.log.warning(strings.startup.unsupportedProtocol, `'${accessoryConfig.info.protocol}'`, printableValues(Protocol));
      }
    }

    for (const groupName of homekitGroups.keys()) {

      const uuid = this.api.hap.uuid.generate(groupName);
      const platformAccessory = this.createHomeKitPlatformAccessory(groupName, uuid);
      const dependency: HomeKitAccessoryDependency = {
        Service: this.api.hap.Service,
        Characteristic: this.api.hap.Characteristic,
        HapStatusError: this.api.hap.HapStatusError,
        platformAccessory,
        log: this.log,
        history: History.instance(this.api, this.log),
      };

      const configs = homekitGroups.get(groupName)!;
      const groupAccessory = new GroupAccessory(dependency, groupName, configs);

      homekitKeepIdentifiers.add(uuid);
      this.homekitAccessories.push(groupAccessory);
    }

    this.homekitPlatformAccessories.forEach(accessory => {
      if (!homekitKeepIdentifiers.has(accessory.context.identifier)) {
        this.removeHomeKitPlatformAccessory(accessory);
      }
    });

    this.matterPlatformAccessories.forEach(async accessory => {
      if (!matterKeepIdentifiers.has(accessory.UUID)) {
        await this.removeMatterPlatformAccessory(accessory);
      }
    });

    this.log.always(strings.startup.complete);
  }

  private createHomeKitPlatformAccessory(name: string, uuid: string): PlatformAccessory {

    let platformAccessory = this.homekitPlatformAccessories.get(uuid);
    if (!platformAccessory) {

      platformAccessory = new this.api.platformAccessory(name, uuid);
      platformAccessory.context.identifier = uuid;

      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [platformAccessory]);

      this.homekitPlatformAccessories.set(uuid, platformAccessory);

      this.log.always(strings.startup.homekitNewAccessory, name);
    }

    if (name !== platformAccessory.displayName) {
      platformAccessory.updateDisplayName(name);
    }

    return platformAccessory;
  }

  private async registerMatterPlatformAccessory(accessory: MatterAccessory) {
    if (!this.matterPlatformAccessories.has(accessory.UUID)) {
      this.log.always(strings.startup.matterNewAccessory, accessory.displayName);
    }
    this.matterPlatformAccessories.set(accessory.UUID, accessory);
    await this.api.matter?.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
  }

  private removeHomeKitPlatformAccessory(accessory: PlatformAccessory) {
    this.log.always(strings.startup.homekitRemoveAccessory, accessory.displayName);
    this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    this.homekitPlatformAccessories.delete(accessory.context.identifier);
  }

  private async removeMatterPlatformAccessory(accessory: MatterAccessory) {
    this.log.always(strings.startup.matterRemoveAccessory, accessory.displayName);
    await this.api.matter?.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    this.matterPlatformAccessories.delete(accessory.UUID);
  }
}
