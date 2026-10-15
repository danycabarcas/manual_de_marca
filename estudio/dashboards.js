/* Estudio de dashboards · arma un <gob-dashboard>: datos, filtros, widgets y genera el código completo. */
import { $, $$, esc, CDN, base, toast, copiar, codigos, montarTabs, tabsHTML, NOMBRES_TAB, paginaAutonoma, descargar, guardarHash, restaurarHash, baseBar, enlazarBase, json } from './comun.js';

const DEF = { titulo: '', subtitulo: '', tema: 'claro' };
const FUENTES = { radicados: { nombre: 'Radicados (ejemplo, 900 registros)', url: 'datos/ejemplo-radicados.json' }, csv: { nombre: 'Mis datos (pegar CSV)', url: '' } };
const ICONOS = ['archivo', 'check-circulo', 'reloj', 'alerta', 'usuarios', 'dinero', 'mapa', 'edificio', 'escuela', 'salud', 'agua', 'energia', 'via', 'tendencia-sube', 'grafica-barras', 'base-datos', 'estrella', 'bandera', 'tareas', 'verificado'];
const COLORES = ['primario', 'cian', 'verde', 'amarillo', 'rojo', 'violeta', 'gris', 'navy'];
const GRAFICAS = [['barras', 'Barras'], ['barras-horizontal', 'Barras horizontales'], ['lineas', 'Líneas'], ['area', 'Áreas'], ['torta', 'Torta'], ['dona', 'Dona'], ['radar', 'Radar'], ['treemap', 'Treemap'], ['mapa-calor', 'Mapa de calor'], ['sankey', 'Sankey'], ['gauge', 'Indicador']];
const MEDIDAS = [['conteo', 'Conteo'], ['suma', 'Suma'], ['promedio', 'Promedio'], ['max', 'Máximo'], ['min', 'Mínimo'], ['distintos', 'Valores distintos']];
const EST = { Resuelto: 'exito', 'En trámite': 'info', Pendiente: 'aviso', Vencido: 'peligro' };
const S = { ...structuredClone(DEF), titulo: 'Atención al ciudadano 2026', subtitulo: 'Radicados por subregión, estado y tiempo (datos de ejemplo)', fuente: 'radicados', csv: '', registros: [], campos: [], filtros: [], widgets: [], plantilla: 'ejecutivo' };
let tabActiva = 'html', vista, NOMBRES_ICONOS = ICONOS, RAMPAS = {};

(async function init() {
  await import(CDN + 'gob.js'); await window.gob.cargar('gob-dashboard');
  RAMPAS = customElements.get('gob-mapa-magdalena')?.rampas ?? (await import(CDN + 'components/gob-mapa-magdalena.js'), customElements.get('gob-mapa-magdalena').rampas);
  $('#app').innerHTML = `${baseBar()}<div class="st"><div class="st__panel" id="panel"></div><div class="st__main">
    <div class="st__vista" id="vistaBox" data-tema="claro" style="max-width:none;padding:1rem"><gob-dashboard id="vista"></gob-dashboard></div>
    <p class="mg-help" id="evt" aria-live="polite" style="margin:.4rem 0 1rem;font-family:var(--mg-font-mono)">Haga clic en una barra, sector o municipio del tablero para filtrar los demás widgets…</p>
    <div class="mg-row" style="margin-bottom:1rem"><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="pagina">⬇ Página de ejemplo (.html)</button><a class="mg-btn mg-btn--secondary mg-btn--sm" href="../dist/downloads/gob-cdn-v1.zip">⬇ Paquete autónomo (.zip)</a><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="link">🔗 Copiar enlace</button></div>
    ${tabsHTML()}</div></div>`;
  vista = $('#vista'); restaurarHash(S);
  const pre = new URLSearchParams(location.search).get('plantilla'); if (pre) S.plantilla = pre;
  await cargar(true); if (!S.widgets.length || pre) plantilla(S.plantilla); panel(); sync();
  enlazarBase(() => sync()); montarTabs($('#tabs'), (t) => { tabActiva = t; sync(); });
  vista.addEventListener('gob-dashboard-filtro', (e) => { $('#evt').textContent = 'gob-dashboard-filtro → ' + JSON.stringify(e.detail); });
})();

