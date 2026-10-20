// City landscape · source of truth for purchases, ownership, occupancy, and speed.
// Existing saved state {version:1, tiles:[...]} and per-player terrainBag remain compatible.
export const LANDSCAPE_SHOP={id:'landscape-shop',type:'landscape',x:16.7,y:4};
export const LANDSCAPE_PRODUCTS=Object.freeze({
  paving:{name:'Дорожная плитка',pack:10,price:1},
  grass:{name:'Газон',pack:10,price:1},
  flowers:{name:'Цветы',pack:10,price:1}
});
const indexes=new WeakMap();
const key=(x,y)=>x+','+y;
// Index is derived, never serialized. Rebuild only when a save replaces its tile array.
export function terrainIndex(g){
  const state=g.state.landscape;
  if(!state)return new Map();
  const tiles=state.tiles||[];
  let cached=indexes.get(state);
  if(!cached||cached.ref!==tiles||cached.length!==tiles.length){
    cached={ref:tiles,length:tiles.length,byCell:new Map(tiles.map(tile=>[key(tile.x,tile.y),tile]))};
    indexes.set(state,cached);
  }
  return cached.byCell;
}
export function ensureLandscape(g){
  g.state.landscape||={version:1,tiles:[]};
  if(!Array.isArray(g.state.landscape.tiles))g.state.landscape.tiles=[];
  for(const p of Object.values(g.state.players)){
    p.terrainBag||={paving:0,grass:0,flowers:0};
    p.landscapeReceipts||={};
  }
}
// An entire 1×1 tile must not touch a lot not owned by this player.
export function terrainRight(g,p,x,y){
  const lots=(g.state.plots||[]).filter(l=>x<l.x+l.w&&x+1>l.x&&y<l.y+l.h&&y+1>l.y);
  if(lots.some(l=>!l.owner))return {allowed:false,reason:'Непроданный участок: сначала оформите землю'};
  if(lots.some(l=>l.owner!==p.id))return {allowed:false,reason:'Нельзя укладывать покрытие на чужом участке'};
  return {allowed:true,scope:lots.length?'private':'municipal'};
}
export function terrainPlacementCheck(g,p,{x,y,kind}={}){
  if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=g.c.width||y>=g.c.height)return {ok:false,message:'Неверная клетка'};
  if(!LANDSCAPE_PRODUCTS[kind])return {ok:false,message:'Нет такого покрытия'};
  const right=terrainRight(g,p,x,y);if(!right.allowed)return {ok:false,message:right.reason};
  if(terrainIndex(g).has(key(x,y)))return {ok:false,message:'Клетка уже обустроена'};
  if(!g.walkable(x+.5,y+.5,p))return {ok:false,message:'Здесь препятствие; укладка запрещена'};
  if(Math.hypot(p.x-(x+.5),p.y-(y+.5))>g.c.actionRange)return {ok:false,message:'Подойди к выбранной клетке'};
  if(!(p.terrainBag?.[kind]>0))return {ok:false,message:'Купи материалы в магазине'};
  if(g.state.landscape.tiles.length>=1200)return {ok:false,message:'Предел покрытий этого города'};
  return {ok:true,scope:right.scope};
}
export function landscapeSpeed(g,p){
  if((p.scene||'city')!=='city')return 1;
  const tile=terrainIndex(g).get(key(Math.floor(p.x),Math.floor(p.y)));
  return tile?.kind==='paving'?1.2:1;
}
export function landscapeAction(g,p,cmd){
  if(!['landscapeBuy','landscapePlace'].includes(cmd?.type))return null;
  if((p.scene||'city')!=='city')throw Error('Магазин благоустройства доступен только в городе');
  if(p.spirit||p.job||p.delivery?.picked)throw Error('Заверши работу или доставку');
  ensureLandscape(g);
  if(cmd.type==='landscapeBuy'){
    g.near(p,LANDSCAPE_SHOP);
    if(Object.hasOwn(p.landscapeReceipts,cmd.requestId))return p.landscapeReceipts[cmd.requestId];
    const product=LANDSCAPE_PRODUCTS[cmd.kind];if(!product)throw Error('Нет такого материала');
    if(p.wallet<product.price)throw Error('Недостаточно PAPER');
    p.wallet-=product.price;g.state.treasury+=product.price;p.terrainBag[cmd.kind]+=product.pack;
    g.state.transactions.push({id:cmd.requestId,player:p.id,amount:-product.price,reason:'landscape-'+cmd.kind,time:g.now});
    return p.landscapeReceipts[cmd.requestId]={message:product.name+': получено '+product.pack+' шт. за '+product.price+' PAPER'};
  }
  const {x,y,kind}=cmd;
  const result=terrainPlacementCheck(g,p,{x,y,kind});
  if(!result.ok)throw Error(result.message);
  const placed={x,y,kind,owner:p.id,at:g.now};
  p.terrainBag[kind]--;
  const tiles=g.state.landscape.tiles;tiles.push(placed);
  const cached=indexes.get(g.state.landscape);
  if(cached&&cached.ref===tiles&&cached.length===tiles.length-1){
    cached.byCell.set(key(x,y),placed);cached.length=tiles.length;
  }
  g.state.landscape.revision=(g.state.landscape.revision||0)+1;
  return {message:LANDSCAPE_PRODUCTS[kind].name+' уложена',terrain:{x,y,kind}};
}
