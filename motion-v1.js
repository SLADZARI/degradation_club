(()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const path=location.pathname;
  document.documentElement.dataset.route=path;

  /* Raster asset fallback: Vercel has intermittently failed to serve freshly added binary files.
     Keep canonical local paths in HTML, but if an image fails, load the same committed WebP
     directly from the public GitHub raw endpoint so the visual scene never becomes alt text. */
  const rawInkBase='https://raw.githubusercontent.com/SLADZARI/degradation_club/43853511eaf159d6e189f457a539230978d50966/assets/ink/';
  document.querySelectorAll('img[src^="/assets/ink/"]').forEach(img=>{
    const filename=(img.getAttribute('src')||'').split('/').pop();
    if(!filename)return;
    const fallback=()=>{
      if(img.dataset.inkFallback==='1')return;
      img.dataset.inkFallback='1';
      img.src=rawInkBase+filename;
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

  const drift=[...document.querySelectorAll('.dc-project__aside,.dc-project-hero__meta,.dc-page-hero__meta,.dc-event__status,.dc-ink-slot')];
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
