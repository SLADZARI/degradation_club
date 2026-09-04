export const INTENTS=Object.freeze({
  MAKE_UNDERSTOOD:'MAKE_UNDERSTOOD',
  GET_AGREEMENT:'GET_AGREEMENT',
  DEESCALATE:'DEESCALATE',
  DEFLECT_TENSION:'DEFLECT_TENSION',
  WITHDRAW:'WITHDRAW',
  PRESSURE:'PRESSURE'
});

export function deriveIntent({impulse=null,reaction=null}={}){
  if(reaction==='explain')return INTENTS.MAKE_UNDERSTOOD;
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
  PRESSURE:{type:'PRESSURE',trigger:'underpressure',accepted:false}
});

function num(v,d=0){const n=Number(v);return Number.isFinite(n)?n:d}
function mem(state,key){return num(state?.memory?.[key],0)}
function candidate(type,score,reason){return {...EVENT_SPECS[type],score:Number(score.toFixed(3)),reason}}

export function rankWorldEvents({reaction,intent,actorState={},targetState={}}={}){
  const contact=num(targetState.contact,60),tension=num(targetState.tension,10),brain=num(targetState.brain,15),energy=num(targetState.energy,72);
  const trust=mem(targetState,'trust'),resentment=mem(targetState,'resentment');
  let out=[];
  if(reaction==='explain'){
    out=[
      candidate('COUNTERPOINT',60+tension*.4+resentment*4,'explanation meets resistance'),
      candidate('ACCEPTANCE',30+contact*.35+trust*6-tension*.25,'high contact/trust makes acceptance plausible'),
      candidate('NO_RESPONSE',8+Math.max(0,32-contact)*1.8+Math.max(0,brain-82)*.8,'low contact or overload makes disengagement plausible')
    ];
  }else if(reaction==='agree'){
    out=[
      candidate('ACCEPTANCE',78+contact*.15+trust*3,'explicit agreement is the strongest acceptance signal'),
      candidate('DEFLECTION',18+Math.max(0,tension-70)*.7,'very high tension can turn agreement into topic escape')
    ];
  }else if(reaction==='joke'){
    out=[
      candidate('DEFLECTION',68+Math.max(0,tension-35)*.35,'joke primarily redirects tension'),
      candidate('ACCEPTANCE',20+contact*.25+trust*4-Math.max(0,tension-55)*.25,'warm context can let a joke land as soft acceptance')
    ];
  }else if(reaction==='silent'){
    out=[
      candidate('NO_RESPONSE',72+Math.max(0,55-energy)*.25,'silence primarily produces no response'),
      candidate('DEFLECTION',12+Math.max(0,contact-75)*.2,'high-contact silence may function as a soft topic drop')
    ];
  }else if(reaction==='pressure'){
    out=[
      candidate('PRESSURE',74+tension*.2+resentment*3,'pressure normally returns pressure'),
      candidate('NO_RESPONSE',16+Math.max(0,30-contact)*1.4+Math.max(0,brain-80)*.8,'collapsed contact or overload can produce shutdown')
    ];
  }else{
    out=[candidate('NO_RESPONSE',1,'no reaction maps to no response')];
  }
  // Intent only biases close calls; reaction remains the primary causal signal.
  for(const c of out){
    if(intent===INTENTS.DEESCALATE&&c.type==='ACCEPTANCE')c.score+=8;
    if(intent===INTENTS.MAKE_UNDERSTOOD&&c.type==='COUNTERPOINT')c.score+=4;
    if(intent===INTENTS.WITHDRAW&&c.type==='NO_RESPONSE')c.score+=5;
    if(intent===INTENTS.PRESSURE&&c.type==='PRESSURE')c.score+=5;
  }
  out.sort((a,b)=>b.score-a.score||a.type.localeCompare(b.type));
  return out;
}

export function selectWorldEvent(ctx={}){
  const ranked=rankWorldEvents(ctx);
  const winner=ranked[0];
  return {event:{type:winner.type,trigger:winner.trigger,accepted:winner.accepted},decision:{intent:ctx.intent||null,winner:winner.type,candidates:ranked.map(({type,trigger,accepted,score,reason})=>({type,trigger,accepted,score,reason}))}};
}
