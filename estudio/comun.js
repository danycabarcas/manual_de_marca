/* Utilidades compartidas de los Estudios: generación de código con TODAS las dependencias, pestañas, toast, hash y página autónoma. */
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const CDN = new URL('../cdn/v1/', location.href).href;
export const DETECTADA = new URL('../', location.href).href.replace(/\/$/, '');
export const base = () => { try { return localStorage.getItem('mg-base') || DETECTADA; } catch { return DETECTADA; } };
export const json = (v, i = 2) => JSON.stringify(v, null, i);
export const sangria = (t, n) => t.split('\n').map((l, i) => (i ? ' '.repeat(n) : '') + l).join('\n');
export const MARCA = [['#0071BB', 'Azul'], ['#00B7D9', 'Cian'], ['#9FD7E5', 'Celeste'], ['#F7003C', 'Rojo'], ['#FEC800', 'Amarillo'], ['#69B75E', 'Verde'], ['#A28034', 'Ocre'], ['#5618BA', 'Violeta'], ['#0B2239', 'Azul-noche'], ['#606060', 'Gris']];

/** Dependencias que SIEMPRE deben ir en el código generado. */
export const preludio = (b = base()) => `<!-- ① Dependencias: TODO lo que hay que cargar (una vez por página) -->\n<link rel="stylesheet" href="${b}/cdn/v1/gob.css">\n<script type="module" src="${b}/cdn/v1/gob.js"></script>\n<!-- Sin internet / intranet: descargue ${b}/dist/downloads/gob-cdn-v1.zip, súbalo a su servidor y cambie ${b}/cdn/v1 por su ruta. -->`;

export function toast(t, tipo = 'info') { if (window.gob?.toast) window.gob.toast({ tipo, titulo: t, duracion: 2200 }); }
export const copiar = async (t) => { try { await navigator.clipboard.writeText(t); toast('Copiado'); } catch { toast('No se pudo copiar', 'peligro'); } };

/** Separa la configuración en atributos HTML (string/number/boolean) y propiedades JS (objetos/arreglos). */
export function partir(cfg, DEF = {}, KEBAB = {}) {
  const attrs = [], props = {};
  for (const [k, v] of Object.entries(cfg)) {
    if (v === undefined) continue; const a = KEBAB[k] || k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
    if (typeof v === 'string' || typeof v === 'number') attrs.push(`${a}="${esc(v)}"`);
    else if (typeof v === 'boolean') { if (v && DEF[k] !== true) attrs.push(a); else if (!v && DEF[k] !== false) props[k] = false; }
    else props[k] = v;
  }
  return { attrs, props };
}

/** Genera las pestañas de código (HTML, Angular, React, JSON) para un componente. */
export function codigos({ tag, id, cfg, DEF, KEBAB, evento, nombreEv = 'Valor', conDatos = false, datosUrl = '', propDatos = 'datos' }) {
  const b = base(); const { attrs, props } = partir(cfg, DEF, KEBAB); const todos = [`id="${id}"`, ...attrs];
  const datosLinea = conDatos ? (datosUrl ? `\n  ${id}.${propDatos} = await fetch('${datosUrl}').then((r) => r.json());   // ← en producción: la URL de su API` : `\n  ${id}.${propDatos} = [];   // ← sus datos (arreglo de objetos)`) : '';
  const man = `\n  ${id}.addEventListener('${evento}', (e) => {\n    // ← aquí su lógica (abrir un detalle, filtrar, navegar…). e.detail trae los datos del evento\n    console.log(e.detail);\n  });`;
  const html = `${preludio(b)}\n\n<!-- ② El componente (responsive: ocupa el ancho de su contenedor) -->\n<div style="max-width:100%">\n  <${tag} ${todos.join('\n    ')}>\n  </${tag}>\n</div>\n\n<script type="module">\n  const ${id} = document.getElementById('${id}');\n  ${id}.config = ${sangria(json(props), 2)};${datosLinea}${man}\n</script>`;
  const campos = Object.entries(props).map(([k, v]) => `  ${k} = ${sangria(json(v), 2)};`).join('\n\n') + (conDatos ? '\n\n  ${propDatos}: any[] = [];   // ← cárguelos desde su API (HttpClient)' : '');
  const enl = Object.keys(props).map((k) => `\n    [${k}]="${k}"`).join('') + (conDatos ? '\n    [${propDatos}]="${propDatos}"' : '');
  const ng = `// 1) src/index.html — dependencias (todo lo que hay que cargar)\n// <link rel="stylesheet" href="${b}/cdn/v1/gob.css">\n// <script type="module" src="${b}/cdn/v1/gob.js"></script>\n\n// 2) componente\nimport { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';\n\n@Component({\n  selector: 'app-${tag.replace('gob-', '')}',\n  standalone: true,\n  schemas: [CUSTOM_ELEMENTS_SCHEMA],\n  template: \`\n  <${tag}${attrs.length ? '\n    ' + attrs.join('\n    ') : ''}${enl}\n    (${evento})="alEvento($event)">\n  </${tag}>\`,\n})\nexport class ${tag.replace('gob-', '').replace(/(^|-)(\w)/g, (_m, _a, c) => c.toUpperCase())}Component {\n${campos}\n\n  alEvento(e: Event) {\n    console.log((e as CustomEvent).detail);\n  }\n}`;
  const react = `// ${nombreEv}.jsx · React / Next.js (solo cliente)\n'use client'; // Next.js: el componente se registra en el navegador\n// 1) index.html — dependencias:\n//   <link rel="stylesheet" href="${b}/cdn/v1/gob.css">\n//   <script type="module" src="${b}/cdn/v1/gob.js"></script>\nimport { useEffect, useRef } from 'react';\n\nconst config = ${sangria(json(cfg), 0)};\n\nexport default function ${nombreEv}({ ${conDatos ? propDatos + ', ' : ''}onEvento }) {\n  const ref = useRef(null);\n  useEffect(() => {\n    const el = ref.current; if (!el) return;\n    el.config = config;${conDatos ? '\n    el.${propDatos} = ${propDatos};' : ''}\n    const h = (e) => onEvento?.(e.detail);\n    el.addEventListener('${evento}', h);\n    return () => el.removeEventListener('${evento}', h);\n  }, [${conDatos ? propDatos : ''}]);\n  return <${tag} ref={ref} />;\n}\n\n// TypeScript: declare namespace JSX { interface IntrinsicElements { '${tag}': any } }`;
  return { html, ng, react, json: json(cfg), snippet: `<${tag} ${todos.join(' ')}></${tag}>`, props, attrs };
}

