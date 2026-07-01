import { BaseMatterAccessory, MatterAccessoryDependency } from './abstract/base.js';

import { strings } from '../i18n/i18n.js';

import { AccessoryType } from '../model/enums.js';
import * as Types from '../model/types.js';

import { MatterLightbulbAccessory } from './onoff/lightbulb.js';
import { MatterOutletAccessory } from './onoff/outlet.js';
import { MatterSwitchAccessory } from './onoff/switch.js';

export function createMatterAccessory(
  dependency: MatterAccessoryDependency<Types.BaseAccessoryConfig>,
): BaseMatterAccessory | undefined {

  switch(dependency.config.info.type) {
  case AccessoryType.Lightbulb:
    return new MatterLightbulbAccessory(dependency as MatterAccessoryDependency<Types.LightbulbConfig>);
  case AccessoryType.Outlet:
    return new MatterOutletAccessory(dependency as MatterAccessoryDependency<Types.OutletConfig>);
  case AccessoryType.Switch:
    return new MatterSwitchAccessory(dependency as MatterAccessoryDependency<Types.SwitchConfig>);
  }

  dependency.log.error(strings.startup.unsupportedType, dependency.config.info.type);
}