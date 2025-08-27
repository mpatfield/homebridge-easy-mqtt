import { CharacteristicValue, PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { makeHandler, MQTTAccessory, TopicHandler } from './base.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicType, StatusActiveConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';
import { toPrimitive } from '../../tools/primitive.js';

export abstract class StatusActiveAccessory<C extends StatusActiveConfig = StatusActiveConfig> extends MQTTAccessory<C> {

  private statusActive: CharacteristicValue = true;

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: C, log: Log, className: string) {
    super(Service, Characteristic, accessory, config, log, className);

    this.accessoryService.getCharacteristic(Characteristic.StatusActive)
      .onGet(this.getStatusActive.bind(this));
  }

  protected get topicHandlers(): TopicHandler[] {
    return [
      ...(this.config.topicGetStatusActive ? [makeHandler(this.config.topicGetStatusActive, this.onStatusActiveUpdate.bind(this))]: []),
    ];
  }

  private async onStatusActiveUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    if (!this.assert('valueStatusActive')) {
      return;
    }

    const statusActive = value === toPrimitive(this.config.valueStatusActive);
    if (statusActive === this.statusActive) {
      return;
    }

    this.statusActive = statusActive;
    this.accessoryService.updateCharacteristic(this.Characteristic.StatusActive, this.statusActive);

    if (this.statusActive) {
      this.logIfDesired(strings.accessory.statusActive);
    } else {
      this.log.warning(strings.accessory.statusInactive, this.name);
    }
  }

  private async getStatusActive(): Promise<CharacteristicValue> {
    return this.statusActive;
  }
}
