window.DEMENTOR_SITE_CONFIG=Object.freeze({
  version:'2026-08-28.13',
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
  onboarding:{storageKey:'dementorClubOnboardingV3',storage:'localStorage',accountSync:true}
});
if(typeof document!=='undefined'){
  (()=>{
    if(location.pathname.includes('/join')){
      const params=new URLSearchParams(location.search);
      if(params.get('authdebug')==='1')sessionStorage.setItem('dcAuthDebug','1');
      else if(sessionStorage.getItem('dcAuthDebug')==='1'){
        params.set('authdebug','1');
        const q=params.toString();
        history.replaceState({},'',location.pathname+(q?'?'+q:'')+location.hash);
      }
    }
    if(!document.querySelector('link[href="/global-header.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/global-header.css';document.head.appendChild(l)}
    if(!document.querySelector('script[src="/global-header.js"]')){const s=document.createElement('script');s.src='/global-header.js';s.defer=true;document.head.appendChild(s)}
    if(!document.querySelector('script[src="/dementor-relations-v1.js"]')){const s=document.createElement('script');s.src='/dementor-relations-v1.js';s.defer=true;document.head.appendChild(s)}
    if(location.pathname.includes('/join')&&!document.querySelector('script[data-dc-account-sync-v7]')){
      const a=document.createElement('script');a.src='/dementor-account-sync-v7.js?v=20260828-13';a.defer=true;a.dataset.dcAccountSyncV7='20260828-13';document.head.appendChild(a);
    }
    if(location.pathname.endsWith('/projects/logic-awareness/')&&!document.querySelector('script[src="/content-series-v1.js"]')){const s=document.createElement('script');s.src='/content-series-v1.js';s.defer=true;document.head.appendChild(s)}
  })();
}
