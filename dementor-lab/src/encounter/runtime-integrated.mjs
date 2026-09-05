import * as base from './runtime.mjs';
import { deriveIntent, selectWorldEvent, applyWorldEventEffects } from './intent-saliency.mjs';

export * from './runtime.mjs';

function otherSide(side){return side==='A'?'B':'A'}
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

function resolveSemanticEvent({actor,target,reaction,impulse}){
  const intent=deriveIntent({impulse,reaction});
  const selected=selectWorldEvent({reaction,intent,actorState:actor?.state||{},targetState:target?.state||{}});
  const eventImpact=applyWorldEventEffects(target?.state,selected.event.type);
  return {event:selected.event,intent,eventDecision:selected.decision,eventImpact};
}

function addSemanticTrace(encounter,trace){
  if(!trace)return trace;
  const targetSide=otherSide(trace.actorId);
  const voice=brainVoiceForTrace(encounter,trace);
  trace.brainVoice=voice;
  trace.semanticEvents=[
    {type:'speech',actorId:trace.actorId,reaction:trace.selectedReaction,intent:trace.intent||null},
    ...(voice?[voice]:[]),
    {type:'world_event',actorId:trace.actorId,targetId:targetSide,event:trace.event?.type||null,trigger:trace.event?.trigger||null},
    {type:'metric_change',actorId:trace.actorId,self:{...(trace.metricDeltas?.self||{})},target:{...(trace.metricDeltas?.target||{})},eventTarget:{...(trace.metricDeltas?.eventTarget||{})}}
  ];
  const lastTranscript=encounter.transcript?.[encounter.transcript.length-1];
  if(lastTranscript?.turn===trace.turn)lastTranscript.brainVoice=voice;
  return trace;
}

export function executeActorTurn(encounter,opts={}){
  const out=base.executeActorTurn(encounter,{...opts,eventResolver:resolveSemanticEvent});
  if(!out?.trace)return out;
  const trace=addSemanticTrace(encounter,out.trace);
  return {...out,trace};
}

export function projectIntentAndEvent(encounter,trace){
  if(!trace)return trace;
  const actor=encounter.actors[trace.actorId],target=encounter.actors[otherSide(trace.actorId)];
  const semantic=resolveSemanticEvent({actor,target,reaction:trace.selectedReaction,impulse:trace.selectedImpulse});
  trace.intent=semantic.intent;trace.eventDecision=semantic.eventDecision;trace.event={...semantic.event,actorId:trace.actorId,targetId:otherSide(trace.actorId)};trace.eventImpact=semantic.eventImpact;
  return addSemanticTrace(encounter,trace);
}
