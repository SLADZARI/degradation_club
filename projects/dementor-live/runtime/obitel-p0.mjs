// Obitel P0: existing card questions only. No auto-generated dialogue or economy.
export const OBITEL_ZEN_CARDS = Object.freeze([
  {id:'OB-C01',title:'Аракул',x:7,y:7,question:'Какой путь сегодня твой — внутрь, к другим или к делу?',sourceStatus:'ready'},
  {id:'OB-C02',title:'Сумрачный Лес',x:14,y:6,question:'Как выглядит твой идеальный день из будущего — утро, рутина, вечер?',sourceStatus:'ready'},
  {id:'OB-C03',title:'Осязание',x:22,y:7,question:'Что ты держишь так крепко, что уже не чувствуешь, что сжимаешь?',sourceStatus:'ready'},
  {id:'OB-C04',title:'Город Мастеров',x:29,y:11,question:'В чём ты мастер — и какой результат получают люди после встречи с тобой?',sourceStatus:'ready'},
  {id:'OB-C05',title:'Тест',x:28,y:18,question:'Готов узнать, кто ты — полностью? Тяни первый тест.',sourceStatus:'ready'},
  {id:'OB-C06',title:'Леопард',x:20,y:22,question:'По какому кругу ты ходишь уже давно — и что мешает с него сойти?',sourceStatus:'ready'},
  {id:'OB-C07',title:'Внутренняя Цитадель',x:11,y:19,question:'Готов ли ты посещать мастерклассы наших отобранных специалистов?',sourceStatus:'ready'}
]);
const byId = new Map(OBITEL_ZEN_CARDS.map(card=>[card.id,card]));
export const OBITEL_ACTIONS = new Set(['obitelAnswer','obitelSkip','obitelContinue']);
function profile(p){
  if(!p.obitel || typeof p.obitel!=='object')p.obitel={version:1,cards:{},continuationRequests:{}};
  p.obitel.cards ||= {};
  p.obitel.continuationRequests ||= {};
  return p.obitel;
}
export function obitelCardView(p,id){
  const card=byId.get(id);
  if(!card)return null;
  const item=p.obitel?.cards?.[id]||{};
  return {id:card.id,title:card.title,question:card.question,sourceStatus:card.sourceStatus,
    contentStatus:'partial',completed:false,
    answerCount:item.answers?.length||0,lastAnsweredAt:item.lastAnsweredAt||null,
    skippedAt:item.skippedAt||null,
    continuationRequestedAt:p.obitel?.continuationRequests?.[id]?.at||null,
    note:'Доступен исходный вопрос. Продолжение диалога пока не завершено.'};
}
export function obitelProfileView(p){
  const cards={};
  for(const item of OBITEL_ZEN_CARDS)cards[item.id]={
    answerCount:p.obitel?.cards?.[item.id]?.answers?.length||0,
    lastAnsweredAt:p.obitel?.cards?.[item.id]?.lastAnsweredAt||null,
    continuationRequestedAt:p.obitel?.continuationRequests?.[item.id]?.at||null,
    skippedAt:p.obitel?.cards?.[item.id]?.skippedAt||null
  };
  return {version:1,territory:'ZEN',cards,completedQuests:0,
    status:'content-incomplete',mountainUnlocked:false};
}
export function obitelAction(g,p,cmd){
  if(!OBITEL_ACTIONS.has(cmd?.type))return null;
  if((p.scene||'city')!=='obitel-zen')throw Error('Эта карточка доступна только в Обители ZEN');
  const card=byId.get(cmd.target);
  if(!card)throw Error('Карточка Обители не найдена');
  g.near(p,card);
  if(p.spirit||p.job||p.delivery?.picked||p.combatP0?.activeSessionId)
    throw Error('Сначала заверши текущее дело');
  const data=profile(p),entry=data.cards[card.id]||={answers:[]},at=new Date(g.now||Date.now()).toISOString();
  let message='';
  if(cmd.type==='obitelAnswer'){
    const answer=typeof cmd.answer==='string'?cmd.answer.trim():'';
    if(!answer||answer.length>500)throw Error('Ответ должен содержать от 1 до 500 символов');
    entry.answers ||= [];
    entry.answers.push({questionId:card.id+'-primary',text:answer,at});
    if(entry.answers.length>20)entry.answers=entry.answers.slice(-20);
    entry.lastAnsweredAt=at;
    entry.contentStatus='partial';
    message='Ответ сохранён. Продолжение карточки пока в разработке.';
  } else if(cmd.type==='obitelContinue'){
    if(!data.continuationRequests[card.id])
      data.continuationRequests[card.id]={at,status:'pending'};
    message='Заявка на продолжение сохранена. Карточка пока не завершена.';
  } else {
    entry.skippedAt=at;
    message='Карточка пропущена. Ты можешь вернуться позднее.';
  }
  return {message,obitel:obitelCardView(p,card.id)};
}
