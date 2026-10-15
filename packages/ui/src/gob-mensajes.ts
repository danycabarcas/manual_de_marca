import { LitElement, html, css, nothing } from 'lit';
import { icono } from './lib/icono.js';

/* ============================================================================
   Mensajes y diálogos:  <gob-alerta>  ·  <gob-modal>  ·  <gob-toasts> (+ gob.toast / gob.confirmar)
   ============================================================================ */
type Tipo = 'info' | 'exito' | 'aviso' | 'peligro' | 'neutro';
const ICO: Record<Tipo, string> = { info: 'info', exito: 'check-circulo', aviso: 'alerta', peligro: 'error', neutro: 'info' };
/** Colores por tipo: [acento, fondo suave, texto/ícono con contraste AA]. */
const COL: Record<Tipo, [string, string, string]> = {
  info: ['#00B7D9', '#E6F8FB', '#00566A'], exito: ['#69B75E', '#F1F8F0', '#2C5A26'], aviso: ['#FEC800', '#FFF8DB', '#6D5600'], peligro: ['#F7003C', '#FFE9EE', '#8A0022'], neutro: ['#6B7482', '#F1F4F8', '#252B36'],
};
const base = css`:host { font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); } svg { display: block; } button { font: inherit; }`;

// ---------------------------------------------------------------- <gob-alerta>
export class GobAlerta extends LitElement {
  static properties = { tipo: { type: String, reflect: true }, titulo: { type: String }, cerrable: { type: Boolean }, icono: { type: String }, _oculta: { state: true } };
  declare tipo: Tipo; declare titulo: string; declare cerrable: boolean; declare icono: string; declare _oculta: boolean;
  constructor() { super(); this.tipo = 'info'; this.titulo = ''; this.cerrable = false; this.icono = ''; this._oculta = false; }
  cerrar() { this._oculta = true; this.dispatchEvent(new CustomEvent('gob-alerta-cerrar', { bubbles: true, composed: true })); }
  render() {
    if (this._oculta) return nothing;
    const t = (COL[this.tipo] ? this.tipo : 'info') as Tipo; const [ac, bg, tx] = COL[t];
    return html`<div class="a" part="alerta" role=${t === 'peligro' || t === 'aviso' ? 'alert' : 'status'} style="--ac:${ac};--bg:${bg};--tx:${tx}">
      <span class="i">${icono(this.icono || ICO[t], 20)}</span>
      <div class="b">${this.titulo ? html`<strong>${this.titulo}</strong>` : nothing}<slot></slot></div>
      <slot name="acciones"></slot>
      ${this.cerrable ? html`<button class="x" type="button" aria-label="Cerrar alerta" @click=${() => this.cerrar()}>${icono('cerrar', 16)}</button>` : nothing}</div>`;
  }
  static styles = [base, css`
    :host { display: block; }
    .a { display: flex; gap: .75rem; align-items: flex-start; padding: .8rem 1rem; border-radius: 8px; border: 1px solid color-mix(in srgb, var(--ac) 28%, #fff); border-left: 4px solid var(--ac); background: var(--bg); color: #252B36; font-size: .9rem; line-height: 1.5; }
    .i { color: var(--tx); flex: none; margin-top: 1px; } .b { flex: 1; min-width: 0; } strong { display: block; color: var(--tx); font-weight: 700; margin-bottom: .1rem; }
    .x { flex: none; border: 0; background: none; color: var(--tx); cursor: pointer; padding: 2px; border-radius: 4px; line-height: 0; } .x:hover { background: color-mix(in srgb, var(--ac) 18%, transparent); } .x:focus-visible { outline: 2px solid var(--tx); outline-offset: 1px; }`];
}

