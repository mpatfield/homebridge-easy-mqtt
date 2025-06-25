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

export type LockConfig = Assertable & AccessoryConfig & {
  topicGetCurrent: string,
  topicGetTarget: string,
  topicSetTarget: string,
  topicGetActive?: string,
  valueSecured: string,
  valueUnsecured: string,
  valueJammed?: string,
  valueActive?: string,
};

export type SwitchConfig = Assertable& AccessoryConfig & {
  topicGetOn: string,
  topicSetOn: string,
  topicGetActive?: string,
  valueOn: string,
  valueOff: string,
  valueActive?: string,
}
