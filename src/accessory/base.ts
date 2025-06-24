import { PlatformAccessory } from 'homebridge';

import { PLATFORM_NAME } from '../homebridge/settings.js';

import { MQTT } from '../model/mqtt.js';
import { AccessoryConfig, Primitive } from '../model/types.js';

import { Log } from '../tools/log.js';
import getVersion from '../tools/version.js';
import { assert } from '../tools/validation.js';

export type TopicHandler = {topic: string, handler: ((topic: string, value: Primitive) => Promise<void>)};

export function makeHandler(topic: string, handler: (topic: string, value: Primitive) => Promise<void>): TopicHandler {
  return { topic, handler };
}

export abstract class MQTTAccessory {
    
  private readonly mqttClient: MQTT | undefined;

  constructor(
    protected readonly Service: typeof import('homebridge').Service,
    protected readonly Characteristic: typeof import('homebridge').Characteristic,
    accessory: PlatformAccessory,
    private readonly _config: AccessoryConfig,
    protected readonly log: Log,    
    caller: string,
  ) {
   
    if (this.assert('mqtt')) {
      this.mqttClient = new MQTT(log, _config.mqtt, this.onMQTTConnect.bind(this), _config.info.name);
      this.mqttClient.connect();
    }

    accessory.getService(Service.AccessoryInformation)!
      .setCharacteristic(Characteristic.Name, _config.info.name)
      .setCharacteristic(Characteristic.ConfiguredName, _config.info.name)
      .setCharacteristic(Characteristic.Manufacturer, _config.info.manufacturer ?? 'Homebridge')
      .setCharacteristic(Characteristic.SerialNumber, _config.info.serialNumber ?? `${PLATFORM_NAME}:${_config.info.name}`)
      .setCharacteristic(Characteristic.Model, _config.info.model ?? caller)
      .setCharacteristic(Characteristic.FirmwareRevision, _config.info.version ?? getVersion());
  }

  private async onMQTTConnect(): Promise<void> {
    this.topicHandlers.forEach( topicHandler => {
      this.mqttClient?.subscribe(topicHandler.topic, topicHandler.handler);
    });
  }

  protected abstract get topicHandlers(): TopicHandler[];

  protected publish(topic: string, value: Primitive) {
    this.mqttClient?.publish(topic, value);
  }

  public teardown() {
    this.mqttClient?.teardown();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected assert(...keys: (keyof any)[]): boolean {
    return assert(this.log, this._config.info.name, this._config, ...keys);
  }
}