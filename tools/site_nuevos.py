"""Documentación con ejemplos en vivo de los componentes nuevos:
   componentes/gob-flujo.html (línea de tiempo, pasos) · gob-campos.html (selector, fecha, archivos) · gob-contenido.html (avatar, árbol, kanban, menú, tooltip, paginador)"""
from site_comp import PRELUDIO, ejemplo, GOB
from site_mapa import tabla

I = lambda c: f'<code>{c}</code>'


def pagina(root, page, code, archivo, titulo, lead, desc, ejemplos, refs):
    ed = ''.join(ejemplo(code, *e) for e in ejemplos)
    rf = ''.join(f'<h3 style="margin-top:1.5rem">{t}</h3>{tabla(["Propiedad / evento", "Descripción"], filas)}' for t, filas in refs)
    inst = code('html', PRELUDIO + '<!-- ② Use la etiqueta de cualquier ejemplo de esta página -->', 'Instalación', tpl=True)
    body = f'''<p class="pt-lead">{lead}</p>
<section class="pt-section"><h2><span class="n">01.</span> Instalación (todo lo que hay que cargar)</h2><div class="baseurl"><b>URL base:</b><input class="mg-input" id="baseInput" aria-label="URL base"><button class="mg-btn mg-btn--ghost mg-btn--sm" id="baseReset">Autodetectar</button></div>{inst}
<p class="mg-help">Funcionan igual en HTML, Angular (<code>CUSTOM_ELEMENTS_SCHEMA</code>), React y Next.js (solo cliente). Sin dependencias: <code>gob.js</code> descarga cada componente solo si está en la página.</p></section>
<section class="pt-section"><h2><span class="n">02.</span> Ejemplos (cada uno con su código completo)</h2>{ed}</section>
<section class="pt-section"><h2><span class="n">03.</span> Referencia</h2>{rf}</section>'''
    page(root, f'componentes/{archivo}', titulo, desc, GOB + body, active='componentes.html')


