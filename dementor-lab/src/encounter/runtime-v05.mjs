import * as base from './runtime.mjs';
import { deriveIntent, selectWorldEvent, applyWorldEventEffects } from './intent-saliency.mjs';

export * from './runtime.mjs';

function otherSide(side){return side==='A'?'B':'A'}
function snapshot(state){return {...state,memory:{...(state?.memory||{})}}}

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

  // Port of the manually playtested v0.2 lab: a selected World Event changes
  // the target state before the next brain receives its Trigger.
  const eventImpact=applyWorldEventEffects(target?.state,trace.event.type);
  trace.eventImpact=eventImpact;
  if(trace.metricDeltas)trace.metricDeltas.eventTarget={...eventImpact.metrics};
  if(trace.after)trace.after.target=snapshot(target?.state||{});

  encounter.lastEvent={...trace.event};
  encounter.nextTrigger=trace.event.trigger;

  const lastTranscript=encounter.transcript?.[encounter.transcript.length-1];
  if(lastTranscript?.turn===trace.turn){
    lastTranscript.intent=intent;
    lastTranscript.event=trace.event.type;
    lastTranscript.eventDecision=selected.decision.winner;
    lastTranscript.eventImpact=eventImpact;
  }

  // In the saliency model ACCEPTANCE means the current actor's pending attempt
  // has landed, so its own repeat chain is complete.
  if(trace.event.accepted&&encounter.pendingRepeats?.[trace.actorId])encounter.pendingRepeats[trace.actorId]=null;
  return trace;
}

function reconcileTerminal(encounter,out,trace){
  const terminal=base.checkTerminal(encounter);
  if(terminal){
    encounter.status='RESULT';
    encounter.result=terminal;
    return {...out,trace,terminal:true,result:terminal};
  }

  // base runtime may have reached a terminal state using its legacy fixed event
  // before semantic projection. If saliency changes that outcome, resume safely.
  encounter.result=null;
  if(out?.terminal){
    encounter.activeActor=otherSide(trace.actorId);
    encounter.status='NEXT_TURN';
  }
  return {...out,trace,terminal:false,result:undefined};
}

export function executeActorTurn(encounter,opts={}){
  const out=base.executeActorTurn(encounter,opts);
  if(!out?.trace)return out;
  const trace=applySemanticProjection(encounter,out.trace);
  return reconcileTerminal(encounter,out,trace);
}

export function projectIntentAndEvent(encounter,trace){
  return applySemanticProjection(encounter,trace);
}
