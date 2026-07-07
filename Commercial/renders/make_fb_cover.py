#!/usr/bin/env python3
"""Setnayan Facebook cover — Clean Editorial, 1640x856, deterministic typography."""
from PIL import Image, ImageDraw, ImageFont

S = 2  # supersample
W, H = 1640 * S, 856 * S
CX = W // 2

# Clean Editorial palette
ALABASTER = (251, 251, 250)
OBSIDIAN  = (30, 34, 41)
GOLD      = (197, 160, 89)
WARMGREY  = (124, 120, 116)

DIDOT = "/System/Library/Fonts/Supplemental/Didot.ttc"
BASK  = "/System/Library/Fonts/Supplemental/Baskerville.ttc"

img = Image.new("RGB", (W, H), ALABASTER)
d = ImageDraw.Draw(img)

# very soft warm vignette top + bottom for depth (kept subtle, survives crops)
top = Image.new("L", (1, H), 0)
for y in range(H):
    # faint darkening only in the outer 12% top/bottom
    t = 0
    if y < H * 0.12:
        t = int(8 * (1 - y / (H * 0.12)))
    elif y > H * 0.88:
        t = int(8 * ((y - H * 0.88) / (H * 0.12)))
    top.putpixel((0, y), t)
shade = top.resize((W, H))
img = Image.composite(Image.new("RGB", (W, H), (238, 236, 232)), img, shade)
d = ImageDraw.Draw(img)

def font(path, size, idx=0):
    return ImageFont.truetype(path, int(size * S), index=idx)

def text_w(s, f, tracking=0):
    w = 0
    for ch in s:
        w += d.textlength(ch, font=f) + tracking * S
    return w - (tracking * S if s else 0)

def draw_tracked(cx, cy, s, f, fill, tracking=0):
    """Draw letter-spaced text centered at (cx, cy)."""
    total = text_w(s, f, tracking)
    x = cx - total / 2
    asc, desc = f.getmetrics()
    y = cy - (asc + desc) / 2
    for ch in s:
        d.text((x, y), ch, font=f, fill=fill)
        x += d.textlength(ch, font=f) + tracking * S

def fit_size(s, path, start, maxw, tracking, idx=0):
    sz = start
    while sz > 10:
        f = font(path, sz, idx)
        if text_w(s, f, tracking) <= maxw * S:
            return f
        sz -= 1
    return font(path, 10, idx)

MAXW = 1180  # mobile-safe central width (1x px)

# --- Eyebrow ---
eb = "A FILIPINO WEDDING PLATFORM"
f_eb = fit_size(eb, BASK, 25, 900, 9)
draw_tracked(CX, 276 * S, eb, f_eb, GOLD, tracking=9)

# --- Wordmark ---
wm = "SETNAYAN"
f_wm = fit_size(wm, DIDOT, 150, MAXW, 20)
draw_tracked(CX, 382 * S, wm, f_wm, OBSIDIAN, tracking=20)

# --- Gold hairline accent ---
rule_w = 150 * S
ry = 470 * S
d.line([(CX - rule_w // 2, ry), (CX + rule_w // 2, ry)], fill=GOLD, width=max(1, int(1.6 * S)))

# --- Tagline ---
tg = "Everything you need to start your wedding."
f_tg = fit_size(tg, BASK, 44, MAXW, 0)
d.text((CX, 526 * S), tg, font=f_tg, fill=OBSIDIAN, anchor="mm")

# --- Sub-line: claim + url (url in gold) ---
f_sub = font(BASK, 25)
left = "0% commission, always"
dot = "      ·      "
url = "setnayan.com"
trk = 3
wl = text_w(left, f_sub, trk)
wd = text_w(dot, f_sub, trk)
wu = text_w(url, f_sub, trk)
totw = wl + wd + wu
x = CX - totw / 2
sy = 586 * S
asc, desc = f_sub.getmetrics()
y = sy - (asc + desc) / 2
def run(x, s, fill, trk):
    for ch in s:
        d.text((x, y), ch, font=f_sub, fill=fill)
        x += d.textlength(ch, font=f_sub) + trk * S
    return x
x = run(x, left, WARMGREY, trk)
x = run(x, dot, GOLD, trk)
x = run(x, url, GOLD, trk)

# downscale for crisp anti-aliased type
out = img.resize((1640, 856), Image.LANCZOS)
out.save("/Users/icecasasola/Documents/Claude/Projects/Setnayan/Commercial/renders/fb_cover_v1.png", "PNG")
print("saved fb_cover_v1.png", out.size)
