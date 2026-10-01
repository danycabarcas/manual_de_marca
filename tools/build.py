"""Genera todo dist/ a partir de tokens.py + src/*.css.   Uso: python tools/build.py"""
import os, re, json, math, shutil, zipfile, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.stdout.reconfigure(encoding='utf-8')
from tokens import *

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')
VERSION = '1.0.0'
BANNER = (f'/*! Gobernación del Magdalena · Identidad Visual 2026 · v{VERSION}\n'
          f'   Generado desde tools/tokens.py — NO editar a mano. */\n')


def w(path, content):
    full = os.path.join(DIST, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)


def src(name):
    with open(os.path.join(ROOT, 'src', name), encoding='utf-8') as f:
        return f.read()


def minify(css):
    css = re.sub(r'/\*(?!\!).*?\*/', '', css, flags=re.S)
    css = re.sub(r'\s+', ' ', css)
    css = re.sub(r'\s*([{};,>])\s*', r'\1', css)
    css = re.sub(r':\s+', ':', css)
    css = css.replace(';}', '}')
    return css.strip()


def rgb_str(h):
    return '%d, %d, %d' % hex2rgb(h)


# ------------------------------------------------------------------ tokens CSS
def tokens_css(root_sel=':root'):
    L = [f'{root_sel} {{', '  /* Paleta oficial */']
    for k, v in BRAND.items():
        L.append(f'  --mg-{k}: {v[0]};')
        L.append(f'  --mg-{k}-rgb: {rgb_str(v[0])};')
    for k, v in NEUTRALS.items():
        L.append(f'  --mg-{k}: {v};')
        L.append(f'  --mg-{k}-rgb: {rgb_str(v)};')
    L.append('  /* Escalas tonales (500 = color oficial) */')
    for name, sc in SCALES.items():
        for s, h in sc.items():
            L.append(f'  --mg-{name}-{s}: {h};')
    L.append('  /* Degradados */')
    for k, g in GRADIENTS.items():
        L.append(f'  --mg-gradient-{k}: {g};')
    L.append('  /* Semánticos de interfaz */')
    L += ['  --mg-bg: #ffffff;', '  --mg-surface-card: #ffffff;', f'  --mg-text: {NEUTRALS["ink"]};',
          f'  --mg-heading: {NEUTRALS["gray"]};', f'  --mg-border: {NEUTRAL_UI[200]};', f'  --mg-border-strong: {NEUTRAL_UI[300]};']
    for k, v in SEMANTIC.items():
        L.append(f'  --mg-color-{k}: {v};')
        L.append(f'  --mg-on-{k}: {on_color(v)};')
    L.append('  /* Tipografía, radios y sombras */')
    for k, v in FONTS.items():
        L.append(f'  --mg-font-{k}: {v};')
    for k, v in RADIUS.items():
        L.append(f'  --mg-radius-{k}: {v};')
    for k, v in SHADOW.items():
        L.append(f'  --mg-shadow-{k}: {v};')
    L.append('}')
    return '\n'.join(L) + '\n'


FONT_IMPORT = f'@import url("{GOOGLE_FONTS}");\n'


def build_css():
    tok = tokens_css()
    comp = src('components.css')
    w('css/magdalena-tokens.css', BANNER + tok)
    w('css/magdalena-tokens.min.css', BANNER + minify(tok))
    full = BANNER + FONT_IMPORT + tok + '\n' + comp
    w('css/magdalena.css', full)
    w('css/magdalena.min.css', BANNER + FONT_IMPORT + minify(tok + comp))
    # Frameworks: cada archivo es autosuficiente (tokens + overrides), una sola URL
    packs = {
        'bootstrap/magdalena-bootstrap5.css': ['bootstrap5.css'],
        'bootstrap/magdalena-bootstrap4.css': ['bootstrap4.css'],
        'adminlte/magdalena-adminlte4.css': ['bootstrap5.css', 'adminlte4.css'],
        'adminlte/magdalena-adminlte3.css': ['bootstrap4.css', 'adminlte3.css'],
        'primeng/magdalena-primeng.css': ['primeng-extras.css'],
        'angular-material/magdalena-material-extras.css': ['material-extras.css'],
    }
    for out, parts in packs.items():
        body = BANNER + FONT_IMPORT + tok + '\n' + '\n'.join(src(p) for p in parts)
        w(out, body)
        w(out.replace('.css', '.min.css'), BANNER + FONT_IMPORT + minify(tok + ''.join(src(p) for p in parts)))


