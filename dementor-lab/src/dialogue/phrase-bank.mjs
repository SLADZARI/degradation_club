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
    'Хорошо. Здесь я с тобой согласен.',
    'Да. Это можно принять.',
    'Ладно, здесь спорить действительно не о чем.',
    'Согласен. В этом месте твоя версия сильнее.',
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
    understand:'Подожди. Кажется, я понял, что именно тебе здесь не нравится.',
    resentment:'Я уже не первый раз пытаюсь объяснить одно и то же.',
    overheat:'Нет. Подожди. Я ещё раз объясню, потому что сейчас мы вообще разъехались.',
    lowContact:'Я вижу, что разговор уже разваливается. Скажу только главное.'
  }),
  agree:Object.freeze({
    overheat:'Да. Хорошо. Всё. Здесь согласен.',
    lowContact:'Согласен. Дальше спорить об этом не буду.',
    resentment:'Ладно. Этот пункт принимаю, хотя мне это сейчас даётся тяжело.'
  }),
  joke:Object.freeze({
    overheat:'Прекрасно. Мозг уже кипит, зато чувство юмора ещё формально живо.',
    lowContact:'Ладно. Пока мы окончательно не разошлись — пусть будет хотя бы шутка.',
    resentment:'Отлично. Теперь ещё и обижаться можно организованно.'
  }),
  silent:Object.freeze({
    overheat:'…',
    lowContact:'…',
    resentment:'Понятно.'
  }),
  pressure:Object.freeze({
    overheat:'Нет. Сейчас отвечай прямо. Без ещё одного круга.',
    lowContact:'Ответь один раз прямо, и на этом закончим.',
    resentment:'Нет. После всего этого я всё-таки хочу услышать прямой ответ.'
  })
});

function stableHash(input=''){
  let h=2166136261;
  for(const ch of String(input)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}
  return h>>>0;
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
function contextualReplacement({reaction,impulse,state={},memory={}}){
  const set=EXTREME[reaction];if(!set)return null;
  if(Number(state.brain)>=85||Number(state.tension)>=80)return set.overheat||null;
  if(Number(state.contact)<=25)return set.lowContact||null;
  if(memoryValue(memory,'resentment')>=3)return set.resentment||null;
  if(reaction==='explain'&&impulse==='understand'&&Number(state.contact)>=40)return set.understand||null;
  return null;
}

export function resolvePhrase(context={}){
  const reaction=context.reaction||'silent';
  const contextual=contextualReplacement({...context,reaction});
  if(contextual)return contextual;
  const list=PHRASE_BANK[reaction]||PHRASE_BANK.silent;
  return list[stableHash(contextKey({...context,reaction}))%list.length];
}
