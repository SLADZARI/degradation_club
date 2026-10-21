/* Dementor Live: G6 VISUAL QA ONLY. Loaded exclusively with server --test + DEMENTOR_ART_G6=1.
 * Add ?artG6=compare for adjacent preview, ?artG6=replace for temporary art substitution.
 * Source remains gameplay-authoritative. No new entities, persistence, inventory or permissions. */
(()=>{'use strict';
 const mode=new URLSearchParams(location.search).get('artG6');
 const enabled=mode==='compare'||mode==='replace';
 const allowed=new Set([
  'city-tool-shop','city-garden-shop','city-seed-shop','city-warehouse',
  'city-tourist-kiosk','city-museum-gate','city-university-site',
  'city-robo-stadium-site','city-industry-site','city-farlands-gate'
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
 function draw(ctx,id,footprint,screen,unit){
  if(!enabled||!allowed.has(id)||!footprint||!(unit>0))return false;
  const art=getArt(id);if(!art?.loaded)return false;
  const {x,y,w,h}=footprint;
  if(![x,y,w,h].every(Number.isFinite)||w<=0||h<=0)return false;
  const {bbox,image}=art;
  // Preliminary scene-scale mapping: drawn alpha bounds, not collision. G6 must confirm this alignment.
  const bottom=screen(x+w,y+h);
  const middle=screen(x+w/2,y+h/2);
  const width=Math.min(12*unit,Math.max(1.7*unit,(w+h)*Math.sqrt(3)/2*unit*.90));
  const height=width*bbox.h/bbox.w;
  let left=middle.x-width/2;
  let top=bottom.y-height;
  ctx.save();
  if(mode==='compare'){
    // Comparison mode never changes the normal procedural render.
    left+=Math.max(width*.9,unit*1.5);
    ctx.globalAlpha=.86;
  }
  ctx.drawImage(image,bbox.x,bbox.y,bbox.w,bbox.h,left,top,width,height);
  if(mode==='compare'){
   ctx.globalAlpha=1;ctx.fillStyle='#53664b';ctx.font='11px sans-serif';
   ctx.fillText('G6 art candidate',left,top-5);
  }
  ctx.restore();
  return mode==='replace';
 }
 window.DLWorldArtG6=Object.freeze({enabled,mode,draw,ids:Object.freeze([...allowed]),failed});
 if(enabled)console.info('Dementor G6 candidate art preview:',mode,'No gameplay state mutation.');
})();
