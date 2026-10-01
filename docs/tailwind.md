# Tailwind CSS (v3 y v4)

Colores `mg-*` con escala 50–950, alias `primary`, degradados como utilidades `bg-mg-grad-*`, sombras y radios de marca.

## Tailwind v3 — preset

`tailwind.config.js`

```js
module.exports = {
  presets: [require('./magdalena.tailwind.preset.cjs')],   // copie dist/tailwind/magdalena.tailwind.preset.cjs
  content: ['./src/**/*.{html,js,ts,jsx,tsx,vue}'],
};
```

## Tailwind v4 — tema CSS

`app.css`

```css
@import "tailwindcss";
@import "./magdalena.tailwind-v4.css";   /* copie dist/tailwind/magdalena.tailwind-v4.css */
```

## Clases disponibles

```html
<button class="bg-mg-grad-action text-white font-bold px-6 py-3 rounded-full shadow-mg-md">Ingresar</button>
<div class="bg-mg-grad-sky text-white rounded-mg-lg p-8">Hero con degradado</div>
<div class="h-1.5 bg-mg-grad-stripe"></div>          <!-- la línea multicolor -->
<h1 class="text-mg-primary-700 font-display font-black">Título</h1>
<span class="bg-mg-cyan-100 text-mg-cyan-800 rounded-full px-3">Etiqueta</span>
<p class="mg-text-gradient text-5xl font-black">Texto con degradado</p>
```

> Opcional: use también `magdalena.min.css` para tener componentes `mg-card`, `mg-btn`, etc. junto a Tailwind.
