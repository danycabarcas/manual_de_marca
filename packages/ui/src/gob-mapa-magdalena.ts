import { LitElement, html, svg, css, nothing, type PropertyValues } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { RAMPAS, ICONOS, colorEnRampa, textoSobre, calcularClases, claseDe, formatoNumero, type Clase } from './lib/mapa-recursos.js';

/* ============================================================================
   <gob-mapa-magdalena>  ·  Mapa interactivo del Magdalena (30 municipios, código DIVIPOLA)
   Renderizado SVG sin dependencias (tiles opcionales en una fase posterior).
   ============================================================================ */

interface Municipio { codigo: string; nombre: string; subregion: string; centro: [number, number]; lonlat: [number, number]; bbox: [number, number, number, number]; d: string }
interface Pack {
  meta: { viewBox: number[]; bbox: number[]; proyeccion: { lat0: number; escala: number }; nivel: string };
  subregiones: { id: string; nombre: string; color: string; municipios: string[] }[];
  contorno: string;
  municipios: Municipio[];
}
export interface Marcador { id?: string; codigo?: string; lonlat?: [number, number]; nombre?: string; categoria?: string; color?: string; icono?: string; efecto?: 'ninguno' | 'pulso' | 'ping' | 'radar'; tamano?: number; etiqueta?: boolean; valor?: number; url?: string }
export interface Linea { desde: string | [number, number]; hasta: string | [number, number]; color?: string; ancho?: number; estilo?: 'solido' | 'guion' | 'flujo' | 'dibujar'; curva?: number; particulas?: boolean; etiqueta?: string }

const cache = new Map<string, Promise<Pack>>();
const BASE = new URL('../datos/', import.meta.url).href;
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const listaConv = { fromAttribute: (v: string | null) => (v ? v.split(/[\s,]+/).filter(Boolean) : []), toAttribute: (v: string[]) => v.join(',') };
const jsonConv = { fromAttribute: (v: string | null) => { try { return v ? JSON.parse(v) : undefined; } catch { return undefined; } }, toAttribute: (v: unknown) => JSON.stringify(v) };

export class GobMapaMagdalena extends LitElement {
  static properties = {
    detalle: { type: String },
    modo: { type: String },
    datos: { converter: jsonConv },
    categorias: { converter: jsonConv },
    coloresCategorias: { attribute: 'colores-categorias', converter: jsonConv },
    coloresSubregiones: { attribute: 'colores-subregiones', converter: jsonConv },
    rampa: { converter: { fromAttribute: (v: string | null) => { if (!v) return 'azul'; return v.trim().startsWith('[') ? JSON.parse(v) : v; } } },
    clases: { type: Number },
    escala: { type: String },
    etiquetas: { type: String },
    etiquetasAuto: { attribute: 'etiquetas-auto', type: Boolean },
    leyenda: { type: Boolean },
    leyendaTitulo: { attribute: 'leyenda-titulo', type: String },
    tooltip: { type: Boolean },
    tooltipFormato: { attribute: 'tooltip-formato', type: String },
    seleccion: { type: String, reflect: true },
    multiple: { type: Boolean },
    clic: { type: String },
    enlace: { type: String },
    marcadores: { converter: jsonConv },
    lineas: { converter: jsonConv },
    efectos: { converter: listaConv },
    tema: { type: String, reflect: true },
    zoom: { type: Boolean },
    zoomRueda: { attribute: 'zoom-rueda', type: Boolean },
    controles: { type: Boolean },
    titulo: { type: String },
    descripcion: { type: String },
    formato: { type: String },
    unidad: { type: String },
    srcDatos: { attribute: 'src-datos', type: String },
    filtroSubregion: { attribute: 'filtro-subregion', type: String },
    mostrarContorno: { attribute: 'mostrar-contorno', type: Boolean },
    _geo: { state: true }, _tf: { state: true }, _hover: { state: true }, _tip: { state: true }, _ppu: { state: true }, _error: { state: true },
  };

  declare detalle: 'alto' | 'medio' | 'bajo';
  declare modo: 'plano' | 'subregiones' | 'coropleta' | 'categorias';
  declare datos?: Record<string, number>;
  declare categorias?: Record<string, string>;
  declare coloresCategorias?: Record<string, string>;
  declare coloresSubregiones?: Record<string, string>;
  declare rampa: string | string[];
  declare clases: number;
  declare escala: 'lineal' | 'cuantiles';
  declare etiquetasAuto: boolean;
  declare etiquetas: 'ninguna' | 'nombres' | 'codigos' | 'valores' | 'nombres-valores';
  declare leyenda: boolean;
  declare leyendaTitulo: string;
  declare tooltip: boolean;
  declare tooltipFormato: string;
  declare seleccion: string;
  declare multiple: boolean;
  declare clic: 'seleccionar' | 'evento' | 'enlace' | 'zoom' | 'zoom-seleccionar';
  declare enlace: string;
  declare marcadores?: Marcador[];
  declare lineas?: Linea[];
  declare efectos: string[];
  declare tema: 'claro' | 'oscuro';
  declare zoom: boolean;
  declare zoomRueda: boolean;
  declare controles: boolean;
  declare titulo: string;
  declare descripcion: string;
  declare formato: string;
  declare unidad: string;
  declare srcDatos: string;
  declare filtroSubregion: string;
  declare mostrarContorno: boolean;
  declare _geo: Pack | null;
  declare _tf: { k: number; x: number; y: number };
  declare _hover: string | null;
  declare _tip: { x: number; y: number; html: string } | null;
  declare _ppu: number;
  declare _error: string;

