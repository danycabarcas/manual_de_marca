"""Demos del PANEL DE GESTIÓN (diseño «Convocatorias»): inicio, perfil, listado, detalle, configuración y crear cuenta."""
import os

NAV = [('panel-inicio.html', 'Inicio', 'inicio'), ('panel-perfil.html', 'Mi hoja de vida', 'usuario'), ('panel-listado.html', 'Convocatorias', 'archivo'),
       ('panel-detalle.html', 'Formularios', 'tareas')]
NAV_ADMIN = [('panel-listado.html#usuarios', 'Usuarios', 'usuarios'), ('panel-listado.html#ubicaciones', 'Ubicaciones', 'ubicacion'), ('panel-configuracion.html', 'Configuración', 'ajustes')]

HEAD = '''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%TITULO% · Demo Gobernación del Magdalena</title>
<link rel="icon" href="../assets/favicon/favicon.ico">
<!-- ① DEPENDENCIAS: gob.css (Montserrat, mg-shell, mg-panel…) y gob.js (íconos gob-icono, toasts, modal) -->
<link rel="stylesheet" href="../cdn/v1/gob.css">
<script type="module" src="../cdn/v1/gob.js"></script>
<style>body { margin: 0; }</style>
</head>
'''

TIRA = '''<!--DEMO-ONLY-->
<div style="background:#081A2C;color:#C9D4E3;font:600 .78rem Montserrat,system-ui,sans-serif;padding:.5rem 1rem;display:flex;gap:.5rem 1.25rem;flex-wrap:wrap;align-items:center;justify-content:center">
  <a href="index.html" style="color:#fff;text-decoration:none">‹ Todos los demos</a><span>%NOTA%</span>
</div>
<!--/DEMO-ONLY-->'''


def shell(archivo, titulo, nota, cuerpo, script='', activo=None, app='Convocatorias', side=None):
    activo = activo or archivo
    cuerpo = cuerpo.replace('class="mg-fgrid', 'class="mg-forms mg-fgrid').replace('class="mg-filtros', 'class="mg-forms mg-filtros').replace('type="search"', 'class="in-b" type="search"').replace('<section class="mg-panel" id="seccion"', '<section class="mg-panel mg-forms" id="seccion"').replace('<label style="display:inline-flex;align-items:center;font-size:.82rem', '<label class="mg-forms" style="display:inline-flex;align-items:center;font-size:.82rem')
    def li(h, t, i):
        cur = ' aria-current="page"' if h == activo else ''
        return f'<li><a href="{h}"{cur}><gob-icono nombre="{i}" tam="18"></gob-icono>{t}</a></li>'
    nav = ''.join(li(*x) for x in NAV)
    nav2 = ''.join(li(*x) for x in NAV_ADMIN)
    lado = side if side else ('<h2>Menú</h2><nav aria-label="Principal"><ul class="mg-nav">' + nav + '</ul><div class="mg-nav__sep">Administración</div><ul class="mg-nav">' + nav2 + '</ul></nav>')
    return (HEAD.replace('%TITULO%', titulo) + f'''<body>
{TIRA.replace("%NOTA%", nota)}
<div class="mg-shell" id="shell">
  <header class="mg-shell__top" data-demo="Barra superior" data-nota="Barra blanca con «la línea», logo + aplicación, usuario y botones redondos (notificaciones, perfil, salir, ayuda)">
    <button class="mg-iconbtn mg-iconbtn--gris mg-shell__burger" type="button" id="menu" aria-label="Abrir menú"><gob-icono nombre="menu" tam="20"></gob-icono></button>
    <a class="mg-shell__brand" href="panel-inicio.html"><img src="../assets/logos/svg/logo-horizontal-color.svg" alt="Gobernación del Magdalena"><span class="mg-shell__app"><b>{app}</b></span></a>
    <span class="mg-shell__sp"></span>
    <span class="mg-shell__user">José Caballero - <b>Administrador</b></span>
    <button class="mg-iconbtn mg-iconbtn--rojo" type="button" id="campana" aria-label="Notificaciones, 2 nuevas"><gob-icono nombre="campana" tam="18"></gob-icono><span class="n" aria-hidden="true">2</span></button>
    <a class="mg-iconbtn mg-iconbtn--lila" href="panel-perfil.html" aria-label="Mi perfil">JC</a>
    <a class="mg-iconbtn mg-iconbtn--rojo" href="login.html" aria-label="Cerrar sesión"><gob-icono nombre="salir" tam="18"></gob-icono></a>
    <button class="mg-iconbtn mg-iconbtn--gris" type="button" id="ayuda" aria-label="Ayuda">?</button>
  </header>
  <div class="mg-shell__body">
    <aside class="mg-shell__side" data-demo="Menú lateral (sticky)" data-nota="Menú claro que se queda fijo al hacer scroll; ítem activo en lila con aria-current=page">
      {lado}
    </aside>
    <div class="mg-shell__veil" id="veil"></div>
    <main class="mg-shell__main" id="contenido">
{cuerpo}
    </main>
  </div>
  <footer class="mg-shell__foot">Gobernación del Magdalena · Oficina TIC · Demostración del sistema de diseño</footer>
</div>
<script type="module">
  const $ = (id) => document.getElementById(id);
  $('menu').onclick = () => $('shell').classList.toggle('mg-shell--menu'); $('veil').onclick = () => $('shell').classList.remove('mg-shell--menu');
  $('campana').onclick = () => gob.toast({{ tipo: 'info', titulo: '2 notificaciones', mensaje: 'Tienes 2 postulaciones nuevas por revisar.' }});
  $('ayuda').onclick = () => gob.toast({{ tipo: 'info', titulo: 'Ayuda', mensaje: 'Aquí abre su centro de ayuda o la mesa de soporte.' }});
{script}
</script>
<!--DEMO-ONLY--><script type="module" src="demo-kit.js"></script><!--/DEMO-ONLY-->
</body>
</html>
''')


