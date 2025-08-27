import { CharacteristicValue, PlatformAccessory, PrimitiveTypes, Service } from 'homebridge';

import { OnOffAccessory } from './onoff.js';
import { makeHandler, TopicHandler } from '../abstract/base.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicType, OutletConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class OutletAccessory extends OnOffAccessory<OutletConfig> {

  private inUse: CharacteristicValue = false;


  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: OutletConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log, OutletAccessory.name);

    this.accessoryService.getCharacteristic(this.Characteristic.OutletInUse)
      .onGet(this.getInUse.bind(this))
      .onSet(this.setInUse.bind(this));
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.Outlet) || this.accessory.addService(this.Service.Outlet);
  }

  override get topicHandlers(): TopicHandler[] {
    const topicHandlers = super.topicHandlers;

    if (this.config.topicGetOutletInUse) {
      topicHandlers.push(makeHandler(this.config.topicGetOutletInUse, this.onInUseUpdate.bind(this)));
    }

    return topicHandlers;
  }

  private async getInUse(): Promise<CharacteristicValue> {
    return this.inUse;
  }

  private async onInUseUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    const inUse = value === this.getPrimitiveValue('valueOutletInUse');
    if (inUse === this.inUse) {
      return;
    }

    this.inUse = inUse;
    this.accessoryService.updateCharacteristic(this.Characteristic.OutletInUse, this.inUse);

    this.logIfDesired(this.stringForInUse(this.inUse));
  }

  private async setInUse(value: CharacteristicValue) {

    if (!this.assert('topicSetOutletInUse', 'valueOutletInUse', 'valueOutletNotInUse')) {
      return;
    }

    const inUse = value ? this.config.valueOutletInUse : this.config.valueOutletNotInUse;

    this.inUse = value;

    this.logIfDesired(this.stringForInUse(this.inUse, true));

    this.accessoryService.updateCharacteristic(this.Characteristic.OutletInUse, this.inUse);

    this.publish(this.config.topicSetOutletInUse!, inUse!);
  }

  private stringForInUse(inUse: CharacteristicValue, future: boolean = false): string {
    if (inUse) {
      return future ? strings.outlet.futureInUse : strings.outlet.inUse;
    } else {
      return future ? strings.outlet.futureNotInUse : strings.outlet.notInUse;
    }
  }
}