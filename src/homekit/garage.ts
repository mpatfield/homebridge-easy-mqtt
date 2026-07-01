import { LockMechanismAccessory } from './lock.js';

import { strings } from '../i18n/i18n.js';

import { AccessoryType } from '../model/enums.js';
import { HKCharacteristicKey, MQTTAccessoryDependency } from '../model/homekit.js';
import { GarageDoorConfig } from '../model/types.js';

import { LogType } from '../tools/log.js';

export class GarageDoorAccessory extends LockMechanismAccessory<GarageDoorConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.GarageDoorOpener;
  }

  constructor(dependency: MQTTAccessoryDependency<GarageDoorConfig>) {
    super(dependency, false);

    const stateMap = new Map<keyof GarageDoorConfig, number>([
      ['valueDoorStateOpen', dependency.Characteristic.CurrentDoorState.OPEN],
      ['valueDoorStateClosed', dependency.Characteristic.CurrentDoorState.CLOSED],
      ['valueDoorStateOpening', dependency.Characteristic.CurrentDoorState.OPENING],
      ['valueDoorStateClosing', dependency.Characteristic.CurrentDoorState.CLOSING],
      ['valueDoorStateStopped', dependency.Characteristic.CurrentDoorState.STOPPED],
    ]);

    const currentStateStrings = new Map([
      [dependency.Characteristic.CurrentDoorState.OPEN, strings.garage.stateOpen],
      [dependency.Characteristic.CurrentDoorState.CLOSED, strings.garage.stateClosed],
      [dependency.Characteristic.CurrentDoorState.OPENING, strings.garage.stateOpening],
      [dependency.Characteristic.CurrentDoorState.CLOSING, strings.garage.stateClosing],
      [dependency.Characteristic.CurrentDoorState.STOPPED, strings.garage.stateStopped],
    ]);

    const targetStateStrings = new Map([
      [dependency.Characteristic.TargetDoorState.OPEN, strings.garage.stateOpenFuture],
      [dependency.Characteristic.TargetDoorState.CLOSED, strings.garage.stateClosedFuture],
    ]);

    const validCurrentStates = Array.from(stateMap.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validCurrentStates.length === 0) {
      this.log.error(strings.garage.noCurrentStateValues, this.name);
      return;
    }

    this.setup(HKCharacteristicKey.CurrentDoorState, dependency.Characteristic.CurrentDoorState.CLOSED,
      'topicGetCurrentDoorState',
      this.bindOnUpdateState(HKCharacteristicKey.CurrentDoorState, stateMap, currentStateStrings, strings.garage.unknownValue),
      true,
    )?.setProps({ validValues: validCurrentStates.map((key) => stateMap.get(key)!) });

    const validTargetStates = validCurrentStates.filter((key) => ['valueDoorStateOpen', 'valueDoorStateClosed'].includes(key));
    if (validTargetStates.length === 0) {
      this.log.error(strings.garage.noTargetStateValues, this.name);
      return;
    }

    this.setup(HKCharacteristicKey.TargetDoorState, dependency.Characteristic.TargetDoorState.CLOSED,
      'topicGetTargetDoorState',
      this.bindOnUpdateState(HKCharacteristicKey.TargetDoorState, stateMap, targetStateStrings, strings.garage.unknownValue),
      true,
      'topicSetTargetDoorState',
      this.bindOnSetState(HKCharacteristicKey.TargetDoorState, 'topicSetTargetDoorState', stateMap, targetStateStrings, strings.garage.badValue),
    )?.setProps({ validValues: validTargetStates.map((key) => stateMap.get(key)!) });

    this.setup(HKCharacteristicKey.ObstructionDetected, false,
      'topicGetObstructionDetected',
      this.bindOnUpdateBooleanSingle(HKCharacteristicKey.ObstructionDetected, 'valueDoorObstructed',
        strings.garage.obstructed, strings.garage.unobstructed, LogType.ERROR),
      true,
    );
  }
}