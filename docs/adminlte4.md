# AdminLTE 4 (Bootstrap 5)

Reemplaza el azul de Bootstrap por la marca: sidebar azul-noche, cabecera de cristal, tarjetas blancas con filete, indicadores (small-box) limpios con acento de color.

## 1. Cargar los CSS en este orden

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@4.9.1/dist/css/adminlte.min.css">
<!-- Marca Magdalena: SIEMPRE después de AdminLTE -->
<link rel="stylesheet" href="https://TU-HOST/manual_de_marca/dist/adminlte/magdalena-adminlte4.min.css">
```

## 2. Marcado recomendado

```html
<aside class="app-sidebar shadow" data-bs-theme="dark">
  <div class="sidebar-brand">
    <a href="/" class="brand-link"><img src="https://TU-HOST/manual_de_marca/assets/logos/svg/logo-horizontal-blanco.svg" height="34" alt="Gobernación del Magdalena"></a>
  </div>
  ...
</aside>

<div class="small-box text-bg-primary">...</div>   <!-- blanca con filete azul -->
<div class="small-box text-bg-info">...</div>      <!-- blanca con filete cian -->
<div class="card card-primary card-outline">...</div>
```

> Con npm: `npm i admin-lte@4` y luego importe `magdalena-adminlte4.css` después del CSS de AdminLTE.
