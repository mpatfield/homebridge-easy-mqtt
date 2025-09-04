import { PlatformAccessory, Service } from 'homebridge';

import { OnOffAccessory } from './onoff.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, OutletConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class OutletAccessory extends OnOffAccessory<OutletConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: OutletConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log);

    this.setup(CharacteristicKey.OutletInUse, false, 'topicGetOutletInUse',
      this.onUpdateNumericBoolean(CharacteristicKey.OutletInUse, 'valueOutletInUse', strings.outlet.inUse, strings.outlet.notInUse),
      false,
    );
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.Outlet) || this.accessory.addService(this.Service.Outlet);
  }
}