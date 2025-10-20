import { PrimitiveTypes } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { EVE_EPOCH } from '../characteristic/eve.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, EveCharacteristicKey, HKCharacteristicKey } from '../../model/enums.js';
import { HistoryType } from '../../model/history.js';
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

    this.setupTopicless(EveCharacteristicKey.OpenDuration, 0);

    this.setupTopicless(EveCharacteristicKey.ClosedDuration, 0);

    this.setupTopicless(EveCharacteristicKey.TimesOpened, 0);

    this.setupTopicless(EveCharacteristicKey.ResetTotal, EVE_EPOCH, () => {
      this.onUpdate(EveCharacteristicKey.TimesOpened, 0, strings.sensor.contact.timesOpenedReset);
    });
  }

  private async onContactStateUpdate(topic: string, value: PrimitiveTypes): Promise<void> {
    const numeric = value === this.getPrimitiveValue('valueContactDetected') ?
      this.Characteristic.ContactSensorState.CONTACT_DETECTED : this.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;
    this.onUpdate(HKCharacteristicKey.ContactSensorState, numeric, numeric ? strings.sensor.contact.inactive : strings.sensor.contact.active);

    this.recordHistory(HistoryType.DOOR, { status: numeric }, true);

    if (numeric === this.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED) {
      this.updateNumericValue(EveCharacteristicKey.TimesOpened, 1);
    }
  }
}