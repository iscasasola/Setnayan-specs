"""Zone masks for the attire figures (Fable, 2026-10-16 prototype) — reads src/ cut/ mask/, writes zones/.
Never touches the shipped files. Run from controller-2026-10-12/attire-figures: python3 zones.py
"""
import os, json, numpy as np
from PIL import Image, ImageDraw, ImageFilter
H=280; Y0,Y1=16,1006
OUT='zones'; os.makedirs(OUT,exist_ok=True)
CUTOUTS = {  # build-webp.py's own, verbatim
  'suit':     [[(300,138),(366,138),(337,302),(318,302)]],
  'tux':      [[(302,136),(359,136),(331,312),(317,312)]],
  'suitb':    [[(305,195),(382,195),(382,235),(342,290),(305,235)],[(203,248),(259,238),(259,432),(209,447)],[(426,238),(482,258),(482,442),(429,432)]],
  'pantsuit': [[(300,198),(357,198),(351,307),(301,307)]],
}
def poly(*ps):
    im=Image.new('L',(688,1024),0); d=ImageDraw.Draw(im)
    for p in ps: d.polygon(p,fill=255)
    return np.asarray(im)>0
def box(x0,y0,x1,y1): return poly([(x0,y0),(x1,y0),(x1,y1),(x0,y1)])
def close(m,r=2):
    im=Image.fromarray((m*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(2*r+1)).filter(ImageFilter.MinFilter(2*r+1))
    return np.asarray(im)>127
class F:
    def __init__(s,n):
        s.n=n
        s.rgb=np.asarray(Image.open(f'src/{n}.png').convert('RGB')).astype(int)
        s.cut=Image.open(f'cut/{n}-cut.png').convert('RGBA')
        s.a=np.asarray(s.cut)[...,3]>200
        s.raw=(np.asarray(Image.open(f'mask/{n}-mask.png').convert('L'))>128)&s.a
        r,g,b=s.rgb[...,0],s.rgb[...,1],s.rgb[...,2]
        s.g=s.rgb.mean(2); s.sat=s.rgb.max(2)-s.rgb.min(2); s.rb=r-b
        s.champ=s.a&~s.raw&(s.g>165)&(s.sat>=12)&(s.sat<70)&(s.rb<55)
        s.khaki=s.a&~s.raw&(s.sat>=28)&(s.g<215)&(s.g>100)
        s.dark=s.a&(s.g<120)
        s.skin=s.a&~s.raw&(s.rb>=55)&((r-g)>(g-b))&(s.g>150)
        s.built=s.raw.copy()
        for p in CUTOUTS.get(n,[]): s.built&=~poly(p)
ZONES={}
def suit():
    f=F('suit'); z={}
    tie=close(poly([(320,146),(344,146),(349,230),(344,302),(322,302),(317,230)])&f.a&(f.sat>=28)&(f.g<215))
    chest=poly([(298,128),(372,128),(348,305),(316,305)])
    collar=poly([(302,124),(368,124),(362,160),(308,160)])&f.raw
    cuffs=(box(220,452,250,484)|box(388,402,414,434))&f.champ
    shirt=close(((chest&f.champ)|collar|cuffs)&~tie,1)
    z['c']=tie; z['b']=shirt; z['a']=f.built&~tie&~shirt
    return f,z,{'a':'Coat & pants','b':'Shirt','c':'Tie'}
def tux():
    f=F('tux'); z={}
    bow=f.raw&box(302,124,356,162); pocket=f.raw&box(372,170,412,190)
    acc=close(bow|pocket,1)
    chest=poly([(298,126),(366,126),(342,318),(312,318)])
    cuffs=(box(220,452,250,484)|box(388,402,414,434))&f.champ
    shirt=close(((chest&f.champ)|cuffs)&~acc,1)
    z['c']=acc; z['b']=shirt; z['a']=f.built&~acc&~shirt
    return f,z,{'a':'Tux','b':'Shirt','c':'Bow tie & pocket square'}
def shirt():
    f=F('shirt'); z={}
    pp=poly([(290,360),(412,360),(420,470),(414,560),(402,700),(396,945),(300,952),(292,700),(286,560),(298,470)])
    belt=pp&f.dark&box(280,355,425,392)
    pants=close((pp&f.a&~f.raw&(f.g>100)&~f.skin)|belt,2)
    z['b']=pants; z['a']=f.built&~pants
    return f,z,{'a':'Shirt','b':'Pants'}
def barong():
    f=F('barong'); z={}
    pants=close(f.dark&box(282,480,440,945),2)
    z['b']=pants; z['a']=f.built&~pants
    return f,z,{'a':'Barong','b':'Pants'}
def barongb():
    f=F('barongb'); z={}
    pants=close(f.dark&box(265,585,430,950),2)
    pillow=f.raw&poly([(262,392),(420,392),(420,472),(262,472)])
    z['b']=pants; z['a']=f.built&~pants&~pillow; z['keep']=pillow
    return f,z,{'a':'Barong','b':'Pants'}
def suitb():
    f=F('suitb'); z={}
    bow=close(box(302,214,390,260)&f.a&~f.raw&~f.skin&(f.sat>=16)&(f.g<238),4)
    body=poly(*CUTOUTS['suitb'])|box(300,180,392,215)
    placket=f.raw&poly([(318,232),(368,232),(346,292),(338,292)])
    shirt=(close((body&f.champ)&~bow,1)|placket)&~close(bow,1)
    pillow=f.raw&poly([(250,372),(400,372),(400,462),(250,462)])
    z['c']=bow; z['b']=shirt; z['a']=f.built&~bow&~shirt&~pillow; z['keep']=pillow
    return f,z,{'a':'Vest & pants','b':'Shirt','c':'Bow tie'}
def pantsuit():
    f=F('pantsuit'); z={}
    bl=poly(CUTOUTS['pantsuit'][0])&f.a&(f.g>120)&~(f.rb>=70)
    blouse=close(bl,3)
    z['b']=blouse; z['a']=f.built&~blouse
    return f,z,{'a':'Suit','b':'Blouse'}

def neutralise(f,zones):
    """paint every recolourable non-ivory zone the garment's own ivory, shading kept, so a tint is the exact colour."""
    rgb=f.rgb.astype(float)
    L=rgb.mean(2)
    A=zones['a']; lo_a,hi_a=np.percentile(L[A],[3,97])
    tint=rgb[A].mean(0)/rgb[A].mean()    # the ivory's warmth
    out=rgb.copy()
    for k,m in zones.items():
        if k in('a','keep') or not m.any(): continue
        # only pixels that are NOT already ivory need lifting (the tux bow is ivory already)
        need=m&~f.raw
        if need.sum()<30: continue
        lo,hi=np.percentile(L[need],[3,97])
        if hi-lo<1: hi=lo+1
        Ln=lo_a+(L[need]-lo)*(hi_a-lo_a)/(hi-lo)
        Ln=np.clip(Ln,0,255)
        out[need]=np.clip(Ln[:,None]*tint[None,:],0,255)
    return out
def to_alpha_webp(m,bx,path):
    im=Image.fromarray((m*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8)).crop(bx)
    w=round(im.width*H/im.height); im=im.resize((w,H),Image.LANCZOS)
    a=Image.new('RGBA',(w,H),(0,0,0,0)); a.putalpha(im); a.save(path,'WEBP',lossless=True,method=6); return (w,H)
report={}
for fn in (suit,tux,shirt,barong,barongb,suitb,pantsuit):
    f,z,labels=fn(); n=f.n
    bxa=f.cut.getchannel('A').getbbox(); x0,x1=max(0,bxa[0]-6),min(688,bxa[2]+6); bx=(x0,Y0,x1,Y1)
    rgb=neutralise(f,z)
    draw=Image.fromarray(rgb.astype(np.uint8)).convert('RGBA'); draw.putalpha(f.cut.getchannel('A'))
    c=draw.crop(bx); w=round(c.width*H/c.height); c=c.resize((w,H),Image.LANCZOS); c.save(f'{OUT}/{n}.webp','WEBP',quality=82,method=6)
    sizes={'draw':os.path.getsize(f'{OUT}/{n}.webp')}
    for k in('a','b','c'):
        if k in z:
            to_alpha_webp(z[k]&f.a,bx,f'{OUT}/{n}-{k}.webp'); sizes[k]=os.path.getsize(f'{OUT}/{n}-{k}.webp')
    report[n]={'w':w,'h':H,'zones':labels,'bytes':sizes}
    print(n,(w,H),labels,sizes)
json.dump(report,open(f'{OUT}/zones.json','w'),indent=1)
