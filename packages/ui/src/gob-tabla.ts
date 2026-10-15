import { LitElement, html, css, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { icono } from './lib/icono.js';
import { formatoNumero } from './lib/mapa-recursos.js';

/* ============================================================================
   <gob-tabla>  ·  Tabla de datos accesible (HTML nativo <table>): búsqueda, filtros por columna, orden,
   selección, acciones por fila y masivas, paginación (local o de servidor), totales, columnas visibles,
   exportar CSV / copiar / imprimir y vista de tarjetas en móvil.
   ============================================================================ */
export type EstadoColor = 'exito' | 'aviso' | 'peligro' | 'info' | 'neutro' | 'primario' | 'violeta';
export interface Columna {
  campo: string; titulo?: string; tipo?: 'texto' | 'numero' | 'cop' | 'porcentaje' | 'fecha' | 'estado' | 'booleano' | 'enlace' | 'barra';
  ancho?: string; alinear?: 'izq' | 'centro' | 'der'; nowrap?: boolean; ordenable?: boolean; filtrable?: boolean; oculta?: boolean;
  estados?: Record<string, EstadoColor>; semaforo?: { verde: number; amarillo: number; invertir?: boolean }; enlace?: string; total?: 'suma' | 'promedio' | 'conteo' | 'min' | 'max';
  decimales?: number; maximo?: number; render?: (valor: unknown, fila: any) => string;
}
export interface Accion { id: string; etiqueta: string; icono?: string; tipo?: 'normal' | 'primario' | 'peligro'; }
type Orden = { campo: string; dir: 'asc' | 'desc' } | null;
const jsonConv = { fromAttribute: (v: string | null) => { try { return v ? JSON.parse(v) : undefined; } catch { return undefined; } }, toAttribute: (v: unknown) => JSON.stringify(v) };
const norm = (s: unknown) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const get = (o: any, p: string) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
const COL: Record<EstadoColor, [string, string]> = { exito: ['#E1F1DF', '#2C5A26'], aviso: ['#FFF3C2', '#6D5600'], peligro: ['#FFE0E7', '#8A0022'], info: ['#CCF1F8', '#00566A'], neutro: ['#ECEFF4', '#3A424F'], primario: ['#D6E8F4', '#004F82'], violeta: ['#EDE5FA', '#3F1288'] };
const fFecha = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' });

export class GobTabla extends LitElement {
  static properties = {
    columnas: { converter: jsonConv }, datos: { converter: jsonConv }, llave: { type: String }, titulo: { type: String }, descripcion: { type: String },
    busqueda: { type: Boolean }, filtrosColumna: { attribute: 'filtros-columna', type: Boolean }, ordenInicial: { attribute: 'orden-inicial', converter: jsonConv },
    paginacion: { type: Boolean }, tamanoPagina: { attribute: 'tamano-pagina', type: Number }, opcionesTamano: { attribute: 'opciones-tamano', converter: jsonConv },
    seleccion: { type: String }, acciones: { converter: jsonConv }, accionesMasivas: { attribute: 'acciones-masivas', converter: jsonConv },
    exportar: { type: Boolean }, selectorColumnas: { attribute: 'selector-columnas', type: Boolean }, densidad: { type: String, reflect: true }, zebra: { type: Boolean, reflect: true },
    cargando: { type: Boolean }, vacio: { type: String }, modoServidor: { attribute: 'modo-servidor', type: Boolean }, totalFilas: { attribute: 'total-filas', type: Number },
    totales: { type: Boolean }, alturaMax: { attribute: 'altura-max', type: Number }, filaClicable: { attribute: 'fila-clicable', type: Boolean }, tema: { type: String, reflect: true }, tarjetas: { type: String, reflect: true },
    _q: { state: true }, _filtros: { state: true }, _orden: { state: true }, _pag: { state: true }, _tam: { state: true }, _sel: { state: true }, _verFiltros: { state: true }, _ocultas: { state: true }, _menu: { state: true }, _aviso: { state: true }, _imp: { state: true },
  };
  declare columnas: Columna[]; declare datos: any[]; declare llave: string; declare titulo: string; declare descripcion: string; declare busqueda: boolean; declare filtrosColumna: boolean;
  declare ordenInicial?: Orden; declare paginacion: boolean; declare tamanoPagina: number; declare opcionesTamano: number[]; declare seleccion: 'ninguna' | 'una' | 'multiple';
  declare acciones?: Accion[]; declare accionesMasivas?: Accion[]; declare exportar: boolean; declare selectorColumnas: boolean; declare densidad: 'compacta' | 'normal' | 'amplia'; declare zebra: boolean;
  declare cargando: boolean; declare vacio: string; declare modoServidor: boolean; declare totalFilas: number; declare totales: boolean; declare alturaMax: number; declare filaClicable: boolean;
  declare tema: 'claro' | 'oscuro'; declare tarjetas: 'auto' | 'siempre' | 'nunca';
  declare _q: string; declare _filtros: Record<string, string>; declare _orden: Orden; declare _pag: number; declare _tam: number; declare _sel: Set<unknown>; declare _verFiltros: boolean; declare _ocultas: Set<string>; declare _menu: string; declare _aviso: string; declare _imp: boolean;
  private _proc: any[] = []; private _tq = 0; private _vistos = false;

  constructor() {
    super();
    this.columnas = []; this.datos = []; this.llave = 'id'; this.titulo = ''; this.descripcion = ''; this.busqueda = true; this.filtrosColumna = false; this.paginacion = true; this.tamanoPagina = 10; this.opcionesTamano = [5, 10, 25, 50, 100];
    this.seleccion = 'ninguna'; this.exportar = true; this.selectorColumnas = true; this.densidad = 'normal'; this.zebra = false; this.cargando = false; this.vacio = 'No hay datos para mostrar.'; this.modoServidor = false; this.totalFilas = 0;
    this.totales = false; this.alturaMax = 0; this.filaClicable = false; this.tema = 'claro'; this.tarjetas = 'auto';
    this._q = ''; this._filtros = {}; this._orden = null; this._pag = 0; this._tam = 10; this._sel = new Set(); this._verFiltros = false; this._ocultas = new Set(); this._menu = ''; this._aviso = ''; this._imp = false;
    // «config» asignada antes de que el componente se cargue (carga perezosa) queda como propiedad propia: se re-aplica
    if (Object.prototype.hasOwnProperty.call(this, 'config')) { const c = (this as any).config; delete (this as any).config; (this as any).config = c; }
  }
  set config(c: Record<string, unknown>) { Object.assign(this, c); } get config(): Record<string, unknown> { return {}; }

  // ------------------------------------------------------------------ columnas y valores
  private get _cols(): Columna[] { return (this.columnas ?? []).filter((c) => !c.oculta && !this._ocultas.has(c.campo)); }
  private _t(c: Columna) { return c.titulo ?? c.campo.charAt(0).toUpperCase() + c.campo.slice(1).replace(/_/g, ' '); }
  private _num(c: Columna, v: unknown) { const n = Number(v); if (!Number.isFinite(n)) return String(v ?? ''); return c.tipo === 'cop' ? formatoNumero(n, 'cop') : c.tipo === 'porcentaje' ? formatoNumero(n, 'porcentaje') : new Intl.NumberFormat('es-CO', { maximumFractionDigits: c.decimales ?? 2 }).format(n); }
  /** Texto legible de una celda (búsqueda, filtros, exportación). */
  private _txt(c: Columna, f: any): string {
    const v = get(f, c.campo); if (v == null) return '';
    switch (c.tipo) { case 'numero': case 'cop': case 'porcentaje': case 'barra': return this._num(c, v); case 'fecha': { const d = new Date(v as string); return isNaN(+d) ? String(v) : fFecha.format(d); } case 'booleano': return v ? 'Sí' : 'No'; default: return String(v); }
  }
  private _esNum(c: Columna) { return ['numero', 'cop', 'porcentaje', 'barra'].includes(c.tipo ?? ''); }
  private _opcionesFiltro(c: Columna): string[] | null {
    if (c.tipo === 'estado' || c.tipo === 'booleano') { const u = [...new Set((this.datos ?? []).map((f) => String(get(f, c.campo) ?? '')))].filter(Boolean).sort((a, b) => a.localeCompare(b, 'es')); return u; }
    if (!c.tipo || c.tipo === 'texto') { const u = [...new Set((this.datos ?? []).map((f) => String(get(f, c.campo) ?? '')))]; return u.length <= 12 && u.length > 1 ? u.filter(Boolean).sort((a, b) => a.localeCompare(b, 'es')) : null; }
    return null;
  }
  private _coincide(c: Columna, f: any, q: string): boolean {
    const v = get(f, c.campo);
    if (this._opcionesFiltro(c)) return String(v ?? '') === q;
    if (this._esNum(c)) { const n = Number(v); const t = q.trim().replace(',', '.'); let m: RegExpMatchArray | null;
      if ((m = t.match(/^(>=|<=|>|<|=)\s*(-?[\d.]+)$/))) { const x = +m[2]; return m[1] === '>' ? n > x : m[1] === '<' ? n < x : m[1] === '>=' ? n >= x : m[1] === '<=' ? n <= x : n === x; }
      if ((m = t.match(/^(-?[\d.]+)\s*(?:-|\.\.)\s*(-?[\d.]+)$/))) return n >= +m[1] && n <= +m[2]; if (/^-?[\d.]+$/.test(t)) return n === +t; return norm(this._txt(c, f)).includes(norm(t)); }
    return norm(this._txt(c, f) + ' ' + (c.tipo === 'fecha' ? String(v) : '')).includes(norm(q));
  }
  private _cmp(c: Columna, a: any, b: any): number {
    const x = get(a, c.campo), y = get(b, c.campo); if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1;
    if (this._esNum(c)) return Number(x) - Number(y); if (c.tipo === 'fecha') return +new Date(x) - +new Date(y); if (c.tipo === 'booleano') return Number(!!x) - Number(!!y);
    return String(x).localeCompare(String(y), 'es', { numeric: true, sensitivity: 'base' });
  }

  // ------------------------------------------------------------------ ciclo de vida
  connectedCallback() { super.connectedCallback(); this._tam = this.tamanoPagina || 10; if (this.ordenInicial && !this._orden) this._orden = this.ordenInicial; }
  willUpdate(ch: PropertyValues) {
    if (ch.has('tamanoPagina') && this.tamanoPagina) this._tam = this.tamanoPagina;
    if (ch.has('ordenInicial') && this.ordenInicial) this._orden = this.ordenInicial;
    if (ch.has('datos') || ch.has('columnas') || ch.has('_q') || ch.has('_filtros') || ch.has('_orden') || ch.has('modoServidor') || ch.has('totalFilas')) {
      if (this.modoServidor) this._proc = this.datos ?? [];
      else {
        let f = [...(this.datos ?? [])]; const cols = this.columnas ?? [];
        if (this._q.trim()) { const q = norm(this._q); f = f.filter((r) => this._cols.some((c) => norm(this._txt(c, r)).includes(q))); }
        for (const [campo, q] of Object.entries(this._filtros)) { if (!q) continue; const c = cols.find((x) => x.campo === campo); if (c) f = f.filter((r) => this._coincide(c, r, q)); }
        const o = this._orden; if (o) { const c = cols.find((x) => x.campo === o.campo); if (c) f.sort((a, b) => this._cmp(c, a, b) * (o.dir === 'asc' ? 1 : -1)); }
        this._proc = f;
      }
      if (ch.has('_q') || ch.has('_filtros')) { this._pag = 0; this._anunciar(); }
    }
  }
  updated(ch: PropertyValues) {
    if (!this._vistos && this.modoServidor) { this._vistos = true; this._consultar(); }
    if (ch.has('datos') && this.seleccion !== 'ninguna' && this._sel.size && !this.modoServidor) { const k = new Set((this.datos ?? []).map((f) => get(f, this.llave))); this._sel = new Set([...this._sel].filter((x) => k.has(x))); }
  }
  private _anunciar() { clearTimeout(this._tq); this._tq = window.setTimeout(() => { this._aviso = `${this._total} resultado${this._total === 1 ? '' : 's'}`; }, 400); }
  private get _total() { return this.modoServidor ? this.totalFilas || (this.datos?.length ?? 0) : this._proc.length; }
  private get _paginas() { return this.paginacion ? Math.max(1, Math.ceil(this._total / this._tam)) : 1; }
  private get _visibles(): any[] { if (this.modoServidor || !this.paginacion || this._imp) return this._proc; const a = this._pag * this._tam; return this._proc.slice(a, a + this._tam); }

  // ------------------------------------------------------------------ eventos / acciones
  private _emitir(n: string, d: unknown) { this.dispatchEvent(new CustomEvent(n, { detail: d, bubbles: true, composed: true })); }
  private _consultar() { if (!this.modoServidor) return; clearTimeout(this._tq); this._tq = window.setTimeout(() => this._emitir('gob-tabla-consulta', { pagina: this._pag + 1, tamano: this._tam, orden: this._orden, busqueda: this._q, filtros: { ...this._filtros } }), 250); }
  private _ordenar(c: Columna) {
    const o = this._orden; this._orden = !o || o.campo !== c.campo ? { campo: c.campo, dir: 'asc' } : o.dir === 'asc' ? { campo: c.campo, dir: 'desc' } : null;
    this._emitir('gob-tabla-orden', this._orden); if (this.modoServidor) this._consultar();
  }
  private _setQ(v: string) { this._q = v; this._emitir('gob-tabla-filtro', { busqueda: v, filtros: this._filtros }); if (this.modoServidor) { this._pag = 0; this._consultar(); } }
  private _setF(campo: string, v: string) { this._filtros = { ...this._filtros, [campo]: v }; this._emitir('gob-tabla-filtro', { busqueda: this._q, filtros: this._filtros }); if (this.modoServidor) { this._pag = 0; this._consultar(); } }
  limpiarFiltros() { this._q = ''; this._filtros = {}; if (this.modoServidor) this._consultar(); }
  private _ir(p: number) { this._pag = Math.max(0, Math.min(this._paginas - 1, p)); this._emitir('gob-tabla-pagina', { pagina: this._pag + 1, tamano: this._tam }); if (this.modoServidor) this._consultar(); }
  private _llave(f: any) { return get(f, this.llave); }
  private _selEmit() { const llaves = [...this._sel]; this._emitir('gob-tabla-seleccion', { llaves, filas: (this.datos ?? []).filter((f) => this._sel.has(this._llave(f))) }); }
  private _selFila(f: any, on: boolean) { const k = this._llave(f); if (this.seleccion === 'una') this._sel = new Set(on ? [k] : []); else { const s = new Set(this._sel); on ? s.add(k) : s.delete(k); this._sel = s; } this._selEmit(); }
  private _selPagina(on: boolean) { const s = new Set(this._sel); for (const f of this._visibles) on ? s.add(this._llave(f)) : s.delete(this._llave(f)); this._sel = s; this._selEmit(); }
  seleccionarTodo() { this._sel = new Set(this._proc.map((f) => this._llave(f))); this._selEmit(); }
  seleccionar(llaves: unknown[]) { this._sel = new Set(llaves); this._selEmit(); } limpiarSeleccion() { this._sel = new Set(); this._selEmit(); }
  private _accion(a: Accion, fila?: any) { this._menu = ''; if (fila) this._emitir('gob-tabla-accion', { accion: a.id, fila }); else this._emitir('gob-tabla-accion', { accion: a.id, filas: (this.datos ?? []).filter((f) => this._sel.has(this._llave(f))), llaves: [...this._sel] }); }
  get filasFiltradas() { return this._proc; }

  // ------------------------------------------------------------------ exportación
  private _matriz(): string[][] { const cols = this._cols; return [cols.map((c) => this._t(c)), ...this._proc.map((f) => cols.map((c) => { const v = get(f, c.campo); return this._esNum(c) && v != null ? String(v) : this._txt(c, f); }))]; }
  csv(): string { return this._matriz().map((r) => r.map((x) => `"${x.replace(/"/g, '""')}"`).join(';')).join('\n'); }
  exportarCSV(nombre = 'tabla') { const b = new Blob(['﻿' + this.csv()], { type: 'text/csv;charset=utf-8' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = nombre + '.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); this._emitir('gob-tabla-exportar', { formato: 'csv', filas: this._proc.length }); }
  async copiar() { try { await navigator.clipboard.writeText(this._matriz().map((r) => r.join('\t')).join('\n')); this._aviso = 'Tabla copiada al portapapeles'; } catch { this._aviso = 'No se pudo copiar'; } this._emitir('gob-tabla-exportar', { formato: 'copiar', filas: this._proc.length }); }
  async imprimir() { this._imp = true; await this.updateComplete; const fin = () => { this._imp = false; window.removeEventListener('afterprint', fin); }; window.addEventListener('afterprint', fin); window.print(); }

  // ------------------------------------------------------------------ celdas
  private _celda(c: Columna, f: any): TemplateResult | string {
    const v = get(f, c.campo);
    if (c.render) return html`${unsafeHTML(c.render(v, f))}`; if (v == null || v === '') return html`<span class="nd">—</span>`;
    switch (c.tipo) {
      case 'estado': { const k = (c.estados?.[String(v)] ?? 'neutro') as EstadoColor; const [bg, fg] = COL[k] ?? COL.neutro; return html`<span class="b" style="background:${bg};color:${fg}"><i style="background:${fg}"></i>${v}</span>`; }
      case 'booleano': return v ? html`<span class="si" title="Sí">${icono('check-circulo', 18)}<span class="sr">Sí</span></span>` : html`<span class="nd">—<span class="sr">No</span></span>`;
      case 'enlace': { const u = (c.enlace ?? '{v}').replace('{v}', encodeURIComponent(String(v))).replace(/\{(\w+)\}/g, (_m, k) => encodeURIComponent(String(get(f, k) ?? ''))); return html`<a href=${u} target="_blank" rel="noopener">${v}</a>`; }
      case 'barra': { const max = c.maximo ?? 1; const p = Math.max(0, Math.min(100, (Number(v) / max) * 100)); return html`<span class="br"><span class="bb"><i style="width:${p}%"></i></span><span>${this._txt(c, f)}</span></span>`; }
      case 'numero': case 'cop': case 'porcentaje': case 'fecha': default: {
        const t = this._txt(c, f);
        if (c.semaforo && this._esNum(c)) { const n = Number(v), s = c.semaforo; const ok = s.invertir ? n <= s.verde : n >= s.verde, mid = s.invertir ? n <= s.amarillo : n >= s.amarillo; const col = ok ? '#3F7A37' : mid ? '#B58900' : '#B20028'; return html`<span class="sm"><i style="background:${col}"></i>${t}</span>`; }
        return t;
      }
    }
  }
  private _totalDe(c: Columna): string {
    if (!c.total) return ''; const v = this._proc.map((f) => Number(get(f, c.campo))).filter((n) => Number.isFinite(n)); if (!v.length && c.total !== 'conteo') return '';
    const r = c.total === 'suma' ? v.reduce((a, b) => a + b, 0) : c.total === 'promedio' ? v.reduce((a, b) => a + b, 0) / v.length : c.total === 'conteo' ? this._proc.length : c.total === 'min' ? Math.min(...v) : Math.max(...v);
    return c.total === 'conteo' ? String(r) : this._num(c, r);
  }

  // ------------------------------------------------------------------ render
  private _barra() {
    const sel = this._sel.size, cols = this.columnas ?? [];
    return html`<div class="tb" part="barra">
      ${this.busqueda ? html`<label class="q">${icono('buscar', 16)}<input type="search" placeholder="Buscar…" aria-label="Buscar en la tabla" .value=${this._q} @input=${(e: Event) => this._setQ((e.target as HTMLInputElement).value)}></label>` : nothing}
      <button type="button" class="bt ${this._verFiltros ? 'on' : ''}" aria-pressed=${this._verFiltros} @click=${() => (this._verFiltros = !this._verFiltros)}>${icono('filtro', 16)}<span>Filtros</span></button>
      ${this._q || Object.values(this._filtros).some(Boolean) ? html`<button type="button" class="bt" @click=${() => this.limpiarFiltros()}>${icono('filtro-quitar', 16)}<span>Limpiar</span></button>` : nothing}
      <span class="sp"></span><slot name="herramientas"></slot>
      ${this.selectorColumnas ? html`<span class="mn"><button type="button" class="bt" aria-haspopup="true" aria-expanded=${this._menu === 'cols'} @click=${() => (this._menu = this._menu === 'cols' ? '' : 'cols')}>${icono('columnas', 16)}<span>Columnas</span></button>
        ${this._menu === 'cols' ? html`<div class="pop" role="group" aria-label="Columnas visibles">${cols.filter((c) => !c.oculta).map((c) => html`<label><input type="checkbox" .checked=${!this._ocultas.has(c.campo)} @change=${(e: Event) => { const s = new Set(this._ocultas); (e.target as HTMLInputElement).checked ? s.delete(c.campo) : s.add(c.campo); this._ocultas = s; }}> ${this._t(c)}</label>`)}</div>` : nothing}</span>` : nothing}
      ${this.exportar ? html`<span class="mn"><button type="button" class="bt" aria-haspopup="true" aria-expanded=${this._menu === 'exp'} @click=${() => (this._menu = this._menu === 'exp' ? '' : 'exp')}>${icono('descargar', 16)}<span>Exportar</span></button>
        ${this._menu === 'exp' ? html`<div class="pop" role="menu"><button role="menuitem" type="button" @click=${() => { this.exportarCSV(this.titulo ? norm(this.titulo).replace(/\W+/g, '-') : 'tabla'); this._menu = ''; }}>${icono('hoja', 16)} Excel (CSV)</button><button role="menuitem" type="button" @click=${() => { this.copiar(); this._menu = ''; }}>${icono('copiar', 16)} Copiar</button><button role="menuitem" type="button" @click=${() => { this._menu = ''; this.imprimir(); }}>${icono('imprimir', 16)} Imprimir / PDF</button></div>` : nothing}</span>` : nothing}
    </div>
    ${sel && this.seleccion !== 'ninguna' ? html`<div class="ms" role="region" aria-label="Acciones sobre la selección"><b>${sel} seleccionada${sel === 1 ? '' : 's'}</b>
      ${this.seleccion === 'multiple' && this._proc.length > this._visibles.length && sel < this._proc.length ? html`<button type="button" class="ln" @click=${() => this.seleccionarTodo()}>Seleccionar los ${this._proc.length}</button>` : nothing}
      <button type="button" class="ln" @click=${() => this.limpiarSeleccion()}>Quitar selección</button><span class="sp"></span>
      ${(this.accionesMasivas ?? []).map((a) => html`<button type="button" class="bt ${a.tipo === 'peligro' ? 'pel' : a.tipo === 'primario' ? 'pri' : ''}" @click=${() => this._accion(a)}>${icono(a.icono, 16)}<span>${a.etiqueta}</span></button>`)}</div>` : nothing}`;
  }
  private _fila(f: any, cols: Columna[]) {
    const k = this._llave(f), on = this._sel.has(k); const nombre = String(get(f, cols[0]?.campo ?? this.llave) ?? k); const ac = this.acciones ?? [];
    return html`<tr class=${on ? 'sel' : ''} tabindex=${this.filaClicable ? 0 : nothing} @click=${this.filaClicable ? () => this._emitir('gob-tabla-fila-clic', { fila: f }) : nothing} @keydown=${this.filaClicable ? (e: KeyboardEvent) => { if (e.key === 'Enter' && e.target === e.currentTarget) this._emitir('gob-tabla-fila-clic', { fila: f }); } : nothing}>
      ${this.seleccion !== 'ninguna' ? html`<td class="ck" data-label=""><input type=${this.seleccion === 'una' ? 'radio' : 'checkbox'} name="sel" aria-label=${`Seleccionar ${nombre}`} .checked=${on} @click=${(e: Event) => e.stopPropagation()} @change=${(e: Event) => this._selFila(f, (e.target as HTMLInputElement).checked)}></td>` : nothing}
      ${cols.map((c) => html`<td class="a-${c.alinear ?? (this._esNum(c) ? 'der' : 'izq')} ${c.nowrap ?? (!!c.tipo && c.tipo !== 'texto') ? 'nw' : ''}" data-label=${this._t(c)}>${this._celda(c, f)}</td>`)}
      ${ac.length ? html`<td class="ac" data-label="Acciones" @click=${(e: Event) => e.stopPropagation()}><span class="ab">${ac.slice(0, ac.length > 3 ? 2 : 3).map((a) => html`<button type="button" class="ib ${a.tipo === 'peligro' ? 'pel' : ''}" title=${a.etiqueta} aria-label=${`${a.etiqueta}: ${nombre}`} @click=${() => this._accion(a, f)}>${icono(a.icono ?? 'mas-opciones', 16)}</button>`)}
        ${ac.length > 3 ? html`<span class="mn"><button type="button" class="ib" aria-haspopup="true" aria-label=${`Más acciones: ${nombre}`} aria-expanded=${this._menu === 'f' + k} @click=${() => (this._menu = this._menu === 'f' + k ? '' : 'f' + k)}>${icono('mas-opciones', 16)}</button>
          ${this._menu === 'f' + k ? html`<div class="pop der" role="menu">${ac.slice(2).map((a) => html`<button role="menuitem" type="button" class=${a.tipo === 'peligro' ? 'pel' : ''} @click=${() => this._accion(a, f)}>${icono(a.icono, 16)} ${a.etiqueta}</button>`)}</div>` : nothing}</span>` : nothing}</span></td>` : nothing}</tr>`;
  }
  private _pie() {
    if (!this.paginacion) return html`<div class="pg"><span class="inf">${this._total} fila${this._total === 1 ? '' : 's'}</span></div>`;
    const ini = this._total ? this._pag * this._tam + 1 : 0, fin = Math.min(this._total, (this._pag + 1) * this._tam), np = this._paginas;
    const w: number[] = []; const a = Math.max(0, Math.min(this._pag - 2, np - 5)); for (let i = a; i < Math.min(np, a + 5); i++) w.push(i);
    return html`<div class="pg" part="paginacion"><span class="inf">${ini}–${fin} de ${this._total}</span>
      <label class="tm">Filas <select aria-label="Filas por página" @change=${(e: Event) => { this._tam = Number((e.target as HTMLSelectElement).value); this._pag = 0; this._emitir('gob-tabla-pagina', { pagina: 1, tamano: this._tam }); if (this.modoServidor) this._consultar(); }}>${(this.opcionesTamano ?? [10]).map((n) => html`<option .selected=${n === this._tam} value=${n}>${n}</option>`)}</select></label><span class="sp"></span>
      <nav class="nv" aria-label="Paginación"><button type="button" class="ib" aria-label="Primera página" ?disabled=${this._pag === 0} @click=${() => this._ir(0)}>${icono('chevron-doble-izquierda', 16)}</button><button type="button" class="ib" aria-label="Página anterior" ?disabled=${this._pag === 0} @click=${() => this._ir(this._pag - 1)}>${icono('chevron-izquierda', 16)}</button>
        ${w.map((i) => html`<button type="button" class="pn ${i === this._pag ? 'on' : ''}" aria-label=${`Página ${i + 1}`} aria-current=${i === this._pag ? 'page' : nothing} @click=${() => this._ir(i)}>${i + 1}</button>`)}
        <button type="button" class="ib" aria-label="Página siguiente" ?disabled=${this._pag >= np - 1} @click=${() => this._ir(this._pag + 1)}>${icono('chevron-derecha', 16)}</button><button type="button" class="ib" aria-label="Última página" ?disabled=${this._pag >= np - 1} @click=${() => this._ir(np - 1)}>${icono('chevron-doble-derecha', 16)}</button></nav></div>`;
  }
  render() {
    const cols = this._cols, vis = this._visibles; const nSel = this.seleccion !== 'ninguna'; const todosPag = vis.length > 0 && vis.every((f) => this._sel.has(this._llave(f))); const algunos = vis.some((f) => this._sel.has(this._llave(f)));
    const ncol = cols.length + (nSel ? 1 : 0) + ((this.acciones ?? []).length ? 1 : 0);
    return html`<div class="w ${this.tarjetas === 'siempre' ? 'tj' : ''}" part="tabla" @click=${(e: Event) => { if (this._menu && !(e.target as Element).closest?.('.mn')) this._menu = ''; }}>
      ${this._barra()}
      <div class="sc" style=${this.alturaMax ? `max-height:${this.alturaMax}px` : ''} tabindex="0" role="region" aria-label=${this.titulo || 'Tabla de datos'}>
        <table aria-busy=${this.cargando} aria-rowcount=${this._total}>
          ${this.titulo || this.descripcion ? html`<caption class="${this.titulo ? 'cap' : 'sr'}">${this.titulo}${this.descripcion ? html`<small>${this.descripcion}</small>` : nothing}</caption>` : nothing}
          <thead><tr>
            ${nSel ? html`<th class="ck" scope="col">${this.seleccion === 'multiple' ? html`<input type="checkbox" aria-label="Seleccionar todas las filas de la página" .checked=${todosPag} .indeterminate=${algunos && !todosPag} @change=${(e: Event) => this._selPagina((e.target as HTMLInputElement).checked)}>` : html`<span class="sr">Selección</span>`}</th>` : nothing}
            ${cols.map((c) => { const o = this._orden?.campo === c.campo ? this._orden.dir : null; const ord = c.ordenable !== false;
              return html`<th scope="col" class="a-${c.alinear ?? (this._esNum(c) ? 'der' : 'izq')}" style=${c.ancho ? `width:${c.ancho}` : ''} aria-sort=${o ? (o === 'asc' ? 'ascending' : 'descending') : ord ? 'none' : nothing}>${ord ? html`<button type="button" class="so" @click=${() => this._ordenar(c)}><span>${this._t(c)}</span>${icono(o === 'asc' ? 'flecha-arriba' : o === 'desc' ? 'flecha-abajo' : 'ordenar', 14)}</button>` : this._t(c)}</th>`; })}
            ${(this.acciones ?? []).length ? html`<th scope="col" class="ac">Acciones</th>` : nothing}</tr>
            ${this._verFiltros ? html`<tr class="fl">${nSel ? html`<th></th>` : nothing}${cols.map((c) => { const op = c.filtrable === false ? null : this._opcionesFiltro(c);
              return html`<th>${c.filtrable === false ? nothing : op ? html`<select aria-label=${`Filtrar por ${this._t(c)}`} @change=${(e: Event) => this._setF(c.campo, (e.target as HTMLSelectElement).value)}><option value="">Todos</option>${op.map((o2) => html`<option value=${o2} .selected=${this._filtros[c.campo] === o2}>${o2}</option>`)}</select>` : html`<input type="text" aria-label=${`Filtrar por ${this._t(c)}`} placeholder=${this._esNum(c) ? '>10, 5-20' : 'Filtrar…'} .value=${this._filtros[c.campo] ?? ''} @input=${(e: Event) => this._setF(c.campo, (e.target as HTMLInputElement).value)}>`}</th>`; })}${(this.acciones ?? []).length ? html`<th></th>` : nothing}</tr>` : nothing}</thead>
          <tbody>${this.cargando ? Array.from({ length: Math.min(this._tam, 5) }, () => html`<tr class="skl">${Array.from({ length: ncol }, () => html`<td><i></i></td>`)}</tr>`)
            : vis.length ? repeat(vis, (f) => this._llave(f), (f) => this._fila(f, cols))
            : html`<tr class="vc"><td colspan=${ncol}><div class="ev"><slot name="vacio">${icono('buscar', 28)}<p>${this._q || Object.values(this._filtros).some(Boolean) ? 'Ningún resultado coincide con la búsqueda.' : this.vacio}</p></slot></div></td></tr>`}</tbody>
          ${this.totales && cols.some((c) => c.total) && vis.length ? html`<tfoot><tr>${nSel ? html`<td></td>` : nothing}${cols.map((c, i) => html`<td class="a-${c.alinear ?? (this._esNum(c) ? 'der' : 'izq')}" data-label=${this._t(c)}>${i === 0 && !c.total ? 'Total' : this._totalDe(c)}</td>`)}${(this.acciones ?? []).length ? html`<td></td>` : nothing}</tr></tfoot>` : nothing}
        </table></div>
      ${this._pie()}<div class="sr" role="status" aria-live="polite">${this._aviso}</div></div>`;
  }

  static styles = css`
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
if (!customElements.get('gob-tabla')) customElements.define('gob-tabla', GobTabla);
declare global { interface HTMLElementTagNameMap { 'gob-tabla': GobTabla } }
