(()=>{
  const CARD_SELECTOR='.dc-notice[data-artifact],.dc-projection[data-source-id]';
  const SHARE_SELECTOR='[data-board-share]';
  const feedbackTimers=new WeakMap();

  function pointInside(rect,x,y){return rect.width>0&&rect.height>0&&x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom}
  function visibleShare(button){
    if(!button||button.hidden)return false;
    const style=getComputedStyle(button);
    return style.display!=='none'&&style.visibility!=='hidden'&&Number(style.opacity||1)!==0;
  }
  function shareAtEvent(event){
    const direct=event.target?.closest?.(SHARE_SELECTOR);
    if(direct&&visibleShare(direct))return direct;
    const x=Number(event.clientX),y=Number(event.clientY);
    if(!Number.isFinite(x)||!Number.isFinite(y))return null;
    const card=event.target?.closest?.(CARD_SELECTOR);
    const local=card?.querySelector?.(`:scope > ${SHARE_SELECTOR}`)||card?.querySelector?.(SHARE_SELECTOR);
    if(local&&visibleShare(local)&&pointInside(local.getBoundingClientRect(),x,y))return local;
    for(const button of document.querySelectorAll(SHARE_SELECTOR)){
      if(visibleShare(button)&&pointInside(button.getBoundingClientRect(),x,y))return button;
    }
    return null;
  }
  function canonicalUrl(button){
    const node=button.closest(CARD_SELECTOR);if(!node)return null;
    const type=node.matches('.dc-notice[data-artifact]')?'artifact':'entity';
    const id=type==='artifact'?node.dataset.artifact:node.dataset.sourceId;if(!id)return null;
    const url=new URL(location.href);url.pathname='/workspace/board/';url.searchParams.set('focus',`${type}:${id}`);return url.href;
  }
  async function copyText(text){
    try{await navigator.clipboard.writeText(text);return true}catch{}
    const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch{}ta.remove();return ok;
  }
  function feedback(button,ok){
    const prior=feedbackTimers.get(button);if(prior)clearTimeout(prior);
    button.dataset.copyState=ok?'done':'error';button.textContent=ok?'СКОПИРОВАНО ✓':'НЕ УДАЛОСЬ';
    feedbackTimers.set(button,setTimeout(()=>{button.textContent='ПОДЕЛИТЬСЯ ↗';delete button.dataset.copyState;feedbackTimers.delete(button)},1600));
  }
  async function activate(button){const href=canonicalUrl(button);if(!href)return;feedback(button,await copyText(href))}

  document.addEventListener('pointerdown',event=>{if(!shareAtEvent(event))return;event.stopImmediatePropagation()},true);
  document.addEventListener('click',event=>{const button=shareAtEvent(event);if(!button)return;event.preventDefault();event.stopImmediatePropagation();void activate(button)},true);
})();
