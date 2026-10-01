"""Fuente única de verdad de la identidad visual Gobernación del Magdalena 2026.
Todo lo que hay en dist/ se genera a partir de este archivo (python tools/build.py)."""

# --- Paleta oficial (página 05 del manual) -----------------------------------------
BRAND = {
    # nombre: (hex, rgb, cmyk, rol)
    'primary': ('#0071BB', (0, 113, 187), (87, 49, 0, 0), 'Azul institucional (PRIMARIO)'),
    'cyan':    ('#00B7D9', (0, 183, 217), (72, 0, 13, 0), 'Cian (PRIMARIO – final del degradado)'),
    'sky':     ('#9FD7E5', (159, 215, 229), (41, 0, 11, 0), 'Celeste (PRIMARIO – fondos suaves)'),
    'red':     ('#F7003C', (247, 0, 60), (0, 96, 66, 0), 'Rojo (PRIMARIO – acentos / alertas)'),
    'yellow':  ('#FEC800', (254, 200, 0), (0, 23, 93, 0), 'Amarillo (acento)'),
    'green':   ('#69B75E', (105, 183, 94), (63, 0, 78, 0), 'Verde (acento / éxito)'),
    'olive':   ('#A28034', (162, 128, 52), (30, 41, 85, 21), 'Ocre (acento)'),
    'purple':  ('#5618BA', (86, 24, 186), (80, 89, 0, 0), 'Violeta (acento – extremos de la franja)'),
}
# Neutros tomados de los logos del manual
NEUTRALS = {
    'ink':     '#1D1D1B',   # negro del logotipo
    'gray':    '#606060',   # gris del texto "Gobernación del MAGDALENA"
    'surface': '#F6F5F5',   # gris de fondo de las piezas (valla, post, carnet)
    'white':   '#FFFFFF',
}
# Orden de la "línea" de franjas del logotipo (de izquierda a derecha)
STRIPE = ['purple', 'olive', 'yellow', 'red', 'primary', 'cyan', 'sky', 'green', 'purple']

STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
_MIX = {50: ('w', .92), 100: ('w', .84), 200: ('w', .68), 300: ('w', .5), 400: ('w', .25), 500: (None, 0),
        600: ('k', .14), 700: ('k', .3), 800: ('k', .46), 900: ('k', .62), 950: ('k', .76)}


def hex2rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def rgb2hex(c):
    return '#%02X%02X%02X' % tuple(max(0, min(255, round(v))) for v in c)


def mix(a, b, t):
    ra, rb = hex2rgb(a), hex2rgb(b)
    return rgb2hex(tuple(x + (y - x) * t for x, y in zip(ra, rb)))


def scale(base):
    out = {}
    for s in STEPS:
        kind, t = _MIX[s]
        out[s] = base.upper() if kind is None else mix(base, '#FFFFFF' if kind == 'w' else '#000000', t)
    return out


def lum(h):
    def f(v):
        v /= 255
        return v / 12.92 if v <= .03928 else ((v + .055) / 1.055) ** 2.4
    r, g, b = hex2rgb(h)
    return .2126 * f(r) + .7152 * f(g) + .0722 * f(b)


def contrast(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + .05) / (lb + .05)


def on_color(h):
    """Texto con mayor contraste sobre un color: blanco o negro de marca."""
    return NEUTRALS['white'] if contrast(h, '#FFFFFF') >= contrast(h, NEUTRALS['ink']) else NEUTRALS['ink']


SCALES = {name: scale(v[0]) for name, v in BRAND.items()}
SCALES['gray'] = scale(NEUTRALS['gray'])
# Escala neutra más clara/oscura para superficies y bordes de UI
NEUTRAL_UI = {50: '#FAFAFA', 100: '#F6F5F5', 200: '#ECEBEB', 300: '#DDDCDC', 400: '#B9B8B8', 500: '#8C8B8B',
              600: '#606060', 700: '#4A4A4A', 800: '#333332', 900: '#1D1D1B', 950: '#0F0F0E'}
SCALES['gray'] = NEUTRAL_UI


def _action_end(min_ratio=3.0):
    """Último punto del degradado azul→cian con contraste >= min_ratio frente a texto blanco."""
    lo, hi = 0.0, 1.0
    for _ in range(30):
        m = (lo + hi) / 2
        if contrast(mix('#0071BB', '#00B7D9', m), '#FFFFFF') >= min_ratio:
            lo = m
        else:
            hi = m
    return mix('#0071BB', '#00B7D9', lo)


