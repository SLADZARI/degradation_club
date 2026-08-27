window.DEMENTOR_SITE_CONFIG=Object.freeze({
  version:'2026-08-27',
  canonicalOrigin:'https://degradation-club.vercel.app',
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
    if(!document.querySelector('link[href="/global-header.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/global-header.css';document.head.appendChild(l)}
    if(!document.querySelector('script[src="/global-header.js"]')){const s=document.createElement('script');s.src='/global-header.js';s.defer=true;document.head.appendChild(s)}
    if(!document.querySelector('script[src="/dementor-relations-v1.js"]')){const s=document.createElement('script');s.src='/dementor-relations-v1.js';s.defer=true;document.head.appendChild(s)}
    if(location.pathname==='/projects/logic-awareness/'&&!document.querySelector('script[src="/content-series-v1.js"]')){const s=document.createElement('script');s.src='/content-series-v1.js';s.defer=true;document.head.appendChild(s)}
  })();
}
