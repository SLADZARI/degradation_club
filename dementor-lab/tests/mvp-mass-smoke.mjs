import assert from 'node:assert/strict';
import { createMvpSession, advanceUntilPause } from '../src/app/mvp-session.mjs';
import { summarizeEncounter } from '../src/encounter/trace-summary.mjs';

const PRESETS=['EXPLAIN_LOOP','KEEP_PEACE','PRESS_FOR_ANSWER'];
const OBJECTIVES=['contact','direct-answer'];

function signature(encounter){
  return JSON.stringify({
    result:encounter.result,
    traces:encounter.traces.map(t=>({actorId:t.actorId,trigger:t.trigger,impulse:t.selectedImpulse,reaction:t.selectedReaction,intent:t.intent,event:t.event?.type,brainVoice:t.brainVoice?.text||null,after:t.after})),
    final:{A:encounter.actors.A.state,B:encounter.actors.B.state}
  });
}

function run(preset,objective){
  const session=createMvpSession({playerName:'Smoke',playerPresetId:preset,objective});
  const out=advanceUntilPause(session,{maxTurns:80,declineHotPatch:true});
  assert.equal(out.status,'RESULT');
  const e=session.controller.encounter;
  assert.ok(e.turn<=80,'encounter exceeded safety bound');
  for(const side of ['A','B'])for(const key of ['energy','brain','tension','contact'])assert.ok(e.actors[side].state[key]>=0&&e.actors[side].state[key]<=100,`${side}.${key} unclamped`);
  for(const trace of e.traces){assert.ok(trace.event?.type,'missing world event');assert.ok(Object.hasOwn(trace,'intent'),'missing intent field');}
  return e;
}

for(const preset of PRESETS){
  for(const objective of OBJECTIVES){
    const a=run(preset,objective),b=run(preset,objective);
    assert.equal(signature(a),signature(b),`${preset}/${objective} is not deterministic`);
  }
}

const summaries=new Map();
for(let i=0;i<1000;i++){
  const preset=PRESETS[i%PRESETS.length],objective=OBJECTIVES[i%OBJECTIVES.length];
  const e=run(preset,objective);
  const s=summarizeEncounter(e);
  summaries.set(`${preset}/${objective}`,s);
}

const behaviorSignatures=PRESETS.map(preset=>{
  const e=run(preset,'contact');
  return JSON.stringify(e.traces.filter(t=>t.actorId==='A').map(t=>[t.selectedImpulse,t.intent,t.selectedReaction,t.event?.type]));
});
assert.equal(new Set(behaviorSignatures).size,PRESETS.length,'player presets do not produce three distinct behavior traces');

console.log(`MVP mass smoke OK: 1000 runs; ${summaries.size} preset/objective combinations; deterministic and bounded.`);
