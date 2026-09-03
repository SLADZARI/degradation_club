import { NODE_SPECS } from '../core/model.mjs';
import { canConnectNodes, validateGraph, familyOf } from '../core/graph.mjs';
import { graphLayers } from './brain-layout.mjs';

let serial=0;
const copyDefaults=type=>({...((NODE_SPECS[type]?.defaults)||{})});
export const BRAIN_FAMILY_ORDER=Object.freeze(['TRIGGER','STATE','IMPULSE','REACTION','CONTROL','ABILITY']);

export function ensureBrainPositions(graph,{canvasWidth=680,nodeWidth=250,rowGap=145}={}){
  const layers=graphLayers(graph);
  for(let depth=0;depth<layers.length;depth++){
    const layer=layers[depth],laneWidth=canvasWidth/Math.max(1,layer.length);
    layer.forEach((node,index)=>{
      node.ui=node.ui||{};
      if(!Number.isFinite(node.ui.x))node.ui.x=Math.round(laneWidth*index+(laneWidth-nodeWidth)/2);
      if(!Number.isFinite(node.ui.y))node.ui.y=30+depth*rowGap;
    });
  }
  return graph;
}

export function addBrainNode(graph,type,{x=210,y=null}={}){
  if(!NODE_SPECS[type])throw new Error(`Unknown node type ${type}`);
  const id=`brain-${type}-${Date.now().toString(36)}-${++serial}`;
  const maxY=Math.max(0,...graph.nodes.map(n=>Number(n.ui?.y)||0));
  const node={id,type,p:copyDefaults(type),ui:{x,y:Number.isFinite(y)?y:maxY+145}};
  graph.nodes.push(node);return node;
}

export function removeBrainNode(graph,nodeId){
  graph.nodes=graph.nodes.filter(n=>n.id!==nodeId);
  graph.edges=graph.edges.filter(e=>e.from!==nodeId&&e.to!==nodeId);
}

export function moveBrainNode(graph,nodeId,x,y,{minX=8,minY=8,maxX=430,maxY=2000}={}){
  const node=graph.nodes.find(n=>n.id===nodeId);if(!node)return null;
  node.ui=node.ui||{};node.ui.x=Math.max(minX,Math.min(maxX,x));node.ui.y=Math.max(minY,Math.min(maxY,y));return node;
}

export function connectBrainNodes(graph,fromId,toId){
  const from=graph.nodes.find(n=>n.id===fromId),to=graph.nodes.find(n=>n.id===toId);
  if(!canConnectNodes(graph,from,to))return null;
  const edge={id:`brain-edge-${Date.now().toString(36)}-${++serial}`,from:fromId,to:toId};graph.edges.push(edge);
  if(familyOf(from)==='TRIGGER'){from.p=from.p||{};from.p.enabled=true}
  return edge;
}

export function disconnectBrainEdge(graph,edgeId){graph.edges=graph.edges.filter(e=>e.id!==edgeId)}
export function compatibleBrainTargets(graph,fromId){const from=graph.nodes.find(n=>n.id===fromId);return graph.nodes.filter(n=>canConnectNodes(graph,from,n)).map(n=>n.id)}
export function brainValidation(graph,triggerType=null){
  const base=validateGraph(graph);if(!base.runnable||!triggerType)return base;
  const trigger=graph.nodes.find(n=>familyOf(n)==='TRIGGER'&&n.type===triggerType);
  if(!trigger)return {runnable:false,code:'TRIGGER_MISMATCH',detail:`В ЭТОЙ СИТУАЦИИ НЕТ ТРИГГЕРА «${NODE_SPECS[triggerType]?.title||triggerType}».`};
  if(trigger.p?.enabled===false)return {runnable:false,code:'TRIGGER_DISABLED',nodeId:trigger.id,detail:`ВХОД «${NODE_SPECS[triggerType]?.title||triggerType}» ПОКА НЕ ПОДКЛЮЧЕН.`};
  return base;
}
export function familyNodes(family){return Object.entries(NODE_SPECS).filter(([,spec])=>spec.family===family).map(([type,spec])=>({type,...spec}))}
