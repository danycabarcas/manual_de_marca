const c = "0.3.0", r = {
  "gob-mapa-magdalena": () => import("./components/gob-mapa-magdalena.js"),
  "gob-grafica": () => import("./components/gob-grafica.js"),
  "gob-tabla": () => import("./components/gob-tabla.js"),
  "gob-alerta": () => import("./components/gob-mensajes.js"),
  "gob-modal": () => import("./components/gob-mensajes.js"),
  "gob-toasts": () => import("./components/gob-mensajes.js"),
  "gob-kpi": () => import("./components/gob-kpi.js"),
  "gob-pestanas": () => import("./components/gob-pestanas.js"),
  "gob-icono": () => import("./components/gob-icono.js"),
  "gob-dashboard": () => import("./components/gob-dashboard.js")
}, t = /* @__PURE__ */ new Map();
function s(...e) {
  return Promise.all(e.map((o) => r[o] ? (t.has(o) || t.set(o, r[o]().then(() => customElements.whenDefined(o))), t.get(o)) : Promise.reject(new Error("Componente desconocido: " + o))));
}
const a = (e) => {
  for (const o of Object.keys(r)) (e.matches?.(o) || e.querySelector(o)) && s(o);
}, i = () => {
  a(document), new MutationObserver((e) => e.forEach((o) => o.addedNodes.forEach((n) => {
    n.nodeType === 1 && a(n);
  }))).observe(document.documentElement, { childList: !0, subtree: !0 });
};
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
const m = (...e) => import("./components/gob-mensajes.js").then((o) => o.toast(...e)), d = (...e) => import("./components/gob-mensajes.js").then((o) => o.confirmar(...e));
window.gob = Object.assign(window.gob ?? {}, { cargar: s, toast: m, confirmar: d, version: c });
export {
  s as cargar,
  d as confirmar,
  m as toast,
  c as version
};
