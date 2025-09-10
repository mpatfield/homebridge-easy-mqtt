import { PlatformAccessory, PrimitiveTypes, Service } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, ContactSensorConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class ContactSensorAccessory extends SensorAccessory<ContactSensorConfig> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: ContactSensorConfig, log: Log) {
    super(Service, Characteristic, accessory, config, log);

    this.setupCharacteristic(CharacteristicKey.ContactSensorState, 0,
      'topicGetContactSensorState', this.onContactStateUpdate.bind(this), true);
  }

  protected getAccessoryService(): Service {
    return this.accessory.getService(this.Service.ContactSensor) || this.accessory.addService(this.Service.ContactSensor);
  }

  private async onContactStateUpdate(topic: string, value: PrimitiveTypes): Promise<void> {
    const numeric = value === this.getPrimitiveValue('valueContactDetected') ? 0 : 1;
    this.onUpdate(CharacteristicKey.ContactSensorState, numeric, numeric ? strings.sensor.contact.inactive : strings.sensor.contact.active);
  }
}