const fr = {

  accessory: {
    available: '%s is available', // accessory name
    statusActive: '%s is active', // accessory name
    statusInactive: '%s is inactive', // accessory name
    unavailable: '%s is not available', // accessory name
  },

  autoReset: {
    teardown: '%s is currently waiting to be reset. Performing reset now.', // accessory name
  },

  config: {

    enumNames: {
      homekit: 'HomeKit (Default)',
      matter: 'Matter (Beta)',
    },

    title: {
      minimum: 'Minimum',
      minimumDuration: 'Minimum Duration (Minutes)',
      minimumStep: 'Step',
      maximumDuration: 'Maximum Duration (Minutes)',
      protocol: 'Protocol',
      simulateDuration: 'Simulate Duration',
      topicGetAvailable: 'Get Available/Reachable',
      topicGetStatusActive: 'Get Active Status',
      valueStatusActive: 'Status Active',
    },
  },

  startup: {
    homekitNewAccessory: 'Adding HomeKit accessory:',
    homekitRemoveAccessory: 'Removing HomeKit accessory:',
    homekitRestoringAccessory: 'Restoring HomeKit accessory:',
    matterDisabled: 'Matter is currently disabled. Please enable Matter in the %s parent bridge.', // plugin name
    matterGroups: 'Groups are not yet supported for Matter accessories',
    matterUnavailable: 'Matter is not available with this version of Homebridge. Please update to Homebridge v2.0+ to use Matter with %s.', // plugin name
    matterNewAccessory: 'Adding new Matter accessory:',
    matterRemoveAccessory: 'Removing Matter accessory:',
    matterRestoringAccessory: 'Restoring Matter accessory:',
    unsupportedProtocol: 'Unsupported protocol %s. Must be one of: %s', // protocol, list of protocols
  },

  valve: {
    durationTopicsIgnored: '%s is using a built-in timer, so duration topics %s will be ignored', // accessory name, list of topics
  },
};

export default fr;