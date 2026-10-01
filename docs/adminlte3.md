# AdminLTE 3 (Bootstrap 4)

Para proyectos AdminLTE 3.x (incluye los paquetes Laravel/PHP basados en AdminLTE 3, como jeroennoten/laravel-adminlte).

## 1. Cargar los CSS en este orden

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@3.2.0/dist/css/adminlte.min.css">
<link rel="stylesheet" href="https://TU-HOST/manual_de_marca/dist/adminlte/magdalena-adminlte3.min.css">
```

## 2. Clases AdminLTE que quedan con la marca

```html
<aside class="main-sidebar sidebar-dark-primary elevation-4">...</aside>   <!-- azul-noche oscuro -->
<nav class="main-header navbar navbar-expand navbar-white navbar-light">...</nav> <!-- cristal claro -->
<div class="card card-primary">...</div>
<div class="small-box bg-info">...</div>
<button class="btn btn-primary">Guardar</button>
```

> AdminLTE 3 usa Bootstrap 4, que NO tiene variables CSS: por eso este archivo sobrescribe clases (`.btn-primary`, `.bg-primary`, etc.).
