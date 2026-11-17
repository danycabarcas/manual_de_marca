R = r'C:\laragon\www\manual_de_marca'
def rd(p): return open(R + p, encoding='utf-8').read()
def wr(p, s): open(R + p, 'w', encoding='utf-8').write(s)
CDN = "https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@v0.5.1"

# --- JS del portal / estudios / demos: base pública con CORS cuando se ve desde el dominio oficial
s = rd(r'\site\portal.js')
old = "  const detected = new URL('.', location.href).href.replace(/\\/$/, '');"
assert old in s
s = s.replace(old, "  // En el dominio oficial el CDN propio aún no envía cabeceras CORS: el código copiado usa jsDelivr (con CORS) hasta que se habiliten.\n  const CDN_PUBLICO = '" + CDN + "';\n  const detected = location.hostname === 'manualdemarca.magdalena.gov.co' ? CDN_PUBLICO : new URL('.', location.href).href.replace(/\\/$/, '');", 1)
wr(r'\site\portal.js', s)

s = rd(r'\estudio\comun.js')
old = "export const DETECTADA = new URL('../', location.href).href.replace(/\\/$/, '');"
assert old in s
s = s.replace(old, "export const DETECTADA = location.hostname === 'manualdemarca.magdalena.gov.co' ? '" + CDN + "' : new URL('../', location.href).href.replace(/\\/$/, '');   // jsDelivr: el CDN propio aún no envía CORS", 1)
wr(r'\estudio\comun.js', s)

s = rd(r'\demos\demo-kit.js')
old = "const BASE = new URL('../', location.href).href.replace(/\\/$/, '');"
assert old in s
s = s.replace(old, "const BASE = location.hostname === 'manualdemarca.magdalena.gov.co' ? '" + CDN + "' : new URL('../', location.href).href.replace(/\\/$/, '');   // en el dominio oficial se copia con la URL pública con CORS (jsDelivr)", 1)
wr(r'\demos\demo-kit.js', s)

# --- versión
s = rd(r'\tools\novedades.py')
s = s.replace("VERSION = '0.5.0'", "VERSION = '0.5.1'", 1).replace("FECHA = '2026-11-17'", "FECHA = '2026-11-17'", 1)
s = s.replace("VERSIONES = [\n    ('0.5.0', '2026-11-17', [", """VERSIONES = [
    ('0.5.1', '2026-11-17', [
        ('arreglo', '<b>CDN desde otros sitios (CORS)</b>: cargar <code>gob.js</code>, las fuentes o los datos desde otro origen (p. ej. <code>localhost:4200</code> o una app en otro dominio) fallaba porque el servidor oficial no envía <code>Access-Control-Allow-Origin</code>. El código que genera el manual ahora usa la URL pública con CORS de jsDelivr: <code>https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@v0.5.1/cdn/v1/</code>.', 'Cambie en sus proyectos la base <code>https://manualdemarca.magdalena.gov.co/cdn/v1/</code> por la de jsDelivr (o use la copia local). Ver <a href="componentes/compatibilidad.html#cors">CORS</a>.'),
    ]),
    ('0.5.0', '2026-11-17', [""", 1)
s = s.replace("ETIQUETA = {'nuevo'", "ETIQUETA = {'nuevo'", 1)
s = s.replace("1) Si usa el CDN ({BASE}/cdn/v1/): nada; ya recibe los cambios. Si algo se ve en caché, refresque con Ctrl+F5 o agregue ?v={VERSION} al enlace de gob.css.", "1) Si usa el CDN: use la URL con CORS https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@v{VERSION}/cdn/v1/ (el dominio {BASE} aún no permite cargarlo desde otros sitios). Cambie @v{VERSION} cuando quiera subir de versión.", 1)
s = s.replace("<td><b>CDN</b> <code>{BASE}/cdn/v1/</code> (recomendado)</td><td>Nada: la versión 1 es compatible hacia atrás y recibe los cambios sola. Para forzar el navegador: <code>gob.css?v={VERSION}</code> o Ctrl+F5. Los componentes <code>gob-*</code> usan archivos con nombre único, no necesitan caché-bust.</td><td><code>gob.version</code> en la consola → <code>{VERSION}</code></td>",
              "<td><b>CDN con CORS</b> <code>https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@v{VERSION}/cdn/v1/</code> (recomendado)</td><td>Cambie el número de versión de la URL (<code>@v{VERSION}</code>) en <code>gob.css</code> y <code>gob.js</code>; la versión 1 es compatible hacia atrás. Con <code>@main</code> se recibe lo último, pero jsDelivr lo guarda hasta 12 h.</td><td><code>gob.version</code> en la consola → <code>{VERSION}</code></td>", 1)
s = s.replace("import('%s/cdn/v1/gob.js').then", "import('https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@main/cdn/v1/gob.js').then", 1).replace("fetch('%s/cdn/v1/version.json', { cache: 'no-store' })", "fetch('https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@main/cdn/v1/version.json', { cache: 'no-store' })", 1).replace('});""" % (BASE, BASE), \'Comprobar versión\')', '});""", \'Comprobar versión\')', 1)
wr(r'\tools\novedades.py', s)

