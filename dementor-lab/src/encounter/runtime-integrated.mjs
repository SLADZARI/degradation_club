import * as base from './runtime.mjs';
import { deriveIntent, selectWorldEvent, applyWorldEventEffects } from './intent-saliency.mjs';

export * from './runtime.mjs';

function otherSide(side){return side==='A'?'B':'A'}
function snapshot(state){return {...state,memory:{...(state?.memory||{})}}}
function node(actor,id){return actor?.brainGraph?.nodes?.find(n=>n.id===id)||null}

function brainVoiceForTrace(encounter,trace){
  if(!trace?.selectedImpulse)return null;
  const actor=encounter.actors[trace.actorId];
  const target=encounter.actors[otherSide(trace.actorId)];
  const impulseNode=(trace.visitedNodes||[]).map(id=>node(actor,id)).find(n=>n?.type===trace.selectedImpulse);
  const weight=Number(impulseNode?.p?.weight||0);
  const contact=Number(target?.state?.contact??60);
  const tension=Number(actor?.state?.tension??0);
  if(weight<4&&contact>35&&tension<65)return null;
  const voices={
    beright:contact<40?'Она сказала это слишком спокойно. Подозрительно.':'Возражение ещё не означает, что мысль поняли.',
    beunderstood:contact<40?'Она уже выходит из разговора. Значит, надо объяснить главное.':'Кажется, самое важное всё ещё не дошло.',
    beliked:tension>55?'Сейчас лучше не выигрывать. Сейчас лучше остаться людьми.':'Спор можно закончить раньше, чем отношения.',
    understand:'Сначала понять, потом отвечать. Редкая технология.'
  };
  const text=voices[trace.selectedImpulse];
  return text?{type:'brain_voice',actorId:trace.actorId,nodeType:trace.selectedImpulse,weight,text}:null;
}

function applySemanticProjection(encounter,trace){
  if(!trace)return trace;
  const actor=encounter.actors[trace.actorId];
  const targetSide=otherSide(trace.actorId);
  const target=encounter.actors[targetSide];
  const intent=deriveIntent({impulse:trace.selectedImpulse,reaction:trace.selectedReaction});
  const selected=selectWorldEvent({reaction:trace.selectedReaction,intent,actorState:actor?.state||{},targetState:target?.state||{}});

  trace.intent=intent;
  trace.eventDecision=selected.decision;
  trace.event={...selected.event,actorId:trace.actorId,targetId:targetSide};
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

  if(trace.event.accepted&&encounter.pendingRepeats?.[trace.actorId])encounter.pendingRepeats[trace.actorId]=null;

  const voice=brainVoiceForTrace(encounter,trace);
  trace.brainVoice=voice;
  trace.semanticEvents=[
    {type:'speech',actorId:trace.actorId,reaction:trace.selectedReaction,intent},
    ...(voice?[voice]:[]),
    {type:'world_event',actorId:trace.actorId,targetId:targetSide,event:trace.event.type,trigger:trace.event.trigger},
    {type:'metric_change',actorId:trace.actorId,self:{...(trace.metricDeltas?.self||{})},target:{...(trace.metricDeltas?.target||{})},eventTarget:{...(trace.metricDeltas?.eventTarget||{})}}
  ];
  return trace;
}

function reconcileTerminal(encounter,out,trace){
  const terminal=base.checkTerminal(encounter);
  if(terminal){encounter.status='RESULT';encounter.result=terminal;return {...out,trace,terminal:true,result:terminal};}
  encounter.result=null;
  if(out?.terminal){encounter.activeActor=otherSide(trace.actorId);encounter.status='NEXT_TURN';}
  return {...out,trace,terminal:false,result:undefined};
}

export function executeActorTurn(encounter,opts={}){
  const out=base.executeActorTurn(encounter,opts);
  if(!out?.trace)return out;
  const trace=applySemanticProjection(encounter,out.trace);
  return reconcileTerminal(encounter,out,trace);
}

export function projectIntentAndEvent(encounter,trace){return applySemanticProjection(encounter,trace)}
