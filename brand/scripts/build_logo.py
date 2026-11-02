"""
RENAURA — يرسم ملفات الشعار (SVG) من جديد.

التشغيل (من مجلد المشروع):
    pip install fonttools brotli
    python3 brand/scripts/build_logo.py
    node brand/scripts/export_png.js      # يطلع نسخ PNG وأيقونات المتصفح

تبين تغيرين لون؟ عدّلي الألوان تحت (RED / OLIVE / CREAM / SKIN) وشغلي الأمرين.
الخط Cormorant Garamond يتنزل تلقائياً أول مرة من Google Fonts.
الكتابة تتحول لرسم (outlines) عشان الشعار يطلع صح على أي جهاز.
"""
import os, urllib.request
HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")
OUT = os.path.join(HERE, "..", "logo") + os.sep

def ensure_fonts():
    os.makedirs(FONTS, exist_ok=True)
    need = [w for w in (400, 500) if not os.path.exists(os.path.join(FONTS, f"corm-{w}.ttf"))]
    if not need: return
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer
    css = urllib.request.urlopen(urllib.request.Request(
        "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&display=swap",
        headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"})).read().decode()
    import re
    latin = re.findall(r"/\* latin \*/.*?url\((.*?)\)", css, re.S)
    url = (latin or re.findall(r"url\((.*?)\)", css))[0]
    var = os.path.join(FONTS, "corm-var.woff2")
    urllib.request.urlretrieve(url, var)
    for w in need:
        f = instancer.instantiateVariableFont(TTFont(var), {"wght": w}); f.flavor = None
        f.save(os.path.join(FONTS, f"corm-{w}.ttf"))
ensure_fonts()

import math
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
def loader(p):
    f=TTFont(p); return f,f.getGlyphSet(),f.getBestCmap(),f['hmtx'],f['head'].unitsPerEm
F5=loader(os.path.join(FONTS,'corm-500.ttf')); F4=loader(os.path.join(FONTS,'corm-400.ttf'))
def text_fit(F,txt,size,cx,base,target):
    f,gs,cmap,hmtx,upm=F; sc=size/upm
    adv=[hmtx[cmap[ord(c)]][0]*sc if c!=' ' else size*0.25 for c in txt]
    # textLength: total = sum(adv)+gap*(n-1)... SVG lengthAdjust spacing distributes after each glyph incl last; mimic: extra per glyph
    extra=(target-sum(adv))/len(txt)
    x=cx-target/2+extra/2*0; ds=[]
    x=cx-target/2
    for c,a in zip(txt,adv):
        if c!=' ':
            pen=SVGPathPen(gs); gs[cmap[ord(c)]].draw(TransformPen(pen,(sc,0,0,-sc,x,base))); ds.append(pen.getCommands())
        x+=a+extra
    return ' '.join(ds)
fmt=lambda P:'M'+' L'.join(f'{x:.2f},{y:.2f}' for x,y in P)
def arc_tex(cx,cy,r,a0,a1,kind,P,step=0.25):
    L=abs(a1-a0)*math.pi/180*r; n=int(L/step); out=[]
    per,amp,bx,by=P[kind]; taper=6
    for i in range(n+1):
        s=i*step; a=math.radians(a0+(a1-a0)*i/n)
        px,py=cx+r*math.cos(a),cy+r*math.sin(a); tx,ty=-math.sin(a),math.cos(a); nx,ny=-math.cos(a),-math.sin(a)
        k=min(1,s/taper,(L-s)/taper)
        if kind=='straight': dt=dn=0
        else: ph=2*math.pi*s/per; dt=-bx*k*math.sin(ph); dn=amp*k*math.sin(ph)+by*k*(1-math.cos(ph))
        out.append((px+tx*dt+nx*dn,py+ty*dt+ny*dn))
    return fmt(out)
P={'straight':(1,0,0,0),'wavy':(16,2.6,0,0),'curly':(10.5,0,3.0,3.4),'coily':(6,0,1.9,2.2)}
SKIN=['#E3B793','#C68E64','#9A6443','#5C3722']; SKIN_L=['#FBE9DC','#EFC7A6','#D9A07A','#C99066']
RED='#8E1B22'; OLIVE='#3E4130'; CREAM='#F4EFEA'
def arcs(cx,cy,sc,cols,sw=2.8):
    rs=[(64,'straight'),(51,'wavy'),(38,'curly'),(24,'coily')]
    Ps={k:(v[0]*sc,v[1]*sc,v[2]*sc,v[3]*sc) if k!='straight' else v for k,v in P.items()}
    g=''.join(f'<path d="{arc_tex(cx,cy,r*sc,180,360,k,Ps,step=0.25*sc)}" stroke="{c}"/>' for (r,k),c in zip(rs,cols))
    return f'<g fill="none" stroke-width="{sw*sc:.2f}" stroke-linecap="round" stroke-linejoin="round">{g}</g><circle cx="{cx}" cy="{cy-2*sc:.2f}" r="{4.5*sc:.2f}" fill="{{dot}}"/>'
def svg(vb,body,scale=2):
    w,h=vb; return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w*scale}" height="{h*scale}">{body}</svg>'
def stacked(name,tag,dot,cols,tagline=True):
    # crop of lg-rise: x 40..480, y 6..184
    body=f'<g transform="translate(-40,-8)">'+arcs(260,80,1,cols).replace('{dot}',dot)
    body+=f'<path d="{text_fit(F5,"RENAURA",54,260,138,400)}" fill="{name}"/>'
    if tagline: body+=f'<path d="{text_fit(F4,"SKIN · HAIR · GLOW",12,260,172,230)}" fill="{tag}"/>'
    body+='</g>'
    return svg((440,176 if tagline else 146),body)
def horizontal(name,tag,dot,cols):
    body=arcs(78,96,1,cols).replace('{dot}',dot)
    body+=f'<path d="{text_fit(F5,"RENAURA",54,334,92,330)}" fill="{name}"/>'
    body+=f'<path d="{text_fit(F4,"SKIN · HAIR · GLOW",12,334,122,196)}" fill="{tag}"/>'
    return svg((512,130),body)
def icon(bg,dot,cols,rx=96):
    S=512; sc=3.2
    body=f'<rect width="{S}" height="{S}" rx="{rx}" fill="{bg}"/>'+arcs(256,352,sc,cols).replace('{dot}',dot)
    return svg((S,S),body,1)
out=OUT
files={
 'renaura-logo.svg':stacked(RED,OLIVE,OLIVE,SKIN),
 'renaura-logo-no-tagline.svg':stacked(RED,OLIVE,OLIVE,SKIN,False),
 'renaura-logo-horizontal.svg':horizontal(RED,OLIVE,OLIVE,SKIN),
 'renaura-logo-light.svg':stacked(CREAM,'#D8CFC4',CREAM,SKIN_L),
 'renaura-logo-horizontal-light.svg':horizontal(CREAM,'#D8CFC4',CREAM,SKIN_L),
 'renaura-icon.svg':icon(CREAM,RED,SKIN),
 'renaura-icon-red.svg':icon(RED,CREAM,SKIN_L),
}
for k,v in files.items(): open(out+k,'w').write(v)
open(os.path.join(HERE,'..','colors.txt'),'w').write('''RENAURA – Palette A
Velvet Red   #8E1B22  (brand name, buttons, prices)
Dark Olive   #3E4130  (body text, menus, tagline)
Light Cream  #F4EFEA  (background)

Skin tones in the arcs (outer to inner):
#E3B793 straight · #C68E64 wavy · #9A6443 curly · #5C3722 coily

Font: Cormorant Garamond (Google Fonts) – logo text is converted to outlines.
''')

def mark(cols,dot):
    body=f'<g transform="translate(-6,-12)">'+arcs(78,96,1,cols).replace('{dot}',dot)+'</g>'
    return svg((156,90),body)
open(out+'renaura-mark.svg','w').write(mark(SKIN,OLIVE))

def horizontal_nt(name,dot,cols):
    body='<g transform="translate(0,-24)">'+arcs(78,96,1,cols).replace('{dot}',dot)
    body+=f'<path d="{text_fit(F5,"RENAURA",58,334,98,330)}" fill="{name}"/></g>'
    return svg((512,84),body)
open(out+'renaura-logo-horizontal-no-tagline.svg','w').write(horizontal_nt(RED,OLIVE,SKIN))
