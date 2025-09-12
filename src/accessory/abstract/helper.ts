import { PlatformAccessory } from 'homebridge';

import { BaseAccessory } from './base.js';

import { AccessoryType } from '../../model/enums.js';
import * as Configs from '../../model/types.js';

import { LockMechanismAccessory } from '../lock.js';
import { SecuritySystemAccessory } from '../security.js';
import { ThermostatAccessory } from '../thermostat.js';

import { LightbulbAccessory } from '../onoff/lightbulb.js';
import { OutletAccessory } from '../onoff/outlet.js';
import { SwitchAccessory } from '../onoff/switch.js';

import { CO2SensorAccessory } from '../sensor/carbonDioxide.js';
import { COSensorAccessory } from '../sensor/carbonMonoxide.js';
import { ContactSensorAccessory } from '../sensor/contact.js';
import { HumiditySensorAccessory } from '../sensor/humidity.js';
import { LeakSensorAccessory } from '../sensor/leak.js';
import { MotionSensorAccessory } from '../sensor/motion.js';
import { OccupancySensorAccessory } from '../sensor/occupancy.js';
import { SmokeSensorAccessory } from '../sensor/smoke.js';
import { TemperatureSensorAccessory } from '../sensor/temperature.js';

import { Log } from '../../tools/log.js';

export function createAccessory(
  Service: Configs.ServiceType,
  Characteristic: Configs.CharacteristicType,
  platformAccessory: PlatformAccessory,
  accessoryConfig: Configs.BaseAccessoryConfig,
  log: Log,
  isGrouped: boolean = false,
): BaseAccessory | undefined {

  switch(accessoryConfig.info.type) {
  case AccessoryType.CarbonDioxideSensor:
    return new CO2SensorAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.CO2SensorConfig, log, isGrouped);
  case AccessoryType.CarbonMonoxideSensor:
    return new COSensorAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.COSensorConfig, log, isGrouped);
  case AccessoryType.ContactSensor:
    return new ContactSensorAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.ContactSensorConfig, log, isGrouped);
  case AccessoryType.HumiditySensor:
    return new HumiditySensorAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.HumiditySensorConfig, log, isGrouped);
  case AccessoryType.LeakSensor:
    return new LeakSensorAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.LeakSensorConfig, log, isGrouped);
  case AccessoryType.Lightbulb:
    return new LightbulbAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.LightbulbConfig, log, isGrouped);
  case AccessoryType.LockMechanism:
    return new LockMechanismAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.LockConfig, log, isGrouped);
  case AccessoryType.MotionSensor:
    return new MotionSensorAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.MotionSensorConfig, log, isGrouped);
  case AccessoryType.OccupancySensor:
    return new OccupancySensorAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.OccupancySensorConfig, log, isGrouped);
  case AccessoryType.Outlet:
    return new OutletAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.OutletConfig, log, isGrouped);
  case AccessoryType.SecuritySystem:
    return new SecuritySystemAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.SecurityConfig, log, isGrouped);
  case AccessoryType.SmokeSensor:
    return new SmokeSensorAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.SmokeSensorConfig, log, isGrouped);
  case AccessoryType.Switch:
    return new SwitchAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.SwitchConfig, log, isGrouped);
  case AccessoryType.TemperatureSensor:
    return new TemperatureSensorAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.TemperatureSensorConfig, log, isGrouped);
  case AccessoryType.Thermostat:
    return new ThermostatAccessory(Service, Characteristic, platformAccessory, accessoryConfig as Configs.ThermostatConfig, log, isGrouped);
  }
}