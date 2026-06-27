import { API } from 'homebridge';
import { EveHomeKitTypes } from 'homebridge-lib/EveHomeKitTypes';

import { CharacteristicKey, EveCharacteristicKey } from '../../model/enums.js';

export const EVE_EPOCH = 978307200; // Seconds since Jan 1, 2001

let _EveHomeKitTypes: EveHomeKitTypes | undefined;

export function initEveCharacteristics(api: API) {

  if (_EveHomeKitTypes) {
    return;
  }

  _EveHomeKitTypes = new EveHomeKitTypes(api);
}

export function EveCharacteristic(key: EveCharacteristicKey) {

  if (!_EveHomeKitTypes) {
    throw new Error('EveHomeKitTypes not initialized');
  }

  return _EveHomeKitTypes.Characteristics[key];
}

let EveCharacteristicKeys: Set<EveCharacteristicKey> | undefined;
export function isEveCharacteristic(key: CharacteristicKey): key is EveCharacteristicKey {

  if (EveCharacteristicKeys === undefined) {
    EveCharacteristicKeys = new Set(Object.values(EveCharacteristicKey));
  }

  return EveCharacteristicKeys.has(key as EveCharacteristicKey);
}