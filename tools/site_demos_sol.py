"""Demos de sistemas de solicitudes y administración (según diseños del equipo: formularios de recepción, consulta, dashboards,
bitácora, usuarios y matriz de roles). Datos y nombres ficticios."""
import os
from site_demos_panel import shell, ic

APP = 'Solicitudes'


def side_sol(activo):
    def li(h, t, i):
        cur = ' aria-current="page"' if h == activo else ''
        return f'<li><a href="{h}"{cur}>{ic(i, 18)}{t}</a></li>'
    def grp(t, cls, items):
        return f'<div class="mg-nav__grp mg-nav__grp--{cls}">{t}</div><ul class="mg-nav">' + ''.join(li(*x) for x in items) + '</ul>'
    return ('<h2>Menú</h2><div class="mg-perfil" role="group" aria-label="Perfil actual">' + ic('usuario', 16) + '<div><b>Tu perfil actual</b><span>Receptor</span></div><span class="cfg" aria-hidden="true"></span></div><nav aria-label="Principal">'
            + grp('Ventanilla', 'azul', [('sol-registrar.html', 'Registrar solicitud', 'agregar'), ('sol-consultar.html', 'Consultar solicitudes', 'buscar'), ('sol-recepcion.html', 'Dashboard de recepción', 'panel'), ('sol-entregas.html', 'Entregar respuestas', 'enlace-externo')])
            + grp('Supervisión del área', 'azul', [('sol-bitacora.html', 'Bitácora', 'historial'), ('sol-control.html', 'Dashboard de control', 'grafica-barras')])
            + grp('Administración', 'dorado', [('admin-usuarios.html', 'Usuarios', 'usuarios'), ('admin-roles.html', 'Roles y permisos', 'escudo')])
            + '</nav>')


def pagina(archivo, titulo, nota, cuerpo, script=''):
    return shell(archivo, titulo, nota, cuerpo, script, app=APP, side=side_sol(archivo))


def cab(pills, h1, sub, boton=True):
    ps = ''.join(f'<span class="mg-pill{" mg-pill--out" if i else ""}">{p}</span>' for i, p in enumerate(pills))
    b = f'<a class="mg-btn mg-btn--sm" href="sol-recepcion.html">{ic("flecha-izquierda", 14)} Volver al Dashboard</a>' if boton else ''
    return f'<div class="mg-page" data-demo="Encabezado" data-nota="Varias píldoras (mg-pill + mg-pill--out), título azul y botón de regreso"><div><div class="mg-tags">{ps}</div><h1>{h1}</h1><p>{sub}</p></div>{b}</div>'


PAGER = '<div class="mg-pager"><span>Mostrando <b>6</b> solicitudes (de 62 de despacho)</span><span class="b">Filas por página <select aria-label="Filas por página"><option>10</option><option>25</option></select> &nbsp; Página 1 de 1 &nbsp;<button type="button" disabled aria-label="Anterior">‹</button><button type="button" disabled aria-label="Siguiente">›</button></span></div>'

# ------------------------------------------------------------------ 1 · REGISTRAR
ABOG = [('Julián Peña', 'abogado.jpena@pruebas.local', '3 solicitudes en trámite', 'Menor carga', 'mg-chip--verde', 'JP'), ('Marta Quintero', 'abogada.mquintero@pruebas.local', '10 solicitudes en gestión', 'Carga alta', 'mg-chip--amarillo', 'MQ'), ('Diego Gómez', 'abogado.dgomez@pruebas.local', '5 solicitudes en curso', 'Menor carga', 'mg-chip--verde', 'DG')]


def opts():
    return ''.join(f'<label class="mg-opt mg-forms"><input type="radio" name="abogado" value="{n}" data-av="{a}"{" checked" if i == 0 else ""}><span class="mg-av">{a}</span><span class="grow"><b>{n}</b><small>{c}</small></span><span class="mg-chip {k}">{t}</span></label>' for i, (n, _, c, t, k, a) in enumerate(ABOG))


