"""demos/index.html: catálogo de demos agrupado, con la guía de cómo usar el login y todos los casos de acceso."""
from site_mapa import tabla


def card(h, t, d):
    return f'<a class="k" href="{h}"><h3>{t}</h3><p>{d}</p></a>'


def hub(root, page, code):
    acceso = [
        ('login.html', 'Iniciar sesión', 'Google + correo y contraseña, mostrar/ocultar clave, error genérico, bloqueo tras 3 intentos y estado de carga.'),
        ('recuperar-clave.html', 'Recuperar contraseña', 'Correo → «revisa tu correo» con reenvío temporizado. No revela si la cuenta existe.'),
        ('restablecer-clave.html', 'Nueva contraseña', 'Pantalla del enlace del correo: medidor de fortaleza, requisitos en vivo y confirmación.'),
        ('verificacion-2fa.html', 'Verificación en dos pasos', 'Código de 6 dígitos con autoavance, pegado y reenvío (código de prueba 123456).'),
        ('registro.html', 'Crear cuenta', 'Solicitud de acceso en dos columnas: documento, dependencia, contraseña y política de datos.'),
        ('estados-acceso.html', 'Estados de acceso', 'Sesión expirada, cuenta bloqueada, sin permiso y mantenimiento.'),
    ]
    apps = [
        ('panel-ejecutivo.html', 'Panel ejecutivo', 'Dashboard declarativo (KPI, gráficas, mapa), tabla y alertas en pestañas.'),
        ('gestion-tramites.html', 'Gestión de trámites', 'CRUD: tabla con selección y acciones, modales con validación, detalle y confirmaciones.'),
        ('analitica-territorial.html', 'Analítica territorial', 'Mapa coroplético, ranking, marcadores con efectos y rutas animadas.'),
        ('mesa-ayuda.html', 'Mesa de ayuda', 'Tickets en kanban y lista, alta por pasos, detalle con línea de tiempo y centro de ayuda.'),
        ('portal-ciudadano.html', 'Portal ciudadano', 'Página pública: hero, servicios, cifras, mapa con modal, FAQ, noticias y pie.'),
        ('acceso-formularios.html', 'Acceso y formularios (versión con pestañas)', 'Ingreso/registro en pestañas y PQRS por pasos con gob-pasos.'),
        ('ui-componentes.html', 'Catálogo de UI', 'Acordeones, pestañas (línea, píldora, segmentado, vertical), formularios con etiqueta flotante, pasos y línea de tiempo.'),
        ('plantilla-base.html', 'Plantilla base', 'Mínimo comentado paso a paso, con todas las dependencias.'),
    ]
    panel = [
        ('panel-inicio.html', 'Panel · Inicio', 'Progreso del perfil, accesos rápidos de colores y estado vacío.'),
        ('panel-perfil.html', 'Panel · Mi perfil', 'Lista de secciones con check + formulario por sección, documentos y vacíos.'),
        ('panel-listado.html', 'Panel · Listados', 'Filtros, tarjetas de convocatoria (favorita, chips, estado), tabla de usuarios con paginación y ubicaciones.'),
        ('panel-detalle.html', 'Panel · Detalle de formulario', 'Cabecera con acciones, pestañas subrayadas, interruptor, banner y pasos laterales.'),
        ('panel-configuracion.html', 'Panel · Configuración', 'Datos de cuenta, cambio de contraseña y diálogo «Sin permisos».'),
        ('crear-cuenta.html', 'Registro público (Crea tu cuenta)', 'Tarjeta con dos logos y formulario de dos columnas.'),
    ]
    sol = [
        ('sol-registrar.html', 'Solicitudes · Registrar', 'Formulario de recepción con ayudas bajo cada campo y asignación del responsable con tarjetas de carga.'),
        ('sol-consultar.html', 'Solicitudes · Consultar', 'Filtros avanzados con etiqueta, conteo de resultados y tabla con códigos, estados y plazos.'),
        ('sol-recepcion.html', 'Solicitudes · Dashboard de recepción', 'Tarjetas KPI (ícono, título, número y chip) y lista por clasificar.'),
        ('sol-entregas.html', 'Solicitudes · Entregar respuestas', 'Pestañas con contador, búsqueda y estados vacíos «Al día».'),
        ('sol-bitacora.html', 'Solicitudes · Bitácora', 'Lista de casos seleccionables y detalle con línea de eventos.'),
        ('sol-control.html', 'Solicitudes · Dashboard de control', 'KPI con semáforo y tabla de efectividad por responsable.'),
        ('admin-usuarios.html', 'Administración · Usuarios', 'Usuarios con avatar, rol con ícono, estado y paginación.'),
        ('admin-roles.html', 'Administración · Roles y permisos', 'Matriz de permisos por rol, agrupada por módulo.'),
    ]
    cs = ''.join(card(*x) for x in sol)
    cp = ''.join(card(*x) for x in panel)
    ca = ''.join(card(*x) for x in acceso)
    cb = ''.join(card(*x) for x in apps)

    esqueleto = code('html', """<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@v0.6.1/cdn/v1/gob.css">

<div class="mg-auth">
  <main class="mg-auth__main">
    <aside class="mg-auth__brand">                                   <!-- Panel de marca (se oculta la descripción en móvil) -->
      <img class="mg-auth__logo" src="logo-horizontal-color.svg" alt="Gobernación del Magdalena">
      <h2 class="mg-auth__name">SIGA</h2>                          <!-- nombre corto de su sistema -->
      <p class="mg-auth__tag">Sistema Integrado de Gestión Administrativa</p>
      <div class="mg-auth__rule"></div>
      <p class="mg-auth__desc">Descripción corta del sistema.</p>
    </aside>

    <section class="mg-auth__card">                                  <!-- la línea de color la pone el ::before -->
      <div class="mg-auth__badge"><svg>…ícono usuario…</svg></div>
      <h1 class="mg-auth__title">Iniciar sesión</h1>
      <p class="mg-auth__sub">Ingresa con tu cuenta institucional</p>

      <button type="button" class="mg-social"><svg>…G…</svg> Ingresar con Google</button>
      <div class="mg-auth__sep">o con correo y contraseña</div>

      <form class="mg-auth__form" novalidate>
        <div class="mg-auth__msg mg-auth__msg--error" role="alert" hidden></div>   <!-- error general -->
        <div>
          <div class="mg-fl" id="w-mail">                            <!-- etiqueta flotante: placeholder=" " obligatorio -->
            <input id="mail" type="email" placeholder=" " autocomplete="username">
            <label for="mail">Correo electrónico</label>
          </div>
          <p class="mg-fl-msg is-error" id="e-mail" role="alert" hidden></p>
        </div>
        <div>
          <div class="mg-fl" id="w-pw">
            <input id="pw" type="password" class="has-eye" placeholder=" " autocomplete="current-password">
            <label for="pw">Contraseña</label>
            <button type="button" class="mg-fl__eye" aria-label="Mostrar contraseña" aria-pressed="false"><svg>…ojo…</svg></button>
          </div>
          <p class="mg-fl-msg is-error" id="e-pw" role="alert" hidden></p>
        </div>
        <div class="mg-auth__row"><label><input type="checkbox" class="mg-check"> Mantener la sesión</label><a href="/recuperar">¿Olvidaste tu contraseña?</a></div>
        <button class="mg-btn mg-btn--lg mg-btn--block">Ingresar al sistema</button>   <!-- + clase is-loading mientras espera -->
      </form>
    </section>
  </main>
  <footer class="mg-auth__foot"><span>Gobernación del Magdalena · República de Colombia</span><span>© 2026 Todos los derechos reservados</span></footer>
</div>""", 'Esqueleto del login (HTML + CSS)')

    conectar = code('ts', """// Mapa de respuestas del servidor → estado de la interfaz (use los mismos textos genéricos en todo el sistema)
async function ingresar(correo: string, clave: string) {
  const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ correo, clave }) });
  if (r.ok) {
    const { requiere2fa } = await r.json();
    return location.href = requiere2fa ? '/verificacion-2fa' : '/panel';          // 200 → panel (o paso 2)
  }
  switch (r.status) {
    case 401: return mostrar('error', 'Correo o contraseña incorrectos.');         // genérico: no diga cuál falló
    case 423: return location.href = '/acceso/bloqueada';                           // cuenta bloqueada → estados-acceso (Bloqueada)
    case 429: return mostrar('warn', 'Demasiados intentos. Espere unos minutos.');  // límite de tasa
    case 403: return location.href = '/acceso/sin-permiso';                         // sin permiso
    case 503: return location.href = '/acceso/mantenimiento';                       // mantenimiento
    default:  return mostrar('error', 'No pudimos procesar la solicitud. Intente de nuevo.');
  }
}
// mostrar(tipo, texto): asigne texto a .mg-auth__msg, cambie la clase mg-auth__msg--<tipo> y quite [hidden].""", 'Conectar con su backend')

    casos = tabla(['Caso', 'Página', 'Cuándo se muestra', 'Respuesta del servidor'], [
        ('Ingreso', '<a href="login.html">login.html</a>', 'Entrada al sistema', '200 / 401 / 423 / 429'),
        ('Olvidó su contraseña', '<a href="recuperar-clave.html">recuperar-clave.html</a>', 'Enlace «¿Olvidaste tu contraseña?»', '200 siempre (no revela si existe)'),
        ('Nueva contraseña', '<a href="restablecer-clave.html">restablecer-clave.html</a>', 'Enlace del correo con token (30 min)', '200 / 400 token vencido'),
        ('Segundo factor', '<a href="verificacion-2fa.html">verificacion-2fa.html</a>', 'Después de la clave, si el usuario tiene 2FA', '200 / 401 código inválido'),
        ('Registro', '<a href="registro.html">registro.html</a>', 'Solicitud de cuenta (aprobación manual)', '201 / 409 ya existe'),
        ('Sesión expirada', '<a href="estados-acceso.html">estados-acceso.html</a> (Expirada)', 'Token vencido o inactividad', '401 en cualquier llamada'),
        ('Cuenta bloqueada', 'idem (Bloqueada)', 'Intentos fallidos o desactivada', '423'),
        ('Sin permiso', 'idem (Sin permiso)', 'Rol sin acceso al módulo', '403'),
        ('Mantenimiento', 'idem (Mantenimiento)', 'Ventana de despliegue', '503')])
    clases = tabla(['Clase', 'Para qué'], [
        ('<code>mg-auth</code>', 'Página completa: dos columnas (marca | tarjeta), pie y adaptación a móvil.'),
        ('<code>mg-auth__brand</code> · <code>__logo</code> · <code>__name</code> · <code>__tag</code> · <code>__rule</code> · <code>__desc</code>', 'Panel de marca: logo, nombre del sistema en grande, lema, línea amarilla y descripción.'),
        ('<code>mg-auth__card</code> · <code>__badge</code> · <code>__title</code> · <code>__sub</code>', 'Tarjeta con «la línea» arriba, insignia circular con ícono, título y subtítulo.'),
        ('<code>mg-social</code>', 'Botón de acceso con proveedor (Google, Microsoft…).'),
        ('<code>mg-fl</code> · <code>mg-fl__eye</code> · <code>mg-fl-msg</code>', 'Campo con etiqueta flotante, botón mostrar/ocultar y mensaje de ayuda/error. Estados: <code>is-invalid</code>, <code>is-valid</code>.'),
        ('<code>mg-auth__msg--error|ok|info|warn</code>', 'Mensaje general del formulario (usar <code>role="alert"</code>).'),
        ('<code>mg-auth__icon-big--ok|err|warn|info</code>', 'Ícono grande de confirmación/estado (éxito, error, aviso).'),
        ('<code>mg-otp</code> · <code>mg-fuerza</code> · <code>mg-reqs</code>', 'Código de 6 dígitos; medidor de fortaleza y lista de requisitos de contraseña.'),
        ('<code>mg-btn.is-loading</code>', 'Botón con indicador de carga (evita doble envío).')])
    seg = '''<ul style="line-height:1.9;color:var(--mg-gray-700)"><li><b>Mensajes genéricos</b>: «correo o contraseña incorrectos» y, en recuperación, la misma respuesta exista o no la cuenta (evita enumerar usuarios).</li>
<li><b>Autocompletado correcto</b>: <code>autocomplete="username"</code>, <code>current-password</code>, <code>new-password</code>, <code>one-time-code</code> para que los gestores de contraseñas funcionen.</li>
<li><b>Límite de intentos y bloqueo</b> siempre en el <b>servidor</b>; la interfaz solo lo refleja (los demos lo simulan en el cliente).</li>
<li><b>Tokens y códigos</b>: enlace de restablecimiento de un solo uso y corta vida (30 min); OTP de 5–10 min; HTTPS y cookies <code>HttpOnly; Secure; SameSite</code>.</li>
<li><b>Accesibilidad</b>: etiquetas visibles, <code>role="alert"</code> en errores, foco al primer campo con error, botón de ojo con <code>aria-pressed</code>. Probado con axe (WCAG 2.1 AA).</li>
<li><b>Datos de prueba</b> de los demos: <code>demo@magdalena.gov.co</code> / <code>Demo1234</code> (login) y <code>123456</code> (2FA). Son ficticios y solo existen en el navegador.</li></ul>'''
    body = f'''<p class="pt-lead">Plantillas completas hechas con los componentes <code class="inline">gob-*</code> y las clases <code class="inline">mg-*</code> (sin AdminLTE ni Bootstrap). En cada demo active <b>«Guías de código»</b> para ver y copiar cada sección, o copie la página entera. Los datos son ficticios.</p>
<section class="pt-section" id="como"><h2><span class="n">01.</span> Cómo usar un demo</h2>
<ol style="line-height:1.9;color:var(--mg-gray-700)"><li>Abra el demo y pulse <b>‹/› Guías de código</b> (abajo a la derecha): cada sección se enmarca con su nombre y un botón <b>Copiar sección</b>.</li><li>O use <b>⧉ Copiar página</b> / <b>⬇ .html</b>: las rutas se vuelven absolutas y funciona pegado en cualquier sitio.</li><li>Todo requiere solo <code>gob.css</code> (y <code>gob.js</code> si usa componentes <code>gob-*</code> o toasts). Sin internet: <a href="../dist/downloads/gob-cdn-v1.zip">gob-cdn-v1.zip</a>.</li><li>En Angular/React/Next use el mismo HTML dentro de su plantilla (ver <a href="../componentes/frameworks.html">frameworks</a>): las clases no dependen del framework.</li></ol></section>
<section class="pt-section" id="acceso"><h2><span class="n">02.</span> Acceso: login y todos sus casos</h2>
<p class="pt-lead">Así deben verse <b>todos los accesos</b> de los sistemas de la Gobernación: panel de marca a la izquierda (logo, nombre del sistema, lema y descripción) y tarjeta con «la línea» a la derecha, con inicio con Google y con correo/contraseña. Cámbiele solo el nombre, el lema y la descripción.</p>
<div class="cards-k">{ca}</div>
<h3 style="margin-top:2rem">Qué caso usar</h3>{casos}
<h3 style="margin-top:2rem">Esqueleto del login (copiar y pegar)</h3>{esqueleto}
<h3 style="margin-top:2rem">Clases del módulo de acceso</h3>{clases}
<h3 style="margin-top:2rem">Conectarlo con el backend</h3>{conectar}
<h3 style="margin-top:2rem">Seguridad y buenas prácticas</h3>{seg}</section>
<section class="pt-section" id="panel"><h2><span class="n">03.</span> Panel de gestión (diseño «Convocatorias»)</h2><p class="pt-lead">Estructura de las aplicaciones internas según el diseño del equipo: barra superior con «la línea», <b>menú lateral claro y fijo (sticky)</b>, píldora de sección, títulos en azul, tarjetas suaves, filtros, tablas con estados y diálogos. Tipografía Montserrat en todo.</p><div class="cards-k">{cp}</div></section>
<section class="pt-section" id="solicitudes"><h2><span class="n">04.</span> Sistemas de solicitudes y administración</h2><p class="pt-lead">Pantallas de trabajo de los sistemas de seguimiento: recepción, consulta, dashboards con KPI, bitácora, usuarios y matriz de roles. Mismo marco que el panel (menú lateral sticky con grupos y tarjeta de perfil).</p><div class="cards-k">{cs}</div></section>
<section class="pt-section" id="apps"><h2><span class="n">05.</span> Otras aplicaciones y catálogo de UI</h2><div class="cards-k">{cb}</div></section>'''
    page(root, 'demos/index.html', 'Demos y plantillas', 'Páginas completas para copiar: login y casos de acceso, panel, trámites, territorio, mesa de ayuda, portal y catálogo de UI.', body)
