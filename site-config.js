window.DEMENTOR_SITE_CONFIG=Object.freeze({
  version:'2026-08-28.14',
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
  merch:{catalogEnabled:true,cartEnabled:true,cartStorageKey:'dementorClubCartV1',checkoutEnabled:false,checkoutProvider:null,checkoutUrl:null,preorderPaymentMethod:'BLIK'},
  events:{registrationEnabled:false,registrationProvider:null,registrationUrl:null},
  community:{membershipEnabled:false,membershipProvider:null,membershipUrl:null},
  onboarding:{storageKey:'dementorClubOnboardingV3',storage:'localStorage',accountSync:true},
  internalTools:{enabled:true,holdMs:1200,path:'/design-system/admin/'}
});
if(typeof document!=='undefined'){
  (()=>{
    const cfg=window.DEMENTOR_SITE_CONFIG;
    if(!document.querySelector('link[href="/global-header.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/global-header.css';document.head.appendChild(l)}
    if(!document.querySelector('script[src="/global-header.js"]')){const s=document.createElement('script');s.src='/global-header.js';s.defer=true;document.head.appendChild(s)}
    if(!document.querySelector('script[src="/dementor-relations-v1.js"]')){const s=document.createElement('script');s.src='/dementor-relations-v1.js';s.defer=true;document.head.appendChild(s)}
    if(location.pathname.includes('/join')&&!document.querySelector('script[data-dc-account-sync-v7]')){
      const a=document.createElement('script');a.src='/dementor-account-sync-v7.js?v=20260828-14';a.defer=true;a.dataset.dcAccountSyncV7='20260828-14';document.head.appendChild(a);
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
          timer=setTimeout(()=>{
            timer=null;fired=true;
            if(navigator.vibrate)navigator.vibrate(35);
            location.assign(destination);
          },cfg.internalTools.holdMs||1200);
        });
        target.addEventListener('pointerup',cancel);
        target.addEventListener('pointercancel',cancel);
        target.addEventListener('pointerleave',cancel);
        target.addEventListener('click',event=>{if(!fired)return;event.preventDefault();event.stopImmediatePropagation();fired=false;},{capture:true});
      });
    };
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installInternalToolsHold,{once:true});else installInternalToolsHold();
  })();
}
