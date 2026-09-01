function lastTraceFor(encounter,side){return [...encounter.traces].reverse().find(t=>t.actorId===side)||null}
function nodeType(actor,id){return actor.brainGraph.nodes.find(n=>n.id===id)?.type||id}
function repeatCount(actor,trace){const id=trace?.visitedNodes.find(n=>nodeType(actor,n)==='repeat');return id?actor.brainGraph.nodes.find(n=>n.id===id)?.p?.count||1:1}

export function buildResult(encounter){
  const terminal=encounter.result||{type:'IN_PROGRESS',reason:null,turn:encounter.turn};
  const loser=terminal.loser||null;
  const actor=loser?encounter.actors[loser]:encounter.actors.A;
  const trace=lastTraceFor(encounter,loser||'A');
  const reaction=trace?.selectedReaction||'reaction';
  const impulse=trace?.selectedImpulse||'impulse';
  const repeat=repeatCount(actor,trace);
  const patch=encounter.patches.at(-1)||null;

  let punchline='ЭКСПЕРИМЕНТ ЗАКОНЧИЛСЯ.';
  if(terminal.type==='BREAKDOWN')punchline=`${actor.name.toUpperCase()} НЕ ВЫВЕЗ.`;
  if(terminal.type==='TURN_LIMIT')punchline='ДВАДЦАТЬ РАУНДОВ. НИКТО НЕ УШЁЛ.';

  const cause=trace?`${reaction.toUpperCase()} → ${impulse.toUpperCase()}${repeat>1?` → REPEAT ×${repeat}`:''}`:'ПРИЧИНА НЕ ЗАФИКСИРОВАНА';
  const memory=(trace?.memoryChanges||[]).map(m=>`${String(m.key).toUpperCase()} ${m.before}→${m.after}`);
  const suspicious=trace?.visitedNodes.find(id=>nodeType(actor,id)==='repeat')||trace?.visitedNodes.find(id=>nodeType(actor,id)===impulse)||null;

  return {
    terminal,
    punchline,
    stageB:{title:'ЧТО ПРОИЗОШЛО',cause,memory,turn:trace?.turn||encounter.turn},
    stageC:{title:'ПОДОЗРИТЕЛЬНОЕ МЕСТО',nodeId:suspicious,nodeType:suspicious?nodeType(actor,suspicious):null,patch,nextAction:'ИЗМЕНИТЬ ОДНУ ВЕЩЬ'},
    trace
  };
}

export function compareRuns(beforeEncounter,afterEncounter){
  const a=beforeEncounter.actors.A.state,b=afterEncounter.actors.A.state;
  const delta=k=>Number((b[k]-a[k]).toFixed(2));
  return {sameScenario:beforeEncounter.scenario.id===afterEncounter.scenario.id,metrics:{energy:delta('energy'),brain:delta('brain'),tension:delta('tension'),contact:delta('contact')},beforeResult:beforeEncounter.result,afterResult:afterEncounter.result};
}
