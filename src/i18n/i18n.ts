import { readFileSync } from 'fs';
import merge from 'lodash.merge';

import da from './da.js';
import de from './de.js';
import en from './en.js';
import fr from './fr.js';
import it from './it.js';
import ro from './ro.js';
import vi from './vi.js';

export enum Language {
  DA = 'da',
  DE = 'de',
  EN = 'en',
  FR = 'fr',
  IT = 'it',
  RO = 'ro',
  VI = 'vi',
}

const Translations: Record<Language, unknown> = {
  [Language.DA]: da,
  [Language.DE]: de,
  [Language.EN]: en,
  [Language.FR]: fr,
  [Language.IT]: it,
  [Language.RO]: ro,
  [Language.VI]: vi,
};

let currentLanguage: Language = Language.EN;

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(configPath: string) {

  let isoLang: string | undefined;
  try {
    const systemConfig = readFileSync(configPath, { encoding: 'utf8' });
    isoLang = JSON.parse(systemConfig).platforms.filter( (c: Record<string, string>) => c.platform === 'config')[0].lang;
  } catch {
    // nothing
  }

  if (isoLang === undefined || isoLang.trim().length === 0 || isoLang === 'auto') {
    isoLang = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0];
  }

  let language = Language.EN;
  switch(isoLang) {
  case Language.DE:
    language = Language.DE;
    break;
  case Language.EN:
    language = Language.EN;
    break;
  case Language.FR:
    language = Language.FR;
    break;
  case Language.RO:
    language = Language.RO;
    break;
  case Language.VI:
    language = Language.VI;
    break;
  }

  currentLanguage = Translations[language] !== undefined ? language : Language.EN;
}

export type Translation = typeof en;

export function getStrings(language: Language): Translation {
  const overrides = Translations[language];
  return merge({}, en, overrides);
}

const translations = new Proxy({} as Translation, {
  get(_target, prop: keyof Translation) {
    const overrides = Translations[currentLanguage] as Record<string, unknown>;
    return overrides[prop] ?? en[prop];
  },
});

export { translations as strings };