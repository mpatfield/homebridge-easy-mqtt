# Change Log

All notable changes to homebridge-easy-mqtt will be documented in this file.

## 2.0.0-beta. ()

### Changed
- ⚠️ Dropped [official support](https://github.com/homebridge/homebridge/wiki/How-To-Update-Node.js) for Node.js v20 and added Node.js v26

### Notes
- Please consider giving this plugin a ⭐️ on [GitHub](https://github.com/mpatfield/homebridge-easy-mqtt) if you're finding it useful!

## 1.5.17 (2026-06-04)

### Added
- "Simulate Duration" option to enable auto-shutoff for [`Valves`](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/Valve) that do not have duration topics
- Minimum and Maximum 'Default Run Time' for [`Valve`](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/Valve) accessory type

### Fixed
- "Reset on Restart" not working as intended — causing characteristic warnings and crashes
    - ⚠️ This has been broken for a while — please [open a ticket](https://github.com/mpatfield/homebridge-easy-mqtt/issues/new/choose) if you notice any new issues with this option enabled
- Potential crash on launch

## 1.5.16 (2026-05-25)

### Added
- Added `topicGetAvailable` for "Last Will and Testament" (LWT) before an accessory goes offline
    - If value does not match `valueAvailable`, then accessory will show "No Response" in HomeKit until the next successful get event
- Packet info (qos, dup, retain) to verbose message logging

### Changed
- Renamed "Get Availability" to "Get Active Status" in config UI to avoid confusion with the new `topicGetAvailable` (see above)

### Fixed
- Potential race condition in persistent storage

## 1.5.15 (2026-05-12)

### Fixed
- Potential crash in translation system

### Changed
- Removed `beta` from `homebridge` dependency
- Reduced noisy startup logging
- Updated dependencies

### Notes
- This [Wiki](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/Migrating-from-MQTTThing) provides config examples for users migrating from MQTTThing. If you have an example of old/new config you'd be willing to share, please [post a message on Discord](https://discord.gg/fdc46U7Kjv) or [open a ticket](https://github.com/mpatfield/homebridge-easy-mqtt/issues/new/choose).
- Would you like to see Homebridge Easy MQTT in your language? Please consider [getting involved](https://github.com/mpatfield/homebridge-easy-mqtt/issues/4). No coding experience required!

## 1.5.14 (2026-04-21)

### Added
- Minimum/maximum temperature and step size for [`Thermostat`](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/Thermostat) ([#221](https://github.com/mpatfield/homebridge-easy-mqtt/issues/221))

## 1.5.13 (2026-03-30)

### Changed
- Cleanup unnecessary dependencies
- Cleanup deprecated code older than 6 months

## 1.5.12 (2026-03-17)

### Changed
- Better handling of battery topics — current battery level will now be displayed in the Home app

### Fixed
- Unhandled 'S2R2' characteristic errors from Eve history ([#204](https://github.com/mpatfield/homebridge-easy-mqtt/issues/204))
    - ⚠️ History will be reset for grouped accessories with history enabled — unfortunately, this is unavoidable

## 1.5.11 (2026-03-10)

### Added
- [`Window`](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/Window) accessory type

### Changed
- Reworked translation system for easier maintenance — please [open a ticket](https://github.com/mpatfield/homebridge-easy-mqtt/issues/new/choose) if you notice translation issues
- Traductions françaises mises à jour. Merci, [@7ute](https://github.com/sponsors/7ute)!
- Aktualisierte deutsche Übersetzungen. Danke, [@steffen-micdev](https://github.com/sponsors/steffen-micdev)!
- Traduceri actualizate în limba română. Mulțumesc, [@rursache](https://github.com/sponsors/rursache)!
- Bản dịch tiếng Việt được cập nhật. Cảm ơn [@khanhnd88](https://github.com/sponsors/khanhnd88)!
- Opdaterede danske oversættelser. Tak [@EjvindHald](https://github.com/sponsors/EjvindHald)!

## 1.5.10 (2026-02-18)

### Added
- Native RGB support for [`Lightbulb`](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/Lightbulb)
- [Auto-reset](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/Auto%E2%80%90Reset) timer for [`LockMechanism`](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/LockMechanism)

### Changed
- ⚠️ Improved [auto-reset](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/Auto%E2%80%90Reset) logic — please [open a ticket](https://github.com/mpatfield/homebridge-easy-mqtt/issues/new/choose) if you notice issues
- Config UI schemas are pre-built rather than translated at run-time — please [open a ticket](https://github.com/mpatfield/homebridge-easy-mqtt/issues/new/choose) if you notice translation issues

## 1.5.9 (2026-02-04)

### Fixed
- Changing accessory name also updates platform accessory name ([#172](https://github.com/mpatfield/homebridge-easy-mqtt/issues/172))

### Added
- Danske oversættelser, tak [@EjvindHald](https://github.com/sponsors/EjvindHald)!

### Changed
- Updated mqtt dependency

## 1.5.8 (2026-01-20)

### Fixed
- Checkboxes in config UI not reflecting correct state in ([#168](https://github.com/mpatfield/homebridge-easy-mqtt/issues/168))

## 1.5.7 (2026-01-16)

### Added
- MQTT option `minPublishIntervalMs` to separate multiple messages published to the same topic by at least this number of milliseconds

### Changed
- Debounce slider values to prevent excess MQTT publishing ([#164](https://github.com/mpatfield/homebridge-easy-mqtt/issues/164#issuecomment-3720881007))

## 1.5.6 (2025-12-17)

### Added
- Accessory `properties` in [Value Transformers](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/Advanced-Topic-Notation#properties)

## 1.5.5 (2025-12-08)

### Added
- [Auto-Reset](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/Auto%E2%80%90Reset) timer for Sensors, Switches, Outlets, Lightbulbs, Fans, Heater/Cooler, and Purifier

## 1.5.4 (2025-11-24)

### Added
- Create a multi-button [`StatelessProgrammableSwitch`](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/StatelessProgrammableSwitch) using comma-separated value lists
    - ⚠️ This *should* be backwards compatible with existing single-button switches, but please [create a ticket](https://github.com/mpatfield/homebridge-easy-mqtt/issues/new/choose) if you  have problems

### Changed
- Updated dependencies

## 1.5.3 (2025-11-14)

### Added
- Deutsche Übersetzungen. Danke, [@steffen-micdev](https://github.com/sponsors/steffen-micdev)!

### Changed
- Accessory states are saved in a single file instead of distributed across many files

## 1.5.2 (2025-11-04)

### Changed
- Persist [Value Transformer](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/Advanced-Topic-Notation#value-transformer) `storage` accross across plugin/Homebridge restarts

## 1.5.1 (2025-11-01)

### Added
- Added `storage` to [Value Transformers](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/Advanced-Topic-Notation#value-transformer)

### Changed
- ⚠️ Dropped [official support](https://github.com/homebridge/homebridge/wiki/How-To-Update-Node.js) for Node.js v18 and added Node.js v24
- Updated dependencies

## 1.5.0 (2025-10-27)

### Added
- [Value Transformers](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/Advanced-Topic-Notation#value-transformer) to alter the incoming/outgoing topic values (similar to the MQTTThing `apply` functionality)
    - Thank you [@nehmeroumani](https://github.com/sponsors/nehmeroumani) for the [PR](https://github.com/mpatfield/homebridge-easy-mqtt/pull/96)!
- [Eve App Support](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/Eve-App-Support) including history and additional characteristics
    - `ContactSensor` opened/closed history and times opened count with option to reset
    - `MotionSensor` history
    - Temperature history for `HeaterCooler`, `TemperatureSensor`, and `Thermostat`
    - Humidity history for `HumiditySensor` and `Thermostat`
    - On/off history and watts/amps/volts/kWh history for `Lightbulb`, `Outlet`, and `Switch`
- `Doorbell` accessory type
- Traduzioni in italiano. Grazie, [@Shikaban](https://github.com/sponsors/Shikaban)!

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
- Broker, username, and password can be set via environment variables ([documentation](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/MQTT-Setup#environment-variables))
- Publish arbitrary MQTT messages on connect ([documentation](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/MQTT-Setup#onconnect))
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
- Support for arbitrary custom characteristics ([documentation](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/Custom-Characteristics))
- JSONPath support in setter topics ([documentation](https://github.com/mpatfield/homebridge-easy-mqtt/wiki/Advanced-Topic-Notation#jsonpath))
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