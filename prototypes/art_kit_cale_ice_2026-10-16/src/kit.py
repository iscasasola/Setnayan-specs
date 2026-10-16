#!/usr/bin/env python3
"""
Art kit · Vintage (cale-ice) — seven hand-built SVG pieces with watercolour filters.
Every piece is drawn at 2x its phone slot. Seeded, so a re-run gives the same files.

Palette (cale-ice, live): Rosewood #5C0700 · Pandan #669C35 · Firebrick #B51A00 · Cream #F7F2EC
Dusty Rose #CFAFAF · Oxblood #351115 · Olive #646B38 · Marigold #F3E5B9 · Blush #E6C0B3
Garnet #803236 · Narra #6B4226
"""
import math, random, os, sys

OUT = sys.argv[1] if len(sys.argv) > 1 else "src"
os.makedirs(OUT, exist_ok=True)

P = dict(rosewood="#5C0700", pandan="#669C35", firebrick="#B51A00", cream="#F7F2EC",
         dusty="#CFAFAF", oxblood="#351115", olive="#646B38", marigold="#F3E5B9",
         blush="#E6C0B3", garnet="#803236", narra="#6B4226")

# ---------- shared defs ----------
def defs(seed=7, disp=7, rim=4, grain=0.22, extra=""):
    return f"""<defs>
<filter id="wc" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
 <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" seed="{seed}" result="n"/>
 <feDisplacementMap in="SourceGraphic" in2="n" scale="{disp}" xChannelSelector="R" yChannelSelector="G" result="d"/>
 <feGaussianBlur in="d" stdDeviation="0.5" result="s"/>
 <feMorphology in="d" operator="erode" radius="{rim}" result="inner"/>
 <feComposite in="s" in2="inner" operator="out" result="rimA"/>
 <feColorMatrix in="rimA" type="matrix" values="0.72 0 0 0 0  0 0.72 0 0 0  0 0 0.72 0 0  0 0 0 0.85 0" result="rim"/>
 <feBlend in="rim" in2="s" mode="multiply" result="b"/>
 <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="{seed+1}" result="g"/>
 <feColorMatrix in="g" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 {grain} 0" result="grain"/>
 <feComposite in="grain" in2="b" operator="in" result="gi"/>
 <feBlend in="gi" in2="b" mode="multiply"/>
</filter>
<filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
 <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="{seed+3}" result="n"/>
 <feDisplacementMap in="SourceGraphic" in2="n" scale="{disp*2}" xChannelSelector="R" yChannelSelector="G"/>
 <feGaussianBlur stdDeviation="3"/>
</filter>
<radialGradient id="g-garnet" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#B35A5E"/><stop offset=".55" stop-color="{P['garnet']}"/><stop offset="1" stop-color="{P['rosewood']}"/></radialGradient>
<radialGradient id="g-garnet-deep" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="{P['rosewood']}"/><stop offset="1" stop-color="{P['oxblood']}"/></radialGradient>
<radialGradient id="g-blush" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#FBEDE6"/><stop offset=".5" stop-color="{P['blush']}"/><stop offset="1" stop-color="#C98E86"/></radialGradient>
<radialGradient id="g-blush-deep" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#D9A196"/><stop offset="1" stop-color="#A86B66"/></radialGradient>
<radialGradient id="g-dusty" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#EEDADA"/><stop offset=".5" stop-color="{P['dusty']}"/><stop offset="1" stop-color="#A67E80"/></radialGradient>
<radialGradient id="g-dusty-deep" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#B98F91"/><stop offset="1" stop-color="#8A5E62"/></radialGradient>
<linearGradient id="g-leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8DB65A"/><stop offset=".5" stop-color="{P['olive']}"/><stop offset="1" stop-color="#3F4722"/></linearGradient>
<linearGradient id="g-leaf2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{P['pandan']}"/><stop offset=".6" stop-color="#4F6A2A"/><stop offset="1" stop-color="{P['olive']}"/></linearGradient>
<radialGradient id="g-samp" cx="45%" cy="40%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="{P['cream']}"/><stop offset="1" stop-color="#E4D3C3"/></radialGradient>
<linearGradient id="g-narra" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4A2B17"/><stop offset=".25" stop-color="#8A5A34"/><stop offset=".5" stop-color="{P['narra']}"/><stop offset=".8" stop-color="#8A5A34"/><stop offset="1" stop-color="#4A2B17"/></linearGradient>
<linearGradient id="g-narra-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A5A34"/><stop offset="1" stop-color="#4A2B17"/></linearGradient>
<linearGradient id="g-capiz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFDF8" stop-opacity=".95"/><stop offset=".5" stop-color="#F3E8DA" stop-opacity=".85"/><stop offset="1" stop-color="#E7D7C6" stop-opacity=".9"/></linearGradient>
<linearGradient id="g-velvet" x1="0" y1="0" x2="1" y2="0">
 <stop offset="0" stop-color="{P['oxblood']}"/><stop offset=".12" stop-color="{P['garnet']}"/><stop offset=".22" stop-color="{P['rosewood']}"/>
 <stop offset=".36" stop-color="#9A3B3E"/><stop offset=".48" stop-color="{P['rosewood']}"/><stop offset=".6" stop-color="{P['oxblood']}"/>
 <stop offset=".72" stop-color="{P['garnet']}"/><stop offset=".86" stop-color="{P['rosewood']}"/><stop offset="1" stop-color="{P['oxblood']}"/></linearGradient>
<linearGradient id="g-sash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2D6CB"/><stop offset=".5" stop-color="{P['blush']}"/><stop offset="1" stop-color="#B98A80"/></linearGradient>
<linearGradient id="g-wax" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9E3B3F"/><stop offset=".5" stop-color="{P['garnet']}"/><stop offset="1" stop-color="{P['rosewood']}"/></linearGradient>
<radialGradient id="g-wax-r" cx="38%" cy="30%" r="80%"><stop offset="0" stop-color="#B8555A"/><stop offset=".45" stop-color="{P['garnet']}"/><stop offset="1" stop-color="#3E0A08"/></radialGradient>
{extra}
</defs>"""

