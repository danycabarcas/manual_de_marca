<?php exit; /* contenido privado */ ?>
# Sistemas existentes

## Estado actual (octubre de 2026)

| Capa | Hoy | Meta del estándar |
|---|---|---|
| APIs | 11 NestJS (8 con Prisma, 3 con TypeORM) y 3 Express heredadas (actas, bot, ws) | NestJS + Prisma |
| Frontend | 14 Angular, 1 React + Vite | Lista cerrada (cumple) |
| Seguridad base | `helmet` en 4 de 11 APIs; Swagger en 3; `throttler` en la mayoría | Todas con la configuración obligatoria |
| Despliegue | Plesk + Passenger, raíz pública = carpeta del proyecto | Coolify con contenedores |
| Base de datos | Usuarios compartidos (`ferias_admin`, `mi_calle_admin`) y superusuario `postgres` | Un usuario `app_<base>` por aplicación |
| Laravel | restitución de tierras, selfie, siacform, votavirtual | Se mantienen cumpliendo seguridad, calidad y despliegue |

## Plan de adecuación por prioridad

1. **Urgente — secretos:** cada aplicación pasa a su usuario `app_<base>` (contraseña desde *Mis bases de datos*), variables
   de entorno fuera de archivos públicos, y la Oficina TIC cambia todas las claves filtradas. Correo por la API interna.
2. **Seguridad base en las 11 APIs NestJS:** helmet, CORS cerrado, ValidationPipe con whitelist, throttler, Swagger protegido.
3. **Migración a Coolify:** una API a la vez, empezando por las de mayor riesgo; se apaga su entrada en Passenger al terminar.
4. **TypeORM → Prisma** en campusuniversitariosapi, gobforms y hojavidagobapi en su próximo cambio mayor.
5. **APIs Express heredadas** (actas, bot, ws): migrar a NestJS o retirar si ya no se usan.
6. **Pruebas y CI:** agregar el flujo de *Calidad* a cada repositorio.

## Qué debe hacer el responsable de cada sistema

- Revisar la *Lista de verificación* contra su sistema y anotar lo que falta.
- Acordar con la Oficina TIC la fecha de adecuación de su sistema.
- No publicar cambios nuevos que empeoren el cumplimiento (por ejemplo, un `.env` nuevo en la carpeta pública).