# ------------------------------------------------------------------ SCSS / LESS
def build_scss_less():
    S = [BANNER.replace('/*!', '//').replace('*/', '').rstrip(), '// Variables SCSS', '']
    for k, v in BRAND.items():
        S.append(f'$mg-{k}: {v[0]} !default;')
    for k, v in NEUTRALS.items():
        S.append(f'$mg-{k}: {v} !default;')
    S.append('')
    for name, sc in SCALES.items():
        S.append(f'$mg-{name}-scale: (' + ', '.join(f'{s}: {h}' for s, h in sc.items()) + ') !default;')
        for s, h in sc.items():
            S.append(f'$mg-{name}-{s}: {h} !default;')
    S.append('')
    for k, g in GRADIENTS.items():
        S.append(f'$mg-gradient-{k}: {g} !default;')
    S.append('')
    S.append('$mg-stripe-colors: (' + ', '.join(BRAND[k][0] for k in STRIPE) + ') !default;')
    S.append('$mg-theme-colors: (' + ', '.join(f'"{k}": {v}' for k, v in SEMANTIC.items()) + ') !default;')
    for k, v in FONTS.items():
        S.append(f'$mg-font-{k}: {v} !default;')
    for k, v in RADIUS.items():
        S.append(f'$mg-radius-{k}: {v} !default;')
    for k, v in SHADOW.items():
        S.append(f'$mg-shadow-{k}: {v} !default;')
    S.append('')
    S.append('// Mixins')
    S.append('@mixin mg-gradient($name: "primary") { background: var(--mg-gradient-#{$name}); }')
    S.append('@mixin mg-stripe($height: 6px) { display: block; height: $height; background: $mg-gradient-stripe; }')
    w('scss/_magdalena-tokens.scss', '\n'.join(S) + '\n')

    Lq = ['// Gobernación del Magdalena · variables LESS']
    for k, v in BRAND.items():
        Lq.append(f'@mg-{k}: {v[0]};')
    for k, v in NEUTRALS.items():
        Lq.append(f'@mg-{k}: {v};')
    for name, sc in SCALES.items():
        for s, h in sc.items():
            Lq.append(f'@mg-{name}-{s}: {h};')
    for k, g in GRADIENTS.items():
        Lq.append(f'@mg-gradient-{k}: ~"{g}";')
    w('less/magdalena-tokens.less', '\n'.join(Lq) + '\n')

    # Bootstrap 5 Sass: pasar ANTES de importar bootstrap
    B = ['// Bootstrap 5 · sobrescribir variables ANTES de @import "bootstrap/scss/bootstrap";',
         '@import "magdalena-tokens";', '',
         '$primary: $mg-primary;', '$secondary: $mg-gray;', '$success: $mg-green;', '$info: $mg-cyan;',
         '$warning: $mg-yellow;', '$danger: $mg-red;', '$light: $mg-surface;', '$dark: $mg-ink;',
         '$font-family-sans-serif: $mg-font-sans;', '$headings-font-family: $mg-font-display;', '$headings-font-weight: 800;',
         '$headings-color: $mg-gray;', '$body-color: $mg-ink;', '$link-color: $mg-primary;',
         '$border-radius: 10px;', '$border-radius-sm: 6px;', '$border-radius-lg: 16px;', '$border-radius-pill: 999px;',
         '$min-contrast-ratio: 3;  // permite texto blanco sobre azul/rojo de marca; negro sobre cian/verde/amarillo se calcula solo',
         '$btn-font-weight: 700;', '$enable-gradients: false;']
    w('bootstrap/_magdalena-bootstrap-variables.scss', '\n'.join(B) + '\n')


