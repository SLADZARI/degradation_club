import {getCurrentProgram,trackCurrentProgramAction,announceCurrentProgram} from '/current-program-v1.js';

const host=document.getElementById('currentProgramHost');
if(host){
  const items=getCurrentProgram();
  host.innerHTML=items.map((item,index)=>`<article class="dc-current-program__card" data-thing-ref="${item.thingRef}" data-source-kind="${item.sourceKind}">
    <div class="dc-current-program__meta"><span>${String(index+1).padStart(2,'0')}</span><span>${item.stateLabel}</span></div>
    <h3>${item.title}</h3>
    <p class="dc-current-program__premise">${item.premise}</p>
    <p class="dc-current-program__truth">${item.currentTruth}</p>
    <a class="dc-current-program__action" data-current-program-action href="${item.href}" data-analytics-cta="current-program:${item.analyticsId}">${item.actionLabel} →</a>
  </article>`).join('');
  host.addEventListener('click',event=>{
    const link=event.target.closest('[data-current-program-action]');
    if(!link)return;
    const card=link.closest('[data-thing-ref]');
    const item=items.find(entry=>entry.thingRef===card?.dataset.thingRef);
    if(item)trackCurrentProgramAction(item,'current-program-home');
  });
  announceCurrentProgram('home');
}
