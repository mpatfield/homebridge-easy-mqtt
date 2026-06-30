import { BaseMatterAccessory, MatterAccessoryDependency } from '../abstract/base.js';

import { strings } from '../../i18n/i18n.js';

import { MatterClusterKey, MatterClusterPath, MatterHandlerKey, MatterValueKey } from '../../model/matter.js';
import { OnOffConfig } from '../../model/types.js';

export abstract class OnOffAccessory<C extends OnOffConfig = OnOffConfig> extends BaseMatterAccessory<C> {

  constructor(dependency: MatterAccessoryDependency<C>) {
    super(dependency);

    this.setupGet(
      this.onOffPath, false,
      'topicGetOn', this.bindOnUpdateBoolean(this.onOffPath, 'valueOn', 'valueOff', strings.onOff.stateOn, strings.onOff.stateOff, MatterHandlerKey.off),
    );
  }

  private get onOffPath(): MatterClusterPath {
    return MatterClusterPath(MatterClusterKey.onOff, MatterValueKey.onOff);
  }

  override get clusters() {
    return {
      onOff: {
        onOff: this.getProperty(MatterValueKey.onOff) as boolean,
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
    this.onSetBoolean(this.onOffPath, value, 'topicSetOn', 'valueOn', 'valueOff', true, strings.onOff.stateOn, strings.onOff.stateOff);
  }
}