// ---------------------------------------------------------------- <gob-modal>
let bloqueos = 0;
export class GobModal extends LitElement {
  static properties = { abierto: { type: Boolean, reflect: true }, titulo: { type: String }, tam: { type: String }, tipo: { type: String }, cerrable: { type: Boolean }, estatico: { type: Boolean }, icono: { type: String } };
  declare abierto: boolean; declare titulo: string; declare tam: 'sm' | 'md' | 'lg' | 'xl' | 'pantalla'; declare tipo: Tipo | 'normal'; declare cerrable: boolean; declare estatico: boolean; declare icono: string;
  private _motivo = 'api'; private _bloq = false;
  constructor() { super(); this.abierto = false; this.titulo = ''; this.tam = 'md'; this.tipo = 'normal'; this.cerrable = true; this.estatico = false; this.icono = ''; }
  abrir() { this.abierto = true; } cerrar(motivo = 'api') { this._motivo = motivo; this.abierto = false; }
  private get _dlg() { return this.renderRoot.querySelector('dialog') as HTMLDialogElement | null; }
  updated(ch: Map<string, unknown>) {
    if (!ch.has('abierto')) return; const d = this._dlg; if (!d) return;
    if (this.abierto && !d.open) { d.showModal(); this._bloquear(true); this.dispatchEvent(new CustomEvent('gob-modal-abrir', { bubbles: true, composed: true })); }
    else if (!this.abierto && d.open) d.close();
  }
  disconnectedCallback() { super.disconnectedCallback(); this._bloquear(false); }
  private _bloquear(on: boolean) { if (on === this._bloq) return; this._bloq = on; bloqueos += on ? 1 : -1; document.documentElement.style.overflow = bloqueos > 0 ? 'hidden' : ''; }
  private _alCerrar() { this.abierto = false; this._bloquear(false); this.dispatchEvent(new CustomEvent('gob-modal-cerrar', { detail: { motivo: this._motivo }, bubbles: true, composed: true })); this._motivo = 'api'; }
  private _cancel(e: Event) { if (this.estatico) { e.preventDefault(); return; } this._motivo = 'esc'; }
  private _fondo(e: MouseEvent) { if (e.target === this._dlg && !this.estatico) this.cerrar('fondo'); }
  render() {
    const t = this.tipo === 'normal' || !COL[this.tipo as Tipo] ? null : (this.tipo as Tipo); const [ac, , tx] = t ? COL[t] : ['#0071BB', '', '#0071BB'];
    return html`<dialog part="dialogo" class=${this.tam} aria-labelledby="t" @close=${this._alCerrar} @cancel=${this._cancel} @click=${this._fondo} style="--ac:${ac};--tx:${tx}">
      <div class="c" part="contenido">
        <header class="h">${t || this.icono ? html`<span class="i">${icono(this.icono || ICO[t!], 22)}</span>` : nothing}<h2 id="t">${this.titulo}</h2>
          ${this.cerrable ? html`<button class="x" type="button" aria-label="Cerrar" @click=${() => this.cerrar('boton')}>${icono('cerrar', 18)}</button>` : nothing}</header>
        <div class="b" part="cuerpo"><slot></slot></div>
        <footer class="f" part="pie"><slot name="pie"></slot></footer></div></dialog>`;
  }
  static styles = [base, css`
    dialog { padding: 0; border: 0; border-radius: 14px; width: min(92vw, 32rem); max-height: min(90vh, 52rem); color: #252B36; background: #fff; box-shadow: 0 24px 64px rgba(8,26,44,.35); overflow: hidden; }
    dialog.sm { width: min(92vw, 24rem); } dialog.lg { width: min(94vw, 48rem); } dialog.xl { width: min(96vw, 72rem); } dialog.pantalla { width: 100vw; height: 100vh; max-width: none; max-height: none; border-radius: 0; }
    dialog[open] { animation: ent .22s cubic-bezier(.2,.8,.2,1); } dialog::backdrop { background: rgba(8,26,44,.55); backdrop-filter: blur(3px); animation: fon .22s ease; }
    @keyframes ent { from { opacity: 0; transform: translateY(12px) scale(.98); } } @keyframes fon { from { opacity: 0; } }
    .c { display: flex; flex-direction: column; max-height: inherit; height: 100%; } .h { display: flex; align-items: center; gap: .6rem; padding: 1rem 1.25rem; border-bottom: 1px solid #E3E8EF; border-top: 4px solid var(--ac); }
    h2 { margin: 0; flex: 1; font-size: 1.1rem; font-weight: 700; color: #161A22; } .i { color: var(--tx); line-height: 0; }
    .x { border: 0; background: none; color: #4F5866; cursor: pointer; padding: 6px; border-radius: 6px; line-height: 0; } .x:hover { background: #F1F4F8; } .x:focus-visible { outline: 2px solid #0071BB; }
    .b { padding: 1.25rem; overflow: auto; flex: 1; line-height: 1.6; font-size: .95rem; } .f { display: flex; gap: .5rem; justify-content: flex-end; flex-wrap: wrap; padding: .85rem 1.25rem; background: #F8FAFC; border-top: 1px solid #E3E8EF; } .f:not(:has(::slotted(*))) { display: none; }
    @media (prefers-reduced-motion: reduce) { dialog[open], dialog::backdrop { animation: none; } }`];
}

