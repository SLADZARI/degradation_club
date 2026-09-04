import * as base from './runtime.mjs';
import { deriveIntent, selectWorldEvent } from './intent-saliency.mjs';

export * from './runtime.mjs';

function otherSide(side){return side==='A'?'B':'A'}

function applySemanticProjection(encounter,trace){
  if(!trace)return trace;
  const actor=encounter.actors[trace.actorId];
  const targetSide=otherSide(trace.actorId);
  const target=encounter.actors[targetSide];
  const intent=deriveIntent({impulse:trace.selectedImpulse,reaction:trace.selectedReaction});
  const selected=selectWorldEvent({
    reaction:trace.selectedReaction,
    intent,
    actorState:actor?.state||{},
    targetState:target?.state||{}
  });
  trace.intent=intent;
  trace.eventDecision=selected.decision;
  trace.event={...selected.event,actorId:trace.actorId,targetId:targetSide};
  encounter.lastEvent={...trace.event};
  encounter.nextTrigger=trace.event.trigger;
  const lastTranscript=encounter.transcript?.[encounter.transcript.length-1];
  if(lastTranscript?.turn===trace.turn){
    lastTranscript.intent=intent;
    lastTranscript.event=trace.event.type;
  }
  if(trace.event.accepted&&encounter.pendingRepeats?.[targetSide])encounter.pendingRepeats[targetSide]=null;
  return trace;
}

export function executeActorTurn(encounter,opts={}){
  const out=base.executeActorTurn(encounter,opts);
  if(out?.trace)applySemanticProjection(encounter,out.trace);
  return out;
}

export function projectIntentAndEvent(encounter,trace){
  return applySemanticProjection(encounter,trace);
}
