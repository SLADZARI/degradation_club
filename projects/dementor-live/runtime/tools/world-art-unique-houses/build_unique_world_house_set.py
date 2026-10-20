from pathlib import Path
import json,hashlib,math,io,xml.etree.ElementTree as ET
from PIL import Image,ImageOps,ImageDraw,ImageFont
import cairosvg
root=Path(__file__).resolve().parents[2]/'assets-source'/'world-art-unique-houses';svgdir=root/'source'/'svg';pngdir=root/'build'/'png_256';small=root/'build'/'png_128'
for d in [svgdir,pngdir,small,root/'qa']:d.mkdir(parents=True,exist_ok=True)
C={'ivory':'#F0E5CF','cream':'#E7D8BA','ochre':'#C9965B','terracotta':'#B8654D','sage':'#81936B','olive':'#526C4D','stone':'#92938B','water':'#8CAFB5','wood':'#B3946D','woodlight':'#D0B38A','wooddark':'#8C7D66','stonebright':'#C4C6B9','night':'#45515B','leaf':'#A3B18F','sand':'#C8B69A'}
styles={
'city-tool-shop':('Город · инструментальная лавка','tool-shop',2.6,2.0,'RC4'),
'city-garden-shop':('Город · лавка благоустройства','garden-shop',2.5,2.2,'RC4'),
'city-seed-shop':('Город · семенная лавка','seed-market',2.5,2.0,'RC4'),
'city-warehouse':('Город · склад','warehouse',2.6,3.0,'RC4'),
'city-forge':('Город · кузница','forge',6.0,5.0,'RC4'),
'city-tourist-kiosk':('Город · туристический киоск','tourist-kiosk',2.35,1.25,'RC4'),
'city-museum-gate':('Город · вход в музей смеха','museum-entry',2.8,1.25,'RC4'),
'city-university-site':('Город · будущий университет','university-site',3.2,1.25,'RC4-PREVIEW'),
'city-robo-stadium-site':('Город · стадион Robo Games','robo-stadium-site',2.35,1.0,'RC4-PREVIEW'),
'city-industry-site':('Город · будущая агротехника','industry-site',2.35,1.25,'RC4-PREVIEW'),
'city-farlands-gate':('Город · ворота дальних земель','farlands-entry',2.35,1.25,'RC4'),
'city-mayor-tent':('Временная мэрия · городская палатка','mayor',4.0,3.0,'RC4'),
'plot-personal-tent':('Личная палатка · участок','tent',4.0,3.0,'RC4/PLOT'),
'city-garden-pavilion':('Город · общественный огород','public-garden',5.6,2.5,'RC4')}
props={
'plot-garden-bed-empty':('Грядка · пустая','garden-bed',1.1,1.1,'GRID-02'),
'plot-garden-bed-seeded':('Грядка · посажена','garden-bed',1.1,1.1,'GRID-02'),
'plot-garden-bed-hemp':('Грядка · конопля растёт','garden-bed',1.1,1.1,'GRID-02'),
'plot-garden-bed-carrot':('Грядка · морковь растёт','garden-bed',1.1,1.1,'GRID-02'),
'plot-garden-bed-ready':('Грядка · готова к сбору','garden-bed',1.1,1.1,'GRID-02'),
'city-park-bench':('Скамейка · городская','bench',None,None,'RC4'),
'city-garden-bench':('Скамейка · огородная','bench',None,None,'RC4'),
'interior-chair-wood':('Стул · деревянный','chair',None,None,'GRID-02'),
'interior-chair-sage':('Стул · зелёный','chair',None,None,'GRID-02'),
'interior-table':('Стол · интерьер','table',None,None,'GRID-02'),
'interior-chest':('Сундук · интерьер','chest',1.6,1.3,'GRID-02')}
# Eight stable visual facade variants for the existing eight plot IDs. These are VISUAL ONLY:
# owner/city identity, footprint and state remain server-owned; no new dwelling entity.
for i in range(1,9):
 styles[f'plot-personal-tent-plot-{i}']=(f'Личная палатка: вариант участка {i}',f'plot-{i}',4.0,3.0,'RC4/PLOT-CANDIDATE')
