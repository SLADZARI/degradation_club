(()=>{
  const join=document.querySelector('.dc-home .dc-join');
  if(!join||matchMedia('(prefers-reduced-motion: reduce)').matches)return;

  let ticking=false;
  const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
  const update=()=>{
    ticking=false;
    const r=join.getBoundingClientRect();
    const vh=window.innerHeight||document.documentElement.clientHeight||1;
    const total=vh+r.height;
    const progress=clamp((vh-r.top)/total,0,1);
    const mobile=matchMedia('(max-width:700px)').matches;
    const width=join.clientWidth||window.innerWidth||1;
    const from=mobile?-0.22*width:-0.18*width;
    const to=mobile?0.18*width:0.42*width;
    const x=from+(to-from)*progress;
    join.style.setProperty('--dc-join-x',`${x.toFixed(1)}px`);
  };
  const request=()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}};
  addEventListener('scroll',request,{passive:true});
  addEventListener('resize',request,{passive:true});
  update();
})();
