"""Documentación de <gob-grafica> (componentes/gob-grafica.html)."""
from site_mapa import tabla

PROPS = [
    ('tipo', 'tipo', "'barras' | 'barras-horizontal' | 'lineas' | 'area' | 'torta' | 'dona' | 'radar' | 'gauge' | 'mapa-calor' | 'treemap' | 'sankey' | 'embudo' | 'calendario' | 'gantt'", "'barras'", 'Tipo de gráfica.'),
    ('datos', 'datos (JSON)', 'según el tipo (ver tabla de formatos)', '—', 'Los datos. Siempre por propiedad o atributo JSON.'),
    ('colores', 'colores', "string | string[]", "'institucional'", 'Paleta: <code>institucional, azules, calida, semaforo, neutra</code> o lista de colores HEX.'),
    ('titulo / subtitulo', 'titulo / subtitulo', 'string', '—', 'Encabezado dentro de la gráfica (también es el nombre accesible).'),
    ('leyenda', 'leyenda', 'boolean', 'true', 'Muestra la leyenda (desactivar solo por propiedad: <code>g.leyenda = false</code>).'),
    ('leyendaPosicion', 'leyenda-posicion', "'arriba' | 'abajo' | 'derecha'", "'arriba'", 'Posición de la leyenda.'),
    ('etiquetas', 'etiquetas', 'boolean', 'false', 'Etiquetas con el valor en cada barra, punto, sector o celda.'),
    ('apilado', 'apilado', 'boolean', 'false', 'Apila series (barras y áreas).'),
    ('suave', 'suave', 'boolean', 'false', 'Líneas suavizadas.'),
    ('formato', 'formato', "'numero' | 'compacto' | 'cop' | 'porcentaje'", "'numero'", 'Formato es-CO de valores, ejes y tooltips (<code>cop</code>: pesos; <code>porcentaje</code>: 0–1).'),
    ('unidad', 'unidad', 'string', '—', 'Sufijo («hab.», «%»).'),
    ('tituloEjeX / tituloEjeY', 'titulo-eje-x / titulo-eje-y', 'string', '—', 'Títulos de ejes (gráficas cartesianas).'),
    ('umbrales', 'umbrales (JSON)', '[fracción, color][]', '—', 'Indicador (gauge): color según la fracción del rango. Ej.: <code>[[0.5,"#F7003C"],[0.8,"#FEC800"],[1,"#69B75E"]]</code>.'),
    ('min / max', 'min / max', 'number', '0 / 100', 'Rango del indicador.'),
    ('centro', 'centro', 'string', 'total', 'Texto central de la dona.'),
    ('patrones', 'patrones', 'boolean', 'false', 'Patrones además del color (ayuda con daltonismo y blanco/negro).'),
    ('animacion', 'animacion', 'boolean', 'true', 'Animación de entrada; se desactiva sola con <code>prefers-reduced-motion</code>.'),
    ('tema', 'tema', "'claro' | 'oscuro'", "'claro'", 'Tema (<code>gob</code> / <code>gob-oscuro</code>).'),
    ('altura', 'altura', 'number (px)', '360', 'Altura; el ancho es el de su contenedor.'),
    ('descripcion', 'descripcion', 'string', '—', 'Descripción larga para lectores de pantalla.'),
    ('config', '—', 'objeto', '—', 'Asigna varias propiedades a la vez.'),
]
FORMATOS = [
    ('barras, barras-horizontal, lineas, area, radar', '<code>{ categorias: ["Ene","Feb"], series: [{ nombre: "A", valores: [10, 20] }] }</code> o, para una sola serie, <code>[{ nombre, valor }]</code>'),
    ('embudo', '<code>[{ nombre: "Visitas", valor: 5000 }, …]</code> (de mayor a menor etapa)'),
    ('calendario', '<code>[{ fecha: "2026-05-01", valor: 12 }, …]</code> (actividad diaria; muestra hasta 12 meses)'),
    ('gantt', '<code>[{ nombre, inicio: "2026-01-05", fin: "2026-02-15", avance?: 0.4, grupo? }]</code> (fechas ISO; <code>avance</code> de 0 a 1; <code>grupo</code> cambia el color)'),
    ('torta, dona, treemap', '<code>[{ nombre: "Norte", valor: 420 }]</code> (treemap admite <code>hijos: [...]</code>)'),
    ('gauge', '<code>{ valor: 72, nombre: "Avance" }</code> o solo el número'),
    ('mapa-calor', '<code>{ x: ["Lun","Mar"], y: ["8h","10h"], valores: [[xi, yi, valor], …] }</code>'),
    ('sankey', '<code>{ nodos: ["Nación","Salud"], enlaces: [{ origen: "Nación", destino: "Salud", valor: 40 }] }</code>'),
]
EVENTOS = [('gob-grafica-click', '{ nombre, serie, valor, indice, tipo }', 'Clic en una barra, punto, sector, celda o nodo.'), ('gob-grafica-lista', '—', 'Primera vez que la gráfica terminó de dibujarse.')]
METODOS = [('descargarPNG(nombre?, escala?)', 'Descarga la gráfica como PNG (escala 2).'), ('descargarCSV(nombre?)', 'Descarga los datos en CSV (UTF-8, separador «;»).'), ('csv()', 'Devuelve el CSV como texto.'), ('imprimir()', 'Abre el diálogo de impresión.')]


