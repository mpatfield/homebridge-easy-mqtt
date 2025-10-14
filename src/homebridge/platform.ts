import { API, DynamicPlatformPlugin, Logger, PlatformAccessory } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings.js';

import { BaseAccessory } from '../accessory/abstract/base.js';
import { GroupAccessory } from '../accessory/abstract/group.js';
import { createAccessory, createIdentifier } from '../accessory/abstract/helper.js';

import { initEveCharacteristics } from '../accessory/characteristic/eve.js';

import { setLanguage, strings } from '../i18n/i18n.js';

import { AccessoryDependency, BaseAccessoryConfig, PlatformConfig } from '../model/types.js';

import { History } from '../model/history.js';
import { Log } from '../tools/log.js';
import { Properties } from '../tools/properties.js';
import { assert } from '../tools/validation.js';
import getVersion from '../tools/version.js';

export class HomebridgeEasyMQTT implements DynamicPlatformPlugin {

  private readonly log: Log;

  private readonly platformAccessories: Map<string, PlatformAccessory> = new Map();
  private readonly accessories: (BaseAccessory<BaseAccessoryConfig> | GroupAccessory)[] = [];

  constructor(
    logger: Logger,
    private readonly config: PlatformConfig,
    private readonly api: API,
  ) {

    const userLang = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0];
    setLanguage(userLang);

    this.log = new Log(logger, config.verbose);

    this.log.always(
      'v%s | System %s | Node %s | HB v%s | HAPNodeJS v%s',
      getVersion(),
      process.platform,
      process.version,
      api.serverVersion,
      api.hap.HAPLibraryVersion(),
    );

    initEveCharacteristics(api);

    this.api.on('didFinishLaunching', () => {
      this.setup();
    });

    this.api.on('shutdown', () => {
      this.teardown();
    });
  }

  configureAccessory(accessory: PlatformAccessory): void {
    this.log.always(strings.startup.restoringAccessory, accessory.displayName);
    this.platformAccessories.set(accessory.context.identifier, accessory);
  }

  private teardown() {
    this.accessories.forEach( accessory => {
      accessory.teardown();
    });
  }

  private async setup(): Promise<void> {

    await Properties.initStorage(this.api.user.persistPath());

    if (!this.config.accessories) {
      this.config.accessories = [];
    }

    const keepIdentifiers = new Set<string>();
    const groups = new Map<string, BaseAccessoryConfig[]>();

    const Service = this.api.hap.Service;
    const Characteristic = this.api.hap.Characteristic;

    const history = new History(this.api, this.log);

    for (const accessoryConfig of this.config.accessories) {

      if (!assert(this.log, PLATFORM_NAME, accessoryConfig, 'info') ||
        !assert(this.log, PLATFORM_NAME, accessoryConfig.info, 'name', 'type')) {
        continue;
      }

      const groupName = accessoryConfig.info.group;
      if (groupName !== undefined) {

        const group = groups.get(groupName) ?? [];
        group.push(accessoryConfig);
        groups.set(groupName, group);

        continue;
      }

      const id = createIdentifier(accessoryConfig.info);
      const uuid = this.api.hap.uuid.generate(id);

      const platformAccessory = this.createPlatformAccessory(accessoryConfig.info.name, uuid);
      const dependency: AccessoryDependency = { Service, Characteristic, platformAccessory, log: this.log, history: history };

      const accessory = createAccessory(dependency, accessoryConfig);

      if (accessory === undefined) {
        continue;
      }

      keepIdentifiers.add(uuid);
      this.accessories.push(accessory);
    }

    for (const groupName of groups.keys()) {

      const uuid = this.api.hap.uuid.generate(groupName);
      const platformAccessory = this.createPlatformAccessory(groupName, uuid);
      const dependency: AccessoryDependency = { Service, Characteristic, platformAccessory, log: this.log, history: history };

      const configs = groups.get(groupName)!;

      const groupAccessory = new GroupAccessory(dependency, groupName, configs);

      keepIdentifiers.add(uuid);
      this.accessories.push(groupAccessory);
    }

    this.platformAccessories.forEach(accessory => {
      if (!keepIdentifiers.has(accessory.context.identifier)) {
        this.removeCachedAccessory(accessory);
      }
    });

    const randIndex = Math.floor(Math.random() * strings.startup.welcome.length);
    this.log.always(`${strings.startup.complete}\n${strings.startup.welcome[randIndex]}`);
  }

  private createPlatformAccessory(name: string, uuid: string): PlatformAccessory {

    let platformAccessory = this.platformAccessories.get(uuid);
    if (!platformAccessory) {

      platformAccessory = new this.api.platformAccessory(name, uuid);
      platformAccessory.context.identifier = uuid;

      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [platformAccessory]);

      this.platformAccessories.set(uuid, platformAccessory);

      this.log.always(strings.startup.newAccessory, name);
    }

    return platformAccessory;
  }

  private removeCachedAccessory(accessory: PlatformAccessory) {
    this.log.always(strings.startup.removeAccessory, accessory.displayName);
    this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    this.platformAccessories.delete(accessory.context.identifier);
  }
}
