import { TemperatureControlAccessory, DEFAULT_TEMPERATURE } from './temperatureControl.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey } from '../../model/enums.js';
import { HistoryType } from '../../model/history.js';
import { MQTTAccessoryDependency, ThermostatConfig } from '../../model/types.js';

import { toCelsius } from '../../tools/temperature.js';

export class ThermostatAccessory extends TemperatureControlAccessory<ThermostatConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.Thermostat;
  }

  constructor(dependency: MQTTAccessoryDependency<ThermostatConfig>) {
    super(dependency);

    this.setupTemperatureControlCharacteristics();

    const stateMap = new Map<keyof ThermostatConfig, number>([
      ['valueModeOff', dependency.Characteristic.TargetHeatingCoolingState.OFF],
      ['valueModeHeat', dependency.Characteristic.TargetHeatingCoolingState.HEAT],
      ['valueModeCool', dependency.Characteristic.TargetHeatingCoolingState.COOL],
      ['valueModeAuto', dependency.Characteristic.TargetHeatingCoolingState.AUTO],
    ]);

    const validTargetStates = Array.from(stateMap.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validTargetStates.length === 0 || (validTargetStates.length === 1 && validTargetStates[0] === 'valueModeAuto')) {
      this.log.error(strings.thermostat.noStateValues, this.name);
      return;
    }

    const targetStrings = new Map([
      [dependency.Characteristic.TargetHeatingCoolingState.AUTO, strings.thermostat.stateAutoFuture],
      [dependency.Characteristic.TargetHeatingCoolingState.COOL, strings.thermostat.stateCoolFuture],
      [dependency.Characteristic.TargetHeatingCoolingState.HEAT, strings.thermostat.stateHeatFuture],
      [dependency.Characteristic.TargetHeatingCoolingState.OFF, strings.thermostat.stateOffFuture],
    ]);

    this.setup(HKCharacteristicKey.TargetHeatingCoolingState, stateMap.get(validTargetStates[0])!,
      'topicGetTargetHeatingCoolingState',
      this.bindOnUpdateState(HKCharacteristicKey.TargetHeatingCoolingState, stateMap, targetStrings, strings.thermostat.stateUnknown),
      true,
      'topicSetTargetHeatingCoolingState',
      this.bindOnSetState(HKCharacteristicKey.TargetHeatingCoolingState, 'topicSetTargetHeatingCoolingState',
        stateMap, targetStrings, strings.thermostat.badValue),
    )?.setProps({ validValues: validTargetStates.map((key) => stateMap.get(key)!) });

    const currentStrings = new Map([
      [dependency.Characteristic.CurrentHeatingCoolingState.COOL, strings.thermostat.stateCool],
      [dependency.Characteristic.CurrentHeatingCoolingState.HEAT, strings.thermostat.stateHeat],
      [dependency.Characteristic.CurrentHeatingCoolingState.OFF, strings.thermostat.stateOff],
    ]);

    const validCurrentStates = validTargetStates.filter((key) => key !== 'valueModeAuto');
    this.setup(HKCharacteristicKey.CurrentHeatingCoolingState, stateMap.get(validCurrentStates[0])!,
      'topicGetCurrentHeatingCoolingState',
      this.bindOnUpdateState(HKCharacteristicKey.CurrentHeatingCoolingState, stateMap, currentStrings, strings.thermostat.stateUnknown),
      true)?.setProps({ validValues: validCurrentStates.map((key) => stateMap.get(key)!) });

    this.setup(HKCharacteristicKey.TargetTemperature, DEFAULT_TEMPERATURE,
      'topicGetTargetTemperature',
      this.bindOnUpdateTemperature(dependency.config, HKCharacteristicKey.TargetTemperature, strings.thermostat.temperatureTarget),
      true,
      'topicSetTargetTemperature',
      this.bindOnSetTemperature(HKCharacteristicKey.TargetTemperature, 'topicSetTargetTemperature', strings.thermostat.temperatureTargetFuture),
    )?.setProps({
      minValue: dependency.config.minimumTemperature ? toCelsius(dependency.config.minimumTemperature, this.temperatureUnits) : undefined,
      maxValue: dependency.config.maximumTemperature ? toCelsius(dependency.config.maximumTemperature, this.temperatureUnits) : undefined,
    });

    this.setup(HKCharacteristicKey.CurrentRelativeHumidity, 0,
      'topicGetCurrentRelativeHumidity', this.bindOnUpdateNumeric(HKCharacteristicKey.CurrentRelativeHumidity, strings.climate.humidityUpdate, (value) => {
        this.recordHistory(HistoryType.WEATHER, { humidity: value } );
      }), false);

    this.setup(HKCharacteristicKey.TargetRelativeHumidity, 0,
      'topicGetTargetRelativeHumidity', this.bindOnUpdateNumeric(HKCharacteristicKey.TargetRelativeHumidity, strings.thermostat.humidityFuture), false,
      'topicSetTargetRelativeHumidity',
      this.bindOnSetNumeric(HKCharacteristicKey.TargetRelativeHumidity, 'topicSetTargetRelativeHumidity', strings.thermostat.humidityFuture, true),
    );
  }
}