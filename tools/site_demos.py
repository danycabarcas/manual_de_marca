"""Genera demos/*.html: plantillas completas con los componentes avanzados (sin AdminLTE ni Bootstrap).
Cada demo es autosuficiente: dependencias en <head>, secciones marcadas con data-demo (copiables) y banner «Cómo usar este demo»."""
import os
from site_demos_ayuda import AYUDA

NAV = [('panel-ejecutivo.html', 'Panel ejecutivo', 'panel'), ('gestion-tramites.html', 'Gestión de trámites', 'tareas'), ('analitica-territorial.html', 'Analítica territorial', 'mapa'),
       ('portal-ciudadano.html', 'Portal ciudadano', 'globo'), ('mesa-ayuda.html', 'Mesa de ayuda', 'soporte'), ('acceso-formularios.html', 'Acceso y formularios', 'candado')]

HEAD = '''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%TITULO% · Demo Gobernación del Magdalena</title>
<link rel="icon" href="../assets/favicon/favicon.ico">
<!-- ① DEPENDENCIAS — todo lo que hay que cargar (una sola vez por página) -->
<link rel="stylesheet" href="../cdn/v1/gob.css">             <!-- tipografía Montserrat, tokens --gob-*, clases mg-* -->
<script type="module" src="../cdn/v1/gob.js"></script>       <!-- carga solo los componentes gob-* que use la página -->
<style>
%CSS%
</style>
</head>
'''

CSS_BASE = '''  /* ② ESTRUCTURA DE LA PÁGINA (propia de este demo: adáptela a su proyecto) */
  body { margin: 0; background: var(--mg-bg-app); color: var(--mg-text); }
  h1 { margin: 0; font-size: 1.5rem; } .muted { color: var(--mg-text-muted); }
  .grid { display: grid; gap: 1rem; } .row { display: flex; flex-wrap: wrap; gap: .6rem; align-items: center; }
  .page-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; flex-wrap: wrap; }
  .page-head p { margin: .25rem 0 0; color: var(--mg-text-muted); }'''

CSS_ADMIN = CSS_BASE + '''
  .app { display: grid; grid-template-columns: 264px minmax(0, 1fr); min-height: 100vh; }
  .app__side { background: #081A2C; position: sticky; top: 0; height: 100vh; overflow: auto; display: flex; flex-direction: column; gap: .25rem; padding: 1rem .75rem; }
  .app__brand { padding: .25rem .5rem 1rem; border-bottom: 1px solid rgba(255,255,255,.08); margin-bottom: .5rem; } .app__brand img { height: 40px; display: block; }
  .app__user { margin-top: auto; display: flex; align-items: center; gap: .65rem; padding: .75rem; border-radius: 12px; background: rgba(255,255,255,.06); color: #fff; font-size: .82rem; } .app__user small { display: block; color: #C9D4E3; }
  .app__main { display: flex; flex-direction: column; min-width: 0; }
  .app__top { position: sticky; top: 0; z-index: 30; display: flex; align-items: center; gap: 1rem; padding: .7rem 1.5rem; background: var(--mg-glass-bg); -webkit-backdrop-filter: var(--mg-glass-blur); backdrop-filter: var(--mg-glass-blur); border-bottom: 1px solid var(--mg-border); }
  .app__top .sp { flex: 1; } .app__search { max-width: 22rem; width: 100%; } .ico-btn.app__burger { display: none; }
  .app__content { padding: 1.5rem; display: grid; gap: 1.25rem; width: 100%; max-width: 1560px; margin: 0 auto; box-sizing: border-box; }
  .app__content > *, .grid > * { min-width: 0; } .app__content { grid-template-columns: minmax(0, 1fr); } .app__top .mg-breadcrumb { min-width: 0; overflow: hidden; white-space: nowrap; } .app__search { min-width: 0; }
  .ico-btn { position: relative; display: inline-grid; place-items: center; width: 2.4rem; height: 2.4rem; border: 1px solid var(--mg-border-strong); background: #fff; border-radius: 10px; cursor: pointer; color: var(--mg-gray-700); } .ico-btn:hover { background: var(--mg-gray-50); } .ico-btn .dot { position: absolute; top: -.25rem; right: -.25rem; min-width: 1.1rem; height: 1.1rem; padding: 0 .25rem; border-radius: 99px; background: var(--mg-red-600); color: #fff; font: 700 .65rem/1.1rem var(--mg-font-sans); text-align: center; }
  .app__veil { display: none; }
  @media (max-width: 900px) { .app { grid-template-columns: minmax(0, 1fr); } .app__search { max-width: 9rem; } .app__top .mg-breadcrumb { display: none; } .app__side { position: fixed; z-index: 80; left: 0; top: 0; bottom: 0; width: 264px; transform: translateX(-100%); transition: transform .25s; } .app--menu .app__side { transform: none; } .app--menu .app__veil { display: block; position: fixed; inset: 0; z-index: 70; background: rgba(8,26,44,.5); } .ico-btn.app__burger { display: inline-grid; } .app__top { padding: .6rem 1rem; } .app__content { padding: 1rem; } }'''

CSS_PUBLICA = CSS_BASE + '''
  .wrap { width: 100%; max-width: 1180px; margin: 0 auto; padding-inline: 1.25rem; box-sizing: border-box; }
  .topbar { background: #fff; border-bottom: 1px solid var(--mg-border); position: sticky; top: 0; z-index: 40; } .topbar .wrap { display: flex; align-items: center; gap: 1.25rem; padding-block: .7rem; } .topbar img { height: 44px; display: block; } .topbar nav { margin-left: auto; display: flex; gap: .15rem; flex-wrap: wrap; }
  section.band { padding-block: clamp(2.2rem, 5vw, 4rem); } section.band h2 { margin: 0 0 .4rem; font-size: clamp(1.4rem, 2.5vw, 2rem); } section.band .lead { margin: 0 0 1.75rem; color: var(--mg-text-muted); max-width: 60ch; }
  .cards { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); }
  .svc { display: grid; gap: .5rem; align-content: start; padding: 1.25rem; text-decoration: none; color: inherit; } .svc .ic { display: grid; place-items: center; width: 2.8rem; height: 2.8rem; border-radius: 12px; background: var(--mg-primary-50); color: var(--mg-primary); } .svc h3 { margin: .25rem 0 0; font-size: 1.05rem; } .svc p { margin: 0; color: var(--mg-text-muted); font-size: .9rem; }'''

BANNER = '''<!--DEMO-ONLY-->
<section class="mg-card" style="border-left:4px solid var(--mg-primary)" aria-label="Cómo usar este demo">
  <details open style="padding:1rem 1.25rem"><summary style="cursor:pointer;font-weight:700">Cómo usar este demo como plantilla (clic para ocultar)</summary>
    <ol style="margin:.8rem 0 0;padding-left:1.2rem;line-height:1.75;color:var(--mg-gray-700)">
      <li>Pulse <b>«‹/› Guías de código»</b> (abajo a la derecha): cada sección se enmarca con su nombre y un botón <b>Copiar sección</b>.</li>
      <li>O use <b>«⧉ Copiar página»</b> / <b>«⬇ .html»</b> para llevarse la página completa. Las rutas relativas se convierten en absolutas (<code>%BASE%</code>), así funciona pegada en cualquier sitio.</li>
      <li>Toda página necesita solo <b>dos líneas</b> en el <code>&lt;head&gt;</code>: <code>gob.css</code> y <code>gob.js</code> (están en el <code>&lt;head&gt;</code> de este archivo, marcadas con ①). Sin internet: descargue <a href="../dist/downloads/gob-cdn-v1.zip">gob-cdn-v1.zip</a>.</li>
      %EXTRA%
    </ol>
    <p class="mg-help" style="margin:.8rem 0 0">Componentes usados: %COMPS%. Los datos son <b>ficticios</b> (<code>cdn/v1/datos/ejemplo-*.json</code>); en producción cámbielos por su API.</p></details>
</section>
<!--/DEMO-ONLY-->'''


def banner(extra, comps):
    return BANNER.replace('%EXTRA%', ''.join(f'<li>{e}</li>' for e in extra)).replace('%COMPS%', comps).replace('%BASE%', 'https://su-sitio/…')


def sidebar(activo):
    ACT = ' class="is-active" aria-current="page"'
    links = ''.join('<a href="%s"%s><gob-icono nombre="%s" tam="18"></gob-icono> %s</a>' % (h, ACT if h == activo else '', i, t) for h, t, i in NAV)
    return f'''<aside class="app__side mg-sidebar" data-demo="Menú lateral" data-nota="Sidebar azul-noche (clase mg-sidebar) con íconos gob-icono">
      <div class="app__brand"><img src="../assets/logos/svg/logo-horizontal-blanco.svg" alt="Gobernación del Magdalena"></div>
      <span class="mg-sidebar__label">Demos</span>
      {links}
      <span class="mg-sidebar__label">Manual</span>
      <a href="../index.html"><gob-icono nombre="flecha-izquierda" tam="18"></gob-icono> Volver al manual</a>
      <a href="../estudio/index.html"><gob-icono nombre="grafica-barras" tam="18"></gob-icono> Estudio</a>
      <div class="app__user"><span class="mg-avatar" style="border-color:rgba(255,255,255,.2)">UD</span><div>Usuario demostrativo<small>Oficina TIC</small></div></div>
    </aside>'''


