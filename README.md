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

**HomebridgeEasyMQTT** currently supports the following accessory types but will be expanded over time as more use cases are requested. If there is an accessory type you'd like to see supported, please [create an issue in GitHub](https://github.com/mpatfield/homebridge-easy-mqtt/issues/new/choose).

  - `AirPurifier`
  - `AirQualitySensor`
  - `CarbonDioxideSensor`
  - `CarbonMonoxideSensor`
  - `ContactSensor`
  - `Doorbell`
  - `Fanv2`
  - `GarageDoorOpener`
  - `HeaterCooler`
  - `HumiditySensor`
  - `LeakSensor`
  - `Lightbulb`
  - `LightSensor`
  - `LockMechanism`
  - `MotionSensor`
  - `OccupancySensor`
  - `Outlet`
  - `SecuritySystem`
  - `SmokeSensor`
  - `StatelessProgrammableSwitch`
  - `Switch`
  - `TemperatureSensor`
  - `Thermostat`
  - `Valve`
  - `WindowCovering`

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
        "group": "string",
        "manufacturer": "string",
        "model": "string",
        "serialNumber": "string",
        "version": "string"
      },
      "mqtt": {
        "broker": "string",
        "username": "string",
        "password": "string",
        "options": "string",
        "onConnect": [
          {
            "topic": "string",
            "message": "string",
          }
          …
        ]
      },
      "history": {
        "enabled": true,
        "disableRepeatLastData": false,
        "size": 4032,
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
      "resetOnRestart": false,
      "disableLogging": false,
      … // See Topics & Values below for additional attributes for each accessory type
  ],
  "verbose": false,
  "platform": "HomebridgeEasyMQTT"
}
```

Required fields are marked with an asterisk (*)

### Info
- `id*` - A unique ID to identify this accessory. Changing this value will result in a new accessory.
- `name*` - The display name for the accessory in HomeKit
- `type*` - The type of accessory. See list of currently supported types above.
- `group` - Items sharing the same group name will be grouped together in the Home app UI
    - ⚠️ Changing the group name will require you to reconfigure any HomeKit scenes/automations for those accessories
- `manufacturer` - The accessory manufacturer which will display in HomeKit device details
- `model` - The accessory model which will display in HomeKit device details
- `serialNumber` - The accessory serial number which will display in HomeKit device details
- `version` - The accessory software version which will display in HomeKit device details

### MQTT:
- `broker` - The URL and port to use for communicating with your MQTT device, defaults to `mqtt://127.0.0.1:1883/`
- `username` - Username
- `password` - Password
- `options` - See [MQTT Options](#mqtt-options) below
- `onConnect` - See [MQTT OnConnect](#mqtt-onconnect) below

#### Environment Variables

Alternatively, you may set the following environment variables for broker, username, and password:

- `EASYMQTT_BROKER` - expects a fully formed url, `protocol://host:port/` where port is optional
- `EASYMQTT_USERNAME`
- `EASYMQTT_PASSWORD`

Note that setting the this information in the JSON config will override the environment variables.

## Topics & Values

You will need to make sure to populate the appropriate topics based on the accessory type defined below.

You may define topics using a JSONPath dot notation to assist the parser in finding the right value within the message. You can also add a value transformer to alter the incoming or outgoing value. See [Advanced Topic Notation](#advanced-topic-notation) below for more details.

As with topics, you will also need to populate the appropriate values based on the type. Note that while they are defined as strings, they will be auto-converted to the appropriate primitives (e.g. boolean or number) where appropriate.

These values are used for both determining current state and, where appropriate, publishing the new state to MQTT

### General Purpose
- `topicGetStatusActive` - Whether or not the accessory is connected/reachable
- `topicGetBatteryLow` - Wether or not the accessory has a low battery
- `topicGetBatteryLevel` - Percentage as a number
- `valueStatusActive` - Accessory is connected/reachable, e.g. "true", "1", or "Alive"
- `valueBatteryLow` - Accessory has a low battery level

### On/Off Accessories

#### Lightbulb
- `maximumBrightness` - Set a maximum to use values (i.e. 1, 2, 3) rather than a percentage for brightness
- `topicGetOn*` - The current state of the outlet, i.e. on/off
- `topicSetOn*` - For setting the state of the outlet
- `valueOn*` - Turned on, e.g. "true", or "1", or "On"
- `valueOff*` - Turned off, e.g. "false", or "0", or "Off"
- `topicGetBrightness` - The current brightness as a percent
- `topicSetBrightness` - For setting the brightness
- `topicGetColorTemperature` - The current color temperature of the lightbulb
- `topicSetColorTemperature` - For setting the color temperature of the lightbulb
- `topicGetHue` - The lightbulb's current hue
- `topicSetHue` - For setting the lightbulb's current hue
- `topicGetSaturation` - The current saturation setting of the lightbulb
- `topicSetSaturation` - For setting the saturation setting of the lightbulb
- `topicGetCurrentConsumption` - Get the current power rate in watts ([Eve only](#eve-app-support))
- `topicGetElectricCurrent` - Get the electrical current in amps ([Eve only](#eve-app-support))
- `topicGetTotalConsumption` - Get the total energy use in kWh ([Eve only](#eve-app-support))
- `topicGetVoltage` - Get the current voltage ([Eve only](#eve-app-support))

#### Outlet
- `topicGetOn*` - The current state of the outlet, i.e. on/off
- `topicSetOn*` - For setting the state of the outlet
- `topicGetOutletInUse` - Whether or not the outlet is
- `valueOn*` - Turned on, e.g. "true", or "1", or "On"
- `valueOff*` - Turned off, e.g. "false", or "0", or "Off"
- `valueOutletInUse` - Currently being used, e.g. "true", or "1", or "On"
- `topicGetCurrentConsumption` - Get the current power rate in watts ([Eve only](#eve-app-support))
- `topicGetElectricCurrent` - Get the electrical current in amps ([Eve only](#eve-app-support))
- `topicGetTotalConsumption` - Get the total energy use in kWh ([Eve only](#eve-app-support))
- `topicGetVoltage` - Get the current voltage ([Eve only](#eve-app-support))

#### Switch
- `topicGetOn*` - The current state of the outlet, i.e. on/off
- `topicSetOn*` - For setting the state of the outlet
- `topicGetCurrentConsumption` - Get the current power rate in watts ([Eve only](#eve-app-support))
- `topicGetElectricCurrent` - Get the electrical current in amps ([Eve only](#eve-app-support))
- `topicGetTotalConsumption` - Get the total energy use in kWh ([Eve only](#eve-app-support))
- `topicGetVoltage` - Get the current voltage ([Eve only](#eve-app-support))
- `valueOn*` - Turned on, e.g. "true", or "1", or "On"
- `valueOff*` - Turned off, e.g. "false", or "0", or "Off"

### Position Accessories

#### WindowCovering
- `maximumPosition` - Set a maximum to use values (i.e. 1, 2, 3) rather than a percentage for position
- `topicGetPositionState*` - Get position state (Decreasing, Increasing, Stopped)
- `topicGetCurrentPosition*` - Get current position percent
- `topicGetTargetPosition*` - Get target position percent
- `topicSetTargetPosition*` - Set target position percent
- `topicGetCurrentHorizontalTiltAngle` - Get current horizontal angle (-90° to 90°)
- `topicGetTargetHorizontalTiltAngle` - Get target horizontal angle (-90° to 90°)
- `topicSetTargetHorizontalTiltAngle` - Set target horizontal angle (-90° to 90°)
- `topicGetCurrentVerticalTiltAngle` - Get current vertical angle (-90° to 90°)
- `topicGetTargetVerticalTiltAngle` - Get target vertical angle (-90° to 90°)
- `topicSetTargetVerticalTiltAngle` - Set target vertical angle (-90° to 90°)
- `topicSetHoldPosition` - Set hold (true/false)
- `topicGetObstructionDetected` - Get obstruction detected
- `valuePositionDecreasing` - Closing
- `valuePositionIncreasing` - Opening
- `valuePositionStopped` - Stopped
- `valuePositionHold` - Hold
- `valuePositionResume` - Resume
- `valuePositionObstructed` - Obstruction detected

### Sensors

#### AirQualitySensor
- `topicGetAirQuality*` - Get air quality
- `topicGetNitrogenDioxideDensity` - Get nitrogen dioxide density in µg/m³
- `topicGetOzoneDensity` - Get ozone density in µg/m³
- `topicGetPM2_5Density` - Get PM2.5 density in µg/m³
- `topicGetPM10Density` - Get PM10 density in µg/m³
- `topicGetSulphurDioxideDensity` - Get sulphur dioxide density in µg/m³
- `topicGetVOCDensity` - Get VOC density in µg/m³
- `topicGetStatusFault` - Whether or not the sensor has a generic fault
- `topicGetStatusTampered` - Whether or not the sensor has been tampered with
- `valueAQExcellent` - Air quality excellent
- `valueAQGood` - Air quality good
- `valueAQFair` - Air quality fair
- `valueAQInferior` - Air quality inferior
- `valueAQPoor` - Air quality poor
- `valueAQUnknown` - Air quality unknown
- `valueFault` - Accessory has a fault
- `valueTampered` - Accessory has been tampered with

#### CarbonDioxideSensor
- `topicGetCarbonDioxideDetected*` - Whether or not the sensor has detected carbon dioxide
- `topicGetCarbonDioxideLevel` - The current carbon dioxide level
- `topicGetCarbonDioxidePeakLevel` - The peak carbon dioxide level
- `topicGetStatusFault` - Whether or not the sensor has a generic fault
- `topicGetStatusTampered` - Whether or not the sensor has been tampered with
- `valueCarbonDioxideDetected*` - Accessory has detected carbon dioxide
- `valueFault` - Accessory has a fault
- `valueTampered` - Accessory has been tampered with

#### CarbonMonoxideSensor
- `topicGetCarbonMonoxideDetected*` - Whether or not the sensor has detected carbon monoxide
- `topicGetCarbonMonoxideLevel` - The current carbon monoxide level
- `topicGetCarbonMonoxidePeakLevel` - The peak carbon monoxide level
- `topicGetStatusFault` - Whether or not the sensor has a generic fault
- `topicGetStatusTampered` - Whether or not the sensor has been tampered with
- `valueCarbonMonoxideDetected*` - Accessory has detected carbon monoxide
- `valueFault` - Accessory has a fault
- `valueTampered` - Accessory has been tampered with

#### ContactSensor
- `topicGetContactSensorState*` - Whether or not sensor has detected contact
- `topicGetStatusFault` - Whether or not the sensor has a generic fault
- `topicGetStatusTampered` - Whether or not the sensor has been tampered with
- `valueContactDetected*` - Accessory has detected contact
- `valueFault` - Accessory has a fault
- `valueTampered` - Accessory has been tampered with

### HumiditySensor
- `topicGetCurrentRelativeHumidity*` - The current relatively humidity
- `topicGetStatusFault` - Whether or not the sensor has a generic fault
- `topicGetStatusTampered` - Whether or not the sensor has been tampered with
- `valueFault` - Accessory has a fault
- `valueTampered` - Accessory has been tampered with

#### LeakSensor
- `topicGetLeakDetected*` - Whether or not sensor has detected a leak
- `topicGetStatusFault` - Whether or not the sensor has a generic fault
- `topicGetStatusTampered` - Whether or not the sensor has been tampered with
- `valueLeakDetected*` - Accessory has detected a leak
- `valueFault` - Accessory has a fault
- `valueTampered` - Accessory has been tampered with

#### LightSensor
- `topicGetCurrentAmbientLightLevel*` - The current light level in lux units
- `topicGetStatusFault` - Whether or not the sensor has a generic fault
- `topicGetStatusTampered` - Whether or not the sensor has been tampered with
- `valueFault` - Accessory has a fault
- `valueTampered` - Accessory has been tampered with

#### MotionSensor
- `topicGetMotionDetected*` - Whether or not sensor has detected motion
- `topicGetStatusFault` - Whether or not the sensor has a generic fault
- `topicGetStatusTampered` - Whether or not the sensor has been tampered with
- `valueMotionDetected*` - Accessory has detected motion
- `valueFault` - Accessory has a fault
- `valueTampered` - Accessory has been tampered with

#### OccupancySensor
- `topicGetOccupancyDetected*` - Whether or not sensor has detected occupancy
- `topicGetStatusFault` - Whether or not the sensor has a generic fault
- `topicGetStatusTampered` - Whether or not the sensor has been tampered with
- `valueOccupancyDetected*` - Accessory has detected occupancy
- `valueFault` - Accessory has a fault
- `valueTampered` - Accessory has been tampered with

#### SmokeSensor
- `topicGetSmokeDetected*` - Whether or not sensor has detected smoke
- `topicGetStatusFault` - Whether or not the sensor has a generic fault
- `topicGetStatusTampered` - Whether or not the sensor has been tampered with
- `valueSmokeDetected*` - Accessory has detected smoke
- `valueFault` - Accessory has a fault
- `valueTampered` - Accessory has been tampered with

#### TemperatureSensor
- `topicGetCurrentTemperature*` - The current temperature of the sensor
- `temperatureUnits` - The temperature units of the incoming value supplied by the sensor, `C` for Celsius  (default) `F` for Fahrenheit
- `topicGetStatusFault` - Whether or not the sensor has a generic fault
- `topicGetStatusTampered` - Whether or not the sensor has been tampered with
- `valueFault` - Accessory has a fault
- `valueTampered` - Accessory has been tampered with

### Climate Controllers

#### Thermostat
- `temperatureUnits` - The temperature units of the incoming value supplied by the thermostat, `C` for Celsius  (default) `F` for Fahrenheit
- `topicGetCurrentTemperature*` - Get the current temperature
- `topicGetCurrentHeatingCoolingState*` - Get the current mode (i.e. cooling, heating, off)
- `topicGetTargetHeatingCoolingState*` - Get the target mode (i.e. auto, cooling, heating, off)
- `topicSetTargetHeatingCoolingState*` - Set the target mode (i.e. auto, cooling, heating, off)
- `topicGetTargetTemperature*` - Get the target temperature
- `topicSetTargetTemperature*` - Set the target temperature
- `topicGetCoolingThresholdTemperature` - Get the cooling threshold temperature
- `topicSetCoolingThresholdTemperature` - Set the cooling threshold temparture
- `topicGetHeatingThresholdTemperature` - Get the heating threshold temperature
- `topicSetHeatingThresholdTemperature` - Set the heating threshold temperature
- `topicGetCurrentRelativeHumidity` - Get the current humidity
- `topicGetTargetRelativeHumidity` - Get the target humidity
- `topicSetTargetRelativeHumidity` - Set the target humidity
- `topicGetFilterChangeIndication` - Whether or not the filter needs to be changed. *Required if other filter topics are defined.
- `topicGetFilterLifeLevel` - Filter life remaining as a percentage
- `topicResetFilterIndication` - Used to reset the filter
- `valueModeAuto` - Auto mode
- `valueModeCool` - Cool mode
- `valueModeHeat` - Heat mode
- `valueModeOff` - Thermostat off
- `valueFilterChange` - Indicates that the filter needs to be changed. *Required if `topicGetFilterChangeIndication` is defined.

#### AirPurifier
- `maximumRotationSpeed` - Set a maximum to use values (i.e. 1, 2, 3) rather than a percentage for rotation speed
- `topicGetActive*` - Get whether or not the accessory is currently active
- `topicSetActive*` - Set whether or not the accessory is currently active
- `topicGetCurrentPurifierState*` - Get the current mode (i.e. inactive, idle, purifying)
- `topicGetTargetPurifierState*` - Get the target mode (i.e. auto, manual)
- `topicSetTargetPurifierState*` - Set the target mode (i.e. auto, manual)
- `topicGetLockPhysicalControls` - Get whether or not the physical controls are locked
- `topicSetLockPhysicalControls` - Set whether or not the physical controls are locked
- `topicGetRotationSpeed` - Get the rotation speed as a percentage
- `topicSetRotationSpeed` - Set the rotation speed as a percentage
- `topicGetSwingMode` - Get whether or not accessory is oscillating
- `topicSetSwingMode` - Set whether or not accessory is oscillating
- `topicGetFilterChangeIndication` - Whether or not the filter needs to be changed. *Required if other filter topics are defined.
- `topicGetFilterLifeLevel` - Filter life remaining as a percentage
- `topicResetFilterIndication` - Used to reset the filter
- `valueStateActive*` - Accessory is currently active
- `valueStateInactive*` - Accessory is currently inactive
- `valueModeAuto` - Auto target mode
- `valueModeIdle` - Idle mode
- `valueModeInactive` - Inactive mode
- `valueModeManual` - Manual target mode
- `valueModePurifying` - Purifying mode
- `valueControlLock` - Physical controls are locked
- `valueControlUnlock` - Physical controls are unlocked
- `valueSwingEnabled` - Accessory is oscillating
- `valueSwingDisabled` - Accessory is not oscillating
- `valueFilterChange` - Indicates that the filter needs to be changed. *Required if `topicGetFilterChangeIndication` is defined.

#### Fanv2
- `maximumRotationSpeed` - Set a maximum to use values (i.e. 1, 2, 3) rather than a percentage for rotation speed
- `topicGetActive*` - Get whether or not the accessory is currently active
- `topicSetActive*` - Set whether or not the accessory is currently active
- `topicGetCurrentFanState` - Get current fan mode (blowing, idle, inactive)
- `topicGetTargetFanState` - Get target fan mode (auto, manual)
- `topicSetTargetFanState` - Set target fan mode (auto, manual)
- `topicGetLockPhysicalControls` - Get whether or not the physical controls are locked
- `topicSetLockPhysicalControls` - Set whether or not the physical controls are locked
- `topicGetRotationDirection` - Get the fan rotation direction (clockwise, counter clockwise)
- `topicSetRotationDirection` - Set the fan rotation direction (clockwise, counter clockwise)
- `topicGetRotationSpeed` - Get the rotation speed as a percentage
- `topicSetRotationSpeed` - Set the rotation speed as a percentage
- `topicGetSwingMode` - Get whether or not accessory is oscillating
- `topicSetSwingMode` - Set whether or not accessory is oscillating
- `valueStateActive*` - Accessory is currently active
- `valueStateInactive*` - Accessory is currently inactive
- `valueModeBlowing` - Air blowing mode
- `valueModeIdle` - Idle mode
- `valueModeInactive` - Inactive mode
- `valueModeAuto` - Auto target mode
- `valueModeManual` - Manual target mode
- `valueDirectionClockwise` - Rotating clockwise
- `valueDirectionCounterClockwise` - Rotating counter clockwise
- `valueControlLock` - Physical controls are locked
- `valueControlUnlock` - Physical controls are unlocked
- `valueSwingEnabled` - Accessory is oscillating
- `valueSwingDisabled` - Accessory is not oscillating

#### HeaterCooler
- `maximumRotationSpeed` - Set a maximum to use values (i.e. 1, 2, 3) rather than a percentage for rotation speed
- `temperatureUnits` - The temperature units of the incoming value supplied by the thermostat, `C` for Celsius  (default) `F` for Fahrenheit
- `topicGetActive*` - Get whether or not the accessory is currently active
- `topicSetActive*` - Set whether or not the accessory is currently active
- `topicGetCurrentTemperature*` - Get the current temperature
- `topicGetCurrentHeaterCoolerState*` - Get the current mode (i.e. inactive, idle, heating, cooling)
- `topicGetTargetHeaterCoolerState*` - Get the target mode (i.e. auto, heat, cool)
- `topicSetTargetHeaterCoolerState*` - Set the target mode (i.e. auto, heat, cool)
- `topicGetCoolingThresholdTemperature` - Get the cooling threshold temperature
- `topicSetCoolingThresholdTemperature` - Set the cooling threshold temparture
- `topicGetHeatingThresholdTemperature` - Get the heating threshold temperature
- `topicSetHeatingThresholdTemperature` - Set the heating threshold temperature
- `topicGetLockPhysicalControls` - Get whether or not the physical controls are locked
- `topicSetLockPhysicalControls` - Set whether or not the physical controls are locked
- `topicGetRotationSpeed` - Get the rotation speed as a percentage
- `topicSetRotationSpeed` - Set the rotation speed as a percentage
- `topicGetSwingMode` - Get whether or not accessory is oscillating
- `topicSetSwingMode` - Set whether or not accessory is oscillating
- `topicGetFilterChangeIndication` - Whether or not the filter needs to be changed. *Required if other filter topics are defined.
- `topicGetFilterLifeLevel` - Filter life remaining as a percentage
- `topicResetFilterIndication` - Used to reset the filter
- `valueStateActive*` - Accessory is currently active
- `valueStateInactive*` - Accessory is currently inactive
- `valueModeAuto` - Mode is auto
- `valueModeCool` - Mode is cool/cooling
- `valueModeHeat` - Mode is heat/heating
- `valueModeIdle` - Mode is idle
- `valueModeInactive` - Mode is inactive
- `valueControlLock` - Physical controls are locked
- `valueControlUnlock` - Physical controls are unlocked
- `valueSwingEnabled` - Accessory is oscillating
- `valueSwingDisabled` - Accessory is not oscillating
- `valueFilterChange` - Indicates that the filter needs to be changed. *Required if `topicGetFilterChangeIndication` is defined.

### Others

#### GarageDoorOpener
- `topicGetCurrentDoorState*` - Current state of the garage door, i.e. open/opening/closed/closing/stopped
- `topicGetTargetDoorState*` - Target state of the garage door, i.e. open/closed
- `topicSetTargetDoorState*` - Set the target door state, i.e. open/closed
- `topicGetObstructionDetected*` - Whether or not the garage door is obstructed
- `topicGetCurrentLockState` - The current state of the garage lock, i.e. locked/unlocked
- `topicGetTargetLockState` - The target (i.e. desired) state of the garage lock
- `topicSetTargetLockState` - For setting the target (i.e. desired) state of the garage lock
- `valueDoorObstructed*` - Door is obstructed
- `valueDoorStateClosed` - Door is closed
- `valueDoorStateClosing` - Door is closing
- `valueDoorStateOpen` - Door is open
- `valueDoorStateOpening` - Door is opening
- `valueDoorStateStopped` - Door is stopped
- `valueLockStateJammed` - Door lock is jammed
- `valueLockStateSecured` - Door is locked
- `valueLockStateUnsecured` - Door is unlocked

#### LockMechanism
- `topicGetCurrentLockState*` - The current state of the lock, i.e. locked/unlocked
- `topicGetTargetLockState*` - The target (i.e. desired) state of the lock
- `topicSetTargetLockState*` - For setting the target (i.e. desired) state of the lock
- `valueLockStateSecured*` - Locked state, e.g. "true", "255", or "Locked"
- `valueLockStateUnsecured*` - Unlocked state, e.g. "false", "0", or "Unlocked"
- `valueLockStateJammed` - Lock is jammed, e.g. "254" or "Jammed"

#### SecuritySystem
- `topicGetCurrentSecurityState*` — The current state of the system
- `topicGetTargetSecurityState*` — The target state of the system
- `topicSetTargetSecurityState*` — For setting the target state of the system
- `topicGetStatusFault` — For getting whether there is a system error
- `topicGetStatusTampered` — For getting whether the system has been tampered with
- `valueArmStay` - System armed in stay mode, e.g. "SA" or "stay"
- `valueArmAway` - System armed in away mode, e.g. "AA" or "away"
- `valueArmNight` - System armed in night mode, e.g. "NA" or "night"
- `valueDisarm` - System armed in away mode, e.g. "D" or "disarmed"
- `valueAlarmTriggered` - When the alarm has been triggered, e.g. "true" or "1" or "triggered"
- `valueFault` - Accessory has a fault
- `valueTampered` - Accessory has been tampered with

#### StatelessProgrammableSwitch
- `topicEventButtonPress*` - Event for button press event
- `valueSinglePress` - Single press event
- `valueDoublePress` - Double press event
- `valueLongPress` - Long press event

### Doorbell
- `maximumBrightness` - Set a maximum to use values (i.e. 1, 2, 3) rather than a percentage for brightness
- `maximumVolume` - Set a maximum to use values (i.e. 1, 2, 3) rather than a percentage for volume
- `topicEventButtonPress*` - Event for button press event
- `topicGetBrightness` - Get the brightness
- `topicSetBrightness` - Set the brightness
- `topicGetMuted` - Get whether or not the doorbell is muted
- `topicSetMuted` - Set whether or not the doorbell is muted
- `topicGetVolume` - Get the volume
- `topicSetVolume` - Set the volume
- `valueSinglePress` - Single press event
- `valueDoublePress` - Double press event
- `valueLongPress` - Long press event
- `valueMuted` - Doorbell muted
- `valueUnmuted` - Doorbell unmuted

#### Valve
- `valveType` -  One of `GENERIC_VALVE` (default), `IRRIGATION`, `SHOWER_HEAD`, or `WATER_FAUCET`
- `topicGetValveActive*` - For getting whether or not the valve is active
- `topicSetValveActive*` - For setting whether or not the valve is active
- `topicGetValveInUse*` - For getting whether or not the valve is in use
- `topicGetStatusFault` - For getting whether or not there is a fault
- `topicGetValveIsConfigured` - For getting wether or not valve is configured
- `topicSetValveIsConfigured` - For setting wether or not valve is configured
- `topicGetValveSetDuration` - For getting the set duration in seconds
- `topicSetValveSetDuration` - For setting the set duration in seconds
- `topicGetValveRemainingDuration` - For getting the time remaining in seconds
- `valueActive*` - Valve is active, e.g. "true", or "1", or "active"
- `valueInactive*` - Valve is not active e.g. "false", or "0", or "active"
- `valueInUse*` - Valve is in use, e.g. "true", or "1", or "used"
- `valueConfigured` - Valve is configured, e.g. "true", or "1", or "configured"
- `valueNotConfigured` - Valve is not configured, e.g. "false", or "0", or "unconfigured"
- `valueFault` - Valve has a fault, e.g. "error", or "-1"

## Logging/Debugging:

By default, devices will log activity, for example when a Switch is turned on or a LockMechanism is unlocked.

To disable, add the following to the accessories you'd like to silence.

- `"disableLogging": true`

You may also turn on additional logging if you'd like to see the MQTT messages passed back and forth. You can do this by adding the following at the top level of the config.

- `"verbose": true`

## MQTT Options

You are able to pass in any arbitrary MQTT options via `mqtt.options` in the config. This can be a combination of [client options](https://github.com/mqttjs/MQTT.js?tab=readme-ov-file#mqttclientstreambuilder-options) and [publish options](https://github.com/mqttjs/MQTT.js?tab=readme-ov-file#mqttclientpublishtopic-message-options-callback). Just make sure the value provided is valid JSON. For example:

```
"options": "{ \"protocolVersion\": \"4\", \"clientId\": \"my-client-id\", \"retain\": true }"
```

## MQTT OnConnect

Accessories can be configured to publish any number of arbitratry messages to the MQTT server on connect. This can be useful to invoke accessories to give updates on their current status.

Each entry should have a topic and a message:

```
"onConnect": [
  {
    "topic": "some/arbitrary/topic",
    "message": "connected",
  },
  {
    "topic": "another/arbitrary/topic",
    "message": "{ \"value\": \"can also be json\" }",
  }
]
```

## Advanced Topic Notation

### JSONPaths

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

### Value Transformers

There are other situations where the value needs to be adjusted or altered entirely.

For example, you may have an Air Quality Sensor that measures Nitrogen Dioxide in ppm (parts per million) instead of µg/m³ (micrograms per cubic meter) which HomeKit expects. In this case, you need to multiply by the arbitrary number 1883 to get the correct result.

Using the pipe (`|`) notation, you may add a transformer:

`airquality/no2|value * 1883`

This will multiply the value by `1883` to get the desired result.

Note that `value` is a reserved keyword here to indicate the incoming value you'd like to transform.

You can also do the same thing on the publish side to transfer it back to ppm. In this case, you would need to divide by 1883.

`airquality/no2|value / 1883`

### Both JSONPath + Transformer

You can also combine JSONPath and Transformer notation into a single entity

`airquality$.no2|value * 1883`

## Eve App Support

If you use [Eve](https://apps.apple.com/us/app/eve-for-matter-homekit/id917695792), then there are some additional features available:
- Opened/closed history, and times opened count with option to reset for `ContactSensor`
- `MotionSensor` history
- Temperature history for `HeaterCooler`, `TemperatureSensor`, and `Thermostat`
- Humidity history for `HumiditySensor` and `Thermostat`
- On/off history for `Lightbulb`, `Outlet`, and `Switch`

You can also add get topics for watts/amps/volts/kWh for `Lightbulb`, `Outlet`, and `Switch`:
- `topicGetCurrentConsumption` - Get the current power rate in watts
- `topicGetElectricCurrent` - Get the electrical current in amps
- `topicGetTotalConsumption` - Get the total energy use in kWh
- `topicGetVoltage` - Get the current voltage

To enable history, choose the `History Enabled` option in the config UI.

There are a couple of advanced options if configuring via JSON:

```json
{
  "info": …
  "mqtt": …
  "history": {
    "enabled": true,
    "disableRepeatLastData": false,
    "size": 4032,
  },
  … // Topic & Values
}
```

- `enabled` — used to enable/disable history
- `disableRepeatLastData` — See [fakegato-history](https://github.com/simont77/fakegato-history?tab=readme-ov-file#fakegato-history) for info
- `size` - The maximum number of history entries. Default is 4032 (1 entry every 10 minutes for 28 days)

### Custom Characteristics

Eve users can also add custom characteristics to display any arbitrary numeric information.

<img src="https://raw.githubusercontent.com/mpatfield/homebridge-easy-mqtt/refs/heads/latest/img/screenshot_1.png">

Due to the complexity, this was intentionally left out of the plugin config UI, so this can only be configured manually.

```json
{
  "info": …
  "mqtt": …
  "customCharacteristics": [
    {
      "uuid": "string",
      "name": "string",
      "getTopic": "string",
      "units": "string",
    }
    … // Topic & Values
  ],
}
```

- `uuid` — A unique string (recommend using a (UUID generator)[https://www.uuidgenerator.net/])
- `name` — The display name for the characteristic
- `getTopic` — The topic which provides the numeric value
- `units` - The units which will be displayed at the end of the numeric value

Since `customCharacteristics` is an array, you may define as many custom characteristics as you wish.

## Persistance

By default, all accessory values are saved and reloaded when the plugin restarts. However, you may override this behavior by selecting `Reset on Restart` option and accessories will be reset to defaults whenever the plugin or Homebridge restarts.

- `"resetOnRestart": true`

## Credits

[@arachnetech](https://github.com/arachnetech) for the fantastic [homebridge-mqttthing](https://github.com/arachnetech/homebridge-mqttthing) plugin which serves as the main inspiration for this project

[Keryan Belahcene](https://www.instagram.com/keryan.me) for creating the [Flume](https://github.com/homebridge-plugins/homebridge-flume) header logo which I adapted for this plugin

[fakegato-history](https://github.com/simont77/fakegato-history) by [@simont77](https://github.com/sponsors/simont77) *Copyright © 2017*

[@nehmeroumani](https://github.com/nehmeroumani) for their code contributions to Easy MQTT

And to the amazing creators/contributors of [Homebridge](https://homebridge.io) who made this plugin possible!
