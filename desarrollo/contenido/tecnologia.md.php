<?php exit; /* contenido privado */ ?>
# Elegir la tecnología

## Lista cerrada

| Capa | Estándar | Excepción permitida |
|---|---|---|
| Backend / API | **NestJS + TypeScript** | Laravel, solo en los casos de la sección «Cuándo se permite Laravel» |
| ORM y migraciones | **Prisma** (único ORM para sistemas nuevos) | — Los sistemas con TypeORM migran en su próximo cambio mayor |
| Base de datos | **PostgreSQL** (+ PostGIS para datos geográficos) | MySQL/MariaDB solo para WordPress y Laravel |
| Frontend | **Angular** · **React + Vite** · **Next.js** · **Vue** | Ninguna otra |
| Identidad visual | Tokens `--gob-*` y componentes `gob-*` del manual | — |
| Despliegue | **Coolify** (contenedores) | Plesk solo para PHP/WordPress existente |
| Correo | **API interna de correo** del Panel TIC | — |
| Contenido editorial | WordPress institucional | — |

## Matriz de decisión del frontend

```
¿Es público y necesita SEO? (portal, trámites, transparencia, datos abiertos)   → Next.js
¿Es interno, grande y de larga vida? (gestión, trámites, formularios complejos)  → Angular   ← por defecto
¿Es muy interactivo, mediano o un prototipo? (tableros, tiempo real)            → React + Vite
¿Es pequeño o mediano y el equipo domina Vue? (módulos, formularios, widgets)    → Vue 3 + Vite
¿No hay una razón clara?                                                        → Angular
```

| Framework | Mejor para | Débil en | Regla institucional |
|---|---|---|---|
| **Angular** | Sistemas internos grandes y de larga vida | Portales públicos y prototipos | Por defecto. Standalone components, señales. |
| **React + Vite** | Interactividad, tableros, tiempo real, prototipos | Estructura (cada quien arma la suya) | Usar la plantilla oficial con su estructura de carpetas. |
| **Next.js** | Portales públicos con SEO y SSR | Paneles internos (complejidad innecesaria) | **Solo presenta.** La lógica de negocio va en NestJS. |
| **Vue 3** | Sistemas pequeños o medianos, curva de aprendizaje corta | Ecosistema de componentes empresariales más pequeño | Composition API + `<script setup>` + Pinia; plantilla oficial. |

## Matriz por tamaño y alcance del proyecto

| Tipo de proyecto | Ejemplo | Duración y alcance | Stack |
|---|---|---|---|
| **Sistema misional** | Trámites, gestión documental, PAE | Años, varias dependencias, integraciones | NestJS + Prisma + PostgreSQL + Angular |
| **Sistema mediano** | Ferias, préstamos, alertas tempranas | 1–3 años, una dependencia | NestJS + Prisma + Angular, React o Vue |
| **Portal público** | Transparencia, datos abiertos, campañas | Permanente, necesita SEO | Next.js + API NestJS |
| **Formulario o convocatoria aislada** | Inscripción a una convocatoria puntual | Menos de 6 meses, sin integraciones | **Laravel permitido**, o NestJS + frontend si ya hay plantilla |
| **Panel administrativo CRUD simple** | Catálogos internos | Corto, pocas pantallas | Laravel + Filament permitido |
| **Contenido editorial** | Micrositios informativos | Lo edita personal no técnico | WordPress |

## Cuándo se permite Laravel

Solo si se cumplen **todas** estas condiciones:

1. Alcance corto (menos de 6 meses) o un sistema aislado sin integración con otros sistemas.
2. Justificación escrita aprobada por la Oficina TIC (por qué no NestJS).
3. Cumple completo las secciones de **Seguridad**, **Datos**, **Calidad** y **Despliegue** de este estándar.
4. Raíz pública en `public/`, Laravel actualizado a una versión con soporte, y sin `APP_DEBUG=true` en producción.

## Criterios para añadir una librería de terceros

- Licencia MIT, Apache 2.0 o BSD.
- Mantenimiento activo: commits en los últimos 6 meses.
- Tipos de TypeScript.
- Tamaño razonable y carga bajo demanda cuando sea pesada.
- Sin vulnerabilidades críticas abiertas (`npm audit`, OSV).
- Accesible (WCAG 2.1 AA).
- Toda dependencia nueva se registra en el `README` del proyecto con su licencia.
- **Antes de construir un componente, revise si ya existe en el manual (`gob-*`).** Si lo necesitarán dos o más sistemas,
  se propone al manual en lugar de construirlo en el proyecto.
