import { CharacteristicValue, PrimitiveTypes, Service } from 'homebridge';

import { Addon } from './addon.js';

import { TopicHandler } from '../abstract/common.js';

import { strings } from '../../i18n/i18n.js';

import { AddonType, CharacteristicKey } from '../../model/enums.js';
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

    this.setupCharacteristic(CharacteristicKey.FilterChangeIndication, this.Characteristic.FilterChangeIndication.FILTER_OK,
      'topicGetFilterChangeIndication', this.onChangeIndicationUpdate.bind(this));

    this.setupCharacteristic(CharacteristicKey.FilterLifeLevel, 100,
      'topicGetFilterLifeLevel', this.bindOnUpdateNumeric(CharacteristicKey.FilterLifeLevel, strings.filter.level));

    this.setupCharacteristicOnSet(CharacteristicKey.ResetFilterIndication, 'topicResetFilterIndication', this.onResetIndication.bind(this));
  }

  private async onChangeIndicationUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    const indication = value === this.getPrimitiveValue('valueFilterChange') ? 1 : 0;
    if (!this.onUpdate(CharacteristicKey.FilterChangeIndication, indication)) {
      return;
    }

    if (indication === this.Characteristic.FilterChangeIndication.FILTER_OK) {
      this.logIfDesired(strings.filter.ok);
    } else {
      this.logIfDesired(LogType.WARNING, strings.filter.change);
    }
  }

  private async onResetIndication(value: CharacteristicValue) {

    if (!this.assert('valueFilterReset')) {
      return;
    }

    this.onSet(CharacteristicKey.ResetFilterIndication, value, this.config.valueFilterReset, 'topicResetFilterIndication', strings.filter.reset);
    this.properties.set(CharacteristicKey.ResetFilterIndication, 0);
  }
}