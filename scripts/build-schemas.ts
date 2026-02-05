import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { getStrings, Language } from '../src/i18n/i18n.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');

const templatePath = path.join(rootDir, 'config.schema.template.json');
const template = fs.readFileSync(templatePath, 'utf8');

const schemasDir = path.join('schemas');

if (!fs.existsSync(schemasDir)) {
  fs.mkdirSync(schemasDir, { recursive: true });
}

const regex = /\$\{config\.(title|description|enumNames)\.([^}]+)\}/g;

for (const language of Object.values(Language)) {

  const strings = getStrings(language);

  const translated = template.replace(regex, (match, type: keyof typeof strings.config, key) => {
    if (strings.config[type] && typeof strings.config[type] === 'object' && key in (strings.config[type] as Record<string, string>)) {
      const replacement = (strings.config[type] as Record<string, string>)[key];
      return replacement.replaceAll('"','\\"');
    }
    return match;
  });

  const writeDir = language === Language.EN ? rootDir : schemasDir;
  const fileName = `config.schema${language === Language.EN ? '' : '.' + language}.json`;

  const filePath = path.join(writeDir, fileName);

  fs.writeFileSync(filePath, translated);
}