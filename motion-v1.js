(()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const path=location.pathname;
  document.documentElement.dataset.route=path;

  /* Raster fallback. Some WebP blobs were committed incorrectly and can fail to decode.
     First try the normal local WebP path. If it fails, fetch the corresponding base64 text
     asset from the same deployment and replace the image src with a data URL. */
  document.querySelectorAll('img[src^="/assets/ink/"]').forEach(img=>{
    const filename=(img.getAttribute('src')||'').split('/').pop();
    if(!filename)return;
    const fallback=async()=>{
      if(img.dataset.inkFallback==='1')return;
      img.dataset.inkFallback='1';
      try{
        const res=await fetch(`/assets/ink/${filename}.b64`,{cache:'no-store'});
        if(!res.ok)throw new Error(`HTTP ${res.status}`);
        const b64=(await res.text()).trim();
        if(!b64)throw new Error('empty fallback');
        img.src=`data:image/webp;base64,${b64}`;
      }catch(err){
        console.warn('Dementor Ink fallback failed:',filename,err);
      }
    };
    img.addEventListener('error',fallback,{once:true});
    if(img.complete&&img.naturalWidth===0)fallback();
  });

  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.nav');
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
    if(target==='/'?path==='/':path.startsWith(target))a.classList.add('active');
  });

  /* DIA 01 — Reclassification. The action changes wording, not factual status. */
  const heroAction=document.querySelector('.dc-home .dc-hero .dc-action--primary');
  if(heroAction){
    const original=heroAction.textContent.trim();
    const mutate=()=>{heroAction.textContent='УСОМНИТЬСЯ И ПРОДОЛЖИТЬ';heroAction.classList.add('is-reclassified')};
    const restore=()=>{heroAction.textContent=original;heroAction.classList.remove('is-reclassified')};
    heroAction.addEventListener('pointerenter',mutate);
    heroAction.addEventListener('pointerleave',restore);
    heroAction.addEventListener('focus',mutate);
    heroAction.addEventListener('blur',restore);
  }

  /* DIA 02 — Mechanical ticker. Hover reverses the machine; click/tap pauses it. */
  const ticker=document.querySelector('.dc-home .dc-notice__track');
  if(ticker){
    ticker.addEventListener('pointerenter',()=>ticker.classList.add('is-reversing'));
    ticker.addEventListener('pointerleave',()=>ticker.classList.remove('is-reversing'));
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

  /* DIA 03 — Type Mutation on the featured project headline. */
  const projectTitle=document.querySelector('.dc-home #project-title');
  if(projectTitle){
    projectTitle.classList.add('dc-type-mutation');
    const mutateType=()=>{
      const r=projectTitle.getBoundingClientRect();
      const vh=innerHeight||1;
      const progress=Math.max(0,Math.min(1,1-(r.top/vh)));
      const x=1+progress*.085;
      const track=-.07-progress*.018;
      projectTitle.style.setProperty('--dc-type-x',x.toFixed(3));
      projectTitle.style.setProperty('--dc-type-track',`${track.toFixed(3)}em`);
    };
    addEventListener('scroll',mutateType,{passive:true});
    addEventListener('resize',mutateType,{passive:true});
    mutateType();
  }

  const drift=[...document.querySelectorAll('.dc-project__aside,.dc-project-hero__meta,.dc-page-hero__meta,.dc-event__status')];
  let raf=0;
  const update=()=>{
    raf=0;
    const y=window.scrollY;
    drift.forEach((el,i)=>{
      const amp=4+(i%3)*2;
      const phase=(i+1)*.7;
      el.style.transform=`translate3d(${Math.sin(y/520+phase)*amp}px,${Math.cos(y/700+phase)*amp*.45}px,0)`;
      el.classList.add('dc-drift');
    });
  };
  addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(update)},{passive:true});
  update();
})();
