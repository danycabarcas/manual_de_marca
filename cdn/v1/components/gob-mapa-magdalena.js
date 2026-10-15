import { A as p, E as S, i as C, R as x, I as k, c as B, d as M, f as $, w as u, b as g, t as z, a as A } from "../chunks/mapa-recursos-3Ugn1q_R.js";
const E = { CHILD: 2 }, j = (d) => (...t) => ({ _$litDirective$: d, values: t });
class R {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, o) {
    this._$Ct = t, this._$AM = e, this._$Ci = o;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
}
class w extends R {
  constructor(t) {
    if (super(t), this.it = p, t.type !== E.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(t) {
    if (t === p || t == null) return this._t = void 0, this.it = t;
    if (t === S) return t;
    if (typeof t != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (t === this.it) return this._t;
    this.it = t;
    const e = [t];
    return e.raw = e, this._t = { _$litType$: this.constructor.resultType, strings: e, values: [] };
  }
}
w.directiveName = "unsafeHTML", w.resultType = 1;
const q = j(w), y = /* @__PURE__ */ new Map(), D = new URL("../datos/", import.meta.url).href, f = (d) => String(d ?? "").replace(/[&<>"']/g, (t) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[t]), T = { fromAttribute: (d) => d ? d.split(/[\s,]+/).filter(Boolean) : [], toAttribute: (d) => d.join(",") }, _ = { fromAttribute: (d) => {
  try {
    return d ? JSON.parse(d) : void 0;
  } catch {
    return;
  }
}, toAttribute: (d) => JSON.stringify(d) };
class F extends C {
  constructor() {
    super(), this._pointers = /* @__PURE__ */ new Map(), this._drag = null, this._pinch0 = null, this._anim = 0, this.detalle = "medio", this.modo = "subregiones", this.rampa = "azul", this.clases = 5, this.escala = "lineal", this.etiquetas = "ninguna", this.etiquetasAuto = !0, this.leyenda = !0, this.leyendaTitulo = "", this.tooltip = !0, this.tooltipFormato = "<strong>{nombre}</strong><br><span>{subregion}</span><br>{valor}", this.seleccion = "", this.multiple = !1, this.clic = "seleccionar", this.enlace = "", this.efectos = ["entrada"], this.tema = "claro", this.zoom = !0, this.zoomRueda = !1, this.controles = !0, this.titulo = "Mapa del departamento del Magdalena", this.descripcion = "", this.formato = "numero", this.unidad = "", this.srcDatos = "", this.filtroSubregion = "", this.mostrarContorno = !0, this._geo = null, this._tf = { k: 1, x: 0, y: 0 }, this._hover = null, this._tip = null, this._ppu = 0.5, this._error = "";
  }
  static {
    this.properties = {
      detalle: { type: String },
      modo: { type: String },
      datos: { converter: _ },
      categorias: { converter: _ },
      coloresCategorias: { attribute: "colores-categorias", converter: _ },
      coloresSubregiones: { attribute: "colores-subregiones", converter: _ },
      rampa: { converter: { fromAttribute: (t) => t ? t.trim().startsWith("[") ? JSON.parse(t) : t : "azul" } },
      clases: { type: Number },
      escala: { type: String },
      etiquetas: { type: String },
      etiquetasAuto: { attribute: "etiquetas-auto", type: Boolean },
      leyenda: { type: Boolean },
      leyendaTitulo: { attribute: "leyenda-titulo", type: String },
      tooltip: { type: Boolean },
      tooltipFormato: { attribute: "tooltip-formato", type: String },
      seleccion: { type: String, reflect: !0 },
      multiple: { type: Boolean },
      clic: { type: String },
      enlace: { type: String },
      marcadores: { converter: _ },
      lineas: { converter: _ },
      efectos: { converter: T },
      tema: { type: String, reflect: !0 },
      zoom: { type: Boolean },
      zoomRueda: { attribute: "zoom-rueda", type: Boolean },
      controles: { type: Boolean },
      titulo: { type: String },
      descripcion: { type: String },
      formato: { type: String },
      unidad: { type: String },
      srcDatos: { attribute: "src-datos", type: String },
      filtroSubregion: { attribute: "filtro-subregion", type: String },
      mostrarContorno: { attribute: "mostrar-contorno", type: Boolean },
      _geo: { state: !0 },
      _tf: { state: !0 },
      _hover: { state: !0 },
      _tip: { state: !0 },
      _ppu: { state: !0 },
      _error: { state: !0 }
    };
  }
  /** Configura varias propiedades a la vez (lo usa el Estudio para generar y aplicar código). */
  set config(t) {
    Object.assign(this, t);
  }
  get config() {
    return {};
  }
  static get rampas() {
    return x;
  }
  static get iconos() {
    return k;
  }
  // ------------------------------------------------------------------ ciclo de vida
  connectedCallback() {
    super.connectedCallback(), this._ro = new ResizeObserver(() => this._medir()), this._cargar();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._ro?.disconnect(), cancelAnimationFrame(this._anim);
  }
  firstUpdated() {
    const t = this.renderRoot.querySelector("svg");
    t && this._ro?.observe(t), this._medir();
  }
  updated(t) {
    (t.has("detalle") || t.has("srcDatos")) && this._cargar(), t.has("seleccion") && this.dispatchEvent(new CustomEvent("gob-seleccion-cambio", { detail: { seleccion: this._selSet() }, bubbles: !0, composed: !0 }));
  }
  _medir() {
    const t = this.renderRoot.querySelector("svg");
    if (t && this._geo) {
      const e = t.getBoundingClientRect().width;
      e && (this._ppu = e / this._geo.meta.viewBox[2]);
    }
  }
  _cargar() {
    const e = (this.srcDatos || D).replace(/\/?$/, "/") + `magdalena-municipios.${this.detalle}.json`;
    y.has(e) || y.set(e, fetch(e).then((o) => {
      if (!o.ok) throw new Error(`No se pudo cargar ${e} (${o.status})`);
      return o.json();
    })), y.get(e).then((o) => {
      this._geo = o, this._error = "", this.updateComplete.then(() => {
        const s = this.renderRoot.querySelector("svg");
        s && this._ro?.observe(s), this._medir(), this.dispatchEvent(new CustomEvent("gob-mapa-listo", { bubbles: !0, composed: !0 }));
      });
    }).catch((o) => {
      y.delete(e), this._error = String(o.message || o);
    });
  }
  // ------------------------------------------------------------------ datos derivados
  _selSet() {
    return this.seleccion ? this.seleccion.split(",").filter(Boolean) : [];
  }
  _colores() {
    return Array.isArray(this.rampa) ? this.rampa : x[this.rampa]?.colores ?? x.azul.colores;
  }
  _clases() {
    return this.modo === "coropleta" && this.datos ? B(Object.values(this.datos), Math.max(2, this.clases), this._colores(), this.escala) : [];
  }
  _subColor(t) {
    return this.coloresSubregiones?.[t] ?? this._geo?.subregiones.find((e) => e.id === t)?.color ?? "#97A1B0";
  }
  _fillDe(t, e) {
    switch (this.modo) {
      case "plano":
        return "var(--gob-mapa-relleno)";
      case "coropleta": {
        const o = this.datos?.[t.codigo], s = o == null ? void 0 : M(o, e);
        return s ? s.color : "var(--gob-mapa-sin-dato)";
      }
      case "categorias": {
        const o = this.categorias?.[t.codigo];
        return o && this.coloresCategorias?.[o] || "var(--gob-mapa-sin-dato)";
      }
      default:
        return this._subColor(t.subregion);
    }
  }
  _valorTxt(t) {
    const e = this.datos?.[t];
    return e == null ? "" : $(e, this.formato) + (this.unidad ? " " + this.unidad : "");
  }
  _xy(t) {
    if (!this._geo || !t) return null;
    if (typeof t == "string") return this._geo.municipios.find((r) => r.codigo === t)?.centro ?? null;
    const { bbox: e, proyeccion: o } = this._geo.meta, s = Math.cos(o.lat0 * Math.PI / 180);
    return [(t[0] - e[0]) * s * o.escala, (e[3] - t[1]) * o.escala];
  }
  get _u() {
    return 1 / (Math.max(this._ppu, 0.05) * this._tf.k);
  }
  // unidades del viewBox por píxel CSS
  // ------------------------------------------------------------------ interacción
  _emitir(t, e, o) {
    this.dispatchEvent(new CustomEvent(t, { detail: { codigo: e.codigo, nombre: e.nombre, subregion: e.subregion, valor: this.datos?.[e.codigo], categoria: this.categorias?.[e.codigo], originalEvent: o }, bubbles: !0, composed: !0 }));
  }
  _click(t, e) {
    if (this._drag?.moved) return;
    this._emitir("gob-municipio-click", t, e);
    const o = this.clic;
    (o === "seleccionar" || o === "zoom-seleccionar") && this._toggleSel(t.codigo), (o === "zoom" || o === "zoom-seleccionar") && this.zoomA(t.codigo), o === "enlace" && this.enlace && (location.href = this.enlace.replace("{codigo}", t.codigo).replace("{nombre}", encodeURIComponent(t.nombre)));
  }
  _toggleSel(t) {
    const e = this._selSet(), o = e.indexOf(t);
    this.multiple ? (o >= 0 ? e.splice(o, 1) : e.push(t), this.seleccion = e.join(",")) : this.seleccion = o >= 0 ? "" : t;
  }
  _tipDe(t) {
    const e = this._geo?.subregiones.find((s) => s.id === t.subregion)?.nombre ?? "", o = this._valorTxt(t.codigo);
    return this.tooltipFormato.replace(/\{(\w+)\}/g, (s, r) => ({ nombre: f(t.nombre), codigo: f(t.codigo), subregion: f(e), valor: f(o), categoria: f(this.categorias?.[t.codigo] ?? "") })[r] ?? "");
  }
  _enter(t, e) {
    this._hover = t.codigo, this._emitir("gob-municipio-hover", t, e), this._mover(t, e);
  }
  _mover(t, e) {
    if (!this.tooltip || this._drag?.moved) return;
    const o = this.renderRoot.querySelector(".wrap").getBoundingClientRect();
    this._tip = { x: e.clientX - o.left, y: e.clientY - o.top, html: this._tipDe(t) };
  }
  _leave() {
    this._hover = null, this._tip = null;
  }
  _focus(t) {
    this._hover = t.codigo;
    const e = this.renderRoot.querySelector(`[data-c="${t.codigo}"]`), o = this.renderRoot.querySelector(".wrap").getBoundingClientRect();
    if (e && this.tooltip) {
      const s = e.getBoundingClientRect();
      this._tip = { x: s.left - o.left + s.width / 2, y: s.top - o.top, html: this._tipDe(t) };
    }
  }
  _key(t, e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._drag = null, this._click(t, e));
  }
  _vp(t) {
    const o = this.renderRoot.querySelector("svg").getBoundingClientRect();
    return { x: (t.clientX - o.left) / this._ppu, y: (t.clientY - o.top) / this._ppu };
  }
  _setTf(t, e, o) {
    if (!this._geo) return;
    const [, , s, r] = this._geo.meta.viewBox;
    t = Math.max(1, Math.min(14, t)), e = Math.min(0, Math.max(s - s * t, e)), o = Math.min(0, Math.max(r - r * t, o)), this._tf = { k: t, x: e, y: o };
  }
  _zoomEn(t, e) {
    if (!this._geo) return;
    const [, , o, s] = this._geo.meta.viewBox, r = e ?? { x: o / 2, y: s / 2 }, { k: n, x: c, y: a } = this._tf, l = Math.max(1, Math.min(14, n * t));
    this._setTf(l, r.x - (r.x - c) * l / n, r.y - (r.y - a) * l / n);
  }
  _down(t) {
    if (this.zoom) {
      if (this._pointers.set(t.pointerId, { x: t.clientX, y: t.clientY }), this._pointers.size === 2) {
        const [e, o] = [...this._pointers.values()];
        this._pinch0 = { d: Math.hypot(e.x - o.x, e.y - o.y), k: this._tf.k }, this._drag = null;
        return;
      }
      this._drag = { x: t.clientX, y: t.clientY, tx: this._tf.x, ty: this._tf.y, moved: !1 };
    }
  }
  _move(t) {
    if (!this.zoom || !this._pointers.has(t.pointerId)) return;
    if (this._pointers.set(t.pointerId, { x: t.clientX, y: t.clientY }), this._pointers.size === 2 && this._pinch0) {
      const [s, r] = [...this._pointers.values()], n = Math.hypot(s.x - r.x, s.y - r.y);
      this._zoomEn(this._pinch0.k * n / this._pinch0.d / this._tf.k, this._vp({ clientX: (s.x + r.x) / 2, clientY: (s.y + r.y) / 2 }));
      return;
    }
    if (!this._drag) return;
    const e = t.clientX - this._drag.x, o = t.clientY - this._drag.y;
    !this._drag.moved && Math.hypot(e, o) > 5 && (this._drag.moved = !0, this._tip = null, t.currentTarget.setPointerCapture?.(t.pointerId)), this._drag.moved && this._tf.k > 1 && this._setTf(this._tf.k, this._drag.tx + e / this._ppu, this._drag.ty + o / this._ppu);
  }
  _up(t) {
    this._pointers.delete(t.pointerId), this._pointers.size < 2 && (this._pinch0 = null), setTimeout(() => {
      this._pointers.size === 0 && (this._drag = null);
    }, 0);
  }
  _wheel(t) {
    !this.zoom || !(this.zoomRueda || t.ctrlKey || t.metaKey) || (t.preventDefault(), this._zoomEn(t.deltaY < 0 ? 1.25 : 0.8, this._vp(t)));
  }
  /** Acerca el mapa a un municipio (animado). */
  zoomA(t) {
    const e = this.renderRoot.querySelector(`[data-c="${t}"]`);
    if (!e || !this._geo) return;
    const o = e.getBBox(), [, , s, r] = this._geo.meta.viewBox, n = Math.min(8, Math.max(1.5, Math.min(s / (o.width * 2.2), r / (o.height * 2.2))));
    this._animar(n, s / 2 - n * (o.x + o.width / 2), r / 2 - n * (o.y + o.height / 2));
  }
  reiniciar() {
    this._animar(1, 0, 0);
  }
  _animar(t, e, o) {
    if (cancelAnimationFrame(this._anim), matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this._setTf(t, e, o);
      return;
    }
    const s = { ...this._tf }, r = performance.now(), n = 700, c = (a) => {
      const l = Math.min(1, (a - r) / n), i = l < 0.5 ? 4 * l ** 3 : 1 - (-2 * l + 2) ** 3 / 2;
      this._setTf(s.k + (t - s.k) * i, s.x + (e - s.x) * i, s.y + (o - s.y) * i), l < 1 && (this._anim = requestAnimationFrame(c));
    };
    this._anim = requestAnimationFrame(c);
  }
  // ------------------------------------------------------------------ exportación
  /** SVG estático (sin animaciones) para descargar o imprimir. */
  exportarSVG() {
    const t = this._geo;
    if (!t) return "";
    const [, , e, o] = t.meta.viewBox, s = this._clases(), r = 1 / Math.max(this._ppu, 0.05), n = this.tema === "oscuro", c = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${o}" width="${e}" height="${o}" font-family="Montserrat, Arial, sans-serif"><title>${f(this.titulo)}</title>`];
    n && c.push(`<rect width="${e}" height="${o}" fill="#081A2C"/>`);
    for (const a of t.municipios) c.push(`<path d="${a.d}" fill="${this._fillDe(a, s).startsWith("var") ? "#DCE6EE" : this._fillDe(a, s)}" stroke="${n ? "#081A2C" : "#fff"}" stroke-width="${1.2 * r}" stroke-linejoin="round"/>`);
    for (const a of this.lineas ?? []) {
      const l = this._xy(a.desde), i = this._xy(a.hasta);
      l && i && c.push(`<path d="${this._curva(l, i, a.curva ?? 0.18)}" fill="none" stroke="${a.color ?? "#0071BB"}" stroke-width="${(a.ancho ?? 2) * r}" ${a.estilo === "guion" || a.estilo === "flujo" ? `stroke-dasharray="${6 * r} ${6 * r}"` : ""}/>`);
    }
    for (const a of this.marcadores ?? []) {
      const l = this._xy(a.codigo ?? a.lonlat);
      if (!l) continue;
      const i = (a.tamano ?? 26) / 2 * r;
      c.push(`<circle cx="${l[0]}" cy="${l[1]}" r="${i}" fill="${a.color ?? "#0071BB"}" stroke="#fff" stroke-width="${1.5 * r}"/>`);
      const h = k[a.icono ?? "punto"];
      h && c.push(`<path d="${h.d}" fill="#fff" transform="translate(${l[0] - i * 0.6} ${l[1] - i * 0.6}) scale(${i * 1.2 / 24})"/>`);
    }
    if (this.etiquetas !== "ninguna") for (const a of t.municipios) c.push(`<text x="${a.centro[0]}" y="${a.centro[1]}" font-size="${10 * r}" text-anchor="middle" fill="${n ? "#fff" : "#161A22"}">${f(this._etiqueta(a))}</text>`);
    return c.push("</svg>"), c.join("");
  }
  descargarSVG(t = "mapa-magdalena") {
    this._bajar(new Blob([this.exportarSVG()], { type: "image/svg+xml" }), t + ".svg");
  }
  async descargarPNG(t = "mapa-magdalena", e = 2) {
    const o = this._geo;
    if (!o) return;
    const [, , s, r] = o.meta.viewBox, n = new Image(), c = URL.createObjectURL(new Blob([this.exportarSVG()], { type: "image/svg+xml" }));
    await new Promise((i, h) => {
      n.onload = i, n.onerror = h, n.src = c;
    });
    const a = document.createElement("canvas");
    a.width = s * e, a.height = r * e;
    const l = a.getContext("2d");
    l.fillStyle = this.tema === "oscuro" ? "#081A2C" : "#ffffff", l.fillRect(0, 0, a.width, a.height), l.drawImage(n, 0, 0, a.width, a.height), URL.revokeObjectURL(c), a.toBlob((i) => i && this._bajar(i, t + ".png"));
  }
  imprimir() {
    window.print();
  }
  _bajar(t, e) {
    const o = document.createElement("a");
    o.href = URL.createObjectURL(t), o.download = e, o.click(), setTimeout(() => URL.revokeObjectURL(o.href), 1e3);
  }
  // ------------------------------------------------------------------ render
  _curva(t, e, o) {
    const s = (t[0] + e[0]) / 2, r = (t[1] + e[1]) / 2, n = e[0] - t[0], c = e[1] - t[1], a = Math.hypot(n, c) || 1;
    return `M${t[0].toFixed(1)} ${t[1].toFixed(1)}Q${(s - c / a * o * a).toFixed(1)} ${(r + n / a * o * a).toFixed(1)} ${e[0].toFixed(1)} ${e[1].toFixed(1)}`;
  }
  _etiqueta(t) {
    const e = this._valorTxt(t.codigo);
    switch (this.etiquetas) {
      case "codigos":
        return t.codigo;
      case "valores":
        return e;
      case "nombres-valores":
        return e ? `${t.nombre} · ${e}` : t.nombre;
      default:
        return t.nombre;
    }
  }
  _marcador(t, e) {
    const o = this._xy(t.codigo ?? t.lonlat);
    if (!o) return p;
    const s = this._u, r = t.tamano ?? 26, n = r / 2 * s, c = t.color ?? "var(--gob-color-primario, #0071BB)", a = k[t.icono ?? "punto"], l = t.efecto ?? "ninguno", i = n * 2.6;
    return u`<g class="mk" part="marcador" transform="translate(${o[0]} ${o[1]})" style="--c:${c}" tabindex="0" role="button" aria-label=${t.nombre ?? "Marcador"}
        @click=${(h) => {
      h.stopPropagation(), this.dispatchEvent(new CustomEvent("gob-marcador-click", { detail: { ...t, indice: e }, bubbles: !0, composed: !0 })), t.url && (location.href = t.url);
    }}
        @pointerenter=${(h) => {
      if (this.tooltip && t.nombre) {
        const m = this.renderRoot.querySelector(".wrap").getBoundingClientRect();
        this._tip = { x: h.clientX - m.left, y: h.clientY - m.top, html: `<strong>${f(t.nombre)}</strong>${t.categoria ? `<br><span>${f(t.categoria)}</span>` : ""}${t.valor != null ? `<br>${f($(t.valor, this.formato))}` : ""}` };
      }
    }}
        @pointerleave=${() => this._leave()}>
      ${l === "ping" || l === "radar" ? u`<circle class="ring r1" r=${i} /><circle class="ring r2" r=${i} />` : p}
      ${l === "pulso" ? u`<circle class="glow" r=${n * 1.9} />` : p}
      ${l === "radar" ? u`<path class="sweep" d="M0 0 L${i} 0 A${i} ${i} 0 0 0 ${i * Math.cos(-0.9)} ${i * Math.sin(-0.9)} Z" />` : p}
      <circle class="dot" r=${n} stroke-width=${1.5 * s} />
      ${a ? u`<path class="ico" d=${a.d} transform="translate(${-n * 0.62} ${-n * 0.62}) scale(${n * 1.24 / 24})" />` : p}
      ${t.etiqueta && t.nombre ? u`<text class="mk-t" y=${n + 12 * s} font-size=${11 * s} stroke-width=${3 * s}>${t.nombre}</text>` : p}
    </g>`;
  }
  _linea(t, e) {
    const o = this._xy(t.desde), s = this._xy(t.hasta);
    if (!o || !s) return p;
    const r = this._curva(o, s, t.curva ?? 0.18), n = t.estilo ?? "flujo", c = t.color ?? "var(--gob-color-primario, #0071BB)";
    return u`<g part="linea" style="--c:${c};--w:${t.ancho ?? 2}px;--i:${e}">
      <path class="ln base" d=${r} />
      <path class="ln ${n}" d=${r} pathLength="1" />
      ${t.particulas ? u`<circle class="pk" r=${3.2 * this._u} fill=${c}><animateMotion dur=${3 + e % 4 * 0.6}s repeatCount="indefinite" path=${r} /></circle>` : p}
    </g>`;
  }
  _leyenda(t) {
    if (!this.leyenda || !this._geo) return p;
    let e = p, o = this.leyendaTitulo;
    this.modo === "subregiones" ? (o ||= "Subregiones", e = this._geo.subregiones.map((r) => g`<li class=${this.filtroSubregion === r.id ? "on" : ""}><button type="button" @click=${() => this.filtroSubregion = this.filtroSubregion === r.id ? "" : r.id}><i style="background:${this._subColor(r.id)}"></i>${r.nombre}</button></li>`)) : this.modo === "coropleta" ? (o ||= "Valores", e = t.map((r) => g`<li><span><i style="background:${r.color}"></i>${$(r.desde, this.formato)} – ${$(r.hasta, this.formato)}${this.unidad ? " " + this.unidad : ""}</span></li>`)) : this.modo === "categorias" && this.coloresCategorias && (o ||= "Categorías", e = Object.entries(this.coloresCategorias).map(([r, n]) => g`<li><span><i style="background:${n}"></i>${r}</span></li>`));
    const s = /* @__PURE__ */ new Map();
    for (const r of this.marcadores ?? []) r.categoria && s.set(r.categoria, { color: r.color ?? "#0071BB", icono: r.icono });
    return g`<aside class="leyenda" part="leyenda" aria-label="Leyenda">
      ${o ? g`<h4>${o}</h4>` : p}<ul>${e}</ul>
      ${s.size ? g`<h4>Puntos</h4><ul>${[...s].map(([r, n]) => g`<li><span><i class="c" style="background:${n.color}"></i>${r}</span></li>`)}</ul>` : p}
    </aside>`;
  }
  render() {
    if (this._error) return g`<div class="estado err" role="alert">⚠ ${this._error}</div>`;
    const t = this._geo;
    if (!t) return g`<div class="estado" role="status">Cargando mapa…</div>`;
    const [, , e, o] = t.meta.viewBox, s = this._clases(), r = this._selSet(), n = this._u, c = new Set(this.efectos), a = c.has("foco") && r.length > 0, l = this._tf;
    return g`
      <div class="wrap ${[...c].map((i) => "ef-" + i).join(" ")}" part="mapa">
        <svg viewBox="0 0 ${e} ${o}" role="group" aria-label=${this.titulo} style="--k:${l.k}"
          @pointerdown=${this._down} @pointermove=${this._move} @pointerup=${this._up} @pointercancel=${this._up} @wheel=${this._wheel} @pointerleave=${() => {
      this._pointers.clear();
    }}>
          <title>${this.titulo}</title>${this.descripcion ? u`<desc>${this.descripcion}</desc>` : p}
          <g class="vista" transform="translate(${l.x} ${l.y}) scale(${l.k})">
            ${this.mostrarContorno ? u`<path class="contorno" part="contorno" d=${t.contorno} pathLength="1" />` : p}
            <g class="munis">
              ${t.municipios.map((i, h) => {
      const v = !!this.filtroSubregion && i.subregion !== this.filtroSubregion || a && !r.includes(i.codigo);
      return u`<path class="m ${r.includes(i.codigo) ? "sel" : ""} ${this._hover === i.codigo ? "hov" : ""} ${v ? "dim" : ""}" part="municipio" data-c=${i.codigo} d=${i.d}
                  style="--f:${this._fillDe(i, s)};--i:${h}" tabindex="0" role="button" aria-pressed=${r.includes(i.codigo)}
                  aria-label=${`${i.nombre}${this._valorTxt(i.codigo) ? ", " + this._valorTxt(i.codigo) : ""}`}
                  @click=${(b) => this._click(i, b)} @pointerenter=${(b) => this._enter(i, b)} @pointermove=${(b) => this._mover(i, b)}
                  @pointerleave=${() => this._leave()} @focus=${() => this._focus(i)} @blur=${() => this._leave()} @keydown=${(b) => this._key(i, b)} />`;
    })}
            </g>
            ${t.municipios.filter((i) => r.includes(i.codigo)).map((i) => u`<path class="halo ${c.has("hormigas") ? "ants" : ""}" d=${i.d} />`)}
            ${(this.lineas ?? []).map((i, h) => this._linea(i, h))}
            ${c.has("ping-seleccion") ? t.municipios.filter((i) => r.includes(i.codigo)).map((i) => u`<g transform="translate(${i.centro[0]} ${i.centro[1]})" pointer-events="none"><circle class="ring r1 sel-ring" r=${34 * n} /><circle class="ring r2 sel-ring" r=${34 * n} /></g>`) : p}
            ${this.etiquetas !== "ninguna" ? u`<g class="etiquetas" part="etiqueta" pointer-events="none">${t.municipios.map((i) => {
      const h = this._fillDe(i, s), m = this._etiqueta(i), v = !this.etiquetasAuto || (i.bbox[2] - i.bbox[0]) * this._ppu * this._tf.k >= m.length * 5.6 * 0.82;
      return m && v ? u`<text transform="translate(${i.centro[0]} ${i.centro[1]})" font-size=${10.5 * n} stroke-width=${3 * n} class=${h.startsWith("var") ? "" : "on"} style="--t:${h.startsWith("var") ? "var(--gob-mapa-texto)" : z(h)}">${m}</text>` : p;
    })}</g>` : p}
            ${(this.marcadores ?? []).map((i, h) => this._marcador(i, h))}
          </g>
        </svg>
        ${this.controles && this.zoom ? g`<div class="ctl" part="controles">
          <button type="button" aria-label="Acercar" @click=${() => this._zoomEn(1.5)}>+</button>
          <button type="button" aria-label="Alejar" @click=${() => this._zoomEn(1 / 1.5)}>−</button>
          <button type="button" aria-label="Vista completa" @click=${() => this.reiniciar()}>⌂</button></div>` : p}
        ${this._tip ? g`<div class="tip" part="tooltip" role="tooltip" style="left:${this._tip.x}px;top:${this._tip.y}px">${q(this._tip.html)}</div>` : p}
        ${this._leyenda(s)}
        <table class="sr"><caption>${this.titulo}</caption><thead><tr><th>Código</th><th>Municipio</th><th>Subregión</th><th>Valor</th></tr></thead>
          <tbody>${t.municipios.map((i) => g`<tr><td>${i.codigo}</td><td>${i.nombre}</td><td>${t.subregiones.find((h) => h.id === i.subregion)?.nombre}</td><td>${this._valorTxt(i.codigo)}</td></tr>`)}</tbody></table>
      </div>`;
  }
  static {
    this.styles = A`
    :host { --gob-mapa-relleno: #DCE6EE; --gob-mapa-sin-dato: #E3E8EF; --gob-mapa-borde: #fff; --gob-mapa-contorno: #0B2239; --gob-mapa-sel: #0B2239; --gob-mapa-texto: #161A22; --gob-mapa-fondo: transparent;
      --gob-mapa-tip-bg: #081A2C; --gob-mapa-tip-fg: #fff; --gob-mapa-panel: rgba(255,255,255,.86); --gob-mapa-panel-fg: #252B36; --gob-mapa-panel-borde: #E3E8EF;
      display: block; position: relative; font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); container-type: inline-size; }
    :host([tema='oscuro']) { --gob-mapa-relleno: #12395C; --gob-mapa-sin-dato: #12395C; --gob-mapa-borde: #081A2C; --gob-mapa-contorno: #9FD7E5; --gob-mapa-sel: #fff; --gob-mapa-texto: #fff; --gob-mapa-fondo: #081A2C;
      --gob-mapa-tip-bg: #fff; --gob-mapa-tip-fg: #081A2C; --gob-mapa-panel: rgba(8,26,44,.78); --gob-mapa-panel-fg: #E3E8EF; --gob-mapa-panel-borde: #12395C; }
    .wrap { position: relative; background: var(--gob-mapa-fondo); border-radius: inherit; }
    svg { display: block; width: 100%; height: auto; touch-action: pan-y; user-select: none; -webkit-user-select: none; overflow: hidden; }
    .m, .contorno, .halo, .ln { vector-effect: non-scaling-stroke; }
    .contorno { fill: none; stroke: var(--gob-mapa-contorno); stroke-width: 1.4px; stroke-linejoin: round; opacity: .55; pointer-events: none; }
    .m { fill: var(--f); stroke: var(--gob-mapa-borde); stroke-width: 1.1px; stroke-linejoin: round; cursor: pointer; outline: none; transition: fill .35s ease, opacity .3s ease, filter .2s; transform-box: fill-box; transform-origin: center; }
    .m:hover, .m.hov { filter: brightness(1.08) saturate(1.1); stroke: var(--gob-mapa-sel); stroke-width: 2px; }
    .m:focus-visible { stroke: #00B7D9; stroke-width: 3px; }
    .m.sel { stroke: var(--gob-mapa-sel); stroke-width: 2.4px; }
    .m.dim { opacity: .28; }
    .halo { fill: none; stroke: var(--gob-mapa-sel); stroke-width: 3px; stroke-linejoin: round; pointer-events: none; }
    .halo.ants { stroke-dasharray: 9 7; animation: gob-marcha 1.1s linear infinite; }
    .etiquetas text { text-anchor: middle; dominant-baseline: central; font-weight: 600; fill: var(--t); paint-order: stroke; stroke: transparent; }
    .etiquetas text:not(.on) { stroke: color-mix(in srgb, var(--gob-mapa-fondo, #fff) 80%, #fff); }
    /* Líneas / rutas */
    .ln { fill: none; stroke: var(--c); stroke-width: var(--w); stroke-linecap: round; pointer-events: none; }
    .ln.base { opacity: .16; }
    .ln.solido { opacity: 1; } .ln.guion { stroke-dasharray: 5 6; }
    .ln.flujo { stroke-dasharray: .018 .03; animation: gob-flujo 1.4s linear infinite; }
    .ln.dibujar { stroke-dasharray: 1; stroke-dashoffset: 1; animation: gob-dibujar 2.2s ease forwards; animation-delay: calc(var(--i) * 250ms); }
    .pk { filter: drop-shadow(0 0 3px var(--c)); pointer-events: none; }
    /* Marcadores */
    .mk { cursor: pointer; outline: none; }
    .mk .dot { fill: var(--c); stroke: #fff; }
    .mk .ico { fill: #fff; pointer-events: none; }
    .mk:focus-visible .dot { stroke: #00B7D9; }
    .mk .ring { fill: none; stroke: var(--c); stroke-width: 2px; vector-effect: non-scaling-stroke; transform-box: fill-box; transform-origin: center; opacity: 0; pointer-events: none; animation: gob-ping 2.6s ease-out infinite; }
    .mk .ring.r2 { animation-delay: 1.3s; }
    .sel-ring { stroke: var(--gob-mapa-sel); transform-box: fill-box; transform-origin: center; animation: gob-ping 2.4s ease-out infinite; fill: none; stroke-width: 2px; vector-effect: non-scaling-stroke; opacity: 0; }
    .sel-ring.r2 { animation-delay: 1.2s; }
    .mk .glow { fill: var(--c); opacity: .25; transform-box: fill-box; transform-origin: center; animation: gob-pulso 2s ease-in-out infinite; pointer-events: none; }
    .mk .sweep { fill: color-mix(in srgb, var(--c) 38%, transparent); transform-box: view-box; animation: gob-gira 4.5s linear infinite; pointer-events: none; }
    .mk-t { text-anchor: middle; font-weight: 700; fill: var(--gob-mapa-texto); paint-order: stroke; stroke: var(--gob-mapa-fondo, #fff); stroke-linejoin: round; }
    @keyframes gob-ping { 0% { transform: scale(.15); opacity: .95; } 75% { opacity: .15; } 100% { transform: scale(1); opacity: 0; } }
    @keyframes gob-pulso { 0%, 100% { transform: scale(.7); opacity: .35; } 50% { transform: scale(1.15); opacity: .08; } }
    @keyframes gob-gira { to { transform: rotate(360deg); } }
    @keyframes gob-flujo { to { stroke-dashoffset: -.096; } }
    @keyframes gob-dibujar { to { stroke-dashoffset: 0; } }
    @keyframes gob-marcha { to { stroke-dashoffset: -32; } }
    @keyframes gob-entra { from { opacity: 0; transform: scale(.94); } to { opacity: 1; transform: scale(1); } }
    @keyframes gob-trazo { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    .ef-entrada .m { animation: gob-entra .55s cubic-bezier(.2,.8,.2,1) both; animation-delay: calc(var(--i) * 28ms); }
    .ef-entrada .contorno { stroke-dasharray: 1; animation: gob-trazo 1.8s ease both; }
    /* Controles, tooltip, leyenda */
    .ctl { position: absolute; top: .5rem; right: .5rem; display: grid; gap: 2px; }
    .ctl button { width: 2rem; height: 2rem; border: 1px solid var(--gob-mapa-panel-borde); background: var(--gob-mapa-panel); color: var(--gob-mapa-panel-fg); font: 700 1rem/1 inherit; cursor: pointer; -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }
    .ctl button:first-child { border-radius: 8px 8px 0 0; } .ctl button:last-child { border-radius: 0 0 8px 8px; }
    .ctl button:hover { background: #0071BB; color: #fff; } .ctl button:focus-visible { outline: 2px solid #00B7D9; outline-offset: 1px; }
    .tip { position: absolute; z-index: 5; transform: translate(-50%, calc(-100% - 12px)); pointer-events: none; background: var(--gob-mapa-tip-bg); color: var(--gob-mapa-tip-fg); padding: .5rem .7rem; border-radius: 8px; font-size: .78rem; line-height: 1.4; white-space: nowrap; box-shadow: 0 8px 24px rgba(8,26,44,.28); }
    .tip span { opacity: .72; } .tip strong { font-weight: 700; }
    .leyenda { position: absolute; left: .6rem; bottom: .6rem; max-width: 46%; padding: .55rem .7rem; border: 1px solid var(--gob-mapa-panel-borde); border-radius: 10px; background: var(--gob-mapa-panel); color: var(--gob-mapa-panel-fg); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); font-size: .72rem; }
    .leyenda h4 { margin: 0 0 .3rem; font-size: .66rem; letter-spacing: .08em; text-transform: uppercase; opacity: .7; }
    .leyenda h4:not(:first-child) { margin-top: .5rem; }
    .leyenda ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
    .leyenda button, .leyenda span { display: flex; align-items: center; gap: .45rem; font: inherit; color: inherit; background: none; border: 0; padding: 1px 0; cursor: default; text-align: left; }
    .leyenda button { cursor: pointer; } .leyenda li.on button { font-weight: 700; text-decoration: underline; }
    .leyenda i { width: .8rem; height: .8rem; border-radius: 3px; flex: none; } .leyenda i.c { border-radius: 50%; }
    @container (max-width: 460px) { .leyenda { position: static; max-width: none; margin-top: .5rem; } }
    .estado { padding: 2rem; text-align: center; font-size: .9rem; color: #6B7482; } .estado.err { color: #B20028; }
    .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } .mk .ring, .sel-ring { opacity: 0 !important; } }
    @media print { .ctl { display: none; } * { animation: none !important; } .wrap, svg { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .leyenda { backdrop-filter: none; background: #fff; } .tip { display: none; } }
  `;
  }
}
customElements.get("gob-mapa-magdalena") || customElements.define("gob-mapa-magdalena", F);
export {
  F as GobMapaMagdalena
};
