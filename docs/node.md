# Node.js / Express / bundlers

Servir los estáticos, importar en Vite/Webpack, o consumir los tokens como módulo.

## Express

`server.js`

```js
import express from 'express';
const app = express();
app.use('/brand', express.static('manual_de_marca'));   // /brand/dist/css/magdalena.min.css
app.listen(3000);
```

## Vite / Webpack / esbuild

`src/main.js`

```js
import './styles/magdalena.min.css';
import tokens from './magdalena-tokens.mjs';
console.log(tokens.colors.primary.hex);
```

## Handlebars / EJS / Pug

```html
<link rel="stylesheet" href="/brand/dist/css/magdalena.min.css">
```

## Sass / Less

```scss
@use 'magdalena-tokens' as *;   // dist/scss/_magdalena-tokens.scss
.hero { background: $mg-gradient-sky; @include mg-stripe(6px); }
// Less: @import "magdalena-tokens.less";  .x { color: @mg-primary-700; }
```
