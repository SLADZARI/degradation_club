#!/usr/bin/env python3
"""Dementor Live: code-drawn ISO30 paper-world SVG->PNG candidate batch. No live game edits."""
from __future__ import annotations
from pathlib import Path
from xml.etree import ElementTree as ET
from PIL import Image, ImageDraw, ImageFont
import cairosvg, json, hashlib, zipfile, re, io, math
ROOT=Path(__file__).resolve().parent
# Supports both standalone ZIP (source/svg/) and a checked-out game repo.
REPO_RUNTIME=ROOT.parent.parent if ROOT.name=='world-art-batch01' and ROOT.parent.name=='tools' else None
SVG=REPO_RUNTIME/'assets-source'/'world-art-batch01' if REPO_RUNTIME and (REPO_RUNTIME/'assets-source'/'world-art-batch01').is_dir() else ROOT/'source'/'svg'
PNG=ROOT/'build'/'png_256'; SVG.mkdir(parents=True,exist_ok=True);PNG.mkdir(parents=True,exist_ok=True)
C={'wood':'#B3946D','woodlight':'#D0B38A','wooddark':'#8C7D66', 'stone':'#92938B','stonelight':'#C4C6B9','stonedark':'#6E7772','olive':'#526C4D','sage':'#81936B','grass':'#A3B18F','cream':'#E7D8BA','ochre':'#C9965B','terra':'#B8654D','water':'#8CAFB5','deep':'#566F78','ivory':'#F0E5CF','night':'#45515B','muted':'#7D8877'}
# The named sources are all separately grounded in the current RC4 or explicitly isolated design branches.
ASSETS=[
('city-register','Реестр городов: физический стенд','civic','RC4','DL-024','notice'),
('seed-shop-drop','Приёмный ящик семенной лавки','civic','RC4','DL-029','crate'),
('public-garden-drop','Приёмный ящик общественного огорода','civic','RC4','DL-030','crate-green'),
('donation-box','Коробка пожертвований','civic','RC4','DL-031','donation'),
('monument-pedestal','Пьедестал памятника','civic','RC4','DL-034','pedestal'),
('jukebox','Музыкальный автомат','civic','RC4','DL-035','jukebox'),
('survey-marker','Межевой столбик','civic','RC4','DL-037','marker'),
('city-water','Общественный источник воды','civic','RC4','DL-041','well'),
('dropped-cargo','Выложенные вещи на земле','prop','RC4','DL-047','sack'),
('stone-cluster-2','Залежь камня 2×2','nature','RC4','DL-054','rock-small'),
('stone-cluster-5','Залежь камня 5×5','nature','RC4','DL-054','rock-large'),
('desert-cactus','Кактус пустынного биома','nature','RC4','world-desert-cactus','cactus'),
('mountain-cliff','Скала горного массива','nature','RC4','world-mountain-cliff','mountain'),
('mountain-trail-sign','Указатель горной тропы','civic','RC4','world-mountain-route','sign'),
('second-bridge','Второй мост · готовое состояние','building','RC4','world-bridge-02','bridge'),
('payphone','Уличный таксофон','civic','RC4','world-payphone','phone'),
('industrial-pavilion','Промышленный павильон','building','RC4','world-industrial-pavilion','warehouse'),
('garden-sapling','Дерево: стадия саженца','nature','RC4','world-forestry-sapling','sapling'),
('garden-grown-spruce','Выращенная ель · взрослая','nature','RC4','world-forestry-spruce','spruce'),
('interior-room','Внутренняя комната: угол стен','interior','GRID-02','room-wall','room'),
('interior-chest','Сундук в интерьере','furniture','GRID-02','chest','chest'),
('interior-bed','Кровать в интерьере','furniture','GRID-02','bed','bed'),
('interior-table','Стол для внутренних помещений','furniture','GRID-02','interior-table-proposal','table'),
('interior-chair','Стул для внутренних помещений','furniture','GRID-02','DL-NEW-CHAIR-01','chair'),
('ideas-forest-billboard','Информационный билборд леса идей','civic','WORLD-01','world01-billboard','billboard'),
('ideas-forest-portal','Портал леса идей','civic','WORLD-01','world01-portal','portal'),
('ideas-forest-scooter','Стойка самоката','prop','WORLD-01','world01-scooter-rack','scooter'),
('mentalhumor-museum','Музей смеха · здание','building','WORLD-02','mentalhumor-museum','museum'),
('mentalhumor-exhibit','Исследовательский стенд музея','furniture','WORLD-02','mentalhumor-research-demo','exhibit'),
('cave-lantern','Фонарь для пещеры','prop','CAVE-P0','cave-lantern','lantern'),
('cave-secret-door','Секретная дверь пещеры','building','CAVE-P0','cave-secret-door','secret'),
('cave-altar','Алтарь за секретной дверью','furniture','CAVE-P0','cave-altar','altar'),
('cave-bat','Летучая мышь пещеры','nature','CAVE-P0','cave-bats','bat'),
('obitel-black-arch','Чёрная арка входа ZEN','building','OBITEL-P0','obitel-zen-arch','arch'),
('obitel-card-station','Карточка ZEN (7 позиций)','civic','OBITEL-P0','OB-C01..OB-C07','card'),
]