// ------------------------------------------------------------------ datos y campos
function parseCSV(t) {
  const L = t.split(/\r?\n/).filter((l) => l.trim()); if (L.length < 2) return [];
  const sep = [';', '\t', ','].sort((a, b) => L[0].split(b).length - L[0].split(a).length)[0]; const cab = L[0].split(sep).map((x) => x.trim().replace(/^"|"$/g, ''));
  return L.slice(1).map((l, i) => { const p = l.split(sep).map((x) => x.trim().replace(/^"|"$/g, '')); const o = { id: i + 1 }; cab.forEach((c, j) => { const n = p[j] ?? ''; o[c || 'col' + j] = n !== '' && !isNaN(Number(n.replace(',', '.'))) && !/^0\d/.test(n) ? Number(n.replace(',', '.')) : n; }); return o; });
}
async function cargar(inferir) {
  S.registros = S.fuente === 'csv' ? parseCSV(S.csv) : await fetch(CDN + FUENTES[S.fuente].url).then((r) => r.json());
  const r = S.registros; const ks = r.length ? Object.keys(r[0]) : [];
  S.campos = ks.map((campo) => { const v = r.slice(0, 300).map((x) => x[campo]).filter((x) => x !== '' && x != null); const u = new Set(v);
    const tipo = v.every((x) => typeof x === 'number' || (x !== '' && !isNaN(Number(x)))) ? 'numero' : v.every((x) => /^\d{4}-\d{2}-\d{2}/.test(String(x))) ? 'fecha' : 'texto'; return { campo, tipo, unicos: u.size }; });
  if (inferir) S.filtros = S.fuente === 'radicados' ? ['subregion', 'dependencia', 'tipo'] : S.campos.filter((c) => c.tipo === 'texto' && c.unicos > 1 && c.unicos <= 12).slice(0, 3).map((c) => c.campo);
}
const dims = () => { const o = []; for (const c of S.campos) { if (c.tipo === 'texto' && c.unicos <= 60 && c.campo !== 'id') o.push([c.campo, c.campo]); if (c.tipo === 'fecha') o.push([c.campo + ':mes', c.campo + ' (por mes)'], [c.campo + ':trimestre', c.campo + ' (por trimestre)'], [c.campo + ':anio', c.campo + ' (por año)']); } return o; };
const nums = () => S.campos.filter((c) => c.tipo === 'numero' && c.campo !== 'id').map((c) => [c.campo, c.campo]);
const fechas = () => S.campos.filter((c) => c.tipo === 'fecha').map((c) => c.campo);

