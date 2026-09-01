export const PHRASE_BANK=Object.freeze({
  explain:[
    'Нет, подожди. Я всё-таки объясню, почему это должно работать.',
    'Смотри. Там просто есть один момент, который ты сейчас пропускаешь.',
    'Я попробую ещё раз, только короче.'
  ],
  agree:[
    'Хорошо.',
    'Ладно.',
    'Да. Этого достаточно.'
  ],
  joke:[
    'Да. Пока всё идёт по плану.',
    'Хорошо. Запишем это как рабочий вариант.'
  ],
  silent:['…','Понятно.'],
  pressure:[
    'Нет. Ответь именно на этот вопрос.',
    'Подожди. Мы сейчас не будем уходить в сторону.'
  ]
});

const LISTENER_PHRASES=Object.freeze({
  understand:[
    'Я понял.',
    'Да, я это понял.',
    'Я понял и первый раз.'
  ],
  beliked:[
    'Хорошо.',
    'Ладно.',
    'Пусть будет так.'
  ]
});

export function resolvePhrase({reaction,impulse=null,actorId=null,turn=0}){
  const listener=actorId==='B'&&impulse?LISTENER_PHRASES[impulse]:null;
  const list=listener||PHRASE_BANK[reaction]||['…'];
  return list[Math.abs(turn)%list.length];
}
