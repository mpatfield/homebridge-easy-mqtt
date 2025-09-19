import { PlatformConfig as HBPlatformConfig } from 'homebridge';

export type ServiceType = typeof import('homebridge').Service;
export type CharacteristicType = typeof import('homebridge').Characteristic;

import { AccessoryType, TemperatureUnits } from './enums.js';

import { Assertable } from '../tools/validation.js';

export type PlatformConfig = HBPlatformConfig & {
  accessories?: BaseAccessoryConfig[];
}

export type TemperatureConfig = {
  temperatureUnits?: TemperatureUnits,
}

type ErrorStatusConfig = {
  topicGetStatusFault?: string,
  topicGetStatusTampered?: string,
  valueFault?: string,
  valueTampered?: string,
}

type InfoConfig = Assertable & {
  id: string,
  name: string,
  type: AccessoryType,
  group?: string,
}

type AdditionalInfoConfig = InfoConfig & {
  manufacturer?: string,
  model?: string,
  serialNumber?: string,
  version?: string,
}

export type MQTTConfig = Assertable & {
  broker: string,
  username?: string,
  password?: string,
  options?: string,
}

export type MQTTAccessoryConfig = Assertable & {
  mqtt: MQTTConfig,
  info: InfoConfig,
  customCharacteristics?: CustomCharacteristicConfig[];
  disableLogging: boolean,
}

export type CustomCharacteristicConfig = Assertable & {
  uuid: string,
  name: string,
  getTopic: string,
  units?: string,
}

export type BaseAccessoryConfig = MQTTAccessoryConfig & {
  info: AdditionalInfoConfig,
  topicGetBatteryLevel?: string,
  topicGetBatteryLow?: string,
  topicGetStatusActive?: string,
  valueBatteryLow?: string,
  valueStatusActive?: string,
}

export type OnOffConfig = BaseAccessoryConfig & {
  topicGetOn: string,
  topicSetOn: string,
  valueOn: string,
  valueOff: string,
}

export type LightbulbConfig = OnOffConfig & {
  topicGetBrightness?: string,
  topicGetColorTemperature?: string,
  topicGetHue?: string,
  topicGetSaturation?: string
  topicSetBrightness?: string,
  topicSetColorTemperature?: string,
  topicSetHue?: string,
  topicSetSaturation?: string
}

export type OutletConfig = OnOffConfig & {
  topicGetOutletInUse?: string,
  valueOutletInUse?: string,
}

export type SwitchConfig = OnOffConfig & {
}

export type SensorConfig = BaseAccessoryConfig & ErrorStatusConfig & {
}

export type COSensorConfig = SensorConfig & {
  topicGetCarbonMonoxideDetected: string,
  topicGetCarbonMonoxideLevel?: string,
  topicGetCarbonMonoxidePeakLevel?: string,
  valueCarbonMonoxideDetected: string,
}

export type CO2SensorConfig = SensorConfig & {
  topicGetCarbonDioxideDetected: string,
  topicGetCarbonDioxideLevel?: string,
  topicGetCarbonDioxidePeakLevel?: string,
  valueCarbonDioxideDetected: string,
}

export type ContactSensorConfig = SensorConfig & {
  topicGetContactSensorState: string,
  valueContactDetected: string,
}

export type HumiditySensorConfig =  SensorConfig & {
  topicGetCurrentRelativeHumidity: string,
}

export type LeakSensorConfig = SensorConfig & {
  topicGetLeakDetected: string,
  valueLeakDetected: string,
}

export type LightSensorConfig = SensorConfig & {
  topicGetCurrentAmbientLightLevel: string,
}

export type MotionSensorConfig = SensorConfig & {
  topicGetMotionDetected: string,
  valueMotionDetected: string,
}

export type OccupancySensorConfig = SensorConfig & {
  topicGetOccupancyDetected: string,
  valueOccupancyDetected: string,
}

export type SmokeSensorConfig = SensorConfig & {
  topicGetSmokeDetected: string,
  valueSmokeDetected: string,
}

export type TemperatureSensorConfig =  SensorConfig & TemperatureConfig & {
  topicGetCurrentTemperature: string,
}

export type ClimateControlConfig = BaseAccessoryConfig & TemperatureConfig & {
  topicGetCoolingThresholdTemperature?: string,
  topicGetCurrentTemperature: string,
  topicGetHeatingThresholdTemperature?: string,
  topicSetCoolingThresholdTemperature?: string,
  topicSetHeatingThresholdTemperature?: string,
}

export type HeaterCoolerConfig = ClimateControlConfig & {
  topicGetHeaterCoolerActive: string,
  topicGetCurrentHeaterCoolerState: string,
  topicGetLockPhysicalControls?: string,
  topicGetRotationSpeed?: string,
  topicGetSwingMode?: string,
  topicGetTargetHeaterCoolerState: string,
  topicSetHeaterCoolerActive: string,
  topicSetLockPhysicalControls?: string,
  topicSetRotationSpeed?: string,
  topicSetSwingMode?: string,
  topicSetTargetHeaterCoolerState: string,
  valueControlLock?: string,
  valueControlUnlock?: string,
  valueModeAuto?: string,
  valueModeCool?: string,
  valueModeHeat?: string,
  valueModeIdle?: string,
  valueModeInactive?: string,
  valueStateActive: string,
  valueStateInactive: string,
  valueSwingEnabled?: string,
  valueSwingDisabled?: string,
}

export type ThermostatConfig = ClimateControlConfig & {
  topicGetCurrentHeatingCoolingState: string,
  topicGetCurrentRelativeHumidity?: string,
  topicGetTargetHeatingCoolingState: string,
  topicGetTargetRelativeHumidity?: string,
  topicGetTargetTemperature: string,
  topicSetTargetHeatingCoolingState: string,
  topicSetTargetRelativeHumidity?: string,
  topicSetTargetTemperature: string,
  valueModeAuto?: string,
  valueModeCool?: string,
  valueModeHeat?: string,
  valueModeOff?: string,
}

export type LockConfig = BaseAccessoryConfig & {
  topicGetCurrentLockState: string,
  topicGetTargetLockState: string,
  topicSetTargetLockState: string,
  topicGetLockCurrentState?: string, // Deprecated
  topicGetLockTargetState?: string, // Deprecated
  topicSetTargetState?: string, // Deprecated
  valueLockStateSecured: string,
  valueLockStateUnsecured: string,
  valueLockStateJammed?: string,
};

export type SecurityConfig = BaseAccessoryConfig & ErrorStatusConfig & {
  topicGetCurrentSecurityState: string,
  topicGetTargetSecurityState: string,
  topicSetTargetSecurityState: string,
  valueArmStay?: string,
  valueArmAway?: string,
  valueArmNight?: string,
  valueDisarm?: string,
  valueAlarmTriggered?: string,
}