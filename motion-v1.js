(()=>{
  const ensureCss=(href,key)=>{
    if(document.querySelector(`link[data-${key}]`))return;
    const l=document.createElement('link');l.rel='stylesheet';l.href=href;l.dataset[key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]='1';document.head.appendChild(l);
  };
  ensureCss('/mouthwash-v1.css','dc-mouthwash');
  ensureCss('/dia-v1.css','dc-dia');

  const mqMobile=()=>matchMedia('(max-width:700px)').matches;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const path=location.pathname;
  document.documentElement.dataset.route=path;

  /* Navigation */
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.nav');
  if(nav&&!nav.querySelector('a[href="/archive/"]')){
    const a=document.createElement('a');a.href='/archive/';a.textContent='Archive';
    const join=nav.querySelector('a[href="/join/"]');join?nav.insertBefore(a,join):nav.appendChild(a);
  }
  if(toggle&&nav){
    const closed=toggle.textContent.trim()||'INDEX';
    toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'CLOSE':closed});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent=closed}));
  }
  document.querySelectorAll('.nav a').forEach(a=>{
    const href=a.getAttribute('href');if(!href||href.startsWith('#'))return;
    const target=new URL(href,location.origin).pathname;
    if(target==='/'?path==='/' : path.startsWith(target))a.classList.add('active');
  });

  /* Actual Source preview layer */
  const rows=[...document.querySelectorAll('.dc-catalog-row[data-preview-src]')];
  if(rows.length){
    const p=document.createElement('aside');p.className='dc-catalog-preview';p.setAttribute('aria-hidden','true');
    p.innerHTML='<img alt=""><div class="dc-catalog-preview__meta"><span class="dc-catalog-preview__label"></span><span class="dc-catalog-preview__title"></span></div>';document.body.appendChild(p);
    const img=p.querySelector('img'),label=p.querySelector('.dc-catalog-preview__label'),title=p.querySelector('.dc-catalog-preview__title');
    const fill=row=>{img.src=row.dataset.previewSrc;img.alt=row.dataset.previewTitle||'';label.textContent=row.dataset.previewLabel||'';title.textContent=row.dataset.previewTitle||''};
    const open=row=>{fill(row);p.classList.add('is-open');p.setAttribute('aria-hidden','false')};
    const close=()=>{p.classList.remove('is-open');p.setAttribute('aria-hidden','true')};
    rows.forEach(row=>{
      row.addEventListener('mouseenter',()=>{if(!mqMobile()&&matchMedia('(hover:hover)').matches)open(row)});row.addEventListener('mouseleave',close);
      row.addEventListener('focus',()=>{if(!mqMobile())open(row)});row.addEventListener('blur',close);
      row.addEventListener('click',e=>{
        if(!mqMobile()||row.dataset.previewOpen==='1')return;
        e.preventDefault();document.querySelectorAll('.dc-catalog-row[data-preview-open="1"]').forEach(other=>{other.dataset.previewOpen='0';const n=other.nextElementSibling;if(n?.classList.contains('dc-catalog-mobile-preview'))n.remove()});
        row.dataset.previewOpen='1';const mobile=document.createElement('div');mobile.className='dc-catalog-mobile-preview';mobile.innerHTML=`<img src="${row.dataset.previewSrc}" alt="${row.dataset.previewTitle||''}"><span>${row.dataset.previewLabel||''} · TAP AGAIN TO OPEN →</span>`;row.insertAdjacentElement('afterend',mobile);
      });
    });
  }

  /* Reclassification never changes canonical data. */
  document.querySelectorAll('.dc-reclassify-row[data-reclassify-target][data-reclassify-text]').forEach(row=>{
    const target=row.querySelector(row.dataset.reclassifyTarget);if(!target)return;const original=target.textContent.trim();
    const on=()=>{target.textContent=row.dataset.reclassifyText;row.classList.add('is-reclassified')};const off=()=>{target.textContent=original;row.classList.remove('is-reclassified')};
    row.addEventListener('mouseenter',on);row.addEventListener('mouseleave',off);row.addEventListener('focus',on);row.addEventListener('blur',off);
  });

  const heroPrimary=document.querySelector('.dc-home .dc-hero .dc-action--primary');
  if(heroPrimary){const original=heroPrimary.textContent.trim(),alt='Усомниться и продолжить';const on=()=>{heroPrimary.textContent=alt;heroPrimary.classList.add('is-reclassified')},off=()=>{heroPrimary.textContent=original;heroPrimary.classList.remove('is-reclassified')};heroPrimary.addEventListener('mouseenter',on);heroPrimary.addEventListener('mouseleave',off);heroPrimary.addEventListener('focus',on);heroPrimary.addEventListener('blur',off)}

  /* State Transition: current state is emphasized, future states remain only possible states. */
  document.querySelectorAll('.dc-lifecycle__state,.dc-programme__lane').forEach(el=>{
    el.classList.add('dc-dia-state');if(el.classList.contains('is-current')||el.classList.contains('dc-programme__lane--active'))el.classList.add('is-current');
  });
  document.querySelectorAll('.dc-meta,.dc-kicker,.dc-event-relations__label,.dc-programme__label').forEach(el=>el.classList.add('dc-dia-meta'));

  const ticker=document.querySelector('.dc-home .dc-notice__track');
  if(ticker){ticker.addEventListener('mouseenter',()=>ticker.classList.add('is-reversing'));ticker.addEventListener('mouseleave',()=>ticker.classList.remove('is-reversing'));ticker.addEventListener('click',()=>ticker.classList.toggle('is-paused'))}

  /* Deterministic variation derived from route, never random per frame. */
  let seed=0;for(const ch of path)seed=(seed*31+ch.charCodeAt(0))>>>0;
  const variantRoot=document.querySelector('main');
  if(variantRoot){variantRoot.classList.add('dc-dia-variant');const tilt=(((seed%9)-4)*.035).toFixed(3),shift=((seed%7)-3)*2;variantRoot.style.setProperty('--dc-dia-tilt',`${tilt}deg`);variantRoot.style.setProperty('--dc-dia-shift',`${shift}px`)}

  if(reduce){if(ticker)ticker.style.animation='none';return;}

  /* Reveal */
  const reveal=[...document.querySelectorAll('main section .dc-shell,main section>.dc-shell,.dc-placeholder__grid,.dc-boundary__grid')];
  reveal.forEach(el=>el.classList.add('dc-motion-reveal'));
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -8%'});reveal.forEach(el=>io.observe(el));

  /* Pressure: maximum first three dominant headings, bounded on desktop. */
  document.querySelectorAll('.dc-display-xl,.dc-display-l,.dc-editorial-opening__headline').forEach((el,i)=>{if(i<3)el.classList.add('dc-pressure')});

  /* Type mutation: exactly one dominant heading per page. */
  const mutateTarget=document.querySelector('#project-title,.dc-project-hero__title,.dc-entity-hero__title,.dc-page-hero__title,.dc-about-hero__title,.dc-hero__title');
  if(mutateTarget){mutateTarget.classList.add('dc-type-mutation');const mutate=()=>{if(mqMobile()){mutateTarget.style.setProperty('--dc-type-x','1');mutateTarget.style.setProperty('--dc-type-track','-.06em');return}const r=mutateTarget.getBoundingClientRect(),vh=innerHeight||1,p=Math.max(0,Math.min(1,1-r.top/vh));mutateTarget.style.setProperty('--dc-type-x',(1+.028*p).toFixed(3));mutateTarget.style.setProperty('--dc-type-track',`${(-.068-.012*p).toFixed(3)}em`)};addEventListener('scroll',mutate,{passive:true});addEventListener('resize',mutate,{passive:true});mutate()}

  /* Drift: metadata only, deterministic phase, <= 8 px. */
  const drift=[...document.querySelectorAll('.dc-project__aside,.dc-project-hero__meta,.dc-page-hero__meta,.dc-entity-hero__meta,.dc-event__status,.dc-editorial-opening__label')];
  let raf=0;const driftUpdate=()=>{raf=0;const y=scrollY;drift.forEach((el,i)=>{el.classList.add('dc-dia-drift');if(mqMobile()){el.style.setProperty('--dc-drift-x','0px');el.style.setProperty('--dc-drift-y','0px');return}const phase=((seed%13)+i+1)*.43,amp=3+(i%3)*2;el.style.setProperty('--dc-drift-x',`${(Math.sin(y/620+phase)*amp).toFixed(2)}px`);el.style.setProperty('--dc-drift-y',`${(Math.cos(y/760+phase)*amp*.42).toFixed(2)}px`)})};
  addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(driftUpdate)},{passive:true});addEventListener('resize',()=>{if(!raf)raf=requestAnimationFrame(driftUpdate)},{passive:true});driftUpdate();
})();
