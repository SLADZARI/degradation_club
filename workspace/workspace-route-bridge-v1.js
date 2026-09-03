(()=>{
  if(typeof document==='undefined'||!location.pathname.includes('/workspace'))return;
  const rootPath=location.pathname.replace(/^\/degradation_club/,'');
  if(rootPath!=='/workspace/'&&rootPath!=='/workspace/index.html')return;
  const allowed=new Set(['home','club','activity','work','profile']);
  let pending=false;
  const apply=()=>{
    if(pending)return;pending=true;
    queueMicrotask(()=>{
      pending=false;
      const route=(location.hash||'#home').slice(1);
      if(!allowed.has(route))return;
      const button=document.querySelector(`#appView [data-route="${route}"]`)||document.querySelector(`.dcw-sidebar [data-route="${route}"]`);
      const top=document.getElementById('topTitle');
      const current=String(top?.textContent||'').trim().toLowerCase().replaceAll(' ','');
      if(button&&current!==route.replaceAll('my',''))button.click();
    });
  };
  addEventListener('hashchange',apply);
  new MutationObserver(apply).observe(document.getElementById('appView')||document.body,{childList:true,subtree:true});
  apply();
})();
