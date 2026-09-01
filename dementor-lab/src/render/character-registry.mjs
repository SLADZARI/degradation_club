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
const BASE_CHARACTER_REGISTRY=Object.freeze({
  'character-01':{
    id:'character-01',label:'ГЕНА',asset:'./assets/characters/character-01/character-01-layered.svg',manifest:'./assets/characters/character-01/manifest.json',
    variants:Object.freeze(emptyVariants()),colorTargets:Object.freeze([]),legacyLayers,
    rigFallback:{head:[352,270],shoulderLeft:[275,345],shoulderRight:[425,345],hipLeft:[311,590],hipRight:[393,591]}
  },
  'character-02':{
    id:'character-02',label:'МАРТА',asset:'./assets/characters/character-02/character-02-layered.svg',manifest:'./assets/characters/character-02/manifest.json',
    variants:Object.freeze(emptyVariants()),colorTargets:Object.freeze([]),legacyLayers,
    rigFallback:{head:[352,286],shoulderLeft:[292,354],shoulderRight:[412,354],hipLeft:[326,592],hipRight:[378,592]}
  }
});
export const CHARACTER_REGISTRY=BASE_CHARACTER_REGISTRY;
const runtimeContracts=new Map();

function baseSpec(id){return BASE_CHARACTER_REGISTRY[id]||BASE_CHARACTER_REGISTRY['character-01']}
function manifestVariants(manifest={}){
  const src=manifest.variants||{};
  return {
    hat:[...(src.hat||[])],glasses:[...(src.glasses||[])],facialHair:[...(src.facialHair||[])],
    accessory:[...(src.accessory||[])],outfit:[...(src.outfit||[])],shoes:[...(src.shoes||[])]
  };
}
function svgIds(svgText=''){return new Set([...String(svgText).matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map(match=>match[1]))}
function svgViewBox(svgText=''){return String(svgText).match(/<svg\b[^>]*\bviewBox\s*=\s*["']([^"']+)["']/i)?.[1]?.trim()||null}
function faceIds(manifest={}){const states=manifest.faceStates||manifest.faceLayers||{};return [...(states.eyes||[]),...(states.brows||[]),...(states.mouth||[])]}
function baseIds(manifest={}){const base=manifest.baseLayers||{};const ids=[];if(base.body)ids.push('body');if(base.headRig)ids.push('head-rig');return ids}

export function validateCharacterManifest(id,manifest={},svgText=''){
  const errors=[];
  const declaredId=manifest.characterId||manifest.id||null;
  if(declaredId&&declaredId!==id)errors.push(`character id mismatch: ${declaredId}`);
  const actualViewBox=svgViewBox(svgText);
  if(manifest.viewBox&&actualViewBox&&manifest.viewBox.trim()!==actualViewBox)errors.push(`viewBox mismatch: manifest ${manifest.viewBox} / svg ${actualViewBox}`);
  if(!actualViewBox)errors.push('SVG viewBox not found');
  const ids=svgIds(svgText),variants=manifestVariants(manifest),colorTargets=[...(manifest.colorTargets||[])];
  const required=[...baseIds(manifest),...faceIds(manifest),...Object.values(variants).flat(),...colorTargets];
  const missing=[...new Set(required.filter(requiredId=>!ids.has(requiredId)))];
  if(missing.length)errors.push(`missing SVG ids: ${missing.join(', ')}`);
  return {ok:errors.length===0,errors,missingIds:missing,variants,colorTargets,rig:manifest.rig||null,viewBox:actualViewBox};
}

export function registerCharacterManifest(id,manifest,svgText){
  const spec=baseSpec(id),validation=validateCharacterManifest(spec.id,manifest,svgText);
  runtimeContracts.set(spec.id,{
    manifestData:manifest,
    assetText:String(svgText||''),
    contractValid:validation.ok,
    errors:[...validation.errors],
    variants:validation.ok?validation.variants:emptyVariants(),
    colorTargets:validation.ok?[...validation.colorTargets]:[],
    rigFallback:validation.ok&&validation.rig?validation.rig:spec.rigFallback
  });
  return {characterId:spec.id,...validation,variantContract:validation.ok&&(Object.values(validation.variants).some(list=>list.length>0)||validation.colorTargets.length>0)};
}

export async function loadCharacterContract(id,fetchImpl=globalThis.fetch){
  const spec=baseSpec(id);if(typeof fetchImpl!=='function')throw new Error('fetch unavailable for character contract');
  const [manifestResponse,svgResponse]=await Promise.all([fetchImpl(spec.manifest),fetchImpl(spec.asset)]);
  if(!manifestResponse.ok)throw new Error(`Character manifest ${spec.id} ${manifestResponse.status}`);
  if(!svgResponse.ok)throw new Error(`Character asset ${spec.id} ${svgResponse.status}`);
  const [manifest,svgText]=await Promise.all([manifestResponse.json(),svgResponse.text()]);
  return registerCharacterManifest(spec.id,manifest,svgText);
}

export function resetCharacterContracts(){runtimeContracts.clear()}
export function characterAssetText(id){return runtimeContracts.get(baseSpec(id).id)?.assetText||null}
export function characterContractDiagnostics(id){const runtime=runtimeContracts.get(baseSpec(id).id);return runtime?{valid:runtime.contractValid,errors:[...runtime.errors]}:{valid:null,errors:[]}}
export function characterSpec(id){
  const base=baseSpec(id),runtime=runtimeContracts.get(base.id);
  if(!runtime)return base;
  return {...base,variants:runtime.variants,colorTargets:runtime.colorTargets,rigFallback:runtime.rigFallback};
}
export function variantKey(category){return APPEARANCE_VARIANT_KEYS[category]||null}
export function variantOptions(id,category){return [...(characterSpec(id).variants?.[category]||[])]}
export function hasVariantContract(id){const spec=characterSpec(id);return Object.values(spec.variants||{}).some(list=>list.length>0)||(spec.colorTargets||[]).length>0}

function validVariant(id,category,value){if(value==null||value===false)return null;const options=variantOptions(id,category);return options.includes(value)?value:null}
function compatibleColor(id,target,value){if(value==null||value==='')return null;return characterSpec(id).colorTargets?.includes(target)?value:null}

export function createAppearanceState(id='character-01'){
  return {baseCharacterId:characterSpec(id).id,sharedAppearance:{hatVariant:null,glassesVariant:null,facialHairVariant:null,accessoryVariant:null},ownedAppearance:{outfitVariant:null,shoesVariant:null},colors:{outfitPrimary:null,outfitSecondary:null,shoesPrimary:null}};
}
export function normalizeVariantAppearance(id,shared={},owned={},colors={}){
  return {
    hatVariant:validVariant(id,'hat',shared.hatVariant),glassesVariant:validVariant(id,'glasses',shared.glassesVariant),facialHairVariant:validVariant(id,'facialHair',shared.facialHairVariant),accessoryVariant:validVariant(id,'accessory',shared.accessoryVariant),
    outfitVariant:validVariant(id,'outfit',owned.outfitVariant),shoesVariant:validVariant(id,'shoes',owned.shoesVariant),
    colors:{outfitPrimary:compatibleColor(id,'outfit-primary',colors.outfitPrimary),outfitSecondary:compatibleColor(id,'outfit-secondary',colors.outfitSecondary),shoesPrimary:compatibleColor(id,'shoes-primary',colors.shoesPrimary)}
  };
}

// Compatibility adapter: old boolean state remains usable while current production SVGs are legacy single-layer assets.
export function appearanceForCharacter(id,shared={},owned={},colors={}){
  const spec=characterSpec(id),variant=normalizeVariantAppearance(id,shared,owned,colors),out={...variant};
  SHARED_APPEARANCE_LAYERS.forEach(layer=>{if(Object.hasOwn(shared,layer))out[layer]=shared[layer]!==false});
  CHARACTER_OWNED_LAYERS.forEach(layer=>{if(Object.hasOwn(owned,layer))out[layer]=owned[layer]!==false});
  out.variantContract=hasVariantContract(spec.id);return out;
}