def topbar(crumbs):
    c = ''.join(f'<li>{x}</li>' for x in crumbs)
    return f'''<header class="app__top" data-demo="Barra superior" data-nota="Barra de cristal con migas, buscador, notificaciones y usuario">
        <button class="ico-btn app__burger" type="button" id="menu" aria-label="Abrir menú"><gob-icono nombre="menu"></gob-icono></button>
        <ul class="mg-breadcrumb">{c}</ul><span class="sp"></span>
        <label class="app__search"><span class="mg-sr-only">Buscar</span><input class="mg-input" type="search" placeholder="Buscar radicado, municipio…" id="buscar"></label>
        <button class="ico-btn" type="button" id="campana" aria-label="3 notificaciones nuevas"><gob-icono nombre="campana"></gob-icono><span class="dot" aria-hidden="true">3</span></button>
      </header>'''


SCRIPT_SHELL = '''<script type="module">
  // Menú móvil y notificaciones (propios del demo)
  const app = document.querySelector('.app');
  document.getElementById('menu')?.addEventListener('click', () => app.classList.toggle('app--menu'));
  document.querySelector('.app__veil')?.addEventListener('click', () => app.classList.remove('app--menu'));
  document.getElementById('campana')?.addEventListener('click', () => gob.toast({ tipo: 'info', titulo: '3 notificaciones', mensaje: 'Tiene 3 radicados por vencer esta semana.' }));
  document.getElementById('buscar')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') gob.toast({ tipo: 'info', titulo: 'Búsqueda', mensaje: 'En producción esto consultaría su API: «' + e.target.value + '»' }); });
</script>'''


def admin(archivo, titulo, crumbs, cuerpo, banner_html, extra_css=''):
    css = CSS_ADMIN + extra_css
    return (HEAD.replace('%TITULO%', titulo).replace('%CSS%', css) + f'''<body class="mg-base">
<a class="mg-skip" href="#contenido">Saltar al contenido</a>
<div class="app">
    {sidebar(archivo)}
    <div class="app__veil"></div>
    <div class="app__main">
      {topbar(crumbs)}
      <main class="app__content" id="contenido">
{banner_html}
{cuerpo}
      </main>
    </div>
</div>
{SCRIPT_SHELL}
<!--DEMO-ONLY--><script type="module" src="demo-kit.js"></script><!--/DEMO-ONLY-->
</body>
</html>
''')


# ====================================================================== 1 · PANEL EJECUTIVO
PANEL = '''        <div class="page-head"><div><h1>Panel ejecutivo</h1><p>Atención al ciudadano · corte al 12 de octubre de 2026</p></div>
          <div class="row"><button class="mg-btn mg-btn--secondary mg-btn--sm" id="actualizar"><gob-icono nombre="refrescar" tam="16"></gob-icono> Actualizar</button><button class="mg-btn mg-btn--sm" id="reporte"><gob-icono nombre="descargar" tam="16"></gob-icono> Descargar reporte</button></div></div>

        <section data-demo="Alerta de contexto" data-nota="gob-alerta: aviso informativo cerrable con acción">
          <gob-alerta tipo="info" titulo="Cifras de demostración" cerrable>Estos datos son ficticios. En producción se alimentan desde su API (NestJS, Laravel…).
            <button slot="acciones" class="mg-btn mg-btn--sm mg-btn--secondary" id="verapi">Ver cómo conectar</button></gob-alerta>
        </section>

        <gob-pestanas items='[{"id":"res","titulo":"Resumen","icono":"panel"},{"id":"det","titulo":"Detalle de radicados","icono":"tabla","contador":900},{"id":"ale","titulo":"Alertas","icono":"alerta","contador":3}]' activa="res" etiqueta="Secciones del panel" data-demo="Pestañas" data-nota="gob-pestanas: cada panel va en un elemento con slot=id">
          <div slot="res">
            <section data-demo="Dashboard (KPI + gráficas + mapa + tabla)" data-nota="gob-dashboard: se describe con JSON; filtra al hacer clic en barras, sectores o municipios">
              <gob-dashboard id="tablero"></gob-dashboard>
              <script type="module">
                const registros = await fetch('../cdn/v1/datos/ejemplo-radicados.json').then((r) => r.json());
                document.getElementById('tablero').config = {
                  titulo: 'Atención al ciudadano 2026', subtitulo: 'Radicados por subregión, estado y tiempo',
                  registros,
                  filtros: [{ campo: 'subregion', etiqueta: 'Subregión' }, { campo: 'dependencia', etiqueta: 'Dependencia' }, { campo: 'tipo', etiqueta: 'Tipo' }],
                  widgets: [
                    { tipo: 'kpi', titulo: 'Radicados', medida: 'conteo', icono: 'archivo', serie: 'fecha:mes', col: 3 },
                    { tipo: 'kpi', titulo: 'Resueltos', medida: 'conteo', donde: { estado: 'Resuelto' }, icono: 'check-circulo', color: 'verde', serie: 'fecha:mes', col: 3 },
                    { tipo: 'kpi', titulo: 'Días promedio', medida: 'promedio', campo: 'dias', unidad: 'd', icono: 'reloj', color: 'cian', buenoSube: false, serie: 'fecha:mes', col: 3 },
                    { tipo: 'kpi', titulo: 'Vencidos', medida: 'conteo', donde: { estado: 'Vencido' }, icono: 'alerta', color: 'rojo', buenoSube: false, serie: 'fecha:mes', col: 3 },
                    { tipo: 'grafica', grafica: 'area', titulo: 'Radicados por mes', agrupar: 'fecha:mes', serie: 'estado', colores: ['#00B7D9', '#FEC800', '#69B75E', '#F7003C'], apilado: true, col: 8, alto: 300 },
                    { tipo: 'grafica', grafica: 'dona', titulo: 'Por tipo de solicitud', agrupar: 'tipo', col: 4, alto: 300 },
                    { tipo: 'mapa', titulo: 'Radicados por municipio', medida: 'conteo', col: 5, rampa: 'azul', leyendaTitulo: 'Radicados' },
                    { tipo: 'grafica', grafica: 'barras-horizontal', titulo: 'Por dependencia', agrupar: 'dependencia', orden: 'valor-desc', etiquetas: true, col: 7, alto: 360 },
                  ],
                };
              </script>
            </section>
          </div>
          <div slot="det">
            <section data-demo="Tabla de radicados" data-nota="gob-tabla: búsqueda, filtros por columna, orden, paginación, exportar">
              <gob-tabla id="tabla" titulo="Radicados 2026" filtros-columna zebra tamano-pagina="10"></gob-tabla>
              <script type="module">
                const filas = await fetch('../cdn/v1/datos/ejemplo-radicados.json').then((r) => r.json());
                document.getElementById('tabla').config = { datos: filas, llave: 'id', ordenInicial: { campo: 'fecha', dir: 'desc' }, columnas: [
                  { campo: 'id', titulo: 'Radicado', nowrap: true }, { campo: 'fecha', titulo: 'Fecha', tipo: 'fecha' }, { campo: 'municipio', titulo: 'Municipio' }, { campo: 'dependencia', titulo: 'Dependencia' }, { campo: 'tipo', titulo: 'Tipo' },
                  { campo: 'estado', titulo: 'Estado', tipo: 'estado', estados: { Resuelto: 'exito', 'En trámite': 'info', Pendiente: 'aviso', Vencido: 'peligro' } },
                  { campo: 'prioridad', titulo: 'Prioridad' }, { campo: 'dias', titulo: 'Días', tipo: 'numero', semaforo: { verde: 10, amarillo: 25, invertir: true } } ] };
              </script>
            </section>
          </div>
          <div slot="ale">
            <section class="grid" data-demo="Alertas operativas" data-nota="gob-alerta de varios tipos con botones de acción">
              <gob-alerta tipo="peligro" titulo="31 radicados vencidos">Superaron el plazo legal de respuesta. Priorice los de la Secretaría de Salud.<button slot="acciones" class="mg-btn mg-btn--sm mg-btn--danger" data-toast="Abrió la bandeja de vencidos">Ver bandeja</button></gob-alerta>
              <gob-alerta tipo="aviso" titulo="12 por vencer esta semana">Responda antes del viernes para evitar sanciones.<button slot="acciones" class="mg-btn mg-btn--sm mg-btn--secondary" data-toast="Se enviaron recordatorios">Enviar recordatorios</button></gob-alerta>
              <gob-alerta tipo="exito" titulo="Meta de resolución cumplida">El 87 % de los radicados del trimestre fue resuelto a tiempo.</gob-alerta>
            </section>
          </div>
        </gob-pestanas>
        <script type="module">
          document.getElementById('actualizar').onclick = () => gob.toast({ tipo: 'exito', titulo: 'Datos actualizados' });
          document.getElementById('reporte').onclick = () => gob.toast({ tipo: 'info', titulo: 'Reporte en preparación', mensaje: 'Se descargará como PDF (demostración).' });
          document.getElementById('verapi').onclick = () => gob.confirmar({ titulo: 'Conectar a su API', mensaje: 'Asigne el arreglo de registros: tablero.registros = await fetch("/api/radicados").then(r => r.json()).', textoConfirmar: 'Entendido', textoCancelar: 'Cerrar' });
          document.querySelectorAll('[data-toast]').forEach((b) => (b.onclick = () => gob.toast({ tipo: 'info', titulo: b.dataset.toast })));
        </script>'''


