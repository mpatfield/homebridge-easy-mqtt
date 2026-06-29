export const MATTER_SERIAL_MAX_LEN = 32;

export enum MatterClusterKey {
  levelControl = 'levelControl',
  onOff = 'onOff',
}

export enum MatterValueKey {
  currentLevel = 'currentLevel',
  onOff = 'onOff',
}

export enum MatterType {
  DimmableLight = 'DimmableLight',
  OnOffLight = 'OnOffLight',
  OnOffOutlet = 'OnOffOutlet',
  OnOffSwitch = 'OnOffSwitch',
}

export type MatterValue = boolean | number;

export type MatterPath = {
  clusterKey: MatterClusterKey,
  valueKey: MatterValueKey,
}

export function MatterPath(clusterKey: MatterClusterKey, valueKey: MatterValueKey): MatterPath {
  return { clusterKey, valueKey };
}