import { CharacteristicValue, PrimitiveTypes } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, HKCharacteristicKey } from '../../model/enums.js';
import { AirSensorConfig, MQTTAccessoryDependency } from '../../model/types.js';

const MAX_DENSITY = 5000;

export class AirSensorAccessory extends SensorAccessory<AirSensorConfig> {

  private readonly STATE_MAP: Map<keyof AirSensorConfig, number>;

  constructor(dependency: MQTTAccessoryDependency<AirSensorConfig>) {
    super(dependency);

    this.STATE_MAP = new Map([
      ['valueAQUnknown', dependency.Characteristic.AirQuality.UNKNOWN],
      ['valueAQExcellent', dependency.Characteristic.AirQuality.EXCELLENT],
      ['valueAQGood', dependency.Characteristic.AirQuality.GOOD],
      ['valueAQFair', dependency.Characteristic.AirQuality.FAIR],
      ['valueAQInferior', dependency.Characteristic.AirQuality.INFERIOR],
      ['valueAQPoor', dependency.Characteristic.AirQuality.POOR],
    ]);

    const validStates = Array.from(this.STATE_MAP.keys()).filter((key) => this.getRawValue(key, false) !== undefined);
    if (validStates.length === 0 || (validStates.length === 1 && validStates[0] === 'valueAQUnknown')) {
      this.log.error(strings.sensor.air.noStateValues, this.name);
      return;
    }

    this.setup(HKCharacteristicKey.AirQuality, dependency.Characteristic.AirQuality.UNKNOWN,
      'topicGetAirQuality', this.onAirQualityUpdate.bind(this), true,
    )?.setProps({ validValues: validStates.map((key) => this.STATE_MAP.get(key)!) });

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

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.AirQualitySensor;
  }

  private async onAirQualityUpdate(topic: string, value: PrimitiveTypes): Promise<void> {
    const current = this.toCVState(value);
    this.onUpdate(HKCharacteristicKey.AirQuality, current, this.qualityStringForCV(current));
  }

  private toCVState(value: PrimitiveTypes): CharacteristicValue {
    switch (value) {
    case this.getPrimitiveValue('valueAQUnknown', false):
      return this.STATE_MAP.get('valueAQUnknown')!;
    case this.getPrimitiveValue('valueAQExcellent', false):
      return this.STATE_MAP.get('valueAQExcellent')!;
    case this.getPrimitiveValue('valueAQGood', false):
      return this.STATE_MAP.get('valueAQGood')!;
    case this.getPrimitiveValue('valueAQFair', false):
      return this.STATE_MAP.get('valueAQFair')!;
    case this.getPrimitiveValue('valueAQInferior', false):
      return this.STATE_MAP.get('valueAQInferior')!;
    case this.getPrimitiveValue('valueAQPoor', false):
      return this.STATE_MAP.get('valueAQPoor')!;
    }

    this.logIfDesired(strings.sensor.air.unknownValue, `'${value}'`);
    return this.STATE_MAP.get('valueAQUnknown')!;
  }

  private qualityStringForCV(state: CharacteristicValue): string {
    switch(state) {
    case this.Characteristic.AirQuality.EXCELLENT:
      return strings.sensor.air.qualityExcellent;
    case this.Characteristic.AirQuality.GOOD:
      return strings.sensor.air.qualityGood;
    case this.Characteristic.AirQuality.FAIR:
      return strings.sensor.air.qualityFair;
    case this.Characteristic.AirQuality.INFERIOR:
      return strings.sensor.air.qualityInferior;
    case this.Characteristic.AirQuality.POOR:
      return strings.sensor.air.qualityPoor;
    case this.Characteristic.AirQuality.UNKNOWN:
    default:
      return strings.sensor.air.qualityUnknown;
    }
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