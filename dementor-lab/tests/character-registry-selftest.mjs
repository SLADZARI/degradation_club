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

// Both production characters are now exact cleaned SVG + manifest pairs.
for(const characterId of Object.keys(CHARACTER_REGISTRY)){
  const dir=new URL(`assets/characters/${characterId}/`,root);
  const svg=await readFile(new URL(`${characterId}-layered.svg`,dir),'utf8');
  const manifest=JSON.parse(await readFile(new URL('manifest.json',dir),'utf8'));
  const validation=registerCharacterManifest(characterId,manifest,svg);
  assert.equal(validation.ok,true,`${characterId} exact production manifest matches exact production SVG: ${validation.errors.join('; ')}`);
  assert.equal(hasVariantContract(characterId),true,`${characterId} exact production asset enables its authored variant contract`);
  assert.equal(manifest.version,'cleaned-svg-v1',`${characterId} is an exact cleaned production asset`);
}

assert.deepEqual(variantOptions('character-01','hat'),['hat-01','hat-02','hat-03','hat-04','hat-05','hat-06','hat-07']);
assert.deepEqual(variantOptions('character-01','facialHair'),['facial-hair-01','facial-hair-02','facial-hair-03','facial-hair-04']);
assert.deepEqual(variantOptions('character-01','outfit'),['outfit-01','outfit-02','outfit-03']);
assert.deepEqual(variantOptions('character-01','shoes'),['shoes-01']);

assert.deepEqual(variantOptions('character-02','hat'),['hat-01','hat-02','hat-03','hat-04','hat-05','hat-06','hat-07']);
assert.deepEqual(variantOptions('character-02','glasses'),['glasses-01','glasses-02','glasses-03','glasses-04']);
assert.deepEqual(variantOptions('character-02','accessory'),['accessory-01','accessory-02','accessory-03']);
assert.deepEqual(variantOptions('character-02','facialHair'),[],'female exact source intentionally has no facial-hair variants');
assert.deepEqual(variantOptions('character-02','outfit'),[],'female exact source intentionally has no separable outfit variants');
assert.deepEqual(variantOptions('character-02','shoes'),['shoes-01']);

const maleSelected=normalizeVariantAppearance('character-01',{hatVariant:'hat-03',facialHairVariant:'facial-hair-02'},{outfitVariant:'outfit-02',shoesVariant:'shoes-01'},{outfitPrimary:'#dfff00',shoesPrimary:'#111111'});
assert.equal(maleSelected.hatVariant,'hat-03');
assert.equal(maleSelected.facialHairVariant,'facial-hair-02');
assert.equal(maleSelected.outfitVariant,'outfit-02');
assert.equal(maleSelected.shoesVariant,'shoes-01');
assert.equal(maleSelected.colors.outfitPrimary,'#dfff00');
assert.equal(maleSelected.colors.shoesPrimary,'#111111');

const femaleSelected=normalizeVariantAppearance('character-02',{hatVariant:'hat-03',facialHairVariant:'facial-hair-02'},{outfitVariant:'outfit-02',shoesVariant:'shoes-01'},{outfitPrimary:'#dfff00',shoesPrimary:'#111111'});
assert.equal(femaleSelected.hatVariant,'hat-03','compatible shared exact variant survives on character-02');
assert.equal(femaleSelected.facialHairVariant,null,'character-02 does not fabricate facial-hair geometry');
assert.equal(femaleSelected.outfitVariant,null,'character-02 does not fabricate outfit geometry');
assert.equal(femaleSelected.shoesVariant,'shoes-01');
assert.equal(femaleSelected.colors.outfitPrimary,null,'character-02 rejects undeclared outfit paint target');
assert.equal(femaleSelected.colors.shoesPrimary,'#111111');

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
const rejected=normalizeVariantAppearance('character-01',{hatVariant:'hat-99'},{outfitVariant:'outfit-99'},{outfitPrimary:'#fff'});
assert.equal(rejected.hatVariant,null);
assert.equal(rejected.outfitVariant,null);
assert.equal(rejected.colors.outfitPrimary,'#fff','declared paint target remains independent of variant selection');

resetCharacterContracts();
console.log('DEMENTOR LAB character registry selftest: PASS — both exact assets validate; intentional female asymmetry preserved');
