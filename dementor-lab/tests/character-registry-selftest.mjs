import assert from 'node:assert/strict';
import {
  CHARACTER_REGISTRY,
  SHARED_APPEARANCE_CATEGORIES,
  CHARACTER_OWNED_CATEGORIES,
  APPEARANCE_VARIANT_KEYS,
  createAppearanceState,
  normalizeVariantAppearance,
  variantOptions,
  hasVariantContract
} from '../src/render/character-registry.mjs';

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

assert.equal(hasVariantContract('character-01'),false,'legacy production character 01 must not advertise candidate variants before SVG swap');
assert.equal(hasVariantContract('character-02'),false,'legacy production character 02 must not advertise candidate variants before SVG swap');

console.log('DEMENTOR LAB character registry selftest: PASS — variant API ready, candidate assets still gated');
