import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  CHARACTER_REGISTRY,
  SHARED_APPEARANCE_CATEGORIES,
  CHARACTER_OWNED_CATEGORIES,
  APPEARANCE_VARIANT_KEYS,
  createAppearanceState,
  normalizeVariantAppearance,
  variantOptions,
  hasVariantContract,
  registerCharacterManifest,
  resetCharacterContracts
} from '../src/render/character-registry.mjs';

const root=new URL('../',import.meta.url);
assert.deepEqual(Object.keys(CHARACTER_REGISTRY).sort(),['character-01','character-02'],'registry still contains exactly two production base characters');
assert.deepEqual(SHARED_APPEARANCE_CATEGORIES,['hat','glasses','facialHair','accessory']);
assert.deepEqual(CHARACTER_OWNED_CATEGORIES,['outfit','shoes']);
assert.equal(APPEARANCE_VARIANT_KEYS.facialHair,'facialHairVariant');

for(const characterId of Object.keys(CHARACTER_REGISTRY)){
  const state=createAppearanceState(characterId);
  assert.equal(state.baseCharacterId,characterId);
  assert.equal(state.sharedAppearance.hatVariant,null);
  assert.equal(state.ownedAppearance.outfitVariant,null);
  assert.equal(state.colors.shoesPrimary,null);
  for(const category of [...SHARED_APPEARANCE_CATEGORIES,...CHARACTER_OWNED_CATEGORIES])assert.ok(Array.isArray(variantOptions(characterId,category)),`${characterId} exposes an array for ${category}`);

  const sanitized=normalizeVariantAppearance(characterId,{hatVariant:'not-a-real-hat'},{outfitVariant:'not-a-real-outfit'},{outfitPrimary:'#fff'});
  assert.equal(sanitized.hatVariant,null,'registry rejects undeclared shared variants');
  assert.equal(sanitized.outfitVariant,null,'registry rejects undeclared owned variants');
  assert.equal(sanitized.colors.outfitPrimary,null,'registry rejects undeclared color targets');
}

// Current production SVG + current legacy manifest is valid, but must not advertise future numbered variants.
for(const characterId of Object.keys(CHARACTER_REGISTRY)){
  const dir=new URL(`assets/characters/${characterId}/`,root);
  const svg=await readFile(new URL(`${characterId}-layered.svg`,dir),'utf8');
  const manifest=JSON.parse(await readFile(new URL('manifest.json',dir),'utf8'));
  const validation=registerCharacterManifest(characterId,manifest,svg);
  assert.equal(validation.ok,true,`${characterId} current production manifest matches its current production SVG`);
  assert.equal(hasVariantContract(characterId),false,`${characterId} legacy production asset does not expose candidate variants`);
}

// Candidate manifests are intentionally staged outside production. They must fail against the old reconstructed SVGs.
for(const characterId of Object.keys(CHARACTER_REGISTRY)){
  const svg=await readFile(new URL(`assets/characters/${characterId}/${characterId}-layered.svg`,root),'utf8');
  const candidate=JSON.parse(await readFile(new URL(`reference/character-candidates/${characterId}-manifest.json`,root),'utf8'));
  const validation=registerCharacterManifest(characterId,candidate,svg);
  assert.equal(validation.ok,false,`${characterId} candidate manifest must not be promoted onto unmatched legacy geometry`);
  assert.ok(validation.missingIds.length>0,`${characterId} candidate gate reports missing authored SVG ids`);
  assert.equal(hasVariantContract(characterId),false,`${characterId} failed candidate validation cannot enable variants`);
}

// Prove the gate opens when a manifest and SVG actually agree.
resetCharacterContracts();
const syntheticManifest={
  characterId:'character-01',viewBox:'0 0 703 1024',baseLayers:{body:true,headRig:true},
  faceStates:{eyes:['eyes-neutral'],brows:['brows-neutral'],mouth:['mouth-neutral']},
  variants:{hat:['hat-01'],glasses:[],facialHair:[],accessory:[],outfit:['outfit-01'],shoes:[]},
  colorTargets:['outfit-primary'],rig:{head:[1,2],shoulderLeft:[3,4],shoulderRight:[5,6],hipLeft:[7,8],hipRight:[9,10]}
};
const syntheticSvg='<svg viewBox="0 0 703 1024"><g id="body"/><g id="head-rig"/><g id="eyes-neutral"/><g id="brows-neutral"/><g id="mouth-neutral"/><g id="hat-01"/><g id="outfit-01"><path id="outfit-primary"/></g></svg>';
const syntheticValidation=registerCharacterManifest('character-01',syntheticManifest,syntheticSvg);
assert.equal(syntheticValidation.ok,true,'matching manifest/SVG pair passes the asset gate');
assert.equal(hasVariantContract('character-01'),true,'matching manifest/SVG pair enables the variant contract');
assert.deepEqual(variantOptions('character-01','hat'),['hat-01']);
const selected=normalizeVariantAppearance('character-01',{hatVariant:'hat-01'},{outfitVariant:'outfit-01'},{outfitPrimary:'#dfff00'});
assert.equal(selected.hatVariant,'hat-01');
assert.equal(selected.outfitVariant,'outfit-01');
assert.equal(selected.colors.outfitPrimary,'#dfff00');

resetCharacterContracts();
console.log('DEMENTOR LAB character registry selftest: PASS — manifest/SVG gate blocks mismatches and enables exact variants');
