/* Estudio de mapas · Gobernación del Magdalena
   Configura <gob-mapa-magdalena> visualmente y genera el código (HTML/CDN, Angular, React, JSON). */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const CDN = new URL('../cdn/v1/', location.href).href;
const DETECTADA = new URL('../', location.href).href.replace(/\/$/, '');
const base = () => { try { return localStorage.getItem('mg-base') || DETECTADA; } catch { return DETECTADA; } };

const MARCA = [['#0071BB', 'Azul'], ['#00B7D9', 'Cian'], ['#9FD7E5', 'Celeste'], ['#F7003C', 'Rojo'], ['#FEC800', 'Amarillo'], ['#69B75E', 'Verde'], ['#A28034', 'Ocre'], ['#5618BA', 'Violeta'], ['#0B2239', 'Azul-noche'], ['#606060', 'Gris']];
const DEF = { detalle: 'medio', modo: 'subregiones', clases: 5, escala: 'lineal', etiquetas: 'ninguna', etiquetasAuto: true, leyenda: true, leyendaTitulo: '', tooltip: true, tooltipFormato: '<strong>{nombre}</strong><br><span>{subregion}</span><br>{valor}', seleccion: '', multiple: false, clic: 'seleccionar', enlace: '', efectos: ['entrada'], tema: 'claro', zoom: true, zoomRueda: false, controles: true, formato: 'numero', unidad: '', mostrarContorno: true, titulo: 'Mapa del departamento del Magdalena', rampa: 'azul' };
const KEBAB = { coloresCategorias: 'colores-categorias', coloresSubregiones: 'colores-subregiones', leyendaTitulo: 'leyenda-titulo', tooltipFormato: 'tooltip-formato', zoomRueda: 'zoom-rueda', mostrarContorno: 'mostrar-contorno', etiquetasAuto: 'etiquetas-auto' };
const EFECTOS = [['entrada', 'Entrada animada (los municipios aparecen en cascada)'], ['hormigas', 'Hormigas marchantes en la selección'], ['ping-seleccion', 'Ping (onda) sobre el municipio seleccionado'], ['foco', 'Foco: atenuar lo no seleccionado']];

let MUNIS = [], SUBS = [], RAMPAS = {}, ICONOS = {}, vista;
const S = { ...structuredClone(DEF), rampaNombre: 'azul', rampaColores: null, coloresSubregiones: {}, datos: {}, categorias: {}, coloresCategorias: { Alta: '#0071BB', Media: '#00B7D9', Baja: '#9FD7E5' }, marcadores: [], lineas: [], vars: { relleno: '', borde: '', contorno: '', sel: '' } };

// ------------------------------------------------------------------ arranque
(async function init() {
  const [m, s] = await Promise.all([fetch(CDN + 'datos/municipios.json').then((r) => r.json()), fetch(CDN + 'datos/subregiones.json').then((r) => r.json())]);
  MUNIS = m; SUBS = s;
  await import(CDN + 'gob.js');
  await window.gob.cargar('gob-mapa-magdalena');
  const C = customElements.get('gob-mapa-magdalena'); RAMPAS = C.rampas; ICONOS = C.iconos;
  S.rampaColores = [...RAMPAS.azul.colores];
  $('#app').innerHTML = shell();
  vista = $('#vista');
  restaurar();
  const pre = new URLSearchParams(location.search).get('preset');
  if (pre) cargarPreset(pre); else { panel(); sync(true); }
  vista.addEventListener('gob-municipio-click', (e) => { const d = e.detail; $('#evt').textContent = `gob-municipio-click → ${JSON.stringify({ codigo: d.codigo, nombre: d.nombre, subregion: d.subregion, valor: d.valor })}`; });
  const bi = $('#baseInput'); bi.value = base();
  bi.addEventListener('input', () => { try { localStorage.setItem('mg-base', bi.value.replace(/\/$/, '') || DETECTADA); } catch {} sync(true); });
  $('#baseReset').addEventListener('click', () => { try { localStorage.removeItem('mg-base'); } catch {} bi.value = DETECTADA; sync(true); });
})();

// ------------------------------------------------------------------ configuración efectiva
function config() {
  const c = {};
  for (const k of Object.keys(DEF)) { if (k === 'rampa') continue; if (JSON.stringify(S[k]) !== JSON.stringify(DEF[k])) c[k] = S[k]; }
  if (S.modo === 'coropleta') { c.rampa = S.rampaNombre === 'personalizada' ? [...S.rampaColores] : S.rampaNombre; const d = {}; for (const [k, v] of Object.entries(S.datos)) if (v !== '' && v != null) d[k] = +v; if (Object.keys(d).length) c.datos = d; }
  if (S.modo === 'categorias') { const cat = {}; for (const [k, v] of Object.entries(S.categorias)) if (v) cat[k] = v; if (Object.keys(cat).length) c.categorias = cat; c.coloresCategorias = { ...S.coloresCategorias }; }
  if (S.modo === 'subregiones') { const cs = {}; for (const s of SUBS) if (S.coloresSubregiones[s.id] && S.coloresSubregiones[s.id].toLowerCase() !== s.color.toLowerCase()) cs[s.id] = S.coloresSubregiones[s.id]; if (Object.keys(cs).length) c.coloresSubregiones = cs; }
  if (S.marcadores.length) c.marcadores = S.marcadores.map(limpio);
  if (S.lineas.length) c.lineas = S.lineas.map(limpio);
  return c;
}
const limpio = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '' && v != null && v !== false || v === true));
const cssVars = () => { const o = {}; const m = { relleno: '--gob-mapa-relleno', borde: '--gob-mapa-borde', contorno: '--gob-mapa-contorno', sel: '--gob-mapa-sel' }; for (const [k, v] of Object.entries(S.vars)) if (v) o[m[k]] = v; return o; };

