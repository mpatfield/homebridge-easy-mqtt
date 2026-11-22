export const MATTER_SERIAL_MAX_LEN = 32;

export enum MatterAccessoryType {
  ElectricalMeter = 'ElectricalMeter',
  ElectricalSensor = 'ElectricalSensor',
  Lightbulb = 'Lightbulb',
  Outlet = 'Outlet',
  Switch = 'Switch',
}

export enum MatterClusterKey {
  electricalEnergyMeasurement = 'electricalEnergyMeasurement',
  electricalPowerMeasurement = 'electricalPowerMeasurement',
  levelControl = 'levelControl',
  onOff = 'onOff',
}

export enum MatterValueKey {
  activeCurrent = 'activeCurrent',
  activePower = 'activePower',
  currentLevel = 'currentLevel',
  onOff = 'onOff',
  voltage = 'voltage',
}

export enum MatterType {
  DimmableLight = 'DimmableLight',
  ElectricalMeter = 'ElectricalMeter',
  ElectricalSensor = 'ElectricalSensor',
  OnOffLight = 'OnOffLight',
  OnOffOutlet = 'OnOffOutlet',
  OnOffSwitch = 'OnOffSwitch',
}

export enum MatterHandlerKey {
  off = 'off',
}

export type MatterValue = boolean | number;

export type MatterClusterPath = {
  clusterKey: MatterClusterKey,
  valueKey: MatterValueKey,
}

export function MatterClusterPath(clusterKey: MatterClusterKey, valueKey: MatterValueKey): MatterClusterPath {
  return { clusterKey, valueKey };
}