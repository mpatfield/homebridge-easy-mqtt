import { PrimitiveTypes } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { MQTTAccessoryDependency } from '../abstract/mqtt.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { ContactSensorConfig } from '../../model/types.js';

export class ContactSensorAccessory extends SensorAccessory<ContactSensorConfig> {

  constructor(
    dependency: MQTTAccessoryDependency<ContactSensorConfig>) {
    super(dependency);

    this.setup(CharacteristicKey.ContactSensorState, dependency.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED,
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