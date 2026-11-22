import { MatterElectricalAccessory } from './electrical.js';

import { MatterType } from '../../model/matter.js';
import { ElectricalMeterConfig } from '../../model/types.js';

export class MatterElectricalMeterAccessory extends MatterElectricalAccessory<ElectricalMeterConfig> {

  override getMatterType(): MatterType {
    return MatterType.ElectricalMeter;
  }
}