import { PrimitiveTypes } from 'homebridge';

import { createHash } from 'crypto';
import mqtt from 'mqtt';

import { MQTTConfig, MQTTMessage } from './types.js';

import { strings } from '../i18n/i18n.js';

import { Log, LogType } from '../tools/log.js';
import { toPrimitive } from '../tools/primitive.js';
import { SECOND, MINUTE } from '../tools/time.js';

const DELAYS = [5 * SECOND, 10 * SECOND, 30 * SECOND, 2 * MINUTE, 5 * MINUTE];

const DEFAULT_BROKER = 'mqtt://127.0.0.1/';

type MQTTMessageHandler = (topic: string, value: PrimitiveTypes) => void;

type Topic = { base: string, jsonPath: string[], transformer?: string };

function toTopicObject(rawTopic: string): Topic {

  let base = rawTopic;
  let jsonPath: string[] = [];
  let transformer: string | undefined;

  const pipeIndex = rawTopic.indexOf('|');
  const dollarIndex = rawTopic.indexOf('$.');

  if (pipeIndex !== -1) {
    transformer = rawTopic.slice(pipeIndex + 1).trim();
    base = rawTopic.slice(0, pipeIndex);
  }

  if (dollarIndex !== -1 && (pipeIndex === -1 || dollarIndex < pipeIndex)) {
    const jsonPathString = base.slice(dollarIndex + 2);
    jsonPath = jsonPathString.split('.').filter(p => p.length > 0);
    base = base.slice(0, dollarIndex);
  }

  const finalPipeIndex = base.indexOf('|');
  if (finalPipeIndex !== -1) {
    base = base.slice(0, finalPipeIndex);
  }

  return { base, jsonPath, transformer };
}

class MQTTListener {

  topic: Topic;

  constructor(
    rawTopic: string,
    readonly handler: MQTTMessageHandler,
  ) {
    this.topic = toTopicObject(rawTopic);
  }
}

interface MQTTError extends Error {
  code?: string | number;
}

type OnConnectCallback = ( (client: MQTT) => (void)) ;

export class MQTT {

  private static readonly INSTANCES = new Map<string, MQTT>();

  private readonly onConnectCallbacks: OnConnectCallback[] = [];
  private readonly onConnectMessages = new Map<string, MQTTMessage>();

  private client: mqtt.MqttClient | undefined = undefined;
  private shouldReconnect = false;
  private isReconnecting = false;
  private reconnectCount = 0;

  private readonly listeners = new Map<string, MQTTListener[]>();

  static connect(log: Log, config: MQTTConfig | undefined = undefined, caller: string, onConnect: OnConnectCallback): MQTT | undefined {

    let additionalOptions = {};

    const configOptions = config?.options ?? '{}';
    try {
      additionalOptions = JSON.parse(configOptions);
    } catch (err) {
      log.error(`${strings.mqttClient.badOptions}:\n"${configOptions}"`, caller);
      return;
    }

    const options = {
      reconnectPeriod: 0,
      username: config?.username ?? process.env.EASYMQTT_USERNAME,
      password: config?.password ?? process.env.EASYMQTT_PASSWORD,
      ...additionalOptions,
    };

    let seed: string = DEFAULT_BROKER;
    const broker = config?.broker ?? process.env.EASYMQTT_BROKER ?? DEFAULT_BROKER;
    try {
      const url = new URL(broker);
      url.port = url.port.length ? url.port : '1883';
      seed = `${url.protocol}//${url.host}|${JSON.stringify(options)}`;
    } catch (error) {
      seed = broker;
    }

    const id = createHash('md5').update(seed).digest('hex').slice(0, 4);

    let instance = MQTT.INSTANCES.get(id);
    if (instance !== undefined) {
      log.ifVerbose(strings.mqttClient.reuse, caller, id);

      if (instance.client?.connected) {
        onConnect(instance);
      }

    } else {
      log.ifVerbose(strings.mqttClient.new, caller, id);

      instance = new MQTT(log, broker, options);
      MQTT.INSTANCES.set(id, instance);

      instance.connect();
    }

    instance.onConnectCallbacks.push(onConnect);

    const onConnectMessages = config?.onConnect;
    if (onConnectMessages !== undefined) {

      const errorLog = '\n[ { "topic": "example/topic", "message": "example message" } ]';
      if (!Array.isArray(onConnectMessages)) {
        log.error(strings.mqttClient.badMessages, errorLog);
      } else {
        for (const message of onConnectMessages) {

          if (message.topic === undefined || message.message === undefined) {
            log.error(strings.mqttClient.badMessages, errorLog);
            continue;
          }

          const key = `${message.topic}|${message.message}`;
          instance?.onConnectMessages.set(key, message);
        }
      }
    }

    return instance;
  }

  private constructor(
    private readonly log: Log,
    private readonly broker: string,
    private readonly options: mqtt.IClientOptions & mqtt.IClientPublishOptions,
  ) {}

  private get host(): string {
    try {
      const url = new URL(this.broker);
      return url.host;
    } catch {
      return this.broker;
    }
  }

