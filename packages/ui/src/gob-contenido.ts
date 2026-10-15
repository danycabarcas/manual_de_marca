import { LitElement, html, css, nothing } from 'lit';
import { icono } from './lib/icono.js';

const jsonConv = { fromAttribute: (v: string | null) => { try { return v ? JSON.parse(v) : []; } catch { return []; } } };
const FUENTE = css`:host { display: block; font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); color: var(--gob-color-texto, #161A22); } svg { display: block; } *, *::before, *::after { box-sizing: border-box; }`;
const emit = (el: HTMLElement, n: string, d: unknown) => el.dispatchEvent(new CustomEvent(n, { detail: d, bubbles: true, composed: true }));

/* ============================================================ <gob-avatar> */
const PAL: [string, string][] = [['#0071BB', '#E5F1F9'], ['#07708A', '#E3F6FA'], ['#5618BA', '#EFE8FB'], ['#2E7D32', '#E8F5E9'], ['#8A6A00', '#FFF6D6'], ['#C4002F', '#FFE8EE'], ['#0B2239', '#E3E8EF']];
/** <gob-avatar nombre="Ana Pérez" estado="en-linea"> — foto o iniciales con color estable por nombre. */
export class GobAvatar extends LitElement {
  static properties = { nombre: { type: String }, src: { type: String }, tam: { type: Number }, estado: { type: String, reflect: true }, _err: { state: true } };
  declare nombre: string; declare src: string; declare tam: number; declare estado: string; declare _err: boolean;
  constructor() { super(); this.nombre = ''; this.src = ''; this.tam = 40; this.estado = ''; this._err = false; }
  render() {
    const p = this.nombre.trim().split(/\s+/).filter(Boolean); const ini = ((p[0]?.[0] ?? '') + (p.length > 1 ? p.at(-1)![0] : '')).toUpperCase() || '?'; let h = 0; for (const c of this.nombre) h = (h * 31 + c.charCodeAt(0)) >>> 0; const [fg, bg] = PAL[h % PAL.length];
    return html`<span class="a" style="width:${this.tam}px;height:${this.tam}px;font-size:${this.tam * 0.38}px;color:${fg};background:${bg}" role="img" aria-label=${this.nombre || 'Usuario'}>${this.src && !this._err ? html`<img src=${this.src} alt="" @error=${() => (this._err = true)}>` : ini}${this.estado ? html`<i class="e" title=${this.estado.replace('-', ' ')}></i>` : nothing}</span>`;
  }
  static styles = [FUENTE, css`:host { display: inline-block; vertical-align: middle; } .a { position: relative; display: inline-grid; place-items: center; border-radius: 50%; font-weight: 700; user-select: none; } img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
    .e { position: absolute; right: 0; bottom: 0; width: 28%; height: 28%; min-width: 8px; min-height: 8px; border-radius: 50%; border: 2px solid #fff; background: #9AA4B2; } :host([estado='en-linea']) .e { background: #2E7D32; } :host([estado='ocupado']) .e { background: #F7003C; } :host([estado='ausente']) .e { background: #FEC800; }`];
}

