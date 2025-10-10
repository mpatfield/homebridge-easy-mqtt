import { PlatformAccessory } from 'homebridge';

import { BaseAccessory } from './base.js';
import { MQTTAccessoryDependency } from './mqtt.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType } from '../../model/enums.js';
import * as Configs from '../../model/types.js';

import { GarageDoorAccessory } from '../garage.js';
import { LockMechanismAccessory } from '../lock.js';
import { SecuritySystemAccessory } from '../security.js';

import { FanV2Accessory } from '../climate/fan2.js';
import { HeaterCoolerAccessory } from '../climate/heaterCooler.js';
import { PurifierAccessory } from '../climate/purifier.js';
import { ThermostatAccessory } from '../climate/thermostat.js';

import { LightbulbAccessory } from '../onoff/lightbulb.js';
import { OutletAccessory } from '../onoff/outlet.js';
import { SwitchAccessory } from '../onoff/switch.js';

import { BlindAccessory } from '../position/blind.js';

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

import { ButtonAccessory } from '../button.js';
import { ValveAccessory } from '../valve.js';

import { PLUGIN_NAME } from '../../homebridge/settings.js';

import { Log } from '../../tools/log.js';

export function createIdentifier(info: Configs.InfoConfig): string {
  return info.id ?? `${PLUGIN_NAME}:${info.type}:${info.name}`;
}

export function createAccessory(
  Service: Configs.ServiceType,
  Characteristic: Configs.CharacteristicType,
  platformAccessory: PlatformAccessory,
  accessoryConfig: Configs.BaseAccessoryConfig,
  log: Log,
  isGrouped: boolean = false,
): BaseAccessory | undefined {

  const dependency = { Service, Characteristic, platformAccessory, config: accessoryConfig, log, isGrouped };

  switch(accessoryConfig.info.type) {
  case AccessoryType.AirPurifier:
    return new PurifierAccessory(dependency as MQTTAccessoryDependency<Configs.PurifierConfig>);
  case AccessoryType.AirQualitySensor:
    return new AirSensorAccessory(dependency as MQTTAccessoryDependency<Configs.AirSensorConfig>);
  case AccessoryType.WindowCovering:
    return new BlindAccessory(dependency as MQTTAccessoryDependency<Configs.BlindConfig>);
  case AccessoryType.CarbonDioxideSensor:
    return new CO2SensorAccessory(dependency as MQTTAccessoryDependency<Configs.CO2SensorConfig>);
  case AccessoryType.CarbonMonoxideSensor:
    return new COSensorAccessory(dependency as MQTTAccessoryDependency<Configs.COSensorConfig>);
  case AccessoryType.ContactSensor:
    return new ContactSensorAccessory(dependency as MQTTAccessoryDependency<Configs.ContactSensorConfig>);
  case AccessoryType.Fanv2:
    return new FanV2Accessory(dependency as MQTTAccessoryDependency<Configs.FanV2Config>);
  case AccessoryType.GarageDoorOpener:
    return new GarageDoorAccessory(dependency as MQTTAccessoryDependency<Configs.GarageDoorConfig>);
  case AccessoryType.HeaterCooler:
    return new HeaterCoolerAccessory(dependency as MQTTAccessoryDependency<Configs.HeaterCoolerConfig>);
  case AccessoryType.HumiditySensor:
    return new HumiditySensorAccessory(dependency as MQTTAccessoryDependency<Configs.HumiditySensorConfig>);
  case AccessoryType.LeakSensor:
    return new LeakSensorAccessory(dependency as MQTTAccessoryDependency<Configs.LeakSensorConfig>);
  case AccessoryType.Lightbulb:
    return new LightbulbAccessory(dependency as MQTTAccessoryDependency<Configs.LightbulbConfig>);
  case AccessoryType.LightSensor:
    return new LightSensorAccessory(dependency as MQTTAccessoryDependency<Configs.LightSensorConfig>);
  case AccessoryType.LockMechanism:
    return new LockMechanismAccessory(dependency as MQTTAccessoryDependency<Configs.LockConfig>);
  case AccessoryType.MotionSensor:
    return new MotionSensorAccessory(dependency as MQTTAccessoryDependency<Configs.MotionSensorConfig>);
  case AccessoryType.OccupancySensor:
    return new OccupancySensorAccessory(dependency as MQTTAccessoryDependency<Configs.OccupancySensorConfig>);
  case AccessoryType.Outlet:
    return new OutletAccessory(dependency as MQTTAccessoryDependency<Configs.OutletConfig>);
  case AccessoryType.SecuritySystem:
    return new SecuritySystemAccessory(dependency as MQTTAccessoryDependency<Configs.SecurityConfig>);
  case AccessoryType.SmokeSensor:
    return new SmokeSensorAccessory(dependency as MQTTAccessoryDependency<Configs.SmokeSensorConfig>);
  case AccessoryType.StatelessProgrammableSwitch:
    return new ButtonAccessory(dependency as MQTTAccessoryDependency<Configs.ButtonConfig>);
  case AccessoryType.Switch:
    return new SwitchAccessory(dependency as MQTTAccessoryDependency<Configs.SwitchConfig>);
  case AccessoryType.TemperatureSensor:
    return new TemperatureSensorAccessory(dependency as MQTTAccessoryDependency<Configs.TemperatureSensorConfig>);
  case AccessoryType.Thermostat:
    return new ThermostatAccessory(dependency as MQTTAccessoryDependency<Configs.ThermostatConfig>);
  case AccessoryType.Valve:
    return new ValveAccessory(dependency as MQTTAccessoryDependency<Configs.ValveConfig>);
  }

  log.error(strings.startup.unsupportedType, accessoryConfig.info.type);
}