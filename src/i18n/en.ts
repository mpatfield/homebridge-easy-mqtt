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
    stateCurrent: '%s current state is %s',
    stateJammed: 'JAMMED',
    stateSecured: 'SECURED',
    stateSet: '%s setting target state to %s',
    stateTarget: '%s target state is %s',
    stateUnknown: 'UNKNOWN',
    stateUnsecured: 'UNSECURED',
  },

  mqtt: {
    clientError: '%s client error:',
    connected: '%s connected and listening for updates…',
    connectionClosed: '%s connection closed',
    idleConnection: '%s idle connection',
    notConnected: '%s client not connected',
    publish: '%s publishing value %s to topic %s',
    receivedMessage: '%s received message from topic %s',
    parseFailed: '%s failed to parse message',
    reconnectInMinutes: '%s will attempt to reconnect in %s minutes…',
    reconnectInSeconds: '%s will attempt to reconnect in %s seconds…',
  },
};

export default en;