REGISTRAR = f'''      {cab(["Ventanilla de Entrada", "Oficina de Tecnologías de la Información"], "Registrar nueva solicitud", "Ingresa formalmente la solicitud ciudadana, certifica la fecha de recepción en el correo institucional y asigna el responsable.")}
      <div style="display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:1.25rem;align-items:start" class="dos-col">
        <form class="mg-panel mg-forms" id="f" novalidate data-demo="Formulario de recepción" data-nota="mg-panel + mg-fgrid; ayudas bajo cada campo (.mg-help) y aviso con ícono">
          <div class="mg-panel__head">{ic("archivo", 20)}<div><h2>Datos de recepción y del solicitante</h2><small>Certifica la fecha de recepción en el correo institucional y los datos oficiales de contacto.</small></div></div>
          <p style="margin:0 0 1rem;font-size:.74rem;color:var(--mg-text-muted)">Campo obligatorio <span style="color:var(--mg-red)">*</span></p>
          <div class="mg-fgrid"><div class="full"><label class="mg-lab" for="fr">Fecha de recepción en el correo institucional<span class="req">*</span></label><input id="fr" type="date"></div>
            <div class="full"><p class="mg-aviso" style="font-size:.76rem;color:var(--mg-gray-600);margin:0;display:flex;gap:.5rem">{ic("info", 16)}<span>El cómputo de días hábiles de ley inicia a partir de esta fecha de recepción, no del día en que se registra en el sistema.</span></p></div></div>
          <h3 style="margin:1.25rem 0 .75rem;font:800 .95rem var(--mg-font-display);color:var(--mg-primary)">{ic("usuario", 16)} Información del solicitante</h3>
          <div class="mg-fgrid"><div><label class="mg-lab" for="nom">Nombre del solicitante<span class="req">*</span></label><input id="nom" autocomplete="name"><p class="mg-help">Mínimo 3 caracteres (persona natural o entidad).</p></div><div><label class="mg-lab" for="doc">Cédula / NIT / Documento<span class="req">*</span></label><input id="doc" inputmode="numeric"><p class="mg-help">Mínimo 5 caracteres, sin espacios.</p></div>
            <div><label class="mg-lab" for="cor">Correo electrónico de notificaciones<span class="req">*</span></label><input id="cor" type="email"><p class="mg-help">Formato esperado: nombre@correo.com</p></div><div><label class="mg-lab" for="tel">Teléfono o celular <small>(opcional)</small></label><input id="tel" type="tel"><p class="mg-help">Máximo 20 caracteres si se registra.</p></div>
            <div class="full"><label class="mg-lab" for="dir">Dirección física de notificación <small>(opcional)</small></label><input id="dir"><p class="mg-help">Incluye barrio o municipio si aplica.</p></div></div>
        </form>
        <div style="display:grid;gap:1rem">
          <section class="mg-panel" data-demo="Asignación por tarjetas" data-nota="mg-optlist + mg-opt: radios con avatar y chip de carga; mg-conf confirma la selección"><div class="mg-panel__head">{ic("usuarios", 20)}<div><h2>Asignación de abogado</h2><small>Equipo disponible (3 abogados)</small></div></div>
            <div class="mg-optlist" role="radiogroup" aria-label="Abogado responsable">{opts()}</div><p style="font-size:.7rem;color:var(--mg-text-muted);margin:.6rem 0">Ordenados de menor a mayor carga activa. Elige manualmente al responsable.</p>
            <div class="mg-conf" aria-live="polite"><span class="mg-av" id="cav" style="background:#fff">JP</span><span><small>Asignación seleccionada</small><b id="cnom">Julián Peña</b></span><span class="mg-chip mg-chip--verde">{ic("check-circulo", 12)} Confirmado</span></div></section>
          <section class="mg-panel"><button class="mg-btn mg-submit" type="submit" form="f" id="reg">Registrar solicitud y asignar {ic("flecha-derecha", 16)}</button><p class="mg-note">Al registrar, la solicitud queda formalmente ingresada y asignada al abogado responsable para su gestión inicial.</p></section>
        </div>
      </div>
      <style>@media (max-width: 960px) {{ .dos-col {{ grid-template-columns: 1fr !important; }} }}</style>'''

REGISTRAR_JS = '''  document.querySelectorAll('input[name=abogado]').forEach((r) => r.addEventListener('change', () => { $('cnom').textContent = r.value; $('cav').textContent = r.dataset.av; }));
  $('f').addEventListener('submit', (e) => { e.preventDefault();
    const falta = ['fr', 'nom', 'doc', 'cor'].filter((i) => !$(i).value.trim()); ['fr', 'nom', 'doc', 'cor'].forEach((i) => $(i).setAttribute('aria-invalid', falta.includes(i)));
    if (falta.length) { gob.toast({ tipo: 'aviso', titulo: 'Faltan campos obligatorios', mensaje: 'Complete los campos marcados con *.' }); $(falta[0]).focus(); return; }
    gob.toast({ tipo: 'exito', titulo: 'Solicitud registrada', mensaje: 'Asignada a ' + $('cnom').textContent + '. Radicado PET-2026-0120.' }); e.target.reset(); });'''

