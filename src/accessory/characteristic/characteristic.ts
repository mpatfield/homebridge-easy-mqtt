import { AccessoryType, CharacteristicKey, EveCharacteristicKey, HKCharacteristicKey } from '../../model/enums.js';

let _CharacteristicKeys: CharacteristicKey[] | undefined;
export function CharacteristicKeys(): CharacteristicKey[] {

  if (!_CharacteristicKeys) {
    const HKKeys: CharacteristicKey[] = Object.values(HKCharacteristicKey);
    const EveKeys = Object.values(EveCharacteristicKey);
    _CharacteristicKeys = HKKeys.concat(EveKeys);
  }

  return _CharacteristicKeys;
}

export function isOptionalHKCharacteristic(key: CharacteristicKey, accessoryType: AccessoryType): boolean {
  switch (key) {
  case HKCharacteristicKey.BatteryLevel:
    return true;
  case HKCharacteristicKey.StatusLowBattery:
    return !accessoryType.endsWith('Sensor');
  case HKCharacteristicKey.StatusActive:
    return !accessoryType.endsWith('Sensor');
  default:
    return false;
  }
}
