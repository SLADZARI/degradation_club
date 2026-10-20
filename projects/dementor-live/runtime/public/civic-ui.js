/* Short public job index: help players earn PAPER without hidden console commands. */
(function(){
const oldPanels=updateCityPanels,oldInteraction=interaction,oldContext=doContext;
interaction=function(t){if(t?.id==='university-site')return {type:'university',title:'Университет Валентина Лосева',hint:'Курсы по складыванию пакетиков: +15 и ещё +15',enabled:!me.spirit};return oldInteraction(t);};
doContext=function(){if(context?.type==='university')return openCityPanel('university');return oldContext();};
const shortcut=document.createElement('button');shortcut.id='civicJobButton';shortcut.className='phone-control';shortcut.textContent='☷ Работы';shortcut.title='Небольшие одноразовые поручения за PAPER';shortcut.onclick=()=>openCityPanel('civic-jobs');document.querySelector('.map-tools')?.append(shortcut);
updateCityPanels=function(force=false){
 if(cityPanelMode==='university'){
  const rows=$('cityPanelRows');rows.replaceChildren();
  const v=state.losevCourse||{};
  $('cityPanelTitle').textContent='Университет Валентина Лосева';
  $('cityPanelIntro').textContent='Курсы по складыванию пакетиков. Новые навыки расширяют вместимость рюкзака, не создавая бесплатных предметов.';
  $('cityPanelNote').textContent='Обучение и срок окончания сохраняются между входами в игру.';
  function row(label,info,text,fn,disabled){
   const part=document.createElement('section');part.className='city-row';const h=document.createElement('h3');h.textContent=label;const p=document.createElement('p');p.textContent=info;const b=document.createElement('button');b.textContent=text;b.disabled=disabled;b.onclick=fn;const a=document.createElement('div');a.className='city-actions';a.append(b);part.append(h,p,a);rows.append(part);
  }
  const atSchool=!!nearby('university-site');
  row('Быстрый курс · +15','Бесплатное обучение, завершается сразу.',v.fast?'Пройден':'Пройти курс',()=>act('losevFast','university-site'),!!v.fast||!atSchool||me.spirit);
  const days=v.advancedEndsAt?Math.max(0,Math.ceil((v.advancedEndsAt-state.now)/3600000))+' ч до выпуска':'48 часов реального времени';
  row('Большой курс · ещё +15','Стоимость 300 PAPER · '+(v.advancedCompleted?'Курс окончен':days),v.advancedCompleted?'Пройден':v.advancedPurchased?'Обучение идёт':'Начать за 300 PAPER',()=>act('losevAdvanced','university-site'),!v.fast||v.advancedPurchased||!atSchool||me.wallet<300||me.spirit);
  return;
 }
 if(cityPanelMode!=='civic-jobs')return oldPanels(force);
 const rows=$('cityPanelRows');rows.replaceChildren();
 $('cityPanelTitle').textContent='Небольшие городские дела';
 $('cityPanelIntro').textContent='Три первых маршрута: выполняются один раз каждым жителем. Вознаграждение идёт только из казны, не возникает из воздуха.';
 $('cityPanelNote').textContent='Для крупных покупок также можно продавать древесину и камень или участвовать в строительстве.';
 for(const job of state.civicJobs||[]){
  const section=document.createElement('section');section.className='city-row';
  const h=document.createElement('h3');h.textContent=(job.claimed?'✓ ':'○ ')+job.name;
  const p=document.createElement('p');p.textContent=job.claimed?'Получено ранее':'Награда '+job.reward+' PAPER';
  const action=document.createElement('button');
  const near=nearby(job.target);action.textContent=job.claimed?'Уже выполнено':near?'Получить награду':'Показать путь';
  action.disabled=job.claimed;action.onclick=()=>{if(near)act('civicClaim',job.target,{jobId:job.id});else {document.querySelector('#cityPanel').close();navigateTo(job.target);}};
  const controls=document.createElement('div');controls.className='city-actions';controls.append(action);section.append(h,p,controls);rows.append(section);
 }
};
})();