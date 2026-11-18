import { OnOffAccessory } from './onoff.js';

import { HKAccessoryType } from '../../model/homekit.js';
import { SwitchConfig } from '../../model/types.js';

export class SwitchAccessory extends OnOffAccessory<SwitchConfig> {

  protected getAccessoryType(): HKAccessoryType {
    return HKAccessoryType.Switch;
  }
}