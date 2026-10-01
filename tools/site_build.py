"""Genera las páginas del portal (index, colores, logos, componentes, integracion, aplicaciones)."""
import os, html, json
from PIL import Image
from tokens import *

E = html.escape
NAV = [('index.html', 'Inicio'), ('colores.html', 'Colores y degradados'), ('logos.html', 'Logos y descargas'),
       ('componentes.html', 'Componentes'), ('integracion.html', 'Integración'), ('aplicaciones.html', 'Aplicaciones'),
       ('demos/index.html', 'Demos')]


def page(root, fname, title, lead, body, hero=False, active=None):
    depth = fname.count('/')
    up = '../' * depth
    cur = ' aria-current="page"'
    nav = ''.join(f'<a href="{up}{h}"{cur if h == (active or fname) else ""}>{t}</a>' for h, t in NAV)
    head = f'''<section class="pt-pagehead"><div class="pt-pagehead__in"><h1>{title}</h1><p>{lead}</p></div></section>''' if not hero else hero
    doc = f'''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(title)} · Manual de marca Gobernación del Magdalena</title>
<meta name="description" content="{E(lead)}">
<link rel="icon" href="{up}assets/favicon/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="{up}assets/favicon/icon-32.png">
<link rel="apple-touch-icon" href="{up}assets/favicon/apple-touch-icon.png">
<link rel="stylesheet" href="{up}dist/css/magdalena.css">
<link rel="stylesheet" href="{up}site/portal.css">
</head>
<body class="mg-base">
<header class="pt-header"><div class="pt-header__in">
  <a class="pt-brand" href="{up}index.html"><img src="{up}assets/logos/svg/logo-horizontal-color.svg" alt="Gobernación del Magdalena"></a>
  <button class="pt-burger" aria-label="Menú">☰</button>
  <nav class="pt-nav" aria-label="Principal">{nav}</nav>
</div></header>
{head}
<main class="pt-main">
{body}
</main>
<footer class="pt-footer"><div class="pt-footer__in">
  <img src="{up}assets/logos/svg/logo-horizontal-blanco.svg" alt="Gobernación del Magdalena">
  <div>Manual de Identidad Visual 2026 · Kit para desarrollo web · v1.0.0<br><span style="opacity:.7">Oficina de Tecnología de la Información · Gobernación del Magdalena</span></div>
  <div><a href="{up}dist/downloads/kit-desarrollo-css-y-temas.zip">⬇ Kit completo (.zip)</a></div>
</div></footer>
<script src="{up}site/portal.js"></script>
</body>
</html>
'''
    path = os.path.join(root, fname)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(doc)


def code(lang, text, fname=None, tpl=False):
    label = E(fname) if fname else lang.upper()
    if tpl:
        inner = f'<pre><code data-tpl="{E(text)}">{E(text.replace("__BASE__", "https://TU-HOST/manual_de_marca"))}</code></pre>'
    else:
        inner = f'<pre><code>{E(text)}</code></pre>'
    return f'<div class="code"><div class="code__bar"><span>{label}</span><button data-codecopy>Copiar</button></div>{inner}</div>'


