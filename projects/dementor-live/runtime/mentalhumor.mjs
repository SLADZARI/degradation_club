// MENTALHUMOR / WORLD-02: a distinct explorable 2D region with a museum at its centre.
// Architectural inspiration: Eesti Huumorimuuseum, Purku (former school).
// Museum participation/endorsement NOT confirmed; no third-party audio or images reproduced.
export const MENTALHUMOR=Object.freeze({
 id:'mentalhumor',title:'MentalHumor · Мир смеха',width:80,height:60,
 cityGate:{id:'mental-city-gate',type:'mental-gate',x:17,y:2,title:'Дорога в MentalHumor'},
 forestGate:{id:'mental-forest-gate',type:'mental-gate',x:37,y:28,title:'Тропа к Музею смеха'},
 fromCity:{x:39,y:55},fromForest:{x:14,y:48},
 cityReturn:{x:17,y:4},forestReturn:{x:37,y:30},
 museum:{x:29,y:14,w:21,h:14,title:'Музей смеха · Eesti Huumorimuuseum'},
 hallEntrance:{id:'mental-museum-entry',type:'mental-museum-entry',x:39,y:29.5,title:'Войти в Музей смеха'},
 hallExit:{id:'mental-hall-exit',type:'mental-hall-exit',x:10,y:15,title:'Вернуться во двор'},
 trailCity:{id:'mental-to-city',type:'mental-exit-city',x:39,y:57,title:'Дорога в первый город'},
 trailForest:{id:'mental-to-forest',type:'mental-exit-forest',x:14,y:50,title:'Тропа в Лес идей'}
});
export const MENTAL_ROADS=Object.freeze([
 [[39,59],[39,33],[39,30]],
 [[14,53],[14,34],[29,34],[39,33]],
 [[39,33],[53,35],[62,40]],
 [[14,34],[8,22]],
 [[53,35],[64,23]]
]);
export const MENTAL_OBJECTS=Object.freeze([
 MENTALHUMOR.hallEntrance,MENTALHUMOR.trailCity,MENTALHUMOR.trailForest,
 {id:'mental-archive',type:'mental-display',x:60,y:40,title:'Аллея знаменитого смеха',
  sourceRef:'mentalhumor:format-01',description:'Исследовательский каталог узнаваемого смеха из кино, анимации и старых записей. Прав на воспроизведение конкретных записей в игре пока нет.'},
 {id:'mental-record',type:'mental-display',x:64,y:23,title:'Павильон подари смех',
  sourceRef:'mentalhumor:format-02',description:'Идея добровольной записи собственного смеха. Сбор голосов и персональных данных здесь не включён; нужны согласия и политика обработки.'},
 {id:'mental-history',type:'mental-display',x:8,y:22,title:'Сад истории юмора',
  sourceRef:'museum:heritage',description:'Знакомство с культурой карикатуры, юмористических книг и журнальной традицией; материалы здесь представлены описаниями, без копирования музейного архива.'},
 {id:'mental-memorial',type:'mental-display',x:22,y:12,title:'Памятная аллея Пурку',
  sourceRef:'place:purku',description:'Место вдохновлено парком вокруг бывшей школы в Пурку. Монумент и дорожки показаны условно и не претендуют на точную топографическую реконструкцию.'}
].map(x=>Object.freeze(x)));
export const MENTAL_HALL=Object.freeze({
 id:'mentalhumor-hall',title:'Музей смеха · Зал знакомства',width:20,height:17,
 objects:Object.freeze([
  MENTALHUMOR.hallExit,
  {id:'mental-museum-about',type:'mental-exhibit',x:10,y:5,title:'Эстонский музей юмора',
   sourceRef:'museum:eesti-huumorimuuseum',href:'https://eestihuumor.ee/',
   description:'Реальный Eesti Huumorimuuseum находится в деревне Пурку, уезд Рапламаа, Эстония. Музей посвящён сохранению и исследованию юмора — карикатурам, печатным изданиям, фильмам и звуковым материалам.'},
  {id:'mental-museum-collection',type:'mental-exhibit',x:4,y:9,title:'Коллекция и выставки',
   sourceRef:'museum:exhibitions',href:'https://eestihuumor.ee/toimunud-naitused/',
   description:'Выставочная и коллекционная работа музея. Здесь показаны темы и публичные ссылки, не оригинальные музейные экспонаты или защищённые произведения.'},
  {id:'mental-museum-laughter',type:'mental-exhibit',x:16,y:9,title:'MentalHumor · Библиотека смеха',
   sourceRef:'mentalhumor:research',
   description:'Исследовательская идея Dementor Club: каталог узнаваемого смеха, а затем добровольные личные записи. Это не действующая экспозиция музея и не подтверждённый совместный проект.'}
 ].map(x=>Object.freeze(x)))
});
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const pointLine=(x,y,a,b)=>{const vx=b[0]-a[0],vy=b[1]-a[1],t=Math.min(1,Math.max(0,((x-a[0])*vx+(y-a[1])*vy)/(vx*vx+vy*vy||1)));return Math.hypot(x-a[0]-t*vx,y-a[1]-t*vy);};
const onPath=(x,y)=>MENTAL_ROADS.some(road=>road.slice(1).some((b,i)=>pointLine(x,y,road[i],b)<3));
function makeTrees(){
 let seed=81160216;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const trees=[];
 for(let i=0;i<450&&trees.length<160;i++){
   const x=3+rand()*74,y=3+rand()*53;
   if(onPath(x,y)||x>25&&x<54&&y>9&&y<34||MENTAL_OBJECTS.some(o=>dist({x,y},o)<3)||trees.some(t=>dist(t,{x,y})<1.85))continue;
   trees.push(Object.freeze({id:'mental-tree-'+trees.length,type:'tree',x:Math.round(x*10)/10,y:Math.round(y*10)/10,stock:1}));
 }
 return Object.freeze(trees);
}
export const MENTAL_TREES=makeTrees();
export function mentalWalkable(x,y,scene='mentalhumor'){
 if(!Number.isFinite(x)||!Number.isFinite(y))return false;
 if(scene==='mentalhumor-hall')return x>.45&&y>.45&&x<MENTAL_HALL.width-.45&&y<MENTAL_HALL.height-.45;
 if(x<.45||y<.45||x>MENTALHUMOR.width-.45||y>MENTALHUMOR.height-.45)return false;
 const b=MENTALHUMOR.museum;
 if(x>b.x-.3&&x<b.x+b.w+.3&&y>b.y-.3&&y<b.y+b.h+.3)return false;
 return !MENTAL_TREES.some(t=>Math.hypot(x-t.x,y-t.y)<.72);
}
export function mentalSnapshot(p){
 if(p.scene==='mentalhumor-hall')return {id:MENTAL_HALL.id,title:MENTAL_HALL.title,width:MENTAL_HALL.width,height:MENTAL_HALL.height,objects:MENTAL_HALL.objects,trees:[],roads:[],sourceMode:'RESEARCH_DEMO_NOT_PARTNERED'};
 if(p.scene==='mentalhumor')return {id:MENTALHUMOR.id,title:MENTALHUMOR.title,width:MENTALHUMOR.width,height:MENTALHUMOR.height,
   objects:MENTAL_OBJECTS,trees:MENTAL_TREES,roads:MENTAL_ROADS,museum:MENTALHUMOR.museum,sourceMode:'RESEARCH_DEMO_NOT_PARTNERED'};
 return null;
}
const near=(g,p,obj)=>{if(dist(p,obj)>g.c.actionRange)throw Error('Подойди ближе к объекту');};
function reset(g,p){p.job=null;g.inputs.set(p.id,{dx:0,dy:0,sprint:false,at:g.now});}
function ready(p){if(p.spirit||p.job||p.delivery?.picked)throw Error('Сначала восстанови тело и закончи текущую работу или доставку');}
function location(g,p,obj,to,x,y){
 ready(p);near(g,p,obj);
 p.scene=to;p.x=x;p.y=y;reset(g,p);
 if(p.world01)p.world01.scooter=false;
}
const card=(o)=>({title:o.title,body:o.description,sourceRef:o.sourceRef,mode:'RESEARCH_DEMO_NOT_PARTNERED',...(o.href?{href:o.href}:{})});
export function mentalAction(g,p,cmd){
 if(!String(cmd?.type||'').startsWith('mental'))return null;
 const type=cmd.type;
 if(type==='mentalEnter'){
   if(!['city','forest'].includes(p.scene))throw Error('Перейди в MentalHumor из города или Леса идей');
   const from=p.scene,gate=from==='city'?MENTALHUMOR.cityGate:MENTALHUMOR.forestGate;
   location(g,p,gate,'mentalhumor',...(from==='city'?[MENTALHUMOR.fromCity.x,MENTALHUMOR.fromCity.y]:[MENTALHUMOR.fromForest.x,MENTALHUMOR.fromForest.y]));
   return {message:'Ты прибыл в MentalHumor. В центре парка находится Музей смеха.',region:'mentalhumor'};
 }
 if(type==='mentalReturnCity'){
   if(p.scene!=='mentalhumor')throw Error('Сначала выйди из музея в парк');
   location(g,p,MENTALHUMOR.trailCity,'city',MENTALHUMOR.cityReturn.x,MENTALHUMOR.cityReturn.y);
   return {message:'Ты вернулся в первый город.',region:'origin'};
 }
 if(type==='mentalReturnForest'){
   if(p.scene!=='mentalhumor')throw Error('Сначала выйди из музея в парк');
   location(g,p,MENTALHUMOR.trailForest,'forest',MENTALHUMOR.forestReturn.x,MENTALHUMOR.forestReturn.y);
   return {message:'Ты вернулся в Лес идей.',region:'ideas-forest'};
 }
 if(type==='mentalMuseumEnter'){
   if(p.scene!=='mentalhumor')throw Error('Вход в музей находится в мире MentalHumor');
   location(g,p,MENTALHUMOR.hallEntrance,'mentalhumor-hall',10,13.5);
   return {message:'Ты вошёл в исследовательский зал Музея смеха.',region:'mentalhumor-hall'};
 }
 if(type==='mentalMuseumLeave'){
   if(p.scene!=='mentalhumor-hall')throw Error('Ты не в музейном зале');
   location(g,p,MENTALHUMOR.hallExit,'mentalhumor',39,31.3);
   return {message:'Ты вышел на музейную аллею.',region:'mentalhumor'};
 }
 if(type==='mentalInspect'){
   if(!['mentalhumor','mentalhumor-hall'].includes(p.scene))throw Error('Информационный объект находится в MentalHumor');
   const objs=p.scene==='mentalhumor'?MENTAL_OBJECTS:MENTAL_HALL.objects;
   const obj=objs.find(o=>o.id===cmd.target&&['mental-display','mental-exhibit'].includes(o.type));
   if(!obj)throw Error('В этой локации нет такого экспоната');
   near(g,p,obj);
   return {message:'Открыта исследовательская карточка.',card:card(obj)};
 }
 throw Error('Неизвестное действие MentalHumor');
}
