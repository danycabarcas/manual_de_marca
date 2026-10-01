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
# Neutros de interfaz (gris azulado, más serio que el gris cálido) y azul-noche para superficies oscuras
NEUTRAL_UI = {50: '#F8FAFC', 100: '#F1F4F8', 200: '#E3E8EF', 300: '#CBD2DC', 400: '#97A1B0', 500: '#6B7482',
              600: '#4F5866', 700: '#3A424F', 800: '#252B36', 900: '#161A22', 950: '#0C0F14'}
NAVY = {600: '#12395C', 700: '#0E2D49', 800: '#0B2239', 900: '#081A2C', 950: '#051220'}
SCALES['gray'] = NEUTRAL_UI
SCALES['navy'] = NAVY


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
    # Superficies oscuras sobrias (sidebar, hero, pie): azul-noche, sin colores vivos
    'deep':         f'linear-gradient(180deg, {NAVY[900]} 0%, {NAVY[950]} 100%)',
    'night':        f'linear-gradient(135deg, {NAVY[800]} 0%, {NAVY[950]} 100%)',
    # Degradado tonal (mismo azul, solo cambia el brillo): botones y acentos discretos
    'steel':        f'linear-gradient(180deg, {mix(P, "#FFFFFF", .08)} 0%, {P} 100%)',
    # Botones: tonal (azul con un leve brillo vertical). Texto blanco = contraste 5:1
    'action':       f'linear-gradient(180deg, {mix(P, "#FFFFFF", .08)} 0%, {P} 100%)',
    'action-aa':    f'linear-gradient(180deg, {mix(P, "#FFFFFF", .08)} 0%, {P} 100%)',
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

RADIUS = {'sm': '4px', 'md': '8px', 'lg': '12px', 'xl': '16px', 'pill': '999px'}
SHADOW = {
    'sm': '0 1px 2px rgba(8,26,44,.06)',
    'md': '0 2px 6px rgba(8,26,44,.08), 0 1px 2px rgba(8,26,44,.05)',
    'lg': '0 12px 28px rgba(8,26,44,.14), 0 2px 6px rgba(8,26,44,.06)',
    'glow': '0 0 0 3px rgba(0,113,187,.22)',
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