def ic(n, t=18):
    return f'<gob-icono nombre="{n}" tam="{t}"></gob-icono>'


# ------------------------------------------------------------------ INICIO
INICIO = f'''      <div class="mg-page" data-demo="Encabezado de página" data-nota="Píldora de sección + título azul + subtítulo (clases mg-pill y mg-page)"><div><span class="mg-pill">Inicio</span><h1>Gestión de Convocatorias</h1><p>Administra, crea y mantiene actualizadas las convocatorias del sistema.</p></div></div>

      <section class="mg-panel" style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap" data-demo="Tarjeta de progreso" data-nota="mg-panel + mg-progress: invita a completar el perfil">
        <div style="flex:1;min-width:16rem"><span class="mg-chip mg-chip--azul">Te falta poco</span><h2 style="margin:.4rem 0 .6rem;font:800 1.5rem var(--mg-font-display);color:var(--mg-primary)">Termina de crear tu perfil</h2>
          <div class="mg-progress" role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="3" aria-label="Pasos completados"><i style="width:33%"></i></div><small style="font-size:.74rem;color:var(--mg-text-muted)">1 de 3 pasos completados</small></div>
        <a class="mg-btn" href="panel-perfil.html">Continuar con mi perfil {ic("flecha-derecha", 16)}</a>
      </section>

      <section class="mg-quick" aria-label="Accesos rápidos" data-demo="Accesos rápidos" data-nota="mg-quick: tarjetas de acción con ícono de color (azul, amarillo, lila, verde)">
        <a href="panel-listado.html"><span class="ic">{ic("archivo")}</span><b>Administrar convocatorias</b><small>Consulta, edita o cierra convocatorias</small></a>
        <a class="amarillo" href="panel-listado.html"><span class="ic">{ic("agregar")}</span><b>Crear convocatoria</b><small>Registra una nueva convocatoria</small></a>
        <a class="lila" href="panel-configuracion.html"><span class="ic">{ic("ajustes")}</span><b>Configuración de perfil</b><small>Configura tu perfil</small></a>
      </section>

      <section class="mg-panel" data-demo="Panel con estado vacío" data-nota="mg-panel__head + mg-empty: mensaje amable cuando aún no hay datos">
        <div class="mg-panel__head">{ic("archivo")}<div><h2>Convocatorias abiertas</h2><small>Conoce y comparte las convocatorias disponibles</small></div></div>
        <div class="mg-empty"><span class="ic">{ic("check-circulo", 22)}</span><h3>No hay convocatorias registradas</h3><p>Actualmente no existen convocatorias disponibles en el sistema. Las nuevas convocatorias que se creen aparecerán en este espacio.</p></div>
      </section>'''

# ------------------------------------------------------------------ PERFIL
PERFIL = f'''      <div class="mg-page"><div><span class="mg-pill">Mi hoja de vida</span><h1>Mi perfil profesional</h1><p>Completa cada sección, se utilizará automáticamente en todas tus postulaciones.</p></div></div>
      <div style="display:grid;grid-template-columns:18rem minmax(0,1fr);gap:1.25rem;align-items:start" class="dos-col">
        <section class="mg-panel" aria-label="Secciones del perfil" data-demo="Lista de secciones con estado" data-nota="mg-checklist: cada botón muestra su sección; check verde = completa">
          <ul class="mg-checklist" id="secciones"></ul></section>
        <section class="mg-panel" id="seccion" aria-live="polite" data-demo="Formulario de sección" data-nota="mg-panel + mg-fgrid (rejilla de 2 columnas) + mg-lab (etiqueta con asterisco)"></section>
      </div>
      <style>@media (max-width: 900px) {{ .dos-col {{ grid-template-columns: 1fr !important; }} }}</style>'''

