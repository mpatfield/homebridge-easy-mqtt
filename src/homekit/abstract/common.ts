import {
  Characteristic, CharacteristicProps, CharacteristicSetHandler, CharacteristicValue,
  PartialAllowingNull, Perms, PrimitiveTypes, Service,
} from 'homebridge';

import { EveCharacteristic, isEveCharacteristic } from '../characteristic/eve.js';

import { strings } from '../../i18n/i18n.js';

import { TimeUnits } from '../../model/enums.js';
import { CharacteristicKey, CharacteristicType, HapStatusErrorType } from '../../model/homekit.js';
import { TemperatureConfig, TimeoutConfig } from '../../model/types.js';

import { debounce } from '../../tools/debounce.js';
import { Log, LogType } from '../../tools/log.js';
import { toNumber, toPrimitive } from '../../tools/primitive.js';
import { Properties } from '../../tools/properties.js';
import { temperatureUnits, toCelsius } from '../../tools/temperature.js';
import { HOUR, MINUTE, SECOND } from '../../tools/time.js';
import { assert, Assertable, assertType, Type } from '../../tools/validation.js';

type OnUpdateHandler = (topic: string, value: PrimitiveTypes) => (Promise<void>);
export type TopicHandler = {topic: string, handler: OnUpdateHandler};

export type PublishHandler = (topic: string, value: PrimitiveTypes) => void;

type NumberCallback = (value: number) => void;
type BooleanCallback = (value: boolean) => void

const AVAILABILITY_KEY = 'Available';
const HAP_COMMUNICATION_FAILURE = -70402;

export abstract class Common<C extends Assertable> {

  public readonly topicHandlers: TopicHandler[] = [];

  constructor(
    public readonly name: string,
  ) {}

  public teardown() {
    if (this.timeout !== undefined && this.timeoutCallback !== undefined) {
      this.log.warning(strings.autoReset.teardown, this.name);
      this.timeoutCallback();
      this.stopTimeout();
    }
  }

  protected abstract get service(): Service;
  protected abstract get Characteristic(): CharacteristicType;
  protected abstract get HapStatusError(): HapStatusErrorType;

  protected abstract get log(): Log;
  protected abstract get disableLogging(): boolean;

  protected abstract get config(): C;

  protected abstract get identifier(): string;
  protected abstract get useStoredProperties(): boolean;

  private timeout?: NodeJS.Timeout;
  private timeoutCallback?: () => (void);

  protected abstract publish(rawTopic: string, value: PrimitiveTypes): void;

  protected assert(...keys: (keyof C)[]): boolean {
    return assert(this.log, this.name, this.config, ...keys);
  }

  protected assertType(expectedType: Type, ...keys: (keyof C)[]): boolean {
    return assertType(this.log, this.name, expectedType, this.config, ...keys);
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

  protected isOptionalCharacteristic(key: CharacteristicKey): boolean {
    return isEveCharacteristic(key);
  }

  public getProperty(key: CharacteristicKey): CharacteristicValue | undefined {
    return Properties.get(this.identifier, key);
  }

  public setProperty(key: CharacteristicKey, value: CharacteristicValue, persist: boolean = false): boolean {
    return Properties.set(this.identifier, key, value, persist || this.useStoredProperties);
  }

  protected get isAvailable(): boolean {
    return Properties.get(this.identifier, AVAILABILITY_KEY) !== false;
  }

  protected set isAvailable(value: boolean) {

    if (!Properties.set(this.identifier, AVAILABILITY_KEY, value, this.useStoredProperties)) {
      return;
    }

    if (value) {
      this.logIfDesired(LogType.ALWAYS, strings.accessory.available);
    } else {
      this.logIfDesired(LogType.WARNING, strings.accessory.unavailable);
    }
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
        if (characteristic.UUID === this.characteristicFromKey(characteristicKey).UUID) {
          this.service.removeCharacteristic(characteristic);
          break;
        }
      }
      return;
    }

    if (this.isOptionalCharacteristic(characteristicKey)) {
      this.service.addOptionalCharacteristic(this.characteristicFromKey(characteristicKey));
    }

    const characteristic = this.service.getCharacteristic(this.characteristicFromKey(characteristicKey));

    const startingValue = !this.useStoredProperties ? defaultValue : (this.getProperty(characteristicKey) ?? defaultValue);
    characteristic.setValue(startingValue);

    this.setProperty(characteristicKey, startingValue);

    characteristic.onGet( async (): Promise<CharacteristicValue> => {
      if (!this.isAvailable) {
        throw new this.HapStatusError(HAP_COMMUNICATION_FAILURE);
      }
      return this.getProperty(characteristicKey) ?? startingValue;
    });

