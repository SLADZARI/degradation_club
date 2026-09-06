(()=>{
  if(typeof document==='undefined')return;
  let host=null;
  let attempts=0;

  function ensureHost(){
    const viewport=document.querySelector('.dc-spatial-viewport');
    if(!viewport)return null;
    host=viewport.querySelector('[data-board-personal-host]');
    if(!host){
      host=document.createElement('div');
      host.className='dc-board-personal-host';
      host.setAttribute('data-board-personal-host','1');
      host.setAttribute('aria-live','polite');
      viewport.appendChild(host);
    }
    return host;
  }

  function render(payload=window.DEMENTOR_BOARD_PERSONAL_CARD){
    const target=ensureHost();
    if(!target)return false;
    const html=String(payload?.html||'');
    target.innerHTML=html;
    target.hidden=!html;
    if(payload?.state)target.dataset.state=payload.state;
    return true;
  }

  function retry(){
    if(render())return;
    attempts+=1;
    if(attempts<40)setTimeout(retry,75);
  }

  window.addEventListener('dc:board-personal-state',event=>{
    if(!render(event.detail))setTimeout(()=>render(event.detail),50);
  });
  window.addEventListener('dc:board-spatial-ready',()=>render());
  retry();
})();
