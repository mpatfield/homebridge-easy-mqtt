import { Log } from './log.js';

import { strings } from '../i18n/i18n.js';

export type Type = 'boolean' | 'number' | 'string' | 'object';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Assertable = {
}

export function assert<A extends Assertable>(log: Log, caller: string, assertable: A, ...keys: (keyof A)[]): boolean {
  let valid = true;
  for (const key of keys) {
    if (assertable[key] === undefined) {
      log.error(strings.accessory.missingRequired, caller, `'${String(key)}'`);
      valid = false;
    }
  }
  return valid;
}

export function assertType<A extends Assertable>(log: Log, caller: string, expectedType: Type, assertable: A, ...keys: (keyof A)[]): boolean {
  let valid = true;
  for (const key of keys) {
    const type = typeof assertable[key];
    if (type !== expectedType) {
      log.error(strings.accessory.badType, caller, `'${String(key)}'`, `'${expectedType}'`, `'${type}'`);
      valid = false;
    }
  }
  return valid;
}