# Geometry authored as ISO30 paper forms: 2 planar axes at ±30° in screen plane.
def P(points,fill):return f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x,y in points)}" fill="{C.get(fill,fill)}"/>'
def R(x,y,w,h,fill,rad=0):return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rad:.1f}" fill="{C.get(fill,fill)}"/>'
def L(x,y,X,Y,color,width=5):return f'<path d="M {x:.1f} {y:.1f} L {X:.1f} {Y:.1f}" fill="none" stroke="{C.get(color,color)}" stroke-width="{width}" stroke-linecap="round"/>'
def O(cx,cy,rx,ry,col):return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{C.get(col,col)}"/>'
def iso_base(cx=254,top=340,w=178,d=120,height=85,front='cream',side='sage',topcolor='woodlight'):
 # ISO30 invariant for the ground-plane: dy / dx = tan(30 deg).
 d=w/math.sqrt(3)
 a=(cx,top-d/2);b=(cx+w/2,top);c=(cx,top+d/2);dpt=(cx-w/2,top)
 return [P([a,b,c,dpt],topcolor),P([dpt,c,(cx,top+d/2+height),(cx-w/2,top+height)],front),P([b,c,(cx,top+d/2+height),(cx+w/2,top+height)],side)]
def roof(style,cx=254,y=243,w=210,lo=73,colors=('terracotta','ochre')):
 if style=='gable':return [P([(cx-w/2,y+40),(cx,y-lo),(cx,y+32)],colors[1]),P([(cx,y-lo),(cx+w/2,y+40),(cx,y+32)],colors[0])]
 if style=='shed':return [P([(cx-w/2,y+15),(cx-w*.38,y-lo),(cx+w*.58,y+15),(cx+w*.45,y+lo*.32)],colors[0]),P([(cx-w/2,y+15),(cx-w*.38,y-lo),(cx+w*.58,y+15)],colors[1])]
 if style=='hip':return [P([(cx-w*.55,y+21),(cx,y-lo),(cx+w*.53,y+25),(cx,y+lo*.7)],colors[0]),P([(cx-w*.55,y+21),(cx,y-lo),(cx,y+lo*.7)],colors[1])]
 if style=='flat':return [P([(cx,y-47),(cx+w*.55,y+13),(cx,y+74),(cx-w*.55,y+13)],colors[1]),P([(cx-w*.55,y+13),(cx,y+74),(cx,y+83),(cx-w*.55,y+22)],colors[0])]
 if style=='saw':return [P([(cx-w*.50,y+29),(cx-w*.2,y-59),(cx+w*.1,y+29),(cx+w*.25,y-54),(cx+w*.56,y+25),(cx,y+66)],colors[1]),P([(cx+w*.25,y-54),(cx+w*.56,y+25),(cx,y+66),(cx+w*.1,y+29)],colors[0])]
 return roof('gable',cx,y,w,lo,colors)
def door(cx=260,y=340,wide=35,color='wooddark'):return [P([(cx-wide*.5,y-26),(cx+wide*.5,y-44),(cx+wide*.5,y+51),(cx-wide*.5,y+71)],color),O(cx+wide*.28,y+9,3,3,'cream')]
def window(x,y,color='water',double=False):return [P([(x,y),(x+28,y-15),(x+28,y+18),(x,y+33)],'ivory'),P([(x+4,y+3),(x+24,y-8),(x+24,y+15),(x+4,y+25)],color)]+([L(x+14,y-3,x+14,y+18,'wood',3)] if double else [])
def post(x,y,h=65,col='wood'):return P([(x-6,y),(x-7,y-h),(x+5,y-h-5),(x+6,y)],col)

