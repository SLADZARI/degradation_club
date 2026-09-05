export const PHRASE_BANK=Object.freeze({
  explain:Object.freeze([
    'Нет, подожди. Я всё-таки объясню, почему это должно работать.',
    'Смотри. Там есть один момент, который сейчас теряется.',
    'Я попробую сформулировать это ещё раз.',
    'Давай разложу по шагам, что я имею в виду.',
    'Мне кажется, мы сейчас говорим о разных частях одной вещи.',
    'Хорошо. Тогда объясню, на чём именно держится моя мысль.'
  ]),
  agree:Object.freeze([
    'Хорошо. Здесь я с тобой {{agree}}.',
    'Да. Это можно принять.',
    'Ладно, здесь спорить действительно не о чем.',
    '{{Agree}}. В этом месте твоя версия сильнее.',
    'Да, это замечание по делу.',
    'Хорошо. Тогда этот пункт снимаем.'
  ]),
  joke:Object.freeze([
    'Отлично. Значит, план уже начал объединять людей.',
    'Хорошо, хотя бы катастрофа получается последовательная.',
    'Прекрасно. Теперь у нас есть ещё и официальная версия происходящего.',
    'Ну всё, осталось только назначить виноватого и можно начинать.',
    'Стабильность есть: мы хотя бы одинаково не понимаем, что происходит.',
    'Хорошая новость — хуже объяснить это уже будет сложно.'
  ]),
  silent:Object.freeze([
    '…',
    'Понятно.',
    'Ясно.',
    'Хорошо.',
    'Угу.',
    '…ладно.'
  ]),
  pressure:Object.freeze([
    'Нет. Ответь именно на этот вопрос.',
    'Подожди. Мы сейчас не будем уходить в сторону.',
    'Нет, давай сначала закончим с этим пунктом.',
    'Мне нужен прямой ответ, без обхода.',
    'Стоп. Сначала ответь, что именно здесь не так.',
    'Давай без нового круга. На этот вопрос ответь.'
  ])
});

const EXTREME=Object.freeze({
  explain:Object.freeze({
    beunderstood:Object.freeze([
      'Нет, подожди. Я хочу, чтобы ты понял именно этот кусок.',
      'Секунду. Я, кажется, ещё не донёс самое главное.',
      'Я слышу «понял», но подозреваю, что понял ты пока не всё.',
      'Есть ещё один маленький нюанс размером с половину разговора.'
    ]),
    understand:Object.freeze([
      'Подожди. Кажется, я {{understood}}, что именно тебе здесь не нравится.',
      'Кажется, я наконец {{understood}}, где мы разъехались.',
      'Так. Похоже, я {{understood}}, что ты всё это время пытался сказать.'
    ]),
    resentment:Object.freeze([
      'Я уже не первый раз пытаюсь объяснить одно и то же.',
      'Мы снова здесь. Отлично. Тогда ещё раз.',
      'Я сейчас повторюсь, потому что прошлые повторы, очевидно, были недостаточно убедительны.'
    ]),
    overheat:Object.freeze([
      'Нет. Подожди. Я ещё раз объясню, потому что сейчас мы вообще разъехались.',
      'Стоп. Сейчас всё соберу в одну мысль. Возможно, в последнюю.',
      'Я уже почти киплю, но нюанс всё ещё жив. Значит, продолжаем.'
    ]),
    lowContact:Object.freeze([
      'Я вижу, что разговор уже разваливается. Скажу только главное.',
      'Кажется, мы почти перестали разговаривать. Ещё одна фраза — и всё.',
      'Контакт уже на выходе. Поэтому коротко: вот что я пытаюсь сказать.'
    ])
  }),
  agree:Object.freeze({
    overheat:Object.freeze(['Да. Хорошо. Всё. Здесь {{agree}}.','Ладно. Этот пункт снимаю, пока мы оба ещё функционируем.']),
    lowContact:Object.freeze(['{{Agree}}. Дальше спорить об этом не буду.','Хорошо. Здесь остановимся.']),
    resentment:Object.freeze(['Ладно. Этот пункт принимаю, хотя мне это сейчас даётся тяжело.','Хорошо. Запишем редкий исторический момент: я это принимаю.'])
  }),
  joke:Object.freeze({
    overheat:Object.freeze(['Прекрасно. Мозг уже кипит, зато чувство юмора ещё формально живо.','Хорошо. Если мы не договоримся, хотя бы мем получится.']),
    lowContact:Object.freeze(['Ладно. Пока мы окончательно не разошлись — пусть будет хотя бы шутка.','Контакта почти нет, но сарказм пока держится.']),
    resentment:Object.freeze(['Отлично. Теперь ещё и обижаться можно организованно.','Прекрасно. Значит, обида у нас уже командная.'])
  }),
  silent:Object.freeze({
    overheat:Object.freeze(['…','Так. Я лучше сейчас промолчу.']),
    lowContact:Object.freeze(['…','Понятно. Дальше без меня.']),
    resentment:Object.freeze(['Понятно.','Да-да. Конечно.'])
  }),
  pressure:Object.freeze({
    overheat:Object.freeze(['Нет. Сейчас отвечай прямо. Без ещё одного круга.','Стоп. Один прямой ответ. Сейчас.']),
    lowContact:Object.freeze(['Ответь один раз прямо, и на этом закончим.','Контакт уже почти умер. Поэтому просто ответь.']),
    resentment:Object.freeze(['Нет. После всего этого я всё-таки хочу услышать прямой ответ.','Нет, теперь уже ответь. Мы слишком далеко зашли, чтобы красиво уйти.'])
  })
});

