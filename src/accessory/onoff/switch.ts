import { PlatformAccessory, Service } from 'homebridge';

import { OnOffAccessory } from './onoff.js';

import { CharacteristicType, ServiceType, SwitchConfig } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class SwitchAccessory extends OnOffAccessory<SwitchConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: SwitchConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log, SwitchAccessory.name);
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.Switch) || this.accessory.addService(this.Service.Switch);
  }
}