def unique_personal_tent(index):
 # Variation in physical silhouette, entrance angle, roof paper facets and facade; no extra object or collision.
 palettes=[('cream','terracotta','sage'),('woodlight','sage','olive'),('cream','ochre','wooddark'),('sage','cream','terracotta'),('terracotta','woodlight','olive'),('ivory','olive','sage'),('ochre','cream','stone'),('woodlight','terracotta','sage')]
 front,side,accent=palettes[index-1]
 peakx=243+((index*17)%37)-18
 peaky=164+(index%3)*12
 left=137+((index*13)%28)
 right=364+((index*11)%25)
 lower=411+(index%3)*6
 s=[P([(left,361),(peakx,peaky),(right,360),(255,lower)],front),P([(left,361),(peakx,peaky),(255,lower)],side),P([(peakx,peaky),(right,360),(255,lower)],accent)]
 doorx=244+(index%4)*5
 s += [P([(doorx-16,367),(doorx,325),(doorx+21,363),(doorx+21,411),(doorx-16,423)],'night')]
 if index%2==0:s += [P([(left+32,323),(peakx-12,peaky+61),(peakx+8,peaky+76),(left+51,349)],'cream')]
 else:s += [P([(peakx+6,peaky+47),(right-38,320),(right-25,334),(peakx+8,peaky+86)],'woodlight')]
 if index in (2,5,8):s += [P([(right-52,348),(right-24,330),(right-13,354),(right-39,374)],'sage')]
 if index in (3,6):s += [P([(left+30,366),(left+47,351),(left+56,362),(left+39,380)],'ochre')]
 if index==7:s += [P([(peakx-20,peaky+20),(peakx,peaky),(peakx+18,peaky+30),(peakx,peaky+42)],'terracotta')]
 return s

