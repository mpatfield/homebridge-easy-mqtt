import { CharacteristicValue } from 'homebridge';

import { TemperatureControlAccessory } from './temperatureControl.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { ActiveClimateConfig, MQTTAccessoryDependency } from '../../model/types.js';

export abstract class ActiveClimateAccessory<C extends ActiveClimateConfig = ActiveClimateConfig> extends TemperatureControlAccessory<C> {

  constructor(dependency: MQTTAccessoryDependency<C>) {
    super(dependency);

    this.setup(CharacteristicKey.Active, dependency.Characteristic.Active.INACTIVE,
      'topicGetActive',
      this.bindOnUpdateNumericBoolean(CharacteristicKey.Active, 'valueStateActive', strings.active.active, strings.active.notActive), true,
      'topicSetActive', this.onSetActive.bind(this),
    );

    this.setup(CharacteristicKey.LockPhysicalControls, dependency.Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED,
      'topicGetLockPhysicalControls',
      this.bindOnUpdateNumericBoolean(
        CharacteristicKey.LockPhysicalControls, 'valueControlLock',
        strings.active.controlsLocked, strings.active.controlsUnLocked),
      false,
      'topicSetLockPhysicalControls', this.onSetLockControls.bind(this),
    );

    let rotationLogString = strings.active.rotationValueUpdate;
    if (!dependency.config.maximumRotationSpeed || !this.assertType('number', 'maximumRotationSpeed')) {
      dependency.config.maximumRotationSpeed = 100;
      rotationLogString = strings.active.rotationPercentUpdate;
    }

    this.setup(CharacteristicKey.RotationSpeed, 0,
      'topicGetRotationSpeed', this.bindOnUpdateNumeric(CharacteristicKey.RotationSpeed, rotationLogString), false,
      'topicSetRotationSpeed', this.onSetRotationSpeed.bind(this),
    )?.setProps({ maxValue: dependency.config.maximumRotationSpeed });

    this.setup(CharacteristicKey.SwingMode, dependency.Characteristic.SwingMode.SWING_DISABLED,
      'topicGetSwingMode',
      this.bindOnUpdateNumericBoolean(CharacteristicKey.SwingMode, 'valueSwingEnabled',
        strings.active.swingEnabled, strings.active.swingDisabled),
      false,
      'topicSetSwingMode', this.onSetSwingMode.bind(this),
    );
  }

  private async onSetActive(value: CharacteristicValue) {

    if (!this.assert('valueStateActive', 'valueStateInactive')) {
      return;
    }

    const active = value === this.Characteristic.Active.ACTIVE;
    const logString = active ? strings.active.activeSet : strings.active.inactiveSet;
    const publish = active ? this.config.valueStateActive : this.config.valueStateInactive;
    this.onSet(CharacteristicKey.Active, value, publish, 'topicSetActive', logString);
  }

  private async onSetLockControls(value: CharacteristicValue) {

    if (!this.assert('valueControlLock', 'valueControlUnlock')) {
      return;
    }

    const lock = value === this.Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED;
    const logString = lock ? strings.active.controlsLockFuture : strings.active.controlsUnlockFuture;
    const publish = lock ? this.config.valueControlLock! : this.config.valueControlUnlock!;
    this.onSet(CharacteristicKey.LockPhysicalControls, value, publish, 'topicSetLockPhysicalControls', logString);
  }

  private async onSetRotationSpeed(value: CharacteristicValue) {
    const isPercent = this.config.maximumRotationSpeed === undefined || this.config.maximumRotationSpeed === 100;
    const logString = (isPercent ? strings.active.rotationPercentSet : strings.active.rotationValueSet).replace('%d', value.toString());
    this.onSet(CharacteristicKey.RotationSpeed, value, value as number, 'topicSetRotationSpeed', logString);
  }

  private async onSetSwingMode(value: CharacteristicValue) {

    if (!this.assert('valueSwingEnabled', 'valueSwingDisabled')) {
      return;
    }

    const swing = value === this.Characteristic.SwingMode.SWING_ENABLED;
    const logString = swing ? strings.active.swingEnabledFuture : strings.active.swingDisabledFuture;
    const publish = swing ? this.config.valueSwingEnabled! : this.config.valueSwingDisabled!;
    this.onSet(CharacteristicKey.SwingMode, value, publish, 'topicSetSwingMode', logString);
  }

  // private rotationLogString(set: boolean = false): string {
  //   if (this.config.maximumRotationSpeed && this.config.maximumRotationSpeed < 100) {
  //     return set ? strings.active.rotationValueSet : strings.active.rotationValueUpdate;
  //   }
  //   return set ? strings.active.rotationPercentSet : strings.active.rotationPercentUpdate;
  // }
}