import { EndpointType, MatterAccessory, MatterAPI, MatterCommandHandler, PrimitiveTypes } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from '../../homebridge/settings.js';

import { strings } from '../../i18n/i18n.js';

import { TimeUnits } from '../../model/enums.js';
import { MATTER_SERIAL_MAX_LEN, MatterClusterKey, MatterClusterPath, MatterHandlerKey, MatterType, MatterValue, MatterValueKey } from '../../model/matter.js';
import { MQTT } from '../../model/mqtt.js';
import { BaseAccessoryConfig, OnUpdateHandler, TimeoutConfig, TopicHandler } from '../../model/types.js';

import { debounce } from '../../tools/debounce.js';
import { Log, LogType } from '../../tools/log.js';
import { toPrimitive } from '../../tools/primitive.js';
import { Properties } from '../../tools/properties.js';
import { HOUR, MINUTE, SECOND } from '../../tools/time.js';
import { assert } from '../../tools/validation.js';
import getVersion from '../../tools/version.js';

export type MatterAccessoryDependency<C extends BaseAccessoryConfig> = {
  matter: MatterAPI,
  config: C;
  log: Log;
};

export abstract class BaseMatterAccessory<C extends BaseAccessoryConfig = BaseAccessoryConfig> implements MatterAccessory {

  private _UUID?: string;

  public readonly displayName: string;

  public readonly manufacturer: string;
  public readonly model: string;
  public readonly serialNumber: string;
  public readonly softwareVersion: string;

  private readonly mqttClient?: MQTT;
  private readonly topicHandlers: TopicHandler[] = [];

  private autoResetTimeout?: NodeJS.Timeout;

  constructor(private readonly dependency: MatterAccessoryDependency<C>) {

    const info = dependency.config.info;

    this.displayName = info.name;

    this.manufacturer = info.manufacturer ?? PLATFORM_NAME;
    this.model = info.model ?? info.type;

    this.serialNumber = info.serialNumber ?? info.id ?? `${PLUGIN_NAME}:${this.deviceType}:${this.displayName}`;
    if (this.serialNumber.length > MATTER_SERIAL_MAX_LEN) {
      this.serialNumber = this.serialNumber.substring(0, MATTER_SERIAL_MAX_LEN - 1) + '…';
    }

    this.softwareVersion = info.version ?? getVersion();

    this.mqttClient = MQTT.connect(dependency.log, dependency.config.mqtt, this.UUID, this.displayName, (client: MQTT) => {
      this.topicHandlers.forEach( topicHandler => {
        client.subscribe(this.UUID, topicHandler.topic, topicHandler.handler);
      });
    });
  }

  protected abstract getMatterType(): MatterType;

  abstract get clusters(): MatterAccessory['clusters'] | undefined;
  abstract get handlers(): MatterAccessory['handlers'] | undefined;

  private getHandler(clusterKey: MatterClusterKey, handlerKey: MatterHandlerKey): MatterCommandHandler | undefined {

    if (this.handlers === undefined || this.handlers[clusterKey] === undefined || !(handlerKey in this.handlers[clusterKey])) {
      return;
    }

    return this.handlers[clusterKey][handlerKey] as MatterCommandHandler;
  }

  private get matter(): MatterAPI {
    return this.dependency.matter;
  }

  public get UUID(): string {
    if (!this._UUID) {
      this._UUID = this.matter.uuid.generate(this.serialNumber);
    }
    return this._UUID;
  }

  public get deviceType(): EndpointType {

    const type = this.getMatterType();
    if (type !== undefined) {
      return this.matter.deviceTypes[type];
    }

    throw new Error(`${this.getMatterType.name} has invalid matter type '${type}'`);
  }

  public get context(): Record<string, unknown> {
    return {
      UUID: this.UUID,
      deviceType: this.deviceType,
      displayName: this.displayName,
      serialNumber: this.serialNumber,
      manufacturer: this.manufacturer,
      model: this.model,
      softwareVersion: this.softwareVersion,
      clusters: this.clusters,
      handlers: this.handlers,
    };
  }