// ------------------------------------------------------------------ plantillas
function plantilla(n) {
  S.plantilla = n; const d = dims(), fecha = fechas()[0], num = nums()[0]?.[0]; const ser = fecha ? fecha + ':mes' : ''; const has = (c) => S.campos.some((x) => x.campo === c);
  if (S.fuente !== 'radicados') { const dim = d[0]?.[0]; S.widgets = [{ tipo: 'kpi', titulo: 'Registros', medida: 'conteo', icono: 'archivo', serie: ser, col: 3 }, ...(num ? [{ tipo: 'kpi', titulo: 'Total ' + num, medida: 'suma', campo: num, icono: 'dinero', color: 'verde', serie: ser, col: 3 }] : []), ...(dim ? [{ tipo: 'grafica', grafica: 'barras', titulo: 'Por ' + dim, agrupar: dim, orden: 'valor-desc', limite: 12, col: 6, alto: 300 }] : []), { tipo: 'tabla', titulo: 'Registros', limite: 100, col: 12, columnas: S.campos.slice(0, 7).map((c) => c.campo) }]; return; }
  const kpis = [{ tipo: 'kpi', titulo: 'Radicados', medida: 'conteo', icono: 'archivo', serie: 'fecha:mes', col: 3 }, { tipo: 'kpi', titulo: 'Resueltos', medida: 'conteo', dondeCampo: 'estado', dondeValor: 'Resuelto', icono: 'check-circulo', color: 'verde', serie: 'fecha:mes', col: 3 }, { tipo: 'kpi', titulo: 'Días promedio', medida: 'promedio', campo: 'dias', unidad: 'd', icono: 'reloj', color: 'cian', buenoSube: false, serie: 'fecha:mes', col: 3 }, { tipo: 'kpi', titulo: 'Vencidos', medida: 'conteo', dondeCampo: 'estado', dondeValor: 'Vencido', icono: 'alerta', color: 'rojo', buenoSube: false, serie: 'fecha:mes', col: 3 }];
  const tabla = { tipo: 'tabla', titulo: 'Últimos radicados', limite: 100, col: 12, columnas: ['id', 'fecha', 'municipio', 'dependencia', 'tipo', 'estado', 'dias'] };
  if (n === 'ejecutivo') S.widgets = [...kpis, { tipo: 'grafica', grafica: 'area', titulo: 'Radicados por mes', agrupar: 'fecha:mes', serie: 'estado', colores: ['#00B7D9', '#FEC800', '#69B75E', '#F7003C'], apilado: true, col: 8, alto: 300 }, { tipo: 'grafica', grafica: 'dona', titulo: 'Por tipo de solicitud', agrupar: 'tipo', col: 4, alto: 300 }, { tipo: 'mapa', titulo: 'Radicados por municipio', medida: 'conteo', col: 5, rampa: 'azul', leyendaTitulo: 'Radicados' }, { tipo: 'grafica', grafica: 'barras-horizontal', titulo: 'Por dependencia', agrupar: 'dependencia', orden: 'valor-desc', etiquetas: true, col: 7, alto: 360 }, tabla];
  else if (n === 'operativo') S.widgets = [...kpis, { tipo: 'grafica', grafica: 'barras', titulo: 'Estado por dependencia', agrupar: 'dependencia', serie: 'estado', colores: ['#00B7D9', '#FEC800', '#69B75E', '#F7003C'], apilado: true, col: 8, alto: 320 }, { tipo: 'grafica', grafica: 'gauge', titulo: 'Días promedio de atención', medida: 'promedio', campo: 'dias', max: 30, umbrales: [[0.4, '#69B75E'], [0.7, '#FEC800'], [1, '#F7003C']], col: 4, alto: 320 }, { tipo: 'grafica', grafica: 'lineas', titulo: 'Tendencia mensual', agrupar: 'fecha:mes', suave: true, col: 12, alto: 260 }, { ...tabla, titulo: 'Bandeja de radicados', limite: 300 }];
  else if (n === 'territorial') S.widgets = [{ tipo: 'kpi', titulo: 'Radicados', medida: 'conteo', icono: 'archivo', serie: 'fecha:mes', col: 4 }, { tipo: 'kpi', titulo: 'Municipios con casos', medida: 'distintos', campo: 'codigo', icono: 'mapa', color: 'cian', col: 4 }, { tipo: 'kpi', titulo: 'Días promedio', medida: 'promedio', campo: 'dias', unidad: 'd', icono: 'reloj', color: 'amarillo', buenoSube: false, col: 4 }, { tipo: 'mapa', titulo: 'Mapa de radicados', medida: 'conteo', col: 7, rampa: 'azul', leyendaTitulo: 'Radicados', mapaEtiquetas: 'ninguna' }, { tipo: 'grafica', grafica: 'barras-horizontal', titulo: 'Municipios con más radicados', agrupar: 'municipio', orden: 'valor-desc', limite: 10, etiquetas: true, col: 5, alto: 460 }, { tipo: 'grafica', grafica: 'dona', titulo: 'Por subregión', agrupar: 'subregion', col: 6, alto: 300 }, { tipo: 'grafica', grafica: 'treemap', titulo: 'Dependencias', agrupar: 'dependencia', col: 6, alto: 300 }];
  else S.widgets = [];
}

