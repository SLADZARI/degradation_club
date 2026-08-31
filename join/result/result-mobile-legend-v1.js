(()=>{
  const stage=document.getElementById('radarStage');
  if(!stage)return;

  const render=()=>{
    const svg=stage.querySelector('svg');
    if(!svg)return;
    const labels=[...svg.querySelectorAll('.dc-radar-label')];
    const levels=[...svg.querySelectorAll('.dc-radar-level')];
    if(labels.length!==9||levels.length!==9)return;

    let legend=stage.querySelector('.dc-radar-mobile-legend');
    if(!legend){legend=document.createElement('div');legend.className='dc-radar-mobile-legend';legend.setAttribute('aria-label','Результаты девяти сфер');stage.appendChild(legend)}

    legend.innerHTML=labels.map((label,i)=>`<div class="dc-radar-mobile-legend__item"><span class="dc-radar-mobile-legend__num">${String(i+1).padStart(2,'0')}</span><span class="dc-radar-mobile-legend__title">${label.textContent||''}</span><span class="dc-radar-mobile-legend__level">${levels[i]?.textContent||'—'}</span></div>`).join('');
  };

  const observer=new MutationObserver(render);
  observer.observe(stage,{childList:true,subtree:true});
  render();
})();
