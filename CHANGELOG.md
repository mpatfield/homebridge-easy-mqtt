# Change Log

All notable changes to homebridge-dummy will be documented in this file.

## 1.0.0-beta.3 (2025-07-01)

_RELEASE CANDIDATE_

### Changed
- Current lock state is always set by MQTT
- Enum names in config are translateable

## 1.0.0-beta.2 (2025-06-26)

### Fixed
- State issues in LockMechanism

## 1.0.0-beta.1 (2025-06-26)

### ⚠️ BREAKING
- Several topics were renamed for consistency so some accessories may have to be reconfigured

### Added
- Username/password can now be set in the UI or supplied via config
- Outlet accessory type

### Fixed
- Unnecessary idle timer in mqtt library 

## 1.0.0-beta.0 (2025-06-25)

- Initial beta release