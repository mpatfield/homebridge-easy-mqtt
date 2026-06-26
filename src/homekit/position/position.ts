import { HomeKitAccessory } from '../abstract/base.js';

import { strings } from '../../i18n/i18n.js';

import { HKCharacteristicKey } from '../../model/enums.js';
import { MQTTAccessoryDependency, PositionConfig } from '../../model/types.js';

import { LogType } from '../../tools/log.js';

export abstract class PositionAccessory<C extends PositionConfig = PositionConfig> extends HomeKitAccessory<C> {

  constructor(dependency: MQTTAccessoryDependency<C>) {
    super(dependency);

    let currentLogString = strings.position.currentValue;
    let targetLogString = strings.position.targetValue;
    if (!dependency.config.maximumPosition || !this.assertType('number', 'maximumPosition')) {
      dependency.config.maximumPosition = 100;
      currentLogString = strings.position.currentPercent;
      targetLogString = strings.position.targetPercent;
    }

    this.setup(HKCharacteristicKey.CurrentPosition, 0,
      'topicGetCurrentPosition', this.bindOnUpdateNumeric(HKCharacteristicKey.CurrentPosition, currentLogString), true,
    )?.setProps({ maxValue: dependency.config.maximumPosition });

    this.setup(HKCharacteristicKey.TargetPosition, 0,
      'topicGetTargetPosition', this.bindOnUpdateNumeric(HKCharacteristicKey.TargetPosition, targetLogString), true,
      'topicSetTargetPosition',
      this.bindOnSetPercentOrValue(HKCharacteristicKey.TargetPosition, 'topicSetTargetPosition', dependency.config.maximumPosition,
        strings.position.targetPercentSet, strings.position.targetValueSet),
    )?.setProps({ maxValue: dependency.config.maximumPosition });

    const stateMap = new Map<keyof PositionConfig, number>([
      ['valuePositionDecreasing', dependency.Characteristic.PositionState.DECREASING],
      ['valuePositionIncreasing', dependency.Characteristic.PositionState.INCREASING],
      ['valuePositionStopped', dependency.Characteristic.PositionState.STOPPED],
    ]);

    const validStates = Array.from(stateMap.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validStates.length === 0) {
      this.log.error(strings.position.noPositionValues, this.name);
      return;
    }

    const stateStrings = new Map([
      [dependency.Characteristic.PositionState.DECREASING, strings.position.stateDecreasing],
      [dependency.Characteristic.PositionState.INCREASING, strings.position.stateIncreasing],
      [dependency.Characteristic.PositionState.STOPPED, strings.position.stateStopped],
    ]);

    this.setup(HKCharacteristicKey.PositionState, dependency.Characteristic.PositionState.STOPPED,
      'topicGetPositionState',
      this.bindOnUpdateState(HKCharacteristicKey.PositionState, stateMap, stateStrings, strings.position.unknownValue),
      true,
    )?.setProps({ validValues: validStates.map((key) => stateMap.get(key)!) });

    this.setupSet(HKCharacteristicKey.HoldPosition, 'topicSetHoldPosition',
      this.bindOnSetBoolean(HKCharacteristicKey.HoldPosition, 'topicSetHoldPosition', 'valuePositionHold', 'valuePositionResume',
        true, strings.position.hold, strings.position.resume,
      ),
    );

    this.setup(HKCharacteristicKey.ObstructionDetected, false, 'topicGetObstructionDetected',
      this.bindOnUpdateBooleanSingle(HKCharacteristicKey.ObstructionDetected, 'valuePositionObstructed',
        strings.position.obstructed, strings.position.unobstructed, LogType.ERROR,
      ),
      false,
    );
  }
}