import { CharacteristicValue, PrimitiveTypes } from 'homebridge';

import { SensorAccessory } from './sensor.js';

import { MQTTAccessoryDependency } from '../abstract/mqtt.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, CharacteristicKey } from '../../model/enums.js';
import { AirSensorConfig } from '../../model/types.js';

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

    this.setup(CharacteristicKey.AirQuality, dependency.Characteristic.AirQuality.UNKNOWN,
      'topicGetAirQuality', this.onAirQualityUpdate.bind(this), true,
    )?.setProps({ validValues: validStates.map((key) => this.STATE_MAP.get(key)!) });

    const densityMap = new Map<keyof AirSensorConfig, CharacteristicKey>([
      ['topicGetNitrogenDioxideDensity', CharacteristicKey.NitrogenDioxideDensity],
      ['topicGetOzoneDensity', CharacteristicKey.OzoneDensity],
      ['topicGetPM10Density', CharacteristicKey.PM10Density],
      ['topicGetPM2_5Density', CharacteristicKey.PM2_5Density],
      ['topicGetSulphurDioxideDensity', CharacteristicKey.SulphurDioxideDensity],
      ['topicGetVOCDensity', CharacteristicKey.VOCDensity],
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
    this.onUpdate(CharacteristicKey.AirQuality, current, this.qualityStringForCV(current));
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

  private logTemplateForDensityKey(key: CharacteristicKey): string {
    switch(key) {
    case CharacteristicKey.NitrogenDioxideDensity:
      return strings.sensor.air.densityNitrogen;
    case CharacteristicKey.OzoneDensity:
      return strings.sensor.air.densityOzone;
    case CharacteristicKey.PM10Density:
      return strings.sensor.air.densityPM10;
    case CharacteristicKey.PM2_5Density:
      return strings.sensor.air.densityPM2_5;
    case CharacteristicKey.SulphurDioxideDensity:
      return strings.sensor.air.densitySulphur;
    case CharacteristicKey.VOCDensity:
      return strings.sensor.air.densityVOC;
    }

    throw new Error(`Missing log template for density key '${key}'`);
  }
}