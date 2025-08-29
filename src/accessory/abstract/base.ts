import { CharacteristicValue, PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { MQTTAccessory } from './mqtt.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, BaseAccessoryConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export abstract class BaseAccessory<C extends BaseAccessoryConfig = BaseAccessoryConfig> extends MQTTAccessory<C> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: C, log: Log, className: string) {
    super(Service, Characteristic, accessory, config, log, className);

    this.set(CharacteristicKey.StatusActive, true);

    this.bind(Characteristic.StatusActive, 'topicGetStatusActive', this.getStatusActive.bind(this));
  }

  protected addTopicHandlers(): void {
    this.addTopicHandler('topicGetStatusActive', this.onStatusActiveUpdate.bind(this), false);
  }

  private async getStatusActive(): Promise<CharacteristicValue> {
    return this.get(CharacteristicKey.StatusActive);
  }

  private async onStatusActiveUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    const statusActive = value === this.getPrimitiveValue('valueStatusActive');
    if (!this.onUpdate(CharacteristicKey.StatusActive, statusActive)) {
      return;
    }

    if (statusActive) {
      this.logIfDesired(strings.accessory.statusActive);
    } else {
      this.log.warning(strings.accessory.statusInactive, this.name);
    }
  }
}
