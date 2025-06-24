const en = {

  config: {
    continue: 'Continue %s',
    optional: 'All fields are required unless noted as being "Optional"',
    support: 'For documentation and support please visit %s',
    thankYou: 'Thank you for installing homebridge-easy-mqtt',

    description: {
      disableLogging: 'If true, only critical events will be logged for this accessory.',
      options: 'Additional MQTT parameters such as username and password. Must be valid JSON.',
      topics: 'Supports JSONPath using dot notation, i.e. "my/topic$.path.to.value"',
      valueActive: 'Required if using "Get Availability" above.',
      verbose: 'If true, additional MQTT info will be logged for debugging purposes.',
    },

    title: {
      accessories: 'Accessories',
      accessory: 'Accessory',
      broker: 'Broker',
      disableLogging: 'Disable Logging',
      info: 'Optional Details',
      name: 'Name',
      manufacturer: 'Manufacturer',
      model: 'Model',
      mqtt: 'MQTT Settings',
      options: 'Options',
      serialNumber: 'Serial Number',
      topicGetCurrent: 'Get Current State',
      topicGetTarget: 'Get Target State',
      topicGetActive: 'Get Availability (Optional)',
      topicSetTarget: 'Set Target State',
      topics: 'Topics',
      type: 'Type',
      valueActive: 'Available/Active',
      valueSecured: 'Secured/Locked',
      valueUnsecured: 'Unsecured/Unlocked',
      valueJammed: 'Jammed (Optional)',
      values: 'Values',
      verbose: 'Additional Logging',
      version: 'Version',
    },
  },

  lock: {
    badTarget: '%s unable to get target from state %s',
    statusActive: '%s is now available',
    statusInactive: '%s is unavailable',
    stateCurrentSecured: '%s is locked',
    stateCurrentUnsecured: '%s is unlocked',
    stateFutureSecured: '%s is locking…',
    stateFutureUnsecured: '%s is unlocking…',
    stateJammed: '%s is jammed',
    stateUnknown: '%s state is unknown',
  },

  mqtt: {
    badOptions: '%s additional options must be valid json',
    clientError: '%s client error:',
    connected: '%s connected and listening for updates…',
    connectionClosed: '%s connection closed',
    idleConnection: '%s idle connection',
    noListeners: '%s no listeners for topic %s',
    notConnected: '%s client not connected',
    publish: '%s publishing value %s to topic %s',
    receivedMessage: '%s received message from topic %s',
    parseFailed: '%s failed to parse message',
    reconnectInMinutes: '%s will attempt to reconnect in %s minutes…',
    reconnectInSeconds: '%s will attempt to reconnect in %s seconds…',
  },

  startup: {
    complete: '✓ Setup complete.',
    newAccessory: 'Adding %s',
    removeAccessory: 'Removing %s',
    restoringAccessory: 'Restoring %s',
    unsupportedType: 'Unsupported accessory type %s',
    welcome: [
      'Please ★ this plugin on GitHub if you\'re finding it useful! https://github.com/mpatfield/homebridge-easy-mqtt',
      'Would you like to sponsor this plugin? https://github.com/sponsors/mpatfield',
      // TODO 'Please rate us on HOOBS! https://plugins.hoobs.org/plugin/homebridge-easy-mqtt',
      'Want to see this plugin in your own language? Please visit https://github.com/mpatfield/homebridge-easy-mqtt/issues/4',
    ],
  },
};

export default en;