/* ============================================================ <gob-arbol> */
interface Nodo { id: string; etiqueta: string; icono?: string; hijos?: Nodo[]; deshabilitado?: boolean; dato?: unknown }
/** <gob-arbol nodos='[{"id":"a","etiqueta":"Secretaría","hijos":[…]}]'> — jerarquías (organigrama, carpetas, territorios). Teclado: flechas, Enter, Home/End. */
export class GobArbol extends LitElement {
  static properties = { nodos: { converter: jsonConv }, seleccionado: { type: String, reflect: true }, abierto: { type: Boolean }, etiqueta: { type: String }, _exp: { state: true } };
  declare nodos: Nodo[]; declare seleccionado: string; declare abierto: boolean; declare etiqueta: string; declare _exp: Set<string>;
  constructor() { super(); this.nodos = []; this.seleccionado = ''; this.abierto = false; this.etiqueta = 'Árbol'; this._exp = new Set(); }
  willUpdate(c: Map<string, unknown>) { if (c.has('nodos') && this.abierto) { const s = new Set<string>(); const rec = (n: Nodo[]) => n.forEach((x) => { if (x.hijos?.length) { s.add(x.id); rec(x.hijos); } }); rec(this.nodos); this._exp = s; } }
  expandir(id: string, v?: boolean) { const s = new Set(this._exp); (v ?? !s.has(id)) ? s.add(id) : s.delete(id); this._exp = s; }
  private _visibles(n: Nodo[] = this.nodos, nivel = 1, out: { n: Nodo; nivel: number }[] = []) { for (const x of n) { out.push({ n: x, nivel }); if (x.hijos?.length && this._exp.has(x.id)) this._visibles(x.hijos, nivel + 1, out); } return out; }
  private _tecla(e: KeyboardEvent, n: Nodo) {
    const v = this._visibles(); const i = v.findIndex((x) => x.n === n); const foco = (k: number) => { const t = v[k]; if (t) (this.renderRoot.querySelector(`[data-id="${CSS.escape(t.n.id)}"]`) as HTMLElement)?.focus(); };
    if (e.key === 'ArrowDown') { e.preventDefault(); foco(i + 1); } else if (e.key === 'ArrowUp') { e.preventDefault(); foco(i - 1); } else if (e.key === 'Home') { e.preventDefault(); foco(0); } else if (e.key === 'End') { e.preventDefault(); foco(v.length - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); if (n.hijos?.length) { if (!this._exp.has(n.id)) this.expandir(n.id, true); else foco(i + 1); } } else if (e.key === 'ArrowLeft') { e.preventDefault(); if (n.hijos?.length && this._exp.has(n.id)) this.expandir(n.id, false); else { const nv = v[i].nivel; for (let k = i - 1; k >= 0; k--) if (v[k].nivel < nv) { foco(k); break; } } }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._sel(n); }
  }
  private _sel(n: Nodo) { if (n.deshabilitado) return; this.seleccionado = n.id; emit(this, 'gob-arbol-seleccion', { id: n.id, nodo: n }); if (n.hijos?.length) this.expandir(n.id); }
  private _nodo(n: Nodo, nivel: number, primero: boolean): unknown {
    const tiene = !!n.hijos?.length; const ab = this._exp.has(n.id);
    return html`<li role="treeitem" aria-level=${nivel} aria-expanded=${tiene ? ab : nothing} aria-selected=${this.seleccionado === n.id} aria-disabled=${n.deshabilitado ? 'true' : nothing}>
      <div class="f ${this.seleccionado === n.id ? 'on' : ''}" data-id=${n.id} tabindex=${this.seleccionado === n.id || (!this.seleccionado && primero) ? 0 : -1} style="padding-left:${0.4 + (nivel - 1) * 1.25}rem" @click=${() => this._sel(n)} @keydown=${(e: KeyboardEvent) => this._tecla(e, n)}>
        <span class="t ${tiene ? '' : 'v'}" @click=${(e: Event) => { e.stopPropagation(); this.expandir(n.id); }}>${tiene ? icono(ab ? 'chevron-abajo' : 'chevron-derecha', 14) : nothing}</span>${icono(n.icono ?? (tiene ? 'carpeta' : 'archivo'), 16)}<span class="l">${n.etiqueta}</span></div>
      ${tiene && ab ? html`<ul role="group">${n.hijos!.map((h) => this._nodo(h, nivel + 1, false))}</ul>` : nothing}</li>`;
  }
  render() { return html`<ul role="tree" aria-label=${this.etiqueta} class="r">${this.nodos.map((n, i) => this._nodo(n, 1, i === 0))}</ul>`; }
  static styles = [FUENTE, css`ul { list-style: none; margin: 0; padding: 0; } .f { display: flex; align-items: center; gap: .45rem; padding: .4rem .5rem; border-radius: 8px; cursor: pointer; font-size: .9rem; color: #3A424F; } .f:hover { background: #F1F4F8; } .f.on { background: #E5F1F9; color: #004F82; font-weight: 600; } .f:focus-visible { outline: 2px solid #0071BB; outline-offset: -2px; }
    .t { display: grid; place-items: center; width: 1.1rem; height: 1.1rem; color: #5B6575; flex: none; } .t.v { pointer-events: none; } .l { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }`];
}

