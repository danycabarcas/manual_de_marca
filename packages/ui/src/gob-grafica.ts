import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import { PALETAS, TIPOS, temaGob, construirOpcion, tablaDe, type Cfg } from './lib/grafica-opciones.js';

/* ============================================================================
   <gob-grafica>  ·  Gráficas con la identidad visual (Apache ECharts, carga perezosa)
   Tipos: barras, barras-horizontal, lineas, area, torta, dona, radar, gauge, mapa-calor, treemap, sankey
   ============================================================================ */

const listaConv = { fromAttribute: (v: string | null) => (v ? v.split(/[\s,]+/).filter(Boolean) : []) };
const jsonConv = { fromAttribute: (v: string | null) => { try { return v ? JSON.parse(v) : undefined; } catch { return undefined; } }, toAttribute: (v: unknown) => JSON.stringify(v) };
type Eco = typeof import('./lib/echarts-setup.js');
let ecoPromise: Promise<Eco> | null = null;
/** Carga ECharts (solo lo necesario) cuando el primer gráfico lo requiere. */
function cargarECharts(): Promise<Eco> { return (ecoPromise ??= import('./lib/echarts-setup.js')); }

export class GobGrafica extends LitElement {
  static properties = {
    tipo: { type: String, reflect: true },
    datos: { converter: jsonConv },
    colores: { converter: { fromAttribute: (v: string | null) => { if (!v) return 'institucional'; return v.trim().startsWith('[') ? JSON.parse(v) : v.trim(); } } },
    titulo: { type: String }, subtitulo: { type: String },
    leyenda: { type: Boolean }, leyendaPosicion: { attribute: 'leyenda-posicion', type: String },
    etiquetas: { type: Boolean }, apilado: { type: Boolean }, suave: { type: Boolean },
    formato: { type: String }, unidad: { type: String },
    tituloEjeX: { attribute: 'titulo-eje-x', type: String }, tituloEjeY: { attribute: 'titulo-eje-y', type: String },
    umbrales: { converter: jsonConv }, min: { type: Number }, max: { type: Number },
    patrones: { type: Boolean }, animacion: { type: Boolean },
    tema: { type: String, reflect: true }, altura: { type: Number }, centro: { type: String },
    descripcion: { type: String },
    _listo: { state: true }, _error: { state: true },
  };
  declare tipo: string; declare datos?: unknown; declare colores: string | string[]; declare titulo: string; declare subtitulo: string;
  declare leyenda: boolean; declare leyendaPosicion: 'arriba' | 'abajo' | 'derecha'; declare etiquetas: boolean; declare apilado: boolean; declare suave: boolean;
  declare formato: string; declare unidad: string; declare tituloEjeX: string; declare tituloEjeY: string; declare umbrales?: [number, string][];
  declare min: number; declare max: number; declare patrones: boolean; declare animacion: boolean; declare tema: 'claro' | 'oscuro'; declare altura: number; declare centro: string; declare descripcion: string;
  declare _listo: boolean; declare _error: string;

  private _chart: any = null; private _ro?: ResizeObserver; private _tema = ''; private _t = 0;

  constructor() {
    super();
    this.tipo = 'barras'; this.colores = 'institucional'; this.titulo = ''; this.subtitulo = ''; this.leyenda = true; this.leyendaPosicion = 'arriba';
    this.etiquetas = false; this.apilado = false; this.suave = false; this.formato = 'numero'; this.unidad = ''; this.tituloEjeX = ''; this.tituloEjeY = '';
    this.min = 0; this.max = 100; this.patrones = false; this.animacion = true; this.tema = 'claro'; this.altura = 360; this.centro = ''; this.descripcion = '';
    this._listo = false; this._error = '';
  }
  /** Asigna varias propiedades a la vez. */
  set config(c: Record<string, unknown>) { Object.assign(this, c); }
  get config(): Record<string, unknown> { return {}; }
  static get paletas() { return PALETAS; }
  static get tipos() { return TIPOS; }

  connectedCallback() { super.connectedCallback(); this._ro = new ResizeObserver(() => this._chart?.resize()); }
  disconnectedCallback() { super.disconnectedCallback(); this._ro?.disconnect(); this._chart?.dispose(); this._chart = null; this._tema = ''; }
  updated(ch: PropertyValues) { if (ch.size) { clearTimeout(this._t); this._t = window.setTimeout(() => this._dibujar(), 30); } }

