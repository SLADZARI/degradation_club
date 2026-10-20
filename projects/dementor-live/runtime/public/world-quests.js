// Exploration scenes use their own objectives, not the city's construction checklist.
(function(){
const original=questObjectives;
questObjectives=function(){
 const key=state?.worldTravel?.scene,region=state?.worldTravel?.scenes?.[key];
 if(!region)return original();
 const targets=state.worldTravel.targets||[],exhibit=targets.find(t=>t.type==='world-exhibit'),exit=targets.find(t=>t.type==='world-gate');
 if(key==='obitel-zen'){
   const cards=targets.filter(t=>t.type==='obitel-card');
   const answered=cards.filter(c=>(state.obitel?.cards?.[c.id]?.answerCount||0)>0).length;
   return {title:'Обитель Габеля · ZEN',category:'ИССЛЕДОВАНИЕ · P0',tasks:[
     {id:'obitel-answer',title:'Ответить на доступные вопросы · '+answered+'/'+cards.length,
      hint:'Подойди к одной из семи карт и нажми E. Продолжения пока отмечены как незавершённые.',
      target:cards.find(c=>(state.obitel?.cards?.[c.id]?.answerCount||0)===0)?.id||cards[0]?.id,done:answered===cards.length},
     {id:'obitel-return',title:'Вернуться через ворота',hint:'Выход открыт в любое время',target:exit?.id,done:false}
   ]};
 }
 const nearby=exhibit&&Math.hypot(me.x-exhibit.x,me.y-exhibit.y)<state.config.actionRange;
 return {title:region.name,category:'ИССЛЕДОВАНИЕ',tasks:[
  {id:'explore-place',title:'Изучить '+(exhibit?.title||'экспозицию'),hint:'Подойди к объекту и нажми E',target:exhibit?.id,done:!!nearby},
  {id:'explore-return',title:'Вернуться в большой мир',hint:'Выйди через ворота, затем продолжай путешествие пешком',target:exit?.id,done:false}
 ]};
};
})();
