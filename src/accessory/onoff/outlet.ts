import { PlatformAccessory } from 'homebridge';

import { OnOffAccessory } from './onoff.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, OutletConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class OutletAccessory extends OnOffAccessory<OutletConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: OutletConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log);

    this.setupCharacteristic(CharacteristicKey.OutletInUse, false, 'topicGetOutletInUse',
      this.bindOnUpdateNumericBoolean(CharacteristicKey.OutletInUse, 'valueOutletInUse', strings.outlet.inUse, strings.outlet.notInUse),
      false,
    );
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.Outlet;
  }
}