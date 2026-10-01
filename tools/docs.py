"""Guías de integración por tecnología. Fuente única: genera docs/*.md y alimenta integracion.html.
Placeholders:  __BASE__ = URL base donde se publique este repo (el portal lo reemplaza solo)."""
import os, html

BASE_MD = 'https://TU-HOST/manual_de_marca'

# Cada guía: id, título, grupo, resumen, pasos [(título, [(lenguaje, nombre_archivo|None, código)], nota?)]
G = []


def add(id, title, group, summary, steps, notes=None):
    G.append(dict(id=id, title=title, group=group, summary=summary, steps=steps, notes=notes or []))


add('html', 'HTML / CSS puro', 'Base',
    'Funciona en cualquier stack (PHP, Java, .NET, Django, Rails, estáticos…). Un solo archivo CSS con tokens, degradados, la línea y componentes.',
    [('1. Enlazar el CSS (una sola URL)', [('html', 'index.html', '''<!-- Todo en uno: tokens + degradados + la línea + componentes (incluye la tipografía Montserrat) -->
<link rel="stylesheet" href="__BASE__/dist/css/magdalena.min.css">

<!-- Solo variables CSS (si usted ya tiene sus propios componentes) -->
<link rel="stylesheet" href="__BASE__/dist/css/magdalena-tokens.min.css">''')]),
     ('2. Activar estilos base y usar clases mg-*', [('html', None, '''<body class="mg-base">
  <header class="mg-navbar">           <!-- navbar con la línea de colores abajo -->
    <a class="mg-navbar__brand" href="/"><img src="__BASE__/assets/logos/svg/logo-horizontal-color.svg" alt="Gobernación del Magdalena"></a>
  </header>

  <section class="mg-hero">            <!-- degradado azul → cian → celeste -->
    <h1>Servicios digitales</h1>
    <a class="mg-btn mg-btn--accent" href="#">Ingresar</a>
  </section>

  <div class="mg-card mg-card--stripe-top"><div class="mg-card__body">Tarjeta con la línea</div></div>
  <hr class="mg-stripe">               <!-- La línea multicolor del logotipo -->
</body>''')]),
     ('3. Usar las variables en su propio CSS', [('css', 'app.css', '''.mi-banner {
  background: var(--mg-gradient-sky);       /* degradado de la gama azul */
  color: #fff;
  border-radius: var(--mg-radius-lg);
  box-shadow: var(--mg-shadow-md);
}
.mi-boton { background: var(--mg-gradient-action); }
.mi-titulo { color: var(--mg-primary-700); }   /* escalas 50…950 de cada color */
.mi-linea  { height: 6px; background: var(--mg-gradient-stripe); }''')])],
    ['Para no depender de internet (intranet), descargue `dist/` y sirva los archivos desde su propio servidor; la tipografía Montserrat se puede alojar localmente (ver README).'])

add('adminlte4', 'AdminLTE 4 (Bootstrap 5)', 'Plantillas admin',
    'Reemplaza el azul de Bootstrap por la marca, sidebar con degradado, línea multicolor en cabecera/pie, small-boxes con degradados.',
    [('1. Cargar los CSS en este orden', [('html', None, '''<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@4.9.1/dist/css/adminlte.min.css">
<!-- Marca Magdalena: SIEMPRE después de AdminLTE -->
<link rel="stylesheet" href="__BASE__/dist/adminlte/magdalena-adminlte4.min.css">''')]),
     ('2. Marcado recomendado', [('html', None, '''<aside class="app-sidebar shadow" data-bs-theme="dark">
  <div class="sidebar-brand">
    <a href="/" class="brand-link"><img src="__BASE__/assets/logos/svg/logo-horizontal-blanco.svg" height="34" alt="Gobernación del Magdalena"></a>
  </div>
  ...
</aside>

<div class="small-box text-bg-primary">...</div>   <!-- degradado azul -->
<div class="small-box text-bg-info">...</div>      <!-- degradado cian → celeste -->
<div class="card card-primary card-outline">...</div>''')])],
    ['Con npm: `npm i admin-lte@4` y luego importe `magdalena-adminlte4.css` después del CSS de AdminLTE.'])

