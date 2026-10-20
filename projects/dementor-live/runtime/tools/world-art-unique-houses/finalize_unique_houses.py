from pathlib import Path
import json,hashlib,html,io,math
from PIL import Image
from xml.etree import ElementTree as ET
root=Path(__file__).resolve().parents[2]/'assets-source'/'world-art-unique-houses'
m=json.loads((root/'manifest.json').read_text());items=m['entries']
# Strict supplementary iso QA: all SVGs safe/alpha, check base-isometric 30-degree projected ratio via generator code.
def mask_margin(p):
 im=Image.open(p).convert('RGBA');box=im.getchannel('A').getbbox();return min(box[0],box[1],im.width-box[2],im.height-box[3])
assert len(items)==46 and len({x['asset_id'] for x in items})==46
assert len([x for x in items if 'stage_candidate' in x])==21
assert len([x for x in items if x.get('footprint_CU')])==20
assert all(mask_margin(root/'build'/'png_256'/(x['asset_id']+'.png'))>=8 for x in items)
for x in items:
 assert hashlib.sha256((root/x['svg']).read_bytes()).hexdigest()==x['sha256']
 for size in [128,256]:
  im=Image.open(root/'build'/('png_'+str(size))/(x['asset_id']+'.png'));assert im.size==(size,size)
  assert im.mode=='RGBA' or 'transparency' in im.info
# 1:1 ISO30 projection QA at 30-degree ratio
w=207;d=w/math.sqrt(3)
assert abs(math.degrees(math.atan((d/2)/(w/2)))-30)<1e-9
# Exact SHA regen PNG spot group comparison
import cairosvg
for x in items:
 orig=(root/'build'/'png_256'/(x['asset_id']+'.png')).read_bytes()
 new=cairosvg.svg2png(bytestring=(root/x['svg']).read_bytes(),output_width=256,output_height=256)
 assert orig==new,x['asset_id']
# Accessible browse-friendly gallery, no network dependency (HTML embeds only paths, no external dependencies)
cards=[]
for x in items:
 id=x['asset_id'];category='stage' if 'stage_candidate' in x else 'building' if id.startswith('city-') or id=='plot-personal-tent' else 'furniture'
 cards.append(f'<article class="tile" data-kind="{category}" data-id="{html.escape(id)}"><div class="graphic"><img src="build/png_256/{html.escape(id)}.png" alt="{html.escape(x["title"])}" loading="lazy" width="170" height="170"></div><strong>{html.escape(x["title"])}</strong><small>{html.escape(id)}</small><small>{html.escape(x["scope"])} · {category}</small><small>{"FP "+str(x["footprint_CU"])+" CU" if x.get("footprint_CU") else "Footprint requires measurement"}</small><div class="controls"><label><input type="radio" name="{id}" value="APPROVED"> Утвердить</label><label><input type="radio" name="{id}" value="REWORK"> Доработать</label></div></article>')
prefix='''<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dementor Live · уникальные здания и мебель · QA</title>
<style>:root{font:14px/1.5 system-ui;color:#23313f;background:#f7f6ef}body{max-width:1450px;margin:auto;padding:20px}header{padding-bottom:8px;border-bottom:1px solid #d9ddd4}h1{margin:4px 0;font-size:26px}p{color:#536155}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(205px,1fr));gap:15px;margin-top:18px}.tile{background:#fffdfa;border:1px solid #e3e4da;border-radius:10px;padding:10px;display:flex;flex-direction:column;gap:4px}.graphic{height:185px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#e5e7de 25%,#eef0e8 25% 50%,#e5e7de 50% 75%,#eef0e8 75%);background-size:16px 16px}.graphic img{object-fit:contain;width:170px;height:170px}.tile small{color:#6d756a}.controls{display:flex;gap:8px;flex-wrap:wrap;margin-top:auto;font-size:11px}button,select,input{font:inherit;padding:7px;border:1px solid #c0c4b9;border-radius:5px;background:white}label{cursor:pointer}.toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:13px}.note{padding:10px 12px;border-left:3px solid #8c947c;background:#f0f2ea}#stats{font-weight:600}</style>
<header><h1>Уникальные здания · грядки · мебель</h1><p>SVG-first · ISO30 Paper World · G6 графическая приёмка. Проверка файлов PASS; художественная и игровая приёмка не пройдены автоматически.</p><div class="note">Оригинальные 20 иконок и 17 покрытий земли не заменяются. «Утвердить» здесь сохраняет только локальный JSON для передачи разработчикам; не включает ассеты в игру и не меняет сервер.</div><div class="toolbar"><input id="find" placeholder="Найти по названию и ID"><select id="filter"><option value="all">Все 46</option><option value="building">Уникальные здания</option><option value="furniture">Грядки и мебель</option><option value="stage">Строительные стадии</option></select><button id="export">Экспорт решения JSON</button><strong id="stats"></strong></div></header><main>'''
suffix='''</main><script>const all=[...document.querySelectorAll('.tile')];const lookup=()=>{const q=document.getElementById('find').value.toLowerCase(),k=document.getElementById('filter').value;let count=0;for(const card of all){const show=(k==='all'||card.dataset.kind===k)&&card.textContent.toLowerCase().includes(q);card.hidden=!show;if(show)count++;}document.getElementById('stats').textContent=count+' / '+all.length;};document.querySelector('#find').oninput=lookup;document.querySelector('#filter').onchange=lookup;lookup();document.querySelector('#export').onclick=()=>{const selected=all.map(t=>({asset_id:t.dataset.id,art_review:t.querySelector('input:checked')?.value||'PENDING'}));const blob=new Blob([JSON.stringify({style:'DL-ISO30-PAPER-WORLD-01',date:'2026-10-20',author:'owner-visual-review',note:'CANDIDATES_ONLY_NOT_GAME_DEPLOY',reviews:selected},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='DL_WORLD_ART_OWNER_QA_46.json';a.click();URL.revokeObjectURL(a.href);};</script></html>'''
(root/'GALLERY.html').write_text(prefix+'\n'.join(cards)+suffix)
review={'schema':'DL-ISO30-ART-QA-V1','version':'1.0','art_status':'CANDIDATES_WAITING_FOR_OWNER','images':46,'acceptance_gates':[
 {'gate':'G5_SOURCE','pass_criteria':'unique valid SVG; no scripts/filter/image; alpha=0 corners, >=8px margins at 256; deterministic build; correct IDs','status':'PASS'},
 {'gate':'G6_ART_DIRECTION','pass_criteria':'owner reviews 46 individual visuals, unique facade silhouettes incl 64px screenshot, correct paper layers and no external shadow','status':'PENDING'},
 {'gate':'G6_FOOTPRINT','pass_criteria':'exact W×D×H CU from server, screenshot bbox/anchor, ground 30 degree, obstacle/door no overlap','status':'NOT_RUN'},
 {'gate':'G6_BUILD_STAGES','pass_criteria':'server state stage mapping with no invented stages; stage 0/1/2/(final) only when actual sequence exists; no premature finished houses','status':'NOT_RUN'},
 {'gate':'G6_GAMEPLAY','pass_criteria':'city/plot/interior/expedition, depth vs hero/NPC/z sorted, move/interaction, both clients, no wallet/save regression','status':'NOT_RUN'},
 {'gate':'G6_PERFORMANCE','pass_criteria':'Chrome Desktop 60 FPS and real iPhone Safari >=30 FPS goals under agreed hardware, 100/500/1200 ground tiles','status':'NOT_RUN'},
 {'gate':'G7_DEPLOY','pass_criteria':'exact SHA CI, backup+restore copy, dry-run, 0-player window, explicit owner GO','status':'NOT_RUN'}],
 'scope_notes':{'unique_house_instance':'facade profile tied to persistent objectId/cityId; do not randomly resample between reloads; plot personal dwelling remains a tent until gameplay contract updated','world':'Do not merge isolated WORLD-01/Museum/Obitel scenarios merely because an SVG exists','protected':'20 v2 CLEAN UI icons, 17 DL-TERRAIN-01 SVG/atlas, hero, world.json, economic ledger'}}
