// WORLD EXPANSION P0 / view adapters for the existing app. Keep current controls and combat entry.
(function(){
const isTravelScene=()=>!!(state?.worldTravel?.scenes?.[state?.scene]);
const originalTargets=allTargets,originalInteraction=interaction,originalBlocked=blocked;
const originalUpdate=updateUI,originalPanels=updateCityPanels,originalContext=doContext;
const originalRender=render,originalPosition=positionWindows;
const travelObjects=()=>state?.worldTravel?.targets||[];

allTargets=function(){
  if(!state||!me)return [];
  if(isTravelScene())return [...travelObjects(),...(state.drops||[]),...state.players.filter(p=>p.id!==me.id&&p.online&&p.scene===state.scene).map(p=>({...p,type:'social'}))];
  const base=originalTargets();
  if(state.scene==='city')return [...base,...travelObjects()];
  return base;
};
interaction=function(t){
  if(t?.type==='tourist')return {type:'tourist',title:'Туристическое бюро',hint:'Купить карту, майку, сувенир за PAPER',enabled:!me.spirit};
  if(['world-gate','world-sign','world-exhibit','world-preview'].includes(t?.type))
    return {type:'worldUse',title:t.title,hint:t.type==='world-gate'?'Войти / выйти · E':t.type==='world-preview'?'Посмотреть будущую площадку':'Исследовать · E',enabled:!me.spirit&&!me.job&&!me.delivery?.picked};
  return originalInteraction(t);
};
blocked=function(x,y){
  if(!state?.worldTravel)return originalBlocked(x,y);
  const scene=state.scene,region=state.worldTravel.scenes[scene],r=.35;
  if(region)return x<r||y<r||x>region.width-r||y>region.height-r;
  if(scene!=='city')return originalBlocked(x,y);
  if((state.worldTravel.obstacles||[]).some(o=>x+r>o.x&&x-r<o.x+o.w&&y+r>o.y&&y-r<o.y+o.h))return true;
  const c=state.config,b=state.worldTravel.secondBridge;
  if(x+r>c.river.x&&x-r<c.river.x+c.river.w&&y-r>=b.y&&y+r<=b.y+b.h)
    return x<r||y<r||x>c.width-r||y>c.height-r||state.resources.some(o=>o.stock>0&&o.type!=='food'&&Math.hypot(x-o.x,y-o.y)<.63);
  return originalBlocked(x,y);
};
// A coarse 1-tile pathfinder works on the enlarged 160×80 map (<13k search cells).
// Keep client-side planning separate from server-side collision authority.
findPath=function(dest){
  const step=1,k=p=>p.x+','+p.y;
  const start={x:Math.round(me.x/step),y:Math.round(me.y/step)};
  const goal={x:Math.round(dest.x/step),y:Math.round(dest.y/step)};
  if(blocked(goal.x*step,goal.y*step))return null;
  const queue=[start],seen=new Map([[k(start),null]]);let found=null;
  for(let i=0;i<queue.length&&i<25000;i++){
    const p=queue[i];if(p.x===goal.x&&p.y===goal.y){found=p;break;}
    for(const [dx,dy] of [[1,0],[0,1],[-1,0],[0,-1]]){
      const q={x:p.x+dx,y:p.y+dy},key=k(q);
      if(!seen.has(key)&&!blocked(q.x*step,q.y*step)){seen.set(key,p);queue.push(q);}
    }
  }
  if(!found)return null;
  const path=[];for(let p=found;p;p=seen.get(k(p)))path.push({x:p.x*step,y:p.y*step});
  path.reverse();
  return path.slice(1).filter((point,i,a)=>i===0||i===a.length-1||(point.x-a[i-1].x)*(a[i+1].y-point.y)!==(point.y-a[i-1].y)*(a[i+1].x-point.x));
};

doContext=function(){
  if(context?.type==='tourist'){openCityPanel('tourist');return;}
  originalContext();
};
$('actionButton').onclick=()=>doContext();
updateUI=function(){
  if(isTravelScene()){
    const actual=state.scene;
    state.scene='city';
    try{originalUpdate();}finally{state.scene=actual;}
    document.querySelector('#quest h1').textContent=state.worldTravel.scenes[actual].name;
    $('task').textContent='Найди экспонат и выход. Из музея и дальних земель возвращайся пешком к воротам.';
    $('worldNote').textContent=state.worldTravel.scenes[actual].name+' · исследуй место';
    updateContext();
    return;
  }
  originalUpdate();
};
updateCityPanels=function(force=false){
  if(cityPanelMode!=='tourist')return originalPanels(force);
  if(!me||!state?.worldTravel)return;
  const p=state.worldTravel.profile,prices=state.worldTravel.prices;
  const wrap=$('cityPanelRows');wrap.replaceChildren();
  $('cityPanelTitle').textContent='Туристический киоск';
  $('cityPanelIntro').textContent='Покупки за игровые PAPER. Полная карта открывается после покупки и сохраняется за твоим персонажем.';
  $('cityPanelNote').textContent='Известные маршруты: лес → горы → музей смеха → дальние земли. На карте нет телепорта для игроков.';
  const make=(title,description,kind,price,owned=false)=>{
    const el=document.createElement('section');el.className='city-row';const h=document.createElement('h3'),s=document.createElement('p'),buttons=document.createElement('div');
    h.textContent=title;s.textContent=description;buttons.className='city-actions';
    const b=document.createElement('button');b.textContent=owned?'Куплено':('Купить · '+price+' PAPER');
    b.disabled=owned||me.wallet<price||me.spirit||!!me.job||!nearby('tourist-kiosk');
    b.onclick=()=>act('touristBuy','tourist-kiosk',{kind}).then(()=>{cityPanelSignature='';updateCityPanels(true);});
    buttons.append(b);el.append(h,s,buttons);wrap.append(el);
  };
  make('Карта путешественника','Регионы, дороги, интересные места, твоё положение', 'map',prices.map,p.mapOwned);
  make('Майка Dementor','Сувенир из коллекции · куплено '+(p.souvenirs?.shirt||0),'shirt',prices.shirt);
  make('Маленький сувенир','Память о путешествии · куплено '+(p.souvenirs?.souvenir||0),'souvenir',prices.souvenir);
  if(p.mapOwned){const b=document.createElement('button');b.textContent='Открыть мою карту';b.onclick=()=>openTravelMap();wrap.append(b);}
};
positionWindows=function(){
  originalPosition();
  const dock=$('actionDock');
  if(innerWidth>=760){dock.style.left='50%';dock.style.top='68px';dock.style.transform='translateX(-50%)';}
  else{dock.style.transform='';}
};
const style=document.createElement('style');
style.textContent=`
  #travelMap{width:min(96vw,760px);max-height:88dvh;border:1px solid #b2ae9a;background:#f5efdf;color:#344036;padding:18px;border-radius:12px;box-shadow:0 14px 55px #12170e44}
  #travelMap::backdrop{background:#1d261a88}
  #travelMap h2{font-size:20px;margin:4px 0 12px}
  #travelMap canvas{display:block;width:100%;height:auto;background:#ede7d5;border:1px solid #beb89f;border-radius:8px;touch-action:manipulation}
  #travelMap p{font-size:13px;line-height:1.4}
  #travelMap button{padding:9px 14px;cursor:pointer;border:1px solid #9ca38a;background:#fffdf6;border-radius:8px}
  #worldMapButton{height:36px;min-width:39px;font-size:18px}
  @media(min-width:760px){#actionDock{max-width:min(390px,65vw)!important;bottom:auto!important;right:auto!important;z-index:70}}
`;
document.head.append(style);
const tools=$('centerButton').parentElement,button=document.createElement('button');
button.id='worldMapButton';button.title='Карта путешественника';button.textContent='🗺';button.setAttribute('aria-label','Открыть карту путешественника');tools.prepend(button);
const dialog=document.createElement('dialog');dialog.id='travelMap';dialog.innerHTML='<h2>Карта путешественника</h2><canvas id="travelMapCanvas" width="720" height="360" aria-label="Город, лес, горы, музей смеха и дальние земли"></canvas><p id="travelMapCaption">Карта доступна после покупки. Точки показывают направления; перемещение только пешком.</p><button id="closeTravelMap">Закрыть</button>';
document.body.append(dialog);$('closeTravelMap').onclick=()=>dialog.close();
button.onclick=()=>{if(!state?.worldTravel?.profile?.mapOwned){toast('Купи карту в туристическом киоске · ☷ покажет дорогу');if(state?.scene==='city')navigateTo('tourist-kiosk');return;}openTravelMap();};
function mapPoint(x,y,w=680,h=315){return {x:20+x/state.config.width*w,y:18+y/state.config.height*h};}
function openTravelMap(){
  if(!state?.worldTravel?.profile?.mapOwned)return;
  dialog.showModal();const cv=$('travelMapCanvas'),cx=cv.getContext('2d'),w=cv.width,h=cv.height;
  cx.fillStyle='#eee8d8';cx.fillRect(0,0,w,h);
  const rect=(x,y,rw,rh,color)=>{const a=mapPoint(x,y);cx.fillStyle=color;cx.fillRect(a.x,a.y,rw/state.config.width*680,rh/state.config.height*315);};
  rect(0,0,34,80,'#c6d0ad');rect(38,25,122,55,'#e5dcc3');rect(2,44,31,34,'#a5bb99');rect(46,30,50,48,'#bbb8aa');
  rect(state.config.river.x,0,state.config.river.w,state.config.height,'#9cbdbf');rect(34,53,4,10,'#cbb891');
  cx.lineWidth=3;cx.strokeStyle='#b7a77c';
  for(const path of state.worldTravel.paths||[]){cx.beginPath();path.forEach(([x,y],i)=>{const p=mapPoint(x,y);i?cx.lineTo(p.x,p.y):cx.moveTo(p.x,p.y);});cx.stroke();}
  for(const [name,x,y] of [['Мэрия',8,8],['Киоск',25,38],['Лес',20,56],['Горы',70,59],['Музей',96,60],['НЕ НАДО',143,60]]){
    const p=mapPoint(x,y);cx.fillStyle='#4a6154';cx.beginPath();cx.arc(p.x,p.y,5,0,7);cx.fill();cx.fillStyle='#27372e';cx.font='13px sans-serif';cx.fillText(name,p.x+8,p.y-7);
  }
  const location=state.scene==='museum'?[96,60]:state.scene==='farlands'?[143,60]:[me.x,me.y];
  const hero=mapPoint(...location);cx.strokeStyle='#ad5942';cx.lineWidth=3;cx.beginPath();cx.arc(hero.x,hero.y,9,0,7);cx.stroke();
  const qa=!!state.qaMode;
  $('travelMapCaption').textContent=qa?'QA: щёлкни по карте, чтобы перенестись в точку города (только изолированный тестовый сервер).':'Красное кольцо — твоё положение. Карта не телепортирует: иди по дорогам и тропам.';
  cv.onclick=qa?async e=>{
    const r=cv.getBoundingClientRect();const x=Math.max(1,Math.min(state.config.width-1,((e.clientX-r.left)/r.width*720-20)/680*state.config.width));
    const y=Math.max(1,Math.min(state.config.height-1,((e.clientY-r.top)/r.height*360-18)/315*state.config.height));
    if(blocked(x,y)){toast('Нельзя появиться в препятствии');return;}
    const response=await fetch('/__test',{method:'POST',headers:{'Content-Type':'application/json','x-test-key':'local-integration-tests'},body:JSON.stringify({player:me.id,patch:{scene:'city',x,y}})});
    if(response.ok){dialog.close();toast('QA: позиция обновлена');}
    else toast('QA-переход запрещён сервером');
  }:null;
}
function drawWorldProps(){
  const w=state?.worldTravel;if(!w||state.scene!=='city')return;
  for(const path of w.paths||[]){ctx.beginPath();path.forEach(([x,y],i)=>{const p=screen(x,y);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);});ctx.strokeStyle='#a99c7566';ctx.lineWidth=Math.max(3,view.s*.33);ctx.stroke();}
  groundRect(w.secondBridge,'#bcaa86','#857b62');
  for(const o of w.obstacles||[]){
    const p=screen(o.x+o.w/2,o.y+o.h/2);if(p.x< -200||p.x>view.w+200||p.y< -250||p.y>view.h+250)continue;
    if(o.biome==='forest'){drawTree({x:o.x+o.w/2,y:o.y+o.h/2,stock:12});}
    else{groundRect(o,'#b3b0a3','#868c86');drawStone({x:o.x+o.w/2,y:o.y+o.h/2,stock:16});}
  }
  for(const t of w.targets||[]){
    const p=screen(t.x,t.y);if(p.x< -250||p.x>view.w+250||p.y< -250||p.y>view.h+250)continue;
    if(t.type==='world-sign')paperBoard(t.x,t.y,'↗ '+t.title.slice(0,20));
    else if(t.type==='tourist'||t.type==='world-gate'||t.type==='world-preview'){
      paperHouse({x:t.x-1.3,y:t.y-1.8,w:2.6,h:1.8},t.type==='tourist'?'shop':'warehouse');
      label(t.title,t.x,t.y-2,true);
    }
  }
  // Keep the player readable when standing on the bridge or behind scenery.
  const self=state.players.find(p=>p.id===me?.id);if(self)drawPlayer(self,performance.now());
}
function drawTravelScene(time){
  const region=state.worldTravel.scenes[state.scene];
  ctx.clearRect(0,0,view.w,view.h);ctx.fillStyle=state.scene==='museum'?'#eee3d4':'#e9e5d5';ctx.fillRect(0,0,view.w,view.h);
  updateVisualPlayers(time);
  if(me){const hero=visualPlayers.get(me.id)||me;view.cx=hero.x;view.cy=hero.y;}
  groundRect({x:0,y:0,w:region.width,h:region.height},state.scene==='museum'?'#dbcfba':'#dfdfcb','#a9aa91');
  if(state.scene==='museum'){
    for(const x of [3,7,11,15])groundRect({x,y:2,w:2.5,h:2},'#d1baa4','#967e70');
    paperHouse({x:8,y:3,w:5,h:2.5},'shop');label('МУЗЕЙ СМЕХА',11,1.3);
  }else{
    for(const [x,y] of [[7,5],[11,11],[17,15],[22,13]])drawTree({x,y,stock:10});
    const p=screen(21,9),s=view.s;groundRect({x:18.5,y:8,w:5,h:3},'#b9b6a5','#77796c');
    paperBox(p.x-s*.8,p.y-s*1.15,s*1.6,s*.55,s*.5,-s*.3,'#c5b9a7','#999083','#e6ddcc');
    label('НЕ НАДО',21,7,true);
  }
  for(const o of state.worldTravel.targets||[]){
    if(o.type==='world-exhibit'){const p=screen(o.x,o.y);ctx.fillStyle='#ad6e55';ctx.beginPath();ctx.arc(p.x,p.y,view.s*.24,0,7);ctx.fill();label(o.title,o.x,o.y-1,true);}
    else paperBoard(o.x,o.y,o.title);
  }
  for(const p of state.players.filter(p=>(p.online||p.id===me.id)&&p.scene===state.scene))drawPlayer(p,time);
  requestAnimationFrame(render);
}
render=function(time){
  if(isTravelScene()){drawTravelScene(time);return;}
  originalRender(time);
  drawWorldProps();
};
window.__worldExpansionQA=()=>({scene:state?.scene,mapOwned:!!state?.worldTravel?.profile?.mapOwned,worldWidth:state?.config?.width,worldHeight:state?.config?.height,targetCount:allTargets().length,qaMode:!!state?.qaMode});
})();
