import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings.js';

import { setLanguage } from '../i18n/i18n.js';

import { Log } from '../tools/log.js';
import getVersion from '../tools/version.js';
import { LockAccessory } from '../accessory/lock.js';

export class HomebridgeEasyMQTT implements DynamicPlatformPlugin {

  private readonly log: Log;

  private readonly Service;
  private readonly Characteristic;

  private readonly accessories: Map<string, PlatformAccessory> = new Map();

  constructor(
    logger: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {

    const userLang = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0];
    setLanguage(userLang);

    this.Service = this.api.hap.Service;
    this.Characteristic = this.api.hap.Characteristic;

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
    // TODO this.log.always(strings.startup.restoringDevice, accessory.displayName);
    this.accessories.set(accessory.context.identifier, accessory);
  }

  private teardown() {
    // TODO stop timers?
  }

  private async setup(): Promise<void> {
   
    const keepIdentifiers = new Set<string>();

    // const locks = this.config.locks;
    
    // locks?.forEach( (legacyConfig: LegacyAccessoryConfig) => {
    const id = 'foobar'; // LegacyAccessory.identifier(legacyConfig);
    keepIdentifiers.add(id);

    let accessory = this.accessories.get(id);
    if (!accessory) {

      const name = 'Bathroom Lock'; // legacyConfig.name;
      // TODO this.log.always(strings.startup.newAccessory, name);

      const uuid = this.api.hap.uuid.generate(id);

      accessory = new this.api.platformAccessory(name, uuid);
      accessory.context.identifier = id;

      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);

      this.accessories.set(id, accessory);
    }

    new LockAccessory(this.log, accessory, this.api.hap.Service, this.api.hap.Characteristic, this.api.user.persistPath());
    // });

    this.accessories.forEach(accessory => {
      if (!keepIdentifiers.has(accessory.context.identifier)) {
        this.removeAccessory(accessory);
      }
    });

    // TODO
    // const randIndex = Math.floor(Math.random() * strings.startup.welcome.length);
    // this.log.always(strings.startup.setupComplete, strings.startup.welcome[randIndex]);
  }
  
  private removeAccessory(accessory: PlatformAccessory) {
    // TODO this.log.always(strings.startup.removeAccessory, accessory.displayName);
    this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    this.accessories.delete(accessory.context.identifier);
  }
}
