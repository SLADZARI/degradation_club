/* DL-TERRAIN-01 ISO30: immutable atlas, chunk-culled read-only renderer and shop previews. */
(()=>{'use strict';
const PREFIX='/assets/terrain/',CHUNK=16;
const KINDS=['paving','grass','flowers'],BASE={paving:'road_01',grass:'grass_01',flowers:'flowers_01'};
let manifest=null,atlas=null,loadError=null,ready=false,loadPromise=null;
let cache={city:null,revision:-1,length:-1,tiles:null,byXY:new Map(),chunks:new Map(),roads:[]};
const key=(x,y)=>x+','+y;
function hash(x,y,salt=0){let v=(Math.imul(x|0,0x1f123bb5)^Math.imul(y|0,0x5f356495)^Math.imul(salt|0,0x27d4eb2d))>>>0;
v=Math.imul(v^(v>>>16),0x7feb352d);v=Math.imul(v^(v>>>15),0x846ca68b);return(v^(v>>>16))>>>0;}
function variant(kind,x,y){const ids=manifest?.variants?.[kind]||[BASE[kind]];return ids.length?ids[hash(x,y,kind.length)%ids.length]:null;}
function load(){if(loadPromise)return loadPromise;loadPromise=fetch(PREFIX+'manifest.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('terrain manifest '+r.status);return r.json();}).then(m=>{
if(m.schema!=='DL-TERRAIN-01'||!m.atlas?.['256']||Object.keys(m.assets||{}).length!==17)throw Error('Invalid terrain manifest');manifest=m;
return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>{atlas=i;ready=true;resolve(m)};let fallback=false;i.onerror=()=>{if(!fallback&&m.atlas['256'].fallback_png){fallback=true;i.src=PREFIX+m.atlas['256'].fallback_png;return;}reject(Error('Terrain atlas unavailable'));};i.src=PREFIX+m.atlas['256'].file;});
}).catch(e=>{loadError=e;ready=false;console.warn('DL-TERRAIN-01 fallback to procedural',e);return null;});return loadPromise;}
function rebuild(state){
const land=state?.landscape,tiles=land?.tiles||[],city=state?.cityNetwork?.current||'origin';
const rev=Number.isSafeInteger(land?.revision)?land.revision:tiles.length;
if(cache.city===city&&cache.revision===rev&&cache.length===tiles.length&&cache.tiles===tiles)return cache;
const byXY=new Map(),chunks=new Map(),roads=[];
for(const tile of tiles){if(!KINDS.includes(tile.kind))continue;byXY.set(key(tile.x,tile.y),tile);
const k=key(Math.floor(tile.x/CHUNK),Math.floor(tile.y/CHUNK));if(!chunks.has(k))chunks.set(k,[]);chunks.get(k).push(tile);}
for(const tile of tiles)if(tile.kind==='paving'){const x=tile.x,y=tile.y,open={n:byXY.get(key(x,y-1))?.kind!=='paving',e:byXY.get(key(x+1,y))?.kind!=='paving',s:byXY.get(key(x,y+1))?.kind!=='paving',w:byXY.get(key(x-1,y))?.kind!=='paving'};
const parts=[];for(const side of ['n','e','s','w'])if(open[side])parts.push('road_edge_'+side);
for(const [corner,a,b] of [['nw','n','w'],['ne','n','e'],['se','s','e'],['sw','s','w']])if(open[a]&&open[b])parts.push('road_corner_'+corner);
roads.push({tile,parts});}
cache={city,revision:rev,length:tiles.length,tiles,byXY,chunks,roads};return cache;
}
function drawSprite(ctx,name,x,y,screen,unit){const rect=manifest?.assets?.[name]?.raster?.['256'];if(!ready||!rect)return;
const p=screen(x,y),half=Math.sqrt(3)/2*unit,overlap=.55;
ctx.drawImage(atlas,rect.x,rect.y,rect.w,rect.h,p.x-half-overlap,p.y-overlap,2*half+2*overlap,unit+2*overlap);}
function roadUnderpaint(ctx,x,y,screen){const pts=[screen(x,y),screen(x+1,y),screen(x+1,y+1),screen(x,y+1)],c={x:(pts[0].x+pts[2].x)/2,y:(pts[0].y+pts[2].y)/2};
ctx.beginPath();pts.forEach((p,i)=>{const d=Math.hypot(p.x-c.x,p.y-c.y)||1;const xx=p.x+(p.x-c.x)*.8/d,yy=p.y+(p.y-c.y)*.8/d;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)});ctx.closePath();ctx.fillStyle='#C8B69A';ctx.fill();}
function bounds(ctx,screen,unit,worldPoint){
const dpr=ctx.getTransform().a||1,w=ctx.canvas.width/dpr,h=ctx.canvas.height/dpr;
if(!worldPoint)return{x0:-10000,y0:-10000,x1:10000,y1:10000,w,h};
const corners=[[0,0],[w,0],[0,h],[w,h]].map(([x,y])=>worldPoint(x,y));
return{x0:Math.floor(Math.min(...corners.map(p=>p.x)))-2,x1:Math.ceil(Math.max(...corners.map(p=>p.x)))+2,
y0:Math.floor(Math.min(...corners.map(p=>p.y)))-2,y1:Math.ceil(Math.max(...corners.map(p=>p.y)))+2,w,h};
}
function draw(ctx,state,screen,unit,worldPoint){
if(!ready||!state||state.scene!=='city'||!Array.isArray(state.landscape?.tiles)||!(unit>0))return false;
const indexed=rebuild(state),b=bounds(ctx,screen,unit,worldPoint),list=[];
for(let cy=Math.floor(b.y0/CHUNK);cy<=Math.floor(b.y1/CHUNK);cy++)for(let cx=Math.floor(b.x0/CHUNK);cx<=Math.floor(b.x1/CHUNK);cx++){
const chunk=indexed.chunks.get(key(cx,cy));if(chunk)for(const t of chunk){if(t.x<b.x0||t.x>b.x1||t.y<b.y0||t.y>b.y1)continue;list.push(t);}}
for(const t of list){if(t.kind==='paving')roadUnderpaint(ctx,t.x,t.y,screen);drawSprite(ctx,variant(t.kind,t.x,t.y),t.x,t.y,screen,unit);}
const visible=new Set(list.map(t=>key(t.x,t.y)));
for(const r of indexed.roads)if(visible.has(key(r.tile.x,r.tile.y)))for(const part of r.parts)drawSprite(ctx,part,r.tile.x,r.tile.y,screen,unit);
return true;
}
function kindAt(state,x,y){return rebuild(state).byXY.get(key(x,y))?.kind||null;}
function catalogImage(kind){const c=document.createElement('canvas');c.width=112;c.height=68;c.className='terrain-thumb';c.setAttribute('role','img');c.setAttribute('aria-label',({paving:'Дорожная плитка',grass:'Газон',flowers:'Цветы'})[kind]||'Покрытие');const draw=()=>{const name=BASE[kind],r=manifest?.assets?.[name]?.raster?.['256'];if(!r||!atlas)return;const ctx=c.getContext('2d');ctx.clearRect(0,0,112,68);ctx.drawImage(atlas,r.x,r.y,r.w,r.h,3,2,106,64);};draw();load().then(draw);return c;}
const api=Object.freeze({get ready(){return ready},get error(){return loadError},get manifest(){return manifest},load,hash,variant,rebuild,kindAt,draw,catalogImage});
window.DLTerrain01=api;load();
})();