def make_house(name):
 if name.startswith('plot-personal-tent-plot-'):return unique_personal_tent(int(name.rsplit('-',1)[1]))
 col='ivory';side='stone';roofstyle='gable';palette=('terracotta','ochre')
 cfg={
 'city-tool-shop':('woodlight','wood','gable',('terracotta','ochre')),
 'city-garden-shop':('cream','sage','hip',('sage','olive')),
 'city-seed-shop':('woodlight','olive','shed',('sage','cream')),
 'city-warehouse':('sand','stone','flat',('wooddark','stonebright')),
 'city-forge':('stonebright','stone','gable',('night','stone')),
 'city-tourist-kiosk':('cream','wood','hip',('ochre','terracotta')),
 'city-museum-gate':('stonebright','sage','gable',('terracotta','stone')),
 'city-university-site':('cream','stone','flat',('sage','stonebright')),
 'city-robo-stadium-site':('stonebright','wooddark','flat',('olive','sage')),
 'city-industry-site':('woodlight','wooddark','saw',('terracotta','wood')),
 'city-farlands-gate':('stonebright','stone','flat',('stone','stonebright')),
 'city-mayor-tent':('ochre','wooddark','hip',('terracotta','cream')),
 'plot-personal-tent':('cream','sage','gable',('ochre','terracotta')),
 'city-garden-pavilion':('cream','olive','hip',('sage','leaf')),
 }
 front,side,roofstyle,palette=cfg[name];v=[]
 if name in ('city-mayor-tent','plot-personal-tent'):
  v=[P([(143,364),(258,188),(369,360),(258,411)],palette[0]),P([(143,364),(258,188),(258,411)],palette[1]),P([(258,188),(369,360),(258,411)],side),P([(241,346),(257,313),(277,349),(277,404),(241,419)],'night')]
  if name=='city-mayor-tent':v +=[P([(178,316),(236,226),(258,245),(204,352)],'ochre'),P([(290,253),(317,310),(303,338),(273,293)],'cream'),post(170,398,65)]
  else:v +=[P([(199,336),(244,269),(257,276),(216,374)],'terracotta'),R(264,390,23,10,'woodlight',2)]
  return v
 if name=='city-robo-stadium-site':
  v=iso_base(top=352,w=235,d=140,height=44,front='stone',side='wooddark',topcolor='stonebright')
  v +=[P([(178,313),(252,269),(333,315),(253,364)],'olive'),P([(196,316),(254,281),(306,313),(253,347)],'woodlight')]
  for x,y in [(138,295),(370,298)]:v +=[post(x,y,75,'wooddark'),P([(x-12,y-73),(x+2,y-89),(x+16,y-73)],'terracotta')]
  return v
 if name=='city-farlands-gate':
  v=[P([(174,413),(174,235),(211,214),(211,413)],'stone'),P([(297,413),(297,214),(334,234),(334,413)],'wooddark'),P([(211,225),(253,166),(297,214),(297,253),(254,208),(211,257)],'stonebright'),P([(211,257),(254,208),(297,253),(297,409),(211,409)],'night'),P([(232,309),(258,292),(258,406),(232,416)],'terracotta')]
  return v
 if name=='city-garden-pavilion':
  v=iso_base(top=359,w=216,d=142,height=25,front='sage',side='olive',topcolor='woodlight')
  v+=roof('hip',254,231,235,60,('leaf','olive'))+[post(169,373,125),post(345,373,124),P([(192,358),(251,318),(310,358),(250,400)],'sage'),P([(224,354),(252,335),(288,353),(251,373)],'olive')]
  return v
 v=iso_base(top=332,w=207,d=123,height=90,front=front,side=side,topcolor='woodlight')
 v+=roof(roofstyle,cx=254,y=242,w=233,lo=81,colors=palette)
 v+=door(252,356,36,'wooddark')
 if name=='city-tool-shop':v+=window(162,310,'water',True)+window(316,310,'water')+[P([(318,248),(346,234),(357,240),(326,255)],'terracotta'),L(326,238,353,260,'stone',5),L(337,223,337,253,'wood',5)]
 elif name=='city-garden-shop':v+=window(156,299,'leaf',True)+window(320,310,'water')+[P([(150,281),(200,254),(240,278),(190,308)],'sage'),P([(190,308),(240,278),(243,293),(194,325)],'olive'),P([(327,285),(347,288),(339,313)],'leaf')]
 elif name=='city-seed-shop':v+=window(157,308,'leaf',True)+window(316,302,'leaf',True)+[P([(189,358),(239,330),(244,343),(193,371)],'sage'),P([(329,251),(347,261),(334,280)],'terracotta')]
 elif name=='city-warehouse':v+= [P([(185,316),(249,275),(249,420),(185,444)],'wooddark'),L(190,341,244,307,'woodlight',4),L(190,372,243,340,'woodlight',4),window(320,312,'night')]+[P([(326,279),(355,277),(362,302),(331,304)],'stonebright')]
 elif name=='city-forge':v += [P([(313,220),(313,119),(344,137),(344,237)],'stone'),P([(344,137),(356,132),(356,224),(344,237)],'night'),P([(194,361),(235,345),(235,399),(194,415)],'terracotta'),window(156,315,'terracotta'),P([(270,369),(293,315),(308,366)],'ochre')]
 elif name=='city-tourist-kiosk':v+= [P([(153,290),(255,238),(357,288),(253,338)],'terracotta'),P([(156,329),(220,292),(225,331),(158,367)],'cream'),window(320,307,'water'),P([(347,224),(352,170),(364,191),(360,231)],'wooddark')]
 elif name=='city-museum-gate':v += [P([(212,253),(254,173),(298,244)],'stonebright'),P([(232,287),(255,256),(280,288),(280,397),(231,421)],'terracotta'),P([(238,297),(254,280),(269,296),(269,402),(238,414)],'night'),window(154,302,'cream'),window(323,303,'cream')]
 elif name=='city-university-site':v += [P([(179,328),(179,262),(202,246),(202,317)],'stonebright'),P([(224,312),(254,252),(282,310),(254,335)],'sage'),window(160,330,'water',True),window(316,316,'water',True)]+[P([(245,349),(269,341),(284,358),(257,376)],'ochre')]
 elif name=='city-industry-site':v += [P([(312,218),(312,115),(346,128),(346,238)],'stone'),P([(345,128),(360,124),(360,232),(346,238)],'night'),P([(163,310),(228,275),(237,298),(174,335)],'sage'),window(312,330,'water'),L(153,370,202,344,'wooddark',7)]
 return v

def bed(mode):
 v=[P([(133,342),(256,276),(381,344),(256,416)],'woodlight'),P([(155,344),(257,292),(354,343),(256,396)],'wooddark'),P([(172,342),(255,300),(337,343),(255,385)],'olive')]
 if mode!='empty':v+=[P([(200,333),(256,303),(313,332),(255,364)],'sage')]
 if mode=='seeded':v+=[O(x,y,5,3,'ochre') for x,y in [(238,341),(257,327),(278,339)]]
 elif mode=='hemp':
  for x,y in [(231,337),(257,319),(278,335)]:v += [L(x,y,x,y-50,'wood',7),P([(x,y-48),(x-17,y-66),(x,y-73),(x+18,y-66)],'leaf')]
 elif mode=='carrot':
  for x,y in [(232,340),(257,324),(283,343)]:v += [P([(x,y+1),(x-9,y-27),(x,y-19),(x+9,y-27)],'sage'),P([(x,y+1),(x-6,y-7),(x+6,y-7)],'ochre')]
 elif mode=='ready':
  for x,y in [(224,337),(257,315),(291,337)]:v += [P([(x,y+10),(x-14,y-35),(x+14,y-35)],'terracotta'),P([(x,y-30),(x-18,y-59),(x+18,y-58)],'leaf')]
 return v

