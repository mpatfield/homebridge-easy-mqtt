import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings.js';

import { MQTTAccessory } from '../accessory/base.js';
import { LockAccessory } from '../accessory/lock.js';

import { setLanguage, strings } from '../i18n/i18n.js';

import { AccessoryConfig, LockConfig } from '../model/types.js';

import { Log } from '../tools/log.js';
import getVersion from '../tools/version.js';

export class HomebridgeEasyMQTT implements DynamicPlatformPlugin {

  private readonly log: Log;

  private readonly cachedAccessories: Map<string, PlatformAccessory> = new Map();
  private readonly mqttAccessories: Set<MQTTAccessory> = new Set();

  constructor(
    logger: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
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

    this.api.on('didFinishLaunching', () => {
      this.setup();
    });

    this.api.on('shutdown', () => {
      this.teardown();
    });
  }

  configureAccessory(accessory: PlatformAccessory): void {
    this.log.always(strings.startup.restoringAccessory, accessory.displayName);
    this.cachedAccessories.set(accessory.context.identifier, accessory);
  }

  private teardown() {
    this.mqttAccessories.forEach( accessory => {
      accessory.teardown();
    });
  }

  private async setup(): Promise<void> {
   
    const keepIdentifiers = new Set<string>();

    for (const accessoryConfig of this.config.accessories as AccessoryConfig[]) {

      const uuid = this.api.hap.uuid.generate(`${PLUGIN_NAME}:${accessoryConfig.info.type}:${accessoryConfig.info.name}`);

      let accessory = this.cachedAccessories.get(uuid);
      if (!accessory) {

        accessory = new this.api.platformAccessory(accessoryConfig.info.name, uuid);
        accessory.context.identifier = uuid;

        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);

        this.cachedAccessories.set(uuid, accessory);
      }

      const Service = this.api.hap.Service;
      const Characteristic = this.api.hap.Characteristic;
      const persistPath = this.api.user.persistPath();

      let mqttAccessory: MQTTAccessory;
      switch(accessoryConfig.info.type) {
      case this.api.hap.Service.LockMechanism.name:
        mqttAccessory = await LockAccessory.new(Service, Characteristic, accessory, accessoryConfig as LockConfig, persistPath, this.log);
        break;
      default:
        this.log.error(strings.startup.unsupportedType, accessoryConfig.info.type);
        continue;
      }

      keepIdentifiers.add(uuid);

      this.mqttAccessories.add(mqttAccessory);

      this.log.always(strings.startup.newAccessory, accessoryConfig.info.name);
    }

    this.cachedAccessories.forEach(accessory => {
      if (!keepIdentifiers.has(accessory.context.identifier)) {
        this.removeAccessory(accessory);
      }
    });

    const randIndex = Math.floor(Math.random() * strings.startup.welcome.length);
    this.log.always(strings.startup.complete, strings.startup.welcome[randIndex]);
  }
  
  private removeAccessory(accessory: PlatformAccessory) {
    this.log.always(strings.startup.removeAccessory, accessory.displayName);
    this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    this.cachedAccessories.delete(accessory.context.identifier);
  }
}
