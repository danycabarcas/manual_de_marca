# WordPress

Encolar el CSS y declarar la paleta en theme.json para que aparezca en el editor de bloques.

## functions.php

`functions.php`

```php
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('magdalena', get_template_directory_uri() . '/brand/css/magdalena.min.css', [], '1.0.0');
});
```

## theme.json (paleta en el editor)

`theme.json`

```json
{
  "version": 3,
  "settings": { "color": { "palette": [
    { "slug": "primario", "color": "#0071BB", "name": "Azul institucional" },
    { "slug": "cian",     "color": "#00B7D9", "name": "Cian" },
    { "slug": "celeste",  "color": "#9FD7E5", "name": "Celeste" },
    { "slug": "rojo",     "color": "#F7003C", "name": "Rojo" },
    { "slug": "amarillo", "color": "#FEC800", "name": "Amarillo" },
    { "slug": "verde",    "color": "#69B75E", "name": "Verde" }
  ] } }
}
```
