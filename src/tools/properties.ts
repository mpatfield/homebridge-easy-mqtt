import { PrimitiveTypes } from 'homebridge';
import storage from 'node-persist';

import { PLATFORM_NAME } from '../homebridge/settings.js';

type Storable = PrimitiveTypes | PrimitiveTypes[] | { [key: string]: PrimitiveTypes };
const PROPERTIES = new Map<string, Map<string, Storable>>();

export class Properties {

  public static async initStorage(persistPath: string) {
    await storage.init({ dir: persistPath, forgiveParseErrors: true });

    await Properties.migrateDeprecatedProperties();

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

  public static async set(identifier: string, key: string, item: Storable | undefined) {

    const items = PROPERTIES.get(identifier) || new Map();

    if (item !== undefined) {
      items.set(key, item);
    } else {
      items.delete(key);
    }

    PROPERTIES.set(identifier, items);

    Properties.save();
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
    const storageArray = Array.from(PROPERTIES.entries()).map(([key, value]) => {
      return [key, Array.from(value.entries())];
    });

    const storageJson = JSON.stringify(storageArray);
    await storage.set(PLATFORM_NAME, storageJson);
  }

  private static async migrateDeprecatedProperties() {

    const keysJson = await storage.get('a6ac8cc1-5112-41c9-98b8-198601281ebb');
    if (keysJson === undefined) {
      return;
    }

    const keys = new Set<string>();
    try {
      const keysArray: string[] = JSON.parse(keysJson);
      keysArray.forEach(key => keys.add(key));
      await storage.removeItem('a6ac8cc1-5112-41c9-98b8-198601281ebb');
    } catch {
      // ignore
    }

    for (const key of keys) {

      try {

        const propertiesJson = await storage.get(key);
        if (propertiesJson === undefined) {
          continue;
        }

        const array = JSON.parse(propertiesJson);
        const properties = new Map<string, Storable>(array);

        PROPERTIES.set(key.replace(':Properties', ''), properties);

        await storage.removeItem(key);

      } catch {
        // ignore
      }
    }
  }
}