# ------------------------------------------------------------------ JS / JSON / TS
def build_js():
    data = {
        'version': VERSION,
        'colors': {k: {'hex': v[0], 'rgb': list(v[1]), 'cmyk': list(v[2]), 'role': v[3]} for k, v in BRAND.items()},
        'neutrals': NEUTRALS,
        'scales': {n: {str(s): h for s, h in sc.items()} for n, sc in SCALES.items()},
        'semantic': SEMANTIC,
        'stripe': [BRAND[k][0] for k in STRIPE],
        'gradients': GRADIENTS,
        'fonts': FONTS,
        'googleFonts': GOOGLE_FONTS,
        'radius': RADIUS,
        'shadow': SHADOW,
    }
    js = json.dumps(data, indent=2, ensure_ascii=False)
    w('tokens/magdalena-tokens.json', js + '\n')
    w('tokens/magdalena-tokens.mjs', f'// ESM\nexport const magdalena = {js};\nexport default magdalena;\n')
    w('tokens/magdalena-tokens.cjs', f'// CommonJS\nmodule.exports = {js};\n')
    w('tokens/magdalena-tokens.d.ts',
      'export interface MagdalenaTokens {\n  version: string;\n  colors: Record<string, { hex: string; rgb: number[]; cmyk: number[]; role: string }>;\n'
      '  neutrals: Record<string, string>;\n  scales: Record<string, Record<string, string>>;\n  semantic: Record<string, string>;\n'
      '  stripe: string[];\n  gradients: Record<string, string>;\n  fonts: Record<string, string>;\n  googleFonts: string;\n'
      '  radius: Record<string, string>;\n  shadow: Record<string, string>;\n}\nexport declare const magdalena: MagdalenaTokens;\nexport default magdalena;\n')
    # Android / iOS / Flutter ligeros (para equipos móviles)
    xml = ['<?xml version="1.0" encoding="utf-8"?>', '<resources>']
    for k, v in BRAND.items():
        xml.append(f'    <color name="mg_{k}">{v[0]}</color>')
    for k, v in NEUTRALS.items():
        xml.append(f'    <color name="mg_{k}">{v}</color>')
    xml.append('</resources>')
    w('tokens/android-colors.xml', '\n'.join(xml) + '\n')
    dart = ['// Flutter', "import 'package:flutter/material.dart';", 'class MagdalenaColors {']
    for k, v in list(BRAND.items()):
        dart.append(f'  static const Color {k} = Color(0xFF{v[0][1:]});')
    for k, v in NEUTRALS.items():
        dart.append(f'  static const Color {k} = Color(0xFF{v[1:]});')
    dart.append('  static const List<Color> stripe = [' + ', '.join(k for k in STRIPE) + '];')
    dart.append('  static const LinearGradient primary = LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [primary, cyan]);')
    dart.append('}')
    w('tokens/flutter_magdalena_colors.dart', '\n'.join(dart).replace('colors: [primary, cyan]', 'colors: [Color(0xFF0071BB), Color(0xFF00B7D9)]') + '\n')

    # MUI (React)
    mui = f"""// MUI v5/v6/v7 — npm i @mui/material @emotion/react @emotion/styled
import {{ createTheme }} from '@mui/material/styles';
import {{ magdalena as m }} from './magdalena-tokens.mjs';

export const magdalenaTheme = createTheme({{
  palette: {{
    primary:   {{ main: m.colors.primary.hex, light: m.scales.primary['400'], dark: m.scales.primary['700'], contrastText: '#fff' }},
    secondary: {{ main: m.colors.cyan.hex,    light: m.colors.sky.hex,       dark: m.scales.cyan['700'],    contrastText: m.neutrals.ink }},
    info:      {{ main: m.colors.cyan.hex,    contrastText: m.neutrals.ink }},
    success:   {{ main: m.colors.green.hex,   contrastText: m.neutrals.ink }},
    warning:   {{ main: m.colors.yellow.hex,  contrastText: m.neutrals.ink }},
    error:     {{ main: m.colors.red.hex,     contrastText: '#fff' }},
    text:      {{ primary: m.neutrals.ink, secondary: m.neutrals.gray }},
    background: {{ default: m.neutrals.surface, paper: '#fff' }},
  }},
  shape: {{ borderRadius: 10 }},
  typography: {{
    fontFamily: m.fonts.sans,
    h1: {{ fontWeight: 900 }}, h2: {{ fontWeight: 800 }}, h3: {{ fontWeight: 800 }}, h4: {{ fontWeight: 800 }}, button: {{ fontWeight: 700, textTransform: 'none' }},
  }},
  components: {{
    MuiButton: {{
      styleOverrides: {{
        root: {{ borderRadius: 999 }},
        containedPrimary: {{ backgroundImage: m.gradients.action, '&:hover': {{ backgroundImage: m.gradients.action, filter: 'brightness(1.08)' }} }},
      }},
    }},
    MuiAppBar: {{ styleOverrides: {{ colorPrimary: {{ backgroundImage: m.gradients['primary-h'] }} }} }},
    MuiCard: {{ styleOverrides: {{ root: {{ borderRadius: 16 }} }} }},
    MuiLinearProgress: {{ styleOverrides: {{ barColorPrimary: {{ backgroundImage: m.gradients['primary-h'] }} }} }},
  }},
}});
export default magdalenaTheme;
"""
    w('mui/magdalena-mui-theme.mjs', mui)
    w('mui/magdalena-tokens.mjs', f'export const magdalena = {js};\nexport default magdalena;\n')

    vuetify = f"""// Vuetify 3 — npm i vuetify
import {{ createVuetify }} from 'vuetify';
import {{ magdalena as m }} from './magdalena-tokens.mjs';

export const magdalenaVuetifyTheme = {{
  dark: false,
  colors: {{
    background: m.neutrals.surface, surface: '#FFFFFF',
    primary: m.colors.primary.hex, secondary: m.neutrals.gray, accent: m.colors.cyan.hex,
    info: m.colors.cyan.hex, success: m.colors.green.hex, warning: m.colors.yellow.hex, error: m.colors.red.hex,
    'on-primary': '#FFFFFF', 'on-info': m.neutrals.ink, 'on-success': m.neutrals.ink, 'on-warning': m.neutrals.ink, 'on-error': '#FFFFFF',
    sky: m.colors.sky.hex, olive: m.colors.olive.hex, purple: m.colors.purple.hex,
  }},
}};

export default createVuetify({{
  theme: {{ defaultTheme: 'magdalena', themes: {{ magdalena: magdalenaVuetifyTheme }} }},
  defaults: {{
    VBtn: {{ rounded: 'pill', class: 'text-none font-weight-bold' }},
    VCard: {{ rounded: 'lg' }},
  }},
}});
"""
    w('vuetify/magdalena-vuetify.mjs', vuetify)
    w('vuetify/magdalena-tokens.mjs', f'export const magdalena = {js};\nexport default magdalena;\n')


