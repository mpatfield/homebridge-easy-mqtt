import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings.js';

import { BaseAccessory } from '../accessory/abstract/base.js';

import { LightbulbAccessory } from '../accessory/onoff/lightbulb.js';
import { LockMechanismAccessory } from '../accessory/lock.js';
import { OutletAccessory } from '../accessory/onoff/outlet.js';
import { SecuritySystemAccessory } from '../accessory/security.js';
import { SwitchAccessory } from '../accessory/onoff/switch.js';
import { TemperatureSensorAccessory } from '../accessory/temperatureSensor.js';

import { setLanguage, strings } from '../i18n/i18n.js';

import { AccessoryType } from '../model/enums.js';
import * as Configs from '../model/types.js';

import { Log } from '../tools/log.js';
import getVersion from '../tools/version.js';
import { assert } from '../tools/validation.js';

export class HomebridgeEasyMQTT implements DynamicPlatformPlugin {

  private readonly log: Log;

  private readonly platformAccessories: Map<string, PlatformAccessory> = new Map();
  private readonly accessories: BaseAccessory<Configs.BaseAccessoryConfig>[] = [];

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
    this.platformAccessories.set(accessory.context.identifier, accessory);
  }

  private teardown() {
    this.accessories.forEach( accessory => {
      accessory.teardown();
    });
  }

  private async setup(): Promise<void> {

    if (!this.config.accessories) {
      this.config.accessories = [];
    }

    const keepIdentifiers = new Set<string>();

    for (const accessoryConfig of this.config.accessories as Configs.BaseAccessoryConfig[]) {

      if (!assert(this.log, PLATFORM_NAME, accessoryConfig, 'info') ||
        !assert(this.log, PLATFORM_NAME, accessoryConfig.info, 'name', 'type')) {
        continue;
      }

      const id = accessoryConfig.info.id ?? `${PLUGIN_NAME}:${accessoryConfig.info.type}:${accessoryConfig.info.name}`;
      const uuid = this.api.hap.uuid.generate(id);

      let platformAccessory = this.platformAccessories.get(uuid);
      if (!platformAccessory) {

        platformAccessory = new this.api.platformAccessory(accessoryConfig.info.name, uuid);
        platformAccessory.context.identifier = uuid;

        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [platformAccessory]);

        this.platformAccessories.set(uuid, platformAccessory);

        this.log.always(strings.startup.newAccessory, accessoryConfig.info.name);
      }

      const Service = this.api.hap.Service;
      const Characteristic = this.api.hap.Characteristic;

      let accessory: BaseAccessory<Configs.BaseAccessoryConfig>;
      switch(accessoryConfig.info.type) {
      case AccessoryType.Lightbulb:
        accessory = new LightbulbAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.LightbulbConfig, this.log);
        break;
      case AccessoryType.LockMechanism:
        accessory = new LockMechanismAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.LockMechanismConfig, this.log);
        break;
      case AccessoryType.Outlet:
        accessory = new OutletAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.OutletConfig, this.log);
        break;
      case AccessoryType.SecuritySystem:
        accessory = new SecuritySystemAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.SecuritySystemConfig, this.log);
        break;
      case AccessoryType.Switch:
        accessory = new SwitchAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.SwitchConfig, this.log);
        break;
      case AccessoryType.TemperatureSensor:
        accessory = new TemperatureSensorAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.TemperatureSensorConfig, this.log);
        break;
      default:
        this.log.error(strings.startup.unsupportedType, accessoryConfig.info.type);
        continue;
      }

      keepIdentifiers.add(uuid);
      this.accessories.push(accessory);
    }

    this.platformAccessories.forEach(accessory => {
      if (!keepIdentifiers.has(accessory.context.identifier)) {
        this.removeCachedAccessory(accessory);
      }
    });

    const randIndex = Math.floor(Math.random() * strings.startup.welcome.length);
    this.log.always(strings.startup.complete, strings.startup.welcome[randIndex]);
  }

  private removeCachedAccessory(accessory: PlatformAccessory) {
    this.log.always(strings.startup.removeAccessory, accessory.displayName);
    this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    this.platformAccessories.delete(accessory.context.identifier);
  }
}
