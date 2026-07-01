import { PlatformAccessory } from 'homebridge';

import { History } from './history.js';

import { MQTTAccessoryConfig } from './types.js';

import { EveCharacteristicKey } from '../homekit/characteristic/eve.js';

import { Log } from '../tools/log.js';

export type ServiceType = typeof import('homebridge').Service;
export type CharacteristicType = typeof import('homebridge').Characteristic;
export type HapStatusErrorType = typeof import('homebridge').HapStatusError;

export type CharacteristicKey = HKCharacteristicKey | EveCharacteristicKey;

export enum HKCharacteristicKey {
  Active = 'Active',
  AirQuality = 'AirQuality',
  BatteryLevel = 'BatteryLevel',
  Brightness = 'Brightness',
  CarbonDioxideDetected = 'CarbonDioxideDetected',
  CarbonDioxideLevel = 'CarbonDioxideLevel',
  CarbonDioxidePeakLevel = 'CarbonDioxidePeakLevel',
  CarbonMonoxideDetected = 'CarbonMonoxideDetected',
  CarbonMonoxideLevel = 'CarbonMonoxideLevel',
  CarbonMonoxidePeakLevel = 'CarbonMonoxidePeakLevel',
  ColorTemperature = 'ColorTemperature',
  ContactSensorState = 'ContactSensorState',
  CoolingThresholdTemperature = 'CoolingThresholdTemperature',
  CurrentAmbientLightLevel = 'CurrentAmbientLightLevel',
  CurrentAirPurifierState = 'CurrentAirPurifierState',
  CurrentDoorState = 'CurrentDoorState',
  CurrentFanState = 'CurrentFanState',
  CurrentHeaterCoolerState = 'CurrentHeaterCoolerState',
  CurrentHeatingCoolingState = 'CurrentHeatingCoolingState',
  CurrentHorizontalTiltAngle = 'CurrentHorizontalTiltAngle',
  CurrentPosition = 'CurrentPosition',
  CurrentRelativeHumidity = 'CurrentRelativeHumidity',
  CurrentTemperature = 'CurrentTemperature',
  CurrentVerticalTiltAngle = 'CurrentVerticalTiltAngle',
  FilterChangeIndication = 'FilterChangeIndication',
  FilterLifeLevel = 'FilterLifeLevel',
  HeatingThresholdTemperature = 'HeatingThresholdTemperature',
  HoldPosition = 'HoldPosition',
  Hue = 'Hue',
  InUse = 'InUse',
  IsConfigured = 'IsConfigured',
  LeakDetected = 'LeakDetected',
  LockCurrentState = 'LockCurrentState',
  LockPhysicalControls = 'LockPhysicalControls',
  LockTargetState = 'LockTargetState',
  MotionDetected = 'MotionDetected',
  Mute = 'Mute',
  NitrogenDioxideDensity = 'NitrogenDioxideDensity',
  ObstructionDetected = 'ObstructionDetected',
  OccupancyDetected = 'OccupancyDetected',
  On = 'On',
  OutletInUse = 'OutletInUse',
  OzoneDensity = 'OzoneDensity',
  PM10Density = 'PM10Density',
  PM2_5Density = 'PM2_5Density',
  PositionState = 'PositionState',
  ProgrammableSwitchEvent = 'ProgrammableSwitchEvent',
  RemainingDuration = 'RemainingDuration',
  ResetFilterIndication = 'ResetFilterIndication',
  RotationDirection = 'RotationDirection',
  RotationSpeed = 'RotationSpeed',
  Saturation = 'Saturation',
  SecuritySystemCurrentState = 'SecuritySystemCurrentState',
  SecuritySystemTargetState = 'SecuritySystemTargetState',
  ServiceLabelIndex = 'ServiceLabelIndex',
  SetDuration = 'SetDuration',
  SmokeDetected = 'SmokeDetected',
  StatusActive = 'StatusActive',
  StatusFault = 'StatusFault',
  StatusLowBattery = 'StatusLowBattery',
  StatusTampered = 'StatusTampered',
  SulphurDioxideDensity = 'SulphurDioxideDensity',
  SwingMode = 'SwingMode',
  TargetAirPurifierState = 'TargetAirPurifierState',
  TargetDoorState = 'TargetDoorState',
  TargetFanState = 'TargetFanState',
  TargetHeaterCoolerState = 'TargetHeaterCoolerState',
  TargetHeatingCoolingState = 'TargetHeatingCoolingState',
  TargetHorizontalTiltAngle = 'TargetHorizontalTiltAngle',
  TargetPosition = 'TargetPosition',
  TargetRelativeHumidity = 'TargetRelativeHumidity',
  TargetTemperature = 'TargetTemperature',
  TargetVerticalTiltAngle = 'TargetVerticalTiltAngle',
  TemperatureDisplayUnits = 'TemperatureDisplayUnits',
  ValveType = 'ValveType',
  VOCDensity = 'VOCDensity',
  Volume = 'Volume'
}

export enum AddonType {
  Battery = 'Battery',
  FilterMaintenance = 'FilterMaintenance'
}

export type HomeKitAccessoryDependency = {
  Service: ServiceType;
  Characteristic: CharacteristicType;
  HapStatusError: HapStatusErrorType;
  platformAccessory: PlatformAccessory;
  log: Log;
  history: History;
};

export type MQTTAccessoryDependency<C extends MQTTAccessoryConfig> = HomeKitAccessoryDependency & {
  config: C;
  isGrouped: boolean;
};