(()=>{
  'use strict';
  if(window.__DC_WORKSPACE_ANALYTICS_HOOK_V1__)return;
  window.__DC_WORKSPACE_ANALYTICS_HOOK_V1__=true;

  const classifyMemberState=()=>{
    const text=(document.querySelector('#appView .dcw-status-main')?.textContent||'').toUpperCase();
    if(text.includes('OWNER_ADMIN'))return 'owner_admin';
    if(text.includes('DEMENTOR'))return 'dementor';
    if(text.includes('ЧЛЕН DEMENTOR CLUB'))return 'member';
    return 'registered';
  };

  const announceReady=()=>{
    const sessionReady=document.querySelector('#sessionBox .dcw-session-profile');
    const appView=document.getElementById('appView');
    const statusReady=appView?.querySelector('.dcw-status-main');
    const blocked=appView?.querySelector('.dcw-gate,.dcw-denied,.dcw-error');
    if(!sessionReady||!appView||!statusReady||blocked)return false;

    const detail={member_state:classifyMemberState()};
    window.__DC_WORKSPACE_READY_DETAIL__=detail;
    window.dispatchEvent(new CustomEvent('dc:workspace-ready',{detail}));
    return true;
  };

  if(announceReady())return;
  const observer=new MutationObserver(()=>{if(announceReady())observer.disconnect();});
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  setTimeout(()=>observer.disconnect(),15000);
})();
