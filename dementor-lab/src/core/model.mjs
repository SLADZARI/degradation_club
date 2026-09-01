export const NODE_SPECS = Object.freeze({
  criticism:{family:'TRIGGER',title:'КРИТИКА',defaults:{}},
  ignore:{family:'TRIGGER',title:'ИГНОР',defaults:{}},
  beright:{family:'IMPULSE',title:'БЫТЬ ПРАВЫМ',defaults:{weight:3}},
  beliked:{family:'IMPULSE',title:'НРАВИТЬСЯ',defaults:{weight:2}},
  understand:{family:'IMPULSE',title:'ПОНЯТЬ',defaults:{weight:2}},
  resentment:{family:'STATE',title:'ОБИДА',defaults:{key:'resentment',delta:1,cap:5}},
  trust:{family:'STATE',title:'ДОВЕРИЕ',defaults:{key:'trust',delta:1,cap:5}},
  explain:{family:'REACTION',title:'ОБЪЯСНИТЬ',defaults:{}},
  agree:{family:'REACTION',title:'СОГЛАСИТЬСЯ',defaults:{}},
  joke:{family:'REACTION',title:'ПОШУТИТЬ',defaults:{}},
  silent:{family:'REACTION',title:'ПРОМОЛЧАТЬ',defaults:{}},
  pressure:{family:'REACTION',title:'ДАВИТЬ',defaults:{}},
  repeat:{family:'CONTROL',title:'REPEAT',defaults:{count:2}},
  stop:{family:'CONTROL',title:'STOP',defaults:{}},
  ifbrain:{family:'CONTROL',title:'BRAIN >',defaults:{threshold:70}},
  pause:{family:'ABILITY',title:'ПАУЗА',defaults:{}},
  interrupt:{family:'ABILITY',title:'ПЕРЕХВАТ',defaults:{}}
});

export const DEFAULT_STATE = Object.freeze({
  energy:72, brain:15, tension:10, contact:60, memory:{}
});

export function cloneState(s=DEFAULT_STATE){
  return {
    energy:Number(s.energy ?? 72),
    brain:Number(s.brain ?? 15),
    tension:Number(s.tension ?? 10),
    contact:Number(s.contact ?? 60),
    memory:{...(s.memory||{})}
  };
}

export function clamp(v,min=0,max=100){return Math.max(min,Math.min(max,v))}
export function applyMetricDelta(state,delta={}){
  state.energy=clamp(state.energy+(delta.energy||0));
  state.brain=clamp(state.brain+(delta.brain||0));
  state.tension=clamp(state.tension+(delta.tension||0));
  state.contact=clamp(state.contact+(delta.contact||0));
  return state;
}

export const MEMORY_SEMANTICS=Object.freeze({
  resentment:{self:{tension:.8,brain:.25},target:{contact:-.4}},
  trust:{self:{contact:.8,brain:-.2},target:{contact:.5}}
});

export function applyMemoryNode(node,state){
  const key=node?.p?.key||node?.type;
  const delta=Number(node?.p?.delta??1);
  const cap=Number(node?.p?.cap??5);
  state.memory=state.memory||{};
  const before=Number(state.memory[key]||0);
  const after=Math.max(0,Math.min(cap,before+delta));
  state.memory[key]=after;
  return {key,before,after,semantics:MEMORY_SEMANTICS[node.type]||null};
}
