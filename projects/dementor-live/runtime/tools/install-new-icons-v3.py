#!/usr/bin/env python3
"""Install approved SVG-first new-only icons 21..62; never touch world save or v2 artwork."""
from hashlib import sha256
from pathlib import Path, PurePosixPath
import shutil, subprocess, sys, tempfile, zipfile

RUNTIME = Path(sys.argv[1] if len(sys.argv)>1 else '.').resolve()
ARCHIVE = RUNTIME/'assets-source'/'Dementor_Live_NEW_ICONS_ONLY_21_62_v3_1.zip'
EXPECTED = '83fdd8133a62e1c64e8704c9df887769f88cd4b7e6b4ee855aa3e0fe17bed99a'
PATCHED_INSTALLER = RUNTIME/'icons-v3'/'install_new_only.py'
if not ARCHIVE.is_file() or sha256(ARCHIVE.read_bytes()).hexdigest()!=EXPECTED:
    raise SystemExit('STOP: missing or incorrect NEW-ONLY 21..62 source archive')
if not PATCHED_INSTALLER.is_file():
    raise SystemExit('STOP: missing checked-in new-only installer')
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
    extracted_installer=Path(temporary)/'install_new_only.py'
    shutil.copyfile(PATCHED_INSTALLER,extracted_installer)
    subprocess.run([sys.executable,str(extracted_installer),str(RUNTIME)],check=True)
print('PASS: owner-approved new-only v3.1 installed; existing 20 v2 protected by installer hashes')
