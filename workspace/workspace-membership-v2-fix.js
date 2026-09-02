const view=document.getElementById('appView');
if(view){
  const sync=()=>{
    const panel=view.querySelector('.dcw-membership-panel');
    const legacyButton=panel?.querySelector('[data-membership-info]');
    if(!panel||!legacyButton)return;
    const actions=legacyButton.closest('.dcw-actions-row');
    if(actions)actions.innerHTML='<a class="dcw-primary" href="../join/apply/">ПОДАТЬ ЗАЯВКУ →</a>';
    const legacyNote=panel.querySelector('[data-membership-note]');
    if(legacyNote){legacyNote.hidden=false;legacyNote.textContent='После DC-9 9/9 открывается Membership Application v2. Членство появляется только после двух независимых подтверждений Dementor.';}
  };
  new MutationObserver(sync).observe(view,{childList:true,subtree:true});
  sync();
}
