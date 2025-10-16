import { CharacteristicValue, Service } from 'homebridge';

import { Addon } from './addon.js';

import { TopicHandler } from '../abstract/common.js';

import { strings } from '../../i18n/i18n.js';

import { AddonType, HKCharacteristicKey } from '../../model/enums.js';
import { FilterMaintenanceConfig, MQTTAccessoryConfig, ServiceType } from '../../model/types.js';

import { LogType } from '../../tools/log.js';
import { MQTTAccessory } from '../abstract/mqtt.js';

export class FilterMaintenance extends Addon<FilterMaintenanceConfig> {

  static topicHandlers(
    Service: ServiceType,
    parentAccessory: MQTTAccessory<MQTTAccessoryConfig>,
    config: FilterMaintenanceConfig,
  ): TopicHandler[] {
    const FilterMaintenanceService = Service[AddonType.FilterMaintenance];
    const filterMaintenance =
      Addon.new(parentAccessory, FilterMaintenanceService, config, ['topicGetFilterChangeIndication'], FilterMaintenance);
    return filterMaintenance?.topicHandlers ?? [];
  }

  public constructor(
    service: Service,
    parentAccessory: MQTTAccessory<MQTTAccessoryConfig>,
    config: FilterMaintenanceConfig,
  ) {
    super(parentAccessory, service, config);

    this.setup(HKCharacteristicKey.FilterChangeIndication, this.Characteristic.FilterChangeIndication.FILTER_OK,
      'topicGetFilterChangeIndication',
      this.bindOnUpdateBooleanSingle(HKCharacteristicKey.FilterChangeIndication,'valueFilterChange',
        strings.filter.change, strings.filter.ok, LogType.WARNING),
      false,
    );

    this.setup(HKCharacteristicKey.FilterLifeLevel, 100,
      'topicGetFilterLifeLevel', this.bindOnUpdateNumeric(HKCharacteristicKey.FilterLifeLevel, strings.filter.level), false);

    this.setupSet(HKCharacteristicKey.ResetFilterIndication, 'topicResetFilterIndication', this.onResetIndication.bind(this));
  }

  private async onResetIndication(value: CharacteristicValue) {

    if (!this.assert('valueFilterReset')) {
      return;
    }

    this.onSet(HKCharacteristicKey.ResetFilterIndication, value, this.config.valueFilterReset!, 'topicResetFilterIndication', strings.filter.reset);
    this.properties.set(HKCharacteristicKey.ResetFilterIndication, 0);
  }
}