PERFIL_JS = '''  const S = [
    { id: 'per', t: 'Información personal', i: 'usuario', sub: 'Datos básicos que te identifican', ok: true, c: [['Tipo de documento', 'sel:Cédula de ciudadanía,Cédula de extranjería,Pasaporte'], ['Número de documento', 'text'], ['Nombres', 'text'], ['Apellidos', 'text'], ['Fecha de nacimiento', 'date'], ['Género', 'sel:Femenino,Masculino,Otro']] },
    { id: 'con', t: 'Información de contacto', i: 'correo', sub: 'Completa tu perfil una vez y úsalo en todas tus postulaciones', ok: true, c: [['Correo electrónico', 'email'], ['Teléfono', 'tel'], ['Facebook', 'text*'], ['Instagram', 'text*'], ['Sitio web', 'text*full']] },
    { id: 'res', t: 'Dirección de residencia', i: 'ubicacion', sub: 'Escribe la dirección del lugar donde vives', ok: true, c: [['Departamento', 'sel:Magdalena,Atlántico,Bolívar'], ['Municipio', 'sel:Santa Marta,Ciénaga,Fundación'], ['Tipo de zona', 'sel:Urbana,Rural'], ['Dirección', 'text*full']] },
    { id: 'for', t: 'Formación académica', i: 'escuela', sub: 'Tus estudios formales', ok: true, c: [['Nivel de estudio', 'sel:Técnico,Tecnólogo,Pregrado,Posgrado'], ['Institución', 'text'], ['Título obtenido', 'text full'], ['Fecha de grado', 'date']] },
    { id: 'exp', t: 'Experiencia laboral', i: 'maletin', sub: 'Cargos y funciones desempeñadas', ok: true, c: [['Empresa', 'text'], ['Cargo', 'text'], ['Fecha de inicio', 'date'], ['Fecha de fin', 'date*']] },
    { id: 'cer', t: 'Certificaciones', i: 'verificado', sub: 'Cursos, diplomas y certificaciones complementarias', ok: false, vacio: 'Aún no has agregado certificaciones' },
    { id: 'doc', t: 'Documentos soporte', i: 'archivo', sub: 'Adjunta tus documentos, se reutilizarán en cada postulación', ok: false, docs: true },
  ];
  let actual = 0;
  const campo = ([l, t], k) => { const opc = t.startsWith('sel:') ? t.slice(4).split(',') : null, req = !t.includes('*'), full = t.includes('full'), tipo = t.replace(/\\*|full/g, '').trim(), id = 'c' + k;
    const ctl = opc ? `<select id="${id}"><option value="">Seleccione…</option>${opc.map((o) => `<option>${o}</option>`).join('')}</select>` : `<input id="${id}" type="${tipo === 'text' ? 'text' : tipo}">`;
    return `<div class="${full ? 'full' : ''}"><label class="mg-lab" for="${id}">${l}${req ? '<span class="req">*</span>' : ' <small>(opcional)</small>'}</label>${ctl}</div>`; };
  function lista() {
    $('secciones').innerHTML = S.map((s, i) => `<li><button type="button" data-i="${i}" aria-current="${i === actual}"><gob-icono nombre="${s.i}" tam="16"></gob-icono>${s.t}${s.ok ? '<span class="ok" aria-label="Completa"><gob-icono nombre="check-circulo" tam="16"></gob-icono></span>' : '<span class="pend" aria-label="Pendiente"></span>'}</button></li>`).join('');
    $('secciones').querySelectorAll('button').forEach((b) => (b.onclick = () => { actual = +b.dataset.i; lista(); ver(); }));
  }
  function ver() {
    const s = S[actual]; let cuerpo;
    if (s.vacio) cuerpo = `<div class="mg-empty"><span class="ic"><gob-icono nombre="check-circulo" tam="22"></gob-icono></span><h3>${s.vacio}</h3><p>Agrega tus certificaciones y cursos complementarios</p></div>`;
    else if (s.docs) cuerpo = ['Tarjeta profesional', 'Cédula de ciudadanía'].map((d, i) => `<div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 0;border-bottom:1px solid #F1F4F8"><gob-icono nombre="archivo" tam="18"></gob-icono><div style="flex:1"><b style="font-size:.9rem">${d}</b><small style="display:block;color:var(--mg-text-muted);font-size:.74rem">PDF o PNG, máximo 2 MB</small>${i ? '<span class="mg-chip mg-chip--rojo" style="margin-top:.3rem">Obligatorio</span>' : ''}</div><span class="mg-chip mg-chip--gris">Pendiente</span><button type="button" class="mg-btn mg-btn--secondary mg-btn--sm" data-cargar>Cargar</button></div>`).join('');
    else cuerpo = `<form id="form" novalidate><div class="mg-forms mg-fgrid">${s.c.map(campo).join('')}</div><div class="mg-formfoot"><button class="mg-btn mg-btn--sm" type="submit"><gob-icono nombre="check" tam="14"></gob-icono> Guardar cambios</button></div></form>`;
    $('seccion').innerHTML = `<div class="mg-panel__head"><gob-icono nombre="${s.i}" tam="20"></gob-icono><div><h2>${s.t}</h2><small>${s.sub}</small></div>${s.vacio ? '<button type="button" class="mg-btn mg-btn--sm" data-agregar><gob-icono nombre="agregar" tam="14"></gob-icono> Agregar</button>' : ''}</div>${cuerpo}`;
    $('seccion').querySelector('#form')?.addEventListener('submit', (e) => { e.preventDefault(); s.ok = true; lista(); gob.toast({ tipo: 'exito', titulo: 'Sección guardada', mensaje: s.t }); });
    $('seccion').querySelectorAll('[data-cargar]').forEach((b) => (b.onclick = () => gob.toast({ tipo: 'info', titulo: 'Cargar documento', mensaje: 'Aquí abre el selector (gob-archivos).' })));
    $('seccion').querySelector('[data-agregar]')?.addEventListener('click', () => gob.toast({ tipo: 'info', titulo: 'Agregar', mensaje: 'Aquí abre el formulario de certificación.' }));
  }
  lista(); ver();'''

# ------------------------------------------------------------------ LISTADO
CONV = [('Docentes de Cátedra - Campus Universitario de Plato', 'Plato, Magdalena', 'Agencia de educación superior', 'Cerrada', '10 Nov'), ('Obreros', 'Santa Marta', 'Secretaría de Infraestructura', 'Abierta', '30 Nov'),
        ('Profesional de apoyo jurídico', 'Ciénaga', 'Secretaría General', 'Abierta', '25 Nov'), ('Auxiliar administrativo', 'Fundación', 'Hacienda departamental', 'Cerrada', '02 Nov'),
        ('Técnico en sistemas', 'Santa Marta', 'Oficina TIC', 'Abierta', '05 Dic'), ('Conductor', 'El Banco', 'Secretaría de Salud', 'Cerrada', '28 Oct')]


