// Dementor Club — Workspace → Membership v2 compatibility link.
(()=>{
  if(!location.pathname.includes('/workspace'))return;
  const base=location.pathname.startsWith('/degradation_club/')?'/degradation_club':'';
  const destination=base+'/join/apply/';
  const root=document.getElementById('appView');
  if(!root)return;

  const decorate=()=>{
    const btn=root.querySelector('[data-membership-info]');
    if(!btn||btn.dataset.dcMembershipV2==='1')return;
    btn.dataset.dcMembershipV2='1';
    btn.textContent='ПОДАТЬ ЗАЯВКУ →';
    const block=btn.closest('.dcw-panel,.dcw-card,.dcw-access-card')||btn.parentElement?.parentElement;
    const note=block?.querySelector('.dcw-note');
    if(note){note.hidden=false;note.textContent='После DC-9 9/9 открывается Membership Application. Членство появляется только после двух независимых подтверждений Dementor.';}
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
