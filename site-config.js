window.DEMENTOR_SITE_CONFIG=Object.freeze({
  version:'2026-09-03.02',
  canonicalOrigin:'https://dementor.club',
  supabase:{
    enabled:true,
    url:'https://mmekfydwbvptbdatwitj.supabase.co',
    publishableKey:'sb_publishable_a7e_Ndwwii8lyt_xmezoVw_ijxfh_yg',
    authProvider:'google',
    assessmentVersion:'dc9-v1'
  },
  contacts:{enabled:false,endpoint:null,publicEmail:null,socialLinks:[]},
  donate:{enabled:false,provider:null,checkoutUrl:null,currency:null,recurring:false},
  merch:{catalogEnabled:true,cartEnabled:true,cartStorageKey:'dementorClubCartV1',checkoutEnabled:false,checkoutProvider:null,checkoutUrl:null,preorderPaymentMethod:null,runtimeSource:'supabase'},
  events:{registrationEnabled:false,registrationProvider:null,registrationUrl:null},
  community:{membershipEnabled:true,membershipProvider:'membership-review-v2',membershipUrl:'/join/apply/',boardUrl:'/community/board/',artifactMediaBucket:'dc-community-artifacts'},
  onboarding:{storageKey:'dementorClubOnboardingV3',storage:'localStorage',accountSync:true,authRequired:false,progressMap:true},
  internalTools:{enabled:true,holdMs:1200,path:'/workspace/admin/'}
});
if(typeof document!=='undefined'){
  (()=>{
    const cfg=window.DEMENTOR_SITE_CONFIG;
    const path=location.pathname;
    const addScript=(src,{module=false,key=null}={})=>{if(document.querySelector(`script[src="${src}"]`)||(key&&document.querySelector(`script[data-${key}]`)))return;const s=document.createElement('script');s.src=src;if(module)s.type='module';else s.defer=true;if(key)s.dataset[key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]='1';document.head.appendChild(s)};
    const addStyle=href=>{if(document.querySelector(`link[href="${href}"]`))return;const l=document.createElement('link');l.rel='stylesheet';l.href=href;document.head.appendChild(l)};
    const normalizeCanonicalMetadata=()=>{
      const canonical=cfg.canonicalOrigin.replace(/\/$/,'');const legacyOrigins=['https://degradation-club.vercel.app','https://sladzari.github.io/degradation_club'];
      document.querySelectorAll('meta[property="og:url"],meta[property="og:image"],meta[name="twitter:image"]').forEach(meta=>{const value=meta.getAttribute('content')||'';for(const legacy of legacyOrigins){if(value.startsWith(legacy)){meta.setAttribute('content',canonical+value.slice(legacy.length));break;}}});
      if(!document.querySelector('link[rel="canonical"]')){const link=document.createElement('link');link.rel='canonical';link.href=canonical+path.replace(/^\/degradation_club/,'');document.head.appendChild(link)}
    };
    normalizeCanonicalMetadata();
    addScript('/global-header.js');addStyle('/global-header.css');
    addScript('/global-footer.js');addStyle('/global-footer.css');
    addScript('/dementor-relations-v1.js');
    const isJoinAssessment=/\/join\/?(?:index\.html)?$/.test(path);
    const isCommunityRoot=/\/community\/?(?:index\.html)?$/.test(path);
    const interactiveAuthRequired=path.includes('/courses/dumai-s-opasnostyu/')||path.includes('/courses/dengi-na-veter/');
    if(interactiveAuthRequired)addScript('/required-auth-v1.js',{module:true});
    if(path.includes('/courses/dumai-s-opasnostyu/')||path.includes('/courses/dengi-na-veter/'))addScript('/program-account-sync-v1.js',{module:true});
    if(path.includes('/merch/')||path.includes('/objects/'))addScript('/merch-runtime-v1.js',{module:true});
    if(path.includes('/workspace')){addScript('/workspace-membership-link-v1.js?v=20260902-01');addScript('/workspace-owner-admin-tools-v1.js',{module:true});}
    if(isJoinAssessment){
      addScript('/dementor-account-sync-v8.js?v=20260828-17');
      addScript('/join-data-copy-v1.js?v=20260828-18');
      addScript('/join/community-entry-bridge-v1.js?v=20260830-01');
      if(cfg.onboarding?.progressMap)addScript('/join/join-progress-map-v2.js?v=20260829-01',{module:true});
    }
    if(isCommunityRoot&&cfg.community?.membershipEnabled)addScript('/community/community-member-entry-link-v1.js?v=20260830-01');
    if(path.endsWith('/projects/logic-awareness/'))addScript('/content-series-v1.js');

    const installInternalToolsHold=()=>{
      if(!cfg.internalTools?.enabled||document.documentElement.dataset.dcAdminHold==='1')return;
      document.documentElement.dataset.dcAdminHold='1';const targets=[...document.querySelectorAll('footer,.dc-utility-strip')];if(!targets.length)return;
      const destination=cfg.internalTools.path;
      targets.forEach(target=>{let timer=null,fired=false;const cancel=()=>{if(timer){clearTimeout(timer);timer=null;}};target.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'&&event.button!==0)return;fired=false;cancel();timer=setTimeout(()=>{timer=null;fired=true;if(navigator.vibrate)navigator.vibrate(35);location.assign(destination)},cfg.internalTools.holdMs||1200)});target.addEventListener('pointerup',cancel);target.addEventListener('pointercancel',cancel);target.addEventListener('pointerleave',cancel);target.addEventListener('click',event=>{if(!fired)return;event.preventDefault();event.stopImmediatePropagation();fired=false},{capture:true})});
    };
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installInternalToolsHold,{once:true});else installInternalToolsHold();
  })();
}
