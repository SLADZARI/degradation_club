// Dementor Club — workspace → canonical Community v1 entry compatibility.
(()=>{
  if(!location.pathname.includes('/workspace'))return;
  const base=location.pathname.startsWith('/degradation_club/')?'/degradation_club':'';
  const destination=base+'/join/result/';
  const root=document.getElementById('appView');
  if(!root)return;

  const decorate=()=>{
    const btn=root.querySelector('[data-membership-info]');
    if(!btn||btn.dataset.dcCommunityV1==='1')return;
    btn.dataset.dcCommunityV1='1';
    btn.textContent='ПРОДОЛЖИТЬ ВСТУПЛЕНИЕ →';
    const block=btn.closest('.dcw-panel,.dcw-card,.dcw-access-card')||btn.parentElement?.parentElement;
    const note=block?.querySelector('.dcw-note');
    if(note){note.hidden=false;note.textContent='Community v1: сначала проверяем карту DC-9. После 9/9 система попросит минимальную идентификацию и активирует membership автоматически.';}
  };

  document.addEventListener('click',event=>{
    const btn=event.target.closest?.('[data-membership-info]');
    if(!btn)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    location.assign(destination);
  },{capture:true});

  let queued=false;
  const schedule=()=>{
    if(queued)return;
    queued=true;
    queueMicrotask(()=>{queued=false;decorate()});
  };
  new MutationObserver(schedule).observe(root,{childList:true});
  decorate();
})();
