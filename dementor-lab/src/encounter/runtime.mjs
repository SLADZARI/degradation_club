import { cloneState, applyMetricDelta, applyMemoryNode, NODE_SPECS } from '../core/model.mjs';
import { familyOf, outgoing, validateGraph, canConnectNodes } from '../core/graph.mjs';

const REACTION_EFFECTS = Object.freeze({
  explain:{self:{energy:-4,brain:8,tension:5},target:{tension:4,contact:-5}},
  agree:{self:{energy:-2,brain:-2,tension:-4,contact:4},target:{tension:-3,contact:5}},
  joke:{self:{energy:-3,brain:-1,tension:-5,contact:5},target:{tension:-4,contact:4}},
  silent:{self:{energy:-1,brain:2,tension:2},target:{contact:-3}},
  pressure:{self:{energy:-5,brain:6,tension:8},target:{tension:9,contact:-8}}
});
const IMPULSE_EFFECTS = Object.freeze({
  beright:{self:{brain:2,tension:2},target:{contact:-1}},
  beliked:{self:{contact:2,tension:-1},target:{contact:1}},
  understand:{self:{brain:1,contact:3},target:{tension:-1,contact:2}}
});
function addDelta(dst,src={}){for(const [k,v] of Object.entries(src))dst[k]=(dst[k]||0)+v}
function nodeById(graph,id){return graph.nodes.find(n=>n.id===id)}
function cloneGraph(graph){return {id:graph.id,nodes:graph.nodes.map(n=>({...n,p:{...(n.p||{})},ui:n.ui?{...n.ui}:undefined})),edges:graph.edges.map(e=>({...e}))}}
export function createCharacter({id,name,graph,state,visual={}}){return {id,name,visual,brainGraph:cloneGraph(graph),state:cloneState(state),face:{},discoveries:[],history:[]}}
export function createEncounter({id='encounter-1',scenario,actorA,actorB,mode='auto'}){return {id,scenario:{...scenario},mode,actors:{A:actorA,B:actorB},activeActor:'A',turn:0,status:'INTRO',transcript:[],traces:[],patches:[],result:null,hotPatchUsed:false}}

function enumeratePaths(graph,startId,maxDepth=18){
  const out=[];
  function walk(id,path,visits){
    if(path.length>=maxDepth){out.push(path);return}
    const n=nodeById(graph,id);if(!n){out.push(path);return}
    // STOP is executable control: nothing downstream may run in this path.
    if(n.type==='stop'){out.push([...path,n]);return}
    const next=outgoing(graph,id);if(!next.length){out.push([...path,n]);return}
    const count=visits.get(id)||0;if(count>=3){out.push([...path,n]);return}
    const v=new Map(visits);v.set(id,count+1);next.forEach(e=>walk(e.to,[...path,n],v));
  }
  walk(startId,[],new Map());return out;
}
function conditionAllows(character,path){
  return path.every(n=>n.type!=='ifbrain'||Number(character.state.brain)>Number(n.p?.threshold??70));
}
function selectPath(character,trigger){
  const graph=character.brainGraph,validation=validateGraph(graph);if(!validation.runnable)throw new Error(validation.detail);
  // A situation fires a concrete trigger. Another trigger must never silently substitute for it.
  const roots=graph.nodes.filter(n=>familyOf(n)==='TRIGGER'&&n.type===trigger);
  if(!roots.length)return null;
  const scored=roots.flatMap(n=>enumeratePaths(graph,n.id)).filter(path=>conditionAllows(character,path)).map(path=>{
    let score=0,reaction=null,impulse=null,repeat=1;
    for(const n of path){const fam=familyOf(n);if(fam==='STATE')score+=Number(character.state.memory?.[n.p?.key||n.type]||0)*1.35;if(fam==='IMPULSE'){const w=n.p?.weight||1;score+=w*6;if(!impulse)impulse=n.type}if(fam==='REACTION'&&!reaction){reaction=n.type;score+=8}if(n.type==='repeat')repeat=Math.max(repeat,n.p?.count||1);if(n.type==='pause')score+=character.state.tension>=55?6:1}score+=repeat>1?repeat*2:0;return {path,score,reaction,impulse,repeat};
  }).filter(x=>x.reaction);
  scored.sort((a,b)=>b.score-a.score||a.path.map(n=>n.id).join('|').localeCompare(b.path.map(n=>n.id).join('|')));return scored[0]||null;
}

