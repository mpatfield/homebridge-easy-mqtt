import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

//import { strings } from '../i18n/i18n.js';

import { Log } from '../tools/log.js';
import getVersion from '../tools/version.js';

export class LockAccessory {
  private readonly accessoryService: Service;

  private readonly name: string;

  private isLocked = true;

  constructor(
    readonly log: Log,
    accessory: PlatformAccessory,
    readonly Service: typeof import('homebridge').Service,
    readonly Characteristic: typeof import('homebridge').Characteristic,
    readonly persistPath: string,
  ) {

    this.name = 'TODO';

    this.accessoryService = accessory.getService(Service.LockMechanism) || accessory.addService(Service.LockMechanism);

    accessory.getService(this.Service.AccessoryInformation)!
      .setCharacteristic(this.Characteristic.Name, this.name)
      .setCharacteristic(this.Characteristic.ConfiguredName, this.name)
      .setCharacteristic(this.Characteristic.Manufacturer, 'Homebridge')
      .setCharacteristic(this.Characteristic.SerialNumber, 'TODO')
      .setCharacteristic(this.Characteristic.Model, 'TODO')
      .setCharacteristic(this.Characteristic.FirmwareRevision, getVersion());

    this.finishSetup();
  }

  private async finishSetup() {

    this.accessoryService.setCharacteristic(this.Characteristic.LockCurrentState, this.Characteristic.LockCurrentState.SECURED);

    this.accessoryService.getCharacteristic(this.Characteristic.LockCurrentState)
      .onGet(this.getCurrentState.bind(this));

    this.accessoryService.setCharacteristic(this.Characteristic.LockTargetState, this.Characteristic.LockTargetState.SECURED);

    this.accessoryService.getCharacteristic(this.Characteristic.LockTargetState)
      .onGet(this.getTargetState.bind(this))
      .onSet(this.setTargetState.bind(this));
  }

  private async getCurrentState(): Promise<CharacteristicValue> {
    return this.isLocked ? this.Characteristic.LockCurrentState.SECURED : this.Characteristic.LockCurrentState.UNSECURED;
  }

  private async getTargetState(): Promise<CharacteristicValue> {
    this.isLocked = !this.isLocked;
    return this.getCurrentState();
  }

  private async setTargetState(value: CharacteristicValue) {
    this.isLocked = value === this.Characteristic.LockTargetState.SECURED;
    this.log.warning(value.toString());
  }

  private storageKey(suffix: string): string {
    return this.name.replace(/\s/g, '_').toLowerCase() + suffix;
  }
}