def svg(w, h, body, **kw):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'
            + defs(**kw) + body + "</svg>")

# ---------- motifs ----------
def petal(w, h):
    return f"M0 0 C{-w:.1f} {-h*0.35:.1f} {-w*0.85:.1f} {-h:.1f} 0 {-h:.1f} C{w*0.85:.1f} {-h:.1f} {w:.1f} {-h*0.35:.1f} 0 0 Z"

def ruffle(w, h):
    """a wide, cupped rose petal with a soft notch at the tip (base at the origin, tip up)"""
    return (f"M0 0 C{-w*0.9:.1f} {-h*0.15:.1f} {-w*1.08:.1f} {-h*0.72:.1f} {-w*0.38:.1f} {-h:.1f} "
            f"C{-w*0.12:.1f} {-h*1.06:.1f} {w*0.12:.1f} {-h*1.06:.1f} {w*0.38:.1f} {-h:.1f} "
            f"C{w*1.08:.1f} {-h*0.72:.1f} {w*0.9:.1f} {-h*0.15:.1f} 0 0 Z")

def rose(cx, cy, r, rot=0, tone="garnet", rnd=None):
    """a garden rose seen from above: three overlapping rings of cupped petals, each shaded at its base,
    closing on a tight spiral heart — overlapping translucent layers so the wash glazes."""
    rnd = rnd or random
    g, gd = f"url(#g-{tone})", f"url(#g-{tone}-deep)"
    out = [f'<g transform="translate({cx:.1f} {cy:.1f}) rotate({rot:.1f})">']
    rings = [(9, 0.56, 0.74, 0.46, .82, 0), (7, 0.46, 0.60, 0.30, .88, 20), (5, 0.36, 0.46, 0.17, .94, 45)]
    for (n, pw, ph, off, op, phase) in rings:
        for i in range(n):
            a = i * 360 / n + phase + rnd.uniform(-7, 7)
            d = ruffle(r*pw*rnd.uniform(.92, 1.08), r*ph*rnd.uniform(.9, 1.1))
            out.append(f'<g transform="rotate({a:.1f}) translate(0 {r*off:.1f}) rotate(180)">'
                       f'<path d="{d}" fill="{g}" opacity="{op}"/>'
                       f'<path d="{d}" fill="{gd}" opacity=".38" transform="scale(.55 .42)"/>'
                       f'<path d="{d}" fill="none" stroke="#FFF" stroke-opacity=".16" stroke-width="{max(1,r*0.035):.1f}"/>'
                       f'</g>')
    # the heart: a cupped centre with a spiral
    out.append(f'<circle r="{r*0.24:.1f}" fill="{gd}" opacity=".9"/>')
    sw = max(1, r*0.055)
    out.append(f'<path d="M{r*0.2:.1f} 0 A{r*0.2:.1f} {r*0.2:.1f} 0 1 1 {-r*0.1:.1f} {-r*0.17:.1f} A{r*0.11:.1f} {r*0.11:.1f} 0 1 1 {r*0.06:.1f} {r*0.08:.1f}" '
               f'fill="none" stroke="{P["oxblood"]}" stroke-opacity=".7" stroke-width="{sw:.1f}" stroke-linecap="round"/>')
    out.append(f'<path d="M{-r*0.3:.1f} {-r*0.26:.1f} A{r*0.36:.1f} {r*0.36:.1f} 0 0 1 {r*0.3:.1f} {-r*0.24:.1f}" fill="none" stroke="#FFF" stroke-opacity=".22" stroke-width="{sw:.1f}" stroke-linecap="round"/>')
    out.append("</g>")
    return "".join(out)

