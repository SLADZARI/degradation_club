export const SHARED_APPEARANCE_LAYERS=Object.freeze(['hat','glasses','beard','accessory']);
export const CHARACTER_OWNED_LAYERS=Object.freeze(['outfit','shoes']);

export const CHARACTER_REGISTRY=Object.freeze({
  'character-01':{
    id:'character-01',
    label:'ГЕНА',
    asset:'./assets/characters/character-01/character-01-layered.svg',
    ownLayers:['outfit','shoes'],
    sharedLayers:[...SHARED_APPEARANCE_LAYERS],
    rigFallback:{head:[352,270],shoulderLeft:[275,345],shoulderRight:[425,345],hipLeft:[311,590],hipRight:[393,591]}
  },
  'character-02':{
    id:'character-02',
    label:'МАРТА',
    asset:'./assets/characters/character-02/character-02-layered.svg',
    ownLayers:['outfit','shoes'],
    sharedLayers:[...SHARED_APPEARANCE_LAYERS],
    rigFallback:null
  }
});

export function characterSpec(id){return CHARACTER_REGISTRY[id]||CHARACTER_REGISTRY['character-01']}
export function appearanceForCharacter(id,shared={},owned={}){
  const spec=characterSpec(id),appearance={};
  spec.sharedLayers.forEach(k=>appearance[k]=shared[k]!==false);
  spec.ownLayers.forEach(k=>appearance[k]=owned[k]!==false);
  return appearance;
}
