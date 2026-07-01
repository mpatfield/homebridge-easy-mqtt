import { HomeKitAccessory } from './base.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType } from '../../model/enums.js';
import { HomeKitAccessoryDependency, MQTTAccessoryDependency } from '../../model/homekit.js';
import * as Types from '../../model/types.js';

import { GarageDoorAccessory } from '../garage.js';
import { LockMechanismAccessory } from '../lock.js';
import { SecuritySystemAccessory } from '../security.js';
import { ValveAccessory } from '../valve.js';

import { DoorbellAccessory } from '../button/doorbell.js';
import { StatelessButtonAccessory } from '../button/stateless.js';

import { FanV2Accessory } from '../climate/fan2.js';
import { HeaterCoolerAccessory } from '../climate/heaterCooler.js';
import { PurifierAccessory } from '../climate/purifier.js';
import { ThermostatAccessory } from '../climate/thermostat.js';

import { LightbulbAccessory } from '../onoff/lightbulb.js';
import { OutletAccessory } from '../onoff/outlet.js';
import { SwitchAccessory } from '../onoff/switch.js';

import { BlindAccessory } from '../position/blind.js';
import { WindowAccessory } from '../position/window.js';

import { AirSensorAccessory } from '../sensor/air.js';
import { CO2SensorAccessory } from '../sensor/carbonDioxide.js';
import { COSensorAccessory } from '../sensor/carbonMonoxide.js';
import { ContactSensorAccessory } from '../sensor/contact.js';
import { HumiditySensorAccessory } from '../sensor/humidity.js';
import { LeakSensorAccessory } from '../sensor/leak.js';
import { LightSensorAccessory } from '../sensor/light.js';
import { MotionSensorAccessory } from '../sensor/motion.js';
import { OccupancySensorAccessory } from '../sensor/occupancy.js';
import { SmokeSensorAccessory } from '../sensor/smoke.js';
import { TemperatureSensorAccessory } from '../sensor/temperature.js';

import { PLUGIN_NAME } from '../../homebridge/settings.js';

export function createIdentifier(info: Types.InfoConfig): string {
  return info.id ?? `${PLUGIN_NAME}:${info.type}:${info.name}`;
}

export function createHomeKitAccessory(
  dependency: HomeKitAccessoryDependency,
  config: Types.BaseAccessoryConfig,
  isGrouped: boolean = false,
): HomeKitAccessory | undefined {

  const mqttDependency: MQTTAccessoryDependency<Types.BaseAccessoryConfig> =
  { ...dependency, config, isGrouped };

  switch(config.info.type) {
  case AccessoryType.AirPurifier:
    return new PurifierAccessory(mqttDependency as MQTTAccessoryDependency<Types.PurifierConfig>);
  case AccessoryType.AirQualitySensor:
    return new AirSensorAccessory(mqttDependency as MQTTAccessoryDependency<Types.AirSensorConfig>);
  case AccessoryType.CarbonDioxideSensor:
    return new CO2SensorAccessory(mqttDependency as MQTTAccessoryDependency<Types.CO2SensorConfig>);
  case AccessoryType.CarbonMonoxideSensor:
    return new COSensorAccessory(mqttDependency as MQTTAccessoryDependency<Types.COSensorConfig>);
  case AccessoryType.ContactSensor:
    return new ContactSensorAccessory(mqttDependency as MQTTAccessoryDependency<Types.ContactSensorConfig>);
  case AccessoryType.Doorbell:
    return new DoorbellAccessory(mqttDependency as MQTTAccessoryDependency<Types.DoorbellConfig>);
  case AccessoryType.Fanv2:
    return new FanV2Accessory(mqttDependency as MQTTAccessoryDependency<Types.FanV2Config>);
  case AccessoryType.GarageDoorOpener:
    return new GarageDoorAccessory(mqttDependency as MQTTAccessoryDependency<Types.GarageDoorConfig>);
  case AccessoryType.HeaterCooler:
    return new HeaterCoolerAccessory(mqttDependency as MQTTAccessoryDependency<Types.HeaterCoolerConfig>);
  case AccessoryType.HumiditySensor:
    return new HumiditySensorAccessory(mqttDependency as MQTTAccessoryDependency<Types.HumiditySensorConfig>);
  case AccessoryType.LeakSensor:
    return new LeakSensorAccessory(mqttDependency as MQTTAccessoryDependency<Types.LeakSensorConfig>);
  case AccessoryType.Lightbulb:
    return new LightbulbAccessory(mqttDependency as MQTTAccessoryDependency<Types.LightbulbConfig>);
  case AccessoryType.LightSensor:
    return new LightSensorAccessory(mqttDependency as MQTTAccessoryDependency<Types.LightSensorConfig>);
  case AccessoryType.LockMechanism:
    return new LockMechanismAccessory(mqttDependency as MQTTAccessoryDependency<Types.LockConfig>);
  case AccessoryType.MotionSensor:
    return new MotionSensorAccessory(mqttDependency as MQTTAccessoryDependency<Types.MotionSensorConfig>);
  case AccessoryType.OccupancySensor:
    return new OccupancySensorAccessory(mqttDependency as MQTTAccessoryDependency<Types.OccupancySensorConfig>);
  case AccessoryType.Outlet:
    return new OutletAccessory(mqttDependency as MQTTAccessoryDependency<Types.OutletConfig>);
  case AccessoryType.SecuritySystem:
    return new SecuritySystemAccessory(mqttDependency as MQTTAccessoryDependency<Types.SecurityConfig>);
  case AccessoryType.SmokeSensor:
    return new SmokeSensorAccessory(mqttDependency as MQTTAccessoryDependency<Types.SmokeSensorConfig>);
  case AccessoryType.StatelessProgrammableSwitch:
    return new StatelessButtonAccessory(mqttDependency as MQTTAccessoryDependency<Types.ButtonConfig>);
  case AccessoryType.Switch:
    return new SwitchAccessory(mqttDependency as MQTTAccessoryDependency<Types.SwitchConfig>);
  case AccessoryType.TemperatureSensor:
    return new TemperatureSensorAccessory(mqttDependency as MQTTAccessoryDependency<Types.TemperatureSensorConfig>);
  case AccessoryType.Thermostat:
    return new ThermostatAccessory(mqttDependency as MQTTAccessoryDependency<Types.ThermostatConfig>);
  case AccessoryType.Valve:
    return new ValveAccessory(mqttDependency as MQTTAccessoryDependency<Types.ValveConfig>);
  case AccessoryType.Window:
    return new WindowAccessory(mqttDependency as MQTTAccessoryDependency<Types.PositionConfig>);
  case AccessoryType.WindowCovering:
    return new BlindAccessory(mqttDependency as MQTTAccessoryDependency<Types.BlindConfig>);
  }

  dependency.log.error(strings.startup.unsupportedType, config.info.type);
}