/* ============================================================ <gob-kanban> */
interface Col { id: string; titulo: string; color?: string; limite?: number }
interface Tar { id: string; columna: string; titulo: string; descripcion?: string; etiquetas?: string[]; asignado?: string; prioridad?: 'alta' | 'media' | 'baja'; fecha?: string }
const PRI: Record<string, string> = { alta: '#F7003C', media: '#FEC800', baja: '#69B75E' };
/** <gob-kanban columnas='[…]' tarjetas='[…]'> — tablero de columnas con arrastrar y soltar (o botones ◀ ▶ con teclado). */
export class GobKanban extends LitElement {
  static properties = { columnas: { converter: jsonConv }, tarjetas: { converter: jsonConv }, _arr: { state: true }, _sobre: { state: true }, _msg: { state: true } };
  declare columnas: Col[]; declare tarjetas: Tar[]; declare _arr: string; declare _sobre: string; declare _msg: string;
  constructor() { super(); this.columnas = []; this.tarjetas = []; this._arr = ''; this._sobre = ''; this._msg = ''; }
  mover(id: string, hasta: string, antesDe?: string) {
    const t = this.tarjetas.find((x) => x.id === id); if (!t || !this.columnas.some((c) => c.id === hasta)) return; const desde = t.columna;
    const resto = this.tarjetas.filter((x) => x.id !== id); const nueva = { ...t, columna: hasta }; const i = antesDe ? resto.findIndex((x) => x.id === antesDe) : -1;
    if (i >= 0) resto.splice(i, 0, nueva); else resto.push(nueva); this.tarjetas = resto; const titulo = this.columnas.find((c) => c.id === hasta)?.titulo ?? hasta; this._msg = `«${t.titulo}» movida a ${titulo}`;
    emit(this, 'gob-kanban-mover', { id, desde, hasta, tarjetas: this.tarjetas });
  }
  private _paso(t: Tar, d: number) { const i = this.columnas.findIndex((c) => c.id === t.columna) + d; if (i < 0 || i >= this.columnas.length) return; this.mover(t.id, this.columnas[i].id); this.updateComplete.then(() => (this.renderRoot.querySelector(`[data-t="${CSS.escape(t.id)}"]`) as HTMLElement)?.focus()); }
  render() {
    return html`<div class="tb" part="tablero">${this.columnas.map((c) => { const ts = this.tarjetas.filter((t) => t.columna === c.id); const lleno = c.limite != null && ts.length > c.limite;
      return html`<section class="c ${this._sobre === c.id ? 'sobre' : ''}" aria-label=${c.titulo + ', ' + ts.length + ' tarjetas'} @dragover=${(e: DragEvent) => { e.preventDefault(); this._sobre = c.id; }} @dragleave=${() => (this._sobre = '')} @drop=${(e: DragEvent) => { e.preventDefault(); this._sobre = ''; if (this._arr) this.mover(this._arr, c.id); this._arr = ''; }}>
        <header><i style="background:${c.color ?? '#0071BB'}"></i><h3>${c.titulo}</h3><span class="n ${lleno ? 'lim' : ''}">${ts.length}${c.limite != null ? '/' + c.limite : ''}</span></header>
        <div class="ls">${ts.map((t) => html`<article class="k ${this._arr === t.id ? 'arr' : ''}" draggable="true" tabindex="0" data-t=${t.id} @dragstart=${(e: DragEvent) => { this._arr = t.id; e.dataTransfer?.setData('text/plain', t.id); }} @dragend=${() => { this._arr = ''; this._sobre = ''; }}
            @drop=${(e: DragEvent) => { e.preventDefault(); e.stopPropagation(); this._sobre = ''; if (this._arr && this._arr !== t.id) this.mover(this._arr, c.id, t.id); this._arr = ''; }} @keydown=${(e: KeyboardEvent) => { if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); this._paso(t, 1); } else if (e.altKey && e.key === 'ArrowLeft') { e.preventDefault(); this._paso(t, -1); } }}
            @click=${() => emit(this, 'gob-kanban-clic', { tarjeta: t })}>${t.prioridad ? html`<span class="p" style="background:${PRI[t.prioridad]}" title=${'Prioridad ' + t.prioridad}></span>` : nothing}
            <strong>${t.titulo}</strong>${t.descripcion ? html`<p>${t.descripcion}</p>` : nothing}${t.etiquetas?.length ? html`<div class="et">${t.etiquetas.map((e) => html`<span>${e}</span>`)}</div>` : nothing}
            <footer>${t.fecha ? html`<small>${icono('calendario', 12)}${t.fecha}</small>` : html`<span></span>`}${t.asignado ? html`<gob-avatar-mini .n=${t.asignado}></gob-avatar-mini>` : nothing}
              <span class="mv"><button type="button" aria-label="Mover a la columna anterior" ?disabled=${this.columnas[0]?.id === c.id} @click=${(e: Event) => { e.stopPropagation(); this._paso(t, -1); }}>${icono('chevron-izquierda', 14)}</button><button type="button" aria-label="Mover a la columna siguiente" ?disabled=${this.columnas.at(-1)?.id === c.id} @click=${(e: Event) => { e.stopPropagation(); this._paso(t, 1); }}>${icono('chevron-derecha', 14)}</button></span></footer></article>`)}
          ${ts.length ? nothing : html`<p class="vc">Sin tarjetas</p>`}</div></section>`; })}</div><div class="sr" role="status" aria-live="polite">${this._msg}</div>`;
  }
  static styles = [FUENTE, css`.tb { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(16rem, 1fr); gap: .9rem; overflow-x: auto; padding-bottom: .5rem; align-items: start; } .c { background: #F1F4F8; border: 2px solid transparent; border-radius: 14px; padding: .7rem; min-height: 8rem; transition: border-color .15s, background .15s; } .c.sobre { border-color: #0071BB; background: #E5F1F9; }
    header { display: flex; align-items: center; gap: .55rem; margin-bottom: .6rem; } header i { width: .65rem; height: .65rem; border-radius: 50%; } h3 { margin: 0; font-size: .85rem; flex: 1; } .n { font-size: .74rem; font-weight: 700; background: #fff; border-radius: 99px; padding: .1rem .55rem; color: #3A424F; } .n.lim { background: #FFE8EE; color: #C4002F; }
    .ls { display: grid; gap: .55rem; } .k { position: relative; background: #fff; border: 1px solid #E3E8EF; border-radius: 10px; padding: .75rem .8rem .6rem 1rem; cursor: grab; box-shadow: 0 1px 2px rgba(8,26,44,.06); } .k:hover { border-color: #9AA4B2; } .k:focus-visible { outline: 2px solid #0071BB; outline-offset: 2px; } .k.arr { opacity: .45; }
    .p { position: absolute; left: 0; top: .6rem; bottom: .6rem; width: 4px; border-radius: 0 4px 4px 0; } strong { font-size: .86rem; display: block; } .k p { margin: .25rem 0 0; font-size: .8rem; color: #4F5866; line-height: 1.4; } .et { display: flex; flex-wrap: wrap; gap: .3rem; margin-top: .5rem; } .et span { font-size: .68rem; font-weight: 700; background: #E5F1F9; color: #004F82; border-radius: 6px; padding: .1rem .45rem; }
    footer { display: flex; align-items: center; gap: .5rem; margin-top: .55rem; } small { display: inline-flex; align-items: center; gap: .25rem; font-size: .72rem; color: #5B6575; flex: 1; } .mv { margin-left: auto; display: inline-flex; opacity: 0; transition: opacity .15s; } .k:hover .mv, .k:focus-within .mv { opacity: 1; } .mv button { display: grid; place-items: center; width: 1.6rem; height: 1.6rem; border: 0; border-radius: 6px; background: none; color: #5B6575; cursor: pointer; } .mv button:hover:not(:disabled) { background: #F1F4F8; color: #161A22; } .mv button:disabled { opacity: .3; cursor: default; }
    .vc { text-align: center; color: #5B6575; font-size: .8rem; padding: 1rem 0; margin: 0; } .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }`];
}
/** avatar mínimo interno del kanban (iniciales) */
export class GobAvatarMini extends LitElement {
  static properties = { n: { type: String } }; declare n: string; constructor() { super(); this.n = ''; }
  render() { const p = (this.n || '').trim().split(/\s+/); const i = ((p[0]?.[0] ?? '') + (p.length > 1 ? p.at(-1)![0] : '')).toUpperCase(); return html`<span title=${this.n} role="img" aria-label=${this.n}>${i}</span>`; }
  static styles = css`:host { display: inline-block; } span { display: grid; place-items: center; width: 1.7rem; height: 1.7rem; border-radius: 50%; background: #E5F1F9; color: #004F82; font: 700 .68rem 'Montserrat', system-ui, sans-serif; }`;
}

