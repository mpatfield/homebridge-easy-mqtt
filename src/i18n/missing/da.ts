const da = {

  config: {

    enumNames: {
      electricalMeter: 'Electrical Meter (Matter)',
      electricalSensor: 'Electrical Sensor (Matter)',
      irrigationSystem: 'Irrigation System',
    },

    title: {
      topicGetCurrent: 'Get Current (Amperes)',
      topicGetPower: 'Get Power (Milliwatts)',
      topicGetVoltage: 'Get Voltage (Millivolts)',
      valve: 'Valve',
    },

    valve: 'Valve',
  },

  electrical: {
    current: '%s current is %d A', // accessory name, number (ampers)
    power: '%s power is %d mW', // accessory name, number (milliwatts)
    voltage: '%s power is %d mV', // accessory name, number (millivolts)
  },

  irrigation: {
    badValveConfig: '%s valve config is missing required field: %s', // accessory name, field name
  },

  mqttClient: {
    transformedTopic: 'Transforming topic from %s to %s', // topic, topic
  },

};

export default da;