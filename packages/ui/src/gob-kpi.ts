import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import { icono } from './lib/icono.js';
import { formatoNumero } from './lib/mapa-recursos.js';

/* <gob-kpi etiqueta="Radicados" valor="1284" delta="12.5" serie="[3,5,4,8,9]" icono="archivo" color="primario"> — indicador con tendencia y sparkline. */
const COLORES: Record<string, string> = { primario: '#0071BB', cian: '#007A91', verde: '#3F7A37', amarillo: '#8A6D00', rojo: '#B20028', violeta: '#5618BA', gris: '#4F5866', navy: '#0B2239' };
const jsonConv = { fromAttribute: (v: string | null) => { try { return v ? JSON.parse(v) : undefined; } catch { return undefined; } } };

export class GobKpi extends LitElement {
  static properties = {
    etiqueta: { type: String }, valor: { type: Number }, formato: { type: String }, unidad: { type: String }, delta: { type: Number }, deltaTexto: { attribute: 'delta-texto', type: String },
    buenoSube: { attribute: 'bueno-sube', type: Boolean }, icono: { type: String }, color: { type: String }, serie: { converter: jsonConv }, meta: { type: Number }, ayuda: { type: String },
    animar: { type: Boolean }, cargando: { type: Boolean }, oscuro: { type: Boolean, reflect: true }, _v: { state: true },
  };
  declare etiqueta: string; declare valor: number; declare formato: string; declare unidad: string; declare delta?: number; declare deltaTexto: string; declare buenoSube: boolean; declare icono: string;
  declare color: string; declare serie?: number[]; declare meta?: number; declare ayuda: string; declare animar: boolean; declare cargando: boolean; declare oscuro: boolean; declare _v: number;
  private _raf = 0;
  constructor() { super(); this.etiqueta = ''; this.valor = 0; this.formato = 'numero'; this.unidad = ''; this.deltaTexto = 'vs. periodo anterior'; this.buenoSube = true; this.icono = ''; this.color = 'primario'; this.ayuda = ''; this.animar = true; this.cargando = false; this.oscuro = false; this._v = 0; }
  updated(ch: PropertyValues) { if (ch.has('valor')) this._contar(); }
  disconnectedCallback() { super.disconnectedCallback(); cancelAnimationFrame(this._raf); }
  private _contar() {
    cancelAnimationFrame(this._raf); const a = this._v, b = this.valor;
    if (!this.animar || matchMedia('(prefers-reduced-motion: reduce)').matches || a === b) { this._v = b; return; }
    const t0 = performance.now(), d = 800; const f = (t: number) => { const p = Math.min(1, (t - t0) / d); this._v = a + (b - a) * (1 - (1 - p) ** 3); if (p < 1) this._raf = requestAnimationFrame(f); }; this._raf = requestAnimationFrame(f);
  }
  private _spark(c: string) {
    const s = this.serie; if (!s || s.length < 2) return nothing; const min = Math.min(...s), max = Math.max(...s), r = max - min || 1;
    const pts = s.map((v, i) => [(i / (s.length - 1)) * 100, 28 - ((v - min) / r) * 24 - 2]); const d = 'M' + pts.map((p) => p.map((n) => n.toFixed(1)).join(' ')).join('L');
    return html`<svg class="s" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true"><path d="${d}L100 28L0 28Z" fill=${c} opacity=".12"/><path d=${d} fill="none" stroke=${c} stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  }
  render() {
    const c = COLORES[this.color] ?? this.color; const v = formatoNumero(this._v, this.formato) + (this.unidad && !['cop', 'porcentaje'].includes(this.formato) ? ' ' + this.unidad : '');
    const d = this.delta; const sube = (d ?? 0) > 0, igual = d === 0 || d == null; const bueno = igual ? null : sube === this.buenoSube;
    const pct = this.meta ? Math.max(0, Math.min(100, (this.valor / this.meta) * 100)) : null;
    const etiq = `${this.etiqueta}: ${formatoNumero(this.valor, this.formato)}${this.unidad && !['cop', 'porcentaje'].includes(this.formato) ? ' ' + this.unidad : ''}${d != null ? `, ${d > 0 ? '+' : ''}${d}% ${this.deltaTexto}` : ''}`;
    return html`<div class="k ${this.cargando ? 'cg' : ''}" part="kpi" role="group" aria-label=${etiq} style="--c:${c}">
      <div class="t"><span class="e">${this.etiqueta}</span>${this.icono ? html`<span class="ic">${icono(this.icono, 20)}</span>` : nothing}</div>
      <div class="v" part="valor">${this.cargando ? '—' : v}</div>
      ${d != null ? html`<div class="d ${bueno === null ? 'dn' : bueno ? 'dg' : 'dm'}">${icono(igual ? 'minimizar' : sube ? 'tendencia-sube' : 'tendencia-baja', 14)}<b>${sube ? '+' : ''}${formatoNumero(d, 'numero')}%</b><span>${this.deltaTexto}</span></div>` : nothing}
      ${pct != null ? html`<div class="m" role="progressbar" aria-valuenow=${Math.round(pct)} aria-valuemin="0" aria-valuemax="100" aria-label="Avance hacia la meta"><i style="width:${pct}%"></i></div><div class="mt">${Math.round(pct)}% de la meta (${formatoNumero(this.meta!, this.formato)})</div>` : nothing}
      ${this._spark(c)}${this.ayuda ? html`<div class="h">${this.ayuda}</div>` : nothing}</div>`;
  }
  static styles = css`
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
if (!customElements.get('gob-kpi')) customElements.define('gob-kpi', GobKpi);
declare global { interface HTMLElementTagNameMap { 'gob-kpi': GobKpi } }
