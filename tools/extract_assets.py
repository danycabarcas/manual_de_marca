"""Extrae logos, formas y ejemplos del manual PDF -> assets/. Uso: python tools/extract_assets.py"""
import fitz, glob, os, io, sys
from PIL import Image
sys.stdout.reconfigure(encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = [p for p in glob.glob(os.path.join(ROOT, '*.pdf')) if 'manual.pdf' not in p][0]
OUT = os.path.join(ROOT, 'assets', 'logos')
for sub in ('svg', 'png', 'jpg'):
    os.makedirs(os.path.join(OUT, sub), exist_ok=True)

# (nombre, página(1-based), clip aproximado x0,y0,x1,y1, fondo-propio)
ITEMS = [
    ('logo-vertical-color',            2, (700, 150, 1700, 880), False),
    ('logo-horizontal-color',          3, (600, 450, 1900, 900), False),
    ('logo-horizontal-gris',           4, (1262, 330, 1830, 510), False),
    ('logo-horizontal-blanco-sobre-negro', 4, (150, 575, 683, 785), True),
    ('logo-horizontal-blanco-sobre-gris',  4, (712, 575, 1245, 785), True),
    ('logo-horizontal-negro',          4, (1262, 575, 1860, 785), False),
    ('escudo-sobre-franjas',             5, (990, 90, 1250, 335), False),
    ('bandera-magdalena',              5, (1300, 140, 1580, 335), False),
]
SCALE = 4

def trim_box(pix):
    img = Image.frombytes('RGBA', (pix.width, pix.height), pix.samples)
    bb = img.getchannel('A').getbbox()
    return img, bb

def main():
    doc = fitz.open(PDF)
    for name, pn, clip, own_bg in ITEMS:
        page = doc[pn - 1]
        r = fitz.Rect(*clip)
        pix = page.get_pixmap(matrix=fitz.Matrix(1, 1), clip=r, alpha=True)
        img, bb = trim_box(pix)
        if not bb:
            print('VACIO', name); continue
        pad = 0 if own_bg else 6
        tight = fitz.Rect(r.x0 + bb[0] - pad, r.y0 + bb[1] - pad, r.x0 + bb[2] + pad, r.y0 + bb[3] + pad)
        # PNG transparente + JPG sobre blanco, alta resolución
        hi = page.get_pixmap(matrix=fitz.Matrix(SCALE, SCALE), clip=tight, alpha=True)
        im = Image.frombytes('RGBA', (hi.width, hi.height), hi.samples)
        im.save(os.path.join(OUT, 'png', name + '.png'), optimize=True)
        bg = Image.new('RGB', im.size, 'white'); bg.paste(im, mask=im.getchannel('A'))
        bg.save(os.path.join(OUT, 'jpg', name + '.jpg'), quality=95, subsampling=0)
        # SVG vectorial recortado
        d2 = fitz.open(PDF); p2 = d2[pn - 1]
        full = p2.rect
        for rr in (fitz.Rect(0, 0, full.x1, tight.y0), fitz.Rect(0, tight.y1, full.x1, full.y1),
                   fitz.Rect(0, tight.y0, tight.x0, tight.y1), fitz.Rect(tight.x1, tight.y0, full.x1, tight.y1)):
            if rr.width > 0 and rr.height > 0:
                p2.add_redact_annot(rr)
        p2.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE, graphics=fitz.PDF_REDACT_LINE_ART_REMOVE_IF_COVERED)
        p2.set_cropbox(tight)
        svg = p2.get_svg_image(matrix=fitz.Identity, text_as_path=True)
        with open(os.path.join(OUT, 'svg', name + '.svg'), 'w', encoding='utf-8') as f:
            f.write(svg)
        print(name, im.size, round(len(svg) / 1024), 'KB svg')

def stripe_bar():
    cols = ['#5618BA', '#A28034', '#FEC800', '#F7003C', '#0071BB', '#00B7D9', '#9FD7E5', '#69B75E', '#5618BA']
    w = 100
    rects = ''.join(f'<rect x="{i*w}" y="0" width="{w}" height="12" fill="{c}"/>' for i, c in enumerate(cols))
    open(os.path.join(OUT, 'svg', 'barra-franjas.svg'), 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" width="900" height="12" viewBox="0 0 {w*9} 12" preserveAspectRatio="none">{rects}</svg>')


def white_transparent():
    """Versión blanca SIN fondo (para sidebars/pies oscuros): quita el rectángulo de fondo del SVG negativo."""
    import re
    svg = open(os.path.join(OUT, 'svg', 'logo-horizontal-blanco-sobre-negro.svg'), encoding='utf-8').read()
    bg = re.search(r'<path[^>]*fill="#171713"[^>]*/>', svg)
    svg = svg.replace(bg.group(0), '', 1)
    open(os.path.join(OUT, 'svg', 'logo-horizontal-blanco.svg'), 'w', encoding='utf-8').write(svg)
    d = fitz.open(os.path.join(OUT, 'svg', 'logo-horizontal-blanco.svg'))
    pix = d[0].get_pixmap(matrix=fitz.Matrix(4, 4), alpha=True)
    im = Image.frombytes('RGBA', (pix.width, pix.height), pix.samples)
    x0, y0, x1, y1 = im.getchannel('A').getbbox()
    m = 8
    x0, y0, x1, y1 = max(0, x0 - m), max(0, y0 - m), min(im.width, x1 + m), min(im.height, y1 + m)
    im.crop((x0, y0, x1, y1)).save(os.path.join(OUT, 'png', 'logo-horizontal-blanco.png'), optimize=True)
    # recortar también el SVG (viewBox en unidades originales = px/4)
    vb = f'{x0/4:.2f} {y0/4:.2f} {(x1-x0)/4:.2f} {(y1-y0)/4:.2f}'
    svg2 = re.sub(r'width="[\d.]+" height="[\d.]+" viewBox="[^"]+"', f'width="{(x1-x0)/4:.0f}" height="{(y1-y0)/4:.0f}" viewBox="{vb}"', svg, 1)
    open(os.path.join(OUT, 'svg', 'logo-horizontal-blanco.svg'), 'w', encoding='utf-8').write(svg2)


if __name__ == '__main__':
    main()
    stripe_bar()
    white_transparent()
