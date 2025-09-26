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
    coolingThreshold: '%s cooling threshold is %d°%s', // accessory name, number, units
    coolingThresholdFuture: 'Setting %s cooling threshold to %d°%s…', // accessory name, number, units (fr)
    heatingThreshold: '%s heating threshold is %d°%s', // accessory name, number, units
    heatingThresholdFuture: 'Setting %s heating threshold to %d°%s…', // accessory name, number, units (fr)
    humidityUpdate: '%s humidity is %d%', // accessory name, number
    temperatureUpdate: '%s temperature is %d°%s', // accessory name, number, units
  },

  config: {
    continue: 'Continue %s', // arrow symbol
    required: 'Required fields are marked with an asterisk (*)',
    support: 'For documentation and support please visit %s', // link
    thankYou: 'Thank you for installing homebridge-easy-mqtt',

    description: {
      broker: 'If not supplied, defaults to mqtt://127.0.0.1:1883/', // (fr) (ro)
      options: 'A combination of additional client or publish options as valid JSON', // (fr) (ro)
      topics: 'Supports JSONPath using dot notation, i.e. "my/topic$.path.to.value"',
      values: 'Used for both get and set (publish), where appropriate', // (fr) (ro)
      verbose: 'If true, additional MQTT info will be logged for debugging purposes.',
    },

    enumNames: {
      airPurifier: 'Air Purifier', // (fr)
      carbonDioxideSensor: 'CO2 Sensor',
      carbonMonoxideSensor: 'CO Sensor',
      celsius: '°C',
      contactSensor: 'Contact Sensor',
      fahrenheit: '°F',
      fanv2: 'Fan (v2)', // (fr) (ro)
      garageDoorOpener: 'Garage Door', // (fr) (ro)
      heaterCooler: 'Heater/Cooler', // (fr)
      humiditySensor: 'Humidity Sensor',
      leakSensor: 'Leak Sensor',
      lightbulb: 'Lightbulb',
      lightSensor: 'Light Sensor', // (fr)
      lockMechanism: 'Lock Mechanism',
      motionSensor: 'Motion Sensor',
      occupancySensor: 'Occupancy Sensor',
      outlet: 'Outlet',
      securitySystem: 'Security System',
      smokeSensor: 'Smoke Sensor',
      switch: 'Switch',
      temperatureSensor: 'Temperature Sensor',
      thermostat: 'Thermostat',
      valve: 'Valve', // (fr)
      valveGeneric: 'Generic', // (fr)
      valveIrrigation: 'Irrigation', // (fr)
      valveShower: 'Shower Head', // (fr)
      valveFaucet: 'Water Faucet', // (fr)
    },

    title: {
      accessory: 'Accessory',
      broker: 'Broker',
      disableLogging: 'Disable Logging',
      group: 'Group',
      name: 'Name',
      options: 'Options',
      password: 'Password',
      resetOnRestart: 'Reset on Restart', // (fr) (ro)
      sourceUnits: 'Source Units',
      topicGetActive: 'Get Active*', // (fr)
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
      topicGetCurrentAmbientLightLevel: 'Get Current Light Level*', // (fr)
      topicGetCurrentDoorState: 'Get Current Door State*', // (fr) (ro)
      topicGetCurrentFanState: 'Get Current Mode', // (fr) (ro)
      topicGetCurrentHeaterCoolerState: 'Get Current Mode*', // (fr)
      topicGetCurrentHeatingCoolingState: 'Get Current Mode*',
      topicGetCurrentPurifierState: 'Get Current Mode*', // (fr)
      topicGetCurrentLockState: 'Get Current State*',
      topicGetCurrentLockStateOptional: 'Get Current Lock State', // (fr) (ro)
      topicGetCurrentRelativeHumidity: 'Get Relative Humidity*',
      topicGetCurrentRelativeHumidityOptional: 'Get Relative Humidity',
      topicGetCurrentSecurityState: 'Get Current State*',
      topicGetCurrentTemperature: 'Get Current Temperature*',
      topicGetFilterChangeIndication: 'Filter Change Indication', // (fr) (ro)
      topicGetFilterLifeLevel: 'Filter Life Remaining', // (fr) (ro)
      topicGetHeatingThresholdTemperature: 'Get Heating Threshold',
      topicGetHue: 'Get Hue',
      topicGetLeakDetected: 'Get Leak Detected*',
      topicGetLockPhysicalControls: 'Get Controls Locked', // (fr)
      topicGetMotionDetected: 'Get Motion Detected*',
      topicGetObstructionDetected: 'Get Obstruction Detected*', // (fr) (ro)
      topicGetOccupancyDetected: 'Get Occupancy Detected*',
      topicGetOn: 'Get On/Off State*',
      topicGetOutletInUse: 'Get In Use State',
      topicGetRotationDirection: 'Get Direction', // (fr) (ro)
      topicGetRotationSpeed: 'Get Rotation Speed', // (fr)
      topicGetSaturation: 'Get Saturation',
      topicGetSmokeDetected: 'Get Smoke Detected*',
      topicGetSwingMode: 'Get Swing Enabled', // (fr)
      topicGetStatusActive: 'Get Availability',
      topicGetStatusFault: 'Get Fault',
      topicGetStatusTampered: 'Get Tampered',
      topicGetTargetDoorState: 'Get Target Door State*', // (fr) (ro)
      topicGetTargetFanState: 'Get Target Mode', // (fr) (ro)
      topicGetTargetHeaterCoolerState: 'Get Target Mode*', // (fr)
      topicGetTargetHeatingCoolingState: 'Get Target Mode*',
      topicGetTargetPurifierState: 'Get Target Mode*', // (fr)
      topicGetTargetLockState: 'Get Target State*',
      topicGetTargetLockStateOptional: 'Get Target Lock State', // (fr) (ro)
      topicGetTargetRelativeHumidity: 'Get Target Humidity',
      topicGetTargetSecurityState: 'Get Target State*',
      topicGetTargetTemperature: 'Get Target Temperature*',
      topicGetValveActive: 'Get Active*', // (fr)
      topicGetValveInUse: 'Get In Use*', // (fr)
      topicGetValveIsConfigured: 'Get Is Configured', // (fr)
      topicGetValveRemainingDuration: 'Get Duration Remaining', // (fr)
      topicGetValveSetDuration: 'Get Duration', // (fr)
      topicResetFilterIndication: 'Reset Filter', // (fr) (ro)
      topicSetActive: 'Set Active*', // (fr)
      topicSetBrightness: 'Set Brightness',
      topicSetColorTemperature: 'Set Color Temperature',
      topicSetCoolingThresholdTemperature: 'Set Cooling Threshold',
      topicSetHeatingThresholdTemperature: 'Set Heating Threshold',
      topicSetHue: 'Set Hue',
      topicSetLockPhysicalControls: 'Set Lock Controls', // (fr)
      topicSetOn: 'Set On/Off State*',
      topicSetRotationDirection: 'Set Direction', // (fr) (ro)
      topicSetRotationSpeed: 'Set Rotation Speed', // (fr)
      topicSetSaturation: 'Set Saturation',
      topicSetSwingMode: 'Set Swing Enabled', // (fr)
      topicSetTargetDoorState: 'Set Target Door State*', // (fr) (ro)
      topicSetTargetFanState: 'Set Target Mode', // (fr) (ro)
      topicSetTargetHeaterCoolerState: 'Set Target Mode*', // (fr)
      topicSetTargetHeatingCoolingState: 'Set Target Mode*',
      topicSetTargetPurifierState: 'Set Target Mode*', // (fr)
      topicSetTargetLockState: 'Set Target State*',
      topicSetTargetLockStateOptional: 'Set Target Lock State', // (fr) (ro)
      topicSetTargetRelativeHumidity: 'Set Target Humidity ',
      topicSetTargetSecurityState: 'Set Target State*',
      topicSetTargetTemperature: 'Set Target Temperature*',
      topicSetValveActive: 'Set Active*', // (fr)
      topicSetValveIsConfigured: 'Set Is Configured', // (fr)
      topicSetValveSetDuration: 'Set Duration', // (fr)
      topics: 'Topics',
      type: 'Type',
      username: 'Username',
      valveType: 'Valve Type', // (fr)
      valueActive: 'Active*', // (fr)
      valueAlarmTriggered: 'Triggered',
      valueArmAway: 'Arm Away',
      valueArmNight: 'Arm Night',
      valueArmStay: 'Arm Stay',
      valueBatteryLow: 'Battery Low',
      valueCarbonDioxideDetected: 'CO2 Detected*',
      valueCarbonMonoxideDetected: 'CO Detected*',
      valueConfigured: 'Configured', // (fr)
      valueContactDetected: 'Contact Detected*',
      valueControlLock: 'Controls Locked', // (fr)
      valueControlUnlock: 'Controls Unlocked', // (fr)
      valueDirectionClockwise: 'Clockwise', // (fr) (ro)
      valueDirectionCounterClockwise: 'Counter Clockwise', // (fr) (ro)
      valueDisarm: 'Disarm',
      valueDoorObstructed: 'Obstructed', // (fr) (ro)
      valueDoorStateClosed: 'Closed', // (fr) (ro)
      valueDoorStateClosing: 'Closing', // (fr) (ro)
      valueDoorStateOpen: 'Open', // (fr) (ro)
      valueDoorStateOpening: 'Opening', // (fr) (ro)
      valueDoorStateStopped: 'Stopped', // (fr) (ro)
      valueFault: 'Fault',
      valueFilterChange: 'Filter Dirty', // (fr) (ro)
      valueFilterReset: 'Reset Filter', // (fr) (ro)
      valueInactive: 'Inactive*', // (fr)
      valueInUse: 'In Use*', // (fr)
      valueLeakDetected: 'Leak Detected*',
      valueLockStateJammed: 'Jammed',
      valueLockStateSecured: 'Secured/Locked*',
      valueLockStateSecuredOptional: 'Secured/Locked', // (fr) (ro)
      valueLockStateUnsecured: 'Unsecured/Unlocked*',
      valueLockStateUnsecuredOptional: 'Unsecured/Unlocked', // (fr) (ro)
      valueModeAuto: 'Auto',
      valueModeBlowing: 'Blowing', // (fr) (ro)
      valueModeCool: 'Cool',
      valueModeHeat: 'Heat',
      valueModeIdle: 'Idle', // (fr)
      valueModeInactive: 'Inactive', // (fr)
      valueModeManual: 'Manual', // (fr)
      valueModeOff: 'Off',
      valueModePurifying: 'Purifying', // (fr)
      valueMotionDetected: 'Motion Detected*',
      valueNotConfigured: 'Not Configured', // (fr)
      valueOccupancyDetected: 'Occupancy Detected*',
      valueOff: 'Off*',
      valueOn: 'On*',
      valueOutletInUse: 'In Use',
      valueOutletNotInUse: 'Not In Use',
      valueSmokeDetected: 'Smoke Detected*',
      valueStateActive: 'State Active*', // (fr)
      valueStateInactive: 'State Inactive*', // (fr)
      valueStatusActive: 'Available/Reachable',
      valueSwingEnabled: 'Swing Enabled', // (fr)
      valueSwingDisabled: 'Swing Disabled', // (fr)
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

  fanv2: {  // (fr) (ro)
    badValue: '%s missing value for fan state %s', // accessory name, value
    clockwise: '%s is rotation clockwise', // accessory name
    counterClockwise: '%s is rotation counter clockwise', // accessory name
    noCurrentStateValues: '%s must have at least one state value defined (Inactive, Idle, Blowing)', // accessory name
    noTargetStateValues: '%s must have at least one target state value defined (Auto, Manual)', // accessory name
    setDirectionClockwise: 'Setting %s rotation direction to clockwise…', // accessory name
    setDirectionCounterClockwise: 'Setting %s rotation direction to counter clockwise…', // accessory name
    stateAuto: 'Setting %s to auto…', // accessory name
    stateBlowing: '%s is blowing air', // accessory name
    stateIdle: '%s is idle', // accessory name
    stateInactive: '%s is inactive', // accessory name
    stateManual: 'Setting %s to manual…', // accessory name
    stateUnknown: '%s state is unknown', // accessory name
    unknownValue: '%s unable to determine fan state from value %s. Ignoring…', // accessory name, value
  },

  filter: { // (fr) (ro)
    change: '%s filter requires maintenance', // accessory name
    level: '%s filter is at %d%', // accessory name, number
    ok: '%s filter is ok', // accessory name
    reset: 'Resetting filter for %s…', // accessory name
  },

  garage: { // (fr) (ro)
    badValue: '%s missing value for garage door state %s', // accessory name, value
    noCurrentStateValues: '%s must have at least one state value defined (Open, Closed, Opening, Closing, Stopped)', // accessory name
    noTargetStateValues: '%s must have at least one target state value defined (Open, Closed)', // accessory name
    obstructed: '%s is obstructed', // accessory name
    stateClosed: '%s is closed', // accessory name
    stateClosedFuture: 'Closing %s…', // accessory name
    stateClosing: '%s is closing', // accessory name
    stateOpen: '%s is open', // accessory name
    stateOpenFuture: 'Opening %s…', // accessory name
    stateOpening: '%s is opening', // accessory name
    stateStopped: '%s is stopped', // accessory name
    stateUnknown: '%s state is unknown', // accessory name
    unknownValue: '%s unable to determine door state from value %s. Ignoring…', // accessory name, value
    unobstructed: '%s is unobstructed', // accessory name
  },

  heaterCooler: { // (fr)
    active: '%s is active', // accessory name
    activeSet: 'Setting %s to active…', // accessory name
    badValue: '%s missing value for heater/cooler state %s', // accessory name, value
    controlsLocked: '%s controls are locked', // accessory name
    controlsLockFuture: 'Setting %s controls to locked…', // accessory name
    controlsUnLocked: '%s controls are unlocked', // accessory name
    controlsUnlockFuture: 'Setting %s controls to unlocked…', // accessory name
    inactiveSet: 'Setting %s to inactive…', // accessory name
    noStateValues: '%s must have at least one state value defined (Inactive, Idle, Heating, Cooling)', // accessory name
    notActive: '%s is not active', // accessory name
    rotationUpdate: '%s rotation is %d%', // accessory name, number
    rotationSet: 'Setting %s rotation speed to %d%…', // accessory name, number
    swingDisabled: '%s swing is disabled', // accessory name
    swingDisabledFuture: 'Setting %s swing to disabled…', // accessory name
    swingEnabled: '%s swing is enabled', // accessory name
    swingEnabledFuture: 'Setting %s swing to enabled…', // accessory name
    stateAuto: 'Setting %s to auto…', // accessory name
    stateCool: 'Setting %s to cool…', // accessory name
    stateCooling: '%s is cooling', // accessory name
    stateHeat: 'Setting %s to heat…', // accessory name
    stateHeating: '%s is heating', // accessory name
    stateIdle: '%s is idle', // accessory name
    stateInactive: '%s is inactive', // accessory name
    stateUnknown: '%s state is unknown', // accessory name
    unknownValue: '%s unable to determine heater/cooler state from value %s. Ignoring…', // accessory name, value
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

  mqttClient: { // (fr)
    badOptions: 'Additional options for %s must be valid json', // accessory name
    badMessages: 'onConnect messages must be an array of topic/message objects', // (fr) (ro)
    connected: 'Connected to %s and listening for updates…', // host
    connectionClosed: 'Closed connection to %s', // host
    error: 'Client error on %s', // host
    new: '%s creating a new client with id %s', // accessory name, uuid
    noListeners: 'No listeners on %s for topic %s', // host, topic
    notConnected: 'Client not connected to %s', // host
    parseFailed: 'Failed to parse message on %s', // host
    publish: 'Publishing to %s', // host
    reuse: '%s reusing existing client with id %s', // accessory name, uuid
    receivedMessage: 'Received message on %s with topic %s', // host, topic
    reconnectMinutes: 'Will attempt to reconnect to %s in %s minutes…', // host, number
    reconnectSeconds: 'Will attempt to reconnect to %s in %s seconds…', // host, number
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

  purifier: { // (fr)
    badValue: '%s missing value for air purifier state %s', // accessory name, value
    noCurrentStateValues: '%s must have at least one state value defined (Inactive, Idle, Purifying)', // accessory name
    noTargetStateValues: '%s must have at least one state value defined (Auto, Manual)', // accessory name
    stateAuto: 'Setting %s to auto…', // accessory name
    stateIdle: '%s is idle', // accessory name
    stateInactive: '%s is inactive', // accessory name    stateUnknown: '%s state is unknown', // accessory name
    stateManual: 'Setting %s to manual…', // accessory name
    statePurifying: '%s is purifying', // accessory name
    stateUnknown: '%s state is unknown', // accessory name
    unknownValue: '%s unable to determine air purifier state from value %s. Ignoring…', // accessory name, value
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

    light: {
      level: '%s current light level is %d lx', // (fr)
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

  valve: { // (fr)
    active: '%s is active', // accessory name
    activeSet: 'Setting %s to active…', // accessory name
    badValveType: '%s has a bad valve type %s. Should be one of %s.', // accessory name, value, list of values
    configured: '%s is configured', // accessory name
    configuredFuture: 'Setting %s is to configured…', // accessory name
    durationRemaining: '%s has %d seconds remaining', // accessory name
    inactive: '%s is inactive', // accessory name
    inactiveSet: 'Setting %s to inactive…', // accessory name
    inUse: '%s is in use', // accessory name
    notConfigured: '%s is not configured', // accessory name
    notConfiguredFuture: 'Setting %s is to unconfigured…', // accessory name
    notInUse: '%s is not in use', // accessory name
    setDuration: '%s set duration is %d seconds', // accessory name
    setDurationFuture: '%s will run for %d seconds', // accessory name
  },
};

export default en;