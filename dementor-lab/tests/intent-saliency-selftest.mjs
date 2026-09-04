import assert from 'node:assert/strict';
import { deriveIntent, rankWorldEvents, selectWorldEvent, INTENTS } from '../src/encounter/intent-saliency.mjs';
import { createEncounter, executeActorTurn } from '../src/encounter/runtime-v05.mjs';
import { CRITICISM_IDEA_SCENARIO, createCriticismActors } from '../src/scenarios/criticism-idea.mjs';

assert.equal(deriveIntent({impulse:'beright',reaction:'explain'}),INTENTS.MAKE_UNDERSTOOD);
assert.equal(deriveIntent({impulse:'beliked',reaction:'agree'}),INTENTS.DEESCALATE);
assert.equal(deriveIntent({reaction:'pressure'}),INTENTS.PRESSURE);

const baseline=selectWorldEvent({reaction:'explain',intent:INTENTS.MAKE_UNDERSTOOD,targetState:{contact:60,tension:10,brain:15,energy:72,memory:{}}});
assert.equal(baseline.event.type,'COUNTERPOINT','baseline explain remains compatible with current vertical slice routing');
assert.equal(baseline.event.trigger,'pushback');

const warm=selectWorldEvent({reaction:'explain',intent:INTENTS.MAKE_UNDERSTOOD,targetState:{contact:92,tension:4,brain:15,energy:72,memory:{trust:3}}});
assert.equal(warm.event.type,'ACCEPTANCE','high contact + trust can make the same explanation land as acceptance');
assert.equal(warm.event.accepted,true);

const repeatedA=rankWorldEvents({reaction:'pressure',intent:INTENTS.PRESSURE,targetState:{contact:18,tension:82,brain:88,energy:30,memory:{resentment:2}}});
const repeatedB=rankWorldEvents({reaction:'pressure',intent:INTENTS.PRESSURE,targetState:{contact:18,tension:82,brain:88,energy:30,memory:{resentment:2}}});
assert.deepEqual(repeatedA,repeatedB,'event ranking is deterministic');

const actors=createCriticismActors();
const encounter=createEncounter({scenario:CRITICISM_IDEA_SCENARIO,actorA:actors.A,actorB:actors.B,mode:'auto'});
const first=executeActorTurn(encounter).trace;
assert.equal(first.intent,INTENTS.MAKE_UNDERSTOOD);
assert.equal(first.event.type,'COUNTERPOINT');
assert.ok(Array.isArray(first.eventDecision?.candidates)&&first.eventDecision.candidates.length>=2);
assert.equal(encounter.nextTrigger,'pushback');
console.log('DEMENTOR LAB intent/saliency selftest: PASS');
