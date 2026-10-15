import { LitElement, html, css, nothing } from 'lit';
import { icono } from './lib/icono.js';

const jsonConv = { fromAttribute: (v: string | null) => { try { return v ? JSON.parse(v) : []; } catch { return []; } } };
const sinTildes = (s: string) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const FUENTE = css`:host { display: block; font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); color: var(--gob-color-texto, #161A22); } svg { display: block; } *, *::before, *::after { box-sizing: border-box; }
  .campo { display: flex; align-items: center; gap: .4rem; min-height: 2.5rem; padding: .25rem .6rem .25rem .8rem; background: #fff; border: 1px solid #CBD2DC; border-radius: 8px; cursor: pointer; transition: border-color .15s, box-shadow .15s; }
  .campo:hover { border-color: #9AA4B2; } .campo.foco { border-color: #0071BB; box-shadow: 0 0 0 3px rgba(0,113,187,.22); } :host([invalido]) .campo { border-color: #F7003C; } :host([deshabilitado]) .campo { background: #F1F4F8; cursor: not-allowed; opacity: .7; }
  .mini { display: grid; place-items: center; width: 1.6rem; height: 1.6rem; border: 0; border-radius: 6px; background: none; color: #5B6575; cursor: pointer; flex: none; } .mini:hover { background: #F1F4F8; color: #161A22; } .mini:focus-visible { outline: 2px solid #0071BB; }
  .pop { position: absolute; z-index: 1000; left: 0; min-width: 100%; margin-top: 4px; background: #fff; border: 1px solid #E3E8EF; border-radius: 12px; box-shadow: 0 16px 40px rgba(8,26,44,.18); overflow: hidden; } .rel { position: relative; }`;

