import mqtt from 'mqtt';

import { MQTTConfig, Primitive, toPrimitive } from './types.js';

import { strings } from '../i18n/i18n.js';

import { Log, LogType } from '../tools/log.js';
import { SECOND, MINUTE } from '../tools/time.js';

const DELAYS = [5 * SECOND, 10 * SECOND, 15 * SECOND, 30 * SECOND, MINUTE, 2 * MINUTE];
const IDLE_CONNECTION_TIMER_INTERVAL = 5 * MINUTE;

type MQTTMessageHandler = (topic: string, value: Primitive) => void;

class MQTTListener {

  topic: string;
  jsonPath: string[]; 

  constructor(
    topic: string,
    readonly handler: MQTTMessageHandler,
  ) {
    const index = topic.indexOf('$');
    if (index === -1) {
      this.topic = topic;
      this.jsonPath = [];
    } else {
      this.topic = topic.slice(0, index);
      this.jsonPath = topic.slice(index).replace(/^\$?\.?/, '').split('.');
    }
  }
}

interface MQTTError extends Error {
  code?: string | number;
}

export class MQTT {
  private client: mqtt.MqttClient | null = null;
  private shouldReconnect = false;
  private isReconnecting = false;
  private reconnectCount = 0;
  private idleMQTTTimer: NodeJS.Timeout | null = null;

  private listeners = new Map<string, MQTTListener>();

  constructor(
    private readonly log: Log,
    private readonly config: MQTTConfig,
    private readonly onConnect: ()=>(void),
    private readonly caller: string,
  ) {}

  teardown(): void {
    this.shouldReconnect = false;
    if (this.client) {
      this.client.end(true);
      this.client = null;
    }
  }

  public connect(): void {
    this.shouldReconnect = true;

    let additionalOptions = {};
    try {
      if (this.config.options) {
        additionalOptions = JSON.parse(this.config.options);
      }
    } catch (err) {
      this.log.error(`${strings.mqtt.badOptions}:\n"${this.config.options}"`, this.caller);
    }

    const options = {
      ...additionalOptions,
      reconnectPeriod: 0,
    };

    this.client = mqtt.connect(this.config.broker, options);

    this.client.on('connect', () => {
      this.log.ifVerbose(strings.mqtt.connected, this.caller);
      this.onConnect();
    });

    this.client.on('message', (topic, message) => this.messageReceived(topic, message.toString()));

    this.client.on('close', () => this.connectionClosed());

    this.client.on('error', (error: MQTTError) => {
      this.log.ifVerbose(LogType.WARNING, strings.mqtt.clientError,  this.caller, error);
    });
  }

  public subscribe(topic: string, handler: MQTTMessageHandler) {
    
    if (!this.client) {
      this.log.error(strings.mqtt.notConnected,  this.caller);
      return;
    }

    const mqttListener = new MQTTListener(topic, handler);

    this.client.subscribe(mqttListener.topic);

    this.listeners.set(mqttListener.topic, mqttListener);
  }

  publish(topic: string, value: Primitive): void {
    
    if (!this.client || !this.client.connected) {
      this.log.error(strings.mqtt.notConnected, this.caller);
      return;
    }

    this.client.publish(topic, value.toString());

    this.log.ifVerbose(strings.mqtt.publish, this.caller, value, topic);
  }

  private messageReceived(topic: string, message: string) {

    this.reconnectCount = 0;
    this.resetIdleMQTTTimer();

    try {

      this.log.ifVerbose(strings.mqtt.receivedMessage, this.caller, topic, message);

      const listener = this.listeners.get(topic);
      if (!listener) {
        this.log.ifVerbose(strings.mqtt.noListeners, this.caller, topic);
        return;
      }

      let value = JSON.parse(message);

      for (const pathPart of listener.jsonPath) {
        if (value && typeof value === 'object' && pathPart in value) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value = (value as any)[pathPart];
        } else {
          value = undefined;
          break;
        }
      }

      listener.handler(topic, toPrimitive(value));

    } catch (e) {
      this.log.error(strings.mqtt.parseFailed, this.caller, message);
    }
  }

  private connectionClosed() {
    this.log.ifVerbose(strings.mqtt.connectionClosed, this.caller);
    this.reconnect();
  }

  private resetIdleMQTTTimer() {

    if (this.idleMQTTTimer) {
      clearTimeout(this.idleMQTTTimer);
    }

    this.idleMQTTTimer = setTimeout(()=>{
      this.log.ifVerbose(strings.mqtt.idleConnection, this.caller);
      this.reconnect();
    }, IDLE_CONNECTION_TIMER_INTERVAL); 
  }

  private async reconnect() {

    if (!this.shouldReconnect || this.isReconnecting) {
      return;
    }

    this.isReconnecting = true;

    if (this.client) {
      this.client.end(true);
      this.client = null;
    }

    const reconnectDelay = DELAYS[Math.min(this.reconnectCount, DELAYS.length - 1)];
    if (reconnectDelay < MINUTE) {
      this.log.ifVerbose(strings.mqtt.reconnectInSeconds, this.caller, reconnectDelay / SECOND);
    } else {
      this.log.ifVerbose(strings.mqtt.reconnectInMinutes, this.caller, reconnectDelay / MINUTE);
    }

    setTimeout(() => {
      this.isReconnecting = false;
      this.connect();
    }, reconnectDelay);
  }
}