def leaf(cx, cy, L, W, rot, grad="g-leaf", op=.9):
    d = f"M0 0 Q{W:.1f} {-L*0.5:.1f} 0 {-L:.1f} Q{-W:.1f} {-L*0.5:.1f} 0 0 Z"
    return (f'<g transform="translate({cx:.1f} {cy:.1f}) rotate({rot:.1f})">'
            f'<path d="{d}" fill="url(#{grad})" opacity="{op}"/>'
            f'<path d="M0 {-L*0.08:.1f} L0 {-L*0.9:.1f}" stroke="#DCE6C4" stroke-opacity=".55" stroke-width="{max(1,W*0.12):.1f}" stroke-linecap="round"/></g>')

def sampaguita(cx, cy, r, rot=0):
    out = [f'<g transform="translate({cx:.1f} {cy:.1f}) rotate({rot:.1f})">']
    for i in range(6):
        out.append(f'<ellipse rx="{r*0.42:.1f}" ry="{r*0.95:.1f}" fill="url(#g-samp)" opacity=".95" transform="rotate({i*60}) translate(0 {-r*0.62:.1f})"/>')
    out.append(f'<circle r="{r*0.26:.1f}" fill="{P["marigold"]}"/><circle r="{r*0.12:.1f}" fill="#D9B86A" opacity=".8"/></g>')
    return "".join(out)

def bud(cx, cy, r, rot):
    return (f'<g transform="translate({cx:.1f} {cy:.1f}) rotate({rot:.1f})">'
            f'<ellipse rx="{r*0.45:.1f}" ry="{r:.1f}" fill="url(#g-samp)"/>'
            f'<path d="M{-r*0.45:.1f} 0 Q0 {r*0.9:.1f} {r*0.45:.1f} 0" fill="url(#g-leaf2)" opacity=".85"/></g>')

def vine(path_d, stroke=P["olive"], w=3, op=.85):
    return f'<path d="{path_d}" fill="none" stroke="{stroke}" stroke-opacity="{op}" stroke-width="{w}" stroke-linecap="round"/>'

def bezier_pt(p0, p1, p2, p3, t):
    u = 1 - t
    return (u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0],
            u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1])

