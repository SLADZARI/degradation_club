import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const charactersRoot=new URL('assets/characters/',root);
const requiredIds=['body-arm-left','body-arm-right','body-leg-left','body-leg-right','head-rig','hat','glasses','beard','accessory','outfit','shoes','eyes-neutral','eyes-tense','eyes-sleepy','eyes-overheat','brows-neutral','brows-tense','brows-angry','mouth-neutral','mouth-soft','mouth-tense','mouth-open'];
const roster=['character-01','character-02'];

const dirs=(await readdir(charactersRoot,{withFileTypes:true})).filter(x=>x.isDirectory()).map(x=>x.name).sort();
assert.deepEqual(dirs,roster,'production character directory contains exactly two base character folders');

const runtimeSvgs=[];
for(const characterId of roster){
  const dir=new URL(`${characterId}/`,charactersRoot);
  const files=await readdir(dir);
  const svgs=files.filter(name=>name.toLowerCase().endsWith('.svg'));
  assert.equal(svgs.length,1,`${characterId} owns exactly one runtime SVG`);
  runtimeSvgs.push(`${characterId}/${svgs[0]}`);

  const svg=await readFile(new URL(svgs[0],dir),'utf8');
  const manifest=JSON.parse(await readFile(new URL('manifest.json',dir),'utf8'));
  for(const id of requiredIds)assert.match(svg,new RegExp(`id=["']${id}["']`),`${characterId} exposes #${id}`);
  assert.deepEqual(manifest.appearanceLayers,['hat','glasses','beard','accessory','outfit','shoes']);
  assert.equal(manifest.viewBox,'0 0 703 1024');
}

assert.deepEqual(runtimeSvgs,['character-01/character-01-layered.svg','character-02/character-02-layered.svg']);
console.log('DEMENTOR LAB character asset selftest: PASS — exactly two base SVGs');
