import { MatterRequests } from 'homebridge';

import { OnOffAccessory } from './onoff.js';

import { MatterAccessoryDependency } from '../abstract/base.js';

import { strings } from '../../i18n/i18n.js';

import { MatterClusterKey, MatterClusterPath, MatterType, MatterValueKey } from '../../model/matter.js';
import { LightbulbConfig } from '../../model/types.js';

const MATTER_MAX_LEVEL = 254;

export class MatterLightbulbAccessory extends OnOffAccessory<LightbulbConfig> {

  override getMatterType(): MatterType {
    return this.isDimmer ? MatterType.DimmableLight : MatterType.OnOffLight;
  }

  private maxLevel: number;

  constructor(dependency: MatterAccessoryDependency<LightbulbConfig>) {
    super(dependency);

    this.maxLevel = this.config.maximumBrightness ?? MATTER_MAX_LEVEL;

    if (this.isDimmer) {
      this.setupGet(
        this.currentLevelPath, this.maxLevel,
        'topicGetBrightness', this.bindOnUpdateNumeric(this.currentLevelPath, 1, this.maxLevel, strings.lightbulb.brightnessValue),
      );
    }
  }

  private get isDimmer(): boolean {
    return this.config.topicGetBrightness !== undefined;
  }

  private get currentLevelPath(): MatterClusterPath {
    return MatterClusterPath(MatterClusterKey.levelControl, MatterValueKey.currentLevel);
  }

  override get clusters() {

    if (!this.isDimmer) {
      return super.clusters;
    }

    return {
      ...super.clusters,
      levelControl: {
        currentLevel: this.getProperty(MatterValueKey.currentLevel) as number,
        minLevel: 1,
        maxLevel: this.maxLevel,
      },
    };
  }

  override get handlers() {

    if (!this.isDimmer) {
      return super.handlers;
    }

    return {
      ...super.handlers,
      levelControl: {
        moveToLevelWithOnOff: async (request: MatterRequests.MoveToLevel) =>
          this.setBrightness(request.level),
      },
    };
  }

  private async setBrightness(value: number) {
    this.onSetNumeric(this.currentLevelPath, value, 'topicSetBrightness', strings.lightbulb.brightnessValue, true);
  }
}