# ------------------------------------------------------------------ 2 · CONSULTAR
SOL = [('PET-2026-0119', 'Luis Fernando Ceballos', 'C.C. / NIT 10282402', '2026-09-10', 'Diego Gómez', 'Finalizada', 'verde', 'Tarde finalizada'), ('PET-2026-0118', 'Cooperativa de Transporte del Norte', 'NIT 800123456', '2026-09-10', 'Julián Peña', 'Vencida', 'rojo', 'Término vencido'),
       ('PET-2026-0117', 'Gobernación del Magdalena', 'NIT 800103920', '2026-09-08', 'Marta Quintero', 'En trámite', 'dorado', '11 d. hábiles restantes'), ('PET-2026-0116', 'Dr. José Caballero', 'C.C. 1082950121', '2026-09-05', 'Diego Gómez', 'Finalizada', 'verde', 'A tiempo'),
       ('PET-2026-0115', 'Comité Cívico de Ciénaga', 'NIT 900456789', '2026-09-03', 'Julián Peña', 'En trámite', 'dorado', '4 d. hábiles restantes'), ('PET-2026-0114', 'Ana María Torres', 'C.C. 55123987', '2026-09-01', 'Marta Quintero', 'Vencida', 'rojo', 'Término vencido')]


def filas_sol():
    return ''.join(f'<tr data-est="{e}"><td><span class="mg-codigo">{c}</span></td><td><b>{n}</b><small>{d}</small></td><td>{f}<small>Recepción correo</small></td><td><span class="mg-rol">{ic("usuario", 15)}{a}</span></td><td><span class="mg-st mg-st--{k}">{e}<span class="mg-chip mg-chip--{"verde" if k == "verde" else "rojo" if k == "rojo" else "amarillo"}">{s}</span></span></td><td><button class="mg-iconbtn mg-iconbtn--gris mg-iconbtn--sm" type="button" aria-label="Ver {c}" data-ver>{ic("ojo", 16)}</button></td></tr>' for c, n, d, f, a, e, k, s in SOL)


def sel(lab, ops, i):
    return f'<div class="mg-sel"><label class="mg-lab" for="{i}">{lab}</label><select id="{i}">' + ''.join(f'<option>{o}</option>' for o in ops) + '</select></div>'


CONSULTAR = f'''      {cab(["Ventanilla de correspondencia", "Consulta bajo demanda"], "Consultar solicitudes", "Explora, filtra y consulta de forma avanzada las solicitudes ciudadanas registradas en la oficina.")}
      <section class="mg-panel mg-forms" data-demo="Filtros avanzados + resultados" data-nota="Búsqueda, selects con etiqueta (mg-sel), conteo (mg-resultados), tabla con códigos (mg-codigo) y estados con subetiqueta (mg-st)">
        <div style="display:flex;gap:.6rem;flex-wrap:wrap"><div class="mg-buscar" style="flex:1;min-width:14rem">{ic("buscar", 16)}<input class="in-b" type="search" id="q" placeholder="Buscar por código…" aria-label="Buscar por código"></div><select aria-label="Orden" style="width:auto"><option>Más reciente primero</option><option>Más antigua primero</option></select><button class="mg-btn mg-btn--sm" type="button" id="consultar">{ic("buscar", 14)} Consultar</button></div>
        <div class="mg-fgrid" style="grid-template-columns:repeat(auto-fit,minmax(12rem,1fr));margin-top:1rem">{sel("Estado de la solicitud", ["Todos los estados", "En trámite", "Finalizada", "Vencida"], "est")}{sel("Responsable", ["Todos los abogados", "Diego Gómez", "Julián Peña", "Marta Quintero"], "resp")}{sel("Alerta de plazo (semáforo)", ["Cualquier plazo", "A tiempo", "Por vencer", "Vencida"], "pl")}{sel("Fecha de recepción", ["Cualquier fecha", "Últimos 7 días", "Este mes"], "fe")}</div>
        <p class="mg-resultados" id="res">Resultados de la consulta: 6 solicitudes</p>
        <div class="mg-tbl-wrap"><table class="mg-tbl"><thead><tr><th>Código</th><th>Nombre del solicitante</th><th>Fecha de recepción</th><th>Responsable</th><th>Estado y plazo</th><th>Acción</th></tr></thead><tbody id="tb">{filas_sol()}</tbody></table></div>{PAGER}
      </section>'''

