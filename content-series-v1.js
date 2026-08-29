(()=>{
  if(window.__DC_CONTENT_SERIES_V1__)return;
  window.__DC_CONTENT_SERIES_V1__=true;

  const style=document.createElement('style');
  style.id='dc-content-series-v1';
  style.textContent=`
    .dc-carousel-publication{overflow:hidden}
    .dc-carousel-grid.dc-content-series{display:flex;gap:clamp(12px,2vw,28px);overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scroll-behavior:smooth;overscroll-behavior-inline:contain;scrollbar-width:none;padding:24px max(18px,calc((100vw - min(68vw,620px))/2)) 28px;margin-inline:calc(50% - 50vw);cursor:grab;touch-action:pan-x pan-y}
    .dc-carousel-grid.dc-content-series::-webkit-scrollbar{display:none}
    .dc-carousel-grid.dc-content-series.is-dragging{cursor:grabbing;scroll-snap-type:none;user-select:none}
    .dc-content-series figure{flex:0 0 min(68vw,620px);scroll-snap-align:center;scroll-snap-stop:always;transform:scale(.82);transform-origin:center;opacity:.48;transition:transform .28s ease,opacity .28s ease;position:relative}
    .dc-content-series figure.is-active{transform:scale(1);opacity:1;z-index:2}
    .dc-content-series figure.is-near{transform:scale(.9);opacity:.72}
    .dc-content-series figure img{width:100%;height:auto;display:block}
    .dc-content-series-controls{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:20px;padding-top:16px;border-top:1px solid var(--dc-line,rgba(17,17,17,.2))}
    .dc-content-series-count{font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-variant-numeric:tabular-nums}
    .dc-content-series-nav{display:flex;gap:8px}
    .dc-content-series-btn{appearance:none;border:1px solid currentColor;background:transparent;color:inherit;width:46px;height:46px;display:grid;place-items:center;font:700 18px/1 Arial,sans-serif;cursor:pointer;transition:background .16s ease,color .16s ease}
    .dc-content-series-btn:hover,.dc-content-series-btn:focus-visible{background:var(--dc-acid,#d8ff3e);color:var(--dc-ink,#111);outline:none}
    .dc-content-series-btn:disabled{opacity:.25;cursor:default;background:transparent}
    .dc-content-series-hint{font-size:10px;letter-spacing:.09em;text-transform:uppercase;opacity:.55}
    @media(max-width:700px){
      .dc-carousel-grid.dc-content-series{gap:12px;padding:12px 6vw 20px;margin-inline:calc(50% - 50vw)}
      .dc-content-series figure{flex-basis:86vw;transform:scale(.92);opacity:.62}
      .dc-content-series figure.is-near{transform:scale(.95);opacity:.76}
      .dc-content-series figure.is-active{transform:scale(1);opacity:1}
      .dc-content-series-nav{display:none}
      .dc-content-series-controls{margin-top:12px}
      .dc-content-series-hint{display:block}
    }
    @media(min-width:701px){.dc-content-series-hint{display:none}}
    @media(prefers-reduced-motion:reduce){.dc-carousel-grid.dc-content-series{scroll-behavior:auto}.dc-content-series figure{transition:none}}
  `;
  document.head.appendChild(style);

  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const enhance=(track,seriesIndex)=>{
    const slides=[...track.querySelectorAll(':scope > figure')];
    if(slides.length<2)return;
    track.classList.add('dc-content-series');
    track.tabIndex=0;
    track.setAttribute('role','region');
    track.setAttribute('aria-label',`Серия материалов ${seriesIndex+1}. ${slides.length} кадров`);

    const controls=document.createElement('div');
    controls.className='dc-content-series-controls';
    controls.innerHTML=`<span class="dc-content-series-count" aria-live="polite">01 / ${String(slides.length).padStart(2,'0')}</span><span class="dc-content-series-hint">Свайпните, чтобы смотреть серию</span><span class="dc-content-series-nav"><button class="dc-content-series-btn" type="button" data-dir="-1" aria-label="Предыдущий кадр">←</button><button class="dc-content-series-btn" type="button" data-dir="1" aria-label="Следующий кадр">→</button></span>`;
    track.insertAdjacentElement('afterend',controls);

    const count=controls.querySelector('.dc-content-series-count');
    const prev=controls.querySelector('[data-dir="-1"]');
    const next=controls.querySelector('[data-dir="1"]');
    let active=0,raf=0;

    const paint=index=>{
      active=clamp(index,0,slides.length-1);
      slides.forEach((slide,i)=>{
        slide.classList.toggle('is-active',i===active);
        slide.classList.toggle('is-near',Math.abs(i-active)===1);
        slide.setAttribute('aria-current',i===active?'true':'false');
      });
      count.textContent=`${String(active+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
      prev.disabled=active===0;
      next.disabled=active===slides.length-1;
    };

    const nearest=()=>{
      const center=track.scrollLeft+track.clientWidth/2;
      let best=0,bestDistance=Infinity;
      slides.forEach((slide,i)=>{
        const slideCenter=slide.offsetLeft+slide.offsetWidth/2;
        const d=Math.abs(slideCenter-center);
        if(d<bestDistance){best=i;bestDistance=d;}
      });
      paint(best);
    };
    const onScroll=()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;nearest();});};
    track.addEventListener('scroll',onScroll,{passive:true});

    const targetLeft=index=>{
      const slide=slides[index];
      return Math.max(0,slide.offsetLeft-(track.clientWidth-slide.offsetWidth)/2);
    };

    const go=(index,{behavior=true}={})=>{
      const i=clamp(index,0,slides.length-1);
      const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollTo({left:targetLeft(i),top:0,behavior:behavior&&!reduce?'smooth':'auto'});
      paint(i);
    };

    prev.addEventListener('click',()=>go(active-1));
    next.addEventListener('click',()=>go(active+1));
    slides.forEach((slide,i)=>slide.addEventListener('click',()=>{if(i!==active)go(i);}));
    track.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();go(active-1);}if(e.key==='ArrowRight'){e.preventDefault();go(active+1);}});

    let dragging=false,startX=0,startScroll=0,moved=false;
    track.addEventListener('pointerdown',e=>{
      if(e.pointerType!=='mouse'||e.button!==0)return;
      dragging=true;moved=false;startX=e.clientX;startScroll=track.scrollLeft;track.classList.add('is-dragging');track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove',e=>{
      if(!dragging)return;
      const dx=e.clientX-startX;if(Math.abs(dx)>4)moved=true;track.scrollLeft=startScroll-dx;
    });
    const endDrag=e=>{
      if(!dragging)return;dragging=false;track.classList.remove('is-dragging');if(track.hasPointerCapture?.(e.pointerId))track.releasePointerCapture(e.pointerId);nearest();if(moved)requestAnimationFrame(()=>go(active));
    };
    track.addEventListener('pointerup',endDrag);
    track.addEventListener('pointercancel',endDrag);

    paint(0);
    /* Initial centering must never scroll the document vertically. */
    requestAnimationFrame(()=>go(0,{behavior:false}));
  };

  const boot=()=>document.querySelectorAll('.dc-carousel-grid').forEach(enhance);
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot,{once:true}):boot();
})();