/* ============================================================ <gob-menu> */
interface ItemM { id: string; etiqueta: string; icono?: string; tipo?: 'peligro'; separador?: boolean; deshabilitado?: boolean }
/** <gob-menu items='[…]'><button>Opciones</button></gob-menu> — menú desplegable; con `contextual`, aparece con clic derecho sobre su contenido. */
export class GobMenu extends LitElement {
  static properties = { items: { converter: jsonConv }, contextual: { type: Boolean }, alinear: { type: String }, _a: { state: true }, _i: { state: true }, _pos: { state: true } };
  declare items: ItemM[]; declare contextual: boolean; declare alinear: 'inicio' | 'fin'; declare _a: boolean; declare _i: number; declare _pos: [number, number] | null;
  constructor() { super(); this.items = []; this.contextual = false; this.alinear = 'inicio'; this._a = false; this._i = 0; this._pos = null; }
  private get _ops() { return this.items.filter((x) => !x.separador); }
  abrir(pos?: [number, number]) { this._pos = pos ?? null; this._a = true; this._i = this.items.findIndex((x) => !x.separador && !x.deshabilitado); this.updateComplete.then(() => (this.renderRoot.querySelector('.m') as HTMLElement)?.focus()); }
  cerrar(foco = true) { this._a = false; if (foco) (this.querySelector('button, a, [tabindex]') as HTMLElement)?.focus(); }
  private _tecla(e: KeyboardEvent) {
    const v = this.items.map((x, k) => (x.separador || x.deshabilitado ? -1 : k)).filter((k) => k >= 0); const p = v.indexOf(this._i);
    if (e.key === 'ArrowDown') { e.preventDefault(); this._i = v[(p + 1) % v.length]; } else if (e.key === 'ArrowUp') { e.preventDefault(); this._i = v[(p - 1 + v.length) % v.length]; } else if (e.key === 'Home') { e.preventDefault(); this._i = v[0]; } else if (e.key === 'End') { e.preventDefault(); this._i = v.at(-1)!; }
    else if (e.key === 'Escape') { e.preventDefault(); this.cerrar(); } else if (e.key === 'Tab') this.cerrar(false); else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._elegir(this.items[this._i]); }
  }
  private _elegir(it?: ItemM) { if (!it || it.deshabilitado) return; this.cerrar(); emit(this, 'gob-menu-accion', { id: it.id, item: it }); }
  private _fuera = (e: Event) => { if (this._a && !e.composedPath().includes(this)) this._a = false; };
  connectedCallback() { super.connectedCallback(); document.addEventListener('pointerdown', this._fuera, true); }
  disconnectedCallback() { super.disconnectedCallback(); document.removeEventListener('pointerdown', this._fuera, true); }
  render() {
    const est = this._pos ? `position:fixed;left:${this._pos[0]}px;top:${this._pos[1]}px;` : this.alinear === 'fin' ? 'right:0;' : 'left:0;';
    return html`<div class="w" @click=${() => { if (this.contextual) return; if (this._a) this.cerrar(false); else this.abrir(); }} @contextmenu=${(e: MouseEvent) => { if (this.contextual) { e.preventDefault(); this.abrir([e.clientX, e.clientY]); } }} @keydown=${(e: KeyboardEvent) => { if (!this.contextual && e.key === 'ArrowDown' && !this._a) { e.preventDefault(); this.abrir(); } }}><slot aria-haspopup="menu"></slot>
      ${this._a ? html`<div class="m" role="menu" tabindex="-1" style=${est} aria-activedescendant=${'mi' + this._i} @keydown=${this._tecla}>${this.items.map((it, i) => it.separador ? html`<hr role="separator">` : html`<div id=${'mi' + i} role="menuitem" class="i ${i === this._i ? 'on' : ''} ${it.tipo === 'peligro' ? 'pel' : ''}" aria-disabled=${it.deshabilitado ? 'true' : nothing} @mouseenter=${() => (this._i = i)} @click=${(e: Event) => { e.stopPropagation(); this._elegir(it); }}>${icono(it.icono, 16)}<span>${it.etiqueta}</span></div>`)}</div>` : nothing}</div>`;
  }
  static styles = [FUENTE, css`:host { display: inline-block; } .w { position: relative; display: inline-block; } .m { position: absolute; z-index: 1000; top: 100%; margin-top: 4px; min-width: 12rem; padding: .35rem; background: #fff; border: 1px solid #E3E8EF; border-radius: 12px; box-shadow: 0 16px 40px rgba(8,26,44,.18); outline: 0; }
    .i { display: flex; align-items: center; gap: .6rem; padding: .5rem .65rem; border-radius: 8px; font-size: .88rem; cursor: pointer; color: #161A22; white-space: nowrap; } .i.on { background: #F1F4F8; } .i.pel { color: #C4002F; } .i.pel.on { background: #FFE8EE; } .i[aria-disabled='true'] { opacity: .4; cursor: not-allowed; } hr { border: 0; border-top: 1px solid #E3E8EF; margin: .3rem 0; }`];
}

