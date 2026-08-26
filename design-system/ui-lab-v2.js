(()=>{
  const filters=[...document.querySelectorAll('.lab-filter[data-filter]')];
  const rows=[...document.querySelectorAll('#entityRegister .lab-register-row[data-kind]')];
  filters.forEach(button=>button.addEventListener('click',()=>{
    const kind=button.dataset.filter;
    filters.forEach(x=>x.classList.toggle('is-active',x===button));
    rows.forEach(row=>{row.hidden=kind!=='all'&&row.dataset.kind!==kind;});
  }));

  const previewData={
    '/events/fuengirola/':{src:'/assets/ink/event-fuengirola-03.webp',label:'EVENT / PLANNED',title:'ФУЭНХИРОЛА',meta:'FUENGIROLA / SPAIN · ACCESS AFTER JOIN'},
    '/projects/logic-awareness/':{src:'/assets/ink/logic-awareness-03.webp',label:'PROJECT / ACTIVE',title:'ЛОГИКА И ОСОЗНАННОСТЬ',meta:'PROJECT-001 · LOCAL SUBSYSTEM'},
    '/community/valentin/':{src:'/assets/people/dementors/valentin/portrait-ink.webp',label:'DEMENTOR / ACTIVE',title:'ВАЛЕНТИН ЛОСЕВ',meta:'DEMENTOR-001 · COURSE-001'},
    '/community/nikita/':{src:'/assets/people/dementors/nikita/portrait-ink.webp',label:'DEMENTOR',title:'НИКИТА',meta:'DEMENTOR-002 · CONTENT PENDING'},
    '/community/evgeniy/':{src:'/assets/people/dementors/evgeniy/portrait-ink.webp',label:'DEMENTOR',title:'ЕВГЕНИЙ',meta:'DEMENTOR-003 · CONTENT PENDING'},
    '/community/gabil/':{src:'/assets/people/dementors/gabil/portrait-ink.webp',label:'DEMENTOR',title:'ГАБИЛЬ',meta:'DEMENTOR-004 · EVENT-001'},
    '/courses/dumai-s-opasnostyu/':{src:null,label:'COURSE / ACTIVE PRODUCTION',title:'ДУМАЙ С ОПАСНОСТЬЮ',meta:'COURSE-001 · WEB SELF-PACED · 7 MODULES'}
  };
  const finePointer=()=>matchMedia('(hover:hover) and (pointer:fine)').matches;
  const mobile=()=>matchMedia('(max-width:700px)').matches;
  const live=document.createElement('aside');
  live.className='lab-live-preview';
  live.setAttribute('aria-hidden','true');
  document.body.appendChild(live);
  const fill=(row)=>{
    const href=new URL(row.getAttribute('href'),location.origin).pathname;
    const data=previewData[href];
    if(!data)return false;
    live.innerHTML=`${data.src?`<img src="${data.src}" alt="">`:''}<div class="lab-live-preview__copy"><span>${data.label}</span><strong>${data.title}</strong><small>${data.meta}</small></div>`;
    live.classList.toggle('is-text-only',!data.src);
    return true;
  };
  const show=row=>{if(fill(row)){live.classList.add('is-open');live.setAttribute('aria-hidden','false');}};
  const hide=()=>{live.classList.remove('is-open');live.setAttribute('aria-hidden','true');};
  rows.forEach(row=>{
    row.addEventListener('mouseenter',()=>{if(finePointer()&&!mobile())show(row);});
    row.addEventListener('mouseleave',hide);
    row.addEventListener('focus',()=>{if(!mobile())show(row);});
    row.addEventListener('blur',hide);
    row.addEventListener('click',event=>{
      if(!mobile())return;
      if(row.dataset.labReveal==='1')return;
      event.preventDefault();
      document.querySelectorAll('#entityRegister .lab-register-row[data-lab-reveal="1"]').forEach(openRow=>{
        openRow.dataset.labReveal='0';
        const detail=openRow.nextElementSibling;
        if(detail?.classList.contains('lab-register-mobile-detail'))detail.remove();
      });
      const href=new URL(row.getAttribute('href'),location.origin).pathname;
      const data=previewData[href];
      if(!data)return;
      row.dataset.labReveal='1';
      const detail=document.createElement('div');
      detail.className='lab-register-mobile-detail is-open';
      detail.innerHTML=`${data.src?`<img src="${data.src}" alt="">`:''}<span>${data.label}</span><strong>${data.title}</strong><small>${data.meta}</small><b>TAP ROW AGAIN TO OPEN →</b>`;
      row.insertAdjacentElement('afterend',detail);
    });
  });

  document.querySelectorAll('.lab-question .lab-choice:not(:disabled)').forEach(choice=>{
    choice.addEventListener('click',()=>{
      const group=choice.closest('.lab-control-grid');
      group?.querySelectorAll('.lab-choice').forEach(other=>other.classList.remove('is-selected'));
      choice.classList.add('is-selected');
    });
  });
})();
