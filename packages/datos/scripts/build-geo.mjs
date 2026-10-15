// Genera el paquete @gobmagdalena/datos a partir de:
//   fuentes/mgn2024-mpios-magdalena.geojson  (geometría oficial: DANE · Marco Geoestadístico Nacional 2024, ver LICENCIAS.md)
//   fuentes/divipola-dane.json              (códigos oficiales DANE)
// Salida: dist/  →  catálogos CSV/JSON, GeoJSON simplificado (3 niveles) y rutas SVG proyectadas.
// Uso: npm run build -w @gobmagdalena/datos
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'fuentes');
const OUT = path.join(ROOT, 'dist');
const TMP = path.join(ROOT, '.tmp');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

// ---------------------------------------------------------------- utilidades
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '');
const titulo = (s) => s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase()).replace(/\b(De|Del|La|Las|El)\b(?!$)/g, (m, _a, i) => (i === 0 ? m : m.toLowerCase()));

// ---------------------------------------------------------------- DIVIPOLA (DANE)
const divipola = JSON.parse(fs.readFileSync(path.join(SRC, 'divipola-dane.json'), 'utf8').replace(/^﻿/, '')).resultado
  .filter((r) => r.CODIGO_DEPARTAMENTO === '47');
if (divipola.length !== 30) throw new Error('DIVIPOLA: se esperaban 30 municipios del Magdalena, hay ' + divipola.length);
const porNombre = new Map(divipola.map((r) => [norm(r.NOMBRE_MUNICIPIO), r]));
const porCodigo = new Map(divipola.map((r) => [r.CODIGO_DPTO_MPIO, r]));

// ---------------------------------------------------------------- subregiones (definición del equipo; validar con Planeación)
const SUBREGIONES = {
  sm: { nombre: 'Santa Marta', color: '#5618BA', municipios: ['47001'] },
  no: { nombre: 'Norte', color: '#F7003C', municipios: ['47189', '47980', '47570', '47268', '47053', '47288', '47030'] },
  ri: { nombre: 'Río', color: '#00B7D9', municipios: ['47745', '47605', '47675', '47258', '47551', '47161', '47205', '47541', '47960'] },
  ce: { nombre: 'Centro', color: '#69B75E', municipios: ['47170', '47660', '47798', '47058', '47555', '47460'] },
  su: { nombre: 'Sur', color: '#FEC800', municipios: ['47545', '47720', '47707', '47692', '47703', '47318', '47245'] },
};
const subDe = {};
for (const [k, s] of Object.entries(SUBREGIONES)) s.municipios.forEach((c) => (subDe[c] = k));
if (Object.keys(subDe).length !== 30) throw new Error('Subregiones: deben cubrir los 30 municipios');

// ---------------------------------------------------------------- simplificación con topología (mapshaper)
const NIVELES = { alto: '7%', medio: '2.2%', bajo: '0.7%' };
const gadm = path.join(SRC, 'mgn2024-mpios-magdalena.geojson');
const mapshaper = path.resolve(ROOT, '../../node_modules/mapshaper/bin/mapshaper');
const simp = {};
for (const [n, pct] of Object.entries(NIVELES)) {
  const out = path.join(TMP, `mpios-${n}.json`);
  execFileSync(process.execPath, [mapshaper, gadm, '-simplify', 'visvalingam', pct, 'keep-shapes', '-o', out, 'format=geojson', 'precision=0.0001', 'force'], { stdio: 'pipe' });
  simp[n] = JSON.parse(fs.readFileSync(out, 'utf8'));
}
// contorno departamental (disolver) a partir del nivel medio
const contornoFile = path.join(TMP, 'contorno.json');
execFileSync(process.execPath, [mapshaper, path.join(TMP, 'mpios-medio.json'), '-dissolve', '-o', contornoFile, 'format=geojson', 'precision=0.0001', 'force'], { stdio: 'pipe' });
const contornoRaw = JSON.parse(fs.readFileSync(contornoFile, 'utf8'));
const contornoGeom = contornoRaw.type === 'GeometryCollection' ? contornoRaw.geometries[0] : contornoRaw.type === 'FeatureCollection' ? contornoRaw.features[0].geometry : contornoRaw.geometry ?? contornoRaw;

