export const BASE_BRAIN=Object.freeze({
  trigger:Object.freeze({id:'pressure-trigger',type:'trigger',label:'МЕНЯ ПОДГОНЯЮТ'}),
  goal:Object.freeze({id:'stay-ok',type:'goal',label:'НЕ РАЗВАЛИТЬ КОНТАКТ'}),
  action:Object.freeze({id:'defend',type:'action',label:'ОПРАВДЫВАТЬСЯ'}),
  fallback:Object.freeze({id:'repeat',type:'fallback',label:'ПОВТОРИТЬ ЕЩЁ РАЗ'})
});

export const GENA_BASE_BRAIN=Object.freeze({
  trigger:Object.freeze({id:'waiting-trigger',type:'trigger',label:'Я ЖДУ И НЕ ПОНИМАЮ СКОЛЬКО'}),
  goal:Object.freeze({id:'get-time',type:'goal',label:'ПОЛУЧИТЬ КОНКРЕТНОЕ ВРЕМЯ'}),
  action:Object.freeze({id:'ask-again',type:'action',label:'СПРОСИТЬ ЕЩЁ РАЗ'}),
  fallback:Object.freeze({id:'repeat',type:'fallback',label:'ПОВТОРИТЬ ВОПРОС'})
});

export function createBrainFor(characterId){
  const src=characterId==='character-02'?BASE_BRAIN:GENA_BASE_BRAIN;
  return typeof globalThis.structuredClone==='function'?globalThis.structuredClone(src):JSON.parse(JSON.stringify(src));
}

export function unlockPool(characterId){
  return characterId==='character-02'
    ? [
        {id:'give-time',type:'action',label:'НАЗВАТЬ КОНКРЕТНОЕ ВРЕМЯ'},
        {id:'joke',type:'action',label:'Я ПРОСТО ПОШУТИЛА'}
      ]
    : [
        {id:'ask-soft',type:'action',label:'СПРОСИТЬ БЕЗ ДАВЛЕНИЯ'},
        {id:'joke',type:'action',label:'Я ПРОСТО ПОШУТИЛ'}
      ];
}

export function applyBrainNode(brain,node){
  if(!brain||!node||!['trigger','goal','action','fallback'].includes(node.type))return brain;
  brain[node.type]={...node};
  return brain;
}

export function brainChain(brain){return ['trigger','goal','action','fallback'].map(key=>brain[key]).filter(Boolean)}

export function resolveCafeDialogue(characterId,brain){
  const action=brain?.action?.id;
  if(characterId==='character-02'){
    if(action==='give-time')return [
      ['МАРТА','Мне нужно семь минут. Я скажу, если задержусь.'],
      ['ГЕНА','Окей. Семь минут я умею ждать.'],
      ['МАРТА','Вот. Уже легче.'],
      ['ГЕНА','Я у двери. Не тороплю.']
    ];
    if(action==='joke')return [
      ['МАРТА','Если выйдем сегодня — это уже хороший результат.'],
      ['ГЕНА','Смело. Я поставлю таймер до завтра.'],
      ['МАРТА','Вот теперь можешь ждать с пользой.'],
      ['ГЕНА','Договорились.']
    ];
    return [
      ['МАРТА','Я же сказала, что собираюсь.'],
      ['ГЕНА','Я только спросил, сколько ещё.'],
      ['МАРТА','Именно это ты спрашиваешь каждые две минуты.'],
      ['ГЕНА','Потому что ответа всё ещё нет.']
    ];
  }
  if(action==='ask-soft')return [
    ['ГЕНА','Сколько тебе примерно нужно? Я просто хочу понять, когда выходить.'],
    ['МАРТА','Минут семь. Я выбираю между двумя вещами.'],
    ['ГЕНА','Хорошо. Тогда жду семь минут и больше не спрашиваю.'],
    ['МАРТА','Спасибо. Так намного проще.']
  ];
  if(action==='joke')return [
    ['ГЕНА','Я просто уточняю: столик у нас сегодня или уже завтра?'],
    ['МАРТА','Сегодня. Но теперь специально ещё две минуты.'],
    ['ГЕНА','Принято. Заслужил.'],
    ['МАРТА','Вот теперь можешь сидеть.']
  ];
  return [
    ['ГЕНА','Ну сколько ещё?'],
    ['МАРТА','Я собираюсь.'],
    ['ГЕНА','Ты уже говорила это.'],
    ['МАРТА','А ты уже спрашивал это.']
  ];
}

export function changeSummary(before,after){
  if(before?.action?.id===after?.action?.id)return null;
  return {slot:'action',before:before?.action?.label||'—',after:after?.action?.label||'—'};
}
