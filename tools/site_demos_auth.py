"""Demos de ACCESO (login y casos): login, recuperar clave, restablecer, verificación en 2 pasos, registro, estados de acceso,
y la página de catálogo de UI (acordeones, pestañas, formularios). Sin AdminLTE/Bootstrap: solo gob.css (+ gob.js para toasts)."""
import os

SVG = {
    'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    'key': '<path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
    'lock': '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    'shield': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    'mail': '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    'userplus': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
    'eye': '<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>',
    'check': '<path d="M20 6 9 17l-5-5"/>',
    'alert': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
    'clock': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    'ban': '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
    'wrench': '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',
    'door': '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>',
    'back': '<path d="m12 19-7-7 7-7M19 12H5"/>',
}


def ico(n, cls=''):
    return f'<svg {("class=" + chr(34) + cls + chr(34) + " ") if cls else ""}viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{SVG[n]}</svg>'


GOOGLE = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>'

HEAD = '''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%TITULO% · Demo Gobernación del Magdalena</title>
<link rel="icon" href="../assets/favicon/favicon.ico">
<!-- ① DEPENDENCIAS: gob.css (estilos mg-auth, mg-fl, mg-social…) y gob.js (solo para toasts; opcional en un login puro) -->
<link rel="stylesheet" href="../cdn/v1/gob.css">
<script type="module" src="../cdn/v1/gob.js"></script>
%EXTRA_HEAD%</head>
'''

TIRA = '''<!--DEMO-ONLY-->
<div style="background:#081A2C;color:#C9D4E3;font:600 .78rem Montserrat,system-ui,sans-serif;padding:.55rem 1rem;display:flex;gap:.5rem 1.25rem;flex-wrap:wrap;align-items:center;justify-content:center;position:relative;z-index:5">
  <a href="index.html" style="color:#fff;text-decoration:none">‹ Todos los demos</a><span>%NOTA%</span>%CRED%
</div>
<!--/DEMO-ONLY-->'''

BRAND = '''<aside class="mg-auth__brand" data-demo="Panel de marca" data-nota="Logo oficial + nombre del sistema + descripción (cámbielos por los de su aplicación)">
        <img class="mg-auth__logo" src="../assets/logos/svg/logo-horizontal-color.svg" alt="Gobernación del Magdalena">
        <h2 class="mg-auth__name">SIGA</h2>
        <p class="mg-auth__tag">Sistema Integrado de Gestión Administrativa</p>
        <div class="mg-auth__rule" aria-hidden="true"></div>
        <p class="mg-auth__desc">Sistema institucional para la gestión segura de los procesos y trámites de la Gobernación del Magdalena.</p>
      </aside>'''

FOOT = '''<footer class="mg-auth__foot"><span>Gobernación del Magdalena · República de Colombia</span><span>© 2026 Todos los derechos reservados</span></footer>'''

JS_COMUN = '''  const $ = (id) => document.getElementById(id);
  // Mostrar/ocultar contraseña (botón con aria-pressed)
  document.querySelectorAll('[data-eye]').forEach((b) => b.addEventListener('click', () => {
    const i = $(b.dataset.eye), ver = i.type === 'password'; i.type = ver ? 'text' : 'password';
    b.setAttribute('aria-pressed', ver); b.setAttribute('aria-label', ver ? 'Ocultar contraseña' : 'Mostrar contraseña');
  }));
  // Marca un campo con error (o lo limpia): error('mail', 'Escriba un correo válido')
  function error(id, msg) { const w = $('w-' + id), m = $('e-' + id), i = $(id); w.classList.toggle('is-invalid', !!msg); i.setAttribute('aria-invalid', !!msg); if (m) { m.textContent = msg || ''; m.hidden = !msg; } return !msg; }
  const esMail = (v) => /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(v);
  // Estado de carga del botón principal
  function cargando(btn, on) { btn.classList.toggle('is-loading', on); btn.disabled = on; }
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));'''


def campo(id, etiqueta, tipo='text', auto='off', extra='', ojo=False, msg=True):
    eye = f'<button type="button" class="mg-fl__eye" data-eye="{id}" aria-label="Mostrar contraseña" aria-pressed="false">{ico("eye")}</button>' if ojo else ''
    m = f'<p class="mg-fl-msg is-error" id="e-{id}" role="alert" hidden></p>' if msg else ''
    return f'<div><div class="mg-fl" id="w-{id}"><input id="{id}" name="{id}" type="{tipo}" placeholder=" " autocomplete="{auto}" {"class=" + chr(34) + "has-eye" + chr(34) if ojo else ""} {extra} aria-describedby="e-{id}"><label for="{id}">{etiqueta}</label>{eye}</div>{m}</div>'


