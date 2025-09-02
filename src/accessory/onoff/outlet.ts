import { CharacteristicValue, PlatformAccessory, PrimitiveTypes, Service } from 'homebridge';

import { OnOffAccessory } from './onoff.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, OutletConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class OutletAccessory extends OnOffAccessory<OutletConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: OutletConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log);

    this.set(CharacteristicKey.OutletInUse, false);
    this.bind(Characteristic.OutletInUse, 'topicGetOutletInUse', this.getInUse.bind(this));
    this.addTopicHandler('topicGetOutletInUse', this.onInUseUpdate.bind(this), false);
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.Outlet) || this.accessory.addService(this.Service.Outlet);
  }

  private async getInUse(): Promise<CharacteristicValue> {
    return this.get(CharacteristicKey.OutletInUse);
  }

  private async onInUseUpdate(topic: string, value: PrimitiveTypes): Promise<void> {
    const inUse = value === this.getPrimitiveValue('valueOutletInUse') ? 1 : 0;
    this.onUpdate(CharacteristicKey.OutletInUse, inUse, inUse ? strings.outlet.inUse : strings.outlet.notInUse);
  }
}