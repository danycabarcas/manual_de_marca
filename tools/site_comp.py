"""Páginas de documentación con ejemplos en vivo + código copiable:
   componentes/gob-tabla.html · gob-mensajes.html · gob-dashboard.html (KPI, pestañas, dashboard) · iconos.html"""
import json
import os
from site_mapa import tabla

PRELUDIO = '''<!-- ① Dependencias: TODO lo que hay que cargar (una vez por página) -->
<link rel="stylesheet" href="__BASE__/cdn/v1/gob.css">
<script type="module" src="__BASE__/cdn/v1/gob.js"></script>

'''
DATOS_T = "await fetch('__BASE__/cdn/v1/datos/ejemplo-tramites.json').then((r) => r.json())"
COLS = '''columnas: [
      { campo: 'radicado', titulo: 'Radicado', nowrap: true },
      { campo: 'asunto', titulo: 'Asunto' },
      { campo: 'solicitante', titulo: 'Solicitante' },
      { campo: 'municipio', titulo: 'Municipio' },
      { campo: 'estado', titulo: 'Estado', tipo: 'estado', estados: { Resuelto: 'exito', 'En trámite': 'info', Pendiente: 'aviso', Vencido: 'peligro' } },
      { campo: 'fecha', titulo: 'Fecha', tipo: 'fecha' },
      { campo: 'dias', titulo: 'Días', tipo: 'numero', semaforo: { verde: 10, amarillo: 25, invertir: true } },
      { campo: 'valor', titulo: 'Valor', tipo: 'cop' },
      { campo: 'avance', titulo: 'Avance', tipo: 'barra', maximo: 1 },
    ]'''


def ejemplo(code, id_, titulo, desc, snippet, oscuro=False):
    """Un ejemplo: demo EN VIVO (el mismo código) + bloque de código completo con las dependencias."""
    live = snippet.replace(PRELUDIO, '').replace('__BASE__', '..')
    mostrado = snippet
    cls = 'demo__view' + (' demo__view--oscuro' if oscuro else ' demo__view--white')
    return (f'<div class="demo ej" id="ej-{id_}"><div class="ej__head"><h3>{titulo}</h3><p>{desc}</p></div><div class="{cls}">{live}</div>'
            f'<details><summary>Ver código completo (copiar y pegar)</summary>{code("html", mostrado, id_ + ".html", tpl=True)}</details></div>')


# =============================================================== PROPIEDADES de gob-tabla
TPROPS = [
    ('columnas', 'columnas (JSON)', 'Columna[]', '—', 'Definición de columnas (ver tabla «Columna»).'),
    ('datos', 'datos (JSON)', 'object[]', '[]', 'Filas. Cada fila es un objeto; se admiten rutas con punto (<code>persona.nombre</code>).'),
    ('llave', 'llave', 'string', "'id'", 'Campo único de cada fila (selección y eventos).'),
    ('titulo / descripcion', 'titulo / descripcion', 'string', '—', 'Título visible y nombre accesible de la tabla.'),
    ('busqueda', 'busqueda', 'boolean', 'true', 'Cuadro de búsqueda global (sin tildes ni mayúsculas).'),
    ('filtrosColumna', 'filtros-columna', 'boolean', 'false', 'Fila de filtros por columna: select (≤ 12 valores), texto, o expresiones numéricas (<code>&gt;10</code>, <code>5-20</code>).'),
    ('ordenInicial', 'orden-inicial (JSON)', '{ campo, dir }', '—', 'Orden inicial, p. ej. <code>{"campo":"fecha","dir":"desc"}</code>.'),
    ('paginacion', 'paginacion', 'boolean', 'true', 'Paginación (en modo servidor siempre se muestra el paginador).'),
    ('tamanoPagina / opcionesTamano', 'tamano-pagina / opciones-tamano', 'number / number[]', '10 / [5,10,25,50,100]', 'Filas por página y opciones del selector.'),
    ('seleccion', 'seleccion', "'ninguna' | 'una' | 'multiple'", "'ninguna'", 'Casillas de selección; «multiple» incluye seleccionar la página y todos los resultados.'),
    ('acciones', 'acciones (JSON)', '{ id, etiqueta, icono, tipo }[]', '—', 'Botones por fila (hasta 3 visibles; más van a un menú «⋯»). <code>tipo: "peligro"</code> los pinta en rojo.'),
    ('accionesMasivas', 'acciones-masivas (JSON)', 'idem', '—', 'Botones que aparecen al seleccionar filas.'),
    ('exportar', 'exportar', 'boolean', 'true', 'Menú Exportar: Excel (CSV), copiar, imprimir/PDF.'),
    ('selectorColumnas', 'selector-columnas', 'boolean', 'true', 'Menú para mostrar u ocultar columnas.'),
    ('densidad', 'densidad', "'compacta' | 'normal' | 'amplia'", "'normal'", 'Espaciado vertical.'),
    ('zebra', 'zebra', 'boolean', 'false', 'Filas alternadas.'),
    ('totales', 'totales', 'boolean', 'false', 'Pie con totales según <code>total</code> de cada columna.'),
    ('alturaMax', 'altura-max (px)', 'number', '—', 'Altura máxima con scroll vertical y encabezado fijo.'),
    ('filaClicable', 'fila-clicable', 'boolean', 'false', 'Emite <code>gob-tabla-fila-clic</code> al hacer clic o Enter.'),
    ('cargando / vacio', 'cargando / vacio', 'boolean / string', 'false / «No hay datos…»', 'Estado de carga (esqueleto) y mensaje de vacío (también el slot <code>vacio</code>).'),
    ('modoServidor', 'modo-servidor', 'boolean', 'false', 'Orden, filtros y paginación los hace su API: la tabla emite <code>gob-tabla-consulta</code> y usted entrega <code>datos</code> y <code>totalFilas</code>.'),
    ('totalFilas', 'total-filas', 'number', '0', 'Total de resultados (modo servidor).'),
    ('tarjetas', 'tarjetas', "'auto' | 'siempre' | 'nunca'", "'auto'", 'Vista de tarjetas: automática bajo 640 px de ancho del contenedor.'),
    ('tema', 'tema', "'claro' | 'oscuro'", "'claro'", 'Tema.'),
    ('config', '—', 'objeto', '—', 'Asigna varias propiedades a la vez.'),
]
TCOL = [
    ('campo', 'Nombre del campo en cada fila (obligatorio).'), ('titulo', 'Encabezado (por defecto, el campo capitalizado).'),
    ('tipo', "<code>texto</code> (defecto), <code>numero</code>, <code>cop</code> (pesos), <code>porcentaje</code> (0–1), <code>fecha</code> (ISO), <code>estado</code> (insignia de color), <code>booleano</code>, <code>enlace</code>, <code>barra</code> (progreso)."),
    ('estados', 'Para <code>tipo:"estado"</code>: valor → <code>exito | aviso | peligro | info | neutro | primario | violeta</code>.'), ('semaforo', '<code>{ verde, amarillo, invertir? }</code>: punto verde/amarillo/rojo según umbrales (<code>invertir</code>: menor es mejor).'),
    ('total', '<code>suma | promedio | conteo | min | max</code> (fila de totales).'), ('enlace', 'Plantilla de URL con <code>{campo}</code>, para <code>tipo:"enlace"</code>.'), ('maximo', 'Valor 100 % de la barra (<code>tipo:"barra"</code>).'),
    ('ancho / alinear / nowrap', 'Ancho CSS, alineación (<code>izq | centro | der</code>) y no partir el texto.'), ('ordenable / filtrable / oculta', 'Por defecto verdadero / verdadero / falso.'),
    ('decimales', 'Decimales máximos (números).'), ('render', 'Función <code>(valor, fila) =&gt; "HTML"</code> para celdas a medida (HTML de confianza: escape lo que venga del usuario).'),
]
TEV = [('gob-tabla-seleccion', '{ llaves, filas }', 'Cambió la selección.'), ('gob-tabla-accion', '{ accion, fila } o { accion, filas, llaves }', 'Botón de fila o acción masiva.'), ('gob-tabla-fila-clic', '{ fila }', 'Clic/Enter en una fila (con <code>fila-clicable</code>).'),
       ('gob-tabla-orden', '{ campo, dir } | null', 'Cambió el orden.'), ('gob-tabla-filtro', '{ busqueda, filtros }', 'Cambió la búsqueda o un filtro.'), ('gob-tabla-pagina', '{ pagina, tamano }', 'Cambió la página o el tamaño.'),
       ('gob-tabla-consulta', '{ pagina, tamano, orden, busqueda, filtros }', 'Modo servidor: pida los datos a su API.'), ('gob-tabla-exportar', '{ formato, filas }', 'Se exportó o copió.')]
