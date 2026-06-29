import { BaseMatterAccessory, MatterAccessoryDependency } from './abstract/base.js';

import { strings } from '../i18n/i18n.js';

import * as Types from '../model/types.js';

export function createMatterAccessory(
  dependency: MatterAccessoryDependency<Types.BaseAccessoryConfig>,
): BaseMatterAccessory | undefined {

  dependency.log.error(strings.startup.unsupportedType, dependency.config.info.type);
  return;
}