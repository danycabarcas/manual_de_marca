const s = "0.4.0", r = {
  "gob-mapa-magdalena": () => import("./components/gob-mapa-magdalena.js"),
  "gob-grafica": () => import("./components/gob-grafica.js"),
  "gob-tabla": () => import("./components/gob-tabla.js"),
  "gob-alerta": () => import("./components/gob-mensajes.js"),
  "gob-modal": () => import("./components/gob-mensajes.js"),
  "gob-toasts": () => import("./components/gob-mensajes.js"),
  "gob-kpi": () => import("./components/gob-kpi.js"),
  "gob-pestanas": () => import("./components/gob-pestanas.js"),
  "gob-icono": () => import("./components/gob-icono.js"),
  "gob-dashboard": () => import("./components/gob-dashboard.js"),
  "gob-linea-tiempo": () => import("./components/gob-flujo.js"),
  "gob-pasos": () => import("./components/gob-flujo.js"),
  "gob-selector": () => import("./components/gob-campos.js"),
  "gob-fecha": () => import("./components/gob-campos.js"),
  "gob-archivos": () => import("./components/gob-campos.js"),
  "gob-avatar": () => import("./components/gob-contenido.js"),
  "gob-arbol": () => import("./components/gob-contenido.js"),
  "gob-kanban": () => import("./components/gob-contenido.js"),
  "gob-menu": () => import("./components/gob-contenido.js"),
  "gob-tooltip": () => import("./components/gob-contenido.js"),
  "gob-paginador": () => import("./components/gob-contenido.js")
}, e = /* @__PURE__ */ new Map();
function m(...t) {
  return Promise.all(t.map((o) => r[o] ? (e.has(o) || e.set(o, r[o]().then(() => customElements.whenDefined(o))), e.get(o)) : Promise.reject(new Error("Componente desconocido: " + o))));
}
const i = (t) => {
  for (const o of Object.keys(r)) (t.matches?.(o) || t.querySelector(o)) && m(o);
}, n = () => {
  i(document), new MutationObserver((t) => t.forEach((o) => o.addedNodes.forEach((a) => {
    a.nodeType === 1 && i(a);
  }))).observe(document.documentElement, { childList: !0, subtree: !0 });
};
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
const p = (...t) => import("./components/gob-mensajes.js").then((o) => o.toast(...t)), c = (...t) => import("./components/gob-mensajes.js").then((o) => o.confirmar(...t));
window.gob = Object.assign(window.gob ?? {}, { cargar: m, toast: p, confirmar: c, version: s });
export {
  m as cargar,
  c as confirmar,
  p as toast,
  s as version
};
