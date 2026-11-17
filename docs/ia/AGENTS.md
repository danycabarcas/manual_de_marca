# AGENTS.md (pegar en la raíz de su proyecto; también sirve como CLAUDE.md, .cursorrules o instrucciones de Copilot)

Este proyecto usa el sistema de diseño **gob-*** de la Gobernación del Magdalena.
Antes de crear cualquier pantalla, lee y sigue: https://manualdemarca.magdalena.gov.co/docs/ia/gob-componentes.md
- Carga siempre `https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@v0.7.1/cdn/v1/gob.css` y `https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@v0.7.1/cdn/v1/gob.js` (o la copia autohospedada). No uses `https://manualdemarca.magdalena.gov.co/cdn/v1/` desde otros orígenes: falla por CORS.
- Usa los componentes `<gob-*>` y clases `mg-*`; no instales AdminLTE, Bootstrap ni PrimeNG 22.
- Objetos/arreglos por propiedad JS; eventos `gob-*` con datos en `event.detail`.
- Parte de un demo de https://manualdemarca.magdalena.gov.co/demos/ y adáptalo (logins y casos de acceso: https://manualdemarca.magdalena.gov.co/demos/index.html#acceso; panel de gestión: #panel).
- Para actualizar el sistema de diseño en este proyecto: lee https://manualdemarca.magdalena.gov.co/novedades.html y aplica las acciones de la última versión.
