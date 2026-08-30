(()=>{
  if(!/\/join\/?(?:index\.html)?$/.test(location.pathname))return;
  const STORAGE='dementorClubOnboardingV3';
  const SPHERES=[
    ['personality','Личность'],['work','Работа'],['consumption','Потребление'],
    ['relationships','Отношения'],['control','Контроль'],['information','Информация'],
    ['self_development','Саморазвитие'],['meaning','Смысл'],['technology','Технологии']
  ];
  const base=location.pathname.startsWith('/degradation_club/')?'/degradation_club':'';
  const resultDestination=base+'/join/result/';
  const joinDestination=base+'/join/';
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'null')||{results:{}}}catch{return{results:{}}}};
  const completed=()=>{const state=read();return SPHERES.filter(([id])=>state.results?.[id]?.date)};
  const ensureStyles=()=>{
    if(document.getElementById('dcCommunityProgressStyles'))return;
    const style=document.createElement('style');style.id='dcCommunityProgressStyles';style.textContent=`
      .dc-community-progress{margin:38px 0 26px;border:1px solid rgba(244,241,232,.32);background:#d8ff3e;color:#111;padding:24px 26px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:end}
      .dc-community-progress__meta{font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px}
      .dc-community-progress__count{font:900 clamp(44px,6vw,82px)/.86 Arial,sans-serif;letter-spacing:-.055em;margin:0 0 12px}
      .dc-community-progress__copy{max-width:680px;font:700 17px/1.25 Arial,sans-serif;margin:0}
      .dc-community-progress__list{margin-top:15px;font:700 11px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;text-transform:uppercase;opacity:.72}
      .dc-community-progress__cta{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:0 18px;border:1px solid #111;background:#111;color:#f4f1e8;text-decoration:none;font:800 12px/1 Arial,sans-serif;text-transform:uppercase;white-space:nowrap}
      @media(max-width:760px){.dc-community-progress{grid-template-columns:1fr;padding:20px}.dc-community-progress__cta{width:100%;white-space:normal;text-align:center}.dc-community-progress__count{font-size:54px}}
    `;document.head.appendChild(style);
  };
  const render=()=>{
    const actions=document.querySelector('#result .actions');
    if(!actions||getComputedStyle(document.getElementById('result')).display==='none')return;
    ensureStyles();
    const done=completed();const n=done.length;const complete=n===SPHERES.length;
    let panel=document.getElementById('dcCommunityProgress');
    if(!panel){panel=document.createElement('section');panel.id='dcCommunityProgress';panel.className='dc-community-progress';actions.parentNode.insertBefore(panel,actions)}
    const doneNames=done.map(([,name])=>name);
    panel.innerHTML=`<div><div class="dc-community-progress__meta">DC-9 / ВАША КАРТА</div><div class="dc-community-progress__count">${n} / 9</div><p class="dc-community-progress__copy">${complete?'Карта завершена. Теперь можно получить итоговое заключение и перейти к входу в Community.':'Сфера сохранена. Для входа в Community v1 нужно собрать все девять независимых результатов.'}</p>${doneNames.length?`<div class="dc-community-progress__list">Завершено: ${doneNames.join(' · ')}</div>`:''}</div><a class="dc-community-progress__cta" href="${complete?resultDestination:joinDestination}">${complete?'ПОЛУЧИТЬ ИТОГОВОЕ ЗАКЛЮЧЕНИЕ →':'ПРОДОЛЖИТЬ ДИАГНОСТИКУ →'}</a>`;
    let legacy=document.getElementById('dcCommunityEntryBridge');legacy?.remove();
  };
  const observer=new MutationObserver(render);observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});
  window.addEventListener('storage',event=>{if(event.key===STORAGE)render()});
  render();setInterval(render,1200);
})();
