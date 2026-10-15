import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import { icono } from './lib/icono.js';
import './gob-kpi.js'; import './gob-grafica.js'; import './gob-tabla.js'; import './gob-mapa-magdalena.js'; import './gob-mensajes.js';

/* ============================================================================
   <gob-dashboard>  ·  Tablero declarativo: registros + filtros globales + widgets (kpi, gráfica, mapa, tabla, texto, alerta).
   Los filtros se sincronizan entre widgets; al hacer clic en una barra, sector o municipio se filtra el resto.
   ============================================================================ */
type R = Record<string, any>;
export interface Filtro { campo: string; etiqueta?: string; todos?: string; opciones?: (string | { valor: string; etiqueta: string })[] }
export interface Widget {
  id?: string; tipo: 'kpi' | 'grafica' | 'mapa' | 'tabla' | 'texto' | 'alerta'; titulo?: string; descripcion?: string; col?: number; alto?: number;
  /** Filtro fijo del widget: { estado: 'Vencido' } */ donde?: Record<string, string>;
  medida?: 'conteo' | 'suma' | 'promedio' | 'max' | 'min' | 'distintos'; campo?: string; formato?: string; unidad?: string;
  // kpi
  icono?: string; color?: string; meta?: number; serie?: string; buenoSube?: boolean; ayuda?: string;
  // gráfica
  grafica?: string; agrupar?: string; orden?: 'natural' | 'valor-desc' | 'valor-asc' | 'nombre'; limite?: number; etiquetas?: boolean; apilado?: boolean; suave?: boolean; colores?: string | string[]; leyenda?: boolean; leyendaPosicion?: string; filtrar?: boolean; min?: number; max?: number; umbrales?: [number, string][];
  // mapa
  rampa?: string | string[]; leyendaTitulo?: string; mapaEtiquetas?: string;
  // tabla
  columnas?: any[]; opciones?: Record<string, unknown>;
  // texto / alerta
  contenido?: string; tono?: string;
}
const jsonConv = { fromAttribute: (v: string | null) => { try { return v ? JSON.parse(v) : undefined; } catch { return undefined; } }, toAttribute: (v: unknown) => JSON.stringify(v) };
const MES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/** Valor de un campo con transformaciones de fecha: «fecha:mes» → 2026-03, «fecha:anio», «fecha:trimestre», «fecha:dia». */
export function valorCampo(r: R, campo: string): string {
  const [c, t] = campo.split(':'); const v = r[c]; if (v == null) return ''; if (!t) return String(v);
  const d = new Date(v as string); if (isNaN(+d)) return String(v); const y = d.getFullYear(), m = d.getMonth() + 1;
  return t === 'mes' ? `${y}-${String(m).padStart(2, '0')}` : t === 'anio' ? String(y) : t === 'trimestre' ? `${y}-T${Math.ceil(m / 3)}` : t === 'dia' ? String(v).slice(0, 10) : String(v);
}
export function etiquetaClave(campo: string, k: string): string {
  const t = campo.split(':')[1]; if (t === 'mes' && /^\d{4}-\d{2}$/.test(k)) return `${MES[+k.slice(5) - 1]} ${k.slice(0, 4)}`; return k;
}
export function medir(rs: R[], medida: string | undefined, campo?: string): number {
  if (!medida || medida === 'conteo') return rs.length; if (medida === 'distintos') return new Set(rs.map((r) => r[campo!])).size;
  const v = rs.map((r) => Number(r[campo!])).filter(Number.isFinite); if (!v.length) return 0;
  return medida === 'suma' ? v.reduce((a, b) => a + b, 0) : medida === 'promedio' ? v.reduce((a, b) => a + b, 0) / v.length : medida === 'max' ? Math.max(...v) : Math.min(...v);
}
function agrupar(rs: R[], campo: string): Map<string, R[]> { const m = new Map<string, R[]>(); for (const r of rs) { const k = valorCampo(r, campo); if (k === '') continue; (m.get(k) ?? m.set(k, []).get(k)!).push(r); } return m; }