add('adminlte3', 'AdminLTE 3 (Bootstrap 4)', 'Plantillas admin',
    'Para proyectos AdminLTE 3.x (incluye los paquetes Laravel/PHP basados en AdminLTE 3, como jeroennoten/laravel-adminlte).',
    [('1. Cargar los CSS en este orden', [('html', None, '''<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@3.2.0/dist/css/adminlte.min.css">
<link rel="stylesheet" href="__BASE__/dist/adminlte/magdalena-adminlte3.min.css">''')]),
     ('2. Clases AdminLTE que quedan con la marca', [('html', None, '''<aside class="main-sidebar sidebar-dark-primary elevation-4">...</aside>   <!-- degradado azul profundo -->
<nav class="main-header navbar navbar-expand navbar-white navbar-light">...</nav> <!-- línea multicolor abajo -->
<div class="card card-primary">...</div>
<div class="small-box bg-info">...</div>
<button class="btn btn-primary">Guardar</button>''')])],
    ['AdminLTE 3 usa Bootstrap 4, que NO tiene variables CSS: por eso este archivo sobrescribe clases (`.btn-primary`, `.bg-primary`, etc.).'])

add('bootstrap', 'Bootstrap 5 y 4', 'Frameworks CSS',
    'Dos caminos: CSS precompilado (rápido) o Sass (recomendado si compilan Bootstrap).',
    [('A. CSS precompilado (Bootstrap 5.3)', [('html', None, '''<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="__BASE__/dist/bootstrap/magdalena-bootstrap5.min.css" rel="stylesheet">''')]),
     ('B. Bootstrap 4', [('html', None, '''<link href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="__BASE__/dist/bootstrap/magdalena-bootstrap4.min.css" rel="stylesheet">''')]),
     ('C. Sass (Bootstrap 5): variables antes de importar', [('scss', 'custom.scss', '''// copie dist/scss/_magdalena-tokens.scss y dist/bootstrap/_magdalena-bootstrap-variables.scss
@import "magdalena-bootstrap-variables";   // define $primary, $info, fuentes, radios…
@import "bootstrap/scss/bootstrap";

.btn-primary { background-image: $mg-gradient-action; }''')])])

add('tailwind', 'Tailwind CSS (v3 y v4)', 'Frameworks CSS',
    'Colores `mg-*` con escala 50–950, alias `primary`, degradados como utilidades `bg-mg-grad-*`, sombras y radios de marca.',
    [('Tailwind v3 — preset', [('js', 'tailwind.config.js', '''module.exports = {
  presets: [require('./magdalena.tailwind.preset.cjs')],   // copie dist/tailwind/magdalena.tailwind.preset.cjs
  content: ['./src/**/*.{html,js,ts,jsx,tsx,vue}'],
};''')]),
     ('Tailwind v4 — tema CSS', [('css', 'app.css', '''@import "tailwindcss";
@import "./magdalena.tailwind-v4.css";   /* copie dist/tailwind/magdalena.tailwind-v4.css */''')]),
     ('Clases disponibles', [('html', None, '''<button class="bg-mg-grad-action text-white font-bold px-6 py-3 rounded-full shadow-mg-md">Ingresar</button>
<div class="bg-mg-grad-sky text-white rounded-mg-lg p-8">Hero con degradado</div>
<div class="h-1.5 bg-mg-grad-stripe"></div>          <!-- la línea multicolor -->
<h1 class="text-mg-primary-700 font-display font-black">Título</h1>
<span class="bg-mg-cyan-100 text-mg-cyan-800 rounded-full px-3">Etiqueta</span>
<p class="mg-text-gradient text-5xl font-black">Texto con degradado</p>''')])],
    ['Opcional: use también `magdalena.min.css` para tener componentes `mg-card`, `mg-btn`, etc. junto a Tailwind.'])