// ---------------------------------------------------------------- <gob-toasts>
export interface ToastOpts { tipo?: Tipo; titulo?: string; mensaje?: string; duracion?: number; accion?: { etiqueta: string; alClic: () => void } }
interface T extends Required<Pick<ToastOpts, 'tipo'>> { id: number; titulo: string; mensaje: string; duracion: number; accion?: ToastOpts['accion'] }
let tid = 0;
export class GobToasts extends LitElement {
  static properties = { posicion: { type: String, reflect: true }, max: { type: Number }, _lista: { state: true } };
  declare posicion: 'abajo-derecha' | 'abajo-izquierda' | 'arriba-derecha' | 'arriba-izquierda' | 'arriba-centro'; declare max: number; declare _lista: T[];
  private _timers = new Map<number, number>();
  constructor() { super(); this.posicion = 'abajo-derecha'; this.max = 4; this._lista = []; }
  agregar(o: ToastOpts): number {
    const t: T = { id: ++tid, tipo: o.tipo ?? 'info', titulo: o.titulo ?? '', mensaje: o.mensaje ?? '', duracion: o.duracion ?? 5000, accion: o.accion };
    this._lista = [...this._lista, t].slice(-this.max); if (t.duracion > 0) this._programar(t); return t.id;
  }
  quitar(id: number) { clearTimeout(this._timers.get(id)); this._timers.delete(id); this._lista = this._lista.filter((x) => x.id !== id); }
  private _programar(t: T) { clearTimeout(this._timers.get(t.id)); this._timers.set(t.id, window.setTimeout(() => this.quitar(t.id), t.duracion)); }
  private _pausa(t: T, on: boolean) { if (t.duracion <= 0) return; if (on) { clearTimeout(this._timers.get(t.id)); } else this._programar(t); }
  render() {
    return html`<div class="l" aria-live="polite" aria-relevant="additions">${this._lista.map((t) => { const [ac, bg, tx] = COL[t.tipo] ?? COL.info;
      return html`<div class="t" role=${t.tipo === 'peligro' ? 'alert' : 'status'} style="--ac:${ac};--bg:${bg};--tx:${tx}" @pointerenter=${() => this._pausa(t, true)} @pointerleave=${() => this._pausa(t, false)} @focusin=${() => this._pausa(t, true)} @focusout=${() => this._pausa(t, false)}>
        <span class="i">${icono(ICO[t.tipo], 20)}</span><div class="b">${t.titulo ? html`<strong>${t.titulo}</strong>` : nothing}${t.mensaje ? html`<span>${t.mensaje}</span>` : nothing}
          ${t.accion ? html`<button class="a" type="button" @click=${() => { t.accion!.alClic(); this.quitar(t.id); }}>${t.accion.etiqueta}</button>` : nothing}</div>
        <button class="x" type="button" aria-label="Cerrar notificación" @click=${() => this.quitar(t.id)}>${icono('cerrar', 16)}</button>
        ${t.duracion > 0 ? html`<i class="p" style="animation-duration:${t.duracion}ms"></i>` : nothing}</div>`; })}</div>`;
  }
  static styles = [base, css`
    :host { position: fixed; z-index: 2147483000; display: block; pointer-events: none; padding: 1rem; max-width: 100vw; }
    :host([posicion='abajo-derecha']) { right: 0; bottom: 0; } :host([posicion='abajo-izquierda']) { left: 0; bottom: 0; } :host([posicion='arriba-derecha']) { right: 0; top: 0; } :host([posicion='arriba-izquierda']) { left: 0; top: 0; } :host([posicion='arriba-centro']) { left: 50%; top: 0; transform: translateX(-50%); }
    .l { display: grid; gap: .6rem; width: min(24rem, calc(100vw - 2rem)); } .t { position: relative; pointer-events: auto; overflow: hidden; display: flex; gap: .7rem; align-items: flex-start; padding: .8rem .9rem; border-radius: 10px; background: #fff; border: 1px solid #E3E8EF; border-left: 4px solid var(--ac); box-shadow: 0 12px 28px rgba(8,26,44,.18); font-size: .88rem; color: #252B36; animation: ent .25s cubic-bezier(.2,.8,.2,1); }
    .i { color: var(--tx); line-height: 0; margin-top: 1px; } .b { flex: 1; min-width: 0; display: grid; gap: .15rem; } strong { color: #161A22; font-weight: 700; }
    .a { justify-self: start; margin-top: .3rem; border: 1px solid var(--tx); background: none; color: var(--tx); border-radius: 6px; padding: .2rem .6rem; font-weight: 600; font-size: .8rem; cursor: pointer; } .a:hover { background: var(--bg); }
    .x { border: 0; background: none; color: #4F5866; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0; } .x:hover { background: #F1F4F8; } .x:focus-visible, .a:focus-visible { outline: 2px solid #0071BB; outline-offset: 1px; }
    .p { position: absolute; left: 0; bottom: 0; height: 3px; width: 100%; background: var(--ac); transform-origin: left; animation: pr linear forwards; } .t:hover .p, .t:focus-within .p { animation-play-state: paused; }
    @keyframes ent { from { opacity: 0; transform: translateX(16px); } } @keyframes pr { to { transform: scaleX(0); } } @media (prefers-reduced-motion: reduce) { .t { animation: none; } .p { display: none; } }`];
}

