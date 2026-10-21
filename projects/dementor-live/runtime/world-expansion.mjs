// WORLD EXPANSION P0: deterministic geometry shared with clients through snapshots.
// Numbers are test parameters, not the frozen GDD. No new economy or separate player IDs.
export const WORLD_SCENES={
  museum:{name:'Музей смеха',width:20,height:16,exit:{id:'museum-exit',type:'world-gate',x:2,y:13,title:'Выход из музея',to:'city'},main:{id:'laugh-exhibit',type:'world-exhibit',x:11,y:6,title:'Первая коллекция смеха'}},
  farlands:{name:'Дальние земли',width:28,height:20,exit:{id:'farlands-exit',type:'world-gate',x:2,y:17,title:'Вернуться с дальних земель',to:'city'},main:{id:'not-needed',type:'world-exhibit',x:21,y:9,title:'Пьедестал «НЕ НАДО»'}}
};
export const TOURIST_PRICES={map:10,shirt:16,souvenir:4};
import {SECOND_BRIDGE_SITE} from './second-bridge.mjs';
import {boothsForScene} from './telecom.mjs';
import {municipalBuilt} from './municipal-buildings.mjs';
export const WORLD_CITY_TARGETS=[
  SECOND_BRIDGE_SITE,
  {id:'tourist-kiosk',type:'tourist',x:25,y:38,title:'Туристический киоск · карты, майки, сувениры'},
  {id:'travel-sign',type:'world-sign',x:27,y:46,title:'Указатель: лес, горы, дальние земли'},
  {id:'forest-sign',type:'world-sign',x:20,y:56,title:'Лесная развилка'},
  {id:'mountain-sign',type:'world-sign',x:51,y:60,title:'Горный перевал'},
  {id:'mountain-summit',type:'world-summit',x:75,y:37,title:'Вершина горы · памятная отметка'},
  {id:'museum-entry',type:'world-gate',x:96,y:60,title:'Музей смеха · вход',to:'museum'},
  {id:'farlands-entry',type:'world-gate',x:143,y:60,title:'Дальние земли · вход',to:'farlands'},
  {id:'university-site',type:'world-preview',x:18,y:42,title:'Университет · будущие курсы'},
  {id:'robo-stadium-site',type:'world-preview',x:29,y:43,title:'Стадион Robo Games · проект'},
  {id:'industry-site',type:'world-preview',x:94,y:67,title:'Производство и агротехника · проект'}
];
export const SECOND_BRIDGE={x:34,y:53,w:4,h:10};
const forest=[];
for(let row=0,y=47;y<77;row++,y+=4.8)for(let col=0,x=3;x<33;col++,x+=4.8){
  // Stable per-cell jitter breaks the visible grid while keeping repeatable collision geometry.
  const seed=(row*73856093)^(col*19349663);
  const jitterX=(((seed>>>0)%101)/100-.5)*1.05;
  const jitterY=((((seed*83492791)>>>0)%101)/100-.5)*1.05;
  const px=Math.round((x+jitterX)*10)/10,py=Math.round((y+jitterY)*10)/10;
  // Leave a winding starting trail and a wider clearing around the combat approach.
  if((px>=18&&px<=28&&py>=51&&py<=61)||(px>=27&&py<=65)||(px<13&&py>=56&&py<=66))continue;
  if(((seed>>>8)%11)<10)forest.push({x:px,y:py,w:2.4,h:2.4,biome:'forest'});
}
// Forest beyond the factories and green region (kept clear of the main eastern path).
for(const [x,y] of [[98,70],[104,74],[111,75],[127,73],[137,74]])forest.push({x,y,w:2.4,h:2.4,biome:'forest'});
export const WORLD_DESERT={x:112,y:18,w:44,h:36};
export const WORLD_CACTI=Object.freeze([[122,30],[130,45],[138,36],[149,26]].map(([x,y],i)=>({id:'desert-cactus-'+i,x,y,w:1,h:1,kind:'cactus'})));
// A walkable trail through formerly solid mountain panels, with summit at the last point.
export const WORLD_SUMMIT_TRAIL=Object.freeze([[51,60],[51,53],[51,49],[51,45],[51,41],[55,41],[60,40],[66,40],[72,40],[75,37]]);
const mountain=[
  {x:46,y:30,w:11,h:18,biome:'mountain'}, {x:58,y:30,w:9,h:20,biome:'mountain'},
  {x:69,y:35,w:10,h:16,biome:'mountain'}, {x:81,y:30,w:11,h:19,biome:'mountain'},
  {x:48,y:68,w:12,h:10,biome:'mountain'}, {x:62,y:68,w:13,h:10,biome:'mountain'},
  {x:78,y:69,w:13,h:9,biome:'mountain'},
  {x:98,y:31,w:10,h:18,biome:'mountain'}
];
export const WORLD_OBSTACLES=[...forest,...mountain];
export const WORLD_PATHS=[
 [[23,38],[25,45],[25,56],[33,57],[41,57],[51,59],[69,59],[95,60],[112,60],[143,60]],
 [[20,56],[13,60],[10,70]],
 [[51,59],[62,55],[79,55],[96,60]]
];
export function worldObjects(scene='city'){
  if(scene==='city')return [...WORLD_CITY_TARGETS,...boothsForScene(scene)];
  const region=WORLD_SCENES[scene];
  return [...(region?[region.exit,region.main]:[]),...boothsForScene(scene)];
}
export function terrainBlocked(scene,x,y,r=.3){
  if(scene==='city')return WORLD_OBSTACLES.filter(o=>o.biome!=='forest').some(o=>x+r>o.x&&x-r<o.x+o.w&&y+r>o.y&&y-r<o.y+o.h);
  const region=WORLD_SCENES[scene];return !!region&&(x<r||y<r||x>region.width-r||y>region.height-r);
}
export function initializeWorldTravel(g){
  g.state.worldTravel||={version:1,openedAt:null};
  for(const p of Object.values(g.state.players))p.worldTravel||={mapOwned:false,souvenirs:{shirt:0,souvenir:0},visited:['city']};
}
export function worldTravelAction(g,p,cmd){
  // Return a previously settled paid result *before* proximity or region checks:
  // delayed network retries must not charge again just because the player moved.
  if(cmd?.type==='touristBuy'&&p.worldTravel?.purchaseReceipts&&
      Object.hasOwn(p.worldTravel.purchaseReceipts,cmd.requestId))
    return p.worldTravel.purchaseReceipts[cmd.requestId];
  const object=worldObjects(p.scene||'city').find(o=>o.id===cmd.target);
  if(!['worldUse','touristBuy'].includes(cmd.type))return null;
  if(!object)throw Error('Такого места нет в текущем регионе');
  g.near(p,object);
  if(p.spirit||p.job||p.delivery?.picked||p.combatP0?.activeSessionId)throw Error('Сначала заверши текущую работу или доставку');
  if(cmd.type==='touristBuy'){
    if(object.id!=='tourist-kiosk')throw Error('Купить сувениры можно только в киоске');
    if(!Object.hasOwn(TOURIST_PRICES,cmd.kind))throw Error('Нет такого товара');
    p.worldTravel||={mapOwned:false,souvenirs:{shirt:0,souvenir:0},visited:['city']};
    // Real, persisted idempotency for paid products. Player command results retain
    // only the most recent 128 actions; a delayed network replay must not resell.
    p.worldTravel.purchaseReceipts ||= {};
    if(Object.hasOwn(p.worldTravel.purchaseReceipts,cmd.requestId))
      return p.worldTravel.purchaseReceipts[cmd.requestId];
    const amount=TOURIST_PRICES[cmd.kind];
    if(cmd.kind==='map'&&p.worldTravel.mapOwned)throw Error('Карта уже у тебя');
    if(p.wallet<amount)throw Error('Не хватает PAPER');
    p.wallet-=amount;g.state.treasury+=amount;
    g.state.transactions.push({id:cmd.requestId,player:p.id,amount:-amount,reason:'tourist-'+cmd.kind,time:g.now});
    if(cmd.kind==='map')p.worldTravel.mapOwned=true;
    else p.worldTravel.souvenirs[cmd.kind]=(p.worldTravel.souvenirs[cmd.kind]||0)+1;
    const receipt={message:cmd.kind==='map'?'Карта путешественника куплена. Теперь она доступна через ☷.':'Сувенир куплен и сохранён в коллекции.'};
    p.worldTravel.purchaseReceipts[cmd.requestId]=receipt;
    return receipt;
  }
  if(object.type==='world-sign')return {message:object.id==='mountain-sign'?'Горная тропа начинается здесь: подъём тратит силы и ускоряет голод. Иди до вершины и отдыхай на остановках.':object.id==='forest-sign'?'Тропа ведёт в горы через вторую переправу; лесная чаща не везде проходима.':'По дороге на восток: лес → горы → музей смеха → дальние земли.'};
  if(object.type==='world-summit'){
    p.worldTravel||={mapOwned:false,souvenirs:{shirt:0,souvenir:0},visited:['city']};
    if(p.worldTravel.summitReachedAt)return {message:'Ты уже покорил эту вершину. Путешествие осталось в дневнике.'};
    p.worldTravel.summitReachedAt=g.now;
    const reward=g.cityFunds()>=40?40:0;
    if(reward)g.transfer(p,reward,'summit-discovery');
    return {message:'Ты поднялся на вершину!'+(reward?' · +40 PAPER из казны':' · Казна пока не выделила награду'),reward};
  }
  if(object.type==='world-preview')return {message:object.title+' · стройка и механики появятся в следующих игровых обновлениях.'};
  if(object.type==='world-exhibit')return {message:object.id==='not-needed'?'«НЕ НАДО» — пьедестал дальних земель. Путешествие завершено, но мир продолжается.':'Музей смеха · первая выставка открыта, коллекция будет пополняться.'};
  if(object.type==='world-gate'){
    const from=p.scene||'city',to=object.to;
    if(!['city','museum','farlands'].includes(to))throw Error('Недоступный регион');
    if(to==='city'){
      const back=p.worldTravel?.returnTo;
      if(!back||back.scene!=='city')throw Error('Не найдено место возвращения');
      p.x=back.x;p.y=back.y;p.scene='city';delete p.worldTravel.returnTo;
    }else{
      p.worldTravel||={mapOwned:false,souvenirs:{shirt:0,souvenir:0},visited:['city']};
      p.worldTravel.returnTo={scene:from,x:p.x,y:p.y};
      p.scene=to;p.x=4;p.y=to==='museum'?13:17;
      if(!p.worldTravel.visited.includes(to))p.worldTravel.visited.push(to);
    }
    p.job=null;g.inputs.set(p.id,{dx:0,dy:0,sprint:false,at:g.now});
    return {message:'Ты в регионе: '+(WORLD_SCENES[to]?.name||'Первый город')};
  }
  throw Error('Этот объект пока не поддерживает действия');
}
export function worldTravelView(g,p){
  const scene=p.scene||'city';let booths=boothsForScene(scene);
  if(g.state.startingCity)booths=g.state.technologies?.payphones?booths.filter(b=>b.siteId&&municipalBuilt(g.state,b.siteId)):[];
  const visibleBooths=new Set(booths.map(b=>b.id));
  const targets=worldObjects(scene).filter(t=>t.type!=='payphone'||visibleBooths.has(t.id));
  return {scene,targets,
    booths,scenes:WORLD_SCENES,secondBridge:SECOND_BRIDGE,secondBridgeProject:g.state.secondBridgeProject,paths:WORLD_PATHS,
    obstacles:(p.scene||'city')==='city'?WORLD_OBSTACLES:[],desert:WORLD_DESERT,cacti:WORLD_CACTI,summitTrail:WORLD_SUMMIT_TRAIL,
    prices:TOURIST_PRICES,profile:p.worldTravel||{mapOwned:false,souvenirs:{shirt:0,souvenir:0},visited:['city']},
    worldWidth:g.c.width,worldHeight:g.c.height};
}
