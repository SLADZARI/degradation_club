import { createCharacter } from '../encounter/runtime.mjs';

export const DIRECT_ANSWER_SCENARIO=Object.freeze({
  id:'direct-answer',
  title:'НЕУДОБНЫЙ ВОПРОС',
  premise:'Собеседник уходит от прямого ответа. Тебе нужна его реальная позиция.',
  topic:'Собеседник уходит от прямого ответа.',
  objective:'direct-answer',
  objectiveLabel:'ПОЛУЧИТЬ ПРЯМОЙ ОТВЕТ',
  objectiveRules:Object.freeze({requiredOpponentCounterpoints:2,minRelationshipContact:25}),
  openingTrigger:'criticism',
  turnLimit:12
});

const nodes=[
  {id:'d-open',type:'criticism',p:{}},
  {id:'d-pushback',type:'pushback',p:{}},
  {id:'d-acceptance',type:'acceptance',p:{}},
  {id:'d-deflection',type:'deflection',p:{}},
  {id:'d-ignore',type:'ignore',p:{}},
  {id:'d-underpressure',type:'underpressure',p:{}},
  {id:'d-explain',type:'explain',p:{}},
  {id:'d-agree',type:'agree',p:{}},
  {id:'d-joke',type:'joke',p:{}},
  {id:'d-silent',type:'silent',p:{}},
  {id:'d-pressure',type:'pressure',p:{}}
];
const edges=[
  {id:'d-e0',from:'d-open',to:'d-joke'},
  {id:'d-e1',from:'d-pushback',to:'d-explain'},
  {id:'d-e2',from:'d-acceptance',to:'d-silent'},
  {id:'d-e3',from:'d-deflection',to:'d-joke'},
  {id:'d-e4',from:'d-ignore',to:'d-silent'},
  {id:'d-e5',from:'d-underpressure',to:'d-pressure'}
];
export const DIRECT_ANSWER_OPPONENT_GRAPH=Object.freeze({id:'direct-answer-opponent',nodes:Object.freeze(nodes),edges:Object.freeze(edges)});

export function createDirectAnswerActors({playerGraph,playerName='Гена',opponentName='Марта'}={}){
  if(!playerGraph)throw new Error('playerGraph required');
  return {
    A:createCharacter({id:'A',name:String(playerName||'').trim()||'Гена',graph:playerGraph,state:{energy:72,brain:15,tension:10,contact:60,memory:{}}}),
    B:createCharacter({id:'B',name:opponentName,graph:DIRECT_ANSWER_OPPONENT_GRAPH,state:{energy:78,brain:12,tension:14,contact:62,memory:{}}})
  };
}