def build(root, page, code):
    demo = '''<div class="demo"><div class="demo__view demo__view--white"><div class="mg-grid" style="--mg-col:20rem">
<gob-grafica id="d1" tipo="barras" titulo="Radicados por mes" altura="280"></gob-grafica>
<gob-grafica id="d2" tipo="dona" titulo="Por subregión" leyenda-posicion="abajo" altura="280"></gob-grafica></div>
<p class="mg-help" id="evt" style="font-family:var(--mg-font-mono)">Haga clic en una barra o sector…</p></div></div>
<script type="module">
import '../cdn/v1/gob.js';
const m = ['Ene','Feb','Mar','Abr','May','Jun'];
d1.datos = { categorias: m, series: [{ nombre: 'Resueltos', valores: [78,100,123,56,79,102] }, { nombre: 'Pendientes', valores: [114,47,70,93,116,49] }] };
d2.datos = [{ nombre: 'Santa Marta', valor: 560 }, { nombre: 'Norte', valor: 420 }, { nombre: 'Río', valor: 310 }, { nombre: 'Centro', valor: 240 }, { nombre: 'Sur', valor: 180 }];
for (const g of [d1, d2]) g.addEventListener('gob-grafica-click', (e) => { document.getElementById('evt').textContent = 'gob-grafica-click → ' + JSON.stringify({ nombre: e.detail.nombre, serie: e.detail.serie, valor: e.detail.valor }); });
</script>'''
    cdn_html = code('html', '''<script type="module" src="__BASE__/cdn/v1/gob.js"></script>

<gob-grafica id="g" tipo="barras" titulo="Casos por municipio" etiquetas></gob-grafica>

<script type="module">
  const g = document.getElementById('g');
  g.datos = [{ nombre: 'Santa Marta', valor: 120 }, { nombre: 'Ciénaga', valor: 80 }];
  g.addEventListener('gob-grafica-click', (e) => console.log(e.detail));
</script>''', 'HTML plano (sin build)', tpl=True)
    ng = code('ts', '''// index.html:  <script type="module" src="__BASE__/cdn/v1/gob.js"></script>
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-grafica', standalone: true, schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<gob-grafica tipo="dona" titulo="Por subregión" [datos]="datos"
               (gob-grafica-click)="alClic($event)"></gob-grafica>`,
})
export class GraficaComponent {
  datos = [{ nombre: 'Norte', valor: 420 }, { nombre: 'Sur', valor: 180 }];
  alClic(e: Event) { console.log((e as CustomEvent).detail); }
}''', 'Angular (CUSTOM_ELEMENTS_SCHEMA)', tpl=True)
    react = code('jsx', '''\'use client\'; // Next.js: solo cliente
import { useEffect, useRef } from 'react';

export default function Grafica({ datos }) {
  const ref = useRef(null);
  useEffect(() => { import(/* webpackIgnore: true */ '__BASE__/cdn/v1/gob.js'); }, []);
  useEffect(() => { if (ref.current) ref.current.config = { tipo: 'lineas', suave: true, datos }; }, [datos]);
  return <gob-grafica ref={ref} />;
}''', 'React / Next.js', tpl=True)
    nest = code('ts', '''// NestJS + Prisma: serie mensual lista para <gob-grafica>
@Get('radicados-por-mes')
async porMes() {
  const filas = await this.prisma.$queryRaw<{ mes: string; estado: string; total: bigint }[]>`
    SELECT to_char(fecha, 'Mon') AS mes, estado, COUNT(*) AS total FROM radicados GROUP BY 1, 2`;
  const meses = [...new Set(filas.map((f) => f.mes))];
  const estados = [...new Set(filas.map((f) => f.estado))];
  return { data: {
    categorias: meses,
    series: estados.map((e) => ({ nombre: e, valores: meses.map((m) => Number(filas.find((f) => f.mes === m && f.estado === e)?.total ?? 0)) })),
  }, meta: { actualizado: new Date().toISOString() } };
}

// Frontend:  grafica.datos = (await fetch('/api/radicados-por-mes').then(r => r.json())).data;''', 'API NestJS → gráfica')
    css_ej = code('css', '''gob-grafica { --gob-fuente: 'Montserrat', sans-serif; }
/* El color de series se define con la propiedad "colores" (paleta o lista de HEX), no con CSS. */''', 'Ejemplo')
    body = f'''
<p class="pt-lead">Gráficas con la identidad visual, basadas en Apache ECharts (carga perezosa): 11 tipos, paleta y tema de la Gobernación, alternativa accesible en texto y exportación a PNG/CSV. <a href="../estudio/graficas.html"><b>Configúrela visualmente en el Estudio de gráficas →</b></a></p>

<section class="pt-section"><h2><span class="n">01.</span> Demo en vivo</h2>{demo}</section>

<section class="pt-section"><h2><span class="n">02.</span> Cuándo usarla y cuándo no</h2>
<div class="dont"><div class="ok"><b>✔ Usar para</b><br>Indicadores, tendencias, distribuciones, comparativos y tableros en cualquier framework o HTML plano. Siempre con la paleta institucional y accesible.</div>
<div class="no"><b>✘ No usar para</b><br>Más de ~8 series en una misma gráfica, tortas con muchas categorías (use barras), ni analítica estadística avanzada. Para tablas de datos use PrimeNG/<code>gob-tabla</code>.</div></div></section>

<section class="pt-section"><h2><span class="n">03.</span> Instalación</h2>
<div class="baseurl"><b>URL base:</b><input class="mg-input" id="baseInput" aria-label="URL base"><button class="mg-btn mg-btn--ghost mg-btn--sm" id="baseReset">Autodetectar</button></div>
{cdn_html}{ng}{react}
<div class="mg-alert mg-alert--info"><div><p class="mg-alert__title">Peso</p>El bundle base (<code>gob.js</code> + CSS) pesa ≈ 25 KB gzip. <b>ECharts (≈ 284 KB gzip, solo los tipos usados) se descarga únicamente</b> cuando aparece la primera gráfica; una página con solo mapa o con solo CSS no lo carga. Componente suelto: <code>/cdn/v1/components/gob-grafica.js</code>.</div></div></section>

<section class="pt-section"><h2><span class="n">04.</span> Propiedades</h2>{tabla(['Propiedad', 'Atributo', 'Tipo', 'Por defecto', 'Descripción'], [(f'<code>{a}</code>', f'<code>{b}</code>', f'<code>{c}</code>', d, e) for a, b, c, d, e in PROPS])}
<h3 style="margin-top:1.5rem">Formato de <code>datos</code></h3>{tabla(['Tipos', 'Formato'], FORMATOS)}</section>

<section class="pt-section"><h2><span class="n">05.</span> Eventos y métodos</h2>{tabla(['Evento', 'detail', 'Cuándo'], [(f'<code>{a}</code>', f'<code>{b}</code>', c) for a, b, c in EVENTOS])}
<h3 style="margin-top:1.5rem">Métodos</h3>{tabla(['Método', 'Descripción'], [(f'<code>{a}</code>', b) for a, b in METODOS])}
<h3 style="margin-top:1.5rem">Estilo</h3>{css_ej}<p class="mg-help">Partes: <code>::part(grafica)</code> (contenedor) y <code>::part(lienzo)</code> (canvas).</p></section>

<section class="pt-section"><h2><span class="n">06.</span> Integración con una API NestJS</h2><p class="pt-lead">La API devuelve los datos ya agregados; el componente solo dibuja. Formato de respuesta recomendado: <code class="inline">{{ data, meta }}</code>.</p>{nest}</section>

<section class="pt-section"><h2><span class="n">07.</span> Accesibilidad</h2>
<ul style="line-height:1.9;color:var(--mg-gray-700)"><li>Contenedor con <code>role="img"</code> y nombre accesible (título + descripción) y <b>tabla de datos equivalente</b> oculta visualmente para lectores de pantalla.</li>
<li>Descripción automática de ECharts (<code>aria</code>) y opción <code>patrones</code> para no depender solo del color.</li>
<li><code>prefers-reduced-motion</code> desactiva la animación. Los tooltips y etiquetas repiten los valores; el CSV es la alternativa para analizar los datos.</li>
<li>La paleta institucional alterna tonos claros y oscuros contiguos; para texto sobre las series use <code>etiquetas</code> solo en gráficas apiladas oscuras o con la paleta <code>azules</code>.</li></ul></section>

<section class="pt-section"><h2><span class="n">08.</span> Licencias</h2><p class="pt-lead">Apache ECharts 6 (<b>Apache-2.0</b>, con archivo NOTICE) y ZRender (BSD-3-Clause). Registro completo en <code class="inline">LICENSES.md</code>.</p></section>
'''
    page(root, 'componentes/gob-grafica.html', 'gob-grafica', 'Gráficas con la identidad visual: barras, líneas, áreas, torta, dona, radar, indicador, mapa de calor, treemap, sankey, embudo, calendario de actividad y cronograma Gantt.', body, active='componentes.html')
