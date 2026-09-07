export const CAFE_PREP_STORY=Object.freeze({
  id:'cafe-prep',
  title:'ВЫХОД В КАФЕ',
  location:'ДОМ → КАФЕ',
  premise:'Вы собираетесь выйти. Гена уже готов и ждёт. Марта всё ещё собирается и чувствует, что её подгоняют.',
  roles:Object.freeze({
    'character-01':Object.freeze({
      id:'gena',name:'ГЕНА',gender:'male',role:'already-ready',
      publicGoal:'ПОНЯТЬ, КОГДА ВЫ НАКОНЕЦ ВЫЙДЕТЕ',
      privateTruth:'Он уже оделся и сидит у двери. Чем меньше получает конкретики, тем чаще спрашивает.',
      opening:'Я уже собрался. Сколько тебе ещё нужно?',
      hiddenFromOther:'Для Гены ожидание выглядит как отсутствие ответа. Он не видит, сколько решений Марта ещё принимает внутри.'
    }),
    'character-02':Object.freeze({
      id:'marta',name:'МАРТА',gender:'female',role:'still-getting-ready',
      publicGoal:'ДОСОБИРАТЬСЯ И НЕ ПРЕВРАТИТЬ ЭТО В ССОРУ',
      privateTruth:'Она не стоит без дела: меняет одежду, проверяет сумку и пытается понять, что именно её раздражает — спешка или давление.',
      opening:'Я собираюсь. Мне нужно ещё немного времени.',
      hiddenFromOther:'Для Марты каждый новый вопрос звучит не как запрос времени, а как ещё одно напоминание, что она «опаздывает».'
    })
  }),
  beats:Object.freeze({
    male:Object.freeze([
      ['ГЕНА','Я уже собрался. Сколько тебе ещё нужно?'],
      ['МАРТА','Пять минут. Наверное.'],
      ['ГЕНА','Ты это сказала пять минут назад.'],
      ['МАРТА','Потому что за эти пять минут ты спросил ещё два раза.'],
      ['ГЕНА','Я просто хочу понимать, когда мы выходим.'],
      ['МАРТА','А я хочу спокойно закончить собираться.']
    ]),
    female:Object.freeze([
      ['МАРТА','Я собираюсь. Мне правда нужно ещё немного времени.'],
      ['ГЕНА','Мы вообще сегодня выйдем?'],
      ['МАРТА','Я выбираю между двумя вещами и ищу ключи.'],
      ['ГЕНА','Я уже одет и десять минут сижу у двери.'],
      ['МАРТА','Вот когда ты так говоришь, я начинаю собираться ещё медленнее.'],
      ['ГЕНА','Я не подгоняю. Я спрашиваю.']
    ])
  }),
  unlocks:Object.freeze({
    'character-01':Object.freeze([
      {id:'ask-soft',type:'action',label:'СПРОСИТЬ БЕЗ ДАВЛЕНИЯ',description:'Сначала получить конкретику, не добавляя оценку.'},
      {id:'joke',type:'action',label:'Я ПРОСТО ПОШУТИЛ',description:'Снять напряжение шуткой вместо ещё одного вопроса.'}
    ]),
    'character-02':Object.freeze([
      {id:'give-time',type:'action',label:'НАЗВАТЬ КОНКРЕТНОЕ ВРЕМЯ',description:'Не оправдываться, а дать понятный ориентир.'},
      {id:'joke',type:'action',label:'Я ПРОСТО ПОШУТИЛА',description:'Снять напряжение шуткой вместо защиты.'}
    ])
  })
});

export function roleFor(characterId){return CAFE_PREP_STORY.roles[characterId]||CAFE_PREP_STORY.roles['character-01']}
export function otherCharacterId(characterId){return characterId==='character-02'?'character-01':'character-02'}
export function storyBeatsFor(characterId){return characterId==='character-02'?CAFE_PREP_STORY.beats.female:CAFE_PREP_STORY.beats.male}
export function unlocksFor(characterId){return [...(CAFE_PREP_STORY.unlocks[characterId]||[])]}
export function perspectiveReveal(characterId){
  const current=roleFor(characterId),other=roleFor(otherCharacterId(characterId));
  return {
    current:`ТЫ ВИДЕЛ ЭТУ СЦЕНУ КАК ${current.name}. ${current.hiddenFromOther}`,
    other:`В ПРОХОЖДЕНИИ ЗА ${other.name} ОТКРОЮТСЯ ДРУГИЕ ВНУТРЕННИЕ ПРИЧИНЫ ЭТИХ ЖЕ РЕПЛИК.`
  };
}