/* ============================================================ <gob-tooltip> */
/** <gob-tooltip texto="Descarga el reporte"><button>…</button></gob-tooltip> */
export class GobTooltip extends LitElement {
  static properties = { texto: { type: String }, posicion: { type: String, reflect: true }, _v: { state: true } };
  declare texto: string; declare posicion: 'arriba' | 'abajo' | 'izquierda' | 'derecha'; declare _v: boolean;
  private _id = 'tt' + Math.random().toString(36).slice(2, 7);
  constructor() { super(); this.texto = ''; this.posicion = 'arriba'; this._v = false; }
  private _desc() { const c = this.firstElementChild as HTMLElement | null; if (c && this.texto && !c.hasAttribute('aria-description')) c.setAttribute('aria-description', this.texto); }
  updated() { this._desc(); }
  render() { return html`<span class="w" @mouseenter=${() => (this._v = true)} @mouseleave=${() => (this._v = false)} @focusin=${() => (this._v = true)} @focusout=${() => (this._v = false)} @keydown=${(e: KeyboardEvent) => { if (e.key === 'Escape') this._v = false; }}><slot @slotchange=${() => this._desc()}></slot>${this._v && this.texto ? html`<span class="t" role="tooltip" id=${this._id}>${this.texto}</span>` : nothing}</span>`; }
  static styles = [FUENTE, css`:host { display: inline-block; } .w { position: relative; display: inline-block; } .t { position: absolute; z-index: 1000; left: 50%; bottom: calc(100% + 8px); transform: translateX(-50%); background: #081A2C; color: #fff; font-size: .76rem; font-weight: 500; line-height: 1.35; padding: .4rem .65rem; border-radius: 8px; max-width: 16rem; width: max-content; pointer-events: none; box-shadow: 0 6px 18px rgba(8,26,44,.3); }
    :host([posicion='abajo']) .t { bottom: auto; top: calc(100% + 8px); } :host([posicion='izquierda']) .t { left: auto; right: calc(100% + 8px); bottom: 50%; transform: translateY(50%); } :host([posicion='derecha']) .t { left: calc(100% + 8px); bottom: 50%; transform: translateY(50%); }`];
}

