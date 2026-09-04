import assert from 'node:assert/strict';
import { deriveIntent, rankWorldEvents, selectWorldEvent, INTENTS, applyWorldEventEffects } from '../src/encounter/intent-saliency.mjs';
import { createEncounter, executeActorTurn } from '../src/encounter/runtime-v05.mjs';
import { CRITICISM_IDEA_SCENARIO, createCriticismActors } from '../src/scenarios/criticism-idea.mjs';

assert.equal(deriveIntent({impulse:'beright',reaction:'explain'}),INTENTS.MAKE_UNDERSTOOD);
assert.equal(deriveIntent({impulse:'beliked',reaction:'agree'}),INTENTS.DEESCALATE);
assert.equal(deriveIntent({impulse:'understand',reaction:'explain'}),INTENTS.DEESCALATE);
assert.equal(deriveIntent({reaction:'pressure'}),INTENTS.PRESSURE);

const baseline=selectWorldEvent({reaction:'explain',intent:INTENTS.MAKE_UNDERSTOOD,targetState:{contact:60,tension:10,brain:15,energy:72,memory:{}}});
assert.equal(baseline.event.type,'COUNTERPOINT','baseline explain remains compatible with current vertical slice routing');
assert.equal(baseline.event.trigger,'pushback');

const warm=selectWorldEvent({reaction:'explain',intent:INTENTS.MAKE_UNDERSTOOD,targetState:{contact:92,tension:4,brain:15,energy:72,memory:{trust:3}}});
assert.equal(warm.event.type,'ACCEPTANCE','high contact + trust can make the same explanation land as acceptance');
assert.equal(warm.event.accepted,true);

const overloaded=selectWorldEvent({reaction:'explain',intent:INTENTS.MAKE_UNDERSTOOD,targetState:{contact:12,tension:17,brain:96,energy:25,memory:{}}});
assert.equal(overloaded.event.type,'NO_RESPONSE','collapsed contact + overload should shut the target down instead of producing another counterpoint');
assert.equal(overloaded.event.trigger,'ignore');

const repeatedA=rankWorldEvents({reaction:'pressure',intent:INTENTS.PRESSURE,targetState:{contact:18,tension:82,brain:88,energy:30,memory:{resentment:2}}});
const repeatedB=rankWorldEvents({reaction:'pressure',intent:INTENTS.PRESSURE,targetState:{contact:18,tension:82,brain:88,energy:30,memory:{resentment:2}}});
assert.deepEqual(repeatedA,repeatedB,'event ranking is deterministic');

const state={brain:34,energy:72,tension:28,contact:58,memory:{trust:1,resentment:1}};
const impact=applyWorldEventEffects(state,'COUNTERPOINT');
assert.equal(state.contact,52);
assert.equal(state.tension,40);
assert.equal(state.brain,41);
assert.equal(state.memory.resentment,2);
assert.deepEqual(impact.metrics,{brain:7,tension:12,contact:-6});
assert.deepEqual(impact.memory,{resentment:1});

const actors=createCriticismActors();
const encounter=createEncounter({scenario:CRITICISM_IDEA_SCENARIO,actorA:actors.A,actorB:actors.B,mode:'auto'});
const beforeTarget={...encounter.actors.B.state,memory:{...(encounter.actors.B.state.memory||{})}};
const first=executeActorTurn(encounter).trace;
assert.equal(first.intent,INTENTS.MAKE_UNDERSTOOD);
assert.equal(first.event.type,'COUNTERPOINT');
assert.ok(Array.isArray(first.eventDecision?.candidates)&&first.eventDecision.candidates.length>=2);
assert.equal(encounter.nextTrigger,'pushback');
assert.ok(first.eventImpact,'runtime must commit selected World Event impact');
assert.equal(encounter.actors.B.state.contact,beforeTarget.contact-2-2-6,'reaction + impulse + event impact must all reach target state');
assert.equal(first.after.target.contact,encounter.actors.B.state.contact,'trace.after must include semantic event impact');
assert.equal(encounter.transcript.at(-1).intent,INTENTS.MAKE_UNDERSTOOD);
assert.equal(encounter.transcript.at(-1).event,'COUNTERPOINT');

console.log('DEMENTOR LAB intent/saliency selftest: PASS');
