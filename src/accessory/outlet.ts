import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import { makeHandler, TopicHandler } from './base.js';
import { OnOffAccessory } from './onoff.js';

import { strings } from '../i18n/i18n.js';

import { CharacteristicType, OutletConfig, Primitive, ServiceType, toPrimitive } from '../model/types.js';

import { Log } from '../tools/log.js';

export class OutletAccessory extends OnOffAccessory {

  private inUse: CharacteristicValue = false;

  constructor(
    Service: ServiceType,
    Characteristic: CharacteristicType,
    accessory: PlatformAccessory,
    private readonly outletConfig: OutletConfig,
    log: Log,
  ) {
    super(Service, Characteristic, accessory, outletConfig, log, OutletAccessory.name);
  }

  protected getAccessoryService(): Service {

    const accessoryService = this.accessory.getService(this.Service.Outlet) || this.accessory.addService(this.Service.Outlet);

    accessoryService.getCharacteristic(this.Characteristic.OutletInUse)
      .onGet(this.getInUse.bind(this))
      .onSet(this.setInUse.bind(this));
    
    return accessoryService;
  }

  protected get topicHandlers(): TopicHandler[] {
    const topicHandlers = super.topicHandlers;
    if (this.outletConfig.topicGetInUse) {
      topicHandlers.push(makeHandler(this.outletConfig.topicGetInUse, this.onInUseUpdate.bind(this)));
    }
    return topicHandlers;
  }

  private async getInUse(): Promise<CharacteristicValue> {
    return this.inUse;
  }

  private async onInUseUpdate(topic: string, value: Primitive): Promise<void> {

    if (!this.assert('valueInUse')) {
      return;
    }

    const inUse = value === toPrimitive(this.outletConfig.valueInUse);
    if (inUse === this.inUse) {
      return;
    }

    this.inUse = inUse;
    this.accessoryService.updateCharacteristic(this.Characteristic.OutletInUse, this.inUse);

    this.logIfDesired(this.stringForInUse(this.inUse), this.outletConfig.info.name);
  }
  
  private async setInUse(value: CharacteristicValue) {
  
    if (!this.assert('topicSetInUse', 'valueInUse', 'valueNotInUse')) {
      return;
    }
  
    const inUse = value ? this.outletConfig.valueInUse : this.outletConfig.valueNotInUse;
  
    this.inUse = value;
  
    this.logIfDesired(this.stringForInUse(this.inUse, true), this.outletConfig.info.name);
  
    this.accessoryService.updateCharacteristic(this.Characteristic.OutletInUse, this.inUse);
  
    this.publish(this.outletConfig.topicSetInUse!, inUse!);
  }

  private stringForInUse(inUse: CharacteristicValue, future: boolean = false): string {
    if (inUse) {
      return future ? strings.outlet.futureInUse : strings.outlet.inUse;
    } else {
      return future ? strings.outlet.futureNotInUse : strings.outlet.notInUse;
    }
  }

}