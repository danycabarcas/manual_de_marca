"""Franja institucional y pie de página para sitios públicos y aliados: borrador de política + documentación + configurador + demo."""
import json
import os
from site_mapa import tabla

CDN = 'https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@v0.7.0/cdn/v1'

CONFIG_DEMO = {
    'enlaces': [{'t': 'Transparencia', 'u': '#transparencia'}, {'t': 'PQRSD', 'u': '#pqrsd'}, {'t': 'Trámites y servicios', 'u': '#tramites'}],
    'pie': {
        'direccion': 'Carrera 1C N° 16-15, Palacio Tayrona · Santa Marta, Magdalena', 'correo': 'contactenos@magdalena.gov.co', 'telefono': '(+57) 000 000 0000 · reemplazar',
        'columnas': [{'titulo': 'Ciudadanía', 'enlaces': [{'t': 'PQRSD', 'u': '#pqrsd'}, {'t': 'Trámites y servicios', 'u': '#tramites'}, {'t': 'Atención presencial', 'u': '#atencion'}]},
                     {'titulo': 'Transparencia', 'enlaces': [{'t': 'Ley 1712 de 2014', 'u': '#ley1712'}, {'t': 'Contratación', 'u': '#contratacion'}, {'t': 'Plan de acción', 'u': '#plan'}]}],
        'redes': [{'n': 'facebook', 't': 'Facebook', 'u': '#facebook'}, {'n': 'instagram', 't': 'Instagram', 'u': '#instagram'}, {'n': 'x', 't': 'X', 'u': '#x'}, {'n': 'youtube', 't': 'YouTube', 'u': '#youtube'}],
        'legal': [{'t': 'Política de privacidad', 'u': '#privacidad'}, {'t': 'Términos de uso', 'u': '#terminos'}, {'t': 'Declaración de accesibilidad', 'u': '#accesibilidad'}],
    },
}

DEMO = '''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sitio público de ejemplo · Franja institucional</title>
<link rel="icon" href="../assets/favicon/favicon.ico">
<link rel="stylesheet" href="../cdn/v1/gob.css">
<style>
  body { margin: 0; font-family: Montserrat, system-ui, sans-serif; color: #161A22; background: #fff; }
  main { display: block; }
  .hero { background: linear-gradient(135deg, #0B2239, #12395C); color: #fff; padding: clamp(2.5rem, 7vw, 5rem) 1.25rem; }
  .w { max-width: 1100px; margin: 0 auto; } .hero h1 { margin: 0 0 .75rem; font-size: clamp(1.8rem, 4vw, 2.8rem); letter-spacing: -.02em; } .hero p { margin: 0 0 1.25rem; max-width: 52ch; color: #C9D4E3; font-size: 1.05rem; }
  .cards { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); padding: 2.5rem 1.25rem; } .card { border: 1px solid #E3E8EF; border-radius: 14px; padding: 1.25rem; } .card h2 { margin: 0 0 .4rem; font-size: 1.05rem; color: #0071BB; } .card p { margin: 0; color: #4F5866; font-size: .92rem; }
  a.btn { display: inline-block; background: #0071BB; color: #fff; padding: .7rem 1.2rem; border-radius: 10px; font-weight: 700; text-decoration: none; }
</style>
</head>
<body>

<!-- ★ LA FRANJA Y EL PIE: una sola línea. data-auto inserta la franja arriba y el pie al final. -->
<script src="../cdn/v1/franja/gob-franja.js" data-auto data-modo="ambos" data-config='%CONFIG%'></script>

<main id="contenido">
  <section class="hero"><div class="w"><h1>Secretaría de Turismo del Magdalena</h1><p>Sitio de ejemplo de un aliado: la franja superior morada y el pie de página son idénticos en todos los sitios de la Gobernación.</p><a class="btn" href="#tramites">Ver servicios</a></div></section>
  <section class="w cards" id="tramites" aria-label="Servicios"><article class="card"><h2>Rutas turísticas</h2><p>Consulte destinos, prestadores certificados y eventos de la temporada.</p></article><article class="card"><h2>Registro Nacional de Turismo</h2><p>Inscriba o renueve su establecimiento en línea.</p></article><article class="card"><h2>Quejas y sugerencias</h2><p>Radique su PQRSD y haga seguimiento con su número de radicado.</p></article></section>
  <section class="w" style="padding:0 1.25rem 3rem"><h2>Prueba la accesibilidad</h2><p style="max-width:62ch;color:#4F5866">Abra <b>Accesibilidad</b> en la franja superior: aumente el texto, active el alto contraste, subraye los enlaces, aumente el espaciado o pause las animaciones. Sus preferencias se recuerdan en este navegador. Pulse <kbd>Tab</kbd> al cargar la página para ver «Ir al contenido principal».</p></section>
</main>

<!--DEMO-ONLY--><script type="module" src="demo-kit.js"></script><!--/DEMO-ONLY-->
</body>
</html>
'''


