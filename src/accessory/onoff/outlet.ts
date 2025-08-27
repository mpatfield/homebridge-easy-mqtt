import { CharacteristicValue, PlatformAccessory, PrimitiveTypes, Service } from 'homebridge';

import { OnOffAccessory } from './onoff.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, OutletConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class OutletAccessory extends OnOffAccessory<OutletConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: OutletConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log, OutletAccessory.name);

    this.set(CharacteristicKey.OutletInUse, false);

    this.accessoryService.getCharacteristic(this.Characteristic.OutletInUse)
      .onGet(this.getInUse.bind(this))
      .onSet(this.onSetInUse.bind(this));
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.Outlet) || this.accessory.addService(this.Service.Outlet);
  }

  override addTopicHandlers(): void {
    super.addTopicHandlers();
    this.addTopicHandler('topicGetOutletInUse', this.onInUseUpdate.bind(this), false);
  }

  private async getInUse(): Promise<CharacteristicValue> {
    return this.get(CharacteristicKey.OutletInUse);
  }

  private async onInUseUpdate(topic: string, value: PrimitiveTypes): Promise<void> {
    const inUse = value === this.getPrimitiveValue('valueOutletInUse');
    this.onUpdate(CharacteristicKey.OutletInUse, inUse, this.stringForInUse(inUse));
  }

  private async onSetInUse(value: CharacteristicValue) {

    const inUse = value ? this.getRawValue('valueOutletInUse') : this.getRawValue('valueOutletNotInUse');
    if (!inUse) {
      return;
    }

    this.onSet(CharacteristicKey.OutletInUse, inUse,'topicSetOutletInUse', this.stringForInUse(inUse, true));
  }

  private stringForInUse(inUse: CharacteristicValue, future: boolean = false): string {
    if (inUse) {
      return future ? strings.outlet.futureInUse : strings.outlet.inUse;
    } else {
      return future ? strings.outlet.futureNotInUse : strings.outlet.notInUse;
    }
  }
}