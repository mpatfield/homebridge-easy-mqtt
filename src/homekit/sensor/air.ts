import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey } from '../../model/enums.js';
import { AirSensorConfig, MQTTAccessoryDependency } from '../../model/types.js';

const MAX_DENSITY = 5000;

export class AirSensorAccessory extends SensorAccessory<AirSensorConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.AirQualitySensor;
  }

  constructor(dependency: MQTTAccessoryDependency<AirSensorConfig>) {
    super(dependency);

    const stateMap = new Map<keyof AirSensorConfig, number>([
      ['valueAQUnknown', dependency.Characteristic.AirQuality.UNKNOWN],
      ['valueAQExcellent', dependency.Characteristic.AirQuality.EXCELLENT],
      ['valueAQGood', dependency.Characteristic.AirQuality.GOOD],
      ['valueAQFair', dependency.Characteristic.AirQuality.FAIR],
      ['valueAQInferior', dependency.Characteristic.AirQuality.INFERIOR],
      ['valueAQPoor', dependency.Characteristic.AirQuality.POOR],
    ]);

    const stateStrings = new Map([
      [dependency.Characteristic.AirQuality.EXCELLENT, strings.sensor.air.qualityExcellent],
      [dependency.Characteristic.AirQuality.GOOD, strings.sensor.air.qualityGood],
      [dependency.Characteristic.AirQuality.FAIR, strings.sensor.air.qualityFair],
      [dependency.Characteristic.AirQuality.INFERIOR, strings.sensor.air.qualityInferior],
      [dependency.Characteristic.AirQuality.POOR, strings.sensor.air.qualityPoor],
      [dependency.Characteristic.AirQuality.UNKNOWN, strings.sensor.air.qualityUnknown],
    ]);

    const validStates = Array.from(stateMap.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validStates.length === 0 || (validStates.length === 1 && validStates[0] === 'valueAQUnknown')) {
      this.log.error(strings.sensor.air.noStateValues, this.name);
      return;
    }

    this.setup(HKCharacteristicKey.AirQuality, dependency.Characteristic.AirQuality.UNKNOWN,
      'topicGetAirQuality',
      this.bindOnUpdateState(HKCharacteristicKey.AirQuality, stateMap, stateStrings, strings.sensor.air.unknownValue),
      true,
    )?.setProps({ validValues: validStates.map((key) => stateMap.get(key)!) });

    const densityMap = new Map<keyof AirSensorConfig, HKCharacteristicKey>([
      ['topicGetNitrogenDioxideDensity', HKCharacteristicKey.NitrogenDioxideDensity],
      ['topicGetOzoneDensity', HKCharacteristicKey.OzoneDensity],
      ['topicGetPM10Density', HKCharacteristicKey.PM10Density],
      ['topicGetPM2_5Density', HKCharacteristicKey.PM2_5Density],
      ['topicGetSulphurDioxideDensity', HKCharacteristicKey.SulphurDioxideDensity],
      ['topicGetVOCDensity', HKCharacteristicKey.VOCDensity],
    ]);

    densityMap.forEach( (key, topic) => {
      this.setup(key, 0, topic, this.bindOnUpdateNumeric(key, this.logTemplateForDensityKey(key)), false)
        ?.setProps({ maxValue: MAX_DENSITY });
    });
  }

  private logTemplateForDensityKey(key: HKCharacteristicKey): string {
    switch(key) {
    case HKCharacteristicKey.NitrogenDioxideDensity:
      return strings.sensor.air.densityNitrogen;
    case HKCharacteristicKey.OzoneDensity:
      return strings.sensor.air.densityOzone;
    case HKCharacteristicKey.PM10Density:
      return strings.sensor.air.densityPM10;
    case HKCharacteristicKey.PM2_5Density:
      return strings.sensor.air.densityPM2_5;
    case HKCharacteristicKey.SulphurDioxideDensity:
      return strings.sensor.air.densitySulphur;
    case HKCharacteristicKey.VOCDensity:
      return strings.sensor.air.densityVOC;
    }

    throw new Error(`Missing log template for density key '${key}'`);
  }
}