// DEMENTOR UNIVERSE / WORLD-01 — Ideas Forest (isolated branch, no combat dependency).
// Public, read-only club projections copied from current-program-v1 + thing-projection-v1.
// No claim that semantic Board Relations exist between these items.
export const WORLD01 = Object.freeze({
  id:'ideas-forest',title:'Лес идей',width:64,height:48,
  cityGate:{id:'world01-city-gate',type:'world01-gate',x:30,y:2,title:'Дорога в Лес идей'},
  forestArrival:{x:31,y:44},
  cityArrival:{x:30,y:4},
  forestExit:{id:'world01-exit',type:'world01-exit',x:31,y:46,title:'Дорога обратно в город'},
  scooter:{id:'world01-scooter',type:'world01-scooter',x:34,y:42,title:'Прокат самокатов (демо)'},
  portal:{id:'world01-portal',type:'world01-portal',x:31,y:10,title:'Древний портал'},
  board:{id:'world01-board',type:'world01-board',x:31,y:24,title:'Большая доска идей'}
});
const PUBLIC=[
 {id:'world01-billboard-course',type:'world01-billboard',x:17,y:20,title:'ДЕНЬГИ НА ВЕТЕР',
  sourceRef:'program:dengi-na-veter',href:'https://dementor.club/courses/dengi-na-veter/',
  body:'Цифровой карточечный курс о логике трат и осмыслении покупок. В клубной программе обозначен как доступный для прохождения.'},
 {id:'world01-billboard-lab',type:'world01-billboard',x:47,y:19,title:'DEMENTOR LAB',
  sourceRef:'project:dementor-lab',href:'https://dementor.club/projects/dementor-lab/',
  body:'Экспериментальный проект клуба. В текущей программе представлена его публичная презентация; playable-релиз там не заявлен.'},
 {id:'world01-billboard-event',type:'world01-billboard',x:46,y:36,title:'ФУЭНХИРОЛА',
  sourceRef:'event:fuengirola',href:'https://dementor.club/events/fuengirola/',
  body:'Планируемое камерное офлайн-событие. Подтверждённых даты, цены и открытой регистрации в исходной программе нет.'}
];
const OBJECTS=Object.freeze([WORLD01.forestExit,WORLD01.scooter,WORLD01.portal,WORLD01.board,...PUBLIC].map(x=>Object.freeze(x)));
const ROADS=Object.freeze([
 [[31,47],[31,9]],
 [[31,20],[17,20]],
 [[31,19],[47,19]],
 [[31,36],[46,36]],
 [[31,24],[37,28]]
]);
const pointSeg=(x,y,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy||1)));return Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t);};
const onRoad=(x,y)=>ROADS.some(line=>line.slice(1).some((b,i)=>pointSeg(x,y,line[i],b)<2.55));
const aroundSite=(x,y)=>OBJECTS.some(o=>Math.hypot(o.x-x,o.y-y)<3.4);
function generateTrees(){
  const trees=[];
  let seed=314159265;
  const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<360&&trees.length<135;i++){
    const x=3+rand()*58,y=3+rand()*42;
    if(onRoad(x,y)||aroundSite(x,y)||trees.some(t=>Math.hypot(t.x-x,t.y-y)<1.55))continue;
    trees.push(Object.freeze({id:'forest-tree-'+trees.length,x:Math.round(x*10)/10,y:Math.round(y*10)/10,type:'tree',stock:1}));
  }
  return Object.freeze(trees);
}
export const FOREST_TREES=generateTrees();
export const FOREST_ROADS=ROADS;
export const FOREST_OBJECTS=OBJECTS;
export function forestWalkable(x,y){
  if(!Number.isFinite(x)||!Number.isFinite(y)||x<.45||y<.45||x>WORLD01.width-.45||y>WORLD01.height-.45)return false;
  return !FOREST_TREES.some(t=>Math.hypot(x-t.x,y-t.y)<.70);
}
export function world01Snapshot(p){
  const forest=p.scene==='forest';
  return {version:'world-01-v0.1',scene:forest?'ideas-forest':'city',region:forest?
      {id:WORLD01.id,title:WORLD01.title,width:WORLD01.width,height:WORLD01.height,objects:OBJECTS,trees:FOREST_TREES,roads:ROADS}:
      {id:'origin',title:'Первый город',gate:WORLD01.cityGate},
    transport:p.world01?.scooter&&forest?'scooter':'walk',
    portalUnlocked:!!p.world01?.portalUnlocked,
    note:'DEMO_PUBLIC_STATIC — клубные материалы являются ссылками на публичные страницы; синхронизации с Supabase/Board Relations здесь нет.'};
}
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const near=(g,p,o)=>{if(distance(p,o)>g.c.actionRange)throw Error('Подойди к объекту ближе');};
const resetInput=(g,p)=>{g.inputs.set(p.id,{dx:0,dy:0,sprint:false,at:g.now});p.job=null;};
function cityCheck(p){if((p.scene||'city')!=='city'||p.spirit||p.job||p.delivery?.picked)throw Error('Переход доступен свободному жителю города');}
function forestCheck(p){if(p.scene!=='forest')throw Error('Это действие доступно только в Лесу идей');if(p.spirit)throw Error('Сначала восстанови тело');}
export function world01Action(g,p,cmd){
  const type=String(cmd?.type||'');
  if(!type.startsWith('world01'))return null;
  p.world01 ||= {scooter:false,portalUnlocked:false};
  if(type==='world01Enter'){
    cityCheck(p);near(g,p,WORLD01.cityGate);
    p.scene='forest';p.x=WORLD01.forestArrival.x;p.y=WORLD01.forestArrival.y;
    p.world01.scooter=false;resetInput(g,p);
    return {message:'Ты вошёл в Лес идей. Ищи тропинки, билборды и древний портал.',region:'ideas-forest'};
  }
  if(type==='world01Return'){
    forestCheck(p);near(g,p,WORLD01.forestExit);
    p.scene='city';p.x=WORLD01.cityArrival.x;p.y=WORLD01.cityArrival.y;
    p.world01.scooter=false;resetInput(g,p);
    return {message:'Ты вернулся пешком в город.',region:'origin'};
  }
  if(type==='world01Scooter'){
    forestCheck(p);near(g,p,WORLD01.scooter);
    p.world01.scooter=!p.world01.scooter;
    return {message:p.world01.scooter?'Самокат взят. Скорость выше, но это ещё тестовая модель.':'Самокат возвращён на стоянку.',transport:p.world01.scooter?'scooter':'walk'};
  }
  if(type==='world01Portal'){
    forestCheck(p);near(g,p,WORLD01.portal);
    if(!p.world01.portalUnlocked){p.world01.portalUnlocked=true;return {message:'Портал найден! Теперь быстрый путь открыт. Нажми действие ещё раз.',unlocked:true};}
    p.scene='city';p.x=WORLD01.cityArrival.x;p.y=WORLD01.cityArrival.y;
    p.world01.scooter=false;resetInput(g,p);
    return {message:'Портал вернул тебя в город.',region:'origin'};
  }
  if(type==='world01FastTravel'){
    cityCheck(p);near(g,p,WORLD01.cityGate);
    if(!p.world01.portalUnlocked)throw Error('Сначала найди портал в лесу пешком');
    p.scene='forest';p.x=WORLD01.portal.x+1;p.y=WORLD01.portal.y+1;p.world01.scooter=false;resetInput(g,p);
    return {message:'Ты переместился к открытому порталу Леса идей.',region:'ideas-forest'};
  }
  if(type==='world01Inspect'){
    forestCheck(p);
    const obj=OBJECTS.find(o=>o.id===cmd.target&&['world01-board','world01-billboard'].includes(o.type));
    if(!obj)throw Error('Неизвестный информационный объект');
    near(g,p,obj);
    if(obj.type==='world01-board')return {message:'На большой доске представлены публичные темы клуба. Данные пока не синхронизируются.',card:{
      title:'Доска сообщества Dementor Club',body:'Здесь будут доступны опубликованные материалы и существующие связи. В WORLD-01 показан только публичный демонстрационный вход; не является живым содержимым Board.',
      href:'https://dementor.club/workspace/board/',sourceRef:'board:community',mode:'DEMO_PUBLIC_STATIC'}};
    return {message:'Ты рассматриваешь билборд.',card:{title:obj.title,body:obj.body,href:obj.href,sourceRef:obj.sourceRef,mode:'DEMO_PUBLIC_STATIC'}};
  }
  throw Error('Неизвестное действие WORLD-01');
}
