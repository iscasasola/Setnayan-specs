#!/usr/bin/env python3
"""'No religion chosen' hero v4 — couple silhouetted inside, looking out a wall of
floor-to-ceiling windows; each pane frames a different ceremony venue at sunset."""
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from collections import deque
import os, math

HERE=os.path.dirname(os.path.abspath(__file__))
SRC=os.path.join(HERE,"_wed_none_src")
SKY=os.path.join(SRC,"sky.webp"); CPL=os.path.join(SRC,"couple.webp")
W,H=1024,1280
ORDER=["1catholic","2muslim","3inc","4chinese","5bornagain","6christian","7cultural","8jewish"]

# ---- geometry ----
CEIL=int(0.05*H); SILL=int(0.72*H)
LEFT=int(0.025*W); RIGHT=int(0.975*W); PANES=8; MW=11           # mullion width
usable=RIGHT-LEFT; pane_w=(usable-(PANES+1)*MW)/PANES
bars=[LEFT+k*(pane_w+MW) for k in range(PANES+1)]               # mullion left-edges (9 bars)
centers=[int(bars[i]+MW+pane_w/2) for i in range(PANES)]        # pane centres
VBASE=int(0.515*H)                                             # where venues stand in the view

def key_sky(path,target_w):
    im=Image.open(path).convert("RGB"); s=target_w/im.width
    im=im.resize((target_w,int(im.height*s)),Image.LANCZOS); w,h=im.size; px=im.load()
    g=[[(px[x,y][0]*0.3+px[x,y][1]*0.59+px[x,y][2]*0.11) for x in range(w)] for y in range(h)]
    def pa(x,y):
        v=g[y][x]; m=0
        if x+1<w:m=max(m,abs(v-g[y][x+1]))
        if x>0:m=max(m,abs(v-g[y][x-1]))
        if y+1<h:m=max(m,abs(v-g[y+1][x]))
        if y>0:m=max(m,abs(v-g[y-1][x]))
        return v>150 and m<24
    sky=bytearray(w*h); dq=deque()
    for x in range(w):
        if pa(x,0): sky[x]=1; dq.append((x,0))
    for y in range(h):
        if pa(0,y) and not sky[y*w]: sky[y*w]=1; dq.append((0,y))
        if pa(w-1,y) and not sky[y*w+w-1]: sky[y*w+w-1]=1; dq.append((w-1,y))
    while dq:
        x,y=dq.popleft()
        for nx,ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0<=nx<w and 0<=ny<h and not sky[ny*w+nx] and pa(nx,ny): sky[ny*w+nx]=1; dq.append((nx,ny))
    keep=bytearray(w*h); dq=deque()
    for x in range(w):
        if not sky[(h-1)*w+x]: keep[(h-1)*w+x]=1; dq.append((x,h-1))
    while dq:
        x,y=dq.popleft()
        for nx,ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0<=nx<w and 0<=ny<h and not keep[ny*w+nx] and not sky[ny*w+nx]: keep[ny*w+nx]=1; dq.append((nx,ny))
    a=Image.new("L",(w,h),0); al=a.load()
    for y in range(h):
        for x in range(w):
            if keep[y*w+x]: al[x,y]=255
    a=a.filter(ImageFilter.GaussianBlur(0.7)); im=im.convert("RGBA"); im.putalpha(a); return im

def warm(im,dark=0.74):                # backlit warm grade so venues sit in the sunset
    px=im.load(); w,h=im.size; o=im.copy(); op=o.load()
    for y in range(h):
        for x in range(w):
            r,g,b,a=px[x,y]
            if a==0: continue
            L=(r*0.3+g*0.59+b*0.11)
            r=L+(r-L)*0.78; g=L+(g-L)*0.78; b=L+(b-L)*0.78          # desaturate toward warm
            r=min(255,r*dark*1.12+18); g=min(255,g*dark*0.97+9); b=min(255,b*dark*0.78+3)  # warm + darker
            op[x,y]=(int(r),int(g),int(b),a)
    return o

