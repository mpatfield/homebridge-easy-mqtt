export type Primitive = string | number | boolean;

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
}

export type AccessoryConfig = {
  mqtt: MQTTConfig,
  info: InfoConfig,
}

export type LockConfig = AccessoryConfig & {
  topicGetCurrent: string,
  topicGetTarget: string,
  topicSetTarget: string,
  topicGetStatus?: string,
  valueSecured: string,
  valueUnsecured: string,
  valueJammed?: string,
  valueActive?: string,
};
