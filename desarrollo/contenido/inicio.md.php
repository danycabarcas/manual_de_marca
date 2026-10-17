<?php exit; /* contenido privado: se muestra solo a través de index.php */ ?>
# Estándar de Desarrollo de Software

**Versión 1.0 · Oficina de Tecnologías de la Información · octubre de 2026**

El **Manual de marca** define *cómo se ve* un sistema de la Gobernación del Magdalena. Esta sección define *cómo se construye,
se protege y se publica*. Juntos forman el **Manual institucional**. Es de uso **interno**: solo la ve el equipo autorizado en el
Panel TIC.

> **Principio rector: estandarizar lo que no se ve y liberar lo que se ve.** El backend, la seguridad, los datos, el despliegue
> y la identidad visual son obligatorios. El framework de frontend se elige dentro de una lista corta.

## Qué es obligatorio y qué es libre

| Capa | ¿Estándar o libre? |
|---|---|
| Backend y API (NestJS + OpenAPI) | **Estándar** |
| Datos (PostgreSQL + Prisma) | **Estándar** |
| Autenticación (Google a través del Panel TIC; OIDC) | **Estándar** |
| Seguridad (OWASP, secretos, publicación) | **Estándar** |
| Despliegue (Coolify) y servicios del Panel TIC | **Estándar** |
| Identidad visual (tokens `--gob-*`, componentes `gob-*`) | **Estándar**, independiente del framework |
| Lógica compartida (validadores, DIVIPOLA, días hábiles) | **Estándar**, en TypeScript puro |
| Framework de frontend | **Libre**, dentro de la lista: Angular, React + Vite, Next.js, Vue |

## Cómo usar esta sección

1. **Antes de empezar un proyecto:** lea *Elegir la tecnología* y registre su decisión.
2. **Durante el desarrollo:** siga *Backend NestJS*, *Datos y migraciones*, *Seguridad* y *Frontend*.
3. **Antes de publicar:** complete la *Lista de verificación*. Sin ella, la Oficina TIC no autoriza el despliegue.
4. **Si mantiene un sistema existente:** revise *Sistemas existentes* para conocer lo que debe adecuar.

## Fuentes

Cada regla enlaza a su fuente oficial: [NestJS](https://docs.nestjs.com), [Prisma](https://www.prisma.io/docs),
[OWASP Top 10](https://owasp.org/Top10/), [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/),
[Angular](https://angular.dev), [React](https://react.dev), [Next.js](https://nextjs.org/docs), [Vue](https://vuejs.org/guide/),
y el marco legal colombiano: Ley 1581 de 2012 (datos personales), Ley 1712 de 2014 (transparencia) y NTC 5854 (accesibilidad web).

## Plantillas oficiales

| Plantilla | Repositorio | Estado |
|---|---|---|
| Backend NestJS + Prisma | [Gobmg/plantilla-nestjs-gob](https://github.com/Gobmg/plantilla-nestjs-gob) | Disponible |
| Frontend Angular | — | Próximamente |
| Frontend React + Vite | — | Próximamente |
| Frontend Vue 3 | — | Próximamente |
| Portal Next.js | — | Próximamente |

## Servicios de la Oficina TIC para desarrolladores

En el **Panel TIC** (<https://magdalena.gov.co/acceso/>), con su cuenta de Google:

- **Mi acceso:** autoriza su conexión a PostgreSQL, Coolify y el portal sin verificación anti-ataques.
- **Mis bases de datos:** crea bases PostgreSQL o MySQL con su propio usuario y contraseña.
- **Correo (API):** envía correos desde sus aplicaciones con una API key propia, con registro y cupo.
- **Coolify** (<https://coolify.apps.magdalena.gov.co>): despliegue de aplicaciones en `*.apps.magdalena.gov.co`.
