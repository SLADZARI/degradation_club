(()=>{
  'use strict';
  if(window.__DC_PRODUCTION_ANALYTICS_V1__)return;
  window.__DC_PRODUCTION_ANALYTICS_V1__=true;

  const ORIGIN='https://dementor.club';
  const GA_ID='G-QTZY2GKZ4R';
  const CLARITY_ID='y9yuo1zabw';
  const CONSENT_KEY='dc_analytics_consent_v1';
  const ALLOWED_EVENTS=new Set([
    'join_start','join_sphere_open','assessment_complete','auth_start','auth_complete','workspace_open',
    'project_open','course_open','course_cta_click','event_open','event_cta_click','merch_open','merch_cta_click',
    'recommendation_click','external_community_click'
  ]);
  const BLOCKED_KEYS=/^(email|e_mail|name|full_name|phone|telephone|token|access_token|refresh_token|user_id|userid|supabase_id|answer|answers|free_text)$/i;
  const isProduction=location.origin===ORIGIN;
  const api={production:isProduction,ga4:false,clarity:false,consent:null,track:()=>false};
  window.DEMENTOR_ANALYTICS=api;
  if(!isProduction)return;

  const readConsent=()=>{try{return localStorage.getItem(CONSENT_KEY);}catch{return null;}};
  const writeConsent=value=>{try{localStorage.setItem(CONSENT_KEY,value);}catch{} api.consent=value;};
  const currentPath=()=>location.pathname+location.search+location.hash;
  const cleanParams=input=>{
    const output={source_page:location.pathname};
    if(!input||typeof input!=='object')return output;
    for(const [key,value] of Object.entries(input)){
      if(BLOCKED_KEYS.test(key)||value===undefined||value===null)continue;
      if(['string','number','boolean'].includes(typeof value))output[key]=value;
    }
    return output;
  };

  api.track=(eventName,params={})=>{
    if(!ALLOWED_EVENTS.has(eventName)||api.consent!=='granted'||typeof window.gtag!=='function')return false;
    window.gtag('event',eventName,cleanParams(params));
    return true;
  };

  let lastPage=null;
  const sendPageView=()=>{
    if(typeof window.gtag!=='function')return;
    const page=currentPath();
    if(page===lastPage)return;
    lastPage=page;
    window.gtag('event','page_view',{page_title:document.title,page_location:location.href,page_path:page});
  };

  const installNavigationTracking=()=>{
    if(window.__DC_ANALYTICS_NAV_TRACKING__)return;
    window.__DC_ANALYTICS_NAV_TRACKING__=true;
    const notify=()=>queueMicrotask(sendPageView);
    for(const method of ['pushState','replaceState']){
      const original=history[method];
      if(typeof original!=='function')continue;
      history[method]=function(...args){const result=original.apply(this,args);notify();return result;};
    }
    addEventListener('popstate',notify,{passive:true});
    addEventListener('hashchange',notify,{passive:true});
  };

  const loadGA4=()=>{
    if(api.ga4||document.querySelector('script[data-dc-ga4]'))return;
    api.ga4=true;
    window.dataLayer=window.dataLayer||[];
    window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
    window.gtag('js',new Date());
    window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    window.gtag('config',GA_ID,{send_page_view:false,anonymize_ip:true});
    const script=document.createElement('script');
    script.async=true;
    script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    script.dataset.dcGa4=GA_ID;
    script.addEventListener('load',()=>{sendPageView();installNavigationTracking();installSemanticTracking();},{once:true});
    document.head.appendChild(script);
  };

  const loadClarity=()=>{
    if(api.clarity||document.querySelector('script[data-dc-clarity]'))return;
    api.clarity=true;
    (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments);};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;t.dataset.dcClarity=i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,'clarity','script',CLARITY_ID);
  };

  const pathSlug=(prefix,path=location.pathname)=>{
    const rest=path.replace(prefix,'').split('/').filter(Boolean);
    return rest[rest.length-1]||null;
  };
  const routeEntity=path=>{
    if(/^\/projects\/[^/]+\/?$/.test(path))return ['project_open','project',pathSlug('/projects/',path),'direct'];
    if(/^\/(course|courses)\/[^/]+\/?$/.test(path))return ['course_open','course',pathSlug(path.startsWith('/courses/')?'/courses/':'/course/',path),'direct'];
    if(/^\/events\/[^/]+\/?$/.test(path))return ['event_open','event',pathSlug('/events/',path),'direct'];
    if(/^\/merch\/drop-[^/]+\/[^/]+\/?$/.test(path))return ['merch_open','merch',pathSlug('/merch/',path),'direct'];
    return null;
  };
  const seenOpen=new Set();
  const trackRouteEntity=()=>{
    const entity=routeEntity(location.pathname);
    if(!entity)return;
    const [eventName,entityType,entityId,placement]=entity;
    const key=`${eventName}:${entityId}:${location.pathname}`;
    if(seenOpen.has(key))return;
    seenOpen.add(key);
    api.track(eventName,{entity_type:entityType,entity_id:entityId,placement});
  };
  const tagClarityPage=()=>{
    if(typeof window.clarity!=='function')return;
    window.clarity('set','dc_page',location.pathname);
    const entity=routeEntity(location.pathname);
    if(entity){window.clarity('set','dc_entity_type',entity[1]);window.clarity('set','dc_entity_id',entity[2]);}
  };

  const linkPlacement=el=>{
    if(el.closest('[class*="recommend"],[data-recommendation]'))return 'contextual-recommendation';
    if(el.closest('header,.topbar,.nav'))return 'nav';
    if(el.closest('footer'))return 'footer';
    if(el.closest('[class*="hero"]'))return 'hero';
    if(el.closest('[class*="programme"]'))return 'event-programme';
    if(el.closest('[class*="grid"]'))return 'entity-grid';
    return 'content';
  };
  const entityFromHref=href=>{
    let url; try{url=new URL(href,location.href);}catch{return null;}
    if(url.origin!==location.origin)return {external:true,url};
    const p=url.pathname;
    if(/^\/projects\/[^/]+\/?$/.test(p))return {event:'project_open',type:'project',id:pathSlug('/projects/',p),url};
    if(/^\/(course|courses)\/[^/]+\/?$/.test(p))return {event:'course_open',type:'course',id:pathSlug(p.startsWith('/courses/')?'/courses/':'/course/',p),url};
    if(/^\/events\/[^/]+\/?$/.test(p))return {event:'event_open',type:'event',id:pathSlug('/events/',p),url};
    if(/^\/merch\/drop-[^/]+\/[^/]+\/?$/.test(p))return {event:'merch_open',type:'merch',id:pathSlug('/merch/',p),url};
    return {url};
  };
  const currentEntityContext=()=>routeEntity(location.pathname);
  const installSemanticTracking=()=>{
    if(window.__DC_SEMANTIC_TRACKING__)return;
    window.__DC_SEMANTIC_TRACKING__=true;
    trackRouteEntity();
    tagClarityPage();
    document.addEventListener('click',event=>{
      const el=event.target.closest('a,button,[role="button"]');
      if(!el)return;
      const placement=linkPlacement(el);
      const href=el.getAttribute('href');
      const text=(el.textContent||'').trim().slice(0,80);
      const ctaId=el.dataset.analyticsCta||el.id||undefined;

      if(href){
        const target=entityFromHref(href);
        if(target?.external){
          if(/(^|\.)t\.me$|(^|\.)telegram\.me$/i.test(target.url.hostname))api.track('external_community_click',{entity_type:'community',placement,cta_id:ctaId});
          return;
        }
        if(target?.event){
          if(placement==='contextual-recommendation')api.track('recommendation_click',{entity_type:target.type,entity_id:target.id,placement});
          api.track(target.event,{entity_type:target.type,entity_id:target.id,placement});
          return;
        }
        if(target?.url?.pathname==='/join/'&&location.pathname!='/join/'){
          api.track('join_start',{placement,cta_id:ctaId||'join'});
          return;
        }
      }

      const ctx=currentEntityContext();
      if(ctx&&el.closest('main')&&(el.matches('.primary,.button,.dc-action')||/открыть|запис|вступ|куп|получ/i.test(text))){
        const [,type,id]=ctx;
        if(type==='course')api.track('course_cta_click',{entity_type:type,entity_id:id,placement,cta_id:ctaId});
        if(type==='event')api.track('event_cta_click',{entity_type:type,entity_id:id,placement,cta_id:ctaId});
        if(type==='merch')api.track('merch_cta_click',{entity_type:type,entity_id:id,placement,cta_id:ctaId});
      }

      if(location.pathname==='/join/'&&el.closest('#sphereGrid')){
        const sphere=el.dataset.sphere||el.dataset.id||el.getAttribute('data-key')||el.id||undefined;
        api.track('join_sphere_open',{entity_type:'assessment',entity_id:sphere?String(sphere):'sphere',placement:'sphere-grid'});
      }
      if(location.pathname==='/join/'&&/войти|зарегистр|подключ/i.test(text))api.track('auth_start',{entity_type:'club',placement,cta_id:ctaId});
    },{capture:true,passive:true});
  };

  const enable=()=>{loadGA4();loadClarity();};
  const removePrompt=()=>document.getElementById('dc-analytics-consent')?.remove();
  const renderPrompt=()=>{
    if(document.getElementById('dc-analytics-consent'))return;
    const style=document.createElement('style');
    style.id='dc-analytics-consent-style';
    style.textContent='#dc-analytics-consent{position:fixed;z-index:2147483000;left:16px;right:16px;bottom:16px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:18px;align-items:center;padding:16px 18px;background:#111;color:#f2f0e8;border:1px solid rgba(242,240,232,.22);font:13px/1.35 Arial,sans-serif}#dc-analytics-consent p{margin:0;max-width:72ch}#dc-analytics-consent a{color:#d8ff3e}#dc-analytics-consent .dc-analytics-consent__actions{display:flex;gap:8px}#dc-analytics-consent button{appearance:none;border:1px solid #f2f0e8;background:transparent;color:#f2f0e8;min-height:42px;padding:0 14px;font:700 11px/1 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}#dc-analytics-consent button[data-consent="granted"]{background:#d8ff3e;border-color:#d8ff3e;color:#111}@media(max-width:700px){#dc-analytics-consent{grid-template-columns:1fr;gap:12px;left:10px;right:10px;bottom:10px}.dc-analytics-consent__actions{width:100%}#dc-analytics-consent button{flex:1}}';
    document.head.appendChild(style);
    const box=document.createElement('aside');
    box.id='dc-analytics-consent';
    box.setAttribute('role','dialog');
    box.setAttribute('aria-label','Настройки аналитики');
    box.innerHTML='<p>Мы используем обезличенную аналитику GA4 и Microsoft Clarity только после вашего согласия, чтобы понимать работу публичного сайта. <a href="/legal/privacy/">Privacy</a></p><div class="dc-analytics-consent__actions"><button type="button" data-consent="denied">Не разрешать</button><button type="button" data-consent="granted">Разрешить</button></div>';
    box.addEventListener('click',event=>{const button=event.target.closest('button[data-consent]');if(!button)return;const value=button.dataset.consent;writeConsent(value);removePrompt();if(value==='granted')enable();});
    document.body.appendChild(box);
  };
  const boot=()=>{const consent=readConsent();api.consent=consent;if(consent==='granted')enable();else if(consent!=='denied')renderPrompt();};
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot,{once:true}):boot();
})();