CONSULTAR_JS = '''  function filtrar() { const e = $('est').value, q = $('q').value.toLowerCase(); let n = 0;
    document.querySelectorAll('#tb tr').forEach((r) => { const ok = (e.startsWith('Todos') || r.dataset.est === e) && r.textContent.toLowerCase().includes(q); r.hidden = !ok; if (ok) n++; });
    $('res').textContent = 'Resultados de la consulta: ' + n + ' solicitud' + (n === 1 ? '' : 'es'); }
  ['est', 'q'].forEach((i) => $(i).addEventListener('input', filtrar)); $('consultar').onclick = filtrar;
  document.querySelectorAll('[data-ver]').forEach((b) => b.addEventListener('click', () => (location.href = 'sol-bitacora.html')));'''

# ------------------------------------------------------------------ 3 · RECEPCIÓN
def kcard(cls, ic_n, titulo, num, chips, pie):
    return f'<div class="mg-kcard mg-kcard--{cls}"><div class="mg-kcard__top"><span class="mg-kcard__ic">{ic(ic_n, 20)}</span><h3>{titulo}</h3></div><div class="num">{num}{chips}</div><small>{pie}</small></div>'


RECEPCION = f'''      {cab(["Ventanilla de entrada", "Oficina de Tecnologías de la Información"], "Dashboard de recepción", "Monitorea el flujo diario de solicitudes recibidas, audita el historial cronológico y vigila la carga procesal de los abogados de la secretaría.", False)}
      <section class="mg-kcards" aria-label="Indicadores" data-demo="Tarjetas KPI" data-nota="mg-kcard: ícono redondo, título, número grande y chip; variantes azul, dorado, lila (defecto), verde y rojo">
        {kcard("azul", "mensaje", "Solicitudes recibidas hoy", "4", '<span class="mg-chip mg-chip--verde">+4 al día</span>', "Ingresadas durante el día")}
        {kcard("dorado", "archivo", "Nuevas por revisar", "8", '<span class="mg-chip mg-chip--amarillo">Por clasificar</span>', "Requieren clasificación")}
        {kcard("", "reloj", "En trámite", "40", '<span class="mg-chip">56% del total</span>', "En trámite activo")}
        {kcard("verde", "check-circulo", "Finalizadas", "40", '<span class="mg-chip mg-chip--verde">44% del total</span>', "Respuestas enviadas")}
      </section>
      <section class="mg-panel" data-demo="Panel con acción principal" data-nota="Panel con cabecera y botón de acción"><div class="mg-panel__head">{ic("tareas", 20)}<div><h2>Solicitudes por clasificar</h2><small>Las más recientes que aún no tienen tipo de ley asignado</small></div><a class="mg-btn mg-btn--sm" href="sol-consultar.html">Ver todas {ic("flecha-derecha", 14)}</a></div>
        <div class="mg-tbl-wrap"><table class="mg-tbl"><thead><tr><th>Código</th><th>Solicitante</th><th>Recibida</th><th>Estado</th></tr></thead><tbody>
        <tr><td><span class="mg-codigo">PET-2026-0120</span></td><td><b>Asociación de Vendedores</b><small>NIT 900222111</small></td><td>Hoy 08:15</td><td><span class="mg-chip mg-chip--azul">Sin clasificar</span></td></tr>
        <tr><td><span class="mg-codigo">PET-2026-0121</span></td><td><b>María Fernanda Ruiz</b><small>C.C. 1082445566</small></td><td>Hoy 09:40</td><td><span class="mg-chip mg-chip--azul">Sin clasificar</span></td></tr></tbody></table></div></section>'''

