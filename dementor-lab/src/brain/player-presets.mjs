const RESPONSE_TRIGGERS=Object.freeze(['ignore','pushback','acceptance','deflection','underpressure']);

function collisionReady(graph){
  const opening=graph.nodes.find(n=>n.type==='criticism');
  if(!opening)return graph;
  const targets=graph.edges.filter(e=>e.from===opening.id).map(e=>e.to);
  const extraNodes=RESPONSE_TRIGGERS.map(type=>({id:`${graph.id}-${type}`,type,p:{}}));
  const extraEdges=[];
  for(const n of extraNodes)for(const to of targets)extraEdges.push({id:`${n.id}-to-${to}`,from:n.id,to});
  return {...graph,nodes:[...graph.nodes,...extraNodes],edges:[...graph.edges,...extraEdges]};
}

function freezeGraph(graph){
  const ready=collisionReady(graph);
  return Object.freeze({
    ...ready,
    nodes:Object.freeze(ready.nodes.map(n=>Object.freeze({...n,p:Object.freeze({...n.p})}))),
    edges:Object.freeze(ready.edges.map(e=>Object.freeze({...e})))
  });
}

export const PLAYER_BRAIN_PRESETS=Object.freeze({
  EXPLAIN_LOOP:Object.freeze({
    id:'EXPLAIN_LOOP',
    title:'Я ВСЁ ОБЪЯСНЮ',
    rule:'Если не поняли — объясню ещё раз.',
    note:'Может зациклиться.',
    graph:freezeGraph({
      id:'player-explain-loop',
      nodes:[
        {id:'ex-trigger',type:'criticism',p:{}},
        {id:'ex-state',type:'resentment',p:{key:'resentment',delta:1,cap:5}},
        {id:'ex-impulse',type:'beunderstood',p:{weight:4}},
        {id:'ex-reaction',type:'explain',p:{}},
        {id:'ex-repeat',type:'repeat',p:{count:4}}
      ],
      edges:[
        {id:'ex-e1',from:'ex-trigger',to:'ex-state'},
        {id:'ex-e2',from:'ex-state',to:'ex-impulse'},
        {id:'ex-e3',from:'ex-impulse',to:'ex-reaction'},
        {id:'ex-e4',from:'ex-reaction',to:'ex-repeat'}
      ]
    })
  }),
  KEEP_PEACE:Object.freeze({
    id:'KEEP_PEACE',
    title:'ЛИШЬ БЫ НЕ РУГАЛИСЬ',
    rule:'Согласие иногда дешевле победы.',
    note:'Хорошо держит контакт.',
    graph:freezeGraph({
      id:'player-keep-peace',
      nodes:[
        {id:'kp-trigger',type:'criticism',p:{}},
        {id:'kp-state',type:'trust',p:{key:'trust',delta:1,cap:5}},
        {id:'kp-impulse',type:'beliked',p:{weight:4}},
        {id:'kp-reaction',type:'agree',p:{}}
      ],
      edges:[
        {id:'kp-e1',from:'kp-trigger',to:'kp-state'},
        {id:'kp-e2',from:'kp-state',to:'kp-impulse'},
        {id:'kp-e3',from:'kp-impulse',to:'kp-reaction'}
      ]
    })
  }),
  PRESS_FOR_ANSWER:Object.freeze({
    id:'PRESS_FOR_ANSWER',
    title:'ОТВЕТЬ ПРЯМО',
    rule:'Если уходят в сторону — возвращаю к вопросу.',
    note:'Быстро повышает напряжение.',
    graph:freezeGraph({
      id:'player-press-answer',
      nodes:[
        {id:'pr-trigger',type:'criticism',p:{}},
        {id:'pr-state',type:'resentment',p:{key:'resentment',delta:1,cap:5}},
        {id:'pr-impulse',type:'beright',p:{weight:4}},
        {id:'pr-reaction',type:'pressure',p:{}}
      ],
      edges:[
        {id:'pr-e1',from:'pr-trigger',to:'pr-state'},
        {id:'pr-e2',from:'pr-state',to:'pr-impulse'},
        {id:'pr-e3',from:'pr-impulse',to:'pr-reaction'}
      ]
    })
  })
});

export const DEFAULT_PLAYER_BRAIN_PRESET='EXPLAIN_LOOP';

export function playerBrainPreset(id=DEFAULT_PLAYER_BRAIN_PRESET){
  return PLAYER_BRAIN_PRESETS[id]||PLAYER_BRAIN_PRESETS[DEFAULT_PLAYER_BRAIN_PRESET];
}

export function listPlayerBrainPresets(){
  return Object.values(PLAYER_BRAIN_PRESETS);
}