def cards():
    out = ''
    for i, (t, m, e, est, f) in enumerate(CONV):
        ab = est == 'Abierta'
        out += f'''<article class="mg-conv"><div class="mg-conv__top"><button class="mg-conv__star" type="button" aria-pressed="false" aria-label="Marcar como favorita">{ic("estrella", 18)}</button><div class="mg-conv__tags"><span class="mg-chip">Docente</span><span class="mg-chip mg-chip--azul">Pública</span><span class="mg-chip mg-chip--verde">Empleo</span><span class="mg-chip mg-chip--gris">Externa</span></div></div>
<h3>{t}</h3><div class="meta">{ic("ubicacion", 14)}{m}</div><div class="meta">{ic("edificio", 14)}{e}</div>
<div class="mg-conv__estado {"mg-conv__estado--abierta" if ab else ""}"><span>{ic("calendario", 14)} {est}</span><span>{f}</span></div>
<div class="mg-conv__acc"><button class="mg-btn mg-btn--flat" type="button" data-ed>{ic("editar", 14)} Editar</button><button class="mg-btn mg-btn--secondary" type="button" data-ver>{ic("ojo", 14)} Ver</button><button class="mg-btn mg-btn--secondary" type="button" aria-label="Compartir" data-comp>{ic("enlace", 14)}</button></div></article>'''
    return out


USU = [('José Caballero', 'abogada@pruebas.local', '1082950121', 'Administrador', 'Activo', ''), ('Ever Reales', 'abogada@pruebas.local', '—', 'Operador', 'Bloqueado', 'rojo'), ('Oficina de Cultura', 'abogada@pruebas.local', '—', 'Operador', 'Inactivo', 'amarillo'),
       ('Laura Abogada (prueba)', 'abogada@pruebas.local', '—', 'Operador', 'Activo', ''), ('Mateo Ortiz', 'mortiz@pruebas.local', '1082433990', 'Operador', 'Activo', ''), ('Sofía Ruiz', 'sruiz@pruebas.local', '—', 'Consulta', 'Activo', '')]


def filas_usu():
    return ''.join(f'<tr><td><b>{n}</b><small>{c}</small></td><td>{d}</td><td class="link">{r}</td><td><span class="mg-dot {("mg-dot--" + k) if k else ""}">{e}</span></td><td>04/11/2026 15:22</td><td><button class="mg-btn mg-btn--secondary mg-btn--sm" type="button" data-ed>{ic("editar", 13)} Editar</button></td></tr>' for n, c, d, r, e, k in USU)


BARRIOS = [('26 DE JULIO', 'Algarrobo', 'Activo', ''), ('ARIGUANÍ', 'Algarrobo', 'Bloqueado', 'rojo'), ('BRISAS DE ARIGUANÍ', 'Algarrobo', 'Inactivo', 'amarillo'), ('DIVINO NIÑO', 'Algarrobo', 'Activo', ''), ('CIUDAD EQUIDAD', 'Algarrobo', 'Activo', ''), ('EL CARMEN', 'Algarrobo', 'Activo', '')]


def filas_bar():
    return ''.join(f'<tr><td><b>{b}</b></td><td>{m}<small>Magdalena</small></td><td><span class="mg-dot {("mg-dot--" + k) if k else ""}">{e}</span></td><td style="white-space:nowrap"><button class="mg-btn mg-btn--secondary mg-btn--sm" type="button" data-ed>{ic("editar", 13)} Editar</button> <button class="mg-btn mg-btn--secondary mg-btn--sm" type="button" style="color:#C4002F" data-des>{ic("quitar", 13)} Desactivar</button></td></tr>' for b, m, e, k in BARRIOS)


PAGER = '''<div class="mg-pager"><span>Mostrando <b>10</b> de 25 solicitudes por página</span><span class="b">Filas por página <select aria-label="Filas por página"><option>10</option><option>25</option></select> &nbsp; Página 1 de 1 &nbsp;<button type="button" disabled aria-label="Primera">«</button><button type="button" disabled aria-label="Anterior">‹</button><button type="button" disabled aria-label="Siguiente">›</button><button type="button" disabled aria-label="Última">»</button></span></div>'''