# =============================================================== COLORES
def page_colors(root):
    cards = ''
    primary = {'primary', 'cyan', 'sky', 'red'}
    for k, (hx, rgb, cmyk, role) in BRAND.items():
        fg = on_color(hx)
        cards += f'''<div class="sw">
  <button class="sw__color" style="background:{hx};color:{fg}" data-copy="{hx}" title="Clic para copiar">{k.capitalize() if k != "primary" else "Azul"}</button>
  <div class="sw__body">
    <span class="sw__tag">{"Primario" if k in primary else "Acento"}</span>
    <span>{E(role)}</span>
    <span><b>HEX</b> <code data-copy="{hx}" style="cursor:pointer">{hx}</code></span>
    <span><b>RGB</b> {rgb[0]} · {rgb[1]} · {rgb[2]}</span>
    <span><b>CMYK</b> {cmyk[0]} · {cmyk[1]} · {cmyk[2]} · {cmyk[3]}</span>
    <span><b>CSS</b> <code>var(--mg-{k})</code></span>
    <span><b>Tailwind</b> <code>bg-mg-{k}</code></span>
  </div></div>'''
    neu = ''
    for k, v in (('Negro de marca (ink)', NEUTRALS['ink']), ('Gris institucional (gray)', NEUTRALS['gray']), ('Gris de fondo (surface)', NEUTRALS['surface'])):
        kk = k.split('(')[1][:-1]
        neu += f'''<div class="sw"><button class="sw__color" style="background:{v};color:{on_color(v)}" data-copy="{v}">{k.split(" (")[0]}</button><div class="sw__body"><span><b>HEX</b> <code>{v}</code></span><span><b>CSS</b> <code>var(--mg-{kk})</code></span></div></div>'''

    def grad_card(k, label, usage, dark_text=False):
        g = GRADIENTS[k]
        fg = 'var(--mg-ink)' if dark_text else '#fff'
        return f'''<div class="grad"><div class="grad__bar" style="background:var(--mg-gradient-{k});color:{fg}">{label}</div>
<div class="grad__body"><span>{usage}</span>
<span>Variable: <code data-copy="var(--mg-gradient-{k})" style="cursor:pointer">var(--mg-gradient-{k})</code></span>
<span>Clase: <code>mg-bg-{k}</code> · Tailwind: <code>bg-mg-grad-{k}</code></span>
<span><code data-copy="{E(g)}" style="cursor:pointer">{E(g)}</code></span></div></div>'''

    blue = ''.join([
        grad_card('primary', 'primary', 'La línea de la marca: azul → cian a 135°. Heros, tarjetas, cabeceras, KPIs.'),
        grad_card('sky', 'sky', 'Gama completa de los tres azules (azul → cian → celeste). Banners y portadas.'),
        grad_card('aqua', 'aqua', 'Cian → celeste. Zonas claras, tarjetas secundarias (texto oscuro).', True),
        grad_card('mist', 'mist', 'Celeste muy suave. Fondos de sección y de formularios.', True),
        grad_card('deep', 'deep', 'Azul profundo derivado del primario. Sidebars y pies de página.'),
        grad_card('action', 'action', f'Botones con texto blanco: se corta en {ACTION_END} para mantener contraste ≥ 3:1 (usar texto en negrita).'),
        grad_card('primary-h', 'primary-h', 'Versión horizontal (90°): barras de navegación, cabeceras de tabla, progreso.'),
    ])
    accents = ''.join([
        grad_card('tropical', 'tropical', 'Cian → verde. Estados positivos, turismo y naturaleza.', True),
        grad_card('sun', 'sun', 'Amarillo → ocre. Destacados, fechas, llamadas de atención.', True),
        grad_card('heat', 'heat', 'Rojo → rojo oscuro. Alertas y acciones destructivas.'),
        grad_card('earth', 'earth', 'Ocre. Cultura, patrimonio, etiquetas.'),
        grad_card('violet', 'violet', 'Violeta → azul. Extremos de la franja; uso muy puntual.'),
    ])
    stripe_k = ''.join(f'<span style="flex:1;background:{BRAND[k][0]}"></span>' for k in STRIPE)
    stripe = f'''<div class="demo"><div class="demo__view demo__view--white" style="display:grid;gap:1.25rem">
<div><b>.mg-stripe</b> (6 px)<hr class="mg-stripe"></div>
<div><b>.mg-stripe--thin / --thick / --xl</b><hr class="mg-stripe mg-stripe--thin" style="margin-bottom:8px"><hr class="mg-stripe mg-stripe--thick" style="margin-bottom:8px"><hr class="mg-stripe mg-stripe--xl"></div>
<div><b>.mg-stripe--flow</b> (continua)<hr class="mg-stripe mg-stripe--thick mg-stripe--flow"></div>
<div style="display:flex;gap:1rem;align-items:stretch;height:90px"><div class="mg-stripe mg-stripe--v" style="--mg-stripe-h:14px;height:90px"></div><span style="align-self:center"><b>.mg-stripe--v</b> vertical</span></div>
<div style="display:flex;height:34px;border-radius:6px;overflow:hidden">{stripe_k}</div>
</div>
<details open><summary>Orden oficial de la línea (de izquierda a derecha)</summary><div class="code"><pre>{" → ".join(f"{k} {BRAND[k][0]}" for k in STRIPE)}</pre></div></details></div>'''
    stripe_code = code('html', '''<hr class="mg-stripe">                              <!-- línea suelta -->
<div class="mg-card mg-card--stripe-top">…</div>    <!-- línea como borde superior de una tarjeta -->
<header class="mg-navbar">…</header>               <!-- navbar con la línea abajo -->
<div class="mg-stripe-top" style="--mg-stripe-h:10px">…</div>   <!-- cualquier contenedor -->''')

    scales = '<div class="scale scale--head"><span></span>' + ''.join(f'<span>{s}</span>' for s in STEPS) + '</div>'
    for name in ['primary', 'cyan', 'sky', 'red', 'yellow', 'green', 'olive', 'purple', 'gray']:
        scales += f'<div class="scale"><span>{name}</span>' + ''.join(
            f'<button style="background:{SCALES[name][s]};color:{on_color(SCALES[name][s])}" data-copy="{SCALES[name][s]}" title="--mg-{name}-{s}: {SCALES[name][s]}">{SCALES[name][s][1:]}</button>' for s in STEPS) + '</div>'

    pairs = [('Blanco sobre Azul primario', '#FFFFFF', BRAND['primary'][0], 'Texto en botones y barras azules'),
             ('Negro de marca sobre Cian', NEUTRALS['ink'], BRAND['cyan'][0], 'Cian: usar texto oscuro, no blanco'),
             ('Blanco sobre Cian', '#FFFFFF', BRAND['cyan'][0], 'No usar para texto normal'),
             ('Negro de marca sobre Celeste', NEUTRALS['ink'], BRAND['sky'][0], 'Fondos suaves'),
             ('Blanco sobre Rojo', '#FFFFFF', BRAND['red'][0], 'Solo texto grande/negrita (≥ 18.7 px bold)'),
             ('Negro de marca sobre Amarillo', NEUTRALS['ink'], BRAND['yellow'][0], 'Acentos y avisos'),
             ('Negro de marca sobre Verde', NEUTRALS['ink'], BRAND['green'][0], 'Éxito'),
             ('Blanco sobre Ocre', '#FFFFFF', BRAND['olive'][0], 'Texto grande/negrita'),
             ('Blanco sobre Violeta', '#FFFFFF', BRAND['purple'][0], ''),
             ('Gris institucional sobre Blanco', NEUTRALS['gray'], '#FFFFFF', 'Texto secundario'),
             ('Blanco sobre extremo del degradado «action»', '#FFFFFF', ACTION_END, 'Mínimo 3:1'),
             ('Blanco sobre extremo del degradado «primary» (cian)', '#FFFFFF', BRAND['cyan'][0], 'Solo decorativo / títulos enormes')]
    rows = ''
    for n, fg, bg, note in pairs:
        r = contrast(fg, bg)
        lvl = 'AAA' if r >= 7 else 'AA' if r >= 4.5 else 'AA grande' if r >= 3 else 'No cumple'
        cls = 'green' if r >= 4.5 else 'yellow' if r >= 3 else 'red'
        rows += f'<tr><td><span style="display:inline-block;width:70px;padding:.2rem .4rem;border-radius:6px;background:{bg};color:{fg};font-weight:800;text-align:center">Aa</span></td><td>{n}</td><td><b>{r:.2f}:1</b></td><td><span class="mg-badge mg-badge--{cls}">{lvl}</span></td><td>{note}</td></tr>'

    body = f'''
<section class="pt-section"><h2><span class="n">01.</span> Paleta oficial</h2>
<p class="pt-lead">Los 8 colores de la página «Paleta cromática» del manual. Los cuatro primarios definen la identidad (en la web dominan el <b>azul → cian → celeste</b>); el resto se usa como acento en objetos. Clic en un color para copiar su HEX.</p>
<div class="pt-grid">{cards}</div>
<h3 style="margin-top:2rem">Neutros</h3><div class="pt-grid">{neu}</div></section>

<section class="pt-section"><h2><span class="n">02.</span> Degradados de la línea azul</h2>
<p class="pt-lead">La imagen de marca web se construye con el degradado de la gama azul (0071BB → 00B7D9 → 9FD7E5). Estas variables existen en CSS, SCSS, Less, Tailwind, JSON y en los temas de AdminLTE, Material y PrimeNG.</p>
<div class="pt-grid pt-grid--lg">{blue}</div>
<h3 style="margin-top:2rem">Degradados de acento (objetos)</h3>
<p class="pt-lead">Para ilustraciones, íconos, insignias y elementos secundarios, no para fondos completos de página.</p>
<div class="pt-grid pt-grid--lg">{accents}</div></section>

<section class="pt-section"><h2><span class="n">03.</span> La línea (franja multicolor)</h2>
<p class="pt-lead">La franja de nueve segmentos que acompaña al logotipo en tarjetas, carnets, pendones, backing y vallas. En la web se usa como remate de cabeceras, pies de página, tarjetas y separadores.</p>
{stripe}{stripe_code}</section>

<section class="pt-section"><h2><span class="n">04.</span> Escalas tonales</h2>
<p class="pt-lead">Cada color tiene una escala 50–950 (500 = color oficial) para estados hover/active, fondos suaves, bordes y texto. Clic para copiar.</p>
<div class="tablewrap"><div style="min-width:760px">{scales}</div></div></section>

<section class="pt-section"><h2><span class="n">05.</span> Colores semánticos y accesibilidad</h2>
<p class="pt-lead">Mapeo recomendado de la marca a estados de interfaz y contraste de texto calculado (WCAG 2.1). Regla práctica: <b>texto blanco sobre azul y rojo; texto oscuro sobre cian, celeste, amarillo y verde</b>.</p>
<div class="pt-grid" style="margin-bottom:1.5rem">
''' + ''.join(f'<div class="sw"><button class="sw__color" style="background:{v};color:{on_color(v)};height:70px" data-copy="{v}">{k}</button><div class="sw__body"><span><code>--mg-color-{k}</code> = {v}</span><span>Texto encima: <code>--mg-on-{k}</code></span></div></div>' for k, v in SEMANTIC.items()) + f'''</div>
<div class="tablewrap"><table class="mg-table"><thead><tr><th>Muestra</th><th>Combinación</th><th>Contraste</th><th>Nivel</th><th>Nota</th></tr></thead><tbody>{rows}</tbody></table></div></section>
'''
    page(root, 'colores.html', 'Colores y degradados', 'Paleta oficial, degradados de la línea azul, la franja multicolor y escalas tonales, listos para copiar.', body)


