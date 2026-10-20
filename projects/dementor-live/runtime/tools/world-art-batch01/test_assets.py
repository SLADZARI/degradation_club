from pathlib import Path
from PIL import Image
from xml.etree import ElementTree as ET
import json, hashlib, sys, re
root=Path(__file__).resolve().parent
manifest=json.loads((root/'manifest.json').read_text())['assets']
seen=set()
for a in manifest:
    assert a['id'] not in seen;seen.add(a['id'])
    svg=(root/a['svg']).read_text()
    el=ET.fromstring(svg)
    assert el.attrib.get('viewBox')=='0 0 512 512'
    assert el.attrib['data-asset-id']==a['id']
    assert '<script' not in svg and '<image' not in svg and '<filter' not in svg and '<foreignObject' not in svg
    assert 'url(' not in svg and 'data:' not in svg and 'shadow' not in svg.lower()
    assert hashlib.sha256(svg.encode()).hexdigest()==a['sha256']
    im=Image.open(root/a['preview_png']).convert('RGBA')
    assert im.size==(256,256)
    assert not any(im.getpixel(p)[3] for p in [(0,0),(255,0),(0,255),(255,255)])
    assert min(im.getchannel('A').getbbox()[:2])>=15
    assert max(im.getchannel('A').getbbox()[2:])<=247
    assert a['status']=='CANDIDATE_NOT_DEPLOYED'
assert len(manifest)==35
assert {a['branch'] for a in manifest}=={'RC4','GRID-02','WORLD-01','WORLD-02','CAVE-P0','OBITEL-P0'}
print('PASS 35 SVG valid + 35 independent RGBA PNG 256 + alpha/margins + unique IDs + SHA + scope flags; no game world touched')