# ====================================================================== 2 · GESTIÓN DE TRÁMITES
GESTION = '''        <div class="page-head"><div><h1>Gestión de trámites</h1><p>Bandeja con selección, acciones por fila y masivas, alta/edición en ventana modal y confirmaciones.</p></div>
          <div class="row" data-demo="Barra de acciones de la página" data-nota="Botones mg-btn con íconos gob-icono; abren modales y toasts"><button class="mg-btn mg-btn--secondary" id="importar"><gob-icono nombre="subir" tam="16"></gob-icono> Importar</button><button class="mg-btn" id="nuevo"><gob-icono nombre="agregar" tam="16"></gob-icono> Nuevo trámite</button></div></div>

        <section class="grid" style="grid-template-columns:repeat(auto-fit,minmax(13rem,1fr))" data-demo="Indicadores rápidos" data-nota="gob-kpi: se actualizan al cambiar la tabla (kpi.valor = …)">
          <gob-kpi id="k1" etiqueta="Trámites" icono="archivo"></gob-kpi><gob-kpi id="k2" etiqueta="En trámite" icono="reloj" color="cian"></gob-kpi>
          <gob-kpi id="k3" etiqueta="Vencidos" icono="alerta" color="rojo" bueno-sube="false"></gob-kpi><gob-kpi id="k4" etiqueta="Valor total" icono="dinero" color="verde" formato="compacto"></gob-kpi>
        </section>

        <section data-demo="Tabla de trámites con selección y acciones" data-nota="gob-tabla: seleccion=multiple, acciones por fila, acciones masivas y totales">
          <gob-tabla id="tabla" titulo="Bandeja de trámites" seleccion="multiple" filtros-columna totales tamano-pagina="8" selector-columnas></gob-tabla>
        </section>

        <section data-demo="Modal de alta y edición con validación" data-nota="gob-modal + formulario mg-input; valida y muestra errores accesibles">
          <gob-modal id="mForm" titulo="Nuevo trámite" tipo="info" tam="md">
            <form id="form" novalidate class="grid" style="gap:.85rem">
              <div class="mg-field"><label class="mg-label" for="f-asunto">Asunto *</label><input class="mg-input" id="f-asunto" name="asunto" autocomplete="off" aria-describedby="e-asunto"><span class="mg-error" id="e-asunto" role="alert"></span></div>
              <div class="mg-field"><label class="mg-label" for="f-solicitante">Solicitante *</label><input class="mg-input" id="f-solicitante" name="solicitante" autocomplete="name" aria-describedby="e-solicitante"><span class="mg-error" id="e-solicitante" role="alert"></span></div>
              <div class="grid" style="grid-template-columns:1fr 1fr;gap:.85rem">
                <div class="mg-field"><label class="mg-label" for="f-municipio">Municipio</label><select class="mg-select" id="f-municipio" name="municipio"><option>Santa Marta</option><option>Ciénaga</option><option>Fundación</option><option>Aracataca</option><option>Plato</option><option>El Banco</option></select></div>
                <div class="mg-field"><label class="mg-label" for="f-estado">Estado</label><select class="mg-select" id="f-estado" name="estado"><option>Pendiente</option><option>En trámite</option><option>Resuelto</option><option>Vencido</option></select></div>
              </div>
              <div class="mg-field"><label class="mg-label" for="f-valor">Valor estimado (COP)</label><input class="mg-input" id="f-valor" name="valor" type="number" min="0" step="1000" value="0"><span class="mg-help">Deje 0 si el trámite no genera cobro.</span></div>
            </form>
            <button slot="pie" class="mg-btn mg-btn--secondary" type="button" id="cancelar">Cancelar</button><button slot="pie" class="mg-btn" type="button" id="guardar">Guardar</button>
          </gob-modal>
        </section>

        <section data-demo="Modal de detalle con pestañas y línea de tiempo" data-nota="gob-modal tam=lg con gob-pestanas y mg-timeline">
          <gob-modal id="mDetalle" titulo="Detalle del trámite" tam="lg" icono="carpeta">
            <gob-pestanas items='[{"id":"g","titulo":"General","icono":"inicio"},{"id":"d","titulo":"Documentos","icono":"archivo","contador":2},{"id":"h","titulo":"Historial","icono":"historial"}]' activa="g">
              <div slot="g"><dl id="dl" style="display:grid;grid-template-columns:max-content 1fr;gap:.5rem 1.25rem;margin:0"></dl></div>
              <div slot="d"><ul style="margin:0;padding-left:1.1rem;line-height:1.9"><li>Solicitud firmada.pdf <span class="mg-badge mg-badge--green">Verificado</span></li><li>Cédula del solicitante.pdf <span class="mg-badge mg-badge--yellow">Pendiente</span></li></ul></div>
              <div slot="h"><ol class="mg-timeline"><li><time>12 oct 2026</time><strong>Radicado</strong> por el solicitante</li><li><time>13 oct 2026</time><strong>Asignado</strong> a la dependencia</li><li><time>15 oct 2026</time><strong>En revisión</strong> por el equipo jurídico</li></ol></div>
            </gob-pestanas>
            <button slot="pie" class="mg-btn" type="button" onclick="document.getElementById('mDetalle').cerrar()">Cerrar</button>
          </gob-modal>
        </section>

        <script type="module">
          const $ = (id) => document.getElementById(id);
          let filas = await fetch('../cdn/v1/datos/ejemplo-tramites.json').then((r) => r.json());
          const tabla = $('tabla'); let editando = null;

          tabla.config = { datos: filas, llave: 'id', ordenInicial: { campo: 'fecha', dir: 'desc' },
            columnas: [
              { campo: 'radicado', titulo: 'Radicado', nowrap: true }, { campo: 'asunto', titulo: 'Asunto' }, { campo: 'solicitante', titulo: 'Solicitante' }, { campo: 'municipio', titulo: 'Municipio' },
              { campo: 'estado', titulo: 'Estado', tipo: 'estado', estados: { Resuelto: 'exito', 'En trámite': 'info', Pendiente: 'aviso', Vencido: 'peligro' } },
              { campo: 'fecha', titulo: 'Fecha', tipo: 'fecha' }, { campo: 'dias', titulo: 'Días', tipo: 'numero', semaforo: { verde: 10, amarillo: 25, invertir: true }, total: 'promedio' },
              { campo: 'valor', titulo: 'Valor', tipo: 'cop', total: 'suma' }, { campo: 'avance', titulo: 'Avance', tipo: 'barra', maximo: 1 } ],
            acciones: [{ id: 'ver', etiqueta: 'Ver detalle', icono: 'ojo' }, { id: 'editar', etiqueta: 'Editar', icono: 'editar' }, { id: 'eliminar', etiqueta: 'Eliminar', icono: 'eliminar', tipo: 'peligro' }],
            accionesMasivas: [{ id: 'asignar', etiqueta: 'Asignar', icono: 'persona-agregar', tipo: 'primario' }, { id: 'exportar', etiqueta: 'Exportar', icono: 'descargar' }, { id: 'eliminar', etiqueta: 'Eliminar', icono: 'eliminar', tipo: 'peligro' }] };

          function indicadores() {
            $('k1').valor = filas.length; $('k2').valor = filas.filter((f) => f.estado === 'En trámite').length;
            $('k3').valor = filas.filter((f) => f.estado === 'Vencido').length; $('k4').valor = filas.reduce((a, f) => a + f.valor, 0);
          }
          indicadores();

          // — Alta / edición con validación
          const campos = { asunto: 'El asunto es obligatorio', solicitante: 'El solicitante es obligatorio' };
          function validar() {
            let ok = true;
            for (const [k, msg] of Object.entries(campos)) { const i = $('f-' + k), e = $('e-' + k), vacio = !i.value.trim(); i.classList.toggle('is-invalid', vacio); i.setAttribute('aria-invalid', vacio); e.textContent = vacio ? msg : ''; if (vacio) ok = false; }
            return ok;
          }
          function abrirForm(f) {
            editando = f ?? null; $('mForm').titulo = f ? 'Editar trámite ' + f.radicado : 'Nuevo trámite';
            $('f-asunto').value = f?.asunto ?? ''; $('f-solicitante').value = f?.solicitante ?? ''; $('f-municipio').value = f?.municipio ?? 'Santa Marta'; $('f-estado').value = f?.estado ?? 'Pendiente'; $('f-valor').value = f?.valor ?? 0;
            for (const k of Object.keys(campos)) { $('f-' + k).classList.remove('is-invalid'); $('e-' + k).textContent = ''; }
            $('mForm').abrir(); setTimeout(() => $('f-asunto').focus(), 120);
          }
          $('nuevo').onclick = () => abrirForm(); $('cancelar').onclick = () => $('mForm').cerrar();
          $('guardar').onclick = () => {
            if (!validar()) { gob.toast({ tipo: 'aviso', titulo: 'Revise el formulario', mensaje: 'Hay campos obligatorios sin completar.' }); return; }
            const d = { asunto: $('f-asunto').value.trim(), solicitante: $('f-solicitante').value.trim(), municipio: $('f-municipio').value, estado: $('f-estado').value, valor: Number($('f-valor').value) || 0 };
            if (editando) Object.assign(editando, d); else filas = [{ id: Date.now(), radicado: 'R-2026-' + String(Math.floor(Math.random() * 90000) + 10000), fecha: new Date().toISOString().slice(0, 10), dias: 0, avance: 0, ...d }, ...filas];
            tabla.datos = [...filas]; indicadores(); $('mForm').cerrar();
            gob.toast({ tipo: 'exito', titulo: editando ? 'Trámite actualizado' : 'Trámite creado', mensaje: d.asunto });
          };

          // — Acciones de la tabla
          tabla.addEventListener('gob-tabla-accion', async (e) => {
            const { accion, fila, filas: sel } = e.detail;
            if (accion === 'ver') {
              $('dl').innerHTML = Object.entries({ Radicado: fila.radicado, Asunto: fila.asunto, Solicitante: fila.solicitante, Municipio: fila.municipio, Estado: fila.estado, 'Días transcurridos': fila.dias }).map(([k, v]) => `<dt class="muted">${k}</dt><dd style="margin:0;font-weight:600">${v}</dd>`).join('');
              $('mDetalle').titulo = 'Trámite ' + fila.radicado; $('mDetalle').abrir();
            } else if (accion === 'editar') abrirForm(fila);
            else if (accion === 'eliminar') {
              const n = fila ? 1 : sel.length;
              if (await gob.confirmar({ titulo: 'Eliminar', mensaje: n === 1 ? '¿Eliminar el trámite ' + (fila ?? sel[0]).radicado + '?' : '¿Eliminar ' + n + ' trámites seleccionados?', tipo: 'peligro', textoConfirmar: 'Eliminar' })) {
                const ids = new Set((fila ? [fila] : sel).map((f) => f.id)); filas = filas.filter((f) => !ids.has(f.id)); tabla.datos = [...filas]; tabla.limpiarSeleccion(); indicadores();
                gob.toast({ tipo: 'exito', titulo: n + ' eliminado' + (n > 1 ? 's' : '') });
              }
            } else if (accion === 'asignar') gob.toast({ tipo: 'info', titulo: 'Asignación', mensaje: sel.length + ' trámites asignados (demostración).' });
            else if (accion === 'exportar') tabla.exportarCSV('tramites-seleccion');
          });
          $('importar').onclick = () => gob.toast({ tipo: 'info', titulo: 'Importar', mensaje: 'Aquí abriría su selector de archivos (CSV/Excel).' });
        </script>'''


