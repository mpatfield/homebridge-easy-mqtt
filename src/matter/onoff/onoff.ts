import { BaseMatterAccessory, MatterAccessoryDependency } from '../abstract/base.js';

import { strings } from '../../i18n/i18n.js';

import { MatterClusterKey, MatterPath, MatterValueKey } from '../../model/matter.js';
import { OnOffConfig } from '../../model/types.js';

export abstract class OnOffAccessory<C extends OnOffConfig = OnOffConfig> extends BaseMatterAccessory<C> {

  constructor(dependency: MatterAccessoryDependency<C>) {
    super(dependency);

    this.setupGet('topicGetOn', this.bindOnUpdateBoolean(this.onOffPath, 'valueOn', 'valueOff', strings.onOff.stateOn, strings.onOff.stateOff));
  }

  private get onOffPath(): MatterPath {
    return MatterPath(MatterClusterKey.onOff, MatterValueKey.onOff);
  }

  override get clusters() {
    return {
      onOff: {
        onOff: this.useStoredProperties && this.getProperty(MatterValueKey.onOff) === true,
      },
    };
  }

  override get handlers() {
    return {
      onOff: {
        on: async () => this.setOn(true),
        off: async () => this.setOn(false),
      },
    };
  }

  private async setOn(value: boolean): Promise<void> {
    this.onSetBoolean(this.onOffPath, value, 'topicGetOn', 'valueOn', 'valueOff', true, strings.onOff.stateOn, strings.onOff.stateOff);
  }
}