import { PrimitiveTypes } from 'homebridge';
import storage from 'node-persist';

import { Mutex } from './mutex.js';

import { PLATFORM_NAME } from '../homebridge/settings.js';

type Storable = PrimitiveTypes | PrimitiveTypes[] | { [key: string]: PrimitiveTypes };
const PROPERTIES = new Map<string, Map<string, Storable>>();

const MUTEX = new Mutex();

export class Properties {

  public static async initStorage(persistPath: string) {
    await storage.init({ dir: persistPath, forgiveParseErrors: true });

    const storageJson = await storage.get(PLATFORM_NAME);
    if (storageJson === undefined) {
      Properties.save();
      return;
    }

    try {
      const storageArray = JSON.parse(storageJson) as [string, [string, Storable][]][];
      for (const [identifier, itemsArray] of storageArray) {
        const itemsMap = new Map<string, Storable>(itemsArray);
        PROPERTIES.set(identifier, itemsMap);
      }
    } catch {
    // ignore
    }
  }

  public static get(identifier: string, key: string): Storable | undefined {
    return PROPERTIES.get(identifier)?.get(key);
  }

  public static set(identifier: string, key: string, item: Storable | undefined): boolean {

    const items = PROPERTIES.get(identifier) || new Map();

    if (items.get(key) === item) {
      return false;
    }

    if (item !== undefined) {
      items.set(key, item);
    } else {
      items.delete(key);
    }

    PROPERTIES.set(identifier, items);

    Properties.save();

    return true;
  }

  public static asRecord<K extends string, V extends Storable>(identifier: string): Record<K, V> {
    return new Proxy(new Properties(), {
      get: (_target, key: K) => {
        return Properties.get(identifier, key);
      },
      set: (_target, key: K, value: V) => {
        Properties.set(identifier, key, value);
        return true;
      },
    }) as Record<K, V>;
  }

  private static async save() {
    await MUTEX.lock(async () => {
      await Properties._save();
    });
  }

  private static async _save() {
    const storageArray = Array.from(PROPERTIES.entries()).map(([key, value]) => {
      return [key, Array.from(value.entries())];
    });

    const storageJson = JSON.stringify(storageArray);
    await storage.set(PLATFORM_NAME, storageJson);
  }
}