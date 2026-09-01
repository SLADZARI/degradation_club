import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const svg=await readFile(new URL('assets/characters/character-01/character-01-layered.svg',root),'utf8');
const manifest=JSON.parse(await readFile(new URL('assets/characters/character-01/manifest.json',root),'utf8'));

for(const id of ['body-arm-left','body-arm-right','body-leg-left','body-leg-right','head-rig','hat','glasses','beard','accessory','outfit','shoes','eyes-neutral','eyes-tense','eyes-sleepy','eyes-overheat','brows-neutral','brows-tense','brows-angry','mouth-neutral','mouth-soft','mouth-tense','mouth-open']){
  assert.match(svg,new RegExp(`id=["']${id}["']`),`semantic character asset exposes #${id}`);
}
assert.deepEqual(manifest.appearanceLayers,['hat','glasses','beard','accessory','outfit','shoes']);
assert.equal(manifest.viewBox,'0 0 703 1024');
console.log('DEMENTOR LAB character asset selftest: PASS');
