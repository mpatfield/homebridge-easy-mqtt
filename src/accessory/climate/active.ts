import { TemperatureControlAccessory } from './temperatureControl.js';

import { strings } from '../../i18n/i18n.js';

import { HKCharacteristicKey } from '../../model/enums.js';
import { ActiveClimateConfig, MQTTAccessoryDependency } from '../../model/types.js';

export abstract class ActiveClimateAccessory<C extends ActiveClimateConfig = ActiveClimateConfig> extends TemperatureControlAccessory<C> {

  constructor(dependency: MQTTAccessoryDependency<C>) {
    super(dependency);

    this.setup(HKCharacteristicKey.Active, dependency.Characteristic.Active.INACTIVE,
      'topicGetActive',
      this.bindOnUpdateNumericBoolean(HKCharacteristicKey.Active, 'valueStateActive', strings.active.active, strings.active.notActive), true,
      'topicSetActive',
      this.bindOnSetBoolean(HKCharacteristicKey.Active, 'topicSetActive', 'valueStateActive', 'valueStateInactive', dependency.Characteristic.Active.ACTIVE,
        strings.active.activeSet, strings.active.inactiveSet),
    );

    this.setup(HKCharacteristicKey.LockPhysicalControls, dependency.Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED,
      'topicGetLockPhysicalControls',
      this.bindOnUpdateNumericBoolean(
        HKCharacteristicKey.LockPhysicalControls, 'valueControlLock',
        strings.active.controlsLocked, strings.active.controlsUnLocked),
      false,
      'topicSetLockPhysicalControls',
      this.bindOnSetBoolean(HKCharacteristicKey.LockPhysicalControls, 'topicSetLockPhysicalControls', 'valueControlLock', 'valueControlUnlock',
        dependency.Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED, strings.active.controlsLockFuture, strings.active.controlsUnlockFuture),
    );

    let rotationLogString = strings.active.rotationValueUpdate;
    if (!dependency.config.maximumRotationSpeed || !this.assertType('number', 'maximumRotationSpeed')) {
      dependency.config.maximumRotationSpeed = 100;
      rotationLogString = strings.active.rotationPercentUpdate;
    }

    this.setup(HKCharacteristicKey.RotationSpeed, 0,
      'topicGetRotationSpeed', this.bindOnUpdateNumeric(HKCharacteristicKey.RotationSpeed, rotationLogString), false,
      'topicSetRotationSpeed',
      this.bindOnSetPercentOrValue(HKCharacteristicKey.RotationSpeed, 'topicSetRotationSpeed', dependency.config.maximumRotationSpeed,
        strings.active.rotationPercentSet, strings.active.rotationValueSet),
    )?.setProps({ maxValue: dependency.config.maximumRotationSpeed });

    this.setup(HKCharacteristicKey.SwingMode, dependency.Characteristic.SwingMode.SWING_DISABLED,
      'topicGetSwingMode',
      this.bindOnUpdateNumericBoolean(HKCharacteristicKey.SwingMode, 'valueSwingEnabled',
        strings.active.swingEnabled, strings.active.swingDisabled),
      false,
      'topicSetSwingMode',
      this.bindOnSetBoolean(HKCharacteristicKey.SwingMode, 'topicSetSwingMode', 'valueSwingEnabled', 'valueSwingDisabled',
        dependency.Characteristic.SwingMode.SWING_ENABLED, strings.active.swingEnabledFuture, strings.active.swingDisabledFuture),
    );
  }
}