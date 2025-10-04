import { CharacteristicValue, PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { BaseAccessory } from './abstract/base.js';

import { AccessoryType } from '../model/enums.js';
import { ButtonConfig, CharacteristicType, ServiceType } from '../model/types.js';

import { Log } from '../tools/log.js';
import { strings } from '../i18n/i18n.js';

export class ButtonAccessory extends BaseAccessory<ButtonConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: ButtonConfig, log: Log, isGrouped: boolean) {
    super(Service, Characteristic, accessory, config, log, isGrouped);

    const Event = Characteristic.ProgrammableSwitchEvent;
    const items: {topic: string | undefined, value: CharacteristicValue, logString: string }[] = [
      { topic: config.topicEventSinglePress, value: Event.SINGLE_PRESS, logString: strings.button.singlePress },
      { topic: config.topicEventDoublePress, value: Event.DOUBLE_PRESS, logString: strings.button.doublePress },
      { topic: config.topicEventLongPress, value: Event.LONG_PRESS, logString: strings.button.longPress },
    ];

    for (const item of items) {

      if (item.topic === undefined) {
        continue;
      }

      const handler = this.bindOnPress(item.value, item.logString);
      this.topicHandlers.push({ topic: item.topic, handler: handler });
    }
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.StatelessProgrammableSwitch;
  }

  private bindOnPress(value: CharacteristicValue, logString: string): (topic: string, value: PrimitiveTypes) => (Promise<void>) {
    return (async () => {
      this.service.updateCharacteristic(this.Characteristic.ProgrammableSwitchEvent, value);
      this.logIfDesired(logString);
    }).bind(this);
  }
}