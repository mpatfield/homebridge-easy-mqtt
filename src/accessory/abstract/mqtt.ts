import { CharacteristicValue, PlatformAccessory, PrimitiveTypes, Service } from 'homebridge';

import { Common } from './common.js';
import { CustomCharacteristic } from './customCharacteristic.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { MQTT } from '../../model/mqtt.js';
import { CharacteristicType, MQTTAccessoryConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';
import { createIdentifier } from './helper.js';

export abstract class MQTTAccessory<C extends MQTTAccessoryConfig> extends Common<C> {

  private readonly mqttClient: MQTT | undefined;

  private readonly accessoryService: Service;

  constructor(
    Service: ServiceType,
    public readonly Characteristic: CharacteristicType,
    public readonly platformAccessory: PlatformAccessory,
    public readonly config: C,
    public readonly log: Log,
    isGrouped: boolean,
  ) {
    super(config.info.name);

    this.mqttClient = MQTT.connect(log, config.mqtt, this.name, (client: MQTT) => {
      this.topicHandlers.forEach( topicHandler => {
        client.subscribe(topicHandler.topic, topicHandler.handler);
      });
    });

    const serviceInstance = Service[this.getAccessoryType()];

    if (isGrouped) {

      let accessoryService = platformAccessory.getServiceById(serviceInstance, this.identifier);
      if (!accessoryService) {
        accessoryService = platformAccessory.addService(serviceInstance, config.info.name, this.identifier);
        accessoryService.setCharacteristic(Characteristic.ConfiguredName, config.info.name);
      }

      this.accessoryService = accessoryService;

      return;
    }

    this.accessoryService = platformAccessory.getService(serviceInstance) || platformAccessory.addService(serviceInstance);

    for (const type of Object.values(AccessoryType)) {
      const existingService = platformAccessory.getService(Service[type]);
      if (existingService && type !== config.info.type) {
        platformAccessory.removeService(existingService);
      }
    }

    this.setupCustomCharacteristics();
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

    const keepUUIDs = new Set(Object.values(CharacteristicKey).map( (key) => this.Characteristic[key].UUID));
    const toRemove = this.accessoryService.characteristics.filter( (characteristic) => !keepUUIDs.has(characteristic.UUID));

    for (const characteristic of toRemove) {
      characteristic.updateValue(null);
      this.accessoryService.removeCharacteristic(characteristic);
    }

    if (!this.config.customCharacteristics) {
      return;
    }

    for (const config of this.config.customCharacteristics) {
      const customChar = CustomCharacteristic.create(this.accessoryService, this.Characteristic, config, this.name, this.log, this.config.disableLogging);
      if (customChar !== undefined) {
        this.topicHandlers.push({ topic: customChar.topic, handler: customChar.onUpdateHandler });
      }
    }
  }

  public publish(topic: string, value: PrimitiveTypes) {
    this.mqttClient?.publish(topic, value);
  }

  public teardown() {
    this.mqttClient?.teardown();
  }

  protected setCharacteristicValue(key: CharacteristicKey, value: CharacteristicValue) {
    this.accessoryService.getCharacteristic(this.Characteristic[key]).onGet( () => {
      return value;
    });
  }
}