# ------------------------------------------------------------------ 4 · ENTREGAS
ENTREGAS = f'''      {cab(["Mis actuaciones · Respuesta final", "0 pendientes de entrega"], "Entregar respuestas", "Selecciona una solicitud asignada para cargar el oficio de respuesta final y la constancia de correo remitido, o para subsanar devoluciones.")}
      <section class="mg-panel mg-forms" data-demo="Búsqueda + pestañas con contador + estado vacío" data-nota="mg-ptabs con mg-cnt (contador) y mg-empty «Al día»">
        <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-bottom:1rem"><div class="mg-buscar" style="flex:1;min-width:14rem">{ic("buscar", 16)}<input class="in-b" type="search" placeholder="Buscar por código…" aria-label="Buscar por código"></div><select aria-label="Prioridad" style="width:auto"><option>Prioridad legal</option><option>Mayor a menor</option></select></div>
        <div class="mg-ptabs" role="tablist" aria-label="Estado de entrega"><button role="tab" aria-selected="true">Por entregar<span class="mg-cnt">0</span></button><button role="tab" aria-selected="false">Devueltas<span class="mg-cnt">0</span></button><button role="tab" aria-selected="false">En trámite<span class="mg-cnt">0</span></button></div>
        <div class="mg-empty"><span class="ic">{ic("check-circulo", 22)}</span><h3>Al día · No tienes entregas pendientes</h3><p>Cuando recibas nuevas asignaciones clasificadas o devoluciones, aparecerán aquí ordenadas por prioridad legal.</p></div></section>
      <section class="mg-panel mg-forms" data-demo="Filtros en fila + tabla vacía" data-nota="Barra de filtros en línea y estado vacío dentro del panel"><div class="mg-panel__head">{ic("calendario", 20)}<div><h2>Aclaraciones y prórrogas</h2><small>Suspensión y ampliación de términos (prórroga única de hasta 50%)</small></div></div>
        <div class="mg-fgrid" style="grid-template-columns:repeat(auto-fit,minmax(13rem,1fr))"><select aria-label="Tipo de actuación"><option>Aclaración al solicitante</option><option>Prórroga legal</option></select><select aria-label="Plazo"><option>Prórrogas legales (+50%)</option></select><div class="mg-buscar">{ic("buscar", 16)}<input class="in-b" type="search" placeholder="Buscar por código…" aria-label="Buscar"></div></div>
        <p style="margin:1.25rem 0 0;font:700 .82rem var(--mg-font-sans);color:var(--mg-primary)">Solicitudes en trámite elegibles para requerir aclaración</p>
        <div class="mg-empty"><span class="ic">{ic("check-circulo", 22)}</span><h3>Al día · No tienes solicitudes pendientes</h3><p>No hay solicitudes activas disponibles para solicitar aclaración.</p></div></section>'''

# ------------------------------------------------------------------ 5 · BITÁCORA
CASOS = [('PET-2026-0119', 'Finalizada', 'mg-chip--verde', 'Cooperativa de Transporte del Norte', 'Diego Gómez', '06 Nov 2026'), ('PET-2026-0118', 'Vencida', 'mg-chip--rojo', 'Luis Fernando Arrieta', 'Diego Gómez', '06 Nov 2026'), ('PET-2026-0117', 'Descartada', 'mg-chip--gris', 'Gobernación del Magdalena', 'Diego Gómez', '06 Nov 2026'), ('PET-2026-0116', 'Finalizada', 'mg-chip--verde', 'Dr. José Caballero', 'Diego Gómez', '06 Nov 2026')]
EVT = [('Solicitud registrada en ventanilla', 'Registrada en ventanilla tras su recepción en el correo institucional.', 'Realizado por Receptor Ventanilla Jurídica 1', '10 de sept de 2026, 05:00 a. m.', ''), ('Plazos de ley iniciados', 'Clasificada como Copias y Documentos (10 días).', 'Realizado por Diego Gómez', '10 de sept de 2026, 05:00 a. m.', 'verde'), ('Revisión del equipo jurídico', 'El equipo revisó la documentación aportada.', 'Realizado por Marta Quintero', '12 de sept de 2026, 10:30 a. m.', 'lila')]


def casos():
    return ''.join(f'<button type="button" class="mg-caso" aria-current="{str(i == 0).lower()}" data-c="{c}"><span class="fila"><span class="mg-codigo">{c}</span><span class="mg-chip {k}">{e}</span></span><b>{n}</b><span class="meta"><span>{ic("usuario", 12)} {a}</span><span>{ic("calendario", 12)} Cierre: {f}</span></span></button>' for i, (c, e, k, n, a, f) in enumerate(CASOS))


def eventos():
    return ''.join(f'<li class="mg-evento{" mg-evento--" + k if k else ""}"><span class="ic">{ic("archivo" if not k else "check-circulo", 16)}</span><div><b>{t}</b><p>{d}</p><div class="tags"><span>{a}</span><span class="mg-chip mg-chip--gris">{f}</span></div></div></li>' for t, d, a, f, k in EVT)