# =============================================================== LOGOS
LOGOS = [
    # archivo, título, descripción, fondo-vista
    ('logo-vertical-color', 'Logotipo principal (vertical)', 'Manual · 01. Escudo + «Gobernación del MAGDALENA» + línea de colores. Uso preferente.', ''),
    ('logo-horizontal-color', 'Logotipo horizontal', 'Manual · 02. Para cabeceras, firmas de correo y espacios anchos.', ''),
    ('logo-horizontal-gris', 'Versión gris', 'Manual · 03. Escala de grises para documentos monocromos.', ''),
    ('logo-horizontal-negro', 'Versión negro (positivo)', 'Manual · 03. Una tinta, sobre fondos claros.', ''),
    ('logo-horizontal-blanco', 'Negativo blanco (fondo transparente)', 'Versión blanca sin fondo, derivada del negativo del manual. Para sidebars, pies y banners oscuros o azules.', 'dark'),
    ('logo-horizontal-blanco-sobre-negro', 'Negativo sobre negro', 'Manual · 03. Incluye el fondo negro #1D1D1B tal como aparece en el manual.', 'dark'),
    ('logo-horizontal-blanco-sobre-gris', 'Negativo sobre gris', 'Manual · 03. Incluye el fondo gris #606060 del manual.', 'gray'),
    ('escudo', 'Escudo', 'Escudo del Departamento solo (PNG/JPG de alta resolución).', ''),
    ('escudo-sobre-franjas', 'Escudo sobre franjas', 'Manual · 04. Escudo con las franjas de la paleta.', ''),
    ('bandera-magdalena', 'Bandera del Magdalena', 'Manual · 04. Bandera con las 7 estrellas.', ''),
    ('barra-franjas', 'La línea (barra de franjas)', 'Barra de nueve colores en SVG, escalable a cualquier ancho (SVG con preserveAspectRatio none).', ''),
    ('gobernacion-horizontal-escudo', 'Escudo + texto (compacto)', 'Aporte del equipo: variante horizontal con fondo transparente.', ''),
    ('gobernacion-texto', 'Solo texto «Gobernación del MAGDALENA»', 'Aporte del equipo: wordmark sin escudo (gris).', ''),
    ('marca-magdalena-te-lo-puedes-creer', 'Marca «Magdalena ¿Te lo puedes creer?»', 'Aporte del equipo: marca territorial/turística (no pertenece al manual).', ''),
    ('oficina-tecnologia-informacion', 'Sello Oficina de Tecnología de la Información', 'Aporte del equipo: sello circular con franjas.', ''),
]


