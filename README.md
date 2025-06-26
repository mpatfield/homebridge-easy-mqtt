<!--
<p align="center">
<img src="https://github.com/mpatfield/homebridge-easy-mqtt/blob/latest/img/banner.png?raw=true" width="600">
</p>
-->

<span align="center">

# homebridge-easy-mqtt

Homebridge plugin to integrate simple MQTT devices into Apple HomeKit

[![npm](https://img.shields.io/npm/dw/homebridge-easy-mqtt)](https://www.npmjs.com/package/homebridge-easy-mqtt)
[![npm](https://img.shields.io/npm/dt/homebridge-easy-mqtt)](https://www.npmjs.com/package/homebridge-easy-mqtt)

</span>

## Disclaimer

Any issues or damage resulting from use of this plugin are not the fault of the developer. Use at your own risk.

## What does this plugin do?

This plugin is designed to be a simple replacement for the fantastic [homebridge-mqttthing](https://github.com/arachnetech/homebridge-mqttthing) plugin which appears as though it's [no longer](https://github.com/arachnetech/homebridge-mqttthing/commits/master/) being actively developed.

**HomebridgeEasyMQTT** currently supports `Lightbulb`, `LockMechanism`, `Outlet`, and `Switch`, but will be expanded over time as more use cases are discovered. If there is an accessory type you'd like to see supported, please feel free to [create an issue in GitHub](https://github.com/mpatfield/homebridge-easy-mqtt/issues/new/choose).

## Configuration

Using the Homebridge Config UI is the easiest way to set up this plugin. However, if you wish to do things manually then you will need to add the following to your Homebridge `config.json`:

```json
{
  "name": "Easy MQTT",
  "accessories": [
    {
      "info": {
        "name": "string",
        "type": "string",
        "manufacturer": "string",
        "model": "string",
        "serialNumber": "string",
        "version": "string"
      },
      "mqtt": {
        "broker": "string",
        "username": "string",
        "password": "string",
        "options": "string"
      },
      "topicGetStatusActive": "string",
      "topicGetLockCurrentState": "string",
      "topicGetLockTargetState": "string",
      "topicSetTargetState": "string",
      "topicGetOn": "string",
      "topicSetOn": "string",
      "valueStatusActive": "string",
      "valueLockStateSecured": "string",
      "valueLockStateUnsecured": "string",
      "valueLockStateJammed": "string",
      "valueOn": "string",
      "valueOff": "string",
      "disableLogging": false
    }
    // ... other accessories as needed
  ],
  "verbose": false,
  "platform": "HomebridgeEasyMQTT"
}
```

All fields are required unless noted as "(Optional)"

Info:
- `name` - The display name for the accessory in HomeKit
- `type` - The type of accessory, currently Lightbulb, LockMechanism, Outlet, and Switch are supported
- `manufacturer` - (Optional) The accessory manufacturer which will display in HomeKit device details
- `model` - (Optional) The accessory model which will display in HomeKit device details
- `serialNumber` - (Optional) The accessory serial number which will display in HomeKit device details
- `version` - (Optional) The accessory software version which will display in HomeKit device details

MQTT:
- `broker` - The URL and port to use for communicating with your MQTT device
- `username` - (Optional) Username
- `password` - (Optional) Password
- `options` - (Optional) See [MQTT Options](#mqtt-options) below

Topics:

You will need to make sure to populate the appropriate topics based on the type.

You may define topics using a JSONPath dot notation to assist the parser in finding the right value within the message. See [JSONPaths](#jsonpaths) below for more details.

- General Purpose
  - `topicGetStatusActive` - (Optional) Whether or not the accessory is connected/reachable

- Lightbulb
  - `topicGetBrightness` - The current brightness as a percent
  - `topicSetBrightness` - For setting the brightness
  - `topicGetHue` - The lightbulb's current hue
  - `topicSetHue` - For setting the lightbulb's current hue
  - `topicGetColorTemperature` - The current color temperature of the lightbulb
  - `topicSetColorTemperature` - For setting the color temperature of the lightbulb
  - `topicGetSaturation` - The current saturation setting of the lightbulb
  - `topicSetSaturation` - For setting the saturation setting of the lightbulb

- LockMechanism
  - `topicGetLockCurrentState` - The current state of the lock, i.e. locked/unlocked
  - `topicGetLockTargetState` - The target (i.e. desired) state of the lock
  - `topicSetTargetState` - For setting the target (i.e. desired) state of the lock

- Outlet
  - `topicGetOn` - The current state of the outlet, i.e. on/off
  - `topicSetOn` - For setting the state of the outlet
  - `topicGetOutletInUse` - Whether or not the outlet is currently being used
  - `topicSetOutletInUse` - For setting whether the outlet is currently being used

- Switch
  - `topicGetOn` - The current state of the switch, i.e. on/off
  - `topicSetOn` - For setting the state of the switch

Values:

As with Topics, you will need to populate the appropriate values based on the type. Note that while they are defined as strings, they will be auto-converted to the appropriate primitives (e.g. boolean or number) where appropriate.

- General Purpose
  - `valueStatusActive` - Accessory is connected/reachable, e.g. "true", "1", or "Alive"

- Lightbulb
  - `valueOn` - Turned on, e.g. "true", or "1", or "On" 
  - `valueOff` - Turned off, e.g. "false", or "0", or "Off" 

- LockMechanism
  - `valueLockStateSecured` - Locked state, e.g. "true", "255", or "Locked"
  - `valueLockStateUnsecured` - Unlocked state, e.g. "false", "0", or "Unlocked"
  - `valueLockStateJammed` - (Optional) Lock is jammed, e.g. "254" or "Jammed"

- Outlet
  - `valueOn` - Turned on, e.g. "true", or "1", or "On" 
  - `valueOff` - Turned off, e.g. "false", or "0", or "Off" 
  - `valueOutletInUse` - Currently being used, e.g. "true", or "1", or "On" 
  - `valueOutletNotInUse` - Currently not being used, e.g. "false", or "0", or "Off" 

- Switch
  - `valueOn` - Turned on, e.g. "true", or "1", or "On" 
  - `valueOff` - Turned off, e.g. "false", or "0", or "Off" 

Logging/Debugging:

By default, devices will log activity, for example when a Switch is turned on or a LockMechanism is unlocked.

To disable, add the following to the accessories you'd like to silence.

- `"disableLogging": true`

You may also turn on additional logging if you'd like to see the MQTT messages passed back and forth. You can do this by adding the following at the top level of the config.

- `"verbose": true`

## MQTT Options

You are able to pass in any arbitrary MQTT options via `mqtt.options` in the config. This can include, for example, such as clientId, protocolVersion, etc. Just make sure the value provided is valid JSON. For example:

```
"options": "{ \"protocolVersion\": \"4\", \"clientId\": \"my-client-id\", \"rejectUnauthorized\": true }"
```

## JSONPaths

For some devices, the desired values in the MQTT messages can get embedded within a JSON object. For example, here is the MQTT message for my door lock that is received when the door is locked:

```json
{ "time": 1750870005853, "state": 255 }
```

Since the value (255) that I need is embedded within JSON, I can use JSONPath syntax to tell the parser how to find the value.

So, in this example I would define my topic as:

`zwave/1/door_lock/currentMode$.state`

The `$.state` at the end tells the parser to grab the value using the key "state".

This can be arbitrarily complicated and several layers deep. For example,

```json
{
  "time":1750870005853,
  "state": {
    "number": {
      "value": 255
    }
  }
}
```

would use the topic

`zwave/1/door_lock/currentMode$.state.number.value`

## Credits

[@arachnetech](https://github.com/arachnetech) for the fantastic [homebridge-mqttthing](https://github.com/arachnetech/homebridge-mqttthing) plugin which serves as the main inspiration for this project

And to the amazing creators/contributors of [Homebridge](https://homebridge.io) who made this plugin possible!