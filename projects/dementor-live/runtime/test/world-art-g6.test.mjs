import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const candidate=path.join(root,'assets-source','world-art-unique-houses');
const data=JSON.parse(fs.readFileSync(path.join(candidate,'manifest.json'),'utf8'));
const server=fs.readFileSync(path.join(root,'server.mjs'),'utf8');
const app=fs.readFileSync(path.join(root,'public','app.js'),'utf8');
const world=fs.readFileSync(path.join(root,'public','world-ui.js'),'utf8');
const overlay=fs.readFileSync(path.join(root,'public','world-art-g6.js'),'utf8');

test('G6 candidate set is intact: 54 standalone original SVGs with immutable IDs and hashes',()=>{
 assert.equal(data.entries.length,54);
 const allIds=new Set();
 for(const a of data.entries){
  assert.match(a.asset_id,/^[a-z0-9-]+$/);
  assert.equal(allIds.has(a.asset_id),false,'duplicate '+a.asset_id);
  allIds.add(a.asset_id);
  assert.equal(a.art_state,'CANDIDATE_NOT_APPROVED');
  assert.equal(a.gameplay_connected,false);
  assert.equal(a.svg,'source/svg/'+a.asset_id+'.svg');
  const svg=fs.readFileSync(path.join(candidate,a.svg),'utf8');
  assert.match(svg,/viewBox="0 0 512 512"/);
  assert.ok(svg.includes('data-asset-id="'+a.asset_id+'"'));
  assert.doesNotMatch(svg,/<(?:script|image|filter|foreignObject)\b|url\(|data:/i);
  assert.equal(createHash('sha256').update(svg).digest('hex'),a.sha256,a.asset_id);
 }
});
test('G6 preview script and server are syntactically valid on Node 22+',()=>{
 for(const file of ['server.mjs','public/app.js','public/world-ui.js','public/world-art-g6.js']){
  const p=spawnSync(process.execPath,['--check',path.join(root,file)],{encoding:'utf8'});
  assert.equal(p.status,0,file+': '+p.stderr);
 }
});
test('G6 art source endpoints are test-mode and env guarded; production is unchanged',()=>{
 assert.match(server,/const artG6Enabled=testMode&&process\.env\.DEMENTOR_ART_G6==='1'/);
 assert.match(server,/if\(!artG6Enabled\)\{res\.writeHead\(404\)/);
 assert.match(server,/manifest\.entries\.find\(/);
 assert.match(server,/srcRoot,'assets-source','world-art-unique-houses'/);
 assert.doesNotMatch(server,/--reset-world|down -v|volume rm/);
 assert.match(overlay,/mode==='compare'\|\|mode==='replace'/);
 assert.match(overlay,/if\(!enabled\|\|!allowed\.has\(id\)/);
 assert.match(overlay,/return mode==='replace'/);
});
test('first G6 mapping is constrained to existing RC4 objects, not a new game schema',()=>{
 for(const artId of ['city-tool-shop','city-garden-shop','city-seed-shop','city-warehouse',
   'city-tourist-kiosk','city-museum-gate','city-university-site','city-robo-stadium-site',
   'city-industry-site','city-farlands-gate']){
   assert.ok(data.entries.some(x=>x.asset_id===artId),artId);
   assert.ok(app.includes(artId)||world.includes(artId)||overlay.includes(artId),artId);
 }
 assert.ok(app.includes('if(artId&&window.DLWorldArtG6?.draw(ctx,artId,o,screen,view.s))return;'));
 assert.ok(world.includes("'tourist-kiosk':'city-tourist-kiosk'"));
 assert.ok(app.includes("state.seedMarket.stage>=state.config.seedMarket.stages.length?'city-seed-shop':null"));
 assert.ok(app.includes("drawPlot(o,phase='full')")); // personal plots remain unchanged
});
test('approved UI icons, landscape sprites, hero and save schema are never part of G6 renderer',()=>{
 assert.doesNotMatch(overlay,/\b(?:world\.json|resetWorld|wallet|money|ledger|CharacterId|terrainBag)\b/);
 assert.doesNotMatch(overlay,/\b(?:seed_hemp|seed_carrot|PAPER|paper_atlas_64)\b/);
});
