(()=>{
  if(typeof document==='undefined')return;
  document.documentElement.classList.add('dc-board-fullscreen');
  document.body?.classList.add('dc-board-fullscreen-page');

  const boardHost=document.getElementById('boardHost');
  const filterHost=document.getElementById('boardFilters');
  const entrySection=document.getElementById('entrySection');

  function normalizeControls(){
    const viewport=document.querySelector('.dc-spatial-viewport');
    const controls=viewport?.querySelector('.dc-spatial-controls');
    if(!viewport||!controls)return false;
    if(filterHost&&filterHost.parentElement!==viewport)viewport.appendChild(filterHost);
    viewport.querySelector('[data-board-personal-host]')?.remove();
    document.querySelectorAll('[data-board-personal-host],.dc-board-personal-host').forEach(node=>node.remove());

    const slot=controls.querySelector('[data-slot]');
    const mine=controls.querySelector('[data-mine]');
    const available=Number(window.DEMENTOR_BOARD_ENTRY_STATUS?.artifact_slots_available||0);
    const consuming=Number(window.DEMENTOR_BOARD_ENTRY_STATUS?.artifact_slots_consuming||0);
    const membership=document.documentElement.dataset.dcWorkspaceMembership;

    if(membership==='active'){
      if(slot){
        if(available>0){slot.textContent='+ ПРИКОЛОТЬ';slot.setAttribute('aria-label','Приколоть новое объявление')}
        else if(consuming>0){slot.textContent='МОЁ ОБЪЯВЛЕНИЕ';slot.setAttribute('aria-label','Открыть моё объявление')}
      }
      if(mine)mine.hidden=true;
    }else{
      slot?.remove();
      mine?.remove();
    }
    return true;
  }

  function makeCardsOpenTargets(){
    if(!boardHost)return;
    boardHost.querySelectorAll('.dc-notice[data-artifact],.dc-projection[data-board-source="platform"]').forEach(card=>{
      if(card.dataset.boardOpenBound==='1')return;
      card.dataset.boardOpenBound='1';
      card.setAttribute('tabindex','0');
      card.setAttribute('role','button');
      const direct=card.querySelector('a[href*="/community/artifact/"],a.dc-board-action[href],a[href]');
      const href=direct?.getAttribute('href');
      if(href)card.dataset.boardOpenHref=href;
      const open=()=>{
        const target=card.dataset.boardOpenHref;
        if(target)location.href=target;
      };
      card.addEventListener('click',event=>{
        if(event.target.closest('a,button,input,textarea,select,dialog'))return;
        open();
      });
      card.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&!event.target.closest('a,button,input,textarea,select')){event.preventDefault();open()}});
    });
  }

  function refresh(){normalizeControls();makeCardsOpenTargets()}
  window.addEventListener('dc:board-spatial-ready',refresh);
  window.addEventListener('dc:workspace-state',()=>setTimeout(refresh,0));
  window.addEventListener('dc:board-projections-updated',makeCardsOpenTargets);
  window.addEventListener('dc:board-guest-read-ready',makeCardsOpenTargets);
  if(boardHost)new MutationObserver(()=>setTimeout(makeCardsOpenTargets,0)).observe(boardHost,{childList:true,subtree:true});
  if(entrySection)new MutationObserver(()=>setTimeout(normalizeControls,0)).observe(entrySection,{childList:true,subtree:true,attributes:true});
  let tries=0;const timer=setInterval(()=>{tries++;refresh();if(tries>40||document.querySelector('.dc-spatial-viewport'))clearInterval(timer)},75);
})();
