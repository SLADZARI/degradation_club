import assert from 'node:assert/strict';
import { createEncounter, executeActorTurn, applyHotPatch } from '../src/encounter/runtime.mjs';
import { CRITICISM_IDEA_SCENARIO, createCriticismActors } from '../src/scenarios/criticism-idea.mjs';

function fresh(){const actors=createCriticismActors();return createEncounter({scenario:CRITICISM_IDEA_SCENARIO,actorA:actors.A,actorB:actors.B,mode:'auto'})}

const a=fresh(),b=fresh();
const ta=executeActorTurn(a).trace,tb=executeActorTurn(b).trace;
assert.deepEqual({reaction:ta.selectedReaction,impulse:ta.selectedImpulse,nodes:ta.visitedNodes,deltas:ta.metricDeltas,memory:ta.memoryChanges,event:ta.event},{reaction:tb.selectedReaction,impulse:tb.selectedImpulse,nodes:tb.visitedNodes,deltas:tb.metricDeltas,memory:tb.memoryChanges,event:tb.event});
assert.equal(ta.selectedReaction,'explain');assert.equal(ta.selectedImpulse,'beright');assert.equal(ta.event.type,'COUNTERPOINT');assert.equal(a.nextTrigger,'pushback');assert.equal(a.actors.A.state.memory.resentment,1);
assert.equal(a.pendingRepeats.A?.remaining,3,'REPEAT ×4 stores three future attempts after first reaction');

// Next actor consumes the previous reaction-derived trigger through a real graph.
const second=executeActorTurn(a).trace;assert.equal(second.actorId,'B');assert.equal(second.trigger,'pushback');assert.equal(second.event.type,'COUNTERPOINT');
// A has not been accepted, so its pending repeat overrides the incoming pushback on its next activation.
const third=executeActorTurn(a).trace;assert.equal(third.actorId,'A');assert.equal(third.repeatOverride,true);assert.equal(third.selectedReaction,'explain');assert.equal(a.pendingRepeats.A?.remaining,2);

// Predictive HOT PATCH is owned only by Character A.
const h=fresh();h.actors.A.state.brain=85;
const pending=executeActorTurn(h);assert.equal(h.status,'HOT_PATCH','high-brain repeating player exposes HOT PATCH before committing the turn');
assert.ok(pending.breakpoint);const repeatId=pending.breakpoint.nodeIds.find(id=>h.actors.A.brainGraph.nodes.find(n=>n.id===id)?.type==='repeat');assert.ok(repeatId);
const beforeTurn=h.turn,beforeMemory=JSON.stringify(h.actors.A.state.memory),beforeTranscript=h.transcript.length;
const changed=applyHotPatch(h,{kind:'reduce-repeat',actorId:'A',nodeId:repeatId});assert.equal(changed.before,4);assert.equal(changed.after,3);assert.equal(h.turn,beforeTurn);assert.equal(JSON.stringify(h.actors.A.state.memory),beforeMemory);assert.equal(h.transcript.length,beforeTranscript);assert.equal(h.status,'NEXT_TURN');
assert.throws(()=>{const x=fresh();x.status='HOT_PATCH';applyHotPatch(x,{kind:'reduce-repeat',actorId:'B',nodeId:'b-repeat'})},/only player Character A/,'generated opponent can never be hot-patched');
console.log('DEMENTOR LAB encounter runtime selftest: PASS');
