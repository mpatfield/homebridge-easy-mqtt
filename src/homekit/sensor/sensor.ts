import { HomeKitAccessory } from '../abstract/base.js';

import { strings } from '../../i18n/i18n.js';

import { HKCharacteristicKey } from '../../model/enums.js';
import { MQTTAccessoryDependency, SensorConfig } from '../../model/types.js';

import { LogType } from '../../tools/log.js';

export abstract class SensorAccessory<C extends SensorConfig = SensorConfig> extends HomeKitAccessory<C> {

  constructor(dependency: MQTTAccessoryDependency<C>) {
    super(dependency);

    this.setup(HKCharacteristicKey.StatusTampered, dependency.Characteristic.StatusTampered.NOT_TAMPERED,
      'topicGetStatusTampered',
      this.bindOnUpdateBooleanSingle(HKCharacteristicKey.StatusTampered, 'valueTampered',
        strings.error.isTampered, strings.error.notTampered, LogType.WARNING),
      false,
    );

    this.setup(HKCharacteristicKey.StatusFault, dependency.Characteristic.StatusFault.NO_FAULT,
      'topicGetStatusFault',
      this.bindOnUpdateBooleanSingle(HKCharacteristicKey.StatusFault, 'valueFault',
        strings.error.hasFault, strings.error.noFault, LogType.WARNING),
      false,
    );
  }
}