import { i as g, a as y, A as l, b as o } from "../chunks/lit-element-CZvHeOsZ.js";
import { i as h } from "../chunks/icono-x0IYmMl5.js";
const q = { fromAttribute: (a) => {
  try {
    return a ? JSON.parse(a) : [];
  } catch {
    return [];
  }
} }, _ = (a) => String(a).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(), x = g`:host { display: block; font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); color: var(--gob-color-texto, #161A22); } svg { display: block; } *, *::before, *::after { box-sizing: border-box; }
  .campo { display: flex; align-items: center; gap: .4rem; min-height: 2.5rem; padding: .25rem .6rem .25rem .8rem; background: #fff; border: 1px solid #CBD2DC; border-radius: 8px; cursor: pointer; transition: border-color .15s, box-shadow .15s; }
  .campo:hover { border-color: #9AA4B2; } .campo.foco { border-color: #0071BB; box-shadow: 0 0 0 3px rgba(0,113,187,.22); } :host([invalido]) .campo { border-color: #F7003C; } :host([deshabilitado]) .campo { background: #F1F4F8; cursor: not-allowed; opacity: .7; }
  .mini { display: grid; place-items: center; width: 1.6rem; height: 1.6rem; border: 0; border-radius: 6px; background: none; color: #5B6575; cursor: pointer; flex: none; } .mini:hover { background: #F1F4F8; color: #161A22; } .mini:focus-visible { outline: 2px solid #0071BB; }
  .pop { position: absolute; z-index: 1000; left: 0; min-width: 100%; margin-top: 4px; background: #fff; border: 1px solid #E3E8EF; border-radius: 12px; box-shadow: 0 16px 40px rgba(8,26,44,.18); overflow: hidden; } .rel { position: relative; }`;
