function lastTraceFor(encounter,side){return [...encounter.traces].reverse().find(t=>t.actorId===side)||null}
function nodeType(actor,id){return actor.brainGraph.nodes.find(n=>n.id===id)?.type||id}
function repeatCount(actor,trace){const id=trace?.visitedNodes.find(n=>nodeType(actor,id)==='repeat');return id?actor.brainGraph.nodes.find(n=>n.id===id)?.p?.count||1:1}

function resultCopy({terminal,actor,repeat}){
  if(terminal.type==='TURN_LIMIT')return {
    punchline:'ДВАДЦАТЬ РАУНДОВ. НИКТО НЕ УШЁЛ.',
    observation:'Разговор формально продолжался до самого конца.'
  };
  if(terminal.type==='BREAKDOWN'&&terminal.reason==='CONTACT')return {
    punchline:'РАЗГОВОР УСПЕШНО СОХРАНЁН.',
    observation:`${actor.name} перестал участвовать раньше, чем закончились объяснения.`
  };
  if(terminal.type==='BREAKDOWN'&&terminal.reason==='BRAIN')return {
    punchline:'ОБЪЯСНЕНИЕ ПРЕВЫСИЛО РЕКОМЕНДУЕМУЮ ПРОДОЛЖИТЕЛЬНОСТЬ.',
    observation:repeat>1?`Последняя версия была повторена ещё ${repeat} раза.`:'Последняя версия объяснения оказалась не последней.'
  };
  if(terminal.type==='BREAKDOWN'&&terminal.reason==='ENERGY')return {
    punchline:'РАЗГОВОР ЗАКОНЧИЛСЯ ПО ТЕХНИЧЕСКИМ ПРИЧИНАМ.',
    observation:'На продолжение объяснения больше не осталось энергии.'
  };
  return {punchline:'ЭКСПЕРИМЕНТ ЗАКОНЧИЛСЯ.',observation:'Что-то всё-таки произошло.'};
}

export function buildResult(encounter){
  const terminal=encounter.result||{type:'IN_PROGRESS',reason:null,turn:encounter.turn};
  const loser=terminal.loser||null;
  const actor=loser?encounter.actors[loser]:encounter.actors.A;
  const trace=lastTraceFor(encounter,loser||'A');
  const reaction=trace?.selectedReaction||'reaction';
  const impulse=trace?.selectedImpulse||'impulse';
  const repeat=repeatCount(actor,trace);
  const patch=encounter.patches.at(-1)||null;
  const copy=resultCopy({terminal,actor,repeat});

  const chain=trace?`${reaction.toUpperCase()} → ${impulse.toUpperCase()}${repeat>1?` → REPEAT ×${repeat}`:''}`:'ПРИЧИНА НЕ ЗАФИКСИРОВАНА';
  const cause=`${copy.observation}  ${chain}`;
  const memory=(trace?.memoryChanges||[]).map(m=>`${String(m.key).toUpperCase()} ${m.before}→${m.after}`);
  const suspicious=trace?.visitedNodes.find(id=>nodeType(actor,id)==='repeat')||trace?.visitedNodes.find(id=>nodeType(actor,id)===impulse)||null;

  return {
    terminal,
    punchline:copy.punchline,
    stageB:{title:'ЧТО ПРОИЗОШЛО',observation:copy.observation,chain,cause,memory,turn:trace?.turn||encounter.turn},
    stageC:{title:'ПОДОЗРИТЕЛЬНОЕ МЕСТО',nodeId:suspicious,nodeType:suspicious?nodeType(actor,suspicious):null,patch,nextAction:'ИЗМЕНИТЬ ОДНУ ВЕЩЬ'},
    trace
  };
}

export function compareRuns(beforeEncounter,afterEncounter){
  const a=beforeEncounter.actors.A.state,b=afterEncounter.actors.A.state;
  const delta=k=>Number((b[k]-a[k]).toFixed(2));
  return {sameScenario:beforeEncounter.scenario.id===afterEncounter.scenario.id,metrics:{energy:delta('energy'),brain:delta('brain'),tension:delta('tension'),contact:delta('contact')},beforeResult:beforeEncounter.result,afterResult:afterEncounter.result};
}
