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

export type InfoConfig = {
  name: string,
  type: string,
  manufacturer?: string,
  model?: string,
  serialNumber?: string,
  version?: string,
}

export type MQTTConfig = {
  broker: string,
  options: string,
}

export type AccessoryConfig = {
  mqtt: MQTTConfig,
  info: InfoConfig,
  disableLogging: boolean,
}

export type LockConfig = AccessoryConfig & {
  topicGetCurrent: string,
  topicGetTarget: string,
  topicSetTarget: string,
  topicGetActive?: string,
  valueSecured: string,
  valueUnsecured: string,
  valueJammed?: string,
  valueActive?: string,
};

export type SwitchConfig = AccessoryConfig & {
  topicGetOn: string,
  topicSetOn: string,
  topicGetActive?: string,
  valueOn: string,
  valueOff: string,
  valueActive?: string,
}