BITACORA = f'''      {cab(["Historial y trazabilidad", "62 solicitudes", "Ley 1755 de 2015"], "Bitácora del trámite", "Consulta la cronología inmutable de movimientos, aclaraciones, prórrogas y revisiones en las solicitudes de tu dependencia.")}
      <div class="mg-bita">
        <section class="mg-panel mg-forms" aria-label="Casos" data-demo="Lista de casos seleccionables" data-nota="mg-caso: tarjeta-botón con código, estado, nombre y responsable; aria-current marca el activo"><div class="mg-buscar" style="margin-bottom:.75rem">{ic("buscar", 16)}<input class="in-b" type="search" id="q" placeholder="Buscar por código…" aria-label="Buscar caso"></div>
          <div class="mg-ptabs" role="tablist" aria-label="Filtro de casos" style="margin-bottom:.75rem"><button role="tab" aria-selected="true">Todas (62)</button><button role="tab" aria-selected="false">Activas (0)</button><button role="tab" aria-selected="false">Finalizadas (6)</button></div><div id="lista">{casos()}</div></section>
        <section class="mg-panel" aria-live="polite" data-demo="Detalle con línea de eventos" data-nota="mg-eventos + mg-evento: ícono de color, título, descripción y etiquetas de autor y fecha">
          <h2 id="dt" style="margin:0 0 .4rem;font:800 1.05rem var(--mg-font-display);color:var(--mg-primary)">Cooperativa de Transporte del Norte</h2><div class="mg-tags" style="margin-bottom:.75rem"><span class="mg-codigo">PET-2026-0119</span><span class="mg-chip mg-chip--verde" id="de">Finalizada</span><span class="mg-chip mg-chip--azul">Recepción: 06 de sept de 2026</span></div>
          <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1rem"><button class="mg-btn mg-btn--secondary mg-btn--sm" type="button">{ic("carpeta", 14)} Consultar expediente</button><button class="mg-btn mg-btn--sm" type="button">{ic("enlace-externo", 14)} Habilitar entrega</button></div>
          <div class="mg-utabs" role="tablist" aria-label="Eventos" style="margin-bottom:1rem"><button role="tab" aria-selected="true">Todas (3)</button><button role="tab" aria-selected="false">Activas (0)</button><button role="tab" aria-selected="false">Finalizadas (3)</button></div>
          <ul class="mg-eventos">{eventos()}</ul></section>
      </div>'''

BITACORA_JS = '''  document.querySelectorAll('.mg-caso').forEach((b) => b.addEventListener('click', () => { document.querySelectorAll('.mg-caso').forEach((x) => x.setAttribute('aria-current', x === b)); $('dt').textContent = b.querySelector('b').textContent; $('de').textContent = b.querySelector('.mg-chip').textContent; }));
  $('q').addEventListener('input', () => { const t = $('q').value.toLowerCase(); document.querySelectorAll('.mg-caso').forEach((c) => (c.hidden = !c.textContent.toLowerCase().includes(t))); });
  document.querySelectorAll('.mg-ptabs button, .mg-utabs button').forEach((b) => b.addEventListener('click', () => b.parentElement.querySelectorAll('button').forEach((x) => x.setAttribute('aria-selected', x === b))));'''

# ------------------------------------------------------------------ 6 · CONTROL
ABG = [('Abogado Sustanciador 1', 'abogado01@pruebas.local', 0, 0, 0, '0/0', 0, 100), ('Abogado Sustanciador 2', 'abogado02@pruebas.local', 12, 5, 1, '9/10', 1, 92), ('Abogado Sustanciador 3', 'abogado03@pruebas.local', 8, 3, 0, '8/8', 0, 100)]


def filas_abg():
    return ''.join(f'<tr><td><b>{n}</b><small>{c}</small></td><td>{a}</td><td><span class="mg-n-box">{ac}</span></td><td>{r}</td><td class="mg-n-ok">{t}</td><td>{d}</td><td><span class="mg-efec">{e}%<i></i></span></td></tr>' for n, c, a, ac, r, t, d, e in ABG)


