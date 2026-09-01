import assert from 'node:assert/strict';
import { createEncounter, executeActorTurn, applyHotPatch } from '../src/encounter/runtime.mjs';
import { CRITICISM_IDEA_SCENARIO, createCriticismActors } from '../src/scenarios/criticism-idea.mjs';

function fresh(){const actors=createCriticismActors();return createEncounter({scenario:CRITICISM_IDEA_SCENARIO,actorA:actors.A,actorB:actors.B,mode:'auto'})}

const a=fresh(),b=fresh();
const ta=executeActorTurn(a).trace,tb=executeActorTurn(b).trace;
assert.deepEqual({reaction:ta.selectedReaction,impulse:ta.selectedImpulse,nodes:ta.visitedNodes,deltas:ta.metricDeltas,memory:ta.memoryChanges},{reaction:tb.selectedReaction,impulse:tb.selectedImpulse,nodes:tb.visitedNodes,deltas:tb.metricDeltas,memory:tb.memoryChanges});
assert.equal(ta.selectedReaction,'explain');assert.equal(ta.selectedImpulse,'beright');assert.equal(a.actors.A.state.memory.resentment,1);

const h=fresh();let guard=0;
while(h.status!=='HOT_PATCH'&&!h.result&&guard++<12)executeActorTurn(h);
assert.equal(h.status,'HOT_PATCH','authored scenario must expose HOT PATCH before terminal result');
assert.ok(h.pendingTurn?.breakpoint,'HOT PATCH keeps a pending causal turn');
const repeatId=h.pendingTurn.breakpoint.nodeIds.find(id=>h.actors[h.activeActor].brainGraph.nodes.find(n=>n.id===id)?.type==='repeat');
assert.ok(repeatId,'pending causal chain contains repeat node');
const beforeTurn=h.turn,beforeMemory=JSON.stringify(h.actors.A.state.memory),beforeTranscript=h.transcript.length;
const changed=applyHotPatch(h,{kind:'reduce-repeat',actorId:h.activeActor,nodeId:repeatId});
assert.equal(changed.before,4);assert.equal(changed.after,3);
assert.equal(h.turn,beforeTurn,'patch must not reset or consume turn');
assert.equal(JSON.stringify(h.actors.A.state.memory),beforeMemory,'patch must not reset memory');
assert.equal(h.transcript.length,beforeTranscript,'patch must not reset transcript');
assert.equal(h.status,'NEXT_TURN');

const resumed=executeActorTurn(h);
assert.ok(resumed.trace||resumed.result);assert.ok(h.turn>beforeTurn);assert.equal(h.patches.length,1);
assert.equal(h.actors.A.brainGraph.nodes.find(n=>n.id===repeatId).p.count,3);
console.log('DEMENTOR LAB encounter runtime selftest: PASS');
