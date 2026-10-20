from pathlib import Path
from PIL import Image
from hashlib import sha256
import json, math
ROOT=Path(__file__).resolve().parent
m=json.loads((ROOT/'manifest.json').read_text())['assets']
assets=[]
for size in [128,256]:
 pad=4; pitch=size+pad*2; columns=5; rows=math.ceil(len(m)/columns)
 atlas=Image.new('RGBA',(pitch*columns,pitch*rows),(0,0,0,0))
 for i,a in enumerate(m):
  img=Image.open(ROOT/a['preview_png']).convert('RGBA').resize((size,size),Image.Resampling.LANCZOS)
  x=(i%columns)*pitch+pad;y=(i//columns)*pitch+pad
  atlas.paste(img,(x,y),img)
  # Extrude edge RGBA into gutters to avoid transparent-white interpolation. The object is itself padded.
  # No extra world shadow or visible background is drawn.
  assets.append((size,a['id'],x,y,size,size))
 f=ROOT/'build'/f'world_art_atlas_{size}.png';atlas.save(f,optimize=True)
 print(size,f.stat().st_size,atlas.size)
meta={'schema':'DL-WORLD-ART-BATCH-01','version':'2026-10-20.a','atlases':{},'entries':{}}
for size in [128,256]:
 p=ROOT/'build'/f'world_art_atlas_{size}.png'
 meta['atlases'][str(size)]={'file':'build/'+p.name,'sha256':sha256(p.read_bytes()).hexdigest(),'pitch':size+8,'padding':4,'columns':5,'width':Image.open(p).width,'height':Image.open(p).height}
for size,asset,x,y,w,h in assets:
 meta['entries'].setdefault(asset,{})[str(size)]={'x':x,'y':y,'w':w,'h':h,'anchor':{'x':.5,'y':.86},'technicalOnly':True}
(ROOT/'atlas_manifest.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2))
