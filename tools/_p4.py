R = r'C:\laragon\www\manual_de_marca'
p = R + r'\tools\site_demos_panel.py'
s = open(p, encoding='utf-8').read()
s = s.replace("def shell(archivo, titulo, nota, cuerpo, script='', activo=None):\n    activo = activo or archivo\n", "def shell(archivo, titulo, nota, cuerpo, script='', activo=None, app='Convocatorias', side=None):\n    activo = activo or archivo\n", 1)
s = s.replace('<span class="mg-shell__app"><b>Convocatorias</b></span>', '<span class="mg-shell__app"><b>{app}</b></span>', 1)
old = '      <h2>Menú</h2>\n      <nav aria-label="Principal"><ul class="mg-nav">{nav}</ul><div class="mg-nav__sep">Administración</div><ul class="mg-nav">{nav2}</ul></nav>\n'
assert old in s
s = s.replace(old, '      {side if side else "<h2>Menú</h2><nav aria-label=\\"Principal\\"><ul class=\\"mg-nav\\">" + nav + "</ul><div class=\\"mg-nav__sep\\">Administración</div><ul class=\\"mg-nav\\">" + nav2 + "</ul></nav>"}\n', 1)
open(p, 'w', encoding='utf-8').write(s)

css = r'''
/* ==========================================================================
   COMPONENTES ADICIONALES DEL PANEL (sistemas de solicitudes y administración)
   ========================================================================== */
/* menú con grupos de color y tarjeta de perfil */
.mg-nav__grp { margin: 1rem .5rem .35rem; font: 800 .8rem var(--mg-font-sans); color: var(--_c, var(--mg-gray-500)); } .mg-nav__grp--dorado { --_c: #8A6A00; } .mg-nav__grp--azul { --_c: var(--mg-primary); } .mg-nav__grp--lila { --_c: #4A2BA8; }
.mg-perfil { display: flex; align-items: center; gap: .6rem; padding: .6rem .75rem; margin-bottom: .5rem; border: 1px solid var(--mg-border); border-radius: 10px; background: #fff; font-size: .78rem; line-height: 1.25; } .mg-perfil svg, .mg-perfil gob-icono { color: var(--mg-gray-500); flex: none; } .mg-perfil b { display: block; color: var(--mg-primary); font-weight: 700; font-size: .76rem; } .mg-perfil span { color: var(--mg-gray-700); } .mg-perfil .cfg { margin-left: auto; width: .9rem; height: .9rem; border-radius: 50%; background: #4A2BA8; flex: none; }
/* píldoras de cabecera */
.mg-tags { display: flex; gap: .4rem; flex-wrap: wrap; } .mg-pill--out { background: #fff; color: var(--mg-gray-700); border: 1px solid var(--mg-border-strong); }
/* tarjetas KPI de dashboard (ícono + título + número + chip) */
.mg-kcards { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(14.5rem, 1fr)); }
.mg-kcard { --_c: #4A2BA8; --_bg: #EAE6F8; display: grid; gap: .65rem; padding: 1.1rem 1.25rem; background: #fff; border: 1px solid var(--mg-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(8, 26, 44, .05); }
.mg-kcard--azul { --_c: var(--mg-primary-800); --_bg: #E5F1F9; } .mg-kcard--dorado { --_c: #8A6A00; --_bg: #FFF1BF; } .mg-kcard--verde { --_c: #1E5B22; --_bg: #E8F5E9; } .mg-kcard--rojo { --_c: #A3002A; --_bg: #FDE7ED; }
.mg-kcard__top { display: flex; align-items: center; gap: .8rem; } .mg-kcard__ic { display: grid; place-items: center; width: 2.6rem; height: 2.6rem; border-radius: 50%; background: var(--_bg); color: var(--_c); flex: none; }
.mg-kcard h3 { margin: 0; font: 800 .88rem/1.2 var(--mg-font-display); color: var(--mg-primary); } .mg-kcard .num { display: flex; align-items: baseline; gap: .5rem; flex-wrap: wrap; font: 800 1.9rem/1 var(--mg-font-display); color: var(--mg-gray-700); } .mg-kcard .num .mg-chip { font-size: .62rem; }
.mg-kcard small { padding-top: .6rem; border-top: 1px solid #F1F4F8; text-align: center; font-size: .74rem; color: var(--mg-text-muted); }
.mg-sem { display: flex; gap: .75rem; align-items: flex-end; } .mg-sem div { text-align: center; font: 800 1.6rem/1 var(--mg-font-display); color: var(--c); } .mg-sem div:nth-child(1) { --c: #2E7D32; } .mg-sem div:nth-child(2) { --c: #C79600; } .mg-sem div:nth-child(3) { --c: #D8002F; } .mg-sem .mg-chip { display: flex; justify-content: center; margin-top: .25rem; font-size: .58rem; }
/* tabs con contador */
.mg-cnt { display: inline-grid; place-items: center; min-width: 1.2rem; height: 1.2rem; padding: 0 .3rem; margin-left: .35rem; border-radius: 99px; background: rgba(0, 0, 0, .08); font-size: .68rem; } .mg-ptabs button[aria-selected="true"] .mg-cnt { background: rgba(255, 255, 255, .25); }
/* matriz de roles y permisos */
.mg-matriz-wrap { overflow-x: auto; } .mg-matriz { width: 100%; border-collapse: collapse; font-size: .82rem; min-width: 38rem; } .mg-matriz thead th { padding: .9rem .6rem; text-align: center; font: 700 .76rem var(--mg-font-sans); color: var(--mg-gray-800); vertical-align: bottom; } .mg-matriz thead th small { display: block; font-weight: 500; color: var(--mg-text-muted); font-size: .66rem; } .mg-matriz thead th svg, .mg-matriz thead th gob-icono { display: block; margin: 0 auto .3rem; color: var(--mg-primary); }
.mg-matriz .grupo td { background: #E5F1F9; color: var(--mg-primary-800); font: 800 .82rem var(--mg-font-display); padding: .55rem .75rem; border-radius: 6px; } .mg-matriz tbody td { padding: .8rem .6rem; border-bottom: 1px solid #F1F4F8; text-align: center; } .mg-matriz tbody td:first-child { text-align: left; font-weight: 600; color: var(--mg-gray-800); } .mg-matriz tbody td:first-child small { display: block; font-weight: 500; font-size: .68rem; color: var(--mg-text-muted); }
.mg-perm { display: inline-grid; place-items: center; width: 1.45rem; height: 1.45rem; border-radius: 6px; background: #E8F5E9; color: #2E7D32; } .mg-perm--no { background: none; color: #B6BEC9; width: auto; }
/* lista de opciones tipo tarjeta (asignación) */
.mg-optlist { display: grid; gap: .5rem; } .mg-opt { display: flex; align-items: center; gap: .75rem; padding: .7rem .85rem; border: 1px solid var(--mg-border); border-radius: 12px; background: #fff; cursor: pointer; transition: border-color .15s, background-color .15s; } .mg-opt:hover { background: #FAFBFD; } .mg-opt:has(input:checked) { border-color: var(--mg-primary); background: #F2F8FC; box-shadow: 0 0 0 1px var(--mg-primary) inset; } .mg-opt:has(input:focus-visible) { box-shadow: var(--mg-shadow-glow); }
.mg-opt b { display: block; font: 700 .86rem var(--mg-font-sans); color: var(--mg-gray-900); } .mg-opt small { color: var(--mg-text-muted); font-size: .72rem; } .mg-opt .grow { flex: 1; min-width: 0; }
.mg-conf { display: flex; align-items: center; gap: .7rem; padding: .7rem .9rem; border-radius: 12px; background: #EAE6F8; color: #2F1A7A; font-size: .78rem; } .mg-conf b { display: block; font-weight: 700; font-size: .86rem; } .mg-conf .mg-chip { margin-left: auto; }
.mg-av { display: inline-grid; place-items: center; width: 1.9rem; height: 1.9rem; border-radius: 50%; background: #E5F1F9; color: #004F82; font: 700 .68rem var(--mg-font-sans); flex: none; }
/* resultados: códigos, estados con subetiqueta */
.mg-codigo { display: inline-block; padding: .2rem .55rem; border-radius: 6px; background: #E5F1F9; color: #004F82; font: 700 .72rem var(--mg-font-sans); white-space: nowrap; }
.mg-st { display: grid; gap: .15rem; justify-items: start; font: 700 .82rem var(--mg-font-sans); color: var(--_c); } .mg-st::before { content: "• "; } .mg-st--verde { --_c: #2E7D32; } .mg-st--rojo { --_c: #D8002F; } .mg-st--dorado { --_c: #A87F00; } .mg-st .mg-chip { font-size: .6rem; padding: .1rem .4rem; }
.mg-resultados { margin: 1rem 0 .5rem; font: 700 .84rem var(--mg-font-sans); color: var(--mg-primary); }
.mg-sel { display: grid; gap: .3rem; } .mg-sel > .mg-lab { margin: 0; }
.mg-iconbtn--sm { width: 2rem; height: 2rem; border-radius: 8px; }
/* efectividad (barra segmentada) y celdas numéricas */
.mg-efec { display: flex; align-items: center; gap: .5rem; justify-content: flex-end; font-weight: 700; font-size: .78rem; } .mg-efec i { display: block; width: 3.2rem; height: 5px; border-radius: 4px; background: linear-gradient(90deg, #7BBF70 0 70%, #FEC800 70% 100%); }
.mg-n-ok { color: #2E7D32; font-weight: 600; } .mg-n-box { display: inline-block; min-width: 1.4rem; padding: .05rem .3rem; border-radius: 4px; background: #E5F1F9; color: #004F82; font-weight: 700; font-size: .74rem; text-align: center; }
.mg-tbl--c th, .mg-tbl--c td { text-align: center; } .mg-tbl--c th:first-child, .mg-tbl--c td:first-child { text-align: left; }
/* bitácora: lista + detalle con eventos */
.mg-bita { display: grid; gap: 1.25rem; grid-template-columns: minmax(16rem, 24rem) minmax(0, 1fr); align-items: start; } @media (max-width: 900px) { .mg-bita { grid-template-columns: 1fr; } }
.mg-caso { display: grid; gap: .3rem; width: 100%; padding: .75rem .85rem; border: 1px solid transparent; border-bottom-color: var(--mg-border); border-radius: 10px; background: none; text-align: left; font: 500 .8rem var(--mg-font-sans); color: var(--mg-gray-700); cursor: pointer; } .mg-caso:hover { background: #F4F6FA; } .mg-caso[aria-current="true"] { background: #F2F8FC; border-color: var(--mg-primary-200); } .mg-caso:focus-visible { outline: 2px solid var(--mg-primary); outline-offset: -2px; } .mg-caso b { font-weight: 700; color: var(--mg-gray-900); font-size: .82rem; } .mg-caso .fila { display: flex; gap: .35rem; align-items: center; flex-wrap: wrap; } .mg-caso .meta { display: flex; justify-content: space-between; gap: .5rem; font-size: .72rem; color: var(--mg-text-muted); }
.mg-eventos { list-style: none; margin: 0; padding: 0; display: grid; gap: 1rem; } .mg-evento { display: flex; gap: .75rem; } .mg-evento .ic { display: grid; place-items: center; width: 1.9rem; height: 1.9rem; border-radius: 8px; background: var(--_bg, #E5F1F9); color: var(--_c, #004F82); flex: none; } .mg-evento--verde { --_bg: #E8F5E9; --_c: #2E7D32; } .mg-evento--lila { --_bg: #EAE6F8; --_c: #4A2BA8; } .mg-evento--dorado { --_bg: #FFF1BF; --_c: #8A6A00; }
.mg-evento b { display: block; font: 700 .86rem var(--mg-font-sans); color: var(--mg-gray-900); } .mg-evento p { margin: .15rem 0 .35rem; font-size: .78rem; color: var(--mg-gray-600); } .mg-evento .tags { display: flex; gap: .35rem; flex-wrap: wrap; align-items: center; font-size: .68rem; color: var(--mg-text-muted); }
/* usuarios con avatar + rol con ícono */
.mg-usr { display: flex; align-items: center; gap: .65rem; } .mg-usr b { display: block; font-weight: 600; font-size: .84rem; } .mg-usr small { color: var(--mg-text-muted); font-size: .7rem; } .mg-rol { display: flex; align-items: center; gap: .5rem; } .mg-rol svg, .mg-rol gob-icono { color: var(--mg-primary); flex: none; } .mg-rol b { display: block; font-weight: 600; font-size: .84rem; } .mg-rol small { color: var(--mg-text-muted); font-size: .7rem; }
.mg-pager--simple { justify-content: space-between; } .mg-pager--simple a, .mg-pager--simple span.dis { color: var(--mg-gray-500); font-weight: 600; text-decoration: none; cursor: pointer; } .mg-pager--simple a:hover { color: var(--mg-primary); }
.mg-submit { width: 100%; justify-content: center; }
.mg-note { font-size: .74rem; color: var(--mg-text-muted); text-align: center; margin: .5rem 0 0; }
'''
q = R + r'\src\panel.css'
t = open(q, encoding='utf-8').read()
open(q, 'w', encoding='utf-8').write(t + css)
print('ok')
