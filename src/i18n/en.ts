const en = {

  accessory: {
    batteryLevel: '%s battery is at %d%', // accessory name, number
    batteryLow: '%s battery is low', // accessory name
    batteryNotLow: '%s battery is okay', // accessory name
    missingRequired: '%s is missing required config variable %s', // accessory name, variable name
    statusActive: '%s is now available', // accessory name
    statusInactive: '%s is unavailable', // accessory name
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
      celsius: '°C',
      fahrenheit: '°F',
      carbonDioxideSensor: 'CO2 Sensor',
      carbonMonoxideSensor: 'CO Sensor',
      contactSensor: 'Contact Sensor',
      humiditySensor: 'Humidity Sensor',
      leakSensor: 'Leak Sensor',
      lightbulb: 'Lightbulb',
      lockMechanism: 'Lock Mechanism',
      motionSensor: 'Motion Sensor',
      occupancySensor: 'Occupancy Sensor',
      outlet: 'Outlet',
      switch: 'Switch',
      securitySystem: 'Security System',
      smokeSensor: 'Smoke Sensor',
      temperatureSensor: 'Temperature Sensor',
    },

    title: {
      accessory: 'Accessory',
      broker: 'Broker',
      disableLogging: 'Disable Logging',
      name: 'Name',
      options: 'Options',
      password: 'Password',
      sourceUnits: 'Source Units',
      topicGetBatteryLevel: 'Get Battery Level',
      topicGetBatteryLow: 'Get Battery Low',
      topicGetStatusActive: 'Get Availability',
      topicGetCurrentLockState: 'Get Current State*',
      topicGetOutletInUse: 'Get In Use State',
      topicGetOn: 'Get On/Off State*',
      topicGetTargetLockState: 'Get Target State*',
      topicGetBrightness: 'Get Brightness',
      topicSetBrightness: 'Set Brightness',
      topicGetHue: 'Get Hue',
      topicSetHue: 'Set Hue',
      topicGetColorTemperature: 'Get Color Temperature',
      topicSetColorTemperature: 'Set Color Temperature',
      topicGetSaturation: 'Get Saturation',
      topicSetSaturation: 'Set Saturation',
      topicSetOn: 'Set On/Off State*',
      topicSetTargetLockState: 'Set Target State*',
      topicGetCurrentTemperature: 'Get Current Temperature*',
      topicGetCurrentSecurityState: 'Get Current State*',
      topicGetTargetSecurityState: 'Get Target State*',
      topicSetTargetSecurityState: 'Set Target State*',
      topicGetStatusTampered: 'Get Tampered',
      topicGetStatusFault: 'Get Fault',
      topicGetCarbonMonoxideDetected: 'Get CO Detected*',
      topicGetCarbonMonoxideLevel: 'Get CO Level',
      topicGetCarbonMonoxidePeakLevel: 'Get CO Peak Level',
      topicGetCarbonDioxideDetected: 'Get CO2 Detected*',
      topicGetCarbonDioxideLevel: 'Get CO2 Level',
      topicGetCarbonDioxidePeakLevel: 'Get CO2 Peak Level',
      topicGetContactSensorState: 'Get Contact Detected*',
      topicGetLeakDetected: 'Get Leak Detected*',
      topicGetMotionDetected: 'Get Motion Detected*',
      topicGetOccupancyDetected: 'Get Occupancy Detected*',
      topicGetSmokeDetected: 'Get Smoke Detected*',
      topicGetCurrentRelativeHumidity: 'Get Relative Humidity*',
      topics: 'Topics',
      type: 'Type',
      username: 'Username',
      valueBatteryLow: 'Battery Low',
      valueStatusActive: 'Available/Reachable',
      valueLockStateJammed: 'Jammed',
      valueOutletInUse: 'In Use',
      valueOutletNotInUse: 'Not In Use',
      valueOff: 'Off*',
      valueOn: 'On*',
      valueLockStateSecured: 'Secured/Locked*',
      valueLockStateUnsecured: 'Unsecured/Unlocked*',
      valueArmStay: 'Arm Stay',
      valueArmAway: 'Arm Away',
      valueArmNight: 'Arm Night',
      valueDisarm: 'Disarm',
      valueAlarmTriggered: 'Triggered',
      valueTampered: 'Tampered',
      valueFault: 'Fault',
      valueCarbonMonoxideDetected: 'CO Detected*',
      valueCarbonDioxideDetected: 'CO2 Detected*',
      valueContactDetected: 'Contact Detected*',
      valueLeakDetected: 'Leak Detected*',
      valueMotionDetected: 'Motion Detected*',
      valueOccupancyDetected: 'Occupancy Detected*',
      valueSmokeDetected: 'Smoke Detected*',
      values: 'Values',
      verbose: 'Additional Logging',
    },
  },

  characteristic: {
    badValue: '%s expected a number for %s but received %s', // accessory name, characteristic name, value
    updated: '%s updated %s with value %s', // accessory name, characteristic name, value
  },

  error: {
    isTampered: '%s has been tampered with', // accessory name
    hasFault: '%s has a fault', // accessory name
    noFault: '%s has no fault', // accessory name
    notTampered: '%s tampered status has been reset', // accessory name
  },

  lightbulb: {
    brightness: '%s brightness is %d%', // accessory name, number
    futureBrightness: 'Setting %s brightness to %d%…', // accessory name, number
    hue: '%s hue is %d°', // accessory name, number
    futureHue: 'Setting %s hue to %d°…', // accessory name, number
    colorTemperature: '%s color temperature is %dM', // accessory name, number
    futureColorTemperature: 'Setting %s color temperature to %dM…', // accessory name, number
    saturation: '%s saturation is %d%', // accessory name, number
    futureSaturation: 'Setting %s saturation to %d%…', // accessory name, number
  },

  lock: {
    badValue: '%s unable to determine lock state from %s', // accessory name, value
    stateCurrentSecured: '%s is locked', // accessory name
    stateCurrentUnsecured: '%s is unlocked', // accessory name
    stateFutureSecured: 'Locking %s…', // accessory name
    stateFutureUnsecured: 'Unlocking %s…', // accessory name
    stateJammed: '%s is jammed', // accessory name
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
    publish: '%s publishing value %s to topic %s', // accessory name, value, topic name
    receivedMessage: '%s received message from topic %s', // accessory name, topic name
    parseFailed: '%s failed to parse message', // accessory name
    reconnectInMinutes: '%s will attempt to reconnect in %s minutes…', // accessory name, number
    reconnectInSeconds: '%s will attempt to reconnect in %s seconds…', // accessory name, number
  },

  onOff: {
    stateFutureOff: 'Turning off %s…', // accessory name
    stateFutureOn: 'Turning on %s…', // accessory name
    stateOn: '%s is on', // accessory name
    stateOff: '%s is off', // accessory name
    unknownValue: '%s unable to determine on/off state from %s. Ignoring…', // accessory name, value
  },

  outlet: {
    badValue: '%s unable to get in-use state for %s', // accessory name, value
    inUse: '%s is in use', // accessory name
    notInUse: '%s is not in use', // accessory name
  },

  security: {
    badValue: '%s missing value for security state %s.', // accessory name, value
    noStateValues: '%s must have at least one state value defined (Arm Away, Disarm, etc.)', // accessory name
    stateCurrentArmAway: '%s is armed for away', // accessory name
    stateCurrentArmNight: '%s is armed for night', // accessory name
    stateCurrentArmStay: '%s is armed for stay', // accessory name
    stateCurrentAlarmTriggered: '%s alarm is triggered', // accessory name
    stateCurrentDisarm: '%s is disarmed', // accessory name
    stateFutureArmAway: 'Arming %s for away…', // accessory name
    stateFutureArmNight: 'Arming %s for night…', // accessory name
    stateFutureArmStay: 'Arming %s for stay…', // accessory name
    stateFutureDisarm: 'Disarming %s…', // accessory name
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

    humidity: {
      update: '%s humidity is %d%', // accessory name, number
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

    temperature: {
      update: '%s temperature is %d°%s', // accessory name, number, units
    },
  },

  startup: {
    complete: '✓ Setup complete.',
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

  temperature: {
    badValue: '%s expected a number for temperature but received %s', // accessory name, value
  },
};

export default en;