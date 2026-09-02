import { createEncounter, executeActorTurn, applyHotPatch, declineHotPatch } from '../encounter/runtime.mjs';
import { resolvePhrase } from '../dialogue/phrase-bank.mjs';
import { buildResult } from '../encounter/result.mjs';

export class VerticalSliceController{
  constructor({scenario,actors,renderers={},onEvent=()=>{}}){
    this.scenario=scenario;this.actors=actors;this.renderers=renderers;this.onEvent=onEvent;this.encounter=null;
  }
  start({mode='auto'}={}){
    this.encounter=createEncounter({scenario:this.scenario,actorA:this.actors.A,actorB:this.actors.B,mode});
    this.encounter.status='NEXT_TURN';this.render();this.onEvent({type:'START',encounter:this.encounter});return this.encounter;
  }
  next(){
    if(!this.encounter)throw new Error('start() required');
    if(this.encounter.status==='HOT_PATCH')return {breakpoint:this.encounter.pendingTurn?.breakpoint,pending:true};
    const out=executeActorTurn(this.encounter);
    if(out.trace){
      const actor=this.encounter.actors[out.trace.actorId];
      const recentTranscript=this.encounter.transcript.slice(0,-1).slice(-3);
      const phrase=resolvePhrase({
        reaction:out.trace.selectedReaction,
        impulse:out.trace.selectedImpulse,
        scenario:this.encounter.scenario,
        state:actor.state,
        memory:actor.state.memory,
        recentTranscript,
        turn:out.trace.turn
      });
      this.encounter.transcript[this.encounter.transcript.length-1].phrase=phrase;
      this.onEvent({type:'TURN',trace:out.trace,phrase,encounter:this.encounter});
    }
    if(out.breakpoint)this.onEvent({type:'HOT_PATCH',breakpoint:out.breakpoint,encounter:this.encounter});
    if(out.result)this.onEvent({type:'RESULT',result:buildResult(this.encounter),encounter:this.encounter});
    this.render();return out;
  }
  patch(patch){const change=applyHotPatch(this.encounter,patch);this.onEvent({type:'PATCH',patch,change,encounter:this.encounter});this.render();return change}
  declinePatch(){declineHotPatch(this.encounter);this.onEvent({type:'PATCH_DECLINED',encounter:this.encounter});this.render()}
  render(){
    if(!this.encounter)return;
    const terminal=this.encounter.result;
    for(const side of ['A','B']){
      const renderer=this.renderers[side],actor=this.encounter.actors[side];
      if(terminal?.type==='BREAKDOWN'&&terminal.loser===side)renderer?.breakdown?.(actor,terminal.reason);
      else renderer?.render?.(actor);
    }
  }
  result(){return buildResult(this.encounter)}
}