add('angular-material', 'Angular Material', 'Angular',
    'Tema Material 3 (v19+) y Material 2 (v15–18) con las paletas oficiales, probado compilando contra la librería real.',
    [('1. Copiar el tema', [('bash', None, '''# copie dist/angular-material/_magdalena-theme.scss  →  src/styles/_magdalena-theme.scss
# copie dist/angular-material/magdalena-material-extras.css  →  src/styles/magdalena-extras.css (opcional)
# copie dist/css/magdalena-tokens.css → src/styles/ (variables --mg-*)''')]),
     ('2. styles.scss — Material 3 (Angular Material 19+)', [('scss', 'src/styles.scss', '''@use '@angular/material' as mat;
@use './styles/magdalena-theme' as mg;

html { @include mg.magdalena-m3(); }          // define --mat-sys-* con la marca
@import './styles/magdalena-tokens.css';        // --mg-* para degradados y la línea
@import './styles/magdalena-extras.css';        // opcional

body { font-family: var(--mg-font-sans); margin: 0; }''')]),
     ('2b. styles.scss — Material 2 (Angular Material 15–18)', [('scss', 'src/styles.scss', '''@use '@angular/material' as mat;
@use './styles/magdalena-theme' as mg;

@include mat.core();
@include mg.magdalena-m2();''')]),
     ('3. index.html — fuente', [('html', 'src/index.html', '''<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">''')]),
     ('4. Usar degradados y la línea con componentes Material', [('html', None, '''<mat-toolbar color="primary" class="mg-toolbar-gradient mg-toolbar-stripe">Gobernación del Magdalena</mat-toolbar>
<button mat-flat-button class="mg-btn-gradient">Guardar</button>
<mat-card class="mg-card-stripe">...</mat-card>
<mat-sidenav class="mg-sidenav-deep">...</mat-sidenav>''')])],
    ['Los logos van en `src/assets/` (o `public/` en Angular 18+): copie `assets/logos/svg/*`.'])

add('primeng', 'PrimeNG / PrimeVue', 'Angular',
    'Preset de tema para PrimeNG 18+ y PrimeVue 4 (mismo preset). Incluye variante CSS pura y compatibilidad con PrimeNG ≤ 17.',
    [('1. PrimeNG 20+ (Angular) — app.config.ts', [('ts', 'src/app/app.config.ts', '''import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { MagdalenaPreset } from './magdalena-preset';   // copie dist/primeng/magdalena-preset.ts

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: MagdalenaPreset, options: { darkModeSelector: false } } }),
  ],
};''')]),
     ('1b. PrimeNG 18/19', [('bash', None, '''npm i @primeng/themes
# en magdalena-preset.ts cambie los imports a '@primeng/themes' y '@primeng/themes/aura' (hay un comentario en el archivo)''')]),
     ('2. PrimeVue 4', [('js', 'main.js', '''import PrimeVue from 'primevue/config';
import { MagdalenaPreset } from './magdalena-preset.mjs';

app.use(PrimeVue, { theme: { preset: MagdalenaPreset, options: { darkModeSelector: false } } });''')]),
     ('3. Degradados y la línea (CSS opcional)', [('scss', 'src/styles.scss', '''@import './styles/magdalena-tokens.css';
@import './styles/magdalena-primeng.css';   // botones con degradado, tabla con cabecera de marca, menubar con la línea''')]),
     ('PrimeNG ≤ 17 (temas CSS clásicos)', [('html', None, '''<!-- cargue su tema (p. ej. lara-light-blue) y luego: -->
<link rel="stylesheet" href="__BASE__/dist/primeng/magdalena-primeng.min.css">   <!-- pisa --primary-color y agrega degradados -->''')])])

add('angular', 'Angular (general)', 'Angular',
    'Sin librería de componentes: tokens + utilidades en `styles.scss`, o por URL en `index.html`.',
    [('Opción 1 — por URL (más simple)', [('html', 'src/index.html', '<link rel="stylesheet" href="__BASE__/dist/css/magdalena.min.css">')]),
     ('Opción 2 — dentro del proyecto', [('json', 'angular.json', '''"styles": [
  "src/styles/magdalena.css",      // copiado de dist/css/magdalena.css
  "src/styles.scss"
]''')]),
     ('Uso en plantillas', [('html', None, '''<div class="mg-card mg-card--stripe-top">
  <div class="mg-card__header mg-card__header--gradient">Trámites</div>
  <div class="mg-card__body">...</div>
</div>
<button class="mg-btn" (click)="guardar()">Guardar</button>''')]),
     ('Tokens en TypeScript', [('ts', None, '''import tokens from './magdalena-tokens.json';   // dist/tokens/magdalena-tokens.json  (activar resolveJsonModule)
const azul = tokens.colors.primary.hex;     // "#0071BB"
const degradado = tokens.gradients.sky;     // "linear-gradient(135deg, ...)"''')])])

