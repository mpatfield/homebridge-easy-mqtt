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

const Translations: Record<Language, Translation> = {
  [Language.DA]: da,
  [Language.DE]: de,
  [Language.EN]: en,
  [Language.FR]: fr,
  [Language.IT]: it,
  [Language.RO]: ro,
  [Language.VI]: vi,
};

export type Translation = typeof en;

let currentLanguage: Language = Language.EN;

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(i18nLang: string) {

  let language = Language.EN;
  switch(i18nLang) {
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

  currentLanguage = Translations[language] ? language : Language.EN;
}

export function getStrings(language: Language): Translation {
  return Translations[language] ?? Translations[Language.EN];
}

const translations = new Proxy({} as Translation, {
  get(_target, prop: string) {
    return (
      Translations[currentLanguage][prop as keyof Translation] ??
      Translations[Language.EN][prop as keyof Translation]
    );
  },
});

export { translations as strings };