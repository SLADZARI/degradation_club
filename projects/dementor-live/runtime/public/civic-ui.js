/* Short public job index: help players earn PAPER without hidden console commands. */
(function(){
const oldPanels=updateCityPanels;
const shortcut=document.createElement('button');shortcut.id='civicJobButton';shortcut.className='phone-control';shortcut.textContent='☷ Работы';shortcut.title='Небольшие одноразовые поручения за PAPER';shortcut.onclick=()=>openCityPanel('civic-jobs');document.querySelector('.map-tools')?.append(shortcut);
updateCityPanels=function(force=false){
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