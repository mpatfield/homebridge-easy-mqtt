<p align="center">
<img src="https://raw.githubusercontent.com/mpatfield/homebridge-easy-mqtt/refs/heads/latest/img/banner.png" width="600">
</p>

<span align="center">

# homebridge-easy-mqtt

Homebridge plugin to integrate simple MQTT devices into Apple HomeKit

[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)
[![Discord](https://img.shields.io/discord/432663330281226270?color=728ED5&logo=discord&label=discord)](https://discord.com/channels/432663330281226270/1412178951295467542) \
[![npm](https://img.shields.io/npm/dw/homebridge-easy-mqtt)](https://www.npmjs.com/package/homebridge-easy-mqtt)
[![npm](https://img.shields.io/npm/dt/homebridge-easy-mqtt)](https://www.npmjs.com/package/homebridge-easy-mqtt)

</span>

## Disclaimer

Any issues or damage resulting from use of this plugin are not the fault of the developer. Use at your own risk.

## What does this plugin do?

This plugin is designed to be a simple replacement for the fantastic [homebridge-mqttthing](https://github.com/arachnetech/homebridge-mqttthing) plugin which appears as though it's [no longer](https://github.com/arachnetech/homebridge-mqttthing/commits/master/) being actively developed.

**HomebridgeEasyMQTT** currently supports `Lightbulb`, `LockMechanism`, `Outlet`, `SecuitySystem`,`Switch`, and `TemperatureSensor`, but will be expanded over time as more use cases are discovered. If there is an accessory type you'd like to see supported, please feel free to [create an issue in GitHub](https://github.com/mpatfield/homebridge-easy-mqtt/issues/new/choose).

## Configuration

Using the Homebridge Config UI is the easiest way to set up this plugin. However, if you wish to do things manually then you will need to add the following to your Homebridge `config.json`:

```json
{
  "name": "Easy MQTT",
  "accessories": [
    {
      "info": {
        "id": "string",
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
      "customCharacteristics": [
        {
          "uuid": "string",
          "name": "string",
          "getTopic": "string",
          "units": "string",
        }
        …
      ],
      "topicGetStatusActive": "string",
      "topicGetCurrentLockState": "string",
      "topicGetTargetLockState": "string",
      "topicSetTargetLockState": "string",
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
    …
  ],
  "verbose": false,
  "platform": "HomebridgeEasyMQTT"
}
```

All fields are required unless noted as "(Optional)"

Info:
- `id` - A unique ID to identify this accessory. Changing this value will result in a new accessory.
- `name` - The display name for the accessory in HomeKit
- `type` - The type of accessory, currently Lightbulb, LockMechanism, Outlet, SecuitySystem, Switch, and Temperature Sensor are supported
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
  - `topicGetBrightness` - (Optional) The current brightness as a percent
  - `topicSetBrightness` - (Optional) For setting the brightness
  - `topicGetHue` - (Optional) The lightbulb's current hue
  - `topicSetHue` - (Optional) For setting the lightbulb's current hue
  - `topicGetColorTemperature` - (Optional) The current color temperature of the lightbulb
  - `topicSetColorTemperature` - (Optional) For setting the color temperature of the lightbulb
  - `topicGetSaturation` - (Optional) The current saturation setting of the lightbulb
  - `topicSetSaturation` - (Optional) For setting the saturation setting of the lightbulb

- LockMechanism
  - `topicGetCurrentLockState` - The current state of the lock, i.e. locked/unlocked
  - `topicGetTargetLockState` - The target (i.e. desired) state of the lock
  - `topicSetTargetLockState` - For setting the target (i.e. desired) state of the lock

- Outlet
  - `topicGetOn` - The current state of the outlet, i.e. on/off
  - `topicSetOn` - For setting the state of the outlet
  - `topicGetOutletInUse` - (Optional) Whether or not the outlet is currently being used

- SecuitySystem
  - `topicGetCurrentSecurityState` — The current state of the system
  - `topicGetTargetSecurityState` — The target state of the system
  - `topicSetTargetSecurityState` — For setting the target state of the system
  - `topicGetStatusTampered` — For getting whether the system has been tampered with
  - `topicGetStatusFault` — For getting whether there is a system error

- Switch
  - `topicGetOn` - The current state of the switch, i.e. on/off
  - `topicSetOn` - For setting the state of the switch

- TemperatureSensor
  - `topicGetCurrentTemperature` - The current temperature of the sensor
  - `temperatureUnits` - (Optional) The temperature units of the incoming value supplied by the sensor, `C` for Celsius  (default) `F` for Fahrenheit

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

- SecuritySystem
  - `valueArmStay` — (Optional) system armed in stay mode, e.g. "SA" or "stay"
  - `valueArmAway` — (Optional) system armed in away mode, e.g. "AA" or "away"
  - `valueArmNight` — (Optional) system armed in night mode, e.g. "NA" or "night"
  - `valueDisarm` — (Optional) system armed in away mode, e.g. "D" or "disarmed"
  - `valueAlarmTriggered` — (Optional) when the alarm has been triggered, e.g. "true" or "1" or "triggered"
  - `valueTampered` — (Optional) when the system has been tampered with, e.g. "true" or "1" or "tampered"
  - `valueFault` — (Optional) when the system has a general fault, e.g. "true" or "1" or "fault"

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

For some devices, the desired values in the MQTT messages are embedded within a JSON object. For example, here is the MQTT message for my door lock that is received when the door is locked:

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

You can do the same for the set topic if the device is expecting a JSON object rather than a raw value.

If, for example, your device is expecting this message:

```json
{
  "target": "away"
}
```

instead of just the raw value "away" you can use:

`zwave/4/security/set$.target`

Again, the `$.target` at the end tells the MQTT client to wrap the value a JSON object.

As with get topics, you can have an arbitrarily complex chain. So if, for example, you want this object:

```json
{
  "target": {
    "mode": {
      "value": "away"
    }
  }
}
```

then you would use the topic

`zwave/4/security/set$.target.mode.value`

## Custom Characteristics

If you use a more advanced HomeKit app like [Eve](https://apps.apple.com/us/app/eve-for-matter-homekit/id917695792) or [Controller for Homekit](https://apps.apple.com/us/app/controller-for-homekit/id1198176727), you can add custom characteristics to display any arbitrary numeric information. Unfortunately, Apple currently doesn't offer a way to display this in the Home app.

<img src="https://raw.githubusercontent.com/mpatfield/homebridge-easy-mqtt/refs/heads/latest/img/screenshot_1.png">

Due to the complexity, this was intentionally left out of the plugin config UI, so this can only be configured manually.

```json
"customCharacteristics": [
  {
    "uuid": "string",
    "name": "string",
    "getTopic": "string",
    "units": "string",
  }
]
```

- `uuid` — A unique string (recommend using a (UUID generator)[https://www.uuidgenerator.net/])
- `name` — The display name for the characteristic
- `getTopic` — The topic which provides the numeric value
- `units` — (Optional) The units which will be displayed at the end of the numeric value

Since `customCharacteristics` is an array, you may define as many custom characteristics as you wish.

## Credits

[@arachnetech](https://github.com/arachnetech) for the fantastic [homebridge-mqttthing](https://github.com/arachnetech/homebridge-mqttthing) plugin which serves as the main inspiration for this project

[Keryan Belahcene](https://www.instagram.com/keryan.me) for creating the [Flume](https://github.com/homebridge-plugins/homebridge-flume) header logo which I adapted for this plugin

And to the amazing creators/contributors of [Homebridge](https://homebridge.io) who made this plugin possible!