// ------------------------------------------------------------------ configuración efectiva
const limpiarW = (w) => { const o = {}; for (const [k, v] of Object.entries(w)) { if (k.startsWith('_') || k === 'dondeCampo' || k === 'dondeValor') continue; if (k === 'filtrar' || k === 'buenoSube') { if (v === false) o[k] = false; continue; } if (v === '' || v === undefined || v === false || v === null) continue; if (k === 'columnas') { o.columnas = v.map((c) => { const f = S.campos.find((x) => x.campo === c); const col = { campo: c, titulo: c.charAt(0).toUpperCase() + c.slice(1) }; if (f?.tipo === 'fecha') col.tipo = 'fecha'; if (f?.tipo === 'numero' && c !== 'id') col.tipo = 'numero'; if (c === 'estado') { col.tipo = 'estado'; col.estados = EST; } if (c === 'id') { col.titulo = 'Radicado'; col.nowrap = true; } return col; }); continue; } o[k] = v; } if (w.dondeCampo && w.dondeValor) o.donde = { [w.dondeCampo]: w.dondeValor }; return o; };
function config() { const c = { titulo: S.titulo, subtitulo: S.subtitulo }; if (S.tema !== 'claro') c.tema = S.tema; c.filtros = S.filtros.map((f) => ({ campo: f, etiqueta: f.charAt(0).toUpperCase() + f.slice(1) })); c.widgets = S.widgets.map(limpiarW); return c; }
function aplicar() { vista.config = { titulo: '', subtitulo: '', tema: 'claro', filtros: [], widgets: [], ...config(), registros: S.registros }; $('#vistaBox').dataset.tema = S.tema; }
function sync() {
  aplicar(); const url = S.fuente === 'csv' ? '' : base() + '/cdn/v1/' + FUENTES[S.fuente].url;
  const o = codigos({ tag: 'gob-dashboard', id: 'tablero', cfg: config(), DEF, KEBAB: {}, evento: 'gob-dashboard-filtro', nombreEv: 'Tablero', conDatos: true, datosUrl: url, propDatos: 'registros' });
  window.__cod = o; $('#code').textContent = (tabActiva === 'json' ? o.json : o[tabActiva]) + (S.fuente === 'csv' && tabActiva === 'html' ? `\n\n// Nota: «tablero.registros» debe ser el arreglo de objetos de su CSV (${S.registros.length} filas pegadas): cárguelo desde su API.` : '');
  $('#codeLbl').textContent = NOMBRES_TAB[tabActiva]; guardarHash({ ...S, registros: [], campos: [] });
}

