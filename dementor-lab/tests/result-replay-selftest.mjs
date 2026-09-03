import assert from 'node:assert/strict';
import { createEncounter, executeActorTurn } from '../src/encounter/runtime.mjs';
import { buildResult, compareRuns } from '../src/encounter/result.mjs';
import { CRITICISM_IDEA_SCENARIO, createCriticismActors } from '../src/scenarios/criticism-idea.mjs';

function run({initialRepeat=4}={}){
  const actors=createCriticismActors();
  actors.A.brainGraph.nodes.find(n=>n.type==='repeat').p.count=initialRepeat;
  const e=createEncounter({scenario:CRITICISM_IDEA_SCENARIO,actorA:actors.A,actorB:actors.B,mode:'auto'});
  e.status='NEXT_TURN';
  e.hotPatchUsed=true; // Counterfactual compares authored graphs without an intervention erasing their difference.
  let guard=0;
  while(!e.result&&guard++<60)executeActorTurn(e);
  assert.ok(e.result,'encounter reaches result');
  return e;
}

const before=run({initialRepeat:4});
const after=run({initialRepeat:2});
const result=buildResult(before);
assert.ok(result.punchline);
assert.ok(result.stageB.cause);
assert.ok(result.stageC.nodeId,'result identifies a suspicious causal node');

const comparison=compareRuns(before,after);
assert.equal(comparison.sameScenario,true);
assert.deepEqual(Object.keys(comparison.metrics).sort(),['brain','contact','energy','tension']);
assert.notDeepEqual(comparison.metrics,{brain:0,contact:0,energy:0,tension:0},'one-node counterfactual should change the outcome state');

console.log('DEMENTOR LAB result/replay selftest: PASS');
