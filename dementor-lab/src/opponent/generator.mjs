import { OPPONENT_PRESET_IDS, opponentPreset } from './presets.mjs';

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

export function createOpponentProfile(seed){
  const rng=mulberry32(hashSeed(seed));
  const baseCharacterId=pick(rng,BASE_CHARACTERS);
  const presetId=pick(rng,OPPONENT_PRESET_IDS);
  const preset=opponentPreset(presetId);
  return {
    seed:String(seed),
    name:pick(rng,OPPONENT_NAMES),
    baseCharacterId,
    presetId,
    presetLabel:preset.label,
    description:preset.description,
    sharedAppearance:{
      hat:flag(rng,.45),
      glasses:flag(rng,.38),
      beard:baseCharacterId==='character-01'&&flag(rng,.32),
      accessory:flag(rng,.5)
    },
    ownedAppearance:{outfit:true,shoes:true},
    graph:preset.graph,
    initialState:{...preset.initialState,memory:{...(preset.initialState.memory||{})}}
  };
}

export function freshOpponentSeed(){
  if(globalThis.crypto?.getRandomValues){const a=new Uint32Array(2);globalThis.crypto.getRandomValues(a);return `${a[0]}-${a[1]}`}
  return `${Date.now()}-${Math.random()}`;
}