// ------------------------------------------------------------------ interfaz
const opt = (ops, v, vacio) => `${vacio !== undefined ? `<option value="">${vacio}</option>` : ''}${ops.map(([a, b]) => `<option value="${esc(a)}" ${String(v) === String(a) ? 'selected' : ''}>${esc(b)}</option>`).join('')}`;
const sw = (i, k, t, ops, v, vacio) => `<label class="st-f"><span>${t}</span><select class="mg-select" data-wi="${i}" data-wk="${k}">${opt(ops, v, vacio)}</select></label>`;
const tw = (i, k, t, v, tipo = 'text', extra = '') => `<label class="st-f"><span>${t}</span><input class="mg-input" type="${tipo}" data-wi="${i}" data-wk="${k}" value="${esc(v ?? '')}" ${extra}></label>`;
const cw = (i, k, t, v) => `<label class="st-chk"><input type="checkbox" data-wi="${i}" data-wk="${k}" ${v ? 'checked' : ''}> ${t}</label>`;
function editorW(w, i) {
  const t = w.tipo; let h = `<div class="st-grid">${sw(i, 'tipo', 'Tipo', [['kpi', 'Indicador (KPI)'], ['grafica', 'Gráfica'], ['mapa', 'Mapa'], ['tabla', 'Tabla'], ['texto', 'Texto'], ['alerta', 'Alerta']], t)}${sw(i, 'col', 'Ancho (de 12)', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => [n, n]), w.col ?? 6)}</div>${tw(i, 'titulo', 'Título', w.titulo)}`;
  if (t === 'kpi') h += `<div class="st-grid">${sw(i, 'medida', 'Medida', MEDIDAS, w.medida ?? 'conteo')}${w.medida && w.medida !== 'conteo' ? sw(i, 'campo', 'Campo', w.medida === 'distintos' ? S.campos.map((c) => [c.campo, c.campo]) : nums(), w.campo, '—') : '<span></span>'}</div>
    <div class="st-grid">${sw(i, 'icono', 'Ícono', ICONOS.map((n) => [n, n]), w.icono, '—')}${sw(i, 'color', 'Color', COLORES.map((c) => [c, c]), w.color ?? 'primario')}</div>
    <div class="st-grid">${sw(i, 'formato', 'Formato', [['numero', 'Número'], ['compacto', 'Compacto'], ['cop', 'Pesos'], ['porcentaje', 'Porcentaje']], w.formato ?? 'numero')}${tw(i, 'unidad', 'Unidad', w.unidad)}</div>
    ${fechas().length ? sw(i, 'serie', 'Variación y sparkline', [[fechas()[0] + ':mes', 'Por mes']], w.serie, 'Sin variación') : ''}${cw(i, 'buenoSube', 'Subir es bueno', w.buenoSube !== false)}
    <div class="st-grid">${sw(i, 'dondeCampo', 'Solo donde…', S.campos.filter((c) => c.tipo === 'texto').map((c) => [c.campo, c.campo]), w.dondeCampo, '— todo —')}${tw(i, 'dondeValor', '…sea igual a', w.dondeValor)}</div>`;
  if (t === 'grafica') h += `${sw(i, 'grafica', 'Tipo de gráfica', GRAFICAS, w.grafica ?? 'barras')}${w.grafica === 'gauge' ? '' : sw(i, 'agrupar', 'Agrupar por', dims(), w.agrupar, '—')}${['barras', 'barras-horizontal', 'lineas', 'area', 'mapa-calor', 'sankey'].includes(w.grafica ?? 'barras') ? sw(i, 'serie', ['mapa-calor', 'sankey'].includes(w.grafica) ? 'Segunda dimensión' : 'Dividir en series por', dims(), w.serie, '— una sola serie —') : ''}
    <div class="st-grid">${sw(i, 'medida', 'Medida', MEDIDAS, w.medida ?? 'conteo')}${w.medida && w.medida !== 'conteo' ? sw(i, 'campo', 'Campo', nums(), w.campo, '—') : '<span></span>'}</div>
    <div class="st-grid">${sw(i, 'orden', 'Orden', [['natural', 'Natural'], ['valor-desc', 'Mayor a menor'], ['valor-asc', 'Menor a mayor'], ['nombre', 'Por nombre']], w.orden ?? 'natural')}${tw(i, 'limite', 'Máx. categorías', w.limite, 'number', 'min="0"')}</div>
    <div class="st-grid">${cw(i, 'etiquetas', 'Etiquetas de valor', w.etiquetas)}${cw(i, 'apilado', 'Apilado', w.apilado)}${cw(i, 'suave', 'Líneas suaves', w.suave)}${cw(i, 'filtrar', 'Filtrar al hacer clic', w.filtrar !== false)}</div>${tw(i, 'alto', 'Alto (px)', w.alto, 'number', 'min="160" step="20"')}`;
  if (t === 'mapa') h += `<div class="st-grid">${sw(i, 'medida', 'Medida', MEDIDAS, w.medida ?? 'conteo')}${w.medida && w.medida !== 'conteo' ? sw(i, 'campo', 'Campo', nums(), w.campo, '—') : '<span></span>'}</div>${sw(i, 'rampa', 'Rampa de color', Object.entries(RAMPAS).map(([k, r]) => [k, r.nombre]), w.rampa ?? 'azul')}${sw(i, 'mapaEtiquetas', 'Etiquetas', [['ninguna', 'Ninguna'], ['nombres', 'Nombres'], ['valores', 'Valores']], w.mapaEtiquetas ?? 'ninguna')}${tw(i, 'leyendaTitulo', 'Título de la leyenda', w.leyendaTitulo)}<p class="mg-help">Requiere un campo <code>codigo</code> con el código DIVIPOLA de 5 dígitos (47001…).</p>`;
  if (t === 'tabla') h += `<p class="st-n">Columnas</p><div class="st-grid">${S.campos.map((c) => `<label class="st-chk"><input type="checkbox" data-wi="${i}" data-wcol="${esc(c.campo)}" ${(w.columnas ?? []).includes(c.campo) ? 'checked' : ''}> ${esc(c.campo)}</label>`).join('')}</div>${tw(i, 'limite', 'Máx. filas', w.limite, 'number', 'min="1"')}`;
  if (t === 'texto' || t === 'alerta') h += `<label class="st-f"><span>Contenido</span><textarea class="mg-textarea mg-input" rows="3" data-wi="${i}" data-wk="contenido">${esc(w.contenido ?? '')}</textarea></label>${t === 'alerta' ? sw(i, 'tono', 'Tipo', [['info', 'Info'], ['exito', 'Éxito'], ['aviso', 'Aviso'], ['peligro', 'Peligro']], w.tono ?? 'info') : ''}`;
  return h;
}
function panel() {
  const abiertos = new Set($$('#panel details[data-w][open]').map((d) => d.dataset.w));
  $('#panel').innerHTML = `
  <details open><summary>1 · Tablero y datos</summary><div class="st__body">
    <label class="st-f"><span>Título</span><input class="mg-input" data-k="titulo" value="${esc(S.titulo)}"></label><label class="st-f"><span>Subtítulo</span><input class="mg-input" data-k="subtitulo" value="${esc(S.subtitulo)}"></label>
    <label class="st-f"><span>Tema</span><select class="mg-select" data-k="tema"><option value="claro" ${S.tema === 'claro' ? 'selected' : ''}>Claro</option><option value="oscuro" ${S.tema === 'oscuro' ? 'selected' : ''}>Oscuro</option></select></label>
    <label class="st-f"><span>Fuente de datos</span><select class="mg-select" data-k="fuente">${opt(Object.entries(FUENTES).map(([k, v]) => [k, v.nombre]), S.fuente)}</select></label>
    ${S.fuente === 'csv' ? `<label class="st-f"><span>Pegue su CSV (encabezados en la primera fila)</span><textarea class="mg-textarea mg-input" id="csv" rows="5">${esc(S.csv)}</textarea></label><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="csv">Usar estos datos</button>` : `<p class="mg-help">${S.registros.length} registros. Campos: ${S.campos.map((c) => `<code>${esc(c.campo)}</code>`).join(', ')}. Datos ficticios.</p>`}
    <p class="st-n">Plantilla (reemplaza los widgets)</p><div class="mg-row">${['ejecutivo', 'operativo', 'territorial', 'vacio'].map((p) => `<button class="mg-btn mg-btn--sm ${S.plantilla === p ? '' : 'mg-btn--secondary'}" data-plantilla="${p}" ${p !== 'vacio' && S.fuente !== 'radicados' && p !== 'ejecutivo' ? 'disabled' : ''}>${p === 'vacio' ? 'Vacío' : p[0].toUpperCase() + p.slice(1)}</button>`).join('')}</div>
  </div></details>
  <details open><summary>2 · Filtros globales (${S.filtros.length})</summary><div class="st__body"><p class="mg-help">Aparecen como listas desplegables arriba del tablero.</p><div class="st-grid">${S.campos.filter((c) => (c.tipo === 'texto' || c.tipo === 'fecha') && c.campo !== 'id').flatMap((c) => c.tipo === 'fecha' ? [[c.campo + ':mes', c.campo + ' (mes)']] : c.unicos <= 60 ? [[c.campo, c.campo]] : []).map(([v, l]) => `<label class="st-chk"><input type="checkbox" data-filtro="${esc(v)}" ${S.filtros.includes(v) ? 'checked' : ''}> ${esc(l)}</label>`).join('')}</div></div></details>
  <details open><summary>3 · Widgets (${S.widgets.length})</summary><div class="st__body">
    ${S.widgets.map((w, i) => `<details data-w="${i}" class="st-w" ${abiertos.has(String(i)) ? 'open' : ''}><summary style="font-size:.82rem;padding:.55rem .75rem">${i + 1}. <b>${esc(w.tipo)}</b> · ${esc(w.titulo || '(sin título)')} <span style="margin-left:auto;display:inline-flex;gap:2px"><button type="button" class="mg-btn mg-btn--ghost mg-btn--sm" data-mv="${i},-1" aria-label="Subir">↑</button><button type="button" class="mg-btn mg-btn--ghost mg-btn--sm" data-mv="${i},1" aria-label="Bajar">↓</button><button type="button" class="mg-btn mg-btn--ghost mg-btn--sm" data-del="${i}" aria-label="Quitar widget ${i + 1}">✕</button></span></summary><div class="st__body">${editorW(w, i)}</div></details>`).join('')}
    <div class="mg-row">${[['kpi', '+ KPI'], ['grafica', '+ Gráfica'], ['mapa', '+ Mapa'], ['tabla', '+ Tabla'], ['texto', '+ Texto']].map(([t, l]) => `<button class="mg-btn mg-btn--secondary mg-btn--sm" data-add="${t}">${l}</button>`).join('')}</div>
  </div></details>`;
}
function nuevoW(t) { const d = dims()[0]?.[0] ?? '', n = nums()[0]?.[0] ?? ''; return { kpi: { tipo: 'kpi', titulo: 'Nuevo indicador', medida: 'conteo', icono: 'archivo', col: 3 }, grafica: { tipo: 'grafica', grafica: 'barras', titulo: 'Nueva gráfica', agrupar: d, orden: 'valor-desc', limite: 10, col: 6, alto: 300 }, mapa: { tipo: 'mapa', titulo: 'Nuevo mapa', medida: 'conteo', rampa: 'azul', col: 6 }, tabla: { tipo: 'tabla', titulo: 'Nueva tabla', limite: 50, col: 12, columnas: S.campos.slice(0, 6).map((c) => c.campo) }, texto: { tipo: 'texto', titulo: 'Nota', contenido: 'Escriba aquí el texto del tablero.', col: 12 } }[t]; }