def pagina(archivo, titulo, nota, tarjeta, script, cred='', ancho='', extra_head=''):
    tira = TIRA.replace('%NOTA%', nota).replace('%CRED%', cred)
    return (HEAD.replace('%TITULO%', titulo).replace('%EXTRA_HEAD%', extra_head) + f'''<body style="margin:0">
{tira}
<div class="mg-auth">
  <main class="mg-auth__main" id="contenido">
    {BRAND}
    <section class="mg-auth__card" {ancho} data-demo="Tarjeta de acceso: {titulo}" data-nota="Tarjeta con la línea de marca, insignia circular, título y formulario">
{tarjeta}
    </section>
  </main>
  {FOOT}
</div>
<script type="module">
{JS_COMUN}
{script}
</script>
<!--DEMO-ONLY--><script type="module" src="demo-kit.js"></script><!--/DEMO-ONLY-->
</body>
</html>
''')


# ------------------------------------------------------------------ 1 · LOGIN
LOGIN = f'''      <div class="mg-auth__badge">{ico("user")}</div>
      <h1 class="mg-auth__title">Iniciar sesión</h1>
      <p class="mg-auth__sub">Ingresa con tu cuenta institucional</p>
      <button type="button" class="mg-social" id="google">{GOOGLE} Ingresar con Google</button>
      <p class="mg-auth__hint">Use su cuenta de correo institucional.</p>
      <div class="mg-auth__sep">o con correo y contraseña</div>
      <form class="mg-auth__form" id="f" novalidate>
        <div class="mg-auth__msg mg-auth__msg--error" id="msg" role="alert" hidden></div>
        {campo("mail", "Correo electrónico", "email", "username", 'inputmode="email"')}
        {campo("pw", "Contraseña", "password", "current-password", "", True)}
        <div class="mg-auth__row"><label style="display:inline-flex;gap:.5rem;align-items:center;cursor:pointer"><input type="checkbox" class="mg-check" id="recordar"> Mantener la sesión</label><a href="recuperar-clave.html">¿Olvidaste tu contraseña?</a></div>
        <button class="mg-btn mg-btn--lg mg-btn--block" id="entrar">{ico("door")} Ingresar al sistema</button>
      </form>'''

LOGIN_JS = '''  let intentos = 0;
  const msg = (t, tipo = 'error') => { const m = $('msg'); m.className = 'mg-auth__msg mg-auth__msg--' + tipo; m.textContent = t; m.hidden = !t; };
  $('google').onclick = () => gob.toast({ tipo: 'info', titulo: 'Google', mensaje: 'Aquí inicia su flujo OAuth/OIDC (redirección a accounts.google.com).' });
  $('f').addEventListener('submit', async (e) => {
    e.preventDefault(); msg('');
    const okM = error('mail', esMail($('mail').value.trim()) ? '' : 'Escriba un correo válido'), okP = error('pw', $('pw').value ? '' : 'Escriba su contraseña');
    if (!okM || !okP) { (okM ? $('pw') : $('mail')).focus(); return; }
    cargando($('entrar'), true); await espera(900);                              // ← aquí va su llamada: await fetch('/api/auth/login', …)
    const bien = $('mail').value.trim().toLowerCase() === 'demo@magdalena.gov.co' && $('pw').value === 'Demo1234';
    cargando($('entrar'), false);
    if (bien) { msg('Ingreso correcto. Redirigiendo…', 'ok'); gob.toast({ tipo: 'exito', titulo: 'Bienvenido', mensaje: 'En producción redirige al panel.' }); return; }
    intentos++;
    if (intentos >= 3) { msg('Cuenta bloqueada temporalmente por intentos fallidos. Intente de nuevo en 15 minutos o recupere su contraseña.', 'warn'); $('entrar').disabled = true; return; }
    msg('Correo o contraseña incorrectos. Le quedan ' + (3 - intentos) + ' intento(s).');   // mensaje genérico: no revele cuál falló
    $('pw').value = ''; $('pw').focus();
  });'''

# ------------------------------------------------------------------ 2 · RECUPERAR
RECUPERAR = f'''      <div id="p1">
        <div class="mg-auth__badge">{ico("key")}</div>
        <h1 class="mg-auth__title">Recuperar contraseña</h1>
        <p class="mg-auth__sub">Te enviaremos un enlace para crear una nueva</p>
        <form class="mg-auth__form" id="f" novalidate>
          {campo("mail", "Correo institucional", "email", "username", 'inputmode="email"')}
          <button class="mg-btn mg-btn--lg mg-btn--block" id="enviar">Enviar enlace</button>
        </form>
        <a class="mg-auth__back" href="login.html">{ico("back")} Volver a iniciar sesión</a>
      </div>
      <div id="p2" hidden>
        <div class="mg-auth__icon-big mg-auth__icon-big--ok">{ico("mail")}</div>
        <h1 class="mg-auth__title">Revisa tu correo</h1>
        <p class="mg-auth__sub">Si <b id="dest"></b> está registrado, recibirás un enlace válido por 30 minutos.</p>
        <div class="mg-auth__msg mg-auth__msg--info" role="status">{ico("alert", "")}<span>¿No llega? Revisa la carpeta de spam. El enlace se envía solo si la cuenta existe.</span></div>
        <button class="mg-btn mg-btn--secondary mg-btn--block" id="reenviar" style="margin-top:1rem" disabled>Reenviar enlace (<span id="seg">60</span> s)</button>
        <a class="mg-auth__back" href="login.html">{ico("back")} Volver a iniciar sesión</a>
      </div>'''