# ====================================================================== 3 · ANALÍTICA TERRITORIAL
TERR = '''        <div class="page-head"><div><h1>Analítica territorial</h1><p>Indicadores por municipio y subregión, y presencia institucional con rutas animadas.</p></div></div>

        <gob-pestanas items='[{"id":"ind","titulo":"Indicadores","icono":"grafica-barras"},{"id":"pre","titulo":"Presencia institucional","icono":"ubicacion"}]' activa="ind" etiqueta="Vistas territoriales" data-demo="Pestañas de vistas" data-nota="Dos vistas del territorio dentro de gob-pestanas">
          <div slot="ind">
            <section data-demo="Dashboard territorial" data-nota="Plantilla «territorial» del Estudio de dashboards: mapa grande + ranking + dona + treemap">
              <gob-dashboard id="territorial"></gob-dashboard>
              <script type="module">
                const registros = await fetch('../cdn/v1/datos/ejemplo-radicados.json').then((r) => r.json());
                document.getElementById('territorial').config = {
                  titulo: 'Radicados por territorio', subtitulo: 'Haga clic en un municipio o en una barra para filtrar todo el tablero', registros,
                  filtros: [{ campo: 'subregion', etiqueta: 'Subregión' }, { campo: 'tipo', etiqueta: 'Tipo de solicitud' }, { campo: 'fecha:mes', etiqueta: 'Mes' }],
                  widgets: [
                    { tipo: 'kpi', titulo: 'Radicados', medida: 'conteo', icono: 'archivo', serie: 'fecha:mes', col: 4 },
                    { tipo: 'kpi', titulo: 'Municipios con casos', medida: 'distintos', campo: 'codigo', icono: 'mapa', color: 'cian', col: 4 },
                    { tipo: 'kpi', titulo: 'Días promedio', medida: 'promedio', campo: 'dias', unidad: 'd', icono: 'reloj', color: 'amarillo', buenoSube: false, col: 4 },
                    { tipo: 'mapa', titulo: 'Mapa de radicados', medida: 'conteo', col: 7, rampa: 'azul', leyendaTitulo: 'Radicados' },
                    { tipo: 'grafica', grafica: 'barras-horizontal', titulo: 'Municipios con más radicados', agrupar: 'municipio', orden: 'valor-desc', limite: 10, etiquetas: true, col: 5, alto: 460 },
                    { tipo: 'grafica', grafica: 'dona', titulo: 'Por subregión', agrupar: 'subregion', col: 6, alto: 300 },
                    { tipo: 'grafica', grafica: 'treemap', titulo: 'Por dependencia', agrupar: 'dependencia', col: 6, alto: 300 },
                  ] };
              </script>
            </section>
          </div>
          <div slot="pre">
            <section class="grid" style="grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);align-items:start" data-demo="Mapa de sedes con rutas y efectos" data-nota="gob-mapa-magdalena con marcadores (radar, ping, pulso), rutas animadas con partículas y zoom a un municipio">
              <div class="mg-card" style="padding:.5rem;position:relative"><gob-mapa-magdalena id="mapa" detalle="medio" efectos="entrada,hormigas,foco" clic="zoom-seleccionar" etiquetas-auto tema="claro"></gob-mapa-magdalena></div>
              <div class="grid">
                <gob-tabla id="sedes" titulo="Sedes y oficinas" tamano-pagina="6" busqueda="false" exportar="false" selector-columnas="false" fila-clicable></gob-tabla>
                <div class="mg-card" style="padding:1rem"><h3 style="margin:0 0 .6rem;font-size:1rem">Efectos del mapa</h3>
                  <label class="st-chk" style="display:flex;gap:.5rem;margin-bottom:.4rem"><input type="checkbox" class="mg-check" id="rutas" checked> Rutas animadas</label>
                  <label style="display:flex;gap:.5rem;align-items:center"><span class="mg-label" style="margin:0">Subregión</span><select class="mg-select" id="sub" style="max-width:12rem"><option value="">Todas</option></select></label></div>
              </div>
              <script type="module">
                const $ = (id) => document.getElementById(id); const mapa = $('mapa'), sedes = $('sedes');
                const S = [
                  { codigo: '47001', nombre: 'Gobernación (Palacio Tayrona)', tipo: 'Sede central', icono: 'escudo', color: '#00B7D9', efecto: 'radar', municipio: 'Santa Marta', personal: 410 },
                  { codigo: '47189', nombre: 'Oficina regional Ciénaga', tipo: 'Regional', icono: 'edificio', color: '#FEC800', efecto: 'ping', municipio: 'Ciénaga', personal: 38 },
                  { codigo: '47288', nombre: 'Oficina regional Fundación', tipo: 'Regional', icono: 'edificio', color: '#FEC800', efecto: 'ping', municipio: 'Fundación', personal: 24 },
                  { codigo: '47555', nombre: 'Oficina regional Plato', tipo: 'Regional', icono: 'edificio', color: '#FEC800', efecto: 'ping', municipio: 'Plato', personal: 29 },
                  { codigo: '47245', nombre: 'Oficina regional El Banco', tipo: 'Regional', icono: 'edificio', color: '#FEC800', efecto: 'pulso', municipio: 'El Banco', personal: 21 },
                  { codigo: '47053', nombre: 'Centro de atención Aracataca', tipo: 'Atención', icono: 'salud', color: '#F7003C', efecto: 'pulso', municipio: 'Aracataca', personal: 15 },
                ];
                const rutas = [['47001', '47189', '#00B7D9'], ['47189', '47288', '#00B7D9'], ['47288', '47555', '#9FD7E5'], ['47555', '47245', '#9FD7E5'], ['47189', '47053', '#00B7D9']].map(([a, b, c]) => ({ desde: a, hasta: b, estilo: 'flujo', ancho: 2.5, curva: 0.16, particulas: true, color: c }));
                const subs = await fetch('../cdn/v1/datos/subregiones.json').then((r) => r.json());
                $('sub').insertAdjacentHTML('beforeend', subs.map((s) => `<option value="${s.id}">${s.nombre}</option>`).join(''));
                mapa.config = { modo: 'subregiones', leyendaTitulo: 'Subregiones', marcadores: S.map((s) => ({ codigo: s.codigo, nombre: s.nombre, categoria: s.tipo, icono: s.icono, color: s.color, efecto: s.efecto, tamano: s.efecto === 'radar' ? 32 : 26 })), lineas: rutas, coloresSubregiones: { sm: '#0B2239', no: '#0071BB', ri: '#4FA3D4', ce: '#9FD7E5', su: '#12395C' } };
                sedes.config = { datos: S, llave: 'codigo', columnas: [{ campo: 'nombre', titulo: 'Sede' }, { campo: 'municipio', titulo: 'Municipio' }, { campo: 'personal', titulo: 'Personal', tipo: 'numero' }] };
                sedes.addEventListener('gob-tabla-fila-clic', (e) => mapa.zoomA(e.detail.fila.codigo));
                mapa.addEventListener('gob-marcador-click', (e) => gob.toast({ tipo: 'info', titulo: e.detail.nombre, mensaje: e.detail.categoria }));
                $('rutas').onchange = (e) => (mapa.lineas = e.target.checked ? rutas : []);
                $('sub').onchange = (e) => (mapa.filtroSubregion = e.target.value);
              </script>
            </section>
          </div>
        </gob-pestanas>'''


