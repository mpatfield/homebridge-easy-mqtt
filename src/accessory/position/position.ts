import { CharacteristicValue, PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { BaseAccessory } from '../abstract/base.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, PositionConfig, ServiceType } from '../../model/types.js';

import { Log, LogType } from '../../tools/log.js';

export abstract class PositionAccessory<C extends PositionConfig = PositionConfig> extends BaseAccessory<C> {

  private readonly STATE_MAP: Map<keyof PositionConfig, number>;

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: C, log: Log, isGrouped: boolean) {
    super(Service, Characteristic, accessory, config, log, isGrouped);

    this.setup(CharacteristicKey.CurrentPosition, 0,
      'topicGetCurrentPosition', this.bindOnUpdateNumeric(CharacteristicKey.CurrentPosition, strings.position.current), true);

    this.setup(CharacteristicKey.TargetPosition, 0,
      'topicGetTargetPosition', this.bindOnUpdateNumeric(CharacteristicKey.TargetPosition, strings.position.target), true,
      'topicSetTargetPosition', this.onSetTargetPosition.bind(this));

    this.STATE_MAP = new Map([
      ['valuePositionDecreasing', Characteristic.PositionState.DECREASING],
      ['valuePositionIncreasing', Characteristic.PositionState.INCREASING],
      ['valuePositionStopped', Characteristic.PositionState.STOPPED],
    ]);

    const validStates = Array.from(this.STATE_MAP.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validStates.length === 0) {
      this.log.error(strings.position.noPositionValues, this.name);
      return;
    }

    this.setup(CharacteristicKey.PositionState, Characteristic.PositionState.STOPPED,
      'topicGetPositionState', this.onPositionStateUpdate.bind(this), true,
    )?.setProps({ validValues: validStates.map((key) => this.STATE_MAP.get(key)!) });

    this.setupSet(CharacteristicKey.HoldPosition, 'topicSetHoldPosition', this.onSetHoldPosition.bind(this));

    this.setup(CharacteristicKey.ObstructionDetected, false, 'topicGetObstructionDetected', this.onObstructionUpdate.bind(this), false);
  }

  private async onSetTargetPosition(value: CharacteristicValue) {
    const logString = strings.position.targetSet.replace('%d', value.toString());
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