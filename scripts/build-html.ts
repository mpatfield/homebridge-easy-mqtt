import esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { getStrings, Language } from '../src/i18n/i18n';

const i18n = [
  'accessory',
  'continue',
  'support',
  'required',
  'thankYou',
];

const i18nReplacements = {
  continue: '&rarr;',
  support: '<a target="_blank" href="https://github.com/mpatfield/homebridge-easy-mqtt/wiki">GitHub</a>',
  thankYou: 'Homebridge Easy MQTT',
};

const strings: Record<string, Record<string, string>> = {};
for (const language of Object.values(Language)) {

  const translation = getStrings(language).config;

  strings[language] = {};

  for (const key of i18n) {
    strings[language][key] = translation[key as keyof typeof translation] as string;
    if (key in i18nReplacements) {
      strings[language][key] = strings[language][key].replace('%s', i18nReplacements[key as keyof typeof i18nReplacements]);
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const homebridgeUIDir = path.join(__dirname, '../src/homebridge-ui');

const scriptPath = path.join(homebridgeUIDir, 'ui.ts');
const scriptFile = fs.readFileSync(scriptPath, 'utf8').replace(/{ __I18N_REPLACE__ :.*}/g, JSON.stringify(strings));

const script = (await esbuild.build({
  stdin: {
    contents: scriptFile,
    loader: 'ts',
    resolveDir: path.dirname(scriptPath),
  },
  bundle: true,
  minify: true,
  write: false,
})).outputFiles[0].text.trimEnd();

const destDir = path.join(__dirname, '../dist/homebridge-ui/public/');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const htmlPath = path.join(homebridgeUIDir, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8').replace(/__UI_SCRIPT__/g, script);

const dest = path.join(destDir, 'index.html');
fs.writeFileSync(dest, html);
