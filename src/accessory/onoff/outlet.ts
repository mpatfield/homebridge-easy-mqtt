import { OnOffAccessory } from './onoff.js';

import { MQTTAccessoryDependency } from '../abstract/mqtt.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { OutletConfig } from '../../model/types.js';

export class OutletAccessory extends OnOffAccessory<OutletConfig> {

  constructor(dependency: MQTTAccessoryDependency<OutletConfig>) {
    super(dependency);

    this.setup(CharacteristicKey.OutletInUse, false, 'topicGetOutletInUse',
      this.bindOnUpdateNumericBoolean(CharacteristicKey.OutletInUse, 'valueOutletInUse', strings.outlet.inUse, strings.outlet.notInUse),
      false,
    );
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.Outlet;
  }
}