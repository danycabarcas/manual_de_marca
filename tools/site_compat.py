"""componentes/compatibilidad.html — convivencia de gob-* con Tailwind, PrimeNG/PrimeVue, Angular Material, Bootstrap…"""
from site_mapa import tabla
from site_comp import GOB


def build(root, page, code):
    ok = '<span class="mg-badge mg-badge--green">Probado</span>'
    dis = '<span class="mg-badge mg-badge--yellow">Por diseño</span>'
    matriz = tabla(['Con…', 'Resultado', 'Qué hacer'], [
        ('<b>Tailwind CSS v3</b>', ok + ' Las utilidades (<code>text-sm</code>, <code>border-4</code>, <code>rounded-none</code>, <code>bg-red-600</code>) <b>ganan</b> a gob en cualquier elemento con clase. Los controles sin clase siguen con la marca (incluso con el «preflight»).', 'Cargue <code>gob.css</code> en cualquier orden.'),
        ('<b>Tailwind CSS v4</b>', ok + ' Con <code>gob.layer.css</code> cargado <b>antes</b> de Tailwind: las utilidades ganan y los controles sin clase conservan la marca. Con <code>gob.css</code> (sin capa) el CSS sin capa le gana a las utilidades de v4.', 'Use <code>gob.layer.css</code> y póngalo primero (receta abajo).'),
        ('<b>PrimeNG / PrimeVue / PrimeReact</b>', ok + ' (PrimeVue 4.5.5 + Aura) Los <code>p-*</code> se ven <b>idénticos</b> con y sin <code>gob.css</code> (radio, relleno, colores, alto). gob solo estiliza los controles HTML sin clase.', 'Use <code>p-*</code> donde Prime tenga el componente y <code>gob-*</code> para lo que no tiene (tabla de decisión abajo).'),
        ('<b>Angular Material</b>', dis + ' Sus componentes llevan clases <code>mat-*</code>/<code>mdc-*</code> (excluidas de la capa nativa) y su CSS está encapsulado. Los <code>gob-*</code> viven en Shadow DOM. No se pisan. <i>No lo hemos probado todavía en una aplicación Angular real.</i>', 'No ponga <code>class="mg-base"</code> en <code>&lt;body&gt;</code> si usa la tipografía de Material; use <code>.mg-forms</code> solo en las zonas con HTML nativo.'),
        ('<b>Bootstrap 4/5, AdminLTE</b>', dis + ' Sus controles llevan <code>form-control</code>, <code>btn</code>, … (excluidos). Los <code>gob-*</code> no heredan su CSS.', 'Preferible usar el tema de este repositorio (<code>magdalena-bootstrap5.css</code>) para los componentes de Bootstrap.'),
        ('<b>MUI, Vuetify, Ant Design, Element</b>', dis + ' Excluidos por prefijo de clase (<code>Mui*</code>, <code>v-*</code>, <code>ant-*</code>, <code>el-*</code>).', 'Igual que Prime: su componente donde exista, <code>gob-*</code> para el resto.'),
        ('<b>Temas de WordPress / CSS propio</b>', dis + ' Todo en gob.css lleva prefijo <code>mg-</code>/<code>--mg-</code>/<code>--gob-</code>. Los efectos globales son opcionales (<code>.mg-base</code>, <code>.mg-forms</code>) y de especificidad cero.', 'Si choca el tipo de letra o el fondo, no use <code>mg-base</code>: use <code>mg-forms</code> o solo los <code>gob-*</code>.')])
    capas = code('css', """/* Tailwind v4 — en su CSS principal (el orden de los @import importa) */
@import url('https://manualdemarca.magdalena.gov.co/cdn/v1/gob.layer.min.css');   /* declara: theme, base, gob, primeng, components, utilities */
@import 'tailwindcss';

/* o en HTML: gob.layer.css ANTES de su hoja de Tailwind */
/* <link rel="stylesheet" href=".../cdn/v1/gob.layer.css"> <link rel="stylesheet" href="/css/app.css"> */""", 'Tailwind v4')
    prime = code('ts', """// PrimeNG 18–21 (app.config.ts): ponga a Prime en una capa para que el orden sea explícito
providePrimeNG({ theme: { preset: MagdalenaPreset, options: { cssLayer: { name: 'primeng', order: 'theme, base, gob, primeng, components, utilities' } } } });
// y cargue gob.layer.css (que ya declara ese mismo orden) en styles / index.html.

// PrimeVue 4:  app.use(PrimeVue, { theme: { preset: MagdalenaPreset, options: { cssLayer: { name: 'primeng', order: 'theme, base, gob, primeng, components, utilities' } } } });""", 'PrimeNG / PrimeVue')
    equiv = tabla(['Si necesita…', 'Con Prime instalado', 'Sin Prime', 'Nota'], [
        ('Tabla de datos', '<code>p-table</code>', '<code>gob-tabla</code>', 'Con Prime use la suya; gob-tabla es el estándar cuando no hay librería.'),
        ('Selector / multiselección', '<code>p-select</code>, <code>p-multiselect</code>', '<code>gob-selector</code>', ''),
        ('Fecha, rango', '<code>p-datepicker</code>', '<code>gob-fecha</code>', ''),
        ('Subir archivos', '<code>p-fileupload</code>', '<code>gob-archivos</code>', ''),
        ('Ventana modal, aviso, toast', '<code>p-dialog</code>, <code>p-toast</code>', '<code>gob-modal</code>, <code>gob.toast()</code>', ''),
        ('Pestañas, pasos, árbol, menú, paginador', '<code>p-tabs</code>, <code>p-stepper</code>, <code>p-tree</code>, <code>p-menu</code>, <code>p-paginator</code>', '<code>gob-pestanas</code>, <code>gob-pasos</code>, <code>gob-arbol</code>, <code>gob-menu</code>, <code>gob-paginador</code>', ''),
        ('Línea de tiempo', '<code>p-timeline</code>', '<code>gob-linea-tiempo</code>', ''),
        ('<b>Mapa del Magdalena, kanban, dashboard declarativo, KPI, Gantt, calendario de actividad, embudo, sankey, treemap</b>', '— (Prime no los tiene)', '<b>siempre <code>gob-*</code></b>', 'Aquí gob aporta lo que Prime no ofrece.')])
    body = f'''<p class="pt-lead">Respuesta corta: <b>conviven sin chocar</b>. Un control con clase (de Prime, Tailwind, Material o suya) <b>siempre prima</b> sobre gob; gob solo viste lo que no tiene clase, y sus componentes <code class="inline">gob-*</code> están aislados en Shadow DOM.</p>
<section class="pt-section"><h2><span class="n">01.</span> Cómo está construido para no chocar</h2>
<ol style="line-height:1.9;color:var(--mg-gray-700)"><li><b>Componentes <code>gob-*</code></b>: Shadow DOM. Ni el CSS de Tailwind/Prime/Bootstrap entra, ni el de gob sale. Lo único que atraviesa son variables (<code>--gob-*</code>) y la tipografía heredada.</li>
<li><b><code>gob.css</code></b>: todas las clases llevan prefijo <code>mg-</code> y todas las variables <code>--mg-</code>/<code>--gob-</code>. Los efectos globales (tipografía, fondo, encabezados, foco) son <b>opcionales</b> (<code>.mg-base</code> o <code>.mg-forms</code>) y de <b>especificidad cero</b>: cualquier regla suya las supera.</li>
<li><b>Controles HTML nativos</b>: los que <b>no tienen clase</b> se estilizan con especificidad normal (vencen al «preflight» de Tailwind); los que sí tienen clase solo reciben reglas de especificidad cero, y los de librerías (<code>p-*</code>, <code>mat-*</code>, <code>mdc-*</code>, <code>form-*</code>, <code>btn*</code>, <code>ant-*</code>, <code>Mui*</code>, <code>v-*</code>, <code>el-*</code>) quedan excluidos. <code>class="mg-nativo-off"</code> excluye uno a mano.</li></ol></section>
<section class="pt-section"><h2><span class="n">02.</span> Matriz de compatibilidad</h2>{matriz}
<p class="mg-help">«Probado» = verificado en el navegador con la librería real (Tailwind 3.4 y 4.1, PrimeVue 4.5.5). «Por diseño» = se deduce de las exclusiones y el encapsulamiento, sin prueba en una app real.</p></section>
<section class="pt-section"><h2><span class="n">03.</span> ¿Qué prima?</h2>
<table class="mg-table"><thead><tr><th>Situación</th><th>Gana</th></tr></thead><tbody>
<tr><td>Elemento con clase de Tailwind/Prime/propia vs. estilo nativo de gob</td><td><b>Su clase</b></td></tr>
<tr><td>Elemento HTML sin clase en <code>.mg-base</code>/<code>.mg-forms</code></td><td><b>gob</b> (vence incluso al preflight de Tailwind)</td></tr>
<tr><td>Dentro de un <code>&lt;gob-*&gt;</code> (Shadow DOM)</td><td><b>gob</b>; se personaliza con variables <code>--gob-*</code>, no con clases externas</td></tr>
<tr><td>Un <code>p-*</code> o <code>mat-*</code></td><td><b>Su librería</b> (el tema de este repositorio los pinta con los mismos colores)</td></tr>
<tr><td>Tipografía y fondo de la página</td><td>Quien declare <code>body</code> último, salvo que use <code>.mg-base</code> (cero especificidad: gana su CSS)</td></tr></tbody></table></section>
<section class="pt-section"><h2><span class="n">04.</span> Si ya tiene Prime: qué usar de cada uno</h2>{equiv}
<p class="mg-help">Regla: <b>no duplique</b> el mismo tipo de componente en una pantalla. Prime donde Prime tenga el suyo; gob para lo que no tiene. Ambos usan los mismos colores si aplica el preset <a href="../dist/primeng/magdalena-preset.ts">magdalena-preset</a>. Detalle de licencias y versiones en <a href="estandar.html">Estándar y licencias</a>.</p></section>
<section class="pt-section"><h2><span class="n">05.</span> Recetas</h2>{capas}{prime}
<ul style="line-height:1.9;color:var(--mg-gray-700);margin-top:1rem"><li><b>Capas CSS</b>: <code>gob.layer.css</code> es el mismo contenido en <code>@layer gob</code> (orden <code>theme, base, gob, primeng, components, utilities</code>): queda <b>por encima del preflight</b> y <b>por debajo de las utilidades y de Prime</b>. Si lo carga después de Tailwind v4 el orden ya está fijado: cárguelo siempre primero.</li>
<li><b>Capas de z-index</b>: los menús, selectores y calendarios de gob flotan en <code>z-index: 1000</code>; los overlays de Prime usan su propio z-index base (también ~1000). Si una pantalla mezcla ambos y se solapan, ajuste el <code>zIndex</code> de Prime en su configuración (las ventanas modales de gob usan la capa superior del navegador y no se solapan).</li></ul></section>
<section class="pt-section"><h2><span class="n">06.</span> Qué sí puede chocar</h2><ul style="line-height:1.9;color:var(--mg-gray-700)"><li>Dos hojas que fijan la tipografía/fondo de <code>body</code> (use <code>.mg-forms</code> en vez de <code>.mg-base</code>).</li><li><code>gob.css</code> sin capa + Tailwind v4 (use <code>gob.layer.css</code>).</li><li>Dos componentes del mismo tipo en la misma pantalla (elija uno).</li><li>Un CSS global agresivo del proyecto que apunte a <code>*</code> con <code>!important</code>: no entra al Shadow DOM, pero sí afecta a lo nativo.</li></ul></section>'''
    page(root, 'componentes/compatibilidad.html', 'Compatibilidad con Tailwind, Prime y otras librerías', 'Cómo conviven los componentes gob-* con Tailwind, PrimeNG/PrimeVue, Angular Material, Bootstrap y MUI; qué prima y recetas.', GOB + body, active='componentes.html')
