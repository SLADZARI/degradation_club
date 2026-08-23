const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'CLOSE':'MENU'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='MENU'}))}const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!reduce){const els=[...document.querySelectorAll('.card,.belief,.poster,.manifesto-copy')];const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.animate([{opacity:.15,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});io.unobserve(e.target)}}),{threshold:.12});els.forEach(el=>io.observe(el))}

(()=>{
  if(!location.pathname.startsWith('/join'))return;
  const $=id=>document.getElementById(id);
  const result=$('result');
  if(!result)return;

  const levels=[
    {name:'Неприлично функционален',title:'СЛИШКОМ ХОРОШО. ПРИДЁТСЯ ЛЕЧИТЬ.',verdict:'В этой сфере вы всё ещё слишком часто поступаете разумно. Не паникуйте. Состояние обратимо.'},
    {name:'Первые нарушения режима',title:'ПОШЛИ ПЕРВЫЕ НАРУШЕНИЯ.',verdict:'Иногда вы уже позволяете себе не улучшать ситуацию. Пока бессистемно, но направление тревожно верное.'},
    {name:'Деградация началась',title:'ДЕГРАДАЦИЯ НАЧАЛАСЬ. НЕ МЕШАЙТЕ.',verdict:'Вы уже способны сознательно сделать чуть хуже там, где раньше обязательно старались сделать лучше.'},
    {name:'Стабильно хуже',title:'СОСТОЯНИЕ СТАБИЛЬНО УХУДШАЕТСЯ.',verdict:'Хорошие привычки теряют власть над вами. Улучшения всё чаще происходят только по недосмотру.'},
    {name:'Случай запущен',title:'СЛУЧАЙ ЗАПУЩЕН. НАМ НРАВИТСЯ.',verdict:'В этой сфере вы уверенно сокращаете лишнее и уже почти не нуждаетесь в посторонней помощи для дальнейшего ухудшения.'},
    {name:'Дементор',title:'ВЫ ДЕМЕНТОР. ПОМОЩЬ ПОЧТИ НЕ ТРЕБУЕТСЯ.',verdict:'Состояние устойчивое. Рекомендуется не заниматься самолечением и по возможности передавать опыт менее запущенным участникам.'}
  ];

  const prescriptions={
    'Личность':'Перестать искать себя. Найденное может потребовать обслуживания.',
    'Работа':'Снизить занятость до значений, при которых ещё можно объяснить, почему всё сделано.',
    'Потребление':'Купить последнее необходимое для окончательного отказа от покупок.',
    'Отношения':'Снизить взаимопонимание до безопасного уровня и прекратить угадывать мысли без лицензии.',
    'Контроль':'Вернуть событиям право происходить без вашего предварительного согласования.',
    'Информация':'Прекратить замечать лишнее. При обнаружении причинно-следственных связей обратиться повторно.',
    'Саморазвитие':'Остановить прогресс до появления необратимых последствий.',
    'Смысл':'Временно освободить действия от обязанности что-либо значить.',
    'Технологии':'Автоматизировать всё, кроме необходимости разбираться, зачем.'
  };

  function score(id){const text=$(id)?.textContent||'';const m=text.match(/(\d+)/);return m?Number(m[1]):0}

  function applyResultTone(){
    if(!result.classList.contains('active'))return;
    const level=Math.max(0,Math.min(5,Number($('levelNumber')?.textContent||0)));
    const sphere=$('resultSphere')?.textContent?.trim()||'';
    const intent=score('intentScore');
    const responsibility=score('responsibilityScore');
    const signature=[level,sphere,intent,responsibility].join('|');
    if(result.dataset.toneSignature===signature)return;
    result.dataset.toneSignature=signature;

    const copy=levels[level];
    if($('resultStamp'))$('resultStamp').textContent='МИНИСТЕРСТВО ВЫНЕСЛО ВЕРДИКТ';
    if($('resultKicker'))$('resultKicker').textContent=`ОБЛАСТЬ ПОРАЖЕНИЯ · ${sphere.toUpperCase()}`;
    if($('resultTitle'))$('resultTitle').textContent=copy.title;
    if($('resultVerdict'))$('resultVerdict').textContent=copy.verdict;
    if($('levelName'))$('levelName').textContent=copy.name;

    const ruleCard=document.querySelector('.rule-card');
    const ruleKicker=ruleCard?.querySelector('.kicker');
    if(ruleKicker)ruleKicker.textContent='НАЗНАЧЕНИЕ DEMENTOR CLUB';
    if($('resultRule'))$('resultRule').textContent=prescriptions[sphere]||'Продолжить деградацию под наблюдением клуба.';

    const min=Math.min(intent,responsibility);
    if($('qualityNote'))$('qualityNote').textContent=min<2
      ?'ПОКА НЕ ЗАСЧИТАНО. Похоже, часть деградации произошла сама. Клуб работает только с осознанным ухудшением качества жизни.'
      :'ЗАСЧИТАНО. Вы делаете это намеренно и готовы потом отвечать на неудобные вопросы.';

    const guards=document.querySelectorAll('.guard');
    if(guards[0]?.querySelector('span'))guards[0].querySelector('span').textContent='Вы понимаете, что творите';
    if(guards[1]?.querySelector('span'))guards[1].querySelector('span').textContent='Потом не говорите, что так получилось';

    const profile=document.querySelector('.profile');
    if(profile?.querySelector('.kicker'))profile.querySelector('.kicker').textContent='НАКОПЛЕННЫЙ УЩЕРБ';
    if(profile?.querySelector('h2'))profile.querySelector('h2').textContent='КАРТА ПОРАЖЕНИЯ';

    if($('another'))$('another').textContent='Проверить другую сферу';
    if($('restart'))$('restart').textContent='Перепроверить ущерб';
  }

  new MutationObserver(applyResultTone).observe(result,{attributes:true,attributeFilter:['class'],childList:true,subtree:true});
  applyResultTone();
})();
