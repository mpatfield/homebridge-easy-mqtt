import { PlatformAccessory, Service } from 'homebridge';

import { Common, PublishHandler } from '../abstract/common.js';

import { AddonType } from '../../model/enums.js';
import { AddonConfig, CharacteristicType, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';
import { assert } from '../../tools/validation.js';

type AddonConstructor<C extends AddonConfig, A extends Addon<C>> =
  new (service: Service, Characteristic: CharacteristicType, log: Log, disableLogging: boolean, config: C, name: string, publishHandler: PublishHandler) => A;

export abstract class Addon<C extends AddonConfig> extends Common<C> {

  static new<C extends AddonConfig, A extends Addon<C>>(
    Service: ServiceType,
    Characteristic: CharacteristicType,
    accessory: PlatformAccessory,
    parentService: Service,
    name: string,
    config: C,
    log: Log,
    disableLogging: boolean,
    publishHandler: PublishHandler,
    addonType: AddonType,
    constructor: AddonConstructor<C, A>,
    required: (keyof C)[],
  ): A | undefined {

    const addonServiceInstance = Service[addonType];
    const existingAddonService = accessory.getService(addonServiceInstance);

    if (required.filter( (key) => config[key] !== undefined ).length === 0 || !assert(log, name, config, ...required)) {
      if (existingAddonService !== undefined) {
        accessory.removeService(existingAddonService);
      }
      return;
    }

    const addonService = existingAddonService ?? accessory.addService(addonServiceInstance);

    if (existingAddonService === undefined) {
      parentService.addLinkedService(addonService);
    }

    return new constructor(addonService, Characteristic, log, disableLogging, config, name, publishHandler);
  }

  protected constructor(
    protected readonly service: Service,
    Characteristic: CharacteristicType,
    log: Log,
    disableLogging: boolean,
    config: C,
    name: string,
    publishHandler: PublishHandler,
  ) {
    super(Characteristic, log, disableLogging, config, name, publishHandler);
  }
}