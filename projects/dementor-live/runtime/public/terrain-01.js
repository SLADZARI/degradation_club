/* DL-TERRAIN-01 · independent paper-cut atlas; overlays always below entities. */
(()=>{'use strict';
const ROOT='/assets/terrain/',SIZE=16;
let manifest=null,atlas=null,ready=false,loadError=null;
const memo=new WeakMap();
const key=(x,y)=>x+','+y;
function hash(x,y,salt=0){
 let a=(Math.imul(x|0,0x1f123bb5)^Math.imul(y|0,0x5f356495)^Math.imul(salt|0,0x27d4eb2d))>>>0;
 a=Math.imul(a^(a>>>16),0x7feb352d);a=Math.imul(a^(a>>>15),0x846ca68b);
 return (a^(a>>>16))>>>0;
}
function variant(kind,x,y){
 const list=manifest?.variants?.[kind]||[];
 return list.length?list[hash(x,y,kind.length)%list.length]:null;
}
async function load(){
 try{
  const response=await fetch(ROOT+'manifest.json',{cache:'no-cache'});
  if(!response.ok)throw Error('Terrain manifest '+response.status);
  const m=await response.json();
  if(m.schema!=='DL-TERRAIN-01'||!m.atlas?.['256'])throw Error('Invalid terrain manifest');
  const image=new Image();
  await new Promise((resolve,reject)=>{
   let fallback=false;
   image.onload=resolve;
   image.onerror=()=>{
     if(!fallback&&m.atlas['256'].fallback_png){fallback=true;image.src=ROOT+m.atlas['256'].fallback_png;}
     else reject(Error('Terrain atlas unavailable'));
   };
   image.src=ROOT+m.atlas['256'].file;
  });
  manifest=m;atlas=image;ready=true;
  return m;
 }catch(error){ready=false;loadError=error;throw error;}
}
let loadPromise=load();loadPromise.catch(e=>console.warn('Terrain atlas unavailable: procedural fallback',e));
function sprite(ctx,name,x,y,project,unit){
 const r=manifest?.assets?.[name]?.raster?.['256'];
 if(!r||!atlas)return false;
 const p=project(x,y),grow=.55,half=Math.sqrt(3)/2*unit;
 ctx.drawImage(atlas,r.x,r.y,r.w,r.h,p.x-half-grow,p.y-grow,2*half+2*grow,unit+2*grow);
 return true;
}
function precompute(landscape){
 const tiles=landscape?.tiles;if(!Array.isArray(tiles))return null;
 const previous=memo.get(landscape);
 if(previous&&previous.tiles===tiles&&previous.count===tiles.length&&previous.revision===(landscape.revision||0))return previous;
 const cells=new Map(),groups=new Map();
 for(const tile of tiles){
   if(!['paving','grass','flowers'].includes(tile.kind))continue;
   cells.set(key(tile.x,tile.y),tile);
   const cx=Math.floor(tile.x/SIZE),cy=Math.floor(tile.y/SIZE),id=key(cx,cy);
   if(!groups.has(id))groups.set(id,{cx,cy,records:[]});
   groups.get(id).records.push(tile);
 }
 const isRoad=(x,y)=>cells.get(key(x,y))?.kind==='paving';
 for(const group of groups.values()){
  group.records=group.records.map(t=>{
   const overlays=[];
   if(t.kind==='paving'){
    const open={n:!isRoad(t.x,t.y-1),e:!isRoad(t.x+1,t.y),s:!isRoad(t.x,t.y+1),w:!isRoad(t.x-1,t.y)};
    for(const side of ['n','e','s','w'])if(open[side])overlays.push('road_edge_'+side);
    for(const [c,pair] of Object.entries({nw:['n','w'],ne:['n','e'],se:['s','e'],sw:['s','w']}))
      if(open[pair[0]]&&open[pair[1]])overlays.push('road_corner_'+c);
   }
   return {x:t.x,y:t.y,kind:t.kind,base:variant(t.kind,t.x,t.y),overlays};
  });
 }
 const value={tiles,count:tiles.length,revision:landscape.revision||0,cells,groups};
 memo.set(landscape,value);return value;
}
function occupied(state,x,y){return !!precompute(state?.landscape)?.cells.has(key(x,y));}
function visibleChunk(group,project,unit,w,h){
 const x=group.cx*SIZE,y=group.cy*SIZE,m=unit*2+4;
 const points=[project(x,y),project(x+SIZE,y),project(x,y+SIZE),project(x+SIZE,y+SIZE)];
 return Math.max(...points.map(p=>p.x))>=-m&&Math.min(...points.map(p=>p.x))<=w+m&&
  Math.max(...points.map(p=>p.y))>=-m&&Math.min(...points.map(p=>p.y))<=h+m;
}
function draw(ctx,state,project,unit){
 if(!ready||state?.scene!=='city'||!(unit>0))return false;
 const mapped=precompute(state.landscape);if(!mapped)return false;
 const dpr=ctx.getTransform().a||1,w=ctx.canvas.width/dpr,h=ctx.canvas.height/dpr;
 const onscreen=[];
 for(const group of mapped.groups.values()){
  if(!visibleChunk(group,project,unit,w,h))continue;
  for(const tile of group.records){
   const p=project(tile.x,tile.y),half=Math.sqrt(3)/2*unit;
   if(p.x+half < -4||p.x-half > w+4||p.y+unit < -4||p.y > h+4)continue;
   onscreen.push(tile);
   // Slightly enlarged underpaint prevents fractional-scale seams without changing hitboxes.
   const corners=[project(tile.x,tile.y),project(tile.x+1,tile.y),project(tile.x+1,tile.y+1),project(tile.x,tile.y+1)];
   const center={x:(corners[0].x+corners[2].x)/2,y:(corners[0].y+corners[2].y)/2};
   ctx.beginPath();
   for(let i=0;i<corners.length;i++){
    const q=corners[i],len=Math.hypot(q.x-center.x,q.y-center.y)||1;
    const px=q.x+(q.x-center.x)*.8/len,py=q.y+(q.y-center.y)*.8/len;
    i?ctx.lineTo(px,py):ctx.moveTo(px,py);
   }
   ctx.closePath();ctx.fillStyle=tile.kind==='paving'?'#C8B69A':'#9FAB8C';ctx.fill();
   sprite(ctx,tile.base,tile.x,tile.y,project,unit);
  }
 }
 for(const tile of onscreen)for(const name of tile.overlays)sprite(ctx,name,tile.x,tile.y,project,unit);
 return true;
}
function previewCanvas(kind){
 if(typeof document==='undefined')return null;
 const c=document.createElement('canvas');c.width=112;c.height=65;c.className='terrain-preview';
 function paint(){
  const id=variant(kind,0,0),r=manifest?.assets?.[id]?.raster?.['256'];
  if(!r||!atlas)return;
  const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  ctx.drawImage(atlas,r.x,r.y,r.w,r.h,0,0,c.width,c.height);
 }
 paint();if(!ready)loadPromise.then(paint).catch(()=>{});
 return c;
}
window.DLTerrain01=Object.freeze({get ready(){return ready},get error(){return loadError},
 get manifest(){return manifest},hash,variant,load,draw,occupied,previewCanvas});
})();
