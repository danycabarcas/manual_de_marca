import { j as q, E as N, i as z, b as n, A as p, a as D } from "../chunks/lit-element-B3qO7mJS.js";
import { e as M, i as P, t as T, o as I } from "../chunks/unsafe-html-BA-v3Y9E.js";
import { i as u } from "../chunks/icono-CX7ui34k.js";
import { f as C } from "../chunks/mapa-recursos-DvOcbc8o.js";
const { I: O } = q, E = (l) => l, j = () => document.createComment(""), y = (l, t, i) => {
  const e = l._$AA.parentNode, s = t === void 0 ? l._$AB : t._$AA;
  if (i === void 0) {
    const r = e.insertBefore(j(), s), o = e.insertBefore(j(), s);
    i = new O(r, o, l, l.options);
  } else {
    const r = i._$AB.nextSibling, o = i._$AM, a = o !== l;
    if (a) {
      let c;
      i._$AQ?.(l), i._$AM = l, i._$AP !== void 0 && (c = l._$AU) !== o._$AU && i._$AP(c);
    }
    if (r !== s || a) {
      let c = i._$AA;
      for (; c !== r; ) {
        const m = E(c).nextSibling;
        E(e).insertBefore(c, s), c = m;
      }
    }
  }
  return i;
}, v = (l, t, i = l) => (l._$AI(t, i), l), L = {}, U = (l, t = L) => l._$AH = t, R = (l) => l._$AH, w = (l) => {
  l._$AR(), l._$AA.remove();
};
const A = (l, t, i) => {
  const e = /* @__PURE__ */ new Map();
  for (let s = t; s <= i; s++) e.set(l[s], s);
  return e;
}, Q = M(class extends P {
  constructor(l) {
    if (super(l), l.type !== T.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(l, t, i) {
    let e;
    i === void 0 ? i = t : t !== void 0 && (e = t);
    const s = [], r = [];
    let o = 0;
    for (const a of l) s[o] = e ? e(a, o) : o, r[o] = i(a, o), o++;
    return { values: r, keys: s };
  }
  render(l, t, i) {
    return this.dt(l, t, i).values;
  }
  update(l, [t, i, e]) {
    const s = R(l), { values: r, keys: o } = this.dt(t, i, e);
    if (!Array.isArray(s)) return this.ut = o, r;
    const a = this.ut ??= [], c = [];
    let m, F, h = 0, b = s.length - 1, d = 0, g = r.length - 1;
    for (; h <= b && d <= g; ) if (s[h] === null) h++;
    else if (s[b] === null) b--;
    else if (a[h] === o[d]) c[d] = v(s[h], r[d]), h++, d++;
    else if (a[b] === o[g]) c[g] = v(s[b], r[g]), b--, g--;
    else if (a[h] === o[g]) c[g] = v(s[h], r[g]), y(l, c[g + 1], s[h]), h++, g--;
    else if (a[b] === o[d]) c[d] = v(s[b], r[d]), y(l, s[h], s[b]), b--, d++;
    else if (m === void 0 && (m = A(o, d, g), F = A(a, h, b)), m.has(a[h])) if (m.has(a[b])) {
      const f = F.get(o[d]), k = f !== void 0 ? s[f] : null;
      if (k === null) {
        const S = y(l, s[h]);
        v(S, r[d]), c[d] = S;
      } else c[d] = v(k, r[d]), y(l, s[h], k), s[f] = null;
      d++;
    } else w(s[b]), b--;
    else w(s[h]), h++;
    for (; d <= g; ) {
      const f = y(l, c[g + 1]);
      v(f, r[d]), c[d++] = f;
    }
    for (; h <= b; ) {
      const f = s[h++];
      f !== null && w(f);
    }
    return this.ut = o, U(l, c), N;
  }
}), x = { fromAttribute: (l) => {
  try {
    return l ? JSON.parse(l) : void 0;
  } catch {
    return;
  }
}, toAttribute: (l) => JSON.stringify(l) }, $ = (l) => String(l ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(), _ = (l, t) => t.split(".").reduce((i, e) => i == null ? i : i[e], l), B = { exito: ["#E1F1DF", "#2C5A26"], aviso: ["#FFF3C2", "#6D5600"], peligro: ["#FFE0E7", "#8A0022"], info: ["#CCF1F8", "#00566A"], neutro: ["#ECEFF4", "#3A424F"], primario: ["#D6E8F4", "#004F82"], violeta: ["#EDE5FA", "#3F1288"] }, V = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" });
class H extends z {
  constructor() {
    if (super(), this._proc = [], this._tq = 0, this._vistos = !1, this.columnas = [], this.datos = [], this.llave = "id", this.titulo = "", this.descripcion = "", this.busqueda = !0, this.filtrosColumna = !1, this.paginacion = !0, this.tamanoPagina = 10, this.opcionesTamano = [5, 10, 25, 50, 100], this.seleccion = "ninguna", this.exportar = !0, this.selectorColumnas = !0, this.densidad = "normal", this.zebra = !1, this.cargando = !1, this.vacio = "No hay datos para mostrar.", this.modoServidor = !1, this.totalFilas = 0, this.totales = !1, this.alturaMax = 0, this.filaClicable = !1, this.tema = "claro", this.tarjetas = "auto", this._q = "", this._filtros = {}, this._orden = null, this._pag = 0, this._tam = 10, this._sel = /* @__PURE__ */ new Set(), this._verFiltros = !1, this._ocultas = /* @__PURE__ */ new Set(), this._menu = "", this._aviso = "", this._imp = !1, Object.prototype.hasOwnProperty.call(this, "config")) {
      const t = this.config;
      delete this.config, this.config = t;
    }
  }
  static {
    this.properties = {
      columnas: { converter: x },
      datos: { converter: x },
      llave: { type: String },
      titulo: { type: String },
      descripcion: { type: String },
      busqueda: { type: Boolean },
      filtrosColumna: { attribute: "filtros-columna", type: Boolean },
      ordenInicial: { attribute: "orden-inicial", converter: x },
      paginacion: { type: Boolean },
      tamanoPagina: { attribute: "tamano-pagina", type: Number },
      opcionesTamano: { attribute: "opciones-tamano", converter: x },
      seleccion: { type: String },
      acciones: { converter: x },
      accionesMasivas: { attribute: "acciones-masivas", converter: x },
      exportar: { type: Boolean },
      selectorColumnas: { attribute: "selector-columnas", type: Boolean },
      densidad: { type: String, reflect: !0 },
      zebra: { type: Boolean, reflect: !0 },
      cargando: { type: Boolean },
      vacio: { type: String },
      modoServidor: { attribute: "modo-servidor", type: Boolean },
      totalFilas: { attribute: "total-filas", type: Number },
      totales: { type: Boolean },
      alturaMax: { attribute: "altura-max", type: Number },
      filaClicable: { attribute: "fila-clicable", type: Boolean },
      tema: { type: String, reflect: !0 },
      tarjetas: { type: String, reflect: !0 },
      _q: { state: !0 },
      _filtros: { state: !0 },
      _orden: { state: !0 },
      _pag: { state: !0 },
      _tam: { state: !0 },
      _sel: { state: !0 },
      _verFiltros: { state: !0 },
      _ocultas: { state: !0 },
      _menu: { state: !0 },
      _aviso: { state: !0 },
      _imp: { state: !0 }
    };
  }
  set config(t) {
    Object.assign(this, t);
  }
  get config() {
    return {};
  }
  // ------------------------------------------------------------------ columnas y valores
  get _cols() {
    return (this.columnas ?? []).filter((t) => !t.oculta && !this._ocultas.has(t.campo));
  }
  _t(t) {
    return t.titulo ?? t.campo.charAt(0).toUpperCase() + t.campo.slice(1).replace(/_/g, " ");
  }
  _num(t, i) {
    const e = Number(i);
    return Number.isFinite(e) ? t.tipo === "cop" ? C(e, "cop") : t.tipo === "porcentaje" ? C(e, "porcentaje") : new Intl.NumberFormat("es-CO", { maximumFractionDigits: t.decimales ?? 2 }).format(e) : String(i ?? "");
  }
  /** Texto legible de una celda (búsqueda, filtros, exportación). */
  _txt(t, i) {
    const e = _(i, t.campo);
    if (e == null) return "";
    switch (t.tipo) {
      case "numero":
      case "cop":
      case "porcentaje":
      case "barra":
        return this._num(t, e);
      case "fecha": {
        const s = new Date(e);
        return isNaN(+s) ? String(e) : V.format(s);
      }
      case "booleano":
        return e ? "Sí" : "No";
      default:
        return String(e);
    }
  }
  _esNum(t) {
    return ["numero", "cop", "porcentaje", "barra"].includes(t.tipo ?? "");
  }
  _opcionesFiltro(t) {
    if (t.tipo === "estado" || t.tipo === "booleano")
      return [...new Set((this.datos ?? []).map((e) => String(_(e, t.campo) ?? "")))].filter(Boolean).sort((e, s) => e.localeCompare(s, "es"));
    if (!t.tipo || t.tipo === "texto") {
      const i = [...new Set((this.datos ?? []).map((e) => String(_(e, t.campo) ?? "")))];
      return i.length <= 12 && i.length > 1 ? i.filter(Boolean).sort((e, s) => e.localeCompare(s, "es")) : null;
    }
    return null;
  }
  _coincide(t, i, e) {
    const s = _(i, t.campo);
    if (this._opcionesFiltro(t)) return String(s ?? "") === e;
    if (this._esNum(t)) {
      const r = Number(s), o = e.trim().replace(",", ".");
      let a;
      if (a = o.match(/^(>=|<=|>|<|=)\s*(-?[\d.]+)$/)) {
        const c = +a[2];
        return a[1] === ">" ? r > c : a[1] === "<" ? r < c : a[1] === ">=" ? r >= c : a[1] === "<=" ? r <= c : r === c;
      }
      return (a = o.match(/^(-?[\d.]+)\s*(?:-|\.\.)\s*(-?[\d.]+)$/)) ? r >= +a[1] && r <= +a[2] : /^-?[\d.]+$/.test(o) ? r === +o : $(this._txt(t, i)).includes($(o));
    }
    return $(this._txt(t, i) + " " + (t.tipo === "fecha" ? String(s) : "")).includes($(e));
  }
  _cmp(t, i, e) {
    const s = _(i, t.campo), r = _(e, t.campo);
    return s == null && r == null ? 0 : s == null ? 1 : r == null ? -1 : this._esNum(t) ? Number(s) - Number(r) : t.tipo === "fecha" ? +new Date(s) - +new Date(r) : t.tipo === "booleano" ? +!!s - +!!r : String(s).localeCompare(String(r), "es", { numeric: !0, sensitivity: "base" });
  }
  // ------------------------------------------------------------------ ciclo de vida
  connectedCallback() {
    super.connectedCallback(), this._tam = this.tamanoPagina || 10, this.ordenInicial && !this._orden && (this._orden = this.ordenInicial);
  }
  willUpdate(t) {
    if (t.has("tamanoPagina") && this.tamanoPagina && (this._tam = this.tamanoPagina), t.has("ordenInicial") && this.ordenInicial && (this._orden = this.ordenInicial), t.has("datos") || t.has("columnas") || t.has("_q") || t.has("_filtros") || t.has("_orden") || t.has("modoServidor") || t.has("totalFilas")) {
      if (this.modoServidor) this._proc = this.datos ?? [];
      else {
        let i = [...this.datos ?? []];
        const e = this.columnas ?? [];
        if (this._q.trim()) {
          const r = $(this._q);
          i = i.filter((o) => this._cols.some((a) => $(this._txt(a, o)).includes(r)));
        }
        for (const [r, o] of Object.entries(this._filtros)) {
          if (!o) continue;
          const a = e.find((c) => c.campo === r);
          a && (i = i.filter((c) => this._coincide(a, c, o)));
        }
        const s = this._orden;
        if (s) {
          const r = e.find((o) => o.campo === s.campo);
          r && i.sort((o, a) => this._cmp(r, o, a) * (s.dir === "asc" ? 1 : -1));
        }
        this._proc = i;
      }
      (t.has("_q") || t.has("_filtros")) && (this._pag = 0, this._anunciar());
    }
  }
  updated(t) {
    if (!this._vistos && this.modoServidor && (this._vistos = !0, this._consultar()), t.has("datos") && this.seleccion !== "ninguna" && this._sel.size && !this.modoServidor) {
      const i = new Set((this.datos ?? []).map((e) => _(e, this.llave)));
      this._sel = new Set([...this._sel].filter((e) => i.has(e)));
    }
  }
  _anunciar() {
    clearTimeout(this._tq), this._tq = window.setTimeout(() => {
      this._aviso = `${this._total} resultado${this._total === 1 ? "" : "s"}`;
    }, 400);
  }
  get _total() {
    return this.modoServidor ? this.totalFilas || (this.datos?.length ?? 0) : this._proc.length;
  }
  get _paginas() {
    return this.paginacion ? Math.max(1, Math.ceil(this._total / this._tam)) : 1;
  }
  get _visibles() {
    if (this.modoServidor || !this.paginacion || this._imp) return this._proc;
    const t = this._pag * this._tam;
    return this._proc.slice(t, t + this._tam);
  }
  // ------------------------------------------------------------------ eventos / acciones
  _emitir(t, i) {
    this.dispatchEvent(new CustomEvent(t, { detail: i, bubbles: !0, composed: !0 }));
  }
  _consultar() {
    this.modoServidor && (clearTimeout(this._tq), this._tq = window.setTimeout(() => this._emitir("gob-tabla-consulta", { pagina: this._pag + 1, tamano: this._tam, orden: this._orden, busqueda: this._q, filtros: { ...this._filtros } }), 250));
  }
  _ordenar(t) {
    const i = this._orden;
    this._orden = !i || i.campo !== t.campo ? { campo: t.campo, dir: "asc" } : i.dir === "asc" ? { campo: t.campo, dir: "desc" } : null, this._emitir("gob-tabla-orden", this._orden), this.modoServidor && this._consultar();
  }
  _setQ(t) {
    this._q = t, this._emitir("gob-tabla-filtro", { busqueda: t, filtros: this._filtros }), this.modoServidor && (this._pag = 0, this._consultar());
  }
  _setF(t, i) {
    this._filtros = { ...this._filtros, [t]: i }, this._emitir("gob-tabla-filtro", { busqueda: this._q, filtros: this._filtros }), this.modoServidor && (this._pag = 0, this._consultar());
  }
  limpiarFiltros() {
    this._q = "", this._filtros = {}, this.modoServidor && this._consultar();
  }
  _ir(t) {
    this._pag = Math.max(0, Math.min(this._paginas - 1, t)), this._emitir("gob-tabla-pagina", { pagina: this._pag + 1, tamano: this._tam }), this.modoServidor && this._consultar();
  }
  _llave(t) {
    return _(t, this.llave);
  }
  _selEmit() {
    const t = [...this._sel];
    this._emitir("gob-tabla-seleccion", { llaves: t, filas: (this.datos ?? []).filter((i) => this._sel.has(this._llave(i))) });
  }
  _selFila(t, i) {
    const e = this._llave(t);
    if (this.seleccion === "una") this._sel = new Set(i ? [e] : []);
    else {
      const s = new Set(this._sel);
      i ? s.add(e) : s.delete(e), this._sel = s;
    }
    this._selEmit();
  }
  _selPagina(t) {
    const i = new Set(this._sel);
    for (const e of this._visibles) t ? i.add(this._llave(e)) : i.delete(this._llave(e));
    this._sel = i, this._selEmit();
  }
  seleccionarTodo() {
    this._sel = new Set(this._proc.map((t) => this._llave(t))), this._selEmit();
  }
  seleccionar(t) {
    this._sel = new Set(t), this._selEmit();
  }
  limpiarSeleccion() {
    this._sel = /* @__PURE__ */ new Set(), this._selEmit();
  }
  _accion(t, i) {
    this._menu = "", i ? this._emitir("gob-tabla-accion", { accion: t.id, fila: i }) : this._emitir("gob-tabla-accion", { accion: t.id, filas: (this.datos ?? []).filter((e) => this._sel.has(this._llave(e))), llaves: [...this._sel] });
  }
  get filasFiltradas() {
    return this._proc;
  }
  // ------------------------------------------------------------------ exportación
  _matriz() {
    const t = this._cols;
    return [t.map((i) => this._t(i)), ...this._proc.map((i) => t.map((e) => {
      const s = _(i, e.campo);
      return this._esNum(e) && s != null ? String(s) : this._txt(e, i);
    }))];
  }
  csv() {
    return this._matriz().map((t) => t.map((i) => `"${i.replace(/"/g, '""')}"`).join(";")).join(`
`);
  }
  exportarCSV(t = "tabla") {
    const i = new Blob(["\uFEFF" + this.csv()], { type: "text/csv;charset=utf-8" }), e = document.createElement("a");
    e.href = URL.createObjectURL(i), e.download = t + ".csv", e.click(), setTimeout(() => URL.revokeObjectURL(e.href), 1e3), this._emitir("gob-tabla-exportar", { formato: "csv", filas: this._proc.length });
  }
  async copiar() {
    try {
      await navigator.clipboard.writeText(this._matriz().map((t) => t.join("	")).join(`
`)), this._aviso = "Tabla copiada al portapapeles";
    } catch {
      this._aviso = "No se pudo copiar";
    }
    this._emitir("gob-tabla-exportar", { formato: "copiar", filas: this._proc.length });
  }
  async imprimir() {
    this._imp = !0, await this.updateComplete;
    const t = () => {
      this._imp = !1, window.removeEventListener("afterprint", t);
    };
    window.addEventListener("afterprint", t), window.print();
  }
  // ------------------------------------------------------------------ celdas
  _celda(t, i) {
    const e = _(i, t.campo);
    if (t.render) return n`${I(t.render(e, i))}`;
    if (e == null || e === "") return n`<span class="nd">—</span>`;
    switch (t.tipo) {
      case "estado": {
        const s = t.estados?.[String(e)] ?? "neutro", [r, o] = B[s] ?? B.neutro;
        return n`<span class="b" style="background:${r};color:${o}"><i style="background:${o}"></i>${e}</span>`;
      }
      case "booleano":
        return e ? n`<span class="si" title="Sí">${u("check-circulo", 18)}<span class="sr">Sí</span></span>` : n`<span class="nd">—<span class="sr">No</span></span>`;
      case "enlace": {
        const s = (t.enlace ?? "{v}").replace("{v}", encodeURIComponent(String(e))).replace(/\{(\w+)\}/g, (r, o) => encodeURIComponent(String(_(i, o) ?? "")));
        return n`<a href=${s} target="_blank" rel="noopener">${e}</a>`;
      }
      case "barra": {
        const s = t.maximo ?? 1, r = Math.max(0, Math.min(100, Number(e) / s * 100));
        return n`<span class="br"><span class="bb"><i style="width:${r}%"></i></span><span>${this._txt(t, i)}</span></span>`;
      }
      default: {
        const s = this._txt(t, i);
        if (t.semaforo && this._esNum(t)) {
          const r = Number(e), o = t.semaforo, a = o.invertir ? r <= o.verde : r >= o.verde, c = o.invertir ? r <= o.amarillo : r >= o.amarillo;
          return n`<span class="sm"><i style="background:${a ? "#3F7A37" : c ? "#B58900" : "#B20028"}"></i>${s}</span>`;
        }
        return s;
      }
    }
  }
  _totalDe(t) {
    if (!t.total) return "";
    const i = this._proc.map((s) => Number(_(s, t.campo))).filter((s) => Number.isFinite(s));
    if (!i.length && t.total !== "conteo") return "";
    const e = t.total === "suma" ? i.reduce((s, r) => s + r, 0) : t.total === "promedio" ? i.reduce((s, r) => s + r, 0) / i.length : t.total === "conteo" ? this._proc.length : t.total === "min" ? Math.min(...i) : Math.max(...i);
    return t.total === "conteo" ? String(e) : this._num(t, e);
  }
  // ------------------------------------------------------------------ render
  _barra() {
    const t = this._sel.size, i = this.columnas ?? [];
    return n`<div class="tb" part="barra">
      ${this.busqueda ? n`<label class="q">${u("buscar", 16)}<input type="search" placeholder="Buscar…" aria-label="Buscar en la tabla" .value=${this._q} @input=${(e) => this._setQ(e.target.value)}></label>` : p}
      <button type="button" class="bt ${this._verFiltros ? "on" : ""}" aria-pressed=${this._verFiltros} @click=${() => this._verFiltros = !this._verFiltros}>${u("filtro", 16)}<span>Filtros</span></button>
      ${this._q || Object.values(this._filtros).some(Boolean) ? n`<button type="button" class="bt" @click=${() => this.limpiarFiltros()}>${u("filtro-quitar", 16)}<span>Limpiar</span></button>` : p}
      <span class="sp"></span><slot name="herramientas"></slot>
      ${this.selectorColumnas ? n`<span class="mn"><button type="button" class="bt" aria-haspopup="true" aria-expanded=${this._menu === "cols"} @click=${() => this._menu = this._menu === "cols" ? "" : "cols"}>${u("columnas", 16)}<span>Columnas</span></button>
        ${this._menu === "cols" ? n`<div class="pop" role="group" aria-label="Columnas visibles">${i.filter((e) => !e.oculta).map((e) => n`<label><input type="checkbox" .checked=${!this._ocultas.has(e.campo)} @change=${(s) => {
      const r = new Set(this._ocultas);
      s.target.checked ? r.delete(e.campo) : r.add(e.campo), this._ocultas = r;
    }}> ${this._t(e)}</label>`)}</div>` : p}</span>` : p}
      ${this.exportar ? n`<span class="mn"><button type="button" class="bt" aria-haspopup="true" aria-expanded=${this._menu === "exp"} @click=${() => this._menu = this._menu === "exp" ? "" : "exp"}>${u("descargar", 16)}<span>Exportar</span></button>
        ${this._menu === "exp" ? n`<div class="pop" role="menu"><button role="menuitem" type="button" @click=${() => {
      this.exportarCSV(this.titulo ? $(this.titulo).replace(/\W+/g, "-") : "tabla"), this._menu = "";
    }}>${u("hoja", 16)} Excel (CSV)</button><button role="menuitem" type="button" @click=${() => {
      this.copiar(), this._menu = "";
    }}>${u("copiar", 16)} Copiar</button><button role="menuitem" type="button" @click=${() => {
      this._menu = "", this.imprimir();
    }}>${u("imprimir", 16)} Imprimir / PDF</button></div>` : p}</span>` : p}
    </div>
    ${t && this.seleccion !== "ninguna" ? n`<div class="ms" role="region" aria-label="Acciones sobre la selección"><b>${t} seleccionada${t === 1 ? "" : "s"}</b>
      ${this.seleccion === "multiple" && this._proc.length > this._visibles.length && t < this._proc.length ? n`<button type="button" class="ln" @click=${() => this.seleccionarTodo()}>Seleccionar los ${this._proc.length}</button>` : p}
      <button type="button" class="ln" @click=${() => this.limpiarSeleccion()}>Quitar selección</button><span class="sp"></span>
      ${(this.accionesMasivas ?? []).map((e) => n`<button type="button" class="bt ${e.tipo === "peligro" ? "pel" : e.tipo === "primario" ? "pri" : ""}" @click=${() => this._accion(e)}>${u(e.icono, 16)}<span>${e.etiqueta}</span></button>`)}</div>` : p}`;
  }
  _fila(t, i) {
    const e = this._llave(t), s = this._sel.has(e), r = String(_(t, i[0]?.campo ?? this.llave) ?? e), o = this.acciones ?? [];
    return n`<tr class=${s ? "sel" : ""} tabindex=${this.filaClicable ? 0 : p} @click=${this.filaClicable ? () => this._emitir("gob-tabla-fila-clic", { fila: t }) : p} @keydown=${this.filaClicable ? (a) => {
      a.key === "Enter" && a.target === a.currentTarget && this._emitir("gob-tabla-fila-clic", { fila: t });
    } : p}>
      ${this.seleccion !== "ninguna" ? n`<td class="ck" data-label=""><input type=${this.seleccion === "una" ? "radio" : "checkbox"} name="sel" aria-label=${`Seleccionar ${r}`} .checked=${s} @click=${(a) => a.stopPropagation()} @change=${(a) => this._selFila(t, a.target.checked)}></td>` : p}
      ${i.map((a) => n`<td class="a-${a.alinear ?? (this._esNum(a) ? "der" : "izq")} ${a.nowrap ?? (!!a.tipo && a.tipo !== "texto") ? "nw" : ""}" data-label=${this._t(a)}>${this._celda(a, t)}</td>`)}
      ${o.length ? n`<td class="ac" data-label="Acciones" @click=${(a) => a.stopPropagation()}><span class="ab">${o.slice(0, o.length > 3 ? 2 : 3).map((a) => n`<button type="button" class="ib ${a.tipo === "peligro" ? "pel" : ""}" title=${a.etiqueta} aria-label=${`${a.etiqueta}: ${r}`} @click=${() => this._accion(a, t)}>${u(a.icono ?? "mas-opciones", 16)}</button>`)}
        ${o.length > 3 ? n`<span class="mn"><button type="button" class="ib" aria-haspopup="true" aria-label=${`Más acciones: ${r}`} aria-expanded=${this._menu === "f" + e} @click=${() => this._menu = this._menu === "f" + e ? "" : "f" + e}>${u("mas-opciones", 16)}</button>
          ${this._menu === "f" + e ? n`<div class="pop der" role="menu">${o.slice(2).map((a) => n`<button role="menuitem" type="button" class=${a.tipo === "peligro" ? "pel" : ""} @click=${() => this._accion(a, t)}>${u(a.icono, 16)} ${a.etiqueta}</button>`)}</div>` : p}</span>` : p}</span></td>` : p}</tr>`;
  }
  _pie() {
    if (!this.paginacion) return n`<div class="pg"><span class="inf">${this._total} fila${this._total === 1 ? "" : "s"}</span></div>`;
    const t = this._total ? this._pag * this._tam + 1 : 0, i = Math.min(this._total, (this._pag + 1) * this._tam), e = this._paginas, s = [], r = Math.max(0, Math.min(this._pag - 2, e - 5));
    for (let o = r; o < Math.min(e, r + 5); o++) s.push(o);
    return n`<div class="pg" part="paginacion"><span class="inf">${t}–${i} de ${this._total}</span>
      <label class="tm">Filas <select aria-label="Filas por página" @change=${(o) => {
      this._tam = Number(o.target.value), this._pag = 0, this._emitir("gob-tabla-pagina", { pagina: 1, tamano: this._tam }), this.modoServidor && this._consultar();
    }}>${(this.opcionesTamano ?? [10]).map((o) => n`<option .selected=${o === this._tam} value=${o}>${o}</option>`)}</select></label><span class="sp"></span>
      <nav class="nv" aria-label="Paginación"><button type="button" class="ib" aria-label="Primera página" ?disabled=${this._pag === 0} @click=${() => this._ir(0)}>${u("chevron-doble-izquierda", 16)}</button><button type="button" class="ib" aria-label="Página anterior" ?disabled=${this._pag === 0} @click=${() => this._ir(this._pag - 1)}>${u("chevron-izquierda", 16)}</button>
        ${s.map((o) => n`<button type="button" class="pn ${o === this._pag ? "on" : ""}" aria-label=${`Página ${o + 1}`} aria-current=${o === this._pag ? "page" : p} @click=${() => this._ir(o)}>${o + 1}</button>`)}
        <button type="button" class="ib" aria-label="Página siguiente" ?disabled=${this._pag >= e - 1} @click=${() => this._ir(this._pag + 1)}>${u("chevron-derecha", 16)}</button><button type="button" class="ib" aria-label="Última página" ?disabled=${this._pag >= e - 1} @click=${() => this._ir(e - 1)}>${u("chevron-doble-derecha", 16)}</button></nav></div>`;
  }
  render() {
    const t = this._cols, i = this._visibles, e = this.seleccion !== "ninguna", s = i.length > 0 && i.every((a) => this._sel.has(this._llave(a))), r = i.some((a) => this._sel.has(this._llave(a))), o = t.length + (e ? 1 : 0) + ((this.acciones ?? []).length ? 1 : 0);
    return n`<div class="w ${this.tarjetas === "siempre" ? "tj" : ""}" part="tabla" @click=${(a) => {
      this._menu && !a.target.closest?.(".mn") && (this._menu = "");
    }}>
      ${this._barra()}
      <div class="sc" style=${this.alturaMax ? `max-height:${this.alturaMax}px` : ""} tabindex="0" role="region" aria-label=${this.titulo || "Tabla de datos"}>
        <table aria-busy=${this.cargando} aria-rowcount=${this._total}>
          ${this.titulo || this.descripcion ? n`<caption class="${this.titulo ? "cap" : "sr"}">${this.titulo}${this.descripcion ? n`<small>${this.descripcion}</small>` : p}</caption>` : p}
          <thead><tr>
            ${e ? n`<th class="ck" scope="col">${this.seleccion === "multiple" ? n`<input type="checkbox" aria-label="Seleccionar todas las filas de la página" .checked=${s} .indeterminate=${r && !s} @change=${(a) => this._selPagina(a.target.checked)}>` : n`<span class="sr">Selección</span>`}</th>` : p}
            ${t.map((a) => {
      const c = this._orden?.campo === a.campo ? this._orden.dir : null, m = a.ordenable !== !1;
      return n`<th scope="col" class="a-${a.alinear ?? (this._esNum(a) ? "der" : "izq")}" style=${a.ancho ? `width:${a.ancho}` : ""} aria-sort=${c ? c === "asc" ? "ascending" : "descending" : m ? "none" : p}>${m ? n`<button type="button" class="so" @click=${() => this._ordenar(a)}><span>${this._t(a)}</span>${u(c === "asc" ? "flecha-arriba" : c === "desc" ? "flecha-abajo" : "ordenar", 14)}</button>` : this._t(a)}</th>`;
    })}
            ${(this.acciones ?? []).length ? n`<th scope="col" class="ac">Acciones</th>` : p}</tr>
            ${this._verFiltros ? n`<tr class="fl">${e ? n`<th></th>` : p}${t.map((a) => {
      const c = a.filtrable === !1 ? null : this._opcionesFiltro(a);
      return n`<th>${a.filtrable === !1 ? p : c ? n`<select aria-label=${`Filtrar por ${this._t(a)}`} @change=${(m) => this._setF(a.campo, m.target.value)}><option value="">Todos</option>${c.map((m) => n`<option value=${m} .selected=${this._filtros[a.campo] === m}>${m}</option>`)}</select>` : n`<input type="text" aria-label=${`Filtrar por ${this._t(a)}`} placeholder=${this._esNum(a) ? ">10, 5-20" : "Filtrar…"} .value=${this._filtros[a.campo] ?? ""} @input=${(m) => this._setF(a.campo, m.target.value)}>`}</th>`;
    })}${(this.acciones ?? []).length ? n`<th></th>` : p}</tr>` : p}</thead>
          <tbody>${this.cargando ? Array.from({ length: Math.min(this._tam, 5) }, () => n`<tr class="skl">${Array.from({ length: o }, () => n`<td><i></i></td>`)}</tr>`) : i.length ? Q(i, (a) => this._llave(a), (a) => this._fila(a, t)) : n`<tr class="vc"><td colspan=${o}><div class="ev"><slot name="vacio">${u("buscar", 28)}<p>${this._q || Object.values(this._filtros).some(Boolean) ? "Ningún resultado coincide con la búsqueda." : this.vacio}</p></slot></div></td></tr>`}</tbody>
          ${this.totales && t.some((a) => a.total) && i.length ? n`<tfoot><tr>${e ? n`<td></td>` : p}${t.map((a, c) => n`<td class="a-${a.alinear ?? (this._esNum(a) ? "der" : "izq")}" data-label=${this._t(a)}>${c === 0 && !a.total ? "Total" : this._totalDe(a)}</td>`)}${(this.acciones ?? []).length ? n`<td></td>` : p}</tr></tfoot>` : p}
        </table></div>
      ${this._pie()}<div class="sr" role="status" aria-live="polite">${this._aviso}</div></div>`;
  }
  static {
    this.styles = D`
    :host { --b: #E3E8EF; --bg: #fff; --hd: #F8FAFC; --tx: #252B36; --mu: #6B7482; --ho: #F8FAFC; --ac: #0071BB; display: block; font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); color: var(--tx); container-type: inline-size; }
    :host([tema='oscuro']) { --b: #12395C; --bg: #0B2239; --hd: #0E2D49; --tx: #E3E8EF; --mu: #97A1B0; --ho: #0E2D49; --ac: #4FA3D4; }
    .w { background: var(--bg); border: 1px solid var(--b); border-radius: 12px; overflow: visible; box-shadow: 0 1px 2px rgba(8,26,44,.06); } svg { display: block; } button, input, select { font: inherit; color: inherit; }
    .tb, .ms, .pg { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; padding: .65rem .85rem; } .tb { border-bottom: 1px solid var(--b); } .sp { flex: 1; }
    .q { display: flex; align-items: center; gap: .4rem; border: 1px solid #CBD2DC; border-radius: 8px; padding: 0 .6rem; background: var(--bg); min-width: 14rem; } .q:focus-within { border-color: var(--ac); box-shadow: 0 0 0 3px rgba(0,113,187,.2); } .q input { border: 0; outline: 0; background: none; padding: .5rem 0; width: 100%; font-size: .875rem; }
    .bt { display: inline-flex; align-items: center; gap: .4rem; border: 1px solid #CBD2DC; background: var(--bg); border-radius: 8px; padding: .45rem .75rem; font-size: .8125rem; font-weight: 600; cursor: pointer; } .bt:hover { background: var(--ho); } .bt.on { background: #D6E8F4; border-color: var(--ac); color: #004F82; } .bt.pri { background: #0071BB; color: #fff; border-color: #0071BB; } .bt.pel { color: #B20028; border-color: #F2A3B5; }
    .bt:focus-visible, .ib:focus-visible, .pn:focus-visible, .so:focus-visible, .ln:focus-visible, .sc:focus-visible, select:focus-visible, input:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }
    .mn { position: relative; } .pop { position: absolute; z-index: 20; top: calc(100% + 4px); right: 0; min-width: 11rem; background: var(--bg); border: 1px solid var(--b); border-radius: 10px; box-shadow: 0 12px 28px rgba(8,26,44,.18); padding: .35rem; display: grid; gap: 1px; } .pop.der { right: 0; }
    .pop label, .pop button { display: flex; align-items: center; gap: .5rem; padding: .45rem .6rem; border: 0; background: none; border-radius: 6px; font-size: .8125rem; cursor: pointer; text-align: left; } .pop label:hover, .pop button:hover { background: var(--ho); } .pop .pel { color: #B20028; }
    .ms { background: #E6F3FF; border-bottom: 1px solid #ADD2E9; color: #003D66; font-size: .85rem; } :host([tema='oscuro']) .ms { background: #12395C; color: #E3E8EF; border-color: #1B4B75; } .ln { border: 0; background: none; color: inherit; text-decoration: underline; cursor: pointer; font-size: .8rem; }
    .sc { overflow: auto; } table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: .875rem; } caption { text-align: left; padding: .8rem .95rem; } caption.cap { font-weight: 700; font-size: 1rem; } caption small { display: block; font-weight: 400; color: var(--mu); font-size: .8rem; }
    thead th { position: sticky; top: 0; z-index: 2; background: var(--hd); color: var(--mu); text-align: left; font-size: .72rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; padding: .7rem .95rem; border-bottom: 1px solid var(--b); white-space: nowrap; }
    .so { display: inline-flex; align-items: center; gap: .35rem; border: 0; background: none; padding: 0; font: inherit; letter-spacing: inherit; text-transform: inherit; color: inherit; cursor: pointer; } .so:hover, th[aria-sort='ascending'] .so, th[aria-sort='descending'] .so { color: var(--ac); } .a-der { text-align: right; } .a-der .so { flex-direction: row-reverse; } .a-centro { text-align: center; }
    tr.fl th { top: 2.4rem; text-transform: none; letter-spacing: 0; font-weight: 400; padding: .35rem .95rem; } tr.fl input, tr.fl select { width: 100%; box-sizing: border-box; border: 1px solid #CBD2DC; border-radius: 6px; padding: .3rem .5rem; font-size: .78rem; background: var(--bg); }
    td { padding: .65rem .95rem; border-bottom: 1px solid var(--b); vertical-align: middle; } :host([densidad='compacta']) td { padding: .35rem .95rem; } :host([densidad='amplia']) td { padding: 1rem .95rem; } tbody tr:last-child td { border-bottom: 0; } tbody tr:hover td { background: var(--ho); } :host([zebra]) tbody tr:nth-child(even) td { background: color-mix(in srgb, var(--hd) 60%, transparent); }
    tr.sel td { background: #EBF4FA !important; } :host([tema='oscuro']) tr.sel td { background: #12395C !important; } tr[tabindex] { cursor: pointer; } tr[tabindex]:focus-visible { outline: 2px solid var(--ac); outline-offset: -2px; } td.ck, th.ck { width: 2.6rem; text-align: center; } td.ck input, th.ck input { accent-color: var(--ac); width: 1rem; height: 1rem; cursor: pointer; }
    td.nw { white-space: nowrap; } td.nd, .nd { color: var(--mu); }
    td.ac, th.ac { position: sticky; right: 0; background: var(--bg); box-shadow: -10px 0 8px -10px rgba(8,26,44,.25); } th.ac { background: var(--hd); z-index: 3; } tbody tr:hover td.ac { background: var(--ho); } tr.sel td.ac { background: #EBF4FA; } td a { color: var(--ac); font-weight: 600; } tfoot td { font-weight: 700; background: var(--hd); border-top: 1px solid var(--b); border-bottom: 0; }
    .b { display: inline-flex; align-items: center; gap: .4rem; border-radius: 99px; padding: .2rem .65rem; font-size: .75rem; font-weight: 700; white-space: nowrap; } .b i, .sm i { width: .45rem; height: .45rem; border-radius: 50%; display: inline-block; } .sm { display: inline-flex; align-items: center; gap: .45rem; } .si { color: #3F7A37; }
    .br { display: inline-flex; align-items: center; gap: .6rem; min-width: 8rem; } .bb { flex: 1; height: 6px; border-radius: 99px; background: #E3E8EF; overflow: hidden; min-width: 3.5rem; } .bb i { display: block; height: 100%; background: var(--ac); border-radius: inherit; }
    .ab { display: inline-flex; gap: .15rem; justify-content: flex-end; } td.ac, th.ac { text-align: right; white-space: nowrap; } .ib { display: inline-grid; place-items: center; width: 2rem; height: 2rem; border: 0; background: none; border-radius: 8px; color: var(--mu); cursor: pointer; } .ib:hover:not(:disabled) { background: var(--ho); color: var(--tx); } .ib.pel:hover { color: #B20028; background: #FFE9EE; } .ib:disabled { opacity: .35; cursor: not-allowed; }
    .pg { border-top: 1px solid var(--b); font-size: .8125rem; color: var(--mu); } .tm { display: inline-flex; align-items: center; gap: .4rem; } .tm select { border: 1px solid #CBD2DC; border-radius: 6px; padding: .25rem .4rem; background: var(--bg); } .nv { display: inline-flex; align-items: center; gap: .15rem; }
    .pn { min-width: 2rem; height: 2rem; border: 0; background: none; border-radius: 8px; font-weight: 600; color: var(--tx); cursor: pointer; } .pn:hover { background: var(--ho); } .pn.on { background: var(--ac); color: #fff; }
    .ev { display: grid; place-items: center; gap: .3rem; padding: 2.5rem 1rem; color: var(--mu); text-align: center; } .ev p { margin: 0; } .skl i { display: block; height: .9rem; border-radius: 6px; background: linear-gradient(90deg, #ECEFF4 25%, #F8FAFC 50%, #ECEFF4 75%); background-size: 200% 100%; animation: sh 1.2s infinite linear; } @keyframes sh { to { background-position: -200% 0; } }
    .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    /* Vista de tarjetas (móvil o forzada) */
    @container (max-width: 640px) { :host([tarjetas='auto']) td.ac { position: static; box-shadow: none; background: none; } :host([tarjetas='auto']) table, :host([tarjetas='auto']) tbody, :host([tarjetas='auto']) tr, :host([tarjetas='auto']) td { display: block; } :host([tarjetas='auto']) thead { display: none; } :host([tarjetas='auto']) tbody tr { border-bottom: 1px solid var(--b); padding: .5rem 0; }
      :host([tarjetas='auto']) td { border: 0; padding: .3rem .95rem; text-align: left !important; display: flex; justify-content: space-between; gap: 1rem; } :host([tarjetas='auto']) td::before { content: attr(data-label); font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: var(--mu); flex: none; } :host([tarjetas='auto']) td.ck::before { content: ''; } :host([tarjetas='auto']) .sc { max-height: none !important; } }
    :host([tarjetas='siempre']) table, :host([tarjetas='siempre']) tbody, :host([tarjetas='siempre']) tr, :host([tarjetas='siempre']) td { display: block; } :host([tarjetas='siempre']) thead { display: none; } :host([tarjetas='siempre']) tbody tr { border-bottom: 1px solid var(--b); padding: .5rem 0; } :host([tarjetas='siempre']) td { border: 0; padding: .3rem .95rem; text-align: left !important; display: flex; justify-content: space-between; gap: 1rem; } :host([tarjetas='siempre']) td::before { content: attr(data-label); font-size: .72rem; font-weight: 700; text-transform: uppercase; color: var(--mu); }
    @media print { .tb, .ms, .pg, .ac, .ck, tr.fl { display: none !important; } .w { border: 0; box-shadow: none; } .sc { max-height: none !important; overflow: visible; } thead th { position: static; } }
    @media (prefers-reduced-motion: reduce) { .skl i { animation: none; } }`;
  }
}
customElements.get("gob-tabla") || customElements.define("gob-tabla", H);
export {
  H as GobTabla
};