LISTADO = f'''      <div class="mg-page"><div><span class="mg-pill" id="pill">Convocatorias</span><h1 id="h1">Administrar convocatoria</h1><p id="sub">Gestiona las convocatorias publicadas en el portal.</p></div><button class="mg-btn mg-btn--sm" type="button" id="nueva">{ic("agregar", 14)} Nueva convocatoria</button></div>
      <div class="mg-ptabs" role="tablist" aria-label="Vistas" data-demo="Pestañas del panel" data-nota="mg-ptabs (píldora con ícono) y mg-utabs (subrayadas). Se sincronizan con #hash"><button role="tab" aria-selected="true" data-v="conv">{ic("archivo", 16)} Convocatorias</button><button role="tab" aria-selected="false" data-v="usuarios">{ic("usuarios", 16)} Usuarios</button><button role="tab" aria-selected="false" data-v="ubicaciones">{ic("ubicacion", 16)} Ubicaciones</button></div>

      <div data-vista="conv">
        <section class="mg-panel" data-demo="Filtros" data-nota="mg-filtros + mg-buscar: búsqueda y selectores en una sola fila"><div class="mg-filtros"><p class="t">Buscar o filtrar convocatorias</p><div class="mg-buscar">{ic("buscar", 16)}<input type="search" id="q" placeholder="Buscar por municipio" aria-label="Buscar por municipio"></div><select aria-label="Municipio"><option>Todos los municipios</option><option>Santa Marta</option><option>Ciénaga</option><option>Plato</option></select><select aria-label="Modalidad"><option>Todas las modalidades</option><option>Empleo</option><option>Docente</option></select><select aria-label="Estado" id="est"><option value="">Estado</option><option>Abierta</option><option>Cerrada</option></select></div></section>
        <h2 style="margin:1.25rem 0 .75rem;font:800 1rem var(--mg-font-display);color:var(--mg-primary)">Ver listado</h2>
        <div class="mg-cards" id="cards" data-demo="Tarjetas de convocatoria" data-nota="mg-conv: favorita, etiquetas (mg-chip), estado y acciones Editar / Ver / Compartir">{cards()}</div>
      </div>

      <div data-vista="usuarios" hidden>
        <section class="mg-panel" data-demo="Tabla de usuarios" data-nota="mg-tbl + mg-dot (estado) + mg-pager (paginación)">
          <div class="mg-filtros" style="margin-bottom:1rem"><div class="mg-buscar">{ic("buscar", 16)}<input type="search" placeholder="Buscar por municipio" aria-label="Buscar usuario"></div><select aria-label="Rol"><option>Todos los roles</option><option>Administrador</option><option>Operador</option></select></div>
          <div class="mg-tbl-wrap"><table class="mg-tbl"><thead><tr><th>Usuario</th><th>Documento</th><th>Rol</th><th>Estado</th><th>Último ingreso</th><th>Acciones</th></tr></thead><tbody>{filas_usu()}</tbody></table></div>{PAGER}</section>
      </div>

      <div data-vista="ubicaciones" hidden>
        <section class="mg-panel"><div class="mg-ptabs" style="margin-bottom:1rem" role="tablist" aria-label="Tipo de ubicación"><button role="tab" aria-selected="true">{ic("edificio", 15)} Barrios</button><button role="tab" aria-selected="false">{ic("mapa", 15)} Corregimientos</button><button role="tab" aria-selected="false">{ic("globo", 15)} Veredas</button><button role="tab" aria-selected="false">{ic("historial", 15)} Historial de cambios</button></div>
          <div class="mg-filtros" style="margin-bottom:1rem"><div class="mg-buscar">{ic("buscar", 16)}<input type="search" placeholder="Buscar por municipio" aria-label="Buscar barrio"></div><select aria-label="Departamento"><option>Departamento</option><option>Magdalena</option></select><select aria-label="Municipio"><option>Municipio</option><option>Algarrobo</option></select></div>
          <div class="mg-tbl-wrap"><table class="mg-tbl"><thead><tr><th>Barrio</th><th>Municipio</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{filas_bar()}</tbody></table></div>{PAGER}</section>
      </div>'''

LISTADO_JS = '''  const V = { conv: ['Convocatorias', 'Administrar convocatoria', 'Gestiona las convocatorias publicadas en el portal.', 'Nueva convocatoria'], usuarios: ['Usuarios', 'Gestionar usuarios', 'Administra las cuentas del portal, crea nuevos usuarios y asigna roles y permisos.', 'Crear usuario'], ubicaciones: ['Ubicaciones', 'Gestionar ubicaciones', 'Crea y edita los barrios, corregimientos y veredas disponibles para registrar direcciones.', 'Nueva ubicación'] };
  function vista(k) {
    if (!V[k]) k = 'conv';
    document.querySelectorAll('[data-vista]').forEach((d) => (d.hidden = d.dataset.vista !== k));
    document.querySelectorAll('.mg-ptabs[aria-label="Vistas"] button').forEach((b) => b.setAttribute('aria-selected', b.dataset.v === k));
    $('pill').textContent = V[k][0]; $('h1').textContent = V[k][1]; $('sub').textContent = V[k][2]; $('nueva').lastChild.textContent = ' ' + V[k][3];
  }
  document.querySelectorAll('.mg-ptabs[aria-label="Vistas"] button').forEach((b) => b.addEventListener('click', () => { history.replaceState(null, '', '#' + b.dataset.v); vista(b.dataset.v); }));
  vista(location.hash.slice(1));
  // pestañas de ubicaciones (visual)
  document.querySelectorAll('[aria-label="Tipo de ubicación"] button').forEach((b, _, all) => b.addEventListener('click', () => all.forEach((x) => x.setAttribute('aria-selected', x === b))));
  document.querySelectorAll('.mg-conv__star').forEach((s) => s.addEventListener('click', () => { const on = s.getAttribute('aria-pressed') !== 'true'; s.setAttribute('aria-pressed', on); gob.toast({ tipo: 'info', titulo: on ? 'Marcada como favorita' : 'Quitada de favoritas' }); }));
  document.querySelectorAll('[data-ver]').forEach((b) => b.addEventListener('click', () => (location.href = 'panel-detalle.html')));
  document.querySelectorAll('[data-ed]').forEach((b) => b.addEventListener('click', () => gob.toast({ tipo: 'info', titulo: 'Editar', mensaje: 'Aquí abre el formulario o ventana de edición.' })));
  document.querySelectorAll('[data-comp]').forEach((b) => b.addEventListener('click', () => { navigator.clipboard?.writeText(location.href); gob.toast({ tipo: 'exito', titulo: 'Enlace copiado' }); }));
  document.querySelectorAll('[data-des]').forEach((b) => b.addEventListener('click', async () => { if (await gob.confirmar({ titulo: 'Desactivar barrio', mensaje: 'El barrio dejará de estar disponible al registrar direcciones. Los cambios quedan en el historial.', tipo: 'peligro', textoConfirmar: 'Desactivar' })) gob.toast({ tipo: 'exito', titulo: 'Barrio desactivado' }); }));
  $('nueva').addEventListener('click', () => gob.toast({ tipo: 'info', titulo: 'Crear', mensaje: 'Aquí abre el asistente de creación.' }));
  $('q').addEventListener('input', () => { const t = $('q').value.toLowerCase(); document.querySelectorAll('#cards .mg-conv').forEach((c) => (c.hidden = !c.textContent.toLowerCase().includes(t))); });
  $('est').addEventListener('change', () => { const v = $('est').value.toLowerCase(); document.querySelectorAll('#cards .mg-conv').forEach((c) => (c.hidden = !!v && !c.querySelector('.mg-conv__estado').textContent.toLowerCase().includes(v))); });'''

