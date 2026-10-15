import { a as m, A as d, b as s, i as g } from "../chunks/lit-element-CZvHeOsZ.js";
import { i as u } from "../chunks/icono-x0IYmMl5.js";
import { f as l } from "../chunks/mapa-recursos-DvOcbc8o.js";
const b = { primario: "#0071BB", cian: "#007A91", verde: "#3F7A37", amarillo: "#8A6D00", rojo: "#B20028", violeta: "#5618BA", gris: "#4F5866", navy: "#0B2239" }, v = { fromAttribute: (h) => {
  try {
    return h ? JSON.parse(h) : void 0;
  } catch {
    return;
  }
} };
class f extends m {
  constructor() {
    super(), this._raf = 0, this.etiqueta = "", this.valor = 0, this.formato = "numero", this.unidad = "", this.deltaTexto = "vs. periodo anterior", this.buenoSube = !0, this.icono = "", this.color = "primario", this.ayuda = "", this.animar = !0, this.cargando = !1, this.oscuro = !1, this._v = 0;
  }
  static {
    this.properties = {
      etiqueta: { type: String },
      valor: { type: Number },
      formato: { type: String },
      unidad: { type: String },
      delta: { type: Number },
      deltaTexto: { attribute: "delta-texto", type: String },
      buenoSube: { attribute: "bueno-sube", type: Boolean },
      icono: { type: String },
      color: { type: String },
      serie: { converter: v },
      meta: { type: Number },
      ayuda: { type: String },
      animar: { type: Boolean },
      cargando: { type: Boolean },
      oscuro: { type: Boolean, reflect: !0 },
      _v: { state: !0 }
    };
  }
  updated(e) {
    e.has("valor") && this._contar();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), cancelAnimationFrame(this._raf);
  }
  _contar() {
    cancelAnimationFrame(this._raf);
    const e = this._v, o = this.valor;
    if (!this.animar || matchMedia("(prefers-reduced-motion: reduce)").matches || e === o) {
      this._v = o;
      return;
    }
    const t = performance.now(), a = 800, r = (n) => {
      const i = Math.min(1, (n - t) / a);
      this._v = e + (o - e) * (1 - (1 - i) ** 3), i < 1 && (this._raf = requestAnimationFrame(r));
    };
    this._raf = requestAnimationFrame(r);
  }
  _spark(e) {
    const o = this.serie;
    if (!o || o.length < 2) return d;
    const t = Math.min(...o), a = Math.max(...o), r = a - t || 1, i = "M" + o.map((c, p) => [p / (o.length - 1) * 100, 28 - (c - t) / r * 24 - 2]).map((c) => c.map((p) => p.toFixed(1)).join(" ")).join("L");
    return s`<svg class="s" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true"><path d="${i}L100 28L0 28Z" fill=${e} opacity=".12"/><path d=${i} fill="none" stroke=${e} stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  }
  render() {
    const e = b[this.color] ?? this.color, o = l(this._v, this.formato) + (this.unidad && !["cop", "porcentaje"].includes(this.formato) ? " " + this.unidad : ""), t = this.delta, a = (t ?? 0) > 0, r = t === 0 || t == null, n = r ? null : a === this.buenoSube, i = this.meta ? Math.max(0, Math.min(100, this.valor / this.meta * 100)) : null, c = `${this.etiqueta}: ${l(this.valor, this.formato)}${this.unidad && !["cop", "porcentaje"].includes(this.formato) ? " " + this.unidad : ""}${t != null ? `, ${t > 0 ? "+" : ""}${t}% ${this.deltaTexto}` : ""}`;
    return s`<div class="k ${this.cargando ? "cg" : ""}" part="kpi" role="group" aria-label=${c} style="--c:${e}">
      <div class="t"><span class="e">${this.etiqueta}</span>${this.icono ? s`<span class="ic">${u(this.icono, 20)}</span>` : d}</div>
      <div class="v" part="valor">${this.cargando ? "—" : o}</div>
      ${t != null ? s`<div class="d ${n === null ? "dn" : n ? "dg" : "dm"}">${u(r ? "minimizar" : a ? "tendencia-sube" : "tendencia-baja", 14)}<b>${a ? "+" : ""}${l(t, "numero")}%</b><span>${this.deltaTexto}</span></div>` : d}
      ${i != null ? s`<div class="m" role="progressbar" aria-valuenow=${Math.round(i)} aria-valuemin="0" aria-valuemax="100" aria-label="Avance hacia la meta"><i style="width:${i}%"></i></div><div class="mt">${Math.round(i)}% de la meta (${l(this.meta, this.formato)})</div>` : d}
      ${this._spark(e)}${this.ayuda ? s`<div class="h">${this.ayuda}</div>` : d}</div>`;
  }
  static {
    this.styles = g`
    :host { display: block; font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); }
    .k { position: relative; overflow: hidden; height: 100%; box-sizing: border-box; background: var(--gob-kpi-fondo, #fff); color: var(--gob-kpi-texto, #252B36); border: 1px solid var(--gob-kpi-borde, #E3E8EF); border-radius: 12px; padding: 1rem 1.15rem; box-shadow: 0 1px 2px rgba(8,26,44,.06); display: grid; gap: .25rem; align-content: start; }
    :host([oscuro]) .k { --gob-kpi-fondo: #0B2239; --gob-kpi-texto: #E3E8EF; --gob-kpi-borde: #12395C; } .k::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--c); }
    .t { display: flex; justify-content: space-between; align-items: center; gap: .5rem; } .e { font-size: .78rem; font-weight: 600; color: #4F5866; letter-spacing: .02em; } :host([oscuro]) .e { color: #97A1B0; }
    .ic { display: grid; place-items: center; width: 2.1rem; height: 2.1rem; border-radius: 8px; background: color-mix(in srgb, var(--c) 12%, transparent); color: var(--c); line-height: 0; }
    .v { font-size: 2rem; font-weight: 800; line-height: 1.1; letter-spacing: -.02em; color: var(--gob-kpi-valor, #161A22); font-variant-numeric: tabular-nums; } :host([oscuro]) .v { color: #fff; } .cg .v { opacity: .4; }
    .d { display: inline-flex; align-items: center; gap: .3rem; font-size: .78rem; } .d b { font-weight: 700; } .d span { color: #6B7482; } .d.dg { color: #2C5A26; } .d.dm { color: #B20028; } .d.dn { color: #4F5866; } :host([oscuro]) .d.dg { color: #8FD18A; } :host([oscuro]) .d.dm { color: #FF8FA8; } :host([oscuro]) .d span { color: #97A1B0; }
    .m { height: 6px; border-radius: 99px; background: #E3E8EF; overflow: hidden; margin-top: .4rem; } .m i { display: block; height: 100%; background: var(--c); border-radius: inherit; } :host([oscuro]) .m { background: #12395C; } .mt, .h { font-size: .72rem; color: #6B7482; } :host([oscuro]) .mt, :host([oscuro]) .h { color: #97A1B0; }
    .s { width: 100%; height: 34px; margin-top: .4rem; display: block; } svg { display: block; }`;
  }
}
customElements.get("gob-kpi") || customElements.define("gob-kpi", f);
export {
  f as GobKpi
};
