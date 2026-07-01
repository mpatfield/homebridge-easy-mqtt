import { ButtonAccessory } from './button.js';

import { AccessoryType } from '../../model/enums.js';
import { ButtonConfig } from '../../model/types.js';

export class StatelessButtonAccessory extends ButtonAccessory<ButtonConfig> {

  protected getButtonAccessoryType(): AccessoryType {
    return AccessoryType.StatelessProgrammableSwitch;
  }
}