import { ButtonAccessory } from './button.js';

import { HKAccessoryType } from '../../model/homekit.js';
import { ButtonConfig } from '../../model/types.js';

export class StatelessButtonAccessory extends ButtonAccessory<ButtonConfig> {

  protected getButtonAccessoryType(): HKAccessoryType {
    return HKAccessoryType.StatelessProgrammableSwitch;
  }
}