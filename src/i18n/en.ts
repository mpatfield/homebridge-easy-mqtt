const en = {

  accessory: {
    batteryLevel: '%s battery is at %d%', // accessory name, number
    batteryLow: '%s battery is low', // accessory name
    batteryNotLow: '%s battery is okay', // accessory name
    missingRequired: '%s is missing required config variable %s', // accessory name, variable name
    statusActive: '%s is now available', // accessory name
    statusInactive: '%s is unavailable', // accessory name
  },

  characteristic: {
    badValue: '%s expected a number for %s but received %s', // accessory name, characteristic name, value
    updated: '%s updated %s with value %s', // accessory name, characteristic name, value
  },

  climate: {
    badTemperatureValue: '%s expected a number for temperature but received %s', // accessory name, value
    humidityUpdate: '%s humidity is %d%', // accessory name, number
    temperatureUpdate: '%s temperature is %d°%s', // accessory name, number, units
  },

  config: {
    continue: 'Continue %s', // arrow symbol
    required: 'Required fields are marked with an asterisk (*)',
    support: 'For documentation and support please visit %s', // link
    thankYou: 'Thank you for installing homebridge-easy-mqtt',

    description: {
      options: 'Additional MQTT parameters such as clientId or protocolVersion. Must be valid JSON.',
      topics: 'Supports JSONPath using dot notation, i.e. "my/topic$.path.to.value"',
      verbose: 'If true, additional MQTT info will be logged for debugging purposes.',
    },

    enumNames: {
      carbonDioxideSensor: 'CO2 Sensor',
      carbonMonoxideSensor: 'CO Sensor',
      celsius: '°C',
      contactSensor: 'Contact Sensor',
      fahrenheit: '°F',
      humiditySensor: 'Humidity Sensor',
      leakSensor: 'Leak Sensor',
      lightbulb: 'Lightbulb',
      lockMechanism: 'Lock Mechanism',
      motionSensor: 'Motion Sensor',
      occupancySensor: 'Occupancy Sensor',
      outlet: 'Outlet',
      securitySystem: 'Security System',
      smokeSensor: 'Smoke Sensor',
      switch: 'Switch',
      temperatureSensor: 'Temperature Sensor',
      thermostat: 'Thermostat',
    },

    title: {
      accessory: 'Accessory',
      broker: 'Broker',
      disableLogging: 'Disable Logging',
      group: 'Group',
      name: 'Name',
      options: 'Options',
      password: 'Password',
      sourceUnits: 'Source Units',
      topicGetBatteryLevel: 'Get Battery Level',
      topicGetBatteryLow: 'Get Battery Low',
      topicGetBrightness: 'Get Brightness',
      topicGetCarbonDioxideDetected: 'Get CO2 Detected*',
      topicGetCarbonDioxideLevel: 'Get CO2 Level',
      topicGetCarbonDioxidePeakLevel: 'Get CO2 Peak Level',
      topicGetCarbonMonoxideDetected: 'Get CO Detected*',
      topicGetCarbonMonoxideLevel: 'Get CO Level',
      topicGetCarbonMonoxidePeakLevel: 'Get CO Peak Level',
      topicGetColorTemperature: 'Get Color Temperature',
      topicGetContactSensorState: 'Get Contact Detected*',
      topicGetCoolingThresholdTemperature: 'Get Cooling Threshold',
      topicGetCurrentHeatingCoolingState: 'Get Current Mode*',
      topicGetCurrentLockState: 'Get Current State*',
      topicGetCurrentRelativeHumidity: 'Get Relative Humidity*',
      topicGetCurrentRelativeHumidityOptional: 'Get Relative Humidity',
      topicGetCurrentSecurityState: 'Get Current State*',
      topicGetCurrentTemperature: 'Get Current Temperature*',
      topicGetHeatingThresholdTemperature: 'Get Heating Threshold',
      topicGetHue: 'Get Hue',
      topicGetLeakDetected: 'Get Leak Detected*',
      topicGetMotionDetected: 'Get Motion Detected*',
      topicGetOccupancyDetected: 'Get Occupancy Detected*',
      topicGetOn: 'Get On/Off State*',
      topicGetOutletInUse: 'Get In Use State',
      topicGetSaturation: 'Get Saturation',
      topicGetSmokeDetected: 'Get Smoke Detected*',
      topicGetStatusActive: 'Get Availability',
      topicGetStatusFault: 'Get Fault',
      topicGetStatusTampered: 'Get Tampered',
      topicGetTargetHeatingCoolingState: 'Get Target Mode*',
      topicGetTargetLockState: 'Get Target State*',
      topicGetTargetRelativeHumidity: 'Get Target Humidity',
      topicGetTargetSecurityState: 'Get Target State*',
      topicGetTargetTemperature: 'Get Target Temperature*',
      topicSetBrightness: 'Set Brightness',
      topicSetColorTemperature: 'Set Color Temperature',
      topicSetCoolingThresholdTemperature: 'Set Cooling Threshold',
      topicSetHeatingThresholdTemperature: 'Set Heating Threshold',
      topicSetHue: 'Set Hue',
      topicSetOn: 'Set On/Off State*',
      topicSetSaturation: 'Set Saturation',
      topicSetTargetHeatingCoolingState: 'Set Target Mode*',
      topicSetTargetLockState: 'Set Target State*',
      topicSetTargetRelativeHumidity: 'Set Target Humidity ',
      topicSetTargetSecurityState: 'Set Target State*',
      topicSetTargetTemperature: 'Set Target Temperature*',
      topics: 'Topics',
      type: 'Type',
      username: 'Username',
      valueAlarmTriggered: 'Triggered',
      valueArmAway: 'Arm Away',
      valueArmNight: 'Arm Night',
      valueArmStay: 'Arm Stay',
      valueBatteryLow: 'Battery Low',
      valueCarbonDioxideDetected: 'CO2 Detected*',
      valueCarbonMonoxideDetected: 'CO Detected*',
      valueContactDetected: 'Contact Detected*',
      valueDisarm: 'Disarm',
      valueFault: 'Fault',
      valueLeakDetected: 'Leak Detected*',
      valueLockStateJammed: 'Jammed',
      valueLockStateSecured: 'Secured/Locked*',
      valueLockStateUnsecured: 'Unsecured/Unlocked*',
      valueModeAuto: 'Auto',
      valueModeCool: 'Cool',
      valueModeHeat: 'Heat',
      valueModeOff: 'Off',
      valueMotionDetected: 'Motion Detected*',
      valueOccupancyDetected: 'Occupancy Detected*',
      valueOff: 'Off*',
      valueOn: 'On*',
      valueOutletInUse: 'In Use',
      valueOutletNotInUse: 'Not In Use',
      valueSmokeDetected: 'Smoke Detected*',
      valueStatusActive: 'Available/Reachable',
      valueTampered: 'Tampered',
      values: 'Values',
      verbose: 'Additional Logging',
    },
  },

  error: {
    hasFault: '%s has a fault', // accessory name
    isTampered: '%s has been tampered with', // accessory name
    noFault: '%s has no fault', // accessory name
    notTampered: '%s tampered status has been reset', // accessory name
  },

  lightbulb: {
    brightness: '%s brightness is %d%', // accessory name, number
    brightnessFuture: 'Setting %s brightness to %d%…', // accessory name, number
    colorTemperature: '%s color temperature is %dM', // accessory name, number
    colorTemperatureFuture: 'Setting %s color temperature to %dM…', // accessory name, number
    hue: '%s hue is %d°', // accessory name, number
    hueFuture: 'Setting %s hue to %d°…', // accessory name, number
    saturation: '%s saturation is %d%', // accessory name, number
    saturationFuture: 'Setting %s saturation to %d%…', // accessory name, number
  },

  lock: {
    badValue: '%s unable to determine lock state from %s', // accessory name, value
    stateJammed: '%s is jammed', // accessory name
    stateSecured: '%s is locked', // accessory name
    stateSecuredFuture: 'Locking %s…', // accessory name
    stateUnsecured: '%s is unlocked', // accessory name
    stateUnsecuredFuture: 'Unlocking %s…', // accessory name
    stateUnknown: '%s state is unknown', // accessory name
  },

  mqtt: {
    badOptions: '%s additional options must be valid json', // accessory name
    clientError: '%s client error:', // accessory name
    connected: '%s connected and listening for updates…', // accessory name
    connectionClosed: '%s connection closed', // accessory name
    idleConnection: '%s idle connection', // accessory name
    noListeners: '%s no listeners for topic %s', // accessory name, topic name
    notConnected: '%s client not connected', // accessory name
    parseFailed: '%s failed to parse message', // accessory name
    publish: '%s publishing value %s to topic %s', // accessory name, value, topic name
    receivedMessage: '%s received message from topic %s', // accessory name, topic name
    reconnectInMinutes: '%s will attempt to reconnect in %s minutes…', // accessory name, number
    reconnectInSeconds: '%s will attempt to reconnect in %s seconds…', // accessory name, number
  },

  onOff: {
    stateOff: '%s is off', // accessory name
    stateOffFuture: 'Turning off %s…', // accessory name
    stateOn: '%s is on', // accessory name
    stateOnFuture: 'Turning on %s…', // accessory name
    unknownValue: '%s unable to determine on/off state from %s. Ignoring…', // accessory name, value
  },

  outlet: {
    badValue: '%s unable to get in-use state for %s', // accessory name, value
    inUse: '%s is in use', // accessory name
    notInUse: '%s is not in use', // accessory name
  },

  security: {
    badValue: '%s missing value for security state %s', // accessory name, value
    noStateValues: '%s must have at least one state value defined (Arm Away, Disarm, etc.)', // accessory name
    stateAway: '%s is armed for away', // accessory name
    stateAwayFuture: 'Arming %s for away…', // accessory name
    stateDisarmed: '%s is disarmed', // accessory name
    stateDisarmFuture: 'Disarming %s…', // accessory name
    stateNight: '%s is armed for night', // accessory name
    stateNightFuture: 'Arming %s for night…', // accessory name
    stateStay: '%s is armed for stay', // accessory name
    stateStayFuture: 'Arming %s for stay…', // accessory name
    stateTriggered: '%s alarm is triggered', // accessory name
    stateUnknown: '%s state is unknown', // accessory name
    unknownValue: '%s unable to determine security state from value %s. Ignoring…', // accessory name, value
  },

  sensor: {

    carbonDioxide: {
      active: '%s detected carbon dioxide', // accessory name
      inactive: '%s stopped detecting carbon dioxide', // accessory name
      level: '%s CO2 level is %d', // accessory name, number
      peakLevel: '%s CO2 peak level is %d', // accessory name, number
    },

    carbonMonoxide: {
      active: '%s detected carbon monoxide', // accessory name
      inactive: '%s stopped detecting carbon monoxide', // accessory name
      level: '%s CO level is %d',  // accessory name, number
      peakLevel: '%s CO peak level is %d', // accessory name, number
    },

    contact: {
      active: '%s detected contact', // accessory name
      inactive: '%s stopped detecting contact', // accessory name
    },

    leak: {
      active: '%s detected a leak', // accessory name
      inactive: '%s stopped detecting leaks', // accessory name
    },

    motion: {
      active: '%s detected motion', // accessory name
      inactive: '%s stopped detecting motion', // accessory name
    },

    occupancy: {
      active: '%s detected occupancy', // accessory name
      inactive: '%s stopped detecting occupancy', // accessory name
    },

    smoke: {
      active: '%s detected smoke', // accessory name
      inactive: '%s stopped detecting smoke', // accessory name
    },
  },

  startup: {
    complete: '✓ Setup complete',
    newAccessory: 'Adding %s', // accessory name
    removeAccessory: 'Removing %s', // accessory name
    restoringAccessory: 'Restoring %s', // accessory name
    unsupportedType: 'Unsupported accessory type %s', // accessory type
    welcome: [
      'Please ★ this plugin on GitHub if you\'re finding it useful! https://github.com/mpatfield/homebridge-easy-mqtt',
      'Would you like to sponsor this plugin? https://github.com/sponsors/mpatfield',
      'Want to see this plugin in your own language? Please visit https://github.com/mpatfield/homebridge-easy-mqtt/issues/4',
    ],
  },

  thermostat: {
    badValue: '%s missing value for thermostat state %s', // accessory name, value
    coolingThreshold: '%s cooling threshold is %d°%s', // accessory name, number, units
    coolingThresholdFuture: '%s setting cooling threshold to %d°%s…', // accessory name, number, units
    heatingThreshold: '%s heating threshold is %d°%s', // accessory name, number, units
    heatingThresholdFuture: '%s setting heating threshold to %d°%s…', // accessory name, number, units
    humidityFuture: 'Setting %s humidity to %d%…', // accessory name, number
    noStateValues: '%s must have at least one state value defined (Off, Heat, Cool)', // accessory name
    stateAutoFuture: 'Setting %s to auto…', // accessory name
    stateCool: '%s is set to cool', // accessory name
    stateCoolFuture: 'Setting %s to cool…', // accessory name
    stateHeat: '%s is set to heat', // accessory name
    stateHeatFuture: 'Setting %s to heat…', // accessory name
    stateOff: '%s is set to off', // accessory name
    stateOffFuture: 'Turning %s off…', // accessory name
    stateUnknown: '%s state is unknown', // accessory name
    temperatureTarget: '%s target temperature is %d°%s', // accessory name, number, units
    temperatureTargetFuture: '%s setting temperature to %d°%s…', // accessory name, number, units
    unknownValue: '%s unable to determine thermostat state from value %s. Ignoring…', // accessory name, value
  },
};

export default en;