RECUPERAR_JS = '''  let t;
  function cuenta() { let s = 60; $('reenviar').disabled = true; clearInterval(t); t = setInterval(() => { s--; $('reenviar').innerHTML = s > 0 ? 'Reenviar enlace (' + s + ' s)' : 'Reenviar enlace'; if (s <= 0) { clearInterval(t); $('reenviar').disabled = false; } }, 1000); }
  $('f').addEventListener('submit', async (e) => {
    e.preventDefault(); if (!error('mail', esMail($('mail').value.trim()) ? '' : 'Escriba un correo válido')) return $('mail').focus();
    cargando($('enviar'), true); await espera(900);                              // ← await fetch('/api/auth/recuperar', { method:'POST', body: … })
    cargando($('enviar'), false); $('dest').textContent = $('mail').value.trim(); $('p1').hidden = true; $('p2').hidden = false; cuenta();
  });
  $('reenviar').onclick = async () => { gob.toast({ tipo: 'exito', titulo: 'Enlace reenviado' }); cuenta(); };'''

# ------------------------------------------------------------------ 3 · RESTABLECER
RESTABLECER = f'''      <div id="p1">
        <div class="mg-auth__badge">{ico("lock")}</div>
        <h1 class="mg-auth__title">Nueva contraseña</h1>
        <p class="mg-auth__sub">Crea una contraseña segura para tu cuenta</p>
        <form class="mg-auth__form" id="f" novalidate>
          <div class="mg-auth__msg mg-auth__msg--error" id="msg" role="alert" hidden></div>
          <div>{campo("pw", "Nueva contraseña", "password", "new-password", "", True, False)}
            <div class="mg-fuerza" id="fuerza" data-n="0" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
            <ul class="mg-reqs" id="reqs" aria-label="Requisitos de la contraseña"><li data-r="len">Mínimo 10 caracteres</li><li data-r="may">Una mayúscula y una minúscula</li><li data-r="num">Un número</li><li data-r="esp">Un símbolo (!@#$…)</li></ul></div>
          {campo("pw2", "Confirmar contraseña", "password", "new-password", "", True)}
          <button class="mg-btn mg-btn--lg mg-btn--block" id="guardar">Guardar contraseña</button>
        </form>
      </div>
      <div id="p2" hidden>
        <div class="mg-auth__icon-big mg-auth__icon-big--ok">{ico("check")}</div>
        <h1 class="mg-auth__title">Contraseña actualizada</h1>
        <p class="mg-auth__sub">Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <a class="mg-btn mg-btn--lg mg-btn--block" href="login.html">Ir a iniciar sesión</a>
      </div>'''

RESTABLECER_JS = '''  const reglas = { len: (v) => v.length >= 10, may: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v), num: (v) => /\\d/.test(v), esp: (v) => /[^A-Za-z0-9]/.test(v) };
  function evaluar() {
    const v = $('pw').value; let n = 0;
    document.querySelectorAll('#reqs li').forEach((li) => { const ok = reglas[li.dataset.r](v); li.classList.toggle('ok', ok); if (ok) n++; });
    $('fuerza').dataset.n = v ? n : 0; return n === 4;
  }
  $('pw').addEventListener('input', evaluar);
  $('f').addEventListener('submit', async (e) => {
    e.preventDefault();
    const a = error('pw', evaluar() ? '' : ''), b = error('pw2', $('pw2').value === $('pw').value && $('pw2').value ? '' : 'Las contraseñas no coinciden');
    if (!evaluar()) { $('msg').className = 'mg-auth__msg mg-auth__msg--error'; $('msg').textContent = 'La contraseña no cumple todos los requisitos.'; $('msg').hidden = false; return $('pw').focus(); }
    $('msg').hidden = true; if (!b) return $('pw2').focus();
    cargando($('guardar'), true); await espera(900);                             // ← await fetch('/api/auth/restablecer', { body: { token, clave } })
    $('p1').hidden = true; $('p2').hidden = false;
  });'''