// ---------------------------------------------------------------- API global: gob.toast / gob.confirmar
export function toast(o: ToastOpts | string, tipo?: Tipo): number {
  const opts: ToastOpts = typeof o === 'string' ? { mensaje: o, tipo } : o;
  let c = document.querySelector('gob-toasts') as GobToasts | null; if (!c) { c = document.createElement('gob-toasts') as GobToasts; document.body.appendChild(c); } return c.agregar(opts);
}
export interface ConfirmarOpts { titulo?: string; mensaje?: string; tipo?: Tipo | 'normal'; textoConfirmar?: string; textoCancelar?: string }
/** Diálogo de confirmación accesible. Devuelve true si el usuario confirma. */
export function confirmar(o: ConfirmarOpts | string): Promise<boolean> {
  const op: ConfirmarOpts = typeof o === 'string' ? { mensaje: o } : o;
  return new Promise((res) => {
    const m = document.createElement('gob-modal') as GobModal; m.titulo = op.titulo ?? 'Confirmar'; m.tam = 'sm'; m.tipo = op.tipo ?? 'normal'; m.estatico = false;
    const p = document.createElement('p'); p.style.margin = '0'; p.textContent = op.mensaje ?? '¿Desea continuar?'; m.appendChild(p);
    const mk = (txt: string, cls: string, val: boolean) => { const b = document.createElement('button'); b.type = 'button'; b.className = cls; b.textContent = txt; b.slot = 'pie'; b.addEventListener('click', () => { ok = val; m.cerrar('boton'); }); return b; };
    let ok = false; m.append(mk(op.textoCancelar ?? 'Cancelar', 'mg-btn mg-btn--secondary', false), mk(op.textoConfirmar ?? 'Aceptar', op.tipo === 'peligro' ? 'mg-btn mg-btn--danger' : 'mg-btn', true));
    m.addEventListener('gob-modal-cerrar', () => { m.remove(); res(ok); }); document.body.appendChild(m); m.updateComplete.then(() => m.abrir());
  });
}

for (const [n, c] of [['gob-alerta', GobAlerta], ['gob-modal', GobModal], ['gob-toasts', GobToasts]] as const) if (!customElements.get(n)) customElements.define(n, c as CustomElementConstructor);
declare global { interface HTMLElementTagNameMap { 'gob-alerta': GobAlerta; 'gob-modal': GobModal; 'gob-toasts': GobToasts } }
