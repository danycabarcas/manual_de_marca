<?php exit; /* contenido privado */ ?>
# Backend NestJS

Fuente oficial: <https://docs.nestjs.com>. Versión: NestJS 11 sobre Node.js 22 LTS.

> **Empiece siempre desde la plantilla oficial:** [Gobmg/plantilla-nestjs-gob](https://github.com/Gobmg/plantilla-nestjs-gob)
> (botón *Use this template*). Ya cumple todo lo de esta página: configuración validada, seguridad, login con Google,
> roles, Prisma, paginación, health check, cliente de correo, pruebas (96 % de cobertura), CI y Dockerfile.

## Estructura del proyecto

```
src/
  main.ts                  arranque: helmet, CORS, ValidationPipe, Swagger, prefijo /api/v1
  app.module.ts
  config/                  ConfigModule + validación de variables de entorno
  common/                  filtros de excepción, interceptores, guards, decoradores, paginación
  prisma/                  PrismaService (módulo global)
  modules/<dominio>/       <dominio>.module.ts · controller · service · dto/
prisma/
  schema.prisma
  migrations/              versionadas en Git
test/                      pruebas e2e (Supertest)
Dockerfile
```

- **Un módulo por dominio de negocio** ([Modules](https://docs.nestjs.com/modules)).
- **Los controladores no tienen lógica:** reciben, validan (DTO) y delegan en el servicio.
- **Los servicios no conocen HTTP:** lanzan excepciones de dominio que un filtro global traduce.

## `main.ts` obligatorio

```typescript
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);

  app.use(helmet());
  app.enableCors({ origin: config.getOrThrow<string>('ALLOWED_ORIGINS').split(','), credentials: true });
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.getHttpAdapter().getInstance().set('trust proxy', 1);   // corre detrás de nginx / Traefik
  app.enableShutdownHooks();

  if (config.get('NODE_ENV') !== 'production') {
    const doc = SwaggerModule.createDocument(app, new DocumentBuilder().setTitle('API').addBearerAuth().build());
    SwaggerModule.setup('api/docs', app, doc);
  }
  await app.listen(config.get('PORT') ?? 3000);
}
```

| Elemento | Regla | Fuente |
|---|---|---|
| `helmet()` | Obligatorio | [Helmet](https://docs.nestjs.com/security/helmet) |
| CORS | Orígenes explícitos desde variable; nunca `*` con credenciales | [CORS](https://docs.nestjs.com/security/cors) |
| `ValidationPipe` global | `whitelist` + `forbidNonWhitelisted` + `transform` | [Validation](https://docs.nestjs.com/techniques/validation) |
| Límite de peticiones | `@nestjs/throttler` global; más estricto en login y recuperación de clave | [Rate limiting](https://docs.nestjs.com/security/rate-limiting) |
| Versionado | `/api/v1/...` | [Versioning](https://docs.nestjs.com/techniques/versioning) |
| OpenAPI | Obligatorio; en producción oculto o protegido | [OpenAPI](https://docs.nestjs.com/openapi/introduction) |
| Salud | `GET /health` con `@nestjs/terminus` (lo usa Coolify) | [Health checks](https://docs.nestjs.com/recipes/terminus) |

## Configuración y secretos

- `@nestjs/config` con **validación al arrancar**: si falta una variable, la aplicación no inicia ([Configuration](https://docs.nestjs.com/techniques/configuration)).
- Los valores se configuran en **Coolify → Environment Variables**. **Nunca** en un `.env` dentro de lo publicado, ni en Git.
- `.env.example` en el repositorio, solo con nombres y valores de ejemplo.
- Secretos distintos por aplicación y por ambiente (desarrollo, pruebas, producción).

## Autenticación y autorización

- **Inicio de sesión con Google** (cuentas institucionales y autorizadas), verificando el `id_token` en el backend con
  `google-auth-library` (audiencia, emisor, vencimiento, `email_verified`).
- La API emite su **JWT de acceso de vida corta** (15–60 min) y un **token de renovación**; preferir cookies `HttpOnly; Secure; SameSite`.
- `JWT_SECRET` de 64+ caracteres aleatorios (`openssl rand -base64 64`), distinto por aplicación.
- **Autorización por roles con guards** en todos los controladores: denegar por defecto ([Authorization](https://docs.nestjs.com/security/authorization)).
- Validar que el recurso consultado pertenezca al usuario (evita acceder a datos de otros cambiando un ID).
- Contraseñas locales, si existen: **argon2** (o bcrypt con costo ≥ 12) ([Encryption and hashing](https://docs.nestjs.com/security/encryption-and-hashing)).
- **Sin administradores por defecto en producción:** el usuario inicial se crea una sola vez con clave temporal y se elimina `SEED_ADMIN_*`.
- Decisión futura: proveedor de identidad único OIDC (Keycloak) para todos los sistemas.

## Respuestas, errores y paginación

```json
{ "data": [ ... ], "meta": { "page": 1, "pageSize": 20, "total": 145 } }
```

- **Paginación del lado del servidor obligatoria** en listas (compatible con `<gob-tabla>` en modo servidor).
- Un **filtro de excepciones global** que nunca devuelve trazas internas ni mensajes de base de datos al cliente.
- Errores con forma estable: `{ "statusCode": 422, "error": "Unprocessable Entity", "message": [...] }`.

## Registros y auditoría

- Logs estructurados en JSON (`nestjs-pino` recomendado), sin contraseñas, tokens ni datos personales sensibles.
- Registrar IP real, usuario y acción en las operaciones administrativas (tabla de auditoría).

## Archivos y correo

- Archivos en almacenamiento compatible con S3 (MinIO o DigitalOcean Spaces), con URLs firmadas y validación de tipo y tamaño.
  Nunca dentro de la carpeta del proyecto.
- Correo: **API interna de correo** del Panel TIC (`MAIL_API_URL`, `MAIL_API_KEY`). Las aplicaciones no guardan contraseñas SMTP.

## Tareas en segundo plano

- Colas con **BullMQ** (Redis) para trabajos pesados o reintentos ([Queues](https://docs.nestjs.com/techniques/queues)).
- Tareas programadas con `@nestjs/schedule`, idempotentes y con bloqueo si hay varias instancias.