def page_logos(root):
    base = os.path.join(root, 'assets', 'logos')
    cards = ''
    for f, t, d, bg in LOGOS:
        have = {e: os.path.exists(os.path.join(base, e, f + '.' + e)) for e in ('svg', 'png', 'jpg')}
        view = 'png' if have['png'] else 'svg'
        dims = ''
        if have['png']:
            w_, h_ = Image.open(os.path.join(base, 'png', f + '.png')).size
            dims = f' · {w_}×{h_} px'
        dl = ''.join(f'<a href="assets/logos/{e}/{f}.{e}" download>{e.upper()}</a>' for e in ('svg', 'png', 'jpg') if have[e])
        main = 'svg' if have['svg'] else 'png'
        snippet = f'<img src="assets/logos/{main}/{f}.{main}" alt="Gobernación del Magdalena" height="48">'
        cards += f'''<div class="lg"><div class="lg__view {"lg__view--" + bg if bg else ""}"><img src="assets/logos/{view}/{f}.{view}" alt="{E(t)}" loading="lazy"></div>
<div class="lg__body"><h3>{E(t)}</h3><p>{E(d)}{dims}</p><div class="lg__dl">{dl}<button class="alt" data-copy="{E(snippet)}">&lt;img&gt;</button><button class="alt" data-copyurl="assets/logos/{main}/{f}.{main}">URL</button></div></div></div>'''
    zips = [('logos-todos.zip', 'Todos los logos (SVG + PNG + JPG)'), ('logos-svg.zip', 'Solo SVG (vectorial)'), ('logos-png.zip', 'Solo PNG (transparente)'),
            ('logos-jpg.zip', 'Solo JPG (fondo blanco)'), ('favicons.zip', 'Favicons e íconos PWA'), ('ejemplos-aplicacion.zip', 'Ejemplos de aplicación (carnet, valla…)')]
    zl = ''.join(f'<a class="mg-btn mg-btn--outline mg-btn--sm" href="dist/downloads/{z}" download>⬇ {t}</a>' for z, t in zips)
    snippets = code('html', '''<!-- Cabecera -->
<a href="/"><img src="__BASE__/assets/logos/svg/logo-horizontal-color.svg" alt="Gobernación del Magdalena" height="48"></a>

<!-- Pie de página oscuro -->
<img src="__BASE__/assets/logos/svg/logo-horizontal-blanco-sobre-negro.svg" alt="Gobernación del Magdalena" height="48">''', 'Logo en HTML', tpl=True) + code('html', '''<!-- Favicons: copie assets/favicon/ a la raíz de su sitio -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#0071BB">''', 'Favicon')
    body = f'''
<section class="pt-section"><h2><span class="n">01.</span> Descargas rápidas</h2>
<div class="mg-row">{zl}</div></section>
<section class="pt-section"><h2><span class="n">02.</span> Logotipos y elementos gráficos</h2>
<p class="pt-lead">Extraídos del PDF del manual en <b>vectorial (SVG)</b> y en alta resolución (PNG transparente y JPG sobre blanco, ×4). Cada tarjeta permite descargar el archivo, copiar la etiqueta <code class="inline">&lt;img&gt;</code> o su URL.</p>
<div class="pt-grid pt-grid--lg">{cards}</div></section>
<section class="pt-section"><h2><span class="n">03.</span> Uso en web</h2>
<div class="baseurl"><b>URL base:</b><input class="mg-input" id="baseInput" aria-label="URL base"><button class="mg-btn mg-btn--ghost mg-btn--sm" id="baseReset">Autodetectar</button></div>
{snippets}</section>
<section class="pt-section"><h2><span class="n">04.</span> Recomendaciones técnicas</h2>
<p class="pt-lead">El manual no define márgenes de seguridad ni tamaños mínimos; estas son <b>recomendaciones del equipo de desarrollo</b> para pantalla, a validar con Comunicaciones.</p>
<div class="dont">
<div class="ok"><b>✔ Usar los archivos originales</b><br>SVG siempre que sea posible; PNG ×2 para pantallas retina.</div>
<div class="ok"><b>✔ Fondo claro/blanco</b><br>Sobre fotos o fondos de color, colocar el logo dentro de la cápsula blanca <code class="inline">.mg-logo-pill</code> (como en la valla del manual).</div>
<div class="ok"><b>✔ Versión negativa en fondos oscuros</b><br>Usar «blanco sobre negro» o «blanco sobre gris».</div>
<div class="ok"><b>✔ Espacio libre</b><br>Dejar alrededor del logo al menos la altura de la «M» de MAGDALENA.</div>
<div class="no"><b>✘ No deformar</b><br>Mantener proporción (usar solo <code class="inline">height</code> o <code class="inline">width</code>).</div>
<div class="no"><b>✘ No recolorear ni aplicar sombras / efectos</b><br>Solo las versiones oficiales: color, gris, negro, negativo.</div>
<div class="no"><b>✘ No poner el logo a color sobre el degradado azul</b><br>Usar la versión negativa o la cápsula blanca.</div>
<div class="no"><b>✘ No separar el escudo del texto</b><br>salvo en íconos pequeños (favicon, avatar de redes) donde se usa el escudo solo.</div>
</div></section>'''
    page(root, 'logos.html', 'Logos y descargas', 'Todos los logotipos y elementos gráficos del manual en SVG, PNG y JPG, con enlaces directos y etiquetas listas para pegar.', body)