    const onUpdateHandlerWrapper: OnUpdateHandler = async (topic, value) => {
      this.isAvailable = true;
      await onUpdateHandler(topic, value);
    };

    this.topicHandlers.push({ topic: this.config[getTopicKey] as string, handler: onUpdateHandlerWrapper });

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

    if (this.isOptionalCharacteristic(characteristicKey)) {
      this.service.addOptionalCharacteristic(this.characteristicFromKey(characteristicKey));
    }

    const characteristic = this.service.getCharacteristic(this.characteristicFromKey(characteristicKey));
    characteristic.onSet(onSetHandler);
  }

  protected setupTopicless(characteristicKey: CharacteristicKey, defaultValue: CharacteristicValue,
    onSetCallback?: (value: CharacteristicValue, changed: boolean) => (void), props?: PartialAllowingNull<CharacteristicProps>): Characteristic | undefined {

    if (this.isOptionalCharacteristic(characteristicKey)) {
      this.service.addOptionalCharacteristic(this.characteristicFromKey(characteristicKey));
    }

    const characteristic = this.service.getCharacteristic(this.characteristicFromKey(characteristicKey));

    if (props !== undefined) {
      characteristic.setProps(props);
    }

    const startingValue = !this.useStoredProperties ? defaultValue : (this.getProperty(characteristicKey) ?? defaultValue);
    characteristic.setValue(startingValue);

    this.setProperty(characteristicKey, startingValue);

    characteristic.onGet( async (): Promise<CharacteristicValue> => {
      return this.getProperty(characteristicKey) ?? startingValue;
    });

    if (onSetCallback) {
      characteristic.onSet( async (value: CharacteristicValue) => {
        const changed = this.onUpdate(characteristicKey, value);
        onSetCallback(value, changed);
      });
    }

    return characteristic;
  }

  protected onUpdateNumeric(key: CharacteristicKey, value: PrimitiveTypes, logTemplate?: string, callback?: NumberCallback) {

    if (typeof value !== 'number') {
      this.log.error(strings.characteristic.badValue, this.name, key, `'${value.toString()}'`);
      return;
    }

    const characteristic = this.service.getCharacteristic(this.characteristicFromKey(key));
    const minValue = characteristic.props.minValue;
    const maxValue = characteristic.props.maxValue;
    if (minValue !== undefined && value < minValue) {
      this.logIfDesired(LogType.WARNING, strings.characteristic.outOfRange, key, `'${value.toString()}'`, `'${minValue.toString()}'`);
      value = minValue;
    } else if (maxValue !== undefined && value > maxValue) {
      this.logIfDesired(LogType.WARNING, strings.characteristic.outOfRange, key, `'${value.toString()}'`, `'${maxValue.toString()}'`);
      value = maxValue;
    }

    const logString = logTemplate !== undefined ? logTemplate.replace('%d', value.toString()) : undefined;
    this.onUpdate(key, value, logString);

    callback?.(value);
  }

  protected bindOnUpdateNumeric(key: CharacteristicKey, logTemplate: string, callback?: NumberCallback): OnUpdateHandler {
    return (async (_topic: string, value: PrimitiveTypes) => {
      this.onUpdateNumeric(key, value, logTemplate, callback);
    }).bind(this);
  }

  protected bindOnUpdateBoolean(key: CharacteristicKey, trueKey: keyof C, falseKey: keyof C,
    logTrue: string, logFalse: string, allowAutoReset: boolean = false, callback?: BooleanCallback): OnUpdateHandler {
    return (async (_topic: string, value: PrimitiveTypes) => {

      let bool: boolean;
      switch (value) {
      case this.getPrimitiveValue(trueKey):
        bool = true;
        break;
      case this.getPrimitiveValue(falseKey):
        bool = false;
        break;
      default:
        this.log.ifVerbose(strings.characteristic.unknownValue, this.name, `'${value}'`);
        return;
      }

      const logString = bool ? logTrue : logFalse;
      this.onUpdate(key, bool, logString);

      callback?.(bool);

      if (allowAutoReset && bool) {
        this.startTimeout(() => {

          const char = this.service.getCharacteristic(this.characteristicFromKey(key));
          if (char.props.perms.includes(Perms.PAIRED_WRITE)) {
            char.handleSetRequest(false);
          } else {
            this.onUpdate(key, false, logFalse);
          }

          callback?.(false);
        });
      }

    }).bind(this);
  }

  protected bindOnUpdateBooleanSingle(key: CharacteristicKey, valueKey: keyof C,
    trueLog: string, falseLog: string, trueLogType: LogType = LogType.ALWAYS, falseLogType: LogType = LogType.ALWAYS) {
    return (async (_topic: string, value: PrimitiveTypes) => {

      const bool = value === this.getPrimitiveValue(valueKey);
      if (!this.onUpdate(key, bool)) {
        return;
      }

      if (bool) {
        this.logIfDesired(trueLogType, trueLog);
      } else {
        this.logIfDesired(falseLogType, falseLog);
      }
    }).bind(this);
  }

  protected bindOnUpdateNumericBoolean(charKey: CharacteristicKey, valueKey: keyof C,
    logTrue: string, logFalse: string, allowAutoReset: boolean = false, callback?: NumberCallback): OnUpdateHandler {
    return (async (_topic: string, value: PrimitiveTypes) => {
      const numeric = value === this.getPrimitiveValue(valueKey) ? 1 : 0;
      this.onUpdate(charKey, numeric, numeric ? logTrue : logFalse);
      callback?.(numeric);

      if (allowAutoReset && numeric === 1) {
        this.startTimeout(() => {

          const char = this.service.getCharacteristic(this.characteristicFromKey(charKey));
          if (char.props.perms.includes(Perms.PAIRED_WRITE)) {
            char.handleSetRequest(0);
          } else {
            this.onUpdate(charKey, 0, logFalse);
          }

          callback?.(0);
        });
      }

    }).bind(this);
  }

  protected bindOnUpdateTemperature<C extends TemperatureConfig>(config: C, charKey: CharacteristicKey,
    logTemplate: string, callback?: NumberCallback ): OnUpdateHandler {
    return (async (_topic: string, value: PrimitiveTypes) => {

      if (typeof value !== 'number') {
        this.log.error(strings.climate.badTemperatureValue, this.name, `'${value}'`);
        return;
      }

      const units = temperatureUnits(config.temperatureUnits);
      const temperature = toCelsius(toNumber(value), units);

      const logString = logTemplate.replace('%d°%s', `${value}°${units}`);
      this.onUpdate(charKey, temperature, logString);
      callback?.(temperature);

    }).bind(this);
  }

  protected bindOnUpdateState(key: CharacteristicKey, states: Map<keyof C, CharacteristicValue>,
    strings: Map<CharacteristicValue, string>, unknownLog: string) {
    return (async (_topic: string, value: PrimitiveTypes) => {

      let characteristicValue: CharacteristicValue | undefined;
      for (const valueKey of states.keys()) {
        if (value === this.getPrimitiveValue(valueKey, false)) {
          characteristicValue = states.get(valueKey);
          break;
        }
      }

      if (characteristicValue === undefined) {
        this.log.ifVerbose(unknownLog, `'${value}'`);
        return;
      }

      this.onUpdate(key, characteristicValue, strings.get(characteristicValue));
    }).bind(this);
  }

  private onSetNumeric(key: CharacteristicKey, topic: keyof C, value: CharacteristicValue, logTemplate: string, shouldDebounce: boolean) {

    if (typeof value !== 'number') {
      this.log.error(strings.characteristic.badValue, this.name, key, `'${value}'`);
      return;
    }

    const task = () => {
      const logString = logTemplate.replace('%d', value.toString());
      this.onSet(key, value, value, topic, logString);
    };

    if (shouldDebounce) {
      debounce(`${this.identifier}_${key}`, task);
    } else {
      task();
    }
  }

  protected bindOnSetNumeric(key: CharacteristicKey, topic: keyof C, logTemplate: string, debounce: boolean = false) {
    return (async (value: CharacteristicValue) => {
      this.onSetNumeric(key, topic, value, logTemplate, debounce);
    }).bind(this);
  }

  protected bindOnSetPercentOrValue(key: CharacteristicKey, topic: keyof C, maximum: number | undefined,
    logPercent: string, logValue: string, debounce: boolean = false) {
    return (async (value: CharacteristicValue) => {
      const isPercent = maximum === undefined || maximum === 100;
      const logTemplate = isPercent ? logPercent : logValue;
      this.onSetNumeric(key, topic, value, logTemplate, debounce);
    }).bind(this);
  }

  protected onSetBoolean(
    key: CharacteristicKey, value: CharacteristicValue, setTopicKey: keyof C,
    trueValueKey: keyof C, falseValueKey: keyof C, trueValue: CharacteristicValue,
    trueLog: string, falseLog: string, callback?: BooleanCallback,
  ) {

    if (!this.assert(setTopicKey, trueValueKey, falseValueKey)) {
      return;
    }

    if (!setTopicKey.toString().startsWith('topic')) {
      throw new Error(`Trying to fetch topic with unexpected property name '${setTopicKey.toString()}'`);
    }

    if (!trueValueKey.toString().startsWith('value')) {
      throw new Error(`Trying to fetch value with unexpected property name '${trueValueKey.toString()}'`);
    }

    if (!falseValueKey.toString().startsWith('value')) {
      throw new Error(`Trying to fetch value with unexpected property name '${falseValueKey.toString()}'`);
    }

    const booleanValue = value === trueValue;
    const logString = booleanValue ? trueLog : falseLog;
    const publish = booleanValue ? this.getPrimitiveValue(trueValueKey)! : this.getPrimitiveValue(falseValueKey)!;
    this.onSet(key, value, publish, setTopicKey, logString);

    callback?.(booleanValue);
  }

  protected bindOnSetBoolean(
    key: CharacteristicKey, setTopicKey: keyof C,
    trueValueKey: keyof C, falseValueKey: keyof C, trueValue: CharacteristicValue,
    trueLog: string, falseLog: string, callback?: BooleanCallback,
  ) {
    return (async (value: CharacteristicValue) => {
      this.onSetBoolean(key, value, setTopicKey, trueValueKey, falseValueKey, trueValue, trueLog, falseLog, callback);
    }).bind(this);
  }

  protected bindOnSetState(key: CharacteristicKey, setTopicKey: keyof C, states: Map<keyof C, CharacteristicValue>,
    strings: Map<CharacteristicValue, string>, badValueLog: string) {
    return (async (value: CharacteristicValue) => {

      if (!this.assert(setTopicKey)) {
        return;
      }

      let publish: PrimitiveTypes | undefined;
      states.forEach( (test, key) => {
        if (value === test) {
          publish = this.getPrimitiveValue(key);
        }
      });

      if (publish === undefined) {
        this.log.error(badValueLog, this.name, `'${value}'`);
        return;
      }

      this.onSet(key, value, publish, setTopicKey, strings.get(value));

    }).bind(this);
  }

  protected onUpdate(key: CharacteristicKey, value: CharacteristicValue, logString: string | undefined = undefined): boolean {

    if (value === this.getProperty(key)) {
      return false;
    }

    this.setProperty(key, value);

    this.service.updateCharacteristic(this.characteristicFromKey(key), value);

    if (logString) {
      this.logIfDesired(logString);
    }

    return true;
  }

  protected onSet(key: CharacteristicKey, value: CharacteristicValue, publish: PrimitiveTypes, topic: keyof C, logString: string | undefined) {

    if (!this.assert(topic)) {
      return;
    }

    if (logString && value !== this.getProperty(key)) {
      this.logIfDesired(logString);
    }

    this.setProperty(key, value);

    this.service.updateCharacteristic(this.characteristicFromKey(key), value);

    this.publish(this.config[topic] as string, publish);
  }

  protected updateNumericValue(key: CharacteristicKey, delta: number) {
    const currentValue = this.getProperty(key) ?? 0;

    if (typeof currentValue !== 'number') {
      throw new Error(`Trying to increment '${key}' but it is not a number`);
    }

    const newValue = currentValue + delta;
    this.setProperty(key, newValue);

    this.service.updateCharacteristic(this.characteristicFromKey(key), newValue );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected characteristicFromKey(key: CharacteristicKey): any {

    if (isEveCharacteristic(key)) {
      return EveCharacteristic(key);
    }

    return this.Characteristic[key];
  }

  protected startTimeout(callback: () => void, config?: TimeoutConfig) {

    if (this.timeout !== undefined) {
      this.logIfDesired(strings.autoReset.reset);
    }

    this.stopTimeout();

    if (config === undefined) {

      if ( !('autoReset' in this.config) || this.config.autoReset === undefined) {
        return;
      }

      config = this.config.autoReset as TimeoutConfig;
    }

    if (!assert(this.log, this.name, config, 'time', 'units')) {
      return;
    }

    let delay: number = config.time;
    let string: string;

    switch(config.units) {
    case TimeUnits.MILLISECONDS:
      delay = config.time;
      string = strings.autoReset.startMilliseconds;
      break;
    case TimeUnits.SECONDS:
      delay = config.time * SECOND;
      string = strings.autoReset.startSeconds;
      break;
    case TimeUnits.MINUTES:
      delay = config.time * MINUTE;
      string = strings.autoReset.startMinutes;
      break;
    case TimeUnits.HOURS:
      delay = config.time * HOUR;
      string = strings.autoReset.startHours;
      break;
    }

    this.timeoutCallback = callback;
    this.timeout = setTimeout(() => {
      this.timeout = undefined;
      this.timeoutCallback = undefined;
      callback();
    }, delay);

    this.logIfDesired(string, config.time.toString());
  }

  protected stopTimeout() {
    clearTimeout(this.timeout);
    this.timeout = undefined;
    this.timeoutCallback = undefined;
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