/* ============================================================ <gob-selector> */
interface Op { valor: string; etiqueta: string; grupo?: string; descripcion?: string; deshabilitada?: boolean; icono?: string }
/** <gob-selector opciones='["Santa Marta","Ciénaga"]' multiple buscable> — select con búsqueda y multiselección. Participa en <form> (name). */
export class GobSelector extends LitElement {
  static formAssociated = true;
  static properties = {
    opciones: { converter: jsonConv }, valor: { converter: { fromAttribute: (v: string | null) => v ?? '', toAttribute: (v: unknown) => (Array.isArray(v) ? v.join(',') : String(v ?? '')) }, reflect: true }, multiple: { type: Boolean, reflect: true }, buscable: { type: Boolean }, limpiable: { type: Boolean },
    placeholder: { type: String }, deshabilitado: { type: Boolean, reflect: true }, invalido: { type: Boolean, reflect: true }, name: { type: String }, etiqueta: { type: String }, requerido: { type: Boolean }, maxChips: { type: Number, attribute: 'max-chips' },
    _abierto: { state: true }, _q: { state: true }, _i: { state: true }, _foco: { state: true },
  };
  declare opciones: (Op | string)[]; declare valor: string | string[]; declare multiple: boolean; declare buscable: boolean; declare limpiable: boolean; declare placeholder: string; declare deshabilitado: boolean; declare invalido: boolean;
  declare name: string; declare etiqueta: string; declare requerido: boolean; declare maxChips: number; declare _abierto: boolean; declare _q: string; declare _i: number; declare _foco: boolean;
  private _int = (this as any).attachInternals?.() as ElementInternals | undefined; private _uid = 'sel' + Math.random().toString(36).slice(2, 7);
  constructor() { super(); this.opciones = []; this.valor = ''; this.multiple = false; this.buscable = true; this.limpiable = true; this.placeholder = 'Seleccione…'; this.deshabilitado = false; this.invalido = false; this.name = ''; this.etiqueta = 'Selector'; this.requerido = false; this.maxChips = 3; this._abierto = false; this._q = ''; this._i = 0; this._foco = false; }
  private get _ops(): Op[] { return this.opciones.map((o) => (typeof o === 'string' ? { valor: o, etiqueta: o } : { ...o, valor: String(o.valor) })); }
  get seleccion(): string[] { const v = this.valor; if (Array.isArray(v)) return v.map(String); return v === '' || v == null ? [] : this.multiple ? String(v).split(',').filter(Boolean) : [String(v)]; }
  private get _filtradas() { const q = sinTildes(this._q.trim()); return this._ops.filter((o) => !q || sinTildes(o.etiqueta).includes(q) || sinTildes(o.grupo ?? '').includes(q)); }
  private _emitir() { const v = this.multiple ? this.seleccion : this.seleccion[0] ?? ''; this._sync(); this.dispatchEvent(new CustomEvent('gob-selector-cambio', { detail: { valor: v, opciones: this._ops.filter((o) => this.seleccion.includes(o.valor)) }, bubbles: true, composed: true })); this.dispatchEvent(new Event('change', { bubbles: true })); }
  private _sync() { if (!this._int) return; const fd = new FormData(); this.seleccion.forEach((s) => fd.append(this.name || 'valor', s)); this._int.setFormValue(this.name ? fd : null); if (this.requerido && !this.seleccion.length) this._int.setValidity({ valueMissing: true }, 'Seleccione una opción', this.renderRoot.querySelector('input') as HTMLElement); else this._int.setValidity({}); }
  updated(c: Map<string, unknown>) { if (c.has('valor') || c.has('multiple') || c.has('requerido') || c.has('name')) this._sync(); }
  private _elegir(o: Op) {
    if (o.deshabilitada) return;
    if (this.multiple) { const s = new Set(this.seleccion); s.has(o.valor) ? s.delete(o.valor) : s.add(o.valor); this.valor = [...s]; this._q = ''; } else { this.valor = o.valor; this._cerrar(); }
    this._emitir(); (this.renderRoot.querySelector('input') as HTMLInputElement)?.focus();
  }
  private _quitar(v: string, e?: Event) { e?.stopPropagation(); this.valor = this.seleccion.filter((x) => x !== v); this._emitir(); }
  limpiar() { this.valor = this.multiple ? [] : ''; this._q = ''; this._emitir(); }
  abrir() { if (this.deshabilitado) return; this._abierto = true; this._i = Math.max(0, this._filtradas.findIndex((o) => this.seleccion.includes(o.valor))); }
  private _cerrar() { this._abierto = false; this._q = ''; }
  private _tecla(e: KeyboardEvent) {
    const f = this._filtradas;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (!this._abierto) { this.abrir(); return; } let n = this._i; do n = (n + (e.key === 'ArrowDown' ? 1 : -1) + f.length) % f.length; while (f[n]?.deshabilitada && n !== this._i); this._i = n; this.updateComplete.then(() => this.renderRoot.querySelector('.on')?.scrollIntoView({ block: 'nearest' })); }
    else if (e.key === 'Enter') { if (this._abierto && f[this._i]) { e.preventDefault(); this._elegir(f[this._i]); } else if (!this._abierto) { e.preventDefault(); this.abrir(); } }
    else if (e.key === 'Escape') { if (this._abierto) { e.stopPropagation(); this._cerrar(); } }
    else if (e.key === 'Backspace' && !this._q && this.multiple && this.seleccion.length) this._quitar(this.seleccion.at(-1)!);
    else if (e.key === 'Tab') this._cerrar();
    else if (e.key === ' ' && !this.buscable) { e.preventDefault(); this._abierto ? (f[this._i] && this._elegir(f[this._i])) : this.abrir(); }
  }
  private _fuera = (e: Event) => { if (this._abierto && !e.composedPath().includes(this)) this._cerrar(); };
  connectedCallback() { super.connectedCallback(); document.addEventListener('pointerdown', this._fuera, true); }
  disconnectedCallback() { super.disconnectedCallback(); document.removeEventListener('pointerdown', this._fuera, true); }
  formResetCallback() { this.valor = this.multiple ? [] : ''; }
  formDisabledCallback(d: boolean) { this.deshabilitado = d; }
  render() {
    const ops = this._ops, sel = this.seleccion, f = this._filtradas; const etq = (v: string) => ops.find((o) => o.valor === v)?.etiqueta ?? v;
    const chips = this.multiple ? sel.slice(0, this.maxChips) : []; const resto = this.multiple ? sel.length - chips.length : 0;
    let grupo = ''; const mostrarTexto = !this.multiple && !this._q && sel.length;
    return html`<div class="rel"><div class="campo ${this._foco ? 'foco' : ''}" @click=${() => { this._abierto ? this._cerrar() : this.abrir(); (this.renderRoot.querySelector('input') as HTMLInputElement)?.focus(); }}>
      <div class="v">${chips.map((v) => html`<span class="chip">${etq(v)}<button type="button" class="x" aria-label=${'Quitar ' + etq(v)} @click=${(e: Event) => this._quitar(v, e)}>${icono('cerrar', 12)}</button></span>`)}${resto > 0 ? html`<span class="chip mas">+${resto}</span>` : nothing}
        ${mostrarTexto ? html`<span class="txt">${etq(sel[0])}</span>` : nothing}
        <input role="combobox" aria-label=${this.etiqueta} aria-expanded=${this._abierto} aria-controls=${this._uid} aria-autocomplete=${this.buscable ? 'list' : 'none'} aria-activedescendant=${this._abierto ? this._uid + '-' + this._i : nothing} aria-invalid=${this.invalido ? 'true' : nothing} aria-required=${this.requerido ? 'true' : nothing}
          .value=${this._q} ?readonly=${!this.buscable} ?disabled=${this.deshabilitado} placeholder=${sel.length ? '' : this.placeholder} autocomplete="off" size="1"
          @input=${(e: Event) => { this._q = (e.target as HTMLInputElement).value; this._abierto = true; this._i = 0; }} @keydown=${this._tecla} @focus=${() => (this._foco = true)} @blur=${() => (this._foco = false)}></div>
      ${this.limpiable && sel.length && !this.deshabilitado ? html`<button type="button" class="mini" aria-label="Limpiar selección" @click=${(e: Event) => { e.stopPropagation(); this.limpiar(); }}>${icono('cerrar', 14)}</button>` : nothing}
      <span class="mini" aria-hidden="true">${icono(this._abierto ? 'chevron-arriba' : 'chevron-abajo', 16)}</span></div>
      ${this._abierto ? html`<ul class="pop lista" id=${this._uid} role="listbox" aria-multiselectable=${this.multiple} aria-label=${this.etiqueta}>${f.length ? f.map((o, i) => { const g = o.grupo && o.grupo !== grupo ? ((grupo = o.grupo), html`<li class="g" role="presentation">${o.grupo}</li>`) : nothing;
        return html`${g}<li id=${this._uid + '-' + i} role="option" class="o ${i === this._i ? 'on' : ''} ${o.deshabilitada ? 'dis' : ''}" aria-selected=${sel.includes(o.valor)} aria-disabled=${o.deshabilitada ? 'true' : nothing} @click=${() => this._elegir(o)} @mouseenter=${() => (this._i = i)}>
          ${this.multiple ? html`<span class="cb ${sel.includes(o.valor) ? 'ck' : ''}">${sel.includes(o.valor) ? icono('check', 12) : nothing}</span>` : nothing}${icono(o.icono, 16)}<span class="ot">${o.etiqueta}${o.descripcion ? html`<small>${o.descripcion}</small>` : nothing}</span>${!this.multiple && sel.includes(o.valor) ? icono('check', 16) : nothing}</li>`; }) : html`<li class="vacio" role="presentation">Sin resultados</li>`}</ul>` : nothing}</div>`;
  }
  static styles = [FUENTE, css`
    .v { flex: 1; display: flex; flex-wrap: wrap; align-items: center; gap: .3rem; min-width: 0; } input { flex: 1; min-width: 4rem; border: 0; outline: 0; background: none; font: inherit; font-size: .9375rem; color: inherit; padding: .25rem 0; cursor: inherit; } input::placeholder { color: #6B7482; }
    .txt { font-size: .9375rem; } .chip { display: inline-flex; align-items: center; gap: .25rem; background: #E5F1F9; color: #004F82; border-radius: 6px; padding: .15rem .25rem .15rem .55rem; font-size: .8rem; font-weight: 600; } .chip.mas { padding-right: .55rem; background: #F1F4F8; color: #3A424F; }
    .x { display: grid; place-items: center; border: 0; background: none; color: inherit; cursor: pointer; border-radius: 4px; padding: .1rem; } .x:hover { background: rgba(0,79,130,.15); }
    .lista { list-style: none; margin: 4px 0 0; padding: .35rem; max-height: 16rem; overflow: auto; } .o { display: flex; align-items: center; gap: .55rem; padding: .5rem .6rem; border-radius: 8px; font-size: .9rem; cursor: pointer; } .o.on { background: #F1F4F8; } .o[aria-selected='true'] { color: #004F82; font-weight: 600; } .o.dis { opacity: .4; cursor: not-allowed; } .ot { flex: 1; display: grid; } .ot small { color: #5B6575; font-weight: 400; font-size: .76rem; }
    .g { padding: .55rem .6rem .25rem; font-size: .68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #5B6575; } .vacio { padding: .8rem; text-align: center; color: #5B6575; font-size: .88rem; }
    .cb { display: grid; place-items: center; width: 1.05rem; height: 1.05rem; border: 1.5px solid #9AA4B2; border-radius: 4px; background: #fff; flex: none; } .cb.ck { background: #0071BB; border-color: #0071BB; color: #fff; }`];
}

