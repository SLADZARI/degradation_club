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
}

resetCharacterContracts();

// Production character-01 is now the exact cleaned asset and must expose its authored contract.
{
  const characterId='character-01';
  const dir=new URL(`assets/characters/${characterId}/`,root);
  const svg=await readFile(new URL(`${characterId}-layered.svg`,dir),'utf8');
  const manifest=JSON.parse(await readFile(new URL('manifest.json',dir),'utf8'));
  const validation=registerCharacterManifest(characterId,manifest,svg);
  assert.equal(validation.ok,true,'character-01 exact production manifest matches exact production SVG');
  assert.equal(hasVariantContract(characterId),true,'character-01 exact production asset enables variants');
  assert.deepEqual(variantOptions(characterId,'hat'),['hat-01','hat-02','hat-03','hat-04','hat-05','hat-06','hat-07']);
  assert.deepEqual(variantOptions(characterId,'outfit'),['outfit-01','outfit-02','outfit-03']);
  assert.deepEqual(variantOptions(characterId,'shoes'),['shoes-01']);

  const selected=normalizeVariantAppearance(characterId,{hatVariant:'hat-03',facialHairVariant:'facial-hair-02'},{outfitVariant:'outfit-02',shoesVariant:'shoes-01'},{outfitPrimary:'#dfff00',shoesPrimary:'#111111'});
  assert.equal(selected.hatVariant,'hat-03');
  assert.equal(selected.facialHairVariant,'facial-hair-02');
  assert.equal(selected.outfitVariant,'outfit-02');
  assert.equal(selected.shoesVariant,'shoes-01');
  assert.equal(selected.colors.outfitPrimary,'#dfff00');
  assert.equal(selected.colors.shoesPrimary,'#111111');

  const sanitized=normalizeVariantAppearance(characterId,{hatVariant:'not-a-real-hat'},{outfitVariant:'not-a-real-outfit'},{outfitPrimary:'#fff'});
  assert.equal(sanitized.hatVariant,null,'registry rejects undeclared shared variants');
  assert.equal(sanitized.outfitVariant,null,'registry rejects undeclared owned variants');
  assert.equal(sanitized.colors.outfitPrimary,'#fff','declared character-01 paint target remains available independent of variant selection');
}

// Production character-02 remains the legacy asset until its exact source is promoted.
{
  const characterId='character-02';
  const dir=new URL(`assets/characters/${characterId}/`,root);
  const svg=await readFile(new URL(`${characterId}-layered.svg`,dir),'utf8');
  const manifest=JSON.parse(await readFile(new URL('manifest.json',dir),'utf8'));
  const validation=registerCharacterManifest(characterId,manifest,svg);
  assert.equal(validation.ok,true,'character-02 current legacy production manifest matches its production SVG');
  assert.equal(hasVariantContract(characterId),false,'character-02 legacy production asset does not expose candidate variants');
  for(const category of [...SHARED_APPEARANCE_CATEGORIES,...CHARACTER_OWNED_CATEGORIES])assert.deepEqual(variantOptions(characterId,category),[],`character-02 exposes no numbered ${category} variants yet`);

  const candidate=JSON.parse(await readFile(new URL(`reference/character-candidates/${characterId}-manifest.json`,root),'utf8'));
  const candidateValidation=registerCharacterManifest(characterId,candidate,svg);
  assert.equal(candidateValidation.ok,false,'character-02 candidate manifest must not be promoted onto unmatched legacy geometry');
  assert.ok(candidateValidation.missingIds.length>0,'character-02 candidate gate reports missing authored SVG ids');
  assert.equal(hasVariantContract(characterId),false,'failed character-02 candidate validation cannot enable variants');
}

// Prove the gate still opens for a minimal exact pair and blocks undeclared values.
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

resetCharacterContracts();
console.log('DEMENTOR LAB character registry selftest: PASS — character-01 exact, character-02 legacy, manifest/SVG gate enforced');