# ====================================================================== 4 · PORTAL CIUDADANO
PORTAL = '''<body class="mg-base">
<a class="mg-skip" href="#contenido">Saltar al contenido</a>
<header class="topbar" data-demo="Encabezado institucional" data-nota="Logo oficial + navegación; sticky con línea de color en el pie del hero">
  <div class="wrap"><a href="portal-ciudadano.html"><img src="../assets/logos/svg/logo-horizontal-color.svg" alt="Gobernación del Magdalena, inicio"></a>
    <nav aria-label="Principal"><a class="mg-nav-link is-active" href="#tramites">Trámites</a><a class="mg-nav-link" href="#cifras">El Magdalena en cifras</a><a class="mg-nav-link" href="#mapa">Territorio</a><a class="mg-nav-link" href="#faq">Preguntas</a><a class="mg-nav-link" href="#noticias">Noticias</a></nav></div>
</header>
%BANNER%
<main id="contenido">
<section class="mg-hero mg-hero--stripe" data-demo="Hero con buscador" data-nota="Clase mg-hero (azul-noche con brillo cian); la línea multicolor como firma">
  <div class="wrap" style="max-width:860px"><div class="mg-eyebrow" style="color:var(--mg-cyan);margin-bottom:.8rem">Gobernación del Magdalena</div>
    <h1 class="mg-h1" style="color:#fff;margin:0 0 .8rem">Trámites y servicios para la ciudadanía</h1><p style="margin:0 0 1.5rem;font-size:1.1rem;max-width:56ch">Consulte requisitos, radique solicitudes y siga el estado de sus trámites desde un solo lugar.</p>
    <form class="mg-glass-dark" style="display:flex;gap:.5rem;padding:.5rem;max-width:40rem" onsubmit="event.preventDefault();gob.toast({tipo:'info',titulo:'Búsqueda',mensaje:'Buscaría «'+this.q.value+'» en el catálogo de trámites.'})">
      <label class="mg-sr-only" for="q">¿Qué trámite necesita?</label><input class="mg-input" id="q" name="q" placeholder="¿Qué trámite necesita? Ej.: certificado, licencia…" style="background:#fff;flex:1"><button class="mg-btn">Buscar</button></form></div>
</section>

<section class="band" id="tramites" data-demo="Trámites y servicios (tarjetas)" data-nota="Tarjetas mg-card--hover con ícono gob-icono; cada una enlaza al trámite">
  <div class="wrap"><h2>Trámites y servicios</h2><p class="lead">Los más solicitados por la ciudadanía.</p>
    <div class="cards">
      <a class="mg-card mg-card--hover svc" href="#" data-t="Certificados"><span class="ic"><gob-icono nombre="archivo" tam="24"></gob-icono></span><h3>Certificados y constancias</h3><p>Laboral, de residencia, paz y salvo.</p></a>
      <a class="mg-card mg-card--hover svc" href="#" data-t="Licencias"><span class="ic"><gob-icono nombre="edificio" tam="24"></gob-icono></span><h3>Licencias y permisos</h3><p>Construcción, eventos, funcionamiento.</p></a>
      <a class="mg-card mg-card--hover svc" href="#" data-t="PQRS"><span class="ic"><gob-icono nombre="mensaje" tam="24"></gob-icono></span><h3>Peticiones, quejas y reclamos</h3><p><a href="acceso-formularios.html#pqrs">Radique su PQRS</a> en línea.</p></a>
      <a class="mg-card mg-card--hover svc" href="#" data-t="Impuestos"><span class="ic"><gob-icono nombre="dinero" tam="24"></gob-icono></span><h3>Impuestos y pagos</h3><p>Consulte y pague en línea de forma segura.</p></a>
      <a class="mg-card mg-card--hover svc" href="#" data-t="Salud"><span class="ic"><gob-icono nombre="salud" tam="24"></gob-icono></span><h3>Salud pública</h3><p>Programas, vacunación y vigilancia.</p></a>
      <a class="mg-card mg-card--hover svc" href="#" data-t="Educación"><span class="ic"><gob-icono nombre="escuela" tam="24"></gob-icono></span><h3>Educación</h3><p>Matrículas, becas y convocatorias.</p></a>
    </div></div>
</section>

<section class="band" id="cifras" style="background:#fff;border-block:1px solid var(--mg-border)" data-demo="El Magdalena en cifras (KPI)" data-nota="gob-kpi con conteo animado; valores ficticios">
  <div class="wrap"><h2>El Magdalena en cifras</h2><p class="lead">Datos de ejemplo del departamento.</p>
    <div class="cards" style="grid-template-columns:repeat(auto-fit,minmax(13rem,1fr))">
      <gob-kpi etiqueta="Municipios" valor="30" icono="mapa"></gob-kpi><gob-kpi etiqueta="Subregiones" valor="5" icono="globo" color="cian"></gob-kpi>
      <gob-kpi etiqueta="Trámites en línea" valor="1284" delta="12.5" icono="tareas" color="verde"></gob-kpi><gob-kpi etiqueta="Satisfacción ciudadana" valor="0.91" formato="porcentaje" meta="1" icono="estrella" color="amarillo"></gob-kpi></div></div>
</section>

<section class="band" id="mapa" data-demo="Mapa interactivo del departamento" data-nota="gob-mapa-magdalena: al hacer clic en un municipio se abre un modal con su información">
  <div class="wrap"><h2>Conozca el territorio</h2><p class="lead">Seleccione un municipio para ver su información.</p>
    <div class="mg-card" style="padding:.75rem;max-width:760px;margin-inline:auto"><gob-mapa-magdalena id="mapaP" detalle="medio" clic="evento" efectos="entrada" etiquetas-auto etiquetas="nombres"></gob-mapa-magdalena></div>
    <gob-modal id="mMun" titulo="Municipio" icono="ubicacion" tam="md"><div id="mMunCuerpo"></div><button slot="pie" class="mg-btn" type="button" onclick="document.getElementById('mMun').cerrar()">Cerrar</button></gob-modal></div>
</section>

<section class="band" id="faq" style="background:#fff;border-block:1px solid var(--mg-border)" data-demo="Preguntas frecuentes (acordeón)" data-nota="Clase mg-acordeon sobre <details> nativos: accesible sin JavaScript">
  <div class="wrap" style="max-width:820px"><h2>Preguntas frecuentes</h2><p class="lead">Respuestas rápidas a las dudas más comunes.</p>
    <div class="mg-acordeon">
      <details open><summary>¿Cómo radico una petición?</summary><div class="cuerpo">Ingrese a «Peticiones, quejas y reclamos», complete el formulario en tres pasos y reciba su número de radicado por correo.</div></details>
      <details><summary>¿Cuánto tarda la respuesta?</summary><div class="cuerpo">Por regla general 15 días hábiles. Los tiempos varían según el tipo de solicitud y se informan al radicar.</div></details>
      <details><summary>¿Cómo consulto el estado de mi trámite?</summary><div class="cuerpo">Con su número de radicado y su documento en la sección «Consulta de trámites».</div></details>
      <details><summary>¿Dónde están las oficinas de atención?</summary><div class="cuerpo">Carrera 1C N° 16-15, Palacio Tayrona, Santa Marta. También hay oficinas regionales en Ciénaga, Fundación, Plato y El Banco.</div></details>
    </div></div>
</section>

<section class="band" id="noticias" data-demo="Noticias (tarjetas con imagen y etiqueta)" data-nota="mg-card con cabecera degradada y mg-badge">
  <div class="wrap"><h2>Noticias</h2><p class="lead">Lo último de la Gobernación (contenido de ejemplo).</p>
    <div class="cards">
      <article class="mg-card mg-card--hover"><div class="mg-bg-night" style="height:120px;display:grid;place-items:center;color:var(--mg-cyan)"><gob-icono nombre="mundo" tam="40"></gob-icono></div><div class="mg-card__body"><span class="mg-badge">Turismo</span><h3 class="mg-h4" style="margin:.6rem 0 .3rem">Reactivación del Corredor Turístico Tayrona</h3><p class="muted" style="margin:0;font-size:.9rem">Jornada de articulación con la Cámara de Comercio de Santa Marta.</p></div></article>
      <article class="mg-card mg-card--hover"><div class="mg-bg-night" style="height:120px;display:grid;place-items:center;color:var(--mg-cyan)"><gob-icono nombre="escuela" tam="40"></gob-icono></div><div class="mg-card__body"><span class="mg-badge mg-badge--green">Educación</span><h3 class="mg-h4" style="margin:.6rem 0 .3rem">Nuevas becas para jóvenes del departamento</h3><p class="muted" style="margin:0;font-size:.9rem">Abiertas las convocatorias para el segundo semestre.</p></div></article>
      <article class="mg-card mg-card--hover"><div class="mg-bg-night" style="height:120px;display:grid;place-items:center;color:var(--mg-cyan)"><gob-icono nombre="via" tam="40"></gob-icono></div><div class="mg-card__body"><span class="mg-badge mg-badge--yellow">Infraestructura</span><h3 class="mg-h4" style="margin:.6rem 0 .3rem">Avanza el mejoramiento de vías rurales</h3><p class="muted" style="margin:0;font-size:.9rem">Intervenciones en la Zona Bananera y la Sierra.</p></div></article>
    </div></div>
</section>
</main>

<footer class="mg-footer" data-demo="Pie de página institucional" data-nota="Clase mg-footer: azul-noche con la línea multicolor como firma">
  <div class="wrap" style="display:grid;gap:1.25rem;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr))">
    <div><img src="../assets/logos/svg/logo-horizontal-blanco.svg" alt="Gobernación del Magdalena" style="height:44px"><p style="margin:.8rem 0 0">Carrera 1C N° 16-15 · Palacio Tayrona<br>Santa Marta, Magdalena · Colombia</p></div>
    <div><strong style="color:#fff">Contacto</strong><p style="margin:.5rem 0 0">PBX: 60-5 4381144<br><a href="mailto:contactenos@magdalena.gov.co">contactenos@magdalena.gov.co</a></p></div>
    <div><strong style="color:#fff">Redes</strong><p style="margin:.5rem 0 0">@magdalenagober<br>@gobernaciondelmagdalena</p></div></div>
  <p style="margin:1.5rem auto 0;text-align:center;font-size:.8rem;opacity:.7">© 2026 Gobernación del Magdalena · Demo con datos ficticios</p>
</footer>

<script type="module">
  const mapa = document.getElementById('mapaP'), modal = document.getElementById('mMun');
  const muni = await fetch('../cdn/v1/datos/municipios.json').then((r) => r.json());
  const subs = await fetch('../cdn/v1/datos/subregiones.json').then((r) => r.json());
  mapa.addEventListener('gob-municipio-click', (e) => {
    const m = muni.find((x) => x.codigo === e.detail.codigo); modal.titulo = m.nombre;
    document.getElementById('mMunCuerpo').innerHTML = `<dl style="display:grid;grid-template-columns:max-content 1fr;gap:.4rem 1.25rem;margin:0"><dt class="muted">Código DANE</dt><dd style="margin:0;font-weight:600">${m.codigo}</dd><dt class="muted">Subregión</dt><dd style="margin:0;font-weight:600">${m.subregion}</dd><dt class="muted">Coordenadas</dt><dd style="margin:0;font-weight:600">${m.latitud}, ${m.longitud}</dd></dl><gob-alerta tipo="info" style="margin-top:1rem">Aquí iría la ficha del municipio (población, contacto del alcalde, trámites disponibles…).</gob-alerta>`;
    modal.abrir();
  });
  document.querySelectorAll('.svc[data-t]').forEach((a) => a.addEventListener('click', (e) => { if (e.target.closest('a[href]') !== a) return; e.preventDefault(); gob.toast({ tipo: 'info', titulo: a.dataset.t, mensaje: 'Abriría la ficha del trámite.' }); }));
</script>
<!--DEMO-ONLY--><script type="module" src="demo-kit.js"></script><!--/DEMO-ONLY-->
</body>
</html>
'''