  public toMatterAccessory(): MatterAccessory {
    return {
      UUID: this.UUID,
      displayName: this.displayName,
      deviceType: this.deviceType,
      serialNumber: this.serialNumber,
      manufacturer: this.manufacturer,
      model: this.model,
      context: this.context,
      clusters: this.clusters,
      handlers: this.handlers,
    };
  }

  protected get config(): C {
    return this.dependency.config;
  }

  private get log(): Log {
    return this.dependency.log;
  }

  private get disableLogging(): boolean {
    return this.config.disableLogging;
  }

  private get useStoredProperties(): boolean {
    return this.config.resetOnRestart !== true;
  }

  protected getProperty(key: MatterValueKey): MatterValue | undefined {
    return Properties.get(this.UUID, key) as MatterValue;
  }

  private setProperty(key: MatterValueKey, value: MatterValue): boolean {
    return Properties.set(this.UUID, key, value, this.useStoredProperties);
  }

  private assert(...keys: (keyof C)[]): boolean {
    return assert(this.log, this.displayName, this.config, ...keys);
  }

  private assertValueKey(key: keyof C) {
    if (!key.toString().startsWith('value')) {
      throw new Error(`Invalid value key '${key.toString()}'`);
    }
  }

  private assertTopicKey(key: keyof C) {
    if (!key.toString().startsWith('topic')) {
      throw new Error(`Invalid topic key '${key.toString()}'`);
    }
  }

  private getRawValue(property: keyof C, assert: boolean = true): string | undefined {

    this.assertValueKey(property);

    if (assert && !this.assert(property)) {
      return;
    }

    return this.config[property] as string | undefined;
  }

  private getPrimitiveValue(property :keyof C, assert: boolean = true): PrimitiveTypes | undefined {
    const stringValue = this.getRawValue(property, assert);
    return stringValue ? toPrimitive(stringValue) : undefined;
  }

  private updateMatter(path: MatterClusterPath, value: MatterValue) {
    this.matter.updateAccessoryState(this.UUID, path.clusterKey, { [path.valueKey]: value });
  }

  private publish(topic: string, value: PrimitiveTypes) {
    this.mqttClient?.publish(this.UUID, topic, value);
  }

  public teardown() {
    this.mqttClient?.teardown();
  }

  protected setupGet(path: MatterClusterPath, defaultValue: MatterValue, getTopicKey: keyof C, getHandler: OnUpdateHandler) {
    this.assertTopicKey(getTopicKey);

    const startingValue = !this.useStoredProperties ? defaultValue : (this.getProperty(path.valueKey) ?? defaultValue);
    this.onUpdate(path, startingValue);

    this.topicHandlers.push({ topic: this.config[getTopicKey] as string, handler: getHandler });
  }

  private onUpdate(path: MatterClusterPath, value: MatterValue, logString: string | undefined = undefined): boolean {

    if (value === this.getProperty(path.valueKey)) {
      return false;
    }

    this.setProperty(path.valueKey, value);

    this.updateMatter(path, value);

    if (logString) {
      this.logIfDesired(logString);
    }

    return true;
  }

  protected bindOnUpdateBoolean(path: MatterClusterPath, trueKey: keyof C, falseKey: keyof C,
    logTrue: string, logFalse: string, autoResetHandlerKey?: MatterHandlerKey): OnUpdateHandler {
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
        this.log.ifVerbose(strings.characteristic.unknownValue, this.displayName, `'${value}'`);
        return;
      }

      const logString = bool ? logTrue : logFalse;
      this.onUpdate(path, bool, logString);

