import { Characteristic, CharacteristicSetHandler, CharacteristicValue, Nullable, PlatformAccessory, PrimitiveTypes, Service } from 'homebridge';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { MQTT } from '../../model/mqtt.js';
import { CharacteristicType, MQTTAccessoryConfig, ServiceType } from '../../model/types.js';

import { Log, LogType } from '../../tools/log.js';
import { assert } from '../../tools/validation.js';
import { toPrimitive } from '../../tools/primitive.js';

export type OnUpdateHandler = (topic: string, value: PrimitiveTypes) => (Promise<void>);
type TopicHandler = {topic: string, handler: OnUpdateHandler};

export abstract class MQTTAccessory<C extends MQTTAccessoryConfig> {

  private readonly mqttClient: MQTT | undefined;

  private readonly properties = new Map<string, CharacteristicValue>();

  private readonly topicHandlers: TopicHandler[] = [];

  protected readonly accessoryService: Service;

  constructor(
    protected readonly Service: ServiceType,
    protected readonly Characteristic: CharacteristicType,
    protected readonly accessory: PlatformAccessory,
    protected readonly config: C,
    protected readonly log: Log,
  ) {

    const name = config.info.name;

    if (this.assert('mqtt')) {
      this.mqttClient = new MQTT(log, config.mqtt, this.onMQTTConnect.bind(this), name);
      this.mqttClient.connect();
    }

    this.accessoryService = this.getAccessoryService();

    for (const type of Object.values(AccessoryType)) {
      const existingService = accessory.getService(Service[type]);
      if (existingService && type !== config.info.type) {
        accessory.removeService(existingService);
      }
    }
  }

  private async onMQTTConnect(): Promise<void> {
    this.topicHandlers.forEach( topicHandler => {
      this.mqttClient?.subscribe(topicHandler.topic, topicHandler.handler);
    });
  }

  protected abstract getAccessoryService(): Service;

  protected setup(
    characteristicKey: CharacteristicKey, defaultValue: CharacteristicValue,
    getTopicKey: keyof C, onUpdateHandler: OnUpdateHandler, assertGetTopic: boolean,
    setTopicKey: keyof C | undefined = undefined, onSetHandler: CharacteristicSetHandler | undefined = undefined,
  ): Characteristic | undefined {

    if (!getTopicKey.toString().startsWith('topic')) {
      throw new Error(`Trying to fetch topic with unexpected property name '${getTopicKey.toString()}'`);
    }

    if (assertGetTopic) {
      this.assert(getTopicKey);
    }

    if (this.config[getTopicKey] === undefined) {
      for (const characteristic of this.accessoryService.characteristics) {
        if (characteristic.UUID === this.Characteristic[characteristicKey].UUID) {
          this.accessoryService.removeCharacteristic(characteristic);
          break;
        }
      }
      return;
    }

    const characteristic = this.accessoryService.getCharacteristic(this.Characteristic[characteristicKey]);
    this.properties.set(characteristicKey, defaultValue);

    characteristic.onGet( async (): Promise<Nullable<CharacteristicValue>> => {
      return this.properties.get(characteristicKey) ?? null;
    });

    this.topicHandlers.push({ topic: this.config[getTopicKey] as string, handler: onUpdateHandler });

    if (setTopicKey !== undefined) {

      if (!setTopicKey.toString().startsWith('topic')) {
        throw new Error(`Trying to fetch topic with unexpected property name '${setTopicKey.toString()}'`);
      }

      if (!onSetHandler) {
        throw new Error(`Missing onSetHandler for topic '${setTopicKey.toString()}'`);
      }

      characteristic.onSet(onSetHandler);
    }

    return characteristic;
  }


  protected get name(): string {
    return this.config.info.name;
  }

  protected getRawValue(property: keyof C, assert: boolean = true): string | undefined {

    if (!property.toString().startsWith('value')) {
      throw new Error(`Trying to fetch value with unexpected property name '${property.toString()}'`);
    }

    if (assert && !this.assert(property)) {
      return;
    }

    return this.config[property] as string | undefined;
  }

  protected getPrimitiveValue(property :keyof C, assert: boolean = true): PrimitiveTypes | undefined {
    const stringValue = this.getRawValue(property, assert);
    return stringValue ? toPrimitive(stringValue) : undefined;
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

  protected onUpdate(key: CharacteristicKey, value: CharacteristicValue, logString: string | undefined = undefined): boolean {

    if (value === this.properties.get(key)) {
      return false;
    }

    this.properties.set(key, value);

    this.accessoryService.updateCharacteristic(this.Characteristic[key], value);

    if (logString) {
      this.logIfDesired(logString);
    }

    return true;
  }

  protected onSet(key: CharacteristicKey, value: CharacteristicValue, publish: PrimitiveTypes, topic: keyof C, logString: string | undefined) {

    if (!this.assert(topic)) {
      return;
    }

    if (logString && value !== this.properties.get(key)) {
      this.logIfDesired(logString);
    }

    this.properties.set(key, value);

    this.accessoryService.updateCharacteristic(this.Characteristic[key], value);

    this.publish(this.config[topic] as string, publish);
  }

  protected logIfDesired(message: string, ...parameters: string[]): void;
  protected logIfDesired(level: LogType, message: string, ...parameters: string[]): void;
  protected logIfDesired(levelOrMessage: LogType | string, ...rest: string[]) {

    if (this.config.disableLogging) {
      return;
    }

    if (typeof levelOrMessage === 'string') {
      this.log.always(levelOrMessage, this.name, ...rest);
      return;
    }

    const [message, ...parameters] = rest;
    switch(levelOrMessage) {
    case LogType.WARNING:
      this.log.warning(message, this.name, ...parameters);
      break;
    case LogType.ERROR:
      this.log.error(message, this.name, ...parameters);
      break;
    default:
      this.log.always(message, this.name, ...parameters);
      break;
    }
  }
}