def bezier_tan(p0, p1, p2, p3, t):
    u = 1 - t
    dx = 3*u*u*(p1[0]-p0[0]) + 6*u*t*(p2[0]-p1[0]) + 3*t*t*(p3[0]-p2[0])
    dy = 3*u*u*(p1[1]-p0[1]) + 6*u*t*(p2[1]-p1[1]) + 3*t*t*(p3[1]-p2[1])
    return math.degrees(math.atan2(dy, dx))

def garland_along(p0, p1, p2, p3, n, rnd, leafL=(22, 34), leafW=(7, 10), samp_every=3, buds=True, scale=1.0):
    """leaves alternating sides along a cubic, sampaguita every k-th node"""
    out = []
    for i in range(n):
        t = (i + 0.5) / n
        x, y = bezier_pt(p0, p1, p2, p3, t)
        ang = bezier_tan(p0, p1, p2, p3, t)
        side = 1 if i % 2 == 0 else -1
        L = rnd.uniform(*leafL) * scale
        W = rnd.uniform(*leafW) * scale
        out.append(leaf(x, y, L, W, ang + 90 * side + rnd.uniform(-28, 28), "g-leaf" if i % 3 else "g-leaf2"))
        if i % samp_every == 1:
            out.append(sampaguita(x + rnd.uniform(-4, 4), y + rnd.uniform(-4, 4), rnd.uniform(6, 8.5) * scale, rnd.uniform(0, 60)))
        elif buds and i % samp_every == 2 and rnd.random() < 0.6:
            out.append(bud(x, y, rnd.uniform(5, 7) * scale, ang + 90 * side))
    return "".join(out)

# ---------- 1. cover drape (240 x 1280) ----------
def piece_drape():
    rnd = random.Random(11)
    W, H = 240, 1280
    # the curtain body, tied back at ~58%
    # hangs from the left edge; the tieback at ~57% pulls the waist in toward the wall, the skirt flares out below
    body = ("M0 0 L216 0 C226 170 212 340 200 500 C190 610 160 680 112 728 "
            "C92 760 92 820 104 900 C122 1020 172 1120 234 1176 C214 1206 160 1222 108 1226 "
            "C66 1230 28 1226 0 1218 Z")
    hem = ('<path d="M0 1218 C28 1226 66 1230 108 1226 C160 1222 214 1206 234 1176 '
           'C216 1232 152 1266 92 1274 C56 1278 22 1272 0 1262 Z" fill="url(#g-velvet)" opacity=".92"/>')
    # soft fold shading: wide blurred bands, dark in the valleys, blush sheen on the ridges (the `soft` filter blurs them)
    folds = []
    for i, x in enumerate([22, 58, 96, 134, 170, 202]):
        folds.append(f'<path d="M{x} 0 C{x+8} 200 {x-2} 380 {x-14+i*3} 560 C{x-30+i*2} 650 {x-56+i*4} 700 {x-72+i*5} 728" '
                     f'fill="none" stroke="#1E0608" stroke-opacity=".42" stroke-width="{18+(i%2)*8}" stroke-linecap="round"/>')
        folds.append(f'<path d="M{x+16} 0 C{x+22} 220 {x+10} 400 {x+2+i*3} 560 C{x-14+i*2} 650 {x-40+i*4} 700 {x-56+i*5} 728" '
                     f'fill="none" stroke="#D08A8A" stroke-opacity=".20" stroke-width="7" stroke-linecap="round"/>')
    low = []
    for i, x in enumerate([100, 118, 136, 154, 172]):
        low.append(f'<path d="M{x} 760 C{x-10+i*3} 880 {x+16+i*8} 1000 {x+40+i*14} 1180" fill="none" stroke="#1E0608" stroke-opacity=".40" stroke-width="{14+(i%2)*6}" stroke-linecap="round"/>')
        low.append(f'<path d="M{x+8} 760 C{x-2+i*3} 880 {x+24+i*8} 1000 {x+48+i*14} 1180" fill="none" stroke="#D08A8A" stroke-opacity=".18" stroke-width="6" stroke-linecap="round"/>')
    # the blush tieback: a band around the waist, a knot, two tails with cut ends
    sash = ('<path d="M72 690 C110 672 160 676 206 702 L214 736 C166 712 118 708 80 728 Z" fill="url(#g-sash)" opacity=".97"/>'
            '<path d="M84 700 C120 686 160 690 200 712" fill="none" stroke="#FFF4EE" stroke-opacity=".55" stroke-width="4" stroke-linecap="round"/>'
            '<ellipse cx="150" cy="702" rx="22" ry="16" fill="url(#g-sash)"/>'
            '<ellipse cx="150" cy="702" rx="22" ry="16" fill="none" stroke="#B07E76" stroke-opacity=".6" stroke-width="2"/>'
            '<path d="M138 716 C128 790 118 860 128 940 L146 934 C140 870 146 800 160 718 Z" fill="url(#g-sash)" opacity=".95"/>'
            '<path d="M158 716 C170 790 182 850 170 930 L188 926 C194 860 184 790 176 716 Z" fill="url(#g-sash)" opacity=".95"/>'
            '<path d="M128 940 L137 926 L146 934 M170 930 L179 914 L188 926" fill="#F7F2EC" opacity=".9"/>')
    # a sampaguita sprig tucked in the knot
    sprig = (leaf(178, 712, 54, 14, -142, "g-leaf2") + leaf(166, 722, 48, 13, -112) + leaf(128, 722, 44, 12, 118) +
             sampaguita(170, 700, 12, 10) + sampaguita(186, 716, 9, 40) + sampaguita(132, 712, 9, 70) + bud(154, 684, 8, -20))
    # the brass rod and its rings
    rod = ('<rect x="0" y="0" width="240" height="8" fill="#8A6A3A" opacity=".9"/>'
           + "".join(f'<circle cx="{x}" cy="10" r="9" fill="none" stroke="#A98447" stroke-width="3"/>' for x in [22, 66, 110, 154, 198]))
    clip = f'<clipPath id="drapeclip"><path d="{body}"/><path d="M0 1218 C28 1226 66 1230 108 1226 C160 1222 214 1206 234 1176 C216 1232 152 1266 92 1274 C56 1278 22 1272 0 1262 Z"/></clipPath>'
    inner = (f'<path d="{body}" fill="url(#g-velvet)"/>' + hem +
             f'<g clip-path="url(#drapeclip)"><g filter="url(#soft)">{"".join(folds)}{"".join(low)}</g></g>')
    g = f'<g filter="url(#wc)">{inner}</g><g filter="url(#wc)">{sash}{sprig}</g>{rod}'
    return svg(W, H, g, seed=5, disp=5, rim=3, grain=0.18, extra=clip)

