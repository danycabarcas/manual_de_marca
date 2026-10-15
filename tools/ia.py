"""Guía para agentes de IA: docs/ia/gob-componentes.md, skill (SKILL.md), llms.txt, AGENTS.md de ejemplo, zip y página ia.html."""
import os
import zipfile

BASE = 'https://manualdemarca.magdalena.gov.co'

GUIA = r'''# Guía para agentes: usar el sistema de diseño `gob-*` de la Gobernación del Magdalena

Eres un agente que construye interfaces para la **Gobernación del Magdalena**. Usa SIEMPRE estos componentes y estilos en lugar de escribir los tuyos o instalar otra librería de UI. Esta guía es suficiente para empezar; para detalles abre la página de documentación indicada (cada una trae ejemplos con código completo).

- Sitio y CDN: `__BASE__` (el CDN versionado vive en `__BASE__/cdn/v1/`).
- Documentación legible por máquinas: `__BASE__/llms.txt` (índice) y este archivo (`__BASE__/docs/ia/gob-componentes.md`).
- Idioma de la interfaz y de los nombres de atributos: **español** (`etiqueta`, `valor`, `columnas`, `opciones`…).

## 1. Instalación (siempre estas dos líneas, una vez por página)

```html
<link rel="stylesheet" href="__BASE__/cdn/v1/gob.css">
<script type="module" src="__BASE__/cdn/v1/gob.js"></script>
```

- `gob.css`: tipografía Montserrat (autohospedada), tokens `--gob-*`/`--mg-*`, clases `mg-*` y estilo de los controles HTML nativos.
- `gob.js`: cargador perezoso; detecta las etiquetas `<gob-*>` de la página (y las que se añadan luego) y descarga solo esos componentes. Expone `window.gob = { cargar, toast, confirmar, version }`.
- Poner `class="mg-base"` en `<body>` activa la tipografía, el fondo y el estilo de los formularios nativos. Para solo una zona: `class="mg-forms"`.
- Sin internet / intranet: descargar `__BASE__/dist/downloads/gob-cdn-v1.zip`, publicarlo en el servidor propio y cambiar `__BASE__/cdn/v1` por la ruta local. **No** uses Google Fonts ni otros CDN.
- Frameworks: Angular → `schemas: [CUSTOM_ELEMENTS_SCHEMA]` (ver `__BASE__/cdn/v1/wrappers/gob-angular.ts`); React/Next → `__BASE__/cdn/v1/wrappers/react.jsx` (componentes con `onEvento`; en Next marcar `'use client'`); Vue → `isCustomElement: (t) => t.startsWith('gob-')` y `:config.prop="…"`. Guía: `__BASE__/componentes/frameworks.html`.

## 2. Reglas de oro

1. **Objetos y arreglos van por propiedad JS, no por atributo.** Strings, números y booleanos pueden ir como atributo (`valor="7" multiple`). Para JSON largo: `el.config = {…}` o `el.datos = […]`.
2. `config` (disponible en tabla, gráfica, mapa, dashboard) asigna varias propiedades de golpe: `tabla.config = { datos, columnas, llave: 'id' }`.
3. **Eventos** son `CustomEvent` con prefijo `gob-` y los datos en `event.detail`: `el.addEventListener('gob-tabla-accion', (e) => e.detail.accion)`.
3b. Puedes asignar propiedades (`datos`, `config`, `valor`…) **antes** de que el componente termine de cargarse: se aplican al registrarse. Para esperar al componente: `await gob.cargar('gob-tabla')`.
4. Los booleanos por atributo son «presente = verdadero»: no escribas `limpiable="false"`; asigna la propiedad (`el.limpiable = false`).
5. Mensajes al usuario: `gob.toast({ tipo, titulo, mensaje })` (tipos `exito | info | aviso | peligro`) y `await gob.confirmar({ titulo, mensaje, tipo, textoConfirmar })` → `boolean`. Para avisos fijos usa `<gob-alerta>`; para diálogos `<gob-modal>`.
6. Datos de ejemplo del CDN (ficticios): `/cdn/v1/datos/ejemplo-radicados.json` (900 filas), `ejemplo-tramites.json` (140 filas), `municipios.json`, `subregiones.json`. En producción sustitúyelos por la API real.
7. Accesibilidad AA es obligatoria: etiquetas en todos los campos, `aria-live` en mensajes, foco visible. Los componentes ya la traen; no la desactives.
8. Colores de marca: azul `#0071BB`, cian `#00B7D9`, celeste `#9FD7E5`, rojo `#F7003C`, amarillo `#FEC800`, verde `#69B75E`, azul-noche `#0B2239`. Usa variables (`var(--mg-primary)`), no valores sueltos. Interfaces sobrias: superficies blancas/azul-noche; el color solo como acento.
9. **Convivencia**: si el proyecto ya usa PrimeNG/Material/Bootstrap, usa SU componente donde exista (p-select, mat-select…) y `gob-*` solo para lo que no tienen (mapa, kanban, dashboard, línea de tiempo, Gantt…); no dupliques el mismo tipo de componente. Con Tailwind v4 carga `cdn/v1/gob.layer.css` ANTES de Tailwind. Un control con clase siempre gana sobre gob. Detalle: `__BASE__/componentes/compatibilidad.html`.
10. **No uses** AdminLTE, Bootstrap ni PrimeNG 22 / PrimeVue 5 / `@primeuix/themes` ≥ 3 (licencia comercial «PrimeUI»). Si el proyecto ya usa PrimeNG, fijar ≤ 21 y ver `__BASE__/componentes/estandar.html`.

## 3. Catálogo de componentes

| Etiqueta | Para qué | Atributos/propiedades clave | Eventos clave | Docs |
|---|---|---|---|---|
| `gob-tabla` | Tabla avanzada | `config{datos, columnas, llave, ordenInicial, acciones, accionesMasivas}`, `seleccion="multiple"`, `filtros-columna`, `totales`, `tamano-pagina`, `modo-servidor`, `zebra`, `densidad` | `gob-tabla-accion`, `-seleccion`, `-fila-clic`, `-consulta` | `/componentes/gob-tabla.html` |
| `gob-grafica` | 14 tipos de gráfica (ECharts) | `tipo` (barras, barras-horizontal, lineas, area, torta, dona, radar, gauge, mapa-calor, treemap, sankey, embudo, calendario, gantt), `datos`, `colores`, `titulo`, `altura`, `formato`, `leyenda`, `etiquetas`, `apilado` | `gob-grafica-click` | `/componentes/gob-grafica.html` |
| `gob-mapa-magdalena` | Mapa de los 30 municipios (DIVIPOLA) | `modo` (plano, subregiones, coropleta, categorias), `datos {codigo: valor}`, `detalle` (alto/medio/bajo), `marcadores`, `lineas`, `efectos`, `clic`, `rampa`, `leyenda-titulo`, métodos `zoomA(codigo)` | `gob-municipio-click`, `gob-marcador-click` | `/componentes/gob-mapa-magdalena.html` |
| `gob-dashboard` | Tablero declarativo con filtros cruzados | `config{titulo, registros, filtros, widgets}` | `gob-dashboard-filtro` | `/componentes/gob-dashboard.html` |
| `gob-kpi` | Indicador con variación/meta | `etiqueta`, `valor`, `formato` (numero, compacto, cop, porcentaje), `delta`, `meta`, `icono`, `color`, `serie` | — | idem |
| `gob-pestanas` | Pestañas | `items [{id,titulo,icono,contador}]`, `activa`; cada panel = elemento con `slot="id"` | `gob-pestana-cambio` | idem |
| `gob-alerta` · `gob-modal` · `gob.toast()` · `gob.confirmar()` | Mensajes | alerta: `tipo`, `titulo`, `cerrable`; modal: `titulo`, `tam` (sm/md/lg/xl), métodos `abrir()` `cerrar()`, slot `pie` | `gob-modal-cerrar`, `gob-alerta-cerrar` | `/componentes/gob-mensajes.html` |
| `gob-selector` | Select con búsqueda y multiselección; participa en `<form>` | `opciones` (strings u objetos `{valor,etiqueta,grupo,descripcion,icono}`), `valor`, `multiple`, `buscable`, `limpiable`, `name`, `requerido` | `gob-selector-cambio` | `/componentes/gob-campos.html` |
| `gob-fecha` | Calendario (fecha o `rango`) | `valor` (`2026-10-14` o `inicio/fin`), `min`, `max`, `rango` | `gob-fecha-cambio` | idem |
| `gob-archivos` | Subir archivos (arrastrar y soltar) | `multiple`, `accept`, `max-mb`, `max-archivos`, método `progreso(nombre, %)`, getter `archivos` | `gob-archivos-cambio` | idem |
| `gob-pasos` | Asistente por pasos | `pasos [{titulo}]`, `actual`, `error`, slots `paso0`, `paso1`…, métodos `siguiente()` `anterior()` | `gob-paso-cambio` | `/componentes/gob-flujo.html` |
| `gob-linea-tiempo` | Historial de un trámite/ticket | `eventos [{fecha,titulo,descripcion,autor,tipo,icono}]`, `orientacion`, `invertir` | — | idem |
| `gob-kanban` | Tablero arrastrable | `columnas [{id,titulo,color,limite}]`, `tarjetas [{id,columna,titulo,prioridad,etiquetas,asignado}]` | `gob-kanban-mover` | `/componentes/gob-contenido.html` |
| `gob-arbol` | Jerarquías | `nodos [{id,etiqueta,hijos}]`, `abierto` | `gob-arbol-seleccion` | idem |
| `gob-menu` | Menú desplegable/contextual | `items [{id,etiqueta,icono,tipo,separador}]`, `contextual`; el contenido (slot) es el disparador | `gob-menu-accion` | idem |
| `gob-tooltip` · `gob-avatar` · `gob-paginador` | Utilidades | tooltip `texto`; avatar `nombre`, `estado`, `tam`; paginador `total`, `pagina`, `tamano` | `gob-pagina-cambio` | idem |
| `gob-icono` | 104 íconos (nombres en español) | `nombre`, `tam`, `etiqueta` | — | `/componentes/iconos.html` |

### Widgets de `gob-dashboard` (`config.widgets`)
Cada widget: `tipo` (`kpi | grafica | mapa | tabla | texto | alerta`), `titulo`, `col` (1–12, ancho en rejilla), `alto`, `donde` (filtro propio, p. ej. `{estado:'Vencido'}`).
- `kpi`: `medida` (`conteo | suma | promedio | distintos`), `campo`, `unidad`, `icono`, `color`, `serie: 'fecha:mes'` (sparkline y variación), `buenoSube`.
- `grafica`: `grafica` (tipo de gob-grafica), `agrupar` (campo o `fecha:mes|anio|trimestre|dia`), `serie` (segundo campo), `orden: 'valor-desc'`, `limite`, `etiquetas`, `colores`, `apilado`.
- `mapa`: `medida`, `campo`, `rampa`, `leyendaTitulo` (el campo `codigo` de los registros es el código DIVIPOLA del municipio).
- Los `registros` son un arreglo de objetos (una fila por hecho). Los filtros globales (`filtros: [{campo, etiqueta}]`) y el clic en barras/sectores/municipios filtran todo el tablero.

## 3b. Esquemas de datos (formas exactas)

- **Datos de ejemplo**: `ejemplo-tramites.json` es un **arreglo** de objetos `{ id, radicado, asunto, solicitante, municipio, codigo, dependencia, estado, prioridad, fecha, dias, valor, avance, tieneAnexos }` con `estado` ∈ `Pendiente | En trámite | Resuelto | Vencido`. `ejemplo-radicados.json` (arreglo) usa `{ id, fecha, codigo, municipio, subregion, dependencia, tipo, estado, prioridad, dias }`. `municipios.json`: `[{ codigo, nombre, subregion, latitud, longitud }]`.
- **gob-tabla** `columnas`: `[{ campo, titulo, tipo, ... }]` (la clave es `campo`, NO `key`/`field`). `tipo`: `texto` (defecto) | `numero` | `cop` | `porcentaje` | `fecha` | `estado` (con `estados: { 'Resuelto': 'exito', 'En trámite': 'info', 'Pendiente': 'aviso', 'Vencido': 'peligro' }`) | `booleano` | `enlace` | `barra` (con `maximo`). Extras: `nowrap`, `total: 'suma'|'promedio'`, `semaforo: { verde, amarillo, invertir }`, `render: (valor, fila) => html`.
- **gob-tabla** `acciones` (botones por fila) y `accionesMasivas` (con filas seleccionadas): `[{ id: 'ver', etiqueta: 'Ver', icono: 'ojo', tipo: 'peligro'|'primario' }]`. El evento `gob-tabla-accion` trae `e.detail = { accion: 'ver', fila }` (acción de fila) o `{ accion, filas, llaves }` (masiva).
- **gob-grafica** `datos`: torta/dona/embudo/treemap → `[{ nombre, valor }]`; barras/líneas/área/radar → `{ categorias: [...], series: [{ nombre, valores: [...] }] }` (o `[{ nombre, valor }]` para una serie); gauge → `{ valor, nombre }`; calendario → `[{ fecha: 'aaaa-mm-dd', valor }]`; gantt → `[{ nombre, inicio, fin, avance?, grupo? }]`; mapa-calor → `{ x, y, valores: [[xi, yi, v]] }`; sankey → `{ nodos, enlaces: [{ origen, destino, valor }] }`. Sin `datos` la gráfica queda vacía: asígnalos (`g.datos = …`).
- **gob-selector** `valor`: texto si es simple, **arreglo de strings** si es `multiple` (y el evento `gob-selector-cambio` entrega `e.detail.valor` del mismo tipo). `etiqueta` es el nombre accesible (obligatorio por accesibilidad).
- **gob-kpi**: `valor` puede asignarse como propiedad en cualquier momento (`kpi.valor = 42`) y se anima.
- **gob-modal**: contenido por defecto en el cuerpo; botones en `slot="pie"`; se abre con `modal.abrir()` y su título se cambia con `modal.titulo = '…'`.
- **Rutas**: en páginas fuera de la raíz del sitio las rutas relativas deben ajustarse (`../cdn/v1/gob.css`, `../cdn/v1/datos/…`); con la URL pública no hay problema.

## 3c. Ejemplo mínimo completo (tabla + filtro + acción + modal + KPI + dona)

```html
<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Seguimiento</title>
<link rel="stylesheet" href="__BASE__/cdn/v1/gob.css"><script type="module" src="__BASE__/cdn/v1/gob.js"></script></head>
<body class="mg-base" style="padding:1.5rem;display:grid;gap:1rem;max-width:1100px;margin:auto">
  <gob-selector id="mun" multiple etiqueta="Municipios" placeholder="Filtrar por municipio"></gob-selector>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(12rem,1fr));gap:.75rem"><gob-kpi id="k1" etiqueta="Trámites" icono="archivo"></gob-kpi><gob-kpi id="k2" etiqueta="Vencidos" icono="alerta" color="rojo"></gob-kpi></div>
  <div class="mg-card" style="padding:1rem"><gob-grafica id="dona" tipo="dona" titulo="Por estado" altura="260"></gob-grafica></div>
  <gob-tabla id="tabla" titulo="Trámites" filtros-columna tamano-pagina="8"></gob-tabla>
  <gob-modal id="modal" titulo="Detalle"><div id="cuerpo"></div><button slot="pie" onclick="modal.cerrar()">Cerrar</button></gob-modal>
<script type="module">
  const todos = await fetch('__BASE__/cdn/v1/datos/ejemplo-tramites.json').then((r) => r.json());
  mun.opciones = [...new Set(todos.map((t) => t.municipio))].sort();
  tabla.config = { llave: 'id', columnas: [
    { campo: 'radicado', titulo: 'Radicado', nowrap: true }, { campo: 'asunto', titulo: 'Asunto' }, { campo: 'municipio', titulo: 'Municipio' },
    { campo: 'estado', titulo: 'Estado', tipo: 'estado', estados: { Resuelto: 'exito', 'En trámite': 'info', Pendiente: 'aviso', Vencido: 'peligro' } } ],
    acciones: [{ id: 'ver', etiqueta: 'Ver', icono: 'ojo' }] };
  function pintar() {
    const sel = mun.valor.length ? todos.filter((t) => mun.valor.includes(t.municipio)) : todos;
    tabla.datos = sel; k1.valor = sel.length; k2.valor = sel.filter((t) => t.estado === 'Vencido').length;
    const por = Object.groupBy ? Object.entries(Object.groupBy(sel, (t) => t.estado)) : [];
    dona.datos = por.map(([nombre, v]) => ({ nombre, valor: v.length }));
  }
  mun.addEventListener('gob-selector-cambio', pintar); pintar();
  tabla.addEventListener('gob-tabla-accion', (e) => {
    if (e.detail.accion !== 'ver') return; const f = e.detail.fila;
    modal.titulo = 'Trámite ' + f.radicado; cuerpo.textContent = f.asunto + ' — ' + f.solicitante + ' (' + f.municipio + ')'; modal.abrir();
  });
</script></body></html>
```

## 4. Formularios con elementos HTML normales
Dentro de `.mg-base`/`.mg-forms` los controles **sin clase** (`input`, `select`, `textarea`, `button`, casillas, radios, `role="switch"`, rango, archivo, `progress`, `fieldset`, `label`, tablas sin clase, `details`, `dialog`) ya se ven de marca, con foco, hover, deshabilitado y validación (`:user-invalid`, `aria-invalid`). Para botones con variantes usa `mg-btn` (`mg-btn--secondary|outline|ghost|danger|sm|lg`). Campos con clase: `mg-input`, `mg-select`, `mg-textarea`, `mg-label`, `mg-field`, `mg-error`, `mg-help`. Una clase propia o de otro framework siempre gana (especificidad cero); excluir uno: `class="mg-nativo-off"`.

## 5. Clases de maquetación `mg-*` (sin JavaScript)
`mg-card`, `mg-card--hover`, `mg-btn`, `mg-badge`, `mg-alert`, `mg-hero`, `mg-footer`, `mg-sidebar`, `mg-navbar`, `mg-tabs`, `mg-table`, `mg-acordeon` (sobre `<details>`), `mg-stepper`, `mg-timeline`, `mg-breadcrumb`, `mg-avatar`, `mg-stripe` (la línea multicolor, solo como firma), `mg-bg-night`, `mg-skip` (saltar al contenido), `mg-sr-only`. Ejemplos: `__BASE__/componentes.html`.

## 6. Cómo trabajar (flujo recomendado)
1. **Elige un demo base** y cópialo en vez de empezar de cero: `__BASE__/demos/` — `panel-ejecutivo` (dashboard), `gestion-tramites` (CRUD: tabla + modal + confirmaciones), `analitica-territorial` (mapa + dashboard), `portal-ciudadano` (página pública), `mesa-ayuda` (kanban + pasos + línea de tiempo), `acceso-formularios` (login y asistente), `plantilla-base` (mínimo comentado). Cada demo permite **Copiar sección** y está pensado para copiar y pegar.
2. Para un componente concreto, abre su página en `/componentes/…` y copia el ejemplo más parecido (todos incluyen el código completo con dependencias).
3. Para generar configuración visualmente existen los Estudios: `/estudio/mapas.html`, `graficas.html`, `tablas.html`, `dashboards.html` (el enlace `#c=…` guarda la configuración).
4. Valida: abre la página, revisa la consola (sin errores) y que los datos carguen; prueba el teclado (Tab/Enter/Esc) y el contraste.
5. En producción: cambia `fetch('/cdn/v1/datos/ejemplo-…')` por la API; no dejes datos ficticios.

## 7. Errores frecuentes
- Pasar JSON como atributo con comillas mal escapadas → usa la propiedad (`el.opciones = [...]`).
- Olvidar `gob.js` o servir `gob.css` desde otra ruta que `fonts/` → la tipografía no carga (las fuentes están en `cdn/v1/fonts/`).
- Usar `<gob-tabla>` con `datos` antes de definir `columnas` y `llave` → asigna ambos (mejor con `config`).
- Crear gráficas en contenedores sin altura: usa el atributo `altura` (px).
- En Next.js renderizar `gob-*` en el servidor: usa `'use client'` o `next/dynamic({ ssr:false })`.
- Mapas: los códigos de municipio son DIVIPOLA de 5 dígitos como texto (`'47001'` = Santa Marta). Subregiones: `sm, no, ri, ce, su` (sin validar oficialmente).

## 8. Licencias (resumen)
Montserrat OFL · ECharts Apache-2.0 · Lit BSD-3 · Lucide ISC · geometría DANE MGN 2024. Detalle: `LICENSES.md` del repositorio.
'''

