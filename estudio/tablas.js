/* Estudio de tablas · configura <gob-tabla>: datos, columnas, funciones y genera el código completo. */
import { $, $$, esc, CDN, base, MARCA, toast, copiar, codigos, montarTabs, tabsHTML, NOMBRES_TAB, paginaAutonoma, descargar, guardarHash, restaurarHash, chk, sel, txt, baseBar, enlazarBase } from './comun.js';

const DEF = { titulo: '', busqueda: true, filtrosColumna: false, paginacion: true, tamanoPagina: 10, seleccion: 'ninguna', exportar: true, selectorColumnas: true, totales: false, zebra: false, densidad: 'normal', tarjetas: 'auto', alturaMax: 0, tema: 'claro', filaClicable: false };
const KEBAB = { filtrosColumna: 'filtros-columna', tamanoPagina: 'tamano-pagina', selectorColumnas: 'selector-columnas', alturaMax: 'altura-max', filaClicable: 'fila-clicable' };
const FUENTES = {
  tramites: { nombre: 'Trámites (ejemplo, 140 filas)', url: 'cdn/v1/datos/ejemplo-tramites.json', llave: 'id' },
  radicados: { nombre: 'Radicados (ejemplo, 900 filas)', url: 'cdn/v1/datos/ejemplo-radicados.json', llave: 'id' },
  csv: { nombre: 'Mis datos (pegar CSV)', url: '', llave: 'id' },
};
const COLOR_ESTADO = { Resuelto: 'exito', 'En trámite': 'info', Pendiente: 'aviso', Vencido: 'peligro', Alta: 'peligro', Media: 'aviso', Baja: 'neutro', Sí: 'exito', No: 'neutro' };
const CICLO = ['exito', 'info', 'aviso', 'peligro', 'primario', 'violeta', 'neutro'];
const TIPOS = [['texto', 'Texto'], ['numero', 'Número'], ['cop', 'Pesos COP'], ['porcentaje', 'Porcentaje (0–1)'], ['fecha', 'Fecha'], ['estado', 'Estado (insignia)'], ['barra', 'Barra de avance'], ['booleano', 'Sí / No'], ['enlace', 'Enlace']];
const S = { ...structuredClone(DEF), titulo: 'Trámites', fuente: 'tramites', csv: '', filas: [], columnas: [], accVer: true, accEditar: true, accEliminar: true, masExportar: true, masEliminar: true, ordenCampo: '', ordenDir: 'asc', filtroPrevio: '' };
let tabActiva = 'html', vista;

(async function init() {
  await import(CDN + 'gob.js'); await window.gob.cargar('gob-tabla', 'gob-modal', 'gob-icono');
  $('#app').innerHTML = `${baseBar()}<div class="st"><div class="st__panel" id="panel"></div><div class="st__main">
    <div class="st__vista" id="vistaBox" data-tema="claro" style="max-width:none"><gob-tabla id="vista"></gob-tabla></div>
    <p class="mg-help" id="evt" aria-live="polite" style="margin:.4rem 0 1rem;font-family:var(--mg-font-mono)">Los eventos (selección, acciones, filas) aparecen aquí…</p>
    <div class="mg-row" style="margin-bottom:1rem"><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="pagina">⬇ Página de ejemplo (.html)</button><a class="mg-btn mg-btn--secondary mg-btn--sm" href="../dist/downloads/gob-cdn-v1.zip">⬇ Paquete autónomo (.zip)</a><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="link">🔗 Copiar enlace</button></div>
    ${tabsHTML()}</div></div>`;
  vista = $('#vista'); restaurarHash(S); await cargarFuente(S.columnas.length === 0); panel(); sync(true);
  enlazarBase(() => sync(true)); montarTabs($('#tabs'), (t) => { tabActiva = t; sync(true); });
  for (const ev of ['gob-tabla-seleccion', 'gob-tabla-accion', 'gob-tabla-fila-clic', 'gob-tabla-exportar']) vista.addEventListener(ev, (e) => { $('#evt').textContent = ev + ' → ' + JSON.stringify(ev === 'gob-tabla-seleccion' ? { llaves: e.detail.llaves } : ev === 'gob-tabla-accion' ? { accion: e.detail.accion, fila: e.detail.fila?.radicado ?? e.detail.fila?.id, filas: e.detail.filas?.length } : e.detail.fila ? { fila: e.detail.fila.id } : e.detail); });
})();

