(()=>{
  const cfg=window.DEMENTOR_SITE_CONFIG||{};
  const origin=cfg.canonicalOrigin;
  if(origin){
    try{
      const canonical=new URL(location.pathname,origin).href;
      let link=document.querySelector('link[rel="canonical"]');
      if(!link){link=document.createElement('link');link.rel='canonical';document.head.appendChild(link);}
      link.href=canonical;
      let og=document.querySelector('meta[property="og:url"]');
      if(!og){og=document.createElement('meta');og.setAttribute('property','og:url');document.head.appendChild(og);}
      og.setAttribute('content',canonical);
    }catch(e){}
  }

  if(!document.querySelector('link[href="/accessibility-v1.css"]')){
    const css=document.createElement('link');css.rel='stylesheet';css.href='/accessibility-v1.css';document.head.appendChild(css);
  }
  if(!document.querySelector('script[src="/ink-layout-v2.js"]')){
    const ink=document.createElement('script');ink.src='/ink-layout-v2.js';ink.defer=true;document.head.appendChild(ink);
  }

  const main=document.querySelector('main');
  if(main&&!main.id)main.id='main-content';
  if(main&&!document.querySelector('.dc-skip-link')){
    const skip=document.createElement('a');skip.className='dc-skip-link';skip.href='#main-content';skip.textContent='К содержанию';document.body.prepend(skip);
  }

  document.querySelectorAll('.nav a').forEach(a=>{
    const href=a.getAttribute('href');if(!href||href.startsWith('#'))return;
    try{
      const target=new URL(href,location.origin).pathname;
      const active=target==='/'?location.pathname==='/' : location.pathname.startsWith(target);
      if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    }catch(e){}
  });

  const menu=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.nav');
  if(menu&&nav){
    if(!nav.id)nav.id='primary-navigation';
    menu.setAttribute('aria-controls',nav.id);
  }

  if(location.pathname.startsWith('/join')){
    const ensureStorageFallback=()=>{
      const state=document.documentElement.dataset.dcStorage;
      if(state==='available')return;
      if(state==='checking'||state==='unavailable')document.documentElement.dataset.dcStorage='unavailable';
      if(document.querySelector('.dc-storage-warning'))return;
      const host=document.querySelector('.join-shell');if(!host)return;
      const note=document.createElement('div');note.className='dc-storage-warning';note.setAttribute('role','alert');
      note.innerHTML='<strong>ЛОКАЛЬНОЕ ХРАНЕНИЕ НЕДОСТУПНО</strong><span>Не удалось подтвердить сохранение профиля в браузере. Запуск процедуры отключён, чтобы не потерять результаты.</span>';
      host.prepend(note);
    };
    setTimeout(()=>{if(document.documentElement.dataset.dcStorage!=='available')ensureStorageFallback();},1600);
  }
})();
