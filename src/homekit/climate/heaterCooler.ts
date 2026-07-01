import { ActiveClimateAccessory } from './active.js';

import { FilterMaintenance } from '../addons/filter.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType } from '../../model/enums.js';
import { HKCharacteristicKey, MQTTAccessoryDependency } from '../../model/homekit.js';
import { HeaterCoolerConfig } from '../../model/types.js';

export class HeaterCoolerAccessory extends ActiveClimateAccessory<HeaterCoolerConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.HeaterCooler;
  }

  constructor(dependency: MQTTAccessoryDependency<HeaterCoolerConfig>) {
    super(dependency);

    this.setupTemperatureControlCharacteristics();

    const currentStates = new Map<keyof HeaterCoolerConfig, number>([
      ['valueModeInactive', dependency.Characteristic.CurrentHeaterCoolerState.INACTIVE],
      ['valueModeIdle', dependency.Characteristic.CurrentHeaterCoolerState.IDLE],
      ['valueModeHeat', dependency.Characteristic.CurrentHeaterCoolerState.HEATING],
      ['valueModeCool', dependency.Characteristic.CurrentHeaterCoolerState.COOLING],
    ]);

    const validCurrentStates = Array.from(currentStates.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validCurrentStates.length === 0) {
      this.log.error(strings.heaterCooler.noStateValues, this.name);
      return;
    }

    const currentStrings = new Map([
      [dependency.Characteristic.CurrentHeaterCoolerState.INACTIVE, strings.heaterCooler.stateInactive],
      [dependency.Characteristic.CurrentHeaterCoolerState.IDLE, strings.heaterCooler.stateIdle],
      [dependency.Characteristic.CurrentHeaterCoolerState.HEATING, strings.heaterCooler.stateHeating],
      [dependency.Characteristic.CurrentHeaterCoolerState.COOLING, strings.heaterCooler.stateCooling],
    ]);

    this.setup(HKCharacteristicKey.CurrentHeaterCoolerState, currentStates.get(validCurrentStates[0])!,
      'topicGetCurrentHeaterCoolerState',
      this.bindOnUpdateState(HKCharacteristicKey.CurrentHeaterCoolerState, currentStates, currentStrings, strings.heaterCooler.unknownValue),
      true,
    )?.setProps({ validValues: validCurrentStates.map((key) => currentStates.get(key)!) });

    const targetStates = new Map<keyof HeaterCoolerConfig, number>([
      ['valueModeAuto', dependency.Characteristic.TargetHeaterCoolerState.AUTO],
      ['valueModeHeat', dependency.Characteristic.TargetHeaterCoolerState.HEAT],
      ['valueModeCool', dependency.Characteristic.TargetHeaterCoolerState.COOL],
    ]);

    const validTargetStates = Array.from(targetStates.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validTargetStates.length === 0) {
      this.log.error(strings.heaterCooler.noStateValues, this.name);
      return;
    }

    const targetStrings = new Map([
      [dependency.Characteristic.TargetHeaterCoolerState.AUTO, strings.heaterCooler.stateAuto],
      [dependency.Characteristic.TargetHeaterCoolerState.HEAT, strings.heaterCooler.stateHeat],
      [dependency.Characteristic.TargetHeaterCoolerState.COOL, strings.heaterCooler.stateCool],
    ]);

    this.setup(HKCharacteristicKey.TargetHeaterCoolerState, targetStates.get(validTargetStates[0])!,
      'topicGetTargetHeaterCoolerState',
      this.bindOnUpdateState(HKCharacteristicKey.TargetHeaterCoolerState, targetStates, targetStrings, strings.heaterCooler.unknownValue),
      true,
      'topicSetTargetHeaterCoolerState',
      this.bindOnSetState(HKCharacteristicKey.TargetHeaterCoolerState, 'topicSetTargetHeaterCoolerState',
        targetStates, targetStrings, strings.heaterCooler.badValue),
    )?.setProps({ validValues: validTargetStates.map((key) => targetStates.get(key)!) });

    this.addTopicHandlers(FilterMaintenance.topicHandlers(dependency.Service, this, dependency.config));
  }
}