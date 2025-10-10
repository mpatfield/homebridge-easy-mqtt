import { CharacteristicValue, PrimitiveTypes } from 'homebridge';

import { BaseAccessory } from '../abstract/base.js';
import { MQTTAccessoryDependency } from '../abstract/mqtt.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { PositionConfig } from '../../model/types.js';

import { LogType } from '../../tools/log.js';

export abstract class PositionAccessory<C extends PositionConfig = PositionConfig> extends BaseAccessory<C> {

  private readonly STATE_MAP: Map<keyof PositionConfig, number>;

  constructor(dependency: MQTTAccessoryDependency<C>) {
    super(dependency);

    let currentLogString = strings.position.currentValue;
    let targetLogString = strings.position.targetValue;
    if (!dependency.config.maximumPosition || !this.assertType('number', 'maximumPosition')) {
      dependency.config.maximumPosition = 100;
      currentLogString = strings.position.currentPercent;
      targetLogString = strings.position.targetPercent;
    }

    this.setup(CharacteristicKey.CurrentPosition, 0,
      'topicGetCurrentPosition', this.bindOnUpdateNumeric(CharacteristicKey.CurrentPosition, currentLogString), true,
    )?.setProps({ maxValue: dependency.config.maximumPosition });

    this.setup(CharacteristicKey.TargetPosition, 0,
      'topicGetTargetPosition', this.bindOnUpdateNumeric(CharacteristicKey.TargetPosition, targetLogString), true,
      'topicSetTargetPosition', this.onSetTargetPosition.bind(this),
    )?.setProps({ maxValue: dependency.config.maximumPosition });

    this.STATE_MAP = new Map([
      ['valuePositionDecreasing', dependency.Characteristic.PositionState.DECREASING],
      ['valuePositionIncreasing', dependency.Characteristic.PositionState.INCREASING],
      ['valuePositionStopped', dependency.Characteristic.PositionState.STOPPED],
    ]);

    const validStates = Array.from(this.STATE_MAP.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validStates.length === 0) {
      this.log.error(strings.position.noPositionValues, this.name);
      return;
    }

    this.setup(CharacteristicKey.PositionState, dependency.Characteristic.PositionState.STOPPED,
      'topicGetPositionState', this.onPositionStateUpdate.bind(this), true,
    )?.setProps({ validValues: validStates.map((key) => this.STATE_MAP.get(key)!) });

    this.setupSet(CharacteristicKey.HoldPosition, 'topicSetHoldPosition', this.onSetHoldPosition.bind(this));

    this.setup(CharacteristicKey.ObstructionDetected, false, 'topicGetObstructionDetected', this.onObstructionUpdate.bind(this), false);
  }

  private async onSetTargetPosition(value: CharacteristicValue) {
    const isPercent = this.config.maximumPosition === undefined || this.config.maximumPosition === 100;
    const logString = (isPercent ? strings.position.targetPercentSet : strings.position.targetValueSet).replace('%d', value.toString());
    this.onSet(CharacteristicKey.TargetPosition, value, value as number, 'topicSetTargetPosition', logString);
  }

  private async onSetHoldPosition(value: CharacteristicValue) {

    if (!this.assert('valuePositionHold', 'valuePositionResume')) {
      return;
    }

    const publish = value ? this.config.valuePositionHold! : this.config.valuePositionResume!;
    const logString = value ? strings.position.hold : strings.position.resume;
    this.onSet(CharacteristicKey.HoldPosition, value, publish, 'topicSetHoldPosition', logString);
  }

  private async onPositionStateUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    const current = this.toCVState(value);
    if (current === undefined) {
      return;
    }

    this.onUpdate(CharacteristicKey.PositionState, current, this.stateStringForCV(current));
  }

  private async onObstructionUpdate(topic: string, value: PrimitiveTypes) {

    const obstructed = value === this.getPrimitiveValue('valuePositionObstructed');
    if (!this.onUpdate(CharacteristicKey.ObstructionDetected, obstructed)) {
      return;
    }

    if (obstructed) {
      this.logIfDesired(LogType.ERROR, strings.position.obstructed);
    } else {
      this.logIfDesired(strings.position.unobstructed);
    }
  }

  private toCVState(value: PrimitiveTypes): CharacteristicValue | undefined {
    switch (value) {
    case this.getPrimitiveValue('valuePositionDecreasing', false):
      return this.STATE_MAP.get('valuePositionDecreasing');
    case this.getPrimitiveValue('valuePositionIncreasing', false):
      return this.STATE_MAP.get('valuePositionIncreasing');
    case this.getPrimitiveValue('valuePositionStopped', false):
      return this.STATE_MAP.get('valuePositionStopped');
    }

    this.logIfDesired(strings.position.unknownValue, `'${value}'`);
  }

  private stateStringForCV(state: CharacteristicValue): string {
    switch(state) {
    case this.Characteristic.PositionState.DECREASING:
      return strings.position.stateDecreasing;
    case this.Characteristic.PositionState.INCREASING:
      return strings.position.stateIncreasing;
    case this.Characteristic.PositionState.STOPPED:
      return strings.position.stateStopped;
    default:
      return strings.position.stateUnknown;
    }
  }
}