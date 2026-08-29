(()=>{
  'use strict';
  if(window.__DC_PRODUCTION_ANALYTICS_V1__)return;
  window.__DC_PRODUCTION_ANALYTICS_V1__=true;

  const ORIGIN='https://dementor.club';
  const GA_ID='G-QTZY2GKZ4R';
  const CLARITY_ID='y9yuo1zabw';
  const CONSENT_KEY='dc_analytics_consent_v1';
  const isProduction=location.origin===ORIGIN;
  const api={production:isProduction,ga4:false,clarity:false,consent:null};
  window.DEMENTOR_ANALYTICS=api;
  if(!isProduction)return;

  const readConsent=()=>{
    try{return localStorage.getItem(CONSENT_KEY);}catch{return null;}
  };
  const writeConsent=value=>{
    try{localStorage.setItem(CONSENT_KEY,value);}catch{}
    api.consent=value;
  };

  const currentPath=()=>location.pathname+location.search+location.hash;
  let lastPage=null;
  const sendPageView=()=>{
    if(typeof window.gtag!=='function')return;
    const page=currentPath();
    if(page===lastPage)return;
    lastPage=page;
    window.gtag('event','page_view',{
      page_title:document.title,
      page_location:location.href,
      page_path:page
    });
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
    script.addEventListener('load',()=>{sendPageView();installNavigationTracking();},{once:true});
    document.head.appendChild(script);
  };

  const loadClarity=()=>{
    if(api.clarity||document.querySelector('script[data-dc-clarity]'))return;
    api.clarity=true;
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments);};
      t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;t.dataset.dcClarity=i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,'clarity','script',CLARITY_ID);
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
    box.addEventListener('click',event=>{
      const button=event.target.closest('button[data-consent]');
      if(!button)return;
      const value=button.dataset.consent;
      writeConsent(value);
      removePrompt();
      if(value==='granted')enable();
    });
    document.body.appendChild(box);
  };

  const boot=()=>{
    const consent=readConsent();
    api.consent=consent;
    if(consent==='granted')enable();
    else if(consent!=='denied')renderPrompt();
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot,{once:true}):boot();
})();
