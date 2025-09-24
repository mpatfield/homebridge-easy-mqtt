import { CharacteristicValue, PlatformAccessory, PrimitiveTypes, Service } from 'homebridge';

import { Addon } from './addon.js';

import { PublishHandler, TopicHandler } from '../abstract/common.js';

import { strings } from '../../i18n/i18n.js';

import { AddonType, CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, FilterMaintenanceConfig, ServiceType } from '../../model/types.js';

import { Log, LogType } from '../../tools/log.js';

export class FilterMaintenance extends Addon<FilterMaintenanceConfig> {

  static topicHandlers(
    Service: ServiceType, Characteristic: CharacteristicType, log: Log, disableLogging: boolean, accessory: PlatformAccessory,
    parentService: Service, config: FilterMaintenanceConfig, name: string, publishHandler: PublishHandler,
  ): TopicHandler[] {
    const filterMaintenance = Addon.new(Service, Characteristic, accessory, parentService, name, config, log, disableLogging, publishHandler,
      AddonType.FilterMaintenance, FilterMaintenance, ['topicGetFilterChangeIndication']);
    return filterMaintenance?.topicHandlers ?? [];
  }

  public constructor(
    service: Service, Characteristic: CharacteristicType, log: Log, disableLogging: boolean,
    config: FilterMaintenanceConfig, name: string, publishHandler: PublishHandler,
  ) {
    super(service, Characteristic, log, disableLogging, config, name, publishHandler);

    this.setupCharacteristic(CharacteristicKey.FilterChangeIndication, Characteristic.FilterChangeIndication.FILTER_OK,
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