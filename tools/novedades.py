"""Versiones y novedades: novedades.html, CHANGELOG.md, cdn/v1/version.json, y el texto de anuncio para el equipo."""
import json
import os

VERSION = '0.7.1'
FECHA = '2026-11-17'
BASE = 'https://manualdemarca.magdalena.gov.co'

# Cada versión: (versión, fecha, [(tipo, texto, acción requerida)]) — tipos: nuevo | cambio | arreglo | docs
VERSIONES = [
    ('0.7.1', '2026-11-17', [
        ('cambio', '<b>Franja institucional simplificada</b>: solo el logo blanco a la izquierda y el botón «Accesibilidad» a la derecha. Se eliminaron el texto «Sitio oficial» y los enlaces (Transparencia, PQRSD…): el menú es del propio sitio. Las opciones <code>texto</code> y <code>enlaces</code> ya no existen.', 'Si las usaba, quítelas de <code>data-config</code>; no producen error.'),
        ('cambio', 'El <a href="demos/sitio-publico.html">sitio de ejemplo</a> se rediseñó como una sede normal: franja morada arriba y debajo el encabezado de la entidad (logo en color y menú a la derecha).', ''),
    ]),
    ('0.7.0', '2026-11-17', [
        ('nuevo', '<b>Franja institucional y pie de página para los sitios nuevos de la Gobernación y aliados</b> (borrador de política): franja superior morada con el logo en blanco, <b>panel de accesibilidad</b> (tamaño de texto, alto contraste, subrayar enlaces, espaciado, pausar animaciones, «Ir al contenido») y pie estándar corto. Un solo script sin dependencias (<code>cdn/v1/franja/gob-franja.js</code>, ≈7 KB comprimido) con configuración común. Ver <a href="sitios-publicos.html">Sitios públicos</a> y el <a href="demos/sitio-publico.html">sitio de ejemplo</a>.', 'Opcional: agregue el script a los sitios nuevos que construya. No aplica al portal institucional actual.'),
    ]),
    ('0.6.1', '2026-11-17', [
        ('arreglo', 'Íconos SVG sin tamaño en las pantallas de acceso (p. ej. la flecha de «Volver a iniciar sesión» se veía gigante): ahora todo ícono dentro de <code>.mg-auth</code> tiene un tamaño por defecto (1.15 rem).', 'Nada: llega con <code>gob.css</code>. Si copió el login, agregue <code>svg { width: 1.15rem; height: 1.15rem }</code> dentro de su contenedor o actualice <code>gob.css</code>.'),
    ]),
    ('0.6.0', '2026-11-17', [
        ('nuevo', '<b>Sistemas de solicitudes y administración</b> (8 pantallas): registrar solicitud con asignación por tarjetas, consultar con filtros y estados, dashboard de recepción y de control con KPI y semáforo, entrega de respuestas, bitácora con línea de eventos, usuarios y <b>matriz de roles y permisos</b>.', 'Use los demos <a href="demos/index.html#solicitudes">Solicitudes y administración</a>.'),
        ('nuevo', 'Clases nuevas del panel: <code>mg-kcard</code> (KPI con ícono), <code>mg-sem</code>, <code>mg-opt</code>/<code>mg-optlist</code> (opciones tipo tarjeta), <code>mg-matriz</code>, <code>mg-caso</code>/<code>mg-evento</code>, <code>mg-usr</code>/<code>mg-rol</code>, <code>mg-codigo</code>, <code>mg-st</code>, <code>mg-efec</code>, <code>mg-cnt</code>, <code>mg-perfil</code> y títulos de grupo en el menú (<code>mg-nav__grp</code>).', 'Nada: llegan con <code>gob.css</code>.'),
        ('cambio', 'El menú lateral admite <b>grupos con color</b> y una <b>tarjeta de perfil</b>; la barra superior acepta el nombre de cada aplicación.', ''),
    ]),
    ('0.5.1', '2026-11-17', [
        ('arreglo', '<b>CDN desde otros sitios (CORS)</b>: cargar <code>gob.js</code>, las fuentes o los datos desde otro origen (p. ej. <code>localhost:4200</code> o una app en otro dominio) fallaba porque el servidor oficial no envía <code>Access-Control-Allow-Origin</code>. El código que genera el manual ahora usa la URL pública con CORS de jsDelivr: <code>https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@v0.5.1/cdn/v1/</code>.', 'Cambie en sus proyectos la base <code>https://manualdemarca.magdalena.gov.co/cdn/v1/</code> por la de jsDelivr (o use la copia local). Ver <a href="componentes/compatibilidad.html#cors">CORS</a>.'),
    ]),
    ('0.5.0', '2026-11-17', [
        ('nuevo', '<b>Módulo de acceso</b>: login con el modelo GEDIS (panel de marca + tarjeta con «la línea»), recuperar contraseña, nueva contraseña con fortaleza, verificación en dos pasos (OTP), registro y estados de acceso. Clases <code>mg-auth*</code>, <code>mg-social</code>, <code>mg-fl</code>, <code>mg-otp</code>, <code>mg-fuerza</code>.', 'Reemplace sus logins por el esqueleto de <a href="demos/index.html#acceso">Demos → Acceso</a>.'),
        ('nuevo', '<b>Panel de gestión</b> (diseño «Convocatorias»): barra superior con la línea, menú lateral claro y <b>sticky</b>, píldora de sección, tarjetas, listados, tablas con estados, pestañas y formularios. Clases <code>mg-shell*</code>, <code>mg-panel*</code>, <code>mg-nav</code>, <code>mg-conv</code>, <code>mg-tbl</code>, <code>mg-chip</code>, <code>mg-dot</code>…', 'Use los demos <a href="demos/index.html#panel">Panel</a> como estructura de las aplicaciones internas.'),
        ('nuevo', '<b>Catálogo de UI</b>: acordeones (base, tarjetas, flush), pestañas (línea, píldora, segmentada, vertical) y formularios con <b>etiqueta flotante</b>.', ''),
        ('nuevo', '<b>Demos de acceso y panel</b>: 6 casos de acceso + 6 pantallas del panel, con la guía de cómo conectar el login al backend (401/423/429…).', ''),
        ('cambio', 'El diálogo «Sin permisos» usa el <b>azul de marca</b> en su botón (antes naranja). Tipografía Montserrat en toda la interfaz.', 'Si tenía un botón naranja de aceptar, use <code>mg-btn</code> (azul).'),
        ('cambio', '<b>Compatibilidad</b>: los estilos de base (<code>.mg-base</code>) pasaron a especificidad cero; los controles sin clase vencen al «preflight» de Tailwind; nuevo <code>gob.layer.css</code> para Tailwind v4 / PrimeNG con capas.', 'Con Tailwind v4 cargue <code>gob.layer.css</code> primero. Ver <a href="componentes/compatibilidad.html">compatibilidad</a>.'),
        ('cambio', 'Etiquetas del menú lateral oscuro (<code>mg-sidebar__label</code>) con mayor contraste (accesibilidad AA).', ''),
        ('docs', 'Nueva guía para agentes de IA, página de compatibilidad, y esta página de novedades con <code>version.json</code>.', ''),
    ]),
    ('0.4.0', '2026-10-15', [
        ('nuevo', 'Componentes <code>gob-linea-tiempo</code>, <code>gob-pasos</code>, <code>gob-selector</code>, <code>gob-fecha</code>, <code>gob-archivos</code>, <code>gob-avatar</code>, <code>gob-arbol</code>, <code>gob-kanban</code>, <code>gob-menu</code>, <code>gob-tooltip</code>, <code>gob-paginador</code>.', 'Nada: se cargan solos al usar la etiqueta.'),
        ('nuevo', '<code>gob-grafica</code>: embudo, calendario de actividad y cronograma Gantt (14 tipos).', ''),
        ('nuevo', 'Formularios nativos con la marca (<code>.mg-base</code>/<code>.mg-forms</code>), envoltorios para Angular/React/Next (<code>cdn/v1/wrappers/</code>), demo Mesa de ayuda.', 'Copie de nuevo los envoltorios si ya los usaba.'),
    ]),
    ('0.3.0', '2026-10-01', [
        ('nuevo', '<code>gob-tabla</code>, <code>gob-dashboard</code>, <code>gob-kpi</code>, <code>gob-pestanas</code>, <code>gob-modal</code>/<code>gob-alerta</code>/<code>gob.toast()</code>, íconos <code>gob-icono</code>, Estudios de tablas y dashboards, tipografía Montserrat autohospedada.', ''),
    ]),
]

