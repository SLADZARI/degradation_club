(()=>{
  if(typeof document==='undefined')return;
  if(document.documentElement.dataset.dcGlobalHeader==='1')return;
  document.documentElement.dataset.dcGlobalHeader='1';

  const navItems=[
    ['/about/','Club'],
    ['/events/','Events'],
    ['/projects/','Projects'],
    ['/community/','Community'],
    ['/merch/','Merch'],
    ['/archive/','Archive'],
    ['/join/','Join']
  ];
  const path=location.pathname;
  const activeFor=href=>href==='/'?path==='/':path.startsWith(href);
  const navHtml=navItems.map(([href,label])=>`<a href="${href}"${activeFor(href)?' aria-current="page"':''}>${label}</a>`).join('');
  const markup=`<a class="dc-global-brand" href="/" aria-label="Dementor Club — на главную">DEMENTOR<span>CLUB</span></a><button class="dc-global-menu" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="dc-global-nav"><span class="dc-global-menu__icon" aria-hidden="true"><span></span></span><span class="dc-global-sr">Меню</span></button><nav class="dc-global-nav" id="dc-global-nav" aria-label="Главная навигация">${navHtml}</nav>`;

  let header=document.querySelector('header.topbar');
  if(header){
    header.classList.add('dc-global-header');
    header.innerHTML=markup;
  }else{
    header=document.createElement('header');
    header.className='topbar dc-global-header';
    header.innerHTML=markup;
    document.body.insertBefore(header,document.body.firstChild);
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
  addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true')closeMenu(true)});
  addEventListener('resize',()=>{if(innerWidth>900&&menu?.getAttribute('aria-expanded')==='true')closeMenu()},{passive:true});
})();
