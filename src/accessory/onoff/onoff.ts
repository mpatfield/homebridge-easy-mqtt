import { BaseAccessory } from '../abstract/base.js';
import { strings } from '../../i18n/i18n.js';

import { HKCharacteristicKey } from '../../model/enums.js';
import { MQTTAccessoryDependency, OnOffConfig } from '../../model/types.js';

export abstract class OnOffAccessory<C extends OnOffConfig = OnOffConfig> extends BaseAccessory<C> {

  constructor(dependency: MQTTAccessoryDependency<C>) {
    super(dependency);

    this.setup(HKCharacteristicKey.On, false,
      'topicGetOn',
      this.bindOnUpdateBoolean(HKCharacteristicKey.On, 'valueOn', 'valueOff', strings.onOff.stateOn, strings.onOff.stateOff),
      true,
      'topicSetOn',
      this.bindOnSetBoolean(HKCharacteristicKey.On, 'topicSetOn', 'valueOn', 'valueOff', true, strings.onOff.stateOnFuture, strings.onOff.stateOffFuture),
    );
  }
}
