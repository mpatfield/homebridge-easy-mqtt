import { HomeKitAccessory } from './base.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType } from '../../model/enums.js';
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
  dependency: Types.AccessoryDependency,
  config: Types.BaseAccessoryConfig,
  isGrouped: boolean = false,
): HomeKitAccessory | undefined {

  const mqttDependency: Types.MQTTAccessoryDependency<Types.BaseAccessoryConfig> =
  { ...dependency, config, isGrouped };

  switch(config.info.type) {
  case AccessoryType.AirPurifier:
    return new PurifierAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.PurifierConfig>);
  case AccessoryType.AirQualitySensor:
    return new AirSensorAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.AirSensorConfig>);
  case AccessoryType.CarbonDioxideSensor:
    return new CO2SensorAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.CO2SensorConfig>);
  case AccessoryType.CarbonMonoxideSensor:
    return new COSensorAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.COSensorConfig>);
  case AccessoryType.ContactSensor:
    return new ContactSensorAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.ContactSensorConfig>);
  case AccessoryType.Doorbell:
    return new DoorbellAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.DoorbellConfig>);
  case AccessoryType.Fanv2:
    return new FanV2Accessory(mqttDependency as Types.MQTTAccessoryDependency<Types.FanV2Config>);
  case AccessoryType.GarageDoorOpener:
    return new GarageDoorAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.GarageDoorConfig>);
  case AccessoryType.HeaterCooler:
    return new HeaterCoolerAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.HeaterCoolerConfig>);
  case AccessoryType.HumiditySensor:
    return new HumiditySensorAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.HumiditySensorConfig>);
  case AccessoryType.LeakSensor:
    return new LeakSensorAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.LeakSensorConfig>);
  case AccessoryType.Lightbulb:
    return new LightbulbAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.LightbulbConfig>);
  case AccessoryType.LightSensor:
    return new LightSensorAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.LightSensorConfig>);
  case AccessoryType.LockMechanism:
    return new LockMechanismAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.LockConfig>);
  case AccessoryType.MotionSensor:
    return new MotionSensorAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.MotionSensorConfig>);
  case AccessoryType.OccupancySensor:
    return new OccupancySensorAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.OccupancySensorConfig>);
  case AccessoryType.Outlet:
    return new OutletAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.OutletConfig>);
  case AccessoryType.SecuritySystem:
    return new SecuritySystemAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.SecurityConfig>);
  case AccessoryType.SmokeSensor:
    return new SmokeSensorAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.SmokeSensorConfig>);
  case AccessoryType.StatelessProgrammableSwitch:
    return new StatelessButtonAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.ButtonConfig>);
  case AccessoryType.Switch:
    return new SwitchAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.SwitchConfig>);
  case AccessoryType.TemperatureSensor:
    return new TemperatureSensorAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.TemperatureSensorConfig>);
  case AccessoryType.Thermostat:
    return new ThermostatAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.ThermostatConfig>);
  case AccessoryType.Valve:
    return new ValveAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.ValveConfig>);
  case AccessoryType.Window:
    return new WindowAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.PositionConfig>);
  case AccessoryType.WindowCovering:
    return new BlindAccessory(mqttDependency as Types.MQTTAccessoryDependency<Types.BlindConfig>);
  }

  dependency.log.error(strings.startup.unsupportedType, config.info.type);
}