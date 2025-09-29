import { PlatformConfig as HBPlatformConfig } from 'homebridge';

export type ServiceType = typeof import('homebridge').Service;
export type CharacteristicType = typeof import('homebridge').Characteristic;

import { AccessoryType, ValveType } from './enums.js';

import { TemperatureUnits } from '../tools/temperature.js';
import { Assertable } from '../tools/validation.js';

export type PlatformConfig = HBPlatformConfig & {
  accessories?: BaseAccessoryConfig[];
}

export type TemperatureConfig = {
  temperatureUnits?: TemperatureUnits,
}

export type AddonConfig = Assertable & {
}

export type FilterMaintenanceConfig = AddonConfig & {
  topicGetFilterChangeIndication: string,
  topicGetFilterLifeLevel?: string,
  topicResetFilterIndication?: string,
  valueFilterChange: string,
  valueFilterReset: string,
}

type ErrorStatusConfig = {
  topicGetStatusFault?: string,
  topicGetStatusTampered?: string,
  valueFault?: string,
  valueTampered?: string,
}

export type InfoConfig = Assertable & {
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

export type MQTTMessage = Assertable & {
  topic: string,
  message: string,
}

export type MQTTConfig = Assertable & {
  broker?: string,
  username?: string,
  password?: string,
  options?: string,
  onConnect?: MQTTMessage[]
}

export type MQTTAccessoryConfig = Assertable & {
  info: InfoConfig,
  mqtt?: MQTTConfig,
  customCharacteristics?: CustomCharacteristicConfig[];
  resetOnRestart?: boolean,
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

export type AirSensorConfig = SensorConfig & {
  topicGetAirQuality: string,
  topicGetNitrogenDioxideDensity?: string,
  topicGetOzoneDensity?: string,
  topicGetPM10Density?: string,
  topicGetPM2_5Density?: string,
  topicGetSulphurDioxideDensity?: string,
  topicGetVOCDensity?: string,
  valueAQExcellent?: string,
  valueAQFair?: string,
  valueAQGood?: string,
  valueAQInferior?: string,
  valueAQPoor?: string,
  valueAQUnknown?: string,
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

export type TemperatureSensorConfig = SensorConfig & TemperatureConfig & {
  topicGetCurrentTemperature: string,
}

export type TemperatureControlConfig = BaseAccessoryConfig & TemperatureConfig & {
  topicGetCoolingThresholdTemperature?: string,
  topicGetCurrentTemperature: string,
  topicGetHeatingThresholdTemperature?: string,
  topicSetCoolingThresholdTemperature?: string,
  topicSetHeatingThresholdTemperature?: string,
}

export type ThermostatConfig = TemperatureControlConfig & {
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

export type ActiveClimateConfig = TemperatureControlConfig & {
  topicGetActive: string,
  topicGetLockPhysicalControls?: string,
  topicGetRotationSpeed?: string,
  topicGetSwingMode?: string,
  topicSetActive: string,
  topicSetLockPhysicalControls?: string,
  topicSetRotationSpeed?: string,
  topicSetSwingMode?: string,
  valueControlLock?: string,
  valueControlUnlock?: string,
  valueStateActive: string,
  valueStateInactive: string,
  valueSwingEnabled?: string,
  valueSwingDisabled?: string,
}

export type FanV2Config = ActiveClimateConfig & {
  topicGetCurrentFanState?: string,
  topicGetRotationDirection?: string,
  topicGetTargetFanState?: string,
  topicSetRotationDirection?: string,
  topicSetTargetFanState?: string,
  valueDirectionClockwise?: string,
  valueDirectionCounterClockwise?: string,
  valueModeAuto?: string,
  valueModeBlowing?: string,
  valueModeIdle?: string,
  valueModeInactive?: string,
  valueModeManual?: string,
}

export type HeaterCoolerConfig = ActiveClimateConfig & FilterMaintenanceConfig & {
  topicGetCurrentHeaterCoolerState: string,
  topicGetTargetHeaterCoolerState: string,
  topicSetTargetHeaterCoolerState: string,
  valueModeAuto?: string,
  valueModeCool?: string,
  valueModeHeat?: string,
  valueModeIdle?: string,
  valueModeInactive?: string,
}

export type PurifierConfig = ActiveClimateConfig & FilterMaintenanceConfig & {
  topicGetCurrentPurifierState: string,
  topicGetTargetPurifierState: string,
  topicSetTargetPurifierState: string,
  valueModeAuto?: string,
  valueModeIdle?: string,
  valueModeInactive?: string,
  valueModeManual?: string,
  valueModePurifying?: string,
}

export type GarageDoorConfig = LockConfig & {
  topicGetCurrentDoorState: string,
  topicGetCurrentLockState?: string,
  topicGetObstructionDetected: string,
  topicGetTargetDoorState: string,
  topicGetTargetLockState?: string,
  topicSetTargetDoorState: string,
  topicSetTargetLockState?: string,
  valueDoorObstructed: string,
  valueDoorStateClosed?: string,
  valueDoorStateClosing?: string,
  valueDoorStateOpen?: string,
  valueDoorStateOpening?: string,
  valueDoorStateStopped?: string,
  valueLockStateJammed?: string,
  valueLockStateSecured?: string,
  valueLockStateUnsecured?: string,
}

export type PositionConfig = BaseAccessoryConfig & {
  topicGetCurrentPosition: string,
  topicSetHoldPosition?: string,
  topicGetObstructionDetected?: string,
  topicGetPositionState: string,
  topicGetTargetPosition: string,
  topicSetTargetPosition: string,
  valuePositionHold?: string,
  valuePositionDecreasing?: string,
  valuePositionIncreasing?: string,
  valuePositionObstructed?: string,
  valuePositionResume?: string,
  valuePositionStopped?: string,
}

export type BlindConfig = PositionConfig & {
  topicGetCurrentHorizontalTiltAngle?: string,
  topicGetCurrentVerticalTiltAngle?: string,
  topicGetTargetHorizontalTiltAngle? :string,
  topicGetTargetVerticalTiltAngle? :string,
  topicSetTargetHorizontalTiltAngle? :string,
  topicSetTargetVerticalTiltAngle? :string,
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

export type ValveConfig = BaseAccessoryConfig & {
  valveType?: ValveType,
  topicGetStatusFault?: string,
  topicGetValveActive: string,
  topicGetValveInUse: string,
  topicGetValveIsConfigured?: string,
  topicGetValveRemainingDuration?: string,
  topicGetValveSetDuration?: string,
  topicSetValveActive: string,
  topicSetValveIsConfigured?: string,
  topicSetValveSetDuration?: string,
  valueActive: string,
  valueConfigured?: string,
  valueFault?: string,
  valueInactive: string,
  valueInUse: string,
  valueNotConfigured?: string,
}