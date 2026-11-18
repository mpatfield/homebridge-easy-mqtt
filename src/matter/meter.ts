import { BaseMatterAccessory, MatterAccessoryDependency } from './abstract/base.js';

import { strings } from '../i18n/i18n.js';

import { MatterClusterKey, MatterClusterPath, MatterType, MatterValueKey } from '../model/matter.js';
import { ElectricalMeterConfig } from '../model/types.js';

export class MatterElectricalMeterAccessory<C extends ElectricalMeterConfig = ElectricalMeterConfig> extends BaseMatterAccessory<C> {

  constructor(dependency: MatterAccessoryDependency<C>) {
    super(dependency);

    const currentPath = MatterClusterPath(MatterClusterKey.electricalPowerMeasurement, MatterValueKey.activeCurrent);
    this.setupGet(
      currentPath, 0,
      'topicGetCurrent', false, this.bindOnUpdateNumeric(currentPath, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, strings.meter.current),
    );

    const powerPath = MatterClusterPath(MatterClusterKey.electricalPowerMeasurement, MatterValueKey.activePower);
    this.setupGet(
      powerPath, 0,
      'topicGetPower', false, this.bindOnUpdateNumeric(powerPath, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, strings.meter.power),
    );

    const voltagePath = MatterClusterPath(MatterClusterKey.electricalPowerMeasurement, MatterValueKey.voltage);
    this.setupGet(
      voltagePath, 0,
      'topicGetVoltage', false, this.bindOnUpdateNumeric(voltagePath, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, strings.meter.voltage),
    );
  }

  override getMatterType(): MatterType {
    return MatterType.ElectricalMeter;
  }

  override get clusters() {
    return {
      electricalEnergyMeasurement: {
      },
      electricalPowerMeasurement: {
        activeCurrent: this.hasValue('topicGetCurrent') ? this.getProperty(MatterValueKey.activeCurrent) as number : undefined,
        activePower: this.hasValue('topicGetPower') ? this.getProperty(MatterValueKey.activePower) as number : undefined,
        voltage: this.hasValue('topicGetVoltage') ? this.getProperty(MatterValueKey.voltage) as number : undefined,
      },
    };
  }

  override get handlers() {
    return {};
  }
}