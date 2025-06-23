import mqtt from 'mqtt';

import { MQTTConfig, Primitive } from './types.js';

import { strings } from '../i18n/i18n.js';

import { Log, LogType } from '../tools/log.js';
import { SECOND, MINUTE } from '../tools/time.js';

const KEEPALIVE = 90;

const DELAYS = [5 * SECOND, 10 * SECOND, 15 * SECOND, 30 * SECOND, MINUTE, 2 * MINUTE];
const IDLE_CONNECTION_TIMER_INTERVAL = 5 * MINUTE;

type MQTTListener = (topic: string, value: Primitive) => void;

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

    const options = {
      keepalive: KEEPALIVE,
      reconnectPeriod: 0,
    };

    this.client = mqtt.connect(this.config.broker, options);

    this.client.on('connect', () => {
      this.log.ifVerbose(strings.mqtt.connected, this.caller);
      this.onConnect();
    });

    this.client.on('message', (topic, message) => this.messageReceived(topic, message.toString()));

    this.client.on('close', () => this.connectionClosed());

    this.client.on('error', (error: MQTTError) => this.log.ifVerbose(LogType.WARNING, strings.mqtt.clientError,  this.caller, error));
  }

  public subscribe(topic: string, listener: MQTTListener) {
    
    if (!this.client) {
      this.log.error(strings.mqtt.notConnected,  this.caller);
      return;
    }

    this.client.subscribe(this.split(topic).topic);

    this.listeners.set(topic, listener);
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

      let value: unknown = JSON.parse(message);
      const jsonPath = this.split(topic).jsonPath;

      for (const pathPart in jsonPath) {
        if (value && typeof value === 'object' && pathPart in value) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value = (value as any)[pathPart];
        } else {
          value = undefined;
          break;
        }
      }

      const listener = this.listeners.get(topic);
      if (listener) {
        listener(topic, this.toPrimitive(value));
      }

      this.log.ifVerbose(strings.mqtt.receivedMessage, this.caller, topic, message);

    } catch (e) {
      this.log.warning(strings.mqtt.parseFailed, this.caller, message);
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
      this.connect();
    }, reconnectDelay);
  }

  private split(topic: string): { topic: string, jsonPath: string[] } {
    const index = topic.indexOf('$');
    if (index === -1) {
      return { topic: topic, jsonPath: [] };
    }
    return { topic: topic.slice(0, index),  jsonPath: topic.slice(index).replace(/^\$?\.?/, '').split('.') };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toPrimitive(value: any): Primitive {

    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    const num = Number(value);
    if (!isNaN(num) && value.trim() !== '') {
      return num;
    }

    return value.toString();
  }
}
