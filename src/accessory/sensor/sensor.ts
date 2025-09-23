import { PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { BaseAccessory } from '../abstract/base.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, SensorConfig, ServiceType } from '../../model/types.js';

import { Log, LogType } from '../../tools/log.js';

export abstract class SensorAccessory<C extends SensorConfig = SensorConfig> extends BaseAccessory<C> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: C, log: Log, isGrouped: boolean) {
    super(Service, Characteristic, accessory, config, log, isGrouped);

    this.setupCharacteristic(CharacteristicKey.StatusTampered, Characteristic.StatusTampered.NOT_TAMPERED,
      'topicGetStatusTampered', this.onTamperedUpdate.bind(this), false);

    this.setupCharacteristic(CharacteristicKey.StatusFault, Characteristic.StatusFault.NO_FAULT,
      'topicGetStatusFault', this.onFaultUpdate.bind(this), false);
  }

  private async onTamperedUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    const tampered = value === this.getPrimitiveValue('valueTampered') ? 1 : 0;
    if (!this.onUpdate(CharacteristicKey.StatusTampered, tampered)) {
      return;
    }

    if (tampered) {
      this.logIfDesired(LogType.WARNING, strings.error.isTampered);
    } else {
      this.logIfDesired(strings.error.notTampered);
    }
  }

  private async onFaultUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    const fault = value === this.getPrimitiveValue('valueFault') ? 1 : 0;
    if (!this.onUpdate(CharacteristicKey.StatusFault, fault)) {
      return;
    }

    if (fault) {
      this.logIfDesired(LogType.WARNING, strings.error.hasFault);
    } else {
      this.logIfDesired(strings.error.noFault);
    }
  }
}