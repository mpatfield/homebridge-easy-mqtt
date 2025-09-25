import { CharacteristicValue, PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { ActiveClimateAccessory } from './active.js';

import { FilterMaintenance } from '../addons/filter.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, ServiceType, PurifierConfig } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class PurifierAccessory extends ActiveClimateAccessory<PurifierConfig> {

  private readonly CURRENT_STATE_MAP: Map<keyof PurifierConfig, number>;
  private readonly TARGET_STATE_MAP: Map<keyof PurifierConfig, number>;

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: PurifierConfig, log: Log, isGrouped: boolean) {
    super(Service, Characteristic, accessory, config, log, isGrouped);

    this.CURRENT_STATE_MAP = new Map([
      ['valueModeInactive', Characteristic.CurrentAirPurifierState.INACTIVE],
      ['valueModeIdle', Characteristic.CurrentAirPurifierState.IDLE],
      ['valueModePurifying', Characteristic.CurrentAirPurifierState.PURIFYING_AIR],
    ]);

    this.TARGET_STATE_MAP = new Map([
      ['valueModeAuto', Characteristic.TargetAirPurifierState.AUTO],
      ['valueModeManual', Characteristic.TargetAirPurifierState.MANUAL],
    ]);

    const validCurrentStates = Array.from(this.CURRENT_STATE_MAP.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validCurrentStates.length === 0) {
      this.log.error(strings.purifier.noCurrentStateValues, this.name);
      return;
    }

    this.setupCharacteristic(CharacteristicKey.CurrentAirPurifierState, this.CURRENT_STATE_MAP.get(validCurrentStates[0])!,
      'topicGetCurrentPurifierState', this.onCurrentStateUpdate.bind(this), true)
      ?.setProps({ validValues: validCurrentStates.map((key) => this.CURRENT_STATE_MAP.get(key)!) });

    const validTargetStates = Array.from(this.TARGET_STATE_MAP.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validTargetStates.length === 0) {
      this.log.error(strings.purifier.noTargetStateValues, this.name);
      return;
    }

    this.setupCharacteristic(CharacteristicKey.TargetAirPurifierState, this.TARGET_STATE_MAP.get(validTargetStates[0])!,
      'topicGetTargetPurifierState', this.onTargetStateUpdate.bind(this), true,
      'topicSetTargetPurifierState', this.onSetTargetState.bind(this))
      ?.setProps({ validValues: validTargetStates.map((key) => this.TARGET_STATE_MAP.get(key)!) });

    this.addTopicHandlers(FilterMaintenance.topicHandlers(Service, this, config));
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.AirPurifier;
  }

  private async onCurrentStateUpdate(_topic: string, value: PrimitiveTypes) {
    const state = this.toCurrentCVState(value);
    if (state === undefined) {
      return;
    }

    this.onUpdate(CharacteristicKey.CurrentAirPurifierState, state, this.stateStringForCurrentCV(state));
  }

  private async onTargetStateUpdate(_topic: string, value: PrimitiveTypes) {
    const state = this.toTargetCVState(value);
    if (state === undefined) {
      return;
    }

    this.onUpdate(CharacteristicKey.TargetAirPurifierState, state, this.stateStringForTargetCV(state));
  }

  private async onSetTargetState(value: CharacteristicValue) {

    const target = this.fromCVState(value);
    if (target === undefined) {
      return;
    }

    this.onSet(CharacteristicKey.TargetAirPurifierState, value, target, 'topicSetTargetPurifierState', this.stateStringForTargetCV(value));
  }

  private fromCVState(value: CharacteristicValue): PrimitiveTypes | undefined {

    let primative = undefined;
    this.TARGET_STATE_MAP.forEach( (test, key) => {
      if (value === test) {
        primative = this.getPrimitiveValue(key);
      }
    });

    if (primative === undefined) {
      this.log.error(strings.purifier.badValue, this.name, `'${value}'`);
    }

    return primative;
  }

  private toCurrentCVState(value: PrimitiveTypes): CharacteristicValue | undefined {
    switch (value) {
    case this.getPrimitiveValue('valueModeInactive', false):
      return this.CURRENT_STATE_MAP.get('valueModeInactive');
    case this.getPrimitiveValue('valueModeIdle', false):
      return this.CURRENT_STATE_MAP.get('valueModeIdle');
    case this.getPrimitiveValue('valueModePurifying', false):
      return this.CURRENT_STATE_MAP.get('valueModePurifying');
    }

    this.logIfDesired(strings.purifier.unknownValue, `'${value}'`);
  }

  private toTargetCVState(value: PrimitiveTypes): CharacteristicValue | undefined {
    switch (value) {
    case this.getPrimitiveValue('valueModeAuto', false):
      return this.TARGET_STATE_MAP.get('valueModeAuto');
    case this.getPrimitiveValue('valueModeManual', false):
      return this.TARGET_STATE_MAP.get('valueModeManual');
    }

    this.logIfDesired(strings.purifier.unknownValue, `'${value}'`);
  }

  private stateStringForCurrentCV(state: CharacteristicValue): string {
    switch(state) {
    case this.Characteristic.CurrentAirPurifierState.INACTIVE:
      return strings.purifier.stateInactive;
    case this.Characteristic.CurrentAirPurifierState.IDLE:
      return strings.purifier.stateIdle;
    case this.Characteristic.CurrentAirPurifierState.PURIFYING_AIR:
      return strings.purifier.statePurifying;
    default:
      return strings.purifier.stateUnknown;
    }
  }

  private stateStringForTargetCV(state: CharacteristicValue): string {
    switch(state) {
    case this.Characteristic.TargetAirPurifierState.AUTO:
      return strings.purifier.stateAuto;
    case this.Characteristic.TargetAirPurifierState.MANUAL:
      return strings.purifier.stateManual;
    default:
      return strings.purifier.stateUnknown;
    }
  }
}