import { CharacteristicValue, PrimitiveTypes } from 'homebridge';

import { ActiveClimateAccessory } from './active.js';

import { FilterMaintenance } from '../addons/filter.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey } from '../../model/enums.js';
import { HeaterCoolerConfig, MQTTAccessoryDependency } from '../../model/types.js';

export class HeaterCoolerAccessory extends ActiveClimateAccessory<HeaterCoolerConfig> {

  private readonly CURRENT_STATE_MAP: Map<keyof HeaterCoolerConfig, number>;
  private readonly TARGET_STATE_MAP: Map<keyof HeaterCoolerConfig, number>;

  constructor(dependency: MQTTAccessoryDependency<HeaterCoolerConfig>) {
    super(dependency);

    this.setupTemperatureControlCharacteristics();

    this.CURRENT_STATE_MAP = new Map([
      ['valueModeInactive', dependency.Characteristic.CurrentHeaterCoolerState.INACTIVE],
      ['valueModeIdle', dependency.Characteristic.CurrentHeaterCoolerState.IDLE],
      ['valueModeHeat', dependency.Characteristic.CurrentHeaterCoolerState.HEATING],
      ['valueModeCool', dependency.Characteristic.CurrentHeaterCoolerState.COOLING],
    ]);

    this.TARGET_STATE_MAP = new Map([
      ['valueModeAuto', dependency.Characteristic.TargetHeaterCoolerState.AUTO],
      ['valueModeHeat', dependency.Characteristic.TargetHeaterCoolerState.HEAT],
      ['valueModeCool', dependency.Characteristic.TargetHeaterCoolerState.COOL],
    ]);

    const validCurrentStates = Array.from(this.CURRENT_STATE_MAP.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validCurrentStates.length === 0) {
      this.log.error(strings.heaterCooler.noStateValues, this.name);
      return;
    }

    this.setup(HKCharacteristicKey.CurrentHeaterCoolerState, this.CURRENT_STATE_MAP.get(validCurrentStates[0])!,
      'topicGetCurrentHeaterCoolerState', this.onCurrentStateUpdate.bind(this), true)
      ?.setProps({ validValues: validCurrentStates.map((key) => this.CURRENT_STATE_MAP.get(key)!) });

    const validTargetStates = Array.from(this.TARGET_STATE_MAP.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validTargetStates.length === 0) {
      this.log.error(strings.heaterCooler.noStateValues, this.name);
      return;
    }

    this.setup(HKCharacteristicKey.TargetHeaterCoolerState, this.TARGET_STATE_MAP.get(validTargetStates[0])!,
      'topicGetTargetHeaterCoolerState', this.onTargetStateUpdate.bind(this), true,
      'topicSetTargetHeaterCoolerState', this.onSetTargetState.bind(this))
      ?.setProps({ validValues: validTargetStates.map((key) => this.TARGET_STATE_MAP.get(key)!) });

    this.addTopicHandlers(FilterMaintenance.topicHandlers(dependency.Service, this, dependency.config));
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.HeaterCooler;
  }

  private async onCurrentStateUpdate(_topic: string, value: PrimitiveTypes) {
    const state = this.toCurrentCVState(value);
    if (state === undefined) {
      return;
    }

    this.onUpdate(HKCharacteristicKey.CurrentHeaterCoolerState, state, this.stateStringForCurrentCV(state));
  }

  private async onTargetStateUpdate(_topic: string, value: PrimitiveTypes) {
    const state = this.toTargetCVState(value);
    if (state === undefined) {
      return;
    }

    this.onUpdate(HKCharacteristicKey.TargetHeaterCoolerState, state, this.stateStringForTargetCV(state));
  }

  private async onSetTargetState(value: CharacteristicValue) {

    const target = this.fromCVState(value);
    if (target === undefined) {
      return;
    }

    this.onSet(HKCharacteristicKey.TargetHeaterCoolerState, value, target, 'topicSetTargetHeaterCoolerState', this.stateStringForTargetCV(value));
  }

  private fromCVState(value: CharacteristicValue): PrimitiveTypes | undefined {

    let primative = undefined;
    this.TARGET_STATE_MAP.forEach( (test, key) => {
      if (value === test) {
        primative = this.getPrimitiveValue(key);
      }
    });

    if (primative === undefined) {
      this.log.error(strings.heaterCooler.badValue, this.name, `'${value}'`);
    }

    return primative;
  }

  private toCurrentCVState(value: PrimitiveTypes): CharacteristicValue | undefined {
    switch (value) {
    case this.getPrimitiveValue('valueModeInactive', false):
      return this.CURRENT_STATE_MAP.get('valueModeInactive');
    case this.getPrimitiveValue('valueModeIdle', false):
      return this.CURRENT_STATE_MAP.get('valueModeIdle');
    case this.getPrimitiveValue('valueModeHeat', false):
      return this.CURRENT_STATE_MAP.get('valueModeHeat');
    case this.getPrimitiveValue('valueModeCool', false):
      return this.CURRENT_STATE_MAP.get('valueModeCool');
    }

    this.logIfDesired(strings.heaterCooler.unknownValue, `'${value}'`);
  }

  private toTargetCVState(value: PrimitiveTypes): CharacteristicValue | undefined {
    switch (value) {
    case this.getPrimitiveValue('valueModeAuto', false):
      return this.TARGET_STATE_MAP.get('valueModeAuto');
    case this.getPrimitiveValue('valueModeHeat', false):
      return this.TARGET_STATE_MAP.get('valueModeHeat');
    case this.getPrimitiveValue('valueModeCool', false):
      return this.TARGET_STATE_MAP.get('valueModeCool');
    }

    this.logIfDesired(strings.heaterCooler.unknownValue, `'${value}'`);
  }

  private stateStringForCurrentCV(state: CharacteristicValue): string {
    switch(state) {
    case this.Characteristic.CurrentHeaterCoolerState.INACTIVE:
      return strings.heaterCooler.stateInactive;
    case this.Characteristic.CurrentHeaterCoolerState.IDLE:
      return strings.heaterCooler.stateIdle;
    case this.Characteristic.CurrentHeaterCoolerState.HEATING:
      return strings.heaterCooler.stateHeating;
    case this.Characteristic.CurrentHeaterCoolerState.COOLING:
      return strings.heaterCooler.stateCooling;
    default:
      return strings.heaterCooler.stateUnknown;
    }
  }

  private stateStringForTargetCV(state: CharacteristicValue): string {
    switch(state) {
    case this.Characteristic.TargetHeaterCoolerState.AUTO:
      return strings.heaterCooler.stateAuto;
    case this.Characteristic.TargetHeaterCoolerState.HEAT:
      return strings.heaterCooler.stateHeat;
    case this.Characteristic.TargetHeaterCoolerState.COOL:
      return strings.heaterCooler.stateCool;
    default:
      return strings.heaterCooler.stateUnknown;
    }
  }
}