# Laravel (Blade, Vite, Livewire)

Copie los archivos a `public/brand` o impórtelos con Vite. Compatible con Breeze/Jetstream (Tailwind) y con AdminLTE.

## A. Archivos estáticos en public/

```bash
mkdir -p public/brand
cp -r dist/css assets/logos public/brand/
```

`resources/views/layouts/app.blade.php`

```blade
<link rel="stylesheet" href="{{ asset('brand/css/magdalena.min.css') }}">
<body class="mg-base">
  <img src="{{ asset('brand/logos/svg/logo-horizontal-color.svg') }}" alt="Gobernación del Magdalena" height="48">
  <hr class="mg-stripe">
```

## B. Vite (resources/css/app.css)

`resources/css/app.css`

```css
@import "./magdalena.css";          /* copiado de dist/css/magdalena.css */
/* Con Tailwind v4 (Laravel 12): */
@import "tailwindcss";
@import "./magdalena.tailwind-v4.css";
```

## C. Tailwind v3 (Breeze clásico)

`tailwind.config.js`

```js
presets: [require('./magdalena.tailwind.preset.cjs')],
```

## D. AdminLTE 3 (jeroennoten/laravel-adminlte)

`resources/views/page.blade.php`

```blade
@push('css')
  <link rel="stylesheet" href="{{ asset('brand/adminlte/magdalena-adminlte3.min.css') }}">
@endpush
```
