import { OnOffAccessory } from './onoff.js';

import { strings } from '../../i18n/i18n.js';

import { HKAccessoryType, HKCharacteristicKey, MQTTAccessoryDependency } from '../../model/homekit.js';
import { OutletConfig } from '../../model/types.js';

export class OutletAccessory extends OnOffAccessory<OutletConfig> {

  protected getAccessoryType(): HKAccessoryType {
    return HKAccessoryType.Outlet;
  }

  constructor(dependency: MQTTAccessoryDependency<OutletConfig>) {
    super(dependency);

    this.setup(HKCharacteristicKey.OutletInUse, false, 'topicGetOutletInUse',
      this.bindOnUpdateNumericBoolean(HKCharacteristicKey.OutletInUse, 'valueOutletInUse', strings.outlet.inUse, strings.outlet.notInUse),
      false,
    );
  }
}