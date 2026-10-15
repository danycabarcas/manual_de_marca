import { a as d, i as p, A as a, b as r } from "../chunks/lit-element-B3qO7mJS.js";
import { i as l } from "../chunks/icono-CX7ui34k.js";
const u = { info: "info", exito: "check-circulo", aviso: "alerta", peligro: "error", neutro: "info" }, c = {
  info: ["#00B7D9", "#E6F8FB", "#00566A"],
  exito: ["#69B75E", "#F1F8F0", "#2C5A26"],
  aviso: ["#FEC800", "#FFF8DB", "#6D5600"],
  peligro: ["#F7003C", "#FFE9EE", "#8A0022"],
  neutro: ["#6B7482", "#F1F4F8", "#252B36"]
}, m = d`:host { font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); } svg { display: block; } button { font: inherit; }`;
class y extends p {
  static {
    this.properties = { tipo: { type: String, reflect: !0 }, titulo: { type: String }, cerrable: { type: Boolean }, icono: { type: String }, _oculta: { state: !0 } };
  }
  constructor() {
    super(), this.tipo = "info", this.titulo = "", this.cerrable = !1, this.icono = "", this._oculta = !1;
  }
  cerrar() {
    this._oculta = !0, this.dispatchEvent(new CustomEvent("gob-alerta-cerrar", { bubbles: !0, composed: !0 }));
  }
  render() {
    if (this._oculta) return a;
    const t = c[this.tipo] ? this.tipo : "info", [e, o, s] = c[t];
    return r`<div class="a" part="alerta" role=${t === "peligro" || t === "aviso" ? "alert" : "status"} style="--ac:${e};--bg:${o};--tx:${s}">
      <span class="i">${l(this.icono || u[t], 20)}</span>
      <div class="b">${this.titulo ? r`<strong>${this.titulo}</strong>` : a}<slot></slot></div>
      <slot name="acciones"></slot>
      ${this.cerrable ? r`<button class="x" type="button" aria-label="Cerrar alerta" @click=${() => this.cerrar()}>${l("cerrar", 16)}</button>` : a}</div>`;
  }
  static {
    this.styles = [m, d`
    :host { display: block; }
    .a { display: flex; gap: .75rem; align-items: flex-start; padding: .8rem 1rem; border-radius: 8px; border: 1px solid color-mix(in srgb, var(--ac) 28%, #fff); border-left: 4px solid var(--ac); background: var(--bg); color: #252B36; font-size: .9rem; line-height: 1.5; }
    .i { color: var(--tx); flex: none; margin-top: 1px; } .b { flex: 1; min-width: 0; } strong { display: block; color: var(--tx); font-weight: 700; margin-bottom: .1rem; }
    .x { flex: none; border: 0; background: none; color: var(--tx); cursor: pointer; padding: 2px; border-radius: 4px; line-height: 0; } .x:hover { background: color-mix(in srgb, var(--ac) 18%, transparent); } .x:focus-visible { outline: 2px solid var(--tx); outline-offset: 1px; }`];
  }
}
let f = 0;
class _ extends p {
  constructor() {
    super(), this._motivo = "api", this._bloq = !1, this.abierto = !1, this.titulo = "", this.tam = "md", this.tipo = "normal", this.cerrable = !0, this.estatico = !1, this.icono = "";
  }
  static {
    this.properties = { abierto: { type: Boolean, reflect: !0 }, titulo: { type: String }, tam: { type: String }, tipo: { type: String }, cerrable: { type: Boolean }, estatico: { type: Boolean }, icono: { type: String } };
  }
  abrir() {
    this.abierto = !0;
  }
  cerrar(t = "api") {
    this._motivo = t, this.abierto = !1;
  }
  get _dlg() {
    return this.renderRoot.querySelector("dialog");
  }
  updated(t) {
    if (!t.has("abierto")) return;
    const e = this._dlg;
    e && (this.abierto && !e.open ? (e.showModal(), this._bloquear(!0), this.dispatchEvent(new CustomEvent("gob-modal-abrir", { bubbles: !0, composed: !0 }))) : !this.abierto && e.open && e.close());
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._bloquear(!1);
  }
  _bloquear(t) {
    t !== this._bloq && (this._bloq = t, f += t ? 1 : -1, document.documentElement.style.overflow = f > 0 ? "hidden" : "");
  }
  _alCerrar() {
    this.abierto = !1, this._bloquear(!1), this.dispatchEvent(new CustomEvent("gob-modal-cerrar", { detail: { motivo: this._motivo }, bubbles: !0, composed: !0 })), this._motivo = "api";
  }
  _cancel(t) {
    if (this.estatico) {
      t.preventDefault();
      return;
    }
    this._motivo = "esc";
  }
  _fondo(t) {
    t.target === this._dlg && !this.estatico && this.cerrar("fondo");
  }
  render() {
    const t = this.tipo === "normal" || !c[this.tipo] ? null : this.tipo, [e, , o] = t ? c[t] : ["#0071BB", "", "#0071BB"];
    return r`<dialog part="dialogo" class=${this.tam} aria-labelledby="t" @close=${this._alCerrar} @cancel=${this._cancel} @click=${this._fondo} style="--ac:${e};--tx:${o}">
      <div class="c" part="contenido">
        <header class="h">${t || this.icono ? r`<span class="i">${l(this.icono || u[t], 22)}</span>` : a}<h2 id="t">${this.titulo}</h2>
          ${this.cerrable ? r`<button class="x" type="button" aria-label="Cerrar" @click=${() => this.cerrar("boton")}>${l("cerrar", 18)}</button>` : a}</header>
        <div class="b" part="cuerpo"><slot></slot></div>
        <footer class="f" part="pie"><slot name="pie"></slot></footer></div></dialog>`;
  }
  static {
    this.styles = [m, d`
    dialog { padding: 0; border: 0; border-radius: 14px; width: min(92vw, 32rem); max-height: min(90vh, 52rem); color: #252B36; background: #fff; box-shadow: 0 24px 64px rgba(8,26,44,.35); overflow: hidden; }
    dialog.sm { width: min(92vw, 24rem); } dialog.lg { width: min(94vw, 48rem); } dialog.xl { width: min(96vw, 72rem); } dialog.pantalla { width: 100vw; height: 100vh; max-width: none; max-height: none; border-radius: 0; }
    dialog[open] { animation: ent .22s cubic-bezier(.2,.8,.2,1); } dialog::backdrop { background: rgba(8,26,44,.55); backdrop-filter: blur(3px); animation: fon .22s ease; }
    @keyframes ent { from { opacity: 0; transform: translateY(12px) scale(.98); } } @keyframes fon { from { opacity: 0; } }
    .c { display: flex; flex-direction: column; max-height: inherit; height: 100%; } .h { display: flex; align-items: center; gap: .6rem; padding: 1rem 1.25rem; border-bottom: 1px solid #E3E8EF; border-top: 4px solid var(--ac); }
    h2 { margin: 0; flex: 1; font-size: 1.1rem; font-weight: 700; color: #161A22; } .i { color: var(--tx); line-height: 0; }
    .x { border: 0; background: none; color: #4F5866; cursor: pointer; padding: 6px; border-radius: 6px; line-height: 0; } .x:hover { background: #F1F4F8; } .x:focus-visible { outline: 2px solid #0071BB; }
    .b { padding: 1.25rem; overflow: auto; flex: 1; line-height: 1.6; font-size: .95rem; } .f { display: flex; gap: .5rem; justify-content: flex-end; flex-wrap: wrap; padding: .85rem 1.25rem; background: #F8FAFC; border-top: 1px solid #E3E8EF; } .f:not(:has(::slotted(*))) { display: none; }
    @media (prefers-reduced-motion: reduce) { dialog[open], dialog::backdrop { animation: none; } }`];
  }
}
let $ = 0;
class w extends p {
  constructor() {
    super(), this._timers = /* @__PURE__ */ new Map(), this.posicion = "abajo-derecha", this.max = 4, this._lista = [];
  }
  static {
    this.properties = { posicion: { type: String, reflect: !0 }, max: { type: Number }, _lista: { state: !0 } };
  }
  agregar(t) {
    const e = { id: ++$, tipo: t.tipo ?? "info", titulo: t.titulo ?? "", mensaje: t.mensaje ?? "", duracion: t.duracion ?? 5e3, accion: t.accion };
    return this._lista = [...this._lista, e].slice(-this.max), e.duracion > 0 && this._programar(e), e.id;
  }
  quitar(t) {
    clearTimeout(this._timers.get(t)), this._timers.delete(t), this._lista = this._lista.filter((e) => e.id !== t);
  }
  _programar(t) {
    clearTimeout(this._timers.get(t.id)), this._timers.set(t.id, window.setTimeout(() => this.quitar(t.id), t.duracion));
  }
  _pausa(t, e) {
    t.duracion <= 0 || (e ? clearTimeout(this._timers.get(t.id)) : this._programar(t));
  }
  render() {
    return r`<div class="l" aria-live="polite" aria-relevant="additions">${this._lista.map((t) => {
      const [e, o, s] = c[t.tipo] ?? c.info;
      return r`<div class="t" role=${t.tipo === "peligro" ? "alert" : "status"} style="--ac:${e};--bg:${o};--tx:${s}" @pointerenter=${() => this._pausa(t, !0)} @pointerleave=${() => this._pausa(t, !1)} @focusin=${() => this._pausa(t, !0)} @focusout=${() => this._pausa(t, !1)}>
        <span class="i">${l(u[t.tipo], 20)}</span><div class="b">${t.titulo ? r`<strong>${t.titulo}</strong>` : a}${t.mensaje ? r`<span>${t.mensaje}</span>` : a}
          ${t.accion ? r`<button class="a" type="button" @click=${() => {
        t.accion.alClic(), this.quitar(t.id);
      }}>${t.accion.etiqueta}</button>` : a}</div>
        <button class="x" type="button" aria-label="Cerrar notificación" @click=${() => this.quitar(t.id)}>${l("cerrar", 16)}</button>
        ${t.duracion > 0 ? r`<i class="p" style="animation-duration:${t.duracion}ms"></i>` : a}</div>`;
    })}</div>`;
  }
  static {
    this.styles = [m, d`
    :host { position: fixed; z-index: 2147483000; display: block; pointer-events: none; padding: 1rem; max-width: 100vw; }
    :host([posicion='abajo-derecha']) { right: 0; bottom: 0; } :host([posicion='abajo-izquierda']) { left: 0; bottom: 0; } :host([posicion='arriba-derecha']) { right: 0; top: 0; } :host([posicion='arriba-izquierda']) { left: 0; top: 0; } :host([posicion='arriba-centro']) { left: 50%; top: 0; transform: translateX(-50%); }
    .l { display: grid; gap: .6rem; width: min(24rem, calc(100vw - 2rem)); } .t { position: relative; pointer-events: auto; overflow: hidden; display: flex; gap: .7rem; align-items: flex-start; padding: .8rem .9rem; border-radius: 10px; background: #fff; border: 1px solid #E3E8EF; border-left: 4px solid var(--ac); box-shadow: 0 12px 28px rgba(8,26,44,.18); font-size: .88rem; color: #252B36; animation: ent .25s cubic-bezier(.2,.8,.2,1); }
    .i { color: var(--tx); line-height: 0; margin-top: 1px; } .b { flex: 1; min-width: 0; display: grid; gap: .15rem; } strong { color: #161A22; font-weight: 700; }
    .a { justify-self: start; margin-top: .3rem; border: 1px solid var(--tx); background: none; color: var(--tx); border-radius: 6px; padding: .2rem .6rem; font-weight: 600; font-size: .8rem; cursor: pointer; } .a:hover { background: var(--bg); }
    .x { border: 0; background: none; color: #4F5866; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0; } .x:hover { background: #F1F4F8; } .x:focus-visible, .a:focus-visible { outline: 2px solid #0071BB; outline-offset: 1px; }
    .p { position: absolute; left: 0; bottom: 0; height: 3px; width: 100%; background: var(--ac); transform-origin: left; animation: pr linear forwards; } .t:hover .p, .t:focus-within .p { animation-play-state: paused; }
    @keyframes ent { from { opacity: 0; transform: translateX(16px); } } @keyframes pr { to { transform: scaleX(0); } } @media (prefers-reduced-motion: reduce) { .t { animation: none; } .p { display: none; } }`];
  }
}
function F(i, t) {
  const e = typeof i == "string" ? { mensaje: i, tipo: t } : i;
  let o = document.querySelector("gob-toasts");
  return o || (o = document.createElement("gob-toasts"), document.body.appendChild(o)), o.agregar(e);
}
function C(i) {
  const t = typeof i == "string" ? { mensaje: i } : i;
  return new Promise((e) => {
    const o = document.createElement("gob-modal");
    o.titulo = t.titulo ?? "Confirmar", o.tam = "sm", o.tipo = t.tipo ?? "normal", o.estatico = !1;
    const s = document.createElement("p");
    s.style.margin = "0", s.textContent = t.mensaje ?? "¿Desea continuar?", o.appendChild(s);
    const h = (g, x, v) => {
      const n = document.createElement("button");
      return n.type = "button", n.className = x, n.textContent = g, n.slot = "pie", n.addEventListener("click", () => {
        b = v, o.cerrar("boton");
      }), n;
    };
    let b = !1;
    o.append(h(t.textoCancelar ?? "Cancelar", "mg-btn mg-btn--secondary", !1), h(t.textoConfirmar ?? "Aceptar", t.tipo === "peligro" ? "mg-btn mg-btn--danger" : "mg-btn", !0)), o.addEventListener("gob-modal-cerrar", () => {
      o.remove(), e(b);
    }), document.body.appendChild(o), o.updateComplete.then(() => o.abrir());
  });
}
for (const [i, t] of [["gob-alerta", y], ["gob-modal", _], ["gob-toasts", w]]) customElements.get(i) || customElements.define(i, t);
export {
  y as GobAlerta,
  _ as GobModal,
  w as GobToasts,
  C as confirmar,
  F as toast
};