/* ============================================================ <gob-fecha> */
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DIAS = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'];
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const aFecha = (s: string) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s ?? ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
const legible = (s: string) => { const d = aFecha(s); return d ? `${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}` : ''; };
/** <gob-fecha valor="2026-10-14" min="2026-01-01"> · <gob-fecha rango valor="2026-10-01/2026-10-15"> — calendario en español, accesible con teclado. */
export class GobFecha extends LitElement {
  static formAssociated = true;
  static properties = { valor: { type: String, reflect: true }, rango: { type: Boolean, reflect: true }, min: { type: String }, max: { type: String }, placeholder: { type: String }, deshabilitado: { type: Boolean, reflect: true }, invalido: { type: Boolean, reflect: true }, name: { type: String }, etiqueta: { type: String }, limpiable: { type: Boolean }, _abierto: { state: true }, _vista: { state: true }, _tmp: { state: true }, _hover: { state: true } };
  declare valor: string; declare rango: boolean; declare min: string; declare max: string; declare placeholder: string; declare deshabilitado: boolean; declare invalido: boolean; declare name: string; declare etiqueta: string; declare limpiable: boolean;
  declare _abierto: boolean; declare _vista: Date; declare _tmp: string; declare _hover: string;
  private _int = (this as any).attachInternals?.() as ElementInternals | undefined;
  constructor() { super(); this.valor = ''; this.rango = false; this.min = ''; this.max = ''; this.placeholder = 'Seleccione una fecha'; this.deshabilitado = false; this.invalido = false; this.name = ''; this.etiqueta = 'Fecha'; this.limpiable = true; this._abierto = false; this._vista = new Date(); this._tmp = ''; this._hover = ''; }
  private get _par(): [string, string] { const [a, b] = (this.valor || '').split('/'); return [a ?? '', b ?? '']; }
  updated(c: Map<string, unknown>) { if (c.has('valor')) this._int?.setFormValue(this.valor || null); }
  abrir() { if (this.deshabilitado) return; const d = aFecha(this._par[0]); this._vista = d ? new Date(d.getFullYear(), d.getMonth(), 1) : new Date(new Date().getFullYear(), new Date().getMonth(), 1); this._tmp = ''; this._abierto = true; this.updateComplete.then(() => (this.renderRoot.querySelector('.d.sel, .d.hoy, .d:not([disabled])') as HTMLElement)?.focus()); }
  private _cerrar() { this._abierto = false; this._tmp = ''; (this.renderRoot.querySelector('.campo') as HTMLElement)?.focus(); }
  private _fuera = (e: Event) => { if (this._abierto && !e.composedPath().includes(this)) { this._abierto = false; this._tmp = ''; } };
  connectedCallback() { super.connectedCallback(); document.addEventListener('pointerdown', this._fuera, true); }
  disconnectedCallback() { super.disconnectedCallback(); document.removeEventListener('pointerdown', this._fuera, true); }
  private _ok(s: string) { return (!this.min || s >= this.min) && (!this.max || s <= this.max); }
  private _emit() { this.dispatchEvent(new CustomEvent('gob-fecha-cambio', { detail: { valor: this.valor, inicio: this._par[0], fin: this._par[1] }, bubbles: true, composed: true })); this.dispatchEvent(new Event('change', { bubbles: true })); }
  private _pick(s: string) {
    if (!this._ok(s)) return;
    if (!this.rango) { this.valor = s; this._emit(); this._cerrar(); return; }
    if (!this._tmp) { this._tmp = s; return; }
    const [a, b] = s < this._tmp ? [s, this._tmp] : [this._tmp, s]; this.valor = a + '/' + b; this._tmp = ''; this._emit(); this._cerrar();
  }
  limpiar() { this.valor = ''; this._emit(); }
  private _mover(n: number) { this._vista = new Date(this._vista.getFullYear(), this._vista.getMonth() + n, 1); }
  private _tecla(e: KeyboardEvent, s: string) {
    const d = aFecha(s)!; const paso: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key === 'Escape') { e.preventDefault(); this._cerrar(); return; }
    let n: Date | null = null; if (e.key in paso) n = new Date(d.getFullYear(), d.getMonth(), d.getDate() + paso[e.key]); else if (e.key === 'PageDown') n = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()); else if (e.key === 'PageUp') n = new Date(d.getFullYear(), d.getMonth() - 1, d.getDate()); else if (e.key === 'Home') n = new Date(d.getFullYear(), d.getMonth(), 1); else if (e.key === 'End') n = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    if (!n) return; e.preventDefault(); this._vista = new Date(n.getFullYear(), n.getMonth(), 1); this.updateComplete.then(() => (this.renderRoot.querySelector(`[data-f="${iso(n!)}"]`) as HTMLElement)?.focus());
  }
  render() {
    const [a, b] = this._par; const v = this._vista; const ini = new Date(v.getFullYear(), v.getMonth(), 1); const off = (ini.getDay() + 6) % 7; const hoy = iso(new Date());
    const celdas = Array.from({ length: 42 }, (_, i) => new Date(v.getFullYear(), v.getMonth(), 1 - off + i));
    const lo = this.rango ? (this._tmp ? [this._tmp, this._hover || this._tmp].sort() : [a, b]) : [a, a]; const txt = this.rango ? (a ? (b ? `${legible(a)} – ${legible(b)}` : legible(a)) : '') : legible(a);
    return html`<div class="rel"><div class="campo ${this._abierto ? 'foco' : ''}" tabindex=${this.deshabilitado ? -1 : 0} role="combobox" aria-haspopup="dialog" aria-expanded=${this._abierto} aria-label=${this.etiqueta + (txt ? ': ' + txt : '')} aria-invalid=${this.invalido ? 'true' : nothing}
        @click=${() => (this._abierto ? this._cerrar() : this.abrir())} @keydown=${(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); this.abrir(); } }}>
      ${icono('calendario', 17)}<span class="txt ${txt ? '' : 'ph'}">${txt || this.placeholder}</span>${this.limpiable && txt && !this.deshabilitado ? html`<button type="button" class="mini" aria-label="Limpiar fecha" @click=${(e: Event) => { e.stopPropagation(); this.limpiar(); }}>${icono('cerrar', 14)}</button>` : nothing}</div>
      ${this._abierto ? html`<div class="pop cal" role="dialog" aria-label="Calendario"><div class="enc"><button type="button" class="mini" aria-label="Mes anterior" @click=${() => this._mover(-1)}>${icono('chevron-izquierda', 16)}</button><strong aria-live="polite">${MESES[v.getMonth()]} ${v.getFullYear()}</strong><button type="button" class="mini" aria-label="Mes siguiente" @click=${() => this._mover(1)}>${icono('chevron-derecha', 16)}</button></div>
        <div class="gr" role="grid">${DIAS.map((d) => html`<span class="dn" role="columnheader">${d}</span>`)}${celdas.map((d) => { const s = iso(d); const fuera = d.getMonth() !== v.getMonth(); const sel = s === lo[0] || s === lo[1]; const enRango = this.rango && lo[0] && lo[1] && s > lo[0] && s < lo[1];
          return html`<button type="button" class="d ${fuera ? 'fu' : ''} ${sel ? 'sel' : ''} ${enRango ? 'rg' : ''} ${s === hoy ? 'hoy' : ''}" data-f=${s} ?disabled=${!this._ok(s)} aria-label=${d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear()} aria-pressed=${sel} tabindex=${fuera ? -1 : 0}
            @click=${() => this._pick(s)} @mouseenter=${() => (this._hover = s)} @keydown=${(e: KeyboardEvent) => this._tecla(e, s)}>${d.getDate()}</button>`; })}</div>
        <div class="pie"><button type="button" class="lnk" @click=${() => { const t = iso(new Date()); this._vista = new Date(); if (!this.rango) this._pick(t); }}>Hoy</button>${this.rango && this._tmp ? html`<small>Elija la fecha final</small>` : nothing}</div></div>` : nothing}</div>`;
  }
  static styles = [FUENTE, css`
    .txt { flex: 1; font-size: .9375rem; } .ph { color: #5B6575; } .campo:focus-visible { outline: 0; border-color: #0071BB; box-shadow: 0 0 0 3px rgba(0,113,187,.22); } .campo svg { color: #5B6575; flex: none; }
    .cal { padding: .75rem; width: 19rem; } .enc { display: flex; justify-content: space-between; align-items: center; margin-bottom: .5rem; } .enc strong { text-transform: capitalize; font-size: .92rem; }
    .gr { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; } .dn { text-align: center; font-size: .68rem; font-weight: 700; text-transform: uppercase; color: #5B6575; padding: .3rem 0; }
    .d { aspect-ratio: 1; border: 0; background: none; border-radius: 8px; font: inherit; font-size: .84rem; cursor: pointer; color: #161A22; } .d:hover:not(:disabled) { background: #F1F4F8; } .d.fu { color: #9AA4B2; } .d.hoy { font-weight: 800; color: #0071BB; box-shadow: inset 0 0 0 1.5px #9FD7E5; }
    .d.rg { background: #E5F1F9; border-radius: 0; } .d.sel { background: #0071BB; color: #fff; font-weight: 700; } .d:disabled { opacity: .3; cursor: not-allowed; } .d:focus-visible { outline: 2px solid #0071BB; outline-offset: 1px; }
    .pie { display: flex; justify-content: space-between; align-items: center; margin-top: .5rem; padding-top: .5rem; border-top: 1px solid #E3E8EF; } .lnk { border: 0; background: none; color: #0071BB; font: inherit; font-weight: 700; font-size: .82rem; cursor: pointer; } small { color: #5B6575; font-size: .76rem; }`];
}