# ====================================================================== 5 · ACCESO Y FORMULARIOS
ACCESO = '''<body class="mg-base">
<a class="mg-skip" href="#contenido">Saltar al contenido</a>
<div style="display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);min-height:100vh" class="acc">
  <aside class="mg-bg-night mg-shapes mg-shapes--dark" style="padding:2.5rem;display:flex;flex-direction:column;justify-content:space-between;color:#fff" data-demo="Panel de marca" data-nota="Fondo azul-noche con formas y logo blanco">
    <img src="../assets/logos/svg/logo-horizontal-blanco.svg" alt="Gobernación del Magdalena" style="height:56px;align-self:flex-start">
    <div><div class="mg-eyebrow" style="color:var(--mg-cyan);margin-bottom:.8rem">Servicios en línea</div><h1 class="mg-h1" style="color:#fff;margin:0 0 1rem">Un solo acceso a sus trámites</h1><p style="max-width:34ch;opacity:.8;margin:0">Ingrese, radique y haga seguimiento de sus solicitudes con la Gobernación del Magdalena.</p></div>
    <hr class="mg-stripe mg-stripe--thick" style="border-radius:3px"></aside>
  <div style="padding:2rem 1.25rem;display:grid;gap:2rem;align-content:start;max-width:720px;width:100%;margin-inline:auto;box-sizing:border-box" id="contenido">
%BANNER%
    <section class="mg-card" style="padding:1.5rem" data-demo="Ingreso y registro (pestañas)" data-nota="gob-pestanas con dos formularios; validación en cliente y mensajes accesibles">
      <gob-pestanas items='[{"id":"in","titulo":"Ingresar","icono":"entrar"},{"id":"re","titulo":"Crear cuenta","icono":"persona-agregar"}]' activa="in" etiqueta="Acceso">
        <form slot="in" id="fIn" novalidate class="grid" style="gap:1rem">
          <div class="mg-field"><label class="mg-label" for="i-doc">Documento de identidad</label><input class="mg-input" id="i-doc" inputmode="numeric" autocomplete="username" aria-describedby="e-idoc"><span class="mg-error" id="e-idoc" role="alert"></span></div>
          <div class="mg-field"><label class="mg-label" for="i-pw">Contraseña</label><div style="position:relative"><input class="mg-input" id="i-pw" type="password" autocomplete="current-password" aria-describedby="e-ipw" style="padding-right:3rem"><button type="button" class="ico-btn" id="ver" aria-label="Mostrar contraseña" aria-pressed="false" style="position:absolute;right:.3rem;top:50%;transform:translateY(-50%);width:2.2rem;height:2.2rem;border:0;background:none;cursor:pointer"><gob-icono nombre="ojo"></gob-icono></button></div><span class="mg-error" id="e-ipw" role="alert"></span></div>
          <label style="display:flex;gap:.5rem;align-items:center;font-size:.9rem"><input type="checkbox" class="mg-check"> Mantener la sesión iniciada</label>
          <button class="mg-btn mg-btn--lg mg-btn--block">Ingresar</button><a href="#" class="mg-link" style="text-align:center;font-size:.9rem" id="olvido">¿Olvidó su contraseña?</a>
        </form>
        <form slot="re" id="fRe" novalidate class="grid" style="gap:1rem">
          <div class="mg-field"><label class="mg-label" for="r-nom">Nombre completo</label><input class="mg-input" id="r-nom" autocomplete="name" aria-describedby="e-rnom"><span class="mg-error" id="e-rnom" role="alert"></span></div>
          <div class="mg-field"><label class="mg-label" for="r-mail">Correo electrónico</label><input class="mg-input" id="r-mail" type="email" autocomplete="email" aria-describedby="e-rmail"><span class="mg-error" id="e-rmail" role="alert"></span></div>
          <label style="display:flex;gap:.5rem;align-items:flex-start;font-size:.88rem"><input type="checkbox" class="mg-check" id="r-ok" style="margin-top:.2rem"> Acepto la política de tratamiento de datos personales.</label><span class="mg-error" id="e-rok" role="alert"></span>
          <button class="mg-btn mg-btn--lg mg-btn--block">Crear cuenta</button>
        </form>
      </gob-pestanas>
    </section>

    <section class="mg-card" style="padding:1.5rem" id="pqrs" data-demo="Formulario por pasos (stepper) · Radicar una PQRS" data-nota="mg-stepper + 3 pasos con validación, resumen, confirmación (gob.confirmar) y toast">
      <h2 style="margin:0 0 .25rem;font-size:1.25rem">Radicar una petición, queja o reclamo</h2><p class="muted" style="margin:0 0 1.25rem">Complete los tres pasos. Los campos con * son obligatorios.</p>
      <ol class="mg-stepper" id="pasos" aria-label="Progreso"><li class="is-current" aria-current="step"><span>Sus datos</span></li><li><span>Su solicitud</span></li><li><span>Confirmación</span></li></ol>
      <div id="alertaForm" aria-live="polite" style="margin-top:1rem"></div>
      <form id="fPq" novalidate style="margin-top:1.25rem">
        <div data-paso="1" class="grid" style="gap:1rem"><div class="grid" style="grid-template-columns:1fr 1fr;gap:1rem">
          <div class="mg-field"><label class="mg-label" for="p-tipo">Tipo de documento *</label><select class="mg-select" id="p-tipo"><option>Cédula de ciudadanía</option><option>Cédula de extranjería</option><option>NIT</option></select></div>
          <div class="mg-field"><label class="mg-label" for="p-doc">Número *</label><input class="mg-input" id="p-doc" inputmode="numeric" aria-describedby="e-pdoc"><span class="mg-error" id="e-pdoc" role="alert"></span></div></div>
          <div class="mg-field"><label class="mg-label" for="p-nom">Nombre completo *</label><input class="mg-input" id="p-nom" autocomplete="name" aria-describedby="e-pnom"><span class="mg-error" id="e-pnom" role="alert"></span></div>
          <div class="mg-field"><label class="mg-label" for="p-cel">Celular *</label><input class="mg-input" id="p-cel" inputmode="tel" placeholder="3001234567" aria-describedby="e-pcel"><span class="mg-help">10 dígitos, empieza por 3.</span><span class="mg-error" id="e-pcel" role="alert"></span></div></div>
        <div data-paso="2" class="grid" style="gap:1rem" hidden><div class="grid" style="grid-template-columns:1fr 1fr;gap:1rem">
          <div class="mg-field"><label class="mg-label" for="p-clase">Tipo de solicitud *</label><select class="mg-select" id="p-clase"><option>Petición</option><option>Queja</option><option>Reclamo</option><option>Sugerencia</option></select></div>
          <div class="mg-field"><label class="mg-label" for="p-mun">Municipio *</label><select class="mg-select" id="p-mun"></select></div></div>
          <div class="mg-field"><label class="mg-label" for="p-asu">Asunto *</label><input class="mg-input" id="p-asu" aria-describedby="e-pasu"><span class="mg-error" id="e-pasu" role="alert"></span></div>
          <div class="mg-field"><label class="mg-label" for="p-det">Descripción *</label><textarea class="mg-textarea" id="p-det" aria-describedby="e-pdet"></textarea><span class="mg-help" id="cont">0 / 500 caracteres</span><span class="mg-error" id="e-pdet" role="alert"></span></div>
          <div class="mg-field"><label class="mg-label" for="p-file">Anexo (opcional)</label><input class="mg-input" type="file" id="p-file"></div></div>
        <div data-paso="3" hidden><gob-alerta tipo="info" titulo="Revise su solicitud">Verifique que los datos sean correctos antes de radicar.</gob-alerta><dl id="resumen" style="display:grid;grid-template-columns:max-content 1fr;gap:.5rem 1.25rem;margin:1rem 0 0"></dl></div>
        <div class="row" style="justify-content:space-between;margin-top:1.5rem"><button type="button" class="mg-btn mg-btn--secondary" id="atras" hidden>Atrás</button><span style="flex:1"></span><button type="button" class="mg-btn" id="sig">Siguiente</button></div>
      </form>
    </section>
  </div>
</div>
<style>@media (max-width: 900px) { .acc { grid-template-columns: 1fr !important; } .acc > aside { padding: 1.5rem !important; gap: 1.5rem; } }</style>
<script type="module">
  const $ = (id) => document.getElementById(id);
  // — utilidades de validación (copie esta función a su proyecto)
  function error(id, msg) { const i = $(id), e = $('e-' + id.split('-')[1]) ?? $('e-' + id); i?.classList.toggle('is-invalid', !!msg); i?.setAttribute('aria-invalid', !!msg); if (e) e.textContent = msg || ''; return !msg; }
  // — Ingreso
  $('ver').onclick = (e) => { const p = $('i-pw'), v = p.type === 'password'; p.type = v ? 'text' : 'password'; e.currentTarget.setAttribute('aria-pressed', v); e.currentTarget.setAttribute('aria-label', v ? 'Ocultar contraseña' : 'Mostrar contraseña'); };
  $('fIn').onsubmit = (e) => { e.preventDefault(); const a = !!$('i-doc').value.trim() || (error('i-doc', 'Escriba su documento'), false), b = !!$('i-pw').value || (error('i-pw', 'Escriba su contraseña'), false);
    if (a) error('i-doc', ''); if (b) error('i-pw', ''); if (a && b) gob.toast({ tipo: 'exito', titulo: 'Ingreso exitoso', mensaje: 'En producción redirigiría al panel.' }); };
  $('olvido').onclick = (e) => { e.preventDefault(); gob.toast({ tipo: 'info', titulo: 'Recuperar contraseña', mensaje: 'Enviaríamos un enlace a su correo.' }); };
  $('fRe').onsubmit = (e) => { e.preventDefault(); const ok = [error('r-nom', $('r-nom').value.trim() ? '' : 'Escriba su nombre'), error('r-mail', /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test($('r-mail').value) ? '' : 'Escriba un correo válido')];
    $('e-rok').textContent = $('r-ok').checked ? '' : 'Debe aceptar la política'; if (ok.every(Boolean) && $('r-ok').checked) gob.toast({ tipo: 'exito', titulo: 'Cuenta creada', mensaje: 'Revise su correo para activarla.' }); };

  // — Formulario por pasos
  const muni = await fetch('../cdn/v1/datos/municipios.json').then((r) => r.json()); $('p-mun').innerHTML = muni.map((m) => `<option>${m.nombre}</option>`).join('');
  let paso = 1; const pasos = [...$('pasos').children];
  $('p-det').oninput = (e) => ($('cont').textContent = e.target.value.length + ' / 500 caracteres');
  const validar = { 1: () => [error('p-doc', /^\\d{5,12}$/.test($('p-doc').value) ? '' : 'Escriba entre 5 y 12 dígitos'), error('p-nom', $('p-nom').value.trim().split(/\\s+/).length >= 2 ? '' : 'Escriba nombre y apellido'), error('p-cel', /^3\\d{9}$/.test($('p-cel').value) ? '' : 'Celular de 10 dígitos que empiece por 3')].every(Boolean),
    2: () => [error('p-asu', $('p-asu').value.trim().length >= 5 ? '' : 'El asunto necesita al menos 5 caracteres'), error('p-det', $('p-det').value.trim().length >= 20 ? '' : 'Describa su solicitud (mínimo 20 caracteres)')].every(Boolean), 3: () => true };
  function mostrar() {
    document.querySelectorAll('[data-paso]').forEach((s) => (s.hidden = Number(s.dataset.paso) !== paso)); $('atras').hidden = paso === 1; $('sig').textContent = paso === 3 ? 'Radicar' : 'Siguiente';
    pasos.forEach((li, i) => { li.classList.toggle('is-done', i + 1 < paso); li.classList.toggle('is-current', i + 1 === paso); i + 1 === paso ? li.setAttribute('aria-current', 'step') : li.removeAttribute('aria-current'); });
    if (paso === 3) $('resumen').innerHTML = Object.entries({ Solicitante: $('p-nom').value, Documento: $('p-tipo').value + ' ' + $('p-doc').value, Celular: $('p-cel').value, Solicitud: $('p-clase').value + ' · ' + $('p-mun').value, Asunto: $('p-asu').value }).map(([k, v]) => `<dt class="muted">${k}</dt><dd style="margin:0;font-weight:600">${v.replace(/</g, '&lt;')}</dd>`).join('');
    $('alertaForm').innerHTML = ''; document.querySelector(`[data-paso="${paso}"] input, [data-paso="${paso}"] select`)?.focus();
  }
  $('atras').onclick = () => { paso--; mostrar(); };
  $('sig').onclick = async () => {
    if (!validar[paso]()) { $('alertaForm').innerHTML = '<gob-alerta tipo="peligro" titulo="Revise los campos marcados">Corrija los errores para continuar.</gob-alerta>'; return; }
    if (paso < 3) { paso++; mostrar(); return; }
    if (await gob.confirmar({ titulo: 'Radicar solicitud', mensaje: '¿Desea radicar esta solicitud? Recibirá el número de radicado por correo.', textoConfirmar: 'Radicar' })) {
      const n = 'R-2026-' + String(Math.floor(Math.random() * 90000) + 10000); $('fPq').innerHTML = `<gob-alerta tipo="exito" titulo="Solicitud radicada">Su número de radicado es <b>${n}</b>. Guárdelo para consultar el estado.</gob-alerta>`; pasos.forEach((li) => { li.classList.add('is-done'); li.classList.remove('is-current'); });
      gob.toast({ tipo: 'exito', titulo: 'Radicado ' + n });
    }
  };
</script>
<!--DEMO-ONLY--><script type="module" src="demo-kit.js"></script><!--/DEMO-ONLY-->
</body>
</html>
'''


