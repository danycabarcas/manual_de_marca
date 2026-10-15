import { a as l, A as c, b as a, i as p } from "../chunks/lit-element-CZvHeOsZ.js";
import { i as m } from "../chunks/icono-x0IYmMl5.js";
const b = { fromAttribute: (s) => {
  try {
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
} };
class h extends l {
  static {
    this.properties = { items: { converter: b }, activa: { type: String, reflect: !0 }, variante: { type: String, reflect: !0 }, etiqueta: { type: String } };
  }
  constructor() {
    super(), this.items = [], this.activa = "", this.variante = "linea", this.etiqueta = "Secciones";
  }
  get _act() {
    return this.activa && this.items.some((t) => t.id === this.activa) ? this.activa : this.items.find((t) => !t.deshabilitada)?.id ?? "";
  }
  _ir(t) {
    t !== this._act && (this.activa = t, this.dispatchEvent(new CustomEvent("gob-pestana-cambio", { detail: { id: t }, bubbles: !0, composed: !0 })));
  }
  _tecla(t, e) {
    const i = this.items.map((n, d) => n.deshabilitada ? -1 : d).filter((n) => n >= 0), r = i.indexOf(e);
    let o = -1;
    t.key === "ArrowRight" ? o = i[(r + 1) % i.length] : t.key === "ArrowLeft" ? o = i[(r - 1 + i.length) % i.length] : t.key === "Home" ? o = i[0] : t.key === "End" && (o = i.at(-1)), !(o < 0) && (t.preventDefault(), this._ir(this.items[o].id), this.updateComplete.then(() => this.renderRoot.querySelector(`#t-${this.items[o].id}`)?.focus()));
  }
  render() {
    const t = this._act;
    return a`<div class="l" role="tablist" aria-label=${this.etiqueta} part="lista">${this.items.map((e, i) => a`<button id="t-${e.id}" class="t ${e.id === t ? "on" : ""}" role="tab" type="button" aria-selected=${e.id === t} aria-controls="p-${e.id}" tabindex=${e.id === t ? 0 : -1} ?disabled=${e.deshabilitada}
      @click=${() => this._ir(e.id)} @keydown=${(r) => this._tecla(r, i)}>${m(e.icono, 16)}<span>${e.titulo}</span>${e.contador != null ? a`<em>${e.contador}</em>` : c}</button>`)}</div>
      ${this.items.map((e) => a`<div id="p-${e.id}" class="p" role="tabpanel" aria-labelledby="t-${e.id}" tabindex="0" ?hidden=${e.id !== t} part="panel"><slot name=${e.id}></slot></div>`)}`;
  }
  static {
    this.styles = p`
    :host { display: block; font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); } .l { display: flex; gap: .25rem; overflow-x: auto; border-bottom: 1px solid var(--gob-borde, #E3E8EF); }
    .t { display: inline-flex; align-items: center; gap: .45rem; padding: .7rem 1rem; border: 0; background: none; cursor: pointer; font-family: inherit; font-weight: 600; font-size: .875rem; color: #4F5866; border-bottom: 2px solid transparent; margin-bottom: -1px; white-space: nowrap; border-radius: 0; }
    .t:hover:not(:disabled) { color: #161A22; } .t.on { color: #0071BB; border-bottom-color: #0071BB; } .t:disabled { opacity: .4; cursor: not-allowed; } .t:focus-visible, .p:focus-visible { outline: 2px solid #0071BB; outline-offset: -2px; border-radius: 6px; }
    em { font-style: normal; font-size: .72rem; font-weight: 700; background: #F1F4F8; color: #3A424F; border-radius: 99px; padding: .05rem .5rem; } .t.on em { background: #D6E8F4; color: #004F82; }
    :host([variante='pildora']) .l { border: 0; gap: .4rem; } :host([variante='pildora']) .t { border: 1px solid #E3E8EF; border-radius: 99px; margin: 0; padding: .45rem .95rem; } :host([variante='pildora']) .t.on { background: #0071BB; color: #fff; border-color: #0071BB; } :host([variante='pildora']) .t.on em { background: rgba(255,255,255,.22); color: #fff; }
    .p { padding: 1rem 0; } svg { display: block; }`;
  }
}
customElements.get("gob-pestanas") || customElements.define("gob-pestanas", h);
export {
  h as GobPestanas
};