# ------------------------------------------------------------------ 4 · 2FA
DOSPASOS = f'''      <div class="mg-auth__badge">{ico("shield")}</div>
      <h1 class="mg-auth__title">Verificación en dos pasos</h1>
      <p class="mg-auth__sub">Ingresa el código de 6 dígitos enviado a <b>a•••@magdalena.gov.co</b></p>
      <form class="mg-auth__form" id="f" novalidate>
        <div class="mg-auth__msg mg-auth__msg--error" id="msg" role="alert" hidden></div>
        <div class="mg-otp" id="otp" role="group" aria-label="Código de verificación">
          <input inputmode="numeric" maxlength="1" autocomplete="one-time-code" aria-label="Dígito 1"><input inputmode="numeric" maxlength="1" aria-label="Dígito 2"><input inputmode="numeric" maxlength="1" aria-label="Dígito 3">
          <input inputmode="numeric" maxlength="1" aria-label="Dígito 4"><input inputmode="numeric" maxlength="1" aria-label="Dígito 5"><input inputmode="numeric" maxlength="1" aria-label="Dígito 6">
        </div>
        <button class="mg-btn mg-btn--lg mg-btn--block" id="verificar">Verificar</button>
      </form>
      <p class="mg-auth__hint" style="margin-top:1rem">¿No lo recibiste? <button type="button" id="reenviar" style="border:0;background:none;color:var(--mg-primary);font:700 .8rem var(--mg-font-sans);cursor:pointer;padding:0" disabled>Reenviar (<span id="seg">45</span> s)</button></p>
      <a class="mg-auth__back" href="login.html">{ico("back")} Volver a iniciar sesión</a>'''

DOSPASOS_JS = '''  const cajas = [...document.querySelectorAll('#otp input')];
  const codigo = () => cajas.map((c) => c.value).join('');
  cajas.forEach((c, i) => {
    c.addEventListener('input', () => { c.value = c.value.replace(/\\D/g, '').slice(-1); if (c.value && cajas[i + 1]) cajas[i + 1].focus(); if (codigo().length === 6) $('f').requestSubmit(); });
    c.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && !c.value && cajas[i - 1]) { cajas[i - 1].focus(); cajas[i - 1].value = ''; } if (e.key === 'ArrowLeft' && cajas[i - 1]) cajas[i - 1].focus(); if (e.key === 'ArrowRight' && cajas[i + 1]) cajas[i + 1].focus(); });
    c.addEventListener('paste', (e) => { const d = (e.clipboardData.getData('text') || '').replace(/\\D/g, '').slice(0, 6); if (!d) return; e.preventDefault(); d.split('').forEach((x, k) => (cajas[k].value = x)); cajas[Math.min(d.length, 5)].focus(); if (d.length === 6) $('f').requestSubmit(); });
  });
  let s = 45; const t = setInterval(() => { s--; $('reenviar').innerHTML = s > 0 ? 'Reenviar (' + s + ' s)' : 'Reenviar código'; if (s <= 0) { clearInterval(t); $('reenviar').disabled = false; } }, 1000);
  $('reenviar').onclick = () => { gob.toast({ tipo: 'exito', titulo: 'Código reenviado' }); cajas.forEach((c) => (c.value = '')); cajas[0].focus(); };
  $('f').addEventListener('submit', async (e) => {
    e.preventDefault(); const m = $('msg'); m.hidden = true; $('otp').classList.remove('is-invalid');
    if (codigo().length < 6) { m.textContent = 'Escriba los 6 dígitos del código.'; m.hidden = false; return; }
    cargando($('verificar'), true); await espera(800);                           // ← await fetch('/api/auth/2fa', { body: { codigo } })
    cargando($('verificar'), false);
    if (codigo() === '123456') return gob.toast({ tipo: 'exito', titulo: 'Verificado', mensaje: 'En producción redirige al panel.' });
    $('otp').classList.add('is-invalid'); m.textContent = 'Código incorrecto o vencido. Inténtelo de nuevo.'; m.hidden = false; cajas.forEach((c) => (c.value = '')); cajas[0].focus();
  });'''

