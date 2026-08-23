(()=>{
  const loadScript=(src,done)=>{
    const existing=document.querySelector(`script[src="${src}"]`);
    if(existing){if(done){if(src==='/site-config.js'&&window.DEMENTOR_SITE_CONFIG)done();else existing.addEventListener('load',done,{once:true});}return;}
    const s=document.createElement('script');s.src=src;s.onload=()=>done?.();document.head.appendChild(s);
  };
  const bootSeo=()=>{if(!document.querySelector('script[src="/seo-runtime.js"]'))loadScript('/seo-runtime.js');};
  window.DEMENTOR_SITE_CONFIG?bootSeo():loadScript('/site-config.js',bootSeo);

  const mqMobile=()=>matchMedia('(max-width:700px)').matches;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const path=location.pathname;
  document.documentElement.dataset.route=path;

  /* Utility navigation: support/contact/legal stay out of the primary cultural nav. */
  if(!document.querySelector('link[href="/utility-v1.css"]')){
    const utilityCss=document.createElement('link');utilityCss.rel='stylesheet';utilityCss.href='/utility-v1.css';document.head.appendChild(utilityCss);
  }
  if(!document.querySelector('.dc-utility-strip')){
    const strip=document.createElement('div');strip.className='dc-utility-strip';
    strip.innerHTML='<span class="dc-utility-strip__label">UTILITY / PUBLIC</span><nav class="dc-utility-nav" aria-label="Служебная навигация"><a href="/donate/">Support</a><a href="/contacts/">Contacts</a><a href="/legal/privacy/">Privacy</a><a href="/legal/terms/">Terms</a></nav>';
    const footer=document.querySelector('footer');footer?footer.insertAdjacentElement('afterend',strip):document.body.appendChild(strip);
  }

  /* Dementor Ink density map: semantic route contract, no invented raster art. */
  const inkMap={
    '/':{level:3,role:'takeover',target:'.dc-ink-slot--home'},
    '/about/':{level:2,role:'contamination',target:'.dc-ink-slot--about'},
    '/projects/logic-awareness/':{level:2,role:'leak',target:'.dc-ink-slot--logic'},
    '/events/fuengirola/':{level:2,role:'field-record',target:'.dc-ink-slot--event'},
    '/events/':{level:1,role:'trace',target:'.dc-programme-intro',label:'INK / L1 / PROGRAMME TRACE',media:true},
    '/projects/':{level:1,role:'trace',target:'.dc-project-register-section .dc-kicker',label:'INK / L1 / PROJECT TRACE',media:true},
    '/catalog/':{level:1,role:'trace',target:'.dc-entity-index__head',label:'INK / L1 / REGISTER TRACE'},
    '/archive/':{level:0,role:'silence'},'/community/':{level:0,role:'silence'},'/merch/':{level:0,role:'silence'},'/join/':{level:0,role:'silence'},'/donate/':{level:0,role:'silence'},'/contacts/':{level:0,role:'silence'},'/legal/privacy/':{level:0,role:'silence'},'/legal/terms/':{level:0,role:'silence'}
  };
  const ink=inkMap[path]||{level:0,role:'silence'};
  document.body.classList.add(`dc-ink-l${ink.level}`);document.body.dataset.inkLevel=String(ink.level);document.body.dataset.inkRole=ink.role;
  if(ink.target){const inkTarget=document.querySelector(ink.target);if(inkTarget){inkTarget.classList.add(`dc-ink-l${ink.level}`);inkTarget.dataset.inkRole=ink.role;if(ink.level===1){inkTarget.classList.add('dc-ink-trace');inkTarget.dataset.inkLabel=ink.label||'INK / L1 / TRACE';if(ink.media){const sourceRow=document.querySelector('.dc-catalog-row[data-preview-src]');if(sourceRow?.dataset.previewSrc){const fragment=document.createElement('span');fragment.className='dc-ink-trace-media';fragment.setAttribute('aria-hidden','true');const image=document.createElement('img');image.src=sourceRow.dataset.previewSrc;image.alt='';image.loading='lazy';image.decoding='async';fragment.appendChild(image);inkTarget.appendChild(fragment);}}}}}

  const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');
  if(nav&&!nav.querySelector('a[href="/archive/"]')){const a=document.createElement('a');a.href='/archive/';a.textContent='Archive';const join=nav.querySelector('a[href="/join/"]');join?nav.insertBefore(a,join):nav.appendChild(a);}
  if(toggle&&nav){const closed=toggle.textContent.trim()||'INDEX';toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'CLOSE':closed});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent=closed}));}
  document.querySelectorAll('.nav a').forEach(a=>{const href=a.getAttribute('href');if(!href||href.startsWith('#'))return;const target=new URL(href,location.origin).pathname;if(target==='/'?path==='/' : path.startsWith(target))a.classList.add('active');});

  const rows=[...document.querySelectorAll('.dc-catalog-row[data-preview-src]')];
  if(rows.length){const p=document.createElement('aside');p.className='dc-catalog-preview';p.setAttribute('aria-hidden','true');p.innerHTML='<img alt=""><div class="dc-catalog-preview__meta"><span class="dc-catalog-preview__label"></span><span class="dc-catalog-preview__title"></span></div>';document.body.appendChild(p);const img=p.querySelector('img'),label=p.querySelector('.dc-catalog-preview__label'),title=p.querySelector('.dc-catalog-preview__title');const fill=row=>{img.src=row.dataset.previewSrc;img.alt=row.dataset.previewTitle||'';label.textContent=row.dataset.previewLabel||'';title.textContent=row.dataset.previewTitle||''};const open=row=>{fill(row);p.classList.add('is-open');p.setAttribute('aria-hidden','false')};const close=()=>{p.classList.remove('is-open');p.setAttribute('aria-hidden','true')};rows.forEach(row=>{row.addEventListener('mouseenter',()=>{if(!mqMobile()&&matchMedia('(hover:hover)').matches)open(row)});row.addEventListener('mouseleave',close);row.addEventListener('focus',()=>{if(!mqMobile())open(row)});row.addEventListener('blur',close);row.addEventListener('click',e=>{if(!mqMobile()||row.dataset.previewOpen==='1')return;e.preventDefault();document.querySelectorAll('.dc-catalog-row[data-preview-open="1"]').forEach(other=>{other.dataset.previewOpen='0';const n=other.nextElementSibling;if(n?.classList.contains('dc-catalog-mobile-preview'))n.remove()});row.dataset.previewOpen='1';const mobile=document.createElement('div');mobile.className='dc-catalog-mobile-preview';mobile.innerHTML=`<img src="${row.dataset.previewSrc}" alt="${row.dataset.previewTitle||''}"><span>${row.dataset.previewLabel||''} · TAP AGAIN TO OPEN →</span>`;row.insertAdjacentElement('afterend',mobile)})});}

  document.querySelectorAll('.dc-reclassify-row[data-reclassify-target][data-reclassify-text]').forEach(row=>{const target=row.querySelector(row.dataset.reclassifyTarget);if(!target)return;const original=target.textContent.trim();const on=()=>{target.textContent=row.dataset.reclassifyText;row.classList.add('is-reclassified')};const off=()=>{target.textContent=original;row.classList.remove('is-reclassified')};row.addEventListener('mouseenter',on);row.addEventListener('mouseleave',off);row.addEventListener('focus',on);row.addEventListener('blur',off);});
  const heroPrimary=document.querySelector('.dc-home .dc-hero .dc-action--primary');if(heroPrimary){const original=heroPrimary.textContent.trim(),alt='Усомниться и продолжить';const on=()=>{heroPrimary.textContent=alt;heroPrimary.classList.add('is-reclassified')},off=()=>{heroPrimary.textContent=original;heroPrimary.classList.remove('is-reclassified')};heroPrimary.addEventListener('mouseenter',on);heroPrimary.addEventListener('mouseleave',off);heroPrimary.addEventListener('focus',on);heroPrimary.addEventListener('blur',off)}
  document.querySelectorAll('.dc-lifecycle__state,.dc-programme__lane').forEach(el=>{el.classList.add('dc-dia-state');if(el.classList.contains('is-current')||el.classList.contains('dc-programme__lane--active'))el.classList.add('is-current')});
  document.querySelectorAll('.dc-meta,.dc-kicker,.dc-event-relations__label,.dc-programme__label').forEach(el=>el.classList.add('dc-dia-meta'));
  const ticker=document.querySelector('.dc-home .dc-notice__track');if(ticker){ticker.addEventListener('mouseenter',()=>ticker.classList.add('is-reversing'));ticker.addEventListener('mouseleave',()=>ticker.classList.remove('is-reversing'));ticker.addEventListener('click',()=>ticker.classList.toggle('is-paused'))}

  let seed=0;for(const ch of path)seed=(seed*31+ch.charCodeAt(0))>>>0;const variantRoot=document.querySelector('main');if(variantRoot){variantRoot.classList.add('dc-dia-variant');const tilt=(((seed%9)-4)*.035).toFixed(3),shift=((seed%7)-3)*2,inkTilt=(((seed%11)-5)*.055).toFixed(3),previewY=((seed%9)-4)*5,captionShift=((seed%5)-2)*4;variantRoot.style.setProperty('--dc-dia-tilt',`${tilt}deg`);variantRoot.style.setProperty('--dc-dia-shift',`${shift}px`);variantRoot.style.setProperty('--dc-dia-ink-tilt',`${inkTilt}deg`);variantRoot.style.setProperty('--dc-dia-preview-y',`${previewY}px`);variantRoot.style.setProperty('--dc-dia-caption-shift',`${captionShift}px`);document.documentElement.dataset.diaVariant=String(seed%4);}
  if(reduce){if(ticker)ticker.style.animation='none';return;}
  const reveal=[...document.querySelectorAll('main section .dc-shell,main section>.dc-shell,.dc-placeholder__grid,.dc-boundary__grid')];reveal.forEach(el=>el.classList.add('dc-motion-reveal'));const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -8%'});reveal.forEach(el=>io.observe(el));
  document.querySelectorAll('.dc-display-xl,.dc-display-l,.dc-editorial-opening__headline').forEach((el,i)=>{if(i<3)el.classList.add('dc-pressure')});
  const mutateTarget=document.querySelector('#project-title,.dc-project-hero__title,.dc-entity-hero__title,.dc-page-hero__title,.dc-about-hero__title,.dc-hero__title');if(mutateTarget){mutateTarget.classList.add('dc-type-mutation');const mutate=()=>{if(mqMobile()){mutateTarget.style.setProperty('--dc-type-x','1');mutateTarget.style.setProperty('--dc-type-track','-.06em');return}const r=mutateTarget.getBoundingClientRect(),vh=innerHeight||1,p=Math.max(0,Math.min(1,1-r.top/vh));mutateTarget.style.setProperty('--dc-type-x',(1+.028*p).toFixed(3));mutateTarget.style.setProperty('--dc-type-track',`${(-.068-.012*p).toFixed(3)}em`)};addEventListener('scroll',mutate,{passive:true});addEventListener('resize',mutate,{passive:true});mutate()}
  const drift=[...document.querySelectorAll('.dc-project__aside,.dc-project-hero__meta,.dc-page-hero__meta,.dc-entity-hero__meta,.dc-event__status,.dc-editorial-opening__label')];let raf=0;const driftUpdate=()=>{raf=0;const y=scrollY;drift.forEach((el,i)=>{el.classList.add('dc-dia-drift');if(mqMobile()){el.style.setProperty('--dc-drift-x','0px');el.style.setProperty('--dc-drift-y','0px');return}const phase=((seed%13)+i+1)*.43,amp=3+(i%3)*2;el.style.setProperty('--dc-drift-x',`${(Math.sin(y/620+phase)*amp).toFixed(2)}px`);el.style.setProperty('--dc-drift-y',`${(Math.cos(y/760+phase)*amp*.42).toFixed(2)}px`)})};addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(driftUpdate)},{passive:true});addEventListener('resize',()=>{if(!raf)raf=requestAnimationFrame(driftUpdate)},{passive:true});driftUpdate();
})();
