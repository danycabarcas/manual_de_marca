<?php exit; /* contenido privado */ ?>
# Lista de verificación para publicar

**Ningún sistema nuevo o actualizado se publica sin esta lista completa.** El desarrollador la adjunta a la solicitud de
despliegue y la Oficina TIC la verifica.

## Repositorio

- [ ] El repositorio está en la organización de GitHub de la Gobernación.
- [ ] No contiene `.env` ni volcados: `git ls-files | grep -Ei '\.env$|\.sql|\.dump|\.bak'` no devuelve nada.
- [ ] El `.gitignore` incluye las reglas de la sección *Seguridad*.
- [ ] `README` con propósito, responsable, cómo correrlo y variables de entorno (solo nombres).
- [ ] Los controles de *Calidad* están en verde (lint, pruebas, gitleaks, Semgrep, dependencias).

## Configuración

- [ ] Las variables de entorno están en Coolify (o en el panel de Plesk), no en archivos.
- [ ] Los secretos de producción son distintos a los de desarrollo y pruebas.
- [ ] La aplicación usa **su propio usuario de base de datos** (`app_<base>`) y se conecta por `localhost` o `10.10.10.1`.
- [ ] El correo sale por la **API interna de correo**; no hay contraseñas SMTP en la aplicación.
- [ ] No hay administradores con contraseña por defecto ni variables `SEED_ADMIN_*` en producción.

## Seguridad (NestJS)

- [ ] `helmet`, CORS con orígenes explícitos, `ValidationPipe` (whitelist), `@nestjs/throttler`.
- [ ] Guards de autenticación y roles en todos los endpoints.
- [ ] Swagger oculto o protegido en producción.
- [ ] `/health` responde.

## Verificación desde el navegador

Estas rutas deben responder **404** (no descargar nada):

```
https://<dominio>/.env
https://<dominio>/.env.example
https://<dominio>/package.json
https://<dominio>/.git/config
https://<dominio>/prisma/schema.prisma
```

## Marca y accesibilidad

- [ ] Usa los tokens y componentes `gob-*` del manual; logos oficiales.
- [ ] Lighthouse accesibilidad ≥ 95; navegable con teclado.
- [ ] Política de privacidad enlazada si recolecta datos personales.
