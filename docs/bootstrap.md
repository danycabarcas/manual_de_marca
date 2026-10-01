# Bootstrap 5 y 4

Dos caminos: CSS precompilado (rápido) o Sass (recomendado si compilan Bootstrap).

## A. CSS precompilado (Bootstrap 5.3)

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://TU-HOST/manual_de_marca/dist/bootstrap/magdalena-bootstrap5.min.css" rel="stylesheet">
```

## B. Bootstrap 4

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://TU-HOST/manual_de_marca/dist/bootstrap/magdalena-bootstrap4.min.css" rel="stylesheet">
```

## C. Sass (Bootstrap 5): variables antes de importar

`custom.scss`

```scss
// copie dist/scss/_magdalena-tokens.scss y dist/bootstrap/_magdalena-bootstrap-variables.scss
@import "magdalena-bootstrap-variables";   // define $primary, $info, fuentes, radios…
@import "bootstrap/scss/bootstrap";

.btn-primary { background-image: $mg-gradient-action; }
```
