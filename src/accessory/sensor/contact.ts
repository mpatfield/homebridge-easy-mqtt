import { PrimitiveTypes } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { EVE_EPOCH } from '../characteristic/eve.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, EveCharacteristicKey, HKCharacteristicKey } from '../../model/enums.js';
import { HistoryType } from '../../model/history.js';
import { ContactSensorConfig, MQTTAccessoryDependency } from '../../model/types.js';

type OnUpdateHandler = (topic: string, value: PrimitiveTypes) => (Promise<void>);

export class ContactSensorAccessory extends SensorAccessory<ContactSensorConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.ContactSensor;
  }

  private readonly CONTACT_DETECTED: number;
  private readonly CONTACT_NOT_DETECTED: number;

  constructor(
    dependency: MQTTAccessoryDependency<ContactSensorConfig>) {
    super(dependency);

    this.CONTACT_DETECTED = dependency.Characteristic.ContactSensorState.CONTACT_DETECTED;
    this.CONTACT_NOT_DETECTED = dependency.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;

    this.setup(HKCharacteristicKey.ContactSensorState, this.CONTACT_NOT_DETECTED,
      'topicGetContactSensorState', this.bindOnContactStateUpdate(strings.sensor.contact.active, strings.sensor.contact.inactive, (value) => {
        this.recordHistory(HistoryType.DOOR, { status: value }, true);

        if (value === this.CONTACT_NOT_DETECTED) {
          this.updateNumericValue(EveCharacteristicKey.TimesOpened, 1);
        }
      }), true);

    this.setupTopicless(EveCharacteristicKey.OpenDuration, 0);

    this.setupTopicless(EveCharacteristicKey.ClosedDuration, 0);

    this.setupTopicless(EveCharacteristicKey.TimesOpened, 0);

    this.setupTopicless(EveCharacteristicKey.ResetTotal, EVE_EPOCH, () => {
      this.onUpdate(EveCharacteristicKey.TimesOpened, 0, strings.sensor.contact.timesOpenedReset);
    });
  }

  private bindOnContactStateUpdate(logDetected: string, logNotDetected: string, callback?: (value: number) => void): OnUpdateHandler {
    return (async (_topic: string, value: PrimitiveTypes) => {

      const numeric = value === this.getPrimitiveValue('valueContactDetected') ? this.CONTACT_DETECTED : this.CONTACT_NOT_DETECTED;

      this.onUpdate(HKCharacteristicKey.ContactSensorState, numeric, numeric === this.CONTACT_DETECTED ? logDetected : logNotDetected);
      callback?.(numeric);

      if (numeric === this.CONTACT_DETECTED) {
        this.startTimeout(() => {
          this.onUpdate(HKCharacteristicKey.ContactSensorState, this.CONTACT_NOT_DETECTED, logNotDetected);
          callback?.(this.CONTACT_NOT_DETECTED);
        });
      }

    }).bind(this);
  }
}