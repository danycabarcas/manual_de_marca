# HTML / CSS puro

Funciona en cualquier stack (PHP, Java, .NET, Django, Rails, estáticos…). Un solo archivo CSS con tokens, degradados, la línea y componentes.

## 1. Enlazar el CSS (una sola URL)

`index.html`

```html
<!-- Todo en uno: tokens + degradados + la línea + componentes (incluye la tipografía Montserrat) -->
<link rel="stylesheet" href="https://TU-HOST/manual_de_marca/dist/css/magdalena.min.css">

<!-- Solo variables CSS (si usted ya tiene sus propios componentes) -->
<link rel="stylesheet" href="https://TU-HOST/manual_de_marca/dist/css/magdalena-tokens.min.css">
```

## 2. Activar estilos base y usar clases mg-*

```html
<body class="mg-base">
  <header class="mg-navbar">           <!-- navbar con la línea de colores abajo -->
    <a class="mg-navbar__brand" href="/"><img src="https://TU-HOST/manual_de_marca/assets/logos/svg/logo-horizontal-color.svg" alt="Gobernación del Magdalena"></a>
  </header>

  <section class="mg-hero">            <!-- degradado azul → cian → celeste -->
    <h1>Servicios digitales</h1>
    <a class="mg-btn mg-btn--accent" href="#">Ingresar</a>
  </section>

  <div class="mg-card mg-card--stripe-top"><div class="mg-card__body">Tarjeta con la línea</div></div>
  <hr class="mg-stripe">               <!-- La línea multicolor del logotipo -->
</body>
```

## 3. Usar las variables en su propio CSS

`app.css`

```css
.mi-banner {
  background: var(--mg-gradient-sky);       /* degradado de la gama azul */
  color: #fff;
  border-radius: var(--mg-radius-lg);
  box-shadow: var(--mg-shadow-md);
}
.mi-boton { background: var(--mg-gradient-action); }
.mi-titulo { color: var(--mg-primary-700); }   /* escalas 50…950 de cada color */
.mi-linea  { height: 6px; background: var(--mg-gradient-stripe); }
```

> Para no depender de internet (intranet), descargue `dist/` y sirva los archivos desde su propio servidor; la tipografía Montserrat se puede alojar localmente (ver README).
