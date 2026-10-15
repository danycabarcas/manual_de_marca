import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const from = path.resolve(here, '../../datos/dist'), to = path.resolve(here, '../../../cdn/v1/datos');
fs.cpSync(from, to, { recursive: true });
console.log('datos →', path.relative(process.cwd(), to));
