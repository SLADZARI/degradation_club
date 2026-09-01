import assert from 'node:assert/strict';
import { createEncounter, executeActorTurn, applyHotPatch } from '../src/encounter/runtime.mjs';
import { CRITICISM_IDEA_SCENARIO, createCriticismActors } from '../src/scenarios/criticism-idea.mjs';

function fresh(){
  const actors=createCriticismActors();
  return createEncounter({scenario:CRITICISM_IDEA_SCENARIO,actorA:actors.A,actorB:actors.B,mode:'auto'});
}

// Deterministic baseline.
const a=fresh(),b=fresh();
const ta=executeActorTurn(a).trace,tb=executeActorTurn(b).trace;
assert.deepEqual(
  {reaction:ta.selectedReaction,impulse:ta.selectedImpulse,nodes:ta.visitedNodes,deltas:ta.metricDeltas,memory:ta.memoryChanges},
  {reaction:tb.selectedReaction,impulse:tb.selectedImpulse,nodes:tb.visitedNodes,deltas:tb.metricDeltas,memory:tb.memoryChanges}
);
assert.equal(ta.selectedReaction,'explain');
assert.equal(ta.selectedImpulse,'beright');
assert.equal(a.actors.A.state.memory.resentment,1);

// Memory survives actor alternation.
if(a.status!=='HOT_PATCH')executeActorTurn(a);
if(a.status!=='HOT_PATCH')executeActorTurn(a);
assert.ok(a.actors.A.state.memory.resentment>=1);

// Force the authored loop to a HOT PATCH gate if baseline hasn't reached it yet.
const h=fresh();
let guard=0;
while(h.status!=='HOT_PATCH'&&!h.result&&guard++<12)executeActorTurn(h);
assert.equal(h.status,'HOT_PATCH','authored scenario must expose HOT PATCH before terminal result');
const patchTrace=h.traces.at(-1);
const repeatId=patchTrace.visitedNodes.find(id=>h.actors[patchTrace.actorId].brainGraph.nodes.find(n=>n.id===id)?.type==='repeat');
assert.ok(repeatId,'causal trace contains repeat node');
const beforeTurn=h.turn,beforeMemory=JSON.stringify(h.actors.A.state.memory),beforeTranscript=h.transcript.length;
const changed=applyHotPatch(h,{kind:'reduce-repeat',actorId:patchTrace.actorId,nodeId:repeatId});
assert.equal(changed.before,4);
assert.equal(changed.after,3);
assert.equal(h.turn,beforeTurn,'patch must not reset turn');
assert.equal(JSON.stringify(h.actors.A.state.memory),beforeMemory,'patch must not reset memory');
assert.equal(h.transcript.length,beforeTranscript,'patch must not reset transcript');
assert.equal(h.status,'NEXT_TURN');

// Continue same encounter after patch.
const resumed=executeActorTurn(h);
assert.ok(resumed.trace||resumed.result);
assert.ok(h.turn>beforeTurn);
assert.equal(h.patches.length,1);

console.log('DEMENTOR LAB encounter runtime selftest: PASS');
