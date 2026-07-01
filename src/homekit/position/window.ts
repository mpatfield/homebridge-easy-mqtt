import { PositionAccessory } from './position.js';

import { AccessoryType } from '../../model/enums.js';
import { PositionConfig } from '../../model/types.js';

export class WindowAccessory extends PositionAccessory<PositionConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.Window;
  }
}