# ------------------------------------------------------------------ DETALLE
DETALLE = f'''      <div class="mg-page"><div><a class="mg-pill" href="panel-listado.html" style="text-decoration:none">‹ Volver a formularios</a><h1>Obreros</h1><div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;font-size:.8rem;color:var(--mg-gray-600)">Plato, Magdalena <span class="mg-chip mg-chip--gris">Cerrada</span><span class="mg-chip mg-chip--rojo">{ic("calendario", 12)} Cierra el 4 de Nov 2026</span></div></div><button class="mg-btn mg-btn--sm" type="button" id="nueva">{ic("agregar", 14)} Nueva convocatoria</button></div>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap" data-demo="Acciones del formulario" data-nota="Botones secundarios con ícono (mg-btn--secondary mg-btn--sm)"><button class="mg-btn mg-btn--secondary mg-btn--sm" type="button">{ic("editar", 14)} Editar formulario</button><button class="mg-btn mg-btn--secondary mg-btn--sm" type="button">{ic("tareas", 14)} Editar preguntas</button><button class="mg-btn mg-btn--secondary mg-btn--sm" type="button">{ic("ojo", 14)} Probar formulario</button><button class="mg-btn mg-btn--secondary mg-btn--sm" type="button">{ic("mensaje", 14)} Ver respuestas</button><button class="mg-btn mg-btn--secondary mg-btn--sm" type="button">{ic("enlace", 14)} Compartir</button></div>
      <section class="mg-panel" data-demo="Pestañas subrayadas y estado vacío" data-nota="mg-utabs + interruptor nativo role=switch + mg-empty">
        <div class="mg-utabs" role="tablist" aria-label="Detalle"><button role="tab" aria-selected="false" data-t="info">Información</button><button role="tab" aria-selected="true" data-t="resp">Respuestas</button></div>
        <div data-p="resp" style="padding-top:1.25rem"><h3 style="margin:0;font:700 .95rem var(--mg-font-display)">Respuestas del formulario</h3><p style="margin:.2rem 0 1rem;font-size:.8rem;color:var(--mg-text-muted)">Personas que han respondido, más recientes primero.</p>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap"><label style="display:inline-flex;align-items:center;font-size:.82rem;font-weight:500;color:var(--mg-gray-700)"><input type="checkbox" role="switch"> Incluir registro de prueba</label><span style="display:flex;align-items:center;gap:.6rem;font-size:.75rem;color:#C4002F">Las filas de prueba no cuentan como respuestas oficiales <button class="mg-btn mg-btn--sm" type="button" style="--_bg:#FDE7ED;--_fg:#C4002F;background:#FDE7ED;color:#C4002F;box-shadow:none">{ic("eliminar", 13)} Limpiar pruebas</button></span></div>
          <div class="mg-empty"><span class="ic">{ic("tareas", 22)}</span><h3>Aún no hay respuestas</h3><p>Cuando alguien responda este formulario, aparecerá aquí.</p></div></div>
        <div data-p="info" hidden style="padding-top:1.25rem"><div class="mg-banner" role="img" aria-label="Imagen de la convocatoria (1111 × 750)">BANNER 1111×750</div><h3 style="margin:1rem 0 .25rem;font:800 1.05rem var(--mg-font-display);color:var(--mg-primary)">Obreros Santa Marta</h3><p style="margin:0;color:var(--mg-text-muted);font-size:.85rem">Cobertura municipal · <span class="mg-chip mg-chip--azul">Santa Marta</span></p></div>
      </section>
      <section class="mg-panel" style="display:grid;grid-template-columns:minmax(0,1fr) 15rem;gap:1.25rem;align-items:start" class="dos" data-demo="Formulario con pasos laterales" data-nota="Formulario a la izquierda y lista de pasos (gob-pasos vertical) a la derecha">
        <div><div class="mg-panel__head">{ic("usuario", 20)}<div><h2>Información personal</h2><small>Datos básicos que te identifican</small></div></div><div class="mg-fgrid"><div class="full"><label class="mg-lab" for="nm">Nombres<span class="req">*</span></label><input id="nm"></div><div class="full"><label class="mg-lab" for="ap">Apellidos<span class="req">*</span></label><input id="ap"></div></div></div>
        <div><div class="mg-panel__head">{ic("tareas", 20)}<div><h2>Pasos</h2><small>Orden y selección del formulario</small></div></div><gob-pasos vertical pasos='[{{"titulo":"Datos personales","descripcion":"5 campos"}},{{"titulo":"Contacto","descripcion":"2 campos"}},{{"titulo":"Lugar de residencia","descripcion":"1 campo"}}]' actual="0"></gob-pasos></div>
      </section>'''

