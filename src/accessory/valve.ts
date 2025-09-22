import { CharacteristicValue, PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { BaseAccessory } from './abstract/base.js';

import { strings } from '../i18n/i18n.js';

import { AccessoryType, CharacteristicKey, ValveType } from '../model/enums.js';
import { CharacteristicType, ValveConfig, ServiceType } from '../model/types.js';

import { Log, LogType } from '../tools/log.js';

export class ValveAccessory extends BaseAccessory<ValveConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: ValveConfig, log: Log, isGrouped: boolean) {
    super(Service, Characteristic, accessory, config, log, isGrouped);

    this.setCharacteristicValue(CharacteristicKey.ValveType, this.toValveTypeCV(this.config.valveType));

    this.setupCharacteristic(CharacteristicKey.Active, Characteristic.Active.INACTIVE,
      'topicGetValveActive',
      this.bindOnUpdateNumericBoolean(CharacteristicKey.Active, 'valueActive', strings.valve.active, strings.valve.inactive), true,
      'topicSetValveActive', this.onSetActive.bind(this),
    );

    this.setupCharacteristic(CharacteristicKey.InUse, Characteristic.InUse.NOT_IN_USE,
      'topicGetValveInUse', this.bindOnUpdateNumericBoolean(CharacteristicKey.InUse, 'valueInUse', strings.valve.inUse, strings.valve.notInUse), true,
    );

    this.setupCharacteristic(CharacteristicKey.StatusFault, Characteristic.StatusFault.NO_FAULT,
      'topicGetStatusFault', this.onFaultUpdate.bind(this), false);

    this.setupCharacteristic(CharacteristicKey.SetDuration, 0,
      'topicGetValveSetDuration', this.bindOnUpdateNumeric(CharacteristicKey.SetDuration, strings.valve.setDuration), false,
      'topicSetValveSetDuration', this.onSetSetDuration.bind(this),
    );

    this.setupCharacteristic(CharacteristicKey.RemainingDuration, 0,
      'topicGetValveRemainingDuration', this.bindOnUpdateNumeric(CharacteristicKey.RemainingDuration, strings.valve.durationRemaining), false);

    this.setupCharacteristic(CharacteristicKey.IsConfigured, Characteristic.IsConfigured.NOT_CONFIGURED,
      'topicGetValveIsConfigured',
      this.bindOnUpdateNumericBoolean(CharacteristicKey.IsConfigured, 'valueConfigured', strings.valve.configured, strings.valve.notConfigured),
      false,
      'topicSetValveIsConfigured', this.onSetIsConfigured.bind(this),
    );
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.Valve;
  }

  private async onFaultUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    const fault = value === this.getPrimitiveValue('valueFault');
    if (!this.onUpdate(CharacteristicKey.StatusFault, fault)) {
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
    this.onSet(CharacteristicKey.Active, value, publish, 'topicSetValveActive', logString);
  }

  private async onSetSetDuration(value: CharacteristicValue) {
    const logString = strings.valve.setDurationFuture.replace('%d', value.toString());
    this.onSet(CharacteristicKey.SetDuration, value, value as number, 'topicSetValveSetDuration', logString);
  }

  private async onSetIsConfigured(value: CharacteristicValue) {

    if (!this.assert('valueConfigured', 'valueNotConfigured')) {
      return;
    }

    const isConfigured = value === this.Characteristic.IsConfigured.CONFIGURED;
    const logString = isConfigured ? strings.valve.configuredFuture : strings.valve.notConfiguredFuture;
    const publish = isConfigured ? this.config.valueConfigured! : this.config.valueNotConfigured!;
    this.onSet(CharacteristicKey.IsConfigured, value, publish, 'topicSetValveIsConfigured', logString);
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

    this.log.error('bad value'); // TODO
    return this.Characteristic.ValveType.GENERIC_VALVE;
  }
}