# ---------- 2. countdown frame — capiz arch column (128 x 460) ----------
def piece_column():
    rnd = random.Random(23)
    W, H = 128, 460
    capiz = ['<clipPath id="arch"><path d="M14 90 L14 56 A50 50 0 0 1 114 56 L114 90 Z"/></clipPath>',
             '<g clip-path="url(#arch)">']
    for yy in range(0, 100, 16):
        for xx in range(8, 124, 16):
            capiz.append(f'<rect x="{xx+1.5}" y="{yy+1.5}" width="13" height="13" rx="1.5" fill="url(#g-capiz)" opacity="{rnd.uniform(.8,1):.2f}"/>')
    capiz.append("</g>")
    capiz.append('<path d="M14 90 L14 56 A50 50 0 0 1 114 56 L114 90" fill="none" stroke="url(#g-narra-v)" stroke-width="7"/>')
    capiz.append("".join(f'<line x1="{x}" y1="8" x2="{x}" y2="92" stroke="{P["narra"]}" stroke-opacity=".55" stroke-width="2"/>' for x in [40, 64, 88]))
    capiz.append("".join(f'<line x1="14" y1="{y}" x2="114" y2="{y}" stroke="{P["narra"]}" stroke-opacity=".5" stroke-width="2"/>' for y in [40, 64]))
    capital = '<path d="M26 90 L102 90 L96 108 L32 108 Z" fill="url(#g-narra)"/><rect x="22" y="84" width="84" height="9" rx="3" fill="url(#g-narra)"/>'
    shaft = '<rect x="36" y="106" width="56" height="320" rx="4" fill="url(#g-narra)"/>'
    flutes = "".join(f'<line x1="{x}" y1="116" x2="{x}" y2="416" stroke="#2E1709" stroke-opacity=".32" stroke-width="2.5" stroke-linecap="round"/>' for x in [48, 60, 72, 84])
    base = '<path d="M30 424 L98 424 L104 440 L24 440 Z" fill="url(#g-narra)"/><rect x="18" y="438" width="92" height="16" rx="3" fill="url(#g-narra)"/>'
    # garland spiralling down the shaft
    p0, p1, p2, p3 = (98, 120), (20, 220), (120, 320), (40, 426)
    gar = garland_along(p0, p1, p2, p3, 14, rnd, leafL=(20, 30), leafW=(6, 9), samp_every=3)
    roses = rose(96, 146, 17, 20, "blush", rnd) + rose(44, 296, 15, -30, "dusty", rnd) + rose(88, 392, 13, 60, "garnet", rnd)
    inner = "".join(capiz) + capital + shaft + flutes + base
    g = f'<g filter="url(#wc)">{inner}</g><g filter="url(#wc)">{vine("M98 120 C20 220 120 320 40 426", w=2.5)}{gar}{roses}</g>'
    return svg(W, H, g, seed=9, disp=4, rim=2, grain=0.2)

