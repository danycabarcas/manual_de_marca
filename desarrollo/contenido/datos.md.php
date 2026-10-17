<?php exit; /* contenido privado */ ?>
# Datos y migraciones

## Base de datos

- **PostgreSQL** es el estándar. **PostGIS** para datos geográficos.
- **Un usuario de base de datos por aplicación**, creado desde el Panel TIC (*Mis bases de datos*). Nunca el superusuario
  `postgres` ni un usuario compartido entre sistemas.
- Conexión a **`localhost`** (aplicaciones en Plesk) o **`10.10.10.1`** (aplicaciones en Coolify). **Nunca a la IP pública.**
- El acceso remoto de los desarrolladores (DBeaver, pgAdmin) es solo desde **IPs autorizadas** en el Panel TIC y con su usuario
  personal, no con el de la aplicación.
- Ambientes separados: la base de pruebas y la de producción son distintas y tienen claves distintas.

## Prisma: único ORM

Fuente oficial: <https://www.prisma.io/docs/orm/prisma-migrate>

| Momento | Comando | Regla |
|---|---|---|
| Desarrollo | `npx prisma migrate dev --name <cambio>` | Genera la migración y la aplica en su base local |
| Revisión | Revisar el SQL de `prisma/migrations/<fecha>_<cambio>/migration.sql` | Se revisa en el pull request como cualquier código |
| Producción | `npx prisma migrate deploy` | Se ejecuta al iniciar el contenedor, **antes** de la aplicación |
| Prohibido en producción | `prisma db push`, `migrate reset`, `migrate dev` | Pueden borrar datos o desviar el esquema |

- Las migraciones se versionan en Git y **no se editan** después de aplicadas: se corrige con una migración nueva.
- Cambios destructivos (borrar columnas o tablas) en **dos pasos**: primero se deja de usar, en un despliegue posterior se elimina.
- **Respaldo antes de cada migración destructiva** en producción (solicitarlo a la Oficina TIC).
- Datos iniciales con `prisma/seed.ts`, idempotente; nunca credenciales reales en el seed.
- Consultas crudas solo con `$queryRaw` parametrizado (plantillas etiquetadas). **Prohibido `$queryRawUnsafe` con datos del usuario.**

Ejemplo de arranque en el contenedor:

```dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
```

## Sistemas con TypeORM

Prisma es el único ORM para sistemas nuevos. Los sistemas que hoy usan TypeORM (campusuniversitariosapi, gobforms,
hojavidagobapi) migran a Prisma en su próximo cambio mayor: `prisma db pull` genera el esquema desde la base existente y se
crea una migración base (`migrate diff` + `migrate resolve --applied`).

## Modelado

- Nombres en español, consistentes: tablas en plural (`municipios`), columnas en `snake_case` con `@map` en Prisma.
- Llaves primarias `id` (entero autoincremental o UUID v7); fechas `created_at` / `updated_at` con zona horaria.
- **El código DIVIPOLA es la llave de todo lo territorial.** Nunca el nombre del municipio como identificador.
- Borrado lógico (`deleted_at`) en datos con valor de auditoría.
- Índices para toda columna usada en filtros o uniones frecuentes.

## Datos personales (Ley 1581 de 2012)

- Recolectar solo lo necesario y con autorización del titular (política de privacidad del sistema).
- No usar datos de producción en desarrollo; si hace falta, anonimizarlos.
- No registrar datos personales en logs.
- Definir el tiempo de conservación de cada dato y su eliminación.