  private _pointers = new Map<number, { x: number; y: number }>();
  private _drag: { x: number; y: number; tx: number; ty: number; moved: boolean } | null = null;
  private _pinch0: { d: number; k: number } | null = null;
  private _anim = 0;
  private _ro?: ResizeObserver;

  constructor() {
    super();
    this.detalle = 'medio'; this.modo = 'subregiones'; this.rampa = 'azul'; this.clases = 5; this.escala = 'lineal';
    this.etiquetas = 'ninguna'; this.etiquetasAuto = true; this.leyenda = true; this.leyendaTitulo = ''; this.tooltip = true;
    this.tooltipFormato = '<strong>{nombre}</strong><br><span>{subregion}</span><br>{valor}';
    this.seleccion = ''; this.multiple = false; this.clic = 'seleccionar'; this.enlace = '';
    this.efectos = ['entrada']; this.tema = 'claro'; this.zoom = true; this.zoomRueda = false; this.controles = true;
    this.titulo = 'Mapa del departamento del Magdalena'; this.descripcion = ''; this.formato = 'numero'; this.unidad = '';
    this.srcDatos = ''; this.filtroSubregion = ''; this.mostrarContorno = true;
    this._geo = null; this._tf = { k: 1, x: 0, y: 0 }; this._hover = null; this._tip = null; this._ppu = 0.5; this._error = '';
    // «config» asignada antes de que el componente se cargue (carga perezosa) queda como propiedad propia: se re-aplica
    if (Object.prototype.hasOwnProperty.call(this, 'config')) { const c = (this as any).config; delete (this as any).config; (this as any).config = c; }
  }

  /** Configura varias propiedades a la vez (lo usa el Estudio para generar y aplicar código). */
  set config(c: Record<string, unknown>) { Object.assign(this, c); }
  get config(): Record<string, unknown> { return {}; }
  static get rampas() { return RAMPAS; }
  static get iconos() { return ICONOS; }

  // ------------------------------------------------------------------ ciclo de vida
  connectedCallback() {
    super.connectedCallback();
    this._ro = new ResizeObserver(() => this._medir());
    this._cargar();
  }
  disconnectedCallback() { super.disconnectedCallback(); this._ro?.disconnect(); cancelAnimationFrame(this._anim); }
  firstUpdated() { const s = this.renderRoot.querySelector('svg'); if (s) this._ro?.observe(s); this._medir(); }
  updated(ch: PropertyValues) {
    if (ch.has('detalle') || ch.has('srcDatos')) this._cargar();
    if (ch.has('seleccion')) this.dispatchEvent(new CustomEvent('gob-seleccion-cambio', { detail: { seleccion: this._selSet() }, bubbles: true, composed: true }));
  }
  private _medir() { const s = this.renderRoot.querySelector('svg'); if (s && this._geo) { const w = s.getBoundingClientRect().width; if (w) this._ppu = w / this._geo.meta.viewBox[2]; } }
  private _cargar() {
    const base = this.srcDatos || BASE;
    const url = base.replace(/\/?$/, '/') + `magdalena-municipios.${this.detalle}.json`;
    if (!cache.has(url)) cache.set(url, fetch(url).then((r) => { if (!r.ok) throw new Error(`No se pudo cargar ${url} (${r.status})`); return r.json(); }));
    cache.get(url)!.then((g) => { this._geo = g; this._error = ''; this.updateComplete.then(() => { const s = this.renderRoot.querySelector('svg'); if (s) this._ro?.observe(s); this._medir(); this.dispatchEvent(new CustomEvent('gob-mapa-listo', { bubbles: true, composed: true })); }); })
      .catch((e) => { cache.delete(url); this._error = String(e.message || e); });
  }

  // ------------------------------------------------------------------ datos derivados
  private _selSet(): string[] { return this.seleccion ? this.seleccion.split(',').filter(Boolean) : []; }
  private _colores(): string[] { return Array.isArray(this.rampa) ? this.rampa : (RAMPAS[this.rampa]?.colores ?? RAMPAS.azul.colores); }
  private _clases(): Clase[] { return this.modo === 'coropleta' && this.datos ? calcularClases(Object.values(this.datos), Math.max(2, this.clases), this._colores(), this.escala) : []; }
  private _subColor(id: string) { return this.coloresSubregiones?.[id] ?? this._geo?.subregiones.find((s) => s.id === id)?.color ?? '#97A1B0'; }
  private _fillDe(m: Municipio, clases: Clase[]): string {
    switch (this.modo) {
      case 'plano': return 'var(--gob-mapa-relleno)';
      case 'coropleta': { const v = this.datos?.[m.codigo]; const c = v == null ? undefined : claseDe(v, clases); return c ? c.color : 'var(--gob-mapa-sin-dato)'; }
      case 'categorias': { const cat = this.categorias?.[m.codigo]; return (cat && this.coloresCategorias?.[cat]) || 'var(--gob-mapa-sin-dato)'; }
      default: return this._subColor(m.subregion);
    }
  }
  private _valorTxt(codigo: string) { const v = this.datos?.[codigo]; return v == null ? '' : formatoNumero(v, this.formato) + (this.unidad ? ' ' + this.unidad : ''); }
  private _xy(p: string | [number, number] | undefined): [number, number] | null {
    if (!this._geo || !p) return null;
    if (typeof p === 'string') return this._geo.municipios.find((m) => m.codigo === p)?.centro ?? null;
    const { bbox, proyeccion } = this._geo.meta; const kx = Math.cos((proyeccion.lat0 * Math.PI) / 180);
    return [(p[0] - bbox[0]) * kx * proyeccion.escala, (bbox[3] - p[1]) * proyeccion.escala];
  }
  private get _u() { return 1 / (Math.max(this._ppu, 0.05) * this._tf.k); } // unidades del viewBox por píxel CSS

