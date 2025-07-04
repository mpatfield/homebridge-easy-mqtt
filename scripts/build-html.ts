import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const src = path.join(__dirname, '../src/homebridge-ui/public/index.html');
const destDir = path.join(__dirname, '../dist/homebridge-ui/public');
const dest = path.join(destDir, 'index.html');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

let html = fs.readFileSync(src, 'utf8');
html = html.replace(/__VERSION__/g, pkg.version);

fs.writeFileSync(dest, html);
