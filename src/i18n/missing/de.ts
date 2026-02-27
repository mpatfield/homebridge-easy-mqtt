const de = {

  autoReset: {
    reset: 'Resetting timer for %s', // accessory name
    startHours: '%s will reset in %s hours…', // accessory name, number
    startMilliseconds: '%s will reset in %s milliseconds…', // accessory name, number
    startMinutes: '%s will reset in %s minutes…', // accessory name, number
    startSeconds: '%s will reset in %s seconds…', // accessory name, number
  },

  button: {
    doublePressValue: '%s was double pressed (%s)', // accessory name, value
    duplicateValues: '%s press values must be unique', // accessory name
    longPressValue: '%s was long pressed (%s)', // accessory name, value
    singlePressValue: '%s was single pressed (%s)', // accessory name, value
  },

  config: {

    enumNames: {
      fanv2: 'Fan (v2)',
      hours: 'Hours',
      hsb: 'HSB (Default)',
      milliseconds: 'Milliseconds',
      minutes: 'Minutes',
      seconds: 'Seconds',
      statelessSwitch: 'Stateless Switch',
      switch: 'Switch',
      thermostat: 'Thermostat',
      window: 'Window',
    },

    title: {
      broker: 'Broker',
      colorType: 'Color Type',
      maximum: 'Maximum',
      name: 'Name',
      time: 'Auto-Reset Delay',
      topicGetRGB: 'Get RGB',
      topicGetWhite: 'Get White',
      topicSetRGB: 'Set RGB',
      topicSetWhite: 'Set White',
      units: 'Units',
      valueAQFair: 'AQ Fair',
      valueAQInferior: 'AQ Inferior',
      valueModeAuto: 'Auto',
    },
  },

  fanv2: {
    setDirectionClockwise: 'Setting %s rotation direction to clockwise…', // accessory name
    setDirectionCounterClockwise: 'Setting %s rotation direction to counter clockwise…', // accessory name
    stateAuto: 'Setting %s to auto…', // accessory name
  },

  lightbulb: {
    badColorType: '%s has invalid color type %s. Must be one of: %s', // accessory name, input, list of type names
    badHexValue: '%s expects hex values %s but received %s', // accessory name, example, input
    badRGBType: '%s expects RGB value of type %s but received %s', // accessory name, type, type
    badRGBValue: '%s is expecting RGB value like %s but received %s', // accessory name, example, input
    badWhiteType: '%s is unable to deterine white value from %s',  // accessory name, input
    badWhiteValue: '%s is expecting white value like %s but received %s', // accessory name, example, input
    rgbFuture: 'Setting %s RGB to %s…', // accessory name, value
    whiteFuture: 'Setting &s white to %s…', // accessory name, value
  },

};

export default de;