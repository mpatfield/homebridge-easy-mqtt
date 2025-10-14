import { API } from 'homebridge';
import { EveHomeKitTypes } from 'homebridge-lib/EveHomeKitTypes';

import { EveCharacteristicKey } from '../../model/enums.js';

let _EveHomeKitTypes: EveHomeKitTypes | undefined;

export function initEveCharacteristics(api: API) {

  if (_EveHomeKitTypes) {
    throw new Error('EveHomeKitTypes already initialized');
  }

  _EveHomeKitTypes = new EveHomeKitTypes(api);
}

export function EveCharacteristic(key: EveCharacteristicKey) {

  if (!_EveHomeKitTypes) {
    throw new Error('EveHomeKitTypes not initialized');
  }

  return _EveHomeKitTypes.Characteristics[key];
}