def publica(titulo, cuerpo, banner_html, css_extra=''):
    return HEAD.replace('%TITULO%', titulo).replace('%CSS%', CSS_PUBLICA + css_extra) + cuerpo.replace('%BANNER%', banner_html)


PLANTILLA = '''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mi aplicación · Gobernación del Magdalena</title>
<link rel="icon" href="../assets/favicon/favicon.ico">

<!-- ① DEPENDENCIAS — es TODO lo que hay que cargar. Cópielas a su <head>:
       · gob.css → tipografía Montserrat (autohospedada), tokens --gob-* / --mg-* y clases mg-* (botones, tarjetas, formularios, hero…)
       · gob.js  → cargador: detecta las etiquetas <gob-*> de la página y descarga solo esos componentes
     Sin internet: descargue gob-cdn-v1.zip (manual → Estudio → «Paquete autónomo»), descomprímalo y cambie la ruta ../cdn/v1/ por la suya. -->
<link rel="stylesheet" href="../cdn/v1/gob.css">
<script type="module" src="../cdn/v1/gob.js"></script>
<style>body { margin: 0; padding: 1.5rem; } .grid { display: grid; gap: 1rem; max-width: 1100px; margin: 0 auto; }</style>
</head>
<body class="mg-base">
<main class="grid">
  <!--DEMO-ONLY-->%BANNER%<!--/DEMO-ONLY-->

  <!-- ② Estilos de marca: clases mg-* (no requieren JavaScript) -->
  <section class="mg-hero mg-hero--stripe" style="border-radius:12px"><h1 class="mg-h1" style="color:#fff;margin:0 0 .5rem">Mi aplicación</h1><p style="margin:0 0 1rem">Plantilla base con la identidad de la Gobernación.</p><button class="mg-btn" id="hola">Probar notificación</button></section>

  <!-- ③ Alerta -->
  <gob-alerta tipo="info" titulo="Todo listo">Si ve este mensaje con estilo, las dependencias se cargaron bien.</gob-alerta>

  <!-- ④ Indicadores -->
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));gap:.75rem">
    <gob-kpi etiqueta="Radicados" valor="1284" delta="12.5" icono="archivo" serie="[3,5,4,8,9,7,12]"></gob-kpi>
    <gob-kpi etiqueta="Satisfacción" valor="0.91" formato="porcentaje" icono="estrella" color="amarillo" meta="1"></gob-kpi></div>

  <!-- ⑤ Tabla: asigne columnas y datos con JavaScript -->
  <gob-tabla id="tabla" titulo="Mi tabla" tamano-pagina="5"></gob-tabla>

  <!-- ⑥ Gráfica y mapa (cargan sus librerías solo si están en la página) -->
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(20rem,1fr));gap:1rem">
    <div class="mg-card" style="padding:1rem"><gob-grafica id="grafica" tipo="dona" titulo="Por subregión" altura="300"></gob-grafica></div>
    <div class="mg-card" style="padding:.5rem"><gob-mapa-magdalena id="mapa" modo="coropleta" detalle="bajo" leyenda-titulo="Casos"></gob-mapa-magdalena></div></div>
</main>

<script type="module">
  // ⑦ Datos y eventos (sustituya por su API)
  document.getElementById('hola').onclick = () => gob.toast({ tipo: 'exito', titulo: '¡Funciona!', mensaje: 'gob.toast() está disponible en toda la página.' });
  const filas = await fetch('../cdn/v1/datos/ejemplo-tramites.json').then((r) => r.json());
  document.getElementById('tabla').config = { datos: filas, llave: 'id', columnas: [{ campo: 'radicado', titulo: 'Radicado', nowrap: true }, { campo: 'asunto', titulo: 'Asunto' }, { campo: 'municipio', titulo: 'Municipio' }, { campo: 'estado', titulo: 'Estado', tipo: 'estado', estados: { Resuelto: 'exito', 'En trámite': 'info', Pendiente: 'aviso', Vencido: 'peligro' } }] };
  document.getElementById('grafica').datos = [{ nombre: 'Santa Marta', valor: 560 }, { nombre: 'Norte', valor: 420 }, { nombre: 'Río', valor: 310 }, { nombre: 'Centro', valor: 240 }, { nombre: 'Sur', valor: 180 }];
  document.getElementById('mapa').datos = { '47001': 560, '47189': 210, '47980': 150, '47288': 120, '47245': 90, '47555': 80 };
</script>
<!--DEMO-ONLY--><script type="module" src="demo-kit.js"></script><!--/DEMO-ONLY-->
</body>
</html>
'''


