const en = {

  accessory: {
    badType: '%s config variable %s should have type %s but was %s', // accessory name, variable name, type, type
    batteryLevel: '%s battery is at %d%', // accessory name, number
    batteryLow: '%s battery is low', // accessory name
    batteryNotLow: '%s battery is okay', // accessory name
    missingRequired: '%s is missing required config variable %s', // accessory name, variable name
    statusActive: '%s is now available', // accessory name
    statusInactive: '%s is unavailable', // accessory name
  },

  button: {
    doublePress: '%s was double pressed', // accessory name
    longPress: '%s was long pressed', // accessory name
    noValues: '%s must have at least one event value defined (Single Press, Double Press, Long Press)', // accessory name
    singlePress: '%s was single pressed', // accessory name
    unknownValue: '%s unable to determine button press event from value %s. Ignoring…', // accessory name, value
  },

  characteristic: {
    badValue: '%s expected a number for %s but received %s', // accessory name, characteristic name, value
    outOfRange: '%s is trying to set %s to %s which is out of the allowed range. Setting to %s.', // accessory name, characteristic name, number, number
    updated: '%s updated %s with value %s', // accessory name, characteristic name, value
  },

  climate: {
    badTemperatureValue: '%s expected a number for temperature but received %s', // accessory name, value
    coolingThreshold: '%s cooling threshold is %d°%s', // accessory name, number, units
    coolingThresholdFuture: 'Setting %s cooling threshold to %d°%s…', // accessory name, number, units
    heatingThreshold: '%s heating threshold is %d°%s', // accessory name, number, units
    heatingThresholdFuture: 'Setting %s heating threshold to %d°%s…', // accessory name, number, units
    humidityUpdate: '%s humidity is %d%', // accessory name, number
    temperatureUpdate: '%s temperature is %d°%s', // accessory name, number, units
  },

  config: {
    continue: 'Continue %s', // arrow symbol
    required: 'Required fields are marked with an asterisk (*)',
    support: 'For documentation and support please visit %s', // link
    thankYou: 'Thank you for installing homebridge-easy-mqtt',

    description: {
      broker: 'If not supplied, defaults to mqtt://127.0.0.1:1883/',
      options: 'A combination of additional client or publish options as valid JSON',
      topics: 'Supports JSONPath using dot notation, i.e. "my/topic$.path.to.value"',
      values: 'Used for both get and set (publish), where appropriate',
      verbose: 'If true, additional MQTT info will be logged for debugging purposes.',
    },

    enumNames: {
      airPurifier: 'Air Purifier',
      airQualitySensor: 'Air Quality Sensor',
      carbonDioxideSensor: 'CO2 Sensor',
      carbonMonoxideSensor: 'CO Sensor',
      celsius: '°C',
      contactSensor: 'Contact Sensor',
      fahrenheit: '°F',
      fanv2: 'Fan (v2)',
      garageDoorOpener: 'Garage Door',
      heaterCooler: 'Heater/Cooler',
      humiditySensor: 'Humidity Sensor',
      leakSensor: 'Leak Sensor',
      lightbulb: 'Lightbulb',
      lightSensor: 'Light Sensor',
      lockMechanism: 'Lock Mechanism',
      motionSensor: 'Motion Sensor',
      occupancySensor: 'Occupancy Sensor',
      outlet: 'Outlet',
      securitySystem: 'Security System',
      smokeSensor: 'Smoke Sensor',
      statelessSwitch: 'Stateless Switch',
      switch: 'Switch',
      temperatureSensor: 'Temperature Sensor',
      thermostat: 'Thermostat',
      valve: 'Valve',
      valveGeneric: 'Generic',
      valveIrrigation: 'Irrigation',
      valveShower: 'Shower Head',
      valveFaucet: 'Water Faucet',
      windowCovering: 'Window Covering',
    },

    title: {
      accessory: 'Accessory',
      broker: 'Broker',
      disableLogging: 'Disable Logging',
      group: 'Group',
      name: 'Name',
      options: 'Options',
      password: 'Password',
      resetOnRestart: 'Reset on Restart',
      sourceUnits: 'Source Units',
      topicEventButtonPress: 'Button Press',
      topicGetActive: 'Get Active*',
      topicGetAirQuality: 'Get Air Quality*',
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
      topicGetCurrentAmbientLightLevel: 'Get Current Light Level*',
      topicGetCurrentDoorState: 'Get Current Door State*',
      topicGetCurrentFanState: 'Get Current Mode',
      topicGetCurrentHeaterCoolerState: 'Get Current Mode*',
      topicGetCurrentHeatingCoolingState: 'Get Current Mode*',
      topicGetCurrentHorizontalTiltAngle: 'Get Horizontal Angle',
      topicGetCurrentPurifierState: 'Get Current Mode*',
      topicGetCurrentLockState: 'Get Current State*',
      topicGetCurrentLockStateOptional: 'Get Current Lock State',
      topicGetCurrentPosition: 'Get Current Position*',
      topicGetCurrentRelativeHumidity: 'Get Relative Humidity*',
      topicGetCurrentRelativeHumidityOptional: 'Get Relative Humidity',
      topicGetCurrentSecurityState: 'Get Current State*',
      topicGetCurrentTemperature: 'Get Current Temperature*',
      topicGetCurrentVerticalTiltAngle: 'Get Vertical Angle',
      topicGetFilterChangeIndication: 'Filter Change Indication',
      topicGetFilterLifeLevel: 'Filter Life Remaining',
      topicGetHeatingThresholdTemperature: 'Get Heating Threshold',
      topicGetHue: 'Get Hue',
      topicGetLeakDetected: 'Get Leak Detected*',
      topicGetLockPhysicalControls: 'Get Controls Locked',
      topicGetMotionDetected: 'Get Motion Detected*',
      topicGetNitrogenDioxideDensity: 'Get Nitrogen Dioxide',
      topicGetObstructionDetected: 'Get Obstruction Detected*',
      topicGetObstructionDetectedOptional: 'Get Obstruction Detected',
      topicGetOccupancyDetected: 'Get Occupancy Detected*',
      topicGetOn: 'Get On/Off State*',
      topicGetOutletInUse: 'Get In Use State',
      topicGetOzoneDensity: 'Get Ozone',
      topicGetPM10Density: 'Get PM10',
      topicGetPM2_5Density: 'Get PM2.5',
      topicGetPositionState: 'Get Position State*',
      topicGetRotationDirection: 'Get Direction',
      topicGetRotationSpeed: 'Get Rotation Speed',
      topicGetSaturation: 'Get Saturation',
      topicGetSmokeDetected: 'Get Smoke Detected*',
      topicGetSwingMode: 'Get Swing Enabled',
      topicGetStatusActive: 'Get Availability',
      topicGetStatusFault: 'Get Fault',
      topicGetStatusTampered: 'Get Tampered',
      topicGetSulphurDioxideDensity: 'Get Sulphur Dioxide',
      topicGetTargetDoorState: 'Get Target Door State*',
      topicGetTargetFanState: 'Get Target Mode',
      topicGetTargetHeaterCoolerState: 'Get Target Mode*',
      topicGetTargetHeatingCoolingState: 'Get Target Mode*',
      topicGetTargetHorizontalTiltAngle: 'Get Target Horizontal Angle',
      topicGetTargetPosition: 'Get Target Position*',
      topicGetTargetPurifierState: 'Get Target Mode*',
      topicGetTargetLockState: 'Get Target State*',
      topicGetTargetLockStateOptional: 'Get Target Lock State',
      topicGetTargetRelativeHumidity: 'Get Target Humidity',
      topicGetTargetSecurityState: 'Get Target State*',
      topicGetTargetTemperature: 'Get Target Temperature*',
      topicGetTargetVerticalTiltAngle: 'Get Target Vertical Angle',
      topicGetValveActive: 'Get Active*',
      topicGetValveInUse: 'Get In Use*',
      topicGetValveIsConfigured: 'Get Is Configured',
      topicGetValveRemainingDuration: 'Get Duration Remaining',
      topicGetValveSetDuration: 'Get Duration',
      topicGetVOCDensity: 'Get VOC',
      topicResetFilterIndication: 'Reset Filter',
      topicSetActive: 'Set Active*',
      topicSetBrightness: 'Set Brightness',
      topicSetColorTemperature: 'Set Color Temperature',
      topicSetCoolingThresholdTemperature: 'Set Cooling Threshold',
      topicSetHeatingThresholdTemperature: 'Set Heating Threshold',
      topicSetHoldPosition: 'Set Hold Position',
      topicSetHue: 'Set Hue',
      topicSetLockPhysicalControls: 'Set Lock Controls',
      topicSetOn: 'Set On/Off State*',
      topicSetRotationDirection: 'Set Direction',
      topicSetRotationSpeed: 'Set Rotation Speed',
      topicSetSaturation: 'Set Saturation',
      topicSetSwingMode: 'Set Swing Enabled',
      topicSetTargetDoorState: 'Set Target Door State*',
      topicSetTargetFanState: 'Set Target Mode',
      topicSetTargetHeaterCoolerState: 'Set Target Mode*',
      topicSetTargetHeatingCoolingState: 'Set Target Mode*',
      topicSetTargetHorizontalTiltAngle: 'Set Target Horizontal Angle',
      topicSetTargetPosition: 'Set Target Position*',
      topicSetTargetPurifierState: 'Set Target Mode*',
      topicSetTargetLockState: 'Set Target State*',
      topicSetTargetLockStateOptional: 'Set Target Lock State',
      topicSetTargetRelativeHumidity: 'Set Target Humidity ',
      topicSetTargetSecurityState: 'Set Target State*',
      topicSetTargetTemperature: 'Set Target Temperature*',
      topicSetTargetVerticalTiltAngle: 'Set Target Vertical Angle',
      topicSetValveActive: 'Set Active*',
      topicSetValveIsConfigured: 'Set Is Configured',
      topicSetValveSetDuration: 'Set Duration',
      topics: 'Topics',
      type: 'Type',
      username: 'Username',
      valveType: 'Valve Type',
      valueActive: 'Active*',
      valueAlarmTriggered: 'Triggered',
      valueAQExcellent: 'AQ Excellent',
      valueAQFair: 'AQ Fair',
      valueAQGood: 'AQ Good',
      valueAQInferior: 'AQ Inferior',
      valueAQPoor: 'AQ Poor',
      valueAQUnknown: 'AQ Unknown',
      valueArmAway: 'Arm Away',
      valueArmNight: 'Arm Night',
      valueArmStay: 'Arm Stay',
      valueBatteryLow: 'Battery Low',
      valueCarbonDioxideDetected: 'CO2 Detected*',
      valueCarbonMonoxideDetected: 'CO Detected*',
      valueConfigured: 'Configured',
      valueContactDetected: 'Contact Detected*',
      valueControlLock: 'Controls Locked',
      valueControlUnlock: 'Controls Unlocked',
      valueDirectionClockwise: 'Clockwise',
      valueDirectionCounterClockwise: 'Counter Clockwise',
      valueDisarm: 'Disarm',
      valueDoorObstructed: 'Obstructed',
      valueDoorStateClosed: 'Closed',
      valueDoorStateClosing: 'Closing',
      valueDoorStateOpen: 'Open',
      valueDoorStateOpening: 'Opening',
      valueDoorStateStopped: 'Stopped',
      valueDoublePress: 'Double Press',
      valueFault: 'Fault',
      valueFilterChange: 'Filter Dirty',
      valueFilterReset: 'Reset Filter',
      valueInactive: 'Inactive*',
      valueInUse: 'In Use*',
      valueLeakDetected: 'Leak Detected*',
      valueLockStateJammed: 'Jammed',
      valueLockStateSecured: 'Secured/Locked*',
      valueLockStateSecuredOptional: 'Secured/Locked',
      valueLockStateUnsecured: 'Unsecured/Unlocked*',
      valueLockStateUnsecuredOptional: 'Unsecured/Unlocked',
      valueLongPress: 'Long Press',
      valueModeAuto: 'Auto',
      valueModeBlowing: 'Blowing',
      valueModeCool: 'Cool',
      valueModeHeat: 'Heat',
      valueModeIdle: 'Idle',
      valueModeInactive: 'Inactive',
      valueModeManual: 'Manual',
      valueModeOff: 'Off',
      valueModePurifying: 'Purifying',
      valueMotionDetected: 'Motion Detected*',
      valueNotConfigured: 'Not Configured',
      valueOccupancyDetected: 'Occupancy Detected*',
      valueOff: 'Off*',
      valueOn: 'On*',
      valueOutletInUse: 'In Use',
      valueOutletNotInUse: 'Not In Use',
      valuePositionHold: 'Hold',
      valuePositionDecreasing: 'Decreasing',
      valuePositionIncreasing: 'Increasing',
      valuePositionObstructed: 'Obstructed',
      valuePositionResume: 'Resume',
      valuePositionStopped: 'Stopped',
      valueSinglePress: 'Single Press',
      valueSmokeDetected: 'Smoke Detected*',
      valueStateActive: 'State Active*',
      valueStateInactive: 'State Inactive*',
      valueStatusActive: 'Available/Reachable',
      valueSwingEnabled: 'Swing Enabled',
      valueSwingDisabled: 'Swing Disabled',
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

  fanv2: {
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

  filter: {
    change: '%s filter requires maintenance', // accessory name
    level: '%s filter is at %d%', // accessory name, number
    ok: '%s filter is ok', // accessory name
    reset: 'Resetting filter for %s…', // accessory name
  },

  garage: {
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

  heaterCooler: {
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

  mqttClient: {
    badOptions: 'Additional options for %s must be valid json', // accessory name
    badMessages: 'onConnect messages must be an array of topic/message objects',
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

  position: {

    blind: {
      currentHorizontal: '%s current horizontal angle is %d°', // accessory name, number
      currentVertical: '%s current vertical angle is %d°', // accessory name, number
      targetHorizontal: '%s target horizontal angle is %d°', // accessory name, number
      targetHorizontalSet: 'Setting %s target horizontal angle to %d°…', // accessory name, number
      targetVertical: '%s target vertical angle is %d°', // accessory name, number
      targetVerticalSet: 'Setting %s target vertical angle to %d°…', // accessory name, number
    },

    current: '%s current position is %d%', // accessory name, number
    hold: 'Setting %s position to hold…', // accessory name
    noPositionValues: '%s must have at least one position value defined (Decreasing, Increasing, Stopped)', // accessory name
    obstructed: '%s is obstructed', // accessory name
    resume: 'Setting %s position to resume…', // accessory name
    stateDecreasing: '%s position is decreasing', // accessory name
    stateIncreasing: '%s position is increasing', // accessory name
    stateStopped: '%s position is stopped', // accessory name
    stateUnknown: '%s position state is unknown', // accessory name
    target: '%s target position is %d%', // accessory name, number
    targetSet: 'Setting %s target position to %d%…', // accessory name, number
    unknownValue: '%s unable to determine position state from value %s. Ignoring…', // accessory name, value
    unobstructed: '%s is unobstructed', // accessory name
  },

  purifier: {
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

    air: {
      noStateValues: '%s must have at least one state value defined (Excellent, Good, Fair, Inferior, Poor)', // accessory name
      densityNitrogen: '%s nitrogen density is %d µg/m³', // accessory name, number
      densityOzone: '%s ozone density is %d µg/m³', // accessory name, number
      densityPM10: '%s PM10 density is %d µg/m³', // accessory name, number
      densityPM2_5: '%s PM2.5 density is %d µg/m³', // accessory name, number
      densitySulphur: '%s sulphur dioxide density is %d µg/m³', // accessory name, number
      densityVOC: '%s VOC density is %d µg/m³', // accessory name, number
      qualityExcellent: '%s air quality is excellent', // accessory name
      qualityFair: '%s air quality is fair', // accessory name
      qualityGood: '%s air quality is good', // accessory name
      qualityInferior: '%s air quality is inferior', // accessory name
      qualityPoor: '%s air quality is poor', // accessory name
      qualityUnknown: '%s air quality is unknown', // accessory name
      unknownValue: '%s unable to determine air quality from value %s. Ignoring…', // accessory name, value
    },

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
      level: '%s current light level is %d lx', // accessory name, number
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

  valve: {
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