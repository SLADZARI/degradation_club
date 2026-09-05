const IMPULSE_TYPES=new Set(['beright','beliked','understand','beunderstood']);
const REACTION_TYPES=new Set(['explain','agree','joke','silent','pressure']);

function node(actor,id){return actor?.brainGraph?.nodes?.find(n=>n.id===id)||null}
function repeatNode(actor){return actor?.brainGraph?.nodes?.find(n=>n.type==='repeat')||null}
function impulseNode(actor,visited=[]){const fromTrace=visited.map(id=>node(actor,id)).find(n=>IMPULSE_TYPES.has(n?.type));return fromTrace||actor?.brainGraph?.nodes?.find(n=>IMPULSE_TYPES.has(n.type))||null}
function edgeAlreadyPaused(actor,edge){return node(actor,edge.from)?.type==='pause'}
function pauseEdge(actor,visited=[]){
  for(let i=1;i<visited.length;i++){
    const from=node(actor,visited[i-1]),to=node(actor,visited[i]);
    if(from&&to&&REACTION_TYPES.has(to.type)){
      const edge=actor.brainGraph.edges.find(e=>e.from===from.id&&e.to===to.id);
      if(edge&&!edgeAlreadyPaused(actor,edge))return edge;
    }
  }
  return actor?.brainGraph?.edges?.find(e=>REACTION_TYPES.has(node(actor,e.to)?.type)&&!edgeAlreadyPaused(actor,e))||null;
}

export function recommendOneCausePatch(encounter,breakpoint=null){
  const actor=encounter?.actors?.A;if(!actor)return null;
  const visited=breakpoint?.nodeIds||encounter?.traces?.at(-1)?.visitedNodes||[];
  const repeat=visited.map(id=>node(actor,id)).find(n=>n?.type==='repeat')||repeatNode(actor);
  if(repeat&&Number(repeat.p?.count||1)>1)return {kind:'reduce-repeat',actorId:'A',nodeId:repeat.id,title:'ОБОРОВАТЬ ПОВТОР',description:`REPEAT ×${Number(repeat.p?.count||1)} → ×1`,before:Number(repeat.p?.count||1),after:1};
  const edge=pauseEdge(actor,visited);
  if(edge)return {kind:'insert-pause',actorId:'A',edgeId:edge.id,nodeId:`hot-pause-${edge.id}`,title:'ВСТАВИТЬ ПАУЗУ',description:'ПЕРЕД ОТВЕТОМ → ПАУЗА',before:edge.id,after:`hot-pause-${edge.id}`};
  const impulse=impulseNode(actor,visited);
  if(impulse&&Number(impulse.p?.weight||1)>1){const before=Number(impulse.p?.weight||1),after=Math.max(1,before-1);return {kind:'reduce-impulse',actorId:'A',nodeId:impulse.id,amount:1,title:'ОСЛАБИТЬ ИМПУЛЬС',description:`${String(impulse.type).toUpperCase()} W${before} → W${after}`,before,after}}
  return null;
}

export function counterfactualMutationFromRecommendation(rec){if(!rec)return null;if(rec.kind==='reduce-repeat')return {kind:'reduce-repeat',nodeId:rec.nodeId,count:1};if(rec.kind==='insert-pause')return {kind:'insert-pause',edgeId:rec.edgeId,nodeId:rec.nodeId};if(rec.kind==='reduce-impulse')return {kind:'reduce-impulse',nodeId:rec.nodeId,amount:rec.amount||1};return null}
