import { PrimitiveTypes } from 'homebridge';

import { BaseAccessory } from '../abstract/base.js';

import { strings } from '../../i18n/i18n.js';

import { ButtonConfig, MQTTAccessoryDependency } from '../../model/types.js';

export abstract class ButtonAccessory<C extends ButtonConfig = ButtonConfig> extends BaseAccessory<C> {

  constructor(dependency: MQTTAccessoryDependency<C>) {
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