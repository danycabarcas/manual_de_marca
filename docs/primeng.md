# PrimeNG / PrimeVue

Preset de tema para PrimeNG 18–21 y PrimeVue 4 (mismo preset; colores de severidad de la marca). ⚠ PrimeNG 22 y PrimeVue 5 usan la PrimeUI License (comercial): fije versiones MIT. Incluye variante CSS pura y compatibilidad con PrimeNG ≤ 17.

## 1. PrimeNG 20+ (Angular) — app.config.ts

`src/app/app.config.ts`

```ts
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { MagdalenaPreset } from './magdalena-preset';   // copie dist/primeng/magdalena-preset.ts

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: MagdalenaPreset, options: { darkModeSelector: false } } }),
  ],
};
```

## 1b. PrimeNG 18/19

```bash
npm i @primeng/themes
# en magdalena-preset.ts cambie los imports a '@primeng/themes' y '@primeng/themes/aura' (hay un comentario en el archivo)
```

## 2. PrimeVue 4

`main.js`

```js
import PrimeVue from 'primevue/config';
import { MagdalenaPreset } from './magdalena-preset.mjs';

app.use(PrimeVue, { theme: { preset: MagdalenaPreset, options: { darkModeSelector: false } } });
```

## 3. Degradados y la línea (CSS opcional)

`src/styles.scss`

```scss
@import './styles/magdalena-tokens.css';
@import './styles/magdalena-primeng.css';   // botones con degradado, tabla con cabecera de marca, menubar con la línea
```

## PrimeNG ≤ 17 (temas CSS clásicos)

```html
<!-- cargue su tema (p. ej. lara-light-blue) y luego: -->
<link rel="stylesheet" href="https://TU-HOST/manual_de_marca/dist/primeng/magdalena-primeng.min.css">   <!-- pisa --primary-color y agrega degradados -->
```
