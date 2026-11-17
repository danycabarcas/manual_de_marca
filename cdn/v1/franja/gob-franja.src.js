/*!
 * gob-franja · Franja institucional + Pie de página + Accesibilidad — Gobernación del Magdalena
 * Un solo archivo, sin dependencias (JavaScript puro, Custom Elements + Shadow DOM). Funciona como <script> normal en cualquier sitio.
 *
 *   <script src="https://…/cdn/v1/franja/gob-franja.js" data-auto data-modo="ambos"
 *           data-config='{"enlaces":[{"t":"Transparencia","u":"/transparencia"}]}'></script>
 *
 * o con etiquetas:   <gob-franja></gob-franja> … <gob-pie></gob-pie>
 * Configuración (de menor a mayor prioridad): valores por defecto < window.GOB_FRANJA < data-config del <script> < atributo/propiedad config del elemento.
 * Licencia: uso libre para sitios de la Gobernación y sus aliados. © Gobernación del Magdalena.
 */
(function () {
  'use strict';
  if (window.GobFranja) return;
  var VERSION = '1.0.0';
  var SCRIPT = document.currentScript;
  var BASE = SCRIPT && SCRIPT.src ? SCRIPT.src.replace(/[^\/]*$/, '') : '';
  var LS = 'gob-a11y';

  var DEF = {
    titulo: 'Gobernación del Magdalena', url: 'https://www.magdalena.gov.co', logo: '', color: '#5618BA',
    texto: 'Sitio oficial',                       // micro-texto junto al logo ('' para ocultarlo)
    enlaces: [],                                   // [{ t:'Transparencia', u:'/transparencia' }]
    accesibilidad: true,                           // panel de accesibilidad
    opciones: ['texto', 'contraste', 'enlaces', 'espaciado', 'animaciones'],
    contenido: 'main, #main, #content, [role=main]', // destino del enlace «Ir al contenido»
    sticky: false,                                 // franja fija al hacer scroll
    despuesDe: '',                                 // selector: insertar la franja DESPUÉS de ese elemento (p. ej. la franja GOV.CO) en vez de al inicio
    aplicarA: 'html',                              // selector del elemento donde se aplican las preferencias
    pasos: [90, 100, 112, 125, 150],               // tamaños de texto (%)
    pie: null                                      // ver DEF_PIE; null = sin pie
  };
  var DEF_PIE = {
    logo: '', titulo: 'Gobernación del Magdalena', direccion: 'Carrera 1C N° 16-15, Palacio Tayrona · Santa Marta, Magdalena', telefono: '', correo: 'contactenos@magdalena.gov.co', horario: '',
    columnas: [], redes: [], legal: [], texto: ''
  };

  /* ---------- utilidades ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function safeUrl(u) { u = String(u || '').trim(); return /^(https?:|mailto:|tel:|\/|#|\.{1,2}\/)/i.test(u) || /^[\w-]+(\/|\.|$)/.test(u) ? u : '#'; }
  function merge(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in (b || {})) if (b[k] !== undefined) o[k] = b[k]; return o; }
  function json(s) { try { return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function scriptCfg() {
    if (!SCRIPT) return {};
    var c = json(SCRIPT.getAttribute('data-config')) || {}, d = SCRIPT.dataset || {};
    ['titulo', 'url', 'logo', 'color', 'texto', 'contenido', 'aplicarA'].forEach(function (k) { var a = k.replace(/[A-Z]/g, function (m) { return '-' + m.toLowerCase(); }); if (SCRIPT.hasAttribute('data-' + a)) c[k] = SCRIPT.getAttribute('data-' + a); });
    if (SCRIPT.hasAttribute('data-sticky')) c.sticky = SCRIPT.getAttribute('data-sticky') !== 'false';
    if (SCRIPT.hasAttribute('data-accesibilidad')) c.accesibilidad = SCRIPT.getAttribute('data-accesibilidad') !== 'false';
    return c;
  }
  function config(el) { var c = merge(merge(DEF, window.GOB_FRANJA || {}), scriptCfg()); var a = json(el.getAttribute('config')); if (a) c = merge(c, a); if (el._cfg) c = merge(c, el._cfg); return c; }

  /* ---------- preferencias de accesibilidad (se aplican al instante) ---------- */
  var prefs = (function () { try { return merge({ t: 100, c: 0, e: 0, s: 0, a: 0 }, json(localStorage.getItem(LS))); } catch (e) { return { t: 100, c: 0, e: 0, s: 0, a: 0 }; } })();
  var CSS_GLOBAL = '.gob-hc,.gob-hc body{background:#000!important;color:#fff!important}.gob-hc *:not(gob-franja):not(gob-pie):not(img):not(video):not(canvas):not(iframe):not(svg):not(svg *){background-color:#000!important;background-image:none!important;color:#fff!important;border-color:#fff!important;box-shadow:none!important;text-shadow:none!important}.gob-hc a,.gob-hc a *{color:#ffe600!important}.gob-hc img,.gob-hc video{filter:grayscale(1) contrast(1.1)}' +
    '.gob-ul a{text-decoration:underline!important;text-underline-offset:.16em!important}.gob-sp,.gob-sp *:not(gob-franja):not(gob-pie){line-height:1.8!important;letter-spacing:.05em!important;word-spacing:.12em!important}' +
    '.gob-nm *:not(gob-franja):not(gob-pie),.gob-nm *::before,.gob-nm *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}';
  function scope(cfg) { try { return document.querySelector((cfg && cfg.aplicarA) || 'html') || document.documentElement; } catch (e) { return document.documentElement; } }
  var ALCANCE = null;
  function aplicar(cfg) {
    var el = scope(cfg || ALCANCE || DEF); ALCANCE = cfg || ALCANCE;
    if (!document.getElementById('gob-a11y-css')) { var st = document.createElement('style'); st.id = 'gob-a11y-css'; st.textContent = CSS_GLOBAL; (document.head || document.documentElement).appendChild(st); }
    el.classList.toggle('gob-hc', !!prefs.c); el.classList.toggle('gob-ul', !!prefs.e); el.classList.toggle('gob-sp', !!prefs.s); el.classList.toggle('gob-nm', !!prefs.a);
    el.style.fontSize = prefs.t && prefs.t !== 100 ? prefs.t + '%' : '';
  }
  function guardar(ev) { try { localStorage.setItem(LS, JSON.stringify(prefs)); } catch (e) {} document.dispatchEvent(new CustomEvent('gob-franja-cambio', { detail: merge(prefs, {}) })); }
  aplicar(merge(DEF, scriptCfg()));

  /* ---------- íconos (trazos 24×24) ---------- */
  var IC = {
    acc: '<circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/>',
    cerrar: '<path d="M18 6 6 18M6 6l12 12"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    x: '<path d="M4 4l16 16M20 4 4 20"/>', twitter: '<path d="M4 4l16 16M20 4 4 20"/>',
    youtube: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
    whatsapp: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>', linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    tiktok: '<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>', web: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>', mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    tel: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>', reloj: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'
  };
  function svg(n, s) { return '<svg width="' + (s || 16) + '" height="' + (s || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (IC[n] || IC.web) + '</svg>'; }

  /* ---------- FRANJA ---------- */
  var CSS_F = ':host{display:block;position:relative;z-index:2147483000;font:500 12.5px/1.3 Montserrat,"Segoe UI",system-ui,-apple-system,Arial,sans-serif}:host([hidden]){display:none}*{box-sizing:border-box}' +
    '.skip{position:absolute;left:.5rem;top:-3rem;background:#fff;color:#2a0f66;padding:.5rem .9rem;border-radius:0 0 8px 8px;font-weight:700;text-decoration:none;z-index:2;transition:top .15s}.skip:focus{top:0;outline:3px solid #FEC800}' +
    '.bar{background:var(--c,#5618BA);color:#fff;border-bottom:1px solid rgba(255,255,255,.14)}.sticky{position:sticky;top:0}.in{display:flex;align-items:center;gap:1rem;min-height:36px;max-width:1280px;margin:0 auto;padding:0 1rem}' +
    '.logo{display:flex;align-items:center;gap:.6rem;color:#fff;text-decoration:none;min-width:0}.logo img{height:22px;width:auto;display:block}.logo span{font-weight:600;opacity:.9;border-left:1px solid rgba(255,255,255,.3);padding-left:.6rem;white-space:nowrap}' +
    '.sp{flex:1}.links{display:flex;gap:.25rem;align-items:center}.links a{color:#fff;text-decoration:none;padding:.35rem .6rem;border-radius:6px;font-weight:500;white-space:nowrap}.links a:hover{background:rgba(255,255,255,.14)}' +
    'a:focus-visible,button:focus-visible{outline:2px solid #FEC800;outline-offset:2px}.btn{display:inline-flex;align-items:center;gap:.4rem;border:0;background:transparent;color:#fff;font:inherit;font-weight:600;padding:.35rem .6rem;border-radius:6px;cursor:pointer}.btn:hover,.btn[aria-expanded=true]{background:rgba(255,255,255,.16)}' +
    '.a11y{position:relative}.panel{position:absolute;right:0;top:calc(100% + 8px);width:min(19rem,calc(100vw - 1.5rem));background:#fff;color:#161A22;border-radius:14px;box-shadow:0 18px 50px rgba(8,26,44,.35);padding:1rem;z-index:3}.panel[hidden]{display:none}' +
    '.ph{display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem}.ph b{font-size:13px;color:#2a0f66}.x{border:0;background:#F1F4F8;color:#161A22;border-radius:8px;width:1.9rem;height:1.9rem;display:grid;place-items:center;cursor:pointer}.x:hover{background:#E3E8EF}' +
    '.row{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.55rem 0;border-top:1px solid #EEF1F6}.row label,.row .l{font-weight:600;font-size:12.5px}.row small{display:block;font-weight:500;color:#5B6575;font-size:11px}' +
    '.sz{display:inline-flex;gap:.25rem;align-items:center}.sz button{border:1px solid #CBD2DC;background:#fff;color:#161A22;border-radius:8px;min-width:2.1rem;height:2.1rem;font-weight:700;font-size:12px;font-family:inherit;cursor:pointer}.sz button:hover{background:#F4F6FA}.sz output{min-width:2.8rem;text-align:center;font-weight:700;font-size:12px;color:#5618BA}' +
    '.sw{width:2.5rem;height:1.45rem;border-radius:99px;border:0;background:#B6BEC9;position:relative;cursor:pointer;flex:none;transition:background .15s}.sw::after{content:"";position:absolute;left:.2rem;top:.2rem;width:1.05rem;height:1.05rem;border-radius:50%;background:#fff;transition:transform .15s}.sw[aria-checked=true]{background:#5618BA}.sw[aria-checked=true]::after{transform:translateX(1.05rem)}' +
    '.rs{margin-top:.5rem;width:100%;border:1px solid #CBD2DC;background:#fff;color:#161A22;border-radius:8px;padding:.55rem;font-weight:600;font-size:12px;font-family:inherit;cursor:pointer}.rs:hover{background:#F4F6FA}.vh{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}' +
    '@media(max-width:720px){.links{display:none}.logo span{display:none}}@media(prefers-reduced-motion:reduce){*{transition:none!important}}';

  function logoUrl(c) { return c.logo || (BASE ? BASE + 'logo-blanco.png' : ''); }
  var OPT = { texto: 1, contraste: 1, enlaces: 1, espaciado: 1, animaciones: 1 };

  function Franja() { return Reflect.construct(HTMLElement, [], Franja); }
  Franja.prototype = Object.create(HTMLElement.prototype, { constructor: { value: Franja } }); Object.setPrototypeOf(Franja, HTMLElement);
  Franja.prototype.connectedCallback = function () { if (!this._r) { this._r = this.attachShadow({ mode: 'open' }); } this.render(); };
  Franja.prototype.attributeChangedCallback = function () { if (this._r) this.render(); };
  Franja.observedAttributes = ['config'];
  Object.defineProperty(Franja.prototype, 'config', { get: function () { return config(this); }, set: function (v) { this._cfg = v; if (this._r) this.render(); } });
  Franja.prototype.abrirPanel = function () { var b = this._r.querySelector('.btn'); if (b && b.getAttribute('aria-expanded') !== 'true') b.click(); };
  Franja.prototype.restablecer = function () { prefs = { t: 100, c: 0, e: 0, s: 0, a: 0 }; aplicar(this._c); guardar(); this._sync(); };
  Franja.prototype._sync = function () {
    var r = this._r, c = this._c; if (!r) return; var o = r.querySelector('output'); if (o) o.textContent = prefs.t + '%';
    [['c', 'contraste'], ['e', 'enlaces'], ['s', 'espaciado'], ['a', 'animaciones']].forEach(function (p) { var s = r.querySelector('[data-o=' + p[1] + ']'); if (s) s.setAttribute('aria-checked', prefs[p[0]] ? 'true' : 'false'); });
  };
  Franja.prototype.render = function () {
    var self = this, c = this._c = config(this), r = this._r, ops = (c.opciones || []).filter(function (o) { return OPT[o]; });
    var lg = logoUrl(c), ln = (c.enlaces || []).map(function (l) { return '<a href="' + esc(safeUrl(l.u)) + '">' + esc(l.t) + '</a>'; }).join('');
    var panel = '';
    if (c.accesibilidad && ops.length) {
      var rows = '';
      if (ops.indexOf('texto') > -1) rows += '<div class="row"><span class="l">Tamaño del texto<small>Aumentar o reducir</small></span><span class="sz"><button type="button" data-t="-1" aria-label="Reducir texto">A−</button><output aria-live="polite">' + prefs.t + '%</output><button type="button" data-t="1" aria-label="Aumentar texto">A+</button></span></div>';
      [['contraste', 'Alto contraste', 'Fondo oscuro, texto claro'], ['enlaces', 'Subrayar enlaces', 'Resalta todos los enlaces'], ['espaciado', 'Espaciado de texto', 'Más aire entre líneas y letras'], ['animaciones', 'Pausar animaciones', 'Sin movimiento ni transiciones']].forEach(function (o) {
        if (ops.indexOf(o[0]) > -1) rows += '<div class="row"><span class="l" id="l-' + o[0] + '">' + o[1] + '<small>' + o[2] + '</small></span><button type="button" class="sw" role="switch" aria-labelledby="l-' + o[0] + '" data-o="' + o[0] + '" aria-checked="false"></button></div>';
      });
      panel = '<div class="a11y"><button type="button" class="btn" aria-expanded="false" aria-controls="p" aria-haspopup="dialog">' + svg('acc', 16) + '<span>Accesibilidad</span></button>' +
        '<div class="panel" id="p" role="dialog" aria-label="Opciones de accesibilidad" hidden><div class="ph"><b>Accesibilidad</b><button type="button" class="x" data-close aria-label="Cerrar">' + svg('cerrar', 14) + '</button></div>' + rows + '<button type="button" class="rs" data-reset>Restablecer valores</button><div class="vh" role="status" aria-live="polite"></div></div></div>';
    }
    r.innerHTML = '<style>' + CSS_F + '</style><a class="skip" href="#contenido" data-skip>Ir al contenido principal</a><div class="bar' + (c.sticky ? ' sticky' : '') + '" style="--c:' + esc(c.color) + '" role="region" aria-label="Franja institucional">' +
      '<div class="in"><a class="logo" href="' + esc(safeUrl(c.url)) + '" aria-label="' + esc(c.titulo) + ', sitio oficial">' + (lg ? '<img src="' + esc(lg) + '" alt="" height="22">' : '<b>' + esc(c.titulo) + '</b>') + (c.texto ? '<span>' + esc(c.texto) + '</span>' : '') + '</a><span class="sp"></span><nav class="links" aria-label="Enlaces institucionales">' + ln + '</nav>' + panel + '</div></div>';
    this._sync();
    var skip = r.querySelector('[data-skip]');
    skip.addEventListener('click', function (e) { var t = null; try { t = document.querySelector(c.contenido); } catch (x) {} if (!t) return; e.preventDefault(); if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1'); t.focus(); t.scrollIntoView(); });
    var btn = r.querySelector('.btn'); if (!btn) return; var pn = r.getElementById ? r.getElementById('p') : r.querySelector('#p'), say = r.querySelector('[role=status]');
    function abrir(v) { pn.hidden = !v; btn.setAttribute('aria-expanded', v ? 'true' : 'false'); if (v) { var f = pn.querySelector('button'); if (f) f.focus(); } else btn.focus(); }
    btn.addEventListener('click', function () { abrir(pn.hidden); });
    r.querySelector('[data-close]').addEventListener('click', function () { abrir(false); });
    r.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pn.hidden) { e.stopPropagation(); abrir(false); } });
    this._out = this._out || function (e) { if (self._r && !self._r.querySelector('#p').hidden && !e.composedPath().includes(self)) { self._r.querySelector('#p').hidden = true; self._r.querySelector('.btn').setAttribute('aria-expanded', 'false'); } };
    document.removeEventListener('pointerdown', this._out, true); document.addEventListener('pointerdown', this._out, true);
    var pasos = c.pasos && c.pasos.length ? c.pasos : DEF.pasos;
    r.querySelectorAll('[data-t]').forEach(function (b) { b.addEventListener('click', function () { var i = pasos.indexOf(prefs.t); if (i < 0) { i = pasos.reduce(function (m, v, k) { return Math.abs(v - prefs.t) < Math.abs(pasos[m] - prefs.t) ? k : m; }, 0); } i = Math.max(0, Math.min(pasos.length - 1, i + Number(b.dataset.t))); prefs.t = pasos[i]; aplicar(c); guardar(); self._sync(); say.textContent = 'Tamaño de texto ' + prefs.t + '%'; }); });
    r.querySelectorAll('[data-o]').forEach(function (b) { b.addEventListener('click', function () { var k = { contraste: 'c', enlaces: 'e', espaciado: 's', animaciones: 'a' }[b.dataset.o]; prefs[k] = prefs[k] ? 0 : 1; aplicar(c); guardar(); self._sync(); say.textContent = (prefs[k] ? 'Activado: ' : 'Desactivado: ') + r.querySelector('#l-' + b.dataset.o).firstChild.textContent; }); });
    r.querySelector('[data-reset]').addEventListener('click', function () { self.restablecer(); say.textContent = 'Valores restablecidos'; });
    aplicar(c);
  };

  /* ---------- PIE ---------- */
  var CSS_P = ':host{display:block;font:400 13.5px/1.55 Montserrat,"Segoe UI",system-ui,-apple-system,Arial,sans-serif;color:#C9D4E3}*{box-sizing:border-box}a{color:#E6EEF7;text-decoration:none}a:hover{color:#fff;text-decoration:underline}a:focus-visible{outline:2px solid #FEC800;outline-offset:2px;border-radius:3px}' +
    'footer{background:#0B2239;position:relative}.line{height:4px;background:linear-gradient(90deg,#5618BA 0 11.11%,#A28034 0 22.22%,#FEC800 0 33.33%,#F7003C 0 44.44%,#0071BB 0 55.55%,#00B7D9 0 66.66%,#9FD7E5 0 77.77%,#69B75E 0 88.88%,#5618BA 0)}' +
    '.in{max-width:1180px;margin:0 auto;padding:2rem 1.25rem 1.25rem;display:grid;grid-template-columns:minmax(14rem,1.3fr) repeat(var(--n,2),minmax(9rem,1fr)) auto;gap:1.75rem 2.5rem;align-items:start}' +
    '.brand img{height:42px;width:auto;display:block;margin-bottom:.8rem}.brand b{display:block;color:#fff;font-size:15px;margin-bottom:.6rem}.brand p{margin:.25rem 0;display:flex;gap:.5rem;align-items:flex-start;font-size:12.5px}.brand p svg{flex:none;margin-top:.2rem;color:#9FD7E5}' +
    'h3{margin:0 0 .7rem;color:#fff;font-weight:700;font-size:12px;line-height:1.2;font-family:inherit;letter-spacing:.09em;text-transform:uppercase}ul{list-style:none;margin:0;padding:0;display:grid;gap:.45rem}' +
    '.soc{display:flex;gap:.5rem;flex-wrap:wrap}.soc a{display:grid;place-items:center;width:2.3rem;height:2.3rem;border-radius:50%;background:rgba(255,255,255,.08);color:#fff}.soc a:hover{background:#5618BA;text-decoration:none}' +
    '.bot{border-top:1px solid rgba(255,255,255,.1)}.bot .in{display:flex;flex-wrap:wrap;justify-content:space-between;gap:.5rem 1.5rem;padding-top:1rem;padding-bottom:1.1rem;font-size:12px;color:#9FB0C6}.bot nav{display:flex;gap:.5rem 1.25rem;flex-wrap:wrap}' +
    '@media(max-width:900px){.in{grid-template-columns:1fr 1fr}.brand{grid-column:1/-1}}@media(max-width:520px){.in{grid-template-columns:1fr}}';
  function Pie() { return Reflect.construct(HTMLElement, [], Pie); }
  Pie.prototype = Object.create(HTMLElement.prototype, { constructor: { value: Pie } }); Object.setPrototypeOf(Pie, HTMLElement);
  Pie.prototype.connectedCallback = function () { if (!this._r) this._r = this.attachShadow({ mode: 'open' }); this.render(); };
  Pie.prototype.attributeChangedCallback = function () { if (this._r) this.render(); }; Pie.observedAttributes = ['config'];
  Object.defineProperty(Pie.prototype, 'config', { get: function () { return config(this); }, set: function (v) { this._cfg = v; if (this._r) this.render(); } });
  Pie.prototype.render = function () {
    var c = config(this), p = merge(DEF_PIE, c.pie || {}), lg = p.logo || (BASE ? BASE + 'logo-blanco.png' : '');
    var cols = (p.columnas || []).slice(0, 3).map(function (k) { return '<nav aria-label="' + esc(k.titulo) + '"><h3>' + esc(k.titulo) + '</h3><ul>' + (k.enlaces || []).map(function (l) { return '<li><a href="' + esc(safeUrl(l.u)) + '">' + esc(l.t) + '</a></li>'; }).join('') + '</ul></nav>'; }).join('');
    var soc = (p.redes || []).map(function (s) { return '<a href="' + esc(safeUrl(s.u)) + '" aria-label="' + esc(s.t || s.n) + '" target="_blank" rel="noopener">' + svg(s.n, 17) + '</a>'; }).join('');
    var legal = (p.legal || []).map(function (l) { return '<a href="' + esc(safeUrl(l.u)) + '">' + esc(l.t) + '</a>'; }).join('');
    this._r.innerHTML = '<style>' + CSS_P + '</style><footer role="contentinfo" aria-label="Pie de página"><div class="line" aria-hidden="true"></div><div class="in" style="--n:' + Math.max(1, Math.min(3, (p.columnas || []).length || 1)) + '">' +
      '<div class="brand">' + (lg ? '<img src="' + esc(lg) + '" alt="' + esc(p.titulo) + '" height="42">' : '<b>' + esc(p.titulo) + '</b>') +
      (p.direccion ? '<p>' + svg('pin', 15) + '<span>' + esc(p.direccion) + '</span></p>' : '') + (p.telefono ? '<p>' + svg('tel', 15) + '<span>' + esc(p.telefono) + '</span></p>' : '') +
      (p.correo ? '<p>' + svg('mail', 15) + '<a href="mailto:' + esc(p.correo) + '">' + esc(p.correo) + '</a></p>' : '') + (p.horario ? '<p>' + svg('reloj', 15) + '<span>' + esc(p.horario) + '</span></p>' : '') + '</div>' + cols +
      (soc ? '<div><h3>Síguenos</h3><div class="soc">' + soc + '</div></div>' : '<div></div>') + '</div>' +
      '<div class="bot"><div class="in"><span>' + esc(p.texto || '© ' + new Date().getFullYear() + ' ' + p.titulo + ' · República de Colombia') + '</span><nav aria-label="Información legal">' + legal + '</nav></div></div></footer>';
  };

  function def(n, C) { if (!customElements.get(n)) customElements.define(n, C); }
  def('gob-franja', Franja); def('gob-pie', Pie);

  /* ---------- inserción automática ---------- */
  function auto() {
    if (!SCRIPT || !SCRIPT.hasAttribute('data-auto')) return;
    var modo = SCRIPT.getAttribute('data-modo') || 'franja', cfg = merge(merge(DEF, window.GOB_FRANJA || {}), scriptCfg());
    if ((modo === 'franja' || modo === 'ambos') && !document.querySelector('gob-franja')) {
      var f = document.createElement('gob-franja'), ref = null; try { ref = cfg.despuesDe ? document.querySelector(cfg.despuesDe) : null; } catch (e) {}
      if (ref && ref.parentNode) ref.parentNode.insertBefore(f, ref.nextSibling); else document.body.insertBefore(f, document.body.firstChild);
    }
    if ((modo === 'pie' || modo === 'ambos') && !document.querySelector('gob-pie')) document.body.appendChild(document.createElement('gob-pie'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();

  window.GobFranja = { version: VERSION, preferencias: function () { return merge(prefs, {}); }, aplicar: function (p) { prefs = merge(prefs, p || {}); aplicar(); guardar(); }, restablecer: function () { prefs = { t: 100, c: 0, e: 0, s: 0, a: 0 }; aplicar(); guardar(); } };
})();
