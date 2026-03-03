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

const Translations = {
  [Language.DA]: da,
  [Language.DE]: de,
  [Language.EN]: en,
  [Language.FR]: fr,
  [Language.IT]: it,
  [Language.RO]: ro,
  [Language.VI]: vi,
};

let currentLanguage = Language.EN;

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(configPath: string) {

  let isoLang: string | undefined;
  try {
    const systemConfig = readFileSync(configPath, { encoding: 'utf8' });
    isoLang = JSON.parse(systemConfig).platforms.filter( (c: Record<string, unknown>) => c.platform === 'config')[0].lang;
  } catch {
    // nothing
  }

  if (isoLang === undefined || isoLang.trim().length === 0 || isoLang === 'auto') {
    isoLang = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0];
  }

  currentLanguage = isoLang in Translations ? isoLang as Language : Language.EN;
}

type Translation = typeof en;

export function getTranslation(language: Language): Record<string, string | object> {
  return Translations[language] ?? {};
}

export function getStrings(language: Language): Translation {
  return merge({}, en, getTranslation(language));
}

const translations = new Proxy({} as Translation, {
  get(_target, prop: keyof Translation) {
    return getTranslation(currentLanguage)[prop] ?? en[prop];
  },
});

export { translations as strings };