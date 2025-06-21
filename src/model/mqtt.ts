import mqtt from 'mqtt';

// import { strings } from '../i18n/i18n.js';

import { Log } from '../tools/log.js';
import { SECOND, MINUTE } from '../tools/time.js';

const BROKER_URL = 'mqtt://192.168.0.5';

const KEEPALIVE = 90;

const DELAYS = [5 * SECOND, 15 * SECOND, MINUTE, 2 * MINUTE, 5 * MINUTE];
const IDLE_CONNECTION_TIMER_INTERVAL = 16 * MINUTE;

export class MQTT {
  private client: mqtt.MqttClient | null = null;
  private shouldReconnect = false;
  private isReconnecting = false;
  private reconnectCount = 0;
  private idleMQTTTimer: NodeJS.Timeout | null = null;

  private listeners = new Map<string, any>();

  constructor(
    public readonly log: Log,
  ) {}

  // TODO call this externally?
  teardown(): void {
    this.shouldReconnect = false;
    if (this.client) {
      this.client.end(true);
      this.client = null;
    }
  }

  public connect(callback: ()=>(void)): void {
    
    // const timeString = Date.now().toString().replace('.', '').slice(0, 13);
    // const clientId = `${this.email}${timeString}_android`;

    const options = {
      keepalive: KEEPALIVE,
      reconnectPeriod: 0,
    };

    this.client = mqtt.connect(BROKER_URL, options);

    this.client.on('connect', () => {
      this.log.always('connected'); // TODO strings.mqtt.connected);
      callback();
    });

    this.client.on('message', (topic, message) => this.messageReceived(topic, message.toString()));

    this.client.on('close', () => this.connectionClosed());

    //this.client.on('error', (error: Types.MQTTError) => this.log.ifVerbose(LogType.WARNING, strings.mqtt.clientError, error));
    this.client.on('error', (error: Error) => this.log.error(error.message)); // TODO
  }

  public subscribe(topic: string, listener: ((topic: string, data: any)=>(void))) {
    
    if (!this.client) {
      // TODO this.log.error(strings.mqtt.connectionError);
      return;
    }

    this.client.subscribe(topic);

    this.listeners.set(topic, listener);
  }

  publish(topic: string, data: any): void {
    
    if (!this.client || !this.client.connected) {
      // TODO this.log.error(strings.mqtt.notConnected);
      return;
    }

    const message = JSON.stringify(data);

    this.client.publish(topic, message);

    // TODO this.logDebug(this.publish.name, topic, data);
  }

  private messageReceived(topic: string, message: string) {

    this.reconnectCount = 0;
    this.resetIdleMQTTTimer();

    try {

      const data = JSON.parse(message);

      const listener = this.listeners.get(topic);
      if (listener) {
        listener(topic, data);
      }

    } catch (e) {
      // TODO this.log.warning(strings.mqtt.parseFailed, this.desensitize(message));
    }
  }

  private connectionClosed() {
    // TODO this.log.ifVerbose(strings.mqtt.connectionClosed);
    this.reconnect();
  }

  private resetIdleMQTTTimer() {

    if (this.idleMQTTTimer) {
      clearTimeout(this.idleMQTTTimer);
    }

    this.idleMQTTTimer = setTimeout(()=>{
      // TODO this.log.ifVerbose(strings.mqtt.idleConnection);
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
      //this.log.ifVerbose(strings.mqtt.reconnectInSeconds, reconnectDelay / SECOND);
    } else {
      //this.log.ifVerbose(strings.mqtt.reconnectInMinutes, reconnectDelay / MINUTE);
    }

    setTimeout(() => {
      this.isReconnecting = false;
      // TODO this.connect();
    }, reconnectDelay);
  }
}
