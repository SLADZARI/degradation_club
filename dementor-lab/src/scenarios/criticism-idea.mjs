import { createCharacter } from '../encounter/runtime.mjs';
import { opponentPreset } from '../opponent/presets.mjs';
import { playerBrainPreset, DEFAULT_PLAYER_BRAIN_PRESET } from '../brain/player-presets.mjs';

export const CRITICISM_IDEA_SCENARIO=Object.freeze({
  id:'criticism-idea',
  title:'КРИТИКА ИДЕИ',
  premise:'Собеседник считает вашу идею плохой.',
  topic:'Собеседник считает вашу идею плохой.',
  objective:'contact',
  objectiveLabel:'СОХРАНИТЬ КОНТАКТ',
  objectiveRules:Object.freeze({minRelationshipContact:25,requiredOpponentCounterpoints:2}),
  openingTrigger:'criticism',
  turnLimit:20
});

export function scenarioWithObjective(objective='contact'){
  if(objective==='direct-answer')return {...CRITICISM_IDEA_SCENARIO,objective:'direct-answer',objectiveLabel:'ДОБИТЬСЯ ОТВЕТА'};
  return {...CRITICISM_IDEA_SCENARIO,objective:'contact',objectiveLabel:'СОХРАНИТЬ КОНТАКТ'};
}

const DEFAULT_OPPONENT=opponentPreset('CONTACT_SKEPTIC');
export const PLAYER_GRAPH=playerBrainPreset(DEFAULT_PLAYER_BRAIN_PRESET).graph;
export const MARTA_GRAPH=DEFAULT_OPPONENT.graph;

export function createCriticismActors({opponentProfile=null,playerName='Гена',playerPresetId=DEFAULT_PLAYER_BRAIN_PRESET}={}){
  const safePlayerName=String(playerName||'').trim()||'Гена';
  const selectedPreset=playerBrainPreset(playerPresetId);
  const profile=opponentProfile||{name:'Марта',baseCharacterId:'character-02',presetId:'CONTACT_SKEPTIC',sharedAppearance:{hat:false,glasses:false,beard:false,accessory:false},ownedAppearance:{outfit:true,shoes:true},graph:DEFAULT_OPPONENT.graph,initialState:{...DEFAULT_OPPONENT.initialState,memory:{}}};
  return {
    A:createCharacter({id:'A',name:safePlayerName,graph:selectedPreset.graph,state:{energy:72,brain:15,tension:10,contact:60,memory:{}},visual:{gender:'male',brainPresetId:selectedPreset.id}}),
    B:createCharacter({id:'B',name:profile.name,graph:profile.graph,state:profile.initialState,visual:{characterId:profile.baseCharacterId,gender:profile.gender||(profile.baseCharacterId==='character-02'?'female':'male'),appearance:{...(profile.sharedAppearance||{}),...(profile.ownedAppearance||{})},opponentPresetId:profile.presetId}})
  };
}
