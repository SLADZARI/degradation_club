window.DEMENTOR_SITE_CONFIG=Object.freeze({
  version:'2026-08-28.19',
  canonicalOrigin:'https://sladzari.github.io/degradation_club',
  supabase:{
    enabled:true,
    url:'https://mmekfydwbvptbdatwitj.supabase.co',
    publishableKey:'sb_publishable_a7e_Ndwwii8lyt_xmezoVw_ijxfh_yg',
    authProvider:'google',
    assessmentVersion:'dc9-v1'
  },
  contacts:{enabled:false,endpoint:null,publicEmail:null,socialLinks:[]},
  donate:{enabled:false,provider:null,checkoutUrl:null,currency:null,recurring:false},
  merch:{catalogEnabled:true,cartEnabled:true,cartStorageKey:'dementorClubCartV1',checkoutEnabled:false,checkoutProvider:null,checkoutUrl:null,preorderPaymentMethod:null},
  events:{registrationEnabled:false,registrationProvider:null,registrationUrl:null},
  community:{membershipEnabled:false,membershipProvider:null,membershipUrl:null},
  onboarding:{storageKey:'dementorClubOnboardingV3',storage:'localStorage',accountSync:true},
  internalTools:{enabled:true,holdMs:1200,path:'/design-system/admin/'}
});
if(typeof document!=='undefined'){
  (()=>{
    const cfg=window.DEMENTOR_SITE_CONFIG;
    const normalizeCanonicalMetadata=()=>{
      const canonical=cfg.canonicalOrigin.replace(/\/$/,'');
      const legacy='https://degradation-club.vercel.app';
      document.querySelectorAll('meta[property="og:url"],meta[property="og:image"],meta[name="twitter:image"]').forEach(meta=>{
        const value=meta.getAttribute('content')||'';
        if(value.startsWith(legacy))meta.setAttribute('content',canonical+value.slice(legacy.length));
      });
      if(!document.querySelector('link[rel="canonical"]')&&location.origin.includes('sladzari.github.io')){
        const link=document.createElement('link');link.rel='canonical';link.href=canonical+location.pathname.replace(/^\/degradation_club/,'');document.head.appendChild(link);
      }
    };
    normalizeCanonicalMetadata();
    if(!document.querySelector('link[href="/global-header.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/global-header.css';document.head.appendChild(l)}
    if(!document.querySelector('script[src="/global-header.js"]')){const s=document.createElement('script');s.src='/global-header.js';s.defer=true;document.head.appendChild(s)}
    if(!document.querySelector('script[src="/dementor-relations-v1.js"]')){const s=document.createElement('script');s.src='/dementor-relations-v1.js';s.defer=true;document.head.appendChild(s)}
    if(location.pathname.includes('/join')){
      if(!document.querySelector('script[data-dc-account-sync-v8]')){const a=document.createElement('script');a.src='/dementor-account-sync-v8.js?v=20260828-17';a.defer=true;a.dataset.dcAccountSyncV8='20260828-17';document.head.appendChild(a)}
      if(!document.querySelector('script[data-dc-join-data-copy]')){const c=document.createElement('script');c.src='/join-data-copy-v1.js?v=20260828-18';c.defer=true;c.dataset.dcJoinDataCopy='20260828-18';document.head.appendChild(c)}
    }
    if(location.pathname.endsWith('/projects/logic-awareness/')&&!document.querySelector('script[src="/content-series-v1.js"]')){const s=document.createElement('script');s.src='/content-series-v1.js';s.defer=true;document.head.appendChild(s)}

    const installInternalToolsHold=()=>{
      if(!cfg.internalTools?.enabled||document.documentElement.dataset.dcAdminHold==='1')return;
      document.documentElement.dataset.dcAdminHold='1';
      const targets=[...document.querySelectorAll('footer,.dc-utility-strip')];
      if(!targets.length)return;
      const base=location.pathname.startsWith('/degradation_club/')?'/degradation_club':'';
      const destination=base+cfg.internalTools.path;
      targets.forEach(target=>{
        let timer=null,fired=false;
        const cancel=()=>{if(timer){clearTimeout(timer);timer=null;}};
        target.addEventListener('pointerdown',event=>{
          if(event.pointerType==='mouse'&&event.button!==0)return;
          fired=false;cancel();
          timer=setTimeout(()=>{timer=null;fired=true;if(navigator.vibrate)navigator.vibrate(35);location.assign(destination);},cfg.internalTools.holdMs||1200);
        });
        target.addEventListener('pointerup',cancel);target.addEventListener('pointercancel',cancel);target.addEventListener('pointerleave',cancel);
        target.addEventListener('click',event=>{if(!fired)return;event.preventDefault();event.stopImmediatePropagation();fired=false;},{capture:true});
      });
    };
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installInternalToolsHold,{once:true});else installInternalToolsHold();
  })();
}
