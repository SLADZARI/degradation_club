(()=>{
  /* Load shared corrective layers after the page styles. */
  if(!document.querySelector('link[data-dc-mobile-overflow]')){
    const mobileCss=document.createElement('link');
    mobileCss.rel='stylesheet';
    mobileCss.href='/mobile-overflow-fix.css';
    mobileCss.dataset.dcMobileOverflow='1';
    document.head.appendChild(mobileCss);
  }
  if(!document.querySelector('link[data-dc-ink-interventions]')){
    const inkCss=document.createElement('link');
    inkCss.rel='stylesheet';
    inkCss.href='/ink-interventions.css';
    inkCss.dataset.dcInkInterventions='1';
    document.head.appendChild(inkCss);
  }

  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const path=location.pathname;
  document.documentElement.dataset.route=path;

  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.nav');
  if(nav&&!nav.querySelector('a[href="/archive/"]')){
    const archive=document.createElement('a');
    archive.href='/archive/';
    archive.textContent='Archive';
    const join=nav.querySelector('a[href="/join/"]');
    if(join)nav.insertBefore(archive,join);else nav.appendChild(archive);
  }
  if(toggle&&nav){
    const openLabel='CLOSE';
    const closedLabel=toggle.textContent.trim()||'INDEX';
    toggle.addEventListener('click',()=>{
      const open=nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded',String(open));
      toggle.textContent=open?openLabel:closedLabel;
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      toggle.textContent=closedLabel;
    }));
  }

  document.querySelectorAll('.nav a').forEach(a=>{
    const href=a.getAttribute('href');
    if(!href||href.startsWith('#'))return;
    const target=new URL(href,location.origin).pathname;
    if(target==='/'?path==='/' : path.startsWith(target))a.classList.add('active');
  });

  /* Actual Source-style register preview: hover on desktop, first tap reveals on mobile. */
  const catalogRows=[...document.querySelectorAll('.dc-catalog-row[data-preview-src]')];
  if(catalogRows.length){
    const preview=document.createElement('aside');
    preview.className='dc-catalog-preview';
    preview.setAttribute('aria-hidden','true');
    preview.innerHTML='<img alt=""><div class="dc-catalog-preview__meta"><span class="dc-catalog-preview__label"></span><span class="dc-catalog-preview__title"></span></div>';
    document.body.appendChild(preview);
    const previewImg=preview.querySelector('img');
    const previewLabel=preview.querySelector('.dc-catalog-preview__label');
    const previewTitle=preview.querySelector('.dc-catalog-preview__title');
    const fill=row=>{
      previewImg.src=row.dataset.previewSrc;
      previewImg.alt=row.dataset.previewTitle||'';
      previewLabel.textContent=row.dataset.previewLabel||'';
      previewTitle.textContent=row.dataset.previewTitle||'';
    };
    const open=row=>{fill(row);preview.classList.add('is-open');preview.setAttribute('aria-hidden','false')};
    const close=()=>{preview.classList.remove('is-open');preview.setAttribute('aria-hidden','true')};
    catalogRows.forEach(row=>{
      row.addEventListener('mouseenter',()=>{if(matchMedia('(hover:hover) and (min-width:701px)').matches)open(row)});
      row.addEventListener('mouseleave',close);
      row.addEventListener('focus',()=>{if(matchMedia('(min-width:701px)').matches)open(row)});
      row.addEventListener('blur',close);
      row.addEventListener('click',event=>{
        if(!matchMedia('(max-width:700px)').matches)return;
        if(row.dataset.previewOpen==='1')return;
        event.preventDefault();
        document.querySelectorAll('.dc-catalog-row[data-preview-open="1"]').forEach(other=>{
          other.dataset.previewOpen='0';
          const p=other.nextElementSibling;
          if(p?.classList.contains('dc-catalog-mobile-preview'))p.remove();
        });
        row.dataset.previewOpen='1';
        const mobile=document.createElement('div');
        mobile.className='dc-catalog-mobile-preview';
        mobile.innerHTML=`<img src="${row.dataset.previewSrc}" alt="${row.dataset.previewTitle||''}"><span>${row.dataset.previewLabel||''} · TAP AGAIN TO OPEN →</span>`;
        row.insertAdjacentElement('afterend',mobile);
      });
    });
  }

  const heroPrimary=document.querySelector('.dc-home .dc-hero .dc-action--primary');
  if(heroPrimary){
    const original=heroPrimary.textContent.trim();
    const alt='Усомниться и продолжить';
    const activate=()=>{heroPrimary.textContent=alt;heroPrimary.classList.add('is-reclassified')};
    const reset=()=>{heroPrimary.textContent=original;heroPrimary.classList.remove('is-reclassified')};
    heroPrimary.addEventListener('mouseenter',activate);
    heroPrimary.addEventListener('mouseleave',reset);
    heroPrimary.addEventListener('focus',activate);
    heroPrimary.addEventListener('blur',reset);
  }

  const ticker=document.querySelector('.dc-home .dc-notice__track');
  if(ticker){
    ticker.addEventListener('mouseenter',()=>ticker.classList.add('is-reversing'));
    ticker.addEventListener('mouseleave',()=>ticker.classList.remove('is-reversing'));
    ticker.addEventListener('click',()=>ticker.classList.toggle('is-paused'));
  }

  if(reduce)return;

  const reveal=[...document.querySelectorAll('main section .dc-shell, main section>.dc-shell, .dc-placeholder__grid, .dc-boundary__grid')];
  reveal.forEach(el=>el.classList.add('dc-motion-reveal'));
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(!e.isIntersecting)return;
    e.target.classList.add('is-visible');
    io.unobserve(e.target);
  }),{threshold:.08,rootMargin:'0px 0px -8%'});
  reveal.forEach(el=>io.observe(el));

  document.querySelectorAll('.dc-display-xl,.dc-display-l').forEach((el,i)=>{
    if(i<3)el.classList.add('dc-pressure');
  });

  const projectTitle=document.getElementById('project-title');
  if(projectTitle){
    projectTitle.classList.add('dc-type-mutation');
    const mutate=()=>{
      if(matchMedia('(max-width: 700px)').matches){
        projectTitle.style.setProperty('--dc-type-x','1');
        projectTitle.style.setProperty('--dc-type-track','-.06em');
        return;
      }
      const r=projectTitle.getBoundingClientRect();
      const vh=innerHeight||1;
      const p=Math.max(0,Math.min(1,1-(r.top/vh)));
      projectTitle.style.setProperty('--dc-type-x',(1+.035*p).toFixed(3));
      projectTitle.style.setProperty('--dc-type-track',`${(-.07-.02*p).toFixed(3)}em`);
    };
    addEventListener('scroll',mutate,{passive:true});
    addEventListener('resize',mutate,{passive:true});
    mutate();
  }

  const drift=[...document.querySelectorAll('.dc-project__aside,.dc-project-hero__meta,.dc-page-hero__meta,.dc-event__status')];
  let raf=0;
  const update=()=>{
    raf=0;
    const y=window.scrollY;
    drift.forEach((el,i)=>{
      if(matchMedia('(max-width: 700px)').matches){
        el.style.transform='none';
        return;
      }
      const amp=4+(i%3)*2;
      const phase=(i+1)*.7;
      el.style.transform=`translate3d(${Math.sin(y/520+phase)*amp}px,${Math.cos(y/700+phase)*amp*.45}px,0)`;
      el.classList.add('dc-drift');
    });
  };
  addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(update)},{passive:true});
  addEventListener('resize',()=>{if(!raf)raf=requestAnimationFrame(update)},{passive:true});
  update();
})();
