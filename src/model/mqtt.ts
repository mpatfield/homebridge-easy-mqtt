import { PrimitiveTypes } from 'homebridge';

import mqtt from 'mqtt';

import { MQTTConfig } from './types.js';

import { strings } from '../i18n/i18n.js';

import { Log, LogType } from '../tools/log.js';
import { toPrimitive } from '../tools/primitive.js';
import { SECOND, MINUTE } from '../tools/time.js';
import { assert } from '../tools/validation.js';

const DELAYS = [5 * SECOND, 10 * SECOND, 30 * SECOND, 2 * MINUTE, 5 * MINUTE];

type MQTTMessageHandler = (topic: string, value: PrimitiveTypes) => void;

type Topic = { base: string, jsonPath: string[] };

function toTopicObject(rawTopic: string): Topic {

  let base: string;
  let jsonPath: string[];

  const index = rawTopic.indexOf('$');
  if (index === -1) {
    base = rawTopic;
    jsonPath = [];
  } else {
    base = rawTopic.slice(0, index);
    jsonPath = rawTopic.slice(index).replace(/^\$?\.?/, '').split('.');
  }

  return { base: base, jsonPath: jsonPath };
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

export class MQTT {
  private client: mqtt.MqttClient | undefined = undefined;
  private shouldReconnect = false;
  private isReconnecting = false;
  private reconnectCount = 0;

  private listeners = new Map<string, MQTTListener[]>();

  constructor(
    private readonly log: Log,
    private readonly config: MQTTConfig,
    private readonly onConnect: ()=>(void),
    private readonly caller: string,
  ) {}

  private get host(): string {
    try {
      const url = new URL(this.config.broker);
      return url.hostname;
    } catch {
      return this.config.broker;
    }
  }

  teardown(): void {
    this.shouldReconnect = false;
    if (this.client) {
      this.client.end(true);
      this.client = undefined;
    }
  }

  public connect(): void {

    if (!assert(this.log, this.caller, this.config, 'broker')) {
      return;
    }

    this.shouldReconnect = true;

    let additionalOptions = {};
    try {
      if (this.config.options) {
        additionalOptions = JSON.parse(this.config.options);
      }
    } catch (err) {
      this.log.error(`${strings.mqttClient.badOptions}:\n"${this.config.options}"`, this.caller);
    }

    const options = {
      reconnectPeriod: 0,
      username: this.config.username,
      password: this.config.password,
      ...additionalOptions,
    };

    this.client = mqtt.connect(this.config.broker, options);

    this.client.on('connect', () => {
      this.log.ifVerbose(strings.mqttClient.connected, this.host);
      this.onConnect();
    });

    this.client.on('message', (topic, message) => this.messageReceived(topic, message.toString()));

    this.client.on('close', () => this.connectionClosed());

    this.client.on('error', (error: MQTTError) => {
      this.log.ifVerbose(LogType.WARNING, `${strings.mqttClient.error}: ${error}`,  this.host);
    });
  }

  public subscribe(topic: string, handler: MQTTMessageHandler) {

    if (!this.client) {
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

    this.client.publish(topic.base, message);

    this.log.ifVerbose( `${strings.mqttClient.publish} — ${topic}  ${value}`, this.host);
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

        listener.handler(topic, toPrimitive(value));
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
}
