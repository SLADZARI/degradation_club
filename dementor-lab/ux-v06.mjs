/* DEMENTOR LAB UX / CAUSALITY PASS v0.6
   Presentation-only patch. No encounter rules are changed here. */

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

function relabelStaticUI(){
  const labels={
    '[data-part="hat"]':'ГОЛОВА',
    '[data-appearance-group="accessories"]':'АКСЕССУАРЫ',
    '[data-part="beard"]':'ЛИЦО',
    '[data-part="outfit"]':'ОДЕЖДА'
  };
  for(const [selector,text] of Object.entries(labels)){
    const el=$(selector); if(el) el.textContent=text;
  }
  const intro=$('.brain-intro');
  if(intro) intro.textContent='ВЫБЕРИ ГОТОВУЮ СХЕМУ ИЛИ СОБЕРИ СВОЮ.';
}

function mountCausalHint(){
  const toggle=$('#talk-tech-toggle');
  const tech=$('#talk-tech');
  if(!toggle||!tech||$('#causal-hint')) return;
  const hint=document.createElement('div');
  hint.id='causal-hint';
  hint.className='causal-hint';
  hint.hidden=true;
  hint.innerHTML='<b>ПОЧЕМУ ЭТО НЕ РАНДОМ?</b><br>Следующее событие выбирается из текущего состояния разговора: CONTACT, TENSION, BRAIN и памяти персонажа.';
  tech.insertAdjacentElement('afterend',hint);
  toggle.addEventListener('click',()=>{
    queueMicrotask(()=>{hint.hidden=tech.hidden;});
  });
}

function compactResult(){
  const card=$('.result-card');
  if(!card) return;
  let diag=$('#result-diagnostic');
  if(!diag){
    diag=document.createElement('div');
    diag.id='result-diagnostic';
    diag.className='result-diagnostic';
    diag.innerHTML='<div><small>ФАКТ</small><b id="diag-fact">—</b></div><div><small>ПАТТЕРН</small><b id="diag-pattern">—</b></div><div><small>МЕНЯЕМ</small><b id="diag-fix">—</b></div>';
    const title=$('#result-title');
    title?.insertAdjacentElement('afterend',diag);
  }
  const fact=$('#diag-fact'),pattern=$('#diag-pattern'),fix=$('#diag-fix');
  const title=($('#result-title')?.textContent||'').trim();
  const arc=($('#result-arc')?.textContent||'').trim();
  const node=($('#result-node')?.textContent||'').trim();
  if(fact) fact.textContent=title||'ЭКСПЕРИМЕНТ ЗАКОНЧЕН';
  if(pattern) pattern.textContent=arc||'СМОТРИ РАЗБОР НИЖЕ';
  if(fix) fix.textContent=node||'ОДНА ПРИЧИНА';
}

function observeResult(){
  const targets=['#result-title','#result-arc','#result-node'].map($).filter(Boolean);
  if(!targets.length) return;
  const observer=new MutationObserver(compactResult);
  targets.forEach(el=>observer.observe(el,{subtree:true,childList:true,characterData:true}));
  compactResult();
}

function simplifyRepeatCopy(){
  const root=$('#brain-graph');
  if(!root) return;
  const rewrite=()=>{
    $$('.brain-stack-node').forEach(node=>{
      const title=node.querySelector('.brain-stack-title')?.textContent?.trim().toUpperCase();
      if(title!=='REPEAT') return;
      const subtitle=node.querySelector('.brain-stack-subtitle');
      if(subtitle) subtitle.textContent='ЕСЛИ НЕ СРАБОТАЛО — ПОПРОБУЙ ЕЩЁ РАЗ';
      const route=node.querySelector('.brain-stack-route');
      if(route && !route.textContent.includes('ПОКА')) route.title='Повтор прекращается, когда цель реакции достигнута.';
    });
  };
  new MutationObserver(rewrite).observe(root,{subtree:true,childList:true});
  rewrite();
}

relabelStaticUI();
mountCausalHint();
observeResult();
simplifyRepeatCopy();