  // ------------------------------------------------------------------ interacción
  private _emitir(tipo: string, m: Municipio, ev?: Event) {
    this.dispatchEvent(new CustomEvent(tipo, { detail: { codigo: m.codigo, nombre: m.nombre, subregion: m.subregion, valor: this.datos?.[m.codigo], categoria: this.categorias?.[m.codigo], originalEvent: ev }, bubbles: true, composed: true }));
  }
  private _click(m: Municipio, ev: Event) {
    if (this._drag?.moved) return;
    this._emitir('gob-municipio-click', m, ev);
    const a = this.clic;
    if (a === 'seleccionar' || a === 'zoom-seleccionar') this._toggleSel(m.codigo);
    if (a === 'zoom' || a === 'zoom-seleccionar') this.zoomA(m.codigo);
    if (a === 'enlace' && this.enlace) location.href = this.enlace.replace('{codigo}', m.codigo).replace('{nombre}', encodeURIComponent(m.nombre));
  }
  private _toggleSel(c: string) {
    const s = this._selSet();
    const i = s.indexOf(c);
    if (this.multiple) { if (i >= 0) s.splice(i, 1); else s.push(c); this.seleccion = s.join(','); }
    else this.seleccion = i >= 0 ? '' : c;
  }
  private _tipDe(m: Municipio) {
    const sub = this._geo?.subregiones.find((s) => s.id === m.subregion)?.nombre ?? '';
    const v = this._valorTxt(m.codigo);
    return this.tooltipFormato.replace(/\{(\w+)\}/g, (_x, k) => ({ nombre: esc(m.nombre), codigo: esc(m.codigo), subregion: esc(sub), valor: esc(v), categoria: esc(this.categorias?.[m.codigo] ?? '') } as Record<string, string>)[k] ?? '');
  }
  private _enter(m: Municipio, ev: PointerEvent) { this._hover = m.codigo; this._emitir('gob-municipio-hover', m, ev); this._mover(m, ev); }
  private _mover(m: Municipio, ev: PointerEvent) {
    if (!this.tooltip || this._drag?.moved) return;
    const r = (this.renderRoot.querySelector('.wrap') as HTMLElement).getBoundingClientRect();
    this._tip = { x: ev.clientX - r.left, y: ev.clientY - r.top, html: this._tipDe(m) };
  }
  private _leave() { this._hover = null; this._tip = null; }
  private _focus(m: Municipio) {
    this._hover = m.codigo;
    const el = this.renderRoot.querySelector(`[data-c="${m.codigo}"]`) as SVGGraphicsElement | null;
    const w = (this.renderRoot.querySelector('.wrap') as HTMLElement).getBoundingClientRect();
    if (el && this.tooltip) { const r = el.getBoundingClientRect(); this._tip = { x: r.left - w.left + r.width / 2, y: r.top - w.top, html: this._tipDe(m) }; }
  }
  private _key(m: Municipio, ev: KeyboardEvent) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); this._drag = null; this._click(m, ev); } }

  private _vp(ev: { clientX: number; clientY: number }) { // cliente → coordenadas del viewBox
    const s = this.renderRoot.querySelector('svg')!; const r = s.getBoundingClientRect();
    return { x: (ev.clientX - r.left) / this._ppu, y: (ev.clientY - r.top) / this._ppu };
  }
  private _setTf(k: number, x: number, y: number) {
    if (!this._geo) return;
    const [, , W, H] = this._geo.meta.viewBox; k = Math.max(1, Math.min(14, k));
    x = Math.min(0, Math.max(W - W * k, x)); y = Math.min(0, Math.max(H - H * k, y));
    this._tf = { k, x, y };
  }
  private _zoomEn(f: number, p?: { x: number; y: number }) {
    if (!this._geo) return; const [, , W, H] = this._geo.meta.viewBox; const c = p ?? { x: W / 2, y: H / 2 };
    const { k, x, y } = this._tf; const k2 = Math.max(1, Math.min(14, k * f));
    this._setTf(k2, c.x - ((c.x - x) * k2) / k, c.y - ((c.y - y) * k2) / k);
  }
  private _down(ev: PointerEvent) {
    if (!this.zoom) return;
    this._pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (this._pointers.size === 2) { const [a, b] = [...this._pointers.values()]; this._pinch0 = { d: Math.hypot(a.x - b.x, a.y - b.y), k: this._tf.k }; this._drag = null; return; }
    this._drag = { x: ev.clientX, y: ev.clientY, tx: this._tf.x, ty: this._tf.y, moved: false };
  }
  private _move(ev: PointerEvent) {
    if (!this.zoom || !this._pointers.has(ev.pointerId)) return;
    this._pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (this._pointers.size === 2 && this._pinch0) {
      const [a, b] = [...this._pointers.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y);
      this._zoomEn((this._pinch0.k * d) / this._pinch0.d / this._tf.k, this._vp({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 })); return;
    }
    if (!this._drag) return;
    const dx = ev.clientX - this._drag.x, dy = ev.clientY - this._drag.y;
    if (!this._drag.moved && Math.hypot(dx, dy) > 5) { this._drag.moved = true; this._tip = null; (ev.currentTarget as Element).setPointerCapture?.(ev.pointerId); }
    if (this._drag.moved && this._tf.k > 1) this._setTf(this._tf.k, this._drag.tx + dx / this._ppu, this._drag.ty + dy / this._ppu);
  }
  private _up(ev: PointerEvent) {
    this._pointers.delete(ev.pointerId); if (this._pointers.size < 2) this._pinch0 = null;
    setTimeout(() => { if (this._pointers.size === 0) this._drag = null; }, 0);
  }
  private _wheel(ev: WheelEvent) {
    if (!this.zoom || !(this.zoomRueda || ev.ctrlKey || ev.metaKey)) return;
    ev.preventDefault(); this._zoomEn(ev.deltaY < 0 ? 1.25 : 0.8, this._vp(ev));
  }
  /** Acerca el mapa a un municipio (animado). */
  zoomA(codigo: string) {
    const el = this.renderRoot.querySelector(`[data-c="${codigo}"]`) as SVGGraphicsElement | null; if (!el || !this._geo) return;
    const b = el.getBBox(); const [, , W, H] = this._geo.meta.viewBox;
    const k = Math.min(8, Math.max(1.5, Math.min(W / (b.width * 2.2), H / (b.height * 2.2))));
    this._animar(k, W / 2 - k * (b.x + b.width / 2), H / 2 - k * (b.y + b.height / 2));
  }
  reiniciar() { this._animar(1, 0, 0); }
  private _animar(k: number, x: number, y: number) {
    cancelAnimationFrame(this._anim);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { this._setTf(k, x, y); return; }
    const a = { ...this._tf }; const t0 = performance.now(); const dur = 700;
    const f = (t: number) => { const p = Math.min(1, (t - t0) / dur); const e = p < 0.5 ? 4 * p ** 3 : 1 - ((-2 * p + 2) ** 3) / 2; this._setTf(a.k + (k - a.k) * e, a.x + (x - a.x) * e, a.y + (y - a.y) * e); if (p < 1) this._anim = requestAnimationFrame(f); };
    this._anim = requestAnimationFrame(f);
  }

  // ------------------------------------------------------------------ exportación
  /** SVG estático (sin animaciones) para descargar o imprimir. */
  exportarSVG(): string {
    const g = this._geo; if (!g) return '';
    const [, , W, H] = g.meta.viewBox; const clases = this._clases(); const u = 1 / Math.max(this._ppu, 0.05);
    const oscuro = this.tema === 'oscuro';
    const p: string[] = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Montserrat, Arial, sans-serif"><title>${esc(this.titulo)}</title>`];
    if (oscuro) p.push(`<rect width="${W}" height="${H}" fill="#081A2C"/>`);
    for (const m of g.municipios) p.push(`<path d="${m.d}" fill="${this._fillDe(m, clases).startsWith('var') ? '#DCE6EE' : this._fillDe(m, clases)}" stroke="${oscuro ? '#081A2C' : '#fff'}" stroke-width="${1.2 * u}" stroke-linejoin="round"/>`);
    for (const l of this.lineas ?? []) { const a = this._xy(l.desde), b = this._xy(l.hasta); if (a && b) p.push(`<path d="${this._curva(a, b, l.curva ?? 0.18)}" fill="none" stroke="${l.color ?? '#0071BB'}" stroke-width="${(l.ancho ?? 2) * u}" ${l.estilo === 'guion' || l.estilo === 'flujo' ? `stroke-dasharray="${6 * u} ${6 * u}"` : ''}/>`); }
    for (const mk of this.marcadores ?? []) { const q = this._xy(mk.codigo ?? mk.lonlat); if (!q) continue; const r = (mk.tamano ?? 26) / 2 * u; p.push(`<circle cx="${q[0]}" cy="${q[1]}" r="${r}" fill="${mk.color ?? '#0071BB'}" stroke="#fff" stroke-width="${1.5 * u}"/>`); const ic = ICONOS[mk.icono ?? 'punto']; if (ic) p.push(`<path d="${ic.d}" fill="#fff" transform="translate(${q[0] - r * 0.6} ${q[1] - r * 0.6}) scale(${(r * 1.2) / 24})"/>`); }
    if (this.etiquetas !== 'ninguna') for (const m of g.municipios) p.push(`<text x="${m.centro[0]}" y="${m.centro[1]}" font-size="${10 * u}" text-anchor="middle" fill="${oscuro ? '#fff' : '#161A22'}">${esc(this._etiqueta(m))}</text>`);
    p.push('</svg>'); return p.join('');
  }
  descargarSVG(nombre = 'mapa-magdalena') { this._bajar(new Blob([this.exportarSVG()], { type: 'image/svg+xml' }), nombre + '.svg'); }
  async descargarPNG(nombre = 'mapa-magdalena', escala = 2) {
    const g = this._geo; if (!g) return; const [, , W, H] = g.meta.viewBox;
    const img = new Image(); const url = URL.createObjectURL(new Blob([this.exportarSVG()], { type: 'image/svg+xml' }));
    await new Promise((r, j) => { img.onload = r; img.onerror = j; img.src = url; });
    const c = document.createElement('canvas'); c.width = W * escala; c.height = H * escala; const x = c.getContext('2d')!;
    x.fillStyle = this.tema === 'oscuro' ? '#081A2C' : '#ffffff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(url); c.toBlob((b) => b && this._bajar(b, nombre + '.png'));
  }
  imprimir() { window.print(); }
  private _bajar(b: Blob, n: string) { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = n; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }

  // ------------------------------------------------------------------ render
  private _curva(a: [number, number], b: [number, number], amt: number) {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    return `M${a[0].toFixed(1)} ${a[1].toFixed(1)}Q${(mx - (dy / L) * amt * L).toFixed(1)} ${(my + (dx / L) * amt * L).toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
  }
  private _etiqueta(m: Municipio) {
    const v = this._valorTxt(m.codigo);
    switch (this.etiquetas) { case 'codigos': return m.codigo; case 'valores': return v; case 'nombres-valores': return v ? `${m.nombre} · ${v}` : m.nombre; default: return m.nombre; }
  }
  private _marcador(mk: Marcador, i: number) {
    const q = this._xy(mk.codigo ?? mk.lonlat); if (!q) return nothing;
    const u = this._u, tam = mk.tamano ?? 26, r = (tam / 2) * u, col = mk.color ?? 'var(--gob-color-primario, #0071BB)'; const ic = ICONOS[mk.icono ?? 'punto'];
    const ef = mk.efecto ?? 'ninguno'; const ring = (r * 2.6);
    return svg`<g class="mk" part="marcador" transform="translate(${q[0]} ${q[1]})" style="--c:${col}" tabindex="0" role="button" aria-label=${mk.nombre ?? 'Marcador'}
        @click=${(e: Event) => { e.stopPropagation(); this.dispatchEvent(new CustomEvent('gob-marcador-click', { detail: { ...mk, indice: i }, bubbles: true, composed: true })); if (mk.url) location.href = mk.url; }}
        @pointerenter=${(e: PointerEvent) => { if (this.tooltip && mk.nombre) { const w = (this.renderRoot.querySelector('.wrap') as HTMLElement).getBoundingClientRect(); this._tip = { x: e.clientX - w.left, y: e.clientY - w.top, html: `<strong>${esc(mk.nombre)}</strong>${mk.categoria ? `<br><span>${esc(mk.categoria)}</span>` : ''}${mk.valor != null ? `<br>${esc(formatoNumero(mk.valor, this.formato))}` : ''}` }; } }}
        @pointerleave=${() => this._leave()}>
      ${ef === 'ping' || ef === 'radar' ? svg`<circle class="ring r1" r=${ring} /><circle class="ring r2" r=${ring} />` : nothing}
      ${ef === 'pulso' ? svg`<circle class="glow" r=${r * 1.9} />` : nothing}
      ${ef === 'radar' ? svg`<path class="sweep" d="M0 0 L${ring} 0 A${ring} ${ring} 0 0 0 ${ring * Math.cos(-0.9)} ${ring * Math.sin(-0.9)} Z" />` : nothing}
      <circle class="dot" r=${r} stroke-width=${1.5 * u} />
      ${ic ? svg`<path class="ico" d=${ic.d} transform="translate(${-r * 0.62} ${-r * 0.62}) scale(${(r * 1.24) / 24})" />` : nothing}
      ${mk.etiqueta && mk.nombre ? svg`<text class="mk-t" y=${r + 12 * u} font-size=${11 * u} stroke-width=${3 * u}>${mk.nombre}</text>` : nothing}
    </g>`;
  }
  private _linea(l: Linea, i: number) {
    const a = this._xy(l.desde), b = this._xy(l.hasta); if (!a || !b) return nothing;
    const d = this._curva(a, b, l.curva ?? 0.18); const est = l.estilo ?? 'flujo'; const col = l.color ?? 'var(--gob-color-primario, #0071BB)';
    return svg`<g part="linea" style="--c:${col};--w:${l.ancho ?? 2}px;--i:${i}">
      <path class="ln base" d=${d} />
      <path class="ln ${est}" d=${d} pathLength="1" />
      ${l.particulas ? svg`<circle class="pk" r=${3.2 * this._u} fill=${col}><animateMotion dur=${3 + (i % 4) * 0.6}s repeatCount="indefinite" path=${d} /></circle>` : nothing}
    </g>`;
  }
  private _leyenda(clases: Clase[]) {
    if (!this.leyenda || !this._geo) return nothing;
    let items: unknown = nothing; let titulo = this.leyendaTitulo;
    if (this.modo === 'subregiones') { titulo ||= 'Subregiones'; items = this._geo.subregiones.map((s) => html`<li class=${this.filtroSubregion === s.id ? 'on' : ''}><button type="button" @click=${() => (this.filtroSubregion = this.filtroSubregion === s.id ? '' : s.id)}><i style="background:${this._subColor(s.id)}"></i>${s.nombre}</button></li>`); }
    else if (this.modo === 'coropleta') { titulo ||= 'Valores'; items = clases.map((c) => html`<li><span><i style="background:${c.color}"></i>${formatoNumero(c.desde, this.formato)} – ${formatoNumero(c.hasta, this.formato)}${this.unidad ? ' ' + this.unidad : ''}</span></li>`); }
    else if (this.modo === 'categorias' && this.coloresCategorias) { titulo ||= 'Categorías'; items = Object.entries(this.coloresCategorias).map(([k, c]) => html`<li><span><i style="background:${c}"></i>${k}</span></li>`); }
    const cats = new Map<string, { color: string; icono?: string }>();
    for (const m of this.marcadores ?? []) if (m.categoria) cats.set(m.categoria, { color: m.color ?? '#0071BB', icono: m.icono });
    return html`<aside class="leyenda" part="leyenda" aria-label="Leyenda">
      ${titulo ? html`<h4>${titulo}</h4>` : nothing}<ul>${items}</ul>
      ${cats.size ? html`<h4>Puntos</h4><ul>${[...cats].map(([k, v]) => html`<li><span><i class="c" style="background:${v.color}"></i>${k}</span></li>`)}</ul>` : nothing}
    </aside>`;
  }

  render() {
    if (this._error) return html`<div class="estado err" role="alert">⚠ ${this._error}</div>`;
    const g = this._geo;
    if (!g) return html`<div class="estado" role="status">Cargando mapa…</div>`;
    const [, , W, H] = g.meta.viewBox; const clases = this._clases(); const sel = this._selSet(); const u = this._u;
    const ef = new Set(this.efectos); const hayFoco = ef.has('foco') && sel.length > 0;
    const tf = this._tf;
    return html`
      <div class="wrap ${[...ef].map((e) => 'ef-' + e).join(' ')}" part="mapa">
        <svg viewBox="0 0 ${W} ${H}" role="group" aria-label=${this.titulo} style="--k:${tf.k}"
          @pointerdown=${this._down} @pointermove=${this._move} @pointerup=${this._up} @pointercancel=${this._up} @wheel=${this._wheel} @pointerleave=${() => { this._pointers.clear(); }}>
          <title>${this.titulo}</title>${this.descripcion ? svg`<desc>${this.descripcion}</desc>` : nothing}
          <g class="vista" transform="translate(${tf.x} ${tf.y}) scale(${tf.k})">
            ${this.mostrarContorno ? svg`<path class="contorno" part="contorno" d=${g.contorno} pathLength="1" />` : nothing}
            <g class="munis">
              ${g.municipios.map((m, i) => {
                const off = !!this.filtroSubregion && m.subregion !== this.filtroSubregion;
                const dim = off || (hayFoco && !sel.includes(m.codigo));
                return svg`<path class="m ${sel.includes(m.codigo) ? 'sel' : ''} ${this._hover === m.codigo ? 'hov' : ''} ${dim ? 'dim' : ''}" part="municipio" data-c=${m.codigo} d=${m.d}
                  style="--f:${this._fillDe(m, clases)};--i:${i}" tabindex="0" role="button" aria-pressed=${sel.includes(m.codigo)}
                  aria-label=${`${m.nombre}${this._valorTxt(m.codigo) ? ', ' + this._valorTxt(m.codigo) : ''}`}
                  @click=${(e: Event) => this._click(m, e)} @pointerenter=${(e: PointerEvent) => this._enter(m, e)} @pointermove=${(e: PointerEvent) => this._mover(m, e)}
                  @pointerleave=${() => this._leave()} @focus=${() => this._focus(m)} @blur=${() => this._leave()} @keydown=${(e: KeyboardEvent) => this._key(m, e)} />`;
              })}
            </g>
            ${g.municipios.filter((m) => sel.includes(m.codigo)).map((m) => svg`<path class="halo ${ef.has('hormigas') ? 'ants' : ''}" d=${m.d} />`)}
            ${(this.lineas ?? []).map((l, i) => this._linea(l, i))}
            ${ef.has('ping-seleccion') ? g.municipios.filter((m) => sel.includes(m.codigo)).map((m) => svg`<g transform="translate(${m.centro[0]} ${m.centro[1]})" pointer-events="none"><circle class="ring r1 sel-ring" r=${34 * u} /><circle class="ring r2 sel-ring" r=${34 * u} /></g>`) : nothing}
            ${this.etiquetas !== 'ninguna' ? svg`<g class="etiquetas" part="etiqueta" pointer-events="none">${g.municipios.map((m) => { const f = this._fillDe(m, clases); const t = this._etiqueta(m); const cabe = !this.etiquetasAuto || ((m.bbox[2] - m.bbox[0]) * this._ppu * this._tf.k >= t.length * 5.6 * 0.82); return t && cabe ? svg`<text transform="translate(${m.centro[0]} ${m.centro[1]})" font-size=${10.5 * u} stroke-width=${3 * u} class=${f.startsWith('var') ? '' : 'on'} style="--t:${f.startsWith('var') ? 'var(--gob-mapa-texto)' : textoSobre(f)}">${t}</text>` : nothing; })}</g>` : nothing}
            ${(this.marcadores ?? []).map((mk, i) => this._marcador(mk, i))}
          </g>
        </svg>
        ${this.controles && this.zoom ? html`<div class="ctl" part="controles">
          <button type="button" aria-label="Acercar" @click=${() => this._zoomEn(1.5)}>+</button>
          <button type="button" aria-label="Alejar" @click=${() => this._zoomEn(1 / 1.5)}>−</button>
          <button type="button" aria-label="Vista completa" @click=${() => this.reiniciar()}>⌂</button></div>` : nothing}
        ${this._tip ? html`<div class="tip" part="tooltip" role="tooltip" style="left:${this._tip.x}px;top:${this._tip.y}px">${unsafeHTML(this._tip.html)}</div>` : nothing}
        ${this._leyenda(clases)}
        <table class="sr"><caption>${this.titulo}</caption><thead><tr><th>Código</th><th>Municipio</th><th>Subregión</th><th>Valor</th></tr></thead>
          <tbody>${g.municipios.map((m) => html`<tr><td>${m.codigo}</td><td>${m.nombre}</td><td>${g.subregiones.find((s) => s.id === m.subregion)?.nombre}</td><td>${this._valorTxt(m.codigo)}</td></tr>`)}</tbody></table>
      </div>`;
  }

  // ------------------------------------------------------------------ estilos
  static styles = css`
    :host { --gob-mapa-relleno: #DCE6EE; --gob-mapa-sin-dato: #E3E8EF; --gob-mapa-borde: #fff; --gob-mapa-contorno: #0B2239; --gob-mapa-sel: #0B2239; --gob-mapa-texto: #161A22; --gob-mapa-fondo: transparent;
      --gob-mapa-tip-bg: #081A2C; --gob-mapa-tip-fg: #fff; --gob-mapa-panel: rgba(255,255,255,.86); --gob-mapa-panel-fg: #252B36; --gob-mapa-panel-borde: #E3E8EF;
      display: block; position: relative; font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); container-type: inline-size; }
    :host([tema='oscuro']) { --gob-mapa-relleno: #12395C; --gob-mapa-sin-dato: #12395C; --gob-mapa-borde: #081A2C; --gob-mapa-contorno: #9FD7E5; --gob-mapa-sel: #fff; --gob-mapa-texto: #fff; --gob-mapa-fondo: #081A2C;
      --gob-mapa-tip-bg: #fff; --gob-mapa-tip-fg: #081A2C; --gob-mapa-panel: rgba(8,26,44,.78); --gob-mapa-panel-fg: #E3E8EF; --gob-mapa-panel-borde: #12395C; }
    .wrap { position: relative; background: var(--gob-mapa-fondo); border-radius: inherit; }
    svg { display: block; width: 100%; height: auto; touch-action: pan-y; user-select: none; -webkit-user-select: none; overflow: hidden; }
    .m, .contorno, .halo, .ln { vector-effect: non-scaling-stroke; }
    .contorno { fill: none; stroke: var(--gob-mapa-contorno); stroke-width: 1.4px; stroke-linejoin: round; opacity: .55; pointer-events: none; }
    .m { fill: var(--f); stroke: var(--gob-mapa-borde); stroke-width: 1.1px; stroke-linejoin: round; cursor: pointer; outline: none; transition: fill .35s ease, opacity .3s ease, filter .2s; transform-box: fill-box; transform-origin: center; }
    .m:hover, .m.hov { filter: brightness(1.08) saturate(1.1); stroke: var(--gob-mapa-sel); stroke-width: 2px; }
    .m:focus-visible { stroke: #00B7D9; stroke-width: 3px; }
    .m.sel { stroke: var(--gob-mapa-sel); stroke-width: 2.4px; }
    .m.dim { opacity: .28; }
    .halo { fill: none; stroke: var(--gob-mapa-sel); stroke-width: 3px; stroke-linejoin: round; pointer-events: none; }
    .halo.ants { stroke-dasharray: 9 7; animation: gob-marcha 1.1s linear infinite; }
    .etiquetas text { text-anchor: middle; dominant-baseline: central; font-weight: 600; fill: var(--t); paint-order: stroke; stroke: transparent; }
    .etiquetas text:not(.on) { stroke: color-mix(in srgb, var(--gob-mapa-fondo, #fff) 80%, #fff); }
    /* Líneas / rutas */
    .ln { fill: none; stroke: var(--c); stroke-width: var(--w); stroke-linecap: round; pointer-events: none; }
    .ln.base { opacity: .16; }
    .ln.solido { opacity: 1; } .ln.guion { stroke-dasharray: 5 6; }
    .ln.flujo { stroke-dasharray: .018 .03; animation: gob-flujo 1.4s linear infinite; }
    .ln.dibujar { stroke-dasharray: 1; stroke-dashoffset: 1; animation: gob-dibujar 2.2s ease forwards; animation-delay: calc(var(--i) * 250ms); }
    .pk { filter: drop-shadow(0 0 3px var(--c)); pointer-events: none; }
    /* Marcadores */
    .mk { cursor: pointer; outline: none; }
    .mk .dot { fill: var(--c); stroke: #fff; }
    .mk .ico { fill: #fff; pointer-events: none; }
    .mk:focus-visible .dot { stroke: #00B7D9; }
    .mk .ring { fill: none; stroke: var(--c); stroke-width: 2px; vector-effect: non-scaling-stroke; transform-box: fill-box; transform-origin: center; opacity: 0; pointer-events: none; animation: gob-ping 2.6s ease-out infinite; }
    .mk .ring.r2 { animation-delay: 1.3s; }
    .sel-ring { stroke: var(--gob-mapa-sel); transform-box: fill-box; transform-origin: center; animation: gob-ping 2.4s ease-out infinite; fill: none; stroke-width: 2px; vector-effect: non-scaling-stroke; opacity: 0; }
    .sel-ring.r2 { animation-delay: 1.2s; }
    .mk .glow { fill: var(--c); opacity: .25; transform-box: fill-box; transform-origin: center; animation: gob-pulso 2s ease-in-out infinite; pointer-events: none; }
    .mk .sweep { fill: color-mix(in srgb, var(--c) 38%, transparent); transform-box: view-box; animation: gob-gira 4.5s linear infinite; pointer-events: none; }
    .mk-t { text-anchor: middle; font-weight: 700; fill: var(--gob-mapa-texto); paint-order: stroke; stroke: var(--gob-mapa-fondo, #fff); stroke-linejoin: round; }
    @keyframes gob-ping { 0% { transform: scale(.15); opacity: .95; } 75% { opacity: .15; } 100% { transform: scale(1); opacity: 0; } }
    @keyframes gob-pulso { 0%, 100% { transform: scale(.7); opacity: .35; } 50% { transform: scale(1.15); opacity: .08; } }
    @keyframes gob-gira { to { transform: rotate(360deg); } }
    @keyframes gob-flujo { to { stroke-dashoffset: -.096; } }
    @keyframes gob-dibujar { to { stroke-dashoffset: 0; } }
    @keyframes gob-marcha { to { stroke-dashoffset: -32; } }
    @keyframes gob-entra { from { opacity: 0; transform: scale(.94); } to { opacity: 1; transform: scale(1); } }
    @keyframes gob-trazo { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    .ef-entrada .m { animation: gob-entra .55s cubic-bezier(.2,.8,.2,1) both; animation-delay: calc(var(--i) * 28ms); }
    .ef-entrada .contorno { stroke-dasharray: 1; animation: gob-trazo 1.8s ease both; }
    /* Controles, tooltip, leyenda */
    .ctl { position: absolute; top: .5rem; right: .5rem; display: grid; gap: 2px; }
    .ctl button { width: 2rem; height: 2rem; border: 1px solid var(--gob-mapa-panel-borde); background: var(--gob-mapa-panel); color: var(--gob-mapa-panel-fg); font: 700 1rem/1 inherit; cursor: pointer; -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }
    .ctl button:first-child { border-radius: 8px 8px 0 0; } .ctl button:last-child { border-radius: 0 0 8px 8px; }
    .ctl button:hover { background: #0071BB; color: #fff; } .ctl button:focus-visible { outline: 2px solid #00B7D9; outline-offset: 1px; }
    .tip { position: absolute; z-index: 5; transform: translate(-50%, calc(-100% - 12px)); pointer-events: none; background: var(--gob-mapa-tip-bg); color: var(--gob-mapa-tip-fg); padding: .5rem .7rem; border-radius: 8px; font-size: .78rem; line-height: 1.4; white-space: nowrap; box-shadow: 0 8px 24px rgba(8,26,44,.28); }
    .tip span { opacity: .72; } .tip strong { font-weight: 700; }
    .leyenda { position: absolute; left: .6rem; bottom: .6rem; max-width: 46%; padding: .55rem .7rem; border: 1px solid var(--gob-mapa-panel-borde); border-radius: 10px; background: var(--gob-mapa-panel); color: var(--gob-mapa-panel-fg); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); font-size: .72rem; }
    .leyenda h4 { margin: 0 0 .3rem; font-size: .66rem; letter-spacing: .08em; text-transform: uppercase; opacity: .7; }
    .leyenda h4:not(:first-child) { margin-top: .5rem; }
    .leyenda ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
    .leyenda button, .leyenda span { display: flex; align-items: center; gap: .45rem; font: inherit; color: inherit; background: none; border: 0; padding: 1px 0; cursor: default; text-align: left; }
    .leyenda button { cursor: pointer; } .leyenda li.on button { font-weight: 700; text-decoration: underline; }
    .leyenda i { width: .8rem; height: .8rem; border-radius: 3px; flex: none; } .leyenda i.c { border-radius: 50%; }
    @container (max-width: 460px) { .leyenda { position: static; max-width: none; margin-top: .5rem; } }
    .estado { padding: 2rem; text-align: center; font-size: .9rem; color: #6B7482; } .estado.err { color: #B20028; }
    .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } .mk .ring, .sel-ring { opacity: 0 !important; } }
    @media print { .ctl { display: none; } * { animation: none !important; } .wrap, svg { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .leyenda { backdrop-filter: none; background: #fff; } .tip { display: none; } }
  `;
}
if (!customElements.get('gob-mapa-magdalena')) customElements.define('gob-mapa-magdalena', GobMapaMagdalena);
declare global { interface HTMLElementTagNameMap { 'gob-mapa-magdalena': GobMapaMagdalena } }
