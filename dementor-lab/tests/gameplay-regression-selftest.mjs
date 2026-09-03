import assert from 'node:assert/strict';
import { createEncounter, predictTurn, executeActorTurn, applyHotPatch, detectBreakpoint, checkTerminal, REACTION_EFFECTS, IMPULSE_EFFECTS, PAUSE_EFFECTS } from '../src/encounter/runtime.mjs';
import { buildResult } from '../src/encounter/result.mjs';
import { CRITICISM_IDEA_SCENARIO, createCriticismActors } from '../src/scenarios/criticism-idea.mjs';
import { validateGraph } from '../src/core/graph.mjs';

function encounterWithGraph(graph,{brain=12,memory={}}={}){const actors=createCriticismActors();actors.A.brainGraph=structuredClone(graph);actors.A.state.brain=brain;actors.A.state.memory={...memory};return createEncounter({scenario:CRITICISM_IDEA_SCENARIO,actorA:actors.A,actorB:actors.B,mode:'step'})}
const edge=(id,from,to)=>({id,from,to});


// Reaction strategy identities remain mechanically distinct rather than cosmetic variants.
assert.ok(REACTION_EFFECTS.agree.target.contact>REACTION_EFFECTS.joke.target.contact,'AGREE is the strongest relationship repair');
assert.ok(Math.abs(REACTION_EFFECTS.joke.target.tension)>Math.abs(REACTION_EFFECTS.agree.target.tension),'JOKE is the stronger tension release');
assert.ok(Math.abs(REACTION_EFFECTS.silent.self.energy)<Math.abs(REACTION_EFFECTS.explain.self.energy),'SILENT is the cheapest energy survival response');
assert.ok(REACTION_EFFECTS.explain.target.brain>0,'EXPLAIN creates cognitive load on the listener');
assert.ok(REACTION_EFFECTS.pressure.target.energy<0&&REACTION_EFFECTS.pressure.target.brain>0,'PRESSURE trades relationship safety for direct opponent depletion');
assert.ok(REACTION_EFFECTS.pressure.target.contact<REACTION_EFFECTS.explain.target.contact,'PRESSURE is relationally more destructive than EXPLAIN');

assert.ok(IMPULSE_EFFECTS.beright.self.brain>0&&IMPULSE_EFFECTS.beright.target.contact<0,'BE RIGHT trades contact for internal drive');
assert.ok(IMPULSE_EFFECTS.beliked.self.tension<0&&!IMPULSE_EFFECTS.beliked.self.brain,'BE LIKED regulates self without a brain surcharge');
assert.ok(IMPULSE_EFFECTS.understand.target.contact>IMPULSE_EFFECTS.beliked.target.contact,'UNDERSTAND invests more strongly in the other side of contact');
assert.ok(IMPULSE_EFFECTS.understand.self.brain>0,'UNDERSTAND has a cognitive cost');
assert.ok(PAUSE_EFFECTS.self.energy<=-4,'PAUSE pays a meaningful energy cost for regulation');
assert.ok(PAUSE_EFFECTS.self.brain<0&&PAUSE_EFFECTS.self.tension<0&&PAUSE_EFFECTS.target.contact>0,'PAUSE remains a strong regulation trade rather than a dead node');

// Missing current Trigger is transparent NO_ACTION, never silent trigger substitution.
const wrongTrigger={id:'wrong-trigger',nodes:[{id:'t',type:'ignore',p:{}},{id:'r',type:'silent',p:{}}],edges:[edge('e','t','r')]};
const wrong=encounterWithGraph(wrongTrigger),wrongOut=executeActorTurn(wrong);
assert.equal(wrongOut.trace.selectedReaction,null);assert.equal(wrongOut.trace.noActionReason,'NO_TRIGGER');assert.equal(wrongOut.trace.event.type,'NO_RESPONSE');assert.equal(wrong.nextTrigger,'ignore');

// STOP terminates traversed causal chain.
const stopGraph={id:'stop-semantics',nodes:[{id:'t',type:'criticism',p:{}},{id:'j',type:'joke',p:{}},{id:'s',type:'stop',p:{}},{id:'p',type:'pressure',p:{}}],edges:[edge('e1','t','j'),edge('e2','j','s'),edge('e3','s','p')]};
const stopPrediction=predictTurn(encounterWithGraph(stopGraph));assert.deepEqual(stopPrediction.chosen.path.map(n=>n.id),['t','j','s']);assert.equal(stopPrediction.chosen.reaction,'joke');

// BRAIN > is a real gate and requires an unconditional authoring fallback.
const conditionGraph={id:'condition-semantics',nodes:[{id:'t',type:'criticism',p:{}},{id:'direct',type:'explain',p:{}},{id:'if',type:'ifbrain',p:{threshold:70}},{id:'state',type:'resentment',p:{key:'resentment',delta:1,cap:5}},{id:'pressure',type:'pressure',p:{}}],edges:[edge('a','t','direct'),edge('b','t','if'),edge('c','if','state'),edge('d','state','pressure')]};
assert.equal(predictTurn(encounterWithGraph(conditionGraph,{brain:20,memory:{resentment:5}})).chosen.reaction,'explain');assert.equal(predictTurn(encounterWithGraph(conditionGraph,{brain:90,memory:{resentment:5}})).chosen.reaction,'pressure');
const noFallback={id:'bad-condition',nodes:[{id:'t',type:'criticism',p:{}},{id:'if',type:'ifbrain',p:{threshold:70}},{id:'r',type:'explain',p:{}}],edges:[edge('f1','t','if'),edge('f2','if','r')]};assert.equal(validateGraph(noFallback).code,'NO_CONDITION_FALLBACK');

