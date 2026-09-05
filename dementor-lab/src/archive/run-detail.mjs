function countBy(items,keyFn){const out={};for(const x of items||[]){const k=keyFn(x);if(!k)continue;out[k]=(out[k]||0)+1}return out}
function metric(state,key){return Math.round(Number(state?.[key]||0))}

export function buildRunDetail(record){
  if(!record)return null;
  const traces=record.traces||[],highlights=record.highlights||[];
  const reactions=countBy(traces,t=>t.selectedReaction);
  const events=countBy(traces,t=>t.event?.type);
  const playerHighlights=highlights.filter(x=>x.actorId==='A'&&x.phrase);
  const keyDialogue=[...highlights].filter(x=>x.phrase).slice(-6);
  const lastPlayerTrace=[...traces].reverse().find(t=>t.actorId==='A')||null;
  const causalChain=(lastPlayerTrace?.visitedNodes||[]).join(' → ')||'—';
  return {
    runId:record.runId,
    title:record.scenarioTitle,
    matchup:`${record.player?.name||'A'} vs ${record.opponent?.name||'B'}`,
    objective:record.objective,
    outcome:record.outcome,
    keyDialogue,
    causalChain,
    reactions,
    events,
    playerLineCount:playerHighlights.length,
    final:{brain:metric(record.finalState?.A,'brain'),contact:Math.min(metric(record.finalState?.A,'contact'),metric(record.finalState?.B,'contact')),tension:metric(record.finalState?.A,'tension'),energy:metric(record.finalState?.A,'energy')},
    patches:record.patches||[],
    rerun:record.rerun||null
  };
}
