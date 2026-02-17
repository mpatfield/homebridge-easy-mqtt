import { BaseAccessory } from '../abstract/base.js';

import { EVE_EPOCH, EveCharacteristic } from '../characteristic/eve.js';

import { strings } from '../../i18n/i18n.js';

import { EveCharacteristicKey, HKCharacteristicKey } from '../../model/enums.js';
import { HistoryType } from '../../model/history.js';
import { MQTTAccessoryDependency, OnOffConfig } from '../../model/types.js';

import { HOUR, SECOND } from '../../tools/time.js';

type LastConsumption = { time: number, value: number};

export abstract class OnOffAccessory<C extends OnOffConfig = OnOffConfig> extends BaseAccessory<C> {

  private lastConsumption?: LastConsumption;

  constructor(dependency: MQTTAccessoryDependency<C>) {
    super(dependency);

    this.setup(HKCharacteristicKey.On, false,
      'topicGetOn',
      this.bindOnUpdateBoolean(HKCharacteristicKey.On, 'valueOn', 'valueOff', strings.onOff.stateOn, strings.onOff.stateOff, true, (value) => {
        this.recordHistory(HistoryType.CUSTOM, { status: value ? 1 : 0 }, true);
      }),
      true,
      'topicSetOn',
      this.bindOnSetBoolean(HKCharacteristicKey.On, 'topicSetOn', 'valueOn', 'valueOff', true,
        strings.onOff.stateOnFuture, strings.onOff.stateOffFuture, (value) => {
          this.recordHistory(HistoryType.CUSTOM, { status: value ? 1 : 0 }, true);
        },
      ),
    );

    this.setup(EveCharacteristicKey.ElectricCurrent, 0, 'topicGetElectricCurrent',
      this.bindOnUpdateNumeric(EveCharacteristicKey.ElectricCurrent, strings.outlet.electricCurrent), false);

    this.setup(EveCharacteristicKey.Voltage, 0, 'topicGetVoltage',
      this.bindOnUpdateNumeric(EveCharacteristicKey.Voltage, strings.outlet.voltage), false);

    this.setup(EveCharacteristicKey.CurrentConsumption, 0, 'topicGetCurrentConsumption',
      this.bindOnUpdateNumeric(EveCharacteristicKey.CurrentConsumption, strings.outlet.currentConsumption, (value) => {
        this.recordConsumption(value);
      }), false);


    if (this.setup(EveCharacteristicKey.TotalConsumption, 0, 'topicGetTotalConsumption',
      this.bindOnUpdateNumeric(EveCharacteristicKey.TotalConsumption, strings.outlet.totalConsumption), false) === undefined) {

      this.setupTopicless(EveCharacteristicKey.ResetTotal, (Date.now() / SECOND) - EVE_EPOCH, () => {
        this.onUpdate(EveCharacteristicKey.TotalConsumption, 0, strings.outlet.totalConsumptionReset);
      });
    }
  }

  private recordConsumption(value: number) {

    const didRecord = this.recordHistory(HistoryType.CUSTOM, { power: value });

    if (!didRecord || this.config.topicGetTotalConsumption !== undefined) {
      return;
    }

    if (this.lastConsumption === undefined) {
      this.service.addOptionalCharacteristic(EveCharacteristic(EveCharacteristicKey.TotalConsumption));
    } else {
      const delta = this.lastConsumption.value * ( Date.now() - this.lastConsumption.time ) / HOUR / 1000;
      this.updateNumericValue(EveCharacteristicKey.TotalConsumption, delta);
    }

    this.lastConsumption = { time: Date.now(), value: value };
  }
}