# ---------- 3. heading flourish (400 x 72) ----------
def piece_flourish():
    rnd = random.Random(31)
    W, H = 400, 72
    p0, p1, p2, p3 = (44, 40), (140, 6), (220, 70), (396, 34)
    d = f"M{p0[0]} {p0[1]} C{p1[0]} {p1[1]} {p2[0]} {p2[1]} {p3[0]} {p3[1]}"
    gar = garland_along(p0, p1, p2, p3, 11, rnd, leafL=(16, 24), leafW=(5, 7), samp_every=4)
    r = rose(30, 38, 22, 15, "garnet", rnd) + leaf(12, 50, 26, 8, 120) + leaf(46, 58, 24, 7, 200, "g-leaf2")
    g = f'<g filter="url(#wc)">{vine(d, w=2.2)}{gar}{r}</g>'
    return svg(W, H, g, seed=13, disp=3, rim=2, grain=0.2)

# ---------- 4. RSVP ornament (686 x 180) ----------
def piece_rsvp():
    rnd = random.Random(41)
    W, H = 686, 180
    cx = 343
    parts = []
    # ribbon under
    # a blush ribbon, a real band: two edges, a twist at each shoulder, cut tails
    parts.append('<path d="M118 112 C210 146 296 158 343 148 C390 158 476 146 568 112 L560 132 C470 164 392 176 343 166 C294 176 216 164 126 132 Z" fill="url(#g-sash)" opacity=".92"/>')
    parts.append('<path d="M126 122 C216 154 294 166 343 157 C392 166 470 154 560 122" fill="none" stroke="#FFF4EE" stroke-opacity=".5" stroke-width="3"/>')
    parts.append('<path d="M118 112 L126 132 L96 150 L104 128 Z M568 112 L560 132 L590 150 L582 128 Z" fill="url(#g-sash)" opacity=".9"/>')
    parts.append('<path d="M96 150 L112 140 L104 128 M590 150 L574 140 L582 128" fill="#C9988E" opacity=".5"/>')
    # trailing vines each side
    for s in (1, -1):
        p0, p1, p2, p3 = (cx + s*60, 86), (cx + s*170, 30), (cx + s*230, 140), (cx + s*330, 96)
        parts.append(vine(f"M{p0[0]} {p0[1]} C{p1[0]} {p1[1]} {p2[0]} {p2[1]} {p3[0]} {p3[1]}", w=2.6))
        parts.append(garland_along(p0, p1, p2, p3, 10, rnd, leafL=(20, 32), leafW=(6, 9), samp_every=3))
    # leaf fan behind the centre
    for a in range(-150, 151, 30):
        parts.append(leaf(cx + rnd.uniform(-6, 6), 96, rnd.uniform(44, 62), rnd.uniform(12, 16), a + rnd.uniform(-8, 8), "g-leaf" if a % 60 else "g-leaf2", .9))
    # roses
    parts.append(rose(cx - 120, 98, 24, -20, "dusty", rnd))
    parts.append(rose(cx + 120, 98, 24, 25, "dusty", rnd))
    parts.append(rose(cx - 66, 90, 32, 10, "blush", rnd))
    parts.append(rose(cx + 66, 90, 32, -15, "blush", rnd))
    parts.append(rose(cx, 92, 46, 0, "garnet", rnd))
    # sampaguita sprinkle
    for (x, y, r) in [(cx-98, 62, 9), (cx+98, 62, 9), (cx-36, 128, 8), (cx+36, 128, 8), (cx-150, 120, 8), (cx+150, 120, 8), (cx, 42, 8)]:
        parts.append(sampaguita(x, y, r, rnd.uniform(0, 60)))
    g = f'<g filter="url(#wc)">{"".join(parts)}</g>'
    return svg(W, H, g, seed=17, disp=4, rim=2, grain=0.2)