function stableHash(input=''){
  let h=2166136261;
  for(const ch of String(input)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}
  return h>>>0;
}
function genderForm(gender,key){
  const female=gender==='female';
  const forms={agree:female?'согласна':'согласен',Agree:female?'Согласна':'Согласен',understood:female?'поняла':'понял'};
  return forms[key]||'';
}
function inflectPhrase(text,gender='male'){
  return String(text||'').replace(/\{\{(agree|Agree|understood)\}\}/g,(_,key)=>genderForm(gender,key));
}
function memoryValue(memory,key){return Number(memory?.[key]||0)}
function recentKey(recentTranscript=[]){return recentTranscript.slice(-3).map(x=>`${x.actorId||''}:${x.reaction||''}:${x.impulse||''}`).join('|')}
function contextKey({reaction,impulse,scenario,state={},memory={},recentTranscript=[],turn=0}){
  const brainBand=state.brain>=85?'hot':state.brain>=60?'warm':'cool';
  const tensionBand=state.tension>=75?'high':state.tension>=45?'mid':'low';
  const contactBand=state.contact<=25?'low':state.contact>=70?'high':'mid';
  const resentment=Math.min(5,memoryValue(memory,'resentment'));
  const trust=Math.min(5,memoryValue(memory,'trust'));
  return [reaction,impulse||'',scenario?.id||'',brainBand,tensionBand,contactBand,resentment,trust,recentKey(recentTranscript),turn].join('~');
}
function pickVariant(value,context){
  if(!value)return null;
  if(!Array.isArray(value))return value;
  return value[stableHash(contextKey(context))%value.length];
}
function contextualReplacement({reaction,impulse,state={},memory={},...rest}){
  const set=EXTREME[reaction];if(!set)return null;
  const ctx={reaction,impulse,state,memory,...rest};
  if(Number(state.brain)>=85||Number(state.tension)>=80)return pickVariant(set.overheat,ctx);
  if(Number(state.contact)<=25)return pickVariant(set.lowContact,ctx);
  if(memoryValue(memory,'resentment')>=3)return pickVariant(set.resentment,ctx);
  if(reaction==='explain'&&impulse==='beunderstood'&&Number(state.contact)>=35)return pickVariant(set.beunderstood,ctx);
  if(reaction==='explain'&&impulse==='understand'&&Number(state.contact)>=40)return pickVariant(set.understand,ctx);
  return null;
}

export function resolvePhrase(context={}){
  const reaction=context.reaction||'silent';
  const contextual=contextualReplacement({...context,reaction});
  if(contextual)return inflectPhrase(contextual,context.gender);
  const list=PHRASE_BANK[reaction]||PHRASE_BANK.silent;
  return inflectPhrase(list[stableHash(contextKey({...context,reaction}))%list.length],context.gender);
}
