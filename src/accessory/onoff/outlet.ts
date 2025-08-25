import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import { OnOffAccessory } from './onoff.js';
import { makeHandler, TopicHandler } from '../abstract/base.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicType, OutletConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';
import { Primitive, toPrimitive } from '../../tools/primitive.js';

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

    this.accessoryService.getCharacteristic(this.Characteristic.OutletInUse)
      .onGet(this.getInUse.bind(this))
      .onSet(this.setInUse.bind(this));
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.Outlet) || this.accessory.addService(this.Service.Outlet);
  }

  override get topicHandlers(): TopicHandler[] {
    const topicHandlers = super.topicHandlers;

    if (this.outletConfig.topicGetOutletInUse) {
      topicHandlers.push(makeHandler(this.outletConfig.topicGetOutletInUse, this.onInUseUpdate.bind(this)));
    }

    return topicHandlers;
  }

  private async getInUse(): Promise<CharacteristicValue> {
    return this.inUse;
  }

  private async onInUseUpdate(topic: string, value: Primitive): Promise<void> {

    if (!this.assert('valueOutletInUse')) {
      return;
    }

    const inUse = value === toPrimitive(this.outletConfig.valueOutletInUse);
    if (inUse === this.inUse) {
      return;
    }

    this.inUse = inUse;
    this.accessoryService.updateCharacteristic(this.Characteristic.OutletInUse, this.inUse);

    this.logIfDesired(this.stringForInUse(this.inUse), this.name);
  }

  private async setInUse(value: CharacteristicValue) {

    if (!this.assert('topicSetOutletInUse', 'valueOutletInUse', 'valueOutletNotInUse')) {
      return;
    }

    const inUse = value ? this.outletConfig.valueOutletInUse : this.outletConfig.valueOutletNotInUse;

    this.inUse = value;

    this.logIfDesired(this.stringForInUse(this.inUse, true), this.name);

    this.accessoryService.updateCharacteristic(this.Characteristic.OutletInUse, this.inUse);

    this.publish(this.outletConfig.topicSetOutletInUse!, inUse!);
  }

  private stringForInUse(inUse: CharacteristicValue, future: boolean = false): string {
    if (inUse) {
      return future ? strings.outlet.futureInUse : strings.outlet.inUse;
    } else {
      return future ? strings.outlet.futureNotInUse : strings.outlet.notInUse;
    }
  }
}