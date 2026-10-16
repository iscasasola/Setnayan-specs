#!/usr/bin/env python3
"""Cut the Higgsfield kit pieces to transparent with a soft-shadow-preserving matte; trim; resize to 2x slot; encode.
Method per piece:
  H  = NOT floodfill(corners [+ centre seed], fuzz F)      -> the object plus the faint shadow core, opaque
  S  = clamp(maxchannel|pixel - bg| * G)                    -> the shadow halo, soft alpha
  A  = max(H, S) (H softened 1 px); RGB kept as generated (the halo's own grey)
  A3 = H opened (erode/dilate R) so the white card's thin edge line drops out; S masked to a dilation of that
  A6 = hue +14 deg, brightness 0.62 (raspberry -> rosewood family), gloss kept (a per-pixel scale, not a flat fill)
Originals in in/ are never written.
"""
import subprocess, json, os, sys
IN, OUT = "in", "cut"
os.makedirs(OUT, exist_ok=True)
def sh(*a):
    r = subprocess.run(list(a), capture_output=True, text=True)
    if r.returncode: print("ERR", " ".join(a)[:300], r.stderr[:400]); sys.exit(1)
    return r.stdout.strip()
def ident(p, fmt): return sh("magick", "identify", "-format", fmt, p)

# name, source, fuzz%, gain, css width or height (which), extra
PIECES = [
    ("drape",           "A1-drape.png",        4.0, 10, ("h", 260), {}),
    ("countdown-frame", "A2-column.png",       5.0, 10, ("h", 150), {"floor": "5.5%"}),
    ("corner-floral",   "A3-corner-spray.png", 4.0, 10, ("w", 150), {"open": 14, "seeds": [(.7,.7),(.9,.9),(.6,.95),(.95,.6),(.8,.5),(.5,.8)]}),
    ("rsvp-ornament",   "A4-garland.png",      4.0, 10, ("w", 343), {}),
    ("closing-frame",   "A5-oval-frame.png",   5.0,  9, ("w", 300), {"centre": True, "warm": True}),
    ("wax-seal",        "A6-wax-seal.png",     7.0,  8, ("w",  84), {"recolour": True}),
    ("chandelier",      "A7-chandelier.png",   5.0, 10, ("w", 140), {}),
    ("fan",             "A8-lace-fan.png",     4.0, 10, ("w", 150), {}),
    ("church",          "church-illustration-v2.png", 3.0, 4, ("w", 343), {"floor": "1%", "avifq": 44}),
]
ONLY = set(sys.argv[1:])
if os.path.exists(os.path.join(OUT, "report.json")): report_prev = json.load(open(os.path.join(OUT, "report.json")))
else: report_prev = {}
report = dict(report_prev)
for name, src, F, G, (which, css), x in PIECES:
    if ONLY and name not in ONLY: continue
    p = os.path.join(IN, src)
    w, h = (int(v) for v in ident(p, "%w %h").split())
    # background = mean of the four corner patches
    bg = sh("magick", p, "-gravity", "NorthWest", "(", "+clone", "-crop", "24x24+0+0", ")", "(", "+clone", "-gravity", "NorthEast", "-crop", "24x24+0+0", ")",
            "-delete", "0", "-append", "-scale", "1x1!", "-format", "%[pixel:p{0,0}]", "info:")
    seeds = [(1, 1), (w - 2, 1), (1, h - 2), (w - 2, h - 2), (w // 2, 1), (w // 2, h - 2), (1, h // 2), (w - 2, h // 2)]
    if x.get("centre"): seeds.append((w // 2, h // 2))
    for (fx, fy) in x.get("seeds", []): seeds.append((int(w * fx), int(h * fy)))
    draws = []
    for (sx, sy) in seeds: draws += ["-draw", f"alpha {sx},{sy} floodfill"]
    work = os.path.join(OUT, f"_{name}")
    # H: opaque object mask (white) from the flood
    if x.get("warm"):
        # H = (R - B) > 4.5%: the ivory carving is warm, the ground and its shadow are neutral; close pinholes, drop specks
        sh("magick", p, "-colorspace", "sRGB", "(", "+clone", "-channel", "R", "-separate", "+channel", ")", "(", "-clone", "0", "-channel", "B", "-separate", "+channel", ")",
           "-delete", "0", "-compose", "Minus_Src", "-composite", "-threshold", "4.5%", "-morphology", "Close", "Disk:3", "-morphology", "Open", "Disk:5", work + "_H.png")
    else:
        sh("magick", p, "-alpha", "set", "-fuzz", f"{F}%", "-fill", "none", *draws, "-alpha", "extract", "-threshold", "50%", "-morphology", "Open", "Disk:2", work + "_H.png")
    if x.get("open"):
        r = x["open"]
        sh("magick", work + "_H.png", "-morphology", "Open", f"Disk:{r}", "-define", "connected-components:area-threshold=3000", "-define", "connected-components:mean-color=true", "-connected-components", "8", "-threshold", "50%", work + "_H.png")
    # S: shadow halo alpha from the difference to the background
    if x.get("warm"):
        # shadow = how far below the ground's luminance a neutral pixel sits (the ground is ~93%); the halo fades to nothing at the ground
        sh("magick", p, "-colorspace", "Gray", "-negate", "-evaluate", "Subtract", "9%", "-evaluate", "Multiply", "7", "-clamp", "-colorspace", "sRGB", work + "_S.png")
        sh("magick", work + "_H.png", "-negate", work + "_notH.png"); sh("magick", work + "_S.png", work + "_notH.png", "-compose", "Multiply", "-composite", work + "_S.png")
    else:
      sh("magick", p, "(", "+clone", "-fill", bg, "-colorize", "100", ")", "-compose", "Difference", "-composite",
       "-separate", "-evaluate-sequence", "Max", "-evaluate", "Subtract", x.get("floor", "2.5%"), "-evaluate", "Multiply", str(G), "-clamp", work + "_S.png")
    if x.get("open"):
        sh("magick", work + "_H.png", "-morphology", "Dilate", "Disk:30", work + "_keep.png")
        sh("magick", work + "_S.png", work + "_keep.png", "-compose", "Multiply", "-composite", work + "_S.png")
    # A = max(H softened, S)
    sh("magick", work + "_H.png", "-blur", "0x0.7", work + "_S.png", "-compose", "Lighten", "-composite", work + "_A.png")
    rgb = p
    if x.get("recolour"):
        # raspberry -> rosewood: rotate hue toward red-orange, darken, keep the highlights' relative gloss
        sh("magick", p, "-channel", "R", "-evaluate", "Multiply", "0.62", "-channel", "G", "-evaluate", "Multiply", "0.50", "-channel", "B", "-evaluate", "Multiply", "0.42", "+channel",
           "-sigmoidal-contrast", "3x45%", work + "_rc.png")
        sh("magick", p, work + "_rc.png", work + "_H.png", "-compose", "Over", "-composite", work + "_rgb.png")
        rgb = work + "_rgb.png"
    sh("magick", rgb, work + "_A.png", "-alpha", "off", "-compose", "CopyOpacity", "-composite", "-fuzz", "1%", "-trim", "+repage", work + "_cut.png")
    tw, th = (int(v) for v in ident(work + "_cut.png", "%w %h").split())
    # 2x slot
    if which == "w": rw = css * 2; rh = round(th * rw / tw)
    else: rh = css * 2; rw = round(tw * rh / th)
    sh("magick", work + "_cut.png", "-filter", "Lanczos", "-resize", f"{rw}x{rh}!", os.path.join(OUT, name + ".png"))
    sh("cwebp", "-quiet", "-q", "78", "-alpha_q", "88", "-m", "6", os.path.join(OUT, name + ".png"), "-o", os.path.join(OUT, name + ".webp"))
    sh("magick", os.path.join(OUT, name + ".png"), "-quality", str(x.get("avifq", 50)), "-define", "heic:speed=4", os.path.join(OUT, name + ".avif"))
    info = dict(src=src, bg=bg, trim=[tw, th], render=[rw, rh], css=[rw / 2, rh / 2],
                webp=os.path.getsize(os.path.join(OUT, name + ".webp")), avif=os.path.getsize(os.path.join(OUT, name + ".avif")))
    if x.get("centre"):
        # the hole: transparent run along the centre row / column of the rendered piece
        row = sh("magick", os.path.join(OUT, name + ".png"), "-alpha", "extract", "-crop", f"{rw}x1+0+{rh // 2}", "+repage", "-depth", "8", "gray:-").encode("latin1") if False else None
        import struct
        raw = subprocess.run(["magick", os.path.join(OUT, name + ".png"), "-alpha", "extract", "-crop", f"{rw}x1+0+{rh // 2}", "+repage", "-depth", "8", "gray:-"], capture_output=True).stdout
        xs = [i for i, v in enumerate(raw) if v < 40 and rw * 0.2 < i < rw * 0.8]
        raw2 = subprocess.run(["magick", os.path.join(OUT, name + ".png"), "-alpha", "extract", "-crop", f"1x{rh}+{rw // 2}+0", "+repage", "-depth", "8", "gray:-"], capture_output=True).stdout
        ys = [i for i, v in enumerate(raw2) if v < 40 and rh * 0.2 < i < rh * 0.8]
        info["hole_css"] = dict(left=min(xs) / 2, right=max(xs) / 2, top=min(ys) / 2, bottom=max(ys) / 2) if xs and ys else None
    report[name] = info
    print(name, json.dumps(info))
json.dump(report, open(os.path.join(OUT, "report.json"), "w"), indent=1)
tot_w = sum(v["webp"] for v in report.values()); tot_a = sum(v["avif"] for v in report.values())
print("TOTAL", len(report), "pieces  webp", tot_w, " avif", tot_a)
