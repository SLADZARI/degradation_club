#!/usr/bin/env python3
"""Deterministic SVG-first terrain atlas build; writes no world state or UI-icon bytes."""
from __future__ import annotations
import hashlib
import io
import json
from pathlib import Path
import cairosvg
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'assets-source'/'terrain'
PUBLIC=ROOT/'public'/'assets'/'terrain'
NAMES=[
  'road_01','road_02','road_03','grass_01','grass_02','grass_03',
  'flowers_01','flowers_02','flowers_03',
  'road_edge_n','road_edge_e','road_edge_s','road_edge_w',
  'road_corner_nw','road_corner_ne','road_corner_se','road_corner_sw'
]
GROUPS={'paving':NAMES[:3], 'grass':NAMES[3:6], 'flowers':NAMES[6:9]}
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def build():
  assert len(NAMES)==17 and len(set(NAMES))==17
  PUBLIC.mkdir(parents=True,exist_ok=True)
  manifest={
    'schema':'DL-TERRAIN-01','version':'1.1.0-rc.3',
    'style':'paper-cut-iso30','status':'rc3-candidate',
    'viewBox':[0,0,256,148],'tile_world_cells':[1,1],
    'variants':GROUPS,
    'geometry':{'screenX':'(x-y)*sqrt(3)/2*unit','screenY':'(x+y)*0.5*unit',
      'anchor':[128,0], 'center':[128,74], 'corners':[[128,0],[256,74],[128,148],[0,74]]},
    'automatic_overlays':{'edges':['n','e','s','w'],'corners':['nw','ne','se','sw'],
      'source':'neighbouring paving cells, not purchasable products'},
    'atlas':{},'assets':{}
  }
  for name in NAMES:
    file=SOURCE/(name+'.svg')
    data=file.read_text(encoding='utf-8')
    if not ('viewBox="0 0 256 148"' in data and 'DL-TERRAIN-01' in data):
      raise ValueError('Invalid ISO30 vector: '+name)
    if any(fragment in data.lower() for fragment in ['<script','<image','<foreignobject','filter=','http://','https://']):
      # SVG namespace is the one approved URL; disallow only extra external hrefs below.
      if '<script' in data.lower() or '<image' in data.lower() or '<foreignobject' in data.lower() or 'filter=' in data.lower():
        raise ValueError('Unsafe terrain vector: '+name)
    manifest['assets'][name]={'source':'assets-source/terrain/'+name+'.svg',
      'sha256':digest(file),'raster':{}}
  # Cleanup old hashed versions in build directory only (never player data).
  for f in PUBLIC.glob('dl-terrain-01-atlas-*'):
    if f.is_file() and f.suffix in ('.png','.webp'):f.unlink()
  for scale,tag in ((1,'256'),(.5,'128')):
    width,height=round(256*scale),round(148*scale)
    gutter=4
    atlas=Image.new('RGBA',(5*(width+2*gutter),4*(height+2*gutter)))
    for i,name in enumerate(NAMES):
      svg=(SOURCE/(name+'.svg')).read_bytes()
      rgba=Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg,
        output_width=width,output_height=height))).convert('RGBA')
      if rgba.size!=(width,height):raise ValueError('Tile shape incorrect: '+name)
      x=(i%5)*(width+2*gutter)+gutter
      y=(i//5)*(height+2*gutter)+gutter
      atlas.paste(rgba,(x,y))
      # Extrude only this sprite's own perimeter, never a neighbour's pixels.
      for edge in range(1,gutter+1):
        atlas.paste(rgba.crop((0,0,1,height)),(x-edge,y))
        atlas.paste(rgba.crop((width-1,0,width,height)),(x+width-1+edge,y))
        atlas.paste(rgba.crop((0,0,width,1)),(x,y-edge))
        atlas.paste(rgba.crop((0,height-1,width,height)),(x,y+height-1+edge))
      for sx,dx in ((0,x-gutter),(width-1,x+width)):
        for sy,dy in ((0,y-gutter),(height-1,y+height)):
          atlas.paste(rgba.getpixel((sx,sy)),(dx,dy,dx+gutter,dy+gutter))
      manifest['assets'][name]['raster'][tag]={'x':x,'y':y,'w':width,'h':height}
    candidates=[]
    for extension in ('png','webp'):
      temporary=PUBLIC/('temporary-'+tag+'.'+extension)
      if extension=='png':atlas.save(temporary,format='PNG',compress_level=9)
      else:atlas.save(temporary,format='WEBP',lossless=True,quality=100,method=6)
      # WebP must decode without RGB or alpha changes before shipping.
      if extension=='webp' and Image.open(temporary).convert('RGBA').tobytes()!=atlas.tobytes():
        temporary.unlink();continue
      checksum=digest(temporary)
      dest=PUBLIC/('dl-terrain-01-atlas-'+tag+'-'+checksum[:12]+'.'+extension)
      temporary.replace(dest)
      candidates.append((dest,checksum))
    if not candidates:raise ValueError('No valid atlas output')
    candidates.sort(key=lambda c:c[0].stat().st_size)
    primary,sha=candidates[0]
    png=next(item for item in candidates if item[0].suffix=='.png')
    manifest['atlas'][tag]={'file':primary.name,'sha256':sha,
      'fallback_png':png[0].name,'fallback_png_sha256':png[1],
      'width':atlas.width,'height':atlas.height,'gutter_px':gutter,
      'tile_px':[width,height],'rows':4,'columns':5}
  (PUBLIC/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
  print('DL-TERRAIN-01 PASS: 17 SVG → 128/256 atlas, 4px gutters and SHA-256 URLs')
if __name__=='__main__':build()
