// Player-built CITY landscaping with durable supplies; all currency stays in the shared treasury.
export const LANDSCAPE_SHOP={id:'landscape-shop',type:'landscape',x:16.7,y:4};
export const LANDSCAPE_PRODUCTS=Object.freeze({paving:{name:'Дорожная плитка',pack:10,price:1},grass:{name:'Газон',pack:10,price:1},flowers:{name:'Цветы',pack:10,price:1}});
export function ensureLandscape(g){g.state.landscape||={version:1,tiles:[]};for(const p of Object.values(g.state.players)){p.terrainBag||={paving:0,grass:0,flowers:0};p.landscapeReceipts||={};}}
export function landscapeSpeed(g,p){if((p.scene||'city')!=='city')return 1;const x=Math.floor(p.x),y=Math.floor(p.y);return g.state.landscape?.tiles?.some(t=>t.kind==='paving'&&t.x===x&&t.y===y)?1.2:1;}
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
 if(g.state.landscape.tiles.some(t=>t.x===x&&t.y===y))throw Error('Клетка уже обустроена');
 if(!g.walkable(x+.5,y+.5,p))throw Error('Здесь препятствие; укладка запрещена');
 p.terrainBag[kind]--;g.state.landscape.tiles.push({x,y,kind,owner:p.id,at:g.now});
 return {message:LANDSCAPE_PRODUCTS[kind].name+' уложена'};
}
