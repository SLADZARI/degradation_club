(()=>{
  if(typeof document==='undefined')return;

  const entrySection=document.getElementById('entrySection');
  const entryHost=document.getElementById('entryHost');
  if(!entrySection||!entryHost)return;

  let requested=false;
  let publishing=false;
  let previouslyFocused=null;
  let observer=null;
  let toastTimer=null;

  function composer(){return entryHost.querySelector('.dc-composer')}
  function isOpen(){return entrySection.classList.contains('is-composer-sheet-open')}
  function focusables(){
    const root=composer();
    if(!root)return[];
    return [...root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>!el.hidden&&el.offsetParent!==null);
  }

  function setSlotVocabulary(){
    const slot=document.querySelector('.dc-spatial-controls [data-slot]');
    if(!slot)return;
    const hasOpen=!!document.getElementById('openComposer');
    const hasComposer=!!composer();
    if(hasOpen||hasComposer){
      slot.textContent='+ ПРИКОЛОТЬ';
      slot.setAttribute('aria-label','Приколоть новое объявление на доску');
      slot.removeAttribute('aria-disabled');
    }
  }

  function openSheet(){
    const root=composer();
    if(!root)return false;
    previouslyFocused=document.activeElement instanceof HTMLElement?document.activeElement:null;
    entrySection.classList.add('is-composer-sheet-open');
    entrySection.setAttribute('role','dialog');
    entrySection.setAttribute('aria-modal','true');
    entrySection.setAttribute('aria-label','Приколоть объявление на доску');
    document.documentElement.classList.add('dc-composer-sheet-open');
    requested=false;
    requestAnimationFrame(()=>{
      const preferred=root.querySelector('#artifactBody')||focusables()[0];
      try{preferred?.focus({preventScroll:true})}catch{preferred?.focus()}
    });
    return true;
  }

  function closeSheet({restoreFocus=true}={}){
    if(!isOpen())return;
    entrySection.classList.remove('is-composer-sheet-open');
    entrySection.removeAttribute('role');
    entrySection.removeAttribute('aria-modal');
    entrySection.removeAttribute('aria-label');
    document.documentElement.classList.remove('dc-composer-sheet-open');
    requested=false;
    if(restoreFocus){
      const target=document.querySelector('.dc-spatial-controls [data-slot]')||previouslyFocused;
      try{target?.focus({preventScroll:true})}catch{target?.focus()}
    }
  }

  function showToast(text='ПРИКОЛОЧЕНО'){
    let toast=document.querySelector('[data-board-toast]');
    if(!toast){
      toast=document.createElement('div');
      toast.className='dc-board-toast';
      toast.setAttribute('data-board-toast','1');
      toast.setAttribute('role','status');
      toast.setAttribute('aria-live','polite');
      document.body.appendChild(toast);
    }
    toast.textContent=text;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toast.classList.remove('is-visible'),1800);
  }

  function focusPublishedArtifact(){
    setTimeout(()=>{
      const mine=document.querySelector('.dc-spatial-world .dc-notice [data-close-artifact]')?.closest('.dc-notice');
      if(mine){
        mine.classList.add('is-camera-focus');
        const mineControl=document.querySelector('.dc-spatial-controls [data-mine]');
        mineControl?.click();
        setTimeout(()=>mine.classList.remove('is-camera-focus'),1400);
      }
    },320);
  }

  function requestOpen(){
    requested=true;
    const existing=composer();
    if(existing){openSheet();return}
    const openButton=document.getElementById('openComposer');
    if(openButton){openButton.click();return}
    requested=false;
    document.querySelector('.dc-spatial-controls [data-mine]')?.click();
  }

  function watchMutations(){
    observer=new MutationObserver(()=>{
      setSlotVocabulary();
      const root=composer();
      if(root){
        const form=root.querySelector('#artifactForm');
        if(form&&!form.dataset.sheetBound){
          form.dataset.sheetBound='1';
          form.addEventListener('submit',()=>{publishing=true},{capture:true});
        }
        if(requested)openSheet();
        return;
      }
      if(isOpen()){
        const wasPublishing=publishing;
        publishing=false;
        closeSheet({restoreFocus:!wasPublishing});
        if(wasPublishing){showToast();focusPublishedArtifact()}
      }
    });
    observer.observe(entryHost,{childList:true,subtree:true});
  }

  document.addEventListener('click',event=>{
    const slot=event.target.closest('.dc-spatial-controls [data-slot]');
    if(slot){
      event.preventDefault();
      event.stopImmediatePropagation();
      requestOpen();
      return;
    }
    if(event.target.closest('#cancelComposer'))setTimeout(()=>closeSheet(),0);
  },true);

  document.addEventListener('keydown',event=>{
    if(!isOpen())return;
    if(event.key==='Escape'){
      event.preventDefault();
      const cancel=document.getElementById('cancelComposer');
      if(cancel)cancel.click();
      else closeSheet();
      return;
    }
    if(event.key!=='Tab')return;
    const list=focusables();if(!list.length)return;
    const first=list[0],last=list[list.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  });

  window.addEventListener('dc:board-spatial-ready',setSlotVocabulary);
  watchMutations();
  setTimeout(setSlotVocabulary,250);
})();
