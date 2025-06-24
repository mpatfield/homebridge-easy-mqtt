const en = {

  config: {
    thankYou: 'Thank you for installing homebridge-easy-mqtt',
    support: 'For help and support please visit %s',
    continue: 'Continue %s',
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