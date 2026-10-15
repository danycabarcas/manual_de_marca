"""Página «Estándar de componentes y guía de decisión» (componentes/estandar.html)."""
import html

E = html.escape


def tabla(cab, filas):
    th = ''.join(f'<th>{c}</th>' for c in cab)
    tr = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in f) + '</tr>' for f in filas)
    return f'<div class="tablewrap"><table class="mg-table"><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table></div>'


def build(root, page, code):
    flujo = '''<div class="flow" role="img" aria-label="Los tokens alimentan CSS, Tailwind, PrimeNG, Material, MUI, Vuetify y los Web Components">
<div class="flow__src"><b>Tokens</b><span>tools/tokens.py<br>colores · tipografía · radios · sombras</span></div>
<div class="flow__arrow">→</div>
<div class="flow__out">
<span>CSS <code>--mg-*</code> / <code>--gob-*</code></span><span>Tailwind v3 / v4</span><span>PrimeNG · PrimeVue (preset)</span><span>Angular Material (M2/M3)</span><span>MUI · Vuetify</span><span>Bootstrap · AdminLTE</span><span>Web Components <code>gob-*</code></span></div></div>'''
    decision = tabla(['Necesito…', 'Use', 'Por qué'], [
        ('Maquetar, tipografía, botones, formularios en HTML plano, WordPress, PHP/Laravel, SSR', '<b>CSS <code>mg-*</code></b> (<code>dist/css/magdalena.min.css</code>)', 'Sin JavaScript ni build; mismo aspecto en cualquier stack.'),
        ('Panel de administración en <b>Angular</b>: formularios, tablas, diálogos, menús', '<b>PrimeNG</b> (versión MIT) + <b>preset oficial</b>', 'No reconstruimos lo que PrimeNG ya resuelve; el preset lo viste con la marca.'),
        ('Panel en <b>Vue</b>', '<b>PrimeVue 4</b> + preset, o Vuetify + tema', 'Mismo preset; verificado con PrimeVue 4.5.'),
        ('Aplicación en <b>React / Next.js</b>', 'MUI + tema, o CSS <code>mg-*</code> + Tailwind', 'Temas generados desde los mismos tokens.'),
        ('Mapas, gráficas, indicadores, tableros — en <b>cualquier</b> framework o HTML plano', '<b>Web Components <code>gob-*</code></b> (<code>/cdn/v1/</code>)', 'PrimeNG no los trae con la marca ni con datos del Magdalena; funcionan igual en Angular, React, Vue o sin framework.'),
        ('Algo exclusivo de un proyecto', 'Desarrollo local con los <b>tokens</b>', 'No se promueve a librería hasta que lo usen 2 proyectos.'),
    ])
    contrato = '''<ol class="contrato">
<li><b>Nombre:</b> etiqueta <code>gob-&lt;nombre&gt;</code> en español, singular (<code>gob-mapa-magdalena</code>, <code>gob-grafica</code>).</li>
<li><b>API:</b> propiedades en <code>camelCase</code> con atributo en <code>kebab-case</code>; los datos complejos entran por propiedad (JSON), nunca por HTML. Todo configurable con <code>el.config = {…}</code>.</li>
<li><b>Eventos:</b> <code>gob-&lt;nombre&gt;-&lt;acción&gt;</code>, <code>bubbles + composed</code>, con <code>detail</code> documentado (el código DIVIPOLA es siempre la llave, nunca el nombre).</li>
<li><b>Tema:</b> variables <code>--gob-&lt;componente&gt;-*</code> con valores por defecto de la marca, <code>::part()</code> para lo estructural, tema <code>claro/oscuro</code> y sin colores escritos a mano.</li>
<li><b>Accesibilidad (WCAG 2.1 AA / NTC 5854):</b> teclado completo, roles ARIA, foco visible, alternativa en texto para lo gráfico, contraste ≥ 4.5:1, <code>prefers-reduced-motion</code>.</li>
<li><b>Responsive e imprimible:</b> de 320 px a 4K (container queries), CSS de impresión.</li>
<li><b>Peso:</b> bundle base &lt; 50 KB gzip; librerías pesadas (ECharts, MapLibre) se cargan solo bajo demanda.</li>
<li><b>Documentación:</b> cuándo usar / cuándo no, demo en vivo, instalación (CDN, Angular, React/Next, Vue), propiedades, eventos, variables, accesibilidad e integración con la API NestJS.</li>
<li><b>Calidad:</b> axe-core sin violaciones, versionado semántico y ruta inmutable por versión mayor (<code>/cdn/v1/</code>).</li></ol>'''
    estados = tabla(['Estado', 'Token', 'PrimeNG / PrimeVue', 'Bootstrap / AdminLTE', 'CSS <code>mg-*</code>', 'Color de texto encima'], [
        ('Primario', '<code>--mg-color-primary</code>', 'primary', 'primary', '<code>mg-btn</code>', 'blanco'),
        ('Éxito', '<code>--mg-color-success</code>', 'success', 'success', '<code>--success</code>', 'blanco (tono 700)'),
        ('Aviso', '<code>--mg-color-warning</code>', 'warn', 'warning', '<code>--accent</code>', 'oscuro'),
        ('Peligro', '<code>--mg-color-danger</code>', 'danger', 'danger', '<code>--danger</code>', 'blanco (tono 600)'),
        ('Información', '<code>--mg-color-info</code>', 'info', 'info', '<code>--cyan</code>', 'oscuro'),
        ('Secundario', '<code>--mg-color-secondary</code>', 'secondary', 'secondary', '<code>--secondary</code>', 'gris 700')])
    lic = tabla(['Librería', 'Versiones y licencia (LICENSE.md de cada paquete, verificado 2026-10)', 'Recomendación'], [
        ('<b>PrimeNG</b>', '17: MIT · 18, 19, 20, 21: «Community versions» MIT · <b>22: PrimeUI License</b> (comercial; clave de licencia)', 'Fijar <b>PrimeNG 21</b> (o ≤ 21). Antes de pasar a 22, consultar a TIC/Compras.'),
        ('<b>PrimeVue</b>', '4.x: MIT · <b>5.x: PrimeUI License</b>', 'Usar <b>PrimeVue 4.5.x</b>.'),
        ('<code>@primeuix/themes</code> (presets)', '1.x y 2.x: MIT · <b>3.x: PrimeUI License</b>', 'Fijar <code>^2</code> (PrimeNG 21 / PrimeVue 4) o <code>^1</code> (PrimeNG 20).'),
        ('Angular Material, Bootstrap, AdminLTE, Tailwind, Vuetify, Lit, Vite', 'MIT / BSD / Apache-2.0', 'Sin restricciones para este uso.'),
        ('MUI (core)', 'MIT; MUI X Pro/Premium son comerciales', 'Usar solo el núcleo.')])
    body = f'''
<p class="pt-lead">Cómo se mantienen estándar los componentes cuando los proyectos usan PrimeNG, Material, MUI u otros: <b>una sola fuente de tokens</b>, el mismo preset generado para cada librería y una familia de Web Components <code class="inline">gob-*</code> solo para lo que esas librerías no cubren.</p>

<section class="pt-section"><h2><span class="n">01.</span> Un origen, muchas salidas</h2>{flujo}
<p class="pt-lead" style="margin-top:1rem">Cambiar un color o un radio en <code class="inline">tools/tokens.py</code> actualiza, con un solo comando, el CSS, Tailwind, los temas de PrimeNG/PrimeVue, Material, MUI y Vuetify, y los Web Components. Así «el azul institucional» es el mismo en todos los proyectos.</p></section>

<section class="pt-section"><h2><span class="n">02.</span> Guía de decisión: qué usar y cuándo</h2>{decision}</section>

<section class="pt-section"><h2><span class="n">03.</span> Evidencia: PrimeVue con el preset</h2>
<p class="pt-lead">El mismo preset (<code class="inline">dist/primeng/magdalena-preset.mjs</code>) aplicado a componentes reales de <b>PrimeVue 4.5.5</b>: botones, formularios, tabla, etiquetas y mensajes toman la marca, incluidos los colores de estado. Un componente <code class="inline">mg-*</code> (abajo a la izquierda) convive sin conflicto. El preset es el mismo para <b>PrimeNG</b> (el import cambia según la versión; ver cabecera del archivo).</p>
<figure style="margin:0"><img src="../assets/ejemplos/primevue-con-preset.jpg" alt="Captura de PrimeVue con el preset de la Gobernación: botones azules, formulario, etiquetas de estado y tabla" style="max-width:100%;border:1px solid var(--mg-border);border-radius:12px"><figcaption class="mg-help">PrimeVue 4.5.5 (MIT) + @primeuix/themes 2.0.3 (MIT) + preset de la Gobernación.</figcaption></figure></section>

<section class="pt-section"><h2><span class="n">04.</span> Estados con el mismo nombre en todas partes</h2>
<p class="pt-lead">Para que un «éxito» o un «peligro» signifique lo mismo en Angular, Vue, Bootstrap o HTML plano:</p>{estados}</section>

<section class="pt-section"><h2><span class="n">05.</span> Contrato de un componente <code>gob-*</code></h2>
<p class="pt-lead">Lista de verificación que debe cumplir todo componente nuevo antes de entrar a la librería.</p>{contrato}</section>

<section class="pt-section"><h2><span class="n">06.</span> Licencias de las librerías de componentes</h2>
<div class="mg-alert mg-alert--warning" style="margin-bottom:1rem"><div><p class="mg-alert__title">Atención con las versiones más recientes</p>PrimeNG 22 y PrimeVue 5 cambiaron a la <b>PrimeUI License</b>: exige clave de licencia y la modalidad gratuita aplica a organizaciones pequeñas (menos de 10 empleados y 5 desarrolladores, entre otros límites). Una entidad pública debería presupuestar la licencia comercial por desarrollador o <b>mantenerse en las versiones MIT</b>. Verificado en el <code>LICENSE.md</code> de cada paquete; confirme los términos vigentes en <code>primeui.dev/licenses</code>.</div></div>{lic}
<p class="mg-help">Esta es una verificación técnica del texto de la licencia, no asesoría legal.</p></section>
'''
    page(root, 'componentes/estandar.html', 'Estándar de componentes', 'Una sola fuente de tokens, presets para PrimeNG y otras librerías, y Web Components gob-* para lo que ellas no cubren. Guía de decisión, contrato y licencias.', body, active='componentes.html')
