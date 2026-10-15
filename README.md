# Manual de marca web · Gobernación del Magdalena · Identidad Visual 2026

Kit para que el equipo de desarrollo aplique la identidad visual del *Manual de Identidad Visual* (PDF incluido) en cualquier proyecto web: **colores, degradados, la línea multicolor, logos, componentes y temas para frameworks**.

- **Portal web:** abra `index.html` (en Laragon: `http://localhost/manual_de_marca/`).
- **Una sola URL de CSS** para usar la marca: `…/dist/css/magdalena.min.css`

```html
<link rel="stylesheet" href="https://TU-HOST/manual_de_marca/dist/css/magdalena.min.css">
<body class="mg-base">
  <section class="mg-hero"><h1>Hola Magdalena</h1><button class="mg-btn">Ingresar</button></section>
  <hr class="mg-stripe">
</body>
```

## Sistema de diseño y librería de componentes (en construcción)

Además del CSS `mg-*`, el repo es ahora un monorepo (npm workspaces) con la librería de **Web Components `gob-*`** (Lit + TypeScript, agnóstica de framework):

```
packages/datos/   Catálogos y geografía (DIVIPOLA DANE) → dist/  (ver packages/datos/LICENCIAS.md)
packages/ui/      Componentes gob-*  → compilados con Vite a  cdn/v1/
cdn/v1/           CDN estático versionado:  gob.js · components/*.js · datos/* · tokens.css · gob.css
estudio/          Generadores visuales (Estudio de mapas) que producen código HTML/Angular/React
componentes/      Documentación de cada componente (propiedades, eventos, instalación, accesibilidad)
```

```bash
npm install
npm run build        # datos geográficos + componentes → cdn/v1/
python tools/build.py  # portal, docs y dist/ (usar Python 3.10 con Pillow y PyMuPDF)
```

| Fase | Estado |
|---|---|
| 0 · Tokens `--gob-*`, modo oscuro (beta), monorepo, CDN `/cdn/v1/` | ✅ base lista · pendiente Style Dictionary y pruebas Playwright |
| 4 · Mapas | ✅ `<gob-mapa-magdalena>` (30 municipios, DIVIPOLA, subregiones, coropleta, categorías, marcadores, rutas animadas, efectos) + **Estudio de mapas** · ⏳ Santa Marta (comunas/barrios), veredas y PMTiles (faltan datos oficiales) |
| 3 · Gráficas | ✅ `<gob-grafica>` (11 tipos, ECharts perezoso ≈ 284 KB gzip solo si hay gráfica) + **Estudio de gráficas** · ⏳ `<gob-dashboard>` y filtros globales |
| Estándar | ✅ `componentes/estandar.html`: un origen de tokens, presets PrimeNG/PrimeVue verificados, guía de decisión, contrato `gob-*` y **licencias de PrimeNG 22 / PrimeVue 5 (PrimeUI License)** |
| 2 · Tabla y datos · 1 · Fundaciones · 5 · Formularios de negocio | ⏳ |

- Documentación del mapa: `componentes/gob-mapa-magdalena.html` · Generador: `estudio/mapas.html`.
- Bundle del mapa: ≈ 18 KB gzip (Lit incluido) + `gob.min.css` ≈ 7 KB. Límite del brief: 50 KB.
- Dependencias y licencias: `LICENSES.md`.
- Datos: códigos **DIVIPOLA** y geometría **MGN 2024** del DANE (origen y licencia en `packages/datos/LICENCIAS.md`).
- Accesibilidad: las páginas del portal y el Estudio pasan **axe-core (WCAG 2.1 A/AA)** sin violaciones; falta Lighthouse y pruebas con lector de pantalla.

## Paleta (página 05 del manual)

| Variable | HEX | Rol |
|---|---|---|
| `--mg-primary` | `#0071BB` | Azul institucional (primario) |
| `--mg-cyan` | `#00B7D9` | Cian (primario, fin del degradado) |
| `--mg-sky` | `#9FD7E5` | Celeste (primario) |
| `--mg-red` | `#F7003C` | Rojo (primario) |
| `--mg-yellow` | `#FEC800` | Acento |
| `--mg-green` | `#69B75E` | Acento |
| `--mg-olive` | `#A28034` | Acento |
| `--mg-purple` | `#5618BA` | Acento (extremos de la franja) |

## Estilo: sobrio y corporativo

Por defecto las interfaces usan **superficies blancas y azul-noche** (`--mg-navy-*`), gris azulado para bordes y fondos (`--mg-gray-*`), efecto **cristal** sutil (`.mg-glass`) y **un solo color dominante: el azul institucional**. Los demás colores quedan para estados (verde/amarillo/rojo en tonos suaves) y para **la línea multicolor**, que se usa como firma fina de 3 px (pie de página, portada). Proporción orientativa por pantalla: 70% neutros · 15% azul-noche · 10% azul · 5% acentos.

Si un proyecto necesita el look vivo (portadas, micrositios de campaña), los degradados `--mg-gradient-primary` y `--mg-gradient-sky` y las utilidades `mg-bg-*` siguen disponibles.

La imagen web de portadas se apoya en el **degradado de la gama azul** (`--mg-gradient-primary`: 0071BB → 00B7D9, `--mg-gradient-sky`: 0071BB → 00B7D9 → 9FD7E5). Los demás colores se usan en objetos y en **la línea** (`--mg-gradient-stripe`, 9 segmentos: violeta · ocre · amarillo · rojo · azul · cian · celeste · verde · violeta). Cada color tiene escala 50–950 (`--mg-primary-50 … --mg-primary-950`).

