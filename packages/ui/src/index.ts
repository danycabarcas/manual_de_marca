/**
 * /cdn/v1/gob.js — cargador de la librería gob-*.
 * Una sola etiqueta <script type="module"> basta: detecta qué componentes hay en la página (y los que se agreguen después)
 * y descarga SOLO esos. Para importar uno concreto: import '/cdn/v1/components/gob-tabla.js'.
 */
export const version = '0.3.0';
const REG: Record<string, () => Promise<unknown>> = {
  'gob-mapa-magdalena': () => import('./gob-mapa-magdalena.js'),
  'gob-grafica': () => import('./gob-grafica.js'),
  'gob-tabla': () => import('./gob-tabla.js'),
  'gob-alerta': () => import('./gob-mensajes.js'), 'gob-modal': () => import('./gob-mensajes.js'), 'gob-toasts': () => import('./gob-mensajes.js'),
  'gob-kpi': () => import('./gob-kpi.js'), 'gob-pestanas': () => import('./gob-pestanas.js'), 'gob-icono': () => import('./gob-icono.js'), 'gob-dashboard': () => import('./gob-dashboard.js'),
};
const pend = new Map<string, Promise<unknown>>();
/** Carga un componente por su etiqueta y resuelve cuando ya está definido. */
export function cargar(...tags: string[]): Promise<unknown> {
  return Promise.all(tags.map((t) => { if (!REG[t]) return Promise.reject(new Error('Componente desconocido: ' + t)); if (!pend.has(t)) pend.set(t, REG[t]().then(() => customElements.whenDefined(t))); return pend.get(t)!; }));
}
const escanear = (n: Element | Document) => { for (const t of Object.keys(REG)) if ((n as Element).matches?.(t) || n.querySelector(t)) void cargar(t); };
const arrancar = () => {
  escanear(document);
  new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType === 1) escanear(n as Element); }))).observe(document.documentElement, { childList: true, subtree: true });
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar); else arrancar();

/** API global: gob.cargar('gob-tabla') · gob.toast({...}) · gob.confirmar({...}) → Promise<boolean> */
export const toast = (...a: Parameters<typeof import('./gob-mensajes.js').toast>) => import('./gob-mensajes.js').then((m) => m.toast(...a));
export const confirmar = (...a: Parameters<typeof import('./gob-mensajes.js').confirmar>) => import('./gob-mensajes.js').then((m) => m.confirmar(...a));
(window as any).gob = Object.assign((window as any).gob ?? {}, { cargar, toast, confirmar, version });