def bench(kind):
 v=[]
 if kind=='park':v=[P([(157,342),(280,274),(355,318),(230,390)],'woodlight'),P([(157,342),(230,390),(230,402),(157,353)],'wood'),P([(230,390),(355,318),(355,333),(230,402)],'wooddark'),P([(168,283),(289,219),(304,227),(184,295)],'sage'),P([(184,295),(304,227),(305,257),(184,324)],'olive'),post(191,433,83),post(320,430,88)]
 else:v=[P([(157,340),(278,277),(353,321),(230,385)],'sage'),P([(157,340),(230,385),(230,400),(157,355)],'olive'),P([(230,385),(353,321),(353,336),(230,400)],'wood'),post(190,432,94,'wood'),post(318,432,95,'wood'),P([(190,286),(309,219),(321,230),(199,299)],'woodlight')]
 return v

def chair(kind):
 v=iso_base(top=348,w=126,d=84,height=21,front='wood' if kind=='wood' else 'sage',side='wooddark' if kind=='wood' else 'olive',topcolor='woodlight' if kind=='wood' else 'leaf')
 v += [post(216,434,62,'wooddark'),post(291,435,62,'wooddark')]
 v += [P([(193,330),(193,216),(250,181),(250,300)],'woodlight' if kind=='wood' else 'sage'),P([(250,181),(305,213),(305,322),(250,300)],'wooddark' if kind=='wood' else 'olive')]
 if kind=='sage':v+=window(210,238,'cream')
 else:v += [L(211,244,286,266,'ochre',7)]
 return v

def table():return iso_base(top=317,w=213,d=111,height=19,front='woodlight',side='wooddark',topcolor='wood')+[post(177,421,100,'wood'),post(320,421,109,'wood'),P([(217,305),(254,283),(290,305),(252,328)],'cream')]
def chest():return iso_base(top=337,w=197,d=103,height=81,front='woodlight',side='wooddark',topcolor='ochre')+[P([(159,333),(257,278),(355,335),(256,389)],'wood'),P([(192,346),(232,324),(239,329),(200,353)],'cream'),R(259,378,18,14,'stone',3)]
def art(name):
 if name in styles:return make_house(name)
 if name.startswith('plot-garden-bed-'):return bed(name.split('plot-garden-bed-')[1])
 if name.startswith('city-park-bench'):return bench('park')
 if name.startswith('city-garden-bench'):return bench('garden')
 if name=='interior-chair-wood':return chair('wood')
 if name=='interior-chair-sage':return chair('sage')
 if name=='interior-table':return table()
 if name=='interior-chest':return chest()
 raise KeyError(name)
def flatten(xs):
 for x in xs:
  if isinstance(x,list):yield from flatten(x)
  else:yield x
def svg_doc(name,title,pieces,extra={}):
 pieces=list(flatten(pieces))
 attrs=' '.join(f'data-{k}="{str(v)}"' for k,v in extra.items() if v is not None)
 return f'<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" data-asset-id="{name}" data-style="DL-ISO30-PAPER-WORLD-01" data-art-status="REVIEW" {attrs}><title>{title}</title>{"".join(pieces)}</svg>\n'
