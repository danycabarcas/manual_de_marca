# Angular (general)

Sin librería de componentes: tokens + utilidades en `styles.scss`, o por URL en `index.html`.

## Opción 1 — por URL (más simple)

`src/index.html`

```html
<link rel="stylesheet" href="https://TU-HOST/manual_de_marca/dist/css/magdalena.min.css">
```

## Opción 2 — dentro del proyecto

`angular.json`

```json
"styles": [
  "src/styles/magdalena.css",      // copiado de dist/css/magdalena.css
  "src/styles.scss"
]
```

## Uso en plantillas

```html
<div class="mg-card mg-card--stripe-top">
  <div class="mg-card__header mg-card__header--gradient">Trámites</div>
  <div class="mg-card__body">...</div>
</div>
<button class="mg-btn" (click)="guardar()">Guardar</button>
```

## Tokens en TypeScript

```ts
import tokens from './magdalena-tokens.json';   // dist/tokens/magdalena-tokens.json  (activar resolveJsonModule)
const azul = tokens.colors.primary.hex;     // "#0071BB"
const degradado = tokens.gradients.sky;     // "linear-gradient(135deg, ...)"
```