/* ============================================================ <gob-paginador> */
/** <gob-paginador total="900" pagina="1" tamano="10"> — paginación suelta (listas, tarjetas, API). */
export class GobPaginador extends LitElement {
  static properties = { total: { type: Number }, pagina: { type: Number, reflect: true }, tamano: { type: Number }, opciones: { converter: jsonConv }, resumen: { type: Boolean } };
  declare total: number; declare pagina: number; declare tamano: number; declare opciones: number[]; declare resumen: boolean;
  constructor() { super(); this.total = 0; this.pagina = 1; this.tamano = 10; this.opciones = [10, 25, 50]; this.resumen = true; }
  private get _n() { return Math.max(1, Math.ceil(this.total / this.tamano)); }
  private _ir(p: number) { p = Math.max(1, Math.min(this._n, p)); if (p === this.pagina) return; this.pagina = p; emit(this, 'gob-pagina-cambio', { pagina: p, tamano: this.tamano, desde: (p - 1) * this.tamano, hasta: Math.min(this.total, p * this.tamano) }); }
  private _nums() { const n = this._n, p = this.pagina; const s = new Set([1, n, p - 1, p, p + 1]); if (p <= 3) [2, 3, 4].forEach((x) => s.add(x)); if (p >= n - 2) [n - 1, n - 2, n - 3].forEach((x) => s.add(x)); const v = [...s].filter((x) => x >= 1 && x <= n).sort((a, b) => a - b); const o: (number | '…')[] = []; v.forEach((x, i) => { if (i && x - v[i - 1] > 1) o.push('…'); o.push(x); }); return o; }
  render() {
    const d = this.total ? (this.pagina - 1) * this.tamano + 1 : 0, h = Math.min(this.total, this.pagina * this.tamano);
    return html`<nav aria-label="Paginación">${this.resumen ? html`<span class="r">${d}–${h} de ${this.total.toLocaleString('es-CO')}</span>` : nothing}
      <select aria-label="Filas por página" @change=${(e: Event) => { this.tamano = +(e.target as HTMLSelectElement).value; this.pagina = 1; emit(this, 'gob-pagina-cambio', { pagina: 1, tamano: this.tamano, desde: 0, hasta: Math.min(this.total, this.tamano) }); }}>${this.opciones.map((o) => html`<option value=${o} ?selected=${o === this.tamano}>${o} / pág.</option>`)}</select>
      <span class="b"><button type="button" aria-label="Anterior" ?disabled=${this.pagina <= 1} @click=${() => this._ir(this.pagina - 1)}>${icono('chevron-izquierda', 16)}</button>${this._nums().map((x) => (x === '…' ? html`<span class="e">…</span>` : html`<button type="button" class=${x === this.pagina ? 'on' : ''} aria-current=${x === this.pagina ? 'page' : nothing} aria-label=${'Página ' + x} @click=${() => this._ir(x)}>${x}</button>`))}<button type="button" aria-label="Siguiente" ?disabled=${this.pagina >= this._n} @click=${() => this._ir(this.pagina + 1)}>${icono('chevron-derecha', 16)}</button></span></nav>`;
  }
  static styles = [FUENTE, css`nav { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; justify-content: space-between; } .r { font-size: .82rem; color: #4F5866; } .b { display: inline-flex; gap: .25rem; } .b button { display: grid; place-items: center; min-width: 2.1rem; height: 2.1rem; padding: 0 .4rem; border: 1px solid transparent; border-radius: 8px; background: none; font: 600 .84rem 'Montserrat', system-ui, sans-serif; color: #3A424F; cursor: pointer; } .b button:hover:not(:disabled):not(.on) { background: #F1F4F8; } .b button.on { background: #0071BB; color: #fff; } .b button:disabled { opacity: .35; cursor: default; } .b button:focus-visible { outline: 2px solid #0071BB; outline-offset: 1px; } .e { display: grid; place-items: center; min-width: 1.5rem; color: #5B6575; }
    select { font: inherit; font-size: .82rem; border: 1px solid #CBD2DC; border-radius: 8px; padding: .4rem .6rem; background: #fff; color: #161A22; }`];
}

const def = (n: string, c: CustomElementConstructor) => { if (!customElements.get(n)) customElements.define(n, c); };
def('gob-avatar', GobAvatar); def('gob-arbol', GobArbol); def('gob-kanban', GobKanban); def('gob-avatar-mini', GobAvatarMini); def('gob-menu', GobMenu); def('gob-tooltip', GobTooltip); def('gob-paginador', GobPaginador);
declare global { interface HTMLElementTagNameMap { 'gob-avatar': GobAvatar; 'gob-arbol': GobArbol; 'gob-kanban': GobKanban; 'gob-menu': GobMenu; 'gob-tooltip': GobTooltip; 'gob-paginador': GobPaginador } }
