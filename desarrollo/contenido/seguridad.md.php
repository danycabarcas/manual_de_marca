<?php exit; /* contenido privado */ ?>
# Seguridad

Fuentes: [OWASP Top 10](https://owasp.org/Top10/), [OWASP ASVS nivel 2](https://owasp.org/www-project-application-security-verification-standard/),
[NestJS Security](https://docs.nestjs.com/security/authentication), [Angular Security](https://angular.dev/best-practices/security),
[Next.js Data Security](https://nextjs.org/docs/app/guides/data-security), [Vue Security](https://vuejs.org/guide/best-practices/security).
Marco legal: Ley 1581 de 2012, Ley 1273 de 2009 (delitos informáticos), Ley 1712 de 2014.

## Lección propia: el incidente de octubre de 2026

Varias APIs publicaban su `.env` en internet porque la carpeta pública del dominio era la carpeta completa del proyecto. Robots
descargaron las credenciales cientos de veces; con una de ellas, una IP externa entró a PostgreSQL, abrió 94 conexiones y dejó
fuera de servicio a todos los sistemas. Además, un volcado `database.sql` quedó publicado en otro sitio.
**Por eso las reglas de esta página son obligatorias y se verifican antes de cada publicación.**

## OWASP Top 10 aplicado

| Riesgo | Regla obligatoria |
|---|---|
| **A01 Control de acceso** | Guards en **todos** los endpoints (denegar por defecto). Verificar que el recurso pertenezca al usuario. |
| **A02 Fallas criptográficas** | HTTPS siempre. argon2/bcrypt. Secretos fuertes y únicos. Nada sensible dentro del JWT. |
| **A03 Inyección** | Prisma parametrizado; prohibido concatenar SQL o usar `$queryRawUnsafe` con datos del usuario. `ValidationPipe` con whitelist. Sin `innerHTML`/`v-html`/`dangerouslySetInnerHTML` con datos sin sanear. |
| **A04 Diseño inseguro** | Límite de peticiones, bloqueo tras intentos fallidos, captcha en formularios públicos. |
| **A05 Configuración** | helmet, CORS cerrado, Swagger oculto en producción, modo producción, **raíz pública = `dist/` o `public/`**. |
| **A06 Componentes vulnerables** | `npm audit`/OSV sin críticos antes de publicar. Renovate o Dependabot activos. |
| **A07 Autenticación** | Sin administradores por defecto. Sesiones con expiración. 2FA para administradores cuando sea posible. |
| **A08 Integridad** | Lockfile versionado. Construcción reproducible en contenedor. Revisión por pull request. |
| **A09 Registro y monitoreo** | Auditoría de acciones administrativas. NeoMG vigila disponibilidad, errores y archivos sensibles. |
| **A10 SSRF** | Validar y restringir URLs externas que reciba el backend; no seguir redirecciones a la red interna. |

## Secretos

> Guía completa: **[Archivos .env y secretos](./?p=secretos)** — dónde vive cada secreto, cómo protegerlo y qué hacer si se filtra.

- **Nunca** en el código, en Git, en un `.env` publicado, en capturas de pantalla ni en chats.
- Viven en las variables de entorno de Coolify (o del panel de Plesk).
- El `.gitignore` de todo proyecto incluye como mínimo:

```gitignore
.env
.env.*
!.env.example
*.sql
*.sql.gz
*.dump
*.bak
*.sqlite
```

- Si un secreto llegó a Git **una sola vez**, se considera filtrado aunque se borre: hay que cambiarlo.
- **gitleaks** como pre-commit y en CI (ver *Calidad*).
- Si sospecha una filtración, avise de inmediato a la Oficina TIC. Reportar a tiempo no se sanciona; ocultarlo sí es grave.

## Archivos que nunca deben ser públicos

`.env*`, `.git/`, `package.json`, `composer.json`, lockfiles, `tsconfig*.json`, `prisma/`, `docker-compose*`, `Dockerfile`,
`*.sql`, `*.bak`, `*.old`, respaldos y carpetas `old/`, `copia/`, `test/`.
El servidor ya bloquea estas rutas en todos los sitios, pero **ese bloqueo es una red de seguridad, no una excusa**: la raíz
pública debe ser `dist/` o `public/`.

## Cabeceras y navegador

- `helmet` en NestJS; en frontends, Content-Security-Policy restrictiva (sin `unsafe-eval`).
- Cookies de sesión `HttpOnly; Secure; SameSite=Lax` (o `Strict`).
- Nunca guardar tokens en `localStorage` si se puede usar una cookie `HttpOnly`.

## Formularios públicos

- Validación en el backend (la del frontend es solo comodidad).
- Límite de peticiones por IP, captcha o campo trampa, y tamaño máximo de archivos.
- Mensajes de error genéricos en login y recuperación de clave (no revelar si un correo existe).
