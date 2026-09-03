(()=>{
  if(typeof document==='undefined'||document.documentElement.dataset.dcGlobalFooter==='1')return;
  document.documentElement.dataset.dcGlobalFooter='1';
  const path=location.pathname.replace(/^\/degradation_club/,'');
  const privatePrefixes=['/workspace/','/community/board/','/community/artifact/','/join/apply/','/join/result/','/auth/callback/','/profile/'];
  if(privatePrefixes.some(prefix=>path.startsWith(prefix)))return;

  const install=()=>{
    const existing=[...document.querySelectorAll('footer')].find(el=>!el.classList.contains('dc-global-footer'))||document.querySelector('footer.dc-global-footer');
    let note='';
    if(existing){
      const noteNode=existing.querySelector('.dc-footer__line,.footer-right,.footer-meta,.meta');
      note=(noteNode?.textContent||'').trim().replace(/\s+/g,' ');
    }
    const footer=existing||document.createElement('footer');
    footer.className='dc-global-footer';
    footer.setAttribute('aria-label','Dementor Club footer');
    footer.innerHTML=`
      <div class="dc-global-footer__main">
        <a class="dc-global-footer__brand" href="/">DEMENTOR<span>CLUB</span></a>
        <nav class="dc-global-footer__nav" aria-label="Навигация в подвале">
          <a href="/about/">Club</a><a href="/events/">Events</a><a href="/projects/">Projects</a><a href="/community/">Community</a><a href="/merch/">Merch</a><a href="/archive/">Blog</a>
        </nav>
      </div>
      <div class="dc-global-footer__utility">
        <div class="dc-global-footer__links"><a href="/join/">Join</a><a href="/workspace/">Account</a><a href="/contacts/">Contacts</a><a href="/donate/">Support</a><a href="/legal/privacy/">Privacy</a><a href="/legal/terms/">Terms</a></div>
        <div class="dc-global-footer__note">${note||'DEMENTOR CLUB / PUBLIC SITE'}</div>
      </div>`;
    if(!existing)document.body.appendChild(footer);
    document.querySelectorAll('footer').forEach(el=>{if(el!==footer)el.remove()});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
