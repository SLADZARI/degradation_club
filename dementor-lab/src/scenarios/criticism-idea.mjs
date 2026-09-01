import { createCharacter } from '../encounter/runtime.mjs';
import { opponentPreset } from '../opponent/presets.mjs';

export const CRITICISM_IDEA_SCENARIO=Object.freeze({
  id:'criticism-idea',
  title:'ТРЕТЬЕ ОБЪЯСНЕНИЕ',
  premise:'Вы третий раз объясняете идею на кухне.',
  detail:'Собеседник уже сказал «я понял» и убрал телефон.',
  hiddenRule:'Почему-то это пока не считается достаточным доказательством того, что он действительно понял.',
  topic:'Идею уже поняли. Объяснение пока продолжается.',
  objective:'contact',
  objectiveLabel:'ОБЪЯСНИТЬ И ОСТАНОВИТЬСЯ ВОВРЕМЯ',
  openingTrigger:'criticism',
  turnLimit:20
});

export const PLAYER_GRAPH=Object.freeze({
  id:'gennadiy-explain-loop',
  nodes:[
    {id:'a-trigger',type:'criticism',p:{}},
    {id:'a-state',type:'resentment',p:{key:'resentment',delta:1,cap:5}},
    {id:'a-impulse',type:'beright',p:{weight:3}},
    {id:'a-reaction',type:'explain',p:{}},
    {id:'a-repeat',type:'repeat',p:{count:4}}
  ],
  edges:[
    {id:'a-e1',from:'a-trigger',to:'a-state'},
    {id:'a-e2',from:'a-state',to:'a-impulse'},
    {id:'a-e3',from:'a-impulse',to:'a-reaction'},
    {id:'a-e4',from:'a-reaction',to:'a-repeat'}
  ]
});

const DEFAULT_OPPONENT=opponentPreset('CONTACT_SKEPTIC');
export const MARTA_GRAPH=DEFAULT_OPPONENT.graph;

export function createCriticismActors({opponentProfile=null}={}){
  const profile=opponentProfile||{
    name:'Марта',
    baseCharacterId:'character-02',
    presetId:'CONTACT_SKEPTIC',
    sharedAppearance:{hat:false,glasses:false,beard:false,accessory:false},
    ownedAppearance:{outfit:true,shoes:true},
    graph:DEFAULT_OPPONENT.graph,
    initialState:{...DEFAULT_OPPONENT.initialState,memory:{}}
  };
  return {
    A:createCharacter({id:'A',name:'Геннадий Львович',graph:PLAYER_GRAPH,state:{energy:72,brain:15,tension:10,contact:60,memory:{}}}),
    B:createCharacter({
      id:'B',
      name:profile.name,
      graph:profile.graph,
      state:profile.initialState,
      visual:{
        characterId:profile.baseCharacterId,
        appearance:{...(profile.sharedAppearance||{}),...(profile.ownedAppearance||{})},
        opponentPresetId:profile.presetId
      }
    })
  };
}
