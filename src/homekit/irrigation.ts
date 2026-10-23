import { HomeKitAccessory } from './abstract/base.js';

import { ValveAccessory } from './valve.js';

import { strings } from '../i18n/i18n.js';

import { AccessoryType, ValveType } from '../model/enums.js';
import { HKCharacteristicKey, MQTTAccessoryDependency } from '../model/homekit.js';
import { IrrigationSystemConfig, IrrigationValveConfig, ValveConfig } from '../model/types.js';

import { assert } from '../tools/validation.js';

export class IrrigationSystemAccessory extends HomeKitAccessory<IrrigationSystemConfig> {

  private readonly valveAccessories: ValveAccessory[] = [];

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.IrrigationSystem;
  }

  constructor(dependency: MQTTAccessoryDependency<IrrigationSystemConfig>) {
    super(dependency);

    this.setupTopicless(HKCharacteristicKey.ProgramMode, dependency.Characteristic.ProgramMode.NO_PROGRAM_SCHEDULED);
    this.setupTopicless(HKCharacteristicKey.Active, dependency.Characteristic.Active.INACTIVE);
    this.setupTopicless(HKCharacteristicKey.InUse, dependency.Characteristic.InUse.NOT_IN_USE);

    if (!this.assert('valves', 'valueActive', 'valueInactive', 'valueInUse')) {
      return;
    }

    const valves = dependency.config.valves ?? [];

    valves?.forEach( (config: IrrigationValveConfig, index: number) => {

      if (config.name === undefined) {
        this.log.error(strings.irrigation.badValveConfig, this.name, '\'name\'');
        return;
      }

      if (!assert(dependency.log, config.name, config, 'topicGetValveInUse', 'topicGetValveActive', 'topicSetValveActive')) {
        return;
      }

      const valveConfig = {
        info: {
          ...(dependency.config.info),
          id: config.id ?? `${this.identifier}_${index + 1}`,
          name: config.name,
          type: AccessoryType.Valve,
        },
        mqtt: dependency.config.mqtt,
        disableLogging: dependency.config.disableLogging,
        valveType: dependency.config.valveType ?? ValveType.IRRIGATION,
        minimumDuration: dependency.config.minimumDuration,
        maximumDuration: dependency.config.maximumDuration,
        simulateDuration: dependency.config.simulateDuration,
        topicGetValveActive: config.topicGetValveActive,
        topicSetValveActive: config.topicSetValveActive,
        topicGetValveInUse: config.topicGetValveInUse,
        topicGetValveRemainingDuration: config.topicGetValveRemainingDuration,
        valueActive: dependency.config.valueActive,
        valueInactive: dependency.config.valueInactive,
        valueInUse: dependency.config.valueInUse,
      } as ValveConfig;

      const valveAccessory = new ValveAccessory( { ...dependency, config: valveConfig, isGrouped: true });
      valveAccessory.service.setCharacteristic(dependency.Characteristic.ServiceLabelIndex, index + 1);
      valveAccessory.service.setCharacteristic(dependency.Characteristic.IsConfigured, dependency.Characteristic.IsConfigured.CONFIGURED);
      this.service.addLinkedService(valveAccessory.service);

      this.valveAccessories.push(valveAccessory);

      valveAccessory.service.getCharacteristic(dependency.Characteristic.Active).on('change', () => this.updateState());
      valveAccessory.service.getCharacteristic(dependency.Characteristic.InUse).on('change', () => this.updateState());
    });

    const keepSubtypes = new Set(this.valveAccessories.map(accessory => accessory.service.subtype!));
    for (const service of [...dependency.platformAccessory.services]) {
      if (service.UUID === dependency.Service.Valve.UUID && service.subtype && !keepSubtypes.has(service.subtype)) {
        dependency.platformAccessory.removeService(service);
      }
    }

    this.updateState();
  }

  private updateState() {

    let active: boolean = false;
    let inUse: boolean = false;

    this.valveAccessories.forEach( valve => {
      active = active || valve.service.getCharacteristic(this.Characteristic.Active).value === this.Characteristic.Active.ACTIVE;
      inUse = inUse || valve.service.getCharacteristic(this.Characteristic.InUse).value === this.Characteristic.InUse.IN_USE;
    });

    this.onUpdate(HKCharacteristicKey.Active, active ? this.Characteristic.Active.ACTIVE : this.Characteristic.Active.INACTIVE);
    this.onUpdate(HKCharacteristicKey.InUse, inUse ? this.Characteristic.InUse.IN_USE : this.Characteristic.InUse.NOT_IN_USE);
  }
}
