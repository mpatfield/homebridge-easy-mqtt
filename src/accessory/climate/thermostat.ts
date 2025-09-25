import { CharacteristicValue, PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { TemperatureControlAccessory, DEFAULT_TEMPERATURE } from './temperatureControl.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, ServiceType, ThermostatConfig } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class ThermostatAccessory extends TemperatureControlAccessory<ThermostatConfig> {

  private readonly STATE_MAP: Map<keyof ThermostatConfig, number>;

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: ThermostatConfig, log: Log, isGrouped: boolean) {
    super(Service, Characteristic, accessory, config, log, isGrouped);

    this.setupTemperatureControlCharacteristics();

    this.STATE_MAP = new Map([
      ['valueModeAuto', Characteristic.TargetHeatingCoolingState.AUTO],
      ['valueModeCool', Characteristic.TargetHeatingCoolingState.COOL],
      ['valueModeHeat', Characteristic.TargetHeatingCoolingState.HEAT],
      ['valueModeOff', Characteristic.TargetHeatingCoolingState.OFF],
    ]);

    const validTargetStates = Array.from(this.STATE_MAP.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validTargetStates.length === 0 || (validTargetStates.length === 1 && validTargetStates[0] === 'valueModeAuto')) {
      this.log.error(strings.thermostat.noStateValues, this.name);
      return;
    }

    this.setupCharacteristic(CharacteristicKey.TargetHeatingCoolingState, this.STATE_MAP.get(validTargetStates[0])!,
      'topicGetTargetHeatingCoolingState', this.bindOnStateUpdate(CharacteristicKey.TargetHeatingCoolingState, true), true,
      'topicSetTargetHeatingCoolingState', this.onSetTargetState.bind(this))
      ?.setProps({ validValues: validTargetStates.map((key) => this.STATE_MAP.get(key)!) });

    const validCurrentStates = validTargetStates.filter((key) => key !== 'valueModeAuto');
    this.setupCharacteristic(CharacteristicKey.CurrentHeatingCoolingState, this.STATE_MAP.get(validCurrentStates[0])!,
      'topicGetCurrentHeatingCoolingState', this.bindOnStateUpdate(CharacteristicKey.CurrentHeatingCoolingState), true)
      ?.setProps({ validValues: validCurrentStates.map((key) => this.STATE_MAP.get(key)!) });

    this.setupCharacteristic(CharacteristicKey.TargetTemperature, DEFAULT_TEMPERATURE,
      'topicGetTargetTemperature', this.bindTemperatureUpdate(config, CharacteristicKey.TargetTemperature, strings.thermostat.temperatureTarget), true,
      'topicSetTargetTemperature', this.onSetTemperature.bind(this));

    this.setupCharacteristic(CharacteristicKey.CurrentRelativeHumidity, 0,
      'topicGetCurrentRelativeHumidity', this.bindOnUpdateNumeric(CharacteristicKey.CurrentRelativeHumidity, strings.climate.humidityUpdate), false);

    this.setupCharacteristic(CharacteristicKey.TargetRelativeHumidity, 0,
      'topicGetTargetRelativeHumidity', this.bindOnUpdateNumeric(CharacteristicKey.TargetRelativeHumidity, strings.thermostat.humidityFuture), false,
      'topicSetTargetRelativeHumidity', this.onSetHumidity.bind(this),
    );
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.Thermostat;
  }

  private bindOnStateUpdate(charKey: CharacteristicKey, future: boolean = false) {
    return (async (_topic: string, value: PrimitiveTypes) => {

      const state = this.toCVState(value);
      if (state === undefined) {
        return;
      }

      this.onUpdate(charKey, state, this.stateStringForCV(state, future));
    }).bind(this);
  }

  private async onSetTargetState(value: CharacteristicValue) {

    const target = this.fromCVState(value);
    if (target === undefined) {
      return;
    }

    this.onSet(CharacteristicKey.TargetHeatingCoolingState, value, target, 'topicSetTargetHeatingCoolingState', this.stateStringForCV(value, true));
  }

  private async onSetTemperature(value: CharacteristicValue) {
    const temperature = this.temperatureFromCV(value);
    const logString = strings.thermostat.temperatureTargetFuture.replace('%d°%s', `${temperature}°${this.temperatureUnits}`);
    this.onSet(CharacteristicKey.TargetTemperature, value, temperature, 'topicSetTargetTemperature', logString);
  }

  private async onSetHumidity(value: CharacteristicValue) {
    const logString = strings.thermostat.humidityFuture.replace('%d', value.toString());
    this.onSet(CharacteristicKey.TargetRelativeHumidity, value, value as number, 'topicSetTargetRelativeHumidity', logString);
  }

  private fromCVState(value: CharacteristicValue): PrimitiveTypes | undefined {

    let primative = undefined;
    this.STATE_MAP.forEach( (test, key) => {
      if (value === test) {
        primative = this.getPrimitiveValue(key);
      }
    });

    if (primative === undefined) {
      this.log.error(strings.thermostat.badValue, this.name, `'${value}'`);
    }

    return primative;
  }

  private toCVState(value: PrimitiveTypes): CharacteristicValue | undefined {
    switch (value) {
    case this.getPrimitiveValue('valueModeAuto', false):
      return this.STATE_MAP.get('valueModeAuto');
    case this.getPrimitiveValue('valueModeCool', false):
      return this.STATE_MAP.get('valueModeCool');
    case this.getPrimitiveValue('valueModeHeat', false):
      return this.STATE_MAP.get('valueModeHeat');
    case this.getPrimitiveValue('valueModeOff', false):
      return this.STATE_MAP.get('valueModeOff');
    }

    this.logIfDesired(strings.thermostat.unknownValue, `'${value}'`);
  }

  private stateStringForCV(state: CharacteristicValue, future: boolean = false): string {
    switch(state) {
    case this.Characteristic.TargetHeatingCoolingState.AUTO:
      return strings.thermostat.stateAutoFuture;
    case this.Characteristic.TargetHeatingCoolingState.COOL:
      return future ? strings.thermostat.stateCoolFuture : strings.thermostat.stateCool;
    case this.Characteristic.TargetHeatingCoolingState.HEAT:
      return future ? strings.thermostat.stateHeatFuture : strings.thermostat.stateHeat;
    case this.Characteristic.TargetHeatingCoolingState.OFF:
      return future ? strings.thermostat.stateOffFuture : strings.thermostat.stateOff;
    default:
      return strings.thermostat.stateUnknown;
    }
  }
}