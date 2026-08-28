window.DEMENTOR_SITE_CONFIG=Object.freeze({
  version:'2026-08-28.6',
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
    const debug=new URLSearchParams(location.search).get('auth_debug')==='1';
    if(debug){
      const mount=()=>{
        if(document.getElementById('dc-auth-debug-loader')||document.getElementById('dc-auth-debug'))return;
        const el=document.createElement('div');el.id='dc-auth-debug-loader';el.textContent='AUTH DEBUG · site-config OK · runtime v5 loading…';
        Object.assign(el.style,{position:'fixed',right:'10px',bottom:'10px',zIndex:'2147483647',background:'#0d0d0d',color:'#7bff00',border:'1px solid #7bff00',padding:'8px 10px',font:'12px ui-monospace,SFMono-Regular,Menlo,monospace'});
        document.body.appendChild(el);
      };
      if(document.body)mount();else document.addEventListener('DOMContentLoaded',mount,{once:true});
    }
    if(!document.querySelector('link[href="/global-header.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/global-header.css';document.head.appendChild(l)}
    if(!document.querySelector('script[src="/global-header.js"]')){const s=document.createElement('script');s.src='/global-header.js';s.defer=true;document.head.appendChild(s)}
    if(!document.querySelector('script[src="/dementor-relations-v1.js"]')){const s=document.createElement('script');s.src='/dementor-relations-v1.js';s.defer=true;document.head.appendChild(s)}
    if(location.pathname.includes('/join')&&!document.querySelector('script[data-dc-account-sync-v5]')){const s=document.createElement('script');s.src='/dementor-account-sync-v5.js?v=20260828-6';s.defer=true;s.dataset.dcAccountSyncV5='20260828-6';document.head.appendChild(s)}
    if(location.pathname.endsWith('/projects/logic-awareness/')&&!document.querySelector('script[src="/content-series-v1.js"]')){const s=document.createElement('script');s.src='/content-series-v1.js';s.defer=true;document.head.appendChild(s)}
  })();
}
