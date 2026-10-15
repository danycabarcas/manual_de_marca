"""Página de documentación de <gob-mapa-magdalena> (componentes/gob-mapa-magdalena.html)."""
import html

E = html.escape

PROPS = [
    ('detalle', 'detalle', "'alto' | 'medio' | 'bajo'", "'medio'", 'Nivel de detalle de los límites (164 / 69 / 34 KB). Use «bajo» en tarjetas pequeñas.'),
    ('modo', 'modo', "'subregiones' | 'coropleta' | 'categorias' | 'plano'", "'subregiones'", 'Qué representa el color de cada municipio.'),
    ('datos', 'datos (JSON)', 'Record<codigo, number>', '—', 'Valores por código DIVIPOLA (modo coropleta). Ej.: <code>{"47001": 120500}</code>.'),
    ('categorias', 'categorias (JSON)', 'Record<codigo, string>', '—', 'Categoría de cada municipio (modo categorias).'),
    ('coloresCategorias', 'colores-categorias (JSON)', 'Record<string, color>', '—', 'Color de cada categoría; también define la leyenda.'),
    ('coloresSubregiones', 'colores-subregiones (JSON)', 'Record<id, color>', 'oficiales', 'Sobrescribe el color de una subregión (<code>sm</code>, <code>no</code>, <code>ri</code>, <code>ce</code>, <code>su</code>).'),
    ('rampa', 'rampa', 'string | string[]', "'azul'", 'Rampa de la coropleta: nombre (<code>azul, cian, verde, amarillo, rojo, violeta, divergente, gris</code>) o lista de colores.'),
    ('clases', 'clases', 'number', '5', 'Número de rangos de la coropleta.'),
    ('escala', 'escala', "'lineal' | 'cuantiles'", "'lineal'", 'Cómo se calculan los cortes de las clases.'),
    ('etiquetas', 'etiquetas', "'ninguna' | 'nombres' | 'codigos' | 'valores' | 'nombres-valores'", "'ninguna'", 'Texto sobre cada municipio.'),
    ('etiquetasAuto', 'etiquetas-auto', 'boolean', 'true', 'Oculta las etiquetas que no caben (se muestran al acercar).'),
    ('leyenda', 'leyenda', 'boolean', 'true', 'Muestra la leyenda. En subregiones es interactiva (filtra).'),
    ('leyendaTitulo', 'leyenda-titulo', 'string', '—', 'Título de la leyenda.'),
    ('tooltip', 'tooltip', 'boolean', 'true', 'Tooltip al pasar el cursor o enfocar con teclado.'),
    ('tooltipFormato', 'tooltip-formato', 'string (HTML)', '&lt;strong&gt;{nombre}&lt;/strong&gt;…', 'Plantilla con <code>{nombre} {codigo} {subregion} {valor} {categoria}</code>. Los valores se escapan.'),
    ('seleccion', 'seleccion', 'string', "''", 'Códigos seleccionados separados por coma. Se refleja en el atributo.'),
    ('multiple', 'multiple', 'boolean', 'false', 'Permite seleccionar varios municipios.'),
    ('clic', 'clic', "'seleccionar' | 'zoom' | 'zoom-seleccionar' | 'evento' | 'enlace'", "'seleccionar'", 'Acción al hacer clic. «evento» solo emite <code>gob-municipio-click</code>.'),
    ('enlace', 'enlace', 'string', '—', 'URL para <code>clic="enlace"</code>; admite <code>{codigo}</code> y <code>{nombre}</code>.'),
    ('marcadores', 'marcadores (JSON)', 'Marcador[]', '—', 'Puntos sobre el mapa (ver tabla de marcador).'),
    ('lineas', 'lineas (JSON)', 'Linea[]', '—', 'Rutas entre municipios o coordenadas (ver tabla de línea).'),
    ('efectos', 'efectos', 'string[]', "['entrada']", '<code>entrada</code>, <code>hormigas</code>, <code>ping-seleccion</code>, <code>foco</code>. Se desactivan con <code>prefers-reduced-motion</code>.'),
    ('tema', 'tema', "'claro' | 'oscuro'", "'claro'", 'Tema del mapa (reflejado como atributo).'),
    ('zoom', 'zoom', 'boolean', 'true', 'Arrastre, pellizco y zoom.'),
    ('zoomRueda', 'zoom-rueda', 'boolean', 'false', 'Zoom con la rueda sin tecla (por defecto requiere Ctrl/⌘ para no secuestrar el scroll).'),
    ('controles', 'controles', 'boolean', 'true', 'Botones + − ⌂.'),
    ('titulo / descripcion', 'titulo / descripcion', 'string', '—', 'Nombre accesible del mapa y descripción larga (<code>&lt;title&gt;</code>/<code>&lt;desc&gt;</code>).'),
    ('formato / unidad', 'formato / unidad', "'numero' | 'cop' | 'porcentaje' / string", "'numero'", 'Formato es-CO de los valores y unidad opcional («hab.», «ha»).'),
    ('filtroSubregion', 'filtro-subregion', 'string', '—', 'Atenúa los municipios que no pertenecen a la subregión.'),
    ('mostrarContorno', 'mostrar-contorno', 'boolean', 'true', 'Contorno departamental.'),
    ('srcDatos', 'src-datos', 'string (URL)', 'junto al script', 'Carpeta de <code>magdalena-municipios.*.json</code> si se aloja en otro lugar.'),
    ('config', '—', 'objeto', '—', 'Asigna varias propiedades a la vez: <code>mapa.config = { modo: \'coropleta\', datos }</code>.'),
]
MARCADOR = [('codigo / lonlat', 'Municipio (DIVIPOLA) o [longitud, latitud]'), ('nombre, categoria', 'Texto del tooltip y de la leyenda'), ('icono', 'punto, cruz, escuela, edificio, alerta, gota, estrella, bandera, casa, rayo, vehiculo, persona, escudo'),
             ('color, tamano', 'Color y diámetro en px'), ('efecto', 'ninguno · pulso · ping · radar'), ('etiqueta', 'true muestra el nombre bajo el punto'), ('valor, url', 'Valor para el tooltip; url abre al hacer clic')]
