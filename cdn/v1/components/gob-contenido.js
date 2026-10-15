import { i as p, a as u, A as l, b as o } from "../chunks/lit-element-CZvHeOsZ.js";
import { i as h } from "../chunks/icono-x0IYmMl5.js";
const g = { fromAttribute: (d) => {
  try {
    return d ? JSON.parse(d) : [];
  } catch {
    return [];
  }
} }, f = p`:host { display: block; font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); color: var(--gob-color-texto, #161A22); } svg { display: block; } *, *::before, *::after { box-sizing: border-box; }`, b = (d, t, e) => d.dispatchEvent(new CustomEvent(t, { detail: e, bubbles: !0, composed: !0 })), $ = [["#0071BB", "#E5F1F9"], ["#07708A", "#E3F6FA"], ["#5618BA", "#EFE8FB"], ["#2E7D32", "#E8F5E9"], ["#8A6A00", "#FFF6D6"], ["#C4002F", "#FFE8EE"], ["#0B2239", "#E3E8EF"]];
class _ extends u {
  static {
    this.properties = { nombre: { type: String }, src: { type: String }, tam: { type: Number }, estado: { type: String, reflect: !0 }, _err: { state: !0 } };
  }
  constructor() {
    super(), this.nombre = "", this.src = "", this.tam = 40, this.estado = "", this._err = !1;
  }
  render() {
    const t = this.nombre.trim().split(/\s+/).filter(Boolean), e = ((t[0]?.[0] ?? "") + (t.length > 1 ? t.at(-1)[0] : "")).toUpperCase() || "?";
    let s = 0;
    for (const r of this.nombre) s = s * 31 + r.charCodeAt(0) >>> 0;
    const [i, a] = $[s % $.length];
    return o`<span class="a" style="width:${this.tam}px;height:${this.tam}px;font-size:${this.tam * 0.38}px;color:${i};background:${a}" role="img" aria-label=${this.nombre || "Usuario"}>${this.src && !this._err ? o`<img src=${this.src} alt="" @error=${() => this._err = !0}>` : e}${this.estado ? o`<i class="e" title=${this.estado.replace("-", " ")}></i>` : l}</span>`;
  }
  static {
    this.styles = [f, p`:host { display: inline-block; vertical-align: middle; } .a { position: relative; display: inline-grid; place-items: center; border-radius: 50%; font-weight: 700; user-select: none; } img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
    .e { position: absolute; right: 0; bottom: 0; width: 28%; height: 28%; min-width: 8px; min-height: 8px; border-radius: 50%; border: 2px solid #fff; background: #9AA4B2; } :host([estado='en-linea']) .e { background: #2E7D32; } :host([estado='ocupado']) .e { background: #F7003C; } :host([estado='ausente']) .e { background: #FEC800; }`];
  }
}
class y extends u {
  static {
    this.properties = { nodos: { converter: g }, seleccionado: { type: String, reflect: !0 }, abierto: { type: Boolean }, etiqueta: { type: String }, _exp: { state: !0 } };
  }
  constructor() {
    super(), this.nodos = [], this.seleccionado = "", this.abierto = !1, this.etiqueta = "Árbol", this._exp = /* @__PURE__ */ new Set();
  }
  willUpdate(t) {
    if (t.has("nodos") && this.abierto) {
      const e = /* @__PURE__ */ new Set(), s = (i) => i.forEach((a) => {
        a.hijos?.length && (e.add(a.id), s(a.hijos));
      });
      s(this.nodos), this._exp = e;
    }
  }
  expandir(t, e) {
    const s = new Set(this._exp);
    e ?? !s.has(t) ? s.add(t) : s.delete(t), this._exp = s;
  }
  _visibles(t = this.nodos, e = 1, s = []) {
    for (const i of t)
      s.push({ n: i, nivel: e }), i.hijos?.length && this._exp.has(i.id) && this._visibles(i.hijos, e + 1, s);
    return s;
  }
  _tecla(t, e) {
    const s = this._visibles(), i = s.findIndex((r) => r.n === e), a = (r) => {
      const n = s[r];
      n && this.renderRoot.querySelector(`[data-id="${CSS.escape(n.n.id)}"]`)?.focus();
    };
    if (t.key === "ArrowDown")
      t.preventDefault(), a(i + 1);
    else if (t.key === "ArrowUp")
      t.preventDefault(), a(i - 1);
    else if (t.key === "Home")
      t.preventDefault(), a(0);
    else if (t.key === "End")
      t.preventDefault(), a(s.length - 1);
    else if (t.key === "ArrowRight")
      t.preventDefault(), e.hijos?.length && (this._exp.has(e.id) ? a(i + 1) : this.expandir(e.id, !0));
    else if (t.key === "ArrowLeft")
      if (t.preventDefault(), e.hijos?.length && this._exp.has(e.id)) this.expandir(e.id, !1);
      else {
        const r = s[i].nivel;
        for (let n = i - 1; n >= 0; n--) if (s[n].nivel < r) {
          a(n);
          break;
        }
      }
    else (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this._sel(e));
  }
  _sel(t) {
    t.deshabilitado || (this.seleccionado = t.id, b(this, "gob-arbol-seleccion", { id: t.id, nodo: t }), t.hijos?.length && this.expandir(t.id));
  }
  _nodo(t, e, s) {
    const i = !!t.hijos?.length, a = this._exp.has(t.id);
    return o`<li role="treeitem" aria-level=${e} aria-expanded=${i ? a : l} aria-selected=${this.seleccionado === t.id} aria-disabled=${t.deshabilitado ? "true" : l}>
      <div class="f ${this.seleccionado === t.id ? "on" : ""}" data-id=${t.id} tabindex=${this.seleccionado === t.id || !this.seleccionado && s ? 0 : -1} style="padding-left:${0.4 + (e - 1) * 1.25}rem" @click=${() => this._sel(t)} @keydown=${(r) => this._tecla(r, t)}>
        <span class="t ${i ? "" : "v"}" @click=${(r) => {
      r.stopPropagation(), this.expandir(t.id);
    }}>${i ? h(a ? "chevron-abajo" : "chevron-derecha", 14) : l}</span>${h(t.icono ?? (i ? "carpeta" : "archivo"), 16)}<span class="l">${t.etiqueta}</span></div>
      ${i && a ? o`<ul role="group">${t.hijos.map((r) => this._nodo(r, e + 1, !1))}</ul>` : l}</li>`;
  }
  render() {
    return o`<ul role="tree" aria-label=${this.etiqueta} class="r">${this.nodos.map((t, e) => this._nodo(t, 1, e === 0))}</ul>`;
  }
  static {
    this.styles = [f, p`ul { list-style: none; margin: 0; padding: 0; } .f { display: flex; align-items: center; gap: .45rem; padding: .4rem .5rem; border-radius: 8px; cursor: pointer; font-size: .9rem; color: #3A424F; } .f:hover { background: #F1F4F8; } .f.on { background: #E5F1F9; color: #004F82; font-weight: 600; } .f:focus-visible { outline: 2px solid #0071BB; outline-offset: -2px; }
    .t { display: grid; place-items: center; width: 1.1rem; height: 1.1rem; color: #5B6575; flex: none; } .t.v { pointer-events: none; } .l { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }`];
  }
}
const k = { alta: "#F7003C", media: "#FEC800", baja: "#69B75E" };
class w extends u {
  static {
    this.properties = { columnas: { converter: g }, tarjetas: { converter: g }, _arr: { state: !0 }, _sobre: { state: !0 }, _msg: { state: !0 } };
  }
  constructor() {
    super(), this.columnas = [], this.tarjetas = [], this._arr = "", this._sobre = "", this._msg = "";
  }
  mover(t, e, s) {
    const i = this.tarjetas.find((c) => c.id === t);
    if (!i || !this.columnas.some((c) => c.id === e)) return;
    const a = i.columna, r = this.tarjetas.filter((c) => c.id !== t), n = { ...i, columna: e }, v = s ? r.findIndex((c) => c.id === s) : -1;
    v >= 0 ? r.splice(v, 0, n) : r.push(n), this.tarjetas = r;
    const x = this.columnas.find((c) => c.id === e)?.titulo ?? e;
    this._msg = `«${i.titulo}» movida a ${x}`, b(this, "gob-kanban-mover", { id: t, desde: a, hasta: e, tarjetas: this.tarjetas });
  }
  _paso(t, e) {
    const s = this.columnas.findIndex((i) => i.id === t.columna) + e;
    s < 0 || s >= this.columnas.length || (this.mover(t.id, this.columnas[s].id), this.updateComplete.then(() => this.renderRoot.querySelector(`[data-t="${CSS.escape(t.id)}"]`)?.focus()));
  }
  render() {
    return o`<div class="tb" part="tablero">${this.columnas.map((t) => {
      const e = this.tarjetas.filter((i) => i.columna === t.id), s = t.limite != null && e.length > t.limite;
      return o`<section class="c ${this._sobre === t.id ? "sobre" : ""}" aria-label=${t.titulo + ", " + e.length + " tarjetas"} @dragover=${(i) => {
        i.preventDefault(), this._sobre = t.id;
      }} @dragleave=${() => this._sobre = ""} @drop=${(i) => {
        i.preventDefault(), this._sobre = "", this._arr && this.mover(this._arr, t.id), this._arr = "";
      }}>
        <header><i style="background:${t.color ?? "#0071BB"}"></i><h3>${t.titulo}</h3><span class="n ${s ? "lim" : ""}">${e.length}${t.limite != null ? "/" + t.limite : ""}</span></header>
        <div class="ls">${e.map((i) => o`<article class="k ${this._arr === i.id ? "arr" : ""}" draggable="true" tabindex="0" data-t=${i.id} @dragstart=${(a) => {
        this._arr = i.id, a.dataTransfer?.setData("text/plain", i.id);
      }} @dragend=${() => {
        this._arr = "", this._sobre = "";
      }}
            @drop=${(a) => {
        a.preventDefault(), a.stopPropagation(), this._sobre = "", this._arr && this._arr !== i.id && this.mover(this._arr, t.id, i.id), this._arr = "";
      }} @keydown=${(a) => {
        a.altKey && a.key === "ArrowRight" ? (a.preventDefault(), this._paso(i, 1)) : a.altKey && a.key === "ArrowLeft" && (a.preventDefault(), this._paso(i, -1));
      }}
            @click=${() => b(this, "gob-kanban-clic", { tarjeta: i })}>${i.prioridad ? o`<span class="p" style="background:${k[i.prioridad]}" title=${"Prioridad " + i.prioridad}></span>` : l}
            <strong>${i.titulo}</strong>${i.descripcion ? o`<p>${i.descripcion}</p>` : l}${i.etiquetas?.length ? o`<div class="et">${i.etiquetas.map((a) => o`<span>${a}</span>`)}</div>` : l}
            <footer>${i.fecha ? o`<small>${h("calendario", 12)}${i.fecha}</small>` : o`<span></span>`}${i.asignado ? o`<gob-avatar-mini .n=${i.asignado}></gob-avatar-mini>` : l}
              <span class="mv"><button type="button" aria-label="Mover a la columna anterior" ?disabled=${this.columnas[0]?.id === t.id} @click=${(a) => {
        a.stopPropagation(), this._paso(i, -1);
      }}>${h("chevron-izquierda", 14)}</button><button type="button" aria-label="Mover a la columna siguiente" ?disabled=${this.columnas.at(-1)?.id === t.id} @click=${(a) => {
        a.stopPropagation(), this._paso(i, 1);
      }}>${h("chevron-derecha", 14)}</button></span></footer></article>`)}
          ${e.length ? l : o`<p class="vc">Sin tarjetas</p>`}</div></section>`;
    })}</div><div class="sr" role="status" aria-live="polite">${this._msg}</div>`;
  }
  static {
    this.styles = [f, p`.tb { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(16rem, 1fr); gap: .9rem; overflow-x: auto; padding-bottom: .5rem; align-items: start; } .c { background: #F1F4F8; border: 2px solid transparent; border-radius: 14px; padding: .7rem; min-height: 8rem; transition: border-color .15s, background .15s; } .c.sobre { border-color: #0071BB; background: #E5F1F9; }
    header { display: flex; align-items: center; gap: .55rem; margin-bottom: .6rem; } header i { width: .65rem; height: .65rem; border-radius: 50%; } h3 { margin: 0; font-size: .85rem; flex: 1; } .n { font-size: .74rem; font-weight: 700; background: #fff; border-radius: 99px; padding: .1rem .55rem; color: #3A424F; } .n.lim { background: #FFE8EE; color: #C4002F; }
    .ls { display: grid; gap: .55rem; } .k { position: relative; background: #fff; border: 1px solid #E3E8EF; border-radius: 10px; padding: .75rem .8rem .6rem 1rem; cursor: grab; box-shadow: 0 1px 2px rgba(8,26,44,.06); } .k:hover { border-color: #9AA4B2; } .k:focus-visible { outline: 2px solid #0071BB; outline-offset: 2px; } .k.arr { opacity: .45; }
    .p { position: absolute; left: 0; top: .6rem; bottom: .6rem; width: 4px; border-radius: 0 4px 4px 0; } strong { font-size: .86rem; display: block; } .k p { margin: .25rem 0 0; font-size: .8rem; color: #4F5866; line-height: 1.4; } .et { display: flex; flex-wrap: wrap; gap: .3rem; margin-top: .5rem; } .et span { font-size: .68rem; font-weight: 700; background: #E5F1F9; color: #004F82; border-radius: 6px; padding: .1rem .45rem; }
    footer { display: flex; align-items: center; gap: .5rem; margin-top: .55rem; } small { display: inline-flex; align-items: center; gap: .25rem; font-size: .72rem; color: #5B6575; flex: 1; } .mv { margin-left: auto; display: inline-flex; opacity: 0; transition: opacity .15s; } .k:hover .mv, .k:focus-within .mv { opacity: 1; } .mv button { display: grid; place-items: center; width: 1.6rem; height: 1.6rem; border: 0; border-radius: 6px; background: none; color: #5B6575; cursor: pointer; } .mv button:hover:not(:disabled) { background: #F1F4F8; color: #161A22; } .mv button:disabled { opacity: .3; cursor: default; }
    .vc { text-align: center; color: #5B6575; font-size: .8rem; padding: 1rem 0; margin: 0; } .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }`];
  }
}
class F extends u {
  static {
    this.properties = { n: { type: String } };
  }
  constructor() {
    super(), this.n = "";
  }
  render() {
    const t = (this.n || "").trim().split(/\s+/), e = ((t[0]?.[0] ?? "") + (t.length > 1 ? t.at(-1)[0] : "")).toUpperCase();
    return o`<span title=${this.n} role="img" aria-label=${this.n}>${e}</span>`;
  }
  static {
    this.styles = p`:host { display: inline-block; } span { display: grid; place-items: center; width: 1.7rem; height: 1.7rem; border-radius: 50%; background: #E5F1F9; color: #004F82; font: 700 .68rem 'Montserrat', system-ui, sans-serif; }`;
  }
}
class E extends u {
  constructor() {
    super(), this._fuera = (t) => {
      this._a && !t.composedPath().includes(this) && (this._a = !1);
    }, this.items = [], this.contextual = !1, this.alinear = "inicio", this._a = !1, this._i = 0, this._pos = null;
  }
  static {
    this.properties = { items: { converter: g }, contextual: { type: Boolean }, alinear: { type: String }, _a: { state: !0 }, _i: { state: !0 }, _pos: { state: !0 } };
  }
  get _ops() {
    return this.items.filter((t) => !t.separador);
  }
  abrir(t) {
    this._pos = t ?? null, this._a = !0, this._i = this.items.findIndex((e) => !e.separador && !e.deshabilitado), this.updateComplete.then(() => this.renderRoot.querySelector(".m")?.focus());
  }
  cerrar(t = !0) {
    this._a = !1, t && this.querySelector("button, a, [tabindex]")?.focus();
  }
  _tecla(t) {
    const e = this.items.map((i, a) => i.separador || i.deshabilitado ? -1 : a).filter((i) => i >= 0), s = e.indexOf(this._i);
    t.key === "ArrowDown" ? (t.preventDefault(), this._i = e[(s + 1) % e.length]) : t.key === "ArrowUp" ? (t.preventDefault(), this._i = e[(s - 1 + e.length) % e.length]) : t.key === "Home" ? (t.preventDefault(), this._i = e[0]) : t.key === "End" ? (t.preventDefault(), this._i = e.at(-1)) : t.key === "Escape" ? (t.preventDefault(), this.cerrar()) : t.key === "Tab" ? this.cerrar(!1) : (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this._elegir(this.items[this._i]));
  }
  _elegir(t) {
    !t || t.deshabilitado || (this.cerrar(), b(this, "gob-menu-accion", { id: t.id, item: t }));
  }
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("pointerdown", this._fuera, !0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), document.removeEventListener("pointerdown", this._fuera, !0);
  }
  render() {
    const t = this._pos ? `position:fixed;left:${this._pos[0]}px;top:${this._pos[1]}px;` : this.alinear === "fin" ? "right:0;" : "left:0;";
    return o`<div class="w" @click=${() => {
      this.contextual || (this._a ? this.cerrar(!1) : this.abrir());
    }} @contextmenu=${(e) => {
      this.contextual && (e.preventDefault(), this.abrir([e.clientX, e.clientY]));
    }} @keydown=${(e) => {
      !this.contextual && e.key === "ArrowDown" && !this._a && (e.preventDefault(), this.abrir());
    }}><slot aria-haspopup="menu"></slot>
      ${this._a ? o`<div class="m" role="menu" tabindex="-1" style=${t} aria-activedescendant=${"mi" + this._i} @keydown=${this._tecla}>${this.items.map((e, s) => e.separador ? o`<hr role="separator">` : o`<div id=${"mi" + s} role="menuitem" class="i ${s === this._i ? "on" : ""} ${e.tipo === "peligro" ? "pel" : ""}" aria-disabled=${e.deshabilitado ? "true" : l} @mouseenter=${() => this._i = s} @click=${(i) => {
      i.stopPropagation(), this._elegir(e);
    }}>${h(e.icono, 16)}<span>${e.etiqueta}</span></div>`)}</div>` : l}</div>`;
  }
  static {
    this.styles = [f, p`:host { display: inline-block; } .w { position: relative; display: inline-block; } .m { position: absolute; z-index: 1000; top: 100%; margin-top: 4px; min-width: 12rem; padding: .35rem; background: #fff; border: 1px solid #E3E8EF; border-radius: 12px; box-shadow: 0 16px 40px rgba(8,26,44,.18); outline: 0; }
    .i { display: flex; align-items: center; gap: .6rem; padding: .5rem .65rem; border-radius: 8px; font-size: .88rem; cursor: pointer; color: #161A22; white-space: nowrap; } .i.on { background: #F1F4F8; } .i.pel { color: #C4002F; } .i.pel.on { background: #FFE8EE; } .i[aria-disabled='true'] { opacity: .4; cursor: not-allowed; } hr { border: 0; border-top: 1px solid #E3E8EF; margin: .3rem 0; }`];
  }
}
class A extends u {
  constructor() {
    super(), this._id = "tt" + Math.random().toString(36).slice(2, 7), this.texto = "", this.posicion = "arriba", this._v = !1;
  }
  static {
    this.properties = { texto: { type: String }, posicion: { type: String, reflect: !0 }, _v: { state: !0 } };
  }
  _desc() {
    const t = this.firstElementChild;
    t && this.texto && !t.hasAttribute("aria-description") && t.setAttribute("aria-description", this.texto);
  }
  updated() {
    this._desc();
  }
  render() {
    return o`<span class="w" @mouseenter=${() => this._v = !0} @mouseleave=${() => this._v = !1} @focusin=${() => this._v = !0} @focusout=${() => this._v = !1} @keydown=${(t) => {
      t.key === "Escape" && (this._v = !1);
    }}><slot @slotchange=${() => this._desc()}></slot>${this._v && this.texto ? o`<span class="t" role="tooltip" id=${this._id}>${this.texto}</span>` : l}</span>`;
  }
  static {
    this.styles = [f, p`:host { display: inline-block; } .w { position: relative; display: inline-block; } .t { position: absolute; z-index: 1000; left: 50%; bottom: calc(100% + 8px); transform: translateX(-50%); background: #081A2C; color: #fff; font-size: .76rem; font-weight: 500; line-height: 1.35; padding: .4rem .65rem; border-radius: 8px; max-width: 16rem; width: max-content; pointer-events: none; box-shadow: 0 6px 18px rgba(8,26,44,.3); }
    :host([posicion='abajo']) .t { bottom: auto; top: calc(100% + 8px); } :host([posicion='izquierda']) .t { left: auto; right: calc(100% + 8px); bottom: 50%; transform: translateY(50%); } :host([posicion='derecha']) .t { left: calc(100% + 8px); bottom: 50%; transform: translateY(50%); }`];
  }
}
class B extends u {
  static {
    this.properties = { total: { type: Number }, pagina: { type: Number, reflect: !0 }, tamano: { type: Number }, opciones: { converter: g }, resumen: { type: Boolean } };
  }
  constructor() {
    super(), this.total = 0, this.pagina = 1, this.tamano = 10, this.opciones = [10, 25, 50], this.resumen = !0;
  }
  get _n() {
    return Math.max(1, Math.ceil(this.total / this.tamano));
  }
  _ir(t) {
    t = Math.max(1, Math.min(this._n, t)), t !== this.pagina && (this.pagina = t, b(this, "gob-pagina-cambio", { pagina: t, tamano: this.tamano, desde: (t - 1) * this.tamano, hasta: Math.min(this.total, t * this.tamano) }));
  }
  _nums() {
    const t = this._n, e = this.pagina, s = /* @__PURE__ */ new Set([1, t, e - 1, e, e + 1]);
    e <= 3 && [2, 3, 4].forEach((r) => s.add(r)), e >= t - 2 && [t - 1, t - 2, t - 3].forEach((r) => s.add(r));
    const i = [...s].filter((r) => r >= 1 && r <= t).sort((r, n) => r - n), a = [];
    return i.forEach((r, n) => {
      n && r - i[n - 1] > 1 && a.push("…"), a.push(r);
    }), a;
  }
  render() {
    const t = this.total ? (this.pagina - 1) * this.tamano + 1 : 0, e = Math.min(this.total, this.pagina * this.tamano);
    return o`<nav aria-label="Paginación">${this.resumen ? o`<span class="r">${t}–${e} de ${this.total.toLocaleString("es-CO")}</span>` : l}
      <select aria-label="Filas por página" @change=${(s) => {
      this.tamano = +s.target.value, this.pagina = 1, b(this, "gob-pagina-cambio", { pagina: 1, tamano: this.tamano, desde: 0, hasta: Math.min(this.total, this.tamano) });
    }}>${this.opciones.map((s) => o`<option value=${s} ?selected=${s === this.tamano}>${s} / pág.</option>`)}</select>
      <span class="b"><button type="button" aria-label="Anterior" ?disabled=${this.pagina <= 1} @click=${() => this._ir(this.pagina - 1)}>${h("chevron-izquierda", 16)}</button>${this._nums().map((s) => s === "…" ? o`<span class="e">…</span>` : o`<button type="button" class=${s === this.pagina ? "on" : ""} aria-current=${s === this.pagina ? "page" : l} aria-label=${"Página " + s} @click=${() => this._ir(s)}>${s}</button>`)}<button type="button" aria-label="Siguiente" ?disabled=${this.pagina >= this._n} @click=${() => this._ir(this.pagina + 1)}>${h("chevron-derecha", 16)}</button></span></nav>`;
  }
  static {
    this.styles = [f, p`nav { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; justify-content: space-between; } .r { font-size: .82rem; color: #4F5866; } .b { display: inline-flex; gap: .25rem; } .b button { display: grid; place-items: center; min-width: 2.1rem; height: 2.1rem; padding: 0 .4rem; border: 1px solid transparent; border-radius: 8px; background: none; font: 600 .84rem 'Montserrat', system-ui, sans-serif; color: #3A424F; cursor: pointer; } .b button:hover:not(:disabled):not(.on) { background: #F1F4F8; } .b button.on { background: #0071BB; color: #fff; } .b button:disabled { opacity: .35; cursor: default; } .b button:focus-visible { outline: 2px solid #0071BB; outline-offset: 1px; } .e { display: grid; place-items: center; min-width: 1.5rem; color: #5B6575; }
    select { font: inherit; font-size: .82rem; border: 1px solid #CBD2DC; border-radius: 8px; padding: .4rem .6rem; background: #fff; color: #161A22; }`];
  }
}
const m = (d, t) => {
  customElements.get(d) || customElements.define(d, t);
};
m("gob-avatar", _);
m("gob-arbol", y);
m("gob-kanban", w);
m("gob-avatar-mini", F);
m("gob-menu", E);
m("gob-tooltip", A);
m("gob-paginador", B);
export {
  y as GobArbol,
  _ as GobAvatar,
  F as GobAvatarMini,
  w as GobKanban,
  E as GobMenu,
  B as GobPaginador,
  A as GobTooltip
};