      if (bool && autoResetHandlerKey !== undefined) {
        this.startAutoResetTimeout(() => {
          this.getHandler(path.clusterKey, autoResetHandlerKey)?.(false);
        });
      }

    }).bind(this);
  }

  protected bindOnUpdateNumeric(path: MatterClusterPath, minValue: number, maxValue: number, logTemplate: string): OnUpdateHandler {
    return (async (_topic: string, value: PrimitiveTypes) => {

      if (typeof value !== 'number') {
        this.log.error(strings.characteristic.badValue, this.displayName, path.valueKey, `'${value.toString()}'`);
        return;
      }

      if (value < minValue) {
        this.logIfDesired(LogType.WARNING, strings.characteristic.outOfRange, path.valueKey, `'${value.toString()}'`, `'${minValue.toString()}'`);
        value = minValue;
      } else if (maxValue !== undefined && value > maxValue) {
        this.logIfDesired(LogType.WARNING, strings.characteristic.outOfRange, path.valueKey, `'${value.toString()}'`, `'${maxValue.toString()}'`);
        value = maxValue;
      }

      const logString = logTemplate !== undefined ? logTemplate.replace('%d', value.toString()) : undefined;
      this.onUpdate(path, value, logString);

    }).bind(this);
  }

  private onSet(path: MatterClusterPath, value: MatterValue, publish: PrimitiveTypes, topic: keyof C, logString: string | undefined) {

    if (!this.assert(topic)) {
      return;
    }

    if (logString && value !== this.getProperty(path.valueKey)) {
      this.logIfDesired(logString);
    }

    this.setProperty(path.valueKey, value);

    this.updateMatter(path, value);

    this.publish(this.config[topic] as string, publish);
  }

  protected onSetBoolean(
    path: MatterClusterPath, value: MatterValue, setTopicKey: keyof C,
    trueValueKey: keyof C, falseValueKey: keyof C, trueValue: MatterValue,
    trueLog: string, falseLog: string,
  ) {

    if (!this.assert(setTopicKey, trueValueKey, falseValueKey)) {
      return;
    }

    this.assertTopicKey(setTopicKey);

    [trueValueKey, falseValueKey].forEach( (key) => this.assertValueKey(key));

    const booleanValue = value === trueValue;
    const logString = booleanValue ? trueLog : falseLog;
    const publish = booleanValue ? this.getPrimitiveValue(trueValueKey)! : this.getPrimitiveValue(falseValueKey)!;
    this.onSet(path, value, publish, setTopicKey, logString);
  }

  protected onSetNumeric(path: MatterClusterPath, value: MatterValue, setTopicKey: keyof C, logTemplate: string, shouldDebounce: boolean) {

    const task = () => {
      const logString = logTemplate.replace('%d', value.toString());
      this.onSet(path, value, value, setTopicKey, logString);
    };

    if (shouldDebounce) {
      debounce(`${this.UUID}_${path.valueKey}`, task);
    } else {
      task();
    }
  }

  protected startAutoResetTimeout(callback: () => void, config?: TimeoutConfig) {

    if (this.autoResetTimeout !== undefined) {
      this.logIfDesired(strings.autoReset.reset);
    }

    this.stopTimeout();

    if (config === undefined) {

      if ( !('autoReset' in this.config) || this.config.autoReset === undefined) {
        return;
      }

      config = this.config.autoReset as TimeoutConfig;
    }

    if (!assert(this.log, this.displayName, config, 'time', 'units')) {
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

    this.autoResetTimeout = setTimeout(() => {
      this.autoResetTimeout = undefined;
      callback();
    }, delay);

    this.logIfDesired(string, config.time.toString());
  }

  private stopTimeout() {
    clearTimeout(this.autoResetTimeout);
    this.autoResetTimeout = undefined;
  }

  private logIfDesired(message: string, ...parameters: string[]): void;
  private logIfDesired(level: LogType, message: string, ...parameters: string[]): void;
  private logIfDesired(levelOrMessage: LogType | string, ...rest: string[]) {

    if (this.disableLogging) {
      return;
    }

    if (typeof levelOrMessage === 'string') {
      this.log.always(levelOrMessage, this.displayName, ...rest);
      return;
    }

    const [message, ...parameters] = rest;
    switch(levelOrMessage) {
    case LogType.WARNING:
      this.log.warning(message, this.displayName, ...parameters);
      break;
    case LogType.ERROR:
      this.log.error(message, this.displayName, ...parameters);
      break;
    default:
      this.log.always(message, this.displayName, ...parameters);
      break;
    }
  }
}
