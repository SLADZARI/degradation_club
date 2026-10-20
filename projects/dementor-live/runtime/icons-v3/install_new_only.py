#!/usr/bin/env python3
"""Dementor Live SVG-FIRST 21..62 installer. NEVER touches approved icon IDs 001..020.

Install on existing 0.5 CIVIC runtime; only stages new assets + UI icon decorations.
Existing hero, gameplay logic, old v2 icon pixels, save data remain unchanged.
Usage: python3 install_new_only.py /path/to/runtime [--stage-only]
"""
from pathlib import Path
from hashlib import sha256
import argparse, json, re, shutil, sys

ROOT=Path(__file__).resolve().parent
ASSETS=ROOT/'assets'
SIZES=(32,48,64,128,256)

def files_hashes(d):
    d=Path(d)
    if not d.exists():return {}
    return {str(p.relative_to(d)):sha256(p.read_bytes()).hexdigest() for p in d.rglob('*') if p.is_file()}

def patch_once(s, needle, replacement, marker):
    if marker in s:return s
    if needle not in s:raise ValueError('Unsupported server/runtime layout: '+repr(needle[:100]))
    return s.replace(needle,replacement+needle,1)

def install(runtime:Path,stage_only=False):
    runtime=Path(runtime).resolve()
    pub=runtime/'public';srv=runtime/'server.mjs';index=pub/'index.html';combat=pub/'combat.html'
    if not all(p.exists() for p in (srv,index,combat)):raise ValueError('Expected Dementor Live runtime with server.mjs, public/index.html and public/combat.html')
    reg=json.loads((ROOT/'manifest-new-only.json').read_text(encoding='utf8'))
    items=reg['items']
    if len(items)!=42 or [x['number'] for x in items] !=[f'DL-ICON-{i:03d}' for i in range(21,63)]:raise ValueError('Incorrect NEW-ONLY registry')
    for x in items:
        stem=x['id'].replace(':','__')
        for ext,sha in [('svg',x['svg_sha256'])]:
            q=ASSETS/ext/(stem+'.'+ext)
            if not q.is_file() or sha256(q.read_bytes()).hexdigest()!=sha:raise ValueError('Corrupt asset '+str(q))
        for size in SIZES:
            q=ASSETS/f'png_{size}'/(stem+'.png')
            if not q.is_file() or sha256(q.read_bytes()).hexdigest()!=x['png_sha256'][str(size)]:raise ValueError('Corrupt PNG '+str(q))
    old_dir=pub/'assets/paper-icons'
    before=files_hashes(old_dir)
    old_js=pub/'paper-icons.js'
    old_css=pub/'paper-icons.css'
    protected={str(f):sha256(f.read_bytes()).hexdigest() for f in (old_js,old_css) if f.exists()}
    rawserver=srv.read_text(encoding='utf8')
    rawindex=index.read_text(encoding='utf8')
    rawcombat=combat.read_text(encoding='utf8')
    if '    const files={' not in rawserver:raise ValueError('Cannot add static asset routes to this server without review')
    route='''    // V3-NEW-ONLY STATIC ROUTE (approved v2 paths unchanged)
    const isV3Manifest=url.pathname==='/assets/paper-icons-new-v3/manifest-new-only.json';
    const iconAsset=/^\\/assets\\/paper-icons-new-v3\\/(?:svg|png_(?:32|48|64|128|256))\\/([A-Za-z0-9_-]+)\\.(?:svg|png)$/.exec(url.pathname);
    if((req.method==='GET'||req.method==='HEAD')&&(isV3Manifest||iconAsset)){
      const assetStem=iconAsset?.[1];
      if(!isV3Manifest&&!V3_NEW_STEMS.has(assetStem)){res.writeHead(404);res.end('Unknown icon');return;}
      const f=path.join(root,'public',url.pathname.slice(1));
      if(!fs.existsSync(f)){res.writeHead(404);res.end(isV3Manifest?'Icon manifest unavailable':'Icon unavailable');return;}
      const contentType=isV3Manifest?'application/json; charset=utf-8':f.endsWith('.svg')?'image/svg+xml; charset=utf-8':'image/png';
      res.writeHead(200,{'Content-Type':contentType,'Cache-Control':isV3Manifest?'no-cache':'public, max-age=120','X-Content-Type-Options':'nosniff'});
      if(req.method==='HEAD'){res.end();return;}
      res.end(fs.readFileSync(f));return;
    }
'''
    stems=', '.join(repr(x['id'].replace(':','__')) for x in items)
    constant='const V3_NEW_STEMS=new Set(['+stems+']);\n'
    if '// V3-NEW-ONLY STATIC ROUTE' not in rawserver:
        # Insert constant before server startup (after imports not necessary; must be before first request).
        pos=rawserver.find('const server=http.createServer(')
        if pos<0:raise ValueError('Cannot find HTTP server')
        rawserver=rawserver[:pos]+constant+rawserver[pos:]
        rawserver=patch_once(rawserver,'    const files={',route,'// V3-NEW-ONLY STATIC ROUTE')
    if not stage_only:
        if "'/new-icons-v3.js'" not in rawserver:
            rawserver=rawserver.replace("const files={'/':'index.html'","const files={'/new-icons-v3.js':'new-icons-v3.js','/':'index.html'",1)
            if "'/new-icons-v3.js'" not in rawserver:raise ValueError('Failed to register JS route')
        for html,content in [(index,rawindex),(combat,rawcombat)]:
            if '/new-icons-v3.js' not in content:
                if '</body>' not in content:raise ValueError('No </body> in '+str(html))
                new=content.replace('</body>','<script src="/new-icons-v3.js" defer></script></body>',1)
                if html==index:rawindex=new
                else:rawcombat=new
    # copy to a NEW namespaced directory; no approved file is ever written.
    dest=pub/'assets/paper-icons-new-v3';dest.mkdir(parents=True,exist_ok=True)
    for folder in ('svg',)+tuple(f'png_{n}' for n in SIZES):
        (dest/folder).mkdir(exist_ok=True)
        for f in (ASSETS/folder).iterdir():
            if f.is_file():shutil.copyfile(f,dest/folder/f.name)
    shutil.copyfile(ROOT/'manifest-new-only.json',dest/'manifest-new-only.json')
    (pub/'new-icons-v3.js').write_bytes((ROOT/'new-icons-v3.js').read_bytes())
    # Commit changes at end and only to exact known UI entrypoints (not gameplay code).
    srv.write_text(rawserver,encoding='utf8')
    if not stage_only:
        index.write_text(rawindex,encoding='utf8');combat.write_text(rawcombat,encoding='utf8')
    # Generate a clearly scoped documentation entry without changing other canons.
    doc=runtime/'docs'/'PAPER_ICONS_NEW_ONLY_V3.md';doc.parent.mkdir(exist_ok=True,parents=True)
    doc.write_text((ROOT/'NEW_ONLY_RELEASE_NOTES.md').read_text(encoding='utf8'),encoding='utf8')
    after=files_hashes(old_dir)
    protected_after={str(f):sha256(f.read_bytes()).hexdigest() for f in (old_js,old_css) if f.exists()}
    assert before==after and protected==protected_after,'IMPORTANT: Approved v2 modified!'
    return {'installed_new':42,'approved_v2_unchanged':True,'new_pictures':42*len(SIZES),'ui_decorations_enabled':not stage_only,'runtime':str(runtime),'gameplay_changed':False}

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('runtime_root');parser.add_argument('--stage-only',action='store_true');args=parser.parse_args()
    try:print(json.dumps(install(Path(args.runtime_root),args.stage_only),ensure_ascii=False,indent=2))
    except Exception as exc:print('INSTALL FAILED:',exc,file=sys.stderr);sys.exit(1)