# ------------------------------------------------------------------ Tailwind
def build_tailwind():
    colors = {}
    for name in ['primary', 'cyan', 'sky', 'red', 'yellow', 'green', 'olive', 'purple', 'gray']:
        sc = SCALES[name]
        colors[f'mg-{name}'] = {str(s): h for s, h in sc.items()}
        colors[f'mg-{name}']['DEFAULT'] = sc[500] if name != 'gray' else NEUTRALS['gray']
    colors['mg-ink'] = NEUTRALS['ink']
    colors['mg-surface'] = NEUTRALS['surface']
    # alias semánticos (shadcn/ui, plantillas Tailwind UI, etc.)
    alias = {'primary': 'mg-primary', 'accent': 'mg-cyan'}
    for a, t in alias.items():
        colors[a] = dict(colors[t])
    preset = f"""/** Tailwind CSS v3 preset — Gobernación del Magdalena 2026
 *  tailwind.config.js:  presets: [require('./magdalena.tailwind.preset.cjs')]
 *  Clases:  bg-mg-primary-600  text-mg-cyan  bg-mg-grad-primary  bg-mg-grad-stripe  shadow-mg-md  rounded-mg-lg  font-sans
 */
const plugin = require('tailwindcss/plugin');
module.exports = {{
  theme: {{
    extend: {{
      colors: {json.dumps(colors, indent=8)},
      backgroundImage: {json.dumps({'mg-grad-' + k: v for k, v in GRADIENTS.items()}, indent=8)},
      fontFamily: {{ sans: {json.dumps(FONTS['sans'].replace("'", ''))}.split(', '), display: {json.dumps(FONTS['display'].replace("'", ''))}.split(', ') }},
      borderRadius: {json.dumps({'mg-' + k: v for k, v in RADIUS.items()}, indent=8)},
      boxShadow: {json.dumps({'mg-' + k: v for k, v in SHADOW.items()}, indent=8)},
    }},
  }},
  plugins: [
    plugin(function ({{ addComponents, addUtilities }}) {{
      addUtilities({{
        '.mg-stripe-bar': {{ height: '6px', width: '100%', backgroundImage: {json.dumps(GRADIENTS['stripe'])} }},
        '.mg-text-gradient': {{ backgroundImage: {json.dumps(GRADIENTS['primary'])}, '-webkit-background-clip': 'text', backgroundClip: 'text', color: 'transparent' }},
      }});
      addComponents({{
        '.mg-btn': {{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', padding: '.7rem 1.4rem', borderRadius: '999px', fontWeight: '700', color: '#fff', backgroundImage: {json.dumps(GRADIENTS['action'])}, transition: 'filter .2s, transform .15s', '&:hover': {{ filter: 'brightness(1.08)', transform: 'translateY(-1px)' }} }},
      }});
    }}),
  ],
}};
"""
    w('tailwind/magdalena.tailwind.preset.cjs', preset)
    # v4: @theme
    T = ['/* Tailwind CSS v4 — en tu CSS principal:\n   @import "tailwindcss";\n   @import "./magdalena.tailwind-v4.css";\n   Clases: bg-mg-primary-600 text-mg-cyan-700 bg-mg-grad-primary bg-mg-grad-stripe shadow-mg-md rounded-mg-lg */',
         '@import url("' + GOOGLE_FONTS + '");', '@theme {']
    for name in ['primary', 'cyan', 'sky', 'red', 'yellow', 'green', 'olive', 'purple', 'gray']:
        for s, h in SCALES[name].items():
            T.append(f'  --color-mg-{name}-{s}: {h};')
        T.append(f'  --color-mg-{name}: {SCALES[name][500] if name != "gray" else NEUTRALS["gray"]};')
    T.append(f'  --color-mg-ink: {NEUTRALS["ink"]};\n  --color-mg-surface: {NEUTRALS["surface"]};')
    for s, h in SCALES['primary'].items():
        T.append(f'  --color-primary-{s}: {h};')
    T.append(f'  --color-primary: {BRAND["primary"][0]};\n  --color-accent: {BRAND["cyan"][0]};')
    T.append(f'  --font-sans: {FONTS["sans"]};\n  --font-display: {FONTS["display"]};')
    for k, v in RADIUS.items():
        T.append(f'  --radius-mg-{k}: {v};')
    for k, v in SHADOW.items():
        T.append(f'  --shadow-mg-{k}: {v};')
    T.append('}')
    for k, g in GRADIENTS.items():
        T.append(f'@utility bg-mg-grad-{k} {{ background-image: {g}; }}')
    T.append(f'@utility mg-text-gradient {{ background-image: {GRADIENTS["primary"]}; -webkit-background-clip: text; background-clip: text; color: transparent; }}')
    w('tailwind/magdalena.tailwind-v4.css', '\n'.join(T) + '\n')


