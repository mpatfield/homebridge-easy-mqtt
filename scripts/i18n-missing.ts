import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { pruneExtraStrings } from './i18n-clean.js';

import { getStrings, getTranslation, Language } from '../src/i18n/i18n.js';
import en from '../src/i18n/en.js';

type Strings = Record<string, string | object>;
function findMissing(missing: Strings, existing: Strings) {

  for (const key of Object.keys(missing)) {

    const missingValue = missing[key];
    const existingValue = existing[key];

    if (typeof missingValue === 'object' && typeof existingValue === 'object') {
      findMissing(missingValue as Strings, existingValue as Strings);
      if (Object.keys(missing[key]).length === 0) {
        delete missing[key];
      }
      continue;
    }

    if (existingValue !== undefined || Number(key) > 0) {
      delete missing[key];
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const missingDir = path.join(__dirname, '../src/i18n/missing');
if (!fs.existsSync(missingDir)) {
  fs.mkdirSync(missingDir, { recursive: true });
}

for (const language of Object.values(Language)) {

  if (language === 'en') {
    continue;
  }

  const missing = getStrings(Language.EN);
  const existing = getTranslation(language);

  findMissing(missing, existing);

  const englishPath = path.join(__dirname, '../src/i18n/en.ts');
  let missingFile = fs.readFileSync(englishPath, 'utf8');

  missingFile = pruneExtraStrings(missing, en, missingFile).replace(/\n{3,}/g, '\n\n');
  missingFile = missingFile.replace('const en =', `const ${language} =`).replace('default en;', `default ${language};`);

  const missingPath = path.join(missingDir, `${language}.ts`);
  if (Object.keys(missing).length > 0) {
    fs.writeFileSync(missingPath, missingFile);
  } else {
    fs.unlink(missingPath, () => {});
  }
}