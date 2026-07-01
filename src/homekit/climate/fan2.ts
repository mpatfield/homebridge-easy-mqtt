import { ActiveClimateAccessory } from './active.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType } from '../../model/enums.js';
import { HKCharacteristicKey, MQTTAccessoryDependency } from '../../model/homekit.js';
import { FanV2Config } from '../../model/types.js';

export class FanV2Accessory extends ActiveClimateAccessory<FanV2Config> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.Fanv2;
  }

  constructor(dependency: MQTTAccessoryDependency<FanV2Config>) {
    super(dependency);

    const currentStates = new Map<keyof FanV2Config, number>([
      ['valueModeInactive', dependency.Characteristic.CurrentFanState.INACTIVE],
      ['valueModeIdle', dependency.Characteristic.CurrentFanState.IDLE],
      ['valueModeBlowing', dependency.Characteristic.CurrentFanState.BLOWING_AIR],
    ]);

    const validCurrentStates = Array.from(currentStates.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (dependency.config.topicGetCurrentFanState !== undefined && validCurrentStates.length === 0) {
      this.log.error(strings.fanv2.noCurrentStateValues, this.name);
      return;
    }

    const currentStrings = new Map([
      [dependency.Characteristic.CurrentFanState.INACTIVE, strings.fanv2.stateInactive],
      [dependency.Characteristic.CurrentFanState.IDLE, strings.fanv2.stateIdle],
      [dependency.Characteristic.CurrentFanState.BLOWING_AIR, strings.fanv2.stateBlowing],
    ]);

    this.setup(HKCharacteristicKey.CurrentFanState, currentStates.get(validCurrentStates[0])!,
      'topicGetCurrentFanState',
      this.bindOnUpdateState(HKCharacteristicKey.CurrentFanState, currentStates, currentStrings, strings.fanv2.stateUnknown),
      false,
    )?.setProps({ validValues: validCurrentStates.map((key) => currentStates.get(key)!) });

    const targetStates = new Map<keyof FanV2Config, number>([
      ['valueModeManual', dependency.Characteristic.TargetFanState.MANUAL],
      ['valueModeAuto', dependency.Characteristic.TargetFanState.AUTO],
    ]);

    const validTargetStates = Array.from(targetStates.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (dependency.config.topicGetTargetFanState !== undefined && validTargetStates.length === 0) {
      this.log.error(strings.fanv2.noTargetStateValues, this.name);
      return;
    }

    const targetStrings = new Map([
      [dependency.Characteristic.TargetFanState.AUTO, strings.fanv2.stateAuto],
      [dependency.Characteristic.TargetFanState.MANUAL, strings.fanv2.stateManual],
    ]);

    this.setup(HKCharacteristicKey.TargetFanState, targetStates.get(validTargetStates[0])!,
      'topicGetTargetFanState',
      this.bindOnUpdateState(HKCharacteristicKey.TargetFanState, targetStates, targetStrings, strings.fanv2.stateUnknown),
      false,
      'topicSetTargetFanState',
      this.bindOnSetState(HKCharacteristicKey.TargetFanState, 'topicSetTargetFanState', targetStates, targetStrings, strings.fanv2.badValue),
    )?.setProps({ validValues: validTargetStates.map((key) => targetStates.get(key)!) });

    this.setup(HKCharacteristicKey.RotationDirection, dependency.Characteristic.RotationDirection.CLOCKWISE,
      'topicGetRotationDirection',
      this.bindOnUpdateNumericBoolean(HKCharacteristicKey.RotationDirection, 'valueDirectionClockwise',
        strings.fanv2.clockwise, strings.fanv2.counterClockwise),
      false,
      'topicSetRotationDirection',
      this.bindOnSetBoolean(HKCharacteristicKey.RotationDirection, 'topicSetRotationDirection', 'valueDirectionClockwise', 'valueDirectionCounterClockwise',
        dependency.Characteristic.RotationDirection.CLOCKWISE, strings.fanv2.setDirectionClockwise, strings.fanv2.setDirectionCounterClockwise),
    );
  }
}