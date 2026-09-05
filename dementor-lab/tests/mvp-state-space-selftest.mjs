import assert from 'node:assert/strict';
import { createMvpSession, advanceUntilPause } from '../src/app/mvp-session.mjs';

const PRESETS=['EXPLAIN_LOOP','KEEP_PEACE','PRESS_FOR_ANSWER'];
const OBJECTIVES=['contact','direct-answer'];
const BRAINS=[5,45,82];
const CONTACTS=[22,60,92];
const TENSIONS=[8,68];
const MEMORIES=[{}, {trust:3,resentment:0}, {trust:0,resentment:3}];

function configure(session,{brain,contact,tension,memory}){
  const e=session.controller.encounter;
  e.actors.A.state.brain=brain;
  e.actors.A.state.contact=contact;
  e.actors.A.state.tension=tension;
  e.actors.A.state.memory={...memory};
  e.actors.B.state.contact=contact;
  e.actors.B.state.tension=tension;
  e.actors.B.state.memory={trust:Number(memory.trust||0),resentment:Number(memory.resentment||0)};
}
function signature(e){return JSON.stringify({result:e.result,traces:e.traces.map(t=>[t.actorId,t.trigger,t.selectedImpulse,t.selectedReaction,t.intent,t.event?.type,t.after]),final:{A:e.actors.A.state,B:e.actors.B.state}})}
function execute(config){
  const session=createMvpSession({playerName:'StateSpace',playerPresetId:config.preset,objective:config.objective});
  configure(session,config);
  const out=advanceUntilPause(session,{maxTurns:80,declineHotPatch:true});
  assert.equal(out.status,'RESULT',`state did not terminate: ${JSON.stringify(config)}`);
  const e=session.controller.encounter;
  assert.ok(e.turn<=80,'state-space encounter exceeded bound');
  for(const side of ['A','B'])for(const key of ['energy','brain','tension','contact'])assert.ok(e.actors[side].state[key]>=0&&e.actors[side].state[key]<=100,`${side}.${key} unclamped`);
  for(const t of e.traces){assert.ok(t.event?.type,'state-space trace missing WorldEvent');assert.ok(Object.hasOwn(t,'intent'),'state-space trace missing Intent')}
  return e;
}

let cases=0,breakdowns=0,completions=0,failures=0;
for(const preset of PRESETS)for(const objective of OBJECTIVES)for(const brain of BRAINS)for(const contact of CONTACTS)for(const tension of TENSIONS)for(const memory of MEMORIES){
  const config={preset,objective,brain,contact,tension,memory};
  const a=execute(config),b=execute(config);
  assert.equal(signature(a),signature(b),`non-deterministic state: ${JSON.stringify(config)}`);
  cases++;
  if(a.result?.type==='BREAKDOWN')breakdowns++;
  else if(a.result?.type==='OBJECTIVE_COMPLETE')completions++;
  else failures++;
}
assert.equal(cases,324);
assert.ok(breakdowns>0,'state-space should include legitimate breakdowns');
assert.ok(completions>0,'state-space should include objective completions');
assert.ok(failures>0,'state-space should include objective failures');
console.log(`MVP state-space OK: ${cases} unique initial states × deterministic replay; complete=${completions}, failed=${failures}, breakdown=${breakdowns}.`);