# ------------------------------------------------------------------ OKLCH tonal palettes (Material 3)
def _srgb_to_lin(c):
    c /= 255
    return c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4


def _lin_to_srgb(c):
    c = max(0.0, min(1.0, c))
    return 12.92 * c if c <= .0031308 else 1.055 * c ** (1 / 2.4) - .055


def hex_to_oklch(h):
    r, g, b = [_srgb_to_lin(v) for v in hex2rgb(h)]
    l = .4122214708 * r + .5363325363 * g + .0514459929 * b
    m = .2119034982 * r + .6806995451 * g + .1073969566 * b
    s = .0883024619 * r + .2817188376 * g + .6299787005 * b
    l, m, s = l ** (1 / 3), m ** (1 / 3), s ** (1 / 3)
    L = .2104542553 * l + .7936177850 * m - .0040720468 * s
    a = 1.9779984951 * l - 2.4285922050 * m + .4505937099 * s
    bb = .0259040371 * l + .7827717662 * m - .8086757660 * s
    return L, math.hypot(a, bb), math.degrees(math.atan2(bb, a)) % 360


def oklch_to_rgb(L, C, H):
    a, b = C * math.cos(math.radians(H)), C * math.sin(math.radians(H))
    l = (L + .3963377774 * a + .2158037573 * b) ** 3
    m = (L - .1055613458 * a - .0638541728 * b) ** 3
    s = (L - .0894841775 * a - 1.2914855480 * b) ** 3
    r = 4.0767416621 * l - 3.3077115913 * m + .2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s
    bl = -.0041960863 * l - .7034186147 * m + 1.7076147010 * s
    return r, g, bl


