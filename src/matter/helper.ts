import { BaseMatterAccessory, MatterAccessoryDependency } from './abstract/base.js';

import { strings } from '../i18n/i18n.js';

import { MatterAccessoryType } from '../model/matter.js';
import * as Types from '../model/types.js';

import { MatterElectricalMeterAccessory } from './meter.js';
import { MatterLightbulbAccessory } from './onoff/lightbulb.js';
import { MatterOutletAccessory } from './onoff/outlet.js';
import { MatterSwitchAccessory } from './onoff/switch.js';

export function createMatterAccessory(
  dependency: MatterAccessoryDependency<Types.BaseAccessoryConfig>,
): BaseMatterAccessory | undefined {

  switch(dependency.config.info.type) {
  case MatterAccessoryType.ElectricalMeter:
    return new MatterElectricalMeterAccessory(dependency as MatterAccessoryDependency<Types.ElectricalMeterConfig>);
  case MatterAccessoryType.Lightbulb:
    return new MatterLightbulbAccessory(dependency as MatterAccessoryDependency<Types.LightbulbConfig>);
  case MatterAccessoryType.Outlet:
    return new MatterOutletAccessory(dependency as MatterAccessoryDependency<Types.OutletConfig>);
  case MatterAccessoryType.Switch:
    return new MatterSwitchAccessory(dependency as MatterAccessoryDependency<Types.SwitchConfig>);
  }

  dependency.log.error(strings.startup.unsupportedType, dependency.config.info.type);
}