s = rd(r'\packages\ui\src\index.ts')
s = s.replace("version = '0.5.0'", "version = '0.5.1'", 1)
wr(r'\packages\ui\src\index.ts', s)

# --- guía IA: URL del CDN con CORS
s = rd(r'\tools\ia.py')
s = s.replace("BASE = 'https://manualdemarca.magdalena.gov.co'", "BASE = 'https://manualdemarca.magdalena.gov.co'\nCDN = 'https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@v0.5.1'   # misma estructura /cdn/v1/ pero con CORS", 1)
s = s.replace("__BASE__/cdn/v1", "__CDN__/cdn/v1")
s = s.replace("- Sitio y CDN: `__BASE__` (el CDN versionado vive en `__CDN__/cdn/v1/`).", "- Sitio y documentación: `__BASE__`. **CDN para usar en proyectos: `__CDN__/cdn/v1/`** (jsDelivr, con CORS). El mismo contenido en `__BASE__/cdn/v1/` solo sirve para abrir archivos desde el propio sitio: otros orígenes (localhost:4200, otras apps) son bloqueados por CORS.", 1)
s = s.replace("guia = GUIA.replace('__BASE__', BASE)", "guia = GUIA.replace('__BASE__', BASE).replace('__CDN__', CDN)", 1)
s = s.replace("- Carga siempre `{BASE}/cdn/v1/gob.css` y `{BASE}/cdn/v1/gob.js` (o la copia autohospedada).", "- Carga siempre `{CDN}/cdn/v1/gob.css` y `{CDN}/cdn/v1/gob.js` (o la copia autohospedada). No uses `{BASE}/cdn/v1/` desde otros orígenes: falla por CORS.", 1)
s = s.replace("CDN versionado en {BASE}/cdn/v1/.", "CDN con CORS: {CDN}/cdn/v1/.", 1)
s = s.replace("- Olvidar `gob.js` o servir", "- Error `blocked by CORS policy` al cargar `gob.js`, fuentes o datos: estás usando `__BASE__/cdn/v1/` desde otro origen; cambia a `__CDN__/cdn/v1/` o autohospeda.\n- Olvidar `gob.js` o servir", 1)
wr(r'\tools\ia.py', s)

# --- frameworks: base del CDN
s = rd(r'\tools\site_nuevos.py')
s = s.replace("    B = 'https://manualdemarca.magdalena.gov.co'\n", "    B = 'https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@v0.5.1'   # CDN con CORS\n", 1)
s = s.replace("(?:)", "")
wr(r'\tools\site_nuevos.py', s)

# --- compatibilidad: sección CORS
s = rd(r'\tools\site_compat.py')
old = "<section class=\"pt-section\"><h2><span class=\"n\">06.</span> Qué sí puede chocar</h2>"
assert old in s
cors = '''<section class="pt-section" id="cors"><h2><span class="n">06.</span> CORS: usar el CDN desde otro sitio</h2>
<p>Si abre <code>http://localhost:4200</code> (o cualquier otra aplicación) y la consola dice <code>Access to script … has been blocked by CORS policy</code> al cargar <code>gob.js</code>, las fuentes o los datos, es porque el navegador exige la cabecera <code>Access-Control-Allow-Origin</code> a los <b>módulos ES</b>, las <b>fuentes</b> y los <b>fetch</b> de otro origen.</p>
<ul style="line-height:1.9;color:var(--mg-gray-700)"><li><b>Hoy, use el CDN con CORS</b>: <code>https://cdn.jsdelivr.net/gh/danycabarcas/manual_de_marca@v0.5.1/cdn/v1/gob.css</code> y <code>…/gob.js</code>. Es lo que genera el manual por defecto.</li><li><b>Copia local</b>: descargue <a href="../dist/downloads/gob-cdn-v1.zip">gob-cdn-v1.zip</a> y sírvalo desde su propio dominio (sin CORS).</li><li><b>Dominio oficial</b>: el servidor de <code>manualdemarca.magdalena.gov.co</code> sirve los estáticos con nginx y todavía no envía la cabecera. Para habilitarla, un administrador agrega en Plesk → <i>Apache y nginx</i> → <i>Directivas nginx adicionales</i>:</li></ul>
''' + code('nginx', """# CORS de solo lectura para los recursos públicos del manual (CDN, descargas, documentos)
location ~ ^/(cdn|dist|docs|assets)/ {
    add_header Access-Control-Allow-Origin "*" always;
    add_header Cross-Origin-Resource-Policy "cross-origin" always;
    try_files $uri =404;
}""", 'Directivas nginx (administrador)') + '''<p class="mg-help">Verificación: <code>curl -s -D - -o /dev/null -H "Origin: http://localhost:4200" https://manualdemarca.magdalena.gov.co/cdn/v1/gob.js</code> debe mostrar <code>Access-Control-Allow-Origin: *</code>. Compruebe siempre con <b>GET</b> (con <code>curl -I</code>, que hace HEAD, puede verse la cabecera aunque el navegador siga bloqueado).</p></section>
<section class="pt-section"><h2><span class="n">07.</span> Qué sí puede chocar</h2>'''
s = s.replace(old, cors, 1)
wr(r'\tools\site_compat.py', s)
print('ok')
