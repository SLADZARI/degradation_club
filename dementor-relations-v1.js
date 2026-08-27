(()=>{
  const people={
    valentin:{name:'Валентин Лосев',slug:'valentin',portrait:'/assets/people/dementors/valentin/dementor_valentin.webp'},
    nikita:{name:'Никита',slug:'nikita',portrait:'/assets/people/dementors/nikita/dementor_nikita.webp'},
    evgeniy:{name:'Евгений',slug:'evgeniy',portrait:'/assets/people/dementors/evgeniy/dementor_evgeniy.webp'},
    gabil:{name:'Габиль',slug:'gabil',portrait:'/assets/people/dementors/gabil/dementor_gabil.webp'}
  };
  const ensureCss=()=>{if(!document.querySelector('link[href="/utility-v1.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/utility-v1.css';document.head.appendChild(l)}};
  const card=(key,label='ДЕМЕНТОР')=>{const p=people[key];const a=document.createElement('a');a.className='dc-dementor-link';a.href=`/community/${p.slug}/`;a.setAttribute('aria-label',`${label}: ${p.name}. Открыть профиль дементора`);a.innerHTML=`<img src="${p.portrait}" alt="${p.name} — Dementor Ink portrait" loading="lazy" decoding="async"><span class="dc-dementor-link__copy"><small>${label}</small><strong>${p.name}</strong><em>Открыть профиль →</em></span>`;return a};
  const add=(target,key,label,position='append')=>{if(!target||target.querySelector?.('.dc-dementor-link'))return;const c=card(key,label);position==='after'?target.insertAdjacentElement('afterend',c):position==='before'?target.insertAdjacentElement('beforebegin',c):target.appendChild(c)};
  const path=location.pathname;
  const onReady=()=>{
    ensureCss();
    if(path==='/'){
      const sections=[...document.querySelectorAll('.dc-event')];
      const course=sections.find(s=>s.querySelector('a[href="/courses/dumai-s-opasnostyu/"]'));
      const fuengirola=sections.find(s=>s.querySelector('a[href="/events/fuengirola/"]'));
      add(course?.querySelector('.dc-event__meta'),'valentin','ДЕМЕНТОР КУРСА');
      add(fuengirola?.querySelector('.dc-event__meta'),'gabil','ДЕМЕНТОР СОБЫТИЯ');
    }
    if(path==='/courses/dengi-na-veter/'){
      const host=document.querySelector('.money-actions')||document.querySelector('.money-hero-grid>div');add(host,'nikita','ДЕМЕНТОР КУРСА');
    }
    if(path==='/courses/slaboumie-i-otvaga/'){
      const host=document.querySelector('.dc-course-actions')||document.querySelector('.dc-course-hero-grid>div');add(host,'evgeniy','ДЕМЕНТОР КУРСА');
    }
    if(path==='/courses/dumai-s-opasnostyu/'){
      const master=document.querySelector('.master');if(master){master.textContent='';add(master,'valentin','ДЕМЕНТОР КУРСА')}
    }
    if(path==='/events/'){
      const row=document.querySelector('a[href="/events/fuengirola/"]');if(row&&!row.parentElement.querySelector('.dc-dementor-link'))row.insertAdjacentElement('afterend',card('gabil','ДЕМЕНТОР СОБЫТИЯ'));
    }
    if(path==='/events/fuengirola/'){
      const rel=document.querySelector('.dc-event-relations')||document.querySelector('.dc-event-detail__intro');add(rel,'gabil','ДЕМЕНТОР СОБЫТИЯ');
    }
    if(path==='/community/gabil/'){
      const main=document.querySelector('main');if(main&&!main.querySelector('a[href="/events/fuengirola/"]')){const s=document.createElement('section');s.className='dc-section';s.innerHTML='<div class="dc-shell dc-profile-grid"><div class="dc-profile-label"><p class="dc-kicker">06 / СОБЫТИЯ</p></div><div class="dc-profile-content"><a class="dc-profile-item" href="/events/fuengirola/" style="text-decoration:none;color:inherit"><span class="dc-profile-item__num">01</span><div><p class="dc-kicker">PLANNED / SPAIN</p><h3>Фуэнхирола</h3><p>Связанное мероприятие Dementor Club.</p><span class="dc-profile-back">Открыть событие →</span></div></a></div></div>';main.appendChild(s)}
    }
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',onReady,{once:true}):onReady();
})();
