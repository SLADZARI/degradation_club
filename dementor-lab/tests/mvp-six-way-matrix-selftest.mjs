import assert from 'node:assert/strict';
import { createMvpSession, advanceUntilPause } from '../src/app/mvp-session.mjs';
import { summarizeEncounter } from '../src/encounter/trace-summary.mjs';
import { buildResult } from '../src/encounter/result.mjs';

const PRESETS=['EXPLAIN_LOOP','KEEP_PEACE','PRESS_FOR_ANSWER'];
const OBJECTIVES=['contact','direct-answer'];

function run(preset,objective){
  const session=createMvpSession({playerName:'Matrix',playerPresetId:preset,objective});
  const out=advanceUntilPause(session,{maxTurns:80,declineHotPatch:true});
  assert.equal(out.status,'RESULT',`${preset}/${objective} did not terminate`);
  const e=session.controller.encounter;
  const summary=summarizeEncounter(e);
  const result=buildResult(e);
  assert.equal(e.scenario.objective,objective,`${preset}/${objective} lost objective binding`);
  assert.ok(e.traces.length>0,`${preset}/${objective} produced no traces`);
  assert.ok(result.punchline,`${preset}/${objective} missing punchline`);
  assert.ok(result.stageB?.cause,`${preset}/${objective} missing trace-derived cause`);
  assert.ok(result.stageC?.humanSuspicion,`${preset}/${objective} missing one-cause diagnosis`);
  for(const t of e.traces){
    assert.ok(t.event?.type,`${preset}/${objective} trace missing WorldEvent`);
    assert.ok(Object.hasOwn(t,'intent'),`${preset}/${objective} trace missing Intent`);
  }
  return {session,summary,result};
}

const matrix=new Map();
for(const preset of PRESETS)for(const objective of OBJECTIVES)matrix.set(`${preset}/${objective}`,run(preset,objective));

const report=[...matrix.entries()].map(([key,{summary,result,session}])=>{
  const e=session.controller.encounter;
  const a=e.traces.filter(t=>t.actorId==='A');
  const b=e.traces.filter(t=>t.actorId==='B');
  return {
    key,
    scenario:e.scenario.id,
    terminal:e.result?.type||null,
    reason:e.result?.reason||null,
    answers:e.result?.answers??b.filter(t=>t.selectedReaction==='explain').length,
    relationshipContact:e.result?.relationshipContact??Math.min(e.actors.A.state.contact,e.actors.B.state.contact),
    reactionKinds:new Set(a.map(t=>t.selectedReaction).filter(Boolean)).size,
    A:a.map(t=>t.selectedReaction||'-').join('>'),
    B:b.map(t=>t.selectedReaction||'-').join('>'),
    punchline:result.punchline
  };
});
console.log('MVP six-way diagnostics');
console.table(report);

for(const objective of OBJECTIVES){
  const signatures=PRESETS.map(preset=>{
    const e=matrix.get(`${preset}/${objective}`).session.controller.encounter;
    return JSON.stringify(e.traces.filter(t=>t.actorId==='A').map(t=>[t.selectedImpulse,t.intent,t.selectedReaction,t.event?.type]));
  });
  assert.equal(new Set(signatures).size,3,`all three presets must remain behaviorally distinct for ${objective}`);
  const wins=PRESETS.filter(preset=>matrix.get(`${preset}/${objective}`).session.controller.encounter.result?.type==='OBJECTIVE_COMPLETE');
  assert.ok(wins.length>=1,`${objective} must have at least one viable visible BRAIN; got none`);
}

for(const preset of PRESETS){
  const contact=matrix.get(`${preset}/contact`).session.controller.encounter;
  const answer=matrix.get(`${preset}/direct-answer`).session.controller.encounter;
  assert.notEqual(contact.scenario.id,answer.scenario.id,`${preset}: each visible case must bind its real scenario identity`);
  assert.equal(contact.scenario.id,'criticism-idea');
  assert.equal(answer.scenario.id,'direct-answer');
}

for(const objective of OBJECTIVES){
  const press=matrix.get(`PRESS_FOR_ANSWER/${objective}`).session.controller.encounter;
  const reactions=press.traces.filter(t=>t.actorId==='A').map(t=>t.selectedReaction);
  assert.ok(reactions.includes('explain'),`PRESS_FOR_ANSWER/${objective} must actually ask/explain`);
  assert.ok(reactions.includes('joke'),`PRESS_FOR_ANSWER/${objective} must visibly regulate when hot`);
  const firstJoke=reactions.indexOf('joke');
  assert.ok(firstJoke>0,`PRESS_FOR_ANSWER/${objective} should begin direct and pivot later`);
}

console.log('MVP six-way matrix OK — both objectives viable; adaptive exposed BRAIN has a real pivot');