/* ============================================================ <gob-archivos> */
const fmt = (n: number) => (n < 1024 ? n + ' B' : n < 1048576 ? (n / 1024).toFixed(0) + ' KB' : (n / 1048576).toFixed(1) + ' MB');
interface Fila { f: File; pct: number; error?: string }
/** <gob-archivos multiple accept=".pdf,.jpg" max-mb="5"> — zona de carga con arrastrar y soltar, validación y progreso (método progreso(nombre,%)). */
export class GobArchivos extends LitElement {
  static formAssociated = true;
  static properties = { multiple: { type: Boolean }, accept: { type: String }, maxMb: { type: Number, attribute: 'max-mb' }, maxArchivos: { type: Number, attribute: 'max-archivos' }, etiqueta: { type: String }, ayuda: { type: String }, name: { type: String }, deshabilitado: { type: Boolean, reflect: true }, _filas: { state: true }, _sobre: { state: true } };
  declare multiple: boolean; declare accept: string; declare maxMb: number; declare maxArchivos: number; declare etiqueta: string; declare ayuda: string; declare name: string; declare deshabilitado: boolean; declare _filas: Fila[]; declare _sobre: boolean;
  private _int = (this as any).attachInternals?.() as ElementInternals | undefined;
  constructor() { super(); this.multiple = false; this.accept = ''; this.maxMb = 10; this.maxArchivos = 10; this.etiqueta = 'Arrastre archivos aquí o haga clic para seleccionarlos'; this.ayuda = ''; this.name = ''; this.deshabilitado = false; this._filas = []; this._sobre = false; }
  get archivos(): File[] { return this._filas.filter((x) => !x.error).map((x) => x.f); }
  private _tipoOk(f: File) { if (!this.accept) return true; return this.accept.split(',').map((s) => s.trim().toLowerCase()).some((a) => (a.startsWith('.') ? f.name.toLowerCase().endsWith(a) : a.endsWith('/*') ? f.type.startsWith(a.slice(0, -1)) : f.type === a)); }
  private _agregar(lista: FileList | File[]) {
    let nuevas: Fila[] = [...lista].map((f) => ({ f, pct: 0, error: !this._tipoOk(f) ? 'Tipo no permitido' : f.size > this.maxMb * 1048576 ? `Supera ${this.maxMb} MB` : undefined }));
    if (!this.multiple) this._filas = []; this._filas = [...this._filas, ...nuevas].slice(0, this.multiple ? this.maxArchivos : 1); this._notificar();
  }
  private _notificar() { const fd = new FormData(); this.archivos.forEach((f) => fd.append(this.name || 'archivos', f)); this._int?.setFormValue(this.name ? fd : null); const rechazados = this._filas.filter((x) => x.error).map((x) => ({ nombre: x.f.name, motivo: x.error })); this.dispatchEvent(new CustomEvent('gob-archivos-cambio', { detail: { archivos: this.archivos, rechazados }, bubbles: true, composed: true })); }
  quitar(i: number) { this._filas = this._filas.filter((_, k) => k !== i); this._notificar(); }
  limpiar() { this._filas = []; this._notificar(); }
  progreso(nombre: string, pct: number) { this._filas = this._filas.map((x) => (x.f.name === nombre ? { ...x, pct } : x)); }
  render() {
    const inp = () => this.renderRoot.querySelector('input') as HTMLInputElement;
    return html`<div class="zona ${this._sobre ? 'sobre' : ''}" tabindex=${this.deshabilitado ? -1 : 0} role="button" aria-label=${this.etiqueta} @click=${() => !this.deshabilitado && inp().click()} @keydown=${(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inp().click(); } }}
        @dragover=${(e: DragEvent) => { e.preventDefault(); this._sobre = true; }} @dragleave=${() => (this._sobre = false)} @drop=${(e: DragEvent) => { e.preventDefault(); this._sobre = false; if (!this.deshabilitado && e.dataTransfer) this._agregar(e.dataTransfer.files); }}>
      <span class="ic">${icono('subir', 24)}</span><strong>${this.etiqueta}</strong><small>${this.ayuda || `${this.accept ? this.accept.replace(/,/g, ', ') + ' · ' : ''}máx. ${this.maxMb} MB${this.multiple ? ' por archivo' : ''}`}</small>
      <input type="file" hidden ?multiple=${this.multiple} accept=${this.accept || nothing} @change=${(e: Event) => { const t = e.target as HTMLInputElement; if (t.files) this._agregar(t.files); t.value = ''; }}></div>
      ${this._filas.length ? html`<ul class="ls" aria-label="Archivos seleccionados">${this._filas.map((x, i) => html`<li class=${x.error ? 'er' : ''}>${icono(x.error ? 'alerta' : 'archivo', 18)}<span class="nb"><b>${x.f.name}</b><small>${x.error ?? fmt(x.f.size)}</small>${x.pct > 0 && x.pct < 100 && !x.error ? html`<progress max="100" .value=${x.pct}></progress>` : nothing}</span>
        <button type="button" class="q" aria-label=${'Quitar ' + x.f.name} @click=${() => this.quitar(i)}>${icono('cerrar', 14)}</button></li>`)}</ul>` : nothing}`;
  }
  static styles = [FUENTE, css`
    .zona { display: grid; justify-items: center; gap: .3rem; text-align: center; padding: 1.5rem 1rem; border: 2px dashed #CBD2DC; border-radius: 12px; background: #F8FAFC; cursor: pointer; transition: border-color .15s, background .15s; } .zona:hover, .zona.sobre { border-color: #0071BB; background: #E5F1F9; } .zona:focus-visible { outline: 0; border-color: #0071BB; box-shadow: 0 0 0 3px rgba(0,113,187,.22); }
    :host([deshabilitado]) .zona { opacity: .55; cursor: not-allowed; } .ic { display: grid; place-items: center; width: 3rem; height: 3rem; border-radius: 50%; background: #E5F1F9; color: #0071BB; } strong { font-size: .92rem; } small { color: #5B6575; font-size: .78rem; }
    .ls { list-style: none; margin: .75rem 0 0; padding: 0; display: grid; gap: .5rem; } li { display: flex; align-items: center; gap: .7rem; padding: .6rem .8rem; border: 1px solid #E3E8EF; border-radius: 10px; background: #fff; color: #0071BB; } li.er { border-color: #F7003C; background: #FFF5F7; color: #C4002F; }
    .nb { flex: 1; min-width: 0; display: grid; color: #161A22; } .nb b { font-size: .86rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } li.er small { color: #C4002F; font-weight: 600; } progress { width: 100%; height: .35rem; margin-top: .3rem; accent-color: #0071BB; }
    .q { display: grid; place-items: center; width: 1.8rem; height: 1.8rem; border: 0; border-radius: 6px; background: none; color: #5B6575; cursor: pointer; } .q:hover { background: #F1F4F8; color: #161A22; } .q:focus-visible { outline: 2px solid #0071BB; }`];
}

if (!customElements.get('gob-selector')) customElements.define('gob-selector', GobSelector);
if (!customElements.get('gob-fecha')) customElements.define('gob-fecha', GobFecha);
if (!customElements.get('gob-archivos')) customElements.define('gob-archivos', GobArchivos);
declare global { interface HTMLElementTagNameMap { 'gob-selector': GobSelector; 'gob-fecha': GobFecha; 'gob-archivos': GobArchivos } }
