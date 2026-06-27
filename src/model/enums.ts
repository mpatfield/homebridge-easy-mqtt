export enum Protocol {
  HomeKit = 'HomeKit',
  Matter = 'Matter',
}

export enum AccessoryType {
  AirPurifier = 'AirPurifier',
  AirQualitySensor = 'AirQualitySensor',
  CarbonDioxideSensor = 'CarbonDioxideSensor',
  CarbonMonoxideSensor = 'CarbonMonoxideSensor',
  ContactSensor = 'ContactSensor',
  Doorbell = 'Doorbell',
  Fanv2 = 'Fanv2',
  GarageDoorOpener = 'GarageDoorOpener',
  HeaterCooler = 'HeaterCooler',
  HumiditySensor = 'HumiditySensor',
  LeakSensor = 'LeakSensor',
  Lightbulb = 'Lightbulb',
  LightSensor = 'LightSensor',
  LockMechanism = 'LockMechanism',
  MotionSensor = 'MotionSensor',
  OccupancySensor = 'OccupancySensor',
  Outlet = 'Outlet',
  SecuritySystem = 'SecuritySystem',
  ServiceLabel = 'ServiceLabel',
  SmokeSensor = 'SmokeSensor',
  StatelessProgrammableSwitch = 'StatelessProgrammableSwitch',
  Switch = 'Switch',
  TemperatureSensor = 'TemperatureSensor',
  Thermostat = 'Thermostat',
  Valve = 'Valve',
  Window = 'Window',
  WindowCovering = 'WindowCovering',
}

export enum ColorType {
  HSB = 'HSB',
  RGB = 'RGB',
  RGBW = 'RGBW',
  RGBWW = 'RGBWW',
}

export enum LabelType {
  DOTS = 'DOTS',
  ARABIC_NUMERALS = 'ARABIC_NUMERALS'
}

export enum TimeUnits {
  MILLISECONDS = 'MILLISECONDS',
  SECONDS = 'SECONDS',
  MINUTES = 'MINUTES',
  HOURS = 'HOURS',
}

export enum ValveType {
  GENERIC_VALVE = 'GENERIC_VALVE',
  IRRIGATION = 'IRRIGATION',
  SHOWER_HEAD = 'SHOWER_HEAD',
  WATER_FAUCET = 'WATER_FAUCET',
}