import { OnOffAccessory } from './onoff.js';

import { MatterType } from '../../model/matter.js';
import { SwitchConfig } from '../../model/types.js';

export class MatterSwitchAccessory extends OnOffAccessory<SwitchConfig> {

  override getMatterType(): MatterType {
    return MatterType.OnOffSwitch;
  }
}