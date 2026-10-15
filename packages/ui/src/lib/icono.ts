import { html, nothing } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { ICONOS_SVG } from './iconos-data.js';

/** Ícono inline (Lucide, ISC) por nombre en español. Decorativo por defecto (aria-hidden). */
export const icono = (nombre?: string, tam = 18) =>
  nombre && ICONOS_SVG[nombre]
    ? html`<svg class="ico" width=${tam} height=${tam} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${unsafeSVG(ICONOS_SVG[nombre])}</svg>`
    : nothing;