def build(root, page, code):
    # ------------- demo
    with open(os.path.join(root, 'demos', 'sitio-publico.html'), 'w', encoding='utf-8', newline='\n') as f:
        f.write(DEMO.replace('%CONFIG%', json.dumps(CONFIG_DEMO, ensure_ascii=False).replace("'", '&#39;')))

    cfg_min = json.dumps({'enlaces': CONFIG_DEMO['enlaces']}, ensure_ascii=False)
    inst1 = code('html', '<!-- Una sola línea antes de </body> (o al inicio del <body>) -->\n<script src="%s/franja/gob-franja.js" data-auto data-modo="ambos"\n        data-config=\'%s\'></script>' % (CDN, cfg_min), 'HTML / cualquier tecnología')
    inst2 = code('html', '<!-- Con etiquetas, para controlar el lugar exacto -->\n<script src="%s/franja/gob-franja.js"></script>\n\n<gob-franja></gob-franja>      <!-- primera cosa dentro de <body> -->\n…el contenido del sitio…\n<gob-pie></gob-pie>             <!-- al final de <body> -->\n\n<script>\n  document.querySelector(\'gob-franja\').config = { enlaces: [{ t: \'Transparencia\', u: \'/transparencia\' }] };\n  document.querySelector(\'gob-pie\').config = { pie: { correo: \'contacto@aliado.gov.co\' } };\n</script>' % CDN, 'Con etiquetas y propiedades')
    inst3 = code('ts', "// Angular: angular.json → \"scripts\": [\"%s/franja/gob-franja.js\"]  (o <script> en index.html)\n// app.component.ts  (standalone)\nimport { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';\n@Component({ selector: 'app-root', standalone: true, schemas: [CUSTOM_ELEMENTS_SCHEMA],\n  template: `<gob-franja></gob-franja><router-outlet></router-outlet><gob-pie></gob-pie>` })\nexport class AppComponent {}\n\n// React / Next.js: <script src=\"%s/franja/gob-franja.js\" /> en index.html (o next/script), y en JSX:\n// <gob-franja /> … <gob-pie />" % (CDN, CDN), 'Angular · React · Next.js')
    inst4 = code('php', "<?php // Laravel (resources/views/layouts/app.blade.php) · PHP plano: igual que HTML\n?>\n<script src=\"%s/franja/gob-franja.js\" data-auto data-modo=\"ambos\" data-config='{{ json_encode(config('gob.franja')) }}'></script>\n\n// Cualquier CMS o plataforma: pegue el mismo <script> en la plantilla base." % CDN, 'Laravel · PHP · cualquier plataforma')
    refs = tabla(['Opción', 'Por defecto', 'Descripción'], [
        ('<code>titulo</code> · <code>url</code>', 'Gobernación del Magdalena · magdalena.gov.co', 'Nombre y enlace del logo de la franja.'),
        ('<code>color</code>', '#5618BA (morado)', 'Color de la franja. <b>Política: no modificar</b> (solo pruebas).'),
        ('<code>logo</code>', 'logo blanco oficial', 'URL de otro logo (debe ser blanco). Por defecto el oficial, junto al script.'),
        ('<code>texto</code>', 'Sitio oficial', 'Micro-texto junto al logo; <code>""</code> lo oculta.'),
        ('<code>enlaces</code>', '[]', 'Enlaces cortos a la derecha: <code>[{ "t": "Transparencia", "u": "/transparencia" }]</code> (máx. 4 recomendados; se ocultan en móvil).'),
        ('<code>accesibilidad</code>', 'true', 'Muestra el botón y el panel de accesibilidad.'),
        ('<code>opciones</code>', 'texto, contraste, enlaces, espaciado, animaciones', 'Opciones del panel (puede dejar solo algunas).'),
        ('<code>contenido</code>', 'main, #main, #content, [role=main]', 'Selector del destino de «Ir al contenido principal».'),
        ('<code>sticky</code>', 'false', 'Mantiene la franja visible al desplazarse.'),
        ('<code>aplicarA</code>', 'html', 'Elemento sobre el que se aplican las preferencias (casi siempre <code>html</code>).'),
        ('<code>despuesDe</code>', '""', 'Selector de un elemento (p. ej. la franja GOV.CO de MinTIC): la franja se inserta <b>después</b> de él en lugar de al inicio de la página.'),
        ('<code>pasos</code>', '90, 100, 112, 125, 150', 'Tamaños de texto disponibles (%).'),
        ('<code>pie</code>', 'null', 'Objeto del pie (tabla siguiente). Con <code>data-modo="ambos"</code> o <code>&lt;gob-pie&gt;</code>.')])
    refs_pie = tabla(['Campo del pie', 'Descripción'], [
        ('<code>direccion</code> · <code>telefono</code> · <code>correo</code> · <code>horario</code>', 'Datos de contacto (los vacíos no se muestran).'),
        ('<code>columnas</code>', 'Hasta 3: <code>[{ "titulo": "Ciudadanía", "enlaces": [{ "t": "PQRSD", "u": "/pqrsd" }] }]</code>.'),
        ('<code>redes</code>', '<code>[{ "n": "facebook", "t": "Facebook", "u": "https://…" }]</code>. Íconos: facebook, instagram, x, youtube, whatsapp, linkedin, tiktok, web.'),
        ('<code>legal</code>', 'Enlaces de la barra inferior (privacidad, términos, accesibilidad…).'),
        ('<code>texto</code>', 'Texto de derechos (por defecto «© año Gobernación del Magdalena · República de Colombia»).'),
        ('<code>logo</code> · <code>titulo</code>', 'Logo y nombre del pie.')])
    politica = '''<ol style="line-height:1.9;color:var(--mg-gray-700)">
<li><b>Franja superior obligatoria</b> en los sitios públicos de la Gobernación y aliados: morado institucional, logo blanco pequeño, 36 px de alto, sin publicidad ni elementos adicionales.</li>
<li><b>Accesibilidad visible</b>: botón «Accesibilidad» en la franja (tamaño de texto, alto contraste, subrayado de enlaces, espaciado, pausar animaciones) y enlace «Ir al contenido principal» como primer elemento enfocable. Las preferencias se recuerdan por navegador.</li>
<li><b>Pie de página estándar</b>: contacto, hasta 3 columnas de enlaces (ciudadanía, transparencia…), redes y enlaces legales (privacidad, términos, <i>declaración de accesibilidad</i>). Sobrio y corto.</li>
<li><b>Un solo script</b> (sin librerías), versionado en el CDN <code>/cdn/v1/franja/</code>, igual para todos los sitios. Se actualiza en un solo lugar.</li>
<li><b>Lo configurable</b> es el contenido (enlaces, contacto, redes), no la apariencia: el color, la altura y los controles de accesibilidad son comunes.</li>
<li><b>Cumplimiento mínimo del sitio</b> (lista siguiente) conforme a WCAG 2.1 AA y a la normativa colombiana de accesibilidad web (NTC 5854, Resolución 1519 de 2020 de MinTIC).</li></ol>'''
    lista = '''<ul style="line-height:1.9;color:var(--mg-gray-700)"><li><code>&lt;html lang="es"&gt;</code> y un <code>&lt;title&gt;</code> descriptivo por página.</li><li>Landmarks: <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main id="contenido"&gt;</code>, <code>&lt;footer&gt;</code> (el pie lo trae).</li><li>Contraste mínimo 4.5:1 en texto y 3:1 en componentes; foco visible en todo control.</li><li>Texto alternativo en imágenes informativas; subtítulos en videos; sin contenido que parpadee más de 3 veces por segundo.</li><li>Todo operable con teclado; tamaños relativos (<code>rem</code>) para que «Tamaño del texto» funcione.</li><li>Formularios con etiquetas visibles y errores anunciados.</li><li>Publicar la <b>declaración de accesibilidad</b> (enlazada desde el pie).</li><li>Documentos descargables (PDF) en formato accesible.</li></ul>'''
    comp = tabla(['', 'Franja MinTIC (GOV.CO)', 'Franja Gobernación (propuesta)'], [
        ('Color', 'Azul', 'Morado institucional #5618BA'), ('Contenido', 'Logo GOV.CO y enlaces nacionales', 'Logo Gobernación en blanco; enlaces propios opcionales'), ('Accesibilidad', 'Según cada sede', 'Panel común integrado (5 ajustes) + «Ir al contenido»'), ('Pie', 'Definido por MinTIC', 'Pie corto estándar (contacto, columnas, redes, legal)'), ('Convivencia', '—', 'Una sede puede mostrar <b>ambas</b>: la de MinTIC arriba y esta como segunda franja (decisión pendiente)')])
    configurador = '''<div class="franja-cfg" style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr);gap:1.25rem;align-items:start" id="cfg">
  <form class="mg-forms" style="display:grid;gap:.9rem" id="fc" onsubmit="return false">
    <label>Título<input id="c-titulo" value="Gobernación del Magdalena"></label><label>Enlace del logo<input id="c-url" value="https://www.magdalena.gov.co"></label><label>Micro-texto<input id="c-texto" value="Sitio oficial"></label>
    <label>Enlaces de la franja <small>(uno por línea: Texto | URL)</small><textarea id="c-enl" rows="3">Transparencia | /transparencia
PQRSD | /pqrsd</textarea></label>
    <fieldset><legend>Accesibilidad</legend><label><input type="checkbox" id="c-acc" checked> Mostrar panel</label><label><input type="checkbox" class="op" value="texto" checked> Tamaño de texto</label><label><input type="checkbox" class="op" value="contraste" checked> Alto contraste</label><label><input type="checkbox" class="op" value="enlaces" checked> Subrayar enlaces</label><label><input type="checkbox" class="op" value="espaciado" checked> Espaciado</label><label><input type="checkbox" class="op" value="animaciones" checked> Pausar animaciones</label><label><input type="checkbox" id="c-sticky"> Franja fija al desplazarse</label></fieldset>
    <fieldset><legend>Pie de página</legend><label><input type="checkbox" id="c-pie" checked> Incluir pie</label><label>Dirección<input id="c-dir" value="Carrera 1C N° 16-15, Palacio Tayrona · Santa Marta, Magdalena"></label><label>Correo<input id="c-cor" value="contactenos@magdalena.gov.co"></label><label>Teléfono<input id="c-tel" value=""></label>
      <label>Columna 1 <small>(Título: Texto | URL; …)</small><textarea id="c-col" rows="3">Ciudadanía: PQRSD | /pqrsd ; Trámites | /tramites
Transparencia: Ley 1712 | /ley-1712 ; Contratación | /contratacion</textarea></label>
      <label>Redes <small>(red | URL, una por línea)</small><textarea id="c-red" rows="2">facebook | https://facebook.com/
instagram | https://instagram.com/</textarea></label></fieldset>
  </form>
  <div style="display:grid;gap:.75rem;min-width:0"><div id="vista" style="border:1px solid var(--mg-border);border-radius:14px;overflow:hidden;background:#fff"><div id="vf"></div><div style="padding:1.5rem 1.25rem;min-height:5rem"><h3 style="margin:0 0 .3rem">Vista previa del sitio</h3><p style="margin:0;color:#4F5866">Contenido de ejemplo. <a href="#">Un enlace</a>. Pruebe el panel de accesibilidad.</p></div><div id="vp"></div></div>
  <div id="codigo"></div></div></div>'''
    cfg_js = '''<script>
(function () {
  var $ = function (i) { return document.getElementById(i); }; var CDN = '%s';
  var lineas = function (t) { return t.split('\\n').map(function (l) { return l.trim(); }).filter(Boolean); };
  function par(l) { var p = l.split('|'); return { t: (p[0] || '').trim(), u: (p[1] || '#').trim() }; }
  function cfg() {
    var c = { titulo: $('c-titulo').value, url: $('c-url').value, texto: $('c-texto').value, enlaces: lineas($('c-enl').value).map(par), accesibilidad: $('c-acc').checked, opciones: [].slice.call(document.querySelectorAll('.op:checked')).map(function (x) { return x.value; }), sticky: $('c-sticky').checked };
    if ($('c-pie').checked) c.pie = { direccion: $('c-dir').value, correo: $('c-cor').value, telefono: $('c-tel').value,
      columnas: lineas($('c-col').value).map(function (l) { var i = l.indexOf(':'); return { titulo: l.slice(0, i).trim(), enlaces: l.slice(i + 1).split(';').map(par) }; }),
      redes: lineas($('c-red').value).map(function (l) { var p = l.split('|'); return { n: p[0].trim(), t: p[0].trim(), u: (p[1] || '#').trim() }; }) };
    return c;
  }
  function pintar() {
    var c = cfg(); c.aplicarA = '#vista';
    var f = document.createElement('gob-franja'); f.config = c; $('vf').replaceChildren(f);
    $('vp').replaceChildren(); if (c.pie) { var p = document.createElement('gob-pie'); p.config = c; $('vp').appendChild(p); }
    var mostrar = JSON.parse(JSON.stringify(cfg())); var txt = JSON.stringify(mostrar, null, 2);
    $('codigo').innerHTML = '<div class="code"><div class="code__bar"><span>Pegue esto en su sitio</span><button data-codecopy>Copiar</button></div><pre tabindex="0"><code></code></pre></div>';
    $('codigo').querySelector('code').textContent = '<script src="' + CDN + '/franja/gob-franja.js" data-auto data-modo="' + (c.pie ? 'ambos' : 'franja') + '"\\n        data-config=\\'' + JSON.stringify(mostrar) + '\\'><\\/script>';
  }
  document.getElementById('fc').addEventListener('input', pintar); document.getElementById('fc').addEventListener('change', pintar);
  var go = function () { if (customElements.get('gob-franja')) pintar(); else setTimeout(go, 80); }; go();
})();
</script>''' % CDN
    body = f'''<p class="pt-lead"><b>Borrador v0.1 para discusión.</b> Propuesta de política para los <b>sitios nuevos que construyan la Gobernación y sus aliados</b> (no aplica al portal institucional actual): una franja superior morada con el logo en blanco, accesibilidad integrada y un pie de página estándar, entregados como <b>un solo script liviano</b> (≈7 KB comprimido, sin dependencias). <a href="demos/sitio-publico.html"><b>Ver el sitio de ejemplo →</b></a></p>
<section class="pt-section"><h2><span class="n">01.</span> La política en 6 puntos</h2>{politica}</section>
<section class="pt-section"><h2><span class="n">02.</span> Cómo se ve (configure y copie)</h2><p class="pt-lead">Cambie los datos a la izquierda; la vista previa y el código se actualizan al instante. Las preferencias de accesibilidad de la vista previa solo afectan a la vista previa.</p>{configurador}</section>
<section class="pt-section"><h2><span class="n">03.</span> Instalación</h2><p>Sirve en cualquier tecnología: es un <code>&lt;script&gt;</code> normal. Use la URL del CDN con CORS (o la copia local de <a href="dist/downloads/gob-cdn-v1.zip">gob-cdn-v1.zip</a>).</p>{inst1}{inst2}{inst3}{inst4}</section>
<section class="pt-section"><h2><span class="n">04.</span> Opciones de configuración</h2>{refs}<h3 style="margin-top:1.5rem">Pie de página</h3>{refs_pie}<p class="mg-help"><b>Orden de prioridad</b>: valores por defecto &lt; <code>window.GOB_FRANJA</code> &lt; <code>data-config</code> del script &lt; atributo/propiedad <code>config</code> del elemento. <b>Eventos y API</b>: <code>gob-franja-cambio</code> (detail = preferencias), <code>GobFranja.preferencias()</code>, <code>.aplicar({{t:125,c:1}})</code>, <code>.restablecer()</code>.</p></section>
<section class="pt-section"><h2><span class="n">05.</span> Lo que debe cumplir el sitio</h2>{lista}<p class="mg-help">La franja facilita la accesibilidad, <b>no la reemplaza</b>: el sitio debe cumplir las pautas WCAG 2.1 AA. «Tamaño del texto» funciona sobre las medidas relativas (<code>rem</code>/<code>em</code>); los textos en <code>px</code> fijos no cambian.</p></section>
<section class="pt-section"><h2><span class="n">06.</span> Frente a la franja de MinTIC</h2>{comp}</section>
<section class="pt-section"><h2><span class="n">07.</span> Alcance</h2><p>La franja y el pie son parte del <b>manual de marca</b> y se entregan para los <b>sitios nuevos</b> que construyan la Gobernación y sus aliados, con cualquier tecnología. No reemplazan ni modifican el portal institucional que ya está en producción.</p></section>
<script src="cdn/v1/franja/gob-franja.js"></script>
{cfg_js}'''
    page(root, 'sitios-publicos.html', 'Sitios públicos: franja y pie', 'Borrador de política y componentes para los sitios públicos de la Gobernación y sus aliados: franja morada con accesibilidad, pie estándar y un solo script.', body)