TMET = [('exportarCSV(nombre?)', 'Descarga un CSV (UTF-8 con BOM, separador «;», abre bien en Excel).'), ('csv()', 'Devuelve el CSV como texto.'), ('copiar()', 'Copia la tabla (TSV) al portapapeles.'), ('imprimir()', 'Imprime todas las filas filtradas.'),
        ('limpiarFiltros()', 'Quita búsqueda y filtros.'), ('seleccionar(llaves) / limpiarSeleccion() / seleccionarTodo()', 'Control de la selección.'), ('filasFiltradas', 'Getter: filas tras filtros y orden.')]


GOB = '<script type="module" src="../cdn/v1/gob.js"></script>' + chr(10)


def build(root, page, code):
    # ================================================================ gob-tabla
    ej = []
    ej.append(ejemplo(code, 't1', '1 · Tabla básica', 'Columnas simples con orden (clic en el encabezado), búsqueda y paginación. Es lo mínimo para empezar.', PRELUDIO + '''<gob-tabla id="t1" titulo="Trámites" tamano-pagina="5"></gob-tabla>

<script type="module">
  const filas = ''' + DATOS_T + ''';
  document.getElementById('t1').config = {
    datos: filas, llave: 'id',
    columnas: [
      { campo: 'radicado', titulo: 'Radicado', nowrap: true },
      { campo: 'asunto', titulo: 'Asunto' },
      { campo: 'municipio', titulo: 'Municipio' },
      { campo: 'fecha', titulo: 'Fecha', tipo: 'fecha' },
    ],
  };
</script>'''))
    ej.append(ejemplo(code, 't2', '2 · Filtros, estados, semáforo, pesos y barras', 'Filtros por columna (botón «Filtros»): select para estados, expresiones para números (<code>&gt;20</code>, <code>5-15</code>). Formatos es-CO listos.', PRELUDIO + '''<gob-tabla id="t2" titulo="Gestión de trámites" filtros-columna tamano-pagina="6" zebra></gob-tabla>

<script type="module">
  const filas = ''' + DATOS_T + ''';
  document.getElementById('t2').config = {
    datos: filas, llave: 'id',
    ordenInicial: { campo: 'fecha', dir: 'desc' },
    ''' + COLS + ''',
  };
</script>'''))
    ej.append(ejemplo(code, 't3', '3 · Selección, acciones por fila y acciones masivas', 'Seleccione filas: aparece la barra de acciones masivas. Los botones por fila emiten <code>gob-tabla-accion</code>; aquí usamos <code>gob.toast</code> y <code>gob.confirmar</code>.', PRELUDIO + '''<gob-tabla id="t3" titulo="Bandeja de trámites" seleccion="multiple" tamano-pagina="5" selector-columnas></gob-tabla>

<script type="module">
  const tabla = document.getElementById('t3');
  const filas = ''' + DATOS_T + ''';
  tabla.config = {
    datos: filas, llave: 'id',
    columnas: [
      { campo: 'radicado', titulo: 'Radicado', nowrap: true }, { campo: 'asunto', titulo: 'Asunto' },
      { campo: 'estado', titulo: 'Estado', tipo: 'estado', estados: { Resuelto: 'exito', 'En trámite': 'info', Pendiente: 'aviso', Vencido: 'peligro' } },
      { campo: 'prioridad', titulo: 'Prioridad' },
    ],
    acciones: [
      { id: 'ver', etiqueta: 'Ver detalle', icono: 'ojo' },
      { id: 'editar', etiqueta: 'Editar', icono: 'editar' },
      { id: 'eliminar', etiqueta: 'Eliminar', icono: 'eliminar', tipo: 'peligro' },
    ],
    accionesMasivas: [
      { id: 'asignar', etiqueta: 'Asignar', icono: 'persona-agregar', tipo: 'primario' },
      { id: 'eliminar', etiqueta: 'Eliminar', icono: 'eliminar', tipo: 'peligro' },
    ],
  };
  tabla.addEventListener('gob-tabla-accion', async (e) => {
    const { accion, fila, filas } = e.detail;
    if (accion === 'eliminar') {
      const ok = await gob.confirmar({ titulo: 'Eliminar', mensaje: fila ? `¿Eliminar el trámite ${fila.radicado}?` : `¿Eliminar ${filas.length} trámites?`, tipo: 'peligro', textoConfirmar: 'Eliminar' });
      if (ok) gob.toast({ tipo: 'exito', titulo: 'Eliminado', mensaje: 'La operación se completó.' });
    } else gob.toast({ tipo: 'info', titulo: accion, mensaje: fila ? fila.radicado : filas.length + ' filas' });
  });
</script>'''))
    ej.append(ejemplo(code, 't4', '4 · Totales, densidad compacta y altura fija', 'Fila de totales (suma, promedio) calculada sobre todos los resultados filtrados; encabezado fijo con scroll; exportación a Excel (CSV), copiar e imprimir.', PRELUDIO + '''<gob-tabla id="t4" titulo="Resumen de valores" densidad="compacta" totales altura-max="320" tamano-pagina="25"></gob-tabla>

<script type="module">
  const filas = ''' + DATOS_T + ''';
  document.getElementById('t4').config = {
    datos: filas, llave: 'id',
    columnas: [
      { campo: 'municipio', titulo: 'Municipio' }, { campo: 'dependencia', titulo: 'Dependencia' },
      { campo: 'dias', titulo: 'Días', tipo: 'numero', total: 'promedio' },
      { campo: 'valor', titulo: 'Valor', tipo: 'cop', total: 'suma' },
      { campo: 'radicado', titulo: 'Trámites', total: 'conteo', ordenable: false, filtrable: false, render: () => '1' },
    ],
  };
</script>'''))
    ej.append(ejemplo(code, 't5', '5 · Modo servidor (paginación, orden y búsqueda en su API)', 'Con <code>modo-servidor</code> la tabla no procesa nada: emite <code>gob-tabla-consulta</code> y usted responde con <code>datos</code> y <code>totalFilas</code>. Aquí la API se simula con un retardo.', PRELUDIO + '''<gob-tabla id="t5" titulo="Trámites (servidor)" modo-servidor tamano-pagina="5"></gob-tabla>

<script type="module">
  const t = document.getElementById('t5');
  const BD = ''' + DATOS_T + ''';           // simula su base de datos
  t.columnas = [{ campo: 'radicado', titulo: 'Radicado', nowrap: true }, { campo: 'asunto', titulo: 'Asunto' }, { campo: 'municipio', titulo: 'Municipio' }, { campo: 'dias', titulo: 'Días', tipo: 'numero' }];

  t.addEventListener('gob-tabla-consulta', async (e) => {
    const { pagina, tamano, orden, busqueda } = e.detail;
    t.cargando = true;
    // ← REAL: const r = await fetch(`/api/tramites?pagina=${pagina}&tamano=${tamano}&q=${busqueda}&orden=${orden?.campo}&dir=${orden?.dir}`).then(r => r.json());
    await new Promise((ok) => setTimeout(ok, 450));
    let f = BD.filter((x) => !busqueda || JSON.stringify(x).toLowerCase().includes(busqueda.toLowerCase()));
    if (orden) f.sort((a, b) => (a[orden.campo] > b[orden.campo] ? 1 : -1) * (orden.dir === 'asc' ? 1 : -1));
    t.totalFilas = f.length;                          // total de resultados (no de la página)
    t.datos = f.slice((pagina - 1) * tamano, pagina * tamano);
    t.cargando = false;
  });
</script>'''))
    ej.append(ejemplo(code, 't6', '6 · Herramientas propias y modal «Nuevo»', 'El slot <code>herramientas</code> admite sus propios botones. Aquí un botón abre un <code>&lt;gob-modal&gt;</code> con formulario y, al guardar, la tabla se actualiza y se muestra un toast.', PRELUDIO + '''<gob-tabla id="t6" titulo="Organizaciones" tamano-pagina="4">
  <button slot="herramientas" class="mg-btn mg-btn--sm" id="nuevo">+ Nueva organización</button>
</gob-tabla>

<gob-modal id="m6" titulo="Nueva organización" tipo="info">
  <label class="mg-label" for="n6">Nombre</label>
  <input class="mg-input" id="n6" placeholder="Junta de Acción Comunal…">
  <button slot="pie" class="mg-btn mg-btn--secondary" id="cancelar6">Cancelar</button>
  <button slot="pie" class="mg-btn" id="guardar6">Guardar</button>
</gob-modal>

<script type="module">
  const t = document.getElementById('t6'), m = document.getElementById('m6');
  let datos = [{ id: 1, nombre: 'Asociación de Productores', municipio: 'Aracataca' }, { id: 2, nombre: 'JAC Pescadito', municipio: 'Santa Marta' }, { id: 3, nombre: 'Cooperativa Bananera', municipio: 'Zona Bananera' }];
  t.config = { datos, columnas: [{ campo: 'nombre', titulo: 'Organización' }, { campo: 'municipio', titulo: 'Municipio' }] };
  document.getElementById('nuevo').onclick = () => m.abrir();
  document.getElementById('cancelar6').onclick = () => m.cerrar();
  document.getElementById('guardar6').onclick = () => {
    const nombre = document.getElementById('n6').value.trim();
    if (!nombre) return gob.toast({ tipo: 'aviso', titulo: 'Falta el nombre' });
    datos = [{ id: Date.now(), nombre, municipio: 'Santa Marta' }, ...datos]; t.datos = datos; m.cerrar();
    gob.toast({ tipo: 'exito', titulo: 'Organización creada', mensaje: nombre });
  };
</script>'''))
    ej.append(ejemplo(code, 't7', '7 · Vista de tarjetas (móvil) y estados vacío / cargando', 'Con <code>tarjetas="siempre"</code> cada fila es una tarjeta (en pantallas pequeñas ocurre automáticamente). Abajo: tabla cargando (esqueleto) y vacía (con su mensaje).', PRELUDIO + '''<div style="max-width:420px"><gob-tabla id="t7a" titulo="En el celular" tarjetas="siempre" tamano-pagina="3" busqueda="false" exportar="false"></gob-tabla></div>
<gob-tabla id="t7b" titulo="Cargando…" cargando tamano-pagina="3" style="margin-top:1rem"></gob-tabla>
<gob-tabla id="t7c" titulo="Sin resultados" vacio="Aún no hay trámites radicados." style="margin-top:1rem"></gob-tabla>

<script type="module">
  const filas = ''' + DATOS_T + ''';
  const cols = [{ campo: 'radicado', titulo: 'Radicado' }, { campo: 'asunto', titulo: 'Asunto' }, { campo: 'estado', titulo: 'Estado', tipo: 'estado', estados: { Resuelto: 'exito', 'En trámite': 'info', Pendiente: 'aviso', Vencido: 'peligro' } }];
  document.getElementById('t7a').config = { datos: filas, columnas: cols, busqueda: false, exportar: false };
  document.getElementById('t7b').config = { columnas: cols };
  document.getElementById('t7c').config = { columnas: cols, datos: [] };
</script>'''))
    ej.append(ejemplo(code, 't8', '8 · Tema oscuro', 'Con <code>tema="oscuro"</code> la tabla se adapta a fondos azul-noche (paneles oscuros, salas de monitoreo).', PRELUDIO + '''<div style="background:#051220;padding:1rem;border-radius:12px">
  <gob-tabla id="t8" titulo="Monitoreo" tema="oscuro" tamano-pagina="4" zebra></gob-tabla>
</div>

<script type="module">
  const filas = ''' + DATOS_T + ''';
  document.getElementById('t8').config = { datos: filas, llave: 'id', columnas: [
    { campo: 'radicado', titulo: 'Radicado', nowrap: true }, { campo: 'municipio', titulo: 'Municipio' },
    { campo: 'estado', titulo: 'Estado', tipo: 'estado', estados: { Resuelto: 'exito', 'En trámite': 'info', Pendiente: 'aviso', Vencido: 'peligro' } },
    { campo: 'avance', titulo: 'Avance', tipo: 'barra', maximo: 1 } ] };
</script>''', oscuro=True))
    ng = code('ts', '''// 1) src/index.html — dependencias (todo lo que hay que cargar)
// <link rel="stylesheet" href="__BASE__/cdn/v1/gob.css">
// <script type="module" src="__BASE__/cdn/v1/gob.js"></script>

import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-tramites', standalone: true, schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<gob-tabla titulo="Trámites" seleccion="multiple" filtros-columna
               [columnas]="columnas" [datos]="datos" (gob-tabla-accion)="alAccion($event)"></gob-tabla>`,
})
export class TramitesComponent {
  columnas = [{ campo: 'radicado', titulo: 'Radicado' }, { campo: 'estado', titulo: 'Estado', tipo: 'estado', estados: { Resuelto: 'exito', Vencido: 'peligro' } }];
  datos: any[] = [];
  constructor(private http: HttpClient) { this.http.get<any[]>('/api/tramites').subscribe((d) => (this.datos = d)); }
  alAccion(e: Event) { console.log((e as CustomEvent).detail); }
}''', 'Angular (CUSTOM_ELEMENTS_SCHEMA)', tpl=True)
    react = code('jsx', '''// 1) index.html — dependencias:
//   <link rel="stylesheet" href="__BASE__/cdn/v1/gob.css">
//   <script type="module" src="__BASE__/cdn/v1/gob.js"></script>
'use client'; // Next.js: solo cliente
import { useEffect, useRef } from 'react';

export default function TablaTramites({ datos, onAccion }) {
  const ref = useRef(null);
  useEffect(() => {
    const t = ref.current; if (!t) return;
    t.config = { datos, llave: 'id', columnas: [{ campo: 'radicado', titulo: 'Radicado' }, { campo: 'municipio', titulo: 'Municipio' }], acciones: [{ id: 'ver', etiqueta: 'Ver', icono: 'ojo' }] };
    const h = (e) => onAccion?.(e.detail);
    t.addEventListener('gob-tabla-accion', h);
    return () => t.removeEventListener('gob-tabla-accion', h);
  }, [datos]);
  return <gob-tabla ref={ref} titulo="Trámites" />;
}''', 'React / Next.js', tpl=True)
    vue = code('html', '''<!-- vite.config.js → vue({ template: { compilerOptions: { isCustomElement: (t) => t.startsWith('gob-') } } }) -->
<!-- index.html → <link rel="stylesheet" href="__BASE__/cdn/v1/gob.css"> y <script type="module" src="__BASE__/cdn/v1/gob.js"></script> -->
<template>
  <gob-tabla titulo="Trámites" seleccion="multiple" :columnas.prop="columnas" :datos.prop="datos" @gob-tabla-accion="alAccion" />
</template>''', 'Vue 3', tpl=True)
    nest = code('ts', '''// NestJS + Prisma — endpoint para <gob-tabla modo-servidor>
@Get('tramites')
async listar(@Query() q: { pagina?: string; tamano?: string; q?: string; orden?: string; dir?: 'asc' | 'desc' }) {
  const take = Math.min(Number(q.tamano ?? 10), 100), skip = (Number(q.pagina ?? 1) - 1) * take;
  const where = q.q ? { OR: [{ asunto: { contains: q.q, mode: 'insensitive' } }, { radicado: { contains: q.q } }] } : {};
  const [datos, total] = await this.prisma.$transaction([
    this.prisma.tramite.findMany({ where, skip, take, orderBy: q.orden ? { [q.orden]: q.dir ?? 'asc' } : { fecha: 'desc' } }),
    this.prisma.tramite.count({ where }),
  ]);
  return { data: datos, meta: { total, pagina: Number(q.pagina ?? 1), tamano: take } };
}
// Frontend: t.totalFilas = r.meta.total; t.datos = r.data;   (ver ejemplo 5)''', 'API NestJS')
    cuando = ('<div class="dont"><div class="ok"><b>✔ Usar para</b><br>Listados administrativos, bandejas, reportes y catálogos en cualquier framework; hasta unas decenas de miles de filas en memoria, y sin límite con <code>modo-servidor</code>.</div>'
              '<div class="no"><b>✘ No usar para</b><br>Hojas de cálculo con edición de celdas, agrupación/pivote o millones de filas en el cliente (use AG Grid Community) ni para maquetar layouts. Para Angular puede usar también <code>p-table</code> de PrimeNG con el preset oficial.</div></div>')
    install = code('html', PRELUDIO + '<gob-tabla titulo="Mi tabla"></gob-tabla>\n<script type="module">\n  document.querySelector(\'gob-tabla\').config = { datos: [], columnas: [] };\n</script>', 'Instalación mínima (HTML plano)', tpl=True)
    body = f'''
<p class="pt-lead">Tabla de datos accesible, basada en el elemento nativo <code class="inline">&lt;table&gt;</code>: búsqueda, filtros por columna, orden, selección, acciones por fila y masivas, paginación (local o de servidor), totales, columnas visibles, exportar a Excel (CSV), copiar, imprimir y vista de tarjetas en móvil. Funciona igual en HTML plano, Angular, React, Vue o Next.js. <a href="../estudio/tablas.html"><b>Configúrela visualmente en el Estudio de tablas →</b></a></p>
<section class="pt-section"><h2><span class="n">01.</span> Cuándo usarla y cuándo no</h2>{cuando}</section>
<section class="pt-section"><h2><span class="n">02.</span> Instalación (todo lo que hay que cargar)</h2>
<div class="baseurl"><b>URL base:</b><input class="mg-input" id="baseInput" aria-label="URL base"><button class="mg-btn mg-btn--ghost mg-btn--sm" id="baseReset">Autodetectar</button></div>
{install}
<div class="mg-alert mg-alert--info"><div><p class="mg-alert__title">Sin internet o en intranet</p>Descargue <a href="../dist/downloads/gob-cdn-v1.zip"><code>gob-cdn-v1.zip</code></a>, descomprímalo en su servidor y use esa carpeta como URL base: incluye los scripts, la tipografía Montserrat, los datos geográficos y los íconos. No hay llamadas a servicios externos.</div></div></section>
<section class="pt-section"><h2><span class="n">03.</span> Ejemplos (cada uno con su código completo)</h2>{''.join(ej)}</section>
<section class="pt-section"><h2><span class="n">04.</span> Otros frameworks</h2>{ng}{react}{vue}</section>
<section class="pt-section"><h2><span class="n">05.</span> Integración con una API NestJS</h2>{nest}</section>
<section class="pt-section"><h2><span class="n">06.</span> Referencia</h2><h3>Propiedades</h3>{tabla(['Propiedad', 'Atributo', 'Tipo', 'Por defecto', 'Descripción'], [(f'<code>{a}</code>', f'<code>{b}</code>', f'<code>{c}</code>', d, e) for a, b, c, d, e in TPROPS])}
<h3 style="margin-top:1.5rem">Columna</h3>{tabla(['Campo', 'Descripción'], [(f'<code>{a}</code>', b) for a, b in TCOL])}
<h3 style="margin-top:1.5rem">Eventos</h3>{tabla(['Evento', 'detail', 'Cuándo'], [(f'<code>{a}</code>', f'<code>{b}</code>', c) for a, b, c in TEV])}
<h3 style="margin-top:1.5rem">Métodos</h3>{tabla(['Método', 'Descripción'], [(f'<code>{a}</code>', b) for a, b in TMET])}
<h3 style="margin-top:1.5rem">Slots, partes y variables</h3><p class="mg-help">Slots: <code>herramientas</code> (botones propios en la barra) y <code>vacio</code>. Partes: <code>tabla</code>, <code>barra</code>, <code>paginacion</code>. Tipografía: <code>--gob-fuente</code>.</p></section>
<section class="pt-section"><h2><span class="n">07.</span> Accesibilidad</h2><ul style="line-height:1.9;color:var(--mg-gray-700)"><li>Tabla HTML nativa con <code>caption</code>, <code>scope</code> y <code>aria-sort</code> en los encabezados ordenables; los botones de orden, filtros, acciones y paginación son controles reales con foco visible.</li>
<li>Cada casilla y botón de fila tiene nombre propio («Seleccionar R-2026-01000», «Editar: R-2026-01000»); el total de resultados se anuncia en una región <code>aria-live</code>.</li><li>La región de desplazamiento es enfocable por teclado; en móvil la vista de tarjetas conserva las etiquetas de cada dato; no se transmite información solo con color (las insignias llevan texto).</li></ul></section>'''
    page(root, 'componentes/gob-tabla.html', 'gob-tabla', 'Tabla de datos con búsqueda, filtros, orden, selección, acciones, paginación, totales y exportación. Ejemplos listos para copiar.', GOB + body, active='componentes.html')

    # ================================================================ mensajes
    em = []
    em.append(ejemplo(code, 'a1', '1 · Alertas', 'Cinco tipos, con título, cerrable y botón de acción (slot <code>acciones</code>). Peligro y aviso usan <code>role="alert"</code>; el resto <code>role="status"</code>.', PRELUDIO + '''<div style="display:grid;gap:.6rem">
  <gob-alerta tipo="info" titulo="Información">Su solicitud fue radicada con el número R-2026-00123.</gob-alerta>
  <gob-alerta tipo="exito" titulo="Listo" cerrable>El documento se firmó correctamente.</gob-alerta>
  <gob-alerta tipo="aviso" titulo="Atención">Su sesión expira en 2 minutos.
    <button slot="acciones" class="mg-btn mg-btn--sm mg-btn--secondary">Extender sesión</button></gob-alerta>
  <gob-alerta tipo="peligro" titulo="Error" cerrable>No fue posible enviar el formulario. Intente de nuevo.</gob-alerta>
  <gob-alerta tipo="neutro">Mensaje neutro sin título.</gob-alerta>
</div>'''))
    em.append(ejemplo(code, 'm1', '2 · Modal con formulario', 'Basado en <code>&lt;dialog&gt;</code> nativo: atrapa el foco, se cierra con Esc o clic en el fondo, bloquea el scroll y devuelve el foco al botón que lo abrió. Slot <code>pie</code> para los botones.', PRELUDIO + '''<button class="mg-btn" id="abrir1">Nuevo trámite</button>

<gob-modal id="modal1" titulo="Nuevo trámite" tipo="info">
  <div style="display:grid;gap:.75rem">
    <div><label class="mg-label" for="asunto1">Asunto</label><input class="mg-input" id="asunto1" placeholder="Describa su solicitud"></div>
    <div><label class="mg-label" for="mun1">Municipio</label><select class="mg-select" id="mun1"><option>Santa Marta</option><option>Ciénaga</option><option>Fundación</option></select></div>
  </div>
  <button slot="pie" class="mg-btn mg-btn--secondary" id="cancelar1">Cancelar</button>
  <button slot="pie" class="mg-btn" id="guardar1">Guardar</button>
</gob-modal>

<script type="module">
  const m = document.getElementById('modal1');
  document.getElementById('abrir1').onclick = () => m.abrir();
  document.getElementById('cancelar1').onclick = () => m.cerrar();
  document.getElementById('guardar1').onclick = () => { m.cerrar(); gob.toast({ tipo: 'exito', titulo: 'Trámite creado' }); };
  m.addEventListener('gob-modal-cerrar', (e) => console.log('cerrado por:', e.detail.motivo));   // boton | esc | fondo | api
</script>'''))
    em.append(ejemplo(code, 'm2', '3 · Confirmación (gob.confirmar) y tipos', '<code>gob.confirmar()</code> devuelve una promesa: <code>true</code> si el usuario acepta. Sirve para cualquier acción destructiva sin escribir HTML.', PRELUDIO + '''<div class="mg-row">
  <button class="mg-btn mg-btn--danger" id="del2">Eliminar registro</button>
  <button class="mg-btn mg-btn--secondary" id="pub2">Publicar</button>
</div>
<p id="res2" class="mg-help" aria-live="polite"></p>

<script type="module">
  document.getElementById('del2').onclick = async () => {
    const ok = await gob.confirmar({ titulo: 'Eliminar registro', mensaje: 'Esta acción no se puede deshacer.', tipo: 'peligro', textoConfirmar: 'Sí, eliminar' });
    document.getElementById('res2').textContent = ok ? 'Confirmado: se eliminó.' : 'Cancelado.';
  };
  document.getElementById('pub2').onclick = async () => {
    const ok = await gob.confirmar({ titulo: '¿Publicar?', mensaje: 'El documento será visible para toda la ciudadanía.', tipo: 'aviso', textoConfirmar: 'Publicar' });
    if (ok) gob.toast({ tipo: 'exito', titulo: 'Publicado' });
  };
</script>'''))
    em.append(ejemplo(code, 'm3', '4 · Tamaños y modal estático', 'Tamaños <code>sm · md · lg · xl · pantalla</code>. Con <code>estatico</code> no se cierra con Esc ni con clic afuera (procesos que no deben interrumpirse).', PRELUDIO + '''<div class="mg-row">
  <button class="mg-btn mg-btn--secondary" id="tl3">Grande (lg)</button>
  <button class="mg-btn mg-btn--secondary" id="te3">Estático</button>
</div>

<gob-modal id="lg3" titulo="Detalle del expediente" tam="lg" icono="carpeta">
  <p>Contenido amplio: tablas, formularios largos o vistas previas de documentos. El cuerpo tiene su propio scroll si excede la altura de la pantalla.</p>
  <button slot="pie" class="mg-btn" onclick="document.getElementById('lg3').cerrar()">Cerrar</button>
</gob-modal>
<gob-modal id="es3" titulo="Procesando firma digital" tipo="aviso" estatico cerrable="false" tam="sm">
  <p>No cierre esta ventana hasta que termine el proceso.</p>
  <button slot="pie" class="mg-btn" onclick="document.getElementById('es3').cerrar()">Entendido</button>
</gob-modal>

<script type="module">
  document.getElementById('tl3').onclick = () => document.getElementById('lg3').abrir();
  document.getElementById('te3').onclick = () => document.getElementById('es3').abrir();
</script>'''))
    em.append(ejemplo(code, 'n1', '5 · Toasts (notificaciones)', 'Se apilan, se pausan al pasar el cursor, se pueden cerrar y admiten una acción (p. ej. «Deshacer»). <code>duracion: 0</code> las deja fijas. <code>role="alert"</code> para errores.', PRELUDIO + '''<div class="mg-row">
  <button class="mg-btn mg-btn--secondary" id="ok4">Éxito</button>
  <button class="mg-btn mg-btn--secondary" id="inf4">Info</button>
  <button class="mg-btn mg-btn--secondary" id="av4">Aviso</button>
  <button class="mg-btn mg-btn--secondary" id="er4">Error fijo</button>
  <button class="mg-btn mg-btn--secondary" id="un4">Con «Deshacer»</button>
</div>

<script type="module">
  const $ = (id) => document.getElementById(id);
  $('ok4').onclick = () => gob.toast({ tipo: 'exito', titulo: 'Guardado', mensaje: 'Los cambios se guardaron.' });
  $('inf4').onclick = () => gob.toast('Hay una nueva versión del manual.');                  // forma corta
  $('av4').onclick = () => gob.toast({ tipo: 'aviso', titulo: 'Conexión lenta', duracion: 8000 });
  $('er4').onclick = () => gob.toast({ tipo: 'peligro', titulo: 'Error de red', mensaje: 'No se pudo contactar al servidor.', duracion: 0 });
  $('un4').onclick = () => gob.toast({ tipo: 'neutro', titulo: 'Trámite archivado', accion: { etiqueta: 'Deshacer', alClic: () => gob.toast({ tipo: 'exito', titulo: 'Restaurado' }) } });
  // Posición: document.querySelector('gob-toasts').posicion = 'arriba-derecha'  (abajo-derecha | abajo-izquierda | arriba-izquierda | arriba-centro)
</script>'''))
    ev = tabla(['Componente', 'Eventos y API'], [
        ('<code>&lt;gob-alerta&gt;</code>', 'Atributos: <code>tipo</code> (info, exito, aviso, peligro, neutro), <code>titulo</code>, <code>cerrable</code>, <code>icono</code>. Evento: <code>gob-alerta-cerrar</code>. Slots: por defecto y <code>acciones</code>.'),
        ('<code>&lt;gob-modal&gt;</code>', 'Atributos: <code>abierto</code>, <code>titulo</code>, <code>tam</code> (sm, md, lg, xl, pantalla), <code>tipo</code> (normal, info, exito, aviso, peligro), <code>icono</code>, <code>cerrable</code>, <code>estatico</code>. Métodos: <code>abrir()</code>, <code>cerrar(motivo?)</code>. Eventos: <code>gob-modal-abrir</code>, <code>gob-modal-cerrar</code> (<code>detail.motivo</code>: boton, esc, fondo, api). Slots: por defecto y <code>pie</code>.'),
        ('<code>gob.toast(opciones | texto)</code>', '<code>{ tipo, titulo, mensaje, duracion = 5000, accion: { etiqueta, alClic } }</code>. Devuelve una promesa con el id. El contenedor <code>&lt;gob-toasts&gt;</code> se crea solo; <code>posicion</code> y <code>max</code> son configurables.'),
        ('<code>gob.confirmar(opciones | texto)</code>', '<code>{ titulo, mensaje, tipo, textoConfirmar, textoCancelar }</code> → <code>Promise&lt;boolean&gt;</code>.')])
    inst_m = code('html', PRELUDIO + '''<gob-alerta tipo="exito" titulo="Listo">Todo salió bien.</gob-alerta>
<script type="module">
  gob.toast({ tipo: 'info', titulo: 'Hola' });
</script>''', 'Instalación mínima', tpl=True)
    body = f'''
<p class="pt-lead">Alertas, diálogos modales, notificaciones (toasts) y confirmaciones listos para cualquier framework. Todos son accesibles: foco atrapado y devuelto, <code class="inline">role</code> correcto, anuncio a lectores de pantalla y <code class="inline">prefers-reduced-motion</code>.</p>
<section class="pt-section"><h2><span class="n">01.</span> Instalación (todo lo que hay que cargar)</h2><div class="baseurl"><b>URL base:</b><input class="mg-input" id="baseInput" aria-label="URL base"><button class="mg-btn mg-btn--ghost mg-btn--sm" id="baseReset">Autodetectar</button></div>
{inst_m}</section>
<section class="pt-section"><h2><span class="n">02.</span> Ejemplos (cada uno con su código completo)</h2>{''.join(em)}</section>
<section class="pt-section"><h2><span class="n">03.</span> Referencia</h2>{ev}</section>
<section class="pt-section"><h2><span class="n">04.</span> Accesibilidad</h2><ul style="line-height:1.9;color:var(--mg-gray-700)"><li><b>Modal:</b> elemento <code>&lt;dialog&gt;</code> nativo con <code>aria-labelledby</code>; el foco queda dentro, Esc cierra (salvo <code>estatico</code>) y el foco vuelve al botón que lo abrió.</li><li><b>Toast y alerta:</b> <code>role="status"</code> (cortés) o <code>role="alert"</code> (peligro y aviso); los toasts se pausan con el cursor y con el foco.</li><li>Todos los botones tienen nombre accesible y foco visible; las animaciones se desactivan con <code>prefers-reduced-motion</code>.</li></ul></section>'''
    page(root, 'componentes/gob-mensajes.html', 'Alertas, modales y toasts', 'gob-alerta, gob-modal, gob.toast() y gob.confirmar(): mensajes y diálogos accesibles con ejemplos para copiar.', GOB + body, active='componentes.html')

    # ================================================================ KPI, pestañas, dashboard
    ed = []
    ed.append(ejemplo(code, 'k1', '1 · Indicadores (gob-kpi)', 'Valor animado, variación (verde/rojo según si subir es bueno), sparkline, meta y ayuda. Formatos: número, compacto, pesos, porcentaje.', PRELUDIO + '''<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));gap:.75rem">
  <gob-kpi etiqueta="Radicados" valor="1284" delta="12.5" serie="[3,5,4,8,9,7,12]" icono="archivo" color="primario"></gob-kpi>
  <gob-kpi etiqueta="Resueltos" valor="0.87" formato="porcentaje" delta="3.2" meta="1" icono="check-circulo" color="verde"></gob-kpi>
  <gob-kpi etiqueta="Presupuesto ejecutado" valor="2450000000" formato="compacto" delta="4" icono="dinero" color="amarillo" ayuda="Corte a octubre de 2026"></gob-kpi>
  <gob-kpi etiqueta="Vencidos" valor="31" delta="-8" bueno-sube="false" icono="alerta" color="rojo"></gob-kpi>
</div>
<script type="module">
  // «bueno-sube="false"»: que baje es bueno (verde). Para asignar por código:  document.querySelector('gob-kpi').valor = 1300;
</script>'''))
    ed.append(ejemplo(code, 'p1', '2 · Pestañas (gob-pestanas)', 'Variantes <code>linea</code> y <code>pildora</code>, con íconos y contadores. Flechas, Inicio y Fin mueven entre pestañas. El contenido de cada pestaña va en un elemento con <code>slot="id"</code>.', PRELUDIO + '''<gob-pestanas items='[{"id":"gen","titulo":"General","icono":"inicio"},{"id":"doc","titulo":"Documentos","icono":"archivo","contador":3},{"id":"his","titulo":"Historial","icono":"historial"}]' activa="gen">
  <div slot="gen"><p>Datos generales del expediente.</p></div>
  <div slot="doc"><p>Tres documentos adjuntos.</p></div>
  <div slot="his"><p>Línea de tiempo de cambios.</p></div>
</gob-pestanas>

<gob-pestanas variante="pildora" items='[{"id":"a","titulo":"Mensual"},{"id":"b","titulo":"Trimestral"},{"id":"c","titulo":"Anual"}]' style="margin-top:1rem">
  <div slot="a">Vista mensual</div><div slot="b">Vista trimestral</div><div slot="c">Vista anual</div>
</gob-pestanas>

<script type="module">
  document.querySelector('gob-pestanas').addEventListener('gob-pestana-cambio', (e) => console.log('pestaña:', e.detail.id));
</script>'''))
    ed.append(ejemplo(code, 'd1', '3 · Dashboard completo (gob-dashboard)', 'Describe el tablero en JSON: registros + filtros + widgets (KPI, gráficas, mapa, tabla). <b>Haga clic en una barra, un sector o un municipio</b> para filtrar todo el tablero; el chip superior lo quita.', PRELUDIO + '''<gob-dashboard id="tablero"></gob-dashboard>

<script type="module">
  const registros = await fetch('__BASE__/cdn/v1/datos/ejemplo-radicados.json').then((r) => r.json());
  document.getElementById('tablero').config = {
    titulo: 'Atención al ciudadano 2026', subtitulo: 'Radicados por subregión, estado y tiempo (datos de ejemplo)',
    registros,
    filtros: [{ campo: 'subregion', etiqueta: 'Subregión' }, { campo: 'dependencia', etiqueta: 'Dependencia' }, { campo: 'tipo', etiqueta: 'Tipo' }],
    widgets: [
      { tipo: 'kpi', titulo: 'Radicados', medida: 'conteo', icono: 'archivo', serie: 'fecha:mes', col: 3 },
      { tipo: 'kpi', titulo: 'Resueltos', medida: 'conteo', donde: { estado: 'Resuelto' }, icono: 'check-circulo', color: 'verde', serie: 'fecha:mes', col: 3 },
      { tipo: 'kpi', titulo: 'Días promedio', medida: 'promedio', campo: 'dias', unidad: 'd', icono: 'reloj', color: 'cian', buenoSube: false, serie: 'fecha:mes', col: 3 },
      { tipo: 'kpi', titulo: 'Vencidos', medida: 'conteo', donde: { estado: 'Vencido' }, icono: 'alerta', color: 'rojo', buenoSube: false, serie: 'fecha:mes', col: 3 },
      { tipo: 'grafica', grafica: 'area', titulo: 'Radicados por mes', agrupar: 'fecha:mes', serie: 'estado', colores: ['#00B7D9', '#FEC800', '#69B75E', '#F7003C'], apilado: true, col: 8, alto: 300 },
      { tipo: 'grafica', grafica: 'dona', titulo: 'Por tipo de solicitud', agrupar: 'tipo', col: 4, alto: 300, leyendaPosicion: 'abajo' },
      { tipo: 'mapa', titulo: 'Radicados por municipio', agrupar: 'codigo', medida: 'conteo', col: 5, rampa: 'azul', leyendaTitulo: 'Radicados' },
      { tipo: 'grafica', grafica: 'barras-horizontal', titulo: 'Por dependencia', agrupar: 'dependencia', orden: 'valor-desc', etiquetas: true, col: 7, alto: 360 },
      { tipo: 'tabla', titulo: 'Últimos radicados', limite: 80, col: 12, columnas: [
        { campo: 'id', titulo: 'Radicado', nowrap: true }, { campo: 'fecha', titulo: 'Fecha', tipo: 'fecha' }, { campo: 'municipio', titulo: 'Municipio' }, { campo: 'dependencia', titulo: 'Dependencia' }, { campo: 'tipo', titulo: 'Tipo' },
        { campo: 'estado', titulo: 'Estado', tipo: 'estado', estados: { Resuelto: 'exito', 'En trámite': 'info', Pendiente: 'aviso', Vencido: 'peligro' } },
        { campo: 'dias', titulo: 'Días', tipo: 'numero' }] },
    ],
  };
</script>'''))
    wref = tabla(['Campo del widget', 'Descripción'], [
        ('<code>tipo</code>', '<code>kpi | grafica | mapa | tabla | texto | alerta</code>'), ('<code>col</code>, <code>alto</code>', 'Columnas de 12 que ocupa (1–12) y alto en px. En pantallas pequeñas todos pasan a ancho completo (KPI a mitad).'),
        ('<code>medida</code>, <code>campo</code>', '<code>conteo | suma | promedio | max | min | distintos</code> y el campo numérico a medir.'), ('<code>agrupar</code>', 'Campo para agrupar; admite fechas: <code>fecha:mes</code>, <code>fecha:anio</code>, <code>fecha:trimestre</code>, <code>fecha:dia</code>. En el mapa, <code>codigo</code> (DIVIPOLA).'),
        ('<code>serie</code>', 'Segunda dimensión: una serie por valor (gráficas) o sparkline/variación por mes (KPI: <code>"fecha:mes"</code>).'), ('<code>donde</code>', 'Filtro fijo del widget: <code>{ estado: "Vencido" }</code>.'),
        ('<code>grafica</code>', 'Cualquier tipo de <a href="gob-grafica.html">gob-grafica</a>; más <code>orden</code> (<code>natural | valor-desc | valor-asc | nombre</code>), <code>limite</code>, <code>etiquetas</code>, <code>apilado</code>, <code>colores</code>, <code>formato</code>, <code>unidad</code>.'),
        ('<code>filtrar</code>', 'Por defecto verdadero: el clic en la gráfica/mapa filtra el resto. <code>false</code> lo desactiva.'), ('<code>columnas</code>, <code>limite</code>', 'Para <code>tabla</code> (las mismas columnas de <a href="gob-tabla.html">gob-tabla</a>).'),
        ('<code>contenido</code>, <code>tono</code>', 'Para <code>texto</code> y <code>alerta</code>.')])
    body = f'''
<p class="pt-lead">Indicadores (KPI), pestañas y tableros completos. El tablero se describe con JSON y se sincroniza solo: filtros globales y filtro cruzado entre widgets. <a href="../estudio/dashboards.html"><b>Arme el suyo en el Estudio de dashboards →</b></a></p>
<section class="pt-section"><h2><span class="n">01.</span> Instalación (todo lo que hay que cargar)</h2><div class="baseurl"><b>URL base:</b><input class="mg-input" id="baseInput" aria-label="URL base"><button class="mg-btn mg-btn--ghost mg-btn--sm" id="baseReset">Autodetectar</button></div>
{code("html", PRELUDIO + "<gob-kpi etiqueta='Radicados' valor='1284' delta='12.5'></gob-kpi>", 'Instalación mínima', tpl=True)}
<p class="mg-help">El cargador <code>gob.js</code> detecta qué componentes hay en la página y descarga solo esos. Un dashboard usa KPI, gráficas (ECharts, solo si hay gráficas), tabla y mapa; los datos geográficos se descargan solos desde <code>/cdn/v1/datos/</code>.</p></section>
<section class="pt-section"><h2><span class="n">02.</span> Ejemplos (cada uno con su código completo)</h2>{''.join(ed)}</section>
<section class="pt-section"><h2><span class="n">03.</span> Referencia del dashboard</h2>
{tabla(['Propiedad', 'Descripción'], [('<code>titulo</code>, <code>subtitulo</code>', 'Encabezado.'), ('<code>registros</code>', 'Arreglo de objetos con los datos (una fila por hecho: radicado, venta, atención…).'), ('<code>filtros</code>', '<code>[{ campo, etiqueta, todos?, opciones? }]</code>: los valores se leen de los registros si no se indican.'), ('<code>widgets</code>', 'Lista de widgets (tabla siguiente).'), ('<code>tema</code>, <code>colores</code>', '<code>claro | oscuro</code> y paleta por defecto de las gráficas.')])}
<h3 style="margin-top:1.5rem">Widgets</h3>{wref}
<h3 style="margin-top:1.5rem">Eventos y métodos</h3>{tabla(['', 'Descripción'], [('<code>gob-dashboard-filtro</code>', '<code>{ filtros, total }</code> cada vez que cambia algún filtro.'), ('<code>reiniciar()</code>', 'Quita todos los filtros.'), ('<code>descargarCSV(nombre?)</code> · <code>imprimir()</code>', 'Descarga los registros filtrados o imprime (los filtros se ocultan).')])}
<h3 style="margin-top:1.5rem">gob-kpi y gob-pestanas</h3>{tabla(['Componente', 'Atributos y eventos'], [
 ('<code>&lt;gob-kpi&gt;</code>', '<code>etiqueta</code>, <code>valor</code>, <code>formato</code> (numero, compacto, cop, porcentaje), <code>unidad</code>, <code>delta</code> (% de variación), <code>delta-texto</code>, <code>bueno-sube</code>, <code>icono</code>, <code>color</code> (primario, cian, verde, amarillo, rojo, violeta, gris, navy o CSS), <code>serie</code> (JSON, sparkline), <code>meta</code>, <code>ayuda</code>, <code>animar</code>, <code>cargando</code>, <code>oscuro</code>.'),
 ('<code>&lt;gob-pestanas&gt;</code>', '<code>items</code> (JSON <code>[{{ id, titulo, icono?, contador?, deshabilitada? }}]</code>), <code>activa</code>, <code>variante</code> (linea | pildora), <code>etiqueta</code>. Evento <code>gob-pestana-cambio</code> (<code>detail.id</code>). Cada panel: elemento con <code>slot="id"</code>.')])}</section>
<section class="pt-section"><h2><span class="n">04.</span> Accesibilidad</h2><ul style="line-height:1.9;color:var(--mg-gray-700)"><li>Cada KPI es un grupo con nombre accesible que incluye valor y variación; la barra de meta es <code>role="progressbar"</code>. Pestañas con roles <code>tablist/tab/tabpanel</code> y navegación por teclado.</li><li>Las gráficas del tablero traen tabla de datos equivalente; los filtros son selects nativos y los filtros activos se anuncian (<code>aria-live</code>).</li></ul></section>'''
    page(root, 'componentes/gob-dashboard.html', 'Dashboard, KPI y pestañas', 'gob-dashboard, gob-kpi y gob-pestanas: tableros con filtros sincronizados, indicadores y pestañas accesibles. Ejemplos para copiar.', GOB + body, active='componentes.html')

    # ================================================================ íconos
    nombres = sorted(f[:-4] for f in os.listdir(os.path.join(root, 'cdn', 'v1', 'iconos')) if f.endswith('.svg'))
    grid = ''.join(f'<button type="button" class="ico-b" data-n="{n}" data-copy="&lt;gob-icono nombre=&quot;{n}&quot;&gt;&lt;/gob-icono&gt;" title="Copiar etiqueta"><gob-icono nombre="{n}" tam="26"></gob-icono><span>{n}</span></button>' for n in nombres)
    inst = code('html', PRELUDIO + '''<!-- A) Componente (recomendado): hereda el color del texto -->
<gob-icono nombre="usuario" tam="24"></gob-icono>
<gob-icono nombre="escudo-check" tam="32" etiqueta="Seguridad verificada"></gob-icono>   <!-- con «etiqueta» es informativo; sin ella es decorativo -->

<!-- B) Archivo SVG suelto (sin JavaScript): un archivo por ícono -->
<img src="__BASE__/cdn/v1/iconos/usuario.svg" width="24" height="24" alt="">

<!-- C) Sprite en la misma página (copie iconos.svg a su sitio; un SVG externo con <use> exige el mismo origen) -->
<svg width="24" height="24" aria-hidden="true"><use href="/ruta/iconos.svg#gob-usuario"/></svg>''', 'Cómo usar los íconos', tpl=True)
    body = f'''
<p class="pt-lead"><b>{len(nombres)} íconos estándar</b> (estilo lineal, 24 px, <code class="inline">currentColor</code>) con nombres en español, usados por todos los componentes. Basados en <a href="https://lucide.dev">Lucide</a> (licencia ISC). Haga clic en uno para copiar su etiqueta.</p>
<section class="pt-section"><h2><span class="n">01.</span> Cómo usarlos</h2><div class="baseurl"><b>URL base:</b><input class="mg-input" id="baseInput" aria-label="URL base"><button class="mg-btn mg-btn--ghost mg-btn--sm" id="baseReset">Autodetectar</button></div>{inst}
<p><a class="mg-btn mg-btn--secondary mg-btn--sm" href="../cdn/v1/iconos.svg" download>⬇ Sprite iconos.svg</a> <a class="mg-btn mg-btn--secondary mg-btn--sm" href="../dist/downloads/gob-iconos.zip" download>⬇ Todos los SVG (.zip)</a></p></section>
<section class="pt-section"><h2><span class="n">02.</span> Catálogo</h2><label class="st-f" style="max-width:22rem;margin-bottom:1rem"><span>Buscar</span><input class="mg-input" id="buscaIco" type="search" placeholder="usuario, mapa, alerta…"></label><div class="ico-g" id="icoGrid">{grid}</div></section>
<script>document.getElementById('buscaIco').addEventListener('input', (e) => {{ const q = e.target.value.toLowerCase(); document.querySelectorAll('.ico-b').forEach((b) => (b.hidden = !b.dataset.n.includes(q))); }});</script>
<script type="module" src="../cdn/v1/gob.js"></script>'''
    page(root, 'componentes/iconos.html', 'Íconos estándar', 'Catálogo de íconos gob-icono: SVG sueltos, sprite y componente, con nombres en español.', body, active='componentes.html')


