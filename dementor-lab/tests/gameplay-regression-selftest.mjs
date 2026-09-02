import assert from 'node:assert/strict';
import { createEncounter, predictTurn, executeActorTurn, applyHotPatch } from '../src/encounter/runtime.mjs';
import { buildResult } from '../src/encounter/result.mjs';
import { CRITICISM_IDEA_SCENARIO, createCriticismActors } from '../src/scenarios/criticism-idea.mjs';

function encounterWithGraph(graph,{brain=12,memory={}}={}){
  const actors=createCriticismActors();
  actors.A.brainGraph=structuredClone(graph);
  actors.A.state.brain=brain;
  actors.A.state.memory={...memory};
  return createEncounter({scenario:CRITICISM_IDEA_SCENARIO,actorA:actors.A,actorB:actors.B,mode:'step'});
}
const edge=(id,from,to)=>({id,from,to});

// A situation trigger is exact. IGNORE must not silently substitute for CRITICISM.
const wrongTrigger={id:'wrong-trigger',nodes:[
  {id:'t',type:'ignore',p:{}},{id:'r',type:'silent',p:{}}
],edges:[edge('e','t','r')]};
assert.throws(()=>predictTurn(encounterWithGraph(wrongTrigger)),/No executable reaction/,'runtime must not substitute another trigger');

// STOP terminates the traversed causal chain even if an outgoing edge exists in malformed/authored content.
const stopGraph={id:'stop-semantics',nodes:[
  {id:'t',type:'criticism',p:{}},{id:'j',type:'joke',p:{}},{id:'s',type:'stop',p:{}},{id:'p',type:'pressure',p:{}}
],edges:[edge('e1','t','j'),edge('e2','j','s'),edge('e3','s','p')]};
const stopPrediction=predictTurn(encounterWithGraph(stopGraph));
assert.deepEqual(stopPrediction.chosen.path.map(n=>n.id),['t','j','s'],'STOP must terminate the path');
assert.equal(stopPrediction.chosen.reaction,'joke');

// BRAIN > is a real gate, not a cosmetic score penalty.
const conditionGraph={id:'condition-semantics',nodes:[
  {id:'t',type:'criticism',p:{}},
  {id:'direct',type:'explain',p:{}},
  {id:'if',type:'ifbrain',p:{threshold:70}},
  {id:'state',type:'resentment',p:{key:'resentment',delta:1,cap:5}},
  {id:'pressure',type:'pressure',p:{}}
],edges:[edge('a','t','direct'),edge('b','t','if'),edge('c','if','state'),edge('d','state','pressure')]};
assert.equal(predictTurn(encounterWithGraph(conditionGraph,{brain:20,memory:{resentment:5}})).chosen.reaction,'explain','closed condition path must be unavailable');
assert.equal(predictTurn(encounterWithGraph(conditionGraph,{brain:90,memory:{resentment:5}})).chosen.reaction,'pressure','open condition path may win normally');

// Insert PAUSE is a real hot patch and preserves encounter state.
const patchEncounter=encounterWithGraph({id:'patch',nodes:[
  {id:'t',type:'criticism',p:{}},{id:'i',type:'beright',p:{weight:5}},{id:'r',type:'explain',p:{}},{id:'x',type:'repeat',p:{count:5}}
],edges:[edge('e1','t','i'),edge('e2','i','r'),edge('e3','r','x')]});
patchEncounter.status='HOT_PATCH';patchEncounter.pendingTurn={breakpoint:{actorId:'A',nodeIds:['t','i','r','x']}};
const turnBeforePause=patchEncounter.turn;
applyHotPatch(patchEncounter,{kind:'insert-pause',actorId:'A',edgeId:'e2',nodeId:'pause-test'});
assert.equal(patchEncounter.turn,turnBeforePause,'patch does not consume a turn');
assert.ok(patchEncounter.actors.A.brainGraph.nodes.some(n=>n.id==='pause-test'&&n.type==='pause'));
assert.ok(patchEncounter.actors.A.brainGraph.edges.some(e=>e.from==='i'&&e.to==='pause-test'));
assert.ok(patchEncounter.actors.A.brainGraph.edges.some(e=>e.from==='pause-test'&&e.to==='r'));

// Rewire must be compatible and must keep the whole graph runnable.
const rewireGraph={id:'rewire',nodes:[
  {id:'t',type:'criticism',p:{}},{id:'i',type:'beright',p:{weight:3}},{id:'a',type:'explain',p:{}},{id:'b',type:'joke',p:{}}
],edges:[edge('e1','t','i'),edge('e2','i','a'),edge('e3','t','a'),edge('e4','t','b')]};
const rewireEncounter=encounterWithGraph(rewireGraph);rewireEncounter.status='HOT_PATCH';
const changed=applyHotPatch(rewireEncounter,{kind:'rewire',actorId:'A',edgeId:'e2',toNodeId:'b'});
assert.deepEqual(changed,{before:'a',after:'b'});
assert.equal(rewireEncounter.actors.A.brainGraph.edges.find(e=>e.id==='e2').to,'b');
const badRewire=encounterWithGraph(rewireGraph);badRewire.status='HOT_PATCH';
assert.throws(()=>applyHotPatch(badRewire,{kind:'rewire',actorId:'A',edgeId:'e2',toNodeId:'t'}),/incompatible rewire target/);

// RESULT explains the actual A trace in causal order and replay always targets actor A.
const resultEncounter=encounterWithGraph({id:'result',nodes:[
  {id:'t',type:'criticism',p:{}},{id:'s',type:'resentment',p:{key:'resentment',delta:1,cap:5}},{id:'i',type:'beright',p:{weight:4}},{id:'r',type:'explain',p:{}},{id:'x',type:'repeat',p:{count:3}}
],edges:[edge('e1','t','s'),edge('e2','s','i'),edge('e3','i','r'),edge('e4','r','x')]});
executeActorTurn(resultEncounter);
resultEncounter.result={type:'BREAKDOWN',reason:'BRAIN',loser:'B',turn:resultEncounter.turn};
const result=buildResult(resultEncounter);
assert.equal(result.stageC.actorId,'A');
assert.ok(resultEncounter.actors.A.brainGraph.nodes.some(n=>n.id===result.stageC.nodeId),'replay target belongs to player graph');
const cause=result.stageB.cause;
const expected=['КРИТИКА','ОБИДА','БЫТЬ ПРАВЫМ W4','ОБЪЯСНИТЬ','REPEAT ×3'];
let cursor=-1;for(const label of expected){const at=cause.indexOf(label);assert.ok(at>cursor,`cause keeps trace order: ${label}`);cursor=at}

console.log('DEMENTOR LAB gameplay regression selftest: PASS');