export class GobDashboard extends LitElement {
  static properties = {
    titulo: { type: String }, subtitulo: { type: String }, registros: { converter: jsonConv }, filtros: { converter: jsonConv }, widgets: { converter: jsonConv },
    tema: { type: String, reflect: true }, colores: { converter: { fromAttribute: (v: string | null) => v ?? 'institucional' } }, _f: { state: true },
  };
  declare titulo: string; declare subtitulo: string; declare registros: R[]; declare filtros: Filtro[]; declare widgets: Widget[]; declare tema: 'claro' | 'oscuro'; declare colores: string | string[]; declare _f: Record<string, string>;
  private _labels = new Map<string, Map<string, string>>();
  constructor() { super(); this.titulo = ''; this.subtitulo = ''; this.registros = []; this.filtros = []; this.widgets = []; this.tema = 'claro'; this.colores = 'institucional'; this._f = {};
    // «config» asignada antes de que el componente se cargue (carga perezosa) queda como propiedad propia: se re-aplica
    if (Object.prototype.hasOwnProperty.call(this, 'config')) { const c = (this as any).config; delete (this as any).config; (this as any).config = c; }
  }
  set config(c: Record<string, unknown>) { Object.assign(this, c); } get config(): Record<string, unknown> { return {}; }

  updated(ch: PropertyValues) { if (ch.has('_f')) this.dispatchEvent(new CustomEvent('gob-dashboard-filtro', { detail: { filtros: { ...this._f }, total: this._filtrar().length }, bubbles: true, composed: true })); }
  private _filtrar(excluir?: string): R[] { const e = Object.entries(this._f).filter(([c, v]) => v !== '' && c !== excluir); return e.length ? this.registros.filter((r) => e.every(([c, v]) => valorCampo(r, c) === v)) : this.registros; }
  private _base(w: Widget, excluir?: string): R[] { const d = Object.entries(w.donde ?? {}); const rs = this._filtrar(excluir); return d.length ? rs.filter((r) => d.every(([c, v]) => valorCampo(r, c) === v)) : rs; }
  private _setF(c: string, v: string) { this._f = { ...this._f, [c]: v }; }
  private _toggle(c: string, v: string) { this._setF(c, this._f[c] === v ? '' : v); }
  reiniciar() { this._f = {}; }
  private _opciones(f: Filtro): { valor: string; etiqueta: string }[] {
    if (f.opciones) return f.opciones.map((o) => (typeof o === 'string' ? { valor: o, etiqueta: etiquetaClave(f.campo, o) } : o));
    return [...new Set(this.registros.map((r) => valorCampo(r, f.campo)).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es', { numeric: true })).map((v) => ({ valor: v, etiqueta: etiquetaClave(f.campo, v) }));
  }
  csv(): string { const rs = this._filtrar(); if (!rs.length) return ''; const cols = Object.keys(rs[0]); return [cols, ...rs.map((r) => cols.map((c) => String(r[c] ?? '')))].map((f) => f.map((x) => `"${x.replace(/"/g, '""')}"`).join(';')).join('\n'); }
  descargarCSV(nombre = 'datos-filtrados') { const b = new Blob(['﻿' + this.csv()], { type: 'text/csv;charset=utf-8' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = nombre + '.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
  imprimir() { window.print(); }

  // ------------------------------------------------------------------ construcción de cada widget
  private _ordenar(ent: [string, number][], o: Widget['orden'], campo: string) {
    if (o === 'valor-desc') ent.sort((a, b) => b[1] - a[1]); else if (o === 'valor-asc') ent.sort((a, b) => a[1] - b[1]); else if (o === 'nombre') ent.sort((a, b) => etiquetaClave(campo, a[0]).localeCompare(etiquetaClave(campo, b[0]), 'es', { numeric: true }));
    else if (/:(mes|anio|trimestre|dia)$/.test(campo)) ent.sort((a, b) => a[0].localeCompare(b[0])); return ent;
  }
  private _grafica(w: Widget, id: string) {
    const rs = this._base(w, w.agrupar), g = agrupar(rs, w.agrupar ?? ''); const campo = w.agrupar ?? ''; const lab = new Map<string, string>(); const tipo = w.grafica ?? 'barras';
    let datos: unknown; let resaltar = '';
    if (tipo === 'gauge') datos = { valor: medir(this._base(w), w.medida, w.campo), nombre: w.titulo ?? '' };
    else if ((tipo === 'mapa-calor' || tipo === 'sankey') && w.serie) {
      const xs = [...g.keys()].sort(); const ys = [...new Set(rs.map((r) => valorCampo(r, w.serie!)))].filter(Boolean).sort();
      if (tipo === 'mapa-calor') datos = { x: xs.map((k) => etiquetaClave(campo, k)), y: ys, valores: ys.flatMap((y, j) => xs.map((x, i) => [i, j, medir((g.get(x) ?? []).filter((r) => valorCampo(r, w.serie!) === y), w.medida, w.campo)])) };
      else datos = { nodos: [...xs, ...ys.filter((y) => !xs.includes(y))], enlaces: xs.flatMap((x) => ys.map((y) => ({ origen: x, destino: y, valor: medir((g.get(x) ?? []).filter((r) => valorCampo(r, w.serie!) === y), w.medida, w.campo) })).filter((e) => e.valor > 0)) };
    } else {
      let ent: [string, number][] = [...g].map(([k, v]) => [k, medir(v, w.medida, w.campo)]); ent = this._ordenar(ent, w.orden, campo); if (w.limite) ent = ent.slice(0, w.limite);
      ent.forEach(([k]) => lab.set(etiquetaClave(campo, k), k)); this._labels.set(id, lab);
      if (['torta', 'dona', 'treemap'].includes(tipo)) datos = ent.map(([k, v]) => ({ nombre: etiquetaClave(campo, k), valor: v }));
      else if (w.serie) { const ss = [...new Set(rs.map((r) => valorCampo(r, w.serie!)))].filter(Boolean).sort(); datos = { categorias: ent.map(([k]) => etiquetaClave(campo, k)), series: ss.map((s) => ({ nombre: s, valores: ent.map(([k]) => medir((g.get(k) ?? []).filter((r) => valorCampo(r, w.serie!) === s), w.medida, w.campo)) })) }; }
      else datos = { categorias: ent.map(([k]) => etiquetaClave(campo, k)), series: [{ nombre: w.titulo || 'Valor', valores: ent.map(([, v]) => v) }] };
      const sel = this._f[campo]; if (sel) resaltar = etiquetaClave(campo, sel);
    }
    return { datos, resaltar };
  }
  private _kpi(w: Widget) {
    const rs = this._base(w); const valor = medir(rs, w.medida, w.campo); let serie: number[] | undefined; let delta: number | undefined;
    if (w.serie) { const g = agrupar(rs, w.serie); const ks = [...g.keys()].sort(); this._sinParcial(ks, w.serie); serie = ks.map((k) => medir(g.get(k)!, w.medida, w.campo)); if (serie.length >= 2 && serie.at(-2)) delta = Math.round(((serie.at(-1)! - serie.at(-2)!) / Math.abs(serie.at(-2)!)) * 1000) / 10; }
    return { valor, serie, delta };
  }
  /** Si el último mes está incompleto (los datos llegan hasta mitad de mes) se omite de la serie para no mostrar caídas falsas. */
  private _sinParcial(ks: string[], campo: string) {
    const [c, t] = campo.split(':'); if (t !== 'mes' || !ks.length) return; let max = ''; for (const r of this.registros) { const v = String(r[c] ?? '').slice(0, 10); if (v > max) max = v; }
    if (!max) return; const d = new Date(max + 'T00:00:00'); const fin = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); if (valorCampo({ [c]: max }, campo) === ks.at(-1) && d.getDate() < fin - 1) ks.pop();
  }
  private _mapa(w: Widget) {
    const rs = this._base(w, w.agrupar ?? 'codigo'); const g = agrupar(rs, w.agrupar ?? 'codigo'); const datos: Record<string, number> = {}; for (const [k, v] of g) datos[k] = medir(v, w.medida, w.campo); return datos;
  }
  private _alAgrupar(e: CustomEvent, w: Widget, id: string) { if (w.filtrar === false || w.serie) return; const k = this._labels.get(id)?.get(e.detail.nombre); if (k != null) this._toggle(w.agrupar ?? '', k); }

  private _widget(w: Widget, i: number) {
    const id = w.id ?? 'w' + i; const oscuro = this.tema === 'oscuro'; const col = Math.max(1, Math.min(12, w.col ?? 6));
    let cuerpo;
    switch (w.tipo) {
      case 'kpi': { const k = this._kpi(w); cuerpo = html`<gob-kpi .etiqueta=${w.titulo ?? ''} .valor=${k.valor} .formato=${w.formato ?? 'numero'} .unidad=${w.unidad ?? ''} .icono=${w.icono ?? ''} .color=${w.color ?? 'primario'} .serie=${k.serie} .delta=${k.delta} .meta=${w.meta} .buenoSube=${w.buenoSube ?? true} .ayuda=${w.ayuda ?? ''} .oscuro=${oscuro}></gob-kpi>`; break; }
      case 'grafica': { const g = this._grafica(w, id); const base = this.tema === 'oscuro' ? 'oscuro' : 'claro';
        cuerpo = html`<gob-grafica .tipo=${w.grafica ?? 'barras'} .datos=${g.datos} .colores=${w.colores ?? this.colores} .altura=${w.alto ?? 300} .formato=${w.formato ?? 'numero'} .unidad=${w.unidad ?? ''} .etiquetas=${!!w.etiquetas} .apilado=${!!w.apilado} .suave=${!!w.suave}
          .leyenda=${w.leyenda ?? (!!w.serie || ['torta', 'dona'].includes(w.grafica ?? ''))} .leyendaPosicion=${(w.leyendaPosicion ?? 'abajo') as 'abajo'} .umbrales=${w.umbrales} .min=${w.min ?? 0} .max=${w.max ?? 100} .resaltar=${g.resaltar} .tema=${base}
          @gob-grafica-click=${(e: CustomEvent) => this._alAgrupar(e, w, id)}></gob-grafica>`; break; }
      case 'mapa': cuerpo = html`<gob-mapa-magdalena .modo=${'coropleta'} .datos=${this._mapa(w)} .rampa=${w.rampa ?? 'azul'} .etiquetas=${(w.mapaEtiquetas ?? 'ninguna') as 'ninguna'} .formato=${w.formato ?? 'numero'} .unidad=${w.unidad ?? ''} .leyendaTitulo=${w.leyendaTitulo ?? ''} .clic=${'evento'} .detalle=${'bajo'} .seleccion=${this._f[w.agrupar ?? 'codigo'] ?? ''} .efectos=${['entrada', 'hormigas']} .tema=${this.tema}
          @gob-municipio-click=${(e: CustomEvent) => { if (w.filtrar !== false) this._toggle(w.agrupar ?? 'codigo', e.detail.codigo); }}></gob-mapa-magdalena>`; break;
      case 'tabla': { const rs = this._base(w); const filas = w.limite ? rs.slice(0, w.limite) : rs; cuerpo = html`<gob-tabla .columnas=${w.columnas ?? []} .datos=${filas} .llave=${'id'} .tema=${this.tema} .tamanoPagina=${8} .busqueda=${true} .exportar=${true} .config=${w.opciones ?? {}}></gob-tabla>`; break; }
      case 'alerta': cuerpo = html`<gob-alerta .tipo=${(w.tono ?? 'info') as 'info'} .titulo=${w.titulo ?? ''}>${w.contenido}</gob-alerta>`; break;
      default: cuerpo = html`<p class="tx">${w.contenido}</p>`;
    }
    const conTarjeta = !['kpi', 'tabla', 'alerta'].includes(w.tipo);
    return html`<section class="w ${conTarjeta ? 'c' : ''} t-${w.tipo}" style="--n:${col}" aria-label=${w.titulo ?? w.tipo}>${conTarjeta && w.titulo ? html`<header><h3>${w.titulo}</h3>${w.descripcion ? html`<p>${w.descripcion}</p>` : nothing}</header>` : nothing}${w.tipo === 'tabla' && w.titulo ? html`<header class="ht"><h3>${w.titulo}</h3></header>` : nothing}${cuerpo}</section>`;
  }

  render() {
    const act = Object.entries(this._f).filter(([, v]) => v !== '');
    return html`<div class="d" part="tablero">
      <header class="h"><div><h2>${this.titulo}</h2>${this.subtitulo ? html`<p>${this.subtitulo}</p>` : nothing}</div>
        <div class="ac"><button type="button" class="bt" @click=${() => this.descargarCSV()}>${icono('descargar', 16)}<span>CSV</span></button><button type="button" class="bt" @click=${() => this.imprimir()}>${icono('imprimir', 16)}<span>Imprimir</span></button></div></header>
      ${this.filtros.length ? html`<div class="fl" role="group" aria-label="Filtros del tablero">${this.filtros.map((f) => html`<label><span>${f.etiqueta ?? f.campo}</span><select @change=${(e: Event) => this._setF(f.campo, (e.target as HTMLSelectElement).value)}>
        <option value="">${f.todos ?? 'Todos'}</option>${this._opciones(f).map((o) => html`<option value=${o.valor} .selected=${this._f[f.campo] === o.valor}>${o.etiqueta}</option>`)}</select></label>`)}
        ${act.length ? html`<button type="button" class="bt lim" @click=${() => this.reiniciar()}>${icono('filtro-quitar', 16)}<span>Restablecer</span></button>` : nothing}</div>` : nothing}
      ${act.length ? html`<div class="ch" aria-live="polite">${act.map(([c, v]) => html`<span class="chip">${(this.filtros.find((f) => f.campo === c)?.etiqueta ?? c)}: <b>${etiquetaClave(c, v)}</b><button type="button" aria-label=${`Quitar filtro ${c}`} @click=${() => this._setF(c, '')}>${icono('cerrar', 12)}</button></span>`)}<span class="rs">${this._filtrar().length} de ${this.registros.length} registros</span></div>` : nothing}
      <div class="g">${this.widgets.map((w, i) => this._widget(w, i))}</div></div>`;
  }
  static styles = css`
    :host { display: block; font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); color: #252B36; container-type: inline-size; } :host([tema='oscuro']) { color: #E3E8EF; background: #051220; padding: 1rem; border-radius: 14px; } svg { display: block; }
    .h { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: .9rem; } h2 { margin: 0; font-size: 1.5rem; font-weight: 800; letter-spacing: -.01em; color: #161A22; } :host([tema='oscuro']) h2 { color: #fff; } .h p { margin: .15rem 0 0; color: #6B7482; font-size: .9rem; }
    .ac { display: flex; gap: .4rem; } .bt { display: inline-flex; align-items: center; gap: .4rem; border: 1px solid #CBD2DC; background: #fff; border-radius: 8px; padding: .45rem .75rem; font: 600 .8125rem inherit; font-family: inherit; color: #252B36; cursor: pointer; } .bt:hover { background: #F1F4F8; } .bt:focus-visible, select:focus-visible, .chip button:focus-visible { outline: 2px solid #0071BB; outline-offset: 2px; } :host([tema='oscuro']) .bt { background: #0B2239; border-color: #1B4B75; color: #E3E8EF; }
    .fl { display: flex; flex-wrap: wrap; gap: .75rem; align-items: end; padding: .8rem 1rem; background: rgba(255,255,255,.72); backdrop-filter: blur(10px); border: 1px solid #E3E8EF; border-radius: 12px; margin-bottom: .75rem; } :host([tema='oscuro']) .fl { background: rgba(11,34,57,.7); border-color: #12395C; }
    .fl label { display: grid; gap: .2rem; font-size: .72rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: #4F5866; } :host([tema='oscuro']) .fl label { color: #97A1B0; } select { font: 500 .85rem inherit; font-family: inherit; padding: .45rem .6rem; border: 1px solid #CBD2DC; border-radius: 8px; background: #fff; color: #252B36; min-width: 10rem; text-transform: none; letter-spacing: 0; } :host([tema='oscuro']) select { background: #0B2239; color: #E3E8EF; border-color: #1B4B75; }
    .ch { display: flex; flex-wrap: wrap; gap: .4rem; align-items: center; margin-bottom: .75rem; font-size: .8rem; } .chip { display: inline-flex; align-items: center; gap: .35rem; background: #D6E8F4; color: #003D66; border-radius: 99px; padding: .2rem .35rem .2rem .7rem; } .chip button { border: 0; background: rgba(0,61,102,.12); border-radius: 50%; width: 1.3rem; height: 1.3rem; display: grid; place-items: center; cursor: pointer; color: inherit; padding: 0; } .rs { color: #6B7482; margin-left: .4rem; }
    .g { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 1rem; } .w { grid-column: span var(--n); min-width: 0; } .w.c { background: #fff; border: 1px solid #E3E8EF; border-radius: 12px; padding: 1rem 1.1rem; box-shadow: 0 1px 2px rgba(8,26,44,.06); } :host([tema='oscuro']) .w.c { background: #0B2239; border-color: #12395C; }
    .w header h3 { margin: 0; font-size: 1rem; font-weight: 700; color: #161A22; } :host([tema='oscuro']) .w header h3 { color: #fff; } .w header p { margin: .15rem 0 .4rem; font-size: .8rem; color: #6B7482; } .ht h3 { margin: 0 0 .5rem; font-size: 1rem; font-weight: 700; } .tx { margin: 0; line-height: 1.6; }
    @container (max-width: 900px) { .w { grid-column: span 12; } .w.t-kpi { grid-column: span 6; } } @container (max-width: 520px) { .w.t-kpi { grid-column: span 12; } .h h2 { font-size: 1.25rem; } select { min-width: 8rem; } }
    @media print { .fl, .ac { display: none; } .w { break-inside: avoid; } :host { color: #000; } }`;
}
if (!customElements.get('gob-dashboard')) customElements.define('gob-dashboard', GobDashboard);
declare global { interface HTMLElementTagNameMap { 'gob-dashboard': GobDashboard } }
