/* Dementor Live: G6 VISUAL QA ONLY. Loaded exclusively with server --test + DEMENTOR_ART_G6=1.
 * Add ?artG6=compare for adjacent preview, ?artG6=replace for temporary art substitution.
 * Source remains gameplay-authoritative. No new entities, persistence, inventory or permissions. */
(()=>{'use strict';
 const mode=new URLSearchParams(location.search).get('artG6');
 const enabled=mode==='compare'||mode==='replace';
 const allowed=new Set([
  'city-tool-shop','city-garden-shop','city-seed-shop','city-warehouse',
  'city-tourist-kiosk','city-museum-gate','city-university-site',
  'city-robo-stadium-site','city-industry-site','city-farlands-gate',
  'city-forge','city-forge--stage-0','city-forge--stage-1','city-forge--stage-2',
  'city-seed-shop--stage-0','plot-garden-bed-empty','plot-garden-bed-seeded',
  'plot-garden-bed-hemp','plot-garden-bed-carrot','plot-garden-bed-ready',
  'city-park-bench','city-garden-bench','city-mayor-tent','interior-chest',
  ...Array.from({length:8},(_,i)=>'plot-personal-tent-plot-'+(i+1))
 ]);
 const assets=new Map(),failed=new Set();
 function getArt(id){
  if(!enabled||!allowed.has(id)||failed.has(id))return null;
  if(assets.has(id))return assets.get(id);
  const record={image:null,bbox:null,loaded:false};
  const image=new Image();image.decoding='async';
  image.onload=()=>{
   try{
    const surface=document.createElement('canvas');surface.width=256;surface.height=256;
    const c=surface.getContext('2d',{willReadFrequently:true});
    c.drawImage(image,0,0,256,256);
    const data=c.getImageData(0,0,256,256).data;
    let x1=256,y1=256,x2=-1,y2=-1;
    for(let y=0;y<256;y++)for(let x=0;x<256;x++){
      if(data[(y*256+x)*4+3]>20){x1=Math.min(x1,x);y1=Math.min(y1,y);x2=Math.max(x2,x);y2=Math.max(y2,y);}
    }
    if(x2<x1||x1===0||y1===0||x2>=255||y2>=255)throw Error('SVG has clipped/invalid bounds');
    record.image=image;record.bbox={x:x1,y:y1,w:x2-x1+1,h:y2-y1+1};record.loaded=true;
   }catch(e){failed.add(id);console.warn('G6 art invalid',id,e);}
  };
  image.onerror=()=>{failed.add(id);console.warn('G6 art fetch failed',id);};
  image.src='/__art-g6/'+id+'.svg';
  assets.set(id,record);return record;
 }
 // Footprint is authoritative world geometry; image alpha bounds never establish collisions.
 // Ground reference is the southern projected vertex, not a magic sprite pixel offset.
 function footprintLayout(o,screen,unit,bbox){
  if(!o||![o.x,o.y,o.w,o.h,unit,bbox?.w,bbox?.h].every(Number.isFinite)||o.w<=0||o.h<=0||unit<=0||bbox.w<=0||bbox.h<=0)return null;
  const corners=[screen(o.x,o.y),screen(o.x+o.w,o.y),
    screen(o.x+o.w,o.y+o.h),screen(o.x,o.y+o.h)];
  if(corners.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)))return null;
  const xs=corners.map(p=>p.x),ys=corners.map(p=>p.y);
  const groundWidth=Math.max(...xs)-Math.min(...xs);
  const groundDepth=Math.max(...ys)-Math.min(...ys);
  // Candidate proportions retain their own height; width is based on projected CU.
  const width=Math.max(.01,groundWidth*.92);
  const height=width*bbox.h/bbox.w;
  const foot=corners[2]; // South vertex: projected +X,+Y, retained for CU/debug evidence.
  // Rectangular CU footprints have a south vertex horizontally OFFSET from the center
  // of the projected diamond. Center the sprite on the footprint, not on that vertex.
  // This is preliminary visual mapping; actual door pixels still require G6 screenshots.
  const visualAnchor={x:(Math.min(...xs)+Math.max(...xs))/2,y:Math.max(...ys)};
  const horizontalOffset=visualAnchor.x-foot.x;
  return {left:visualAnchor.x-width/2,top:visualAnchor.y-height,width,height,
    foot,visualAnchor,horizontalOffset,corners,groundWidth,groundDepth};
 }
 function bedArtId(bed,now){
  if(!bed?.crop)return 'plot-garden-bed-empty';
  if(!bed.watered)return 'plot-garden-bed-seeded';
  if(Number.isFinite(bed.readyAt)&&now>=bed.readyAt)return 'plot-garden-bed-ready';
  return bed.crop==='hemp'?'plot-garden-bed-hemp':bed.crop==='carrot'?'plot-garden-bed-carrot':'plot-garden-bed-seeded';
 }
 function forgeArtId(stage,total){
  if(!Number.isInteger(stage)||!Number.isInteger(total)||total!==3||stage<0||stage>total)return null;
  return stage===total?'city-forge':'city-forge--stage-'+stage;
 }
 function seedArtId(stage,total){
  if(!Number.isInteger(stage)||total!==1||stage<0||stage>total)return null;
  return stage===total?'city-seed-shop':'city-seed-shop--stage-0';
 }
 // Mirrors existing visual-variants.mjs without writing to character, plot or world save.
 function stableHash(value){
  let h=2166136261;
  for(const ch of String(value)){h^=ch.codePointAt(0);h=Math.imul(h,16777619);}
  return h>>>0;
 }
 function tentArtId(cityId,plotId,stage){
  if(stage!==3)return null; // only actual completed existing player tents
  const match=/^plot-(\d+)$/.exec(String(plotId));
  const idx=match?(Number(match[1])-1)%8:stableHash(plotId)%8;
  const offset=cityId==='origin'?0:stableHash(cityId)%8;
  return 'plot-personal-tent-plot-'+(1+(idx+offset)%8);
 }
 function drawGroundProp(ctx,id,x,y,screen,unit,size=1.2){
  if(!enabled||!allowed.has(id)||!(unit>0))return false;
  const art=getArt(id);if(!art?.loaded)return false;
  const foot=screen(x,y),bbox=art.bbox,width=size*unit,height=width*bbox.h/bbox.w;
  ctx.save();
  let left=foot.x-width/2,top=foot.y-height;
  if(mode==='compare'){left+=width*1.1;ctx.globalAlpha=.86;}
  ctx.drawImage(art.image,bbox.x,bbox.y,bbox.w,bbox.h,left,top,width,height);
  ctx.restore();
  return mode==='replace';
 }
 function draw(ctx,id,footprint,screen,unit){
  if(!enabled||!allowed.has(id)||!footprint||!(unit>0))return false;
  const art=getArt(id);if(!art?.loaded)return false;
  const {x,y,w,h}=footprint;
  if(![x,y,w,h].every(Number.isFinite)||w<=0||h<=0)return false;
  const {bbox,image}=art;
  // Preliminary scene-scale mapping: drawn alpha bounds, not collision. G6 must confirm this alignment.
  const layout=footprintLayout(footprint,screen,unit,bbox);
  if(!layout)return false;
  const {width,height}=layout;
  let {left,top}=layout;
  ctx.save();
  if(mode==='compare'){
    // Comparison mode never changes the normal procedural render.
    left+=Math.max(width*.9,unit*1.5);
    ctx.globalAlpha=.86;
  }
  ctx.drawImage(image,bbox.x,bbox.y,bbox.w,bbox.h,left,top,width,height);
  if(mode==='compare'){
   // Measurable debug evidence: world footprint diamond, projected southern anchor,
   // and candidate art without modifying the original building/actor z-order.
   ctx.globalAlpha=1;
   ctx.strokeStyle='#317e81';ctx.lineWidth=1.5;ctx.setLineDash([5,4]);
   ctx.beginPath();
   layout.corners.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
   ctx.closePath();ctx.stroke();ctx.setLineDash([]);
   ctx.beginPath();ctx.arc(layout.foot.x,layout.foot.y,4,0,Math.PI*2);
   ctx.fillStyle='#b34f39';ctx.fill();
   ctx.beginPath();ctx.arc(layout.visualAnchor.x,layout.visualAnchor.y,3,0,Math.PI*2);
   ctx.fillStyle='#296d95';ctx.fill();
   ctx.beginPath();ctx.moveTo(layout.foot.x,layout.foot.y);
   ctx.lineTo(layout.visualAnchor.x,layout.visualAnchor.y);
   ctx.strokeStyle='#b34f39';ctx.setLineDash([2,3]);ctx.stroke();ctx.setLineDash([]);
   ctx.fillStyle='#53664b';ctx.font='11px sans-serif';
   ctx.fillText('G6 candidate · CU '+w+'×'+h,left,top-5);
  }
  ctx.restore();
  return mode==='replace';
 }
 function debugHealth(){return Object.freeze({
  loaded:[...assets.values()].filter(v=>v.loaded).length,
  requested:assets.size,failed:failed.size,
  mode
 });}
 window.DLWorldArtG6=Object.freeze({enabled,mode,draw,drawGroundProp,bedArtId,forgeArtId,seedArtId,footprintLayout,tentArtId,debugHealth,ids:Object.freeze([...allowed]),failed});
 if(enabled)console.info('Dementor G6 candidate art preview:',mode,'No gameplay state mutation.');
})();
