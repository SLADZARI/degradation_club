export const INTENTS=Object.freeze({
  MAKE_UNDERSTOOD:'MAKE_UNDERSTOOD',
  GET_AGREEMENT:'GET_AGREEMENT',
  DEESCALATE:'DEESCALATE',
  DEFLECT_TENSION:'DEFLECT_TENSION',
  WITHDRAW:'WITHDRAW',
  PRESSURE:'PRESSURE'
});

export function deriveIntent({impulse=null,reaction=null}={}){
  if(reaction==='explain')return impulse==='understand'?INTENTS.DEESCALATE:INTENTS.MAKE_UNDERSTOOD;
  if(reaction==='pressure')return INTENTS.PRESSURE;
  if(reaction==='silent')return INTENTS.WITHDRAW;
  if(reaction==='joke')return INTENTS.DEFLECT_TENSION;
  if(reaction==='agree')return impulse==='beliked'?INTENTS.DEESCALATE:INTENTS.GET_AGREEMENT;
  return null;
}

const EVENT_SPECS=Object.freeze({
  COUNTERPOINT:{type:'COUNTERPOINT',trigger:'pushback',accepted:false},
  ACCEPTANCE:{type:'ACCEPTANCE',trigger:'acceptance',accepted:true},
  DEFLECTION:{type:'DEFLECTION',trigger:'deflection',accepted:false},
  NO_RESPONSE:{type:'NO_RESPONSE',trigger:'ignore',accepted:false},
  PRESSURE:{type:'PRESSURE',trigger:'underpressure',accepted:false},
  PUSHBACK:{type:'PUSHBACK',trigger:'pushback',accepted:false}
});

// Event impacts are intentionally small and deterministic. Reaction/Impulse deltas still
// describe what the actor does; these deltas describe how that action lands on the target.
export const WORLD_EVENT_EFFECTS=Object.freeze({
  ACCEPTANCE:{contact:8,tension:-18,brain:-5,trust:1,resentment:-1},
  COUNTERPOINT:{contact:-6,tension:12,brain:7,resentment:1},
  NO_RESPONSE:{contact:-12,tension:5,brain:4,resentment:1},
  DEFLECTION:{contact:-2,tension:-5},
  PRESSURE:{contact:-10,tension:15,resentment:1},
  PUSHBACK:{contact:-8,tension:18,brain:8,resentment:1}
});

function num(v,d=0){const n=Number(v);return Number.isFinite(n)?n:d}
function mem(state,key){return num(state?.memory?.[key],0)}
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function candidate(type,score,reason){return {...EVENT_SPECS[type],score:Number(score.toFixed(3)),reason}}

export function rankWorldEvents({reaction,intent,actorState={},targetState={}}={}){
  const contact=num(targetState.contact,60),tension=num(targetState.tension,10),brain=num(targetState.brain,15),energy=num(targetState.energy,72);
  const trust=mem(targetState,'trust'),resentment=mem(targetState,'resentment');
  let out=[];
  if(reaction==='explain'){
    out=[
      candidate('COUNTERPOINT',42+tension*.55+resentment*7-trust*4,'explanation meets resistance'),
      candidate('ACCEPTANCE',18+contact*.55+trust*12-tension*.45-resentment*5,'high contact/trust makes acceptance plausible'),
      candidate('NO_RESPONSE',8+(100-contact)*.30+brain*.15,'collapsed contact or overload makes disengagement plausible')
    ];
  }else if(reaction==='agree'){
    out=[
      candidate('ACCEPTANCE',60+contact*.25+trust*8,'explicit agreement strongly supports acceptance'),
      candidate('COUNTERPOINT',12+tension*.22+resentment*5,'residual tension can preserve disagreement')
    ];
  }else if(reaction==='joke'){
    out=[
      candidate('DEFLECTION',55+tension*.15,'joke primarily redirects tension'),
      candidate('ACCEPTANCE',20+contact*.35+trust*5,'warm context can let a joke land as soft acceptance')
    ];
  }else if(reaction==='silent'){
    out=[
      candidate('NO_RESPONSE',70+(100-contact)*.15,'silence primarily produces no response'),
      candidate('ACCEPTANCE',8+trust*3,'high trust can make silence function as enough')
    ];
  }else if(reaction==='pressure'){
    out=[
      candidate('PRESSURE',55+tension*.40+resentment*6,'pressure normally returns pressure'),
      candidate('PUSHBACK',35+tension*.55+resentment*8,'high tension and resentment make pushback plausible'),
      candidate('ACCEPTANCE',5+contact*.18+trust*3,'strong contact can occasionally absorb pressure')
    ];
  }else{
    out=[candidate('NO_RESPONSE',1,'no reaction maps to no response')];
  }

  // Intent biases the same reaction differently without becoming a second graph.
  for(const c of out){
    if(intent===INTENTS.DEESCALATE&&c.type==='ACCEPTANCE')c.score+=18;
    if(intent===INTENTS.DEESCALATE&&c.type==='COUNTERPOINT')c.score-=8;
    if(intent===INTENTS.PRESSURE&&(c.type==='PUSHBACK'||c.type==='PRESSURE'))c.score+=12;
  }
  out.sort((a,b)=>b.score-a.score||a.type.localeCompare(b.type));
  return out;
}

export function selectWorldEvent(ctx={}){
  const ranked=rankWorldEvents(ctx);
  const winner=ranked[0];
  return {
    event:{type:winner.type,trigger:winner.trigger,accepted:winner.accepted},
    decision:{intent:ctx.intent||null,winner:winner.type,candidates:ranked.map(({type,trigger,accepted,score,reason})=>({type,trigger,accepted,score,reason}))}
  };
}

export function applyWorldEventEffects(targetState,eventType){
  if(!targetState)return {metrics:{},memory:{}};
  const spec=WORLD_EVENT_EFFECTS[eventType]||{};
  const metrics={},memory={};
  for(const key of ['brain','energy','tension','contact']){
    if(spec[key]==null)continue;
    const before=num(targetState[key],0);
    const after=clamp(before+num(spec[key]),0,100);
    targetState[key]=after;
    metrics[key]=after-before;
  }
  if(spec.trust!=null||spec.resentment!=null){
    targetState.memory={...(targetState.memory||{})};
    for(const key of ['trust','resentment']){
      if(spec[key]==null)continue;
      const before=num(targetState.memory[key],0);
      const after=clamp(before+num(spec[key]),0,5);
      targetState.memory[key]=after;
      memory[key]=after-before;
    }
  }
  return {metrics,memory};
}
