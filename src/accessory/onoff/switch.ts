import { OnOffAccessory } from './onoff.js';

import { AccessoryType } from '../../model/enums.js';
import { MQTTAccessoryDependency, SwitchConfig } from '../../model/types.js';

export class SwitchAccessory extends OnOffAccessory<SwitchConfig> {

  constructor(dependency: MQTTAccessoryDependency<SwitchConfig>) {
    super(dependency);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.Switch;
  }
}