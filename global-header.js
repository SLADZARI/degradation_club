(()=>{
  if(typeof document==='undefined')return;
  if(document.documentElement.dataset.dcGlobalHeader==='1')return;
  document.documentElement.dataset.dcGlobalHeader='1';
  const path=location.pathname;
  const cfg=window.DEMENTOR_SITE_CONFIG||{};
  if(!document.querySelector('link[rel="icon"][href="/assets/brand/dementor-mark-lime.svg"]')){const favicon=document.createElement('link');favicon.rel='icon';favicon.type='image/svg+xml';favicon.href='/assets/brand/dementor-mark-lime.svg';document.head.appendChild(favicon)}
  const activeFor=href=>href==='/'?path==='/':path.startsWith(href);
  const link=(href,label,extra='')=>`<a href="${href}"${activeFor(href)?' aria-current="page"':''}${extra}>${label}</a>`;
  const communityActive=path.startsWith('/community/')||path.startsWith('/courses/');
  const accountActive=path.startsWith('/workspace/')||path.startsWith('/profile/')||(cfg.merch?.cartEnabled===true&&path.startsWith('/cart/'));
  const accountLinks=link('/workspace/','Personal Workspace')+(cfg.merch?.cartEnabled===true?link('/cart/','Cart'):'');
  const navHtml=[
    link('/about/','Club'),link('/events/','Events'),link('/projects/','Projects'),
    `<div class="dc-global-group${communityActive?' is-active':''}" data-nav-group="community"><button class="dc-global-group__trigger" type="button" aria-expanded="false">Community</button><div class="dc-global-subnav">${link('/community/','People')}${link('/courses/dumai-s-opasnostyu/','Courses')}</div></div>`,
    link('/merch/','Merch'),link('/archive/','Blog'),link('/join/','Join'),
    `<div class="dc-global-group${accountActive?' is-active':''}" data-nav-group="account"><button class="dc-global-group__trigger" type="button" aria-expanded="false">Account</button><div class="dc-global-subnav">${accountLinks}</div></div>`
  ].join('');
  const markup=`<a class="dc-global-brand" href="/" aria-label="Dementor Club — на главную"><img class="dc-global-brand__mark" src="/assets/brand/dementor-mark-black.svg" alt="" aria-hidden="true" width="24" height="24">DEMENTOR<span>CLUB</span></a><button class="dc-global-menu" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="dc-global-nav"><span class="dc-global-menu__icon" aria-hidden="true"><span></span></span><span class="dc-global-sr">Меню</span></button><nav class="dc-global-nav" id="dc-global-nav" aria-label="Главная навигация">${navHtml}</nav>`;
  let header=document.querySelector('header.topbar');if(header){header.classList.add('dc-global-header');header.innerHTML=markup}else{header=document.createElement('header');header.className='topbar dc-global-header';header.innerHTML=markup;document.body.insertBefore(header,document.body.firstChild)}
  const menu=header.querySelector('.dc-global-menu'),nav=header.querySelector('.dc-global-nav'),groups=[...header.querySelectorAll('.dc-global-group')];
  const closeGroups=()=>groups.forEach(group=>group.querySelector('.dc-global-group__trigger')?.setAttribute('aria-expanded','false'));
  groups.forEach(group=>{const trigger=group.querySelector('.dc-global-group__trigger');trigger?.addEventListener('click',e=>{e.stopPropagation();const next=trigger.getAttribute('aria-expanded')!=='true';closeGroups();trigger.setAttribute('aria-expanded',String(next))})});
  const closeMenu=(restoreFocus=false)=>{nav?.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Открыть меню');document.body.classList.remove('dc-global-menu-open');closeGroups();if(restoreFocus)menu?.focus()};
  const openMenu=()=>{nav?.classList.add('is-open');menu?.setAttribute('aria-expanded','true');menu?.setAttribute('aria-label','Закрыть меню');document.body.classList.add('dc-global-menu-open');nav?.querySelector('a,button')?.focus()};
  menu?.addEventListener('click',()=>menu.getAttribute('aria-expanded')==='true'?closeMenu():openMenu());nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));addEventListener('click',e=>{if(!header.contains(e.target))closeGroups()});addEventListener('keydown',e=>{if(e.key==='Escape'){closeGroups();if(menu?.getAttribute('aria-expanded')==='true')closeMenu(true)}});addEventListener('resize',()=>{if(innerWidth>900&&menu?.getAttribute('aria-expanded')==='true')closeMenu()},{passive:true});
  const load=src=>{if(document.querySelector(`script[src="${src}"]`))return;const s=document.createElement('script');s.src=src;s.defer=true;document.body.appendChild(s)};
  load('/support-v1.js');
  if(path.startsWith('/merch/')||path.startsWith('/objects/')||(cfg.merch?.cartEnabled===true&&path.startsWith('/cart/'))){load('/site-config.js');load('/dementor-cart-v1.js');if(path.startsWith('/merch/drop-001/')||path.startsWith('/objects/'))load('/merch-cart-bridge-v1.js')}
})();