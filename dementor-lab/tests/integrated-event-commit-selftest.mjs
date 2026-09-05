import assert from 'node:assert/strict';
import { createCharacter, createEncounter, executeActorTurn } from '../src/encounter/runtime-integrated.mjs';

const scenario={id:'event-commit-audit',title:'AUDIT',objective:'contact',objectiveRules:{minRelationshipContact:1},openingTrigger:'criticism',turnLimit:20};
const explainGraph={id:'explain',nodes:[{id:'a-trigger',type:'criticism',p:{}},{id:'a-explain',type:'explain',p:{}}],edges:[{id:'a-e1',from:'a-trigger',to:'a-explain'}]};
const repeatGraph={id:'repeat-target',nodes:[{id:'b-trigger',type:'criticism',p:{}},{id:'b-explain',type:'explain',p:{}},{id:'b-repeat',type:'repeat',p:{count:3}}],edges:[{id:'b-e1',from:'b-trigger',to:'b-explain'},{id:'b-e2',from:'b-explain',to:'b-repeat'}]};

function encounterWithTargetState(state){
  const A=createCharacter({id:'A',name:'A',graph:explainGraph,state:{energy:72,brain:15,tension:10,contact:60,memory:{}}});
  const B=createCharacter({id:'B',name:'B',graph:repeatGraph,state});
  const encounter=createEncounter({scenario,actorA:A,actorB:B,mode:'step'});encounter.status='NEXT_TURN';encounter.hotPatchUsed=true;
  encounter.pendingRepeats.B={reaction:'explain',impulse:null,remaining:2,total:3,repeatNodeId:'b-repeat',reactionNodeId:'b-explain'};
  return encounter;
}

const warm=encounterWithTargetState({energy:80,brain:0,tension:0,contact:100,memory:{trust:5}});
const accepted=executeActorTurn(warm).trace;
assert.equal(accepted.event.type,'ACCEPTANCE','saliency may turn EXPLAIN into ACCEPTANCE in a warm context');
assert.equal(warm.pendingRepeats.B,null,'resolved ACCEPTANCE must cancel the target actor pending REPEAT');
assert.equal(accepted.eventDecision?.winner,'ACCEPTANCE');
assert.ok(accepted.eventImpact?.metrics,'resolved WorldEvent impact is committed inside the same trace');
assert.equal(accepted.after.target.contact,warm.actors.B.state.contact,'trace.after includes the committed semantic event impact');

const overloaded=encounterWithTargetState({energy:30,brain:96,tension:17,contact:12,memory:{}});
const ignored=executeActorTurn(overloaded).trace;
assert.equal(ignored.event.type,'NO_RESPONSE','the same EXPLAIN can resolve to NO_RESPONSE under overload');
assert.ok(overloaded.pendingRepeats.B?.remaining===2,'a non-acceptance semantic event must not inherit legacy acceptance side effects');

console.log('integrated event commit selftest: PASS — saliency event is committed exactly once before terminal/repeat semantics');
