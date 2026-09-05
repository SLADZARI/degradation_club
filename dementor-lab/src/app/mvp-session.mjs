import { VerticalSliceController } from './vertical-slice-controller.mjs';
import { createCriticismActors, scenarioWithObjective } from '../scenarios/criticism-idea.mjs';
import { compareRuns, buildResult } from '../encounter/result.mjs';
import { encounterToRunRecord, saveRunRecord } from '../archive/run-store.mjs';

function clone(value){return JSON.parse(JSON.stringify(value))}
function repeatNode(actor){return actor.brainGraph.nodes.find(n=>n.type==='repeat')||null}
function impulseNode(actor){return actor.brainGraph.nodes.find(n=>['beright','beliked','understand','beunderstood'].includes(n.type))||null}

export function createMvpSession({playerName='Гена',playerPresetId='EXPLAIN_LOOP',objective='contact',opponentProfile=null,onEvent=()=>{}}={}){
  const config={playerName,playerPresetId,objective,opponentProfile};
  const scenario=scenarioWithObjective(objective);
  const actors=createCriticismActors({playerName,playerPresetId,opponentProfile});
  const controller=new VerticalSliceController({scenario,actors,onEvent});
  controller.start({mode:'step'});
  return {config,controller,scenario,actors};
}

export function advanceUntilPause(session,{maxTurns=100,declineHotPatch=false}={}){
  let safety=0,last=null;
  while(!session.controller.encounter.result&&safety++<maxTurns){
    if(session.controller.encounter.status==='HOT_PATCH'){
      if(!declineHotPatch)return {status:'HOT_PATCH',encounter:session.controller.encounter,last};
      session.controller.declinePatch();
    }
    last=session.controller.next();
    if(last?.breakpoint&&!declineHotPatch)return {status:'HOT_PATCH',encounter:session.controller.encounter,last};
  }
  if(safety>=maxTurns&&!session.controller.encounter.result)throw new Error('Encounter safety limit reached');
  return {status:'RESULT',encounter:session.controller.encounter,last,result:buildResult(session.controller.encounter)};
}

function applyMutation(actor,mutation){
  if(!mutation)return null;
  if(mutation.kind==='reduce-repeat'){
    const n=mutation.nodeId?actor.brainGraph.nodes.find(x=>x.id===mutation.nodeId):repeatNode(actor);
    if(!n||n.type!=='repeat')throw new Error('repeat node required for counterfactual');
    const before=Number(n.p?.count||1);n.p.count=Math.max(1,Number(mutation.count||1));return {kind:mutation.kind,nodeId:n.id,before,after:n.p.count};
  }
  if(mutation.kind==='reduce-impulse'){
    const n=mutation.nodeId?actor.brainGraph.nodes.find(x=>x.id===mutation.nodeId):impulseNode(actor);
    if(!n)throw new Error('impulse node required for counterfactual');
    const before=Number(n.p?.weight||1);n.p.weight=Math.max(1,before-Number(mutation.amount||1));return {kind:mutation.kind,nodeId:n.id,before,after:n.p.weight};
  }
  throw new Error(`Unsupported counterfactual mutation: ${mutation.kind}`);
}

export function counterfactualRerun(beforeSession,mutation,{maxTurns=100}={}){
  const rerun=createMvpSession({...beforeSession.config,onEvent:()=>{}});
  const applied=applyMutation(rerun.actors.A,mutation);
  const after=advanceUntilPause(rerun,{maxTurns,declineHotPatch:true});
  if(after.status!=='RESULT')throw new Error('Counterfactual did not reach result');
  const comparison=compareRuns(beforeSession.controller.encounter,rerun.controller.encounter);
  return {session:rerun,applied,comparison,before:buildResult(beforeSession.controller.encounter),after:buildResult(rerun.controller.encounter)};
}

export function saveSessionToArchive(session,{rerun=null,storage=globalThis.localStorage}={}){
  const record=encounterToRunRecord(session.controller.encounter,{rerun:rerun?clone(rerun):null});
  return saveRunRecord(record,storage);
}
