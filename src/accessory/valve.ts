import { CharacteristicValue } from 'homebridge';

import { BaseAccessory } from './abstract/base.js';

import { strings } from '../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey, TimeUnits, ValveType } from '../model/enums.js';
import { MQTTAccessoryDependency, ValveConfig } from '../model/types.js';

import { LogType } from '../tools/log.js';
import { SECOND } from '../tools/time.js';

const DEFAULT_MIN_DURATION = 300; // 5 minutes
const DEFAULT_MAX_DURATION = 3600; // 1 hour

export class ValveAccessory extends BaseAccessory<ValveConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.Valve;
  }

  private durationFinishTime?: number;

  constructor(dependency: MQTTAccessoryDependency<ValveConfig>) {
    super(dependency);

    this.setCharacteristicValue(HKCharacteristicKey.ValveType, this.toValveTypeCV(this.config.valveType));

    this.setup(HKCharacteristicKey.Active, dependency.Characteristic.Active.INACTIVE,
      'topicGetValveActive',
      this.bindOnUpdateNumericBoolean(HKCharacteristicKey.Active, 'valueActive', strings.valve.active, strings.valve.inactive), true,
      'topicSetValveActive',
      this.bindOnSetBoolean(HKCharacteristicKey.Active, 'topicSetValveActive', 'valueActive', 'valueInactive',
        dependency.Characteristic.Active.ACTIVE, strings.valve.activeSet, strings.valve.inactiveSet, this.onSetActive.bind(this)),
    );

    this.setup(HKCharacteristicKey.InUse, dependency.Characteristic.InUse.NOT_IN_USE,
      'topicGetValveInUse', this.bindOnUpdateNumericBoolean(HKCharacteristicKey.InUse, 'valueInUse', strings.valve.inUse, strings.valve.notInUse), true,
    );

    this.setup(HKCharacteristicKey.StatusFault, dependency.Characteristic.StatusFault.NO_FAULT,
      'topicGetStatusFault',
      this.bindOnUpdateBooleanSingle(HKCharacteristicKey.StatusFault, 'valueFault',
        strings.error.hasFault, strings.error.noFault, LogType.WARNING),
      false);

    const minimumDuration: number = dependency.config.minimumDuration ? dependency.config.minimumDuration * 60 : DEFAULT_MIN_DURATION;
    const maximumDuration: number = dependency.config.maximumDuration ? dependency.config.maximumDuration * 60 : DEFAULT_MAX_DURATION;

    if (this.simulateDuration) {

      const durationTopics = [
        dependency.config.topicGetValveSetDuration,
        dependency.config.topicSetValveSetDuration,
        dependency.config.topicGetValveRemainingDuration,
      ].filter(topic => topic !== undefined);
      if (durationTopics.length > 0) {
        dependency.log.warning(strings.valve.durationTopicsIgnored, this.name, `(${durationTopics.join(', ')})`);
      }

      this.setupTopicless(HKCharacteristicKey.SetDuration, minimumDuration, () => undefined)?.setProps( {
        minValue: minimumDuration,
        maxValue: maximumDuration,
      });

      const characteristic = this.service.getCharacteristic(this.characteristicFromKey(HKCharacteristicKey.RemainingDuration));
      characteristic.onGet( async () => this.remainingDuration);

    } else {

      this.setup(HKCharacteristicKey.SetDuration, minimumDuration,
        'topicGetValveSetDuration', this.bindOnUpdateNumeric(HKCharacteristicKey.SetDuration, strings.valve.setDuration), false,
        'topicSetValveSetDuration',
        this.bindOnSetNumeric(HKCharacteristicKey.SetDuration, 'topicSetValveSetDuration', strings.valve.setDurationFuture),
      )?.setProps( {
        minValue: minimumDuration,
        maxValue: maximumDuration,
      });

      this.setup(HKCharacteristicKey.RemainingDuration, 0,
        'topicGetValveRemainingDuration', this.bindOnUpdateNumeric(HKCharacteristicKey.RemainingDuration, strings.valve.durationRemaining), false);
    }

    this.setup(HKCharacteristicKey.IsConfigured, dependency.Characteristic.IsConfigured.NOT_CONFIGURED,
      'topicGetValveIsConfigured',
      this.bindOnUpdateNumericBoolean(HKCharacteristicKey.IsConfigured, 'valueConfigured', strings.valve.configured, strings.valve.notConfigured),
      false,
      'topicSetValveIsConfigured',
      this.bindOnSetBoolean(HKCharacteristicKey.IsConfigured, 'topicSetValveIsConfigured', 'valueConfigured', 'valueNotConfigured',
        dependency.Characteristic.IsConfigured.CONFIGURED, strings.valve.configuredFuture, strings.valve.notConfiguredFuture,
      ),
    );
  }

  private get simulateDuration(): boolean {
    return this.config.simulateDuration === true;
  }

  override onUpdate(key: HKCharacteristicKey, value: CharacteristicValue, logString: string | undefined = undefined): boolean {

    if (!this.simulateDuration) {
      return super.onUpdate(key, value, logString);
    }

    if (key === HKCharacteristicKey.Active && value === this.Characteristic.Active.INACTIVE) {
      const changed = super.onUpdate(key, value, logString);
      this.stopTimerSimulator();
      super.onUpdate(HKCharacteristicKey.InUse, this.Characteristic.InUse.NOT_IN_USE, strings.valve.notInUse);
      return changed;
    }

    if (key !== HKCharacteristicKey.InUse) {
      return super.onUpdate(key, value, logString);
    }

    const changed = super.onUpdate(key, value, logString);
    if (value === this.Characteristic.InUse.IN_USE) {
      if (changed) {
        this.startTimerSimulator();
      }
    } else if (value === this.Characteristic.InUse.NOT_IN_USE) {
      this.stopTimerSimulator();
    }

    return changed;
  }

  private onSetActive(active: boolean) {

    if (!this.simulateDuration || active) {
      return;
    }

    this.stopTimerSimulator();
    super.onUpdate(HKCharacteristicKey.InUse, this.Characteristic.InUse.NOT_IN_USE, strings.valve.notInUse);
  }

  private get remainingDuration(): number {

    if (this.durationFinishTime === undefined) {
      return 0;
    }

    const remainingSeconds = (this.durationFinishTime - Date.now()) / SECOND;
    return Math.max(0, Math.ceil(remainingSeconds));
  }

  private startTimerSimulator() {

    const duration = this.setDuration;
    if (duration === undefined) {
      throw new Error(`${this.name} tried to start simulation timer before setting duration`);
    }

    const MINUTE = 60;
    const HOUR = 3600;

    let config: { time: number, units: TimeUnits };
    if (duration < MINUTE) {
      config = { time: duration, units: TimeUnits.SECONDS };
    } else if (duration < HOUR) {
      config = { time: duration / MINUTE, units: TimeUnits.MINUTES };
    } else {
      config = { time: duration / HOUR, units: TimeUnits.HOURS };
    }

    this.durationFinishTime = Date.now() + (duration * SECOND);

    this.startTimeout( () => {
      this.stopTimerSimulator();

      this.onSetBoolean(HKCharacteristicKey.Active, this.Characteristic.Active.INACTIVE,
        'topicSetValveActive', 'valueActive', 'valueInactive',
        this.Characteristic.Active.ACTIVE, strings.valve.activeSet, strings.valve.inactiveSet);

      super.onUpdate(HKCharacteristicKey.InUse, this.Characteristic.InUse.NOT_IN_USE, strings.valve.notInUse);

    }, config);

    this.onUpdateNumeric(HKCharacteristicKey.RemainingDuration, duration);
  }

  private stopTimerSimulator() {

    this.durationFinishTime = undefined;
    this.cancelTimeout();
    super.onUpdate(HKCharacteristicKey.RemainingDuration, 0);
  }

  private get setDuration(): number | undefined {

    const storedDuration = this.getProperty(HKCharacteristicKey.SetDuration);
    if (typeof storedDuration === 'number') {
      return storedDuration;
    }

    const characteristic = this.service.getCharacteristic(this.characteristicFromKey(HKCharacteristicKey.SetDuration));
    return typeof characteristic.value === 'number' ? characteristic.value : undefined;
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