def tone_hex(tone, C, H):
    if tone == 0:
        return '#000000'
    if tone == 100:
        return '#FFFFFF'
    L = ((tone + 16) / 116)
    lo, hi = 0.0, C
    def ok(c):
        return all(-0.0005 <= v <= 1.0005 for v in oklch_to_rgb(L, c, H))
    if ok(C):
        c = C
    else:
        for _ in range(24):
            mid = (lo + hi) / 2
            lo, hi = (mid, hi) if ok(mid) else (lo, mid)
        c = lo
    return rgb2hex([_lin_to_srgb(v) * 255 for v in oklch_to_rgb(L, c, H)])


M3_TONES = [0, 10, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100]


def m3_palette(base_hex, pin40=False, c_scale=1.0):
    _, C, H = hex_to_oklch(base_hex)
    C = min(C, .2) * c_scale
    pal = {t: tone_hex(t, C, H) for t in M3_TONES}
    if pin40:
        pal[40] = base_hex.upper()
    return pal


def scss_map(d, indent='  '):
    return '(\n' + ',\n'.join(f'{indent}{k}: {v}' for k, v in d.items()) + '\n)'


# ------------------------------------------------------------------ Angular Material
def build_material():
    P = m3_palette(BRAND['primary'][0], pin40=True)
    _, C0, H0 = hex_to_oklch(BRAND['primary'][0])
    P['secondary'] = m3_palette(mix(BRAND['primary'][0], '#808080', .55))
    P['neutral'] = {t: tone_hex(t, .012, H0) for t in M3_TONES}
    P['neutral-variant'] = {t: tone_hex(t, .02, H0) for t in M3_TONES}
    P['error'] = m3_palette(BRAND['red'][0])
    T = m3_palette(BRAND['cyan'][0])
    T['secondary'] = m3_palette(mix(BRAND['cyan'][0], '#808080', .55))
    T['neutral'] = P['neutral']; T['neutral-variant'] = P['neutral-variant']; T['error'] = P['error']

    def fmt(p):
        out = []
        for k, v in p.items():
            if isinstance(v, dict):
                out.append(f'  {k}: ' + '(' + ', '.join(f'{kk}: {vv}' for kk, vv in v.items()) + ')')
            else:
                out.append(f'  {k}: {v}')
        return '(\n' + ',\n'.join(out) + '\n)'

    def m2pal(name):
        sc = SCALES[name]
        d = {s: sc[s] for s in (50, 100, 200, 300, 400, 500, 600, 700, 800, 900)}
        a = {'A100': sc[300], 'A200': sc[400], 'A400': sc[500], 'A700': sc[600]}
        allc = {**d, **a}
        contrast_map = ', '.join(f'{k}: {on_color(v)}' for k, v in allc.items())
        body = ',\n'.join(f'  {k}: {v}' for k, v in allc.items())
        return f'(\n{body},\n  contrast: ({contrast_map})\n)'

    s = f"""// ==========================================================================
// Angular Material · Tema Gobernación del Magdalena 2026   (v{VERSION})
// Compatible con Angular Material 17.2+ / 18 / 19 / 20.  Copiar a src/ y usar en styles.scss
// ==========================================================================
@use '@angular/material' as mat;

// ---------- Paletas Material 3 (tonos generados desde los colores oficiales) ----------
$mg-primary-palette: {fmt(P)};
$mg-tertiary-palette: {fmt(T)};

// ---------- Paletas Material 2 (clásico) ----------
$mg-m2-primary: {m2pal('primary')};
$mg-m2-accent:  {m2pal('cyan')};
$mg-m2-warn:    {m2pal('red')};

// =========================================================================
// OPCIÓN A · Material 3  (recomendada, Angular Material 19+)
//   @use './magdalena-theme' as mg;   y en styles.scss:   @include mg.magdalena-m3();
// =========================================================================
@mixin magdalena-m3($density: 0) {{
  html {{
    @include mat.theme((
      color: (theme-type: light, primary: $mg-primary-palette, tertiary: $mg-tertiary-palette),
      typography: (plain-family: ('Montserrat', 'Gotham', 'Segoe UI', sans-serif), brand-family: ('Montserrat', 'Gotham', sans-serif), bold-weight: 800, medium-weight: 600, regular-weight: 500),
      density: $density,
    ));
  }}
}}

// =========================================================================
// OPCIÓN B · Material 2 (Angular Material 15 – 18, API clásica)
//   @include mg.magdalena-m2();
// =========================================================================
@mixin magdalena-m2() {{
  $theme: mat.m2-define-light-theme((
    color: (
      primary: mat.m2-define-palette($mg-m2-primary, 500, 300, 700),
      accent:  mat.m2-define-palette($mg-m2-accent, 500, 300, 700),
      warn:    mat.m2-define-palette($mg-m2-warn, 500, 300, 700),
    ),
    typography: mat.m2-define-typography-config($font-family: "'Montserrat', 'Gotham', 'Segoe UI', sans-serif"),
    density: 0,
  ));
  @include mat.all-component-themes($theme);
}}
"""
    w('angular-material/_magdalena-theme.scss', s)
    # Resumen de paleta M3 para documentación
    return P


