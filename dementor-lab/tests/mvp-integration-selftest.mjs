import assert from 'node:assert/strict';
import { createMvpSession } from '../src/app/mvp-session.mjs';
import { recommendOneCausePatch } from '../src/app/hot-patch-strategy.mjs';
import { portraitEmotion } from '../src/render/portrait-state.mjs';

const explain=createMvpSession({playerPresetId:'EXPLAIN_LOOP',objective:'contact'});
explain.controller.encounter.actors.A.state.brain=85;
const out=explain.controller.next();
assert.equal(Boolean(out?.breakpoint),true,'high-brain EXPLAIN_LOOP should expose a patchable breakpoint before commit');
const repeatPatch=recommendOneCausePatch(explain.controller.encounter,out.breakpoint);
assert.equal(repeatPatch?.kind,'reduce-repeat');
assert.equal(repeatPatch?.after,1);

const peace=createMvpSession({playerPresetId:'KEEP_PEACE',objective:'contact'});
const impulsePatch=recommendOneCausePatch(peace.controller.encounter,{nodeIds:['kp-impulse']});
assert.equal(impulsePatch?.kind,'reduce-impulse');
assert.equal(impulsePatch?.nodeId,'kp-impulse');

assert.equal(portraitEmotion({state:{brain:15,tension:10,contact:70,energy:70},isSpeaking:false}),'listening');
assert.equal(portraitEmotion({state:{brain:86,tension:60,contact:40,energy:50},isSpeaking:true}),'heated');
assert.equal(portraitEmotion({state:{brain:100,tension:80,contact:10,energy:30},isSpeaking:true}),'meltdown');
assert.equal(portraitEmotion({state:{brain:60,tension:40,contact:20,energy:50},terminal:{type:'BREAKDOWN'},isLoser:true}),'defeated');

console.log('mvp-integration-selftest ok');
