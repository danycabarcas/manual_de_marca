/* demo-kit.js — SOLO para las demos del manual (no copiar a producción).
   Muestra guías sobre cada sección [data-demo], permite copiar una sección o la página completa y descargar el .html. */
const BASE = new URL('../', location.href).href.replace(/\/$/, '');
const $ = (s, r = document) => r.querySelector(s);
const limpiar = (h) => h.replace(/\sdata-(demo|nota)="[^"]*"/g, '').replace(/\sdata-dk-[a-z-]+(="[^"]*")?/g, '').replace(/\n{3,}/g, '\n\n');
const absolutas = (h) => h.split('../cdn/v1/').join(BASE + '/cdn/v1/');
const aviso = (t, tipo = 'exito') => window.gob?.toast({ tipo, titulo: t, duracion: 2400 });
async function copiar(texto, msg) { try { await navigator.clipboard.writeText(texto); aviso(msg); } catch { aviso('No se pudo copiar', 'peligro'); } }
async function fuente() { const t = await fetch(location.pathname).then((r) => r.text()); return absolutas(t.replace(/<!--DEMO-ONLY-->[\s\S]*?<!--\/DEMO-ONLY-->/g, '')); }

const css = document.createElement('style'); css.textContent = `
  .dk-bar { position: fixed; right: 1rem; bottom: 1rem; z-index: 2147482000; display: flex; gap: .4rem; padding: .4rem; background: rgba(8,26,44,.92); backdrop-filter: blur(10px); border-radius: 14px; box-shadow: 0 12px 32px rgba(8,26,44,.4); font-family: Montserrat, system-ui, sans-serif; }
  .dk-bar button, .dk-tag button { font: 600 .78rem/1 Montserrat, system-ui, sans-serif; border: 0; border-radius: 9px; padding: .55rem .8rem; cursor: pointer; color: #fff; background: rgba(255,255,255,.12); } .dk-bar button:hover { background: rgba(255,255,255,.22); } .dk-bar button[aria-pressed="true"] { background: #00B7D9; color: #051220; } .dk-bar button:focus-visible, .dk-tag button:focus-visible { outline: 2px solid #9FD7E5; outline-offset: 2px; }
  .dk-on [data-demo] { outline: 2px dashed #00B7D9; outline-offset: 6px; position: relative; }
  .dk-tag { position: absolute; z-index: 60; left: 6px; top: -1.9rem; display: none; align-items: center; gap: .4rem; background: #081A2C; color: #fff; border-radius: 9px; padding: .3rem .4rem .3rem .65rem; font: 700 .72rem/1.2 Montserrat, system-ui, sans-serif; max-width: min(34rem, 92vw); box-shadow: 0 6px 18px rgba(8,26,44,.35); } .dk-on .dk-tag { display: flex; }
  .dk-tag small { font-weight: 500; opacity: .75; max-width: 20rem; display: none; } @media (min-width: 900px) { .dk-tag small { display: inline; } } .dk-tag button { background: #00B7D9; color: #051220; padding: .38rem .6rem; font-size: .7rem; }
  [data-demo] { scroll-margin-top: 5rem; } @media print { .dk-bar, .dk-tag { display: none !important; } }`;
document.head.appendChild(css);

const bar = document.createElement('div'); bar.className = 'dk-bar'; bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', 'Herramientas del demo');
bar.innerHTML = `<button type="button" id="dk-g" aria-pressed="false" title="Muestra el nombre de cada sección y el botón para copiarla">‹/› Guías de código</button><button type="button" id="dk-c" title="Copia todo el HTML de esta página, listo para pegar">⧉ Copiar página</button><button type="button" id="dk-d" title="Descarga esta página como .html">⬇ .html</button>`;
document.body.appendChild(bar);

for (const el of document.querySelectorAll('[data-demo]')) {
  const tag = document.createElement('div'); tag.className = 'dk-tag'; tag.setAttribute('data-dk-tag', '');
  const nota = el.dataset.nota ? `<small>${el.dataset.nota}</small>` : '';
  tag.innerHTML = `<span>${el.dataset.demo}</span>${nota}<button type="button">Copiar sección</button>`;
  tag.querySelector('button').addEventListener('click', (e) => { e.stopPropagation(); const c = el.cloneNode(true); c.querySelectorAll('[data-dk-tag]').forEach((n) => n.remove()); copiar(absolutas(`<!-- ${el.dataset.demo}: requiere gob.css y gob.js (ver «Cómo usar este demo») -->\n` + limpiar(c.outerHTML)), `«${el.dataset.demo}» copiada`); });
  el.prepend(tag);
}
const g = $('#dk-g'); g.addEventListener('click', () => { const on = document.documentElement.classList.toggle('dk-on'); g.setAttribute('aria-pressed', String(on)); if (on) aviso('Guías activadas: use «Copiar sección» sobre cada bloque', 'info'); });
$('#dk-c').addEventListener('click', async () => copiar(await fuente(), 'Código de la página copiado'));
$('#dk-d').addEventListener('click', async () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([await fuente()], { type: 'text/html;charset=utf-8' })); a.download = location.pathname.split('/').pop() || 'demo.html'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); });
