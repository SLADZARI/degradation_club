export const NODE_SPECS = Object.freeze({
  criticism:{family:'TRIGGER',title:'КРИТИКА',description:'срабатывает, когда идею критикуют',defaults:{}},
  ignore:{family:'TRIGGER',title:'ИГНОР',description:'срабатывает, когда персонажу не ответили',defaults:{}},
  pushback:{family:'TRIGGER',title:'ВОЗРАЖЕНИЕ',description:'срабатывает, когда собеседник отвечает своей версией',defaults:{}},
  acceptance:{family:'TRIGGER',title:'ПРИНЯТО',description:'срабатывает, когда собеседник явно согласился',defaults:{}},
  deflection:{family:'TRIGGER',title:'УШЛИ В СТОРОНУ',description:'срабатывает, когда ответ уводит разговор в шутку или сторону',defaults:{}},
  underpressure:{family:'TRIGGER',title:'ДАВЛЕНИЕ',description:'срабатывает, когда собеседник требует ответа или давит',defaults:{}},
  beright:{family:'IMPULSE',title:'БЫТЬ ПРАВЫМ',description:'сильнее тянет к этой ветке; разгоняет BRAIN/TENSION и ухудшает CONTACT',defaults:{weight:3}},
  beliked:{family:'IMPULSE',title:'НРАВИТЬСЯ',description:'сильнее тянет к этой ветке; успокаивает себя и мягко поддерживает CONTACT без BRAIN-цены',defaults:{weight:2}},
  understand:{family:'IMPULSE',title:'ПОНЯТЬ',description:'сильнее тянет к этой ветке; лучше поддерживает контакт с другим, но заметнее нагружает BRAIN',defaults:{weight:2}},
  resentment:{family:'STATE',title:'ОБИДА',description:'запоминает обиду; она тянет к этой ветке и постепенно вытесняет доверие',defaults:{key:'resentment',delta:1,cap:5}},
  trust:{family:'STATE',title:'ДОВЕРИЕ',description:'запоминает доверие; оно тянет к этой ветке и постепенно размывает обиду',defaults:{key:'trust',delta:1,cap:5}},
  explain:{family:'REACTION',title:'ОБЪЯСНИТЬ',description:'нагружает аргументами обоих; повышает BRAIN и немного портит CONTACT',defaults:{}},
  agree:{family:'REACTION',title:'СОГЛАСИТЬСЯ',description:'лучше всего восстанавливает CONTACT, снижает TENSION и может остановить чужой REPEAT',defaults:{}},
  joke:{family:'REACTION',title:'ПОШУТИТЬ',description:'лучше всего сбрасывает TENSION, но почти не чинит CONTACT и не считается согласием',defaults:{}},
  silent:{family:'REACTION',title:'ПРОМОЛЧАТЬ',description:'самая дешёвая реакция по ENERGY; пережидает ход, но снижает CONTACT',defaults:{}},
  pressure:{family:'REACTION',title:'ДАВИТЬ',description:'выжигает ENERGY и нагружает BRAIN собеседника, но резко повышает TENSION и рушит CONTACT',defaults:{}},
  repeat:{family:'CONTROL',title:'REPEAT',description:'повторяет ту же реакцию до лимита и завершает ветку; каждый навязчивый повтор дополнительно разгоняет BRAIN/TENSION, а явное согласие отменяет остаток',defaults:{count:2}},
  stop:{family:'CONTROL',title:'STOP',description:'явно завершает эту ветку; дальше по ней ничего не происходит',defaults:{}},
  ifbrain:{family:'CONTROL',title:'BRAIN >',description:'пропускает ветку только когда BRAIN выше порога; иначе нужна запасная ветка',defaults:{threshold:70}},
  pause:{family:'ABILITY',title:'ПАУЗА',description:'тратит заметную ENERGY, чтобы снизить BRAIN/TENSION и поддержать CONTACT перед реакцией',defaults:{}},
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
  let counter=null;
  const opposing=key==='resentment'?'trust':key==='trust'?'resentment':null;
  if(opposing&&delta>0){
    const counterBefore=Number(state.memory[opposing]||0);
    const counterAfter=Math.max(0,counterBefore-Math.abs(delta));
    state.memory[opposing]=counterAfter;
    if(counterAfter!==counterBefore)counter={key:opposing,before:counterBefore,after:counterAfter};
  }
  return {key,before,after,counter,semantics:MEMORY_SEMANTICS[node.type]||null};
}