def pt(points, fill, stroke='none',sw=0,extra=''):
    return f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x,y in points)}" fill="{C.get(fill,fill)}" stroke="{C.get(stroke,stroke)}" stroke-width="{sw}" {extra}/>'
def path(d,fill,stroke='none',sw=0):return f'<path d="{d}" fill="{C.get(fill,fill)}" stroke="{C.get(stroke,stroke)}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"/>'
def ellipse(cx,cy,rx,ry,fill):return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{C.get(fill,fill)}"/>'
def rect(x,y,w,h,fill,rx=0):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{C.get(fill,fill)}"/>'
def line(x1,y1,x2,y2,stroke,sw):return f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{C.get(stroke,stroke)}" stroke-width="{sw}" stroke-linecap="round" fill="none"/>'
def block(cx,y,w=200,d=110,h=70,top='woodlight',right='wooddark',left='wood'):
    a=(cx,y-d/2);b=(cx+w/2,y);c=(cx,y+d/2);dpt=(cx-w/2,y)
    return ''.join([pt([a,b,c,dpt],top),pt([dpt,c,(cx,y+d/2+h),(cx-w/2,y+h)],left),pt([b,c,(cx,y+d/2+h),(cx+w/2,y+h)],right)])
def roof(cx,y,w=230,h=78):
    return pt([(cx,y-h),(cx+w/2,y-30),(cx,y+36),(cx-w/2,y-30)],'terra')+pt([(cx,y-h),(cx-w/2,y-30),(cx,y+36)],'ochre')
def stem(x,y,h=110,col='wood'):
    return pt([(x-10,y),(x-10,y-h),(x+9,y-h+4),(x+9,y)],col)
def notice():
    s=stem(195,440,192)+stem(313,440,192)
    s+=pt([(152,224),(306,205),(360,228),(207,251)],'woodlight')+pt([(152,224),(207,251),(207,342),(152,319)],'wood')+pt([(207,251),(360,228),(360,313),(207,342)],'cream')
    return s+rect(232,262,84,10,'sage',3)+rect(232,283,62,9,'ochre',3)
def crate(green=False):
    return block(255,323,200,107,100,'sage' if green else 'woodlight','olive' if green else 'wooddark','grass' if green else 'wood')+pt([(209,313),(254,289),(302,313),(256,341)],'cream')
def donation():return block(256,321,175,102,86,'ochre','wooddark','wood')+rect(244,305,32,7,'night',3)+pt([(253,270),(268,263),(273,278)],'terra')
def pedestal():return block(256,316,225,128,102,'stonelight','stonedark','stone')+block(257,241,140,80,35,'cream','stone','stonelight')
def jukebox():
    return block(256,368,153,73,80,'wood','wooddark','ochre')+path('M189 354 L189 220 Q191 176 257 174 Q326 174 326 220 L326 354 Z','terra')+path('M211 320 L211 222 Q218 198 257 199 Q295 198 304 222 L304 320 Z','cream')+pt([(218,283),(304,283),(304,305),(218,305)],'sage')+rect(234,240,43,25,'ochre',8)