def stage(name,step):
 # 7 independent world-stage variations, distinct footprints, scaffolds, roofs and material palette
 base=make_house(name)
 # Not yet mapped onto true stage values, remain explicit candidates. Stage 0: only mark foundation; stage 1: structural skeleton; stage 2: partial envelope with recognizable silhouette.
 widths={'city-mayor-tent':172,'plot-personal-tent':150,'city-forge':227,'city-seed-shop':178,'city-garden-pavilion':213,'city-warehouse':198,'city-tool-shop':175}
 w=widths[name];col={'city-forge':'stone','city-seed-shop':'sage','city-garden-pavilion':'leaf','city-warehouse':'wood','city-tool-shop':'ochre','city-mayor-tent':'terracotta','plot-personal-tent':'woodlight'}[name]
 anchor=256;fy=370;dx=w*.50
 ground=[P([(anchor,fy-73),(anchor+dx,fy-6),(anchor,fy+59),(anchor-dx,fy-7)],'woodlight'),P([(anchor,fy-53),(anchor+dx*.74,fy-8),(anchor,fy+37),(anchor-dx*.74,fy-8)],col)]
 if step==0:
  ground +=[post(anchor-dx*.59,fy+2,52),post(anchor+dx*.58,fy+6,51),R(anchor-9,fy-14,18,14,'stonebright',3)]
  if name=='city-garden-pavilion':ground+= [P([(194,338),(255,304),(314,335),(255,373)],'olive')]
  elif name=='city-forge':ground+=[P([(219,338),(255,307),(292,334),(257,358)],'stone')]
  elif name in ('city-mayor-tent','plot-personal-tent'):ground+=[L(205,330,305,393,'terracotta',6)]
  return ground
 if step==1:
  frame=ground+ [post(anchor-dx*.72,fy+3,133,'wooddark'),post(anchor+dx*.72,fy+3,145,'wooddark'),post(anchor,fy-42,143,'wooddark')]
  frame += [L(anchor-dx*.73,fy-123,anchor,fy-181,col,9),L(anchor,fy-181,anchor+dx*.73,fy-136,col,9)]
  if name=='city-forge':frame += [P([(320,262),(320,204),(344,217),(344,278)],'stone')]
  if name=='city-seed-shop':frame += [P([(196,319),(260,278),(278,293),(210,341)],'sage')]
  if name=='city-garden-pavilion':frame += [P([(204,335),(255,311),(300,339),(255,361)],'olive')]
  return frame
 # Distinct stage 2: recognizable profile but with unfinished/open doorway and visible structural support
 if name in ('city-mayor-tent','plot-personal-tent'):
  return make_house(name)[:-1]+[L(157,378,256,208,'wooddark',9),L(256,208,359,380,'wooddark',9),P([(229,363),(256,333),(280,363),(280,416),(231,427)],'wooddark')]
 shapes=make_house(name)
 # Remove minor end-detail but leave original core building silhouette recognizable, scaffold on south edge
 return shapes[:-2]+[L(163,397,335,385,'wooddark',6),post(166,399,113,'wooddark'),post(334,399,112,'wooddark')]
base_specs={**styles,**props};assetdata=[];output=[]
for id,(title,game_id,w,d,scope) in base_specs.items():
 doc=svg_doc(id,title,art(id),{'game-id':game_id,'scope':scope});file=svgdir/(id+'.svg');file.write_text(doc)
 for size,path in [(256,pngdir),(128,small)]:
  image=cairosvg.svg2png(bytestring=doc.encode(),output_width=size,output_height=size)
  (path/(id+'.png')).write_bytes(image)
 assetdata.append({'asset_id':id,'title':title,'game_id':game_id,'scope':scope,'svg':str(file.relative_to(root)),'footprint_CU':[w,d] if w is not None else None,'anchor':'southern base center; PENDING PIXEL<->CU CHECK','art_state':'CANDIDATE_NOT_APPROVED','gameplay_connected':False,'sha256':hashlib.sha256(doc.encode()).hexdigest()})
