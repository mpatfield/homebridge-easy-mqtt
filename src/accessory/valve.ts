import { CharacteristicValue } from 'homebridge';

import { BaseAccessory } from './abstract/base.js';

import { strings } from '../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey, ValveType } from '../model/enums.js';
import { MQTTAccessoryDependency, ValveConfig } from '../model/types.js';

import { LogType } from '../tools/log.js';

export class ValveAccessory extends BaseAccessory<ValveConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.Valve;
  }

  constructor(dependency: MQTTAccessoryDependency<ValveConfig>) {
    super(dependency);

    this.setCharacteristicValue(HKCharacteristicKey.ValveType, this.toValveTypeCV(this.config.valveType));

    this.setup(HKCharacteristicKey.Active, dependency.Characteristic.Active.INACTIVE,
      'topicGetValveActive',
      this.bindOnUpdateNumericBoolean(HKCharacteristicKey.Active, 'valueActive', strings.valve.active, strings.valve.inactive), true,
      'topicSetValveActive',
      this.bindOnSetBoolean(HKCharacteristicKey.Active, 'topicSetValveActive', 'valueActive', 'valueInactive',
        this.Characteristic.Active.ACTIVE, strings.valve.activeSet, strings.valve.inactiveSet),
    );

    this.setup(HKCharacteristicKey.InUse, dependency.Characteristic.InUse.NOT_IN_USE,
      'topicGetValveInUse', this.bindOnUpdateNumericBoolean(HKCharacteristicKey.InUse, 'valueInUse', strings.valve.inUse, strings.valve.notInUse), true,
    );

    this.setup(HKCharacteristicKey.StatusFault, dependency.Characteristic.StatusFault.NO_FAULT,
      'topicGetStatusFault',
      this.bindOnUpdateBooleanSingle(HKCharacteristicKey.StatusFault, 'valueFault',
        strings.error.hasFault, strings.error.noFault, LogType.WARNING),
      false);

    this.setup(HKCharacteristicKey.SetDuration, 0,
      'topicGetValveSetDuration', this.bindOnUpdateNumeric(HKCharacteristicKey.SetDuration, strings.valve.setDuration), false,
      'topicSetValveSetDuration',
      this.bindOnSetNumeric(HKCharacteristicKey.SetDuration, 'topicSetValveSetDuration', strings.valve.setDurationFuture),
    );

    this.setup(HKCharacteristicKey.RemainingDuration, 0,
      'topicGetValveRemainingDuration', this.bindOnUpdateNumeric(HKCharacteristicKey.RemainingDuration, strings.valve.durationRemaining), false);

    this.setup(HKCharacteristicKey.IsConfigured, dependency.Characteristic.IsConfigured.NOT_CONFIGURED,
      'topicGetValveIsConfigured',
      this.bindOnUpdateNumericBoolean(HKCharacteristicKey.IsConfigured, 'valueConfigured', strings.valve.configured, strings.valve.notConfigured),
      false,
      'topicSetValveIsConfigured',
      this.bindOnSetBoolean(HKCharacteristicKey.IsConfigured, 'topicSetValveIsConfigured', 'valueConfigured', 'valueNotConfigured',
        this.Characteristic.IsConfigured.CONFIGURED, strings.valve.configuredFuture, strings.valve.notConfiguredFuture,
      ),
    );
  }

  private toValveTypeCV(value: ValveType | undefined): CharacteristicValue {

    if (value === undefined) {
      return this.Characteristic.ValveType.GENERIC_VALVE;
    }

    switch(value) {
    case ValveType.GENERIC_VALVE:
      return this.Characteristic.ValveType.GENERIC_VALVE;
    case ValveType.IRRIGATION:
      return this.Characteristic.ValveType.IRRIGATION;
    case ValveType.SHOWER_HEAD:
      return this.Characteristic.ValveType.SHOWER_HEAD;
    case ValveType.WATER_FAUCET:
      return this.Characteristic.ValveType.WATER_FAUCET;
    }

    this.log.error(strings.valve.badValveType, this.name, `'${value}'`, Object.values(ValveType).join(', '));
    return this.Characteristic.ValveType.GENERIC_VALVE;
  }
}
