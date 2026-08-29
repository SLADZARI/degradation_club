(()=>{
  const config=window.DEMENTOR_SITE_CONFIG?.community;
  if(!config?.membershipEnabled||!config?.boardUrl)return;
  const base=location.pathname.startsWith('/degradation_club/')?'/degradation_club':'';
  const url=base+config.boardUrl;
  const mount=()=>{
    if(document.getElementById('dcCommunityMemberBoardLink'))return;
    const host=document.querySelector('#create .create-side')||document.querySelector('#create .create-main')||document.querySelector('main');
    if(!host)return;
    const wrap=document.createElement('div');
    wrap.id='dcCommunityMemberBoardLink';
    wrap.style.marginTop='24px';
    wrap.innerHTML=`<a class="button primary" href="${url}">MEMBER BOARD / ACCESS AFTER JOIN →</a>`;
    host.appendChild(wrap);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
