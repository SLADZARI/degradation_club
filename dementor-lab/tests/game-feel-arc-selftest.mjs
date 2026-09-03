import assert from 'node:assert/strict';
import { createEncounter, executeActorTurn } from '../src/encounter/runtime.mjs';
import { buildResult } from '../src/encounter/result.mjs';
import { createCriticismActors, CRITICISM_IDEA_SCENARIO } from '../src/scenarios/criticism-idea.mjs';
import { brainPreset, cloneBrainGraph } from '../src/ui/brain-presets.mjs';
import { opponentPreset } from '../src/opponent/presets.mjs';

function opponentProfile(id){
  const preset=opponentPreset(id);
  return {name:id,baseCharacterId:'character-02',presetId:id,sharedAppearance:{},ownedAppearance:{},graph:preset.graph,initialState:{...preset.initialState,memory:{...(preset.initialState.memory||{})}}};
}
function run(playerPresetId,opponentId){
  const actors=createCriticismActors({opponentProfile:opponentProfile(opponentId),playerName:'ARC'});
  actors.A.brainGraph=cloneBrainGraph(brainPreset(playerPresetId).graph);
  const encounter=createEncounter({scenario:CRITICISM_IDEA_SCENARIO,actorA:actors.A,actorB:actors.B,mode:'auto'});
  encounter.status='NEXT_TURN';
  encounter.hotPatchUsed=true; // Observe authored arc without intervention.
  let guard=0;
  while(!encounter.result&&guard++<60)executeActorTurn(encounter);
  assert.ok(encounter.result,`${playerPresetId} vs ${opponentId} reaches a result`);
  return encounter;
}
function playerReactions(encounter){return encounter.traces.filter(t=>t.actorId==='A').map(t=>t.selectedReaction)}

// Calm regulation must not lose purely because PAUSE arithmetic drains the opponent.
const peaceful=run('keep-peace','CONTACT_SKEPTIC');
assert.equal(peaceful.result.type,'OBJECTIVE_COMPLETE','peaceful contact strategy can survive the full conversation');
assert.ok(peaceful.actors.B.state.energy>0,'repeated PAUSE does not mechanically exhaust an otherwise calm opponent');

// A branch earns its place only if reachable state can actually make it win.
const volatile=run('see-what-happens','CONTACT_SKEPTIC');
const volatileA=playerReactions(volatile),firstPressure=volatileA.indexOf('pressure'),lastJoke=volatileA.lastIndexOf('joke');
assert.ok(lastJoke>=0&&firstPressure>lastJoke,'the same authored graph can pivot from JOKE to PRESSURE after accumulated BRAIN');
const volatileResult=buildResult(volatile);
assert.ok(volatileResult.stageB.arc?.pivot,'RESULT records the first real behavior pivot');
assert.match(volatileResult.stageB.arc.summary,/ШУТИЛ/);
assert.match(volatileResult.stageB.arc.summary,/ДАВИЛ/);

const appeaser=run('keep-peace','KEEP_PEACE');
const appeaserA=playerReactions(appeaser),firstSilent=appeaserA.indexOf('silent'),lastAgree=appeaserA.lastIndexOf('agree');
assert.ok(lastAgree>=0&&firstSilent>lastAgree,'resource depletion can pivot the same graph from AGREE to SILENT');

console.log('DEMENTOR LAB game-feel arc selftest: PASS — whole conversations contain reachable state-driven pivots');
