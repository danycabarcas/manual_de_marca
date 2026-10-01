"""Genera favicons/íconos PWA desde assets/logos/png/escudo.png"""
import os
from PIL import Image
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = Image.open(os.path.join(root, 'assets/logos/png/escudo.png')).convert('RGBA')
out = os.path.join(root, 'assets/favicon'); os.makedirs(out, exist_ok=True)
def square(im, pad=0.06):
    s = max(im.size); s2 = int(s * (1 + pad * 2))
    c = Image.new('RGBA', (s2, s2), (0, 0, 0, 0)); c.paste(im, ((s2 - im.width) // 2, (s2 - im.height) // 2), im); return c
sq = square(src)
for n in (16, 32, 48, 64, 128, 192, 256, 512):
    sq.resize((n, n), Image.LANCZOS).save(f'{out}/icon-{n}.png', optimize=True)
white = Image.new('RGBA', sq.size, 'white'); white.alpha_composite(sq)
white.convert('RGB').resize((180, 180), Image.LANCZOS).save(f'{out}/apple-touch-icon.png', optimize=True)
sq.resize((256, 256), Image.LANCZOS).save(f'{out}/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print(sorted(os.listdir(out)))