// CONTACT_RISK follows whichever side the player's causal chain is about to lose.
const contactRiskEncounter=encounterWithGraph({id:'contact-risk',nodes:[{id:'t',type:'criticism',p:{}},{id:'i',type:'beright',p:{weight:5}},{id:'r',type:'pressure',p:{}},{id:'x',type:'repeat',p:{count:4}}],edges:[edge('c1','t','i'),edge('c2','i','r'),edge('c3','r','x')]});
contactRiskEncounter.actors.B.state.contact=17;const contactBreakpoint=detectBreakpoint(contactRiskEncounter,predictTurn(contactRiskEncounter));assert.equal(contactBreakpoint?.type,'CONTACT_RISK');assert.equal(contactBreakpoint?.actorId,'A');assert.equal(contactBreakpoint?.riskSide,'B');assert.ok(contactBreakpoint.predictedContact<=8);

// REPEAT is conditional across turns; ACCEPTANCE cancels pending attempts.
const actors=createCriticismActors();const repeatEncounter=createEncounter({scenario:CRITICISM_IDEA_SCENARIO,actorA:actors.A,actorB:actors.B,mode:'step'});executeActorTurn(repeatEncounter);assert.equal(repeatEncounter.pendingRepeats.A?.remaining,3);
// Force B's collision-ready KEEP_PEACE-like response to agree for this semantic test.
repeatEncounter.actors.B.brainGraph={id:'agree-all',nodes:[{id:'t',type:'pushback',p:{}},{id:'r',type:'agree',p:{}}],edges:[edge('a','t','r')]};executeActorTurn(repeatEncounter);assert.equal(repeatEncounter.lastEvent.type,'ACCEPTANCE');assert.equal(repeatEncounter.pendingRepeats.A,null,'explicit ACCEPTANCE cancels pending REPEAT');

// Insert PAUSE is a real owned hot patch and preserves encounter state.
const patchEncounter=encounterWithGraph({id:'patch',nodes:[{id:'t',type:'criticism',p:{}},{id:'i',type:'beright',p:{weight:5}},{id:'r',type:'explain',p:{}},{id:'x',type:'repeat',p:{count:5}}],edges:[edge('e1','t','i'),edge('e2','i','r'),edge('e3','r','x')]});patchEncounter.status='HOT_PATCH';patchEncounter.pendingTurn={breakpoint:{actorId:'A',nodeIds:['t','i','r','x']}};const turnBeforePause=patchEncounter.turn;applyHotPatch(patchEncounter,{kind:'insert-pause',actorId:'A',edgeId:'e2',nodeId:'pause-test'});assert.equal(patchEncounter.turn,turnBeforePause);assert.ok(patchEncounter.actors.A.brainGraph.nodes.some(n=>n.id==='pause-test'&&n.type==='pause'));

// Rewire must remain compatible and runnable.
const rewireGraph={id:'rewire',nodes:[{id:'t',type:'criticism',p:{}},{id:'i',type:'beright',p:{weight:3}},{id:'a',type:'explain',p:{}},{id:'b',type:'joke',p:{}}],edges:[edge('e1','t','i'),edge('e2','i','a'),edge('e3','t','a'),edge('e4','t','b')]};const rewireEncounter=encounterWithGraph(rewireGraph);rewireEncounter.status='HOT_PATCH';const changed=applyHotPatch(rewireEncounter,{kind:'rewire',actorId:'A',edgeId:'e2',toNodeId:'b'});assert.deepEqual(changed,{before:'a',after:'b'});const badRewire=encounterWithGraph(rewireGraph);badRewire.status='HOT_PATCH';assert.throws(()=>applyHotPatch(badRewire,{kind:'rewire',actorId:'A',edgeId:'e2',toNodeId:'t'}),/incompatible rewire target/);

// CONTACT objective evaluates the weaker side at turn limit.
const winActors=createCriticismActors();const win=createEncounter({scenario:CRITICISM_IDEA_SCENARIO,actorA:winActors.A,actorB:winActors.B});win.turn=20;win.actors.A.state.contact=40;win.actors.B.state.contact=27;assert.equal(checkTerminal(win).type,'OBJECTIVE_COMPLETE');assert.equal(checkTerminal(win).relationshipContact,27);
const loseActors=createCriticismActors();const lose=createEncounter({scenario:CRITICISM_IDEA_SCENARIO,actorA:loseActors.A,actorB:loseActors.B});lose.turn=20;lose.actors.A.state.contact=70;lose.actors.B.state.contact=24;assert.equal(checkTerminal(lose).type,'OBJECTIVE_FAILED');

// RESULT explains actual A trace in causal order and replay target belongs to A.
const resultEncounter=encounterWithGraph({id:'result',nodes:[{id:'t',type:'criticism',p:{}},{id:'s',type:'resentment',p:{key:'resentment',delta:1,cap:5}},{id:'i',type:'beright',p:{weight:4}},{id:'r',type:'explain',p:{}},{id:'x',type:'repeat',p:{count:3}}],edges:[edge('e1','t','s'),edge('e2','s','i'),edge('e3','i','r'),edge('e4','r','x')]});executeActorTurn(resultEncounter);resultEncounter.result={type:'BREAKDOWN',reason:'BRAIN',loser:'B',turn:resultEncounter.turn};const result=buildResult(resultEncounter);assert.equal(result.stageC.actorId,'A');assert.ok(resultEncounter.actors.A.brainGraph.nodes.some(n=>n.id===result.stageC.nodeId));const expected=['КРИТИКА','ОБИДА','БЫТЬ ПРАВЫМ W4','ОБЪЯСНИТЬ','REPEAT ×3'];let cursor=-1;for(const label of expected){const at=result.stageB.cause.indexOf(label);assert.ok(at>cursor);cursor=at}
console.log('DEMENTOR LAB gameplay regression selftest: PASS');
