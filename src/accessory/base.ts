import { PlatformAccessory } from 'homebridge';

import { PLATFORM_NAME } from '../homebridge/settings.js';

import { MQTT } from '../model/mqtt.js';
import { AccessoryConfig, Primitive } from '../model/types.js';

import { Log } from '../tools/log.js';
import getVersion from '../tools/version.js';

export type TopicHandler = {topic: string, handler: ((topic: string, value: Primitive) => Promise<void>)};

export function makeHandler(topic: string, handler: (topic: string, value: Primitive) => Promise<void>): TopicHandler {
  return { topic, handler };
}

export abstract class MQTTAccessory {
    
  private readonly mqttClient: MQTT;

  constructor(
    protected readonly Service: typeof import('homebridge').Service,
    protected readonly Characteristic: typeof import('homebridge').Characteristic,
    accessory: PlatformAccessory,
    config: AccessoryConfig,
    protected readonly log: Log,    
    caller: string,
  ) {
   
    this.mqttClient = new MQTT(log, config.mqtt, this.onMQTTConnect.bind(this), config.info.name);
    this.mqttClient.connect();

    accessory.getService(Service.AccessoryInformation)!
      .setCharacteristic(Characteristic.Name, config.info.name)
      .setCharacteristic(Characteristic.ConfiguredName, config.info.name)
      .setCharacteristic(Characteristic.Manufacturer, config.info.manufacturer ?? 'Homebridge')
      .setCharacteristic(Characteristic.SerialNumber, config.info.serialNumber ?? `${PLATFORM_NAME}:${config.info.name}`)
      .setCharacteristic(Characteristic.Model, config.info.model ?? caller)
      .setCharacteristic(Characteristic.FirmwareRevision, config.info.version ?? getVersion());
  }

  private async onMQTTConnect(): Promise<void> {
    this.topicHandlers.forEach( topicHandler => {
      this.mqttClient.subscribe(topicHandler.topic, topicHandler.handler);
    });
  }

  protected abstract get topicHandlers(): TopicHandler[];

  protected publish(topic: string, value: Primitive) {
    this.mqttClient.publish(topic, value);
  }

  public teardown() {
    this.mqttClient.teardown();
  }
}