import { MatterElectricalAccessory } from './electrical.js';

import { MatterType } from '../../model/matter.js';
import { ElectricalSensorConfig } from '../../model/types.js';

export class MatterElectricalSensorAccessory extends MatterElectricalAccessory<ElectricalSensorConfig> {

  override getMatterType(): MatterType {
    return MatterType.ElectricalSensor;
  }
}