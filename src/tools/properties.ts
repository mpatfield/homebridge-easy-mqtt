import storage from 'node-persist';

function propertyStorageKey(id: string): string {
  return `${id}:Properties`;
}

const PRELOAD_KEYS_UUID = 'a6ac8cc1-5112-41c9-98b8-198601281ebb';
const PRELOAD_KEYS = new Set<string>;
const PRELOADED = new Map<string,Map<unknown, unknown>>();

function cacheKey(key: string) {

  if (PRELOAD_KEYS.has(key)) {
    return;
  }

  PRELOAD_KEYS.add(key);

  const keysArray = Array.from(PRELOAD_KEYS);
  const keysJson = JSON.stringify(keysArray);
  storage.set(PRELOAD_KEYS_UUID, keysJson);
}

export class Properties<K extends string, V> {

  public static async initStorage(persistPath: string) {
    await storage.init({ dir: persistPath, forgiveParseErrors: true });

    const keysJson = await storage.get(PRELOAD_KEYS_UUID);
    if (keysJson === undefined) {
      return;
    }

    try {
      const keysArray: string[] = JSON.parse(keysJson);
      keysArray.forEach(key => PRELOAD_KEYS.add(key));
    } catch {
      // ignore
    }

    for (const key of PRELOAD_KEYS) {

      try {

        const propertiesJson = await storage.get(key);
        if (propertiesJson === undefined) {
          continue;
        }

        const array = JSON.parse(propertiesJson);
        const properties = new Map(array);

        PRELOADED.set(key, properties);

      } catch {
        // ignore
      }
    }
  }

  private readonly properties = new Map<K, V>();

  constructor(private readonly identifier: string, private readonly useStorage: boolean) {

    if (!useStorage) {
      return;
    }

    const key = propertyStorageKey(identifier);
    this.properties = PRELOADED.get(key) as Map<K, V> ?? this.properties;
  }

  public get(key: K): V | undefined {
    return this.properties.get(key);
  }

  public set(key: K, value: V) {
    this.properties.set(key, value);

    if (!this.useStorage) {
      return;
    }

    const storageKey = propertyStorageKey(this.identifier);
    cacheKey(storageKey);

    const propertiesArray = Array.from(this.properties.entries());
    const propertiesJson = JSON.stringify(propertiesArray);

    storage.set(storageKey, propertiesJson);
  }
}