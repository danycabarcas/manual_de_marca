<?php exit; /* contenido privado */ ?>
# Frontend

## Identidad visual (obligatoria en todos los frameworks)

- **Componentes `gob-*`** del manual (tabla, KPI, gráficas, mapa del Magdalena, pestañas, modales, formularios…), que funcionan
  igual en Angular, React, Next.js, Vue y HTML plano. Instalación y ejemplos en [Componentes](../componentes.html) y
  [Angular, React, Next.js y Vue](../componentes/frameworks.html).
- **Tokens `--gob-*`** para colores, tipografía, espaciado y radios. No inventar colores ni logos.
- **PrimeNG** (Angular) o **PrimeVue** (Vue) solo con el **preset de la Gobernación**, para verse idénticos al manual.
- Accesibilidad **WCAG 2.1 AA / NTC 5854**: teclado, ARIA, foco visible y contraste. Lighthouse accesibilidad ≥ 95.
- **Antes de construir un componente, revise si ya existe en el manual.** Si lo necesitan dos o más sistemas, se propone al manual.

## Reglas comunes

- **El cliente de API se genera** desde el OpenAPI del backend NestJS (**orval** u openapi-generator), no se escribe a mano.
- Variables públicas del frontend: solo URLs y llaves públicas. **Nunca secretos** (`NEXT_PUBLIC_*`, `VITE_*`, `environment.ts` son públicos).
- Sesión con cookie `HttpOnly` cuando sea posible; nunca contraseñas ni tokens largos en `localStorage`.
- Se publica **solo el resultado de la compilación** (`dist/`), nunca la carpeta del código fuente.
- Manejo de errores visible para el usuario (estados de carga, vacío y error de los componentes `gob-*`).

## Angular (por defecto)

Fuente: <https://angular.dev> · Guía de estilo: <https://angular.dev/style-guide>

- Componentes **standalone**, **señales** para estado local y `inject()`.
- `HttpClient` con interceptores para autenticación y errores.
- Formularios reactivos tipados.
- Carga diferida por ruta (`loadComponent` / `loadChildren`).
- Con los componentes `gob-*`: `CUSTOM_ELEMENTS_SCHEMA` o los envoltorios Angular del manual.

## React + Vite

Fuente: <https://react.dev> · <https://vite.dev>

- Plantilla oficial con estructura por funcionalidad (`src/features/<dominio>/`).
- **TanStack Query** para datos del servidor, **React Hook Form + Zod** para formularios, **React Router** para rutas.
- TypeScript estricto. Sin lógica de negocio duplicada del backend.

## Next.js (portales públicos)

Fuente: <https://nextjs.org/docs>

- **App Router**. Solo presentación, SSR y SEO. **La lógica de negocio vive en NestJS**; no se usan rutas API de Next como backend.
- Componentes `gob-*` cargados solo en el cliente (`'use client'` o importación dinámica).
- Metadatos, `sitemap.xml` y datos estructurados en cada página pública.

## Vue 3

Fuente: <https://vuejs.org/guide/> · Seguridad: <https://vuejs.org/guide/best-practices/security>

- **Composition API** con `<script setup>` y TypeScript.
- **Pinia** para estado, **Vue Router** para rutas, **VeeValidate + Zod** para formularios.
- Prohibido `v-html` con datos que no estén saneados.
- Componentes `gob-*`: configurar `compilerOptions.isCustomElement` para el prefijo `gob-`.