  private _paleta(): string[] { return Array.isArray(this.colores) ? this.colores : (PALETAS[this.colores]?.colores ?? PALETAS.institucional.colores); }
  private _cfg(): Cfg {
    return { tipo: this.tipo, colores: this._paleta(), titulo: this.titulo, subtitulo: this.subtitulo, leyenda: this.leyenda, leyendaPosicion: this.leyendaPosicion, etiquetas: this.etiquetas, apilado: this.apilado, suave: this.suave,
      formato: this.formato, unidad: this.unidad, tituloEjeX: this.tituloEjeX, tituloEjeY: this.tituloEjeY, umbrales: this.umbrales, min: this.min, max: this.max, patrones: this.patrones,
      animacion: this.animacion && !matchMedia('(prefers-reduced-motion: reduce)').matches, oscuro: this.tema === 'oscuro', centro: this.centro };
  }
  private async _dibujar() {
    const el = this.renderRoot.querySelector('.ch') as HTMLElement | null; if (!el || this.datos == null) return;
    try {
      const e = await cargarECharts(); const t = this.tema === 'oscuro' ? 'gob-oscuro' : 'gob';
      if (this._chart && this._tema !== t) { this._chart.dispose(); this._chart = null; }
      if (!this._chart) {
        this._chart = e.init(el, t, { renderer: 'canvas' }); this._tema = t; this._ro?.observe(el);
        this._chart.on('click', (p: any) => this.dispatchEvent(new CustomEvent('gob-grafica-click', { detail: { nombre: p.name, serie: p.seriesName, valor: p.value, indice: p.dataIndex, tipo: p.seriesType }, bubbles: true, composed: true })));
        this._chart.on('finished', () => { if (!this._listo) { this._listo = true; this.dispatchEvent(new CustomEvent('gob-grafica-lista', { bubbles: true, composed: true })); } });
      }
      this._chart.setOption(construirOpcion(this._cfg(), this.datos), { notMerge: true }); this._chart.resize(); this._error = '';
    } catch (err) { this._error = String((err as Error).message || err); }
  }

  // ---- exportación
  /** Descarga la gráfica como PNG. */
  descargarPNG(nombre = 'grafica', escala = 2) {
    if (!this._chart) return;
    const url = this._chart.getDataURL({ type: 'png', pixelRatio: escala, backgroundColor: this.tema === 'oscuro' ? '#081A2C' : '#FFFFFF' });
    const a = document.createElement('a'); a.href = url; a.download = nombre + '.png'; a.click();
  }
  /** Devuelve los datos como CSV (separador «;», UTF-8 con BOM al descargar). */
  csv(): string { const t = tablaDe(this.tipo, this.datos); return [t.cab, ...t.filas].map((f) => f.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n'); }
  descargarCSV(nombre = 'datos') { const b = new Blob(['﻿' + this.csv()], { type: 'text/csv;charset=utf-8' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = nombre + '.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
  imprimir() { window.print(); }

  render() {
    const t = tablaDe(this.tipo, this.datos);
    const etiqueta = [this.titulo || TIPOS[this.tipo] || 'Gráfica', this.descripcion].filter(Boolean).join('. ');
    return html`<div class="wrap" part="grafica">
      ${this._error ? html`<div class="err" role="alert">⚠ ${this._error}</div>` : nothing}
      ${!this._listo && !this._error ? html`<div class="cargando" role="status">Cargando gráfica…</div>` : nothing}
      <div class="ch" part="lienzo" role="img" aria-label=${etiqueta} style="height:${this.altura}px"></div>
      <table class="sr"><caption>${etiqueta}</caption><thead><tr>${t.cab.map((c) => html`<th>${c}</th>`)}</tr></thead>
        <tbody>${t.filas.map((f) => html`<tr>${f.map((c) => html`<td>${c}</td>`)}</tr>`)}</tbody></table></div>`;
  }
  static styles = css`
    :host { display: block; position: relative; font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); }
    .wrap { position: relative; } .ch { width: 100%; min-height: 200px; }
    .cargando, .err { position: absolute; inset: 0; display: grid; place-items: center; font-size: .85rem; color: #6B7482; pointer-events: none; } .err { color: #B20028; }
    .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    @media print { .ch { break-inside: avoid; } }
  `;
}
if (!customElements.get('gob-grafica')) customElements.define('gob-grafica', GobGrafica);
declare global { interface HTMLElementTagNameMap { 'gob-grafica': GobGrafica } }
