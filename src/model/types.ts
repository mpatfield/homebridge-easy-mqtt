export type ServiceType = typeof import('homebridge').Service;
export type CharacteristicType = typeof import('homebridge').Characteristic;

export type Primitive = string | number | boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toPrimitive(value: any): Primitive {

  if (typeof value === 'boolean' || typeof value === 'number') {
    return value;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  const num = Number(value);
  if (!isNaN(num) && value.trim() !== '') {
    return num;
  }

  return value;
}

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