DETALLE_JS = '''  document.querySelectorAll('.mg-utabs button').forEach((b, _, all) => b.addEventListener('click', () => { all.forEach((x) => { const on = x === b; x.setAttribute('aria-selected', on); document.querySelector('[data-p="' + x.dataset.t + '"]').hidden = !on; }); }));
  $('nueva').addEventListener('click', () => gob.toast({ tipo: 'info', titulo: 'Crear', mensaje: 'Aquí abre el asistente de creación.' }));'''

# ------------------------------------------------------------------ CONFIGURACIÓN
CONFIG = f'''      <div class="mg-page"><div><span class="mg-pill">Cuenta</span><h1>Configuración</h1><p>Administra tu cuenta y tus preferencias de notificación.</p></div></div>
      <section class="mg-panel" data-demo="Datos de la cuenta" data-nota="Avatar + correo no editable + nombre y botón guardar"><div class="mg-panel__head">{ic("usuario", 20)}<div><h2>Datos de la cuenta</h2></div></div>
        <div style="display:flex;align-items:center;gap:.9rem;padding-bottom:1rem;border-bottom:1px solid #F1F4F8;margin-bottom:1rem"><gob-avatar nombre="José Caballero" tam="46"></gob-avatar><div><b style="font-size:.9rem">jcaballero@pruebas.local</b><small style="display:block;color:var(--mg-text-muted);font-size:.78rem">Correo electrónico (no editable)</small></div></div>
        <form class="mg-fgrid" style="grid-template-columns:minmax(0,1fr) auto;align-items:end" id="f1"><div><label class="mg-lab" for="nom">Nombre completo</label><input id="nom" value="José Caballero"></div><button class="mg-btn mg-btn--sm" type="submit">{ic("check", 14)} Guardar cambios</button></form></section>
      <section class="mg-panel" data-demo="Cambiar contraseña" data-nota="Tres campos en fila, validación accesible y mensaje de error"><div class="mg-panel__head">{ic("candado", 20)}<div><h2>Cambiar contraseña</h2></div></div>
        <form id="f2" novalidate><div class="mg-fgrid" style="grid-template-columns:repeat(3,minmax(0,1fr))" id="g3"><div><label class="mg-lab" for="a">Contraseña actual</label><input id="a" type="password" autocomplete="current-password"></div><div><label class="mg-lab" for="n1">Nueva contraseña</label><input id="n1" type="password" autocomplete="new-password"></div><div><label class="mg-lab" for="n2">Confirmar contraseña</label><input id="n2" type="password" autocomplete="new-password"></div></div>
          <p id="err" role="alert" hidden style="color:#C4002F;font-size:.8rem;font-weight:600;margin:.6rem 0 0"></p><div class="mg-formfoot" style="justify-content:flex-start"><button class="mg-btn mg-btn--sm" type="submit">{ic("llave", 14)} Actualizar contraseña</button></div></form></section>
      <section class="mg-panel" data-demo="Diálogo «Sin permisos»" data-nota="gob-modal tipo peligro: el botón de aceptar usa el azul de marca (no el naranja)"><div class="mg-panel__head">{ic("escudo", 20)}<div><h2>Diálogos de estado</h2><small>Así se ve el aviso cuando una acción no está permitida</small></div></div>
        <button class="mg-btn mg-btn--secondary mg-btn--sm" type="button" id="perm">Probar «Sin permisos»</button></section>
      <gob-modal id="mPerm" titulo="Sin permisos" tipo="peligro" tam="sm"><p style="margin:0;color:var(--mg-gray-600)">No tienes permisos para realizar esta acción.</p><button slot="pie" class="mg-btn mg-btn--block" type="button" onclick="document.getElementById('mPerm').cerrar()">Aceptar</button></gob-modal>
      <style>@media (max-width: 760px) {{ #g3 {{ grid-template-columns: 1fr !important; }} #f1 {{ grid-template-columns: 1fr !important; }} }}</style>'''

CONFIG_JS = '''  $('f1').addEventListener('submit', (e) => { e.preventDefault(); gob.toast({ tipo: 'exito', titulo: 'Datos guardados' }); });
  $('f2').addEventListener('submit', (e) => { e.preventDefault(); const m = $('err'); const msg = !$('a').value ? 'Escriba su contraseña actual.' : $('n1').value.length < 10 ? 'La nueva contraseña debe tener al menos 10 caracteres.' : $('n1').value !== $('n2').value ? 'Las contraseñas no coinciden.' : '';
    m.textContent = msg; m.hidden = !msg; if (!msg) { gob.toast({ tipo: 'exito', titulo: 'Contraseña actualizada' }); e.target.reset(); } });
  $('perm').addEventListener('click', () => $('mPerm').abrir());'''