// ---------------------------------------------------------------- proyección (equirectangular corregida por latitud)
const todos = [];
const rec = (c) => (typeof c[0] === 'number' ? todos.push(c) : c.forEach(rec));
simp.alto.features.forEach((f) => rec(f.geometry.coordinates));
const lons = todos.map((c) => c[0]); const lats = todos.map((c) => c[1]);
const BBOX = [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)];
const lat0 = (BBOX[1] + BBOX[3]) / 2;
const kx = Math.cos((lat0 * Math.PI) / 180);
const W = 1000;
const esc = W / ((BBOX[2] - BBOX[0]) * kx);
const H = Math.round((BBOX[3] - BBOX[1]) * esc * 10) / 10;
const proj = ([lon, lat]) => [(lon - BBOX[0]) * kx * esc, (BBOX[3] - lat) * esc];
const unproj = ([x, y]) => [x / (kx * esc) + BBOX[0], BBOX[3] - y / esc];
const r1 = (n) => Math.round(n * 10) / 10;

function ringPath(ring) {
  const pts = ring.map(proj);
  if (pts.length > 1 && pts[0][0] === pts.at(-1)[0] && pts[0][1] === pts.at(-1)[1]) pts.pop();
  return 'M' + pts.map((p) => r1(p[0]) + ' ' + r1(p[1])).join('L') + 'Z';
}
const polys = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);
const geomPath = (g) => polys(g).map((p) => p.map(ringPath).join('')).join('');

function bboxGeom(g) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of polys(g)) for (const [lon, lat] of p[0]) { const [x, y] = proj([lon, lat]); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  return [r1(x0), r1(y0), r1(x1), r1(y1)];
}
const areaRing = (r) => { let a = 0; for (let i = 0, n = r.length; i < n; i++) { const [x1, y1] = r[i], [x2, y2] = r[(i + 1) % n]; a += x1 * y2 - x2 * y1; } return a / 2; };
function mayorPoligono(g) { return polys(g).map((p) => ({ p, a: Math.abs(areaRing(p[0].map(proj))) })).sort((x, y) => y.a - x.a)[0].p; }
function dentro(pt, rings) { // regla par-impar en espacio proyectado
  let inside = false;
  for (const ring of rings) for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function distSeg(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1]; const l2 = dx * dx + dy * dy;
  const t = l2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2)) : 0;
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}
/** Punto interior «óptimo» (polo de inaccesibilidad aproximado) para colocar pines y etiquetas. */
function puntoInterior(poly) {
  const rings = poly.map((r) => r.map(proj));
  const xs = rings[0].map((p) => p[0]), ys = rings[0].map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  let mejor = null, paso = Math.max(x1 - x0, y1 - y0) / 24;
  let cx0 = x0, cx1 = x1, cy0 = y0, cy1 = y1;
  for (let it = 0; it < 4; it++) {
    for (let x = cx0; x <= cx1; x += paso) for (let y = cy0; y <= cy1; y += paso) {
      if (!dentro([x, y], rings)) continue;
      let d = Infinity;
      for (const ring of rings) for (let i = 0; i < ring.length; i++) d = Math.min(d, distSeg([x, y], ring[i], ring[(i + 1) % ring.length]));
      if (!mejor || d > mejor.d) mejor = { x, y, d };
    }
    cx0 = mejor.x - paso; cx1 = mejor.x + paso; cy0 = mejor.y - paso; cy1 = mejor.y + paso; paso /= 4;
  }
  return [mejor.x, mejor.y];
}

