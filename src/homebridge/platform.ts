import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings.js';

import { MQTTAccessory } from '../accessory/abstract/mqtt.js';

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

  private readonly cachedAccessories: Map<string, PlatformAccessory> = new Map();
  private readonly mqttAccessories: MQTTAccessory<Configs.AccessoryConfig>[] = [];

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

    if (!this.config.accessories) {
      this.config.accessories = [];
    }

    const keepIdentifiers = new Set<string>();

    for (const accessoryConfig of this.config.accessories as Configs.AccessoryConfig[]) {

      if (!assert(this.log, PLATFORM_NAME, accessoryConfig, 'info') ||
        !assert(this.log, PLATFORM_NAME, accessoryConfig.info, 'name', 'type')) {
        continue;
      }

      const id = accessoryConfig.info.id ?? `${PLUGIN_NAME}:${accessoryConfig.info.type}:${accessoryConfig.info.name}`;
      const uuid = this.api.hap.uuid.generate(id);

      let accessory = this.cachedAccessories.get(uuid);
      if (!accessory) {

        accessory = new this.api.platformAccessory(accessoryConfig.info.name, uuid);
        accessory.context.identifier = uuid;

        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);

        this.cachedAccessories.set(uuid, accessory);

        this.log.always(strings.startup.newAccessory, accessoryConfig.info.name);
      }

      const Service = this.api.hap.Service;
      const Characteristic = this.api.hap.Characteristic;

      let mqttAccessory: MQTTAccessory<Configs.AccessoryConfig>;
      switch(accessoryConfig.info.type) {
      case AccessoryType.Lightbulb:
        mqttAccessory = new LightbulbAccessory(Service, Characteristic, accessory, accessoryConfig as Configs.LightbulbConfig, this.log);
        break;
      case AccessoryType.LockMechanism:
        mqttAccessory = new LockMechanismAccessory(Service, Characteristic, accessory, accessoryConfig as Configs.LockMechanismConfig, this.log);
        break;
      case AccessoryType.Outlet:
        mqttAccessory = new OutletAccessory(Service, Characteristic, accessory, accessoryConfig as Configs.OutletConfig, this.log);
        break;
      case AccessoryType.SecuritySystem:
        mqttAccessory = new SecuritySystemAccessory(Service, Characteristic, accessory, accessoryConfig as Configs.SecuritySystemConfig, this.log);
        break;
      case AccessoryType.Switch:
        mqttAccessory = new SwitchAccessory(Service, Characteristic, accessory, accessoryConfig as Configs.SwitchConfig, this.log);
        break;
      case AccessoryType.TemperatureSensor:
        mqttAccessory = new TemperatureSensorAccessory(Service, Characteristic, accessory, accessoryConfig as Configs.TemperatureSensorConfig, this.log);
        break;
      default:
        this.log.error(strings.startup.unsupportedType, accessoryConfig.info.type);
        continue;
      }

      keepIdentifiers.add(uuid);
      this.mqttAccessories.push(mqttAccessory);
    }

    this.cachedAccessories.forEach(accessory => {
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
    this.cachedAccessories.delete(accessory.context.identifier);
  }
}