function aplicar() {
  const full = { datos: undefined, categorias: undefined, coloresCategorias: undefined, coloresSubregiones: undefined, marcadores: undefined, lineas: undefined, ...structuredClone(DEF), ...config() };
  vista.config = full;
  for (const v of ['--gob-mapa-relleno', '--gob-mapa-borde', '--gob-mapa-contorno', '--gob-mapa-sel']) vista.style.removeProperty(v);
  for (const [k, v] of Object.entries(cssVars())) vista.style.setProperty(k, v);
  $('#vistaBox').dataset.tema = S.tema;
}

// ------------------------------------------------------------------ generación de código
const json = (v, ind = 2) => JSON.stringify(v, null, ind);
function partir(cfg) {
  const attrs = [], props = {};
  for (const [k, v] of Object.entries(cfg)) {
    if (v === undefined) continue;
    const a = KEBAB[k] || k;
    if (typeof v === 'string' || typeof v === 'number') attrs.push(`${a}="${esc(v)}"`);
    else if (typeof v === 'boolean') { if (v && DEF[k] !== true) attrs.push(a); else if (!v && DEF[k] !== false) props[k] = false; }
    else if (k === 'efectos') attrs.push(`efectos="${v.join(',')}"`);
    else props[k] = v;
  }
  return { attrs, props };
}
const styleAttr = () => { const v = cssVars(); const t = Object.entries(v).map(([k, x]) => `${k}:${x}`).join(';'); return t ? ` style="${t}"` : ''; };
const sangria = (txt, n) => txt.split('\n').map((l, i) => (i ? ' '.repeat(n) : '') + l).join('\n');
function manejador() {
  if (S.clic === 'evento') return `\n  mapa.addEventListener('gob-municipio-click', (e) => {\n    const { codigo, nombre, subregion, valor } = e.detail;\n    // ← aquí su lógica: abrir un panel, navegar, llamar a la API…\n    console.log(codigo, nombre, subregion, valor);\n  });`;
  return `\n  mapa.addEventListener('gob-municipio-click', (e) => console.log(e.detail)); // opcional`;
}
function codigoHTML() {
  const { attrs, props } = partir(config());
  const b = base(); const st = styleAttr().trim();
  const todo = ['id="mapa"', ...attrs, ...(st ? [st] : [])];
  const p = Object.keys(props).length ? `\n  mapa.config = ${sangria(json(props), 2)};` : '';
  return `<!-- 1. Cargar el componente (una sola etiqueta, sin build) -->\n<script type="module" src="${b}/cdn/v1/gob.js"></script>\n\n<!-- 2. El mapa (responsive: ocupa el ancho de su contenedor) -->\n<div style="max-width:640px">\n  <gob-mapa-magdalena ${todo.join('\n    ')}>\n  </gob-mapa-magdalena>\n</div>\n\n<script type="module">\n  const mapa = document.getElementById('mapa');${p}${manejador()}\n</script>`;
}
function codigoAngular() {
  const { attrs, props } = partir(config()); const b = base();
  const campos = Object.entries(props).map(([k, v]) => `  ${k} = ${sangria(json(v), 2)};`).join('\n\n');
  const enl = Object.keys(props).map((k) => `\n    [${k}]="${k}"`).join('');
  return `// 1) src/index.html — cargar el componente\n<script type="module" src="${b}/cdn/v1/gob.js"></script>\n\n// 2) mapa-magdalena.component.ts\nimport { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';\n\n@Component({\n  selector: 'app-mapa-magdalena',\n  standalone: true,\n  schemas: [CUSTOM_ELEMENTS_SCHEMA],\n  template: \`\n  <gob-mapa-magdalena${attrs.length ? '\n    ' + attrs.join('\n    ') : ''}${enl}\n    (gob-municipio-click)="alClic($event)"${styleAttr() ? '\n    ' + styleAttr().trim() : ''}>\n  </gob-mapa-magdalena>\`,\n})\nexport class MapaMagdalenaComponent {\n${campos}${campos ? '\n\n' : ''}  alClic(e: Event) {\n    const { codigo, nombre, subregion, valor } = (e as CustomEvent).detail;\n    console.log(codigo, nombre, subregion, valor);\n  }\n}`;
}
function codigoReact() {
  const cfg = config(); const b = base(); const v = cssVars();
  const st = Object.keys(v).length ? `\n      style={${json(v, 0)}}` : '';
  return `// MapaMagdalena.jsx  ·  React / Next.js (solo cliente)\n'use client'; // Next.js: el componente se registra en el navegador\nimport { useEffect, useRef } from 'react';\n\nconst config = ${sangria(json(cfg), 0)};\n\nexport default function MapaMagdalena({ onMunicipio }) {\n  const ref = useRef(null);\n\n  useEffect(() => {\n    import(/* webpackIgnore: true */ '${b}/cdn/v1/gob.js').then(() => {\n      if (ref.current) ref.current.config = config;\n    });\n    const el = ref.current;\n    const h = (e) => onMunicipio?.(e.detail);\n    el?.addEventListener('gob-municipio-click', h);\n    return () => el?.removeEventListener('gob-municipio-click', h);\n  }, []);\n\n  return <gob-mapa-magdalena ref={ref}${st} />;\n}\n\n// TypeScript: declare module JSX →  declare namespace JSX { interface IntrinsicElements { 'gob-mapa-magdalena': any } }`;
}
const codigoJSON = () => json(config());

