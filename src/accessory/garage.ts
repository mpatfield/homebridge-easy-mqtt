import { CharacteristicValue, PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { LockMechanismAccessory } from './lock.js';

import { strings } from '../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../model/enums.js';
import { CharacteristicType, GarageDoorConfig, ServiceType } from '../model/types.js';

import { Log, LogType } from '../tools/log.js';

export class GarageDoorAccessory extends LockMechanismAccessory<GarageDoorConfig> {

  private readonly STATE_MAP: Map<keyof GarageDoorConfig, number>;

  constructor(
    Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory,
    config: GarageDoorConfig, log: Log, isGrouped: boolean) {
    super(Service, Characteristic, accessory, config, log, isGrouped, false);

    this.STATE_MAP = new Map([
      ['valueDoorStateOpen', Characteristic.CurrentDoorState.OPEN],
      ['valueDoorStateClosed', Characteristic.CurrentDoorState.CLOSED],
      ['valueDoorStateOpening', Characteristic.CurrentDoorState.OPENING],
      ['valueDoorStateClosing', Characteristic.CurrentDoorState.CLOSING],
      ['valueDoorStateStopped', Characteristic.CurrentDoorState.STOPPED],
    ]);

    const validCurrentStates = Array.from(this.STATE_MAP.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validCurrentStates.length === 0) {
      this.log.error(strings.garage.noCurrentStateValues, this.name);
      return;
    }

    this.setup(CharacteristicKey.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED,
      'topicGetCurrentDoorState', this.onCurrentDoorStateUpdate.bind(this), true,
    )?.setProps({ validValues: validCurrentStates.map((key) => this.STATE_MAP.get(key)!) });

    const validTargetStates = validCurrentStates.filter((key) => ['valueDoorStateOpen', 'valueDoorStateClosed'].includes(key));
    if (validTargetStates.length === 0) {
      this.log.error(strings.garage.noTargetStateValues, this.name);
      return;
    }

    this.setup(CharacteristicKey.TargetDoorState, Characteristic.TargetDoorState.CLOSED,
      'topicGetTargetDoorState', this.onTargetDoorStateUpdate.bind(this), true,
      'topicSetTargetDoorState', this.onSetTargetDoorState.bind(this),
    )?.setProps({ validValues: validTargetStates.map((key) => this.STATE_MAP.get(key)!) });

    this.setup(CharacteristicKey.ObstructionDetected, false, 'topicGetObstructionDetected', this.onObstructionUpdate.bind(this), true);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.GarageDoorOpener;
  }

  private async onCurrentDoorStateUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    const current = this.toCVState(value);
    if (current === undefined) {
      return;
    }

    this.onUpdate(CharacteristicKey.CurrentDoorState, current, this.stateStringForCV(current));
  }

  private async onTargetDoorStateUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    const target = this.toCVState(value);
    if (target === undefined) {
      return;
    }

    this.onUpdate(CharacteristicKey.TargetDoorState, target, this.stateStringForCV(target, true));
  }

  private async onSetTargetDoorState(value: CharacteristicValue) {

    const target = this.fromCVState(value);
    if (target === undefined) {
      return;
    }

    this.onSet(CharacteristicKey.TargetDoorState, value, target, 'topicSetTargetDoorState', this.stateStringForCV(value, true));
  }

  private async onObstructionUpdate(topic: string, value: PrimitiveTypes) {

    const obstructed = value === this.getPrimitiveValue('valueDoorObstructed');
    if (!this.onUpdate(CharacteristicKey.ObstructionDetected, obstructed)) {
      return;
    }

    if (obstructed) {
      this.logIfDesired(LogType.ERROR, strings.garage.obstructed);
    } else {
      this.logIfDesired(strings.garage.unobstructed);
    }
  }

  private toCVState(value: PrimitiveTypes): CharacteristicValue | undefined {
    switch (value) {
    case this.getPrimitiveValue('valueDoorStateOpen', false):
      return this.STATE_MAP.get('valueDoorStateOpen');
    case this.getPrimitiveValue('valueDoorStateClosed', false):
      return this.STATE_MAP.get('valueDoorStateClosed');
    case this.getPrimitiveValue('valueDoorStateOpening', false):
      return this.STATE_MAP.get('valueDoorStateOpening');
    case this.getPrimitiveValue('valueDoorStateClosing', false):
      return this.STATE_MAP.get('valueDoorStateClosing');
    case this.getPrimitiveValue('valueDoorStateStopped', false):
      return this.STATE_MAP.get('valueDoorStateStopped');
    }

    this.logIfDesired(strings.garage.unknownValue, `'${value}'`);
  }

  private fromCVState(value: CharacteristicValue): PrimitiveTypes | undefined {

    let primative = undefined;
    this.STATE_MAP.forEach( (test, key) => {
      if (value === test) {
        primative = this.getPrimitiveValue(key);
      }
    });

    if (primative === undefined) {
      this.log.error(strings.garage.badValue, this.name, `'${value}'`);
    }

    return primative;
  }

  private stateStringForCV(state: CharacteristicValue, future: boolean = false): string {
    switch(state) {
    case this.Characteristic.CurrentDoorState.OPEN:
      return future ? strings.garage.stateOpenFuture : strings.garage.stateOpen;
    case this.Characteristic.CurrentDoorState.CLOSED:
      return future ? strings.garage.stateClosedFuture : strings.garage.stateClosed;
    case this.Characteristic.CurrentDoorState.OPENING:
      return strings.garage.stateOpening;
    case this.Characteristic.CurrentDoorState.CLOSING:
      return strings.garage.stateClosing;
    case this.Characteristic.CurrentDoorState.STOPPED:
      return strings.garage.stateStopped;
    default:
      return strings.garage.stateUnknown;
    }
  }
}