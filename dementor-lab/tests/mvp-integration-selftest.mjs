import assert from 'node:assert/strict';
import { createMvpSession, advanceUntilPause, counterfactualRerun } from '../src/app/mvp-session.mjs';
import { recommendOneCausePatch, counterfactualMutationFromRecommendation } from '../src/app/hot-patch-strategy.mjs';
import { portraitEmotion } from '../src/render/portrait-state.mjs';
import { summarizeEncounter } from '../src/encounter/trace-summary.mjs';

const explain=createMvpSession({playerPresetId:'EXPLAIN_LOOP',objective:'contact'});
explain.controller.encounter.actors.A.state.brain=85;
const out=explain.controller.next();
assert.equal(Boolean(out?.breakpoint),true,'high-brain EXPLAIN_LOOP should expose a patchable breakpoint before commit');
const repeatPatch=recommendOneCausePatch(explain.controller.encounter,out.breakpoint);
assert.equal(repeatPatch?.kind,'reduce-repeat');
assert.equal(repeatPatch?.after,1);

const peace=createMvpSession({playerPresetId:'KEEP_PEACE',objective:'contact'});
const pausePatch=recommendOneCausePatch(peace.controller.encounter,{nodeIds:['kp-impulse','kp-reaction']});
assert.equal(pausePatch?.kind,'insert-pause','single-route brains need a patch that changes runtime state, not a decorative weight');
assert.equal(pausePatch?.edgeId,'kp-e3');

for(const preset of ['KEEP_PEACE','PRESS_FOR_ANSWER']){
  const before=createMvpSession({playerPresetId:preset,objective:'contact'});
  const done=advanceUntilPause(before,{maxTurns:80,declineHotPatch:true});assert.equal(done.status,'RESULT');
  const rec=recommendOneCausePatch(before.controller.encounter);assert.ok(rec,`${preset} needs one material repair`);
  const mutation=counterfactualMutationFromRecommendation(rec);const rerun=counterfactualRerun(before,mutation,{maxTurns:80});
  const a=summarizeEncounter(before.controller.encounter),b=summarizeEncounter(rerun.session.controller.encounter);
  const beforeSig=JSON.stringify({final:a.final,result:a.result,reactions:a.reactions,events:a.events});
  const afterSig=JSON.stringify({final:b.final,result:b.result,reactions:b.reactions,events:b.events});
  assert.notEqual(beforeSig,afterSig,`${preset} one-cause rerun must materially change trajectory or outcome`);
  assert.ok(rerun.session.controller.encounter.traces.some(t=>t.actorId==='A'&&t.visitedNodes.includes(rec.nodeId)),`${preset} rerun must actually traverse inserted repair`);
}

assert.equal(portraitEmotion({state:{brain:15,tension:10,contact:70,energy:70},isSpeaking:false}),'listening');
assert.equal(portraitEmotion({state:{brain:86,tension:60,contact:40,energy:50},isSpeaking:true}),'heated');
assert.equal(portraitEmotion({state:{brain:100,tension:80,contact:10,energy:30},isSpeaking:true}),'meltdown');
assert.equal(portraitEmotion({state:{brain:60,tension:40,contact:20,energy:50},terminal:{type:'BREAKDOWN'},isLoser:true}),'defeated');

console.log('mvp-integration-selftest ok — repeat and non-repeat repairs are material');
