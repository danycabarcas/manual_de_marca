/* gob-angular.ts — soporte Angular para los Web Components gob-* (Angular 15+, componentes standalone).
   Copie a su proyecto (p. ej. src/app/gob/gob-angular.ts).

   1) main.ts (una vez; o ponga las 2 etiquetas en index.html):
        import { cargarGob } from './app/gob/gob-angular';
        cargarGob('https://manualdemarca.magdalena.gov.co/cdn/v1');

   2) En cada componente que use etiquetas gob-*:
        import { GOB_SCHEMAS } from './gob/gob-angular';
        @Component({ standalone: true, schemas: GOB_SCHEMAS, template: `
          <gob-tabla [config]="cfg" (gob-tabla-accion)="alAccion($any($event).detail)"></gob-tabla>` })

   3) Propiedades: use [propiedad]="valor" (objetos y arreglos van por propiedad, no por atributo).
      Eventos: (gob-evento)="manejador($any($event).detail)". Tipos de los eventos: ver abajo (GobEventos). */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

export const GOB_SCHEMAS = [CUSTOM_ELEMENTS_SCHEMA];

export function cargarGob(base = '/cdn/v1'): void {
  if (typeof document === 'undefined' || document.querySelector('script[data-gob]')) return;
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = base + '/gob.css'; document.head.appendChild(l);
  const s = document.createElement('script'); s.type = 'module'; s.src = base + '/gob.js'; s.dataset['gob'] = ''; document.head.appendChild(s);
}

/** Forma del `detail` de cada evento (útil para tipar con `$any($event).detail as GobEventos['gob-kanban-mover']`). */
export interface GobEventos {
  'gob-tabla-seleccion': { llaves: unknown[]; filas: any[] };
  'gob-tabla-accion': { accion: string; fila?: any; filas?: any[]; llaves?: unknown[] };
  'gob-tabla-fila-clic': { fila: any };
  'gob-tabla-orden': { campo: string; dir: 'asc' | 'desc' } | null;
  'gob-tabla-consulta': { pagina: number; tamano: number; orden: any; busqueda: string; filtros: Record<string, unknown> };
  'gob-grafica-click': { nombre: string; serie?: string; valor: number; indice: number; tipo: string };
  'gob-municipio-click': { codigo: string; nombre?: string };
  'gob-dashboard-filtro': { filtros: Record<string, unknown>; total: number };
  'gob-pestana-cambio': { id: string };
  'gob-paso-cambio': { actual: number; id: string; primero: boolean; ultimo: boolean };
  'gob-selector-cambio': { valor: string | string[]; opciones: { valor: string; etiqueta: string }[] };
  'gob-fecha-cambio': { valor: string; inicio: string; fin: string };
  'gob-archivos-cambio': { archivos: File[]; rechazados: { nombre: string; motivo?: string }[] };
  'gob-arbol-seleccion': { id: string; nodo: any };
  'gob-kanban-mover': { id: string; desde: string; hasta: string; tarjetas: any[] };
  'gob-kanban-clic': { tarjeta: any };
  'gob-menu-accion': { id: string; item: any };
  'gob-pagina-cambio': { pagina: number; tamano: number; desde: number; hasta: number };
}
