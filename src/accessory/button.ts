import { PrimitiveTypes } from 'homebridge';

import { BaseAccessory } from './abstract/base.js';
import { MQTTAccessoryDependency } from './abstract/mqtt.js';

import { strings } from '../i18n/i18n.js';

import { AccessoryType } from '../model/enums.js';
import { ButtonConfig } from '../model/types.js';

export class ButtonAccessory extends BaseAccessory<ButtonConfig> {

  constructor(dependency: MQTTAccessoryDependency<ButtonConfig>) {
    super(dependency);

    if (!this.assert('topicEventButtonPress')) {
      return;
    }

    if (!dependency.config.valueSinglePress && !dependency.config.valueDoublePress && !dependency.config.valueLongPress) {
      this.log.error(strings.button.noValues, this.name);
      return;
    }

    this.topicHandlers.push({ topic: dependency.config.topicEventButtonPress, handler: this.onPress.bind(this) });
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.StatelessProgrammableSwitch;
  }

  private async onPress(_topic: string, value: PrimitiveTypes): Promise<void> {

    let charValue: number;
    let logString: string;

    switch (value) {
    case this.getPrimitiveValue('valueSinglePress', false):
      charValue = this.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS;
      logString = strings.button.singlePress;
      break;
    case this.getPrimitiveValue('valueDoublePress', false):
      charValue = this.Characteristic.ProgrammableSwitchEvent.DOUBLE_PRESS;
      logString = strings.button.doublePress;
      break;
    case this.getPrimitiveValue('valueLongPress', false):
      charValue = this.Characteristic.ProgrammableSwitchEvent.LONG_PRESS;
      logString = strings.button.longPress;
      break;
    default:
      this.logIfDesired(strings.button.unknownValue, `'${value}'`);
      return;
    }

    this.service.updateCharacteristic(this.Characteristic.ProgrammableSwitchEvent, charValue);
    this.logIfDesired(logString);
  }
}