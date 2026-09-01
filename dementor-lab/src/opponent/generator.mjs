import { OPPONENT_PRESET_IDS, opponentPreset } from './presets.mjs';
import { characterSpec, hasVariantContract, variantOptions } from '../render/character-registry.mjs';

const BASE_CHARACTERS=Object.freeze(['character-01','character-02']);
const OPPONENT_NAMES=Object.freeze(['Марта','Лев','Нина','Антон','Ира','Вадим']);

function hashSeed(input){
  const s=String(input??'dementor');let h=2166136261;
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
  return h>>>0;
}
function mulberry32(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function pick(rng,list){return list[Math.floor(rng()*list.length)%list.length]}
function flag(rng,prob=.5){return rng()<prob}
function optionalVariant(rng,list,prob=.5){return list.length&&flag(rng,prob)?pick(rng,list):null}
function requiredVariant(rng,list){return list.length?pick(rng,list):null}

function generatedAppearance(rng,baseCharacterId){
  const spec=characterSpec(baseCharacterId);
  if(hasVariantContract(baseCharacterId)){
    return {
      sharedAppearance:{
        hatVariant:optionalVariant(rng,variantOptions(baseCharacterId,'hat'),.45),
        glassesVariant:optionalVariant(rng,variantOptions(baseCharacterId,'glasses'),.38),
        facialHairVariant:optionalVariant(rng,variantOptions(baseCharacterId,'facialHair'),.32),
        accessoryVariant:optionalVariant(rng,variantOptions(baseCharacterId,'accessory'),.5)
      },
      ownedAppearance:{
        outfitVariant:requiredVariant(rng,variantOptions(baseCharacterId,'outfit')),
        shoesVariant:requiredVariant(rng,variantOptions(baseCharacterId,'shoes'))
      },
      colors:{outfitPrimary:null,outfitSecondary:null,shoesPrimary:null},
      appearanceContract:'variants'
    };
  }
  return {
    sharedAppearance:{
      hat:flag(rng,.45),
      glasses:flag(rng,.38),
      beard:baseCharacterId==='character-01'&&flag(rng,.32),
      accessory:flag(rng,.5)
    },
    ownedAppearance:{outfit:true,shoes:true},
    colors:{},
    appearanceContract:'legacy',
    manifest:spec.manifest
  };
}

export function createOpponentProfile(seed){
  const rng=mulberry32(hashSeed(seed));
  const baseCharacterId=pick(rng,BASE_CHARACTERS);
  const presetId=pick(rng,OPPONENT_PRESET_IDS);
  const preset=opponentPreset(presetId);
  const appearance=generatedAppearance(rng,baseCharacterId);
  return {
    seed:String(seed),
    name:pick(rng,OPPONENT_NAMES),
    baseCharacterId,
    presetId,
    presetLabel:preset.label,
    description:preset.description,
    ...appearance,
    graph:preset.graph,
    initialState:{...preset.initialState,memory:{...(preset.initialState.memory||{})}}
  };
}

export function freshOpponentSeed(){
  if(globalThis.crypto?.getRandomValues){const a=new Uint32Array(2);globalThis.crypto.getRandomValues(a);return `${a[0]}-${a[1]}`}
  return `${Date.now()}-${Math.random()}`;
}