# ------------------------------------------------------------------ PrimeNG / PrimeVue / PrimeReact preset
def build_prime():
    prim = {str(s): SCALES['primary'][s] for s in STEPS}
    ts = f"""// PrimeNG 18+ / PrimeVue 4 / PrimeReact 11 — preset Gobernación del Magdalena 2026
// PrimeNG 18-19:  npm i @primeng/themes     PrimeNG 20+ / PrimeVue 4 / PrimeReact:  npm i @primeuix/themes
// Cambie la línea de import según la versión que use:
import {{ definePreset }} from '@primeuix/themes';   // PrimeNG 18/19: '@primeng/themes'
import Aura from '@primeuix/themes/aura';              // PrimeNG 18/19: '@primeng/themes/aura'

export const MagdalenaPreset = definePreset(Aura, {{
  semantic: {{
    primary: {json.dumps(prim, indent=6)},
    formField: {{ borderRadius: '{RADIUS['md']}', focusRing: {{ width: '3px', style: 'solid', color: '{BRAND['cyan'][0]}', offset: '1px' }} }},
    focusRing: {{ width: '3px', style: 'solid', color: '{BRAND['cyan'][0]}', offset: '2px' }},
    colorScheme: {{
      light: {{
        primary: {{ color: '{{primary.500}}', contrastColor: '#ffffff', hoverColor: '{{primary.600}}', activeColor: '{{primary.700}}' }},
        highlight: {{ background: '{{primary.50}}', focusBackground: '{{primary.100}}', color: '{{primary.800}}', focusColor: '{{primary.900}}' }},
        surface: {json.dumps({str(k): v for k, v in NEUTRAL_UI.items()}, indent=10)},
      }},
      dark: {{
        primary: {{ color: '{{primary.400}}', contrastColor: '{{primary.950}}', hoverColor: '{{primary.300}}', activeColor: '{{primary.200}}' }},
        highlight: {{ background: 'color-mix(in srgb, {{primary.400}}, transparent 84%)', focusBackground: 'color-mix(in srgb, {{primary.400}}, transparent 76%)', color: 'rgba(255,255,255,.87)', focusColor: 'rgba(255,255,255,.87)' }},
      }},
    }},
  }},
  components: {{
    button: {{ root: {{ borderRadius: '{RADIUS['pill']}', label: {{ fontWeight: '700' }} }} }},
    card: {{ root: {{ borderRadius: '{RADIUS['lg']}' }} }},
    dialog: {{ root: {{ borderRadius: '{RADIUS['lg']}' }} }},
  }},
}});

export default MagdalenaPreset;
"""
    w('primeng/magdalena-preset.ts', ts)
    w('primeng/magdalena-preset.mjs', ts.replace("export const MagdalenaPreset", "export const MagdalenaPreset"))
    # variables Prime (CSS) para quien no use el preset JS
    pv = ['/* Variables PrimeNG/PrimeVue 4 (v18+) — alternativa CSS pura al preset */', ':root {']
    for s in STEPS:
        pv.append(f'  --p-primary-{s}: {SCALES["primary"][s]};')
    pv += ['  --p-primary-color: var(--p-primary-500);', '  --p-primary-contrast-color: #ffffff;', '  --p-primary-hover-color: var(--p-primary-600);',
           '  --p-primary-active-color: var(--p-primary-700);', '  --p-highlight-background: var(--p-primary-50);', '  --p-highlight-color: var(--p-primary-800);',
           f'  --p-focus-ring-color: {BRAND["cyan"][0]};', '}']
    w('primeng/magdalena-primeng-vars.css', '\n'.join(pv) + '\n')