# =============================================================== COMPONENTES
DEMOS = [
    ('Botones', 'Degradado de marca (acción principal), plano, de acento, contorno y fantasma. Tamaños sm/lg.', True, '''<div class="mg-row">
  <button class="mg-btn">Principal</button>
  <button class="mg-btn mg-btn--flat">Plano</button>
  <button class="mg-btn mg-btn--cyan">Cian</button>
  <button class="mg-btn mg-btn--accent">Acento</button>
  <button class="mg-btn mg-btn--danger">Peligro</button>
  <button class="mg-btn mg-btn--success">Éxito</button>
  <button class="mg-btn mg-btn--outline">Contorno</button>
  <button class="mg-btn mg-btn--ghost">Fantasma</button>
  <button class="mg-btn" disabled>Deshabilitado</button>
</div>
<div class="mg-row" style="margin-top:1rem"><button class="mg-btn mg-btn--sm">Pequeño</button><button class="mg-btn mg-btn--lg">Grande</button><button class="mg-btn mg-btn--square">Cuadrado</button></div>'''),
    ('Tarjetas', 'Con la línea multicolor, con cabecera degradada, con borde de acento y con degradado completo.', False, '''<div class="mg-grid" style="--mg-col:15rem">
  <div class="mg-card mg-card--stripe-top"><div class="mg-card__body"><h4 class="mg-h4">Con la línea</h4><p>.mg-card--stripe-top</p></div></div>
  <div class="mg-card"><div class="mg-card__header mg-card__header--gradient">Cabecera degradada</div><div class="mg-card__body">.mg-card__header--gradient</div><div class="mg-card__footer">Pie</div></div>
  <div class="mg-card mg-card--accent-cyan mg-card--hover"><div class="mg-card__body"><h4 class="mg-h4">Borde de acento</h4><p>.mg-card--accent-cyan</p></div></div>
  <div class="mg-card mg-card--gradient"><div class="mg-card__body"><h4 class="mg-h4" style="color:#fff">Degradado</h4><p>.mg-card--gradient</p></div></div>
</div>'''),
    ('Indicadores (KPI / small-box)', 'Cajas de datos con el degradado de marca.', False, '''<div class="mg-grid" style="--mg-col:14rem">
  <div class="mg-stat"><div><div class="mg-stat__value">1.284</div><div class="mg-stat__label">Trámites</div></div></div>
  <div class="mg-stat mg-stat--aqua"><div><div class="mg-stat__value">87%</div><div class="mg-stat__label">Atendidos</div></div></div>
  <div class="mg-stat mg-stat--deep"><div><div class="mg-stat__value">45</div><div class="mg-stat__label">Municipios</div></div></div>
  <div class="mg-stat mg-stat--sun"><div><div class="mg-stat__value">12</div><div class="mg-stat__label">Pendientes</div></div></div>
  <div class="mg-stat mg-stat--tropical"><div><div class="mg-stat__value">98</div><div class="mg-stat__label">Satisfacción</div></div></div>
  <div class="mg-stat mg-stat--heat"><div><div class="mg-stat__value">3</div><div class="mg-stat__label">Alertas</div></div></div>
</div>'''),
    ('Insignias y chips', None, True, '''<div class="mg-row">
  <span class="mg-badge">Primaria</span><span class="mg-badge mg-badge--solid">Sólida</span><span class="mg-badge mg-badge--gradient">Degradado</span>
  <span class="mg-badge mg-badge--cyan">Info</span><span class="mg-badge mg-badge--green">Aprobado</span><span class="mg-badge mg-badge--yellow">Pendiente</span>
  <span class="mg-badge mg-badge--red">Rechazado</span><span class="mg-badge mg-badge--purple">Especial</span>
  <span class="mg-chip">📍 Santa Marta</span><span class="mg-avatar">DC</span>
</div>'''),
    ('Alertas', None, False, '''<div class="mg-stack">
  <div class="mg-alert"><div><p class="mg-alert__title">Información</p>Su solicitud fue radicada.</div></div>
  <div class="mg-alert mg-alert--info"><div><p class="mg-alert__title">Nota</p>Recuerde adjuntar los soportes.</div></div>
  <div class="mg-alert mg-alert--success"><div><p class="mg-alert__title">Listo</p>Documento firmado correctamente.</div></div>
  <div class="mg-alert mg-alert--warning"><div><p class="mg-alert__title">Atención</p>Su sesión expira en 2 minutos.</div></div>
  <div class="mg-alert mg-alert--danger"><div><p class="mg-alert__title">Error</p>No fue posible enviar el formulario.</div></div>
</div>'''),
    ('Formularios', None, True, '''<div class="mg-grid" style="--mg-col:16rem">
  <div><label class="mg-label" for="n">Nombre</label><input class="mg-input" id="n" placeholder="Escriba su nombre"><p class="mg-help">Como aparece en su documento.</p></div>
  <div><label class="mg-label" for="e">Correo</label><input class="mg-input is-invalid" id="e" value="correo@"><p class="mg-help" style="color:var(--mg-red)">Correo no válido</p></div>
  <div><label class="mg-label" for="m">Municipio</label><select class="mg-select" id="m"><option>Santa Marta</option><option>Ciénaga</option></select></div>
  <div><label class="mg-label">Opciones</label><label><input class="mg-check" type="checkbox" checked> Acepto términos</label></div>
</div>'''),
    ('Tabla', None, False, '''<table class="mg-table"><thead><tr><th>Radicado</th><th>Asunto</th><th>Estado</th></tr></thead><tbody>
<tr><td>2026-00123</td><td>Certificación laboral</td><td><span class="mg-badge mg-badge--green">Resuelto</span></td></tr>
<tr><td>2026-00124</td><td>Derecho de petición</td><td><span class="mg-badge mg-badge--yellow">En trámite</span></td></tr>
<tr><td>2026-00125</td><td>Queja</td><td><span class="mg-badge mg-badge--red">Vencido</span></td></tr></tbody></table>'''),
    ('Navegación', 'Navbar con la línea, pestañas, migas y sidebar degradado.', False, '''<header class="mg-navbar" style="margin-bottom:1rem">
  <a class="mg-navbar__brand" href="#"><img src="assets/logos/svg/logo-horizontal-color.svg" alt="Gobernación del Magdalena"></a>
  <nav class="mg-row" style="margin-left:auto"><a class="mg-nav-link is-active" href="#">Inicio</a><a class="mg-nav-link" href="#">Trámites</a><a class="mg-nav-link" href="#">Contacto</a></nav>
</header>
<ul class="mg-breadcrumb" style="margin-bottom:1rem"><li>Inicio</li><li>Servicios</li><li>Trámites</li></ul>
<div class="mg-tabs" style="margin-bottom:1rem"><button class="mg-tab is-active">General</button><button class="mg-tab">Documentos</button><button class="mg-tab">Historial</button></div>
<div class="mg-sidebar" style="max-width:260px;border-radius:16px"><a class="is-active" href="#">📊 Panel</a><a href="#">📁 Expedientes</a><a href="#">⚙ Ajustes</a></div>'''),
    ('Progreso, fechas y marcos', None, True, '''<div class="mg-grid" style="--mg-col:16rem">
  <div><div class="mg-label">Avance 70%</div><div class="mg-progress" style="--value:70%"><span></span></div></div>
  <div class="mg-frame" style="padding:1rem">.mg-frame — borde degradado azul</div>
  <div class="mg-frame mg-frame--stripe mg-frame--thick" style="padding:1rem">.mg-frame--stripe — borde con la línea</div>
  <div><span class="mg-tag-date"><small>MARTES</small><strong>21</strong><small>DE JULIO</small></span></div>
</div>'''),
    ('Hero y pie de página', 'Cabecera con degradado + línea, y pie con la línea.', False, '''<section class="mg-hero mg-shapes" style="border-radius:16px 16px 0 0">
  <h1 class="mg-h1" style="color:#fff">Gobierno cerca de su gente</h1>
  <p style="max-width:50ch">Servicios, trámites e información de la Gobernación del Magdalena.</p>
  <a class="mg-btn mg-btn--accent mg-btn--lg" href="#">Ver trámites</a>
</section>
<footer class="mg-footer" style="border-radius:0 0 16px 16px">Carrera 1C N° 16-15 Palacio Tayrona · Santa Marta · <a href="#">gobernaciondelmagdalena.gov.co</a></footer>'''),
    ('Piezas del manual: carnet, tarjeta y post', 'Réplicas HTML de las piezas institucionales para usarlas en carnetización, firmas y redes.', False, '''<div class="mg-row" style="align-items:flex-start;gap:2rem">
  <div class="mg-id-card"><img src="assets/logos/svg/logo-vertical-color.svg" alt="" style="width:80%"><div class="mg-id-card__photo"></div><div class="mg-id-card__name">Nombre y Apellido</div><div style="font-weight:700;color:var(--mg-gray)">Identificación</div><div style="font-weight:700;color:var(--mg-gray)">Área de trabajo</div></div>
  <div style="flex:1;min-width:280px;display:grid;gap:1.25rem">
    <div class="mg-business-card"><div><img src="assets/logos/svg/logo-vertical-color.svg" alt="" style="width:100%"></div><div style="text-align:right"><div class="mg-business-card__name">Margarita Guerra</div><div style="font-size:.85rem">Gobernadora</div><small style="color:var(--mg-gray)">Santa Marta · Magdalena<br>Colombia</small></div></div>
    <div class="mg-post" style="max-width:360px"><div class="mg-shapes" style="position:absolute;inset:0;z-index:-1"></div><h2>Gobernación del<strong>Magdalena</strong></h2><div class="mg-divider mg-divider--stripe"></div><p>Te invita a la jornada de <b>reactivación del Corredor Turístico Tayrona</b></p><span class="mg-tag-date"><small>MARTES</small><strong>21</strong><small>DE JULIO</small></span><span class="mg-logo-pill"><img src="assets/logos/svg/logo-horizontal-color.svg" alt=""></span></div>
  </div>
</div>'''),
    ('Utilidades de fondo, texto y formas', None, False, '''<div class="mg-grid" style="--mg-col:12rem">
  <div class="mg-bg-primary mg-rounded-lg" style="padding:1.25rem">.mg-bg-primary</div><div class="mg-bg-sky mg-rounded-lg" style="padding:1.25rem">.mg-bg-sky</div>
  <div class="mg-bg-aqua mg-rounded-lg" style="padding:1.25rem">.mg-bg-aqua</div><div class="mg-bg-deep mg-rounded-lg" style="padding:1.25rem">.mg-bg-deep</div>
  <div class="mg-bg-tropical mg-rounded-lg" style="padding:1.25rem">.mg-bg-tropical</div><div class="mg-bg-sun mg-rounded-lg" style="padding:1.25rem">.mg-bg-sun</div>
  <div class="mg-bg-heat mg-rounded-lg" style="padding:1.25rem">.mg-bg-heat</div><div class="mg-bg-violet mg-rounded-lg" style="padding:1.25rem">.mg-bg-violet</div>
</div>
<p class="mg-text-gradient" style="font:900 3rem/1.1 var(--mg-font-display);margin:1.25rem 0 0">Texto con degradado</p>
<div class="mg-eyebrow" style="margin-top:1rem">01.</div><h3 class="mg-h2 mg-title-underline">Título como en el manual</h3>'''),
]


