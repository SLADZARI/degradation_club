#!/usr/bin/env python3
"""Reconcile existing physical registries and the independently authored world-art draft."""
from pathlib import Path
from zipfile import ZipFile
from collections import Counter
import csv, json, hashlib, xml.etree.ElementTree as ET, io, os
from PIL import Image
ROOT=Path(__file__).resolve().parent
ZIP=Path(os.environ.get('DL_ORIGAMI_REGISTRY_ZIP','/mnt/data/Dementor_Live_Origami_PNG_Catalog_v04.zip'))
OLD=Path(os.environ.get('DL_PHYSICAL_REGISTRY_ZIP','/mnt/data/Dementor_Live_Physical_Asset_Registry_v0_1.zip'))
if not ZIP.is_file() or not OLD.is_file():
    raise SystemExit('Для повторного сравнительного аудита укажи DL_ORIGAMI_REGISTRY_ZIP и DL_PHYSICAL_REGISTRY_ZIP (локальные архивы прежних каталогов). Имеющийся WORLD_ASSET_GAP_AUDIT.csv уже сохранён в репозитории.')
with ZipFile(ZIP) as z: old=json.loads(z.read('Dementor_Live_Origami_Registry_v04/registry.json'))['objects']
with ZipFile(OLD) as z: existing_svg={Path(n).stem for n in z.namelist() if n.endswith('.svg')}
new=json.loads((ROOT/'manifest.json').read_text())['assets'];new_legacy={x['game_object'] for x in new if x['game_object'].startswith('DL-')}
reconciled=[]
for obj in old:
    oid=obj['id']; logical=obj['sourceStatus']=='logical'; png=bool(obj.get('paperPNG')); svg=oid in existing_svg
    linked=[x['id'] for x in new if x['game_object']==oid]
    if logical and not linked and not png and not svg: status='LOGICAL_NO_INDEPENDENT_SPRITE_REQUIRED'
    elif linked: status='NEW_ISO30_SVG_CANDIDATE'
    elif svg: status='LEGACY_SVG_CANDIDATE_NOT_QA_APPROVED'
    elif png: status='LEGACY_PNG_ONLY_CANDIDATE_REQUIRES_SVG'
    else: status='MISSING_INDEPENDENT_APPROVED_SVG'
    reconciled.append({'object_id':oid,'name':obj['name'],'category':obj['category'],'source_status':obj['sourceStatus'],'legacy_png_candidate':png,'legacy_svg_candidate':svg,'new_svg_candidate':';'.join(linked),'asset_status':status,'notes':obj.get('notes','')})
# Add separately scoped game world types not contained in the historical physical registry.
for a in new:
    if not a['game_object'].startswith('DL-'):
        reconciled.append({'object_id':a['game_object'],'name':a['name'],'category':a['category'],'source_status':a['branch'],'legacy_png_candidate':False,'legacy_svg_candidate':False,'new_svg_candidate':a['id'],'asset_status':'NEW_ISO30_SVG_CANDIDATE_ISOLATED' if a['branch'] not in ['RC4','GRID-02'] else 'NEW_ISO30_SVG_CANDIDATE','notes':'Rendering only; no game geometry/rights/logic added'})
with (ROOT/'WORLD_ASSET_GAP_AUDIT.csv').open('w',newline='',encoding='utf-8') as out:
 w=csv.DictWriter(out,fieldnames=list(reconciled[0]));w.writeheader();w.writerows(reconciled)
counts=Counter(x['asset_status'] for x in reconciled)
base={'physical_registry_objects':len(old),'existing_png_candidates':sum(bool(x.get('paperPNG')) for x in old),'existing_legacy_svg_candidates':len(existing_svg),'legacy_logical':sum(x['sourceStatus']=='logical' for x in old),'new_world_svg_candidates':len(new),'new_scene_objects_without_prior_registry':sum(1 for a in new if not a['game_object'].startswith('DL-')),'audit_records':len(reconciled),'classification':dict(counts),'limits':['Not an exhaustive survey of every generated runtime obstacle instance','Historical physical inventory v04 is 116 types, not a list of every currently deployed sprite','Legacy AI-extracted PNGs are visual candidates and may contain rough cutouts','No production server, world save or hero modified. Research branches remain isolated.']}
(ROOT/'GAP_SUMMARY.json').write_text(json.dumps(base,ensure_ascii=False,indent=2))
print(json.dumps(base,ensure_ascii=False,indent=2))
