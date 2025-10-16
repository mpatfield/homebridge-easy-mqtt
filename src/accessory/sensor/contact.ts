import { PrimitiveTypes } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey } from '../../model/enums.js';
import { ContactSensorConfig, MQTTAccessoryDependency } from '../../model/types.js';

export class ContactSensorAccessory extends SensorAccessory<ContactSensorConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.ContactSensor;
  }

  constructor(
    dependency: MQTTAccessoryDependency<ContactSensorConfig>) {
    super(dependency);

    this.setup(HKCharacteristicKey.ContactSensorState, dependency.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED,
      'topicGetContactSensorState', this.onContactStateUpdate.bind(this), true);
  }

  private async onContactStateUpdate(topic: string, value: PrimitiveTypes): Promise<void> {
    const numeric = value === this.getPrimitiveValue('valueContactDetected') ? 0 : 1;
    this.onUpdate(HKCharacteristicKey.ContactSensorState, numeric, numeric ? strings.sensor.contact.inactive : strings.sensor.contact.active);
  }
}