LINEA = [('desde / hasta', 'Código DIVIPOLA o [lon, lat]'), ('estilo', 'solido · guion · flujo (animada) · dibujar (se traza)'), ('color, ancho', 'Color y grosor en px'), ('curva', 'Curvatura (−0.6 a 0.6)'), ('particulas', 'true: puntos que viajan por la ruta'), ('etiqueta', 'Texto opcional')]
EVENTOS = [('gob-mapa-listo', '—', 'Datos geográficos cargados y mapa dibujado.'), ('gob-municipio-click', '{ codigo, nombre, subregion, valor, categoria, originalEvent }', 'Clic o Enter/Espacio sobre un municipio.'),
           ('gob-municipio-hover', 'igual que el anterior', 'Cursor o foco sobre un municipio.'), ('gob-marcador-click', '{ …marcador, indice }', 'Clic en un marcador.'), ('gob-seleccion-cambio', '{ seleccion: string[] }', 'Cambió la selección.')]
METODOS = [('zoomA(codigo)', 'Acerca el mapa a un municipio con animación.'), ('reiniciar()', 'Vuelve a la vista completa.'), ('exportarSVG()', 'Devuelve un SVG estático (sin animaciones).'), ('descargarSVG(nombre?)', 'Descarga el SVG.'), ('descargarPNG(nombre?, escala?)', 'Descarga un PNG (escala 2 por defecto).'), ('imprimir()', 'Abre el diálogo de impresión (los controles se ocultan).')]
PARTES = [('mapa', 'Contenedor'), ('contorno', 'Línea departamental'), ('municipio', 'Cada municipio (<code>::part(municipio)</code>)'), ('etiqueta', 'Grupo de etiquetas'), ('marcador', 'Marcadores'), ('linea', 'Rutas'), ('leyenda', 'Panel de leyenda'), ('tooltip', 'Tooltip'), ('controles', 'Botones de zoom')]
VARS = [('--gob-mapa-relleno', 'Relleno en modo «plano»'), ('--gob-mapa-sin-dato', 'Municipios sin valor'), ('--gob-mapa-borde', 'Borde entre municipios'), ('--gob-mapa-contorno', 'Contorno departamental'), ('--gob-mapa-sel', 'Borde de hover/selección'),
        ('--gob-mapa-texto', 'Color de etiquetas'), ('--gob-mapa-fondo', 'Fondo'), ('--gob-mapa-tip-bg / -fg', 'Tooltip'), ('--gob-mapa-panel / -panel-fg / -panel-borde', 'Leyenda y controles'), ('--gob-fuente', 'Tipografía')]


