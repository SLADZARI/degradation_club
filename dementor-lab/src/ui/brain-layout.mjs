export function graphLayers(graph={}){
  const nodes=graph.nodes||[],edges=graph.edges||[];
  const byId=new Map(nodes.map(node=>[node.id,node]));
  const indegree=new Map(nodes.map(node=>[node.id,0]));
  const outgoing=new Map(nodes.map(node=>[node.id,[]]));
  for(const edge of edges){
    if(!byId.has(edge.from)||!byId.has(edge.to))continue;
    indegree.set(edge.to,(indegree.get(edge.to)||0)+1);
    outgoing.get(edge.from)?.push(edge.to);
  }
  const roots=nodes.filter(node=>(indegree.get(node.id)||0)===0).map(node=>node.id);
  const queue=[...(roots.length?roots:nodes.slice(0,1).map(node=>node.id))];
  const depth=new Map(queue.map(id=>[id,0]));
  const seen=new Set();
  while(queue.length){
    const id=queue.shift();
    if(seen.has(id))continue;
    seen.add(id);
    const nextDepth=(depth.get(id)||0)+1;
    for(const to of outgoing.get(id)||[]){
      depth.set(to,Math.max(depth.get(to)||0,nextDepth));
      indegree.set(to,(indegree.get(to)||1)-1);
      if((indegree.get(to)||0)<=0)queue.push(to);
    }
  }
  let fallbackDepth=Math.max(-1,...depth.values());
  for(const node of nodes){if(!depth.has(node.id))depth.set(node.id,++fallbackDepth)}
  const layers=[];
  for(const node of nodes){
    const d=depth.get(node.id)||0;
    (layers[d]??=[]).push(node);
  }
  return layers.filter(Boolean);
}

export function graphEdgeIds(graph={}){
  const ids=new Set((graph.nodes||[]).map(node=>node.id));
  return (graph.edges||[]).filter(edge=>ids.has(edge.from)&&ids.has(edge.to));
}