// ------------------------------------------------------------------ datos / columnas
const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
const tit = (c) => c.charAt(0).toUpperCase() + c.slice(1).replace(/_/g, ' ');
function inferir(filas) {
  if (!filas.length) return [];
  return Object.keys(filas[0]).map((campo) => {
    const v = filas.slice(0, 200).map((f) => f[campo]).filter((x) => x !== '' && x != null); const u = new Set(v);
    let tipo = 'texto'; if (v.every((x) => typeof x === 'boolean')) tipo = 'booleano'; else if (v.every((x) => x !== '' && !isNaN(Number(x)))) tipo = /^(id|codigo|código|cod_|nit|cedula|cédula|documento|telefono|teléfono)/i.test(campo) ? 'texto' : /valor|monto|precio|costo|total|presupuesto/i.test(campo) ? 'cop' : /avance|porcentaje|proporcion/i.test(campo) ? 'barra' : 'numero';
    else if (v.every((x) => /^\d{4}-\d{2}-\d{2}/.test(String(x)))) tipo = 'fecha'; else if (u.size <= 6 && u.size > 1 && v.length > 8) tipo = 'estado';
    const estados = {}; if (tipo === 'estado') [...u].forEach((x, i) => (estados[x] = COLOR_ESTADO[x] ?? CICLO[i % CICLO.length]));
    return { campo, titulo: tit(campo), tipo, incluir: !['codigo', 'tieneAnexos', 'id'].includes(campo) && Object.keys(filas[0]).length > 0, total: '', alinear: '', estados, maximo: tipo === 'barra' ? 1 : undefined, nowrap: ['radicado', 'id'].includes(campo) };
  });
}
async function cargarFuente(inferirCols = true) {
  if (S.fuente === 'csv') { S.filas = parseCSV(S.csv); }
  else S.filas = await fetch(CDN + FUENTES[S.fuente].url.replace('cdn/v1/', '')).then((r) => r.json());
  if (inferirCols) { S.columnas = inferir(S.filas); if (S.fuente === 'radicados') { const c = S.columnas.find((x) => x.campo === 'id'); if (c) { c.incluir = true; c.titulo = 'Radicado'; c.nowrap = true; } for (const c2 of S.columnas) if (['codigo', 'subregion'].includes(c2.campo)) c2.incluir = false; } if (S.fuente === 'tramites') for (const c of S.columnas) { if (c.campo === 'dias') { c.total = 'promedio'; } if (c.campo === 'valor') c.total = 'suma'; if (['codigo', 'prioridad', 'id', 'solicitante', 'tieneAnexos', 'dependencia'].includes(c.campo)) c.incluir = false; } }
}
function parseCSV(t) {
  const L = t.split(/\r?\n/).filter((l) => l.trim()); if (L.length < 2) return [];
  const sep = [';', '\t', ','].sort((a, b) => L[0].split(b).length - L[0].split(a).length)[0]; const cab = L[0].split(sep).map((x) => x.trim().replace(/^"|"$/g, ''));
  return L.slice(1).map((l, i) => { const p = l.split(sep).map((x) => x.trim().replace(/^"|"$/g, '')); const o = { id: i + 1 }; cab.forEach((c, j) => { const k = c || 'col' + j; const n = p[j] ?? ''; o[k] = n !== '' && !isNaN(Number(n.replace(',', '.'))) && !/^0\d/.test(n) ? Number(n.replace(',', '.')) : n; }); return o; });
}
const colsFinal = () => S.columnas.filter((c) => c.incluir).map((c) => { const o = { campo: c.campo, titulo: c.titulo }; if (c.tipo !== 'texto') o.tipo = c.tipo; if (c.tipo === 'estado') o.estados = c.estados; if (c.tipo === 'barra') o.maximo = c.maximo ?? 1; if (c.total) o.total = c.total; if (c.alinear) o.alinear = c.alinear; if (c.nowrap) o.nowrap = true; if (c.tipo === 'numero' && /dias|días/i.test(c.campo)) o.semaforo = { verde: 10, amarillo: 25, invertir: true }; return o; });
function config() {
  const c = {}; for (const k of Object.keys(DEF)) if (S[k] !== DEF[k]) c[k] = S[k];
  c.columnas = colsFinal(); c.llave = 'id';
  if (S.ordenCampo) c.ordenInicial = { campo: S.ordenCampo, dir: S.ordenDir };
  const ac = []; if (S.accVer) ac.push({ id: 'ver', etiqueta: 'Ver detalle', icono: 'ojo' }); if (S.accEditar) ac.push({ id: 'editar', etiqueta: 'Editar', icono: 'editar' }); if (S.accEliminar) ac.push({ id: 'eliminar', etiqueta: 'Eliminar', icono: 'eliminar', tipo: 'peligro' }); if (ac.length) c.acciones = ac;
  if (S.seleccion !== 'ninguna') { const m = []; if (S.masExportar) m.push({ id: 'exportar', etiqueta: 'Exportar', icono: 'descargar' }); if (S.masEliminar) m.push({ id: 'eliminar', etiqueta: 'Eliminar', icono: 'eliminar', tipo: 'peligro' }); if (m.length) c.accionesMasivas = m; }
  return c;
}
function aplicar() { vista.config = { ...structuredClone(DEF), acciones: undefined, accionesMasivas: undefined, ordenInicial: undefined, ...config(), datos: S.filas }; $('#vistaBox').dataset.tema = S.tema; }