# ------------------------------------------------------------------ Descargas ZIP
def build_zips():
    dl = os.path.join(DIST, 'downloads')
    os.makedirs(dl, exist_ok=True)
    logos = os.path.join(ROOT, 'assets', 'logos')

    def zipdir(name, pairs):
        with zipfile.ZipFile(os.path.join(dl, name), 'w', zipfile.ZIP_DEFLATED) as z:
            for arc, path in pairs:
                z.write(path, arc)

    def files(sub, ext=None):
        d = os.path.join(logos, sub)
        return [(f'{sub}/{f}', os.path.join(d, f)) for f in sorted(os.listdir(d))]

    zipdir('logos-svg.zip', files('svg'))
    zipdir('logos-png.zip', files('png'))
    zipdir('logos-jpg.zip', files('jpg'))
    zipdir('logos-todos.zip', files('svg') + files('png') + files('jpg'))
    ej = os.path.join(ROOT, 'assets', 'ejemplos')
    fav = os.path.join(ROOT, 'assets', 'favicon')
    zipdir('favicons.zip', [(f'favicon/{f}', os.path.join(fav, f)) for f in sorted(os.listdir(fav))])
    zipdir('ejemplos-aplicacion.zip', [(f'ejemplos/{f}', os.path.join(ej, f)) for f in sorted(os.listdir(ej))])
    kit = []
    for dp, _, fs in os.walk(DIST):
        if 'downloads' in dp:
            continue
        for f in fs:
            full = os.path.join(dp, f)
            kit.append((os.path.relpath(full, DIST).replace('\\', '/'), full))
    zipdir('kit-desarrollo-css-y-temas.zip', kit)


def build_all():
    if os.path.isdir(DIST):
        shutil.rmtree(DIST)
    build_css(); build_scss_less(); build_js(); build_tailwind(); build_material(); build_prime()
    try:
        import docs  # genera docs/*.md y paginas del portal
        docs.build(ROOT, DIST)
    except ImportError:
        pass
    build_zips()
    print('dist/ generado:', sum(len(f) for _, _, f in os.walk(DIST)), 'archivos')


if __name__ == '__main__':
    build_all()
