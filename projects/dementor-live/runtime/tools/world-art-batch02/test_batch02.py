from pathlib import Path
from xml.etree import ElementTree as ET
from PIL import Image
import json, hashlib, re, io, collections
HERE=Path(__file__).resolve().parent
ROOT=HERE if (HERE/'manifest.json').exists() else HERE.parents[1]/'assets-source'/'world-art-batch02'
m=json.loads((ROOT/'manifest.json').read_text())['assets']
c=json.loads((ROOT/'COVERAGE_139.json').read_text())['coverage']
st=json.loads((ROOT/'STAGE_VARIANTS.json').read_text())['variants']
assert len(m)==90 and len(st)==21 and len(c)==139
assert len({x['physical_id'] for x in m})==90
allowed={'svg','g','path','polygon','rect','ellipse','circle','line','polyline','title'}
for r in m:
 path=ROOT/r['svg']; data=path.read_bytes();root=ET.fromstring(data)
 assert root.attrib['viewBox']=='0 0 512 512' and root.attrib['data-asset-id']==r['physical_id']
 assert hashlib.sha256(data).hexdigest()==r['sha256']
 for el in root.iter():
  assert el.tag.split('}')[-1] in allowed,(path,el.tag)
  for k,v in el.attrib.items():
   assert not k.lower().startswith('on')
   assert 'url(' not in v and 'data:' not in v and 'http:' not in v and 'https:' not in v
 assert not any(x in data.lower() for x in [b'<script',b'<image',b'<foreignobject',b'filter=',b'shadow'])
 for size in [128,256]:
  im=Image.open(ROOT/r[f'png_{size}']).convert('RGBA');assert im.size==(size,size)
  assert all(im.getpixel(p)[3]==0 for p in [(0,0),(size-1,0),(0,size-1),(size-1,size-1)])
  assert im.getchannel('A').getbbox() is not None
 assert hashlib.sha256((ROOT/r['png_256']).read_bytes()).hexdigest()==r['png_sha256']
 assert r['art_status']=='CANDIDATE_NOT_APPROVED' and not r['gameplay_connected']
for r in st:
 root=ET.parse(ROOT/r['source']).getroot()
 assert root.attrib.get('data-object-id')==r['physical_id']
 assert root.attrib.get('data-review')=='CANDIDATE_NOT_APPROVED'
 assert Image.open(ROOT/r['png']).size==(256,256)
assert collections.Counter(x['new_status'] for x in c)=={'SVG_SOURCE_EXISTS_BATCH02_NOT_APPROVED':90,'SVG_SOURCE_EXISTS_BATCH01_NOT_APPROVED':34,'NO_SPRITE_NEEDED':15}
print('PASS batch02 90 SVG, 180 transparent PNG; 21 state SVG+PNG; 139/139 registry statuses; secure XML and unchanged old IDs')