class D extends y {
  constructor() {
    super(), this._int = this.attachInternals?.(), this._uid = "sel" + Math.random().toString(36).slice(2, 7), this._fuera = (e) => {
      this._abierto && !e.composedPath().includes(this) && this._cerrar();
    }, this.opciones = [], this.valor = "", this.multiple = !1, this.buscable = !0, this.limpiable = !0, this.placeholder = "Seleccione…", this.deshabilitado = !1, this.invalido = !1, this.name = "", this.etiqueta = "Selector", this.requerido = !1, this.maxChips = 3, this._abierto = !1, this._q = "", this._i = 0, this._foco = !1;
  }
  static {
    this.formAssociated = !0;
  }
  static {
    this.properties = {
      opciones: { converter: q },
      valor: { converter: { fromAttribute: (e) => e ?? "", toAttribute: (e) => Array.isArray(e) ? e.join(",") : String(e ?? "") }, reflect: !0 },
      multiple: { type: Boolean, reflect: !0 },
      buscable: { type: Boolean },
      limpiable: { type: Boolean },
      placeholder: { type: String },
      deshabilitado: { type: Boolean, reflect: !0 },
      invalido: { type: Boolean, reflect: !0 },
      name: { type: String },
      etiqueta: { type: String },
      requerido: { type: Boolean },
      maxChips: { type: Number, attribute: "max-chips" },
      _abierto: { state: !0 },
      _q: { state: !0 },
      _i: { state: !0 },
      _foco: { state: !0 }
    };
  }
  get _ops() {
    return this.opciones.map((e) => typeof e == "string" ? { valor: e, etiqueta: e } : { ...e, valor: String(e.valor) });
  }
  get seleccion() {
    const e = this.valor;
    return Array.isArray(e) ? e.map(String) : e === "" || e == null ? [] : this.multiple ? String(e).split(",").filter(Boolean) : [String(e)];
  }
  get _filtradas() {
    const e = _(this._q.trim());
    return this._ops.filter((t) => !e || _(t.etiqueta).includes(e) || _(t.grupo ?? "").includes(e));
  }
  _emitir() {
    const e = this.multiple ? this.seleccion : this.seleccion[0] ?? "";
    this._sync(), this.dispatchEvent(new CustomEvent("gob-selector-cambio", { detail: { valor: e, opciones: this._ops.filter((t) => this.seleccion.includes(t.valor)) }, bubbles: !0, composed: !0 })), this.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  _sync() {
    if (!this._int) return;
    const e = new FormData();
    this.seleccion.forEach((t) => e.append(this.name || "valor", t)), this._int.setFormValue(this.name ? e : null), this.requerido && !this.seleccion.length ? this._int.setValidity({ valueMissing: !0 }, "Seleccione una opción", this.renderRoot.querySelector("input")) : this._int.setValidity({});
  }
  updated(e) {
    (e.has("valor") || e.has("multiple") || e.has("requerido") || e.has("name")) && this._sync();
  }
  _elegir(e) {
    if (!e.deshabilitada) {
      if (this.multiple) {
        const t = new Set(this.seleccion);
        t.has(e.valor) ? t.delete(e.valor) : t.add(e.valor), this.valor = [...t], this._q = "";
      } else
        this.valor = e.valor, this._cerrar();
      this._emitir(), this.renderRoot.querySelector("input")?.focus();
    }
  }
  _quitar(e, t) {
    t?.stopPropagation(), this.valor = this.seleccion.filter((i) => i !== e), this._emitir();
  }
  limpiar() {
    this.valor = this.multiple ? [] : "", this._q = "", this._emitir();
  }
  abrir() {
    this.deshabilitado || (this._abierto = !0, this._i = Math.max(0, this._filtradas.findIndex((e) => this.seleccion.includes(e.valor))));
  }
  _cerrar() {
    this._abierto = !1, this._q = "";
  }
  _tecla(e) {
    const t = this._filtradas;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (e.preventDefault(), !this._abierto) {
        this.abrir();
        return;
      }
      let i = this._i;
      do
        i = (i + (e.key === "ArrowDown" ? 1 : -1) + t.length) % t.length;
      while (t[i]?.deshabilitada && i !== this._i);
      this._i = i, this.updateComplete.then(() => this.renderRoot.querySelector(".on")?.scrollIntoView({ block: "nearest" }));
    } else e.key === "Enter" ? this._abierto && t[this._i] ? (e.preventDefault(), this._elegir(t[this._i])) : this._abierto || (e.preventDefault(), this.abrir()) : e.key === "Escape" ? this._abierto && (e.stopPropagation(), this._cerrar()) : e.key === "Backspace" && !this._q && this.multiple && this.seleccion.length ? this._quitar(this.seleccion.at(-1)) : e.key === "Tab" ? this._cerrar() : e.key === " " && !this.buscable && (e.preventDefault(), this._abierto ? t[this._i] && this._elegir(t[this._i]) : this.abrir());
  }
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("pointerdown", this._fuera, !0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), document.removeEventListener("pointerdown", this._fuera, !0);
  }
  formResetCallback() {
    this.valor = this.multiple ? [] : "";
  }
  formDisabledCallback(e) {
    this.deshabilitado = e;
  }
  render() {
    const e = this._ops, t = this.seleccion, i = this._filtradas, p = (r) => e.find((s) => s.valor === r)?.etiqueta ?? r, n = this.multiple ? t.slice(0, this.maxChips) : [], u = this.multiple ? t.length - n.length : 0;
    let m = "";
    const d = !this.multiple && !this._q && t.length;
    return o`<div class="rel"><div class="campo ${this._foco ? "foco" : ""}" @click=${() => {
      this._abierto ? this._cerrar() : this.abrir(), this.renderRoot.querySelector("input")?.focus();
    }}>
      <div class="v">${n.map((r) => o`<span class="chip">${p(r)}<button type="button" class="x" aria-label=${"Quitar " + p(r)} @click=${(s) => this._quitar(r, s)}>${h("cerrar", 12)}</button></span>`)}${u > 0 ? o`<span class="chip mas">+${u}</span>` : l}
        ${d ? o`<span class="txt">${p(t[0])}</span>` : l}
        <input role="combobox" aria-label=${this.etiqueta} aria-expanded=${this._abierto} aria-controls=${this._uid} aria-autocomplete=${this.buscable ? "list" : "none"} aria-activedescendant=${this._abierto ? this._uid + "-" + this._i : l} aria-invalid=${this.invalido ? "true" : l} aria-required=${this.requerido ? "true" : l}
          .value=${this._q} ?readonly=${!this.buscable} ?disabled=${this.deshabilitado} placeholder=${t.length ? "" : this.placeholder} autocomplete="off" size="1"
          @input=${(r) => {
      this._q = r.target.value, this._abierto = !0, this._i = 0;
    }} @keydown=${this._tecla} @focus=${() => this._foco = !0} @blur=${() => this._foco = !1}></div>
      ${this.limpiable && t.length && !this.deshabilitado ? o`<button type="button" class="mini" aria-label="Limpiar selección" @click=${(r) => {
      r.stopPropagation(), this.limpiar();
    }}>${h("cerrar", 14)}</button>` : l}
      <span class="mini" aria-hidden="true">${h(this._abierto ? "chevron-arriba" : "chevron-abajo", 16)}</span></div>
      ${this._abierto ? o`<ul class="pop lista" id=${this._uid} role="listbox" aria-multiselectable=${this.multiple} aria-label=${this.etiqueta}>${i.length ? i.map((r, s) => {
      const c = r.grupo && r.grupo !== m ? (m = r.grupo, o`<li class="g" role="presentation">${r.grupo}</li>`) : l;
      return o`${c}<li id=${this._uid + "-" + s} role="option" class="o ${s === this._i ? "on" : ""} ${r.deshabilitada ? "dis" : ""}" aria-selected=${t.includes(r.valor)} aria-disabled=${r.deshabilitada ? "true" : l} @click=${() => this._elegir(r)} @mouseenter=${() => this._i = s}>
          ${this.multiple ? o`<span class="cb ${t.includes(r.valor) ? "ck" : ""}">${t.includes(r.valor) ? h("check", 12) : l}</span>` : l}${h(r.icono, 16)}<span class="ot">${r.etiqueta}${r.descripcion ? o`<small>${r.descripcion}</small>` : l}</span>${!this.multiple && t.includes(r.valor) ? h("check", 16) : l}</li>`;
    }) : o`<li class="vacio" role="presentation">Sin resultados</li>`}</ul>` : l}</div>`;
  }
  static {
    this.styles = [x, g`
    .v { flex: 1; display: flex; flex-wrap: wrap; align-items: center; gap: .3rem; min-width: 0; } input { flex: 1; min-width: 4rem; border: 0; outline: 0; background: none; font: inherit; font-size: .9375rem; color: inherit; padding: .25rem 0; cursor: inherit; } input::placeholder { color: #6B7482; }
    .txt { font-size: .9375rem; } .chip { display: inline-flex; align-items: center; gap: .25rem; background: #E5F1F9; color: #004F82; border-radius: 6px; padding: .15rem .25rem .15rem .55rem; font-size: .8rem; font-weight: 600; } .chip.mas { padding-right: .55rem; background: #F1F4F8; color: #3A424F; }
    .x { display: grid; place-items: center; border: 0; background: none; color: inherit; cursor: pointer; border-radius: 4px; padding: .1rem; } .x:hover { background: rgba(0,79,130,.15); }
    .lista { list-style: none; margin: 4px 0 0; padding: .35rem; max-height: 16rem; overflow: auto; } .o { display: flex; align-items: center; gap: .55rem; padding: .5rem .6rem; border-radius: 8px; font-size: .9rem; cursor: pointer; } .o.on { background: #F1F4F8; } .o[aria-selected='true'] { color: #004F82; font-weight: 600; } .o.dis { opacity: .4; cursor: not-allowed; } .ot { flex: 1; display: grid; } .ot small { color: #5B6575; font-weight: 400; font-size: .76rem; }
    .g { padding: .55rem .6rem .25rem; font-size: .68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #5B6575; } .vacio { padding: .8rem; text-align: center; color: #5B6575; font-size: .88rem; }
    .cb { display: grid; place-items: center; width: 1.05rem; height: 1.05rem; border: 1.5px solid #9AA4B2; border-radius: 4px; background: #fff; flex: none; } .cb.ck { background: #0071BB; border-color: #0071BB; color: #fff; }`];
  }
}
const v = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"], E = ["lu", "ma", "mi", "ju", "vi", "sá", "do"], b = (a) => `${a.getFullYear()}-${String(a.getMonth() + 1).padStart(2, "0")}-${String(a.getDate()).padStart(2, "0")}`, $ = (a) => {
  const e = /^(\d{4})-(\d{2})-(\d{2})$/.exec(a ?? "");
  return e ? new Date(+e[1], +e[2] - 1, +e[3]) : null;
}, f = (a) => {
  const e = $(a);
  return e ? `${e.getDate()} ${v[e.getMonth()].slice(0, 3)} ${e.getFullYear()}` : "";
};
class S extends y {
  constructor() {
    super(), this._int = this.attachInternals?.(), this._fuera = (e) => {
      this._abierto && !e.composedPath().includes(this) && (this._abierto = !1, this._tmp = "");
    }, this.valor = "", this.rango = !1, this.min = "", this.max = "", this.placeholder = "Seleccione una fecha", this.deshabilitado = !1, this.invalido = !1, this.name = "", this.etiqueta = "Fecha", this.limpiable = !0, this._abierto = !1, this._vista = /* @__PURE__ */ new Date(), this._tmp = "", this._hover = "";
  }
  static {
    this.formAssociated = !0;
  }
  static {
    this.properties = { valor: { type: String, reflect: !0 }, rango: { type: Boolean, reflect: !0 }, min: { type: String }, max: { type: String }, placeholder: { type: String }, deshabilitado: { type: Boolean, reflect: !0 }, invalido: { type: Boolean, reflect: !0 }, name: { type: String }, etiqueta: { type: String }, limpiable: { type: Boolean }, _abierto: { state: !0 }, _vista: { state: !0 }, _tmp: { state: !0 }, _hover: { state: !0 } };
  }
  get _par() {
    const [e, t] = (this.valor || "").split("/");
    return [e ?? "", t ?? ""];
  }
  updated(e) {
    e.has("valor") && this._int?.setFormValue(this.valor || null);
  }
  abrir() {
    if (this.deshabilitado) return;
    const e = $(this._par[0]);
    this._vista = e ? new Date(e.getFullYear(), e.getMonth(), 1) : new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), 1), this._tmp = "", this._abierto = !0, this.updateComplete.then(() => this.renderRoot.querySelector(".d.sel, .d.hoy, .d:not([disabled])")?.focus());
  }
  _cerrar() {
    this._abierto = !1, this._tmp = "", this.renderRoot.querySelector(".campo")?.focus();
  }
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("pointerdown", this._fuera, !0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), document.removeEventListener("pointerdown", this._fuera, !0);
  }
  _ok(e) {
    return (!this.min || e >= this.min) && (!this.max || e <= this.max);
  }
  _emit() {
    this.dispatchEvent(new CustomEvent("gob-fecha-cambio", { detail: { valor: this.valor, inicio: this._par[0], fin: this._par[1] }, bubbles: !0, composed: !0 })), this.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  _pick(e) {
    if (!this._ok(e)) return;
    if (!this.rango) {
      this.valor = e, this._emit(), this._cerrar();
      return;
    }
    if (!this._tmp) {
      this._tmp = e;
      return;
    }
    const [t, i] = e < this._tmp ? [e, this._tmp] : [this._tmp, e];
    this.valor = t + "/" + i, this._tmp = "", this._emit(), this._cerrar();
  }
  limpiar() {
    this.valor = "", this._emit();
  }
  _mover(e) {
    this._vista = new Date(this._vista.getFullYear(), this._vista.getMonth() + e, 1);
  }
  _tecla(e, t) {
    const i = $(t), p = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key === "Escape") {
      e.preventDefault(), this._cerrar();
      return;
    }
    let n = null;
    e.key in p ? n = new Date(i.getFullYear(), i.getMonth(), i.getDate() + p[e.key]) : e.key === "PageDown" ? n = new Date(i.getFullYear(), i.getMonth() + 1, i.getDate()) : e.key === "PageUp" ? n = new Date(i.getFullYear(), i.getMonth() - 1, i.getDate()) : e.key === "Home" ? n = new Date(i.getFullYear(), i.getMonth(), 1) : e.key === "End" && (n = new Date(i.getFullYear(), i.getMonth() + 1, 0)), n && (e.preventDefault(), this._vista = new Date(n.getFullYear(), n.getMonth(), 1), this.updateComplete.then(() => this.renderRoot.querySelector(`[data-f="${b(n)}"]`)?.focus()));
  }
  render() {
    const [e, t] = this._par, i = this._vista, n = (new Date(i.getFullYear(), i.getMonth(), 1).getDay() + 6) % 7, u = b(/* @__PURE__ */ new Date()), m = Array.from({ length: 42 }, (s, c) => new Date(i.getFullYear(), i.getMonth(), 1 - n + c)), d = this.rango ? this._tmp ? [this._tmp, this._hover || this._tmp].sort() : [e, t] : [e, e], r = this.rango ? e ? t ? `${f(e)} – ${f(t)}` : f(e) : "" : f(e);
    return o`<div class="rel"><div class="campo ${this._abierto ? "foco" : ""}" tabindex=${this.deshabilitado ? -1 : 0} role="combobox" aria-haspopup="dialog" aria-expanded=${this._abierto} aria-label=${this.etiqueta + (r ? ": " + r : "")} aria-invalid=${this.invalido ? "true" : l}
        @click=${() => this._abierto ? this._cerrar() : this.abrir()} @keydown=${(s) => {
      (s.key === "Enter" || s.key === " " || s.key === "ArrowDown") && (s.preventDefault(), this.abrir());
    }}>
      ${h("calendario", 17)}<span class="txt ${r ? "" : "ph"}">${r || this.placeholder}</span>${this.limpiable && r && !this.deshabilitado ? o`<button type="button" class="mini" aria-label="Limpiar fecha" @click=${(s) => {
      s.stopPropagation(), this.limpiar();
    }}>${h("cerrar", 14)}</button>` : l}</div>
      ${this._abierto ? o`<div class="pop cal" role="dialog" aria-label="Calendario"><div class="enc"><button type="button" class="mini" aria-label="Mes anterior" @click=${() => this._mover(-1)}>${h("chevron-izquierda", 16)}</button><strong aria-live="polite">${v[i.getMonth()]} ${i.getFullYear()}</strong><button type="button" class="mini" aria-label="Mes siguiente" @click=${() => this._mover(1)}>${h("chevron-derecha", 16)}</button></div>
        <div class="gr" role="grid">${E.map((s) => o`<span class="dn" role="columnheader">${s}</span>`)}${m.map((s) => {
      const c = b(s), k = s.getMonth() !== i.getMonth(), w = c === d[0] || c === d[1], F = this.rango && d[0] && d[1] && c > d[0] && c < d[1];
      return o`<button type="button" class="d ${k ? "fu" : ""} ${w ? "sel" : ""} ${F ? "rg" : ""} ${c === u ? "hoy" : ""}" data-f=${c} ?disabled=${!this._ok(c)} aria-label=${s.getDate() + " de " + v[s.getMonth()] + " de " + s.getFullYear()} aria-pressed=${w} tabindex=${k ? -1 : 0}
            @click=${() => this._pick(c)} @mouseenter=${() => this._hover = c} @keydown=${(B) => this._tecla(B, c)}>${s.getDate()}</button>`;
    })}</div>
        <div class="pie"><button type="button" class="lnk" @click=${() => {
      const s = b(/* @__PURE__ */ new Date());
      this._vista = /* @__PURE__ */ new Date(), this.rango || this._pick(s);
    }}>Hoy</button>${this.rango && this._tmp ? o`<small>Elija la fecha final</small>` : l}</div></div>` : l}</div>`;
  }
  static {
    this.styles = [x, g`
    .txt { flex: 1; font-size: .9375rem; } .ph { color: #5B6575; } .campo:focus-visible { outline: 0; border-color: #0071BB; box-shadow: 0 0 0 3px rgba(0,113,187,.22); } .campo svg { color: #5B6575; flex: none; }
    .cal { padding: .75rem; width: 19rem; } .enc { display: flex; justify-content: space-between; align-items: center; margin-bottom: .5rem; } .enc strong { text-transform: capitalize; font-size: .92rem; }
    .gr { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; } .dn { text-align: center; font-size: .68rem; font-weight: 700; text-transform: uppercase; color: #5B6575; padding: .3rem 0; }
    .d { aspect-ratio: 1; border: 0; background: none; border-radius: 8px; font: inherit; font-size: .84rem; cursor: pointer; color: #161A22; } .d:hover:not(:disabled) { background: #F1F4F8; } .d.fu { color: #9AA4B2; } .d.hoy { font-weight: 800; color: #0071BB; box-shadow: inset 0 0 0 1.5px #9FD7E5; }
    .d.rg { background: #E5F1F9; border-radius: 0; } .d.sel { background: #0071BB; color: #fff; font-weight: 700; } .d:disabled { opacity: .3; cursor: not-allowed; } .d:focus-visible { outline: 2px solid #0071BB; outline-offset: 1px; }
    .pie { display: flex; justify-content: space-between; align-items: center; margin-top: .5rem; padding-top: .5rem; border-top: 1px solid #E3E8EF; } .lnk { border: 0; background: none; color: #0071BB; font: inherit; font-weight: 700; font-size: .82rem; cursor: pointer; } small { color: #5B6575; font-size: .76rem; }`];
  }
}
const A = (a) => a < 1024 ? a + " B" : a < 1048576 ? (a / 1024).toFixed(0) + " KB" : (a / 1048576).toFixed(1) + " MB";
class C extends y {
  constructor() {
    super(), this._int = this.attachInternals?.(), this.multiple = !1, this.accept = "", this.maxMb = 10, this.maxArchivos = 10, this.etiqueta = "Arrastre archivos aquí o haga clic para seleccionarlos", this.ayuda = "", this.name = "", this.deshabilitado = !1, this._filas = [], this._sobre = !1;
  }
  static {
    this.formAssociated = !0;
  }
  static {
    this.properties = { multiple: { type: Boolean }, accept: { type: String }, maxMb: { type: Number, attribute: "max-mb" }, maxArchivos: { type: Number, attribute: "max-archivos" }, etiqueta: { type: String }, ayuda: { type: String }, name: { type: String }, deshabilitado: { type: Boolean, reflect: !0 }, _filas: { state: !0 }, _sobre: { state: !0 } };
  }
  get archivos() {
    return this._filas.filter((e) => !e.error).map((e) => e.f);
  }
  _tipoOk(e) {
    return this.accept ? this.accept.split(",").map((t) => t.trim().toLowerCase()).some((t) => t.startsWith(".") ? e.name.toLowerCase().endsWith(t) : t.endsWith("/*") ? e.type.startsWith(t.slice(0, -1)) : e.type === t) : !0;
  }
  _agregar(e) {
    let t = [...e].map((i) => ({ f: i, pct: 0, error: this._tipoOk(i) ? i.size > this.maxMb * 1048576 ? `Supera ${this.maxMb} MB` : void 0 : "Tipo no permitido" }));
    this.multiple || (this._filas = []), this._filas = [...this._filas, ...t].slice(0, this.multiple ? this.maxArchivos : 1), this._notificar();
  }
  _notificar() {
    const e = new FormData();
    this.archivos.forEach((i) => e.append(this.name || "archivos", i)), this._int?.setFormValue(this.name ? e : null);
    const t = this._filas.filter((i) => i.error).map((i) => ({ nombre: i.f.name, motivo: i.error }));
    this.dispatchEvent(new CustomEvent("gob-archivos-cambio", { detail: { archivos: this.archivos, rechazados: t }, bubbles: !0, composed: !0 }));
  }
  quitar(e) {
    this._filas = this._filas.filter((t, i) => i !== e), this._notificar();
  }
  limpiar() {
    this._filas = [], this._notificar();
  }
  progreso(e, t) {
    this._filas = this._filas.map((i) => i.f.name === e ? { ...i, pct: t } : i);
  }
  render() {
    const e = () => this.renderRoot.querySelector("input");
    return o`<div class="zona ${this._sobre ? "sobre" : ""}" tabindex=${this.deshabilitado ? -1 : 0} role="button" aria-label=${this.etiqueta} @click=${() => !this.deshabilitado && e().click()} @keydown=${(t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), e().click());
    }}
        @dragover=${(t) => {
      t.preventDefault(), this._sobre = !0;
    }} @dragleave=${() => this._sobre = !1} @drop=${(t) => {
      t.preventDefault(), this._sobre = !1, !this.deshabilitado && t.dataTransfer && this._agregar(t.dataTransfer.files);
    }}>
      <span class="ic">${h("subir", 24)}</span><strong>${this.etiqueta}</strong><small>${this.ayuda || `${this.accept ? this.accept.replace(/,/g, ", ") + " · " : ""}máx. ${this.maxMb} MB${this.multiple ? " por archivo" : ""}`}</small>
      <input type="file" hidden ?multiple=${this.multiple} accept=${this.accept || l} @change=${(t) => {
      const i = t.target;
      i.files && this._agregar(i.files), i.value = "";
    }}></div>
      ${this._filas.length ? o`<ul class="ls" aria-label="Archivos seleccionados">${this._filas.map((t, i) => o`<li class=${t.error ? "er" : ""}>${h(t.error ? "alerta" : "archivo", 18)}<span class="nb"><b>${t.f.name}</b><small>${t.error ?? A(t.f.size)}</small>${t.pct > 0 && t.pct < 100 && !t.error ? o`<progress max="100" .value=${t.pct}></progress>` : l}</span>
        <button type="button" class="q" aria-label=${"Quitar " + t.f.name} @click=${() => this.quitar(i)}>${h("cerrar", 14)}</button></li>`)}</ul>` : l}`;
  }
  static {
    this.styles = [x, g`
    .zona { display: grid; justify-items: center; gap: .3rem; text-align: center; padding: 1.5rem 1rem; border: 2px dashed #CBD2DC; border-radius: 12px; background: #F8FAFC; cursor: pointer; transition: border-color .15s, background .15s; } .zona:hover, .zona.sobre { border-color: #0071BB; background: #E5F1F9; } .zona:focus-visible { outline: 0; border-color: #0071BB; box-shadow: 0 0 0 3px rgba(0,113,187,.22); }
    :host([deshabilitado]) .zona { opacity: .55; cursor: not-allowed; } .ic { display: grid; place-items: center; width: 3rem; height: 3rem; border-radius: 50%; background: #E5F1F9; color: #0071BB; } strong { font-size: .92rem; } small { color: #5B6575; font-size: .78rem; }
    .ls { list-style: none; margin: .75rem 0 0; padding: 0; display: grid; gap: .5rem; } li { display: flex; align-items: center; gap: .7rem; padding: .6rem .8rem; border: 1px solid #E3E8EF; border-radius: 10px; background: #fff; color: #0071BB; } li.er { border-color: #F7003C; background: #FFF5F7; color: #C4002F; }
    .nb { flex: 1; min-width: 0; display: grid; color: #161A22; } .nb b { font-size: .86rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } li.er small { color: #C4002F; font-weight: 600; } progress { width: 100%; height: .35rem; margin-top: .3rem; accent-color: #0071BB; }
    .q { display: grid; place-items: center; width: 1.8rem; height: 1.8rem; border: 0; border-radius: 6px; background: none; color: #5B6575; cursor: pointer; } .q:hover { background: #F1F4F8; color: #161A22; } .q:focus-visible { outline: 2px solid #0071BB; }`];
  }
}
customElements.get("gob-selector") || customElements.define("gob-selector", D);
customElements.get("gob-fecha") || customElements.define("gob-fecha", S);
customElements.get("gob-archivos") || customElements.define("gob-archivos", C);
export {
  C as GobArchivos,
  S as GobFecha,
  D as GobSelector
};
