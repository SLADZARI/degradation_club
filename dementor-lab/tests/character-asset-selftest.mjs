import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { validateCharacterManifest } from '../src/render/character-registry.mjs';

const root=new URL('../',import.meta.url);
const charactersRoot=new URL('assets/characters/',root);
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
  const validation=validateCharacterManifest(characterId,manifest,svg);
  assert.equal(validation.ok,true,`${characterId} manifest matches its production SVG: ${validation.errors.join('; ')}`);
  assert.equal(manifest.viewBox,'0 0 703 1024');

  const ids=[...svg.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map(match=>match[1]);
  const duplicates=[...new Set(ids.filter((id,index)=>ids.indexOf(id)!==index))];
  assert.deepEqual(duplicates,[],`${characterId} production SVG contains no duplicate DOM ids`);

  if(characterId==='character-01'){
    assert.equal(manifest.version,'cleaned-svg-v1','character-01 is the promoted exact cleaned asset');
    assert.deepEqual(manifest.rig,{head:[352,270],shoulderLeft:[275,345],shoulderRight:[425,345],hipLeft:[311,590],hipRight:[393,591]},'character-01 exact rig pivots are fixed by the promoted source');
    assert.equal(manifest.variants.hat.length,7);
    assert.equal(manifest.variants.glasses.length,4);
    assert.equal(manifest.variants.facialHair.length,4);
    assert.equal(manifest.variants.accessory.length,3);
    assert.equal(manifest.variants.outfit.length,3);
    assert.deepEqual(manifest.variants.shoes,['shoes-01']);
    assert.ok(manifest.colorTargets.includes('outfit-primary'));
    assert.ok(manifest.colorTargets.includes('shoes-primary'));
    assert.match(svg,/data-rig-pivots=/,'character-01 carries authored rig metadata on the SVG root');
    assert.match(svg,/data-color-target=["']outfit-primary["']/,'character-01 exposes normalized shared outfit paint metadata');
  }else{
    assert.ok(Array.isArray(manifest.appearanceLayers),'character-02 remains on the legacy appearance-layer manifest');
    assert.ok(manifest.appearanceLayers.includes('outfit')&&manifest.appearanceLayers.includes('shoes'),'character-02 keeps its owned legacy outfit/shoes layers');
  }
}

assert.deepEqual(runtimeSvgs,['character-01/character-01-layered.svg','character-02/character-02-layered.svg']);
console.log('DEMENTOR LAB character asset selftest: PASS — exact male + legacy female production assets validate');
