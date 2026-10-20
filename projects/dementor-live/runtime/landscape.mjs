// Player-built CITY landscaping. Owner checks and O(1) spatial lookup are server-authoritative.
export const LANDSCAPE_SHOP={id:'landscape-shop',type:'landscape',x:16.7,y:4};
export const LANDSCAPE_PRODUCTS=Object.freeze({paving:{name:'Дорожная плитка',pack:10,price:1},grass:{name:'Газон',pack:10,price:1},flowers:{name:'Цветы',pack:10,price:1}});
const INDEX=new WeakMap();
const tileKey=(x,y)=>x+','+y;
export function ensureLandscape(g){
 g.state.landscape||={version:1,tiles:[]};
 const land=g.state.landscape;
 if(!Array.isArray(land.tiles))land.tiles=[];
 if(!Number.isSafeInteger(land.revision)||land.revision<0)land.revision=land.tiles.length;
 for(const p of Object.values(g.state.players)){p.terrainBag||={paving:0,grass:0,flowers:0};p.landscapeReceipts||={};}
}
export function landscapeIndex(g){
 if(!g.state.landscape||!Array.isArray(g.state.landscape.tiles))ensureLandscape(g);
 const land=g.state.landscape;
 let item=INDEX.get(land);
 if(!item||item.array!==land.tiles||item.length!==land.tiles.length||item.revision!==land.revision){
   const tiles=new Map();
   for(const t of land.tiles)tiles.set(tileKey(t.x,t.y),t);
   item={array:land.tiles,length:land.tiles.length,revision:land.revision,tiles};
   INDEX.set(land,item);
 }
 return item.tiles;
}
export function landscapeSpeed(g,p){
 if((p.scene||'city')!=='city')return 1;
 return landscapeIndex(g).get(tileKey(Math.floor(p.x),Math.floor(p.y)))?.kind==='paving'?1.2:1;
}
// Plots offered for sale are reserved; privately held plots are owner-only.
// Outside plot boundaries, buildable municipal city land is public unless walkable() rejects it.
export function landscapePlotPermission(g,p,x,y){
 const plots=g.state.plots||[];
 for(const plot of plots){
   if(x<plot.x+plot.w&&x+1>plot.x&&y<plot.y+plot.h&&y+1>plot.y){
     if(!plot.owner)throw Error('Это зарезервированный участок; покрытие можно уложить после покупки');
     if(plot.owner!==p.id)throw Error('Чужая территория: укладывать покрытие может только владелец');
   }
 }
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
 const x=cmd.x,y=cmd.y,kind=cmd.kind;
 if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=g.c.width||y>=g.c.height)throw Error('Неверная клетка');
 if(!LANDSCAPE_PRODUCTS[kind])throw Error('Нет такого покрытия');
 if(!p.terrainBag[kind])throw Error('Купи материалы в магазине');
 if(Math.hypot(p.x-(x+.5),p.y-(y+.5))>g.c.actionRange)throw Error('Подойди к выбранной клетке');
 if(g.state.landscape.tiles.length>=1200)throw Error('Предел покрытий этого города');
 if(landscapeIndex(g).has(tileKey(x,y)))throw Error('Клетка уже обустроена');
 landscapePlotPermission(g,p,x,y);
 // Whole cell matters: not just its center. Never bury structures or resource nodes.
 if(g.rects().some(o=>x<o.x+o.w&&x+1>o.x&&y<o.y+o.h&&y+1>o.y))throw Error('Клетка пересекается с постройкой');
 if((g.state.resources||[]).some(o=>o.stock>0&&o.type!=='food'&&Math.hypot(Math.max(x,Math.min(x+1,o.x))-o.x,Math.max(y,Math.min(y+1,o.y))-o.y)<.58))throw Error('Клетка пересекается с ресурсом');
 for(const [dx,dy] of [[.5,.5],[.2,.2],[.8,.2],[.2,.8],[.8,.8]])
   if(!g.walkable(x+dx,y+dy,p))throw Error('Здесь препятствие; укладка запрещена');
 p.terrainBag[kind]--;
 const tile={x,y,kind,owner:p.id,at:g.now};
 g.state.landscape.tiles.push(tile);
 g.state.landscape.revision++;
 const item=INDEX.get(g.state.landscape);
 if(item){item.tiles.set(tileKey(x,y),tile);item.length=g.state.landscape.tiles.length;item.revision=g.state.landscape.revision;}
 return {message:LANDSCAPE_PRODUCTS[kind].name+' уложена',tile,revision:g.state.landscape.revision};
}
