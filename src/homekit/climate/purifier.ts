import { ActiveClimateAccessory } from './active.js';

import { FilterMaintenance } from '../addons/filter.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType } from '../../model/enums.js';
import { HKCharacteristicKey, MQTTAccessoryDependency } from '../../model/homekit.js';
import { PurifierConfig } from '../../model/types.js';

export class PurifierAccessory extends ActiveClimateAccessory<PurifierConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.AirPurifier;
  }

  constructor(dependency: MQTTAccessoryDependency<PurifierConfig>) {
    super(dependency);

    const currentStates = new Map<keyof PurifierConfig, number>([
      ['valueModeInactive', dependency.Characteristic.CurrentAirPurifierState.INACTIVE],
      ['valueModeIdle', dependency.Characteristic.CurrentAirPurifierState.IDLE],
      ['valueModePurifying', dependency.Characteristic.CurrentAirPurifierState.PURIFYING_AIR],
    ]);

    const currentStrings = new Map([
      [dependency.Characteristic.CurrentAirPurifierState.INACTIVE, strings.purifier.stateInactive],
      [dependency.Characteristic.CurrentAirPurifierState.IDLE, strings.purifier.stateIdle],
      [dependency.Characteristic.CurrentAirPurifierState.PURIFYING_AIR, strings.purifier.statePurifying],
    ]);

    const validCurrentStates = Array.from(currentStates.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validCurrentStates.length === 0) {
      this.log.error(strings.purifier.noCurrentStateValues, this.name);
      return;
    }

    this.setup(HKCharacteristicKey.CurrentAirPurifierState, currentStates.get(validCurrentStates[0])!,
      'topicGetCurrentPurifierState',
      this.bindOnUpdateState(HKCharacteristicKey.CurrentAirPurifierState, currentStates, currentStrings, strings.purifier.stateUnknown),
      true,
    )?.setProps({ validValues: validCurrentStates.map((key) => currentStates.get(key)!) });

    const targetStates = new Map<keyof PurifierConfig, number>([
      ['valueModeManual', dependency.Characteristic.TargetAirPurifierState.MANUAL],
      ['valueModeAuto', dependency.Characteristic.TargetAirPurifierState.AUTO],
    ]);

    const validTargetStates = Array.from(targetStates.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validTargetStates.length === 0) {
      this.log.error(strings.purifier.noTargetStateValues, this.name);
      return;
    }

    const targetStrings = new Map([
      [dependency.Characteristic.TargetAirPurifierState.AUTO, strings.purifier.stateAuto],
      [dependency.Characteristic.TargetAirPurifierState.MANUAL, strings.purifier.stateManual],
    ]);

    this.setup(HKCharacteristicKey.TargetAirPurifierState, targetStates.get(validTargetStates[0])!,
      'topicGetTargetPurifierState',
      this.bindOnUpdateState(HKCharacteristicKey.TargetAirPurifierState, targetStates, targetStrings, strings.purifier.stateUnknown),
      true,
      'topicSetTargetPurifierState',
      this.bindOnSetState(HKCharacteristicKey.TargetAirPurifierState, 'topicSetTargetPurifierState', targetStates, targetStrings, strings.purifier.badValue),
    )?.setProps({ validValues: validTargetStates.map((key) => targetStates.get(key)!) });

    this.addTopicHandlers(FilterMaintenance.topicHandlers(dependency.Service, this, dependency.config));
  }
}