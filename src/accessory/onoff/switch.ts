import { PlatformAccessory } from 'homebridge';

import { OnOffAccessory } from './onoff.js';

import { AccessoryType } from '../../model/enums.js';
import { CharacteristicType, ServiceType, SwitchConfig } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class SwitchAccessory extends OnOffAccessory<SwitchConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: SwitchConfig, log: Log, isGrouped: boolean) {
    super(Service, Characteristic, accessory, config, log, isGrouped);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.Switch;
  }
}