# ---------- 5. corner floral (260 x 260) ----------
def piece_corner():
    rnd = random.Random(53)
    W, H = 260, 260
    parts = []
    # two vines out of the corner
    for (p0, p1, p2, p3) in [((40, 40), (120, 20), (170, 60), (250, 44)), ((40, 40), (20, 120), (60, 170), (44, 250))]:
        parts.append(vine(f"M{p0[0]} {p0[1]} C{p1[0]} {p1[1]} {p2[0]} {p2[1]} {p3[0]} {p3[1]}", w=2.6))
        parts.append(garland_along(p0, p1, p2, p3, 8, rnd, leafL=(22, 34), leafW=(7, 10), samp_every=3))
    for a in range(-20, 140, 28):
        parts.append(leaf(70 + rnd.uniform(-5, 5), 70 + rnd.uniform(-5, 5), rnd.uniform(60, 84), rnd.uniform(14, 18), a + rnd.uniform(-10, 10), "g-leaf" if a % 56 else "g-leaf2"))
    parts.append(rose(138, 58, 30, 30, "blush", rnd))
    parts.append(rose(58, 142, 28, -40, "dusty", rnd))
    parts.append(rose(74, 74, 46, 8, "garnet", rnd))
    for (x, y, r) in [(120, 112, 10), (112, 30, 8), (30, 112, 8), (150, 100, 7), (100, 150, 7)]:
        parts.append(sampaguita(x, y, r, rnd.uniform(0, 60)))
    g = f'<g filter="url(#wc)">{"".join(parts)}</g>'
    return svg(W, H, g, seed=19, disp=4, rim=2, grain=0.2)

# ---------- 6. section divider (600 x 48) ----------
def piece_divider():
    rnd = random.Random(61)
    W, H = 600, 48
    parts = []
    parts.append(f'<path d="M30 24 L262 24 M338 24 L570 24" stroke="url(#g-narra)" stroke-width="2" stroke-linecap="round"/>')
    for x in list(range(60, 250, 30)) + list(range(350, 560, 30)):
        parts.append(f'<rect x="{x-5}" y="19" width="10" height="10" rx="1.5" transform="rotate(45 {x} 24)" fill="url(#g-capiz)" stroke="{P["narra"]}" stroke-opacity=".6" stroke-width="1.2"/>')
    parts.append(leaf(282, 26, 30, 8, 110) + leaf(318, 26, 30, 8, -110, "g-leaf2") + leaf(292, 34, 22, 6, 150) + leaf(308, 34, 22, 6, -150))
    parts.append(sampaguita(300, 24, 12, 0))
    parts.append(bud(272, 18, 7, -60) + bud(328, 18, 7, 60))
    g = f'<g filter="url(#wc)">{"".join(parts)}</g>'
    return svg(W, H, g, seed=23, disp=2, rim=1, grain=0.18)

