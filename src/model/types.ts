export type ServiceType = typeof import('homebridge').Service;
export type CharacteristicType = typeof import('homebridge').Characteristic;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Assertable = {
}

export type InfoConfig = Assertable & {
  name: string,
  type: string,
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

export type AccessoryConfig = Assertable & {
  mqtt: MQTTConfig,
  info: InfoConfig,
  disableLogging: boolean,
}

export type StatusActiveConfig = AccessoryConfig & {
  topicGetStatusActive?: string,
  valueStatusActive?: string,
}

export type LockMechanismConfig = StatusActiveConfig & {
  topicGetLockCurrentState: string,
  topicGetLockTargetState: string,
  topicSetTargetState: string,
  valueLockStateSecured: string,
  valueLockStateUnsecured: string,
  valueLockStateJammed?: string,
};

export type OnOffConfig = StatusActiveConfig & {
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
  topicSetOutletInUse?: string,
  valueOutletInUse?: string,
  valueOutletNotInUse?: string,
}

export type SwitchConfig = OnOffConfig & {
}