## Estructura

```
index.html, colores.html, logos.html, componentes.html,
integracion.html, aplicaciones.html   ← portal (generado)
demos/            5 demos + plantilla base con componentes gob-* (copiar y pegar; sin AdminLTE/Bootstrap)
dist/             ← LO QUE SE CONSUME (generado, versionado)
  css/            magdalena(.min).css, magdalena-tokens(.min).css
  adminlte/       magdalena-adminlte3|4(.min).css
  bootstrap/      magdalena-bootstrap4|5(.min).css, _magdalena-bootstrap-variables.scss
  tailwind/       preset v3 (.cjs) y tema v4 (.css)
  angular-material/ _magdalena-theme.scss (M2 + M3), extras css
  primeng/        preset (PrimeNG 18+/PrimeVue 4), css extras, variables
  mui/ vuetify/   temas React y Vue
  scss/ less/     variables
  tokens/         JSON, ESM, CJS, .d.ts, Android XML, Flutter
  downloads/      ZIPs: logos (svg/png/jpg/todos), favicons, ejemplos, kit completo
assets/logos/     svg · png · jpg (extraídos del PDF + aportes del equipo)
assets/favicon/   favicon.ico, íconos 16–512, apple-touch-icon
assets/ejemplos/  piezas del manual (tarjeta, pendón, carnet, camisas, valla…)
docs/             una guía .md por tecnología
src/              CSS fuente de los componentes y de los overrides
tools/            tokens.py (fuente única), build.py, extract_assets.py …
```

## Compatibilidad verificada

| Tecnología | Cómo se validó |
|---|---|
| AdminLTE 3.2 (BS4) y 4.9 (BS5.3) | Demos en `demos/`, renderizadas en el navegador |
| Bootstrap 5.3 / 4.6 | Demo `bootstrap5.html` |
| Tailwind v3 y v4 | Compilados con los CLI reales; clases `bg-mg-*` generadas |
| Angular Material (M2 y M3) | `_magdalena-theme.scss` compilado con `sass` contra `@angular/material` 22 |
| PrimeNG/PrimeVue | Preset cargado y evaluado contra `@primeuix/themes` |
| MUI, Vuetify, tokens JS | Sintaxis validada con `node --check` (no se ejecutó una app) |
| Laravel, Java, WordPress, móvil | Guías por copia de archivos estáticos; no hay app de prueba |

## Regenerar `dist/`

Todo sale de `tools/tokens.py` (colores, degradados, tipografía) y `src/*.css`. **No edite `dist/` a mano.**

```bash
python tools/build.py              # regenera dist/, docs/ y las páginas del portal
python tools/extract_assets.py     # (solo si cambia el PDF) re-extrae logos desde el manual
python tools/make_favicons.py      # regenera favicons desde assets/logos/png/escudo.png
```

Requisitos: Python 3.10+, `pymupdf`, `pillow`.

## Publicar (para tener la URL de los CSS)

Es un sitio 100 % estático; basta servir la carpeta:

- **Laragon / intranet:** `http://localhost/manual_de_marca/` o un host virtual `manual_de_marca.test`.
- **Servidor propio (Nginx/Apache):** copie la carpeta; las URLs quedan `https://tu-dominio/manual_de_marca/dist/css/magdalena.min.css`.
- **GitHub Pages / GitLab Pages:** active Pages sobre la rama principal.
- **jsDelivr (si el repo está en GitHub):** `https://cdn.jsdelivr.net/gh/<org>/<repo>@<tag>/dist/css/magdalena.min.css` — use una etiqueta de versión (`@v1.0.0`) para no romper proyectos al actualizar.

El portal detecta su propia URL y la inserta en todos los ejemplos de código (editable en el campo «URL base»).

## Tipografía

El manual usa **Gotham** (Black/Ultra/Book) y Montserrat (tarjeta de presentación). Gotham es comercial: para web se usa **Montserrat** (libre, Google Fonts), que ya se importa desde `magdalena.css`. Si la entidad tiene licencia web de Gotham, basta con anteponerla en `--mg-font-sans` / `--mg-font-display`. Para redes cerradas, aloje Montserrat localmente.

## Qué viene del manual y qué no

- **Del manual:** paleta (8 colores con RGB/CMYK), logotipos vertical y horizontal, versiones oficiales, la línea de franjas, escudo, bandera, y las aplicaciones (tarjeta, pendón, carnet, camisas, backing, post, gorra, valla).
- **Decisiones del equipo de desarrollo (no están en el manual):** escalas tonales 50–950, degradados, componentes `mg-*`, mapeo semántico (éxito/aviso/error), tamaños de logo y espacio libre, y las versiones «blanco sobre transparente» y la barra SVG de la línea. Valídelas con Comunicaciones antes de oficializarlas.
- **Aportes que no son del manual:** `marca-magdalena-te-lo-puedes-creer`, `oficina-tecnologia-informacion`, `gobernacion-texto` y `gobernacion-horizontal-escudo` provienen de archivos entregados por el equipo.

## Accesibilidad

Contraste calculado en `colores.html`: texto **blanco** sobre azul `#0071BB` (5.2:1) y rojo; texto **oscuro** (`#1D1D1B`) sobre cian, celeste, amarillo y verde. El botón principal usa el azul `#0071BB` con un leve brillo tonal (`--mg-gradient-steel`): contraste 5:1 con texto blanco.

---
<sub>Dev. Ing. Daniel Cabarcas · 2026</sub>
