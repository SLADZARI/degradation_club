export const SHARED_APPEARANCE_CATEGORIES=Object.freeze(['hat','glasses','facialHair','accessory']);
export const CHARACTER_OWNED_CATEGORIES=Object.freeze(['outfit','shoes']);

// Legacy aliases stay exported until the cleaned SVG migration is complete.
export const SHARED_APPEARANCE_LAYERS=Object.freeze(['hat','glasses','beard','accessory']);
export const CHARACTER_OWNED_LAYERS=Object.freeze(['outfit','shoes']);

export const APPEARANCE_VARIANT_KEYS=Object.freeze({
  hat:'hatVariant',
  glasses:'glassesVariant',
  facialHair:'facialHairVariant',
  accessory:'accessoryVariant',
  outfit:'outfitVariant',
  shoes:'shoesVariant'
});

const emptyVariants=()=>({hat:[],glasses:[],facialHair:[],accessory:[],outfit:[],shoes:[]});
const legacyLayers=Object.freeze({hat:'hat',glasses:'glasses',facialHair:'beard',accessory:'accessory',outfit:'outfit',shoes:'shoes'});

export const CHARACTER_REGISTRY=Object.freeze({
  'character-01':{
    id:'character-01',
    label:'ГЕНА',
    asset:'./assets/characters/character-01/character-01-layered.svg',
    manifest:'./assets/characters/character-01/manifest.json',
    variants:Object.freeze(emptyVariants()),
    colorTargets:Object.freeze([]),
    legacyLayers,
    rigFallback:{head:[352,270],shoulderLeft:[275,345],shoulderRight:[425,345],hipLeft:[311,590],hipRight:[393,591]}
  },
  'character-02':{
    id:'character-02',
    label:'МАРТА',
    asset:'./assets/characters/character-02/character-02-layered.svg',
    manifest:'./assets/characters/character-02/manifest.json',
    variants:Object.freeze(emptyVariants()),
    colorTargets:Object.freeze([]),
    legacyLayers,
    rigFallback:{head:[352,286],shoulderLeft:[292,354],shoulderRight:[412,354],hipLeft:[326,592],hipRight:[378,592]}
  }
});

export function characterSpec(id){return CHARACTER_REGISTRY[id]||CHARACTER_REGISTRY['character-01']}
export function variantKey(category){return APPEARANCE_VARIANT_KEYS[category]||null}
export function variantOptions(id,category){return [...(characterSpec(id).variants?.[category]||[])]}
export function hasVariantContract(id){return Object.values(characterSpec(id).variants||{}).some(list=>list.length>0)}

function validVariant(id,category,value){
  if(value==null||value===false)return null;
  const options=variantOptions(id,category);
  return options.includes(value)?value:null;
}
function compatibleColor(id,target,value){
  if(value==null||value==='')return null;
  return characterSpec(id).colorTargets?.includes(target)?value:null;
}

export function createAppearanceState(id='character-01'){
  return {
    baseCharacterId:characterSpec(id).id,
    sharedAppearance:{hatVariant:null,glassesVariant:null,facialHairVariant:null,accessoryVariant:null},
    ownedAppearance:{outfitVariant:null,shoesVariant:null},
    colors:{outfitPrimary:null,outfitSecondary:null,shoesPrimary:null}
  };
}

export function normalizeVariantAppearance(id,shared={},owned={},colors={}){
  return {
    hatVariant:validVariant(id,'hat',shared.hatVariant),
    glassesVariant:validVariant(id,'glasses',shared.glassesVariant),
    facialHairVariant:validVariant(id,'facialHair',shared.facialHairVariant),
    accessoryVariant:validVariant(id,'accessory',shared.accessoryVariant),
    outfitVariant:validVariant(id,'outfit',owned.outfitVariant),
    shoesVariant:validVariant(id,'shoes',owned.shoesVariant),
    colors:{
      outfitPrimary:compatibleColor(id,'outfit-primary',colors.outfitPrimary),
      outfitSecondary:compatibleColor(id,'outfit-secondary',colors.outfitSecondary),
      shoesPrimary:compatibleColor(id,'shoes-primary',colors.shoesPrimary)
    }
  };
}

// Compatibility adapter: old boolean state remains usable while current production SVGs are legacy single-layer assets.
export function appearanceForCharacter(id,shared={},owned={},colors={}){
  const spec=characterSpec(id);
  const variant=normalizeVariantAppearance(id,shared,owned,colors);
  const out={...variant};
  SHARED_APPEARANCE_LAYERS.forEach(layer=>{if(Object.hasOwn(shared,layer))out[layer]=shared[layer]!==false});
  CHARACTER_OWNED_LAYERS.forEach(layer=>{if(Object.hasOwn(owned,layer))out[layer]=owned[layer]!==false});
  out.variantContract=hasVariantContract(spec.id);
  return out;
}
