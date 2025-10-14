import { CharacteristicValue, PrimitiveTypes } from 'homebridge';

import { ActiveClimateAccessory } from './active.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey } from '../../model/enums.js';
import { FanV2Config, MQTTAccessoryDependency } from '../../model/types.js';

export class FanV2Accessory extends ActiveClimateAccessory<FanV2Config> {

  private readonly CURRENT_STATE_MAP: Map<keyof FanV2Config, number>;
  private readonly TARGET_STATE_MAP: Map<keyof FanV2Config, number>;

  constructor(dependency: MQTTAccessoryDependency<FanV2Config>) {
    super(dependency);

    this.CURRENT_STATE_MAP = new Map([
      ['valueModeInactive', dependency.Characteristic.CurrentFanState.INACTIVE],
      ['valueModeIdle', dependency.Characteristic.CurrentFanState.IDLE],
      ['valueModeBlowing', dependency.Characteristic.CurrentFanState.BLOWING_AIR],
    ]);

    this.TARGET_STATE_MAP = new Map([
      ['valueModeManual', dependency.Characteristic.TargetFanState.MANUAL],
      ['valueModeAuto', dependency.Characteristic.TargetFanState.AUTO],
    ]);

    const validCurrentStates = Array.from(this.CURRENT_STATE_MAP.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (dependency.config.topicGetCurrentFanState !== undefined && validCurrentStates.length === 0) {
      this.log.error(strings.fanv2.noCurrentStateValues, this.name);
      return;
    }

    this.setup(HKCharacteristicKey.CurrentFanState, this.CURRENT_STATE_MAP.get(validCurrentStates[0])!,
      'topicGetCurrentFanState', this.onCurrentStateUpdate.bind(this), false)
      ?.setProps({ validValues: validCurrentStates.map((key) => this.CURRENT_STATE_MAP.get(key)!) });

    const validTargetStates = Array.from(this.TARGET_STATE_MAP.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (dependency.config.topicGetTargetFanState !== undefined && validTargetStates.length === 0) {
      this.log.error(strings.fanv2.noTargetStateValues, this.name);
      return;
    }

    this.setup(HKCharacteristicKey.TargetFanState, this.TARGET_STATE_MAP.get(validTargetStates[0])!,
      'topicGetTargetFanState', this.onTargetStateUpdate.bind(this), false,
      'topicSetTargetFanState', this.onSetTargetState.bind(this))
      ?.setProps({ validValues: validTargetStates.map((key) => this.TARGET_STATE_MAP.get(key)!) });

    this.setup(HKCharacteristicKey.RotationDirection, dependency.Characteristic.RotationDirection.CLOCKWISE,
      'topicGetRotationDirection',
      this.bindOnUpdateNumericBoolean(HKCharacteristicKey.RotationDirection, 'valueDirectionCounterClockwise',
        strings.fanv2.clockwise, strings.fanv2.counterClockwise),
      false,
      'topicSetRotationDirection', this.onSetDirection.bind(this),
    );
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.Fanv2;
  }

  private async onCurrentStateUpdate(_topic: string, value: PrimitiveTypes) {
    const state = this.toCurrentCVState(value);
    if (state === undefined) {
      return;
    }

    this.onUpdate(HKCharacteristicKey.CurrentFanState, state, this.stateStringForCurrentCV(state));
  }

  private async onTargetStateUpdate(_topic: string, value: PrimitiveTypes) {
    const state = this.toTargetCVState(value);
    if (state === undefined) {
      return;
    }

    this.onUpdate(HKCharacteristicKey.TargetFanState, state, this.stateStringForTargetCV(state));
  }

  private async onSetTargetState(value: CharacteristicValue) {

    const target = this.fromCVState(value);
    if (target === undefined) {
      return;
    }

    this.onSet(HKCharacteristicKey.TargetFanState, value, target, 'topicSetTargetFanState', this.stateStringForTargetCV(value));
  }

  private async onSetDirection(value: CharacteristicValue) {

    if (!this.assert('valueDirectionClockwise', 'valueDirectionCounterClockwise')) {
      return;
    }

    const clockwise = value === this.Characteristic.RotationDirection.CLOCKWISE;
    const logString = clockwise ? strings.fanv2.setDirectionClockwise : strings.fanv2.setDirectionCounterClockwise;
    const publish = clockwise ? this.config.valueDirectionClockwise! : this.config.valueDirectionCounterClockwise!;
    this.onSet(HKCharacteristicKey.RotationDirection, value, publish, 'topicSetRotationDirection', logString);
  }

  private fromCVState(value: CharacteristicValue): PrimitiveTypes | undefined {

    let primative = undefined;
    this.TARGET_STATE_MAP.forEach( (test, key) => {
      if (value === test) {
        primative = this.getPrimitiveValue(key);
      }
    });

    if (primative === undefined) {
      this.log.error(strings.fanv2.badValue, this.name, `'${value}'`);
    }

    return primative;
  }

  private toCurrentCVState(value: PrimitiveTypes): CharacteristicValue | undefined {
    switch (value) {
    case this.getPrimitiveValue('valueModeInactive', false):
      return this.CURRENT_STATE_MAP.get('valueModeInactive');
    case this.getPrimitiveValue('valueModeIdle', false):
      return this.CURRENT_STATE_MAP.get('valueModeIdle');
    case this.getPrimitiveValue('valueModeBlowing', false):
      return this.CURRENT_STATE_MAP.get('valueModeBlowing');
    }

    this.logIfDesired(strings.fanv2.unknownValue, `'${value}'`);
  }

  private toTargetCVState(value: PrimitiveTypes): CharacteristicValue | undefined {
    switch (value) {
    case this.getPrimitiveValue('valueModeAuto', false):
      return this.TARGET_STATE_MAP.get('valueModeAuto');
    case this.getPrimitiveValue('valueModeManual', false):
      return this.TARGET_STATE_MAP.get('valueModeManual');
    }

    this.logIfDesired(strings.fanv2.unknownValue, `'${value}'`);
  }

  private stateStringForCurrentCV(state: CharacteristicValue): string {
    switch(state) {
    case this.Characteristic.CurrentFanState.INACTIVE:
      return strings.fanv2.stateInactive;
    case this.Characteristic.CurrentFanState.IDLE:
      return strings.fanv2.stateIdle;
    case this.Characteristic.CurrentFanState.BLOWING_AIR:
      return strings.fanv2.stateBlowing;
    default:
      return strings.fanv2.stateUnknown;
    }
  }

  private stateStringForTargetCV(state: CharacteristicValue): string {
    switch(state) {
    case this.Characteristic.TargetFanState.AUTO:
      return strings.fanv2.stateAuto;
    case this.Characteristic.TargetFanState.MANUAL:
      return strings.fanv2.stateManual;
    default:
      return strings.fanv2.stateUnknown;
    }
  }
}