def build(root, page, code):
    # ---------------------------------------------------------------- flujo
    ej = [
        ('lt1', '1 · Línea de tiempo vertical', 'Historial de un trámite o ticket. Cada evento tiene fecha, tipo (color e ícono automáticos), descripción y autor.', PRELUDIO + '''<gob-linea-tiempo eventos='[
  { "fecha": "12 oct · 08:15", "titulo": "Radicado", "descripcion": "Ingresó por el portal ciudadano.", "tipo": "exito", "autor": "Sistema" },
  { "fecha": "12 oct · 09:40", "titulo": "Asignado a Secretaría General", "tipo": "info", "autor": "Mesa de ayuda" },
  { "fecha": "14 oct · 11:05", "titulo": "Requiere documentos", "descripcion": "Falta la copia de la cédula.", "tipo": "aviso", "icono": "archivo" },
  { "fecha": "16 oct", "titulo": "Vence el plazo de respuesta", "tipo": "peligro" }
]'></gob-linea-tiempo>'''),
        ('lt2', '2 · Horizontal y alternada', 'Con <code>orientacion="horizontal"</code> para pocos hitos, o <code>alternar</code> para páginas de historia (lados alternos en pantallas anchas).', PRELUDIO + '''<gob-linea-tiempo orientacion="horizontal" eventos='[
  { "fecha": "Ene", "titulo": "Diagnóstico", "tipo": "primario" }, { "fecha": "Mar", "titulo": "Diseño", "tipo": "primario" },
  { "fecha": "Jun", "titulo": "Desarrollo", "tipo": "info" }, { "fecha": "Sep", "titulo": "Lanzamiento", "tipo": "exito" } ]'></gob-linea-tiempo>
<gob-linea-tiempo alternar eventos='[
  { "fecha": "2024", "titulo": "Nace el portal", "descripcion": "Primera versión." }, { "fecha": "2025", "titulo": "Sistema de diseño" }, { "fecha": "2026", "titulo": "Componentes gob-*", "tipo": "exito" } ]'></gob-linea-tiempo>'''),
        ('ps1', '3 · Pasos (asistente)', 'Indicador de progreso que muestra el contenido del paso actual (<code>slot="paso0"</code>, <code>paso1</code>…). Usted controla los botones con <code>siguiente()</code> / <code>anterior()</code> y valida antes de avanzar; <code>error</code> marca un paso.', PRELUDIO + '''<gob-pasos id="ps1" pasos='[{"titulo":"Sus datos","descripcion":"Identificación"},{"titulo":"Su solicitud"},{"titulo":"Confirmar"}]' clicable>
  <div slot="paso0"><label>Nombre <input id="ps1-nombre" placeholder="Escriba su nombre"></label></div>
  <div slot="paso1"><label>Asunto <input placeholder="¿Qué necesita?"></label></div>
  <div slot="paso2"><gob-alerta tipo="exito" titulo="Todo listo">Revise y confirme.</gob-alerta></div>
</gob-pasos>
<div style="display:flex;gap:.5rem;margin-top:1rem"><button type="button" id="ps1-atras">Atrás</button><button id="ps1-sig">Siguiente</button></div>
<script type="module">
  const p = document.getElementById('ps1');
  document.getElementById('ps1-atras').onclick = () => p.anterior();
  document.getElementById('ps1-sig').onclick = () => {
    if (p.actual === 0 && !document.getElementById('ps1-nombre').value.trim()) { p.error = 0; return gob.toast({ tipo: 'aviso', titulo: 'Escriba su nombre' }); }
    p.error = -1; p.actual === p.total - 1 ? gob.toast({ tipo: 'exito', titulo: 'Enviado' }) : p.siguiente();
  };
  p.addEventListener('gob-paso-cambio', (e) => console.log(e.detail));   // { actual, id, primero, ultimo }
</script>'''),
    ]
    refs = [('gob-linea-tiempo', [(I('eventos (JSON)'), I('[{ fecha, titulo, descripcion, autor, icono, tipo }]') + ' con <code>tipo</code>: primario, info, exito, aviso, peligro, neutro.'), (I('orientacion'), 'vertical (defecto) | horizontal.'), (I('alternar'), 'Lados alternos (≥ 640 px).'), (I('invertir'), 'Más reciente primero.'), (I('slot="e0", "e1"…'), 'Contenido extra dentro de cada evento.')]),
            ('gob-pasos', [(I('pasos (JSON)'), I('[{ id?, titulo, descripcion?, icono? }]') + '. El slot de cada paso es <code>id</code> o <code>paso&lt;n&gt;</code>.'), (I('actual'), 'Índice del paso (desde 0).'), (I('vertical, clicable'), 'Disposición vertical; clic en pasos ya alcanzados.'), (I('error'), 'Índice del paso con error (−1 = ninguno).'), (I('siguiente() · anterior() · ir(n) · total'), 'Control programático.'), (I('gob-paso-cambio'), I('{ actual, id, primero, ultimo }'))])]
    pagina(root, page, code, 'gob-flujo.html', 'Línea de tiempo y pasos', 'Historiales y asistentes: <b>gob-linea-tiempo</b> para mostrar qué pasó con un trámite o ticket y <b>gob-pasos</b> para formularios en varios pasos.', 'gob-linea-tiempo y gob-pasos: historial de trámites y asistentes por pasos, accesibles y con ejemplos para copiar.', ej, refs)

    # ---------------------------------------------------------------- campos
    ej = [
        ('sl1', '1 · Selector con búsqueda', 'Escriba para filtrar (sin tildes), flechas + Enter para elegir, Esc para cerrar. Participa en <code>&lt;form&gt;</code> con <code>name</code> y <code>requerido</code>.', PRELUDIO + '''<gob-selector id="sl1" etiqueta="Municipio" placeholder="Busque un municipio" name="municipio" limpiable
  opciones='["Santa Marta","Ciénaga","Fundación","Aracataca","Plato","El Banco","Zona Bananera","Pivijay"]'></gob-selector>
<script type="module">
  document.getElementById('sl1').addEventListener('gob-selector-cambio', (e) => console.log(e.detail.valor));
</script>'''),
        ('sl2', '2 · Multiselección con grupos y descripción', 'Con <code>multiple</code> aparecen casillas y chips (<code>max-chips</code>); <code>Backspace</code> quita el último. Las opciones pueden ser objetos con <code>grupo</code>, <code>descripcion</code>, <code>icono</code>.', PRELUDIO + '''<gob-selector id="sl2" multiple etiqueta="Dependencias" placeholder="Elija dependencias"></gob-selector>
<script type="module">
  const s = document.getElementById('sl2');
  s.opciones = [
    { valor: 'sg', etiqueta: 'Secretaría General', grupo: 'Despacho', descripcion: 'Trámites y archivo', icono: 'edificio' },
    { valor: 'tic', etiqueta: 'Oficina TIC', grupo: 'Despacho', icono: 'soporte' },
    { valor: 'hac', etiqueta: 'Hacienda', grupo: 'Finanzas', icono: 'dinero' },
    { valor: 'sal', etiqueta: 'Salud', grupo: 'Sectoriales', icono: 'salud' },
    { valor: 'edu', etiqueta: 'Educación', grupo: 'Sectoriales', icono: 'escuela', deshabilitada: true },
  ];
  s.valor = ['sg', 'tic'];
</script>'''),
        ('fe1', '3 · Fecha y rango de fechas', 'Calendario en español con teclado (flechas, PageUp/PageDown, Home/End, Esc). <code>valor</code> es ISO <code>2026-10-14</code>; en <code>rango</code> es <code>inicio/fin</code>. <code>min</code> y <code>max</code> deshabilitan días.', PRELUDIO + '''<div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:start">
  <gob-fecha id="fe1" etiqueta="Fecha de radicación" valor="2026-10-14" min="2026-01-01" max="2026-12-31" style="width:16rem"></gob-fecha>
  <gob-fecha id="fe2" rango etiqueta="Periodo" placeholder="Elija un periodo" style="width:20rem"></gob-fecha>
</div>
<script type="module">
  document.getElementById('fe2').addEventListener('gob-fecha-cambio', (e) => console.log(e.detail));   // { valor, inicio, fin }
</script>'''),
        ('ar1', '4 · Subir archivos', 'Arrastre o haga clic; valida tipo y tamaño y marca los rechazados. Con <code>progreso(nombre, %)</code> muestra el avance de su carga real (XHR/fetch).', PRELUDIO + '''<gob-archivos id="ar1" multiple accept=".pdf,.jpg,.png" max-mb="2" max-archivos="4" name="anexos"></gob-archivos>
<button type="button" id="ar1-enviar" style="margin-top:.75rem">Enviar (simulado)</button>
<script type="module">
  const a = document.getElementById('ar1');
  a.addEventListener('gob-archivos-cambio', (e) => console.log(e.detail.archivos, e.detail.rechazados));
  document.getElementById('ar1-enviar').onclick = () => a.archivos.forEach((f) => { let p = 0; const t = setInterval(() => { a.progreso(f.name, (p += 20)); if (p >= 100) { clearInterval(t); gob.toast({ tipo: 'exito', titulo: f.name + ' enviado' }); } }, 250); });
</script>'''),
    ]
    refs = [('gob-selector', [(I('opciones (JSON)'), 'Cadenas u objetos <code>{ valor, etiqueta, grupo?, descripcion?, icono?, deshabilitada? }</code>.'), (I('valor'), 'Texto (simple) o arreglo (múltiple); también atributo con comas.'), (I('multiple, buscable, limpiable'), 'Multiselección, cuadro de búsqueda (defecto sí) y botón limpiar.'), (I('placeholder, etiqueta, name, requerido, deshabilitado, invalido, max-chips'), 'Textos, formulario y estados.'), (I('gob-selector-cambio'), I('{ valor, opciones }')), (I('abrir() · limpiar() · seleccion'), 'Métodos y getter.')]),
            ('gob-fecha', [(I('valor'), 'ISO <code>aaaa-mm-dd</code> o <code>inicio/fin</code> con <code>rango</code>.'), (I('min, max'), 'Límites ISO.'), (I('placeholder, etiqueta, name, limpiable, deshabilitado, invalido'), 'Texto y estados.'), (I('gob-fecha-cambio'), I('{ valor, inicio, fin }'))]),
            ('gob-archivos', [(I('multiple, accept, max-mb, max-archivos'), 'Opciones de validación (<code>accept</code>: extensiones o tipos MIME).'), (I('etiqueta, ayuda, name, deshabilitado'), 'Textos y formulario.'), (I('archivos'), 'Getter: archivos válidos (<code>File[]</code>).'), (I('gob-archivos-cambio'), I('{ archivos, rechazados }')), (I('progreso(nombre, pct) · quitar(i) · limpiar()'), 'Métodos.')])]
    pagina(root, page, code, 'gob-campos.html', 'Selector, fecha y archivos', 'Campos avanzados de formulario: <b>gob-selector</b> (búsqueda y multiselección), <b>gob-fecha</b> (calendario y rango) y <b>gob-archivos</b> (arrastrar y soltar). Participan en <code class="inline">&lt;form&gt;</code> y son accesibles con teclado.', 'gob-selector, gob-fecha y gob-archivos: campos avanzados con búsqueda, calendario en español y carga de archivos.', ej, refs)

    # ---------------------------------------------------------------- contenido
    ej = [
        ('av1', '1 · Avatar', 'Foto o iniciales con color estable según el nombre; <code>estado</code>: en-linea, ocupado, ausente.', PRELUDIO + '''<div style="display:flex;gap:.6rem;align-items:center">
  <gob-avatar nombre="Ana María Pérez" estado="en-linea"></gob-avatar><gob-avatar nombre="Luis Mora" estado="ocupado" tam="48"></gob-avatar><gob-avatar nombre="Carlos Díaz" estado="ausente" tam="32"></gob-avatar><gob-avatar nombre="Sofía"></gob-avatar>
</div>'''),
        ('ab1', '2 · Árbol', 'Organigramas, carpetas, territorios. Teclado: ↑↓ mover, →← abrir/cerrar, Enter seleccionar. <code>abierto</code> expande todo.', PRELUDIO + '''<gob-arbol id="ab1" abierto etiqueta="Organigrama" nodos='[
 {"id":"g","etiqueta":"Gobernación","icono":"gobierno","hijos":[
   {"id":"sg","etiqueta":"Secretaría General","hijos":[{"id":"tic","etiqueta":"Oficina TIC","icono":"soporte"},{"id":"arch","etiqueta":"Archivo"}]},
   {"id":"hac","etiqueta":"Hacienda","hijos":[{"id":"tes","etiqueta":"Tesorería"}]},{"id":"sal","etiqueta":"Salud"}]}]'></gob-arbol>
<script type="module">document.getElementById('ab1').addEventListener('gob-arbol-seleccion', (e) => console.log(e.detail.id));</script>'''),
        ('kb1', '3 · Kanban', 'Arrastre tarjetas entre columnas, o use los botones ◀ ▶ (también <kbd>Alt</kbd>+flechas con la tarjeta enfocada). Evento <code>gob-kanban-mover</code> para guardar en su API.', PRELUDIO + '''<gob-kanban id="kb1"></gob-kanban>
<script type="module">
  const k = document.getElementById('kb1');
  k.columnas = [{ id: 'n', titulo: 'Nuevos', color: '#00B7D9' }, { id: 'p', titulo: 'En proceso', color: '#FEC800', limite: 3 }, { id: 'r', titulo: 'Resueltos', color: '#69B75E' }];
  k.tarjetas = [
    { id: '1', columna: 'n', titulo: 'No puedo ingresar al portal', prioridad: 'alta', etiquetas: ['Acceso'], asignado: 'Ana Pérez', fecha: '14 oct' },
    { id: '2', columna: 'n', titulo: 'Solicitud de usuario nuevo', prioridad: 'baja', etiquetas: ['Cuenta'] },
    { id: '3', columna: 'p', titulo: 'Impresora de Hacienda', descripcion: 'Atasco constante de papel', prioridad: 'media', asignado: 'Luis Mora' },
    { id: '4', columna: 'r', titulo: 'Correo institucional', prioridad: 'baja', asignado: 'Sofía Ruiz' },
  ];
  k.addEventListener('gob-kanban-mover', (e) => console.log(e.detail.id, e.detail.desde, '→', e.detail.hasta));
</script>'''),
        ('mn1', '4 · Menú, menú contextual y tooltip', 'El menú se ancla al elemento que envuelve (flechas, Enter, Esc); con <code>contextual</code> aparece con clic derecho. El tooltip aparece con hover o foco.', PRELUDIO + '''<div style="display:flex;gap:1.5rem;align-items:center;flex-wrap:wrap">
  <gob-menu id="mn1" items='[{"id":"ver","etiqueta":"Ver detalle","icono":"ojo"},{"id":"ed","etiqueta":"Editar","icono":"editar"},{"id":"dup","etiqueta":"Duplicar","icono":"copiar"},{"separador":true},{"id":"el","etiqueta":"Eliminar","icono":"eliminar","tipo":"peligro"}]'><button type="button">Acciones ▾</button></gob-menu>
  <gob-menu id="mn2" contextual items='[{"id":"copiar","etiqueta":"Copiar enlace","icono":"enlace"},{"id":"abrir","etiqueta":"Abrir en pestaña nueva","icono":"enlace-externo"}]'><div style="padding:1rem 1.5rem;border:1px dashed #9AA4B2;border-radius:10px">Clic derecho aquí</div></gob-menu>
  <gob-tooltip texto="Descarga el reporte en PDF" posicion="abajo"><button type="button">Descargar</button></gob-tooltip>
</div>
<script type="module">
  document.querySelectorAll('gob-menu').forEach((m) => m.addEventListener('gob-menu-accion', (e) => gob.toast({ tipo: 'info', titulo: 'Acción: ' + e.detail.id })));
</script>'''),
        ('pg1', '5 · Paginador', 'Paginación suelta para listas, tarjetas o respuestas de API. No pagina datos: emite <code>gob-pagina-cambio</code> con <code>desde/hasta</code>.', PRELUDIO + '''<gob-paginador id="pg1" total="900" tamano="10"></gob-paginador>
<script type="module">
  document.getElementById('pg1').addEventListener('gob-pagina-cambio', (e) => console.log(e.detail));   // { pagina, tamano, desde, hasta }
</script>'''),
    ]
    refs = [('Componentes', [(I('gob-avatar'), I('nombre, src, tam, estado')), (I('gob-arbol'), I('nodos [{ id, etiqueta, icono?, hijos?, deshabilitado? }], seleccionado, abierto, etiqueta') + '; evento <code>gob-arbol-seleccion</code> <code>{ id, nodo }</code>; método <code>expandir(id)</code>.'),
                           (I('gob-kanban'), I('columnas [{ id, titulo, color?, limite? }], tarjetas [{ id, columna, titulo, descripcion?, etiquetas?, asignado?, prioridad?, fecha? }]') + '; eventos <code>gob-kanban-mover</code> <code>{ id, desde, hasta, tarjetas }</code> y <code>gob-kanban-clic</code>; método <code>mover(id, columna, antesDe?)</code>.'),
                           (I('gob-menu'), I('items [{ id, etiqueta, icono?, tipo?, separador?, deshabilitado? }], contextual, alinear') + '; evento <code>gob-menu-accion</code> <code>{ id }</code>.'), (I('gob-tooltip'), I('texto, posicion (arriba | abajo | izquierda | derecha)')),
                           (I('gob-paginador'), I('total, pagina, tamano, opciones, resumen') + '; evento <code>gob-pagina-cambio</code>.')])]
    frameworks(root, page, code)
    pagina(root, page, code, 'gob-contenido.html', 'Avatar, árbol, kanban, menú y paginador', 'Piezas de interfaz para paneles: <b>gob-avatar</b>, <b>gob-arbol</b>, <b>gob-kanban</b>, <b>gob-menu</b> (y contextual), <b>gob-tooltip</b> y <b>gob-paginador</b>.', 'Avatar, árbol, kanban con arrastrar y soltar, menú contextual, tooltip y paginador accesibles, con ejemplos.', ej, refs)