def hub_html():
    cards = [
        ('gob-tabla.html', 'gob-tabla', 'Tabla avanzada: filtros, orden, selección, acciones, totales, servidor, exportar.', '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>'),
        ('gob-mensajes.html', 'Alertas, modales y toasts', 'gob-alerta, gob-modal, gob.toast() y gob.confirmar().', '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
        ('gob-dashboard.html', 'Dashboard, KPI y pestañas', 'Tableros declarativos con filtros sincronizados.', '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>'),
        ('gob-grafica.html', 'gob-grafica', '11 tipos de gráfica con la paleta institucional.', '<path d="M21.2 15.9A10 10 0 1 1 8 2.8"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>'),
        ('gob-mapa-magdalena.html', 'gob-mapa-magdalena', 'Mapa por municipios con DIVIPOLA, rutas y efectos.', '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>'),
        ('iconos.html', 'Íconos estándar', '104 íconos en SVG, sprite y componente.', '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>'),
        ('estandar.html', 'Estándar y licencias', 'Guía de decisión, contrato y licencias de PrimeNG.', '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
    ]
    ck = ''.join(f'<a class="k" href="componentes/{h}"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{i}</svg></div><h3>{t}</h3><p>{d}</p></a>' for h, t, d, i in cards)
    return f'<section class="pt-section"><h2><span class="n">00.</span> Web Components <code style="font-size:.6em">gob-*</code></h2><p class="pt-lead">Funcionan igual en HTML plano, Angular, React, Vue y Next.js. Cada página trae ejemplos en vivo con su código completo para copiar y pegar.</p><div class="cards-k">{ck}</div></section>'
