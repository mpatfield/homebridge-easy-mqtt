import { PlatformAccessory, Service } from 'homebridge';

import { Common, PublishHandler } from '../abstract/common.js';

import { AddonType } from '../../model/enums.js';
import { AddonConfig, CharacteristicType, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';
import { assert } from '../../tools/validation.js';

type AddonConstructor<C extends AddonConfig, A extends Addon<C>> =
  new (service: Service, Characteristic: CharacteristicType, name: string, config: C, log: Log, disableLogging: boolean, publishHandler: PublishHandler) => A;

export abstract class Addon<C extends AddonConfig> extends Common<C> {

  static new<C extends AddonConfig, A extends Addon<C>>(
    Service: ServiceType,
    Characteristic: CharacteristicType,
    accessory: PlatformAccessory,
    name: string,
    config: C,
    log: Log,
    disableLogging: boolean,
    publishHandler: PublishHandler,
    addonType: AddonType,
    constructor: AddonConstructor<C, A>,
    required: (keyof C)[],
  ): A | undefined {

    const serviceInstance = Service[addonType];
    const existingService = accessory.getService(serviceInstance);

    if (required.filter( (key) => config[key] !== undefined ).length === 0
        || !assert(log, name, config, ...required)) {
      if (existingService !== undefined) {
        accessory.removeService(existingService);
      }
      return;
    }

    const service = existingService ?? accessory.addService(serviceInstance);
    return new constructor(service, Characteristic, name, config, log, disableLogging, publishHandler);
  }

  protected constructor(
    protected readonly service: Service,
    Characteristic: CharacteristicType,
    name: string,
    config: C,
    log: Log,
    disableLogging: boolean,
    publishHandler: PublishHandler,
  ) {
    super(Characteristic, config, log, name, disableLogging, publishHandler);
  }
}