# ------------------------------------------------------------------ 5 · REGISTRO
REGISTRO = f'''      <div id="p1">
        <div class="mg-auth__badge">{ico("userplus")}</div>
        <h1 class="mg-auth__title">Crear cuenta</h1>
        <p class="mg-auth__sub">Solicita acceso con tus datos institucionales</p>
        <form class="mg-auth__form" id="f" novalidate>
          <div class="mg-auth__msg mg-auth__msg--error" id="msg" role="alert" hidden></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem" class="dos">{campo("nom", "Nombres", "text", "given-name")}{campo("ape", "Apellidos", "text", "family-name")}</div>
          {campo("mail", "Correo institucional", "email", "email", 'inputmode="email"')}
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem" class="dos">
            <div><div class="mg-fl" id="w-tipo"><select id="tipo" name="tipo" autocomplete="off"><option>Cédula de ciudadanía</option><option>Cédula de extranjería</option><option>Pasaporte</option></select><label for="tipo">Tipo de documento</label></div></div>
            {campo("doc", "Número de documento", "text", "off", 'inputmode="numeric"')}
          </div>
          <div class="mg-fl" id="w-dep"><select id="dep" name="dep"><option value="">Seleccione…</option><option>Secretaría General</option><option>Hacienda</option><option>Salud</option><option>Educación</option><option>Planeación</option><option>Oficina TIC</option></select><label for="dep">Dependencia</label></div>
          <div>{campo("pw", "Contraseña", "password", "new-password", "", True, False)}<div class="mg-fuerza" id="fuerza" data-n="0" aria-hidden="true"><i></i><i></i><i></i><i></i></div><p class="mg-fl-msg is-error" id="e-pw" role="alert" hidden></p></div>
          <label style="display:flex;gap:.55rem;align-items:flex-start;font-size:.85rem;cursor:pointer"><input type="checkbox" class="mg-check" id="ok" style="margin-top:.2rem"> <span>Acepto la <a href="#" style="color:var(--mg-primary);font-weight:700">política de tratamiento de datos personales</a>.</span></label><p class="mg-fl-msg is-error" id="e-ok" role="alert" hidden></p>
          <button class="mg-btn mg-btn--lg mg-btn--block" id="crear">Solicitar acceso</button>
        </form>
        <p class="mg-auth__hint" style="margin-top:1rem">¿Ya tienes cuenta? <a href="login.html" style="color:var(--mg-primary);font-weight:700;text-decoration:none">Inicia sesión</a></p>
      </div>
      <div id="p2" hidden>
        <div class="mg-auth__icon-big mg-auth__icon-big--ok">{ico("check")}</div>
        <h1 class="mg-auth__title">Solicitud enviada</h1>
        <p class="mg-auth__sub">Validaremos tus datos y te avisaremos por correo cuando tu cuenta esté activa.</p>
        <a class="mg-btn mg-btn--lg mg-btn--block" href="login.html">Volver a iniciar sesión</a>
      </div>
      <style>@media (max-width: 480px) {{ .dos {{ grid-template-columns: 1fr !important; }} }}</style>'''

REGISTRO_JS = '''  $('pw').addEventListener('input', () => { const v = $('pw').value; const n = [v.length >= 10, /[a-z]/.test(v) && /[A-Z]/.test(v), /\\d/.test(v), /[^A-Za-z0-9]/.test(v)].filter(Boolean).length; $('fuerza').dataset.n = v ? n : 0; });
  $('f').addEventListener('submit', async (e) => {
    e.preventDefault();
    const r = [error('nom', $('nom').value.trim() ? '' : 'Escriba sus nombres'), error('ape', $('ape').value.trim() ? '' : 'Escriba sus apellidos'), error('mail', esMail($('mail').value.trim()) ? '' : 'Escriba un correo válido'),
      error('doc', /^\\d{5,12}$/.test($('doc').value) ? '' : 'Entre 5 y 12 dígitos'), error('pw', $('pw').value.length >= 10 ? '' : 'Mínimo 10 caracteres')];
    $('e-ok').hidden = $('ok').checked; $('e-ok').textContent = $('ok').checked ? '' : 'Debe aceptar la política para continuar';
    if (r.includes(false) || !$('ok').checked) return;
    cargando($('crear'), true); await espera(1000);                              // ← await fetch('/api/auth/registro', …)
    $('p1').hidden = true; $('p2').hidden = false;
  });'''

# ------------------------------------------------------------------ 6 · ESTADOS
ESTADOS_TARJETA = f'''      <div role="tablist" aria-label="Estados de acceso" class="mg-tabs mg-tabs--seg" style="width:100%;display:flex;margin-bottom:1.5rem" id="est">
        <button role="tab" class="mg-tab is-active" aria-selected="true" data-e="exp" style="flex:1">Expirada</button><button role="tab" class="mg-tab" aria-selected="false" data-e="blo" style="flex:1">Bloqueada</button><button role="tab" class="mg-tab" aria-selected="false" data-e="per" style="flex:1">Sin permiso</button><button role="tab" class="mg-tab" aria-selected="false" data-e="man" style="flex:1">Mantenimiento</button>
      </div>
      <div id="cuerpo" role="tabpanel" aria-live="polite"></div>'''

ESTADOS_JS = '''  const E = {
    exp: { ic: 'clock', tipo: 'warn', t: 'Tu sesión expiró', s: 'Por seguridad cerramos la sesión tras 20 minutos de inactividad.', b: ['Iniciar sesión de nuevo', 'login.html'] },
    blo: { ic: 'lock', tipo: 'err', t: 'Cuenta bloqueada', s: 'Superaste el número de intentos permitidos. Podrás volver a intentar en 15 minutos o puedes recuperar tu contraseña.', b: ['Recuperar contraseña', 'recuperar-clave.html'] },
    per: { ic: 'ban', tipo: 'err', t: 'No tienes permiso', s: 'Tu usuario no tiene acceso a este módulo. Solicítalo al administrador del sistema.', b: ['Volver al inicio', 'login.html'] },
    man: { ic: 'wrench', tipo: 'info', t: 'Sistema en mantenimiento', s: 'Estamos actualizando la plataforma. Volveremos a estar disponibles hoy a las 6:00 p. m.', b: ['Reintentar', 'login.html'] },
  };
  const IC = {
    clock: '__clock__', lock: '__lock__', ban: '__ban__', wrench: '__wrench__',
  };
  function ver(k) {
    const d = E[k]; $('cuerpo').innerHTML = '<div class="mg-auth__icon-big mg-auth__icon-big--' + d.tipo + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[d.ic] + '</svg></div><h1 class="mg-auth__title" style="color:var(--mg-heading)">' + d.t + '</h1><p class="mg-auth__sub">' + d.s + '</p><a class="mg-btn mg-btn--lg mg-btn--block" href="' + d.b[1] + '">' + d.b[0] + '</a>';
    document.querySelectorAll('#est .mg-tab').forEach((b) => { const on = b.dataset.e === k; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on); });
  }
  document.querySelectorAll('#est .mg-tab').forEach((b) => b.addEventListener('click', () => ver(b.dataset.e))); ver('exp');'''