# ---------- 1. sky behind the glass ----------
sky=Image.open(SKY).convert("RGB")
# centre-crop the wide sky to the window aspect, keep the sun low-centre
winW=RIGHT-LEFT; winH=SILL-CEIL; aspect=winW/winH
sw,sh=sky.size
if sw/sh>aspect:
    nw=int(sh*aspect); sky=sky.crop(((sw-nw)//2,0,(sw+nw)//2,sh))
sky=sky.resize((winW,winH),Image.LANCZOS)
canvas=Image.new("RGB",(W,H),(18,16,19))
canvas.paste(sky,(LEFT,CEIL))
canvas=canvas.convert("RGBA")

# ---------- 2. venues standing in the view (one per pane) ----------
for i,name in enumerate(ORDER):
    v=key_sky(os.path.join(SRC,f"bld_{name}.webp"), int(pane_w*0.9))
    v=warm(v)
    a=v.split()[3].copy(); al=a.load()                       # fade base into the view
    n=int(v.height*0.12)
    for yy in range(v.height-n,v.height):
        t=(v.height-yy)/n
        for xx in range(v.width): al[xx,yy]=int(al[xx,yy]*t)
    v.putalpha(a)
    x=centers[i]-v.width//2; y=VBASE-v.height
    canvas.alpha_composite(v,(x,y))

# ---- horizon haze: ground the venues on a distant skyline, darken the view below it ----
hz=Image.new("RGBA",(W,H),(0,0,0,0)); hd=ImageDraw.Draw(hz)
for yy in range(CEIL,SILL):
    d=yy-VBASE
    if -0.045*H<d<0.05*H:
        t=1-abs(d)/(0.05*H); hd.line([(LEFT,yy),(RIGHT+MW,yy)],fill=(255,224,178,int(85*max(0,t))))
    if d>=0:
        hd.line([(LEFT,yy),(RIGHT+MW,yy)],fill=(70,46,40,int(38*min(1,d/(0.18*H)))))   # hazy ground below
canvas=Image.alpha_composite(canvas,hz)

# ---------- 3. window structure: mullions + frame ----------
fr=ImageDraw.Draw(canvas); MULL=(22,19,23,255); HI=(150,120,80,120)
# verticals
for bx in bars:
    fr.rectangle([bx,CEIL,bx+MW,SILL],fill=MULL)
    fr.line([(bx+1,CEIL),(bx+1,SILL)],fill=HI,width=1)        # warm glass highlight
# horizontals: head + a transom + sill
fr.rectangle([LEFT,CEIL,RIGHT+MW,CEIL+MW],fill=MULL)
ty=CEIL+int(winH*0.30); fr.rectangle([LEFT,ty,RIGHT+MW,ty+MW],fill=MULL)   # transom bar
fr.line([(LEFT,ty+1),(RIGHT+MW,ty+1)],fill=HI,width=1)
fr.rectangle([LEFT,SILL-MW,RIGHT+MW,SILL],fill=MULL)
# glass reflection streak
streak=Image.new("RGBA",(W,H),(0,0,0,0)); sd=ImageDraw.Draw(streak)
sd.polygon([(LEFT,SILL),(int(LEFT+winW*0.42),CEIL),(int(LEFT+winW*0.60),CEIL),(int(LEFT+winW*0.20),SILL)],fill=(255,245,225,16))
canvas=Image.alpha_composite(canvas,streak)
# ceiling
ImageDraw.Draw(canvas).rectangle([0,0,W,CEIL],fill=(16,14,17,255))

# ---------- 4. reflective floor (mirror the window, darkened) ----------
winimg=canvas.convert("RGB").crop((0,CEIL,W,SILL))
refl=winimg.transpose(Image.FLIP_TOP_BOTTOM)
floorH=H-SILL; refl=refl.resize((W,floorH),Image.LANCZOS).filter(ImageFilter.GaussianBlur(3))
refl=ImageEnhance.Brightness(refl).enhance(0.34)
ra=Image.new("L",(W,floorH),0); rad=ra.load()
for yy in range(floorH):
    v=int(150*(1-yy/floorH))                                  # fade reflection downward
    for xx in range(0,W): rad[xx,yy]=v
floor=Image.new("RGB",(W,floorH),(20,17,20))
floor=Image.composite(refl,floor,ra)
canvas.paste(floor,(0,SILL))
canvas=canvas.convert("RGBA")

# ---------- 5. warm sun glow bleeding into the room ----------
glow=Image.new("L",(W,H),0)
ImageDraw.Draw(glow).ellipse([int(W*0.30),int(0.30*H),int(W*0.70),int(0.66*H)],fill=255)
glow=glow.filter(ImageFilter.GaussianBlur(150))
canvas=Image.alpha_composite(canvas,Image.merge("RGBA",(*[Image.new("L",(W,H),c) for c in (255,210,150)],glow.point(lambda v:int(v*0.5)))))

# ---------- 6. couple silhouette + reflection ----------
cp=Image.open(CPL).convert("RGB"); cw,ch=cp.size
cp=cp.crop((int(cw*0.06),int(ch*0.05),int(cw*0.94),int(ch*0.82)))   # the two standing figures
gl=cp.convert("L").load(); m=Image.new("L",cp.size,0); ml=m.load()
for y in range(cp.height):
    for x in range(cp.width):
        ml[x,y]=255 if gl[x,y]<112 else 0
m=m.filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.GaussianBlur(0.6))
sil=Image.composite(Image.new("RGBA",cp.size,(12,10,14,255)),Image.new("RGBA",cp.size,(0,0,0,0)),m)
tH=int(0.50*H); s=tH/sil.height; sil=sil.resize((int(sil.width*s),tH),Image.LANCZOS)
cx=W//2-sil.width//2; feet=int(0.94*H); cy=feet-sil.height
# floor reflection of the couple
cr=sil.transpose(Image.FLIP_TOP_BOTTOM)
cra=cr.split()[3].point(lambda v:int(v*0.28)); cr.putalpha(cra)
cr=cr.filter(ImageFilter.GaussianBlur(2))
canvas.alpha_composite(cr,(cx,feet))
canvas.alpha_composite(sil,(cx,cy))

# ---------- 7. grade: vignette + grain ----------
canvas=canvas.convert("RGB")
vig=Image.new("L",(W,H),0)
ImageDraw.Draw(vig).ellipse([-int(W*0.22),-int(H*0.14),int(W*1.22),int(H*1.16)],fill=255)
vig=vig.filter(ImageFilter.GaussianBlur(int(W*0.12)))
canvas=Image.composite(canvas,Image.blend(canvas,Image.new("RGB",(W,H),(14,11,16)),0.45),vig)
grain=Image.effect_noise((W,H),12).convert("L")
canvas=Image.blend(canvas,Image.merge("RGB",(grain,grain,grain)),0.035)

canvas.save(os.path.join(HERE,"wed_none.webp"),"WEBP",quality=92,method=6)        # hi-res sibling of the faith set
canvas.save(os.path.join(HERE,"..","wed_none.webp"),"WEBP",quality=84,method=6)   # web-weight asset the onboarding HTML references
print("regenerated wed_none.webp (window panes)")
