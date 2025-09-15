import { PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, ContactSensorConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export class ContactSensorAccessory extends SensorAccessory<ContactSensorConfig> {

  constructor(
    Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: ContactSensorConfig, log: Log, isGrouped: boolean) {
    super(Service, Characteristic, accessory, config, log, isGrouped);

    this.setupCharacteristic(CharacteristicKey.ContactSensorState, Characteristic.ContactSensorState.CONTACT_NOT_DETECTED,
      'topicGetContactSensorState', this.onContactStateUpdate.bind(this), true);
  }

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.ContactSensor;
  }

  private async onContactStateUpdate(topic: string, value: PrimitiveTypes): Promise<void> {
    const numeric = value === this.getPrimitiveValue('valueContactDetected') ? 0 : 1;
    this.onUpdate(CharacteristicKey.ContactSensorState, numeric, numeric ? strings.sensor.contact.inactive : strings.sensor.contact.active);
  }
}