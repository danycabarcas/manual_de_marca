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
console.log('datos y fuentes → cdn/v1');
