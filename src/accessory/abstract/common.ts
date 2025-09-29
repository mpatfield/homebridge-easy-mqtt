import { Characteristic, CharacteristicSetHandler, CharacteristicValue, Nullable, PrimitiveTypes, Service } from 'homebridge';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, TemperatureConfig } from '../../model/types.js';

import { Log, LogType } from '../../tools/log.js';
import { toNumber, toPrimitive } from '../../tools/primitive.js';
import { Properties } from '../../tools/properties.js';
import { assert, Assertable } from '../../tools/validation.js';
import { temperatureUnits, toCelsius } from '../../tools/temperature.js';

type OnUpdateHandler = (topic: string, value: PrimitiveTypes) => (Promise<void>);
export type TopicHandler = {topic: string, handler: OnUpdateHandler};

export type PublishHandler = (topic: string, value: PrimitiveTypes) => void

export abstract class Common<C extends Assertable> {

  private _properties: Properties | undefined = undefined;

  public readonly topicHandlers: TopicHandler[] = [];

  constructor(
    public readonly name: string,
  ) {}

  protected abstract get service(): Service;
  protected abstract get Characteristic(): CharacteristicType;

  protected abstract get log(): Log;
  protected abstract get disableLogging(): boolean;

  protected abstract get config(): C;

  protected abstract get identifier(): string;
  protected abstract get useStoredProperties(): boolean;

  protected abstract publish(rawTopic: string, value: PrimitiveTypes): void;

  protected get properties(): Properties {

    if (this._properties === undefined) {
      this._properties = new Properties(this.identifier, this.useStoredProperties);
    }

    return this._properties;
  }

  protected assert(...keys: (keyof C)[]): boolean {
    return assert(this.log, this.name, this.config, ...keys);
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

  protected addTopicHandlers(topicHandlers: TopicHandler[]) {
    this.topicHandlers.push(...topicHandlers);
  }

  protected setup(
    characteristicKey: CharacteristicKey, defaultValue: CharacteristicValue,
    getTopicKey: keyof C, onUpdateHandler: OnUpdateHandler, assertGetTopic: boolean,
    setTopicKey: keyof C | undefined = undefined, onSetHandler: CharacteristicSetHandler | undefined = undefined,
  ): Characteristic | undefined {

    const characteristic = this.setupGet(characteristicKey, defaultValue, getTopicKey, onUpdateHandler, assertGetTopic);
    if (!characteristic) {
      return;
    }

    this.setupSet(characteristicKey, setTopicKey, onSetHandler);

    return characteristic;
  }

  private setupGet(characteristicKey: CharacteristicKey, defaultValue: CharacteristicValue,
    getTopicKey: keyof C, onUpdateHandler: OnUpdateHandler, assertTopic: boolean,
  ): Characteristic | undefined {

    if (!getTopicKey.toString().startsWith('topic')) {
      throw new Error(`Trying to fetch topic with unexpected property name '${getTopicKey.toString()}'`);
    }

    if (assertTopic) {
      this.assert(getTopicKey);
    }

    if (this.config[getTopicKey] === undefined) {
      for (const characteristic of this.service.characteristics) {
        if (characteristic.UUID === this.Characteristic[characteristicKey].UUID) {
          this.service.removeCharacteristic(characteristic);
          break;
        }
      }
      return;
    }

    const startingValue = (this.useStoredProperties && this.properties.get(characteristicKey)) ?? defaultValue;

    const characteristic = this.service.getCharacteristic(this.Characteristic[characteristicKey]);
    characteristic.setValue(startingValue);

    this.properties.set(characteristicKey, startingValue);

    characteristic.onGet( async (): Promise<Nullable<CharacteristicValue>> => {
      return this.properties.get(characteristicKey) ?? null;
    });

    this.topicHandlers.push({ topic: this.config[getTopicKey] as string, handler: onUpdateHandler });

    return characteristic;
  }

  protected setupSet(characteristicKey: CharacteristicKey,
    setTopicKey: keyof C | undefined = undefined, onSetHandler: CharacteristicSetHandler | undefined = undefined,
  ) {

    if (setTopicKey === undefined) {
      return;
    }

    if (!setTopicKey.toString().startsWith('topic')) {
      throw new Error(`Trying to fetch topic with unexpected property name '${setTopicKey.toString()}'`);
    }

    if (!onSetHandler) {
      throw new Error(`Missing onSetHandler for topic '${setTopicKey.toString()}'`);
    }

    const characteristic = this.service.getCharacteristic(this.Characteristic[characteristicKey]);
    characteristic.onSet(onSetHandler);
  }

  protected bindOnUpdateNumeric(key: CharacteristicKey, logTemplate: string): OnUpdateHandler {
    return (async (_topic: string, value: PrimitiveTypes) => {

      if (typeof value !== 'number') {
        this.log.error(strings.characteristic.badValue, this.name, key, `'${value.toString()}'`);
        return;
      }


      const characteristic = this.service.getCharacteristic(this.Characteristic[key]);
      const minValue = characteristic.props.minValue;
      const maxValue = characteristic.props.maxValue;
      if (minValue !== undefined && value < minValue) {
        this.logIfDesired(LogType.WARNING, strings.characteristic.outOfRange, key, `'${value.toString()}'`, `'${minValue.toString()}'`);
        value = minValue;
      } else if (maxValue !== undefined && value > maxValue) {
        this.logIfDesired(LogType.WARNING, strings.characteristic.outOfRange, key, `'${value.toString()}'`, `'${maxValue.toString()}'`);
        value = maxValue;
      }

      const logString = logTemplate.replace('%d', value.toString());
      this.onUpdate(key, value, logString);

    }).bind(this);
  }

  protected bindOnUpdateNumericBoolean(charKey: CharacteristicKey, valueKey: keyof C, logTrue: string, logFalse: string): OnUpdateHandler {
    return (async (_topic: string, value: PrimitiveTypes) => {
      const numeric = value === this.getPrimitiveValue(valueKey) ? 1 : 0;
      this.onUpdate(charKey, numeric, numeric ? logTrue : logFalse);
    }).bind(this);
  }

  protected bindTemperatureUpdate<C extends TemperatureConfig>(config: C, charKey: CharacteristicKey, logTemplate: string): OnUpdateHandler {
    return (async (_topic: string, value: PrimitiveTypes) => {

      if (typeof value !== 'number') {
        this.log.error(strings.climate.badTemperatureValue, this.name, `'${value}'`);
        return;
      }

      const units = temperatureUnits(config.temperatureUnits);
      const temperature = toCelsius(toNumber(value), units);

      const logString = logTemplate.replace('%d°%s', `${value}°${units}`);
      this.onUpdate(charKey, temperature, logString);

    }).bind(this);
  }

  protected onUpdate(key: CharacteristicKey, value: CharacteristicValue, logString: string | undefined = undefined): boolean {

    if (value === this.properties.get(key)) {
      return false;
    }

    this.properties.set(key, value);

    this.service.updateCharacteristic(this.Characteristic[key], value);

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

    this.service.updateCharacteristic(this.Characteristic[key], value);

    this.publish(this.config[topic] as string, publish);
  }

  protected logIfDesired(message: string, ...parameters: string[]): void;
  protected logIfDesired(level: LogType, message: string, ...parameters: string[]): void;
  protected logIfDesired(levelOrMessage: LogType | string, ...rest: string[]) {

    if (this.disableLogging) {
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