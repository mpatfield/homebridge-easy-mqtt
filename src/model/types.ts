import { PlatformConfig as HBPlatformConfig, PlatformAccessory } from 'homebridge';

export type ServiceType = typeof import('homebridge').Service;
export type CharacteristicType = typeof import('homebridge').Characteristic;
export type HapStatusErrorType = typeof import('homebridge').HapStatusError;

import { AccessoryType, ColorType, LabelType, TimeUnits, ValveType } from './enums.js';

import { History } from './history.js';
import { Log } from '../tools/log.js';
import { TemperatureUnits } from '../tools/temperature.js';
import { Assertable } from '../tools/validation.js';

export type AccessoryDependency = {
  Service: ServiceType,
  Characteristic: CharacteristicType,
  HapStatusError: HapStatusErrorType,
  platformAccessory: PlatformAccessory,
  log: Log,
  history: History,
}

export type MQTTAccessoryDependency<C extends MQTTAccessoryConfig> = AccessoryDependency & {
  config: C,
  isGrouped: boolean,
}

export type PlatformConfig = HBPlatformConfig & {
  accessories?: BaseAccessoryConfig[];
}

export type TemperatureConfig = {
  temperatureUnits?: TemperatureUnits,
}

export type AddonConfig = Assertable & {
}

export type TimeoutConfig = Assertable & {
  time: number,
  units: TimeUnits
}

export type BatteryConfig = AddonConfig & {
  topicGetBatteryLevel?: string,
  topicGetBatteryLow?: string,
  valueBatteryLow?: string,
}

export type FilterMaintenanceConfig = AddonConfig & {
  topicGetFilterChangeIndication?: string,
  topicGetFilterLifeLevel?: string,
  topicResetFilterIndication?: string,
  valueFilterChange?: string,
  valueFilterReset?: string,
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
  minPublishIntervalMs?: number,
  onConnect?: MQTTMessage[]
}

export type HistoryConfig = Assertable & {
  enabled: boolean,
  disableRepeatLastData?: boolean,
  size?: number,
}

export type MQTTAccessoryConfig = Assertable & {
  info: InfoConfig,
  mqtt?: MQTTConfig,
  history?: HistoryConfig,
  customCharacteristics?: CustomCharacteristicConfig[];
  resetOnRestart?: boolean,
  disableLogging: boolean,
  topicGetAvailable?: string,
  valueAvailable?: string,
}

export type CustomCharacteristicConfig = Assertable & {
  uuid: string,
  name: string,
  getTopic: string,
  units?: string,
}

export type BaseAccessoryConfig = MQTTAccessoryConfig & BatteryConfig & {
  info: AdditionalInfoConfig,
  topicGetStatusActive?: string,
  valueStatusActive?: string,
}

export type AutoResetConfig = {
  autoReset?: TimeoutConfig,
}

export type OnOffConfig = BaseAccessoryConfig & AutoResetConfig & {
  topicGetCurrentConsumption?: string,
  topicGetElectricCurrent?: string,
  topicGetOn: string,
  topicGetTotalConsumption?: string,
  topicGetVoltage?: string,
  topicSetOn: string,
  valueOn: string,
  valueOff: string,
}

export type LightbulbConfig = OnOffConfig & {
  colorType?: ColorType,
  coldWhite?: string,
  warmWhite?: string,
  switchWhites?: boolean,
  noWhiteMix?: boolean,
  rgbHexPrefix?: string,
  rgbThresholds?: string,
  maximumBrightness?: number,
  topicGetBrightness?: string,
  topicGetColorTemperature?: string,
  topicGetHue?: string,
  topicGetRGB?: string,
  topicGetSaturation?: string
  topicGetWhite?: string,
  topicSetBrightness?: string,
  topicSetColorTemperature?: string,
  topicSetHue?: string,
  topicSetRGB?: string,
  topicSetSaturation?: string
  topicSetWhite?: string,
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

export type COSensorConfig = SensorConfig & AutoResetConfig & {
  topicGetCarbonMonoxideDetected: string,
  topicGetCarbonMonoxideLevel?: string,
  topicGetCarbonMonoxidePeakLevel?: string,
  valueCarbonMonoxideDetected: string,
}

export type CO2SensorConfig = SensorConfig & AutoResetConfig & {
  topicGetCarbonDioxideDetected: string,
  topicGetCarbonDioxideLevel?: string,
  topicGetCarbonDioxidePeakLevel?: string,
  valueCarbonDioxideDetected: string,
}

export type ContactSensorConfig = SensorConfig & AutoResetConfig & {
  topicGetContactSensorState: string,
  valueContactDetected: string,
}

export type HumiditySensorConfig =  SensorConfig & {
  topicGetCurrentRelativeHumidity: string,
}

export type LeakSensorConfig = SensorConfig & AutoResetConfig & {
  topicGetLeakDetected: string,
  valueLeakDetected: string,
}

export type LightSensorConfig = SensorConfig & {
  topicGetCurrentAmbientLightLevel: string,
}

export type MotionSensorConfig = SensorConfig & AutoResetConfig & {
  topicGetMotionDetected: string,
  valueMotionDetected: string,
}

export type OccupancySensorConfig = SensorConfig & AutoResetConfig & {
  topicGetOccupancyDetected: string,
  valueOccupancyDetected: string,
}

export type SmokeSensorConfig = SensorConfig & AutoResetConfig & {
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
  minimumTemperature?: number,
  maximumTemperature?: number,
  minimumStep?: number,
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

export type ActiveClimateConfig = TemperatureControlConfig & AutoResetConfig & {
  maximumRotationSpeed?: number,
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
  maximumPosition?: number,
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

export type ButtonConfig = BaseAccessoryConfig & {
  labelType?: LabelType,
  topicEventButtonPress: string,
  valueSinglePress?: string,
  valueDoublePress?: string,
  valueLongPress?: string,
}

export type DoorbellConfig = ButtonConfig & {
  maximumBrightness?: number,
  maximumVolume?: number,
  topicGetBrightness?: string,
  topicGetMuted?: string,
  topicGetVolume?: string,
  topicSetBrightness?: string,
  topicSetMuted?: string,
  topicSetVolume?: string,
  valueMuted?: string,
  valueUnmuted?: string,
}

export type ValveConfig = BaseAccessoryConfig & {
  valveType?: ValveType,
  minimumDuration?: number,
  maximumDuration?: number,
  simulateDuration?: boolean,
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