# ---------- 7. wax seal (168 x 168) — the centre stays blank for the couple's own mark ----------
def piece_seal():
    W, H = 168, 168
    body = ('<path d="M84 12 C116 8 150 30 156 62 C162 96 150 140 112 154 C78 166 30 150 18 112 C8 80 22 40 52 20 C62 14 72 13 84 12 Z" fill="url(#g-wax-r)"/>'
            '<circle cx="84" cy="84" r="60" fill="none" stroke="#3E0A08" stroke-opacity=".55" stroke-width="6"/>'
            '<circle cx="84" cy="84" r="56" fill="none" stroke="#C06A6E" stroke-opacity=".45" stroke-width="2.5"/>'
            '<circle cx="84" cy="84" r="46" fill="url(#g-wax)" opacity=".85"/>'
            '<circle cx="84" cy="84" r="46" fill="none" stroke="#3E0A08" stroke-opacity=".4" stroke-width="2"/>'
            '<path d="M44 60 C56 40 84 32 112 44" fill="none" stroke="#E7A3A6" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/>')
    g = f'<g filter="url(#wc)">{body}</g>'
    return svg(W, H, g, seed=29, disp=6, rim=5, grain=0.24)

# ---------- 8. closing frame — an oval of lace-like filigree, open centre for the couple's photo (600 x 760) ----------
def piece_closing_frame():
    rnd = random.Random(71)
    W, H = 600, 760
    cx, cy, rx, ry = 300, 380, 232, 318
    parts = []
    # the lace ring: three hairlines in cream/narra, slightly offset, with a scalloped edge
    for (k, col, op, w) in [(1.0, "#E9DCCB", .95, 10), (1.06, P["narra"], .55, 1.6), (0.94, P["narra"], .45, 1.4)]:
        parts.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx*k:.0f}" ry="{ry*k:.0f}" fill="none" stroke="{col}" stroke-opacity="{op}" stroke-width="{w}"/>')
    # scallops
    n = 48
    for i in range(n):
        a = 2*math.pi*i/n
        x, y = cx + math.cos(a)*rx*1.09, cy + math.sin(a)*ry*1.09
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="7" fill="none" stroke="#E9DCCB" stroke-width="3" opacity=".9"/>')
    # vines riding the ring, leaves and sampaguita, denser at the crown and the foot
    for i in range(36):
        a = 2*math.pi*i/36 + rnd.uniform(-.04, .04)
        x, y = cx + math.cos(a)*rx, cy + math.sin(a)*ry
        tan = math.degrees(math.atan2(math.sin(a)*rx, -math.cos(a)*ry))  # tangent direction
        dense = abs(math.sin(a)) > .75
        side = 1 if i % 2 else -1
        parts.append(leaf(x, y, rnd.uniform(18, 30)*(1.3 if dense else 1), rnd.uniform(6, 8), tan + 90*side + rnd.uniform(-30, 30), "g-leaf" if i % 3 else "g-leaf2", .8))
        if i % 3 == 0:
            parts.append(sampaguita(x + rnd.uniform(-5, 5), y + rnd.uniform(-5, 5), rnd.uniform(7, 10), rnd.uniform(0, 60)))
    parts.append(rose(cx, cy - ry - 4, 30, 0, "garnet", rnd))
    parts.append(rose(cx - 44, cy - ry + 10, 20, -20, "blush", rnd))
    parts.append(rose(cx + 44, cy - ry + 10, 20, 20, "dusty", rnd))
    parts.append(rose(cx, cy + ry + 2, 22, 0, "blush", rnd))
    g = f'<g filter="url(#wc)">{"".join(parts)}</g>'
    return svg(W, H, g, seed=37, disp=3, rim=2, grain=0.18)

PIECES = {
    "drape": piece_drape, "countdown-frame": piece_column, "heading-flourish": piece_flourish,
    "rsvp-ornament": piece_rsvp, "corner-floral": piece_corner, "divider": piece_divider, "wax-seal": piece_seal,
    "closing-frame": piece_closing_frame,
}
for name, fn in PIECES.items():
    with open(os.path.join(OUT, name + ".svg"), "w") as f:
        f.write(fn())
    print("wrote", name)
