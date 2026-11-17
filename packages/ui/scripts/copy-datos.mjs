import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const cdn = path.join(root, 'cdn/v1');
fs.cpSync(path.resolve(here, '../../datos/dist'), path.join(cdn, 'datos'), { recursive: true });
// Tipografía Montserrat (OFL-1.1) autohospedada: sin depender de Google Fonts
fs.mkdirSync(path.join(cdn, 'fonts'), { recursive: true });
const fuente = path.join(root, 'node_modules/@fontsource-variable/montserrat/files');
for (const s of ['latin', 'latin-ext']) fs.copyFileSync(path.join(fuente, `montserrat-${s}-wght-normal.woff2`), path.join(cdn, 'fonts', `montserrat-${s}.woff2`));
fs.copyFileSync(path.join(root, 'node_modules/@fontsource-variable/montserrat/LICENSE'), path.join(cdn, 'fonts', 'LICENSE-OFL.txt'));
fs.cpSync(path.resolve(here, '../wrappers'), path.join(cdn, 'wrappers'), { recursive: true });

// Franja institucional (un solo archivo sin dependencias): se minifica con esbuild y se copia con sus logos
import { transformSync } from 'esbuild';
const fr = path.resolve(here, '../franja'); const frOut = path.join(cdn, 'franja'); fs.mkdirSync(frOut, { recursive: true });
const src = fs.readFileSync(path.join(fr, 'gob-franja.js'), 'utf8');
const cabecera = src.match(/^\/\*![\s\S]*?\*\//)[0];
fs.writeFileSync(path.join(frOut, 'gob-franja.js'), cabecera + '\n' + transformSync(src, { minify: true, target: 'es2017', legalComments: 'none' }).code);
fs.writeFileSync(path.join(frOut, 'gob-franja.src.js'), src);
for (const f of fs.readdirSync(fr)) if (f.endsWith('.png')) fs.copyFileSync(path.join(fr, f), path.join(frOut, f));
console.log('datos y fuentes → cdn/v1');
