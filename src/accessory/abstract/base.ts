import { CharacteristicValue, PlatformAccessory, PrimitiveTypes, Service } from 'homebridge';

import { PLATFORM_NAME } from '../../homebridge/settings.js';

import { CharacteristicKey } from '../../model/enums.js';
import { MQTT } from '../../model/mqtt.js';
import { AccessoryConfig, CharacteristicType, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';
import getVersion from '../../tools/version.js';
import { assert } from '../../tools/validation.js';
import { toPrimitive } from '../../tools/primitive.js';

type TopicHandler = {topic: string, handler: ((topic: string, value: PrimitiveTypes) => Promise<void>)};

export abstract class MQTTAccessory<C extends AccessoryConfig> {

  private readonly mqttClient: MQTT | undefined;

  private readonly properties: { [key: string]: CharacteristicValue } = {};

  private readonly topicHandlers: TopicHandler[] = [];

  protected readonly accessoryService: Service;

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

    this.accessoryService = this.getAccessoryService();

    this.addTopicHandlers();
  }

  private async onMQTTConnect(): Promise<void> {
    this.topicHandlers.forEach( topicHandler => {
      this.mqttClient?.subscribe(topicHandler.topic, topicHandler.handler);
    });
  }

  protected abstract getAccessoryService(): Service;

  protected abstract addTopicHandlers(): void;

  protected addTopicHandler(topicKey: keyof C, handler: (topic: string, value: PrimitiveTypes) => Promise<void>, assert: boolean = true) {

    if (!topicKey.toString().startsWith('topic')) {
      throw new Error(`Trying to fetch topic with unexpected property name '${topicKey.toString()}'`);
    }

    if (assert && !this.assert(topicKey)) {
      return;
    }

    const topic = this.config[topicKey];
    if (topic === undefined) {
      return;
    }

    this.topicHandlers.push({ topic: topic as string, handler });
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

  protected get(key: CharacteristicKey): CharacteristicValue {
    return this.properties[key];
  }

  protected set(key: CharacteristicKey, value: CharacteristicValue) {
    this.properties[key] = value;
  }

  protected assert(...keys: (keyof C)[]): boolean {
    return assert(this.log, this.name, this.config, ...keys);
  }

  protected onUpdate(key: CharacteristicKey, value: CharacteristicValue, logString: string | undefined = undefined): boolean {

    if (value === this.get(key)) {
      return false;
    }

    this.set(key, value);

    this.accessoryService.updateCharacteristic(this.Characteristic[key], value);

    if (logString) {
      this.logIfDesired(logString, value.toString());
    }

    return true;
  }

  protected onSet(key: CharacteristicKey, value: CharacteristicValue, topic: keyof C, logString: string) {

    if (!this.assert(topic)) {
      return;
    }

    if (value !== this.get(key)) {
      this.logIfDesired(logString, value.toString());
    }

    this.set(key, value);

    this.accessoryService.updateCharacteristic(this.Characteristic[key], value);

    this.publish(this.config[topic] as string, toPrimitive(value));
  }

  protected logIfDesired(message: string, ...parameters: string[]) {

    if (this.config.disableLogging) {
      return;
    }

    this.log.always(message, this.name, ...parameters);
  }
}