<?php exit; /* contenido privado */ ?>
# Despliegue y operación

## Coolify: la plataforma de despliegue

Panel: <https://coolify.apps.magdalena.gov.co> (acceso desde IPs autorizadas en el Panel TIC).

1. Conecte el repositorio de GitHub (organización de la Gobernación) en **Sources → GitHub App**.
2. **New Resource → Application**: build pack **Nixpacks** (detecta el lenguaje) o **Dockerfile**.
3. **Dominio:** `http://<app>.apps.magdalena.gov.co` — escríbalo con **`http://`**: el certificado HTTPS lo pone el servidor y
   el sitio se verá con candado.
4. **Environment Variables:** todos los secretos y configuraciones. Nunca en archivos.
5. **Health check:** `/health` (NestJS con `@nestjs/terminus`).
6. Cada `git push` a la rama configurada vuelve a desplegar. Si algo falla, **Rollback** a la versión anterior.

## Dockerfile de referencia (NestJS + Prisma)

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
USER node
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
```

## Ambientes

| Ambiente | Dónde | Base de datos | Secretos |
|---|---|---|---|
| Desarrollo | Equipo del desarrollador | Local (Docker) | Propios, de prueba |
| Pruebas | `<app>-pruebas.apps.magdalena.gov.co` | Base de pruebas | Distintos a producción |
| Producción | `<app>.apps.magdalena.gov.co` o dominio institucional | Base de producción | Solo en Coolify |

## Servicios del Panel TIC que debe usar

| Necesidad | Servicio | Dónde |
|---|---|---|
| Base de datos y usuario propio | Mis bases de datos | Panel TIC |
| Conectarse desde su equipo | Mi acceso (IP autorizada) | Panel TIC |
| Enviar correos | Correo (API) | Panel TIC |
| Probar el portal sin verificación anti-ataques | Excepción de Cloudflare | Panel TIC (permiso de su equipo) |

Conexión a servicios desde Coolify: PostgreSQL y API de correo en **`10.10.10.1`**.

## Operación

- **NeoMG** vigila disponibilidad, errores 5xx, conexiones a la base y archivos sensibles; las alertas llegan a la Oficina TIC.
- Logs de la aplicación en Coolify (pestaña *Logs*).
- Cambios de esquema destructivos o de alto riesgo se coordinan con la Oficina TIC (respaldo previo).
- Un sistema que deja de usarse se **retira**: se apaga, se respalda su base y se elimina su dominio. No se dejan sistemas huérfanos.
