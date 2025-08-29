import { Log } from './log.js';

import { strings } from '../i18n/i18n.js';

import { Assertable } from '../model/types.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assert(log: Log, caller: string, assertable: Assertable, ...keys: (keyof any)[]): boolean {
  let valid = true;
  for (const key of keys) {
    if ((assertable as Record<string, unknown>)[key as string] === undefined) {
      log.error(strings.accessory.missingRequired, caller, `'${String(key)}'`);
      valid = false;
    }
  }
  return valid;
}
