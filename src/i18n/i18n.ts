import en from './en.js';
import fr from './fr.js';

export enum Language {
  EN = 'en',
  FR = 'fr',
}

const Translations: Record<Language, Translation> = {
  [Language.EN]: en,
  [Language.FR]: fr,
};

export type Translation = typeof en;

let currentLanguage: Language = Language.EN;

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(i18nLang: string) {

  let language = Language.EN;
  switch(i18nLang) {
  case Language.EN:
    language = Language.EN;
    break;
  case Language.FR:
    language = Language.FR;
    break;
  }

  currentLanguage = Translations[language] ? language : Language.EN;
}

export function getAllTranslations(): Translation {
  return Translations[currentLanguage];
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