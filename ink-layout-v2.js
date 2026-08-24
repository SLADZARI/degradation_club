(()=>{
  const path=location.pathname;
  if(!document.querySelector('link[href="/ink-layout-v2.css"]')){
    const link=document.createElement('link');link.rel='stylesheet';link.href='/ink-layout-v2.css';document.head.appendChild(link);
  }
  if(!document.querySelector('link[href="/ink-layout-v2-tuning.css"]')){
    const tune=document.createElement('link');tune.rel='stylesheet';tune.href='/ink-layout-v2-tuning.css';document.head.appendChild(tune);
  }

  const mountExisting=(figureSelector,targetSelector,role)=>{
    const figure=document.querySelector(figureSelector),target=document.querySelector(targetSelector);
    if(!figure||!target)return;
    const oldCaption=figure.nextElementSibling;
    figure.classList.remove('dc-media-break');
    figure.classList.add('dc-ink-integrated',`dc-ink-integrated--${role}`);
    target.classList.add('dc-has-integrated-ink',`dc-has-integrated-ink--${role}`);
    target.appendChild(figure);
    if(oldCaption?.querySelector?.('.dc-caption'))oldCaption.remove();
  };

  const mountNew=({targetSelector,src,alt,role,loading='lazy'})=>{
    const target=document.querySelector(targetSelector);if(!target||target.querySelector(`.dc-ink-integrated--${role}`))return;
    const probe=new Image();
    probe.onload=()=>{
      const figure=document.createElement('figure');
      figure.className=`dc-ink-integrated dc-ink-integrated--${role}`;
      const img=document.createElement('img');img.src=src;img.alt=alt;img.loading=loading;img.decoding='async';
      figure.appendChild(img);target.classList.add('dc-has-integrated-ink',`dc-has-integrated-ink--${role}`);target.appendChild(figure);
    };
    probe.src=src;
  };

  if(path==='/'){
    mountExisting('.dc-ink-slot--home','.dc-hero','home');
    mountNew({targetSelector:'.dc-home .dc-event[aria-labelledby="event-title"] .dc-shell',src:'/assets/event-fuengirola-03.webp',alt:'Набережная Фуэнхиролы с пальмами, морем и городом',role:'home-event'});
  }
  if(path==='/about/'){
    mountExisting('.dc-ink-slot--about','.dc-about-service__grid','service');
    mountNew({targetSelector:'.dc-about-dementor__grid',src:'/assets/ink/authority-chair-01.webp',alt:'Офисное кресло, превращённое в ироничный трон',role:'authority'});
  }
  if(path==='/projects/logic-awareness/')mountExisting('.dc-ink-slot--logic','.dc-ministry__grid','logic');
  if(path==='/events/fuengirola/')mountExisting('.dc-ink-slot--event','.dc-entity-hero','fuengirola');
  if(path==='/community/')mountNew({targetSelector:'.dc-community-hero .dc-shell',src:'/assets/ink/community-flow-01.webp',alt:'Группа людей движется в одном направлении, рядом отдельно стоит человек с листом',role:'community'});
})();
