(()=>{
  if(typeof window==='undefined'||typeof document==='undefined')return;
  const path=location.pathname;
  if(path!=='/projects/'&&!path.startsWith('/projects/'))return;

  const nav=performance.getEntriesByType?.('navigation')?.[0];
  const type=nav?.type||'navigate';
  if(type==='back_forward')return;

  const hash=location.hash;
  let touched=false;
  const userTouched=()=>{touched=true;};
  addEventListener('pointerdown',userTouched,{once:true,passive:true});
  addEventListener('keydown',userTouched,{once:true,passive:true});
  addEventListener('wheel',userTouched,{once:true,passive:true});
  addEventListener('touchstart',userTouched,{once:true,passive:true});

  const headerOffset=()=>{
    const header=document.querySelector('.dc-global-header');
    return (header?.getBoundingClientRect().height||0)+16;
  };
  const scrollHash=()=>{
    if(touched||!hash)return;
    let target=null;
    try{target=document.querySelector(hash);}catch{}
    if(!target)return;
    const top=Math.max(0,target.getBoundingClientRect().top+scrollY-headerOffset());
    scrollTo({top,left:0,behavior:'auto'});
  };
  const scrollFreshTop=()=>{
    if(touched||hash||type!=='navigate')return;
    scrollTo({top:0,left:0,behavior:'auto'});
  };
  const settle=()=>{
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      hash?scrollHash():scrollFreshTop();
    }));
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',settle,{once:true});
  else settle();
  if(document.readyState!=='complete')addEventListener('load',settle,{once:true});
})();