# ------------------------------------------------------------------ 7 · UI (acordeones, pestañas, formularios)
UI = '''<body style="margin:0;background:var(--mg-bg-app);font-family:var(--mg-font-sans);color:var(--mg-text)">
%TIRA%
<main style="max-width:1000px;margin:0 auto;padding:2rem 1.25rem 4rem;display:grid;gap:2.5rem" id="contenido">
<header><h1 style="margin:0 0 .35rem;font:800 2rem var(--mg-font-display);color:var(--mg-heading)">Catálogo de UI: acordeones, pestañas y formularios</h1><p style="margin:0;color:var(--mg-text-muted)">Variantes listas para copiar. Solo requieren <code>gob.css</code>; la interactividad es JavaScript mínimo incluido en cada bloque.</p></header>

<section data-demo="Acordeones" data-nota="mg-acordeon sobre &lt;details&gt; nativos (accesibles sin JS): base, con íconos, tarjetas y sin bordes (flush)">
  <h2 style="font:700 1.25rem var(--mg-font-display);margin:0 0 .25rem">Acordeones</h2><p style="color:var(--mg-text-muted);margin:0 0 1rem">Usan <code>&lt;details&gt;</code>/<code>&lt;summary&gt;</code>: funcionan con teclado y lector de pantalla sin JavaScript.</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(18rem,1fr));gap:1.5rem;align-items:start">
    <div><h3 style="font-size:.85rem;color:var(--mg-text-muted);margin:0 0 .5rem">Base</h3><div class="mg-acordeon"><details open><summary>¿Cómo radico una petición?</summary><div class="cuerpo">Complete el formulario en tres pasos y reciba su radicado por correo.</div></details><details><summary>¿Cuánto tarda la respuesta?</summary><div class="cuerpo">15 días hábiles, según el tipo de solicitud.</div></details><details><summary>¿Dónde consulto el estado?</summary><div class="cuerpo">Con su número de radicado en «Consulta de trámites».</div></details></div></div>
    <div><h3 style="font-size:.85rem;color:var(--mg-text-muted);margin:0 0 .5rem">Con íconos y tarjetas</h3><div class="mg-acordeon mg-acordeon--cards"><details open><summary><span><span class="mg-acordeon__ico">%ICO_USER%</span>Cuenta y acceso</span></summary><div class="cuerpo">Restablezca su clave o actualice sus datos.</div></details><details><summary><span><span class="mg-acordeon__ico">%ICO_SHIELD%</span>Seguridad</span></summary><div class="cuerpo">Active la verificación en dos pasos.</div></details></div></div>
    <div><h3 style="font-size:.85rem;color:var(--mg-text-muted);margin:0 0 .5rem">Sin bordes (flush)</h3><div class="mg-acordeon mg-acordeon--flush"><details><summary>Requisitos</summary><div class="cuerpo">Documento de identidad y formulario.</div></details><details open><summary>Costos</summary><div class="cuerpo">Sin costo para trámites ciudadanos.</div></details><details><summary>Soporte</summary><div class="cuerpo">Mesa de ayuda, ext. 1144.</div></details></div></div>
  </div>
  <p class="mg-help">Acordeón exclusivo (uno abierto a la vez): agregue <code>name="faq"</code> a todos los <code>&lt;details&gt;</code> del grupo.</p>
</section>

<section data-demo="Pestañas" data-nota="mg-tabs (línea), mg-tabs--pill, mg-tabs--seg (segmentado) y mg-tabs--vertical; roles ARIA y teclado con flechas">
  <h2 style="font:700 1.25rem var(--mg-font-display);margin:0 0 .25rem">Pestañas</h2><p style="color:var(--mg-text-muted);margin:0 0 1rem">Cuatro variantes con las mismas clases base. Flechas ←/→ para moverse; el script de abajo es todo lo que necesitan.</p>
  <div style="display:grid;gap:1.5rem">
    <div class="mg-card tabs-demo" style="padding:1rem"><div class="mg-tabs" role="tablist" aria-label="Línea"><button role="tab" class="mg-tab is-active" aria-selected="true" data-p="a1">General</button><button role="tab" class="mg-tab" aria-selected="false" data-p="a2">Documentos</button><button role="tab" class="mg-tab" aria-selected="false" data-p="a3">Historial</button></div>
      <div style="padding:1rem 0" data-panel="a1">Datos generales del trámite.</div><div style="padding:1rem 0" data-panel="a2" hidden>Lista de documentos adjuntos.</div><div style="padding:1rem 0" data-panel="a3" hidden>Línea de tiempo del caso.</div></div>
    <div class="mg-card tabs-demo" style="padding:1rem"><div class="mg-tabs mg-tabs--pill" role="tablist" aria-label="Píldora"><button role="tab" class="mg-tab is-active" aria-selected="true" data-p="b1">Todos</button><button role="tab" class="mg-tab" aria-selected="false" data-p="b2">Abiertos</button><button role="tab" class="mg-tab" aria-selected="false" data-p="b3">Cerrados</button></div>
      <div style="padding:1rem 0" data-panel="b1">Todos los tickets.</div><div style="padding:1rem 0" data-panel="b2" hidden>Tickets abiertos.</div><div style="padding:1rem 0" data-panel="b3" hidden>Tickets cerrados.</div></div>
    <div class="mg-card tabs-demo" style="padding:1rem"><div class="mg-tabs mg-tabs--seg" role="tablist" aria-label="Segmentado"><button role="tab" class="mg-tab is-active" aria-selected="true" data-p="c1">Día</button><button role="tab" class="mg-tab" aria-selected="false" data-p="c2">Semana</button><button role="tab" class="mg-tab" aria-selected="false" data-p="c3">Mes</button></div>
      <div style="padding:1rem 0" data-panel="c1">Vista diaria.</div><div style="padding:1rem 0" data-panel="c2" hidden>Vista semanal.</div><div style="padding:1rem 0" data-panel="c3" hidden>Vista mensual.</div></div>
    <div class="mg-card tabs-demo" style="padding:1rem;display:flex;gap:1.25rem"><div class="mg-tabs mg-tabs--vertical" role="tablist" aria-orientation="vertical" aria-label="Vertical"><button role="tab" class="mg-tab is-active" aria-selected="true" data-p="d1">Perfil</button><button role="tab" class="mg-tab" aria-selected="false" data-p="d2">Seguridad</button><button role="tab" class="mg-tab" aria-selected="false" data-p="d3">Notificaciones</button></div>
      <div style="flex:1;padding:.25rem 0"><div data-panel="d1">Ajustes de perfil.</div><div data-panel="d2" hidden>Ajustes de seguridad.</div><div data-panel="d3" hidden>Preferencias de notificación.</div></div></div>
  </div>
</section>

<section data-demo="Formularios con etiqueta flotante" data-nota="mg-fl: la etiqueta sube al enfocar o al escribir; estados de error/válido; sin JavaScript para el efecto">
  <h2 style="font:700 1.25rem var(--mg-font-display);margin:0 0 .25rem">Formularios</h2><p style="color:var(--mg-text-muted);margin:0 0 1rem">Campos con etiqueta flotante (<code>.mg-fl</code>): requieren <code>placeholder=" "</code> (un espacio) para detectar si hay texto. Validación accesible con <code>role="alert"</code>.</p>
  <form class="mg-card" style="padding:1.5rem;display:grid;gap:1rem;max-width:620px" id="ff" novalidate>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem" class="dos">
      <div><div class="mg-fl" id="w-n"><input id="n" placeholder=" " autocomplete="name" aria-describedby="e-n"><label for="n">Nombre completo</label></div><p class="mg-fl-msg is-error" id="e-n" role="alert" hidden></p></div>
      <div><div class="mg-fl" id="w-c"><input id="c" type="email" placeholder=" " autocomplete="email" aria-describedby="e-c"><label for="c">Correo</label></div><p class="mg-fl-msg is-error" id="e-c" role="alert" hidden></p></div>
    </div>
    <div class="mg-fl"><select id="m"><option>Santa Marta</option><option>Ciénaga</option><option>Fundación</option></select><label for="m">Municipio</label></div>
    <div class="mg-fl"><textarea id="t" placeholder=" "></textarea><label for="t">Mensaje</label></div>
    <div class="mg-fl is-valid"><input id="v" value="Campo válido" placeholder=" "><label for="v">Estado válido</label></div>
    <div class="mg-fl"><input id="d" value="Deshabilitado" placeholder=" " disabled><label for="d">Estado deshabilitado</label></div>
    <div style="display:flex;gap:1.25rem;flex-wrap:wrap"><label style="display:inline-flex;gap:.5rem;align-items:center"><input type="checkbox" class="mg-check" checked> Recibir avisos</label><label style="display:inline-flex;gap:.5rem;align-items:center"><input type="radio" class="mg-check" name="r" checked> Persona</label><label style="display:inline-flex;gap:.5rem;align-items:center"><input type="radio" class="mg-check" name="r"> Empresa</label></div>
    <div style="display:flex;gap:.6rem"><button class="mg-btn">Enviar</button><button type="reset" class="mg-btn mg-btn--secondary">Limpiar</button></div>
  </form>
  <style>@media (max-width: 520px) { .dos { grid-template-columns: 1fr !important; } }</style>
</section>

<section data-demo="Pasos y línea de tiempo" data-nota="mg-stepper (pasos) y mg-timeline (historial): HTML + CSS puros">
  <h2 style="font:700 1.25rem var(--mg-font-display);margin:0 0 1rem">Pasos y línea de tiempo (solo CSS)</h2>
  <div class="mg-card" style="padding:1.5rem;display:grid;gap:1.5rem"><ol class="mg-stepper" aria-label="Progreso"><li class="is-done"><span>Datos</span></li><li class="is-current" aria-current="step"><span>Solicitud</span></li><li><span>Confirmar</span></li></ol>
    <ol class="mg-timeline"><li><time>12 oct</time><strong>Radicado</strong> por el solicitante</li><li><time>13 oct</time><strong>Asignado</strong> a la dependencia</li><li><time>15 oct</time><strong>En revisión</strong></li></ol></div>
</section>
</main>
<script type="module">
  const $ = (id) => document.getElementById(id);
  // Pestañas (todas las variantes): roles ARIA + flechas
  document.querySelectorAll('.tabs-demo').forEach((g) => {
    const tabs = [...g.querySelectorAll('[role=tab]')];
    const ir = (t) => { tabs.forEach((x) => { const on = x === t; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; g.querySelector('[data-panel="' + x.dataset.p + '"]').hidden = !on; }); t.focus(); };
    tabs.forEach((t, i) => { t.tabIndex = i ? -1 : 0; t.addEventListener('click', () => ir(t)); t.addEventListener('keydown', (e) => { const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (k) { e.preventDefault(); ir(tabs[(i + k + tabs.length) % tabs.length]); } }); });
  });
  // Validación del formulario
  function error(id, msg) { const w = $('w-' + id), m = $('e-' + id); w.classList.toggle('is-invalid', !!msg); m.textContent = msg || ''; m.hidden = !msg; return !msg; }
  $('ff').addEventListener('submit', (e) => { e.preventDefault(); const a = error('n', $('n').value.trim() ? '' : 'Escriba su nombre'), b = error('c', /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test($('c').value) ? '' : 'Escriba un correo válido'); if (a && b) gob.toast({ tipo: 'exito', titulo: 'Formulario válido' }); });
</script>
<!--DEMO-ONLY--><script type="module" src="demo-kit.js"></script><!--/DEMO-ONLY-->
</body>
</html>
'''

