export const NODE_SPECS = Object.freeze({
  criticism:{family:'TRIGGER',title:'КРИТИКА',description:'срабатывает, когда идею критикуют',defaults:{}},
  ignore:{family:'TRIGGER',title:'ИГНОР',description:'срабатывает, когда персонажу не ответили',defaults:{}},
  pushback:{family:'TRIGGER',title:'ВОЗРАЖЕНИЕ',description:'срабатывает, когда собеседник отвечает своей версией',defaults:{}},
  acceptance:{family:'TRIGGER',title:'ПРИНЯТО',description:'срабатывает, когда собеседник явно согласился',defaults:{}},
  deflection:{family:'TRIGGER',title:'УШЛИ В СТОРОНУ',description:'срабатывает, когда ответ уводит разговор в шутку или сторону',defaults:{}},
  pressure:{family:'TRIGGER',title:'ДАВЛЕНИЕ',description:'срабатывает, когда собеседник требует ответа или давит',defaults:{}},
  beright:{family:'IMPULSE',title:'БЫТЬ ПРАВЫМ',description:'усиливает эту ветку; добавляет BRAIN и TENSION',defaults:{weight:3}},
  beliked:{family:'IMPULSE',title:'НРАВИТЬСЯ',description:'усиливает эту ветку; поддерживает CONTACT',defaults:{weight:2}},
  understand:{family:'IMPULSE',title:'ПОНЯТЬ',description:'усиливает эту ветку; поддерживает CONTACT и немного нагружает BRAIN',defaults:{weight:2}},
  resentment:{family:'STATE',title:'ОБИДА',description:'записывает обиду в память; повышает TENSION и BRAIN',defaults:{key:'resentment',delta:1,cap:5}},
  trust:{family:'STATE',title:'ДОВЕРИЕ',description:'записывает доверие в память; поддерживает CONTACT и снижает BRAIN',defaults:{key:'trust',delta:1,cap:5}},
  explain:{family:'REACTION',title:'ОБЪЯСНИТЬ',description:'объясняет; тратит ENERGY, повышает BRAIN/TENSION и снижает CONTACT',defaults:{}},
  agree:{family:'REACTION',title:'СОГЛАСИТЬСЯ',description:'соглашается; снижает TENSION и повышает CONTACT',defaults:{}},
  joke:{family:'REACTION',title:'ПОШУТИТЬ',description:'шутит; снижает TENSION и поддерживает CONTACT',defaults:{}},
  silent:{family:'REACTION',title:'ПРОМОЛЧАТЬ',description:'молчит; немного повышает TENSION и снижает CONTACT',defaults:{}},
  pressure:{family:'REACTION',title:'ДАВИТЬ',description:'давит; сильно повышает TENSION и снижает CONTACT',defaults:{}},
  repeat:{family:'CONTROL',title:'REPEAT',description:'повторяет реакцию до лимита, пока собеседник явно не принял ответ',defaults:{count:2}},
  stop:{family:'CONTROL',title:'STOP',description:'останавливает дальнейший проход по этой ветке',defaults:{}},
  ifbrain:{family:'CONTROL',title:'BRAIN >',description:'пропускает ветку только когда BRAIN выше порога',defaults:{threshold:70}},
  pause:{family:'ABILITY',title:'ПАУЗА',description:'снижает BRAIN и TENSION, поддерживает CONTACT',defaults:{}},
  interrupt:{family:'ABILITY',title:'ПЕРЕХВАТ',description:'семантика для vertical slice ещё не утверждена',defaults:{},availableInSlice:false}
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