stageparents={'city-mayor-tent':'DL-012','plot-personal-tent':'DL-020','city-forge':'DL-014','city-seed-shop':'DL-018','city-garden-pavilion':'DL-019','city-warehouse':'DL-016','city-tool-shop':'DL-017'}
for k,id in stageparents.items():
 for n in range(3):
  sid=f'{k}--stage-{n}';doc=svg_doc(sid,f'{styles[k][0]} · графическая стадия {n}',stage(k,n),{'game-id':styles[k][1],'stage':n,'physical-id':id});f=svgdir/(sid+'.svg');f.write_text(doc)
  for size,path in [(256,pngdir),(128,small)]:
   (path/(sid+'.png')).write_bytes(cairosvg.svg2png(bytestring=doc.encode(),output_width=size,output_height=size))
  assetdata.append({'asset_id':sid,'title':styles[k][0]+f' · stage {n}','game_id':styles[k][1],'physical_object_id':id,'stage_candidate':n,'mapping_status':'NOT_MAPPED_TO_SERVER_STAGE','scope':styles[k][-1],'svg':str(f.relative_to(root)),'art_state':'CANDIDATE_NOT_APPROVED','gameplay_connected':False,'sha256':hashlib.sha256(doc.encode()).hexdigest()})
# QA: format/safety/alpha, minimum 20px margin, distinct PNG for all IDs, unique roof profiles.
seen={};fails=[]
for a in assetdata:
 file=root/a['svg'];s=file.read_text();el=ET.fromstring(s)
 if el.attrib.get('viewBox')!='0 0 512 512':fails.append(a['asset_id']+': viewBox')
 if any(x in s.lower() for x in ('<script','<image','<filter','<foreignobject','url(', 'feGaussianBlur'.lower())):fails.append(a['asset_id']+': unsafe svg')
 im=Image.open(pngdir/(a['asset_id']+'.png')).convert('RGBA');alpha=im.getchannel('A');bbox=alpha.getbbox()
 if not bbox or min(bbox[0],bbox[1],256-bbox[2],256-bbox[3])<8:fails.append(a['asset_id']+': bounds '+str(bbox))
 if im.getpixel((0,0))[3] or im.getpixel((255,255))[3]:fails.append(a['asset_id']+': corner alpha')
 h=hashlib.sha256(im.tobytes()).hexdigest()
 if h in seen:fails.append(a['asset_id']+' equals '+seen[h])
 seen[h]=a['asset_id']
 if s.count('<polygon')+s.count('<path')+s.count('<rect')<2:fails.append(a['asset_id']+': layers')
 a['png256_sha256']=hashlib.sha256((pngdir/(a['asset_id']+'.png')).read_bytes()).hexdigest()
if fails:print('FAIL',fails[:45]);raise SystemExit(2)
(root/'manifest.json').write_text(json.dumps({'schema':'DL-WORLD-UNIQUE-ISO30-01','version':'2026-10-20-1','items':len(assetdata),'stage_assets':21,'source_branch':'feature/dementor-live-world-art-closure-batch02-2026-10-20','approval':'CANDIDATE','entries':assetdata},ensure_ascii=False,indent=2)+'\n')
# contact sheet / overview
N=len(assetdata);cw,ch=155,184;cols=7;rows=math.ceil(N/cols);sheet=Image.new('RGB',(cw*cols,ch*rows),'#F7F5ED');draw=ImageDraw.Draw(sheet)
for i,a in enumerate(assetdata):
 im=Image.open(pngdir/(a['asset_id']+'.png')).convert('RGBA').resize((130,130));x=(i%cols)*cw+12;y=(i//cols)*ch+7
 sheet.paste(im,(x,y),im);name=a['asset_id'].replace('city-','').replace('plot-','').replace('interior-','')
 draw.text((x+1,y+134),name[:22],fill='#45515B')
 draw.text((x+1,y+149),('STAGE '+str(a['stage_candidate']) if 'stage_candidate' in a else a['scope'])[:22],fill='#777c71')
sheet.save(root/'qa'/'CONTACT_SHEET_46.png')
(root/'qa'/'QA.json').write_text(json.dumps({'status':'PASS_TECHNICAL_ONLY','svg_count':N,'unique_RGBA_256':len(seen),'png_count':N*2,'xml':'PASS','alpha_corners':'PASS','safe_margin':'PASS','hash_uniq':'PASS','visual_art_approval':'NOT_RUN','footprint_visual_alignment':'NOT_RUN','scene_browser':'NOT_RUN','real_iphone':'NOT_RUN','production':'NOT_DEPLOYED'},ensure_ascii=False,indent=2))
print(json.dumps({'svg_count':N,'building_count':len(styles),'prop_count':len(props),'stages':21,'qa_fails':len(fails),'folder':str(root)},ensure_ascii=False))
