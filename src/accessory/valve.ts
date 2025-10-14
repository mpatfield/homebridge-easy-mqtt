import { CharacteristicValue, PrimitiveTypes } from 'homebridge';

import { BaseAccessory } from './abstract/base.js';

import { strings } from '../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey, ValveType } from '../model/enums.js';
import { MQTTAccessoryDependency, ValveConfig } from '../model/types.js';

import { LogType } from '../tools/log.js';

export class ValveAccessory extends BaseAccessory<ValveConfig> {

  constructor(dependency: MQTTAccessoryDependency<ValveConfig>) {
    super(dependency);

    this.setCharacteristicValue(HKCharacteristicKey.ValveType, this.toValveTypeCV(this.config.valveType));

    this.setup(HKCharacteristicKey.Active, dependency.Characteristic.Active.INACTIVE,
      'topicGetValveActive',
      this.bindOnUpdateNumericBoolean(HKCharacteristicKey.Active, 'valueActive', strings.valve.active, strings.valve.inactive), true,
      'topicSetValveActive', this.onSetActive.bind(this),
    );

    this.setup(HKCharacteristicKey.InUse, dependency.Characteristic.InUse.NOT_IN_USE,
      'topicGetValveInUse', this.bindOnUpdateNumericBoolean(HKCharacteristicKey.InUse, 'valueInUse', strings.valve.inUse, strings.valve.notInUse), true,
    );

    this.setup(HKCharacteristicKey.StatusFault, dependency.Characteristic.StatusFault.NO_FAULT,
      'topicGetStatusFault', this.onFaultUpdate.bind(this), false);

    this.setup(HKCharacteristicKey.SetDuration, 0,
      'topicGetValveSetDuration', this.bindOnUpdateNumeric(HKCharacteristicKey.SetDuration, strings.valve.setDuration), false,
      'topicSetValveSetDuration', this.onSetSetDuration.bind(this),
    );

    this.setup(HKCharacteristicKey.RemainingDuration, 0,
      'topicGetValveRemainingDuration', this.bindOnUpdateNumeric(HKCharacteristicKey.RemainingDuration, strings.valve.durationRemaining), false);

    this.setup(HKCharacteristicKey.IsConfigured, dependency.Characteristic.IsConfigured.NOT_CONFIGURED,
      'topicGetValveIsConfigured',
      this.bindOnUpdateNumericBoolean(HKCharacteristicKey.IsConfigured, 'valueConfigured', strings.valve.configured, strings.valve.notConfigured),
      false,
      'topicSetValveIsConfigured', this.onSetIsConfigured.bind(this),
    );
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.Valve;
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

  private async onSetActive(value: CharacteristicValue) {

    if (!this.assert('valueActive', 'valueInactive')) {
      return;
    }

    const active = value === this.Characteristic.Active.ACTIVE;
    const logString = active ? strings.valve.activeSet : strings.valve.inactiveSet;
    const publish = active ? this.config.valueActive : this.config.valueInactive;
    this.onSet(HKCharacteristicKey.Active, value, publish, 'topicSetValveActive', logString);
  }

  private async onSetSetDuration(value: CharacteristicValue) {
    const logString = strings.valve.setDurationFuture.replace('%d', value.toString());
    this.onSet(HKCharacteristicKey.SetDuration, value, value as number, 'topicSetValveSetDuration', logString);
  }

  private async onSetIsConfigured(value: CharacteristicValue) {

    if (!this.assert('valueConfigured', 'valueNotConfigured')) {
      return;
    }

    const isConfigured = value === this.Characteristic.IsConfigured.CONFIGURED;
    const logString = isConfigured ? strings.valve.configuredFuture : strings.valve.notConfiguredFuture;
    const publish = isConfigured ? this.config.valueConfigured! : this.config.valueNotConfigured!;
    this.onSet(HKCharacteristicKey.IsConfigured, value, publish, 'topicSetValveIsConfigured', logString);
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
