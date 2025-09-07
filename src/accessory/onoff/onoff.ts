import { CharacteristicValue, PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { BaseAccessory } from '../abstract/base.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, OnOffConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export abstract class OnOffAccessory<C extends OnOffConfig = OnOffConfig> extends BaseAccessory<C> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: C, log: Log) {
    super(Service, Characteristic, accessory, config, log);

    this.setupCharacteristic(CharacteristicKey.On, false,
      'topicGetOn', this.onOnUpdate.bind(this), true,
      'topicSetOn', this.onSetOn.bind(this),
    );
  }

  private async onOnUpdate(topic: string, value: PrimitiveTypes): Promise<void> {
    const on = this.booleanForValue(value, 'valueOn', 'valueOff');
    if (on !== undefined) {
      this.onUpdate(CharacteristicKey.On, on, this.stringForState(on));
    }
  }

  private async onSetOn(value: CharacteristicValue) {
    const on = value ? this.getPrimitiveValue('valueOn') : this.getPrimitiveValue('valueOff');
    if (on !== undefined) {
      this.onSet(CharacteristicKey.On, value, on, 'topicSetOn', this.stringForState(value, true));
    }
  }

  private booleanForValue(value: PrimitiveTypes, positive: keyof C, negative: keyof C): boolean | undefined {

    let bool: boolean | undefined = undefined;
    if (value === this.getPrimitiveValue(positive)) {
      bool = true;
    } else if (value === this.getPrimitiveValue(negative)) {
      bool = false;
    }

    if (bool !== undefined) {
      return bool;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    this.logIfDesired(strings.onOff.unknownValue, `'${value}'`);
  }

  private stringForState(on: CharacteristicValue, future: boolean = false): string {
    if (on) {
      return future ? strings.onOff.stateFutureOn : strings.onOff.stateOn;
    } else {
      return future ? strings.onOff.stateFutureOff : strings.onOff.stateOff;
    }
  }
}
