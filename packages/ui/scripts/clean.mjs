import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const cdn = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../cdn/v1');
for (const p of ['components', 'chunks', 'datos', 'gob.js']) fs.rmSync(path.join(cdn, p), { recursive: true, force: true });
fs.mkdirSync(cdn, { recursive: true });
