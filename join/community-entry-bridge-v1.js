(()=>{
  if(!/\/join\/?(?:index\.html)?$/.test(location.pathname))return;
  const STORAGE='dementorClubOnboardingV3';
  const SPHERES=['personality','work','consumption','relationships','control','information','self_development','meaning','technology'];
  const base=location.pathname.startsWith('/degradation_club/')?'/degradation_club':'';
  const destination=base+'/join/result/';
  const count=()=>{try{const state=JSON.parse(localStorage.getItem(STORAGE)||'null')||{};return SPHERES.filter(id=>state.results?.[id]?.date).length}catch{return 0}};
  const render=()=>{
    const done=count()===9;
    const actions=document.querySelector('#result .actions');
    let link=document.getElementById('dcCommunityEntryBridge');
    if(!done){link?.remove();return}
    if(actions&&!link){link=document.createElement('a');link.id='dcCommunityEntryBridge';link.className='button primary';link.href=destination;link.textContent='Карта 9/9 → Community';actions.appendChild(link)}
  };
  const observer=new MutationObserver(render);observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});
  window.addEventListener('storage',event=>{if(event.key===STORAGE)render()});
  render();setInterval(render,1200);
})();
