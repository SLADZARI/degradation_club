const host=document.getElementById('reviewHost');
if(host){
  const applyState=()=>{
    host.querySelectorAll('.dcr-card').forEach(card=>{
      const own=[...card.querySelectorAll('.dcr-review-line')].find(row=>row.querySelector('span')?.textContent?.trim()==='Вы');
      if(!own)return;
      const decision=own.querySelector('strong')?.textContent?.trim()||'РЕШЕНИЕ СОХРАНЕНО';
      const form=card.querySelector('.dcr-review-form');
      if(!form)return;
      const actions=form.querySelector('.dcr-actions');
      if(actions)actions.hidden=true;
      const textarea=form.querySelector('textarea');
      if(textarea)textarea.disabled=true;
      if(!form.querySelector('.dcr-own-decision')){
        const approvals=[...card.querySelectorAll('.dcr-review-line strong')].filter(x=>x.textContent.trim()==='APPROVE').length;
        const state=document.createElement('div');
        state.className='dcr-own-decision';
        state.textContent=`ВАШЕ РЕШЕНИЕ: ${decision} ✓ · ${approvals} / 2 DEMENTORS`;
        form.appendChild(state);
      }
    });
  };
  new MutationObserver(applyState).observe(host,{childList:true,subtree:true});
  applyState();
}