  private connect(): void {

    this.shouldReconnect = true;

    this.client = mqtt.connect(this.broker, this.options);

    this.client.on('connect', () => {
      this.log.ifVerbose(strings.mqttClient.connected, this.host);

      this.onConnectCallbacks.forEach( callback => {
        callback(this);
      });

      this.onConnectMessages.forEach( message => {
        this.publish(message.topic, message.message);
      });
    });

    this.client.on('message', (topic, message) => this.messageReceived(topic, message.toString()));

    this.client.on('close', () => this.connectionClosed());

    this.client.on('error', (error: MQTTError) => {
      this.log.ifVerbose(LogType.WARNING, `${strings.mqttClient.error}: ${error}`,  this.host);
    });
  }

  teardown(): void {
    this.shouldReconnect = false;
    this.client?.end(true);
    this.client = undefined;
  }

  public subscribe(topic: string, handler: MQTTMessageHandler) {

    if (!this.client || !this.client.connected) {
      this.log.error(strings.mqttClient.notConnected,  this.host);
      return;
    }

    const mqttListener = new MQTTListener(topic, handler);

    this.client.subscribe(mqttListener.topic.base);

    const topicListeners = this.listeners.get(mqttListener.topic.base) ?? [];
    topicListeners.push(mqttListener);
    this.listeners.set(mqttListener.topic.base, topicListeners);
  }

  publish(rawTopic: string, value: PrimitiveTypes): void {

    if (!this.client || !this.client.connected) {
      this.log.error(strings.mqttClient.notConnected, this.host);
      return;
    }

    const topic = toTopicObject(rawTopic);

    if (topic.transformer) {

      const transformedValue = this.executeTransformer(topic.transformer, value);
      if (transformedValue === undefined) {
        this.log.ifVerbose(strings.mqttClient.publishUndefined, this.host, topic.base);
        return;
      }

      value = transformedValue;
    }

    let message: string;
    if (topic.jsonPath.length) {

      let messageObject: Record<string, unknown> = {};

      const pathParts = Array.from(topic.jsonPath);
      do {
        const pathPart = pathParts.pop()!;
        if (pathParts.length === topic.jsonPath.length - 1) {
          messageObject[pathPart] = value;
        } else {
          messageObject = { [pathPart]: messageObject };
        }
      } while (pathParts.length > 0);

      message = JSON.stringify(messageObject);

    } else {
      message = value.toString();
    }

    this.client.publish(topic.base, message, this.options);

    this.log.ifVerbose( `${strings.mqttClient.publish} — ${topic.base} ${message}`, this.host);
  }

  private messageReceived(topic: string, message: string) {

    this.reconnectCount = 0;

    try {

      message = message.trim();

      this.log.ifVerbose(strings.mqttClient.receivedMessage, this.host, topic, `\n${message}`);

      const listeners = this.listeners.get(topic);
      if (!listeners || listeners.length === 0) {
        this.log.ifVerbose(strings.mqttClient.noListeners, this.host, topic);
        return;
      }

      for (const listener of listeners) {
        let value;
        if (message.startsWith('{')) {

          value = JSON.parse(message);

          for (const pathPart of listener.topic.jsonPath) {
            if (value && typeof value === 'object' && pathPart in value) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              value = (value as any)[pathPart];
            } else {
              value = undefined;
              break;
            }
          }

        } else {
          value = message;
        }

        value = toPrimitive(value);
        if (listener.topic.transformer) {
          value = this.executeTransformer(listener.topic.transformer, value);
        }

        if (value === undefined) {
          this.log.ifVerbose(strings.mqttClient.messageUndefined, this.host, topic);
        } else {
          listener.handler(topic, value);
        }
      }

    } catch (e) {
      this.log.error(strings.mqttClient.parseFailed, this.host, `\n${message}`);
    }
  }

  private connectionClosed() {
    this.log.ifVerbose(strings.mqttClient.connectionClosed, this.host);
    this.reconnect();
  }

  private async reconnect() {

    if (!this.shouldReconnect || this.isReconnecting) {
      return;
    }

    this.isReconnecting = true;

    if (this.client) {
      this.client.end(true);
      this.client = undefined;
    }

    const reconnectDelay = DELAYS[Math.min(this.reconnectCount, DELAYS.length - 1)];
    if (reconnectDelay < MINUTE) {
      this.log.ifVerbose(strings.mqttClient.reconnectSeconds, this.host, reconnectDelay / SECOND);
    } else {
      this.log.ifVerbose(strings.mqttClient.reconnectMinutes, this.host, reconnectDelay / MINUTE);
    }

    this.reconnectCount++;

    setTimeout(() => {
      this.isReconnecting = false;
      this.connect();
    }, reconnectDelay);
  }

  private readonly transformerStorage: Record<string, PrimitiveTypes> = {};
  private executeTransformer(transformer: string, value: PrimitiveTypes): PrimitiveTypes | undefined {
    try {
      if (!transformer.includes('return')) {
        transformer = `return ${transformer}`;
      }

      const transformerFunction = new Function('value', 'storage', transformer);
      const newValue = toPrimitive(transformerFunction(value, this.transformerStorage));

      if (value !== newValue) {
        this.log.ifVerbose(strings.mqttClient.transformedValue, value, newValue);
      }

      return newValue;

    } catch (error) {
      this.log.error(strings.mqttClient.transformFailed, `'${transformer}'`, `\n${error}`);
      return value;
    }
  }
}