export function predictTurn(encounter,{trigger=null}={}){
  const side=encounter.activeActor,targetSide=side==='A'?'B':'A',actor=encounter.actors[side],target=encounter.actors[targetSide];
  const emittedTrigger=trigger||encounter.scenario.openingTrigger||'criticism',chosen=selectPath(actor,emittedTrigger);if(!chosen)throw new Error(`No executable reaction for ${side} on trigger ${emittedTrigger}`);
  const selfDelta={},targetDelta={};addDelta(selfDelta,REACTION_EFFECTS[chosen.reaction]?.self);addDelta(targetDelta,REACTION_EFFECTS[chosen.reaction]?.target);addDelta(selfDelta,IMPULSE_EFFECTS[chosen.impulse]?.self);addDelta(targetDelta,IMPULSE_EFFECTS[chosen.impulse]?.target);
  for(const n of chosen.path.filter(n=>familyOf(n)==='STATE')){const sem=n.type==='resentment'?{self:{tension:.8,brain:.25},target:{contact:-.4}}:n.type==='trust'?{self:{contact:.8,brain:-.2},target:{contact:.5}}:null;if(sem){addDelta(selfDelta,sem.self);addDelta(targetDelta,sem.target)}}
  if(chosen.repeat>1){addDelta(selfDelta,{energy:-(chosen.repeat-1)*2,brain:(chosen.repeat-1)*5,tension:(chosen.repeat-1)*2});addDelta(targetDelta,{contact:-(chosen.repeat-1)*2,tension:(chosen.repeat-1)*2})}
  if(chosen.path.some(n=>n.type==='pause')){addDelta(selfDelta,{brain:-5,tension:-7,energy:-1});addDelta(targetDelta,{tension:-3,contact:3})}
  const predictedSelf=applyMetricDelta(cloneState(actor.state),selfDelta),predictedTarget=applyMetricDelta(cloneState(target.state),targetDelta);
  return {side,targetSide,actor,target,emittedTrigger,chosen,selfDelta,targetDelta,predictedSelf,predictedTarget};
}
export function detectBreakpoint(encounter,prediction){
  if(prediction.predictedSelf.brain>=88&&prediction.chosen.repeat>1)return {type:'BRAIN_LOOP',actorId:prediction.side,nodeIds:prediction.chosen.path.map(n=>n.id),predictedBrain:prediction.predictedSelf.brain};
  if(prediction.predictedSelf.contact<=8)return {type:'CONTACT_RISK',actorId:prediction.side,nodeIds:prediction.chosen.path.map(n=>n.id),predictedContact:prediction.predictedSelf.contact};
  return null;
}
export function executeActorTurn(encounter,{trigger=null}={}){
  if(encounter.result)return {terminal:true,result:encounter.result};
  const p=predictTurn(encounter,{trigger});
  const breakpoint=!encounter.hotPatchUsed?detectBreakpoint(encounter,p):null;
  if(breakpoint){encounter.status='HOT_PATCH';encounter.pendingTurn={trigger:p.emittedTrigger,breakpoint};return {breakpoint,terminal:false,pending:true}}
  const {side,targetSide,actor,target,emittedTrigger,chosen,selfDelta,targetDelta}=p;
  const beforeSelf=cloneState(actor.state),beforeTarget=cloneState(target.state),memoryChanges=[];
  for(const n of chosen.path.filter(n=>familyOf(n)==='STATE')){const change=applyMemoryNode(n,actor.state);memoryChanges.push(change)}
  applyMetricDelta(actor.state,selfDelta);applyMetricDelta(target.state,targetDelta);encounter.turn+=1;
  const trace={turn:encounter.turn,actorId:side,trigger:emittedTrigger,visitedNodes:chosen.path.map(n=>n.id),selectedImpulse:chosen.impulse,selectedReaction:chosen.reaction,metricDeltas:{self:selfDelta,target:targetDelta},memoryChanges,loops:Math.max(0,chosen.repeat-1),breakpoint:null,before:{self:beforeSelf,target:beforeTarget},after:{self:cloneState(actor.state),target:cloneState(target.state)}};
  encounter.traces.push(trace);encounter.transcript.push({turn:encounter.turn,actorId:side,reaction:chosen.reaction,impulse:chosen.impulse});encounter.pendingTurn=null;
  const terminal=checkTerminal(encounter);if(terminal){encounter.status='RESULT';encounter.result=terminal;return {trace,terminal:true,result:terminal}}
  encounter.activeActor=targetSide;encounter.status='NEXT_TURN';return {trace,terminal:false};
}
export function checkTerminal(encounter){
  for(const [side,a] of Object.entries(encounter.actors)){if(a.state.brain>=100)return {type:'BREAKDOWN',reason:'BRAIN',loser:side,turn:encounter.turn};if(a.state.energy<=0)return {type:'BREAKDOWN',reason:'ENERGY',loser:side,turn:encounter.turn};if(a.state.contact<=0&&encounter.scenario.objective==='contact')return {type:'BREAKDOWN',reason:'CONTACT',loser:side,turn:encounter.turn}}
  const limit=encounter.scenario.turnLimit||20;if(encounter.turn>=limit)return {type:'TURN_LIMIT',reason:'LIMIT',turn:encounter.turn};return null;
}
export function applyHotPatch(encounter,patch){
  if(encounter.status!=='HOT_PATCH')throw new Error('Encounter is not waiting for HOT PATCH');if(encounter.hotPatchUsed)throw new Error('HOT PATCH already used');
  const side=patch.actorId||encounter.activeActor,graph=encounter.actors[side].brainGraph;let before=null,after=null;
  if(patch.kind==='reduce-repeat'){const n=nodeById(graph,patch.nodeId);if(!n||n.type!=='repeat')throw new Error('repeat node required');before=n.p.count||1;n.p.count=Math.max(1,before-(patch.amount||1));after=n.p.count}
  else if(patch.kind==='reduce-impulse'){const n=nodeById(graph,patch.nodeId);if(!n||familyOf(n)!=='IMPULSE')throw new Error('impulse node required');before=n.p.weight||1;n.p.weight=Math.max(1,before-(patch.amount||1));after=n.p.weight}
  else if(patch.kind==='insert-pause'){
    const edge=graph.edges.find(e=>e.id===patch.edgeId);if(!edge)throw new Error('edge required');
    const id=patch.nodeId||`pause-${encounter.turn}`;if(nodeById(graph,id))throw new Error('pause node id already exists');
    graph.nodes.push({id,type:'pause',p:{...NODE_SPECS.pause.defaults}});graph.edges=graph.edges.filter(e=>e!==edge);graph.edges.push({id:`${edge.id}-a`,from:edge.from,to:id},{id:`${edge.id}-b`,from:id,to:edge.to});
    const valid=validateGraph(graph);if(!valid.runnable){graph.nodes=graph.nodes.filter(n=>n.id!==id);graph.edges=graph.edges.filter(e=>e.id!==`${edge.id}-a`&&e.id!==`${edge.id}-b`);graph.edges.push(edge);throw new Error(`pause patch invalid: ${valid.code}`)}
    before=edge.id;after=id
  }
  else if(patch.kind==='rewire'){
    const edge=graph.edges.find(e=>e.id===patch.edgeId);if(!edge)throw new Error('edge required');
    const from=nodeById(graph,edge.from),to=nodeById(graph,patch.toNodeId);if(!from||!to)throw new Error('rewire target required');
    const graphWithoutEdge={...graph,edges:graph.edges.filter(e=>e!==edge)};if(!canConnectNodes(graphWithoutEdge,from,to))throw new Error('incompatible rewire target');
    before=edge.to;edge.to=to.id;const valid=validateGraph(graph);if(!valid.runnable){edge.to=before;throw new Error(`rewire would break graph: ${valid.code}`)}after=edge.to
  }
  else throw new Error('Unsupported patch');
  encounter.hotPatchUsed=true;encounter.patches.push({turn:encounter.turn,actorId:side,kind:patch.kind,nodeId:patch.nodeId||null,before,after});encounter.status='NEXT_TURN';encounter.pendingTurn=null;return {before,after};
}
export function declineHotPatch(encounter){if(encounter.status!=='HOT_PATCH')throw new Error('Encounter is not waiting for HOT PATCH');encounter.hotPatchUsed=true;encounter.patches.push({turn:encounter.turn,actorId:encounter.activeActor,kind:'none',before:null,after:null});encounter.status='NEXT_TURN';encounter.pendingTurn=null}
