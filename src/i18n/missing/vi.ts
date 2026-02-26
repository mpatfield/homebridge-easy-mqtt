const vi_new = {

  accessory: {
    badType: '%s config variable %s should have type %s but was %s', // accessory name, variable name, type, type
  },

  active: {
    rotationValueUpdate: '%s rotation speed set to %d', // accessory name, number
    rotationValueSet: 'Setting %s rotation speed to %d…', // accessory name, number
  },

  autoReset: {
    reset: 'Resetting timer for %s', // accessory name
    startMilliseconds: '%s will reset in %s milliseconds…', // accessory name, number
    startSeconds: '%s will reset in %s seconds…', // accessory name, number
    startMinutes: '%s will reset in %s minutes…', // accessory name, number
    startHours: '%s will reset in %s hours…', // accessory name, number
  },

  button: {
    doublePress: '%s was double pressed', // accessory name
    doublePressValue: '%s was double pressed (%s)', // accessory name, value
    duplicateValues: '%s press values must be unique', // accessory name
    longPress: '%s was long pressed', // accessory name
    longPressValue: '%s was long pressed (%s)', // accessory name, value
    noValues: '%s must have at least one event value defined (Single Press, Double Press, Long Press)', // accessory name
    singlePress: '%s was single pressed', // accessory name
    singlePressValue: '%s was single pressed (%s)', // accessory name, value
    unknownValue: '%s unable to determine button press event from value %s. Ignoring…', // accessory name, value
  },

  characteristic: {
    unknownValue: '%s unable to determine boolean state from %s. Ignoring…', // accessory name, value
  },

  config: {

    enumNames: {
      celsius: '°C',
      doorbell: 'Doorbell',
      fahrenheit: '°F',
      hours: 'Hours',
      hsb: 'HSB (Default)',
      milliseconds: 'Milliseconds',
      minutes: 'Minutes',
      seconds: 'Seconds',
      statelessSwitch: 'Stateless Switch',
      window: 'Window',
    },

    title: {
      colorType: 'Color Type',
      historyEnabled: 'Enable History',
      maximum: 'Maximum',
      time: 'Auto-Reset Delay',
      topicEventButtonPress: 'Button Press*',
      topicGetCurrentConsumption: 'Get Watts (Eve-only)',
      topicGetElectricCurrent: 'Get Amps (Eve-only)',
      topicGetMuted: 'Get Muted',
      topicGetRGB: 'Get RGB',
      topicGetTotalConsumption: 'Get kWh (Eve-only)',
      topicGetVoltage: 'Get Voltage (Eve-only)',
      topicGetVolume: 'Get Volume',
      topicGetWhite: 'Get White',
      topicSetMuted: 'Set Muted',
      topicSetRGB: 'Set RGB',
      topicSetVolume: 'Set Volume',
      topicSetWhite: 'Set White',
      units: 'Units',
      valueDoublePress: 'Double Press',
      valueLongPress: 'Long Press',
      valueMuted: 'Muted',
      valueSinglePress: 'Single Press',
      valueUnmuted: 'Unmuted',
    },
  },

  doorbell: {
    brightnessPercent: '%s brightness is %d%', // accessory name, number
    brightnessPercentFuture: 'Setting %s brightness to %d%…', // accessory name, number
    brightnessValue: '%s brightness is %d', // accessory name, number
    brightnessValueFuture: 'Setting %s brightness to %d…', // accessory name, number
    muted: '%s is muted', // accessory name, number
    mutedFuture: 'Setting %s to muted', // accessory name
    volumePercent: '%s volume is %d%', // accessory name, number
    volumePercentFuture: 'Setting %s volume to %d%…', // accessory name, number
    volumeValue: '%s volume is %d', // accessory name, number
    volumeValueFuture: 'Setting %s volume to %d…', // accessory name, number
    unmuted: '%s is unmuted', // accessory name, number
    unmutedFuture: 'Setting %s to unmuted', // accessory name
  },

  history: {
    cleanup: 'Removing history for %s', // accessory name
    cleanupFailed: 'Unable to remove history for %s. Try manually removing the file %s from your Homebridge \'persist\' directory.', // accessory name, filename
    entry: '%s logging history entry:', // accessory name
    updatedCharacteristic: '%s updated %s with value %s', // accessory name, characteristic name, value
  },

  lightbulb: {
    badColorType: '%s has invalid color type %s. Must be one of: %s', // accessory name, input, list of type names
    badHexValue: '%s expects hex values %s but received %s', // accessory name, example, input
    badRGBType: '%s expects RGB value of type %s but received %s', // accessory name, type, type
    badRGBValue: '%s is expecting RGB value like %s but received %s', // accessory name, example, input
    badWhiteType: '%s is unable to deterine white value from %s',  // accessory name, input
    badWhiteValue: '%s is expecting white value like %s but received %s', // accessory name, example, input
    brightnessValue: '%s brightness is %d', // accessory name, number
    brightnessValueFuture: 'Setting %s brightness to %d…', // accessory name, number
    rgbFuture: 'Setting %s RGB to %s…', // accessory name, value
    whiteFuture: 'Setting &s white to %s…', // accessory name, value
  },

  mqttClient: {
    messageUndefined: 'Message on %s with topic %s was transformed to undefined. Ignoring…', // host, topic
    publishUndefined: 'Nothing to publish to %s with topic %s. Transformed value is undefined.', // host, topic
    transformFailed: 'Unable to execute transform:',
    transformedValue: 'Transforming value from %s to %s', // number, number
  },

  outlet: {
    currentConsumption: '%s consumption is %dW', // accessory name, value
    electricCurrent: '%s current is %dA', // accessory name, value
    totalConsumption: '%s consumption is %dkWh', // accessory name, value
    totalConsumptionReset: '%s consumption has been reset', // accessory name
    voltage: '%s voltage is %dV', // accessory name, value
  },

  position: {

    currentPercent: '%s current position is %d%', // accessory name, number
    currentValue: '%s current position is %d', // accessory name, number
    targetPercent: '%s target position is %d%', // accessory name, number
    targetPercentSet: 'Setting %s target position to %d%…', // accessory name, number
    targetValue: '%s target position is %d', // accessory name, number
    targetValueSet: 'Setting %s target position to %d…', // accessory name, number
  },

  sensor: {

    contact: {
      timesOpenedReset: '%s open count has been reset', // accessory name
    },

  },

};

export default vi_new;