add('react', 'React / Next.js', 'JavaScript',
    'CSS directo, MUI o Tailwind. Los tokens están disponibles como JSON/ESM tipado.',
    [('CSS global', [('jsx', 'src/main.jsx', '''import './styles/magdalena.min.css';     // copiado de dist/css/

export default function Hero() {
  return <section className="mg-hero"><h1>Bienvenido</h1><button className="mg-btn mg-btn--accent">Ingresar</button></section>;
}''')]),
     ('Material UI (MUI)', [('jsx', 'src/theme.jsx', '''import { ThemeProvider, CssBaseline } from '@mui/material';
import magdalenaTheme from './magdalena-mui-theme.mjs';   // dist/mui/ (incluye magdalena-tokens.mjs)

<ThemeProvider theme={magdalenaTheme}><CssBaseline /><App /></ThemeProvider>''')]),
     ('Next.js (app router)', [('tsx', 'app/layout.tsx', '''import '../styles/magdalena.min.css';
export default function RootLayout({ children }) { return <html lang="es"><body className="mg-base">{children}</body></html>; }''')])])

add('vue', 'Vue / Nuxt', 'JavaScript',
    'CSS directo, Vuetify 3 o PrimeVue.',
    [('CSS global', [('js', 'src/main.js', "import './assets/magdalena.min.css';   // copiado de dist/css/")]),
     ('Vuetify 3', [('js', 'src/plugins/vuetify.js', '''import 'vuetify/styles';
import vuetify from './magdalena-vuetify.mjs';    // dist/vuetify/ (incluye magdalena-tokens.mjs)
app.use(vuetify);''')]),
     ('Nuxt', [('ts', 'nuxt.config.ts', '''export default defineNuxtConfig({
  css: ['~/assets/css/magdalena.min.css'],
  app: { head: { link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800;900&display=swap' }] } },
});''')])])

add('laravel', 'Laravel (Blade, Vite, Livewire)', 'PHP',
    'Copie los archivos a `public/brand` o impórtelos con Vite. Compatible con Breeze/Jetstream (Tailwind) y con AdminLTE.',
    [('A. Archivos estáticos en public/', [('bash', None, '''mkdir -p public/brand
cp -r dist/css assets/logos public/brand/'''), ('blade', 'resources/views/layouts/app.blade.php', '''<link rel="stylesheet" href="{{ asset('brand/css/magdalena.min.css') }}">
<body class="mg-base">
  <img src="{{ asset('brand/logos/svg/logo-horizontal-color.svg') }}" alt="Gobernación del Magdalena" height="48">
  <hr class="mg-stripe">''')]),
     ('B. Vite (resources/css/app.css)', [('css', 'resources/css/app.css', '''@import "./magdalena.css";          /* copiado de dist/css/magdalena.css */
/* Con Tailwind v4 (Laravel 12): */
@import "tailwindcss";
@import "./magdalena.tailwind-v4.css";''')]),
     ('C. Tailwind v3 (Breeze clásico)', [('js', 'tailwind.config.js', "presets: [require('./magdalena.tailwind.preset.cjs')],")]),
     ('D. AdminLTE 3 (jeroennoten/laravel-adminlte)', [('blade', 'resources/views/page.blade.php', '''@push('css')
  <link rel="stylesheet" href="{{ asset('brand/adminlte/magdalena-adminlte3.min.css') }}">
@endpush''')])])

add('node', 'Node.js / Express / bundlers', 'JavaScript',
    'Servir los estáticos, importar en Vite/Webpack, o consumir los tokens como módulo.',
    [('Express', [('js', 'server.js', '''import express from 'express';
const app = express();
app.use('/brand', express.static('manual_de_marca'));   // /brand/dist/css/magdalena.min.css
app.listen(3000);''')]),
     ('Vite / Webpack / esbuild', [('js', 'src/main.js', '''import './styles/magdalena.min.css';
import tokens from './magdalena-tokens.mjs';
console.log(tokens.colors.primary.hex);''')]),
     ('Handlebars / EJS / Pug', [('html', None, '<link rel="stylesheet" href="/brand/dist/css/magdalena.min.css">')]),
     ('Sass / Less', [('scss', None, '''@use 'magdalena-tokens' as *;   // dist/scss/_magdalena-tokens.scss
.hero { background: $mg-gradient-sky; @include mg-stripe(6px); }
// Less: @import "magdalena-tokens.less";  .x { color: @mg-primary-700; }''')])])

