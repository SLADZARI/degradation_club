import {NODE_SPECS} from './model.mjs';

export function familyOf(node){return NODE_SPECS[node?.type]?.family||'UNKNOWN'}

export const NEXT_FAMILY_COMPAT=Object.freeze({
  TRIGGER:new Set(['STATE','IMPULSE','REACTION','CONTROL','ABILITY']),
  STATE:new Set(['STATE','IMPULSE','REACTION','CONTROL','ABILITY']),
  IMPULSE:new Set(['STATE','REACTION','CONTROL','ABILITY']),
  REACTION:new Set(['STATE','CONTROL','ABILITY']),
  CONTROL:new Set(['STATE','REACTION','CONTROL','ABILITY']),
  ABILITY:new Set(['STATE','REACTION','CONTROL'])
});

export function outgoing(graph,id){return (graph.edges||[]).filter(e=>e.from===id)}
export function reachableFrom(graph,startId){
  const seen=new Set(),stack=[startId];
  while(stack.length){const id=stack.pop();if(seen.has(id))continue;seen.add(id);outgoing(graph,id).forEach(e=>stack.push(e.to))}
  return seen;
}
function edgeFamiliesCompatible(fromNode,toNode){const fromFam=familyOf(fromNode),toFam=familyOf(toNode);return toFam!=='TRIGGER'&&Boolean(NEXT_FAMILY_COMPAT[fromFam]?.has(toFam))}
function graphHasCycle(graph){
  const visiting=new Set(),visited=new Set();
  function visit(id){if(visiting.has(id))return true;if(visited.has(id))return false;visiting.add(id);for(const edge of outgoing(graph,id)){if(visit(edge.to))return true}visiting.delete(id);visited.add(id);return false}
  return graph.nodes.some(n=>visit(n.id));
}
function pathsToFirstReaction(graph,startId,maxDepth=24){
  const out=[];
  function walk(id,path){
    if(path.length>=maxDepth)return;
    const n=graph.nodes.find(x=>x.id===id);if(!n)return;
    const next=[...path,n];
    if(familyOf(n)==='REACTION'){out.push(next);return}
    for(const e of outgoing(graph,id))walk(e.to,next)
  }
  walk(startId,[]);return out;
}

export function canConnectNodes(graph,fromNode,toNode){
  if(!fromNode||!toNode||fromNode.id===toNode.id)return false;
  if((graph.edges||[]).some(e=>e.from===fromNode.id&&e.to===toNode.id))return false;
  if(!edgeFamiliesCompatible(fromNode,toNode))return false;
  if(reachableFrom(graph,toNode.id).has(fromNode.id))return false;
  return true;
}

export function validateGraph(graph){
  const ids=new Set(graph.nodes.map(n=>n.id));
  const dangling=(graph.edges||[]).find(e=>!ids.has(e.from)||!ids.has(e.to));
  if(dangling)return {runnable:false,code:'DANGLING_EDGE',edgeId:dangling.id,detail:'ОДНА ИЗ СВЯЗЕЙ ВЕДЁТ В НЕСУЩЕСТВУЮЩИЙ УЗЕЛ.'};
  const incompatible=(graph.edges||[]).find(e=>!edgeFamiliesCompatible(graph.nodes.find(n=>n.id===e.from),graph.nodes.find(n=>n.id===e.to)));
  if(incompatible)return {runnable:false,code:'INCOMPATIBLE_EDGE',edgeId:incompatible.id,detail:'ОДНА ИЗ СВЯЗЕЙ СОЕДИНЯЕТ НЕСОВМЕСТИМЫЕ БЛОКИ.'};
  if(graphHasCycle(graph))return {runnable:false,code:'EXPLICIT_CYCLE',detail:'ЯВНАЯ ПЕТЛЯ ЗАПРЕЩЕНА. ДЛЯ ПОВТОРА ЕСТЬ УЗЕЛ REPEAT.'};

  const triggers=graph.nodes.filter(n=>familyOf(n)==='TRIGGER');
  const reactions=graph.nodes.filter(n=>familyOf(n)==='REACTION');
  if(!triggers.length)return {runnable:false,code:'NO_TRIGGER',detail:'СХЕМА ПОКА НЕ ЗНАЕТ, С ЧЕГО НАЧИНАТЬ.'};
  if(!reactions.length)return {runnable:false,code:'NO_REACTION',detail:'ОН ПОКА НЕ ЗНАЕТ, ЧТО ВООБЩЕ ДЕЛАТЬ.'};
  const activeTriggers=triggers.filter(t=>t.p?.enabled!==false);
  if(!activeTriggers.length)return {runnable:false,code:'NO_ACTIVE_TRIGGER',detail:'НИ ОДИН ВХОД ПОКА НЕ ПОДКЛЮЧЕН.'};

  const reachable=new Set();activeTriggers.forEach(t=>reachableFrom(graph,t.id).forEach(id=>reachable.add(id)));
  const deadTrigger=activeTriggers.find(t=>!outgoing(graph,t.id).length);
  if(deadTrigger)return {runnable:false,code:'DEAD_TRIGGER',nodeId:deadTrigger.id,detail:`ОН ПОКА НЕ ЗНАЕТ, ЧТО ДЕЛАТЬ ПОСЛЕ «${NODE_SPECS[deadTrigger.type]?.title||deadTrigger.type}».`};
  if(!reactions.some(r=>reachable.has(r.id)))return {runnable:false,code:'REACTION_UNREACHABLE',detail:'РЕАКЦИЯ ЕСТЬ, НО СИГНАЛ ДО НЕЁ НЕ ДОХОДИТ.'};
  const isolated=graph.nodes.find(n=>familyOf(n)!=='TRIGGER'&&!reachable.has(n.id));
  if(isolated)return {runnable:false,code:'ISLAND',nodeId:isolated.id,detail:`БЛОК «${NODE_SPECS[isolated.type]?.title||isolated.type}» НЕ УЧАСТВУЕТ В СХЕМЕ.`};

  for(const trigger of activeTriggers){
    const paths=pathsToFirstReaction(graph,trigger.id);
    const hasConditional=paths.some(path=>path.some(n=>n.type==='ifbrain'));
    const hasFallback=paths.some(path=>!path.some(n=>n.type==='ifbrain'));
    if(hasConditional&&!hasFallback)return {runnable:false,code:'NO_CONDITION_FALLBACK',nodeId:trigger.id,detail:'ЕСЛИ УСЛОВИЕ НЕ СРАБОТАЕТ, ОН ЗАВИСНЕТ. ДОБАВЬ ЗАПАСНУЮ РЕАКЦИЮ.'};
  }
  return {runnable:true,code:'READY',detail:'СХЕМА ДОХОДИТ ОТ ТРИГГЕРА ДО РЕАКЦИИ.'};
}
