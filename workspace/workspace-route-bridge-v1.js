(()=>{
  if(typeof document==='undefined'||!location.pathname.includes('/workspace'))return;
  const rootPath=location.pathname.replace(/^\/degradation_club/,'');
  if(rootPath!=='/workspace/'&&rootPath!=='/workspace/index.html')return;

  const titles={home:'HOME',club:'MY CLUB',activity:'MY ACTIVITY',work:'MY WORK',profile:'MY PROFILE'};
  let applying=false;

  const apply=()=>{
    if(applying)return;
    const route=(location.hash||'#home').slice(1);
    if(!titles[route])return;
    const top=document.getElementById('topTitle');
    if(String(top?.textContent||'').trim()===titles[route])return;
    const control=document.querySelector(`.dcw-sidebar [data-route="${route}"]`);
    if(!control)return;
    applying=true;
    try{control.click();}finally{applying=false;}
  };

  // Module/defer Workspace controller is guaranteed to run before DOMContentLoaded.
  // Apply a direct #route once after boot; normal in-app clicks are owned by
  // workspace.js + workspace-shell-v1.js and must not be replayed by an observer.
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else queueMicrotask(apply);
  addEventListener('hashchange',apply);
})();