def page_components(root):
    out = ''
    for i, (t, d, white, h) in enumerate(DEMOS, 1):
        out += f'''<section class="pt-section" id="c{i}"><h2><span class="n">{i:02d}.</span> {t}</h2>{f'<p class="pt-lead">{d}</p>' if d else ''}
<div class="demo"><div class="demo__view{" demo__view--white" if white else ""}">{h}</div>
<details><summary>Ver código HTML</summary>{code("html", h)}</details></div></section>'''
    body = '<p class="pt-lead">Todo se renderiza con <code class="inline">dist/css/magdalena.css</code>. Prefijo <code class="inline">mg-</code>; sin dependencias; compatible con cualquier framework.</p>' + out
    page(root, 'componentes.html', 'Componentes y utilidades', 'Botones, tarjetas, formularios, navegación y las piezas del manual (carnet, tarjeta, post) listos para copiar y pegar.', body)


# =============================================================== INTEGRACION
def page_integration(root, G):
    groups = {}
    for g in G:
        groups.setdefault(g['group'], []).append(g)
    nav = ''
    for gr, items in groups.items():
        nav += f'<h4>{gr}</h4>' + ''.join(f'<a href="#{g["id"]}">{E(g["title"])}</a>' for g in items)
    guides = ''
    for g in G:
        guides += f'<article class="int__guide" id="{g["id"]}"><h3>{E(g["title"])}</h3><p class="pt-lead" style="margin-bottom:.5rem">{E(g["summary"])}</p>'
        for title, blocks in [(s[0], s[1]) for s in g['steps']]:
            guides += f'<h5>{E(title)}</h5>'
            for lang, fname, c in blocks:
                guides += code(lang, c, fname, tpl='__BASE__' in c)
        for n in g['notes']:
            guides += f'<div class="mg-alert mg-alert--info"><div>{E(n).replace("`", "")}</div></div>'
        guides += f'<p style="margin:.75rem 0 0"><a href="docs/{g["id"]}.md">Ver en Markdown →</a></p></article>'
    files = [
        ('dist/css/magdalena.min.css', 'Todo en uno (tokens + degradados + la línea + componentes)'),
        ('dist/css/magdalena-tokens.min.css', 'Solo variables CSS (--mg-*)'),
        ('dist/adminlte/magdalena-adminlte4.min.css', 'AdminLTE 4 / Bootstrap 5.3'),
        ('dist/adminlte/magdalena-adminlte3.min.css', 'AdminLTE 3 / Bootstrap 4'),
        ('dist/bootstrap/magdalena-bootstrap5.min.css', 'Bootstrap 5.3 (CSS)'),
        ('dist/bootstrap/magdalena-bootstrap4.min.css', 'Bootstrap 4 (CSS)'),
        ('dist/bootstrap/_magdalena-bootstrap-variables.scss', 'Bootstrap 5 (variables Sass)'),
        ('dist/tailwind/magdalena.tailwind.preset.cjs', 'Tailwind v3 (preset)'),
        ('dist/tailwind/magdalena.tailwind-v4.css', 'Tailwind v4 (@theme)'),
        ('dist/angular-material/_magdalena-theme.scss', 'Angular Material M2 + M3 (SCSS)'),
        ('dist/angular-material/magdalena-material-extras.min.css', 'Angular Material (degradados y la línea)'),
        ('dist/primeng/magdalena-preset.ts', 'PrimeNG 18+ / PrimeVue 4 (preset)'),
        ('dist/primeng/magdalena-primeng.min.css', 'PrimeNG (degradados, ≤17 compatible)'),
        ('dist/mui/magdalena-mui-theme.mjs', 'MUI (React)'),
        ('dist/vuetify/magdalena-vuetify.mjs', 'Vuetify 3'),
        ('dist/scss/_magdalena-tokens.scss', 'Variables SCSS'),
        ('dist/less/magdalena-tokens.less', 'Variables Less'),
        ('dist/tokens/magdalena-tokens.json', 'Tokens JSON (hex, rgb, cmyk, degradados)'),
    ]
    rows = ''.join(f'<tr><td>{d}</td><td><code data-url="{p}">{p}</code></td><td style="white-space:nowrap"><button class="copy" data-copyurl="{p}">Copiar URL</button> <a class="copy" style="text-decoration:none" href="{p}" download>⬇</a></td></tr>' for p, d in files)
    body = f'''
<div class="baseurl"><b>URL base de este sitio:</b><input class="mg-input" id="baseInput" aria-label="URL base"><button class="mg-btn mg-btn--ghost mg-btn--sm" id="baseReset">Autodetectar</button>
<span class="mg-help" style="width:100%;margin:0">Todos los ejemplos de código y la tabla usan esta URL. Si el sitio se publica en otro dominio, escríbalo aquí y copie.</span></div>
<section class="pt-section" id="urls"><h2><span class="n">01.</span> URLs directas de cada archivo</h2>
<p class="pt-lead">Basta con un <code class="inline">&lt;link&gt;</code> a la URL del CSS para usar la marca. Cada archivo es autosuficiente (incluye sus variables).</p>
<div class="tablewrap"><table class="urls"><thead><tr><th>Para</th><th>URL</th><th></th></tr></thead><tbody>{rows}</tbody></table></div></section>
<section class="pt-section" id="guias"><h2><span class="n">02.</span> Guías por tecnología</h2>
<div class="int"><nav class="int__nav" aria-label="Tecnologías">{nav}</nav><div>{guides}</div></div></section>'''
    page(root, 'integracion.html', 'Integración por tecnología', 'AdminLTE, Bootstrap, Tailwind, Angular Material, PrimeNG, React, Vue, Laravel, Node, Java, WordPress y móvil: cómo aplicar la marca en cada uno.', body)


