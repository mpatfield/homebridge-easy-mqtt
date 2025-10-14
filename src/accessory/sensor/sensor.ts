import { PrimitiveTypes } from 'homebridge';

import { BaseAccessory } from '../abstract/base.js';
import { strings } from '../../i18n/i18n.js';

import { HKCharacteristicKey } from '../../model/enums.js';
import { MQTTAccessoryDependency, SensorConfig } from '../../model/types.js';

import { LogType } from '../../tools/log.js';

export abstract class SensorAccessory<C extends SensorConfig = SensorConfig> extends BaseAccessory<C> {

  constructor(dependency: MQTTAccessoryDependency<C>) {
    super(dependency);

    this.setup(HKCharacteristicKey.StatusTampered, dependency.Characteristic.StatusTampered.NOT_TAMPERED,
      'topicGetStatusTampered', this.onTamperedUpdate.bind(this), false);

    this.setup(HKCharacteristicKey.StatusFault, dependency.Characteristic.StatusFault.NO_FAULT,
      'topicGetStatusFault', this.onFaultUpdate.bind(this), false);
  }

  private async onTamperedUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    const tampered = value === this.getPrimitiveValue('valueTampered') ? 1 : 0;
    if (!this.onUpdate(HKCharacteristicKey.StatusTampered, tampered)) {
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
    if (!this.onUpdate(HKCharacteristicKey.StatusFault, fault)) {
      return;
    }

    if (fault) {
      this.logIfDesired(LogType.WARNING, strings.error.hasFault);
    } else {
      this.logIfDesired(strings.error.noFault);
    }
  }
}