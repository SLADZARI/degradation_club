#!/usr/bin/env python3
"""Apply the exact v2 artwork and UI-only runtime patch to a SEPARATE game candidate.
No Docker, no production write and no world-state operations in this script.
"""
import hashlib
import json
import shutil
import sys
import zipfile
from pathlib import Path

if len(sys.argv) != 3:
    raise SystemExit('Usage: python3 install-v2.py CANDIDATE_RUNTIME ICONS_SOURCE_DIR')
candidate = Path(sys.argv[1]).resolve()
source = Path(sys.argv[2]).resolve()
archive = source.parent / 'assets-source' / 'Dementor_Live_Paper_Icons_v2_CLEAN_REVIEW.zip'
expected = '930d1e390e81e3c1b2734f3abdfa7bbb52077a3feb803bb32efe6b6bd6cd533f'
if not archive.is_file() or hashlib.sha256(archive.read_bytes()).hexdigest() != expected:
    raise SystemExit('STOP: Missing or wrong owner-selected v2 archive')
if not (candidate/'public/index.html').is_file() or not (candidate/'server.mjs').is_file():
    raise SystemExit('STOP: Not an isolated Dementor Live runtime')
if not (candidate/'deploy/Dockerfile').is_file():
    raise SystemExit('STOP: Dockerfile is absent')

def change(relative,old,new):
    target = candidate / relative
    contents = target.read_text(encoding='utf-8')
    if new in contents:
        return
    if old not in contents:
        raise SystemExit('STOP: Unexpected runtime layout in '+relative)
    target.write_text(contents.replace(old,new,1),encoding='utf-8')

base = 'Dementor_Paper_Icons_v2_Clean/'
assets = candidate/'public/assets/paper-icons'
assets.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(archive) as z:
    allowed = ['manifest.json','paper_atlas_64.png','paper_atlas_256.png',
               'QA_preview_32px.png','QA_preview_48px.png','QA_preview_64px.png']
    ids=['wood','stone','food','seed_hemp','seed_carrot','hemp','carrot','water','axe','pick',
         'rifle','ammo','map','shirt','souvenir','paper','backpack','cargo','health','stamina']
    for folder in ['png_64','png_256','svg']:
        allowed += [folder+'/'+id+('.svg' if folder=='svg' else '.png') for id in ids]
    for rel in allowed:
        data=z.read(base+rel)
        dest=assets/rel
        dest.parent.mkdir(parents=True,exist_ok=True)
        dest.write_bytes(data)

for name,target in [('paper-icons.js','public/paper-icons.js'),('paper-icons.css','public/paper-icons.css'),
                    ('verify-paper-icons-v2.mjs','tools/verify-paper-icons-v2.mjs')]:
    p=candidate/target
    p.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(source/name,p)

for html in ['public/index.html','public/combat.html']:
    change(html,'</head>','<link rel="stylesheet" href="/paper-icons.css"><script src="/paper-icons.js" defer></script></head>')

route = r'''    // Paper Cut v2 statics: strict allowlist only for the approved 20 IDs.
    const iconsV2=['wood','stone','food','seed_hemp','seed_carrot','hemp','carrot','water','axe','pick','rifle','ammo','map','shirt','souvenir','paper','backpack','cargo','health','stamina'];
    const iconRoute=/^\/assets\/paper-icons\/(png_256|png_64)\/([a-z_]+)\.png$/.exec(url.pathname);
    let iconRelative=null,iconMime='image/png';
    if(iconRoute&&iconsV2.includes(iconRoute[2]))iconRelative='assets/paper-icons/'+iconRoute[1]+'/'+iconRoute[2]+'.png';
    else if(url.pathname==='/assets/paper-icons/paper_atlas_64.png')iconRelative='assets/paper-icons/paper_atlas_64.png';
    else if(url.pathname==='/assets/paper-icons/paper_atlas_256.png')iconRelative='assets/paper-icons/paper_atlas_256.png';
    else if(url.pathname==='/assets/paper-icons/manifest.json'){iconRelative='assets/paper-icons/manifest.json';iconMime='application/json; charset=utf-8';}
    if(iconRelative){
      const assetPath=path.join(root,'public',iconRelative);
      if(!fs.existsSync(assetPath)){res.writeHead(404);res.end('Not found');return;}
      res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'self'");
      res.writeHead(200,{'Content-Type':iconMime,'Cache-Control':'no-cache'});
      if(req.method==='HEAD')res.end();else res.end(fs.readFileSync(assetPath));return;
    }
'''
change('server.mjs','    const files={',route+'    const files={')
change('server.mjs',"'\/manifest.webmanifest':'manifest.webmanifest'".replace('\\/','/'),
       "'/manifest.webmanifest':'manifest.webmanifest','/paper-icons.js':'paper-icons.js','/paper-icons.css':'paper-icons.css'")
pkg=candidate/'package.json'
p=json.loads(pkg.read_text(encoding='utf-8'))
if p['version'] not in ['0.4.0-world-p0','0.4.1-icons-v2','0.5.0-rc.2','0.5.0-rc.3','0.5.0-rc.4']:
    raise SystemExit('STOP: Unexpected runtime baseline for clean icon v2 overlay')
if p['version']=='0.4.0-world-p0':
    p['version']='0.4.1-icons-v2'
# Keep the approved RC2/RC3 release identity unchanged while applying exact icon bytes.
p['scripts']['check:icons']='node tools/verify-paper-icons-v2.mjs'
pkg.write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
change('deploy/Dockerfile',
       'RUN npm run doctor && npm run check && install -d -o node -g node /app/data',
       'RUN npm run doctor && npm run check && npm run check:icons && install -d -o node -g node /app/data')
print('PASS: canonical owner-selected v2 images and interface installed in isolated candidate.')
