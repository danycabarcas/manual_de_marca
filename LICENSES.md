# Dependencias y licencias

Registro de cada dependencia usada o prevista en la librería (`packages/`). Ninguna es incompatible con el uso institucional ni con distribución del código.

## En tiempo de ejecución (se entregan al usuario final)

| Paquete | Uso | Licencia |
|---|---|---|
| [lit](https://lit.dev) 3.x | Base de los Web Components `gob-*` (≈ 6 KB gzip) | BSD-3-Clause |
| [Apache ECharts](https://echarts.apache.org) 6.1 (+ ZRender) | `<gob-grafica>` (carga perezosa; incluye NOTICE de Apache) | Apache-2.0 (ZRender: BSD-3-Clause) |
| Fuente **Montserrat** | Tipografía web (alternativa libre a Gotham) | SIL Open Font License 1.1 |

## Solo desarrollo / build (no se distribuyen)

| Paquete | Uso | Licencia |
|---|---|---|
| vite 7 | Build en modo librería (ESM) | MIT |
| typescript 5 | Tipos estrictos | Apache-2.0 |
| mapshaper 0.6 | Simplificación topológica de límites (`packages/datos`) | MPL-2.0 (herramienta de línea de comandos; no se incluye en la salida) |
| PyMuPDF, Pillow | Extracción de logos del PDF y generación de favicons (`tools/`) | AGPL-3.0 / HPND — solo se ejecutan localmente; no se distribuyen |

## Librerías de componentes de los proyectos (no se incluyen en este repo)

| Paquete | Licencia (LICENSE.md, verificado 2026-10) | Nota |
|---|---|---|
| PrimeNG 17 / 18–21 | MIT / «Community versions» MIT | Versiones recomendadas |
| PrimeNG 22 · PrimeVue 5 · @primeuix/themes ≥ 3 | **PrimeUI License** (clave de licencia; gratuita solo para organizaciones pequeñas) | Evitar sin licencia comercial |
| PrimeVue 4 · @primeuix/themes 1–2 | MIT | Recomendadas |

Ver la guía `componentes/estandar.html`.

## Previstas en las siguientes fases (aún no instaladas)

| Paquete | Uso | Licencia |
|---|---|---|
| Tabulator | `<gob-tabla>` | MIT |
| MapLibre GL JS + PMTiles | Mapas con teselas vectoriales (veredas, barrios) | BSD-3-Clause |
| Lucide (opcional) | Iconografía | ISC |
| Style Dictionary | Exportar tokens a múltiples formatos | Apache-2.0 |
| Playwright / axe-core | Pruebas visuales y de accesibilidad | Apache-2.0 / MPL-2.0 |

## Datos

Ver `packages/datos/LICENCIAS.md` (DIVIPOLA y Marco Geoestadístico Nacional 2024, DANE — datos abiertos).