def marker():return stem(258,415,140,'stone')+pt([(239,282),(257,269),(277,281),(277,296),(257,305),(239,294)],'terracotta' if False else 'terra')
def well():
    s=block(256,346,179,114,68,'stonelight','stone','stonedark')
    s+=ellipse(255,346,50,24,'night')+ellipse(255,342,37,12,'water')+stem(185,320,173)+stem(324,320,173)
    return s+roof(255,199,210,47)
def sack():return path('M220 275 Q238 286 239 307 Q180 359 207 408 Q256 445 304 406 Q328 368 291 313 Q290 285 304 273 Q266 280 220 275 Z','ochre')+path('M235 310 Q254 320 286 310','none','wooddark',5)
def rock(large=False):
    w=240 if large else 170;top=188 if large else 250;low=415
    return pt([(256-w*.49,324),(256-w*.25,top+30),(262,top),(256+w*.33,top+45),(256+w*.50,320),(256+w*.38,low),(256-w*.35,low)],'stone')+pt([(262,top),(256+w*.33,top+45),(256+w*.50,320),(259,337)],'stonelight')+pt([(259,337),(256+w*.50,320),(256+w*.38,low),(257,low)],'stonedark')
def cactus():
    return path('M231 404 L231 312 L194 312 Q175 311 175 285 L175 260 Q177 247 190 248 Q204 248 204 260 L204 284 L231 284 L231 233 Q232 209 252 209 Q271 211 271 231 L271 328 L303 328 L303 283 Q304 263 321 263 Q334 265 334 282 L334 335 Q333 353 315 357 L271 357 L271 407 Z','sage')+path('M253 211 L253 401','none','olive',8)
def mountain():return pt([(100,407),(178,295),(210,308),(272,140),(335,257),(365,244),(418,404)],'stone')+pt([(272,140),(335,257),(365,244),(418,404),(280,400)],'stonedark')+pt([(272,140),(240,222),(287,217),(311,242)],'cream')+pt([(100,407),(178,295),(210,308),(241,284),(196,417)],'stonelight')
def sign():return stem(252,436,187)+pt([(152,248),(328,230),(366,251),(328,288),(153,310)],'woodlight')+pt([(326,236),(365,252),(328,285)],'terracotta' if False else 'terra')
def bridge():
    s=pt([(115,331),(255,250),(410,328),(263,421)],'woodlight')
    s+=pt([(115,331),(263,421),(263,441),(115,351)],'wood')+pt([(263,421),(410,328),(410,346),(263,441)],'wooddark')
    for x,y in [(143,319),(365,319),(237,273),(281,391)]:s+=stem(x,y,80,'wooddark')
    s+=line(143,239,237,193,'cream',9)+line(281,311,365,239,'cream',9)
    return s
def phone():
    s=block(257,371,136,80,70,'ochre','wooddark','wood')
    s+=pt([(204,203),(262,170),(312,202),(312,354),(261,383),(204,351)],'terra')+pt([(262,170),(312,202),(312,354),(262,383)],'wooddark')
    return s+rect(214,218,38,49,'cream',7)+path('M224 285 Q214 316 242 321','none','night',11)+rect(215,335,55,9,'cream',4)
def warehouse():return block(254,311,255,135,90,'stonelight','olive','sage')+roof(256,238,292,104)+pt([(236,358),(286,329),(286,411),(236,437)],'wooddark')
def sapling():return stem(255,419,125)+path('M255 320 Q192 306 203 275 Q238 267 255 320 Z','sage')+path('M255 348 Q318 297 327 310 Q318 364 255 348 Z','olive')
def spruce():
    s=stem(255,417,170)
    for y,w in [(201,64),(250,90),(302,112)]:s+=pt([(255,y-79),(255-w,y+35),(255+w,y+35)],'sage' if y!=250 else 'olive')
    return s
def room():
    return pt([(111,235),(256,314),(256,441),(111,359)],'cream')+pt([(256,314),(401,235),(401,359),(256,441)],'stonelight')+pt([(111,235),(255,151),(400,235),(256,319)],'woodlight')
