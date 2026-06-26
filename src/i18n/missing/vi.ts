const vi = {

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

  valve: {
    durationTopicsIgnored: '%s is using a built-in timer, so duration topics %s will be ignored', // accessory name, list of topics
  },
};

export default vi;