// ------------------------------------------------------------------ interfaz
const chk = (k, t) => `<label class="st-chk"><input type="checkbox" data-k="${k}" ${S[k] ? 'checked' : ''}> ${t}</label>`;
const sel = (k, t, ops) => `<label class="st-f"><span>${t}</span><select class="mg-select" data-k="${k}">${ops.map(([v, l]) => `<option value="${esc(v)}" ${String(S[k]) === String(v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>`;
const txt = (k, t, ph = '') => `<label class="st-f"><span>${t}</span><input class="mg-input" data-k="${k}" value="${esc(S[k])}" placeholder="${esc(ph)}"></label>`;
const color = (k, val, t, al) => `<label class="st-c"><span>${t}</span><input type="color" data-ck="${k}" aria-label="${esc(al || t || 'Color')}" value="${/^#[0-9a-f]{6}$/i.test(val) ? val : '#0071BB'}"></label>`;
const swatches = (target) => `<span class="st-sw">${MARCA.map(([c, n]) => `<button type="button" title="${n} ${c}" style="background:${c}" data-sw="${target}" data-c="${c}"></button>`).join('')}</span>`;
const optMuni = (vacio) => `${vacio ? `<option value="">${vacio}</option>` : ''}${MUNIS.map((m) => `<option value="${m.codigo}">${esc(m.nombre)} (${m.codigo})</option>`).join('')}`;

function shell() {
  return `
  <div class="baseurl"><b>URL base del CDN:</b><input class="mg-input" id="baseInput" aria-label="URL base"><button class="mg-btn mg-btn--ghost mg-btn--sm" id="baseReset">Autodetectar</button><span class="mg-help" style="width:100%;margin:0">El código generado carga el componente desde <code class="inline">URL_BASE/cdn/v1/gob.js</code>.</span></div>
  <div class="st">
    <div class="st__panel" id="panel"></div>
    <div class="st__main">
      <div class="st__bar">
        <div class="mg-row"><b style="font-size:.8rem">Ejemplos:</b>
          <button class="mg-btn mg-btn--secondary mg-btn--sm" data-preset="subregiones">Subregiones</button>
          <button class="mg-btn mg-btn--secondary mg-btn--sm" data-preset="coropleta">Coropleta</button>
          <button class="mg-btn mg-btn--secondary mg-btn--sm" data-preset="red">Red de rutas animadas</button>
          <button class="mg-btn mg-btn--secondary mg-btn--sm" data-preset="riesgo">Riesgo con ping</button>
          <button class="mg-btn mg-btn--secondary mg-btn--sm" data-preset="obras">Obras por categoría</button></div>
      </div>
      <div class="st__vista" id="vistaBox" data-tema="claro"><gob-mapa-magdalena id="vista"></gob-mapa-magdalena></div>
      <p class="mg-help" id="evt" aria-live="polite" style="margin:.4rem 0 1rem;font-family:var(--mg-font-mono)">Haga clic en un municipio para ver el evento <code class="inline">gob-municipio-click</code>…</p>
      <div class="mg-row" style="margin-bottom:1rem">
        <button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="svg">⬇ SVG</button><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="png">⬇ PNG</button>
        <button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="print">🖨 Imprimir</button><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="link">🔗 Copiar enlace de esta configuración</button><button class="mg-btn mg-btn--ghost mg-btn--sm" data-acc="reset">Restablecer</button></div>
      <div class="mg-tabs" role="tablist" aria-label="Formato del código" id="tabs"><button role="tab" aria-selected="true" class="mg-tab is-active" data-t="html">HTML (CDN)</button><button role="tab" aria-selected="false" class="mg-tab" data-t="ng">Angular</button><button role="tab" aria-selected="false" class="mg-tab" data-t="react">React / Next.js</button><button role="tab" aria-selected="false" class="mg-tab" data-t="json">Config JSON</button></div>
      <div class="code" style="margin-top:0;border-top-left-radius:0"><div class="code__bar"><span id="codeLbl">index.html</span><button data-codecopy>Copiar</button></div><pre tabindex="0"><code id="code"></code></pre></div>
    </div>
  </div>`;
}

function panel() {
  const m = S.modo;
  $('#panel').innerHTML = `
  <details open><summary>1 · Base</summary><div class="st__body">
    ${sel('modo', 'Qué mostrar', [['subregiones', 'Subregiones'], ['coropleta', 'Coropleta (valores por municipio)'], ['categorias', 'Categorías'], ['plano', 'Solo límites']])}
    ${sel('detalle', 'Detalle de los límites', [['bajo', 'Bajo (34 KB, más rápido)'], ['medio', 'Medio (69 KB)'], ['alto', 'Alto (164 KB)']])}
    ${sel('tema', 'Tema', [['claro', 'Claro'], ['oscuro', 'Oscuro']])}
    ${sel('etiquetas', 'Etiquetas', [['ninguna', 'Ninguna'], ['nombres', 'Nombres'], ['codigos', 'Códigos DIVIPOLA'], ['valores', 'Valores'], ['nombres-valores', 'Nombre y valor']])}
    <div class="st-grid">${chk('leyenda', 'Leyenda')}${chk('tooltip', 'Tooltip')}${chk('controles', 'Botones de zoom')}${chk('zoom', 'Zoom y arrastre')}${chk('mostrarContorno', 'Contorno departamental')}${chk('etiquetasAuto', 'Ocultar etiquetas que no caben')}</div>
    ${txt('leyendaTitulo', 'Título de la leyenda', 'p. ej. Habitantes')}
    ${S.tooltip ? txt('tooltipFormato', 'Formato del tooltip (HTML)', '{nombre} {codigo} {subregion} {valor} {categoria}') : ''}
    ${txt('titulo', 'Título accesible del mapa')}
  </div></details>

  <details open><summary>2 · Colores</summary><div class="st__body">
    ${m === 'subregiones' ? `<p class="st-n">Color de cada subregión</p><div class="st-grid">${SUBS.map((s) => `<div>${color('sub:' + s.id, S.coloresSubregiones[s.id] || s.color, s.nombre)}</div>`).join('')}</div><div class="mg-row"><button class="mg-btn mg-btn--ghost mg-btn--sm" data-acc="subreset">Colores de la presentación</button><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="subsobrio">Paleta sobria (azules)</button></div>` : ''}
    ${m === 'coropleta' ? `${sel('rampaNombre', 'Rampa de color', [...Object.entries(RAMPAS).map(([k, r]) => [k, r.nombre]), ['personalizada', 'Personalizada…']])}
      <div class="st-rampa" id="rampaBar" style="background:linear-gradient(90deg,${S.rampaColores.join(',')})"></div>
      <p class="st-n">Paradas de la rampa (clic para elegir cualquier color)</p><div class="st-grid">${S.rampaColores.map((c, i) => `<div>${color('ramp:' + i, c, 'Parada ' + (i + 1))}</div>`).join('')}</div>
      <div class="st-grid">${sel('clases', 'Clases', [3, 4, 5, 6, 7, 8].map((n) => [n, n]))}${sel('escala', 'Escala', [['lineal', 'Lineal'], ['cuantiles', 'Cuantiles']])}</div>
      <div class="st-grid">${sel('formato', 'Formato', [['numero', 'Número'], ['cop', 'Pesos COP'], ['porcentaje', 'Porcentaje']])}${txt('unidad', 'Unidad', 'hab., ha…')}</div>` : ''}
    ${m === 'categorias' ? `<p class="st-n">Categorías</p>${Object.entries(S.coloresCategorias).map(([n, c]) => `<div class="st-cat"><input class="mg-input" aria-label="Nombre de la categoría" value="${esc(n)}" data-catname="${esc(n)}">${color('cat:' + n, c, '', 'Color de ' + n)}<button class="mg-btn mg-btn--ghost mg-btn--sm" data-delcat="${esc(n)}" aria-label="Quitar">✕</button></div>`).join('')}<button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="addcat">+ Categoría</button>` : ''}
    <p class="st-n">Estilo del mapa (opcional)</p>
    <div class="st-grid">${color('var:relleno', S.vars.relleno || '#DCE6EE', 'Relleno base')}${color('var:borde', S.vars.borde || '#FFFFFF', 'Bordes')}${color('var:contorno', S.vars.contorno || '#0B2239', 'Contorno')}${color('var:sel', S.vars.sel || '#0B2239', 'Selección')}</div>
    <p class="st-n">Paleta institucional (clic en un color y luego en una muestra para asignarlo)</p>${swatches('')}
  </div></details>

  <details><summary>3 · Datos por municipio</summary><div class="st__body">
    <div class="mg-row"><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="ejemplo">Datos de ejemplo</button><button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="plantilla">⬇ Plantilla CSV</button><button class="mg-btn mg-btn--ghost mg-btn--sm" data-acc="limpiar">Limpiar</button></div>
    <label class="st-f"><span>Pegar CSV (código o nombre, y valor)</span><textarea class="mg-textarea mg-input" id="csv" rows="3" placeholder="47001;120500&#10;Ciénaga;98000"></textarea></label>
    <button class="mg-btn mg-btn--secondary mg-btn--sm" data-acc="csv">Aplicar CSV</button>
    <div class="st-tabla"><table class="mg-table"><thead><tr><th>Municipio</th><th>${m === 'categorias' ? 'Categoría' : 'Valor'}</th></tr></thead><tbody>
      ${MUNIS.map((x) => `<tr><td><small>${x.codigo}</small> ${esc(x.nombre)}</td><td>${m === 'categorias' ? `<select class="mg-select" data-cat="${x.codigo}"><option value="">—</option>${Object.keys(S.coloresCategorias).map((c) => `<option ${S.categorias[x.codigo] === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select>` : `<input class="mg-input" type="number" step="any" data-dato="${x.codigo}" value="${S.datos[x.codigo] ?? ''}">`}</td></tr>`).join('')}
    </tbody></table></div>
  </div></details>

  <details><summary>4 · Interacción y efectos</summary><div class="st__body">
    ${sel('clic', 'Al hacer clic en un municipio', [['seleccionar', 'Seleccionar'], ['zoom', 'Acercar'], ['zoom-seleccionar', 'Seleccionar y acercar'], ['evento', 'Solo emitir evento (yo programo)'], ['enlace', 'Ir a un enlace']])}
    ${S.clic === 'enlace' ? txt('enlace', 'Enlace', '/municipios/{codigo}') : ''}
    <div class="st-grid">${chk('multiple', 'Selección múltiple')}${chk('zoomRueda', 'Zoom con la rueda')}</div>
    <label class="st-f"><span>Municipio preseleccionado</span><select class="mg-select" data-k="seleccion">${optMuni('— ninguno —').replace(`value="${S.seleccion}"`, `value="${S.seleccion}" selected`)}</select></label>
    <p class="st-n">Efectos visuales</p>
    ${EFECTOS.map(([k, t]) => `<label class="st-chk"><input type="checkbox" data-ef="${k}" ${S.efectos.includes(k) ? 'checked' : ''}> ${t}</label>`).join('')}
  </div></details>

  <details><summary>5 · Marcadores (${S.marcadores.length})</summary><div class="st__body">
    <div class="st-add">
      <label class="st-f"><span>Ubicación</span><select class="mg-select" id="mk-loc">${optMuni()}<option value="ll">Coordenadas lon,lat…</option></select></label>
      <input class="mg-input" id="mk-ll" placeholder="-74.2, 11.2" hidden>
      <label class="st-f"><span>Nombre</span><input class="mg-input" id="mk-nombre" placeholder="Hospital, obra, sede…"></label>
      <div class="st-grid"><label class="st-f"><span>Categoría</span><input class="mg-input" id="mk-cat" placeholder="Obras"></label>
        <label class="st-f"><span>Icono</span><select class="mg-select" id="mk-ico">${Object.entries(ICONOS).map(([k, i]) => `<option value="${k}">${i.nombre}</option>`).join('')}</select></label></div>
      <div class="st-grid"><label class="st-f"><span>Efecto</span><select class="mg-select" id="mk-ef"><option value="ninguno">Ninguno</option><option value="pulso">Pulso</option><option value="ping" selected>Ping (ondas)</option><option value="radar">Radar</option></select></label>
        <label class="st-f"><span>Tamaño</span><input class="mg-input" id="mk-tam" type="number" value="28" min="14" max="60"></label></div>
      <div class="mg-row">${color('mk', '#0071BB', 'Color')}${swatches('mk')}<label class="st-chk"><input type="checkbox" id="mk-et"> Etiqueta</label></div>
      <button class="mg-btn mg-btn--sm" data-acc="addmk">+ Agregar marcador</button>
    </div>
    ${S.marcadores.map((x, i) => `<div class="st-item"><i style="background:${x.color}"></i><span>${esc(x.nombre || '(sin nombre)')} · ${esc(x.codigo || x.lonlat)}${x.efecto && x.efecto !== 'ninguno' ? ' · ' + x.efecto : ''}</span><button class="mg-btn mg-btn--ghost mg-btn--sm" data-delmk="${i}" aria-label="Quitar">✕</button></div>`).join('')}
  </div></details>

  <details><summary>6 · Rutas y líneas (${S.lineas.length})</summary><div class="st__body">
    <div class="st-add">
      <div class="st-grid"><label class="st-f"><span>Desde</span><select class="mg-select" id="ln-a">${optMuni()}</select></label><label class="st-f"><span>Hasta</span><select class="mg-select" id="ln-b">${optMuni().replace('<option value="47001">', '<option value="47001" disabled>')}</select></label></div>
      <div class="st-grid"><label class="st-f"><span>Estilo</span><select class="mg-select" id="ln-e"><option value="flujo">Flujo animado</option><option value="dibujar">Se dibuja</option><option value="guion">Guiones</option><option value="solido">Sólida</option></select></label>
        <label class="st-f"><span>Grosor</span><input class="mg-input" id="ln-w" type="number" value="2.5" step=".5" min="1" max="8"></label></div>
      <div class="st-grid"><label class="st-f"><span>Curvatura</span><input class="mg-input" id="ln-c" type="number" value=".18" step=".05" min="-.6" max=".6"></label><label class="st-chk" style="align-self:end"><input type="checkbox" id="ln-p" checked> Partículas</label></div>
      <div class="mg-row">${color('ln', '#00B7D9', 'Color')}${swatches('ln')}</div>
      <button class="mg-btn mg-btn--sm" data-acc="addln">+ Agregar ruta</button>
    </div>
    ${S.lineas.map((x, i) => `<div class="st-item"><i style="background:${x.color}"></i><span>${esc(nombre(x.desde))} → ${esc(nombre(x.hasta))} · ${x.estilo}</span><button class="mg-btn mg-btn--ghost mg-btn--sm" data-delln="${i}" aria-label="Quitar">✕</button></div>`).join('')}
  </div></details>`;
  const sb = $('#mk-loc'); sb?.addEventListener('change', () => { $('#mk-ll').hidden = sb.value !== 'll'; });
}
const nombre = (c) => MUNIS.find((m) => m.codigo === c)?.nombre ?? String(c);

// ------------------------------------------------------------------ sincronización
let tab = 'html', ultimoColor = null;
function sync(primera) {
  aplicar();
  const mapa = { html: [codigoHTML, 'index.html'], ng: [codigoAngular, 'mapa-magdalena.component.ts'], react: [codigoReact, 'MapaMagdalena.jsx'], json: [codigoJSON, 'config.json'] };
  const [fn, lbl] = mapa[tab]; $('#code').textContent = fn(); $('#codeLbl').textContent = lbl;
  if (!primera) guardar();
}
let tg; function guardar() { clearTimeout(tg); tg = setTimeout(() => { try { history.replaceState(null, '', '#c=' + btoa(unescape(encodeURIComponent(JSON.stringify(S))))); } catch {} }, 400); }
function restaurar() { try { const m = location.hash.match(/#c=(.+)/); if (m) Object.assign(S, JSON.parse(decodeURIComponent(escape(atob(m[1]))))); } catch {} }

// ------------------------------------------------------------------ eventos (delegados)
function setVal(k, v) { S[k] = v; }
function onCampo(e) {
  const t = e.target; if (!t.closest?.('#app')) return;
  const cambio = e.type === 'change';
  if (t.dataset.k) {
    const k = t.dataset.k; let v = t.type === 'checkbox' ? t.checked : t.value; if (k === 'clases') v = +v; setVal(k, v);
    if (cambio && ['modo', 'tooltip', 'clic', 'rampaNombre'].includes(k)) { if (k === 'rampaNombre' && v !== 'personalizada') S.rampaColores = [...RAMPAS[v].colores]; panel(); }
    sync(); return;
  }
  if (t.dataset.ck) {
    const g = t.dataset.ck.split(':')[0], id = t.dataset.ck.split(':').slice(1).join(':'); const c = t.value;
    if (g === 'sub') S.coloresSubregiones[id] = c;
    else if (g === 'ramp') { S.rampaColores[+id] = c; S.rampaNombre = 'personalizada'; const sl = $('[data-k="rampaNombre"]'); if (sl) sl.value = 'personalizada'; const rb = $('#rampaBar'); if (rb) rb.style.background = `linear-gradient(90deg,${S.rampaColores.join(',')})`; }
    else if (g === 'cat') S.coloresCategorias[id] = c; else if (g === 'var') S.vars[id] = c; else return;
    sync(); return;
  }
  if (t.dataset.ef) { const st = new Set(S.efectos); t.checked ? st.add(t.dataset.ef) : st.delete(t.dataset.ef); S.efectos = [...st]; sync(); return; }
  if (t.dataset.dato !== undefined) { S.datos[t.dataset.dato] = t.value; sync(); return; }
  if (t.dataset.cat !== undefined) { S.categorias[t.dataset.cat] = t.value; sync(); return; }
  if (t.dataset.catname !== undefined && cambio) {
    const o = t.dataset.catname, n = t.value.trim();
    if (n && n !== o && !(n in S.coloresCategorias)) { S.coloresCategorias = Object.fromEntries(Object.entries(S.coloresCategorias).map(([k, v]) => (k === o ? [n, v] : [k, v]))); for (const k of Object.keys(S.categorias)) if (S.categorias[k] === o) S.categorias[k] = n; panel(); sync(); }
  }
}
document.addEventListener('input', onCampo);
document.addEventListener('change', onCampo);
document.addEventListener('focusin', (e) => { if (e.target.dataset?.ck) ultimoColor = e.target; });
document.addEventListener('click', (e) => { if (e.target.dataset?.ck) ultimoColor = e.target; });
document.addEventListener('click', async (e) => {
  const t = e.target.closest('button'); if (!t || !t.closest('#app')) return;
  if (t.dataset.sw !== undefined) { const c = t.dataset.c; if (t.dataset.sw === 'mk') { $('[data-ck="mk"]').value = c; } else if (t.dataset.sw === 'ln') { $('[data-ck="ln"]').value = c; } else if (ultimoColor) { ultimoColor.value = c; ultimoColor.dispatchEvent(new Event('input', { bubbles: true })); } else say('Primero haga clic en un selector de color'); return; }
  if (t.dataset.t) { tab = t.dataset.t; $$('#tabs .mg-tab').forEach((b) => { b.classList.toggle('is-active', b === t); b.setAttribute('aria-selected', b === t ? 'true' : 'false'); }); sync(true); return; }
  if (t.dataset.preset) { cargarPreset(t.dataset.preset); return; }
  if (t.dataset.delmk) { S.marcadores.splice(+t.dataset.delmk, 1); panel(); sync(); return; }
  if (t.dataset.delln) { S.lineas.splice(+t.dataset.delln, 1); panel(); sync(); return; }
  if (t.dataset.delcat) { delete S.coloresCategorias[t.dataset.delcat]; panel(); sync(); return; }
  const a = t.dataset.acc; if (!a) return;
  if (a === 'svg') vista.descargarSVG(); else if (a === 'png') vista.descargarPNG(); else if (a === 'print') vista.imprimir();
  else if (a === 'link') { navigator.clipboard?.writeText(location.href); say('Enlace copiado'); }
  else if (a === 'reset') { Object.assign(S, structuredClone(DEF), { rampaNombre: 'azul', rampaColores: [...RAMPAS.azul.colores], coloresSubregiones: {}, datos: {}, categorias: {}, marcadores: [], lineas: [], vars: { relleno: '', borde: '', contorno: '', sel: '' } }); panel(); sync(); }
  else if (a === 'subreset') { S.coloresSubregiones = {}; panel(); sync(); }
  else if (a === 'subsobrio') { S.coloresSubregiones = { sm: '#0B2239', no: '#0071BB', ri: '#4FA3D4', ce: '#9FD7E5', su: '#12395C' }; panel(); sync(); }
  else if (a === 'addcat') { let n = 'Nueva'; while (n in S.coloresCategorias) n += '+'; S.coloresCategorias[n] = '#69B75E'; panel(); sync(); }
  else if (a === 'ejemplo') { datosEjemplo(); panel(); sync(); }
  else if (a === 'limpiar') { S.datos = {}; S.categorias = {}; panel(); sync(); }
  else if (a === 'plantilla') { const csv = 'codigo;municipio;valor\n' + MUNIS.map((m) => `${m.codigo};${m.nombre};`).join('\n'); const b = new Blob(['﻿' + csv], { type: 'text/csv' }); const l = document.createElement('a'); l.href = URL.createObjectURL(b); l.download = 'plantilla-municipios-magdalena.csv'; l.click(); }
  else if (a === 'csv') { aplicarCSV($('#csv').value); panel(); sync(); }
  else if (a === 'addmk') addMk(); else if (a === 'addln') addLn();
});
function datosEjemplo() { let x = 11; const r = () => (x = (x * 9301 + 49297) % 233280) / 233280; S.modo = S.modo === 'categorias' ? 'categorias' : 'coropleta'; for (const m of MUNIS) { S.datos[m.codigo] = Math.round(4000 + r() * 96000); S.categorias[m.codigo] = Object.keys(S.coloresCategorias)[Math.floor(r() * Object.keys(S.coloresCategorias).length)]; } }
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
function aplicarCSV(t) { let n = 0; for (const l of t.split(/\r?\n/)) { const p = l.split(/[;\t,]/).map((x) => x.trim()); if (p.length < 2) continue; const v = parseFloat(p.at(-1).replace(',', '.')); if (Number.isNaN(v)) continue; const m = MUNIS.find((x) => x.codigo === p[0] || norm(x.nombre) === norm(p[0]) || x.codigo === p[1]); if (m) { S.datos[m.codigo] = v; n++; } } if (n) { S.modo = 'coropleta'; } say(`${n} valores aplicados`); }
function addMk() {
  const loc = $('#mk-loc').value; const o = { nombre: $('#mk-nombre').value.trim(), categoria: $('#mk-cat').value.trim(), icono: $('#mk-ico').value, efecto: $('#mk-ef').value, tamano: +$('#mk-tam').value || 28, color: $('[data-ck="mk"]').value, etiqueta: $('#mk-et').checked };
  if (loc === 'll') { const p = $('#mk-ll').value.split(/[,;\s]+/).map(Number); if (p.length < 2 || p.some(Number.isNaN)) return say('Coordenadas: lon, lat'); o.lonlat = [p[0], p[1]]; } else o.codigo = loc;
  S.marcadores.push(o); panel(); sync();
}
function addLn() { const a = $('#ln-a').value, b = $('#ln-b').value; if (a === b) return say('Elija municipios distintos'); S.lineas.push({ desde: a, hasta: b, estilo: $('#ln-e').value, ancho: +$('#ln-w').value || 2, curva: +$('#ln-c').value, particulas: $('#ln-p').checked, color: $('[data-ck="ln"]').value }); panel(); sync(); }
function say(t) { const d = document.querySelector('.toast-ok'); if (d) { d.textContent = t; d.classList.add('show'); setTimeout(() => d.classList.remove('show'), 1600); } }

// ------------------------------------------------------------------ ejemplos
function cargarPreset(n) {
  Object.assign(S, structuredClone(DEF), { rampaNombre: 'azul', rampaColores: [...RAMPAS.azul.colores], coloresSubregiones: {}, datos: {}, categorias: {}, coloresCategorias: { Alta: '#0071BB', Media: '#00B7D9', Baja: '#9FD7E5' }, marcadores: [], lineas: [], vars: { relleno: '', borde: '', contorno: '', sel: '' } });
  const sm = '47001';
  if (n === 'subregiones') { S.etiquetas = 'nombres'; S.seleccion = '47189'; S.efectos = ['entrada', 'hormigas', 'ping-seleccion']; }
  if (n === 'coropleta') { S.modo = 'coropleta'; S.leyendaTitulo = 'Habitantes'; S.unidad = 'hab.'; S.etiquetas = 'valores'; datosEjemplo(); }
  if (n === 'red') { S.tema = 'oscuro'; S.efectos = ['entrada', 'foco']; S.clic = 'zoom-seleccionar'; S.marcadores = [{ codigo: sm, nombre: 'Santa Marta', categoria: 'Sede', icono: 'escudo', efecto: 'radar', tamano: 30, color: '#00B7D9', etiqueta: true }, { codigo: '47189', nombre: 'Ciénaga', categoria: 'Nodo', icono: 'punto', efecto: 'ping', tamano: 22, color: '#FEC800' }, { codigo: '47288', nombre: 'Fundación', categoria: 'Nodo', icono: 'punto', efecto: 'ping', tamano: 22, color: '#FEC800' }, { codigo: '47555', nombre: 'Plato', categoria: 'Nodo', icono: 'punto', efecto: 'ping', tamano: 22, color: '#FEC800' }, { codigo: '47245', nombre: 'El Banco', categoria: 'Nodo', icono: 'punto', efecto: 'ping', tamano: 22, color: '#FEC800' }]; S.lineas = [['47001', '47189', '#00B7D9'], ['47189', '47288', '#00B7D9'], ['47288', '47555', '#9FD7E5'], ['47555', '47245', '#9FD7E5']].map(([a, b, c]) => ({ desde: a, hasta: b, estilo: 'flujo', ancho: 2.5, curva: 0.16, particulas: true, color: c })); }
  if (n === 'riesgo') { S.modo = 'categorias'; S.coloresCategorias = { 'Riesgo alto': '#F7003C', 'Riesgo medio': '#FEC800', 'Riesgo bajo': '#69B75E' }; S.efectos = ['entrada', 'ping-seleccion', 'hormigas']; S.leyendaTitulo = 'Nivel de riesgo'; S.clic = 'zoom-seleccionar'; const k = Object.keys(S.coloresCategorias); MUNIS.forEach((m, i) => (S.categorias[m.codigo] = k[(i * 7 + (i % 3)) % 3])); S.seleccion = '47189'; S.marcadores = [{ codigo: '47189', nombre: 'Ciénaga', categoria: 'Alerta', icono: 'alerta', efecto: 'ping', tamano: 30, color: '#F7003C' }, { codigo: '47980', nombre: 'Zona Bananera', categoria: 'Alerta', icono: 'alerta', efecto: 'pulso', tamano: 26, color: '#F7003C' }]; }
  if (n === 'obras') { S.modo = 'plano'; S.leyendaTitulo = 'Obras'; S.vars.relleno = '#E3E8EF'; S.marcadores = [['47001', 'Santa Marta', 'Vías', 'vehiculo', '#0071BB'], ['47053', 'Aracataca', 'Salud', 'cruz', '#F7003C'], ['47551', 'Pivijay', 'Educación', 'escuela', '#5618BA'], ['47555', 'Plato', 'Agua', 'gota', '#00B7D9'], ['47245', 'El Banco', 'Energía', 'rayo', '#FEC800'], ['47707', 'Santa Ana', 'Vivienda', 'casa', '#69B75E']].map(([c, nme, cat, ic, col]) => ({ codigo: c, nombre: nme, categoria: cat, icono: ic, efecto: 'pulso', tamano: 28, color: col })); }
  panel(); sync();
}