export function montarTabs(contenedor, onCambio) {
  contenedor.addEventListener('click', (e) => { const b = e.target.closest('[data-t]'); if (!b) return; $$('.mg-tab', contenedor).forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', x === b ? 'true' : 'false'); }); onCambio(b.dataset.t); });
}
export const tabsHTML = () => `<div class="mg-tabs" role="tablist" aria-label="Formato del código" id="tabs"><button role="tab" aria-selected="true" class="mg-tab is-active" data-t="html">HTML (CDN)</button><button role="tab" aria-selected="false" class="mg-tab" data-t="ng">Angular</button><button role="tab" aria-selected="false" class="mg-tab" data-t="react">React / Next.js</button><button role="tab" aria-selected="false" class="mg-tab" data-t="json">Config JSON</button></div>
<div class="code" style="margin-top:0;border-top-left-radius:0"><div class="code__bar"><span id="codeLbl">index.html</span><button data-codecopy>Copiar</button></div><pre tabindex="0"><code id="code"></code></pre></div>`;
export const NOMBRES_TAB = { html: 'index.html', ng: 'componente.ts', react: 'Componente.jsx', json: 'config.json' };

/** Página HTML autónoma con rutas relativas ./cdn/v1/ (el usuario descomprime el ZIP al lado). */
export function paginaAutonoma(titulo, cuerpoHTML) {
  return `<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${esc(titulo)}</title>\n<!-- Descomprima gob-cdn-v1.zip en esta misma carpeta: debe quedar ./cdn/v1/gob.js -->\n<link rel="stylesheet" href="./cdn/v1/gob.css">\n<script type="module" src="./cdn/v1/gob.js"></script>\n<style>body{margin:0;padding:1.5rem;background:#F1F4F8}</style>\n</head>\n<body class="mg-base">\n${cuerpoHTML}\n</body>\n</html>\n`;
}
export function descargar(nombre, texto, tipo = 'text/html;charset=utf-8') { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([texto], { type: tipo })); a.download = nombre; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }

let tg;
export function guardarHash(S) { clearTimeout(tg); tg = setTimeout(() => { try { history.replaceState(null, '', '#c=' + btoa(unescape(encodeURIComponent(JSON.stringify(S))))); } catch {} }, 400); }
export function restaurarHash(S) { try { const m = location.hash.match(/#c=(.+)/); if (m) Object.assign(S, JSON.parse(decodeURIComponent(escape(atob(m[1]))))); } catch {} }

export const chk = (S, k, t) => `<label class="st-chk"><input type="checkbox" data-k="${k}" ${S[k] ? 'checked' : ''}> ${t}</label>`;
export const sel = (S, k, t, ops) => `<label class="st-f"><span>${t}</span><select class="mg-select" data-k="${k}">${ops.map(([v, l]) => `<option value="${esc(v)}" ${String(S[k]) === String(v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>`;
export const txt = (S, k, t, ph = '') => `<label class="st-f"><span>${t}</span><input class="mg-input" data-k="${k}" value="${esc(S[k])}" placeholder="${esc(ph)}"></label>`;
export const baseBar = () => `<div class="baseurl"><b>URL base del CDN:</b><input class="mg-input" id="baseInput" aria-label="URL base"><button class="mg-btn mg-btn--ghost mg-btn--sm" id="baseReset">Autodetectar</button><span class="mg-help" style="width:100%;margin:0">El código generado carga <code class="inline">URL_BASE/cdn/v1/gob.css</code> y <code class="inline">gob.js</code>. <a href="../dist/downloads/gob-cdn-v1.zip">Descargar el paquete autónomo (.zip)</a> para usarlo sin internet.</span></div>`;
export function enlazarBase(sync) {
  const bi = $('#baseInput'); bi.value = base();
  bi.addEventListener('input', () => { try { localStorage.setItem('mg-base', bi.value.replace(/\/$/, '') || DETECTADA); } catch {} sync(); });
  $('#baseReset').addEventListener('click', () => { try { localStorage.removeItem('mg-base'); } catch {} bi.value = DETECTADA; sync(); });
}