CONTROL = f'''      <div class="mg-page"><div><div class="mg-tags"><span class="mg-pill">Dashboard de control</span><span class="mg-pill mg-pill--out">Vigencia 2026</span><span class="mg-pill mg-pill--out">Oficina de Tecnologías de la Información</span></div><h1>Dashboard de control</h1><p>Control de plazos legales, calidad de respuestas y distribución de solicitudes entre abogados.</p></div>
        <label class="mg-forms mg-sel" style="min-width:11rem"><span class="mg-lab" style="margin:0">Vigencia</span><select id="anio"><option>Año 2026</option><option>Año 2025</option><option>Año 2024</option></select></label></div>
      <section class="mg-kcards" aria-label="Indicadores" data-demo="KPI con semáforo" data-nota="mg-kcard + mg-sem: tres números con color de semáforo y chips">
        {kcard("azul", "grafica-linea", "Volumen anual", "62", '<span class="mg-chip mg-chip--verde">0 · 0 cerradas</span>', "Cerradas en la vigencia")}
        {kcard("dorado", "check-circulo", "Cumplimiento de términos", "8", '<span class="mg-chip mg-chip--gris">Sin cierres</span>', "Aún no hay casos cerrados")}
        {kcard("", "escudo", "Tasa de devolución", "0%", '<span class="mg-chip mg-chip--rojo">1 fondo</span> <span class="mg-chip mg-chip--amarillo">12 forma</span>', "Sin revisiones evaluadas")}
        <div class="mg-kcard mg-kcard--verde"><div class="mg-kcard__top"><span class="mg-kcard__ic">{ic("alerta", 20)}</span><h3>Semáforo activo</h3></div><div class="mg-sem"><div>40<span class="mg-chip mg-chip--verde">Verde</span></div><div>40<span class="mg-chip mg-chip--amarillo">Alerta</span></div><div>40<span class="mg-chip mg-chip--rojo">Rojo</span></div></div><small>Solicitudes en riesgo</small></div>
      </section>
      <section class="mg-panel" data-demo="Tabla de efectividad por responsable" data-nota="mg-tbl--c (centrada) con números resaltados (mg-n-box, mg-n-ok) y barra de efectividad (mg-efec)"><div class="mg-tbl-wrap"><table class="mg-tbl mg-tbl--c"><thead><tr><th>Abogado</th><th>Asignadas</th><th>Activas</th><th>En riesgo</th><th>A tiempo</th><th>Devoluciones</th><th>Efectividad</th></tr></thead><tbody>{filas_abg()}</tbody></table></div></section>'''

# ------------------------------------------------------------------ 7 · USUARIOS
USR = [('Laura Abogada (prueba)', 'abogada@pruebas.local', 'LA', 'Abogado', 'Contratista', 'Activo', ''), ('Alberto Abogado', 'abogado@pruebas.local', 'AA', 'Abogado', 'Profesional', 'Bloqueado', 'rojo'), ('Laura Abogada (prueba)', 'abogada@pruebas.local', 'LA', 'Enlace', 'Coordinación', 'Inactivo', 'amarillo'), ('Laura Abogada (prueba)', 'abogada@pruebas.local', 'LA', 'Supervisor', 'Dirección', 'Activo', ''), ('Laura Abogada (prueba)', 'abogada@pruebas.local', 'LA', 'Administrador', 'Sistema', 'Activo', ''), ('Laura Abogada (prueba)', 'abogada@pruebas.local', 'LA', 'Superadministrador', 'Sistema', 'Activo', '')]
ROL_IC = {'Abogado': 'maletin', 'Enlace': 'enlace', 'Supervisor': 'verificado', 'Administrador': 'escudo', 'Superadministrador': 'escudo-check'}


def filas_usr():
    return ''.join(f'<tr><td><div class="mg-usr"><span class="mg-av">{a}</span><div><b>{n}</b><small>{c}</small></div></div></td><td><div class="mg-rol">{ic(ROL_IC[r], 18)}<div><b>{r}</b><small>{s}</small></div></div></td><td><span class="mg-dot{" mg-dot--" + k if k else ""}">{e}</span></td><td>9 de nov de 2026</td></tr>' for n, c, a, r, s, e, k in USR)


USUARIOS = f'''      <div class="mg-page"><div><span class="mg-pill">Administración</span><h1>Usuarios</h1><p>Cuentas de acceso al sistema y su rol.</p></div></div>
      <section class="mg-panel mg-forms" data-demo="Usuarios con rol" data-nota="mg-usr (avatar + correo), mg-rol (ícono + subtítulo), mg-dot (estado) y paginación simple"><div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-bottom:1rem"><div class="mg-buscar" style="flex:1;min-width:14rem">{ic("buscar", 16)}<input class="in-b" type="search" placeholder="Buscar por nombre, correo o documento" aria-label="Buscar usuario"></div><select aria-label="Rol" style="width:auto"><option>Todos los roles</option><option>Abogado</option><option>Supervisor</option></select><select aria-label="Estado" style="width:auto"><option>Activos</option><option>Bloqueados</option><option>Inactivos</option></select></div>
        <div class="mg-tbl-wrap"><table class="mg-tbl"><thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Último ingreso</th></tr></thead><tbody>{filas_usr()}</tbody></table></div>
        <div class="mg-pager mg-pager--simple"><span>1–6 de 6</span><span class="b"><span class="dis">‹ Anterior</span>&nbsp; 1 de 1 &nbsp;<span class="dis">Siguiente ›</span></span></div></section>'''

