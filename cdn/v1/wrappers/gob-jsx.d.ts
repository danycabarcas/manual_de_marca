/* gob-jsx.d.ts — para que TypeScript acepte <gob-*> en JSX (React, Preact, Solid). Cópielo a su proyecto (p. ej. src/gob-jsx.d.ts). */
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
type GobEl = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, unknown>;
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'gob-tabla': GobEl; 'gob-grafica': GobEl; 'gob-mapa-magdalena': GobEl; 'gob-dashboard': GobEl; 'gob-kpi': GobEl; 'gob-pestanas': GobEl; 'gob-alerta': GobEl; 'gob-modal': GobEl; 'gob-icono': GobEl;
      'gob-linea-tiempo': GobEl; 'gob-pasos': GobEl; 'gob-selector': GobEl; 'gob-fecha': GobEl; 'gob-archivos': GobEl; 'gob-avatar': GobEl; 'gob-arbol': GobEl; 'gob-kanban': GobEl; 'gob-menu': GobEl; 'gob-tooltip': GobEl; 'gob-paginador': GobEl;
    }
  }
}
