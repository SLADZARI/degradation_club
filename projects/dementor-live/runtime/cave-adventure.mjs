// DEMENTOR LIVE DL-CAVE-01
// Isolated, deterministic cave gameplay model (no production state writes).
// Integration into the existing 2D Game/WorldTravel and UI is a separate release gate.
export const CAVE_VIDEO_ID = 'bzLeA4XHsH8';
export const CAVE_VIDEO_URL = 'https://www.youtube.com/watch?v='+CAVE_VIDEO_ID;
export const CAVE_ARTIFACT = 'Что вы этим хотели сказать?';
export const CAVE_WIDTH = 41, CAVE_HEIGHT = 29;
export const CAVE_ENTRANCE = Object.freeze({x:1,y:1});
export const BAIT_KINDS = Object.freeze(['worm','larva']);
export const FISH_KINDS = Object.freeze(['roach','perch','carp']);
export const BAT_DAMAGE = 4;
const key=(x,y)=>x+','+y;
function seeded(seed){
 let x=seed>>>0;
 return ()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296;};
}
function adjacent(x,y){return [[x,y-2],[x+2,y],[x,y+2],[x-2,y]];}
function shuffle(a,random){for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function bfs(tiles,start){
 const queue=[start],d=new Map([[key(start.x,start.y),0]]),parent=new Map();
 for(let n=0;n<queue.length;n++){
  const p=queue[n],distance=d.get(key(p.x,p.y));
  for(const [dx,dy] of [[0,1],[1,0],[0,-1],[-1,0]]){
   const x=p.x+dx,y=p.y+dy,k=key(x,y);
   if(y<0||y>=tiles.length||x<0||x>=tiles[0].length||tiles[y][x]==='#'||d.has(k))continue;
   d.set(k,distance+1);parent.set(k,p);queue.push({x,y});
  }
 }
 return {queue,d,parent};
}
export function shortestCavePath(layout,from,to){
 const result=bfs(layout.tiles,from),distance=result.d.get(key(to.x,to.y));
 if(distance===undefined)return null;
 const steps=[];for(let p=to;p;p=result.parent.get(key(p.x,p.y)))steps.push(p);
 return steps.reverse();
}
export function generateCave(seed=20261020){
 const random=seeded(seed),tiles=Array.from({length:CAVE_HEIGHT},()=>Array(CAVE_WIDTH).fill('#'));
 const visited=new Set([key(1,1)]),stack=[{x:1,y:1}];tiles[1][1]='.';
 while(stack.length){
  const p=stack[stack.length-1];
  const opts=shuffle(adjacent(p.x,p.y).filter(([x,y])=>x>0&&y>0&&x<CAVE_WIDTH-1&&y<CAVE_HEIGHT-1&&!visited.has(key(x,y))),random);
  if(!opts.length){stack.pop();continue;}
  const [x,y]=opts[0];visited.add(key(x,y));tiles[(p.y+y)/2][(p.x+x)/2]='.';tiles[y][x]='.';stack.push({x,y});
 }
 const map=tiles.map(row=>row.join(''));
 const start=bfs(map,CAVE_ENTRANCE);
 const leaves=start.queue.filter(p=>{
  let n=0;for(const [dx,dy] of [[0,1],[1,0],[0,-1],[-1,0]])if(map[p.y+dy]?.[p.x+dx]==='.')n++;
  return n===1&&key(p.x,p.y)!=='1,1';
 });
 leaves.sort((a,b)=>start.d.get(key(b.x,b.y))-start.d.get(key(a.x,a.y)));
 const door=leaves[0];const doorRoutes=bfs(map,door);
 // The key is in a different dead-end requiring a detour rather than lying on the door's route.
 const candidates=leaves.filter(p=>key(p.x,p.y)!==key(door.x,door.y)&&start.d.get(key(p.x,p.y))>=35);
 candidates.sort((a,b)=>{
  const score=p=>start.d.get(key(p.x,p.y))+doorRoutes.d.get(key(p.x,p.y));
  return score(b)-score(a);
 });
 const hiddenKey=candidates[0]||leaves[1];
 const distanceToKey=start.d.get(key(hiddenKey.x,hiddenKey.y));
 const distanceToDoor=doorRoutes.d.get(key(hiddenKey.x,hiddenKey.y));
 const routeLength=distanceToKey+distanceToDoor;
 const lanternCharge=Math.ceil(routeLength*0.54); // one charge cannot cover the required optimal route
 const sites=start.queue.filter(p=>(p.x%2===1&&p.y%2===1)&&start.d.get(key(p.x,p.y))>15&&!([hiddenKey,door].some(o=>key(o.x,o.y)===key(p.x,p.y))));
 const bats=sites.filter((_,i)=>i%37===5).map(p=>key(p.x,p.y));
 const snacks=sites.filter((_,i)=>i%53===20).map(p=>key(p.x,p.y));
 const spareOil=sites.find(p=>start.d.get(key(p.x,p.y))>distanceToKey/2&&start.d.get(key(p.x,p.y))<distanceToKey/2+20);
 return {seed,width:CAVE_WIDTH,height:CAVE_HEIGHT,tiles:map,entrance:CAVE_ENTRANCE,keyAt:hiddenKey,secretDoor:door,
  routeLength,lanternCharge,batTiles:bats,foodTiles:snacks,spareOilAt:spareOil,spareOilAmount:Math.ceil(lanternCharge*0.18)};
}
export const CAVE_LAYOUT=generateCave();
export function newCaveExplorer(id,{oil=CAVE_LAYOUT.lanternCharge}={}){
 return {id,scene:'mountain_cave',x:1,y:1,health:100,food:0,oil,maxOil:CAVE_LAYOUT.lanternCharge,lanternOn:false,
  keyFound:false,doorOpened:false,videoSeen:false,fish:[],offeringComplete:false,
  collectedFood:[],collectedOil:false,batVisited:[],blackoutSteps:0,receipts:{}};
}
export function isCaveOpen(layout,x,y){return layout.tiles[y]?.[x]==='.';}
export function caveVisibleCells(layout,explorers){
 // Geometry-aligned visibility: only straight corridors; never reveal through stone walls.
 const seen=new Set();
 for(const p of explorers){
  if(!p.lanternOn||p.oil<=0||p.blackoutSteps>0)continue;
  for(let yy=Math.max(1,p.y-5);yy<=Math.min(layout.height-2,p.y+5);yy++)
  for(let xx=Math.max(1,p.x-5);xx<=Math.min(layout.width-2,p.x+5);xx++){
   if(Math.hypot(xx-p.x,yy-p.y)>5||!isCaveOpen(layout,xx,yy))continue;
   const count=Math.ceil(Math.max(Math.abs(xx-p.x),Math.abs(yy-p.y))*3);
   let clear=true;
   for(let i=1;i<=count;i++){
    const x=Math.round(p.x+(xx-p.x)*i/count),y=Math.round(p.y+(yy-p.y)*i/count);
    if(!isCaveOpen(layout,x,y)){clear=false;break;}
   }
   if(clear)seen.add(key(xx,yy));
  }
 }
 return seen;
}
function record(p,id,value){
 p.receipts[id]=value;
 const keys=Object.keys(p.receipts);
 if(keys.length>256)delete p.receipts[keys[0]];
 return value;
}
export function caveCommand(layout,p,command){
 const {type,requestId}=command;
 if(!requestId||typeof requestId!=='string')throw Error('Нужен requestId');
 if(Object.hasOwn(p.receipts,requestId))return p.receipts[requestId];
 if(type==='toggleLantern'){
  if(!p.oil&&!p.lanternOn)throw Error('Кончилось конопляное масло');
  p.lanternOn=!p.lanternOn;return record(p,requestId,{type,lit:p.lanternOn});
 }
 if(type==='step'){
  const x=command.x,y=command.y;
  if(!Number.isInteger(x)||!Number.isInteger(y)||Math.abs(x-p.x)+Math.abs(y-p.y)!==1||!isCaveOpen(layout,x,y))throw Error('Стена или невозможный шаг');
  if(p.offeringComplete===true&&p.scene!=='mountain_cave')throw Error('Вернись в пещеру');
  p.x=x;p.y=y;
  if(p.lanternOn){p.oil=Math.max(0,p.oil-1);if(p.oil===0)p.lanternOn=false;}
  if(p.blackoutSteps>0)p.blackoutSteps--;
  const pos=key(x,y),events=[];
  if(layout.batTiles.includes(pos)&&!p.batVisited.includes(pos)){
   p.batVisited.push(pos);p.health=Math.max(1,p.health-BAT_DAMAGE);p.blackoutSteps=3;events.push('bats');
  }
  if(layout.foodTiles.includes(pos)&&!p.collectedFood.includes(pos)){
   p.collectedFood.push(pos);p.food++;events.push('food');
  }
  if(layout.spareOilAt&&pos===key(layout.spareOilAt.x,layout.spareOilAt.y)&&!p.collectedOil){
   p.collectedOil=true;p.oil+=layout.spareOilAmount;events.push('oil');
  }
  if(pos===key(layout.keyAt.x,layout.keyAt.y)&&!p.keyFound){p.keyFound=true;events.push('key');}
  return record(p,requestId,{type,x,y,events,oil:p.oil,health:p.health});
 }
 if(type==='openSecretDoor'){
  if(!p.keyFound)throw Error('Тайная дверь заперта: нужен ключ');
  if(Math.abs(p.x-layout.secretDoor.x)+Math.abs(p.y-layout.secretDoor.y)>1)throw Error('Слишком далеко до секретной двери');
  p.doorOpened=true;p.videoSeen=true;
  return record(p,requestId,{type,playYouTube:CAVE_VIDEO_ID,artifact:CAVE_ARTIFACT,altarMessage:'Принеси рыбу'});
 }
 if(type==='offerFish'){
  if(!p.doorOpened)throw Error('Алтарь за тайной дверью');
  if(p.offeringComplete)return record(p,requestId,{type,alreadyComplete:true});
  if(!p.fish?.length)throw Error('Алтарь требует рыбу: добудь её в реке');
  const offered=p.fish.shift();p.offeringComplete=true;
  return record(p,requestId,{type,offered,artifact:CAVE_ARTIFACT,complete:true});
 }
 throw Error('Неизвестная команда пещеры');
}
const fishByBait={worm:['roach','perch','carp'],larva:['roach','perch','perch']};
function hash(str){let h=2166136261;for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export function newFishingKit(){return {rod:false,rodDurability:0,bait:{worm:0,larva:0},digAttempts:0,fish:[],receipts:{}};}
export function fishingCommand(p,kit,command){
 const {type,requestId}=command;if(!requestId||typeof requestId!=='string')throw Error('Нужен requestId');
 if(Object.hasOwn(kit.receipts,requestId))return kit.receipts[requestId];
 const once=result=>{kit.receipts[requestId]=result;const all=Object.keys(kit.receipts);if(all.length>256)delete kit.receipts[all[0]];return result;};
 if(type==='buyRod'){
  if(!command.atToolShop)throw Error('Купи удочку в магазине');
  if(kit.rod)throw Error('Удочка уже куплена');
  if(p.wallet<8)throw Error('Недостаточно PAPER');
  p.wallet-=8;kit.rod=true;kit.rodDurability=40;return once({type,price:8});
 }
 if(type==='digBait'){
  if(!command.hasShovel||!command.onSoil)throw Error('Нужна лопатка и почва');
  if(!Number.isInteger(command.digSite)||command.digSite<0||command.digSite>10000)throw Error('Некорректный участок почвы');
  kit.digAttempts++;const roll=hash(p.id+':'+kit.digAttempts+':'+command.digSite)%1000;
  const bait=roll<13?'worm':roll<26?'larva':null; // 2.6% of eligible digs
  if(bait)kit.bait[bait]++;
  return once({type,bait});
 }
 if(type==='fish'){
  if(!command.atRiver)throw Error('Ловить можно только у реки');
  if(!kit.rod||kit.rodDurability<=0)throw Error('Нужна рабочая удочка');
  if(!BAIT_KINDS.includes(command.bait)||kit.bait[command.bait]<=0)throw Error('Нет выбранной наживки');
  kit.bait[command.bait]--;kit.rodDurability--;
  const roll=hash(p.id+':'+requestId)%100;
  const species=roll<60?fishByBait[command.bait][0]:roll<95?fishByBait[command.bait][1]:fishByBait[command.bait][2];
  kit.fish.push(species);return once({type,species,remainingBait:kit.bait[command.bait],rodDurability:kit.rodDurability});
 }
 throw Error('Неизвестная команда рыбалки');
}
