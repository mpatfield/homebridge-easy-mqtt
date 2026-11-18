import { PositionAccessory } from './position.js';

import { HKAccessoryType } from '../../model/homekit.js';
import { PositionConfig } from '../../model/types.js';

export class WindowAccessory extends PositionAccessory<PositionConfig> {

  protected getAccessoryType(): HKAccessoryType {
    return HKAccessoryType.Window;
  }
}