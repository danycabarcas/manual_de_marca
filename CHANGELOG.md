# Novedades del sistema de diseño gob-*

Última versión: **0.5.0** (2026-11-17) · https://manualdemarca.magdalena.gov.co/novedades.html

## 0.5.0 — 2026-11-17

- **Nuevo**: Módulo de acceso: login con el modelo GEDIS (panel de marca + tarjeta con «la línea»), recuperar contraseña, nueva contraseña con fortaleza, verificación en dos pasos (OTP), registro y estados de acceso. Clases mg-auth*, mg-social, mg-fl, mg-otp, mg-fuerza. _Acción: Reemplace sus logins por el esqueleto de Demos → Acceso._
- **Nuevo**: Panel de gestión (diseño «Convocatorias»): barra superior con la línea, menú lateral claro y sticky, píldora de sección, tarjetas, listados, tablas con estados, pestañas y formularios. Clases mg-shell*, mg-panel*, mg-nav, mg-conv, mg-tbl, mg-chip, mg-dot… _Acción: Use los demos Panel como estructura de las aplicaciones internas._
- **Nuevo**: Catálogo de UI: acordeones (base, tarjetas, flush), pestañas (línea, píldora, segmentada, vertical) y formularios con etiqueta flotante.
- **Nuevo**: Demos de acceso y panel: 6 casos de acceso + 6 pantallas del panel, con la guía de cómo conectar el login al backend (401/423/429…).
- **Cambio**: El diálogo «Sin permisos» usa el azul de marca en su botón (antes naranja). Tipografía Montserrat en toda la interfaz. _Acción: Si tenía un botón naranja de aceptar, use mg-btn (azul)._
- **Cambio**: Compatibilidad: los estilos de base (.mg-base) pasaron a especificidad cero; los controles sin clase vencen al «preflight» de Tailwind; nuevo gob.layer.css para Tailwind v4 / PrimeNG con capas. _Acción: Con Tailwind v4 cargue gob.layer.css primero. Ver compatibilidad._
- **Cambio**: Etiquetas del menú lateral oscuro (mg-sidebar__label) con mayor contraste (accesibilidad AA).
- **Docs**: Nueva guía para agentes de IA, página de compatibilidad, y esta página de novedades con version.json.

## 0.4.0 — 2026-10-15

- **Nuevo**: Componentes gob-linea-tiempo, gob-pasos, gob-selector, gob-fecha, gob-archivos, gob-avatar, gob-arbol, gob-kanban, gob-menu, gob-tooltip, gob-paginador. _Acción: Nada: se cargan solos al usar la etiqueta._
- **Nuevo**: gob-grafica: embudo, calendario de actividad y cronograma Gantt (14 tipos).
- **Nuevo**: Formularios nativos con la marca (.mg-base/.mg-forms), envoltorios para Angular/React/Next (cdn/v1/wrappers/), demo Mesa de ayuda. _Acción: Copie de nuevo los envoltorios si ya los usaba._

## 0.3.0 — 2026-10-01

- **Nuevo**: gob-tabla, gob-dashboard, gob-kpi, gob-pestanas, gob-modal/gob-alerta/gob.toast(), íconos gob-icono, Estudios de tablas y dashboards, tipografía Montserrat autohospedada.
