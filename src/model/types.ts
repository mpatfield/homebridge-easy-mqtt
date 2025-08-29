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

export type InfoConfig = Assertable & {
  id: string,
  name: string,
  type: AccessoryType,
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
  disableLogging: boolean,
}

export type AdditionalInfoConfig = InfoConfig & {
  manufacturer?: string,
  model?: string,
  serialNumber?: string,
  version?: string,
}

export type BaseAccessoryConfig = MQTTAccessoryConfig & {
  info: AdditionalInfoConfig,
  topicGetStatusActive?: string,
  valueStatusActive?: string,
}

export type LockMechanismConfig = BaseAccessoryConfig & {
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

export type OnOffConfig = BaseAccessoryConfig & {
  topicGetOn: string,
  topicSetOn: string,
  valueOn: string,
  valueOff: string,
}

export type LightbulbConfig = OnOffConfig & {
  topicGetBrightness?: string,
  topicGetHue?: string,
  topicGetColorTemperature?: string,
  topicGetSaturation?: string
  topicSetBrightness?: string,
  topicSetHue?: string,
  topicSetColorTemperature?: string,
  topicSetSaturation?: string
}

export type OutletConfig = OnOffConfig & {
  topicGetOutletInUse?: string,
  valueOutletInUse?: string,
}

export type SecuritySystemConfig = BaseAccessoryConfig & {
  topicGetCurrentSecurityState: string,
  topicGetTargetSecurityState: string,
  topicSetTargetSecurityState: string,
  topicGetStatusTampered?: string,
  topicGetStatusFault?: string,
  valueArmStay?: string,
  valueArmAway?: string,
  valueArmNight?: string,
  valueDisarm?: string,
  valueAlarmTriggered?: string,
  valueTampered?: string,
  valueFault?: string,
}

export type SwitchConfig = OnOffConfig & {
}

export type TemperatureSensorConfig = BaseAccessoryConfig & TemperatureConfig & {
  topicGetCurrentTemperature: string,
}