ETIQUETA = {'nuevo': ('Nuevo', 'mg-badge--green'), 'cambio': ('Cambio', 'mg-badge--yellow'), 'arreglo': ('Arreglo', 'mg-badge'), 'docs': ('Docs', 'mg-badge--gray')}


def quitar_html(t):
    import re
    return re.sub(r'<[^>]+>', '', t).replace('&lt;', '<').replace('&gt;', '>')


def anuncio():
    return f'''📣 Actualización del sistema de diseño de la Gobernación (v{VERSION})

Ya está disponible la versión {VERSION} de los componentes y el manual de marca: {BASE}/novedades.html

Lo nuevo:
• Login y casos de acceso (recuperar contraseña, 2 pasos, registro, estados) con el modelo GEDIS.
• Panel de gestión con menú lateral fijo, tarjetas, listados y tablas.
• Acordeones, pestañas y formularios con etiqueta flotante.

Qué debe hacer cada uno:
1) Si usa el CDN: use la URL con CORS https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@v{VERSION}/cdn/v1/ (el dominio {BASE} aún no permite cargarlo desde otros sitios). Cambie @v{VERSION} cuando quiera subir de versión.
2) Si tiene copia local (zip): descargue {BASE}/dist/downloads/gob-cdn-v1.zip y reemplace su carpeta cdn/v1.
3) Si copió envoltorios o plantillas: revise la sección «Cómo actualizar» en la página de novedades.
Para los logins nuevos use el esqueleto de {BASE}/demos/index.html#acceso

Con un asistente de IA: «Lee {BASE}/novedades.html y actualiza este proyecto a la versión {VERSION} del sistema de diseño.»'''