document.addEventListener('input', onCampo); document.addEventListener('change', onCampo);
function onCampo(e) {
  const t = e.target; if (!t.closest?.('#app')) return; const d = t.dataset; const cambio = e.type === 'change';
  if (d.k) { S[d.k] = t.value; if (cambio && d.k === 'fuente') { cargar(true).then(() => { plantilla('ejecutivo'); panel(); sync(); }); return; } sync(); return; }
  if (d.filtro) { const s = new Set(S.filtros); t.checked ? s.add(d.filtro) : s.delete(d.filtro); S.filtros = [...s]; sync(); return; }
  if (d.wcol !== undefined) { const w = S.widgets[+d.wi]; const s = new Set(w.columnas ?? []); t.checked ? s.add(d.wcol) : s.delete(d.wcol); w.columnas = S.campos.map((c) => c.campo).filter((c) => s.has(c)); sync(); return; }
  if (d.wi !== undefined && d.wk) { const w = S.widgets[+d.wi]; let v = t.type === 'checkbox' ? t.checked : t.value; if (['col', 'alto', 'limite'].includes(d.wk)) v = v === '' ? '' : Number(v); w[d.wk] = v; if (d.wk === 'rampa' || d.wk === 'mapaEtiquetas') {} if (cambio && ['tipo', 'grafica', 'medida'].includes(d.wk)) { if (d.wk === 'tipo') Object.assign(w, nuevoW(v), { tipo: v, titulo: w.titulo, col: w.col }); panel(); } sync(); }
}
document.addEventListener('click', async (e) => {
  const b = e.target.closest('button'); if (!b || !b.closest('#app')) return; const d = b.dataset;
  if (d.plantilla) { plantilla(d.plantilla); panel(); sync(); return; }
  if (d.add) { S.widgets.push(nuevoW(d.add)); panel(); sync(); return; }
  if (d.del !== undefined) { e.preventDefault(); S.widgets.splice(+d.del, 1); panel(); sync(); return; }
  if (d.mv) { e.preventDefault(); const [i, s] = d.mv.split(',').map(Number); const j = i + s; if (j >= 0 && j < S.widgets.length) { [S.widgets[i], S.widgets[j]] = [S.widgets[j], S.widgets[i]]; panel(); sync(); } return; }
  const a = d.acc; if (!a) return;
  if (a === 'csv') { S.csv = $('#csv').value; await cargar(true); plantilla('ejecutivo'); panel(); sync(); toast(S.registros.length + ' registros cargados', 'exito'); }
  else if (a === 'link') copiar(location.href);
  else if (a === 'pagina') { const o = window.__cod; const i = o.html.indexOf('<!-- ② '); const cuerpo = o.html.slice(i).split(base() + '/cdn/v1/').join('./cdn/v1/'); descargar('mi-tablero.html', paginaAutonoma(S.titulo || 'Mi tablero', cuerpo)); toast('Página descargada: descomprima gob-cdn-v1.zip a su lado', 'exito'); }
});
