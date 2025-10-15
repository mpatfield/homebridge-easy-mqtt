import { CharacteristicValue, PlatformAccessory, PrimitiveTypes, Service } from 'homebridge';

import { Common } from './common.js';
import { createIdentifier } from './helper.js';

import { CharacteristicKeys } from '../characteristic/characteristic.js';
import { CustomCharacteristic } from '../characteristic/custom.js';

import { AccessoryType, HKCharacteristicKey } from '../../model/enums.js';
import { MQTT } from '../../model/mqtt.js';
import { CharacteristicType, MQTTAccessoryConfig, MQTTAccessoryDependency } from '../../model/types.js';

import { HistoryEntry, HistoryType } from '../../model/history.js';
import { Log } from '../../tools/log.js';

export abstract class MQTTAccessory<C extends MQTTAccessoryConfig> extends Common<C> {

  private readonly mqttClient: MQTT | undefined;

  private readonly accessoryService: Service;

  constructor(
    private readonly dependency: MQTTAccessoryDependency<C>,
  ) {
    super(dependency.config.info.name);

    this.mqttClient = MQTT.connect(dependency.log, dependency.config.mqtt, this.name, (client: MQTT) => {
      this.topicHandlers.forEach( topicHandler => {
        client.subscribe(topicHandler.topic, topicHandler.handler);
      });
    });

    const serviceInstance = dependency.Service[this.getAccessoryType()];

    if (dependency.isGrouped) {

      let accessoryService = dependency.platformAccessory.getServiceById(serviceInstance, this.identifier);
      if (!accessoryService) {
        accessoryService = dependency.platformAccessory.addService(serviceInstance, dependency.config.info.name, this.identifier);
        accessoryService.setCharacteristic(dependency.Characteristic.ConfiguredName, dependency.config.info.name);
      }

      this.accessoryService = accessoryService;

      return;
    }

    this.accessoryService = dependency.platformAccessory.getService(serviceInstance) || dependency.platformAccessory.addService(serviceInstance);

    for (const type of Object.values(AccessoryType)) {
      const existingService = dependency.platformAccessory.getService(dependency.Service[type]);
      if (existingService && type !== dependency.config.info.type) {
        dependency.platformAccessory.removeService(existingService);
      }
    }

    this.setupCustomCharacteristics();
  }

  public get Characteristic(): CharacteristicType {
    return this.dependency.Characteristic;
  }

  public get platformAccessory(): PlatformAccessory {
    return this.dependency.platformAccessory;
  }

  protected get config(): C {
    return this.dependency.config;
  }

  public get log(): Log {
    return this.dependency.log;
  }

  protected abstract getAccessoryType(): AccessoryType;

  public get service(): Service {
    return this.accessoryService;
  }

  public get identifier(): string {
    return createIdentifier(this.config.info);
  }

  public get useStoredProperties(): boolean {
    return this.config.resetOnRestart !== true;
  }

  public get disableLogging(): boolean {
    return this.config.disableLogging;
  }

  public get subtype(): string | undefined {
    return this.accessoryService.subtype;
  }

  private setupCustomCharacteristics() {

    const keepUUIDs = new Set(CharacteristicKeys().map( (key) => this.characteristicFromKey(key).UUID));

    for (const config of this.config.customCharacteristics ?? []) {
      const customChar = CustomCharacteristic.create(this.accessoryService, this.Characteristic, config, this.name, this.log, this.config.disableLogging);
      if (customChar !== undefined) {
        keepUUIDs.add(customChar.UUID);
        this.topicHandlers.push({ topic: customChar.topic, handler: customChar.onUpdateHandler });
      }
    }

    const toRemove = this.accessoryService.characteristics.filter( (characteristic) => !keepUUIDs.has(characteristic.UUID));

    for (const characteristic of toRemove) {
      characteristic.updateValue(null);
      this.accessoryService.removeCharacteristic(characteristic);
    }
  }

  public publish(topic: string, value: PrimitiveTypes) {
    this.mqttClient?.publish(topic, value);
  }

  public teardown() {
    this.mqttClient?.teardown();
  }

  protected setCharacteristicValue(key: HKCharacteristicKey, value: CharacteristicValue) {
    this.accessoryService.getCharacteristic(this.Characteristic[key]).onGet( () => {
      return value;
    });
  }

  protected recordHistory(type: HistoryType, entry: HistoryEntry, updateLastActivation: boolean = false) {
    this.dependency.history.record(this, this.config.history, type, entry, updateLastActivation);
  }
}