import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

//import { strings } from '../i18n/i18n.js';

import { Log } from '../tools/log.js';
import getVersion from '../tools/version.js';

import { MQTT } from '../model/mqtt.js';

/*
{
    "type": "lockMechanism",
    "name": "Bathroom Door",
    "url": "mqtt://localhost",
    "topics": {
        "getOnline": "zwave/nodeID_4/status$.status",
        "getLockCurrentState": "zwave/nodeID_4/door_lock/endpoint_0/currentMode$.value",
        "getLockTargetState": "zwave/nodeID_4/door_lock/endpoint_0/targetMode$.value",
        "setLockTargetState": "zwave/nodeID_4/door_lock/endpoint_0/targetMode/set"
    },
    "confirmationIndicateOffline": true,
    "lockValues": [
        "0",
        "255",
        "254",
        "-1"
    ],
    "onlineValue": "Alive",
    "offlineValue": "Dead",
    "manufacturer": "Schlage",
    "model": "Smart Connect",
    "serialNumber": "59-25409-20548",
    "firmwareRevision": "3.42",
    "accessory": "mqttthing"
}
*/

enum Status {
  Active = 'Active',
  Dead = 'Dead'
}

enum Mode {
  Unlocked = 0,
  Locked = 255,
  Jammed = 254,
  Unknown = -1
}

export class LockAccessory {
  private readonly accessoryService: Service;

  private readonly name: string;

  private readonly mqttClient: MQTT;

  private currentMode: Mode = Mode.Unknown;
  private targetMode: Mode = Mode.Unknown;

  constructor(
    private readonly log: Log,
    accessory: PlatformAccessory,
    private readonly Service: typeof import('homebridge').Service,
    private readonly Characteristic: typeof import('homebridge').Characteristic,
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

    this.mqttClient = new MQTT(this.log);

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

    this.accessoryService.updateCharacteristic(this.Characteristic.StatusActive, false);

    this.mqttClient.connect(this.onMQTTConnect.bind(this));
  }

  private async onMQTTConnect(): Promise<void> {
    this.mqttClient.subscribe('zwave/nodeID_4/status', this.onStatusUpdate.bind(this));
    this.mqttClient.subscribe('zwave/nodeID_4/door_lock/endpoint_0/currentMode', this.onCurrentMode.bind(this));
    this.mqttClient.subscribe('zwave/nodeID_4/door_lock/endpoint_0/targetMode', this.onTargetMode.bind(this));
  }

  private async onStatusUpdate(topic: string, data: any): Promise<void> {
    this.accessoryService.updateCharacteristic(this.Characteristic.StatusActive, data.status === Status.Active);
    this.log.ifVerbose(data.status); // TODO
  }

  private async onCurrentMode(topic: string, data: any): Promise<void> {
    this.log.ifVerbose(data); // TODO
    this.currentMode = data.value;
    this.accessoryService.updateCharacteristic(this.Characteristic.LockCurrentState, this.stateFromMode(this.currentMode));
  }

  private async onTargetMode(topic: string, data: any): Promise<void> {
    this.log.always(data); // TODO
    this.targetMode = data.value;
    this.accessoryService.updateCharacteristic(this.Characteristic.LockTargetState, this.stateFromMode(this.targetMode));
  }

  private async getCurrentState(): Promise<CharacteristicValue> {
    return this.stateFromMode(this.currentMode);
  }

  private async getTargetState(): Promise<CharacteristicValue> {
    return this.stateFromMode(this.targetMode);
  }

  private async setTargetState(value: CharacteristicValue) {
    this.log.always(value.toString()); // TODO
    this.targetMode = this.modeFromState(value);
    this.accessoryService.updateCharacteristic(this.Characteristic.LockTargetState, this.stateFromMode(this.targetMode));
    this.mqttClient.publish('zwave/nodeID_4/door_lock/endpoint_0/targetMode/set', this.targetMode);
  }

  private modeFromState(value: CharacteristicValue): Mode {
    switch (value) {
    case this.Characteristic.LockCurrentState.SECURED:
      return Mode.Locked;
    case this.Characteristic.LockCurrentState.UNSECURED:
      return Mode.Unlocked;
    case this.Characteristic.LockCurrentState.JAMMED:
      return Mode.Jammed;
    default:
      return Mode.Unknown;
    }
  }

  private stateFromMode(mode: Mode): CharacteristicValue {
    switch (mode) {
    case Mode.Locked:
      return this.Characteristic.LockCurrentState.SECURED;
    case Mode.Unlocked:
      return this.Characteristic.LockCurrentState.UNSECURED;
    case Mode.Jammed:
      return this.Characteristic.LockCurrentState.JAMMED;
    default:
      return this.Characteristic.LockCurrentState.UNKNOWN;
    }
  }
}
