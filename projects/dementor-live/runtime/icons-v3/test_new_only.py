#!/usr/bin/env python3
import tempfile, hashlib, shutil, subprocess, json, re
from pathlib import Path
from install_new_only import install, ROOT, files_hashes

def digest_tree(p):return files_hashes(p)
def fixture(home):
    r=Path(home)/'runtime';p=r/'public';p.mkdir(parents=True)
    (r/'server.mjs').write_text("import fs from 'node:fs';\nimport path from 'node:path';\nconst root='.';\nconst server=http.createServer(async(req,res)=>{\n    const files={'/':'index.html','/app.js':'app.js','/manifest.webmanifest':'manifest.webmanifest'};\n    const file=files[url.pathname];if(!file){res.writeHead(404);res.end('Not found');return;}\n});\n")
    (p/'index.html').write_text('<!doctype html><html><body>Game</body></html>')
    (p/'combat.html').write_text('<!doctype html><html><body>Combat</body></html>')
    (p/'assets/paper-icons/png_256').mkdir(parents=True)
    for i in range(1,21):(p/'assets/paper-icons/png_256'/f'asset{i}.png').write_bytes(('ORIGINAL_V2_'+str(i)).encode())
    (p/'paper-icons.js').write_text('/* approved js */')
    (p/'paper-icons.css').write_text('/* approved css */')
    return r
with tempfile.TemporaryDirectory() as t:
    r=fixture(t)
    approved=digest_tree(r/'public/assets/paper-icons')
    js=hashlib.sha256((r/'public/paper-icons.js').read_bytes()).digest()
    a=install(r)
    assert a['installed_new']==42 and a['approved_v2_unchanged']
    assert digest_tree(r/'public/assets/paper-icons')==approved
    assert js==hashlib.sha256((r/'public/paper-icons.js').read_bytes()).digest()
    assert len(list((r/'public/assets/paper-icons-new-v3/svg').glob('*.svg')))==42
    assert sum(len(list((r/'public/assets/paper-icons-new-v3'/('png_'+str(s))).glob('*.png'))) for s in (32,48,64,128,256))==210
    assert 'new-icons-v3.js' in (r/'public/index.html').read_text()
    assert 'new-icons-v3.js' in (r/'public/combat.html').read_text()
    assert 'V3_NEW_STEMS' in (r/'server.mjs').read_text()
    routed=(r/'server.mjs').read_text()
    assert "manifest-new-only.json" in routed,'new-only manifest route missing'
    assert "application/json; charset=utf-8" in routed,'manifest must be served as JSON'
    assert "req.method==='HEAD'" in routed,'manifest must support HEAD checks'
    before=digest_tree(r)
    b=install(r)
    assert before==digest_tree(r),'Non-idempotent install!'
    (r/'server.mjs').write_text((r/'server.mjs').read_text().replace('const files=', 'const files_NOT='))
    try:install(r);raise AssertionError('Expected unknown server rejection')
    except ValueError:pass
    subprocess.run(['node','--check',str(r/'public/new-icons-v3.js')],check=True)
    print('PASS: 42 SVG, 210 PNG, old 20 unchanged, stage + activate, JS parse, idempotent, incompatible server rejected')
