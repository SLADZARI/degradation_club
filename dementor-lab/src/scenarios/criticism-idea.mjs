import { createCharacter } from '../encounter/runtime.mjs';

export const CRITICISM_IDEA_SCENARIO=Object.freeze({
  id:'criticism-idea',
  title:'КРИТИКА ИДЕИ',
  premise:'Марта считает идею Гены плохой.',
  topic:'Марта считает идею Гены плохой.',
  objective:'contact',
  objectiveLabel:'СОХРАНИТЬ КОНТАКТ',
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

export const MARTA_GRAPH=Object.freeze({
  id:'marta-contact-skeptic',
  nodes:[
    {id:'b-trigger',type:'criticism',p:{}},
    {id:'b-state',type:'trust',p:{key:'trust',delta:1,cap:5}},
    {id:'b-impulse',type:'understand',p:{weight:3}},
    {id:'b-reaction',type:'explain',p:{}},
    {id:'b-pause',type:'pause',p:{}}
  ],
  edges:[
    {id:'b-e1',from:'b-trigger',to:'b-state'},
    {id:'b-e2',from:'b-state',to:'b-impulse'},
    {id:'b-e3',from:'b-impulse',to:'b-pause'},
    {id:'b-e4',from:'b-pause',to:'b-reaction'}
  ]
});

export function createCriticismActors(){
  return {
    A:createCharacter({id:'A',name:'Геннадий Львович',graph:PLAYER_GRAPH,state:{energy:72,brain:15,tension:10,contact:60,memory:{}}}),
    B:createCharacter({id:'B',name:'Марта',graph:MARTA_GRAPH,state:{energy:78,brain:12,tension:12,contact:62,memory:{}}})
  };
}
