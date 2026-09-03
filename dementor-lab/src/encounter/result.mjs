import { NODE_SPECS } from '../core/model.mjs';
import { familyOf } from '../core/graph.mjs';

function lastTraceFor(encounter,side){return [...encounter.traces].reverse().find(t=>t.actorId===side)||null}
function nodeFor(actor,id){return actor.brainGraph.nodes.find(n=>n.id===id)||null}
function nodeType(actor,id){return nodeFor(actor,id)?.type||id}
function nodeLabel(actor,id){
  const node=nodeFor(actor,id);if(!node)return String(id).toUpperCase();
  const base=NODE_SPECS[node.type]?.title||node.type;
  if(familyOf(node)==='IMPULSE')return `${base} W${node.p?.weight||1}`;
  if(node.type==='repeat')return `${base} ×${node.p?.count||1}`;
  if(familyOf(node)==='STATE')return `${base} +${node.p?.delta??1}`;
  if(node.type==='ifbrain')return `${base} >${node.p?.threshold??70}`;
  return base;
}
function suspiciousNode(actor,trace){
  if(!trace)return null;
  return trace.visitedNodes.find(id=>nodeType(actor,id)==='repeat')||trace.visitedNodes.find(id=>familyOf(nodeFor(actor,id))==='IMPULSE')||trace.visitedNodes.at(-1)||null;
}
export function buildResult(encounter){
  const terminal=encounter.result||{type:'IN_PROGRESS',reason:null,turn:encounter.turn};
  const loser=terminal.loser||null,loserActor=loser?encounter.actors[loser]:null,actor=encounter.actors.A,trace=lastTraceFor(encounter,'A'),patch=encounter.patches.at(-1)||null;
  let punchline='ЭКСПЕРИМЕНТ ЗАКОНЧИЛСЯ.';
  if(terminal.type==='BREAKDOWN')punchline=`${(loserActor?.name||actor.name).toUpperCase()} НЕ ВЫВЕЗ.`;
  if(terminal.type==='TURN_LIMIT')punchline='ДВАДЦАТЬ РАУНДОВ. НИКТО НЕ УШЁЛ.';
  if(terminal.type==='OBJECTIVE_COMPLETE')punchline=`КОНТАКТ СОХРАНЁН. ${Math.round(terminal.relationshipContact)}.`;
  if(terminal.type==='OBJECTIVE_FAILED')punchline=`ФОРМАЛЬНО ДОГОВОРИЛИ. КОНТАКТ — ${Math.round(terminal.relationshipContact)}.`;
  const cause=trace?.noActionReason?`НЕТ ДЕЙСТВИЯ: ${trace.noActionReason}`:trace?.visitedNodes?.length?trace.visitedNodes.map(id=>nodeLabel(actor,id).toUpperCase()).join(' → '):'ПРИЧИНА НЕ ЗАФИКСИРОВАНА';
  const memory=(trace?.memoryChanges||[]).map(m=>`${String(m.key).toUpperCase()} ${m.before}→${m.after}`),suspicious=suspiciousNode(actor,trace);
  return {terminal,punchline,stageB:{title:'ЧТО ПРОИЗОШЛО',cause,memory,turn:trace?.turn||encounter.turn,actorId:'A'},stageC:{title:'ПОДОЗРИТЕЛЬНОЕ МЕСТО',actorId:'A',nodeId:suspicious,nodeType:suspicious?nodeType(actor,suspicious):null,patch,nextAction:'ИЗМЕНИТЬ ОДНУ ВЕЩЬ'},trace};
}
export function compareRuns(beforeEncounter,afterEncounter){
  const a=beforeEncounter.actors.A.state,b=afterEncounter.actors.A.state,delta=k=>Number((b[k]-a[k]).toFixed(2));
  return {sameScenario:beforeEncounter.scenario.id===afterEncounter.scenario.id,metrics:{energy:delta('energy'),brain:delta('brain'),tension:delta('tension'),contact:delta('contact')},beforeResult:beforeEncounter.result,afterResult:afterEncounter.result};
}
