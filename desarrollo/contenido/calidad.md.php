<?php exit; /* contenido privado */ ?>
# Calidad y análisis de código

El objetivo es que el estándar **se cumpla solo**: cada `git push` ejecuta los controles, y lo que no los pase no se despliega.

## Controles automáticos

| Control | Herramienta | Cuándo | Bloquea el despliegue si… |
|---|---|---|---|
| Formato y estilo | ESLint + Prettier | Pre-commit y CI | hay errores |
| Pruebas unitarias | Jest ([NestJS testing](https://docs.nestjs.com/fundamentals/testing)) / Vitest | CI | fallan, o la cobertura de servicios es < 60 % (meta 80 %) |
| Pruebas e2e | Supertest (API) / Playwright (frontend) | CI | fallan los flujos críticos |
| Secretos en el código | [gitleaks](https://github.com/gitleaks/gitleaks) | Pre-commit y CI | encuentra un secreto |
| Código inseguro | [Semgrep](https://semgrep.dev) (reglas OWASP y TypeScript) | CI | hay hallazgos de severidad alta |
| Dependencias vulnerables | `npm audit` / [osv-scanner](https://google.github.io/osv-scanner/) | CI y semanal | hay vulnerabilidades críticas |
| Imagen de contenedor | [Trivy](https://trivy.dev) | CI | hay vulnerabilidades críticas |
| Calidad general | [SonarQube Community](https://www.sonarsource.com/products/sonarqube/) | Cada push a `main` | no pasa el *Quality Gate* |
| Accesibilidad | axe-core / Lighthouse | CI frontend | hay errores críticos |

Los resultados se verán en la sección **Calidad** del Panel TIC: cada desarrollador ve sus proyectos y los administradores, todos.

## Flujo de trabajo con Git

- Repositorios en la **organización de GitHub de la Gobernación**, nunca en cuentas personales.
- Ramas: `main` (producción), `develop` (pruebas), `feature/*` y `fix/*`.
- Toda fusión a `main` por **pull request** con al menos **una aprobación** y los controles en verde.
- Commits convencionales: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- Etiquetas de versión semántica (`v1.4.0`) en cada publicación a producción.

## Ejemplo de flujo de CI (GitHub Actions)

El flujo completo y probado está en la plantilla oficial: `.github/workflows/calidad.yml` de
[Gobmg/plantilla-nestjs-gob](https://github.com/Gobmg/plantilla-nestjs-gob). Versión resumida:

```yaml
name: calidad
on: [push, pull_request]
jobs:
  verificar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - name: Secretos (gitleaks CLI, MIT; la acción gitleaks-action exige licencia en organizaciones)
        run: |
          curl -sSfL https://github.com/gitleaks/gitleaks/releases/download/v8.30.1/gitleaks_8.30.1_linux_x64.tar.gz | tar -xz gitleaks
          ./gitleaks git --redact --exit-code 1 .
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm audit --audit-level=critical
      - uses: semgrep/semgrep-action@v1
        with: { config: "p/owasp-top-ten p/typescript p/secrets" }
```

## Pruebas: qué se prueba como mínimo

- **Servicios** (lógica de negocio): pruebas unitarias con los repositorios simulados.
- **Controladores**: pruebas e2e de los endpoints críticos (autenticación, creación, permisos: que un usuario no vea datos de otro).
- **Migraciones**: que `prisma migrate deploy` funcione sobre una base vacía en CI.
- **Frontend**: los flujos principales con Playwright (inicio de sesión, formulario principal).

## Revisión de código

La persona que revisa verifica, además de la lógica: validación de entradas, autorización en cada endpoint, ausencia de
secretos, manejo de errores, consultas eficientes (sin N+1) y que la interfaz use los componentes `gob-*`.