# ------------------------------------------------------------------ CREAR CUENTA (pública)
CREAR = '''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Crea tu cuenta · Demo Gobernación del Magdalena</title>
<link rel="icon" href="../assets/favicon/favicon.ico">
<link rel="stylesheet" href="../cdn/v1/gob.css">
<script type="module" src="../cdn/v1/gob.js"></script>
<style>body { margin: 0; background: #F6F7FA; font-family: var(--mg-font-sans); } .wrap { max-width: 44rem; margin: 0 auto; padding: 2rem 1rem 3rem; }
  .logos { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; } .logos img { height: 48px; } .logos b { font: 800 1.4rem var(--mg-font-display); color: var(--mg-primary); padding-left: 1rem; border-left: 2px solid var(--mg-yellow); }
  h1 { text-align: center; margin: 0; font: 800 1.9rem var(--mg-font-display); color: var(--mg-primary); letter-spacing: -.02em; } .lead { text-align: center; color: var(--mg-gray-600); font-size: .9rem; margin: .4rem 0 1.5rem; } .help { font-size: .76rem; color: var(--mg-text-muted); margin: .5rem 0 0; }</style>
</head>
<body>
<!--DEMO-ONLY--><div style="background:#081A2C;color:#C9D4E3;font:600 .78rem Montserrat,system-ui,sans-serif;padding:.5rem 1rem;text-align:center"><a href="index.html" style="color:#fff;text-decoration:underline">‹ Todos los demos</a> · Registro público de ciudadanos (formulario largo de una columna doble)</div><!--/DEMO-ONLY-->
<main class="wrap" id="contenido">
  <div class="mg-panel" style="padding:2rem" data-demo="Tarjeta de registro público" data-nota="Dos logos + título + formulario de dos columnas (mg-fgrid) + botón de ancho completo">
    <div class="logos"><img src="../assets/logos/svg/logo-horizontal-color.svg" alt="Gobernación del Magdalena"><b>Convocatorias</b></div>
    <h1>Crea tu cuenta</h1><p class="lead">Datos básicos para identificarse.<br>(El proceso toma menos de dos minutos)</p>
    <form id="f" class="mg-forms" novalidate>
      <div class="mg-fgrid">
        <div><label class="mg-lab" for="td">Tipo de documento<span class="req">*</span></label><select id="td"><option>Cédula de ciudadanía</option><option>Cédula de extranjería</option><option>Pasaporte</option></select></div>
        <div><label class="mg-lab" for="nd">Número de documento<span class="req">*</span></label><input id="nd" inputmode="numeric" autocomplete="off"></div>
        <div><label class="mg-lab" for="no">Nombres<span class="req">*</span></label><input id="no" autocomplete="given-name"></div>
        <div><label class="mg-lab" for="ap">Apellidos<span class="req">*</span></label><input id="ap" autocomplete="family-name"></div>
        <div><label class="mg-lab" for="fn">Fecha de nacimiento<span class="req">*</span></label><input id="fn" type="date"></div>
        <div><label class="mg-lab" for="ge">Género<span class="req">*</span></label><select id="ge"><option value="">Seleccione…</option><option>Femenino</option><option>Masculino</option><option>Otro</option></select></div>
        <div><label class="mg-lab" for="co">Correo electrónico<span class="req">*</span></label><input id="co" type="email" autocomplete="email"></div>
        <div><label class="mg-lab" for="te">Teléfono<span class="req">*</span></label><input id="te" type="tel" autocomplete="tel"></div>
        <div><label class="mg-lab" for="c1">Crear una clave<span class="req">*</span></label><input id="c1" type="password" autocomplete="new-password"></div>
        <div><label class="mg-lab" for="c2">Repite tu clave<span class="req">*</span></label><input id="c2" type="password" autocomplete="new-password"></div>
      </div>
      <p class="help">Mínimo 6 letras o números, ejemplo: Profe2024</p>
      <p id="err" role="alert" hidden style="color:#C4002F;font-size:.82rem;font-weight:600;margin:.75rem 0 0"></p>
      <button class="mg-btn mg-btn--block" style="margin-top:1.25rem" type="submit">Crear cuenta</button>
    </form>
  </div>
</main>
<script type="module">
  const $ = (id) => document.getElementById(id);
  $('f').addEventListener('submit', (e) => { e.preventDefault();
    const faltan = ['nd', 'no', 'ap', 'fn', 'ge', 'co', 'te', 'c1', 'c2'].filter((i) => !$(i).value.trim());
    const msg = faltan.length ? 'Complete los campos obligatorios (*).' : $('c1').value.length < 6 ? 'La clave debe tener al menos 6 caracteres.' : $('c1').value !== $('c2').value ? 'Las claves no coinciden.' : '';
    $('err').textContent = msg; $('err').hidden = !msg; faltan.forEach((i) => $(i).setAttribute('aria-invalid', 'true')); if (!msg) { gob.toast({ tipo: 'exito', titulo: 'Cuenta creada', mensaje: 'En producción redirige al inicio de sesión.' }); } });
</script>
<!--DEMO-ONLY--><script type="module" src="demo-kit.js"></script><!--/DEMO-ONLY-->
</body>
</html>
'''


def build(root):
    d = os.path.join(root, 'demos')
    pages = {
        'panel-inicio.html': shell('panel-inicio.html', 'Inicio del panel', 'Inicio: progreso del perfil, accesos rápidos y estado vacío', INICIO),
        'panel-perfil.html': shell('panel-perfil.html', 'Mi perfil profesional', 'Secciones con estado + formulario por sección', PERFIL, PERFIL_JS),
        'panel-listado.html': shell('panel-listado.html', 'Listados', 'Tarjetas con filtros, tabla de usuarios con paginación y ubicaciones', LISTADO, LISTADO_JS),
        'panel-detalle.html': shell('panel-detalle.html', 'Detalle del formulario', 'Cabecera con acciones, pestañas, banner y pasos', DETALLE, DETALLE_JS),
        'panel-configuracion.html': shell('panel-configuracion.html', 'Configuración', 'Cuenta, cambio de contraseña y diálogo «Sin permisos»', CONFIG, CONFIG_JS),
        'crear-cuenta.html': CREAR,
    }
    for n, h in pages.items():
        with open(os.path.join(d, n), 'w', encoding='utf-8', newline='\n') as f:
            f.write(h)
    return list(pages)