CRED = '<span style="background:rgba(255,255,255,.12);padding:.15rem .55rem;border-radius:99px">Prueba: demo@magdalena.gov.co · Demo1234</span>'


def build(root):
    d = os.path.join(root, 'demos')
    ic = {k: SVG[k] for k in SVG}
    estados = ESTADOS_JS.replace('__clock__', ic['clock']).replace('__lock__', ic['lock']).replace('__ban__', ic['ban']).replace('__wrench__', ic['wrench'])
    pages = {
        'login.html': pagina('login.html', 'Iniciar sesión', 'Login con Google y correo/contraseña, validación, bloqueo a los 3 intentos', LOGIN, LOGIN_JS, CRED),
        'recuperar-clave.html': pagina('recuperar-clave.html', 'Recuperar contraseña', 'Paso 1: correo · Paso 2: «revisa tu correo» con reenvío a los 60 s', RECUPERAR, RECUPERAR_JS),
        'restablecer-clave.html': pagina('restablecer-clave.html', 'Nueva contraseña', 'Pantalla del enlace del correo: fortaleza, requisitos y confirmación', RESTABLECER, RESTABLECER_JS),
        'verificacion-2fa.html': pagina('verificacion-2fa.html', 'Verificación en dos pasos', 'Código OTP de 6 dígitos (autoavance, pegar, reenvío). Código de prueba: 123456', DOSPASOS, DOSPASOS_JS),
        'registro.html': pagina('registro.html', 'Crear cuenta', 'Solicitud de acceso con validación y fortaleza de contraseña', REGISTRO, REGISTRO_JS, ancho='style="max-width:34rem"'),
        'estados-acceso.html': pagina('estados-acceso.html', 'Estados de acceso', 'Sesión expirada, cuenta bloqueada, sin permiso y mantenimiento', ESTADOS_TARJETA, estados),
    }
    tira = TIRA.replace('%NOTA%', 'Acordeones, pestañas, formularios, pasos y línea de tiempo').replace('%CRED%', '')
    ui = HEAD.replace('%TITULO%', 'Catálogo de UI').replace('%EXTRA_HEAD%', '') + UI.replace('%TIRA%', tira).replace('%ICO_USER%', ico('user')).replace('%ICO_SHIELD%', ico('shield'))
    pages['ui-componentes.html'] = ui
    for n, h in pages.items():
        with open(os.path.join(d, n), 'w', encoding='utf-8', newline='\n') as f:
            f.write(h)
    return list(pages)