def build(root, page, code):
    # version.json (máquina) + CHANGELOG.md
    cambios = [{'tipo': t, 'texto': quitar_html(x), 'accion': quitar_html(a)} for t, x, a in VERSIONES[0][2]]
    vj = {'nombre': 'gob-*', 'version': VERSION, 'fecha': FECHA, 'novedades': BASE + '/novedades.html', 'changelog': BASE + '/CHANGELOG.md', 'guiaIA': BASE + '/docs/ia/gob-componentes.md', 'cambios': cambios,
          'versiones': [{'version': v, 'fecha': f} for v, f, _ in VERSIONES]}
    cdn = os.path.join(root, 'cdn', 'v1')
    os.makedirs(cdn, exist_ok=True)
    with open(os.path.join(cdn, 'version.json'), 'w', encoding='utf-8', newline='\n') as f:
        json.dump(vj, f, ensure_ascii=False, indent=2)
    md = ['# Novedades del sistema de diseño gob-*', '', f'Última versión: **{VERSION}** ({FECHA}) · {BASE}/novedades.html', '']
    for v, f, items in VERSIONES:
        md += [f'## {v} — {f}', '']
        for t, x, a in items:
            md.append(f'- **{ETIQUETA[t][0]}**: {quitar_html(x)}' + (f' _Acción: {quitar_html(a)}_' if a else ''))
        md.append('')
    with open(os.path.join(root, 'CHANGELOG.md'), 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(md))

    # página
    hist = ''
    for v, f, items in VERSIONES:
        filas = ''.join(f'<li style="margin:.55rem 0"><span class="mg-badge {ETIQUETA[t][1]}">{ETIQUETA[t][0]}</span> {x}' + (f'<br><small style="color:var(--mg-text-muted)">➜ <b>Qué hacer:</b> {a}</small>' if a else '') + '</li>' for t, x, a in items)
        hist += f'<section class="pt-section" id="v{v.replace(".", "-")}"><h2><span class="n">v{v}</span> {f}</h2><ul style="list-style:none;padding:0;line-height:1.65">{filas}</ul></section>'
    a_texto = anuncio().replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    check = code('js', """// ¿Su proyecto tiene la última versión? (opcional, para desarrollo)
import('https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@main/cdn/v1/gob.js').then(async () => {
  const actual = window.gob?.version;                      // versión que está cargando su página
  const ult = await fetch('https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@main/cdn/v1/version.json', { cache: 'no-store' }).then((r) => r.json());
  if (actual !== ult.version) console.warn(`gob-* ${actual} → disponible ${ult.version}: ${ult.novedades}`);
});""", 'Comprobar versión')
    modos = f'''<table class="mg-table" style="margin:0"><thead><tr><th>Cómo lo usa</th><th>Qué hacer para actualizar</th><th>Cómo verificar</th></tr></thead><tbody>
<tr><td><b>CDN con CORS</b> <code>https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@v{VERSION}/cdn/v1/</code> (recomendado)</td><td>Cambie el número de versión de la URL (<code>@v{VERSION}</code>) en <code>gob.css</code> y <code>gob.js</code>; la versión 1 es compatible hacia atrás. Con <code>@main</code> se recibe lo último, pero jsDelivr lo guarda hasta 12 h.</td><td><code>gob.version</code> en la consola → <code>{VERSION}</code></td></tr>
<tr><td><b>Copia local</b> (<code>gob-cdn-v1.zip</code>)</td><td>Descargue el zip nuevo, <b>reemplace completa</b> la carpeta <code>cdn/v1</code> (los archivos cambian de nombre; no mezcle versiones) y mantenga la misma ruta.</td><td><code>cdn/v1/version.json</code></td></tr>
<tr><td><b>Envoltorios</b> React/Angular copiados</td><td>Solo si el changelog lo indica: vuelva a copiar <code>react.jsx</code> / <code>gob-angular.ts</code> desde <code>cdn/v1/wrappers/</code>.</td><td>El proyecto compila y los eventos siguen llegando</td></tr>
<tr><td><b>Plantillas copiadas de los demos</b> (login, panel…)</td><td>Los demos no se actualizan solos: compare su pantalla con el demo nuevo (<b>Guías de código → Copiar sección</b>) y reemplace los bloques cambiados. Las clases <code>mg-*</code> nuevas llegan con <code>gob.css</code>.</td><td>Revise la pantalla en móvil y con teclado</td></tr>
<tr><td><b>Tailwind v4 / PrimeNG con capas</b></td><td>Cambie a <code>gob.layer.css</code> (cárguelo primero).</td><td>Una utilidad (<code>text-sm</code>) gana sobre gob</td></tr>
<tr><td><b>npm</b> (cuando se publique el paquete)</td><td><code>npm update @gobmagdalena/ui</code></td><td><code>npm ls @gobmagdalena/ui</code></td></tr></tbody></table>'''
    ia_p = f'Lee {BASE}/novedades.html y {BASE}/CHANGELOG.md y actualiza este proyecto a la versión {VERSION} del sistema de diseño gob-*: aplica las acciones indicadas, reemplaza los bloques de las plantillas que hayan cambiado comparándolos con los demos de {BASE}/demos/ y verifica en el navegador que no haya errores.'.replace('<', '&lt;')
    body = f'''<p class="pt-lead">Versión actual: <b>v{VERSION}</b> ({FECHA}). Aquí se publica cada cambio con <b>qué hacer</b> para aplicarlo. Archivo para máquinas: <a href="cdn/v1/version.json">version.json</a> · <a href="CHANGELOG.md">CHANGELOG.md</a>.</p>
<section class="pt-section" id="como"><h2><span class="n">00.</span> Cómo actualizar</h2>{modos}
<h3 style="margin-top:1.5rem">Con un asistente de IA</h3><div class="code"><div class="code__bar"><span>Instrucción</span><button data-codecopy>Copiar</button></div><pre tabindex="0"><code>{ia_p}</code></pre></div>
<h3 style="margin-top:1.5rem">Comprobar si hay una versión nueva</h3>{check}</section>
{hist}
<section class="pt-section" id="anuncio"><h2><span class="n">99.</span> Mensaje para avisar al equipo</h2><p class="pt-lead">Texto listo para enviar por correo, WhatsApp o Teams cuando se publique una versión.</p><div class="code"><div class="code__bar"><span>Anuncio v{VERSION}</span><button data-codecopy>Copiar</button></div><pre tabindex="0"><code>{a_texto}</code></pre></div></section>'''
    page(root, 'novedades.html', 'Novedades y cómo actualizar', f'Versión {VERSION} del sistema de diseño: qué cambió y qué debe hacer cada proyecto para actualizarse.', body)
