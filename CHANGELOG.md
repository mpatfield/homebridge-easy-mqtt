# Change Log

All notable changes to homebridge-dummy will be documented in this file.

## 1.2.0 (2025-09-02)

### HELP NEEDED! (no coding experience required)

Would you like to see Homebridge Easy MQTT in your language? Please consider [getting involved](https://github.com/mpatfield/homebridge-easy-mqtt/issues/4).

### Added
- Security System accessory type
- Support for battery and status

### Fixed
- Allow raw strings in mqtt messages
- Changing accessory type cleans up old Homebridge accessories

### Changed
- Updated dev dependencies
- Significant under-the-hood refactoring to speed future development
- Removed in-use setter topic for outlet since it is not user modifyable
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