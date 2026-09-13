(()=>{
  const params=new URLSearchParams(location.search);
  if(params.get('dc_share_debug')!=='1')return;

  const trace=[];
  const maxTrace=18;
  const describe=node=>{
    if(!node)return'null';
    const tag=String(node.tagName||node.nodeName||'node').toLowerCase();
    const id=node.id?`#${node.id}`:'';
    const classes=node.classList?.length?'.'+[...node.classList].slice(0,5).join('.'):'';
    const attrs=[];
    if(node.matches?.('[data-board-share]'))attrs.push('[data-board-share]');
    if(node.matches?.('[data-artifact]'))attrs.push(`[data-artifact=${node.dataset.artifact||''}]`);
    if(node.matches?.('[data-source-id]'))attrs.push(`[data-source-id=${node.dataset.sourceId||''}]`);
    return `${tag}${id}${classes}${attrs.join('')}`;
  };
  const rectData=el=>{
    if(!el)return null;
    const r=el.getBoundingClientRect();
    return {left:Math.round(r.left),top:Math.round(r.top),right:Math.round(r.right),bottom:Math.round(r.bottom),width:Math.round(r.width),height:Math.round(r.height)};
  };
  const runtimeOwners=()=>[...document.scripts].map(s=>s.src).filter(Boolean).filter(src=>/board-(?:own-drag-livefix|spatial|fullscreen|deeplink|layout|entry)/.test(src));
  const state=()=>({
    artifactOpen:document.documentElement.dataset.boardArtifactOpen||'',
    dragging:document.documentElement.dataset.boardDragging||'',
    overlayHidden:document.querySelector('.dc-artifact-overlay')?.hidden??true,
    href:location.href,
    runtimes:runtimeOwners()
  });
  const eventRecord=event=>{
    const x=Number(event.clientX)||0,y=Number(event.clientY)||0;
    const hit=document.elementFromPoint(x,y);
    const target=event.target;
    const card=target?.closest?.('.dc-notice[data-artifact],.dc-projection[data-source-id]')||hit?.closest?.('.dc-notice[data-artifact],.dc-projection[data-source-id]');
    const share=card?.querySelector?.(':scope > [data-board-share]')||card?.querySelector?.('[data-board-share]')||null;
    const shareRect=rectData(share);
    const insideShare=!!shareRect&&x>=shareRect.left&&x<=shareRect.right&&y>=shareRect.top&&y<=shareRect.bottom;
    return {
      t:Math.round(performance.now()),
      type:event.type,
      pointerType:event.pointerType||'',
      x:Math.round(x),y:Math.round(y),
      target:describe(target),
      hit:describe(hit),
      directShare:!!target?.closest?.('[data-board-share]'),
      insideShare,
      share:describe(share),
      shareRect,
      path:event.composedPath?.().slice(0,9).map(describe)||[],
      state:state()
    };
  };

  const panel=document.createElement('pre');
  panel.id='dcShareLiveDiagnostic';
  Object.assign(panel.style,{
    position:'fixed',right:'8px',top:'88px',zIndex:'2147483647',width:'440px',maxWidth:'calc(100vw - 16px)',maxHeight:'46vh',overflow:'auto',margin:'0',padding:'10px',boxSizing:'border-box',border:'2px solid #111',background:'rgba(248,245,237,.96)',color:'#111',font:'700 10px/1.35 ui-monospace,SFMono-Regular,Menlo,monospace',whiteSpace:'pre-wrap',pointerEvents:'none',boxShadow:'4px 4px 0 #111'
  });
  document.documentElement.appendChild(panel);

  function render(){
    const last=trace.slice(-6);
    const scripts=runtimeOwners().map(src=>src.split('/').pop()).join('\n  ');
    panel.textContent=[
      'LIVE SHARE DEBUG v1',
      `URL: ${location.pathname}${location.search}`,
      `artifactOpen=${document.documentElement.dataset.boardArtifactOpen||'0'} dragging=${document.documentElement.dataset.boardDragging||'0'}`,
      'RUNTIMES:',`  ${scripts||'none'}`,
      '',
      ...last.map(item=>[
        `${item.type}${item.pointerType?`/${item.pointerType}`:''} @ ${item.x},${item.y}`,
        `target: ${item.target}`,
        `hit:    ${item.hit}`,
        `directShare=${item.directShare} insideShare=${item.insideShare}`,
        `share:  ${item.share} ${item.shareRect?JSON.stringify(item.shareRect):''}`,
        `path:   ${item.path.join(' > ')}`,
        `state:  open=${item.state.artifactOpen||'0'} drag=${item.state.dragging||'0'} overlayHidden=${item.state.overlayHidden}`,
        '---'
      ].join('\n'))
    ].join('\n');
  }

  for(const type of ['pointerdown','pointerup','mousedown','mouseup','click']){
    document.addEventListener(type,event=>{
      trace.push(eventRecord(event));
      if(trace.length>maxTrace)trace.splice(0,trace.length-maxTrace);
      globalThis.__DC_SHARE_DEBUG_TRACE=trace;
      console.info('[DC Share Live Debug]',trace.at(-1));
      render();
      setTimeout(render,0);
    },true);
  }
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['data-board-artifact-open','data-board-dragging']});
  globalThis.__DC_SHARE_DEBUG={trace,state,runtimeOwners,render};
  render();
})();
