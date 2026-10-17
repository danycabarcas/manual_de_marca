<?php exit; /* contenido privado */ ?>
# Archivos .env y manejo de secretos

> **Regla de oro: un secreto nunca está en el código, nunca en Git y nunca en un archivo que el servidor web pueda entregar.**
> Vive solo en las variables de entorno de la plataforma de despliegue (Coolify o Plesk) y en la máquina del desarrollador.

## Por qué esto es obligatorio: lo que nos pasó

En octubre de 2026, varias APIs de la Gobernación tenían su archivo `.env` dentro de la carpeta pública del dominio.
Cualquiera podía abrir `https://<api>.magdalena.gov.co/.env` y verlo. Esto ocurrió:

| Hecho | Cifra |
|---|---|
| APIs con el `.env` descargable | al menos 10 |
| Descargas registradas por robots desde julio | más de 640 |
| Descargas confirmadas en solo 48 horas | 14 (incluido un volcado `database.sql`) |
| Intrusión a PostgreSQL con una clave filtrada | 94 conexiones desde una IP desconocida; **todos los sistemas fuera de servicio** |
| Intentos de adivinar la clave del superusuario | 150 en 1 minuto y 42 segundos, desde una sola IP |

Esos archivos tenían: claves de bases de datos, secretos para firmar sesiones (con ellos se puede entrar como cualquier
usuario, incluido el administrador), usuarios y contraseñas de administrador, cuentas de correo y llaves de almacenamiento.
**Un solo archivo expuesto compromete el sistema completo, y si la clave se comparte, compromete a los demás.**

## ¿Qué es un secreto?

Todo valor que permita entrar, firmar o gastar a nombre de la Gobernación:

- Contraseñas y URLs de bases de datos (`DATABASE_URL`, `DB_PASSWORD`).
- Secretos de sesión y firma (`JWT_SECRET`, `JWT_REFRESH_SECRET`, `APP_KEY` de Laravel, `SESSION_SECRET`).
- Llaves de servicios externos (almacenamiento, correo, mapas de pago, IA, pasarelas de pago).
- Usuarios y contraseñas de administrador, cuentas SMTP, certificados y llaves privadas.
- La API key de la API de correo del Panel TIC.

**No son secretos** (pueden ir en el código o en variables públicas): el ID de cliente de Google (`GOOGLE_CLIENT_ID`),
URLs públicas, nombres de la aplicación, banderas de funcionalidades.

## Dónde vive cada cosa

| Lugar | ¿Puede tener secretos? | Cómo |
|---|---|---|
| Código fuente y Git | **Nunca** | Solo `.env.example` con nombres y valores de ejemplo |
| `.env` en la máquina del desarrollador | Sí, **solo los suyos de desarrollo** | Está en `.gitignore`; nunca se copia al servidor |
| **Coolify** (producción y pruebas) | **Sí: es el lugar correcto** | *Application → Environment Variables*. Marque los secretos como no visibles en el build |
| Plesk, aplicación Node.js | Sí | *Node.js → Variables de entorno personalizadas*. Nunca un `.env` en la carpeta del dominio |
| Laravel heredado en Plesk | Sí, con cuidado | `.env` **fuera** de la raíz pública: la raíz del dominio debe ser `public/`, nunca la carpeta del proyecto |
| Variables de frontend (`NEXT_PUBLIC_*`, `VITE_*`, `environment.ts`) | **Nunca** | Todo lo que llega al navegador es público, aunque esté "en una variable" |
| Chat, correo, WhatsApp, capturas de pantalla, documentos | **Nunca** | Para compartir, use un gestor de contraseñas o pida que el Panel TIC genere una nueva |

## El archivo `.env.example`

Va en el repositorio y documenta **qué** variables necesita el sistema, nunca sus valores reales:

```env
# Base de datos: usuario propio (Panel TIC → Mis bases de datos). Plesk: localhost · Coolify: 10.10.10.1
DATABASE_URL=postgresql://app_mi_base:CAMBIE_ESTO@localhost:5432/mi_base
# 64+ caracteres aleatorios: openssl rand -base64 64
JWT_SECRET=CAMBIE_ESTO_POR_64_CARACTERES_ALEATORIOS
```

La plantilla oficial NestJS **no arranca** si un secreto tiene menos de 64 caracteres, si conserva el texto `CAMBIE_ESTO`
o si la base de datos apunta a la IP pública del servidor.

## `.gitignore` obligatorio

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

Verifique antes de cada commit que no se cuele nada: `git status` y `git diff --cached`.

## Generar secretos fuertes

```bash
openssl rand -base64 64          # secretos de sesión (JWT)
openssl rand -hex 32             # llaves hexadecimales
```

- **Uno distinto por aplicación y por ambiente** (desarrollo, pruebas, producción).
- Nunca reutilizar la clave de un sistema en otro.
- Las contraseñas de bases de datos y de la API de correo las genera el **Panel TIC** (se muestran una sola vez).

## Detectar secretos antes de que salgan

Instale **gitleaks** como verificación previa a cada commit:

```bash
# Una vez por equipo (Windows: winget install gitleaks · macOS: brew install gitleaks)
gitleaks git --staged --redact     # revisa lo que está por confirmar
gitleaks git --redact              # revisa todo el historial del repositorio
```

El flujo de CI de la plantilla ejecuta gitleaks en cada `push`: si encuentra un secreto, **el cambio no se despliega**.

## Verificar que su sistema no expone nada

Desde cualquier navegador o terminal, estas rutas deben responder **404**:

```bash
for r in .env .env.example .env.production package.json .git/config prisma/schema.prisma composer.json; do
  printf '%-24s %s\n' "$r" "$(curl -s -o /dev/null -w '%{http_code}' https://SU-DOMINIO/$r)"
done
```

El servidor bloquea estas rutas en todos los sitios desde octubre de 2026, pero **ese bloqueo es una red de seguridad, no una
excusa**: el sistema debe estar bien desplegado por sí mismo.

## Si un secreto se filtró

Se considera filtrado si: llegó a Git (aunque se haya borrado después), se envió por chat o correo, apareció en una captura,
estuvo en un archivo público o en un log. Haga esto **de inmediato**:

1. **Avise a la Oficina TIC.** Reportar a tiempo no se sanciona; ocultarlo sí es grave.
2. **Cambie el secreto** (borrarlo de Git no basta: quien lo copió lo sigue teniendo):

| Tipo | Cómo se cambia |
|---|---|
| Base de datos | Panel TIC → Mis bases de datos → **Nueva contraseña**, y actualizar la variable en Coolify |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Generar uno nuevo y actualizar la variable (cierra todas las sesiones, es lo esperado) |
| API de correo | Panel TIC → Correo (API) → **Nueva API key** |
| Almacenamiento (DigitalOcean Spaces, S3) | Revocar la llave en el proveedor y crear una nueva |
| Cuenta SMTP o administrador | Cambiar la contraseña en el servicio, no solo en la variable |
| Secreto de Google OAuth | Google Cloud Console → Credenciales → restablecer el secreto |

3. **Revise el uso indebido:** accesos a la base, usuarios administradores nuevos, correos enviados, archivos modificados.
4. **Limpie el historial de Git** solo después de cambiar el secreto (`git filter-repo` o BFG), y avise al equipo.

## Lista rápida

- [ ] No hay `.env` en el repositorio ni en la carpeta pública del servidor.
- [ ] `.gitignore` con las reglas de esta página; `.env.example` sin valores reales.
- [ ] Secretos solo en las variables de entorno de Coolify o Plesk.
- [ ] Secretos de 64+ caracteres, distintos por aplicación y por ambiente.
- [ ] Ningún secreto en variables del frontend.
- [ ] gitleaks en el equipo y en CI.
- [ ] Las rutas sensibles responden 404.