# =============================================================== APLICACIONES
def page_apps(root):
    items = [('tarjeta-presentacion', 'Tarjeta de presentación', '05'), ('pendon', 'Pendón', '06'), ('carnet', 'Carnet', '07'), ('camisa-polo', 'Camisa polo', '08'),
             ('camisa-formal', 'Camisa formal', '08'), ('backing', 'Backing', '09'), ('post-redes-sociales', 'Post de redes sociales', '10'), ('gorra', 'Gorra', '11'),
             ('valla', 'Valla (diseño)', '12'), ('valla-mockup', 'Valla (en contexto)', '12')]
    figs = ''.join(f'<figure><a href="assets/ejemplos/{f}.jpg"><img loading="lazy" src="assets/ejemplos/{f}.jpg" alt="{t}"></a><figcaption><span>{n}. {t}</span><a class="mg-btn mg-btn--ghost mg-btn--sm" href="assets/ejemplos/{f}.jpg" download>⬇ JPG</a></figcaption></figure>' for f, t, n in items)
    body = f'''<p class="pt-lead">Piezas del manual (páginas 06–15) como referencia visual: la línea de colores, la cápsula blanca del logo y las formas diagonales se repiten en todas. <a href="dist/downloads/ejemplos-aplicacion.zip">Descargar todas (.zip)</a>.</p>
<div class="gallery">{figs}</div>'''
    page(root, 'aplicaciones.html', 'Aplicaciones del manual', 'Tarjeta, pendón, carnet, camisas, backing, post, gorra y valla tal como aparecen en el manual de identidad.', body)


