import { PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { PLATFORM_NAME } from '../../homebridge/settings.js';

import { MQTT } from '../../model/mqtt.js';
import { AccessoryConfig, CharacteristicType, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';
import getVersion from '../../tools/version.js';
import { assert } from '../../tools/validation.js';

export type TopicHandler = {topic: string, handler: ((topic: string, value: PrimitiveTypes) => Promise<void>)};

export function makeHandler(topic: string, handler: (topic: string, value: PrimitiveTypes) => Promise<void>): TopicHandler {
  return { topic, handler };
}

export abstract class MQTTAccessory<C extends AccessoryConfig> {

  private readonly mqttClient: MQTT | undefined;

  constructor(
    protected readonly Service: ServiceType,
    protected readonly Characteristic: CharacteristicType,
    protected readonly accessory: PlatformAccessory,
    protected readonly config: C,
    protected readonly log: Log,
    caller: string,
  ) {

    const name = config.info.name;

    if (this.assert('mqtt')) {
      this.mqttClient = new MQTT(log, config.mqtt, this.onMQTTConnect.bind(this), name);
      this.mqttClient.connect();
    }

    accessory.getService(Service.AccessoryInformation)!
      .setCharacteristic(Characteristic.Name, name)
      .setCharacteristic(Characteristic.ConfiguredName, name)
      .setCharacteristic(Characteristic.Manufacturer, config.info.manufacturer ?? 'Homebridge')
      .setCharacteristic(Characteristic.SerialNumber, config.info.serialNumber ?? `${PLATFORM_NAME}:${name}`)
      .setCharacteristic(Characteristic.Model, config.info.model ?? caller)
      .setCharacteristic(Characteristic.FirmwareRevision, config.info.version ?? getVersion());
  }

  private async onMQTTConnect(): Promise<void> {
    this.topicHandlers.forEach( topicHandler => {
      this.mqttClient?.subscribe(topicHandler.topic, topicHandler.handler);
    });
  }

  protected abstract get topicHandlers(): TopicHandler[];

  protected get name(): string {
    return this.config.info.name;
  }

  protected publish(topic: string, value: PrimitiveTypes) {
    this.mqttClient?.publish(topic, value);
  }

  public teardown() {
    this.mqttClient?.teardown();
  }

  protected assert(...keys: (keyof C)[]): boolean {
    return assert(this.log, this.name, this.config, ...keys);
  }

  protected logIfDesired(message: string, ...parameters: string[]) {

    if (this.config.disableLogging) {
      return;
    }

    this.log.always(message, this.name, ...parameters);
  }
}