# ------------------------------------------------------------------ 8 · ROLES
ROLES = [('Super Administrador', 'escudo-check', 1), ('Administrador', 'escudo', 1), ('Supervisor', 'verificado', 1), ('Enlace', 'enlace', 1), ('Abogado', 'maletin', 1)]
PERMS = [('Asignar expedientes a un abogado', 'expedientes.asignar', [0, 1, 0, 1, 0]), ('Cambiar el estado del expediente', 'expedientes.cambiar_estado', [0, 1, 0, 1, 1]), ('Consultar la bitácora', 'bitacora.ver', [1, 1, 1, 1, 1]), ('Gestionar usuarios', 'usuarios.gestionar', [1, 1, 0, 0, 0]), ('Cambiar permisos', 'roles.cambiar', [1, 0, 0, 0, 0])]


def matriz():
    th = ''.join(f'<th scope="col">{ic(i, 18)}{n}<small>{u} usuario</small></th>' for n, i, u in ROLES)
    filas = ''.join(f'<tr><td>{p}<small>{c}</small></td>' + ''.join(f'<td>{"<span class=" + chr(34) + "mg-perm" + chr(34) + " role=" + chr(34) + "img" + chr(34) + " aria-label=" + chr(34) + "Permitido" + chr(34) + ">" + ic("check", 13) + "</span>" if v else "<span class=" + chr(34) + "mg-perm mg-perm--no" + chr(34) + " aria-label=" + chr(34) + "Sin permiso" + chr(34) + ">—</span>"}</td>' for v in vs) + '</tr>' for p, c, vs in PERMS)
    return f'<table class="mg-matriz"><thead><tr><th scope="col" style="text-align:left">Permiso</th>{th}</tr></thead><tbody><tr class="grupo"><td colspan="6">{ic("carpeta", 16)} Expedientes</td></tr>{filas}</tbody></table>'


ROLESP = f'''      <div class="mg-page"><div><span class="mg-pill">Administración</span><h1>Roles y permisos</h1><p>Los cinco roles del sistema y lo que puede hacer cada uno. Los cambios aplican de inmediato.</p><span class="mg-pill mg-pill--out" style="margin-top:.5rem">Puede consultar la matriz. Solo el superadministrador puede cambiar permisos.</span></div></div>
      <section class="mg-panel" data-demo="Matriz de roles y permisos" data-nota="mg-matriz: columnas por rol (ícono + usuarios), filas agrupadas y marcas mg-perm; en pantallas angostas se desplaza horizontalmente"><div class="mg-matriz-wrap">{matriz()}</div></section>'''


def build(root):
    d = os.path.join(root, 'demos')
    pages = {
        'sol-registrar.html': pagina('sol-registrar.html', 'Registrar solicitud', 'Formulario de recepción + asignación por tarjetas con confirmación', REGISTRAR, REGISTRAR_JS),
        'sol-consultar.html': pagina('sol-consultar.html', 'Consultar solicitudes', 'Filtros avanzados, resultados y tabla con estados y plazos', CONSULTAR, CONSULTAR_JS),
        'sol-recepcion.html': pagina('sol-recepcion.html', 'Dashboard de recepción', 'Tarjetas KPI y lista por clasificar', RECEPCION),
        'sol-entregas.html': pagina('sol-entregas.html', 'Entregar respuestas', 'Pestañas con contador y estados vacíos «Al día»', ENTREGAS),
        'sol-bitacora.html': pagina('sol-bitacora.html', 'Bitácora del trámite', 'Lista de casos y línea de eventos', BITACORA, BITACORA_JS),
        'sol-control.html': pagina('sol-control.html', 'Dashboard de control', 'KPI con semáforo y tabla de efectividad', CONTROL),
        'admin-usuarios.html': pagina('admin-usuarios.html', 'Usuarios', 'Usuarios con avatar, rol con ícono y estado', USUARIOS),
        'admin-roles.html': pagina('admin-roles.html', 'Roles y permisos', 'Matriz de permisos por rol', ROLESP),
    }
    for n, h in pages.items():
        with open(os.path.join(d, n), 'w', encoding='utf-8', newline='\n') as f:
            f.write(h)
    return list(pages)
