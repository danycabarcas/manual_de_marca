# Guías de integración

Reemplace `https://TU-HOST/manual_de_marca` por la URL donde publique este repositorio.

- [HTML / CSS puro](html.md) — Funciona en cualquier stack (PHP, Java, .NET, Django, Rails, estáticos…). Un solo archivo CSS con tokens, degradados, la línea y componentes.
- [AdminLTE 4 (Bootstrap 5)](adminlte4.md) — Reemplaza el azul de Bootstrap por la marca, sidebar con degradado, línea multicolor en cabecera/pie, small-boxes con degradados.
- [AdminLTE 3 (Bootstrap 4)](adminlte3.md) — Para proyectos AdminLTE 3.x (incluye los paquetes Laravel/PHP basados en AdminLTE 3, como jeroennoten/laravel-adminlte).
- [Bootstrap 5 y 4](bootstrap.md) — Dos caminos: CSS precompilado (rápido) o Sass (recomendado si compilan Bootstrap).
- [Tailwind CSS (v3 y v4)](tailwind.md) — Colores `mg-*` con escala 50–950, alias `primary`, degradados como utilidades `bg-mg-grad-*`, sombras y radios de marca.
- [Angular Material](angular-material.md) — Tema Material 3 (v19+) y Material 2 (v15–18) con las paletas oficiales, probado compilando contra la librería real.
- [PrimeNG / PrimeVue](primeng.md) — Preset de tema para PrimeNG 18+ y PrimeVue 4 (mismo preset). Incluye variante CSS pura y compatibilidad con PrimeNG ≤ 17.
- [Angular (general)](angular.md) — Sin librería de componentes: tokens + utilidades en `styles.scss`, o por URL en `index.html`.
- [React / Next.js](react.md) — CSS directo, MUI o Tailwind. Los tokens están disponibles como JSON/ESM tipado.
- [Vue / Nuxt](vue.md) — CSS directo, Vuetify 3 o PrimeVue.
- [Laravel (Blade, Vite, Livewire)](laravel.md) — Copie los archivos a `public/brand` o impórtelos con Vite. Compatible con Breeze/Jetstream (Tailwind) y con AdminLTE.
- [Node.js / Express / bundlers](node.md) — Servir los estáticos, importar en Vite/Webpack, o consumir los tokens como módulo.
- [Java (Spring, Thymeleaf, JSF/PrimeFaces, Vaadin)](java.md) — Los CSS son estáticos: no dependen de la tecnología de servidor.
- [WordPress](wordpress.md) — Encolar el CSS y declarar la paleta en theme.json para que aparezca en el editor de bloques.
- [Móvil (Android / Flutter / iOS)](movil.md) — Archivos de colores listos para pegar en el proyecto.