def chest():return block(256,338,211,108,76,'woodlight','wooddark','wood')+pt([(153,333),(257,278),(358,333),(256,384)],'ochre')+rect(262,355,12,16,'cream',3)
def bed():return block(256,339,250,125,48,'woodlight','wooddark','wood')+pt([(158,314),(242,264),(358,325),(274,373)],'cream')+pt([(165,319),(197,301),(235,324),(203,344)],'stonelight')
def table():return block(256,288,228,114,27,'woodlight','wooddark','wood')+stem(177,429,130)+stem(328,429,140)
def chair():return block(255,337,145,88,30,'woodlight','wooddark','wood')+stem(211,427,75)+stem(302,427,73)+pt([(194,314),(194,213),(256,181),(256,300)],'sage')+pt([(256,181),(309,213),(309,304),(256,300)],'olive')
def billboard():return notice()+pt([(224,254),(274,245),(274,282),(224,290)],'sage')+rect(285,245,38,15,'terra')
def portal():
    s=path('M165 405 L165 250 Q165 142 257 140 Q347 143 347 252 L347 405 L315 405 L315 250 Q315 175 257 175 Q195 174 196 251 L196 405 Z','stone')
    return s+path('M202 394 L202 258 Q203 182 256 183 Q309 186 309 258 L309 394 Z','water')+path('M232 230 Q261 208 277 249 L243 321','none','cream',8)
def scooter():return line(153,402,333,402,'wooddark',13)+ellipse(170,410,27,27,'stone')+ellipse(328,410,27,27,'stone')+line(306,395,306,247,'wooddark',11)+line(275,247,341,247,'olive',10)
def museum():
    s=block(257,324,281,136,98,'sage','olive','grass')+roof(256,232,313,94)
    s+=pt([(234,285),(256,217),(279,285)],'stonelight')+pt([(233,285),(280,285),(280,400),(233,428)],'terra')
    return s+pt([(245,324),(268,311),(268,367),(245,378)],'night')+rect(164,320,23,28,'cream')+rect(316,320,23,28,'cream')
def exhibit():return block(256,350,194,107,69,'cream','stone','stonelight')+stem(256,342,148,'wood')+pt([(192,193),(303,182),(319,239),(208,251)],'olive')+pt([(219,214),(272,210),(274,222),(219,227)],'cream')
def lantern():
    return block(257,381,146,80,36,'woodlight','wooddark','wood')+pt([(218,354),(224,247),(283,247),(294,354)],'cream')+pt([(224,247),(283,247),(275,345),(234,353)],'ochre')+rect(225,218,61,20,'stone',6)+line(237,217,237,186,'olive',8)+line(237,186,277,186,'olive',8)+line(277,186,277,216,'olive',8)
def secret():return pt([(190,399),(190,244),(285,194),(285,373)],'stone')+pt([(285,194),(328,240),(328,399),(285,373)],'stonedark')+path('M230 377 L230 262 L265 244 L265 362 Z','wooddark')+ellipse(258,309,5,5,'cream')
def altar():return block(256,331,242,114,106,'stonelight','stonedark','stone')+pt([(206,285),(253,247),(308,278),(253,308)],'terra')+pt([(244,290),(258,260),(278,281),(254,312)],'cream')
def bat():return path('M257 276 Q225 222 171 263 L125 230 Q145 326 197 331 L204 371 Q231 348 256 342 Q289 347 304 370 L311 330 Q372 336 392 236 L347 262 Q300 221 257 276 Z','night')+pt([(246,286),(260,274),(274,289),(262,312)],'terra')
def arch():return path('M169 415 L169 229 Q176 151 256 151 Q337 152 343 229 L343 415 L310 415 L310 235 Q302 184 256 184 Q212 184 204 235 L204 415 Z','night')+pt([(164,227),(210,207),(250,210),(253,239)],'stone')
def card():return stem(257,432,184,'wood')+pt([(160,245),(308,214),(350,236),(209,267)],'cream')+pt([(160,245),(209,267),(210,342),(163,319)],'woodlight')+pt([(209,267),(350,236),(351,309),(210,342)],'ochre')+pt([(242,259),(288,250),(297,277),(249,285)],'sage')
DRAW={'notice':notice,'crate':crate,'crate-green':lambda:crate(True),'donation':donation,'pedestal':pedestal,'jukebox':jukebox,'marker':marker,'well':well,'sack':sack,'rock-small':rock,'rock-large':lambda:rock(True),'cactus':cactus,'mountain':mountain,'sign':sign,'bridge':bridge,'phone':phone,'warehouse':warehouse,'sapling':sapling,'spruce':spruce,'room':room,'chest':chest,'bed':bed,'table':table,'chair':chair,'billboard':billboard,'portal':portal,'scooter':scooter,'museum':museum,'exhibit':exhibit,'lantern':lantern,'secret':secret,'altar':altar,'bat':bat,'arch':arch,'card':card}

