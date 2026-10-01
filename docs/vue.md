# Vue / Nuxt

CSS directo, Vuetify 3 o PrimeVue.

## CSS global

`src/main.js`

```js
import './assets/magdalena.min.css';   // copiado de dist/css/
```

## Vuetify 3

`src/plugins/vuetify.js`

```js
import 'vuetify/styles';
import vuetify from './magdalena-vuetify.mjs';    // dist/vuetify/ (incluye magdalena-tokens.mjs)
app.use(vuetify);
```

## Nuxt

`nuxt.config.ts`

```ts
export default defineNuxtConfig({
  css: ['~/assets/css/magdalena.min.css'],
  app: { head: { link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800;900&display=swap' }] } },
});
```
