import fakegato, { HistoryServiceProvider, HistoryService } from 'fakegato-history';
import { API, CharacteristicValue, Nullable, PlatformAccessory } from 'homebridge';

import { EveCharacteristicKey } from './enums.js';
import { HistoryConfig, MQTTAccessoryConfig } from './types.js';

import { MQTTAccessory } from '../accessory/abstract/mqtt.js';
import { EveCharacteristic } from '../accessory/characteristic/eve.js';

import { strings } from '../i18n/i18n.js';

import { Log } from '../tools/log.js';
import { SECOND } from '../tools/time.js';

export enum HistoryType {
  ENERGY = 'energy',
  WEATHER = 'weather',
  DOOR = 'door',
  MOTION = 'motion',
  SWITCH = 'switch',
}

export type HistoryEntry = {
  humidity?: number,
  power?: number,
  status?: number,
  temp?: number,
  time?: number,
}

type HistoryOptions = {
  disableRepeatLastData?: boolean,
  disableTimer?: boolean,
  filename?: string,
  path?: string,
  size?: number,
  storage?: 'fs',
}

type Accessory = MQTTAccessory<MQTTAccessoryConfig>;

let ServiceProvider: HistoryServiceProvider | undefined;

const HISTORY_UUID = 'bfc89fa1-78d8-4596-a2cc-cc8585ef0feb';

function HistoryService(type: HistoryType, accessory: PlatformAccessory, options?: HistoryOptions): HistoryService {

  if (!ServiceProvider) {
    throw new Error('HistoryServiceProvider not initialized');
  }

  return new ServiceProvider(type, accessory, options);
}

export class History {

  private readonly historyServices = new Map<string, HistoryService>();
  private readonly persistPath: string;

  constructor(private readonly api: API, private readonly log: Log) {

    if (ServiceProvider) {
      throw new Error('HistoryServiceProvider already initialized');
    }

    ServiceProvider = fakegato(api);
    this.persistPath = api.user.persistPath();
  }

  public record(accessory: Accessory, config: HistoryConfig | undefined, type: HistoryType, entry: HistoryEntry, updateLastActivation: boolean = false) {

    if (config === undefined || !config.enabled) {
      return;
    }

    const historyService = this.historyServices.get(accessory.identifier)
      ?? this.createHistoryService(config, accessory, type, updateLastActivation);

    const time = Math.floor(Date.now() / 1000);
    entry = {
      time: time,
      ...entry,
    };

    this.log.ifVerbose(strings.history.entry, accessory.name, JSON.stringify(entry));

    historyService.addEntry(entry);

    if (updateLastActivation && !isNaN(historyService.getInitialTime())) {
      const lastActivation = time - historyService.getInitialTime();
      accessory.properties.set(EveCharacteristicKey.LastActivation, lastActivation);
      accessory.service.updateCharacteristic(EveCharacteristic(EveCharacteristicKey.LastActivation), lastActivation);
    }
  }

  private createHistoryService(config: HistoryConfig, accessory: Accessory, type: HistoryType, addLastActivation: boolean): HistoryService {

    const options: HistoryOptions = {
      disableRepeatLastData: config.disableRepeatLastData ?? false,
      disableTimer: config.disableTimer ?? false,
      size: config.size ?? 4032,
      storage: 'fs',
      path: this.persistPath,
      filename: this.api.hap.uuid.generate(accessory.identifier + HISTORY_UUID),
    };

    const historyService = HistoryService(type, accessory.platformAccessory, options);
    this.historyServices.set(accessory.identifier, historyService);

    if (!addLastActivation) {
      return historyService;
    }

    setTimeout( () => {

      if (historyService.lastEntry === undefined || historyService.memorySize === undefined) {
        return;
      }

      const entry = historyService.history[ historyService.lastEntry % historyService.memorySize ];
      if (entry === undefined || entry.time === undefined) {
        return;
      }

      const lastActivation = entry.time - historyService.getInitialTime();
      accessory.properties.set(EveCharacteristicKey.LastActivation, lastActivation);

      accessory.service.addOptionalCharacteristic(EveCharacteristic(EveCharacteristicKey.LastActivation));

      const characteristic = accessory.service.getCharacteristic(EveCharacteristic(EveCharacteristicKey.LastActivation));
      characteristic.updateValue(lastActivation);

      characteristic.onGet(async (): Promise<Nullable<CharacteristicValue>> => {
        return accessory.properties.get(EveCharacteristicKey.LastActivation) ?? lastActivation;
      });

    }, 1 * SECOND);

    return historyService;
  }
}