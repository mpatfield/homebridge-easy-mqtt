import { CharacteristicValue, PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { ActiveClimateAccessory } from './active.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, ServiceType, FanV2Config } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class FanV2Accessory extends ActiveClimateAccessory<FanV2Config> {

  private readonly CURRENT_STATE_MAP: Map<keyof FanV2Config, number>;
  private readonly TARGET_STATE_MAP: Map<keyof FanV2Config, number>;

  constructor(
    Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory,
    config: FanV2Config, log: Log, isGrouped: boolean) {
    super(Service, Characteristic, accessory, config, log, isGrouped);

    this.CURRENT_STATE_MAP = new Map([
      ['valueModeInactive', Characteristic.CurrentFanState.INACTIVE],
      ['valueModeIdle', Characteristic.CurrentFanState.IDLE],
      ['valueModeBlowing', Characteristic.CurrentFanState.BLOWING_AIR],
    ]);

    this.TARGET_STATE_MAP = new Map([
      ['valueModeAuto', Characteristic.TargetFanState.AUTO],
      ['valueModeManual', Characteristic.TargetFanState.MANUAL],
    ]);

    const validCurrentStates = Array.from(this.CURRENT_STATE_MAP.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validCurrentStates.length === 0) {
      this.log.error(strings.fanv2.noCurrentStateValues, this.name);
      return;
    }

    this.setupCharacteristic(CharacteristicKey.CurrentFanState, this.CURRENT_STATE_MAP.get(validCurrentStates[0])!,
      'topicGetCurrentFanState', this.onCurrentStateUpdate.bind(this), false)
      ?.setProps({ validValues: validCurrentStates.map((key) => this.CURRENT_STATE_MAP.get(key)!) });

    const validTargetStates = Array.from(this.TARGET_STATE_MAP.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validTargetStates.length === 0) {
      this.log.error(strings.fanv2.noTargetStateValues, this.name);
      return;
    }

    this.setupCharacteristic(CharacteristicKey.TargetFanState, this.TARGET_STATE_MAP.get(validTargetStates[0])!,
      'topicGetTargetFanState', this.onTargetStateUpdate.bind(this), false,
      'topicSetTargetFanState', this.onSetTargetState.bind(this))
      ?.setProps({ validValues: validTargetStates.map((key) => this.TARGET_STATE_MAP.get(key)!) });

    this.setupCharacteristic(CharacteristicKey.RotationDirection, Characteristic.RotationDirection.CLOCKWISE,
      'topicGetRotationDirection',
      this.bindOnUpdateNumericBoolean(CharacteristicKey.RotationDirection, 'valueDirectionCounterClockwise',
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

    this.onUpdate(CharacteristicKey.CurrentFanState, state, this.stateStringForCurrentCV(state));
  }

  private async onTargetStateUpdate(_topic: string, value: PrimitiveTypes) {
    const state = this.toTargetCVState(value);
    if (state === undefined) {
      return;
    }

    this.onUpdate(CharacteristicKey.TargetFanState, state, this.stateStringForTargetCV(state));
  }

  private async onSetTargetState(value: CharacteristicValue) {

    const target = this.fromCVState(value);
    if (target === undefined) {
      return;
    }

    this.onSet(CharacteristicKey.TargetFanState, value, target, 'topicSetTargetFanState', this.stateStringForTargetCV(value));
  }

  private async onSetDirection(value: CharacteristicValue) {

    if (!this.assert('valueDirectionClockwise', 'valueDirectionCounterClockwise')) {
      return;
    }

    const clockwise = value === this.Characteristic.RotationDirection.CLOCKWISE;
    const logString = clockwise ? strings.fanv2.setDirectionClockwise : strings.fanv2.setDirectionCounterClockwise;
    const publish = clockwise ? this.config.valueDirectionClockwise! : this.config.valueDirectionCounterClockwise!;
    this.onSet(CharacteristicKey.RotationDirection, value, publish, 'topicSetRotationDirection', logString);


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