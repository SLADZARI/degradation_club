(()=>{
  if(typeof document==='undefined')return;

  const entrySection=document.getElementById('entrySection');
  const entryHost=document.getElementById('entryHost');
  if(!entrySection||!entryHost)return;

  let requested=false;
  let publishing=false;
  let publishConfirmed=false;
  let previouslyFocused=null;
  let observer=null;
  let toastTimer=null;
  let backgroundSnapshot=null;

  // Only the existing Board wall and Workspace sidebar are outside the sheet.
  // Preserve each previous inert value so cancelling cannot unlock prior guards.
  function setModalBackgroundInert(lock){
    if(lock){
      if(backgroundSnapshot)return;
      backgroundSnapshot=[...document.querySelectorAll('.dcw-board-view > .dc-board-wall,.dcw-sidebar')]
        .map(node=>({node,wasInert:node.inert}));
      backgroundSnapshot.forEach(({node})=>{node.inert=true});
      return;
    }
    if(!backgroundSnapshot)return;
    backgroundSnapshot.forEach(({node,wasInert})=>{if(node.isConnected)node.inert=wasInert});
    backgroundSnapshot=null;
  }

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
    if(isOpen()){requested=false;return true}
    const focused=document.activeElement instanceof HTMLElement?document.activeElement:null;
    // Programmatic #openComposer click (Safari fallback) may leave focus on BODY.
    const validOpener=focused&&focused!==document.body&&focused.isConnected&&focused.getClientRects().length>0;
    previouslyFocused=validOpener?focused:document.querySelector('.dc-board-primary.is-visible button');
    entrySection.classList.add('is-composer-sheet-open');
    setModalBackgroundInert(true);
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
    setModalBackgroundInert(false);
    if(restoreFocus){
      // Restore the real opener, never a hidden spatial [data-slot].
      // A replaced opener falls back to the visible canonical Board action.
      const usable=el=>el instanceof HTMLElement&&el.isConnected&&!el.hidden
        &&!el.matches(':disabled,[aria-disabled="true"]')
        &&!el.closest('[hidden],[inert],[aria-hidden="true"]')
        &&getComputedStyle(el).visibility!=='hidden'
        &&getComputedStyle(el).display!=='none'
        &&el.getClientRects().length>0;
      const candidates=[
        previouslyFocused,
        document.querySelector('.dc-board-primary.is-visible button'),
        document.querySelector('.dc-spatial-controls [data-slot]'),
        document.querySelector('.dc-spatial-controls [data-mine]')
      ];
      for(const target of candidates){
        if(!usable(target))continue;
        try{target.focus({preventScroll:true})}catch{target.focus()}
        if(document.activeElement===target)break;
      }
    }
    previouslyFocused=null;
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

  // Publication may already be committed before Board's asynchronous refresh.
  // Only a *confirmed* publish event is allowed to show the success notice.
  window.addEventListener('dc:board:artifact-published',()=>{
    if(!publishing||!isOpen())return;
    publishConfirmed=true;
    showToast();
    focusPublishedArtifact();
  });

  function restorePublishControls(form){
    publishing=false;
    const action=form?.querySelector('#cancelComposer,#removeDraft');
    if(action&&action.dataset.publishPreviousLabel!==undefined){
      action.disabled=false;
      action.textContent=action.dataset.publishPreviousLabel;
      action.removeAttribute('data-publish-previous-label');
      action.removeAttribute('aria-label');
    }
    form?.removeAttribute('data-publish-in-flight');
  }

  function watchMutations(){
    observer=new MutationObserver(()=>{
      setSlotVocabulary();
      const root=composer();
      if(root){
        const form=root.querySelector('#artifactForm');
        if(form&&!form.dataset.sheetBound){
          form.dataset.sheetBound='1';
          form.addEventListener('submit',event=>{
            // Capture handles duplicates before Board's submit handler.
            // A first valid submit must reach Board's validation unchanged.
            if(publishing){event.preventDefault();event.stopImmediatePropagation();return}
          },true);
          form.addEventListener('submit',()=>{
            // Run on the same form in bubble phase AFTER board.js validates
            // synchronously and disables Submit, never in a capture microtask.
            // In particular, real submit-button clicks must lock Cancel before
            // the first asynchronous draft/publish RPC can complete.
            if(!form.isConnected||!isOpen()||publishing)return;
            if(!form.querySelector('button[type=submit]')?.disabled)return;
            publishing=true;
            publishConfirmed=false;
            form.dataset.publishInFlight='1';
            const action=form.querySelector('#cancelComposer,#removeDraft');
            if(action){
              action.dataset.publishPreviousLabel=action.textContent||'';
              action.disabled=true;
              action.textContent='ОТПРАВЛЯЕМ…';
              action.setAttribute('aria-label','Публикация выполняется. Дождитесь результата.');
            }
            const state=form.querySelector('#composerState');
            if(state){state.hidden=false;state.setAttribute('role','status');state.setAttribute('aria-live','polite')}
          });
        }
        // A definite failed RPC restores Cancel/Edit/Retry, but a confirmed
        // publish cannot be re-submitted if Board refresh later fails.
        const submit=form?.querySelector('button[type=submit]');
        if(publishing&&submit&&!submit.disabled){
          if(publishConfirmed){
            restorePublishControls(form);
            closeSheet({restoreFocus:true});
          }else restorePublishControls(form);
        }
        if(requested)openSheet();
        return;
      }
      if(isOpen()){
        const wasConfirmed=publishConfirmed;
        publishing=false;
        publishConfirmed=false;
        closeSheet({restoreFocus:!wasConfirmed});
      }
    });
    observer.observe(entryHost,{childList:true,subtree:true});
  }

  document.addEventListener('click',event=>{
    // The full-screen primary action clicks the existing hidden #openComposer
    // directly when [data-slot] is absent (e.g. Safari). Its normal handler
    // renders the form; flag that explicit intent before the DOM mutation.
    if(event.target.closest('#openComposer')&&!isOpen()){
      requested=true;
      return;
    }
    const slot=event.target.closest('.dc-spatial-controls [data-slot]');
    if(slot){
      event.preventDefault();
      event.stopImmediatePropagation();
      requestOpen();
      return;
    }
    if(event.target.closest('#cancelComposer')){
      if(publishing){
        // A networked publish cannot be cancelled by hiding its editor.
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      // Invalid/local-only edits still close without a success notification.
      publishConfirmed=false;
      setTimeout(()=>closeSheet(),0);
    }
  },true);

  document.addEventListener('keydown',event=>{
    if(!isOpen())return;
    if(event.key==='Escape'){
      event.preventDefault();
      if(publishing)return;
      const cancel=document.getElementById('cancelComposer');
      if(cancel)cancel.click();
      else closeSheet();
      return;
    }
    if(event.key!=='Tab')return;
    const list=focusables();if(!list.length)return;
    const first=list[0],last=list[list.length-1];
    // Clicking an inert backdrop can blur the editor to BODY without
    // activating any background control. Recover both keyboard directions.
    if(!composer()?.contains(document.activeElement)){
      event.preventDefault();
      (event.shiftKey?last:first).focus();
      return;
    }
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  });

  window.addEventListener('dc:board-spatial-ready',setSlotVocabulary);
  watchMutations();
  setTimeout(setSlotVocabulary,250);
})();