def render():
    manifest=[];checks=[]
    for idx,(id,title,category,source,physical,shape) in enumerate(ASSETS,1):
        assert re.fullmatch('[a-z0-9-]+',id) and shape in DRAW
        inner=DRAW[shape]()
        assert 'shadow' not in inner.lower() and len(inner)>80
        svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" data-style="DL-ISO30-PAPER-WORLD-01" data-asset-id="{id}" data-review="candidate"><title>{title}</title>{inner}</svg>'
        ET.fromstring(svg)
        (SVG/(id+'.svg')).write_text(svg,encoding='utf-8')
        raster=cairosvg.svg2png(bytestring=svg.encode(),output_width=256,output_height=256)
        pathout=PNG/(id+'.png');pathout.write_bytes(raster)
        im=Image.open(io.BytesIO(raster)).convert('RGBA')
        bbox=im.getchannel('A').getbbox()
        good=bbox is not None and bbox[0]>=16 and bbox[1]>=15 and bbox[2]<=243 and bbox[3]<=247 and im.getpixel((0,0))[3]==0
        record=dict(batch_no='DL-WORLD-ART-'+str(idx).zfill(3),id=id,name=title,category=category,branch=source,game_object=physical,svg=str((SVG/(id+'.svg')).relative_to(ROOT)) if SVG.is_relative_to(ROOT) else str((SVG/(id+'.svg')).resolve()),preview_png='build/png_256/'+id+'.png',style='DL-ISO30-PAPER-WORLD-01',status='CANDIDATE_NOT_DEPLOYED',geometry='ISO30-style illustration; CU collision governed separately by engine',sha256=hashlib.sha256(svg.encode()).hexdigest(),qa={'svg_valid':True,'transparent_corner':True,'safe_margin':good,'bbox':bbox})
        manifest.append(record);checks.append(good)
    (ROOT/'manifest.json').write_text(json.dumps({'schema':'DL-WORLD-ASSET-CANDIDATE-01','styles':{'world':'DL-ISO30-PAPER-WORLD-01','items':'DL-STYLE-PAPER-CUT-01'},'count':len(manifest),'assets':manifest},ensure_ascii=False,indent=2))
    # Contact sheet uses white neutral framing but SVG output is genuinely transparent.
    width=1200; cw=200;ch=236;cols=6;rows=math.ceil(len(manifest)/cols)
    canvas=Image.new('RGB',(width,rows*ch),(245,246,242));draw=ImageDraw.Draw(canvas)
    for i,d in enumerate(manifest):
        x=i%cols*cw;y=i//cols*ch
        tile=Image.open(ROOT/d['preview_png']).convert('RGBA')
        thumbnail=tile.resize((181,181))
        canvas.paste(thumbnail,(x+10,y+6),thumbnail)
        draw.text((x+8,y+187),d['batch_no'],fill=(49,63,59))
        draw.text((x+8,y+202),d['id'][:23],fill=(69,87,72))
        if not d['qa']['safe_margin']:draw.text((x+160,y+187),'!margin',fill=(176,64,57))
    canvas.save(ROOT/'CONTACT_SHEET_35.png')
    (ROOT/'QA_REPORT.json').write_text(json.dumps({'created':'2026-10-20','assets':len(manifest),'svgValid':len(manifest),'pngTransparent':len(manifest),'marginPass':sum(checks),'marginFailures':[d['id'] for d in manifest if not d['qa']['safe_margin']],'claim':'technical only, not artistic/gameplay approval'},ensure_ascii=False,indent=2))
    return manifest
if __name__=='__main__':
    m=render();print('Rendered',len(m),'SVG/Png', 'margin failures:',[o['id'] for o in m if not o['qa']['safe_margin']])
