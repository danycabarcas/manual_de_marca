import { i as l, a as p, A as a, b as o } from "../chunks/lit-element-CZvHeOsZ.js";
import { i as n } from "../chunks/icono-x0IYmMl5.js";
const d = { fromAttribute: (s) => {
  try {
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
} }, m = l`:host { display: block; font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); color: var(--gob-color-texto, #161A22); } svg { display: block; }`, c = { primario: ["#0071BB", "#E5F1F9"], info: ["#0A8CA8", "#E3F6FA"], exito: ["#2E7D32", "#E8F5E9"], aviso: ["#8A6A00", "#FFF6D6"], peligro: ["#C4002F", "#FFE8EE"], neutro: ["#4F5866", "#F1F4F8"] }, g = { primario: "check", info: "info", exito: "check-circulo", aviso: "alerta", peligro: "error", neutro: "reloj" };
class b extends p {
  static {
    this.properties = { eventos: { converter: d }, orientacion: { type: String, reflect: !0 }, alternar: { type: Boolean }, invertir: { type: Boolean }, etiqueta: { type: String } };
  }
  constructor() {
    super(), this.eventos = [], this.orientacion = "vertical", this.alternar = !1, this.invertir = !1, this.etiqueta = "Línea de tiempo";
  }
  render() {
    const e = this.invertir ? [...this.eventos].reverse() : this.eventos;
    return o`<ol class="l" aria-label=${this.etiqueta} part="lista">${e.map((t, r) => {
      const i = t.tipo ?? "primario", [h, u] = c[i] ?? c.primario;
      return o`<li class="e ${this.alternar && r % 2 ? "alt" : ""}" style="--c:${h};--bg:${u}"><span class="pt" aria-hidden="true">${n(t.icono ?? g[i], 15)}</span>
        <div class="c"><div class="h"><strong>${t.titulo}</strong>${t.fecha ? o`<time>${t.fecha}</time>` : a}</div>${t.descripcion ? o`<p>${t.descripcion}</p>` : a}${t.autor ? o`<small>${t.autor}</small>` : a}<slot name=${"e" + r}></slot></div></li>`;
    })}</ol>`;
  }
  static {
    this.styles = [m, l`
    .l { list-style: none; margin: 0; padding: 0; } .e { position: relative; display: grid; grid-template-columns: 2rem 1fr; gap: .9rem; padding-bottom: 1.4rem; } .e:last-child { padding-bottom: 0; }
    .e::before { content: ''; position: absolute; left: calc(1rem - 1px); top: 2rem; bottom: 0; width: 2px; background: #E3E8EF; } .e:last-child::before { display: none; }
    .pt { display: grid; place-items: center; width: 2rem; height: 2rem; border-radius: 50%; background: var(--bg); color: var(--c); border: 2px solid var(--c); box-sizing: border-box; z-index: 1; }
    .h { display: flex; flex-wrap: wrap; gap: .25rem .75rem; align-items: baseline; } strong { font-size: .92rem; } time { font-size: .76rem; font-weight: 600; color: #4F5866; background: #F1F4F8; border-radius: 99px; padding: .1rem .55rem; }
    p { margin: .3rem 0 0; font-size: .86rem; color: #3A424F; line-height: 1.5; } small { display: block; margin-top: .3rem; font-size: .76rem; color: #5B6575; }
    :host([orientacion='horizontal']) .l { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: .5rem; } :host([orientacion='horizontal']) .e { grid-template-columns: 1fr; min-width: 12rem; padding: 0; gap: .6rem; }
    :host([orientacion='horizontal']) .e::before { left: 2.2rem; right: -1rem; top: 1rem; bottom: auto; width: auto; height: 2px; }
    @media (min-width: 640px) { :host([alternar]) .l { position: relative; } :host([alternar]:not([orientacion='horizontal'])) .e { grid-template-columns: 1fr 2rem 1fr; } :host([alternar]:not([orientacion='horizontal'])) .e .c { grid-column: 3; } :host([alternar]:not([orientacion='horizontal'])) .e .pt { grid-column: 2; grid-row: 1; } :host([alternar]:not([orientacion='horizontal'])) .e.alt .c { grid-column: 1; grid-row: 1; text-align: right; } :host([alternar]:not([orientacion='horizontal'])) .e.alt .h { justify-content: flex-end; } :host([alternar]:not([orientacion='horizontal'])) .e::before { left: 50%; } }`];
  }
}
class f extends p {
  static {
    this.properties = { pasos: { converter: d }, actual: { type: Number, reflect: !0 }, vertical: { type: Boolean, reflect: !0 }, clicable: { type: Boolean }, error: { type: Number } };
  }
  constructor() {
    super(), this.pasos = [], this.actual = 0, this.vertical = !1, this.clicable = !1, this.error = -1;
  }
  get total() {
    return this.pasos.length;
  }
  ir(e) {
    e = Math.max(0, Math.min(this.total - 1, e)), e !== this.actual && (this.actual = e, this.dispatchEvent(new CustomEvent("gob-paso-cambio", { detail: { actual: e, id: this.pasos[e]?.id ?? String(e), primero: e === 0, ultimo: e === this.total - 1 }, bubbles: !0, composed: !0 })));
  }
  siguiente() {
    this.ir(this.actual + 1);
  }
  anterior() {
    this.ir(this.actual - 1);
  }
  render() {
    return o`<ol class="p" aria-label="Progreso" part="lista">${this.pasos.map((e, t) => {
      const r = t === this.error ? "err" : t < this.actual ? "ok" : t === this.actual ? "on" : "", i = o`<span class="n">${r === "ok" ? n("check", 15) : r === "err" ? n("alerta", 15) : e.icono ? n(e.icono, 15) : t + 1}</span><span class="t"><b>${e.titulo}</b>${e.descripcion ? o`<small>${e.descripcion}</small>` : a}</span>`;
      return o`<li class="s ${r}" aria-current=${t === this.actual ? "step" : a}>${this.clicable && t < this.actual + 1 ? o`<button type="button" @click=${() => this.ir(t)}>${i}</button>` : o`<div class="b">${i}</div>`}</li>`;
    })}</ol>
      <div class="cuerpo" part="cuerpo" aria-live="polite">${this.pasos.map((e, t) => o`<div ?hidden=${t !== this.actual}><slot name=${e.id ?? "paso" + t}></slot></div>`)}</div>`;
  }
  static {
    this.styles = [m, l`
    .p { list-style: none; margin: 0 0 1rem; padding: 0; display: flex; gap: .5rem; counter-reset: x; } .s { flex: 1; position: relative; min-width: 0; }
    .s::after { content: ''; position: absolute; top: 1.05rem; left: calc(2.1rem + .6rem); right: -.4rem; height: 2px; background: #E3E8EF; } .s:last-child::after { display: none; } .s.ok::after { background: #0071BB; }
    button, .b { display: flex; align-items: flex-start; gap: .6rem; width: 100%; border: 0; background: none; padding: 0; font: inherit; color: inherit; text-align: left; cursor: default; } button { cursor: pointer; } button:focus-visible { outline: 2px solid #0071BB; outline-offset: 3px; border-radius: 8px; }
    .n { flex: none; display: grid; place-items: center; width: 2.1rem; height: 2.1rem; border-radius: 50%; border: 2px solid #CBD2DC; background: #fff; color: #4F5866; font-weight: 700; font-size: .85rem; z-index: 1; }
    .on .n { border-color: #0071BB; background: #0071BB; color: #fff; box-shadow: 0 0 0 4px rgba(0,113,187,.18); } .ok .n { border-color: #0071BB; background: #E5F1F9; color: #0071BB; } .err .n { border-color: #C4002F; background: #FFE8EE; color: #C4002F; }
    .t { display: grid; padding-top: .2rem; min-width: 0; background: #fff; padding-right: .5rem; z-index: 1; } b { font-size: .84rem; font-weight: 600; color: #4F5866; } .on b, .ok b { color: #161A22; } small { font-size: .74rem; color: #5B6575; }
    @media (max-width: 560px) { :host(:not([vertical])) .t { display: none; } :host(:not([vertical])) .on .t { display: grid; position: absolute; left: 0; top: 2.5rem; } :host(:not([vertical])) .p { margin-bottom: 2.6rem; } }
    :host([vertical]) .p { flex-direction: column; gap: 0; } :host([vertical]) .s { padding-bottom: 1.2rem; } :host([vertical]) .s::after { top: 2.1rem; left: 1.05rem; right: auto; bottom: 0; width: 2px; height: auto; }
    [hidden] { display: none !important; }`];
  }
}
customElements.get("gob-linea-tiempo") || customElements.define("gob-linea-tiempo", b);
customElements.get("gob-pasos") || customElements.define("gob-pasos", f);
export {
  b as GobLineaTiempo,
  f as GobPasos
};
