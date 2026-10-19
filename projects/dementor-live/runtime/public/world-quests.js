// Exploration scenes use their own objectives, not the city's construction checklist.
(function(){
const original=questObjectives;
questObjectives=function(){
 const key=state?.worldTravel?.scene,region=state?.worldTravel?.scenes?.[key];
 if(!region)return original();
 const targets=state.worldTravel.targets||[],exhibit=targets.find(t=>t.type==='world-exhibit'),exit=targets.find(t=>t.type==='world-gate');
 const nearby=exhibit&&Math.hypot(me.x-exhibit.x,me.y-exhibit.y)<state.config.actionRange;
 return {title:region.name,category:'ИССЛЕДОВАНИЕ',tasks:[
  {id:'explore-place',title:'Изучить '+(exhibit?.title||'экспозицию'),hint:'Подойди к объекту и нажми E',target:exhibit?.id,done:!!nearby},
  {id:'explore-return',title:'Вернуться в большой мир',hint:'Выйди через ворота, затем продолжай путешествие пешком',target:exit?.id,done:false}
 ]};
};
})();