ACTION_END = _action_end(3.0)        # límite 3:1 (texto grande/negrita, componentes UI)
ACTION_END_AA = _action_end(4.5)     # límite 4.5:1 (texto normal)

# --- Degradados -------------------------------------------------------------------
P, C, S = BRAND['primary'][0], BRAND['cyan'][0], BRAND['sky'][0]


def _stripe(direction='90deg'):
    n = len(STRIPE)
    stops = []
    for i, k in enumerate(STRIPE):
        a, b = round(100 * i / n, 3), round(100 * (i + 1) / n, 3)
        stops.append(f'{BRAND[k][0]} {a}% {b}%')
    return f'linear-gradient({direction}, ' + ', '.join(stops) + ')'


GRADIENTS = {
    # La gama del azul (la línea principal de la marca)
    'primary':      f'linear-gradient(135deg, {P} 0%, {C} 100%)',
    'primary-h':    f'linear-gradient(90deg, {P} 0%, {C} 100%)',
    'primary-v':    f'linear-gradient(180deg, {P} 0%, {C} 100%)',
    'sky':          f'linear-gradient(135deg, {P} 0%, {C} 55%, {S} 100%)',
    'sky-h':        f'linear-gradient(90deg, {P} 0%, {C} 55%, {S} 100%)',
    'aqua':         f'linear-gradient(135deg, {C} 0%, {S} 100%)',
    'mist':         f'linear-gradient(180deg, {S} 0%, #EAF6FA 100%)',
    'deep':         f'linear-gradient(160deg, {SCALES["primary"][900]} 0%, {SCALES["primary"][700]} 55%, {P} 100%)',
    # Para botones con texto blanco: se corta donde el contraste sigue siendo >= 3:1 (usar texto en negrita)
    'action':       f'linear-gradient(135deg, {P} 0%, {ACTION_END} 100%)',
    'action-aa':    f'linear-gradient(135deg, {P} 0%, {ACTION_END_AA} 100%)',
    # Acentos (usar con moderación, solo en objetos)
    'tropical':     f'linear-gradient(135deg, {C} 0%, {BRAND["green"][0]} 100%)',
    'sun':          f'linear-gradient(135deg, {BRAND["yellow"][0]} 0%, {SCALES["yellow"][600]} 100%)',
    'heat':         f'linear-gradient(135deg, {BRAND["red"][0]} 0%, {SCALES["red"][700]} 100%)',
    'earth':        f'linear-gradient(135deg, {BRAND["olive"][0]} 0%, {SCALES["olive"][700]} 100%)',
    'violet':       f'linear-gradient(135deg, {BRAND["purple"][0]} 0%, {P} 100%)',
    # La "línea" multicolor del logotipo
    'stripe':       _stripe('90deg'),
    'stripe-v':     _stripe('180deg'),
    'stripe-flow':  'linear-gradient(90deg, ' + ', '.join(BRAND[k][0] for k in STRIPE) + ')',
}

FONTS = {
    'sans':    "'Montserrat', 'Gotham', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif",
    'display': "'Montserrat', 'Gotham', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif",
    'mono':    "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
}
GOOGLE_FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap'

RADIUS = {'sm': '6px', 'md': '10px', 'lg': '16px', 'xl': '24px', 'pill': '999px'}
SHADOW = {
    'sm': '0 1px 2px rgba(0,56,94,.08), 0 1px 3px rgba(0,56,94,.06)',
    'md': '0 4px 10px rgba(0,56,94,.10), 0 2px 4px rgba(0,56,94,.06)',
    'lg': '0 14px 30px rgba(0,56,94,.14), 0 4px 10px rgba(0,56,94,.08)',
    'glow': '0 8px 24px rgba(0,183,217,.35)',
}

# Colores semánticos de UI
SEMANTIC = {
    'primary': BRAND['primary'][0],
    'secondary': NEUTRALS['gray'],
    'info': BRAND['cyan'][0],
    'success': BRAND['green'][0],
    'warning': BRAND['yellow'][0],
    'danger': BRAND['red'][0],
}
# Fuente de cada semántico en las escalas (para variantes hover/active)
SEMANTIC_SCALE = {'primary': 'primary', 'secondary': 'gray', 'info': 'cyan', 'success': 'green',
                  'warning': 'yellow', 'danger': 'red'}

if __name__ == '__main__':
    print('ACTION_END', ACTION_END)
    for k, v in SEMANTIC.items():
        print(k, v, 'on', on_color(v), round(contrast(v, on_color(v)), 2))
    print(GRADIENTS['stripe'])
