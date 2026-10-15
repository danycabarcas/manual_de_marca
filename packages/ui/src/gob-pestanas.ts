import { LitElement, html, css, nothing } from 'lit';
import { icono } from './lib/icono.js';

/* <gob-pestanas items='[{"id":"a","titulo":"General"},…]' activa="a">  +  <div slot="a">contenido</div> … */
interface Item { id: string; titulo: string; icono?: string; contador?: number; deshabilitada?: boolean }
const jsonConv = { fromAttribute: (v: string | null) => { try { return v ? JSON.parse(v) : []; } catch { return []; } } };

export class GobPestanas extends LitElement {
  static properties = { items: { converter: jsonConv }, activa: { type: String, reflect: true }, variante: { type: String, reflect: true }, etiqueta: { type: String } };
  declare items: Item[]; declare activa: string; declare variante: 'linea' | 'pildora'; declare etiqueta: string;
  constructor() { super(); this.items = []; this.activa = ''; this.variante = 'linea'; this.etiqueta = 'Secciones'; }
  private get _act() { return this.activa && this.items.some((i) => i.id === this.activa) ? this.activa : this.items.find((i) => !i.deshabilitada)?.id ?? ''; }
  private _ir(id: string) { if (id === this._act) return; this.activa = id; this.dispatchEvent(new CustomEvent('gob-pestana-cambio', { detail: { id }, bubbles: true, composed: true })); }
  private _tecla(e: KeyboardEvent, i: number) {
    const v = this.items.map((x, k) => (x.deshabilitada ? -1 : k)).filter((k) => k >= 0); const pos = v.indexOf(i); let n = -1;
    if (e.key === 'ArrowRight') n = v[(pos + 1) % v.length]; else if (e.key === 'ArrowLeft') n = v[(pos - 1 + v.length) % v.length]; else if (e.key === 'Home') n = v[0]; else if (e.key === 'End') n = v.at(-1)!;
    if (n < 0) return; e.preventDefault(); this._ir(this.items[n].id); this.updateComplete.then(() => (this.renderRoot.querySelector(`#t-${this.items[n].id}`) as HTMLElement)?.focus());
  }
  render() {
    const a = this._act;
    return html`<div class="l" role="tablist" aria-label=${this.etiqueta} part="lista">${this.items.map((it, i) => html`<button id="t-${it.id}" class="t ${it.id === a ? 'on' : ''}" role="tab" type="button" aria-selected=${it.id === a} aria-controls="p-${it.id}" tabindex=${it.id === a ? 0 : -1} ?disabled=${it.deshabilitada}
      @click=${() => this._ir(it.id)} @keydown=${(e: KeyboardEvent) => this._tecla(e, i)}>${icono(it.icono, 16)}<span>${it.titulo}</span>${it.contador != null ? html`<em>${it.contador}</em>` : nothing}</button>`)}</div>
      ${this.items.map((it) => html`<div id="p-${it.id}" class="p" role="tabpanel" aria-labelledby="t-${it.id}" tabindex="0" ?hidden=${it.id !== a} part="panel"><slot name=${it.id}></slot></div>`)}`;
  }
  static styles = css`
    :host { display: block; font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); } .l { display: flex; gap: .25rem; overflow-x: auto; border-bottom: 1px solid var(--gob-borde, #E3E8EF); }
    .t { display: inline-flex; align-items: center; gap: .45rem; padding: .7rem 1rem; border: 0; background: none; cursor: pointer; font-family: inherit; font-weight: 600; font-size: .875rem; color: #4F5866; border-bottom: 2px solid transparent; margin-bottom: -1px; white-space: nowrap; border-radius: 0; }
    .t:hover:not(:disabled) { color: #161A22; } .t.on { color: #0071BB; border-bottom-color: #0071BB; } .t:disabled { opacity: .4; cursor: not-allowed; } .t:focus-visible, .p:focus-visible { outline: 2px solid #0071BB; outline-offset: -2px; border-radius: 6px; }
    em { font-style: normal; font-size: .72rem; font-weight: 700; background: #F1F4F8; color: #3A424F; border-radius: 99px; padding: .05rem .5rem; } .t.on em { background: #D6E8F4; color: #004F82; }
    :host([variante='pildora']) .l { border: 0; gap: .4rem; } :host([variante='pildora']) .t { border: 1px solid #E3E8EF; border-radius: 99px; margin: 0; padding: .45rem .95rem; } :host([variante='pildora']) .t.on { background: #0071BB; color: #fff; border-color: #0071BB; } :host([variante='pildora']) .t.on em { background: rgba(255,255,255,.22); color: #fff; }
    .p { padding: 1rem 0; } svg { display: block; }`;
}
if (!customElements.get('gob-pestanas')) customElements.define('gob-pestanas', GobPestanas);
declare global { interface HTMLElementTagNameMap { 'gob-pestanas': GobPestanas } }
