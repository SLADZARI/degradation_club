import { NODE_SPECS } from '../core/model.mjs';
import { familyOf } from '../core/graph.mjs';

const REACTION_ARC_LABEL=Object.freeze({explain:'ОБЪЯСНЯЛ',agree:'СОГЛАШАЛСЯ',joke:'ШУТИЛ',silent:'МОЛЧАЛ',pressure:'ДАВИЛ'});
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
function roundMetric(value){return Math.round(Number(value||0))}
function pivotStateLabel(trace){
  const state=trace?.before?.self||{};
  const candidates=[['BRAIN',roundMetric(state.brain),Math.abs(Number(state.brain||0)-50)],['ENERGY',roundMetric(state.energy),Math.abs(Number(state.energy||0)-50)],['TENSION',roundMetric(state.tension),Math.abs(Number(state.tension||0)-50)],['CONTACT',roundMetric(state.contact),Math.abs(Number(state.contact||0)-50)]];
  candidates.sort((a,b)=>b[2]-a[2]);
  const [label,value]=candidates[0]||['STATE',0];return `${label} ${value}`;
}
export function buildConversationArc(encounter,side='A'){
  const traces=encounter.traces.filter(t=>t.actorId===side&&t.selectedReaction),segments=[];
  for(const trace of traces){const last=segments.at(-1);if(last?.reaction===trace.selectedReaction){last.endTurn=trace.turn;last.count++;continue}segments.push({reaction:trace.selectedReaction,label:REACTION_ARC_LABEL[trace.selectedReaction]||String(trace.selectedReaction).toUpperCase(),startTurn:trace.turn,endTurn:trace.turn,count:1,firstTrace:trace})}
  if(!segments.length)return {summary:'ПОВЕДЕНЧЕСКАЯ ДУГА НЕ ЗАФИКСИРОВАНА.',segments:[],pivot:null};
  if(segments.length===1)return {summary:`${segments[0].label} ВСЮ ПАРТИЮ — ПАТТЕРН НЕ СМЕНИЛСЯ.`,segments:segments.map(({firstTrace,...s})=>s),pivot:null};
  const pivot=segments[1],visible=segments.slice(0,3).map(s=>s.label),suffix=segments.length>3?' → …':'';
  return {summary:`${visible.join(' → ')}${suffix}. ПЕРВЫЙ ПЕРЕЛОМ: ХОД ${pivot.startTurn}, ${pivotStateLabel(pivot.firstTrace)}.`,segments:segments.map(({firstTrace,...s})=>s),pivot:{turn:pivot.startTurn,reaction:pivot.reaction,state:{...(pivot.firstTrace?.before?.self||{})}}};
}
export function buildResult(encounter){
  const terminal=encounter.result||{type:'IN_PROGRESS',reason:null,turn:encounter.turn};
  const loser=terminal.loser||null,loserActor=loser?encounter.actors[loser]:null,actor=encounter.actors.A,trace=lastTraceFor(encounter,'A'),patch=encounter.patches.at(-1)||null,arc=buildConversationArc(encounter,'A');
  let punchline='ЭКСПЕРИМЕНТ ЗАКОНЧИЛСЯ.';
  if(terminal.type==='BREAKDOWN')punchline=`${(loserActor?.name||actor.name).toUpperCase()} НЕ ВЫВЕЗ — ${String(terminal.reason||'РАЗВАЛ').toUpperCase()} ${terminal.reason&&loserActor?.state?.[String(terminal.reason).toLowerCase()]!=null?Math.round(loserActor.state[String(terminal.reason).toLowerCase()]):''}.`.replace('  .','.');
  if(terminal.type==='TURN_LIMIT')punchline='ЛИМИТ ХОДОВ. ЭКСПЕРИМЕНТ ЗАКОНЧЕН.';
  if(terminal.type==='OBJECTIVE_COMPLETE'&&terminal.objective==='contact')punchline=`КОНТАКТ СОХРАНЁН. ${Math.round(terminal.relationshipContact)}.`;
  if(terminal.type==='OBJECTIVE_FAILED'&&terminal.objective==='contact')punchline=`ФОРМАЛЬНО ДОГОВОРИЛИ. КОНТАКТ — ${Math.round(terminal.relationshipContact)}.`;
  if(terminal.type==='OBJECTIVE_COMPLETE'&&terminal.objective==='direct-answer')punchline=`ПРЯМЫЕ ОТВЕТЫ ДОБЫТЫ. ${terminal.answers}/${terminal.required}. CONTACT ${Math.round(terminal.relationshipContact)}.`;
  if(terminal.type==='OBJECTIVE_FAILED'&&terminal.objective==='direct-answer'&&terminal.reason==='NO_DIRECT_ANSWER')punchline=`ОТВЕТА ТАК И НЕ ДОБИЛИСЬ. ${terminal.answers}/${terminal.required}.`;
  if(terminal.type==='OBJECTIVE_FAILED'&&terminal.objective==='direct-answer'&&terminal.reason==='CONTACT_LOW')punchline=`ОТВЕТЫ ЕСТЬ. CONTACT НЕ ВЫДЕРЖАЛ — ${Math.round(terminal.relationshipContact)}.`;
  const cause=trace?.noActionReason?`НЕТ ДЕЙСТВИЯ: ${trace.noActionReason}`:trace?.visitedNodes?.length?trace.visitedNodes.map(id=>nodeLabel(actor,id).toUpperCase()).join(' → '):'ПРИЧИНА НЕ ЗАФИКСИРОВАНА';
  const memory=(trace?.memoryChanges||[]).map(m=>`${String(m.key).toUpperCase()} ${m.before}→${m.after}`),suspicious=suspiciousNode(actor,trace);
  return {terminal,punchline,stageB:{title:'ЧТО ПРОИЗОШЛО',cause,memory,arc,turn:trace?.turn||encounter.turn,actorId:'A'},stageC:{title:'ПОДОЗРИТЕЛЬНОЕ МЕСТО',actorId:'A',nodeId:suspicious,nodeType:suspicious?nodeType(actor,suspicious):null,patch,nextAction:'ИЗМЕНИТЬ ОДНУ ВЕЩЬ'},trace};
}
export function compareRuns(beforeEncounter,afterEncounter){
  const a=beforeEncounter.actors.A.state,b=afterEncounter.actors.A.state,delta=k=>Number((b[k]-a[k]).toFixed(2));
  return {sameScenario:beforeEncounter.scenario.id===afterEncounter.scenario.id,metrics:{energy:delta('energy'),brain:delta('brain'),tension:delta('tension'),contact:delta('contact')},beforeResult:beforeEncounter.result,afterResult:afterEncounter.result};
}
