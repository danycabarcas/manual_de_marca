import { LitElement, html, css } from 'lit';
import { icono } from './lib/icono.js';
import { NOMBRES_ICONOS } from './lib/iconos-data.js';

/** <gob-icono nombre="usuario" tam="20" etiqueta="Perfil"> — ícono estándar; sin «etiqueta» es decorativo. */
export class GobIcono extends LitElement {
  static properties = { nombre: { type: String }, tam: { type: Number }, etiqueta: { type: String } };
  declare nombre: string; declare tam: number; declare etiqueta: string;
  constructor() { super(); this.nombre = ''; this.tam = 20; this.etiqueta = ''; }
  static get nombres() { return NOMBRES_ICONOS; }
  render() {
    return html`<span class="w" role=${this.etiqueta ? 'img' : 'presentation'} aria-label=${this.etiqueta || ''} aria-hidden=${this.etiqueta ? 'false' : 'true'}>${icono(this.nombre, this.tam)}</span>`;
  }
  static styles = css`:host { display: inline-flex; vertical-align: middle; color: inherit; } .w { display: inline-flex; line-height: 0; } svg { display: block; }`;
}
if (!customElements.get('gob-icono')) customElements.define('gob-icono', GobIcono);
declare global { interface HTMLElementTagNameMap { 'gob-icono': GobIcono } }
