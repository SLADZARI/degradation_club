"""Standalone reproducible SVG-first export. Run from this batch folder or repository tools path.
Dependency: python -m pip install cairosvg pillow. Never writes game saves or approved UI icons.
"""
from pathlib import Path
import sys, json, hashlib, io
import cairosvg
from PIL import Image

HERE=Path(__file__).resolve().parent
root=HERE.parent if (HERE.parent/'manifest.json').exists() else HERE.parents[1]/'assets-source'/'world-art-batch02'
manifest=root/'manifest.json'
if not manifest.exists():raise SystemExit('Cannot find art batch02 manifest.json: '+str(root))
data=json.loads(manifest.read_text(encoding='utf-8'))
for r in data['assets']:
    svg=(root/r['svg']).read_bytes()
    if hashlib.sha256(svg).hexdigest()!=r['sha256']:raise SystemExit('SVG content mismatch: '+r['physical_id'])
    for size in [128,256]:
        png=root/r['png_'+str(size)]
        png.parent.mkdir(parents=True,exist_ok=True)
        png.write_bytes(cairosvg.svg2png(bytestring=svg,output_width=size,output_height=size))
        assert Image.open(png).size==(size,size)
stages_file=root/'STAGE_VARIANTS.json'
if stages_file.exists():
    stages=json.loads(stages_file.read_text(encoding='utf-8'))['variants']
    for v in stages:
        svg=(root/v['source']).read_bytes()
        if hashlib.sha256(svg).hexdigest()!=v['sha256']:raise SystemExit('Stage source mismatch: '+v['physical_id']+' '+v['visual_state'])
        png=root/v['png'];png.parent.mkdir(parents=True,exist_ok=True)
        png.write_bytes(cairosvg.svg2png(bytestring=svg,output_width=256,output_height=256))
    print('Export complete:',len(data['assets']),'SVG,',len(data['assets'])*2,'PNG +',len(stages),'state previews; no live files touched')
else:
    print('Export complete:',len(data['assets']),'SVG,',len(data['assets'])*2,'PNG; no live files touched')