def frameworks(root, page, code):
    B = 'https://manualdemarca.magdalena.gov.co/cdn/v1'
    ang = code('ts', """// src/main.ts — carga gob.css y gob.js una sola vez (alternativa: 2 etiquetas en index.html)
import { cargarGob } from './app/gob/gob-angular';   // copie cdn/v1/wrappers/gob-angular.ts
cargarGob('%s');

// src/app/mesa/mesa.component.ts
import { Component } from '@angular/core';
import { GOB_SCHEMAS, GobEventos } from '../gob/gob-angular';

@Component({
  selector: 'app-mesa', standalone: true, schemas: GOB_SCHEMAS,        // permite las etiquetas <gob-*>
  template: `
    <gob-kpi etiqueta="Abiertos" [valor]="abiertos" icono="soporte"></gob-kpi>
    <gob-tabla [config]="cfg" (gob-tabla-accion)="alAccion($any($event).detail)"></gob-tabla>
    <gob-kanban [columnas]="columnas" [tarjetas]="tarjetas" (gob-kanban-mover)="alMover($any($event).detail)"></gob-kanban>`,
})
export class MesaComponent {
  abiertos = 7;
  cfg = { llave: 'id', datos: [], columnas: [{ campo: 'asunto', titulo: 'Asunto' }] };
  columnas = [{ id: 'n', titulo: 'Nuevos' }, { id: 'r', titulo: 'Resueltos' }];
  tarjetas = [{ id: '1', columna: 'n', titulo: 'No ingresa al sistema' }];
  alAccion(d: GobEventos['gob-tabla-accion']) { console.log(d.accion, d.fila); }
  alMover(d: GobEventos['gob-kanban-mover']) { /* guardar en su API */ }
}""" % B, 'Angular (standalone)')
    rea = code('tsx', """// 1) copie cdn/v1/wrappers/react.jsx → src/gob/index.jsx   (y gob-jsx.d.ts si usa TypeScript)
// 2) src/main.jsx — una vez
import { cargarGob } from './gob';
cargarGob('%s');

// 3) cualquier componente (Next.js App Router: añada 'use client' arriba)
import { useState } from 'react';
import { GobKpi, GobTabla, GobKanban, GobSelector, GobFecha } from './gob';

export default function Mesa() {
  const [tarjetas, setTarjetas] = useState([{ id: '1', columna: 'n', titulo: 'No ingresa al sistema' }]);
  return (<>
    <GobKpi etiqueta="Abiertos" valor={7} icono="soporte" />
    <GobTabla config={{ llave: 'id', datos: [], columnas: [{ campo: 'asunto', titulo: 'Asunto' }] }} onAccion={(d) => console.log(d.accion, d.fila)} />
    <GobKanban columnas={[{ id: 'n', titulo: 'Nuevos' }, { id: 'r', titulo: 'Resueltos' }]} tarjetas={tarjetas} onMover={(d) => setTarjetas(d.tarjetas)} />
    <GobSelector opciones={['Santa Marta', 'Ciénaga']} multiple onCambio={(d) => console.log(d.valor)} />
  </>);
}""" % B, 'React / Next.js')
    nxt = code('tsx', """// app/layout.tsx (Next.js) — si prefiere no usar cargarGob, ponga las etiquetas en <head>:
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="%s/gob.css" />
        <script type="module" src="%s/gob.js" />
      </head>
      <body className="mg-base">{children}</body>
    </html>
  );
}
// Los componentes gob-* se registran en el navegador: úselos en archivos con 'use client'
// o impórtelos con next/dynamic({ ssr: false }) si necesita renderizarlos solo en cliente.""" % (B, B), 'Next.js (layout)')
    vue = code('html', """<!-- main.js — Vue 3: marque las etiquetas gob-* como elementos personalizados -->
// app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('gob-');
// vite.config.js → vue({ template: { compilerOptions: { isCustomElement: (t) => t.startsWith('gob-') } } })

<!-- index.html -->
<link rel="stylesheet" href="%s/gob.css"><script type="module" src="%s/gob.js"></script>

<!-- Componente.vue -->
<template>
  <gob-tabla :config.prop="cfg" @gob-tabla-accion="alAccion($event.detail)" />
  <gob-kanban :columnas.prop="columnas" :tarjetas.prop="tarjetas" @gob-kanban-mover="tarjetas = $event.detail.tarjetas" />
</template>""" % (B, B), 'Vue 3 / Nuxt')
    body = f'''<p class="pt-lead">Los componentes <code class="inline">gob-*</code> son estándares web: funcionan igual en <b>Angular, React, Next.js, Vue, Svelte</b> o HTML plano. Para que la experiencia sea cómoda se ofrecen <b>envoltorios listos</b> (cópielos a su proyecto) con carga automática de los estilos y los eventos tipados.</p>
<section class="pt-section"><h2><span class="n">01.</span> Descargas</h2><div class="mg-row"><a class="mg-btn" href="../cdn/v1/wrappers/gob-angular.ts" download>⬇ gob-angular.ts</a><a class="mg-btn" href="../cdn/v1/wrappers/react.jsx" download>⬇ react.jsx</a><a class="mg-btn mg-btn--secondary" href="../cdn/v1/wrappers/gob-jsx.d.ts" download>⬇ gob-jsx.d.ts</a><a class="mg-btn mg-btn--secondary" href="../dist/downloads/gob-cdn-v1.zip" download>⬇ Paquete autónomo (sin internet)</a></div>
<p class="mg-help">Contenido: <code>cargarGob(base)</code> (inyecta <code>gob.css</code> y <code>gob.js</code> una sola vez), componentes React con <code>onEvento</code>, tipos de los eventos para Angular (<code>GobEventos</code>) y tipos JSX.</p></section>
<section class="pt-section"><h2><span class="n">02.</span> Angular</h2>{ang}</section>
<section class="pt-section"><h2><span class="n">03.</span> React</h2>{rea}</section>
<section class="pt-section"><h2><span class="n">04.</span> Next.js</h2>{nxt}</section>
<section class="pt-section"><h2><span class="n">05.</span> Vue 3 / Nuxt</h2>{vue}</section>
<section class="pt-section"><h2><span class="n">06.</span> Reglas que valen en todos</h2><ul style="line-height:1.9;color:var(--mg-gray-700)"><li><b>Objetos y arreglos</b> (<code>config</code>, <code>columnas</code>, <code>datos</code>, <code>opciones</code>…) se pasan como <b>propiedades</b>, no como atributos: <code>[config]</code> en Angular, props del envoltorio en React, <code>:config.prop</code> en Vue.</li>
<li><b>Eventos</b> son <code>CustomEvent</code>: los datos vienen en <code>event.detail</code>. En los envoltorios React llegan directo al manejador (<code>onAccion=&#123;(d) =&gt; …&#125;</code>).</li>
<li><b>Estilos de PrimeNG / Material:</b> conviven; los <code>gob-*</code> usan sus propios estilos encapsulados y las variables <code>--gob-*</code>, así que se ven iguales en todos los proyectos.</li></ul></section>'''
    page(root, 'componentes/frameworks.html', 'Angular, React, Next.js y Vue', 'Cómo usar los componentes gob-* en Angular, React, Next.js y Vue: envoltorios, tipos y ejemplos completos.', GOB + body, active='componentes.html')


HUB = [
    ('frameworks.html', 'Angular, React, Next.js y Vue', 'Envoltorios, tipos y ejemplos para usar gob-* en cada framework.', '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>'),
    ('gob-flujo.html', 'Línea de tiempo y pasos', 'Historial de trámites y asistentes por pasos.', '<path d="M12 3v18"/><circle cx="12" cy="7" r="2"/><circle cx="12" cy="17" r="2"/><path d="M14 7h6M4 17h6"/>'),
    ('gob-campos.html', 'Selector, fecha y archivos', 'Búsqueda y multiselección, calendario, subir archivos.', '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
    ('gob-contenido.html', 'Avatar, árbol, kanban, menú', 'Árbol, tablero kanban, menú contextual, tooltip, paginador.', '<rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="4" height="8" rx="1"/>'),
]
