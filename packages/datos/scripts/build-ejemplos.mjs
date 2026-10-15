// Datos de EJEMPLO (ficticios, deterministas) para demos, Estudio y documentación.
//   dist/ejemplo-radicados.json|csv  (900 registros)   ·   dist/ejemplo-tramites.json (140 filas)
// Los municipios y subregiones son reales (DIVIPOLA); las personas, radicados y cifras NO lo son.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const muni = JSON.parse(fs.readFileSync(path.join(OUT, 'municipios.json'), 'utf8'));
let seed = 20260101;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = (a) => a[Math.floor(rnd() * a.length)];
const pesos = { '47001': 30, '47189': 12, '47980': 9, '47288': 7, '47245': 5, '47555': 5, '47551': 4, '47053': 4, '47030': 3, '47745': 2 };
const lista = muni.flatMap((m) => Array(pesos[m.codigo] ?? 1 + Math.floor(rnd() * 2)).fill(m));
const DEP = ['Secretaría de Salud', 'Secretaría de Educación', 'Planeación', 'Infraestructura', 'Hacienda', 'Gobierno y Convivencia'];
const TIPO = ['Petición', 'Queja', 'Reclamo', 'Solicitud de información', 'Sugerencia'];
const EST = ['Resuelto', 'En trámite', 'Pendiente', 'Vencido'];
const PRI = ['Alta', 'Media', 'Baja'];
const fecha = () => { const d = new Date(Date.UTC(2026, 0, 1 + Math.floor(Math.pow(rnd(), 0.8) * 285))); return d.toISOString().slice(0, 10); };

const radicados = Array.from({ length: 900 }, (_, i) => {
  const m = pick(lista); const e = pick(['Resuelto', 'Resuelto', 'Resuelto', 'En trámite', 'En trámite', 'Pendiente', 'Vencido']);
  return { id: `R-2026-${String(i + 1).padStart(5, '0')}`, fecha: fecha(), codigo: m.codigo, municipio: m.nombre, subregion: m.subregion, dependencia: pick(DEP), tipo: pick(TIPO), estado: e, prioridad: pick(PRI), dias: e === 'Resuelto' ? 2 + Math.floor(rnd() * 14) : 5 + Math.floor(rnd() * 40) };
}).sort((a, b) => a.fecha.localeCompare(b.fecha));
fs.writeFileSync(path.join(OUT, 'ejemplo-radicados.json'), JSON.stringify(radicados));
fs.writeFileSync(path.join(OUT, 'ejemplo-radicados.csv'), 'id,fecha,codigo,municipio,subregion,dependencia,tipo,estado,prioridad,dias\n' + radicados.map((r) => [r.id, r.fecha, r.codigo, `"${r.municipio}"`, r.subregion, `"${r.dependencia}"`, `"${r.tipo}"`, r.estado, r.prioridad, r.dias].join(',')).join('\n') + '\n');

const NOM = ['Ana', 'Luis', 'María', 'Carlos', 'Laura', 'Jorge', 'Paola', 'Andrés', 'Diana', 'Camilo', 'Sandra', 'Felipe', 'Lucía', 'Mateo', 'Valentina', 'Julián'];
const APE = ['Pérez', 'Gómez', 'Rodríguez', 'Martínez', 'Vargas', 'Castro', 'Mendoza', 'Ortiz', 'Barrios', 'Ruiz', 'Cantillo', 'Fuentes', 'Zúñiga', 'Palacio', 'Arrieta', 'Caicedo'];
const ASU = ['Certificación laboral', 'Derecho de petición', 'Licencia de construcción', 'Permiso de evento', 'Solicitud de subsidio', 'Queja por servicio', 'Copia de acto administrativo', 'Paz y salvo', 'Reclamo de pago', 'Certificado de residencia', 'Registro de organización', 'Concepto técnico'];
const tramites = Array.from({ length: 140 }, (_, i) => {
  const m = pick(lista); const e = pick(EST); const av = e === 'Resuelto' ? 1 : e === 'Pendiente' ? Math.round(rnd() * 20) / 100 : Math.round((20 + rnd() * 70)) / 100;
  return { id: i + 1, radicado: `R-2026-${String(1000 + i).padStart(5, '0')}`, asunto: pick(ASU), solicitante: `${pick(NOM)} ${pick(APE)} ${pick(APE)}`, municipio: m.nombre, codigo: m.codigo, dependencia: pick(DEP), estado: e, prioridad: pick(PRI), fecha: fecha(), dias: 1 + Math.floor(rnd() * 45), valor: rnd() < 0.55 ? Math.round((50000 + rnd() * 4_000_000) / 1000) * 1000 : 0, avance: av, tieneAnexos: rnd() < 0.6 };
});
fs.writeFileSync(path.join(OUT, 'ejemplo-tramites.json'), JSON.stringify(tramites));
console.log('ejemplos: radicados', radicados.length, '· trámites', tramites.length);
