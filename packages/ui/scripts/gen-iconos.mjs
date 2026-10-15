// Genera el set de íconos estándar (Lucide, licencia ISC) con nombres en español:
//   src/lib/iconos-data.ts   (datos para <gob-icono>)
//   cdn/v1/iconos/<nombre>.svg  (archivos sueltos)   ·   cdn/v1/iconos.svg  (sprite <symbol>)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const lucide = path.join(root, 'node_modules/lucide-static/icons');
const cdn = path.join(root, 'cdn/v1');

// nombre en español → nombre Lucide
const MAPA = {
  inicio: 'house', panel: 'layout-dashboard', usuario: 'user', usuarios: 'users', buscar: 'search', filtro: 'filter', ajustes: 'settings', campana: 'bell', correo: 'mail',
  telefono: 'phone', calendario: 'calendar', reloj: 'clock', archivo: 'file-text', carpeta: 'folder', descargar: 'download', subir: 'upload', imprimir: 'printer', copiar: 'copy',
  editar: 'pencil', eliminar: 'trash-2', agregar: 'plus', quitar: 'minus', cerrar: 'x', menu: 'menu', 'mas-opciones': 'ellipsis-vertical', 'mas-horizontal': 'ellipsis',
  'flecha-arriba': 'arrow-up', 'flecha-abajo': 'arrow-down', 'flecha-izquierda': 'arrow-left', 'flecha-derecha': 'arrow-right',
  'chevron-arriba': 'chevron-up', 'chevron-abajo': 'chevron-down', 'chevron-izquierda': 'chevron-left', 'chevron-derecha': 'chevron-right', 'chevron-doble-izquierda': 'chevrons-left', 'chevron-doble-derecha': 'chevrons-right',
  ordenar: 'arrow-up-down', check: 'check', 'check-circulo': 'circle-check', alerta: 'triangle-alert', info: 'info', error: 'circle-x', ayuda: 'circle-help', ojo: 'eye', 'ojo-cerrado': 'eye-off',
  candado: 'lock', llave: 'key-round', salir: 'log-out', entrar: 'log-in', mapa: 'map', ubicacion: 'map-pin', edificio: 'building-2', escuela: 'graduation-cap', salud: 'heart-pulse',
  agua: 'droplet', energia: 'zap', via: 'route', vehiculo: 'car', vivienda: 'house', 'grafica-barras': 'chart-column', 'grafica-torta': 'chart-pie', 'grafica-linea': 'chart-line', tabla: 'table',
  lista: 'list', cuadricula: 'layout-grid', 'tendencia-sube': 'trending-up', 'tendencia-baja': 'trending-down', estrella: 'star', bandera: 'flag', escudo: 'shield', 'escudo-check': 'shield-check',
  enlace: 'link', 'enlace-externo': 'external-link', globo: 'globe', refrescar: 'refresh-cw', maximizar: 'maximize-2', minimizar: 'minimize-2', luna: 'moon', sol: 'sun',
  firma: 'file-signature', dinero: 'banknote', cartera: 'wallet', imagen: 'image', mensaje: 'message-square', soporte: 'life-buoy', maletin: 'briefcase', tareas: 'clipboard-list',
  verificado: 'badge-check', huella: 'fingerprint', qr: 'qr-code', wifi: 'wifi', 'base-datos': 'database', nube: 'cloud', 'columnas': 'columns-3', 'filtro-quitar': 'filter-x',
  hoja: 'file-spreadsheet', 'copiar-listo': 'clipboard-check', gobierno: 'landmark', mundo: 'earth', 'persona-agregar': 'user-plus', pin: 'pin', etiqueta: 'tag', historial: 'history', 'ayuda-pregunta': 'message-circle-question',
};

const out = {}; const faltan = [];
for (const [es, en] of Object.entries(MAPA)) {
  const f = path.join(lucide, en + '.svg');
  if (!fs.existsSync(f)) { faltan.push(`${es} → ${en}`); continue; }
  const svg = fs.readFileSync(f, 'utf8');
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>[\s\S]*$/, '').replace(/\s+/g, ' ').trim();
  out[es] = inner;
}
if (faltan.length) console.warn('Íconos no encontrados en lucide-static:', faltan.join(', '));

fs.writeFileSync(path.join(here, '../src/lib/iconos-data.ts'),
  '/* Generado por scripts/gen-iconos.mjs — Lucide (ISC) con nombres en español. No editar. */\nexport const ICONOS_SVG: Record<string, string> = ' + JSON.stringify(out, null, 1) + ';\nexport const NOMBRES_ICONOS = Object.keys(ICONOS_SVG);\n');

fs.rmSync(path.join(cdn, 'iconos'), { recursive: true, force: true }); fs.mkdirSync(path.join(cdn, 'iconos'), { recursive: true });
const attrs = 'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
for (const [n, inner] of Object.entries(out)) fs.writeFileSync(path.join(cdn, 'iconos', n + '.svg'), `<svg ${attrs}>${inner}</svg>\n`);
fs.writeFileSync(path.join(cdn, 'iconos.svg'), `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${Object.entries(out).map(([n, inner]) => `<symbol id="gob-${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</symbol>`).join('\n')}\n</svg>\n`);
console.log(Object.keys(out).length, 'íconos generados');
