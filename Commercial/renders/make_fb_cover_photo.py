#!/usr/bin/env python3
"""Setnayan FB cover v2 — editorial photo + composited crisp type."""
import math
from PIL import Image, ImageDraw, ImageFont

W, H = 1640, 856
CX = W // 2
IVORY = (251, 251, 250)
GOLD  = (203, 158, 75)
GOLDL = (214, 178, 110)

DIDOT = "/System/Library/Fonts/Supplemental/Didot.ttc"
BASK  = "/System/Library/Fonts/Supplemental/Baskerville.ttc"
SRC   = "/Users/icecasasola/Documents/Claude/Projects/Setnayan/Commercial/renders/cover_bg.webp"

# --- crop bg to 1640x856 (keep center) ---
bg = Image.open(SRC).convert("RGB")
scale = W / bg.width
bg = bg.resize((W, int(bg.height * scale)), Image.LANCZOS)
top = (bg.height - H) // 2
bg = bg.crop((0, top, W, top + H)).convert("RGBA")

# --- legibility scrim: soft full-width darken, peaking in the vertical middle ---
col = Image.new("L", (1, H))
for y in range(H):
    bell = 100 * math.exp(-((y - H / 2) / (H * 0.30)) ** 2)
    col.putpixel((0, y), min(255, int(26 + bell)))
alpha = col.resize((W, H))
scrim = Image.new("RGBA", (W, H), (18, 16, 14, 0))
scrim.putalpha(alpha)
bg = Image.alpha_composite(bg, scrim)

# --- text on a 2x layer for crisp type ---
SUP = 2
tl = Image.new("RGBA", (W * SUP, H * SUP), (0, 0, 0, 0))
d = ImageDraw.Draw(tl)

def font(path, size, idx=0):
    return ImageFont.truetype(path, int(size * SUP), index=idx)

def tw(s, f, trk):
    return sum(d.textlength(c, font=f) + trk * SUP for c in s) - (trk * SUP if s else 0)

def tracked(cx, cy, s, f, fill, trk):
    x = cx * SUP - tw(s, f, trk) / 2
    asc, desc = f.getmetrics()
    y = cy * SUP - (asc + desc) / 2
    for c in s:
        d.text((x, y), c, font=f, fill=fill)
        x += d.textlength(c, font=f) + trk * SUP

def fit(s, path, start, maxw, trk, idx=0):
    sz = start
    while sz > 10:
        f = font(path, sz, idx)
        if tw(s, f, trk) <= maxw * SUP:
            return f
        sz -= 1
    return font(path, 10, idx)

# soft shadow helper for type on photo
def tracked_sh(cx, cy, s, f, fill, trk):
    x0 = cx * SUP - tw(s, f, trk) / 2
    asc, desc = f.getmetrics()
    y0 = cy * SUP - (asc + desc) / 2
    for off in (3 * SUP, 2 * SUP):
        x = x0
        for c in s:
            d.text((x + 0, y0 + off), c, font=f, fill=(0, 0, 0, 55))
            x += d.textlength(c, font=f) + trk * SUP
    x = x0
    for c in s:
        d.text((x, y0), c, font=f, fill=fill)
        x += d.textlength(c, font=f) + trk * SUP

MAXW = 1180
tracked_sh(CX, 292, "A FILIPINO WEDDING PLATFORM", fit("A FILIPINO WEDDING PLATFORM", BASK, 25, 900, 9), GOLDL, 9)
tracked_sh(CX, 398, "SETNAYAN", fit("SETNAYAN", DIDOT, 150, MAXW, 20), IVORY, 20)

# gold rule
ry = 486 * SUP
d.line([(CX * SUP - 75 * SUP, ry), (CX * SUP + 75 * SUP, ry)], fill=GOLD + (255,), width=3)

# tagline (with shadow)
ftg = fit("Everything you need to start your wedding.", BASK, 44, MAXW, 0)
for off in (3 * SUP, 2 * SUP):
    d.text((CX * SUP, 542 * SUP + off), "Everything you need to start your wedding.", font=ftg, fill=(0, 0, 0, 60), anchor="mm")
d.text((CX * SUP, 542 * SUP), "Everything you need to start your wedding.", font=ftg, fill=IVORY, anchor="mm")

# sub line
fsub = font(BASK, 25)
trk = 3
left, dot, url = "0% commission, always", "      ·      ", "setnayan.com"
total = tw(left, fsub, trk) + tw(dot, fsub, trk) + tw(url, fsub, trk)
x = CX * SUP - total / 2
asc, desc = fsub.getmetrics()
y = 600 * SUP - (asc + desc) / 2
def run(x, s, fill):
    for c in s:
        d.text((x, y + 2 * SUP), c, font=fsub, fill=(0, 0, 0, 60))
        d.text((x, y), c, font=fsub, fill=fill)
        x += d.textlength(c, font=fsub) + trk * SUP
    return x
x = run(x, left, IVORY)
x = run(x, dot, GOLDL)
x = run(x, url, GOLDL)

tl = tl.resize((W, H), Image.LANCZOS)
out = Image.alpha_composite(bg, tl).convert("RGB")
out.save("/Users/icecasasola/Documents/Claude/Projects/Setnayan/Commercial/renders/fb_cover_v2.png", "PNG")
print("saved fb_cover_v2.png", out.size)