// ------------------------------------------------------------------ interfaz
function panel() {
  const cols = S.columnas; const nom = cols.map((c) => [c.campo, c.titulo]);
  $('#panel').innerHTML = `
  <details open><summary>1 · Datos</summary><div class="st__body">
    ${sel(S, 'fuente', 'Fuente de datos', Object.entries(FUENTES).map(([k, v]) => [k, v.nombre]))}
    ${S.fuente === 'csv' ? `<label class="st-f"><span>Pegue su CSV (primera fila = encabezados; separador ; , o tab)</span><textarea class="mg-textarea mg-input" id="csv" rows="5" placeholder="nombre;municipio;valor&#10;Ana;Santa Marta;1200000">${esc(S.csv)}</textarea></label><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="csv">Usar estos datos</button>` : `<p class="mg-help">${S.filas.length} filas. Datos ficticios para demostración.</p>`}
    ${txt(S, 'titulo', 'Título de la tabla')}
  </div></details>
  <details open><summary>2 · Columnas (${cols.filter((c) => c.incluir).length} de ${cols.length})</summary><div class="st__body">
    ${cols.map((c, i) => `<div class="st-item st-col" style="display:grid;grid-template-columns:auto 1fr;gap:.4rem .5rem;align-items:center">
      <input type="checkbox" class="mg-check" aria-label="Incluir ${esc(c.campo)}" data-ci="${i}" data-p="incluir" ${c.incluir ? 'checked' : ''}><input class="mg-input" aria-label="Título de ${esc(c.campo)}" data-ci="${i}" data-p="titulo" value="${esc(c.titulo)}" style="font-size:.82rem;padding:.3rem .5rem">
      <span></span><div class="st-grid"><select class="mg-select" aria-label="Tipo de ${esc(c.campo)}" data-ci="${i}" data-p="tipo" style="font-size:.78rem;padding:.3rem .4rem">${TIPOS.map(([v, l]) => `<option value="${v}" ${c.tipo === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
      ${['numero', 'cop', 'porcentaje', 'barra'].includes(c.tipo) ? `<select class="mg-select" aria-label="Total de ${esc(c.campo)}" data-ci="${i}" data-p="total" style="font-size:.78rem;padding:.3rem .4rem"><option value="">Sin total</option>${['suma', 'promedio', 'conteo', 'min', 'max'].map((v) => `<option ${c.total === v ? 'selected' : ''}>${v}</option>`).join('')}</select>` : '<span></span>'}</div></div>`).join('')}
  </div></details>
  <details open><summary>3 · Funciones</summary><div class="st__body">
    <div class="st-grid">${chk(S, 'busqueda', 'Búsqueda')}${chk(S, 'filtrosColumna', 'Filtros por columna')}${chk(S, 'paginacion', 'Paginación')}${chk(S, 'exportar', 'Exportar / copiar')}${chk(S, 'selectorColumnas', 'Selector de columnas')}${chk(S, 'totales', 'Fila de totales')}${chk(S, 'zebra', 'Filas alternadas')}${chk(S, 'filaClicable', 'Fila clicable')}</div>
    ${S.paginacion ? sel(S, 'tamanoPagina', 'Filas por página', [5, 10, 25, 50, 100].map((n) => [n, n])) : ''}
    ${sel(S, 'seleccion', 'Selección', [['ninguna', 'Sin selección'], ['una', 'Una fila'], ['multiple', 'Varias filas']])}
    <p class="st-n">Acciones por fila</p><div class="st-grid">${chk(S, 'accVer', 'Ver detalle')}${chk(S, 'accEditar', 'Editar')}${chk(S, 'accEliminar', 'Eliminar')}</div>
    ${S.seleccion !== 'ninguna' ? `<p class="st-n">Acciones masivas</p><div class="st-grid">${chk(S, 'masExportar', 'Exportar')}${chk(S, 'masEliminar', 'Eliminar')}</div>` : ''}
    <label class="st-f"><span>Orden inicial</span><select class="mg-select" data-k="ordenCampo"><option value="">Sin orden</option>${nom.map(([v, l]) => `<option value="${esc(v)}" ${S.ordenCampo === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>
    ${S.ordenCampo ? sel(S, 'ordenDir', 'Dirección', [['asc', 'Ascendente'], ['desc', 'Descendente']]) : ''}
  </div></details>
  <details><summary>4 · Apariencia</summary><div class="st__body">
    ${sel(S, 'densidad', 'Densidad', [['compacta', 'Compacta'], ['normal', 'Normal'], ['amplia', 'Amplia']])}${sel(S, 'tarjetas', 'Vista de tarjetas', [['auto', 'Automática en móvil'], ['siempre', 'Siempre'], ['nunca', 'Nunca']])}
    ${sel(S, 'tema', 'Tema', [['claro', 'Claro'], ['oscuro', 'Oscuro']])}
    <label class="st-f"><span>Altura máxima en px (0 = sin límite)</span><input class="mg-input" type="number" min="0" step="40" data-k="alturaMax" value="${S.alturaMax}"></label>
  </div></details>`;
}
function sync(soloCodigo) {
  if (!soloCodigo) aplicar(); else aplicar();
  const cfg = config(); const url = S.fuente === 'csv' ? '' : base() + '/' + FUENTES[S.fuente].url;
  const o = codigos({ tag: 'gob-tabla', id: 'tabla', cfg, DEF, KEBAB, evento: 'gob-tabla-accion', nombreEv: 'Tabla', conDatos: true, datosUrl: url });
  window.__cod = o; const txtc = tabActiva === 'json' ? o.json : o[tabActiva];
  $('#code').textContent = txtc + (S.fuente === 'csv' && tabActiva === 'html' ? '\n\n// Nota: «tabla.datos» debe ser el arreglo de objetos de su CSV (' + S.filas.length + ' filas pegadas). Conviértalo con su API o con papaparse.' : '');
  $('#codeLbl').textContent = NOMBRES_TAB[tabActiva]; guardarHash(S);
}
document.addEventListener('input', (e) => onCampo(e)); document.addEventListener('change', (e) => onCampo(e));
async function onCampo(e) {
  const t = e.target; if (!t.closest?.('#app')) return; const d = t.dataset; const cambio = e.type === 'change';
  if (d.ci !== undefined) { const c = S.columnas[+d.ci]; c[d.p] = t.type === 'checkbox' ? t.checked : t.value; if (d.p === 'tipo') { if (c.tipo === 'estado' && !Object.keys(c.estados).length) { [...new Set(S.filas.map((f) => f[c.campo]))].slice(0, 8).forEach((x, i) => (c.estados[x] = COLOR_ESTADO[x] ?? CICLO[i % CICLO.length])); } if (c.tipo === 'barra') c.maximo = c.maximo ?? 1; if (cambio) panel(); } if (d.p === 'incluir' && cambio) panel(); sync(); return; }
  if (d.k) { let v = t.type === 'checkbox' ? t.checked : t.value; if (['tamanoPagina', 'alturaMax'].includes(d.k)) v = Number(v); S[d.k] = v; if (cambio && ['fuente', 'seleccion', 'paginacion', 'ordenCampo'].includes(d.k)) { if (d.k === 'fuente') { await cargarFuente(true); } panel(); } sync(); }
}
document.addEventListener('click', async (e) => {
  const b = e.target.closest('button'); if (!b || !b.closest('#app')) return; const a = b.dataset.acc; if (!a) return;
  if (a === 'csv') { S.csv = $('#csv').value; await cargarFuente(true); panel(); sync(); toast(S.filas.length + ' filas cargadas', 'exito'); }
  else if (a === 'link') { copiar(location.href); }
  else if (a === 'pagina') { const o = window.__cod; const i = o.html.indexOf('<!-- ② '); const cuerpo = o.html.slice(i).split(base() + '/cdn/v1/').join('./cdn/v1/'); descargar('mi-tabla.html', paginaAutonoma(S.titulo || 'Mi tabla', cuerpo)); toast('Página descargada: descomprima gob-cdn-v1.zip a su lado', 'exito'); }
});
