(()=>{
  const entities=[
    {id:'SH-DEM-01',type:'wear',name:'OVERTHINKING IS MY CARDIO.',url:'/merch/drop-001/overthinking-is-my-cardio/',asset:'/assets/merch/drop-001/sh-dem-01-light.webp',state:'NOT OPEN',status:'working-assets-present',idea:'Футболка для тех, кто уже превратил мыслительный процесс в кардио.',tags:['thinking','overthinking','course'],slots:['COURSE_RELATED','MERCH_CROSSSELL','FOOTER_ROTATION'],priority:60},
    {id:'SH-DEM-02',type:'wear',name:'PERSONAL GROWTH CANCELLED.',url:'/merch/drop-001/personal-growth-cancelled/',asset:'/assets/merch/drop-001/sh-dem-02-light.webp',state:'NOT OPEN',status:'working-assets-present',idea:'Физическое подтверждение временной приостановки личностного роста.',tags:['personal-growth','self-improvement','home'],slots:['HOME_INLINE','MERCH_CROSSSELL','FOOTER_ROTATION'],priority:55},
    {id:'SH-DEM-03',type:'wear',name:'SUCCESS IS BORING.',url:'/merch/drop-001/success-is-boring/',asset:'/assets/merch/drop-001/sh-dem-03-light.webp',state:'NOT OPEN',status:'working-assets-present',idea:'Базовая форма защиты от чрезмерно очевидного успеха.',tags:['success','achievement','event'],slots:['EVENT_RELATED','MERCH_CROSSSELL','FOOTER_ROTATION'],priority:50},
    {id:'SH-DEM-04',type:'wear',name:'ВАШ ПОТЕНЦИАЛ СЛИШКОМ ДОЛГО ОСТАВАЛСЯ РАСКРЫТЫМ.',url:'/merch/drop-001/potential-too-long-revealed/',asset:'/assets/merch/drop-001/sh-dem-04-light.webp',state:'NOT OPEN',status:'working-assets-present',idea:'Мозг уже подан. Осталось прекратить обращаться с ним как с инвестиционным проектом.',tags:['potential','onboarding','self-improvement','home'],slots:['HOME_INLINE','POST_JOIN_RESULT','MERCH_CROSSSELL','FOOTER_ROTATION'],priority:70},
    {id:'OBJECT-001',type:'object',name:'НЕ НАДО',url:'/objects/001-ne-nado/',asset:'/assets/objects/object-001/object-001-hero-3q.webp',state:'NOT OPEN',status:'approved',idea:'Тяжёлый предмет для ситуаций, когда внутреннего «не надо» недостаточно.',tags:['artifact','club','restraint','about'],slots:['FOOTER_ROTATION','MERCH_CROSSSELL'],priority:65},
    {id:'PROGRAM-001',type:'program',name:'ДУМАЙ С ОПАСНОСТЬЮ',url:'/courses/dumai-s-opasnostyu/',asset:'/assets/courses/dumai-s-opasnostyu/home-hero.webp',state:'APPROVED DRAFT',status:'approved',idea:'Курс последовательной деградации уверенности.',tags:['thinking','uncertainty','home'],slots:['HOME_FEATURED','POST_JOIN_RESULT'],priority:60}
  ];

  const path=location.pathname.replace(/\/+/g,'/');
  const seen=new Set();
  const sessionKey='dc-rec-popup-seen-v1';

  function context(){
    if(path==='/') return {tags:['home','potential','self-improvement'],slot:'HOME_INLINE',mode:'major',before:'.dc-join'};
    if(path==='/about/'||path==='/about') return {tags:['about','artifact','club'],slot:'FOOTER_ROTATION',mode:'minor',before:'.dc-footer'};
    if(path.startsWith('/courses/dumai-s-opasnostyu')) return {tags:['thinking','overthinking','course'],slot:'COURSE_RELATED',mode:'major',before:'.dc-footer'};
    if(path.startsWith('/events/fuengirola')) return {tags:['event','success'],slot:'EVENT_RELATED',mode:'minor',before:'.dc-footer'};
    if(path.startsWith('/merch/drop-001/')) return {tags:['wear'],slot:'MERCH_CROSSSELL',mode:'minor',before:'.dc-footer',excludePath:true};
    if(path.startsWith('/objects/')) return {tags:['wear','artifact'],slot:'MERCH_CROSSSELL',mode:'minor',before:'.dc-footer'};
    if(path.startsWith('/join/')){
      const ready=document.querySelector('[data-join-result-ready="true"]');
      if(ready) return {tags:['onboarding','potential','self-improvement'],slot:'POST_JOIN_RESULT',mode:'major',after:ready};
    }
    return null;
  }

  function score(entity,ctx){
    if(!entity.slots.includes(ctx.slot)) return -Infinity;
    if(ctx.excludePath&&path===entity.url) return -Infinity;
    let s=entity.priority||0;
    for(const tag of ctx.tags||[]) if(entity.tags.includes(tag)) s+=100;
    if(entity.status==='available') s+=20;
    return s;
  }

  function choose(ctx){
    return entities
      .filter(e=>!seen.has(e.id))
      .map(e=>({e,s:score(e,ctx)}))
      .filter(x=>Number.isFinite(x.s))
      .sort((a,b)=>b.s-a.s)[0]?.e||null;
  }

  function labelFor(slot){
    if(slot==='MERCH_CROSSSELL') return 'RELATED / DEMENTOR OBJECTS';
    if(slot==='COURSE_RELATED') return 'RELATED ARTIFACT / AFTERTHOUGHT';
    if(slot==='EVENT_RELATED') return 'RELATED / FIELD EQUIPMENT';
    if(slot==='POST_JOIN_RESULT') return 'SYSTEM RECOMMENDATION';
    if(slot==='FOOTER_ROTATION') return 'DEMENTOR OBJECTS / INTERRUPTION';
    return 'СИСТЕМА СЧИТАЕТ, ЧТО ВАМ ЭТО ТОЖЕ НЕ НУЖНО.';
  }

  function actionFor(entity){
    if(entity.type==='program') return 'ОТКРЫТЬ КУРС';
    if(entity.state==='AVAILABLE') return 'КУПИТЬ';
    return 'ОТКРЫТЬ ОБЪЕКТ';
  }

  function render(entity,ctx){
    seen.add(entity.id);
    const section=document.createElement('section');
    section.className='dc-recommendation'+(ctx.mode==='minor'?' dc-recommendation--minor':'');
    section.dataset.recommendationSlot=ctx.slot;
    section.dataset.entityId=entity.id;
    section.innerHTML=`<div class="dc-recommendation__inner"><a class="dc-recommendation__media" href="${entity.url}" aria-label="${entity.name.replace(/"/g,'&quot;')}"><img src="${entity.asset}" alt="${entity.name.replace(/"/g,'&quot;')}" loading="lazy" decoding="async"></a><div class="dc-recommendation__copy"><div class="dc-recommendation__meta"><span>${entity.id} / ${entity.type.toUpperCase()}</span><span>${entity.state}</span></div><p class="dc-recommendation__label">${labelFor(ctx.slot)}</p><h2 class="dc-recommendation__title">${entity.name}</h2><p class="dc-recommendation__idea">${entity.idea}</p><div class="dc-recommendation__foot"><div class="dc-recommendation__state">PRICE / ${entity.state==='AVAILABLE'?'SEE PRODUCT':'TBD'}<br>SALES / ${entity.state}</div><a class="dc-recommendation__action" href="${entity.url}">${actionFor(entity)} →</a></div></div></div>`;
    const before=ctx.before&&document.querySelector(ctx.before);
    if(before) before.parentNode.insertBefore(section,before);
    else if(ctx.after&&ctx.after.parentNode) ctx.after.parentNode.insertBefore(section,ctx.after.nextSibling);
    else document.querySelector('main')?.appendChild(section);
    section.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>window.dispatchEvent(new CustomEvent('dc:recommendation-click',{detail:{entity_id:entity.id,slot:ctx.slot,page_context:path,format:ctx.mode}}))));
    window.dispatchEvent(new CustomEvent('dc:recommendation-impression',{detail:{entity_id:entity.id,slot:ctx.slot,page_context:path,format:ctx.mode}}));
  }

  function mount(){
    const ctx=context();
    if(!ctx) return;
    const entity=choose(ctx);
    if(entity) render(entity,ctx);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount,{once:true}); else mount();
})();