SKILL_FM = '''---
name: gob-componentes
description: Construir interfaces con el sistema de diseño de la Gobernación del Magdalena (componentes web gob-*, estilos mg-*, mapas DIVIPOLA, gráficas, tablas, dashboards, formularios). Úsalo cuando el usuario pida pantallas, paneles, formularios, mapas, gráficas o portales para la Gobernación del Magdalena, o mencione gob-*, manualdemarca.magdalena.gov.co o "manual de marca".
---

'''


def build(root, page):
    guia = GUIA.replace('__BASE__', BASE)
    d = os.path.join(root, 'docs', 'ia')
    sk = os.path.join(d, 'skill', 'gob-componentes')
    os.makedirs(sk, exist_ok=True)
    with open(os.path.join(d, 'gob-componentes.md'), 'w', encoding='utf-8', newline='\n') as f:
        f.write(guia)
    with open(os.path.join(sk, 'SKILL.md'), 'w', encoding='utf-8', newline='\n') as f:
        f.write(SKILL_FM + guia)
    agents = f'''# AGENTS.md (pegar en la raíz de su proyecto; también sirve como CLAUDE.md, .cursorrules o instrucciones de Copilot)

Este proyecto usa el sistema de diseño **gob-*** de la Gobernación del Magdalena.
Antes de crear cualquier pantalla, lee y sigue: {BASE}/docs/ia/gob-componentes.md
- Carga siempre `{BASE}/cdn/v1/gob.css` y `{BASE}/cdn/v1/gob.js` (o la copia autohospedada).
- Usa los componentes `<gob-*>` y clases `mg-*`; no instales AdminLTE, Bootstrap ni PrimeNG 22.
- Objetos/arreglos por propiedad JS; eventos `gob-*` con datos en `event.detail`.
- Parte de un demo de {BASE}/demos/ y adáptalo.
'''
    with open(os.path.join(d, 'AGENTS.md'), 'w', encoding='utf-8', newline='\n') as f:
        f.write(agents)
    llms = f'''# Gobernación del Magdalena — sistema de diseño gob-*

> Componentes web (Lit, estándar: funcionan en HTML, Angular, React, Next.js y Vue), estilos mg-*, mapas del Magdalena por municipio (DIVIPOLA), gráficas, tablas, dashboards y formularios. CDN versionado en {BASE}/cdn/v1/.

## Empezar aquí
- [Guía completa para agentes de IA (Markdown)]({BASE}/docs/ia/gob-componentes.md): instalación, reglas, catálogo y flujo de trabajo
- [Skill instalable (SKILL.md)]({BASE}/docs/ia/skill/gob-componentes/SKILL.md)
- [AGENTS.md de ejemplo]({BASE}/docs/ia/AGENTS.md)

## Documentación de componentes
- [gob-tabla]({BASE}/componentes/gob-tabla.html): tablas avanzadas
- [Alertas, modales, toasts]({BASE}/componentes/gob-mensajes.html)
- [Dashboard, KPI, pestañas]({BASE}/componentes/gob-dashboard.html)
- [gob-grafica]({BASE}/componentes/gob-grafica.html): 14 tipos de gráfica
- [gob-mapa-magdalena]({BASE}/componentes/gob-mapa-magdalena.html)
- [Línea de tiempo y pasos]({BASE}/componentes/gob-flujo.html)
- [Selector, fecha, archivos]({BASE}/componentes/gob-campos.html)
- [Avatar, árbol, kanban, menú, tooltip, paginador]({BASE}/componentes/gob-contenido.html)
- [Formularios nativos]({BASE}/componentes/formularios.html)
- [Íconos]({BASE}/componentes/iconos.html)
- [Angular, React, Next.js, Vue]({BASE}/componentes/frameworks.html)
- [Estándar y licencias]({BASE}/componentes/estandar.html)

## Demos (plantillas para copiar)
- [Índice de demos]({BASE}/demos/index.html): panel ejecutivo, gestión de trámites, analítica territorial, portal ciudadano, mesa de ayuda, acceso y formularios, plantilla base

## Marca y tokens
- [Colores y degradados]({BASE}/colores.html) · [Logos]({BASE}/logos.html) · [Integración por tecnología]({BASE}/integracion.html)

## Optional
- [Estudios generadores de código]({BASE}/estudio/index.html)
'''
    with open(os.path.join(root, 'llms.txt'), 'w', encoding='utf-8', newline='\n') as f:
        f.write(llms)
    # zip de la skill
    dl = os.path.join(root, 'dist', 'downloads')
    os.makedirs(dl, exist_ok=True)
    with zipfile.ZipFile(os.path.join(dl, 'gob-skill-ia.zip'), 'w', zipfile.ZIP_DEFLATED) as z:
        z.write(os.path.join(sk, 'SKILL.md'), 'gob-componentes/SKILL.md')
        z.write(os.path.join(d, 'AGENTS.md'), 'AGENTS.md')
        z.write(os.path.join(d, 'gob-componentes.md'), 'gob-componentes.md')

    prompt = f'Lee {BASE}/docs/ia/gob-componentes.md y úsalo como guía obligatoria para construir la interfaz: usa los componentes gob-* y las clases mg-*, y parte del demo más parecido de {BASE}/demos/. Lo que necesito: …'
    E = lambda t: t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    body = f'''<p class="pt-lead">Para que cualquier agente de IA (Claude, ChatGPT, Copilot, Cursor, Gemini…) use estos componentes <b>sin que tenga que explicárselos</b>: un archivo Markdown con todo lo necesario (instalación, reglas, catálogo, flujo de trabajo) que el agente lee y aplica como si fuera una <i>skill</i>.</p>
<section class="pt-section"><h2><span class="n">01.</span> Opción rápida: pegue esta instrucción</h2><p>Sirve en cualquier chat o agente con acceso a internet:</p>
<div class="code"><div class="code__bar"><span>Instrucción</span><button data-codecopy>Copiar</button></div><pre tabindex="0"><code>{E(prompt)}</code></pre></div></section>
<section class="pt-section"><h2><span class="n">02.</span> Para que lo use siempre en su proyecto</h2>
<ul style="line-height:1.9;color:var(--mg-gray-700)"><li><b>Cualquier agente</b>: copie <a href="docs/ia/AGENTS.md">AGENTS.md</a> a la raíz del proyecto (también sirve como <code>CLAUDE.md</code>, <code>.cursorrules</code> o <code>.github/copilot-instructions.md</code>).</li>
<li><b>Claude Code / Claude</b>: instale la skill — copie la carpeta <code>gob-componentes/</code> (contiene <code>SKILL.md</code>) a <code>~/.claude/skills/</code> (global) o a <code>.claude/skills/</code> del proyecto. Se activa sola cuando pidan pantallas para la Gobernación.</li>
<li><b>Rastreadores y agentes web</b>: <a href="llms.txt">llms.txt</a> indexa toda la documentación en el formato estándar.</li></ul>
<div class="mg-row"><a class="mg-btn" href="dist/downloads/gob-skill-ia.zip" download>⬇ Skill + AGENTS.md (.zip)</a><a class="mg-btn mg-btn--secondary" href="docs/ia/gob-componentes.md">Ver la guía (.md)</a><a class="mg-btn mg-btn--secondary" href="llms.txt">llms.txt</a></div></section>
<section class="pt-section"><h2><span class="n">03.</span> Qué contiene la guía</h2><ul style="line-height:1.9;color:var(--mg-gray-700)"><li>Las dos líneas de instalación y cómo autohospedar sin internet.</li><li>Reglas de oro (propiedades vs. atributos, eventos, mensajes, colores, licencias).</li><li>Catálogo de los componentes con sus atributos y eventos clave, y las especificaciones de los widgets del dashboard.</li><li>Formularios nativos y clases <code>mg-*</code>.</li><li>Flujo recomendado: partir de un demo, copiar el ejemplo más cercano, validar.</li><li>Errores frecuentes.</li></ul>
<p class="mg-help">La guía se regenera con cada versión del sitio, así que siempre refleja los componentes publicados.</p></section>'''
    page(root, 'ia.html', 'Para agentes de IA', 'Instrucciones y skill para que cualquier agente de IA use los componentes gob-* sin explicaciones.', body, active='ia.html')