(root/'qa'/'ACCEPTANCE_GATES.json').write_text(json.dumps(review,ensure_ascii=False,indent=2)+'\n')
(root/'README.md').write_text('''# Dementor Live · Уникальные городские здания и мебель · ISO30 / QA Batch 03

**Source base:** legacy `degradation_club` PR #303 (stacks on #301), independently from locked RC4. **Status:** G5 SVG/PNG TESTED; G6 ART/GEOMETRY NOT APPROVED; G7 NOT DEPLOYED.

## Contents

- **14** visually differentiated architectural structures and site-gate candidates, including shop/tool/seed/garden, warehouse, forge, visitor kiosk, museum entrance, future university/arena/industry site, farlands gate, two distinct temporary/personal tents and garden pavilion.
- **11** detailed 2D ISO30 assets: five garden-bed growth states, two benches, two chairs, table, chest.
- **21** staged drawings across seven referenced object types: conceptual foundation/frame/partially enclosed, with distinct silhouettes. **Not all seven objects have server-side construction stages; these images MUST NOT be bound to runtime stages until the actual state machine is mapped.** For forge/garden/seed shop the state must be inspected at exact RC4 SHA; for tool shop, warehouse, mayor tent conceptual variants are documentation only.
- **46** independent transparent 512×512 SVG, **92** PNG at 256/128, browsable `GALLERY.html`, SHA manifest, visual review export, QA gates.

## Existing canon kept

`DL-ISO30-PAPER-WORLD-01`: matte cut-paper faces, paper-flat distinct planes, muted tone, no cast shadows, editable standalone SVG; horizontal ground axes ±30°. `DL-GRID-01 / GRID-02`: one movement/footprint/depth contract across city/plots/interiors. `DL-STYLE-PAPER-CUT-01`: UI inventory icon-only style kept separate. The 20 approved Paper Cut v2 CLEAN icons and 17 DL-TERRAIN-01 tiles remain immutable.

**No new houses or money:** Personal plot currently builds a three-step tent, not a separate finished private house. No new residential entity, plot variant, save field, currency, collision shape or room footprint is introduced by SVG candidates.

## Exact QA method

`python3 build_unique_world_house_set.py` (local generator source) then `python3 finalize_unique_houses.py` to check deterministic raster, alpha-safe 8-pixel margins, identity and 30 degree base projection. In `GALLERY.html`, review each 46 source images, mark APPROVED/REWORK and export JSON. `qa/ACCEPTANCE_GATES.json` records explicit gate criteria and NOT RUNs. Do not treat this technical pass as a visual or game release pass.

## Correct in-game future wiring

Authoritative game IDs are in `manifest.json`; never replace a unique ID with a random style at runtime. For a multi-city system, derive any design variation deterministically from existing `{cityId}:{objectId}` and its construction state. Use actual `world-footprints.mjs`, `local-geometry.mjs` and game state for footprints & depth; **a PNG's bounding box never defines collision**. Put ground tiles and beds below structures, furniture in shared z-sort with residents. Verify real 64/128/256px render, entry/exit doors and no edge clipping. Preserve prior approved house render as fallback until QA and explicit implementation decision.

**Do not publish from this pack or deploy to VM by itself.**
''')
print('PASS 46 SVG + 92 PNG + QA gates/HTML, deterministic regen, 30deg math, no duplicate assets')
