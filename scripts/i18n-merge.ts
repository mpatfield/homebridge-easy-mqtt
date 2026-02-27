import * as fs from 'fs';
import merge from 'lodash.merge';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { Language } from '../src/i18n/i18n.js';

type Strings = Record<string, string | object>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mergeDir = path.join(__dirname, '../src/i18n/merge');

const i18nPath = path.join(__dirname, '../src/i18n/');

const fileHeader = 'const %s = ';
const fileFooter = ';\n\nexport default %s;';

function sort(strings: Strings): Strings {
  if (Array.isArray(strings)) {
    return strings.map(sort) as unknown as Strings;
  } else if (strings && typeof strings === 'object') {
    return Object.keys(strings).sort().reduce( (acc: Strings, key: string) => {
      acc[key] = sort(strings[key] as Strings);
      return acc;
    }, {});
  }
  return strings;
}

for (const language of Object.values(Language)) {

  if (language === 'en') {
    continue;
  }

  const i18nFilePath = path.join(i18nPath, `${language}.ts`);
  const mergePath = path.join(mergeDir, `${language}.ts`);

  if (!fs.existsSync(mergePath)) {
    continue;
  }

  const existing = (await import(i18nFilePath)).default;
  const add = (await import(mergePath)).default;
  const all = sort(merge({}, existing, add));

  const content = JSON.stringify(all, null, 2)
    .split('\n').map(line => /[{,[]$/.test(line) ? line : line + ',' ).join('\n') // make sure every line ends with one of {[,
    .replace(/'/g, '\\\'') // escape all single quotes
    .replace(/"(.*)":/g, '$1:') // replace quoted keys with unquoted ones
    .replace(/"(.*)",/g, '\'$1\',') // put values into single quotes instead of double
    .replaceAll('\\"', '"') // replace escaped double quotes with unescaped
    .replace(/(^.*: {)/gm, '\n$1')
    .replace(/^},$/gm, '}'); // remove very last comma

  const mergedFile = `${fileHeader.replaceAll('%s', language)}${content}${fileFooter.replaceAll('%s', language)}`;

  fs.writeFileSync(i18nFilePath, mergedFile);
  fs.unlink(mergePath, ()=>{} );
}