def build(root):
    d = os.path.join(root, 'demos')
    os.makedirs(d, exist_ok=True)
    pages = {
        'panel-ejecutivo.html': admin('panel-ejecutivo.html', 'Panel ejecutivo', ['Inicio', 'Panel ejecutivo'], PANEL, banner(['Cada pestaña del panel es un <code>slot</code> de <code>gob-pestanas</code>; el tablero completo se describe con un JSON (ver <a href="../componentes/gob-dashboard.html">gob-dashboard</a>).'], 'gob-dashboard, gob-kpi, gob-grafica, gob-mapa-magdalena, gob-tabla, gob-pestanas, gob-alerta, gob-icono')),
        'gestion-tramites.html': admin('gestion-tramites.html', 'Gestión de trámites', ['Inicio', 'Gestión', 'Trámites'], GESTION, banner(['El patrón CRUD completo (alta, edición, detalle, eliminación con confirmación) está en el <code>&lt;script&gt;</code> de abajo: cópielo y cambie los <code>fetch</code> por llamadas a su API.'], 'gob-tabla, gob-modal, gob-pestanas, gob-kpi, gob.toast(), gob.confirmar(), mg-timeline, mg-input'), ''),
        'analitica-territorial.html': admin('analitica-territorial.html', 'Analítica territorial', ['Inicio', 'Territorio'], TERR, banner(['La pestaña «Presencia institucional» muestra marcadores con efectos (radar, ping, pulso), rutas animadas con partículas y zoom a un municipio desde la tabla.'], 'gob-dashboard, gob-mapa-magdalena, gob-tabla, gob-pestanas, gob-kpi, gob-grafica'), '  @media (max-width: 1100px) { section[data-demo^="Mapa de sedes"] { grid-template-columns: 1fr !important; } }'),
        'mesa-ayuda.html': admin('mesa-ayuda.html', 'Mesa de ayuda', ['Inicio', 'Soporte', 'Mesa de ayuda'], AYUDA, banner(['Combina los componentes nuevos: <b>kanban</b>, <b>pasos</b>, <b>selector con búsqueda</b>, <b>calendario</b>, <b>subir archivos</b>, <b>línea de tiempo</b> y <b>avatar</b>. Cada interacción actualiza indicadores, tablero y lista.'], 'gob-kanban, gob-tabla, gob-pasos, gob-selector, gob-fecha, gob-archivos, gob-linea-tiempo, gob-avatar, gob-modal, gob-kpi, gob-pestanas')),
        'portal-ciudadano.html': publica('Portal ciudadano', PORTAL, banner(['Esta es una página <b>pública</b> (sin menú lateral): encabezado, hero, tarjetas de servicios, KPI, mapa con modal, acordeón, noticias y pie institucional. Cada bloque se copia por separado.'], 'mg-hero, mg-card, mg-acordeon, mg-footer, gob-kpi, gob-mapa-magdalena, gob-modal, gob-icono')),
        'acceso-formularios.html': publica('Acceso y formularios', ACCESO, banner(['Incluye <b>validación accesible</b> (mensaje junto al campo con <code>role="alert"</code> y <code>aria-invalid</code>), stepper de 3 pasos y confirmación con <code>gob.confirmar()</code>.'], 'gob-pestanas, gob-modal, gob-alerta, gob.toast(), gob.confirmar(), mg-stepper, mg-input, mg-field'), '\n  body { background: var(--mg-bg-app); }'),
        'plantilla-base.html': PLANTILLA.replace('%BANNER%', banner(['Esta es la <b>plantilla mínima</b>: copie la página completa y empiece. Está comentada paso a paso (① a ⑦).'], 'mg-hero, gob-alerta, gob-kpi, gob-tabla, gob-grafica, gob-mapa-magdalena, gob.toast()')),
    }
    for n, h in pages.items():
        with open(os.path.join(d, n), 'w', encoding='utf-8', newline='\n') as f:
            f.write(h)
    return list(pages)
