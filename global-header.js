(()=>{
  if(typeof document==='undefined')return;
  const runtimePath=location.pathname.replace(/^\/degradation_club/,'');
  if(runtimePath.startsWith('/workspace/'))return;

  const boot=()=>{
    if(document.documentElement.dataset.dcGlobalHeader==='1')return;
    document.documentElement.dataset.dcGlobalHeader='1';

    const path=runtimePath;
    const activeFor=href=>href==='/'?path==='/':path.startsWith(href);
    const link=(href,label)=>`<a href="${href}"${activeFor(href)?' aria-current="page"':''}>${label}</a>`;

    const markup=`
      <a class="dc-global-brand" href="/" aria-label="Dementor Club — на главную">
        <img class="dc-global-brand__mark" src="/assets/brand/dementor-mark-black.svg" alt="" aria-hidden="true" width="24" height="24">
        DEMENTOR<span>CLUB</span>
      </a>
      <button class="dc-global-menu" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="dc-global-nav">
        <span class="dc-global-menu__icon" aria-hidden="true"><span></span></span><span class="dc-global-sr">Меню</span>
      </button>
      <nav class="dc-global-nav" id="dc-global-nav" aria-label="Главная навигация">
        ${link('/about/','Club')}
        ${link('/events/','Events')}
        ${link('/projects/','Projects')}
        ${link('/community/','Community')}
        ${link('/merch/','Merch')}
        ${link('/archive/','Archive')}
        ${link('/join/','Join')}
        ${link('/workspace/','Account')}
      </nav>`;

    // A public page never owns multiple primary headers. Remove legacy/page-specific
    // copies and create one canonical shell that matches the Home navigation language.
    document.querySelectorAll('header.topbar,header.dc-global-header').forEach(node=>node.remove());
    const header=document.createElement('header');
    header.className='dc-global-header';
    header.innerHTML=markup;
    document.body.insertBefore(header,document.body.firstChild);

    if(!document.querySelector('link[rel="icon"][href="/assets/brand/dementor-mark-lime.svg"]')){
      const favicon=document.createElement('link');
      favicon.rel='icon';favicon.type='image/svg+xml';favicon.href='/assets/brand/dementor-mark-lime.svg';
      document.head.appendChild(favicon);
    }

    const menu=header.querySelector('.dc-global-menu');
    const nav=header.querySelector('.dc-global-nav');
    const closeMenu=(restoreFocus=false)=>{
      nav?.classList.remove('is-open');
      menu?.setAttribute('aria-expanded','false');
      menu?.setAttribute('aria-label','Открыть меню');
      document.body.classList.remove('dc-global-menu-open');
      if(restoreFocus)menu?.focus();
    };
    const openMenu=()=>{
      nav?.classList.add('is-open');
      menu?.setAttribute('aria-expanded','true');
      menu?.setAttribute('aria-label','Закрыть меню');
      document.body.classList.add('dc-global-menu-open');
      nav?.querySelector('a')?.focus();
    };
    menu?.addEventListener('click',()=>menu.getAttribute('aria-expanded')==='true'?closeMenu():openMenu());
    nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
    addEventListener('keydown',event=>{if(event.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true')closeMenu(true)});
    addEventListener('resize',()=>{if(innerWidth>900&&menu?.getAttribute('aria-expanded')==='true')closeMenu()},{passive:true});

    if(!document.querySelector('script[src="/support-v1.js"]')){
      const support=document.createElement('script');support.src='/support-v1.js';support.defer=true;document.body.appendChild(support);
    }
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
