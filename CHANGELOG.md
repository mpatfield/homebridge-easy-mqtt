# Change Log

All notable changes to homebridge-dummy will be documented in this file.

## 1.4.1-beta.0 (2025-10-10)

### Added
- Traduzioni in italiano. Grazie, [@Shikaban](https://github.com/sponsors/Shikaban)!

### Notes
Would you like to see Homebridge Easy MQTT in your language? Please consider [getting involved](https://github.com/mpatfield/homebridge-easy-mqtt/issues/4). No coding experience required!

## 1.4.0 (2025-10-08)

### Added
- New accessory types:
    - `AirPurifier`
    - `AirQualitySensor`
    - `Fanv2`
    - `GarageDoorOpener`
    - `HeaterCooler`
    - `LightSensor`
    - `StatelessProgrammableSwitch`
    - `Valve`
    - `WindowCovering`
- Broker, username, and password can be set via environment variables ([documentation](https://github.com/mpatfield/homebridge-easy-mqtt#environment-variables))
- Publish arbitrary MQTT messages on connect ([documentation](https://github.com/mpatfield/homebridge-easy-mqtt#mqtt-onconnect))
- Lightbulb `maximumBrightness` to use values (i.e. 1, 2, 3) rather than a percentage for brightness
- Traduceri în limba română. Mulțumesc, [@rursache](https://github.com/sponsors/rursache)!
- Bản dịch tiếng Việt. Cảm ơn [@khanhnd88](https://github.com/sponsors/khanhnd88)!

### Changed
- ⚠️ Accessory states are now saved across plugin/Homebridge restarts
    - If you want to keep the old behavior, select the `Reset on Restart` option for each accessory you want to reset
- MQTT `options` JSON can now also include both client and publish options, such as `retain`
- Optimized MQTT connections by sharing across multiple accessories when possible
    - Previously, every accessory always had its own dedicated connection
- Better field validation in config UI (Thank you, [@justjam2013](https://github.com/sponsors/justjam2013) for teaching me this!)
- Significant under-the-hood cleanup to speed future development
- Traductions françaises mises à jour. Merci, [@7ute](https://github.com/sponsors/7ute)!

## 1.3.0 (2025-09-14)

### Added
- Support for Thermostats
- Support CO, CO2, Contact, Humidity, Leak, Motion, Occupancy, and Smoke sensors
- Support for Groups allowing you to combine multiple accessories into one
    - ⚠️ Note that changing the group name will require you to reconfigure any HomeKit scenes/automations for those accessories
- Support for arbitrary custom characteristics ([documentation](https://github.com/mpatfield/homebridge-easy-mqtt#custom-characteristics))
- JSONPath support in setter topics ([documentation](https://github.com/mpatfield/homebridge-easy-mqtt#jsonpaths))
- Traductions en Français - Merci, [@7ute](https://github.com/sponsors/7ute)!!
- Show banner image in config UI

### Changed
- Significant under-the-hood cleanup to speed future development

### Fixed
- Exponential backoff for MQTT connection errors

## 1.2.0 (2025-09-02)

### Added
- Security System accessory type
- Support for battery and status

### Fixed
- Allow raw strings in MQTT messages
- Changing accessory type cleans up old Homebridge accessories

### Changed
- Updated dev dependencies
- Significant under-the-hood refactoring to speed future development
- Removed in-use setter topic for outlet since it is not user-modifiable
- Condensed and cleaned up config UI
    - Removed optional accessory info fields as they were messy and provided little value
- Deprecated inconsistent LockMechanism topic names
    - topicGetLockCurrentState -> topicGetCurrentLockState
    - topicGetLockTargetState -> topicGetTargetLockState
    - topicSetTargetState -> topicSetTargetLockState

## 1.1.0 (2025-08-20)

### Added
- Temperature Sensor accessory type

### Changed
- Updated dependencies

## 1.0.1 (2025-08-12)

### Changed
- Updated dependencies

## 1.0.0 (2025-07-14)

- First public release