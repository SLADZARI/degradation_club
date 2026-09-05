const IMPULSE_TYPES=new Set(['beright','beliked','understand','beunderstood']);

function node(actor,id){return actor?.brainGraph?.nodes?.find(n=>n.id===id)||null}
function repeatNode(actor){return actor?.brainGraph?.nodes?.find(n=>n.type==='repeat')||null}
function impulseNode(actor,visited=[]){
  const fromTrace=visited.map(id=>node(actor,id)).find(n=>IMPULSE_TYPES.has(n?.type));
  return fromTrace||actor?.brainGraph?.nodes?.find(n=>IMPULSE_TYPES.has(n.type))||null;
}

export function recommendOneCausePatch(encounter,breakpoint=null){
  const actor=encounter?.actors?.A;if(!actor)return null;
  const visited=breakpoint?.nodeIds||encounter?.traces?.at(-1)?.visitedNodes||[];
  const repeat=visited.map(id=>node(actor,id)).find(n=>n?.type==='repeat')||repeatNode(actor);
  if(repeat&&Number(repeat.p?.count||1)>1){
    return {
      kind:'reduce-repeat',actorId:'A',nodeId:repeat.id,
      title:'УМЕНЬШИТЬ ПОВТОР',
      description:`REPEAT ×${Number(repeat.p?.count||1)} → ×1`,
      before:Number(repeat.p?.count||1),after:1
    };
  }
  const impulse=impulseNode(actor,visited);
  if(impulse&&Number(impulse.p?.weight||1)>1){
    const before=Number(impulse.p?.weight||1),after=Math.max(1,before-1);
    return {
      kind:'reduce-impulse',actorId:'A',nodeId:impulse.id,amount:1,
      title:'ОСЛАБИТЬ ИМПУЛЬС',
      description:`${String(impulse.type).toUpperCase()} W${before} → W${after}`,
      before,after
    };
  }
  return null;
}

export function counterfactualMutationFromRecommendation(rec){
  if(!rec)return null;
  if(rec.kind==='reduce-repeat')return {kind:'reduce-repeat',nodeId:rec.nodeId,count:1};
  if(rec.kind==='reduce-impulse')return {kind:'reduce-impulse',nodeId:rec.nodeId,amount:rec.amount||1};
  return null;
}
