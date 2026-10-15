/* gob-react.jsx — componentes React/Next.js listos para usar sobre los Web Components gob-*.
   Copie este archivo a su proyecto (p. ej. src/gob/index.jsx) y úselo así:
     import { GobTabla, GobKanban, cargarGob } from './gob';
     cargarGob('https://manualdemarca.magdalena.gov.co/cdn/v1');         // una vez (o ponga las 2 etiquetas en index.html)
     <GobTabla config={{ datos, columnas }} onAccion={(d) => ...} />
   Next.js (App Router): marque el archivo que lo use con 'use client'.
   Regla: strings/números/booleanos van como atributos; objetos y arreglos como propiedades; onXxx = evento (abajo). */
import { createElement, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export function cargarGob(base = '/cdn/v1') {
  if (typeof document === 'undefined' || document.querySelector('script[data-gob]')) return;
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = base + '/gob.css'; document.head.appendChild(l);
  const s = document.createElement('script'); s.type = 'module'; s.src = base + '/gob.js'; s.dataset.gob = ''; document.head.appendChild(s);
}

const kebab = (k) => k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

function crear(tag, eventos = {}) {
  const C = forwardRef(function Gob({ children, className, style, ...props }, ref) {
    const el = useRef(null);
    useImperativeHandle(ref, () => el.current);
    const attrs = {}, propiedades = {}, manejadores = {};
    for (const [k, v] of Object.entries(props)) {
      if (k.startsWith('on') && eventos[k]) manejadores[eventos[k]] = v;
      else if (v !== null && typeof v === 'object' || typeof v === 'function') propiedades[k] = v;
      else if (typeof v === 'boolean') { if (v) attrs[kebab(k)] = ''; }
      else if (v !== undefined) attrs[kebab(k)] = v;
    }
    useEffect(() => { const e = el.current; if (!e) return; for (const [k, v] of Object.entries(propiedades)) e[k] = v; });
    useEffect(() => {
      const e = el.current; if (!e) return; const hs = Object.entries(manejadores).map(([n, f]) => { const h = (ev) => f?.(ev.detail, ev); e.addEventListener(n, h); return [n, h]; });
      return () => hs.forEach(([n, h]) => e.removeEventListener(n, h));
    });
    return createElement(tag, { ref: el, class: className, style: typeof style === 'string' ? style : undefined, ...attrs }, children);
  });
  C.displayName = tag;
  return C;
}

export const GobTabla = crear('gob-tabla', { onSeleccion: 'gob-tabla-seleccion', onAccion: 'gob-tabla-accion', onFilaClic: 'gob-tabla-fila-clic', onOrden: 'gob-tabla-orden', onFiltro: 'gob-tabla-filtro', onPagina: 'gob-tabla-pagina', onConsulta: 'gob-tabla-consulta', onExportar: 'gob-tabla-exportar' });
export const GobGrafica = crear('gob-grafica', { onClick: 'gob-grafica-click', onLista: 'gob-grafica-lista' });
export const GobMapa = crear('gob-mapa-magdalena', { onMunicipioClic: 'gob-municipio-click', onMarcadorClic: 'gob-marcador-click', onMunicipioHover: 'gob-municipio-hover', onSeleccion: 'gob-seleccion-cambio', onListo: 'gob-mapa-listo' });
export const GobDashboard = crear('gob-dashboard', { onFiltro: 'gob-dashboard-filtro' });
export const GobKpi = crear('gob-kpi');
export const GobPestanas = crear('gob-pestanas', { onCambio: 'gob-pestana-cambio' });
export const GobAlerta = crear('gob-alerta', { onCerrar: 'gob-alerta-cerrar' });
export const GobModal = crear('gob-modal', { onAbrir: 'gob-modal-abrir', onCerrar: 'gob-modal-cerrar' });
export const GobIcono = crear('gob-icono');
export const GobLineaTiempo = crear('gob-linea-tiempo');
export const GobPasos = crear('gob-pasos', { onCambio: 'gob-paso-cambio' });
export const GobSelector = crear('gob-selector', { onCambio: 'gob-selector-cambio' });
export const GobFecha = crear('gob-fecha', { onCambio: 'gob-fecha-cambio' });
export const GobArchivos = crear('gob-archivos', { onCambio: 'gob-archivos-cambio' });
export const GobAvatar = crear('gob-avatar');
export const GobArbol = crear('gob-arbol', { onSeleccion: 'gob-arbol-seleccion' });
export const GobKanban = crear('gob-kanban', { onMover: 'gob-kanban-mover', onClic: 'gob-kanban-clic' });
export const GobMenu = crear('gob-menu', { onAccion: 'gob-menu-accion' });
export const GobTooltip = crear('gob-tooltip');
export const GobPaginador = crear('gob-paginador', { onCambio: 'gob-pagina-cambio' });