add('java', 'Java (Spring, Thymeleaf, JSF/PrimeFaces, Vaadin)', 'Java / .NET',
    'Los CSS son estáticos: no dependen de la tecnología de servidor.',
    [('Spring Boot + Thymeleaf', [('bash', None, '# copie dist/css y assets/logos a  src/main/resources/static/brand/'),
                                   ('html', 'templates/layout.html', '''<link rel="stylesheet" th:href="@{/brand/css/magdalena.min.css}">
<img th:src="@{/brand/logos/svg/logo-horizontal-color.svg}" alt="Gobernación del Magdalena" height="48">''')]),
     ('JSF / PrimeFaces', [('xml', 'template.xhtml', '''<h:outputStylesheet name="brand/css/magdalena.min.css" />
<!-- PrimeFaces usa variables de tema: sobrescriba el color primario en su theme.css con #0071BB -->''')]),
     ('Vaadin (Lumo)', [('css', 'frontend/themes/mi-app/styles.css', '''@import url('./magdalena-tokens.css');
html {
  --lumo-primary-color: #0071BB;
  --lumo-primary-text-color: #0071BB;
  --lumo-primary-color-50pct: rgba(0, 113, 187, .5);
  --lumo-primary-color-10pct: rgba(0, 113, 187, .1);
  --lumo-primary-contrast-color: #fff;
  --lumo-font-family: 'Montserrat', sans-serif;
}''')]),
     ('ASP.NET / Razor / Blazor', [('html', '_Layout.cshtml', '<link rel="stylesheet" href="~/brand/css/magdalena.min.css" asp-append-version="true" />')])])

add('wordpress', 'WordPress', 'PHP',
    'Encolar el CSS y declarar la paleta en theme.json para que aparezca en el editor de bloques.',
    [('functions.php', [('php', 'functions.php', '''add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('magdalena', get_template_directory_uri() . '/brand/css/magdalena.min.css', [], '1.0.0');
});''')]),
     ('theme.json (paleta en el editor)', [('json', 'theme.json', '''{
  "version": 3,
  "settings": { "color": { "palette": [
    { "slug": "primario", "color": "#0071BB", "name": "Azul institucional" },
    { "slug": "cian",     "color": "#00B7D9", "name": "Cian" },
    { "slug": "celeste",  "color": "#9FD7E5", "name": "Celeste" },
    { "slug": "rojo",     "color": "#F7003C", "name": "Rojo" },
    { "slug": "amarillo", "color": "#FEC800", "name": "Amarillo" },
    { "slug": "verde",    "color": "#69B75E", "name": "Verde" }
  ] } }
}''')])])

add('movil', 'Móvil (Android / Flutter / iOS)', 'Móvil',
    'Archivos de colores listos para pegar en el proyecto.',
    [('Android (res/values/colors.xml)', [('bash', None, 'cp dist/tokens/android-colors.xml app/src/main/res/values/magdalena_colors.xml')]),
     ('Flutter', [('dart', None, '''// copie dist/tokens/flutter_magdalena_colors.dart a lib/theme/
import 'theme/flutter_magdalena_colors.dart';
ThemeData(colorScheme: ColorScheme.fromSeed(seedColor: MagdalenaColors.primary), fontFamily: 'Montserrat');''')]),
     ('iOS / otros', [('bash', None, '# use dist/tokens/magdalena-tokens.json (hex, rgb, cmyk) para generar su asset catalog')])])


# ------------------------------------------------------------------ salida Markdown
def md(g):
    out = [f'# {g["title"]}', '', g['summary'], '']
    for title, blocks in [(s[0], s[1]) for s in g['steps']]:
        out += [f'## {title}', '']
        for lang, fname, code in blocks:
            if fname:
                out.append(f'`{fname}`')
                out.append('')
            out += [f'```{lang}', code.replace('__BASE__', BASE_MD), '```', '']
    if g['notes']:
        out += ['> ' + n for n in g['notes']] + ['']
    return '\n'.join(out)


def build(root, dist):
    d = os.path.join(root, 'docs')
    os.makedirs(d, exist_ok=True)
    idx = ['# Guías de integración', '', 'Reemplace `https://TU-HOST/manual_de_marca` por la URL donde publique este repositorio.', '']
    for g in G:
        with open(os.path.join(d, g['id'] + '.md'), 'w', encoding='utf-8', newline='\n') as f:
            f.write(md(g))
        idx.append(f'- [{g["title"]}]({g["id"]}.md) — {g["summary"]}')
    with open(os.path.join(d, 'README.md'), 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(idx) + '\n')
    try:
        import site_build
        site_build.build(root, dist, G)
    except ImportError:
        print('site_build.py aún no existe')
