import { CharacteristicValue, PlatformAccessory, PrimitiveTypes, Service } from 'homebridge';

import { Common } from './common.js';
import { CustomCharacteristic } from './customCharacteristic.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { MQTT } from '../../model/mqtt.js';
import { CharacteristicType, MQTTAccessoryConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export abstract class MQTTAccessory<C extends MQTTAccessoryConfig> extends Common<C> {

  private readonly mqttClient: MQTT | undefined;

  protected readonly accessoryService: Service;

  constructor(
    Service: ServiceType,
    Characteristic: CharacteristicType,
    accessory: PlatformAccessory,
    config: C,
    log: Log,
    isGrouped: boolean,
  ) {

    super(Characteristic, log, config.disableLogging, config, config.info.name, (topic, value) => {
      this.mqttClient?.publish(topic, value);
    });

    this.mqttClient = MQTT.connect(log, config.mqtt, this.name, (client: MQTT) => {
      this.topicHandlers.forEach( topicHandler => {
        client.subscribe(topicHandler.topic, topicHandler.handler);
      });
    });

    const serviceInstance = Service[this.getAccessoryType()];

    if (isGrouped) {

      let accessoryService = accessory.getServiceById(serviceInstance, config.info.id);
      if (!accessoryService) {
        accessoryService = accessory.addService(serviceInstance, config.info.name, config.info.id);
        accessoryService.setCharacteristic(Characteristic.ConfiguredName, config.info.name);
      }

      this.accessoryService = accessoryService;

      return;
    }

    this.accessoryService = accessory.getService(serviceInstance) || accessory.addService(serviceInstance);

    for (const type of Object.values(AccessoryType)) {
      const existingService = accessory.getService(Service[type]);
      if (existingService && type !== config.info.type) {
        accessory.removeService(existingService);
      }
    }

    this.setupCustomCharacteristics();
  }

  protected abstract getAccessoryType(): AccessoryType;

  protected get service(): Service {
    return this.accessoryService;
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

  protected publish(topic: string, value: PrimitiveTypes) {
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