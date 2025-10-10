import { OnOffAccessory } from './onoff.js';

import { MQTTAccessoryDependency } from '../abstract/mqtt.js';

import { AccessoryType } from '../../model/enums.js';
import { SwitchConfig } from '../../model/types.js';

export class SwitchAccessory extends OnOffAccessory<SwitchConfig> {

  constructor(dependency: MQTTAccessoryDependency<SwitchConfig>) {
    super(dependency);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.Switch;
  }
}