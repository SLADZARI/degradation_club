import { createEncounter, executeActorTurn, declineHotPatch } from '../src/encounter/runtime.mjs';
import { DIRECT_ANSWER_SCENARIO, createDirectAnswerActors } from '../src/scenarios/direct-answer.mjs';
import { BRAIN_PRESETS, cloneBrainGraph } from '../src/ui/brain-presets.mjs';

function run(preset){
  const graph=cloneBrainGraph(preset.graph),actors=createDirectAnswerActors({playerGraph:graph,playerName:'AUDIT'});
  const e=createEncounter({scenario:DIRECT_ANSWER_SCENARIO,actorA:actors.A,actorB:actors.B,mode:'auto'});e.status='NEXT_TURN';e.hotPatchUsed=true;
  let guard=0;while(!e.result&&guard++<50){const out=executeActorTurn(e);if(out.breakpoint)declineHotPatch(e)}
  const a=e.traces.filter(t=>t.actorId==='A'),b=e.traces.filter(t=>t.actorId==='B');
  return {preset:preset.id,result:`${e.result?.type}:${e.result?.reason}`,turns:e.turn,answers:b.filter(t=>t.event?.type==='COUNTERPOINT').length,contact:Math.min(e.actors.A.state.contact,e.actors.B.state.contact),brainA:e.actors.A.state.brain,energyA:e.actors.A.state.energy,aReactions:a.map(t=>t.selectedReaction).join('>'),bEvents:b.map(t=>t.event?.type).join('>')};
}
console.log('DIRECT_ANSWER_MATRIX_BEGIN');for(const p of BRAIN_PRESETS)console.log(JSON.stringify(run(p)));console.log('DIRECT_ANSWER_MATRIX_END');
