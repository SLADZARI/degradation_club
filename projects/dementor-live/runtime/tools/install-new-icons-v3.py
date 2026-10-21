#!/usr/bin/env python3
"""Install approved SVG-first new-only icons 21..62; never touch world save or v2 artwork."""
from hashlib import sha256
from pathlib import Path, PurePosixPath
import subprocess, sys, tempfile, zipfile

RUNTIME = Path(sys.argv[1] if len(sys.argv)>1 else '.').resolve()
ARCHIVE = RUNTIME/'assets-source'/'Dementor_Live_NEW_ICONS_ONLY_21_62_v3_1.zip'
EXPECTED = '83fdd8133a62e1c64e8704c9df887769f88cd4b7e6b4ee855aa3e0fe17bed99a'
if not ARCHIVE.is_file() or sha256(ARCHIVE.read_bytes()).hexdigest()!=EXPECTED:
    raise SystemExit('STOP: missing or incorrect NEW-ONLY 21..62 source archive')
with tempfile.TemporaryDirectory(prefix='dementor-icons-v3-') as temporary:
    with zipfile.ZipFile(ARCHIVE) as source:
        members=source.namelist()
        if len(members)!=263 or not {'install_new_only.py','manifest-new-only.json','new-icons-v3.js'} <= set(members):
            raise SystemExit('STOP: unexpected source archive contents')
        for name in members:
            p=PurePosixPath(name)
            if p.is_absolute() or '..' in p.parts:
                raise SystemExit('STOP: unsafe source archive entry')
        source.extractall(temporary)
    subprocess.run([sys.executable,str(Path(temporary)/'install_new_only.py'),str(RUNTIME)],check=True)

# The signed owner archive installs the v3 manifest on disk, but its installer
# only exposes image files over HTTP. Publish this one static catalog under its
# documented public URL. Do NOT rewrite/repack the approved archive or v2 art.
manifest = RUNTIME/'public'/'assets'/'paper-icons-new-v3'/'manifest-new-only.json'
if not manifest.is_file():
    raise SystemExit('STOP: approved v3 icon catalog was not installed')
import json
catalog = json.loads(manifest.read_text(encoding='utf-8'))
if len(catalog.get('items', [])) != 42:
    raise SystemExit('STOP: unexpected v3 icon catalog size')

server = RUNTIME/'server.mjs'
current = server.read_text(encoding='utf-8')
marker = '// V3-NEW-ONLY CATALOG ROUTE'
if marker not in current:
    anchor = '    const files={'
    if current.count(anchor) != 1:
        raise SystemExit('STOP: unexpected server route layout for v3 catalog')
    route = """    // V3-NEW-ONLY CATALOG ROUTE; exact name only, no directory browsing.
    if((req.method==='GET'||req.method==='HEAD')&&url.pathname==='/assets/paper-icons-new-v3/manifest-new-only.json'){
      const catalogPath=path.join(root,'public','assets','paper-icons-new-v3','manifest-new-only.json');
      if(!fs.existsSync(catalogPath)){res.writeHead(404);res.end('Icon catalog unavailable');return;}
      res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
      if(req.method==='HEAD'){res.end();return;}
      fs.createReadStream(catalogPath).pipe(res);return;
    }
"""
    server.write_text(current.replace(anchor,route+anchor,1),encoding='utf-8')
print('PASS: owner-approved new-only v3.1 installed, v3 catalog GET/HEAD enabled; 20 v2 assets unchanged')
