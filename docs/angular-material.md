# Angular Material

Tema Material 3 (v19+) y Material 2 (v15–18) con las paletas oficiales, probado compilando contra la librería real.

## 1. Copiar el tema

```bash
# copie dist/angular-material/_magdalena-theme.scss  →  src/styles/_magdalena-theme.scss
# copie dist/angular-material/magdalena-material-extras.css  →  src/styles/magdalena-extras.css (opcional)
# copie dist/css/magdalena-tokens.css → src/styles/ (variables --mg-*)
```

## 2. styles.scss — Material 3 (Angular Material 19+)

`src/styles.scss`

```scss
@use '@angular/material' as mat;
@use './styles/magdalena-theme' as mg;

html { @include mg.magdalena-m3(); }          // define --mat-sys-* con la marca
@import './styles/magdalena-tokens.css';        // --mg-* para degradados y la línea
@import './styles/magdalena-extras.css';        // opcional

body { font-family: var(--mg-font-sans); margin: 0; }
```

## 2b. styles.scss — Material 2 (Angular Material 15–18)

`src/styles.scss`

```scss
@use '@angular/material' as mat;
@use './styles/magdalena-theme' as mg;

@include mat.core();
@include mg.magdalena-m2();
```

## 3. index.html — fuente

`src/index.html`

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
```

## 4. Usar degradados y la línea con componentes Material

```html
<mat-toolbar color="primary" class="mg-toolbar-gradient mg-toolbar-stripe">Gobernación del Magdalena</mat-toolbar>
<button mat-flat-button class="mg-btn-gradient">Guardar</button>
<mat-card class="mg-card-stripe">...</mat-card>
<mat-sidenav class="mg-sidenav-deep">...</mat-sidenav>
```

> Los logos van en `src/assets/` (o `public/` en Angular 18+): copie `assets/logos/svg/*`.
