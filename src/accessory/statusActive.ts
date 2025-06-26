import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import { makeHandler, MQTTAccessory, TopicHandler } from './base.js';

import { strings } from '../i18n/i18n.js';

import { CharacteristicType, StatusActiveConfig, Primitive, ServiceType, toPrimitive } from '../model/types.js';

import { Log } from '../tools/log.js';

export abstract class StatusActiveAccessory extends MQTTAccessory {
  protected readonly accessoryService: Service;

  private statusActive: CharacteristicValue = true;

  constructor(
    Service: ServiceType,
    Characteristic: CharacteristicType,
    accessory: PlatformAccessory,
    private readonly statusActiveConfig: StatusActiveConfig,
    log: Log,
    className: string,
  ) {
    super(Service, Characteristic, accessory, statusActiveConfig, log, className);

    this.accessoryService = this.getAccessoryService();

    this.accessoryService.getCharacteristic(Characteristic.StatusActive)
      .onGet(this.getStatusActive.bind(this));
  }

  protected abstract getAccessoryService(): Service;

  protected get topicHandlers(): TopicHandler[] {
    return [
      ...(this.statusActiveConfig.topicGetStatusActive ? [makeHandler(this.statusActiveConfig.topicGetStatusActive, this.onStatusActiveUpdate.bind(this))]: []),
    ];
  }
  
  private async onStatusActiveUpdate(topic: string, value: Primitive): Promise<void> {

    if (!this.assert('valueStatusActive')) {
      return;
    }

    const statusActive = value === toPrimitive(this.statusActiveConfig.valueStatusActive);
    if (statusActive === this.statusActive) {
      return;
    }

    this.statusActive = statusActive;
    this.accessoryService.updateCharacteristic(this.Characteristic.StatusActive, this.statusActive);

    if (this.statusActive) {
      this.logIfDesired(strings.accessory.statusActive, this.config.info.name);
    } else {
      this.log.warning(strings.accessory.statusInactive, this.config.info.name);
    }
  }

  private async getStatusActive(): Promise<CharacteristicValue> {
    return this.statusActive;
  }
}
