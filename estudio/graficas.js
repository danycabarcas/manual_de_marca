/* Estudio de gráficas · Gobernación del Magdalena
   Configura <gob-grafica> visualmente y genera el código (HTML/CDN, Angular, React, JSON). */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const CDN = new URL('../cdn/v1/', location.href).href;
const DETECTADA = new URL('../', location.href).href.replace(/\/$/, '');
const base = () => { try { return localStorage.getItem('mg-base') || DETECTADA; } catch { return DETECTADA; } };
const MARCA = [['#0071BB', 'Azul'], ['#00B7D9', 'Cian'], ['#9FD7E5', 'Celeste'], ['#F7003C', 'Rojo'], ['#FEC800', 'Amarillo'], ['#69B75E', 'Verde'], ['#A28034', 'Ocre'], ['#5618BA', 'Violeta'], ['#0B2239', 'Azul-noche'], ['#606060', 'Gris']];
const DEF = { tipo: 'barras', colores: 'institucional', titulo: '', subtitulo: '', leyenda: true, leyendaPosicion: 'arriba', etiquetas: false, apilado: false, suave: false, formato: 'numero', unidad: '', tituloEjeX: '', tituloEjeY: '', min: 0, max: 100, patrones: false, animacion: true, tema: 'claro', altura: 360, centro: '' };
const KEBAB = { leyendaPosicion: 'leyenda-posicion', tituloEjeX: 'titulo-eje-x', tituloEjeY: 'titulo-eje-y' };
const CART = ['barras', 'barras-horizontal', 'lineas', 'area'];
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];

