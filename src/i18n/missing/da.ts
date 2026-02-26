const da = {

  config: {

    enumNames: {
      celsius: '°C',
      fahrenheit: '°F',
      hsb: 'HSB (Default)',
      window: 'Window',
    },

    title: {
      broker: 'Broker',
      colorType: 'Color Type',
      topicGetRGB: 'Get RGB',
      topicGetWhite: 'Get White',
      topicSetRGB: 'Set RGB',
      topicSetWhite: 'Set White',
      type: 'Type',
      valueModeAuto: 'Auto',
      valuePositionHold: 'Hold',
    },
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

export default da;