# =============================================================== INICIO
def page_index(root):
    hero = '''<section class="pt-hero"><div class="pt-hero__in">
<div><span class="mg-badge mg-badge--solid" style="background:var(--mg-yellow);color:var(--mg-ink)">Identidad Visual 2026</span>
<h1 style="margin-top:1rem">Manual de marca para desarrollo web</h1>
<p>Colores, degradados, la línea multicolor, logos y componentes de la Gobernación del Magdalena, listos para usar en AdminLTE, Bootstrap, Tailwind, Angular Material, PrimeNG, React, Vue, Laravel y más.</p>
<div class="mg-row"><a class="mg-btn mg-btn--accent mg-btn--lg" href="integracion.html">Empezar a integrar</a><a class="mg-btn mg-btn--lg" style="background:rgba(255,255,255,.18);box-shadow:none;border:2px solid #fff" href="logos.html">Descargar logos</a></div></div>
<div class="pt-hero__logo"><img src="assets/logos/svg/logo-vertical-color.svg" alt="Gobernación del Magdalena"></div>
</div></section>'''
    cards = [('🎨', 'Colores y degradados', 'Paleta oficial (HEX/RGB/CMYK), la gama azul 0071BB → 00B7D9 → 9FD7E5, escalas y contraste.', 'colores.html', 'var(--mg-gradient-primary)'),
             ('🖼', 'Logos y descargas', 'SVG, PNG y JPG de todos los logotipos, escudo, bandera y la línea. ZIP por formato.', 'logos.html', 'var(--mg-gradient-aqua)'),
             ('🧩', 'Componentes', 'Botones, tarjetas, KPIs, formularios, navegación, carnet y tarjeta en HTML/CSS.', 'componentes.html', 'var(--mg-gradient-tropical)'),
             ('⚙', 'Integración', 'Guías copiar-y-pegar para 14 tecnologías, con URL directa a cada CSS.', 'integracion.html', 'var(--mg-gradient-sun)'),
             ('👕', 'Aplicaciones', 'Tarjetas, pendones, carnets, camisas, backing, post, gorra y valla del manual.', 'aplicaciones.html', 'var(--mg-gradient-heat)'),
             ('▶', 'Demos en vivo', 'AdminLTE 3 y 4, Bootstrap 5 y Tailwind con el tema aplicado.', 'demos/index.html', 'var(--mg-gradient-violet)')]
    ck = ''.join(f'<a class="k" style="--k:{g}" href="{h}"><div class="ic">{i}</div><h3>{t}</h3><p>{d}</p></a>' for i, t, d, h, g in cards)
    quick = code('html', '''<link rel="stylesheet" href="__BASE__/dist/css/magdalena.min.css">

<body class="mg-base">
  <section class="mg-hero"><h1>Hola Magdalena</h1><button class="mg-btn mg-btn--accent">Ingresar</button></section>
  <hr class="mg-stripe">
</body>''', 'index.html', tpl=True)
    body = f'''<section class="pt-section"><h2><span class="n">01.</span> Qué hay aquí</h2><div class="cards-k">{ck}</div></section>
<section class="pt-section"><h2><span class="n">02.</span> Empiece en 30 segundos</h2>
<p class="pt-lead">Una sola línea de CSS aplica la marca. Ajuste la URL si publica este sitio en otro dominio.</p>
<div class="baseurl"><b>URL base:</b><input class="mg-input" id="baseInput" aria-label="URL base"><button class="mg-btn mg-btn--ghost mg-btn--sm" id="baseReset">Autodetectar</button></div>
{quick}
</section>
<section class="pt-section"><h2><span class="n">03.</span> Lo esencial de la marca</h2>
<div class="pt-grid">
<div class="grad"><div class="grad__bar" style="background:var(--mg-gradient-sky);color:#fff">Degradado azul</div><div class="grad__body">0071BB → 00B7D9 → 9FD7E5. La línea de la marca en web.</div></div>
<div class="grad"><div class="grad__bar" style="background:var(--mg-gradient-stripe)"></div><div class="grad__body">La franja multicolor: remate de cabeceras, tarjetas y pies.</div></div>
<div class="grad"><div class="grad__bar" style="background:#fff;justify-content:center;align-items:center"><img src="assets/logos/svg/logo-horizontal-color.svg" style="height:64px" alt=""></div><div class="grad__body">Logotipo horizontal y vertical, en versiones color, gris, negro y negativo.</div></div>
<div class="grad"><div class="grad__bar" style="background:var(--mg-surface);font-family:var(--mg-font-display);font-weight:900;font-size:2rem;color:var(--mg-gray)">Montserrat</div><div class="grad__body">Tipografía web: Montserrat (alternativa libre a Gotham del manual). Títulos 800–900.</div></div>
</div></section>
<section class="pt-section"><h2><span class="n">04.</span> Descargas</h2>
<div class="mg-row"><a class="mg-btn" href="dist/downloads/kit-desarrollo-css-y-temas.zip" download>⬇ Kit de desarrollo (CSS, temas, tokens)</a><a class="mg-btn mg-btn--outline" href="dist/downloads/logos-todos.zip" download>⬇ Todos los logos</a><a class="mg-btn mg-btn--outline" href="dist/downloads/favicons.zip" download>⬇ Favicons</a><a class="mg-btn mg-btn--ghost" href="NUEVO%20MANUAL%20GOBERNACI%C3%93N.pdf">📄 Manual original (PDF)</a></div></section>'''
    page(root, 'index.html', 'Manual de marca web', 'Kit de identidad visual 2026', body, hero=hero)


def page_demos(root):
    items = [('adminlte4.html', 'AdminLTE 4', 'Bootstrap 5.3 · sidebar degradado, small-boxes, línea en cabecera y pie', 'var(--mg-gradient-primary)'),
             ('adminlte3.html', 'AdminLTE 3', 'Bootstrap 4 · mismo tema para proyectos AdminLTE 3.2', 'var(--mg-gradient-aqua)'),
             ('bootstrap5.html', 'Bootstrap 5', 'Navbar, hero, tarjetas, formulario y modal', 'var(--mg-gradient-tropical)'),
             ('tailwind.html', 'Tailwind CSS', 'Utilidades mg-* y degradados bg-mg-grad-*', 'var(--mg-gradient-sun)')]
    ck = ''.join(f'<a class="k" style="--k:{g}" href="{h}"><h3>{t}</h3><p>{d}</p></a>' for h, t, d, g in items)
    body = f'<p class="pt-lead">Páginas reales que cargan AdminLTE/Bootstrap/Tailwind desde CDN y encima el CSS de este repositorio. Úselas como referencia de marcado.</p><div class="cards-k">{ck}</div>'
    page(root, 'demos/index.html', 'Demos en vivo', 'Plantillas funcionales con la identidad visual aplicada.', body)


def build(root, dist, G):
    page_demos(root)
    page_index(root); page_colors(root); page_logos(root); page_components(root); page_integration(root, G); page_apps(root)
    print('portal generado')