def tabla(cab, filas, cls='mg-table'):
    th = ''.join(f'<th>{c}</th>' for c in cab)
    tr = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in f) + '</tr>' for f in filas)
    return f'<div class="tablewrap"><table class="{cls}"><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table></div>'


def build(root, page, code):
    demo = '''<div class="demo"><div class="demo__view demo__view--white"><div style="max-width:560px"><gob-mapa-magdalena id="demo" modo="coropleta" etiquetas="valores" leyenda-titulo="Habitantes (ejemplo)" unidad="hab." efectos="entrada,hormigas" seleccion="47189"></gob-mapa-magdalena></div><p class="mg-help" id="evt" style="font-family:var(--mg-font-mono)">Haga clic en un municipio…</p></div></div>
<script type="module">
import '../cdn/v1/gob.js';
const m = document.getElementById('demo');
const cod = ['47001','47030','47053','47058','47161','47170','47189','47205','47245','47258','47268','47288','47318','47460','47541','47545','47551','47555','47570','47605','47660','47675','47692','47703','47707','47720','47745','47798','47960','47980'];
let x = 5; const r = () => (x = (x * 9301 + 49297) % 233280) / 233280;
m.datos = Object.fromEntries(cod.map((c) => [c, Math.round(5000 + r() * 95000)]));
m.addEventListener('gob-municipio-click', (e) => { document.getElementById('evt').textContent = 'gob-municipio-click → ' + JSON.stringify({codigo: e.detail.codigo, nombre: e.detail.nombre, valor: e.detail.valor}); });
</script>'''
    cdn_html = code('html', '''<script type="module" src="__BASE__/cdn/v1/gob.js"></script>

<gob-mapa-magdalena id="mapa" modo="coropleta" etiquetas="nombres" leyenda-titulo="Casos"></gob-mapa-magdalena>

<script type="module">
  const mapa = document.getElementById('mapa');
  mapa.datos = { '47001': 120, '47189': 80, '47980': 45 };          // código DIVIPOLA → valor
  mapa.addEventListener('gob-municipio-click', (e) => console.log(e.detail));
</script>''', 'HTML plano (sin build)', tpl=True)
    ng = code('ts', '''// index.html:  <script type="module" src="__BASE__/cdn/v1/gob.js"></script>
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-mapa', standalone: true, schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<gob-mapa-magdalena modo="coropleta" etiquetas="nombres"
               [datos]="datos" (gob-municipio-click)="alClic($event)"></gob-mapa-magdalena>`,
})
export class MapaComponent {
  datos = { '47001': 120, '47189': 80 };
  alClic(e: Event) { console.log((e as CustomEvent).detail); }
}''', 'Angular (CUSTOM_ELEMENTS_SCHEMA)', tpl=True)
    react = code('jsx', '''\'use client\'; // Next.js: solo cliente
import { useEffect, useRef } from 'react';

export default function Mapa({ datos, onMunicipio }) {
  const ref = useRef(null);
  useEffect(() => { import(/* webpackIgnore: true */ '__BASE__/cdn/v1/gob.js'); }, []);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.config = { modo: 'coropleta', datos };
    const h = (e) => onMunicipio?.(e.detail);
    el.addEventListener('gob-municipio-click', h);
    return () => el.removeEventListener('gob-municipio-click', h);
  }, [datos]);
  return <gob-mapa-magdalena ref={ref} etiquetas="nombres" />;
}''', 'React / Next.js', tpl=True)
    vue = code('html', '''<!-- vite.config.js → vue({ template: { compilerOptions: { isCustomElement: (t) => t.startsWith('gob-') } } }) -->
<gob-mapa-magdalena modo="coropleta" :datos.prop="datos" @gob-municipio-click="alClic" />''', 'Vue 3', tpl=False)
    nest = code('ts', '''// NestJS + Prisma (PostgreSQL/PostGIS): indicador agrupado por código DIVIPOLA
@Controller('indicadores')
export class IndicadoresController {
  constructor(private prisma: PrismaService) {}

  @Get('casos-por-municipio')
  async casos() {
    const filas = await this.prisma.$queryRaw<{ cod_mpio: string; total: bigint }[]>`
      SELECT cod_mpio, COUNT(*) AS total FROM casos GROUP BY cod_mpio`;
    // Respuesta estándar: { data, meta }
    return { data: filas.map((f) => ({ codigo: f.cod_mpio, valor: Number(f.total) })), meta: { total: filas.length, actualizado: new Date().toISOString() } };
  }
}

// Frontend (cualquier framework)
const { data } = await fetch('/api/indicadores/casos-por-municipio').then((r) => r.json());
mapa.datos = Object.fromEntries(data.map((d) => [d.codigo, d.valor]));   // el código es la llave, nunca el nombre''', 'API NestJS → mapa')
    cuando = '''<div class="dont"><div class="ok"><b>✔ Usar para</b><br>Indicadores por municipio o subregión, presencia territorial, rutas y conexiones, tableros y presentaciones. Funciona sin servidor de mapas, sin internet de terceros y es imprimible.</div>
<div class="no"><b>✘ No usar para</b><br>Mapas con calles, ruteo o geolocalización fina (se hará con MapLibre en una fase posterior), ni para datos por vereda (aún no hay geometría oficial).</div></div>'''
    datos = tabla(['Archivo (en <code>/cdn/v1/datos/</code>)', 'Contenido'], [
        ('municipios.csv · municipios.json', 'Catálogo: código DIVIPOLA, nombre, subregión, longitud, latitud (punto interior)'),
        ('subregiones.json', 'Subregiones con color institucional y municipios que las componen'),
        ('magdalena-municipios.{alto,medio,bajo}.json', 'Rutas SVG proyectadas (lo que usa el componente)'),
        ('magdalena-municipios.{alto,medio,bajo}.geojson', 'GeoJSON WGS84 con el código DANE (para otras herramientas)')])
    css_ej = code('css', '''gob-mapa-magdalena { --gob-mapa-relleno: #E3E8EF; --gob-mapa-sel: #0071BB; }
gob-mapa-magdalena::part(municipio):hover { filter: brightness(1.1); }''', 'Ejemplo')
    body = f'''
<p class="pt-lead">Mapa interactivo del departamento del Magdalena con sus 30 municipios, identificados por código DIVIPOLA. Es un Web Component (Lit) independiente del framework: se carga con una sola etiqueta <code class="inline">&lt;script type="module"&gt;</code>, pesa unos 18 KB gzip y no necesita servidor de mapas. <a href="../estudio/mapas.html"><b>Configúrelo visualmente en el Estudio de mapas →</b></a></p>

<section class="pt-section"><h2><span class="n">01.</span> Demo en vivo</h2>{demo}</section>

<section class="pt-section"><h2><span class="n">02.</span> Cuándo usarlo y cuándo no</h2>{cuando}</section>

<section class="pt-section"><h2><span class="n">03.</span> Instalación</h2>
<div class="baseurl"><b>URL base:</b><input class="mg-input" id="baseInput" aria-label="URL base"><button class="mg-btn mg-btn--ghost mg-btn--sm" id="baseReset">Autodetectar</button></div>
{cdn_html}{ng}{react}{vue}
<div class="mg-alert mg-alert--info"><div><p class="mg-alert__title">Paquete npm</p>El paquete privado <code>@gobmagdalena/ui</code> está definido en el monorepo (<code>packages/ui</code>) pero aún no se publica en un registro. Mientras tanto use el CDN <code>/cdn/v1/</code>. Componente bajo demanda: <code>/cdn/v1/components/gob-mapa-magdalena.js</code>.</div></div></section>

<section class="pt-section"><h2><span class="n">04.</span> Propiedades</h2>{tabla(['Propiedad', 'Atributo', 'Tipo', 'Por defecto', 'Descripción'], [(f'<code>{a}</code>', f'<code>{b}</code>', f'<code>{c}</code>', d, e) for a, b, c, d, e in PROPS])}
<p class="mg-help">Los atributos con (JSON) también se pueden asignar como propiedad del elemento. Los booleanos con valor por defecto <code>true</code> solo se desactivan por propiedad (<code>mapa.leyenda = false</code>).</p>
<h3 style="margin-top:1.5rem">Marcador</h3>{tabla(['Campo', 'Descripción'], [(f'<code>{a}</code>', b) for a, b in MARCADOR])}
<h3 style="margin-top:1.5rem">Línea / ruta</h3>{tabla(['Campo', 'Descripción'], [(f'<code>{a}</code>', b) for a, b in LINEA])}</section>

<section class="pt-section"><h2><span class="n">05.</span> Eventos y métodos</h2>{tabla(['Evento', 'detail', 'Cuándo'], [(f'<code>{a}</code>', f'<code>{b}</code>', c) for a, b, c in EVENTOS])}
<h3 style="margin-top:1.5rem">Métodos</h3>{tabla(['Método', 'Descripción'], [(f'<code>{a}</code>', b) for a, b in METODOS])}</section>

<section class="pt-section"><h2><span class="n">06.</span> Estilo: variables CSS y partes</h2>{tabla(['Variable', 'Efecto'], [(f'<code>{a}</code>', b) for a, b in VARS])}
<h3 style="margin-top:1.5rem">Partes (<code>::part()</code>)</h3>{tabla(['Parte', 'Elemento'], [(f'<code>{a}</code>', b) for a, b in PARTES])}
{css_ej}</section>

<section class="pt-section"><h2><span class="n">07.</span> Datos geográficos</h2>{datos}
<div class="mg-alert mg-alert--info"><div><p class="mg-alert__title">Origen y licencia</p>Los <b>códigos</b> son DIVIPOLA del DANE y la <b>geometría</b> es el Marco Geoestadístico Nacional (MGN) 2024 del DANE; ambos son datos abiertos (citar «DANE»). Las <b>subregiones</b> son la agrupación usada en las presentaciones del equipo y deben validarse con Planeación. Detalle, fechas y pasos para regenerar en <code>packages/datos/LICENCIAS.md</code>.</div></div></section>

<section class="pt-section"><h2><span class="n">08.</span> Integración con una API NestJS</h2>
<p class="pt-lead">La llave siempre es el código DIVIPOLA, nunca el nombre del municipio. Formato de respuesta recomendado: <code class="inline">{{ data: [{{ codigo, valor }}], meta }}</code>.</p>{nest}</section>

<section class="pt-section"><h2><span class="n">09.</span> Accesibilidad</h2>
<ul style="line-height:1.9;color:var(--mg-gray-700)"><li>Cada municipio es un botón enfocable (<code>Tab</code>, <code>Enter</code>/<code>Espacio</code>) con <code>aria-label</code> «Municipio, valor» y <code>aria-pressed</code> cuando está seleccionado.</li>
<li>Alternativa en texto: tabla oculta visualmente con código, municipio, subregión y valor para lectores de pantalla.</li>
<li>Foco visible, tooltip también al enfocar con teclado, y <code>prefers-reduced-motion</code> desactiva todas las animaciones.</li>
<li>El zoom con rueda requiere <kbd>Ctrl</kbd>/<kbd>⌘</kbd> para no interferir con el desplazamiento de la página; hay botones + − ⌂.</li>
<li>La información nunca depende solo del color: leyenda, etiquetas y tooltip repiten los valores. Impresión: <code>imprimir()</code> o <kbd>Ctrl</kbd>+<kbd>P</kbd> ocultan los controles.</li></ul></section>
'''
    page(root, 'componentes/gob-mapa-magdalena.html', 'gob-mapa-magdalena', 'Mapa interactivo del Magdalena por municipios (DIVIPOLA): coropleta, subregiones, categorías, marcadores, rutas animadas y efectos.', body, active='componentes.html')
