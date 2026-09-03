import assert from 'node:assert/strict';
import { createEncounter, executeActorTurn } from '../src/encounter/runtime.mjs';
import { DIRECT_ANSWER_SCENARIO, createDirectAnswerActors } from '../src/scenarios/direct-answer.mjs';
import { brainPreset, cloneBrainGraph } from '../src/ui/brain-presets.mjs';

const triggers=['criticism','pushback','acceptance','deflection','ignore','underpressure'];
function adaptiveQuestionGraph(){
  const nodes=[
    ...triggers.map(type=>({id:`t-${type}`,type,p:{}})),
    {id:'explain',type:'explain',p:{}},
    {id:'if-hot',type:'ifbrain',p:{threshold:35}},
    {id:'pause',type:'pause',p:{}},
    {id:'joke',type:'joke',p:{}}
  ];
  const edges=[];
  for(const type of triggers){
    edges.push({id:`${type}-fallback`,from:`t-${type}`,to:'explain'});
    edges.push({id:`${type}-hot`,from:`t-${type}`,to:'if-hot'});
  }
  edges.push({id:'hot-pause',from:'if-hot',to:'pause'},{id:'pause-joke',from:'pause',to:'joke'});
  return {id:'adaptive-direct-answer',nodes,edges};
}
function run(graph){
  const actors=createDirectAnswerActors({playerGraph:cloneBrainGraph(graph),playerName:'TEST'});
  const encounter=createEncounter({scenario:DIRECT_ANSWER_SCENARIO,actorA:actors.A,actorB:actors.B,mode:'auto'});
  encounter.status='NEXT_TURN';encounter.hotPatchUsed=true;
  let guard=0;while(!encounter.result&&guard++<50)executeActorTurn(encounter);
  assert.ok(encounter.result,'direct-answer encounter reaches terminal state');
  return encounter;
}

const explainOnly=run(brainPreset('explain-everything').graph);
assert.notEqual(explainOnly.result.type,'OBJECTIVE_COMPLETE','pure explanation can extract answers but cannot satisfy the whole objective');
assert.ok(explainOnly.traces.filter(t=>t.actorId==='B'&&t.event?.type==='COUNTERPOINT').length>=4,'explain-only proves answer count alone is insufficient');

const keepPeace=run(brainPreset('keep-peace').graph);
assert.equal(keepPeace.result.reason,'NO_DIRECT_ANSWER','CONTACT strategy does not automatically solve the direct-answer objective');

const adaptive=run(adaptiveQuestionGraph());
assert.equal(adaptive.result.type,'OBJECTIVE_COMPLETE','an adaptive ask-regulate-ask brain can solve the second objective');
assert.ok(adaptive.result.answers>=4);
assert.ok(adaptive.result.relationshipContact>=50);
const reactions=adaptive.traces.filter(t=>t.actorId==='A').map(t=>t.selectedReaction);
assert.ok(reactions.includes('explain')&&reactions.includes('joke'),'winning brain uses both extraction and regulation behaviors');
const firstJoke=reactions.indexOf('joke'),laterExplain=reactions.slice(firstJoke+1).indexOf('explain');
assert.ok(firstJoke>0&&laterExplain>=0,'winning trajectory returns to EXPLAIN after cooling down instead of camping in one reaction');

console.log('DEMENTOR LAB objective diversity selftest: PASS — second objective requires a materially different adaptive BRAIN');
