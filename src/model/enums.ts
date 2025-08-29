export enum AccessoryType {
  Lightbulb = 'Lightbulb',
  LockMechanism = 'LockMechanism',
  Outlet = 'Outlet',
  SecuritySystem = 'SecuritySystem',
  Switch = 'Switch',
  TemperatureSensor = 'TemperatureSensor',
}

export enum CharacteristicKey {
  BatteryLevel = 'BatteryLevel',
  Brightness = 'Brightness',
  ColorTemperature = 'ColorTemperature',
  Hue = 'Hue',
  LockCurrentState = 'LockCurrentState',
  LockTargetState = 'LockTargetState',
  On = 'On',
  OutletInUse = 'OutletInUse',
  Saturation = 'Saturation',
  SecuritySystemCurrentState = 'SecuritySystemCurrentState',
  SecuritySystemTargetState = 'SecuritySystemTargetState',
  StatusActive = 'StatusActive',
  StatusFault = 'StatusFault',
  StatusLowBattery = 'StatusLowBattery',
  StatusTampered = 'StatusTampered',
}

export enum TemperatureUnits {
  CELSIUS = 'C',
  FAHRENHEIT = 'F',
}