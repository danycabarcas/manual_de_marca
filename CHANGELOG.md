# Novedades del sistema de diseño gob-*

Última versión: **0.7.0** (2026-11-17) · https://manualdemarca.magdalena.gov.co/novedades.html

## 0.7.0 — 2026-11-17

- **Nuevo**: Franja institucional y pie de página para sitios públicos (borrador de política): franja superior morada con el logo en blanco, panel de accesibilidad (tamaño de texto, alto contraste, subrayar enlaces, espaciado, pausar animaciones, «Ir al contenido») y pie estándar corto. Un solo script sin dependencias (cdn/v1/franja/gob-franja.js, ≈7 KB comprimido) con configuración común. Ver Sitios públicos y el sitio de ejemplo. _Acción: Opcional: agregue el script a sus sitios públicos. En WordPress, plugin DC-Franja (borrador)._

## 0.6.1 — 2026-11-17

- **Arreglo**: Íconos SVG sin tamaño en las pantallas de acceso (p. ej. la flecha de «Volver a iniciar sesión» se veía gigante): ahora todo ícono dentro de .mg-auth tiene un tamaño por defecto (1.15 rem). _Acción: Nada: llega con gob.css. Si copió el login, agregue svg { width: 1.15rem; height: 1.15rem } dentro de su contenedor o actualice gob.css._

## 0.6.0 — 2026-11-17

- **Nuevo**: Sistemas de solicitudes y administración (8 pantallas): registrar solicitud con asignación por tarjetas, consultar con filtros y estados, dashboard de recepción y de control con KPI y semáforo, entrega de respuestas, bitácora con línea de eventos, usuarios y matriz de roles y permisos. _Acción: Use los demos Solicitudes y administración._
- **Nuevo**: Clases nuevas del panel: mg-kcard (KPI con ícono), mg-sem, mg-opt/mg-optlist (opciones tipo tarjeta), mg-matriz, mg-caso/mg-evento, mg-usr/mg-rol, mg-codigo, mg-st, mg-efec, mg-cnt, mg-perfil y títulos de grupo en el menú (mg-nav__grp). _Acción: Nada: llegan con gob.css._
- **Cambio**: El menú lateral admite grupos con color y una tarjeta de perfil; la barra superior acepta el nombre de cada aplicación.

## 0.5.1 — 2026-11-17

- **Arreglo**: CDN desde otros sitios (CORS): cargar gob.js, las fuentes o los datos desde otro origen (p. ej. localhost:4200 o una app en otro dominio) fallaba porque el servidor oficial no envía Access-Control-Allow-Origin. El código que genera el manual ahora usa la URL pública con CORS de jsDelivr: https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@v0.5.1/cdn/v1/. _Acción: Cambie en sus proyectos la base https://manualdemarca.magdalena.gov.co/cdn/v1/ por la de jsDelivr (o use la copia local). Ver CORS._

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
