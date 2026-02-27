import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import en from '../src/i18n/en.js';
import { getStrings, Language } from '../src/i18n/i18n.js';

function findLineStart(translationsFile: string, searchTerms: string[]): number {

  let start = 0;
  for (const [index, searchTerm] of searchTerms.entries()) {
    const searchString = `\n${' '.repeat(2 * (index + 1))}${searchTerm}`;
    start = translationsFile.indexOf(searchString, start);
  }

  return start;
}

type Strings = Record<string, string | object>;
export function pruneExtraStrings(compare: Strings, toClean: Strings, outputFile: string, keyPath: string[] = []): string {

  for (const key of Object.keys(toClean)) {

    const compareValue = compare[key];
    const toCleanValue = toClean[key];

    if (typeof compareValue === 'object' && typeof toCleanValue === 'object') {
      outputFile = pruneExtraStrings(compareValue as Strings, toCleanValue as Strings, outputFile, [...keyPath, key]);
      continue;
    }

    if (typeof compareValue !== typeof toCleanValue) {

      const start = findLineStart(outputFile, [...keyPath, key]);
      let end: number;

      if (typeof toCleanValue === 'string') {

        end = outputFile.indexOf('\n', start + 1);

      } else {

        end = outputFile.indexOf('{', start + 1) + 1;

        let braceCount = 1;
        while (braceCount > 0) {
          const char = outputFile.charAt(end++);
          if (char === '{') {
            braceCount++;
          } else if (char === '}') {
            braceCount--;
          }
        }

        end = outputFile.indexOf('\n', end);
      }

      outputFile = outputFile.substring(0, start) + outputFile.substring(end);

      continue;
    }
  }

  return outputFile;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

for (const language of Object.values(Language)) {

  if (language === 'en') {
    continue;
  }

  const translationsPath = path.join(__dirname, `../src/i18n/${language}.ts`);
  let translationsFile = fs.readFileSync(translationsPath, 'utf8');

  const translations = getStrings(language);

  translationsFile = pruneExtraStrings(en, translations, translationsFile).replace(/\n{3,}/g, '\n\n');

  fs.writeFileSync(translationsPath, translationsFile);
}