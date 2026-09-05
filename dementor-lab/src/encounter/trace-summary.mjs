function round(v){return Math.round(Number(v||0))}

export function summarizeEncounter(encounter,side='A'){
  const traces=encounter.traces.filter(t=>t.actorId===side);
  const actor=encounter.actors[side];
  const reactions={};const intents={};const events={};
  for(const trace of traces){
    if(trace.selectedReaction)reactions[trace.selectedReaction]=(reactions[trace.selectedReaction]||0)+1;
    if(trace.intent)intents[trace.intent]=(intents[trace.intent]||0)+1;
    if(trace.event?.type)events[trace.event.type]=(events[trace.event.type]||0)+1;
  }
  const repeats=traces.filter(t=>t.repeatOverride).length;
  return {
    turns:encounter.turn,
    actorTurns:traces.length,
    reactions,
    intents,
    events,
    repeats,
    final:{energy:round(actor.state.energy),brain:round(actor.state.brain),tension:round(actor.state.tension),contact:round(actor.state.contact)},
    result:encounter.result?{...encounter.result}:null
  };
}

export function compareTraceSummaries(beforeEncounter,afterEncounter,side='A'){
  const before=summarizeEncounter(beforeEncounter,side),after=summarizeEncounter(afterEncounter,side);
  const metricDelta={};for(const key of ['energy','brain','tension','contact'])metricDelta[key]=after.final[key]-before.final[key];
  return {before,after,metricDelta,sameScenario:beforeEncounter.scenario.id===afterEncounter.scenario.id};
}
