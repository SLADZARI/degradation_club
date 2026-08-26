window.DEMENTOR_SITE_CONFIG=Object.freeze({
  version:'2026-08-26',
  canonicalOrigin:'https://degradation-club.vercel.app',
  contacts:{
    enabled:false,
    endpoint:null,
    publicEmail:null,
    socialLinks:[]
  },
  donate:{
    enabled:false,
    provider:null,
    checkoutUrl:null,
    currency:null,
    recurring:false
  },
  merch:{
    catalogEnabled:true,
    checkoutEnabled:false,
    checkoutProvider:null,
    checkoutUrl:null
  },
  events:{
    registrationEnabled:false,
    registrationProvider:null,
    registrationUrl:null
  },
  community:{
    membershipEnabled:false,
    membershipProvider:null,
    membershipUrl:null
  },
  onboarding:{
    storageKey:'dementorClubOnboardingV3',
    storage:'localStorage'
  }
});
if(typeof document!=='undefined'){
  (()=>{
    if(!document.querySelector('link[href="/global-header.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/global-header.css';document.head.appendChild(l)}
    if(!document.querySelector('script[src="/global-header.js"]')){const s=document.createElement('script');s.src='/global-header.js';s.defer=true;document.head.appendChild(s)}
    if(!document.querySelector('script[src="/dementor-relations-v1.js"]')){const s=document.createElement('script');s.src='/dementor-relations-v1.js';s.defer=true;document.head.appendChild(s)}
    if(location.pathname==='/projects/logic-awareness/'&&!document.querySelector('script[src="/content-series-v1.js"]')){const s=document.createElement('script');s.src='/content-series-v1.js';s.defer=true;document.head.appendChild(s)}
  })();
}
