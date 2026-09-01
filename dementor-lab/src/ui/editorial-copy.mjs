const overlay=document.querySelector('#overlay');
const replayNote=document.querySelector('#replay-note');

function rewriteOverlay(){
  if(!overlay||overlay.hidden)return;
  const kicker=overlay.querySelector('.kicker')?.textContent?.trim();
  const heading=overlay.querySelector('h3');
  const paragraph=overlay.querySelector('.overlay-card > p:not(.kicker)');
  if(kicker==='HOT PATCH'){
    if(heading)heading.textContent='РАЗГОВОР ПРОДОЛЖАЕТСЯ САМ.';
    if(paragraph)paragraph.textContent='Похоже, одна и та же цепочка собирается сработать ещё раз.';
    const skip=overlay.querySelector('[data-patch="skip"]');
    if(skip)skip.textContent='ОСТАВИТЬ КАК ЕСТЬ';
  }
  if(kicker==='TRACE'){
    if(heading)heading.textContent='КАК МЫ СЮДА ДОШЛИ?';
  }
}

function rewriteReplay(){
  if(!replayNote||replayNote.hidden)return;
  replayNote.textContent=replayNote.textContent
    .replace('КОНТРФАКТ:','ТОТ ЖЕ РАЗГОВОР.')
    .replace('СОПЕРНИК ТОТ ЖЕ.','СОБЕСЕДНИК ТОТ ЖЕ.');
}

const observer=new MutationObserver(()=>{rewriteOverlay();rewriteReplay()});
observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden']});
rewriteOverlay();rewriteReplay();