// ---------------------------------------------------------------- ensamblar
const codigoDe = (f) => String(f.properties.MPIO_CDPMP);
const catalogo = [];
const geoPorNivel = {};
for (const nivel of Object.keys(NIVELES)) {
  const items = [];
  for (const f of simp[nivel].features) {
    const dv = porCodigo.get(codigoDe(f));
    if (!dv) throw new Error('Sin código DIVIPOLA para: ' + codigoDe(f));
    const codigo = dv.CODIGO_DPTO_MPIO;
    const [cx, cy] = puntoInterior(mayorPoligono(f.geometry));
    const [lon, lat] = unproj([cx, cy]);
    items.push({
      codigo, nombre: titulo(dv.NOMBRE_MUNICIPIO), subregion: subDe[codigo],
      centro: [r1(cx), r1(cy)], lonlat: [Math.round(lon * 1e4) / 1e4, Math.round(lat * 1e4) / 1e4],
      bbox: bboxGeom(f.geometry), d: geomPath(f.geometry),
    });
  }
  items.sort((a, b) => a.codigo.localeCompare(b.codigo));
  geoPorNivel[nivel] = items;
}
if (geoPorNivel.alto.length !== 30) throw new Error('Se esperaban 30 municipios con geometría');

const meta = { departamento: { codigo: '47', nombre: 'Magdalena' }, viewBox: [0, 0, W, H], bbox: BBOX, proyeccion: { tipo: 'equirectangular', lat0: Math.round(lat0 * 1e4) / 1e4, escala: esc }, fuente: 'DANE · DIVIPOLA y Marco Geoestadístico Nacional (MGN) 2024', generado: new Date().toISOString().slice(0, 10) };
const subr = Object.entries(SUBREGIONES).map(([id, s]) => ({ id, nombre: s.nombre, color: s.color, municipios: s.municipios }));

for (const nivel of Object.keys(NIVELES)) {
  const items = geoPorNivel[nivel].map(({ codigo, nombre, subregion, centro, lonlat, bbox, d }) => ({ codigo, nombre, subregion, centro, lonlat, bbox, d }));
  const pack = { meta: { ...meta, nivel }, subregiones: subr, contorno: geomPath(contornoGeom), municipios: items };
  fs.writeFileSync(path.join(OUT, `magdalena-municipios.${nivel}.json`), JSON.stringify(pack));
  // GeoJSON WGS84 con códigos DANE
  const fc = { type: 'FeatureCollection', features: simp[nivel].features.map((f) => { const dv = porCodigo.get(codigoDe(f)); return { type: 'Feature', properties: { codigo: dv.CODIGO_DPTO_MPIO, nombre: titulo(dv.NOMBRE_MUNICIPIO), subregion: subDe[dv.CODIGO_DPTO_MPIO] }, geometry: f.geometry }; }).sort((a, b) => a.properties.codigo.localeCompare(b.properties.codigo)) };
  fs.writeFileSync(path.join(OUT, `magdalena-municipios.${nivel}.geojson`), JSON.stringify(fc));
}

// catálogos
for (const m of geoPorNivel.alto) catalogo.push({ codigo: m.codigo, nombre: m.nombre, subregion: SUBREGIONES[m.subregion].nombre, longitud: m.lonlat[0], latitud: m.lonlat[1] });
fs.writeFileSync(path.join(OUT, 'municipios.json'), JSON.stringify(catalogo, null, 2));
fs.writeFileSync(path.join(OUT, 'municipios.csv'), 'codigo,nombre,subregion,longitud,latitud\n' + catalogo.map((c) => [c.codigo, `"${c.nombre}"`, c.subregion, c.longitud, c.latitud].join(',')).join('\n') + '\n');
fs.writeFileSync(path.join(OUT, 'subregiones.json'), JSON.stringify(subr, null, 2));
fs.rmSync(TMP, { recursive: true, force: true });

for (const n of Object.keys(NIVELES)) {
  const sz = fs.statSync(path.join(OUT, `magdalena-municipios.${n}.json`)).size;
  console.log(n.padEnd(6), (sz / 1024).toFixed(1).padStart(7), 'KB  (rutas SVG)');
}
console.log('viewBox', meta.viewBox.join(' '), '· 30 municipios · 5 subregiones · OK');