let PALETAS = {}, TIPOS = {}, vista, ultimoColor = null, tab = 'html';
const S = {
  ...structuredClone(DEF), paletaNombre: 'institucional', coloresPers: ['#0071BB', '#00B7D9', '#FEC800', '#69B75E'],
  umbrales: [[0.5, '#F7003C'], [0.8, '#FEC800'], [1, '#69B75E']], usarUmbrales: true,
  dCart: { categorias: [...MESES], series: [{ nombre: 'Resueltos', valores: [78, 100, 123, 56, 79, 102] }, { nombre: 'Pendientes', valores: [114, 47, 70, 93, 116, 49] }] },
  dPartes: [{ nombre: 'Santa Marta', valor: 560 }, { nombre: 'Norte', valor: 420 }, { nombre: 'Río', valor: 310 }, { nombre: 'Centro', valor: 240 }, { nombre: 'Sur', valor: 180 }],
  dGauge: { valor: 72, nombre: 'Avance del plan' },
  dHeat: { x: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'], y: ['8h', '10h', '12h', '14h', '16h'], m: [[42, 3, 24, 45, 6], [56, 24, 52, 20, 48], [10, 45, 20, 55, 30], [24, 6, 48, 30, 12], [38, 27, 16, 5, 54]] },
  dJson: { calendario: JSON.stringify(Array.from({ length: 120 }, (_, i) => ({ fecha: new Date(Date.UTC(2026, 4, 1 + i)).toISOString().slice(0, 10), valor: Math.round(Math.abs(Math.sin(i * 1.7)) * 20) }))), gantt: JSON.stringify([{ nombre: 'Diagnóstico', inicio: '2026-01-05', fin: '2026-02-15', avance: 1, grupo: 'a' }, { nombre: 'Diseño', inicio: '2026-02-10', fin: '2026-04-10', avance: 0.8, grupo: 'a' }, { nombre: 'Desarrollo', inicio: '2026-04-01', fin: '2026-08-30', avance: 0.4, grupo: 'b' }, { nombre: 'Pruebas', inicio: '2026-08-01', fin: '2026-09-30', avance: 0, grupo: 'c' }], null, 1) },
  dSankey: [{ origen: 'Nación', destino: 'Salud', valor: 40 }, { origen: 'Nación', destino: 'Educación', valor: 30 }, { origen: 'Regalías', destino: 'Vías', valor: 35 }, { origen: 'Regalías', destino: 'Educación', valor: 15 }],
};

(async function init() {
  await import(CDN + 'gob.js'); await window.gob.cargar('gob-grafica');
  const C = customElements.get('gob-grafica'); PALETAS = C.paletas; TIPOS = C.tipos;
  $('#app').innerHTML = shell(); vista = $('#vista'); restaurar();
  const pre = new URLSearchParams(location.search).get('preset');
  if (pre) preset(pre); else { panel(); sync(true); }
  const bi = $('#baseInput'); bi.value = base();
  bi.addEventListener('input', () => { try { localStorage.setItem('mg-base', bi.value.replace(/\/$/, '') || DETECTADA); } catch {} sync(true); });
  $('#baseReset').addEventListener('click', () => { try { localStorage.removeItem('mg-base'); } catch {} bi.value = DETECTADA; sync(true); });
  vista.addEventListener('gob-grafica-click', (e) => { $('#evt').textContent = 'gob-grafica-click → ' + JSON.stringify({ nombre: e.detail.nombre, serie: e.detail.serie, valor: e.detail.valor }); });
})();

// ------------------------------------------------------------------ datos y configuración efectiva
function datos() {
  const t = S.tipo;
  if (CART.includes(t) || t === 'radar') return { categorias: [...S.dCart.categorias], series: S.dCart.series.map((s) => ({ nombre: s.nombre, valores: s.valores.map(Number) })) };
  if (t === 'torta' || t === 'dona' || t === 'treemap' || t === 'embudo') return S.dPartes.map((p) => ({ nombre: p.nombre, valor: Number(p.valor) }));
  if (t === 'calendario') return JSON.parse(S.dJson.calendario);
  if (t === 'gantt') return JSON.parse(S.dJson.gantt);
  if (t === 'gauge') return { valor: Number(S.dGauge.valor), nombre: S.dGauge.nombre };
  if (t === 'mapa-calor') { const v = []; S.dHeat.m.forEach((fila, j) => fila.forEach((n, i) => v.push([i, j, Number(n)]))); return { x: [...S.dHeat.x], y: [...S.dHeat.y], valores: v }; }
  if (t === 'sankey') { const n = []; S.dSankey.forEach((e) => { for (const k of [e.origen, e.destino]) if (k && !n.includes(k)) n.push(k); }); return { nodos: n, enlaces: S.dSankey.map((e) => ({ origen: e.origen, destino: e.destino, valor: Number(e.valor) })) }; }
}
function config() {
  const c = {};
  for (const k of Object.keys(DEF)) { if (k === 'colores') continue; if (S[k] !== DEF[k]) c[k] = S[k]; }
  c.tipo = S.tipo; if (S.paletaNombre === 'personalizada') c.colores = [...S.coloresPers]; else if (S.paletaNombre !== 'institucional') c.colores = S.paletaNombre;
  if (S.tipo === 'gauge' && S.usarUmbrales) c.umbrales = S.umbrales.map((u) => [Number(u[0]), u[1]]);
  if (!['gauge', 'dona'].includes(S.tipo)) delete c.centro; if (S.tipo !== 'gauge') { delete c.min; delete c.max; }
  c.datos = datos(); return c;
}
function aplicar() { vista.config = { ...structuredClone(DEF), umbrales: undefined, ...config() }; $('#vistaBox').dataset.tema = S.tema; }

// ------------------------------------------------------------------ generación de código
const json = (v, ind = 2) => JSON.stringify(v, null, ind);
const sangria = (t, n) => t.split('\n').map((l, i) => (i ? ' '.repeat(n) : '') + l).join('\n');
function partir(cfg) {
  const attrs = [], props = {};
  for (const [k, v] of Object.entries(cfg)) {
    if (v === undefined) continue; const a = KEBAB[k] || k;
    if (typeof v === 'string' || typeof v === 'number') attrs.push(`${a}="${esc(v)}"`);
    else if (typeof v === 'boolean') { if (v && DEF[k] !== true) attrs.push(a); else if (!v && DEF[k] !== false) props[k] = false; }
    else props[k] = v;
  }
  return { attrs, props };
}
const manejador = () => `\n  grafica.addEventListener('gob-grafica-click', (e) => {\n    const { nombre, serie, valor } = e.detail;\n    // ← aquí su lógica: filtrar un tablero, abrir detalle, navegar…\n    console.log(nombre, serie, valor);\n  });`;
function codigoHTML() {
  const { attrs, props } = partir(config()); const todos = ['id="grafica"', ...attrs];
  return `<!-- 1. Cargar el componente (una sola etiqueta, sin build; ECharts se descarga solo cuando hay una gráfica) -->\n<script type="module" src="${base()}/cdn/v1/gob.js"></script>\n\n<!-- 2. La gráfica (responsive: ocupa el ancho de su contenedor) -->\n<div style="max-width:720px">\n  <gob-grafica ${todos.join('\n    ')}>\n  </gob-grafica>\n</div>\n\n<script type="module">\n  const grafica = document.getElementById('grafica');\n  grafica.config = ${sangria(json(props), 2)};${manejador()}\n</script>`;
}
function codigoAngular() {
  const { attrs, props } = partir(config()); const campos = Object.entries(props).map(([k, v]) => `  ${k} = ${sangria(json(v), 2)};`).join('\n\n');
  const enl = Object.keys(props).map((k) => `\n    [${k}]="${k}"`).join('');
  return `// 1) src/index.html — cargar el componente\n<script type="module" src="${base()}/cdn/v1/gob.js"></script>\n\n// 2) grafica.component.ts\nimport { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';\n\n@Component({\n  selector: 'app-grafica',\n  standalone: true,\n  schemas: [CUSTOM_ELEMENTS_SCHEMA],\n  template: \`\n  <gob-grafica${attrs.length ? '\n    ' + attrs.join('\n    ') : ''}${enl}\n    (gob-grafica-click)="alClic($event)">\n  </gob-grafica>\`,\n})\nexport class GraficaComponent {\n${campos}\n\n  alClic(e: Event) {\n    const { nombre, serie, valor } = (e as CustomEvent).detail;\n    console.log(nombre, serie, valor);\n  }\n}`;
}
function codigoReact() {
  return `// Grafica.jsx  ·  React / Next.js (solo cliente)\n'use client'; // Next.js: el componente se registra en el navegador\nimport { useEffect, useRef } from 'react';\n\nconst config = ${sangria(json(config()), 0)};\n\nexport default function Grafica({ onClick }) {\n  const ref = useRef(null);\n\n  useEffect(() => {\n    import(/* webpackIgnore: true */ '${base()}/cdn/v1/gob.js').then(() => {\n      if (ref.current) ref.current.config = config;\n    });\n    const el = ref.current;\n    const h = (e) => onClick?.(e.detail);\n    el?.addEventListener('gob-grafica-click', h);\n    return () => el?.removeEventListener('gob-grafica-click', h);\n  }, []);\n\n  return <gob-grafica ref={ref} />;\n}\n\n// TypeScript: declare namespace JSX { interface IntrinsicElements { 'gob-grafica': any } }`;
}
const codigoJSON = () => json(config());

// ------------------------------------------------------------------ interfaz
const chk = (k, t) => `<label class="st-chk"><input type="checkbox" data-k="${k}" ${S[k] ? 'checked' : ''}> ${t}</label>`;
const sel = (k, t, ops) => `<label class="st-f"><span>${t}</span><select class="mg-select" data-k="${k}">${ops.map(([v, l]) => `<option value="${esc(v)}" ${String(S[k]) === String(v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>`;
const txt = (k, t, ph = '') => `<label class="st-f"><span>${t}</span><input class="mg-input" data-k="${k}" value="${esc(S[k])}" placeholder="${esc(ph)}"></label>`;
const num = (k, t, extra = '') => `<label class="st-f"><span>${t}</span><input class="mg-input" type="number" data-k="${k}" value="${esc(S[k])}" ${extra}></label>`;
const color = (k, val, t, al) => `<label class="st-c"><span>${t}</span><input type="color" data-ck="${k}" aria-label="${esc(al || t || 'Color')}" value="${/^#[0-9a-f]{6}$/i.test(val) ? val : '#0071BB'}"></label>`;
const swatches = () => `<span class="st-sw">${MARCA.map(([c, n]) => `<button type="button" title="${n} ${c}" aria-label="${n} ${c}" style="background:${c}" data-sw="${c}"></button>`).join('')}</span>`;
const num2 = (attr, v, ex = '') => `<input class="mg-input" type="number" step="any" ${attr} value="${esc(v)}" ${ex}>`;

function shell() {
  return `
  <div class="baseurl"><b>URL base del CDN:</b><input class="mg-input" id="baseInput" aria-label="URL base"><button class="mg-btn mg-btn--ghost mg-btn--sm" id="baseReset">Autodetectar</button><span class="mg-help" style="width:100%;margin:0">El código generado carga el componente desde <code class="inline">URL_BASE/cdn/v1/gob.js</code>.</span></div>
  <div class="st">
    <div class="st__panel" id="panel"></div>
    <div class="st__main">
      <div class="st__bar"><div class="mg-row"><b style="font-size:.8rem">Ejemplos:</b>
        <button class="mg-btn mg-btn--secondary mg-btn--sm" data-preset="barras">Barras</button><button class="mg-btn mg-btn--secondary mg-btn--sm" data-preset="tendencia">Tendencia</button>
        <button class="mg-btn mg-btn--secondary mg-btn--sm" data-preset="dona">Dona</button><button class="mg-btn mg-btn--secondary mg-btn--sm" data-preset="gauge">Indicador</button>
        <button class="mg-btn mg-btn--secondary mg-btn--sm" data-preset="radar">Radar</button><button class="mg-btn mg-btn--secondary mg-btn--sm" data-preset="calor">Mapa de calor</button>
        <button class="mg-btn mg-btn--secondary mg-btn--sm" data-preset="treemap">Presupuesto</button><button class="mg-btn mg-btn--secondary mg-btn--sm" data-preset="sankey">Flujo</button><button class="mg-btn mg-btn--secondary mg-btn--sm" data-preset="embudo">Embudo</button><button class="mg-btn mg-btn--secondary mg-btn--sm" data-preset="calendario">Calendario</button><button class="mg-btn mg-btn--secondary mg-btn--sm" data-preset="gantt">Gantt</button></div></div>
      <div class="st__vista" id="vistaBox" data-tema="claro"><gob-grafica id="vista"></gob-grafica></div>
      <p class="mg-help" id="evt" aria-live="polite" style="margin:.4rem 0 1rem;font-family:var(--mg-font-mono)">Haga clic en una barra, sector o punto para ver el evento <code class="inline">gob-grafica-click</code>…</p>
      <div class="mg-row" style="margin-bottom:1rem"><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="png">⬇ PNG</button><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="csvdl">⬇ CSV de los datos</button><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="print">🖨 Imprimir</button><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="link">🔗 Copiar enlace</button><button class="mg-btn mg-btn--ghost mg-btn--sm" data-acc="reset">Restablecer</button></div>
      <div class="mg-tabs" role="tablist" aria-label="Formato del código" id="tabs"><button role="tab" aria-selected="true" class="mg-tab is-active" data-t="html">HTML (CDN)</button><button role="tab" aria-selected="false" class="mg-tab" data-t="ng">Angular</button><button role="tab" aria-selected="false" class="mg-tab" data-t="react">React / Next.js</button><button role="tab" aria-selected="false" class="mg-tab" data-t="json">Config JSON</button></div>
      <div class="code" style="margin-top:0;border-top-left-radius:0"><div class="code__bar"><span id="codeLbl">index.html</span><button data-codecopy>Copiar</button></div><pre tabindex="0"><code id="code"></code></pre></div>
    </div>
  </div>`;
}

function editorDatos() {
  const t = S.tipo;
  if (CART.includes(t) || t === 'radar') {
    const d = S.dCart;
    return `<div class="st-tabla"><table class="mg-table"><thead><tr><th>${t === 'radar' ? 'Eje' : 'Categoría'}</th>${d.series.map((s, i) => `<th><input class="mg-input" aria-label="Nombre de la serie ${i + 1}" data-sn="${i}" value="${esc(s.nombre)}"></th>`).join('')}<th></th></tr></thead><tbody>
      ${d.categorias.map((c, i) => `<tr><td><input class="mg-input" aria-label="Categoría ${i + 1}" data-cn="${i}" value="${esc(c)}"></td>${d.series.map((s, j) => `<td>${num2(`data-sv="${j},${i}" aria-label="${esc(s.nombre)}, ${esc(c)}"`, s.valores[i] ?? '')}</td>`).join('')}<td><button class="mg-btn mg-btn--ghost mg-btn--sm" data-delrow="${i}" aria-label="Quitar fila ${i + 1}">✕</button></td></tr>`).join('')}</tbody></table></div>
      <div class="mg-row"><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="addrow">+ Fila</button><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="addser">+ Serie</button>${d.series.length > 1 ? '<button class="mg-btn mg-btn--ghost mg-btn--sm" data-acc="delser">− Última serie</button>' : ''}</div>`;
  }
  if (t === 'torta' || t === 'dona' || t === 'treemap' || t === 'embudo') {
    return `<div class="st-tabla"><table class="mg-table"><thead><tr><th>Nombre</th><th>Valor</th><th></th></tr></thead><tbody>${S.dPartes.map((p, i) => `<tr><td><input class="mg-input" aria-label="Nombre ${i + 1}" data-pn="${i}" value="${esc(p.nombre)}"></td><td>${num2(`data-pv="${i}" aria-label="Valor de ${esc(p.nombre)}"`, p.valor)}</td><td><button class="mg-btn mg-btn--ghost mg-btn--sm" data-delpart="${i}" aria-label="Quitar ${esc(p.nombre)}">✕</button></td></tr>`).join('')}</tbody></table></div><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="addpart">+ Fila</button>`;
  }
  if (t === 'gauge') return `<div class="st-grid">${num('min', 'Mínimo')}${num('max', 'Máximo')}</div><label class="st-f"><span>Valor</span>${num2('data-gv="valor"', S.dGauge.valor)}</label><label class="st-f"><span>Etiqueta</span><input class="mg-input" data-gv="nombre" value="${esc(S.dGauge.nombre)}"></label>`;
  if (t === 'mapa-calor') { const h = S.dHeat; return `<label class="st-f"><span>Columnas (separadas por coma)</span><input class="mg-input" data-hx="x" value="${esc(h.x.join(', '))}"></label><label class="st-f"><span>Filas (separadas por coma)</span><input class="mg-input" data-hx="y" value="${esc(h.y.join(', '))}"></label><div class="st-tabla"><table class="mg-table"><thead><tr><th></th>${h.x.map((x) => `<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${h.y.map((y, j) => `<tr><td><b>${esc(y)}</b></td>${h.x.map((_, i) => `<td>${num2(`data-hm="${j},${i}" aria-label="${esc(y)}, ${esc(h.x[i])}"`, h.m[j]?.[i] ?? 0)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; }
  if (t === 'calendario' || t === 'gantt') return `<label class="st-f"><span>Datos (JSON) — ${t === 'gantt' ? '[{ nombre, inicio, fin, avance?, grupo? }]' : '[{ fecha: "2026-05-01", valor: 12 }]'}</span><textarea class="mg-textarea mg-input" rows="8" data-json="${t}" spellcheck="false" style="font-family:ui-monospace,monospace;font-size:.75rem">${esc(S.dJson[t])}</textarea></label>`;
  if (t === 'sankey') return `<div class="st-tabla"><table class="mg-table"><thead><tr><th>Origen</th><th>Destino</th><th>Valor</th><th></th></tr></thead><tbody>${S.dSankey.map((e, i) => `<tr><td><input class="mg-input" aria-label="Origen ${i + 1}" data-so="${i}" value="${esc(e.origen)}"></td><td><input class="mg-input" aria-label="Destino ${i + 1}" data-sd="${i}" value="${esc(e.destino)}"></td><td>${num2(`data-sv2="${i}" aria-label="Valor ${i + 1}"`, e.valor)}</td><td><button class="mg-btn mg-btn--ghost mg-btn--sm" data-delsk="${i}" aria-label="Quitar enlace ${i + 1}">✕</button></td></tr>`).join('')}</tbody></table></div><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="addsk">+ Enlace</button>`;
  return '';
}

function panel() {
  const t = S.tipo; const cart = CART.includes(t);
  const cols = S.paletaNombre === 'personalizada' ? S.coloresPers : (PALETAS[S.paletaNombre]?.colores ?? []);
  $('#panel').innerHTML = `
  <details open><summary>1 · Tipo y apariencia</summary><div class="st__body">
    ${sel('tipo', 'Tipo de gráfica', Object.entries(TIPOS))}
    ${sel('tema', 'Tema', [['claro', 'Claro'], ['oscuro', 'Oscuro']])}
    ${txt('titulo', 'Título', 'p. ej. Radicados por mes')}${txt('subtitulo', 'Subtítulo')}
    <div class="st-grid">${chk('leyenda', 'Leyenda')}${chk('etiquetas', 'Etiquetas de valor')}${cart ? chk('apilado', 'Apilado') : ''}${t === 'lineas' || t === 'area' ? chk('suave', 'Líneas suaves') : ''}${chk('patrones', 'Patrones (daltonismo)')}${chk('animacion', 'Animación')}</div>
    ${S.leyenda ? sel('leyendaPosicion', 'Posición de la leyenda', [['arriba', 'Arriba'], ['abajo', 'Abajo'], ['derecha', 'Derecha']]) : ''}
    <div class="st-grid">${sel('formato', 'Formato', [['numero', 'Número'], ['compacto', 'Compacto (1,2 M)'], ['cop', 'Pesos COP'], ['porcentaje', 'Porcentaje (0–1)']])}${txt('unidad', 'Unidad', 'hab., %…')}</div>
    ${cart ? `<div class="st-grid">${txt('tituloEjeX', 'Título eje X')}${txt('tituloEjeY', 'Título eje Y')}</div>` : ''}
    ${t === 'dona' ? txt('centro', 'Texto central', 'vacío = total') : ''}
    ${num('altura', 'Altura (px)', 'min="200" max="800" step="20"')}
  </div></details>
  <details open><summary>2 · Colores</summary><div class="st__body">
    ${sel('paletaNombre', 'Paleta', [...Object.entries(PALETAS).map(([k, p]) => [k, p.nombre]), ['personalizada', 'Personalizada…']])}
    <div class="st-rampa" style="background:linear-gradient(90deg,${(cols.length > 1 ? cols : [...cols, ...cols]).join(',')})"></div>
    <p class="st-n">Colores de la paleta (el primero se usa primero)</p>
    <div class="st-grid">${cols.map((c, i) => `<div>${color('pal:' + i, c, 'Color ' + (i + 1))}</div>`).join('')}</div>
    ${S.paletaNombre === 'personalizada' ? `<div class="mg-row"><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="addcol">+ Color</button>${S.coloresPers.length > 2 ? '<button class="mg-btn mg-btn--ghost mg-btn--sm" data-acc="delcol">− Último</button>' : ''}</div>` : '<p class="mg-help">Edite cualquier color para pasar a «Personalizada».</p>'}
    ${t === 'gauge' ? `${chk('usarUmbrales', 'Color según umbrales')}${S.usarUmbrales ? `<p class="st-n">Hasta qué fracción (0–1) aplica cada color</p>${S.umbrales.map((u, i) => `<div class="st-grid"><label class="st-f"><span>Hasta</span>${num2(`data-um="${i}"`, u[0], 'min="0" max="1" step=".05"')}</label>${color('um:' + i, u[1], 'Color')}</div>`).join('')}` : ''}` : ''}
    <p class="st-n">Paleta institucional (clic en un selector de color y luego en una muestra)</p>${swatches()}
  </div></details>
  <details open><summary>3 · Datos</summary><div class="st__body">
    <div class="mg-row"><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="ejemplo">Datos de ejemplo</button></div>
    ${CART.includes(t) || t === 'radar' || t === 'torta' || t === 'dona' || t === 'treemap' ? `<label class="st-f"><span>Pegar CSV ${CART.includes(t) || t === 'radar' ? '(categoría; serie1; serie2…, con encabezado)' : '(nombre; valor)'}</span><textarea class="mg-textarea mg-input" id="csv" rows="3"></textarea></label><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="csv">Aplicar CSV</button>` : ''}
    ${editorDatos()}
    ${t === 'treemap' ? '<p class="mg-help">El treemap admite niveles (<code>hijos</code>) por código; el editor trabaja el primer nivel.</p>' : ''}
  </div></details>`;
}

function sync(primera) {
  aplicar();
  const m = { html: [codigoHTML, 'index.html'], ng: [codigoAngular, 'grafica.component.ts'], react: [codigoReact, 'Grafica.jsx'], json: [codigoJSON, 'config.json'] }[tab];
  $('#code').textContent = m[0](); $('#codeLbl').textContent = m[1];
  if (!primera) guardar();
}
let tg; function guardar() { clearTimeout(tg); tg = setTimeout(() => { try { history.replaceState(null, '', '#c=' + btoa(unescape(encodeURIComponent(JSON.stringify(S))))); } catch {} }, 400); }
function restaurar() { try { const m = location.hash.match(/#c=(.+)/); if (m) Object.assign(S, JSON.parse(decodeURIComponent(escape(atob(m[1]))))); } catch {} }
function say(t) { const d = document.querySelector('.toast-ok'); if (d) { d.textContent = t; d.classList.add('show'); setTimeout(() => d.classList.remove('show'), 1600); } }

// ------------------------------------------------------------------ eventos
function onCampo(e) {
  const t = e.target; if (!t.closest?.('#app')) return; const cambio = e.type === 'change'; const d = t.dataset;
  if (d.k) { const k = d.k; let v = t.type === 'checkbox' ? t.checked : t.value; if (['altura', 'min', 'max'].includes(k)) v = Number(v); S[k] = v;
    if (cambio && ['tipo', 'leyenda', 'paletaNombre', 'usarUmbrales'].includes(k)) panel(); sync(); return; }
  if (d.ck) { const [g, id] = [d.ck.split(':')[0], d.ck.split(':')[1]]; const c = t.value;
    if (g === 'pal') { if (S.paletaNombre !== 'personalizada') { S.coloresPers = [...(PALETAS[S.paletaNombre]?.colores ?? S.coloresPers)]; S.paletaNombre = 'personalizada'; } S.coloresPers[+id] = c; if (cambio) panel(); }
    else if (g === 'um') S.umbrales[+id][1] = c; sync(); return; }
  if (d.um !== undefined) { S.umbrales[+d.um][0] = Number(t.value); sync(); return; }
  if (d.sn !== undefined) { S.dCart.series[+d.sn].nombre = t.value; sync(); return; }
  if (d.cn !== undefined) { S.dCart.categorias[+d.cn] = t.value; sync(); return; }
  if (d.sv !== undefined) { const [j, i] = d.sv.split(',').map(Number); S.dCart.series[j].valores[i] = t.value === '' ? 0 : Number(t.value); sync(); return; }
  if (d.pn !== undefined) { S.dPartes[+d.pn].nombre = t.value; sync(); return; }
  if (d.pv !== undefined) { S.dPartes[+d.pv].valor = Number(t.value); sync(); return; }
  if (d.gv) { S.dGauge[d.gv] = d.gv === 'valor' ? Number(t.value) : t.value; sync(); return; }
  if (d.json) { try { JSON.parse(t.value); S.dJson[d.json] = t.value; t.style.borderColor = ''; sync(); } catch { t.style.borderColor = '#F7003C'; } return; }
  if (d.hx) { S.dHeat[d.hx] = t.value.split(',').map((x) => x.trim()).filter(Boolean); S.dHeat.m = S.dHeat.y.map((_, j) => S.dHeat.x.map((__, i) => S.dHeat.m[j]?.[i] ?? 0)); if (cambio) panel(); sync(); return; }
  if (d.hm !== undefined) { const [j, i] = d.hm.split(',').map(Number); S.dHeat.m[j][i] = Number(t.value); sync(); return; }
  if (d.so !== undefined) { S.dSankey[+d.so].origen = t.value; sync(); return; }
  if (d.sd !== undefined) { S.dSankey[+d.sd].destino = t.value; sync(); return; }
  if (d.sv2 !== undefined) { S.dSankey[+d.sv2].valor = Number(t.value); sync(); return; }
}
document.addEventListener('input', onCampo); document.addEventListener('change', onCampo);
document.addEventListener('focusin', (e) => { if (e.target.dataset?.ck) ultimoColor = e.target; });
document.addEventListener('click', (e) => {
  if (e.target.dataset?.ck) ultimoColor = e.target;
  const b = e.target.closest('button'); if (!b || !b.closest('#app')) return; const d = b.dataset;
  if (d.sw) { if (ultimoColor) { ultimoColor.value = d.sw; ultimoColor.dispatchEvent(new Event('input', { bubbles: true })); ultimoColor.dispatchEvent(new Event('change', { bubbles: true })); } else say('Primero haga clic en un selector de color'); return; }
  if (d.t) { tab = d.t; $$('#tabs .mg-tab').forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', x === b ? 'true' : 'false'); }); sync(true); return; }
  if (d.preset) return preset(d.preset);
  if (d.delrow !== undefined) { S.dCart.categorias.splice(+d.delrow, 1); S.dCart.series.forEach((s) => s.valores.splice(+d.delrow, 1)); panel(); return sync(); }
  if (d.delpart !== undefined) { S.dPartes.splice(+d.delpart, 1); panel(); return sync(); }
  if (d.delsk !== undefined) { S.dSankey.splice(+d.delsk, 1); panel(); return sync(); }
  const a = d.acc; if (!a) return;
  if (a === 'png') vista.descargarPNG(); else if (a === 'csvdl') vista.descargarCSV(); else if (a === 'print') vista.imprimir();
  else if (a === 'link') { navigator.clipboard?.writeText(location.href); say('Enlace copiado'); }
  else if (a === 'reset') { Object.assign(S, structuredClone(DEF), { paletaNombre: 'institucional' }); panel(); sync(); }
  else if (a === 'addrow') { S.dCart.categorias.push('Nueva'); S.dCart.series.forEach((s) => s.valores.push(0)); panel(); sync(); }
  else if (a === 'addser') { S.dCart.series.push({ nombre: 'Serie ' + (S.dCart.series.length + 1), valores: S.dCart.categorias.map(() => 0) }); panel(); sync(); }
  else if (a === 'delser') { S.dCart.series.pop(); panel(); sync(); }
  else if (a === 'addpart') { S.dPartes.push({ nombre: 'Nuevo', valor: 0 }); panel(); sync(); }
  else if (a === 'addsk') { S.dSankey.push({ origen: 'Origen', destino: 'Destino', valor: 10 }); panel(); sync(); }
  else if (a === 'addcol') { S.coloresPers.push('#0071BB'); panel(); sync(); } else if (a === 'delcol') { S.coloresPers.pop(); panel(); sync(); }
  else if (a === 'ejemplo') { ejemplo(); panel(); sync(); }
  else if (a === 'csv') { aplicarCSV($('#csv').value); panel(); sync(); }
});
function aplicarCSV(texto) {
  const filas = texto.split(/\r?\n/).map((l) => l.split(/[;\t,]/).map((x) => x.trim())).filter((f) => f.length >= 2 && f[0] !== '');
  if (!filas.length) return say('Sin datos');
  if (CART.includes(S.tipo) || S.tipo === 'radar') {
    const cab = isNaN(Number(filas[0][1])) ? filas.shift() : null; const n = filas[0].length - 1;
    S.dCart = { categorias: filas.map((f) => f[0]), series: Array.from({ length: n }, (_, j) => ({ nombre: cab?.[j + 1] || 'Serie ' + (j + 1), valores: filas.map((f) => Number((f[j + 1] ?? '0').replace(',', '.')) || 0) })) };
  } else S.dPartes = filas.filter((f) => !isNaN(Number(f[1].replace(',', '.')))).map((f) => ({ nombre: f[0], valor: Number(f[1].replace(',', '.')) }));
  say('Datos aplicados');
}
function ejemplo() {
  let x = Date.now() % 997; const r = () => (x = (x * 9301 + 49297) % 233280) / 233280;
  S.dCart = { categorias: [...MESES], series: [{ nombre: 'Serie A', valores: MESES.map(() => Math.round(40 + r() * 90)) }, { nombre: 'Serie B', valores: MESES.map(() => Math.round(30 + r() * 80)) }] };
  S.dPartes = S.dPartes.map((p) => ({ nombre: p.nombre, valor: Math.round(100 + r() * 500) })); S.dGauge.valor = Math.round(20 + r() * 75);
  S.dHeat.m = S.dHeat.y.map(() => S.dHeat.x.map(() => Math.round(r() * 60)));
}

// ------------------------------------------------------------------ ejemplos
function preset(n) {
  Object.assign(S, structuredClone(DEF), { paletaNombre: 'institucional', usarUmbrales: true });
  if (n === 'barras') { S.tipo = 'barras'; S.titulo = 'Radicados por mes'; S.subtitulo = '2026'; S.etiquetas = true; }
  if (n === 'tendencia') { S.tipo = 'lineas'; S.suave = true; S.titulo = 'Tendencia mensual'; S.dCart = { categorias: [...MESES], series: [{ nombre: 'Norte', valores: [77, 100, 123, 56, 79, 102] }, { nombre: 'Centro', valores: [114, 47, 70, 93, 116, 49] }, { nombre: 'Sur', valores: [61, 84, 107, 40, 63, 86] }] }; }
  if (n === 'dona') { S.tipo = 'dona'; S.titulo = 'Atenciones por subregión'; S.leyendaPosicion = 'derecha'; }
  if (n === 'gauge') { S.tipo = 'gauge'; S.titulo = 'Avance del plan de desarrollo'; S.unidad = '%'; }
  if (n === 'radar') { S.tipo = 'radar'; S.titulo = 'Capacidades por sector'; S.dCart = { categorias: ['Salud', 'Educación', 'Vías', 'Agua', 'Energía'], series: [{ nombre: '2025', valores: [60, 70, 45, 80, 55] }, { nombre: '2026', valores: [75, 72, 62, 85, 70] }] }; }
  if (n === 'calor') { S.tipo = 'mapa-calor'; S.titulo = 'Atenciones por hora'; S.etiquetas = true; }
  if (n === 'treemap') { S.tipo = 'treemap'; S.titulo = 'Presupuesto 2026'; S.formato = 'compacto'; S.dPartes = [{ nombre: 'Infraestructura', valor: 520000000 }, { nombre: 'Salud', valor: 310000000 }, { nombre: 'Educación', valor: 280000000 }, { nombre: 'Agua', valor: 150000000 }]; }
  if (n === 'sankey') { S.tipo = 'sankey'; S.titulo = 'Flujo de recursos'; }
  if (n === 'embudo') { S.tipo = 'embudo'; S.titulo = 'Embudo de trámites'; S.dPartes = [{ nombre: 'Visitas', valor: 5000 }, { nombre: 'Solicitudes', valor: 2400 }, { nombre: 'Radicados', valor: 1800 }, { nombre: 'Resueltos', valor: 1500 }]; }
  if (n === 'calendario') { S.tipo = 'calendario'; S.titulo = 'Radicados por día'; }
  if (n === 'gantt') { S.tipo = 'gantt'; S.titulo = 'Cronograma del proyecto'; }
  panel(); sync();
}
