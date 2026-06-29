import { OnOffAccessory } from './onoff.js';

import { MatterType } from '../../model/matter.js';
import { OutletConfig } from '../../model/types.js';

export class MatterOutletAccessory extends OnOffAccessory<OutletConfig> {

  override getMatterType(): MatterType {
    return MatterType.OnOffOutlet;
  }
}