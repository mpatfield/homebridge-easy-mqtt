import { CharacteristicValue, PrimitiveTypes } from 'homebridge';

import { BaseAccessory } from '../abstract/base.js';
import { MQTTAccessoryDependency } from '../abstract/mqtt.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { OnOffConfig } from '../../model/types.js';

export abstract class OnOffAccessory<C extends OnOffConfig = OnOffConfig> extends BaseAccessory<C> {

  constructor(dependency: MQTTAccessoryDependency<C>) {
    super(dependency);

    this.setup(CharacteristicKey.On, false,
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
      return future ? strings.onOff.stateOnFuture : strings.onOff.stateOn;
    } else {
      return future ? strings.onOff.stateOffFuture : strings.onOff.stateOff;
    }
  }
}
