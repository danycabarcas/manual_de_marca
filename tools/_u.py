p = r'C:\laragon\www\manual_de_marca\tools\build.py'
s = open(p, encoding='utf-8').read()
old = "            t += f.read().replace('{X}', FORM_EXCL)\n    return t\n"
assert old in s
new = "            ft = f.read()\n        t += ft.replace('{X}', FORM_EXCL) + form_alta(ft)\n    return t\n"
s = s.replace(old, new, 1)
helper = r'''def form_alta(ft):
    """Segunda pasada de los controles nativos SIN clase con especificidad normal (0,1,1): vence al «preflight» de Tailwind
    (button{background:transparent}, input{padding:0}…). Los controles con clase siguen con especificidad cero."""
    bloques, d, ini, i = [], 0, 0, 0
    while i < len(ft):
        if ft.startswith('{X}', i):
            i += 3
            continue
        ch = ft[i]
        if ch == '{':
            d += 1
        elif ch == '}':
            d -= 1
            if d == 0:
                bloques.append(ft[ini:i + 1]); ini = i + 1
        i += 1
    out = []
    for b in bloques:
        if '{X})' not in b:
            continue
        out.append(re.sub(r':where\((:is\(\.mg-base, \.mg-forms\) .*?)\{X\}\)', r'\1:not([class])', b))
    return '\n/* ---- controles nativos sin clase: especificidad normal (vence al preflight de Tailwind) ---- */' + ''.join(out) + '\n'


def src(name):'''
s = s.replace("def src(name):", helper, 1)
open(p, 'w', encoding='utf-8').write(s)
