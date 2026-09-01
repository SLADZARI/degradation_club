export const OPPONENT_PRESETS=Object.freeze({
  CONTACT_SKEPTIC:Object.freeze({
    id:'CONTACT_SKEPTIC',
    label:'СНАЧАЛА РАЗБЕРУСЬ',
    description:'Сначала пытается понять, что произошло. Перед ответом делает паузу и только потом объясняет.',
    graph:Object.freeze({
      id:'opponent-contact-skeptic',
      nodes:[
        {id:'b-trigger',type:'criticism',p:{}},
        {id:'b-state',type:'trust',p:{key:'trust',delta:1,cap:5}},
        {id:'b-impulse',type:'understand',p:{weight:3}},
        {id:'b-pause',type:'pause',p:{}},
        {id:'b-reaction',type:'explain',p:{}}
      ],
      edges:[
        {id:'b-e1',from:'b-trigger',to:'b-state'},
        {id:'b-e2',from:'b-state',to:'b-impulse'},
        {id:'b-e3',from:'b-impulse',to:'b-pause'},
        {id:'b-e4',from:'b-pause',to:'b-reaction'}
      ]
    }),
    initialState:Object.freeze({energy:78,brain:12,tension:12,contact:62,memory:{}})
  }),
  RIGHT_BACK:Object.freeze({
    id:'RIGHT_BACK',
    label:'НЕТ, ЭТО Я СЕЙЧАС ОБЪЯСНЮ',
    description:'На критику быстро собирает обиду, хочет остаться правым и повторяет объяснение ещё раз.',
    graph:Object.freeze({
      id:'opponent-right-back',
      nodes:[
        {id:'b-trigger',type:'criticism',p:{}},
        {id:'b-state',type:'resentment',p:{key:'resentment',delta:1,cap:5}},
        {id:'b-impulse',type:'beright',p:{weight:3}},
        {id:'b-reaction',type:'explain',p:{}},
        {id:'b-repeat',type:'repeat',p:{count:2}}
      ],
      edges:[
        {id:'b-e1',from:'b-trigger',to:'b-state'},
        {id:'b-e2',from:'b-state',to:'b-impulse'},
        {id:'b-e3',from:'b-impulse',to:'b-reaction'},
        {id:'b-e4',from:'b-reaction',to:'b-repeat'}
      ]
    }),
    initialState:Object.freeze({energy:76,brain:16,tension:16,contact:58,memory:{}})
  }),
  KEEP_PEACE:Object.freeze({
    id:'KEEP_PEACE',
    label:'ЛИШЬ БЫ НЕ РУГАЛИСЬ',
    description:'Пытается сохранить контакт, делает паузу и скорее соглашается, чем продолжает спор.',
    graph:Object.freeze({
      id:'opponent-keep-peace',
      nodes:[
        {id:'b-trigger',type:'criticism',p:{}},
        {id:'b-state',type:'trust',p:{key:'trust',delta:1,cap:5}},
        {id:'b-impulse',type:'beliked',p:{weight:3}},
        {id:'b-pause',type:'pause',p:{}},
        {id:'b-reaction',type:'agree',p:{}}
      ],
      edges:[
        {id:'b-e1',from:'b-trigger',to:'b-state'},
        {id:'b-e2',from:'b-state',to:'b-impulse'},
        {id:'b-e3',from:'b-impulse',to:'b-pause'},
        {id:'b-e4',from:'b-pause',to:'b-reaction'}
      ]
    }),
    initialState:Object.freeze({energy:80,brain:10,tension:10,contact:66,memory:{}})
  })
});

export const OPPONENT_PRESET_IDS=Object.freeze(Object.keys(OPPONENT_PRESETS));
export function opponentPreset(id){return OPPONENT_PRESETS[id]||OPPONENT_PRESETS.CONTACT_SKEPTIC}
