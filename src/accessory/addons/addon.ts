import { PrimitiveTypes, Service } from 'homebridge';

import { Common } from '../abstract/common.js';
import { MQTTAccessory } from '../abstract/mqtt.js';

import { AddonType } from '../../model/enums.js';
import { AddonConfig, CharacteristicType, MQTTAccessoryConfig } from '../../model/types.js';

import { Log } from '../../tools/log.js';

type AddonConstructor<C extends AddonConfig, A extends Addon<C>> =
  new (
    service: Service,
    parentAccessory: MQTTAccessory<MQTTAccessoryConfig>,
    config: C,
  ) => A;

type AddonServiceType = typeof import('homebridge').Service[AddonType];

export abstract class Addon<C extends AddonConfig> extends Common<C> {

  static new<C extends AddonConfig, A extends Addon<C>>(
    parentAccessory: MQTTAccessory<MQTTAccessoryConfig>,
    addonServiceInstance: AddonServiceType,
    config: C,
    keys: (keyof C)[],
    constructor: AddonConstructor<C, A>,
  ): A | undefined {

    const existingAddonService = parentAccessory.platformAccessory.getService(addonServiceInstance);

    if (keys.filter( (key) => config[key] !== undefined ).length === 0) {
      if (existingAddonService !== undefined) {
        parentAccessory.platformAccessory.removeService(existingAddonService);
      }
      return;
    }

    const addonService = existingAddonService ?? parentAccessory.platformAccessory.addService(addonServiceInstance);

    if (existingAddonService === undefined) {
      parentAccessory.service.addLinkedService(addonService);
    }

    return new constructor(addonService, parentAccessory, config);
  }

  protected constructor(
    private readonly parentAccessory: MQTTAccessory<MQTTAccessoryConfig>,
    private readonly addonService: Service,
    private readonly addonConfig: C,
  ) {
    super(parentAccessory.name);
  }

  protected get service(): Service {
    return this.addonService;
  }

  protected get Characteristic(): CharacteristicType {
    return this.parentAccessory.Characteristic;
  }

  protected get log(): Log {
    return this.parentAccessory.log;
  }

  protected get disableLogging(): boolean {
    return this.parentAccessory.disableLogging;
  }

  protected get config(): C {
    return this.addonConfig;
  }

  protected get identifier(): string {
    return `${this.parentAccessory.identifier}:${this.addonService.UUID}`;
  }

  protected get useStoredProperties(): boolean {
    return this.parentAccessory.useStoredProperties;
  }

  protected publish(rawTopic: string, value: PrimitiveTypes): void {
    return this.parentAccessory.publish(rawTopic, value);
  }
}