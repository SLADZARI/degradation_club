const $=id=>document.getElementById(id),canvas=$('world'),ctx=canvas.getContext('2d');
let lastScene=null;
let state=null,me=null,token=sessionStorage.getItem('dementor-token'),stream=null,connected=false;
let keys=new Set(),route=[],selected=null,context=null,lastAction=0,requestPending=false,holdAction=false,touchMove=null,inputPending=false;
let routeActivity={x:0,y:0,at:0};
function setRoute(path){route=path;routeActivity={x:me?.x||0,y:me?.y||0,at:performance.now()};}
let view={w:innerWidth,h:innerHeight,s:28,cx:innerWidth<760?10:16,cy:innerWidth<760?12:16,zoom:innerWidth<760?1.15:1},toastTimer;
const motionFrames=[];
let lastWallet=null,lastChatSignature='';
let seenChatIds=null,hoverWorld=null,placementKind=null;
const colors=['#a97059','#6e8971','#65858f'];
const names={wood:'Древесина',stone:'Камень',food:'Ягоды',seed_hemp:'Семена конопли',seed_carrot:'Семена моркови',hemp:'Конопля',carrot:'Морковь',water:'Вода'};
const toolNames={axe:'🪓 Топор',pick:'⛏️ Кирка'};
const icon={wood:'🪵',stone:'🪨',food:'🫐',tools:'⚒',project:'↓',build:'⌑',plot:'⌂',give:'♡'};
if(new URL(location).searchParams.has('new')){token=null;sessionStorage.removeItem('dementor-token');history.replaceState(null,'','/');}
function toast(text){$('toast').textContent=text;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2600);}
async function api(endpoint,data){const res=await fetch('/api/'+endpoint,{method:data?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(data?{body:JSON.stringify(data)}:{})});const result=await res.json();if(res.status===401){token=null;sessionStorage.removeItem('dementor-token');stream?.close();$('welcome').showModal();}return result;}
async function act(type,target,extra={}){if(!connected||requestPending)return;requestPending=true;try{const result=await api('action',{type,target,requestId:Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join(''),...extra});if(result.message&&(!result.started||!holdAction))toast(result.message);return result;}catch{toast('Нет связи с миром. Переподключаемся…');}finally{requestPending=false;}}
function playNeighborChime(){try{const C=window.AudioContext||window.webkitAudioContext;if(!C||navigator.userActivation?.hasBeenActive===false)return;const a=new C(),o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.setValueAtTime(650,a.currentTime);o.frequency.exponentialRampToValueAtTime(840,a.currentTime+.12);g.gain.setValueAtTime(.0001,a.currentTime);g.gain.exponentialRampToValueAtTime(.035,a.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+.16);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+.17);o.onended=()=>a.close().catch(()=>{});}catch{}}
function connect(){stream?.close();motionFrames.length=0;stream=new EventSource('/api/events?token='+encodeURIComponent(token));stream.onmessage=e=>{state=JSON.parse(e.data);me=state.players.find(p=>p.id===state.me);if(lastScene!==state.scene+me.plotId+(state.cityNetwork?.current||'origin')){lastScene=state.scene+me.plotId+(state.cityNetwork?.current||'origin');resize();motionFrames.length=0;route=[];selected=null;context=null;if($('cityPanel').open)$('cityPanel').close();}motionFrames.push({at:performance.now(),players:new Map(state.players.map(p=>[p.id,{x:p.x,y:p.y,spirit:p.spirit}]))});if(motionFrames.length>20)motionFrames.shift();connected=true;updateUI();};stream.onerror=()=>{connected=false;$('connection').classList.add('offline');$('connection').lastChild.textContent='Нет связи';};}
$('joinForm').onsubmit=async e=>{e.preventDefault();const button=e.target.querySelector('button');button.disabled=true;try{const result=await api('join',{name:$('nameInput').value,gender:$('genderInput').value});if(!result.ok){$('joinError').textContent=result.message;return;}token=result.token;sessionStorage.setItem('dementor-token',token);$('welcome').close();connect();canvas.focus();}catch{$('joinError').textContent='Сервер недоступен. Проверь локальный запуск.';}finally{button.disabled=false;}};
if(token)api('state').then(r=>{if(r.me)connect();else if(!$('welcome').open)$('welcome').showModal();}).catch(()=>$('welcome').showModal());else $('welcome').showModal();

// Mayor letter only after 15 minutes of verified, non-idle gameplay. Each dismissal resets its active-play clock.
const IDEA_INTERVAL_MS=15*60*1000;
let mayorIdeaNextByPlayer=new Map(),lastIdeaInteraction=-Infinity;
window.addEventListener('pointerdown',()=>{lastIdeaInteraction=performance.now();},{passive:true});
window.addEventListener('keydown',()=>{lastIdeaInteraction=performance.now();});
function postponeMayorIdea(){
 if(!me)return;
 const next=(me.activeGameMs||0)+IDEA_INTERVAL_MS;
 mayorIdeaNextByPlayer.set(me.id,next);
 try{sessionStorage.setItem('mayor-next-'+me.id,String(next));}catch{}
 $('mayorIdea').close();
}
$('mayorIdeaLater').addEventListener('click',postponeMayorIdea);
$('mayorIdeaForm').addEventListener('submit',async e=>{
 e.preventDefault();if(!me)return;
 const text=$('mayorIdeaText').value.trim();
 const result=await act('mayorIdea',null,{text,fromPrompt:true});
 if(result?.ok){$('mayorIdeaText').value='';postponeMayorIdea();}
});
setInterval(()=>{
 if(!me||!connected||document.visibilityState!=='visible'||$('welcome').open||$('mayorIdea').open)return;
 if(document.querySelector('dialog[open]')||performance.now()-lastIdeaInteraction>20000)return;
 let next=mayorIdeaNextByPlayer.get(me.id);
 if(next==null){const saved=Number(sessionStorage.getItem('mayor-next-'+me.id));next=saved>=IDEA_INTERVAL_MS?saved:IDEA_INTERVAL_MS;mayorIdeaNextByPlayer.set(me.id,next);}
 if((me.activeGameMs||0)>=next){$('mayorIdea').showModal();}
},5000);
function forgeActive(){return state?.project.stage>=state?.config.stages.length;}
function bridgeActive(){return state?.forge.stage>=state?.config.forge.stages.length;}
function bridgeOpen(){return state?.bridge.stage>=state?.config.bridge.stages.length;}
function deliveryTarget(d){return d?.destination==='bridge'?'bridge-drop':'mayor';}
function deliveryLabel(d){return d?.destination==='bridge'?'стройка моста':'мэрия';}
function currentProject(){return bridgeActive()?state.bridge:forgeActive()?state.forge:state.project;}
function currentConfig(){return bridgeActive()?{...state.config,...state.config.bridge}:forgeActive()?{...state.config,...state.config.forge}:state.config;}
function projectReady(p=currentProject(),c=currentConfig()){if(!state)return false;const s=c.stages[p.stage];return s&&p.stock.wood>=s.wood&&p.stock.stone>=s.stone;}
function cargo(){return me?Object.entries(me.bag).reduce((n,[k,v])=>n+v*state.config.weights[k],0)+(me.delivery?.picked?me.delivery.quantity*state.config.weights[me.delivery.kind]:0):0;}
function allTargets(){if(!state||!me)return [];if(state.scene!=='city')return livingTargets();
  return [{id:'combat-gate',type:'combat',x:29,y:35},state.config.expedition.gate,...(bridgeOpen()?[{id:'east-bank',type:'explore',x:40,y:13.5}]:[]),...(bridgeActive()?[{id:'bridge-drop',type:'project',x:32.5,y:12.3},{id:'bridge-build',type:'build',x:32,y:13.5}]:[]),{id:'tool-shop',type:'shop',x:24,y:3},{id:'landscape-shop',type:'landscape',x:16.7,y:4},...(state.forge.stage>=state.config.forge.stages.length?[{id:'forge-use',type:'forge',x:27,y:29.5}]:[]),{id:'warehouse',type:'warehouse',x:12,y:24},...(state.seedMarket.stage>=state.config.seedMarket.stages.length?[{id:'seed-shop',type:'seed-market',x:23,y:7}]:[{id:'seed-shop-build',type:'build',x:23,y:7}]),{id:'seed-shop-drop',type:'project',x:22,y:9},...(state.gardenProject.stage>=state.config.cityGarden.stages.length?[{id:'public-garden',type:'city-garden',x:28,y:9}]:[{id:'public-garden-build',type:'build',x:28,y:9}]),{id:'public-garden-drop',type:'project',x:26,y:9},{id:'city-registry',type:'city-registry',x:19,y:6},{id:'board',type:'board',x:3.2,y:8},{id:'mayor',type:'mayor',x:9,y:3},{id:'tools',type:'tools',x:9,y:6},{id:'project',type:'project',x:15,y:11},{id:'build',type:'build',x:18,y:14},...(forgeActive()?[{id:'forge-drop',type:'project',x:24.5,y:24},{id:'forge-build',type:'build',x:27,y:26}]:[]),...(state.drops||[]),...state.resources,...(state.plaza?.config.objects||[]),...state.plots.map(p=>({...p,type:'plot',x:p.x+p.w/2,y:p.y-1})),...state.players.filter(p=>p.id!==me.id&&p.online&&sameScene(p)).map(p=>({...p,type:'social'}))];
}
function interaction(t){if(!t)return null;const type=t.type,isForge=t.id.startsWith('forge-'),isBridge=t.id.startsWith('bridge-'),isMarket=t.id.startsWith('seed-shop-'),isGarden=t.id.startsWith('public-garden-'),p=isMarket?state.seedMarket:isGarden?state.gardenProject:isBridge?state.bridge:isForge?state.forge:state.project,c=isMarket?{...state.config,...state.config.seedMarket}:isGarden?{...state.config,...state.config.cityGarden}:isBridge?{...state.config,...state.config.bridge}:isForge?{...state.config,...state.config.forge}:state.config;
  if(type==='seed-market')return {type:'seeds',title:'Семенная лавка',hint:state.seedMarket.stage<state.config.seedMarket.stages.length?'Сначала достройте лавку':'Купить семена для огорода',enabled:true};
  if(type==='city-garden')return {type:'public-garden',title:'Общий городской огород',hint:state.gardenProject.stage<state.config.cityGarden.stages.length?'Нужно построить городской огород':'Посади, полей и собери урожай',enabled:true};
  if(type==='city-registry')return {type:'city-registry',title:'Городской реестр',hint:'Создать город или перейти в другой город',enabled:true};
  if(type==='combat')return {type:'combat',title:'Боевая экспедиция',hint:'Закрытая PvE-миссия · E для входа',enabled:!me.spirit&&!me.job&&!me.delivery?.picked};
   if(type==='mission')return {type:'missionEnter',title:'Выйти на миссию расчистки',hint:state.expedition.completedAt?'Зона открыта · можно вернуться за ресурсами':`Расчистите новую территорию · осталось ${state.expedition.remaining}`,enabled:!me.job&&!me.delivery?.picked};
  if(type==='plot'&&t.locked)return {type:'estate',title:'Участок ещё не открыт',hint:'Завершите общую миссию расчистки на юге города',enabled:false};
  if(type==='home'&&t.id==='mission-exit')return {type:'homeUse',title:t.title,hint:'Вернуться с добычей · прогресс сохранится',enabled:true};
  if(type==='plaza'&&t.id.startsWith('donation-'))return {type:t.id,title:t.title,hint:t.id==='donation-box'?'Передать ресурсы или монеты городу без оплаты':'Жители, поддержавшие город',enabled:true};
  if(type==='plaza'&&t.id==='theft-board')return {type:'thefts',title:'Доска воров',hint:'Записи о неразрешённом сборе урожая',enabled:true};
  if(type==='plaza')return {type:t.id,title:t.title,hint:t.id==='monument'?'Какой памятник ты оставил бы здесь? · +50 монет':'Общая музыка города · трек 2 монеты · заявка 1 монета',enabled:true};
  if(type==='home'&&state.home?.nodes.some(n=>n.id===t.id))return {type:'homeClear',title:t.title,hint:'E · добыть и собрать',enabled:(state.scene==='expedition'||state.home.owner===me.id)&&t.left>0&&!me.spirit};
  if(type==='home')return {type:'home',title:t.title,hint:'Открыть действия с объектом',enabled:true};
  if(type==='social')return {type:'social',title:'Общение и обмен · '+t.name,hint:'Подарить, обменять, продать предметы',enabled:true};
  if(type==='explore')return {type:'explore',title:'Другой берег открыт',hint:'Новые деревья, камень и ягоды. Выбери ресурс в местах города.',enabled:false};
  if(type==='project'&&isBridge&&me.delivery?.destination==='bridge'&&me.delivery.picked)return {type:'courierDeliver',title:'Доставить городской груз на мост',hint:`${me.delivery.quantity} · ${names[me.delivery.kind]} · +${me.delivery.reward} PAPER`,enabled:!me.spirit};
  if(type==='landscape')return {type:'landscape',title:'Магазин благоустройства',hint:'Купить покрытие, траву или цветы · 10 за 1 PAPER',enabled:!me.spirit};
   if(type==='shop'||type==='forge')return {type,title:type==='shop'?'Магазин инструмента':'Изготовить инструмент',hint:type==='shop'?'Дорогие инструменты · большой запас прочности':'Принеси древесину и камень · инструменты прочнее стартовых',enabled:!me.spirit};
  if(type==='warehouse')return {type:'warehouse',title:'Городской склад',hint:'Сдать лишнее за небольшую плату · забрать курьерский груз',enabled:!me.spirit};
  if(type==='board')return {type:'board',title:'Работы мэрии',hint:'Открыть доску объявлений · условия и награды',enabled:!me.spirit};
  if(type==='mayor')return {type:'mayor',title:'Мэрия · идеи жителей',hint:me.delivery?.picked?`${me.delivery.quantity} · ${names[me.delivery.kind]} · +${me.delivery.reward} PAPER`:'Заказы на доске · груз на городском складе',enabled:!me.spirit};
  if(type==='pickup')return {type:'pickup',title:`Подобрать · ${names[t.kind]}`,hint:`На земле: ${t.quantity} · свободно веса: ${c.capacity-cargo()}`,enabled:!me.spirit&&cargo()+c.weights[t.kind]<=c.capacity};
  if(type==='tools')return {type:'tools',title:me.tools.axe&&me.tools.pick?'Обновить инструменты':'Взять инструменты',hint:'Топор и кирка · бесплатно',enabled:!me.spirit};
  if(type==='wood'||type==='stone'){const tool=type==='wood'?'axe':'pick';return {type:'mine',title:type==='wood'?'Заготовить древесину':'Добыть камень',hint:!t.stock?'Запас исчерпан':me.spirit?'Духу нужна еда':me.equipped!==tool?`Выбери ${tool==='axe'?'топор · 1':'кирку · 2'}`:!me.tools[tool]?'Нужна замена в мэрии':cargo()+c.weights[type]>c.capacity?'Рюкзак полон · склад или кнопка «Рюкзак»':`Осталось ${t.stock} · удерживай E`,enabled:!me.spirit&&t.stock>0};}
  if(type==='food')return {type:'gather',title:me.spirit?'Восстановиться ягодами':'Собрать еду',hint:t.stock?me.spirit?'Еда вернёт тело · бесплатно':'Съесть — F · можно помочь соседу':'Ягоды созревают · скоро снова доступны',enabled:t.stock>0};
  if(type==='project'){const wood=Math.min(me.bag.wood,Math.max(0,c.need.wood-p.accepted.wood-(p.reserved?.wood||0))),stone=Math.min(me.bag.stone,Math.max(0,c.need.stone-p.accepted.stone-(p.reserved?.stone||0)));return {type:'deliver',title:'Сдать материалы',hint:wood+stone?`${wood} древесины · ${stone} камня · +${wood*c.pay.wood+stone*c.pay.stone} PAPER`:`Нужно ещё: ${c.need.wood-p.accepted.wood} древесины · ${c.need.stone-p.accepted.stone} камня`,enabled:!me.spirit&&wood+stone>0};}
  if(type==='build')return {type:'build',title:p.stage===c.stages.length?(isBridge?'Мост открыт':isForge?'Кузница построена':isMarket?'Семенная лавка построена':isGarden?'Городской огород готов':'Площадь открыта'):c.stages[p.stage].title,hint:p.stage===c.stages.length?'Общее дело стало частью города':projectReady(p,c)?`Короткая работа · +${c.pay.work} PAPER`:'Сначала доставьте материалы этапа',enabled:!me.spirit&&!!projectReady(p,c)};
  if(type==='plot'){const owner=state.players.find(p=>p.id===t.owner);return {type:'estate',title:t.owner?`Участок · ${t.ownerName||owner?.name||'житель'}`:'Оформить участок',hint:t.shop?.sign||t.landUse||'Выбери покупку или аренду',enabled:!me.spirit};}
  if(type==='give')return {type:'give',title:`Угостить · ${t.name}`,hint:t.spirit?'Вернуть соседу тело':'Передать порцию еды',enabled:!me.spirit&&me.bag.food>0};return null;
}
function updateContext(){if(!me)return;const near=allTargets().map(t=>{const size=t.rockSize&&t.stock>0?Math.max(.8,t.rockSize*Math.sqrt(t.stock/Math.max(1,t.initial||t.stock))):0;const d=size?Math.hypot(Math.max(0,Math.abs(t.x-me.x)-size/2),Math.max(0,Math.abs(t.y-me.y)-size/2)):Math.hypot(t.x-me.x,t.y-me.y);return {...t,d};}).filter(t=>t.d<=state.config.actionRange).sort((a,b)=>a.d-b.d);
  let target=near.find(t=>t.id===selected)||((!me.tools.axe&&!me.tools.pick&&!me.spirit)?near.find(t=>t.type==='tools'):null)||near[0];context=target?{...target,...interaction(target)}:null;
  $('actionTitle').textContent=context?context.title:me.spirit?'Найди куст с едой':'Исследуй поле';$('actionHint').textContent=context?context.hint:me.spirit?'Ходи к ягодам · E вернёт тело':'WASD или нажми на землю · Shift — бежать';$('actionIcon').textContent=context?(icon[context.type]||icon[target.type]||'↗'):'↗';
  $('actionButton').disabled=!context?.enabled||!!me.job||!connected;$('actionButton').querySelector('span').textContent=me.job?'Работаем':context?.type==='buy'?'Купить':context?.type==='give'?'Угостить':'Действие';
  if($('mobileActionButton')){const b=$('mobileActionButton');b.textContent=context?.enabled?(context.type==='combat'?'⚔ ВОЙТИ':context.type==='give'?'УГОСТИТЬ':context.type==='pickup'?'ПОДОБРАТЬ':'ДЕЙСТВИЕ'):'ДЕЙСТВИЕ';b.setAttribute('aria-label',context?.enabled?context.title:'Подойди к объекту для действия');}
  if($('mobileCombatButton')){const gateNear=state.scene==='city'&&Math.hypot(me.x-29,me.y-35)<=state.config.actionRange;
    $('mobileCombatButton').textContent=gateNear?'⚔ В БОЙ':'⚔ К БОЮ';}
}
function updateUI(){if(!me)return;renderQuick();
  const c=currentConfig(),p=currentProject(),totalWorks=c.stages.reduce((n,s)=>n+s.works,0),doneWorks=c.stages.slice(0,p.stage).reduce((n,s)=>n+s.works,0)+p.work;
  const progress=Math.round((p.accepted.wood+p.accepted.stone+doneWorks)/(c.need.wood+c.need.stone+totalWorks)*100);
  const population=state.players.filter(p=>p.online).length;$('connection').classList.remove('offline');$('connection').lastChild.textContent=`Жители · ${population}`;
  $('game').classList.toggle('starving',!me.spirit&&me.hunger<state.config.slowBelow);$('game').classList.toggle('spirit-alert',!!me.spirit);
   $('playerName').textContent=me.name;$('playerPronoun').textContent=me.gender==='female'?'жительница':me.gender==='male'?'житель':'персонаж';$('avatarDot').style.background=colors[me.color];$('spiritLabel').textContent=me.spirit?'дух':'';if(lastWallet!==me.wallet){lastWallet=me.wallet;$('wallet').innerHTML=`${me.wallet} <small>PAPER</small>`;}
  for(const key of ['health','hunger','stamina']){$(key).value=me[key];$(key+'Value').textContent=Math.ceil(me[key]);}
  document.querySelector('#quest h1').textContent=bridgeActive()?'Мост на другой берег':forgeActive()?'Общественная кузница':'Городская площадь';
  $('projectPercent').textContent=progress+'%';$('projectBar').style.width=progress+'%';$('stageTitle').textContent=p.stage>=c.stages.length?'Открыта для всех':`${p.stage+1} / ${c.stages.length} · ${c.stages[p.stage].title}`;
  let task=me.spirit?'Найди еду — вернись к жизни':!me.tools.axe&&!me.tools.pick?'Возьми инструмент в мэрии':cargo()>=c.capacity?'Рюкзак полон. Отнеси материалы на площадь.':me.hunger<c.slowBelow?'Пора поесть. Ягоды растут рядом.':p.stage>=c.stages.length?(state.plots.some(x=>x.owner===me.id)?'Твой вклад остался в городе. Участок — твой.':`Площадь готова. Купи участок за ${c.plotPrice} PAPER.`):projectReady()?'Помоги со строительством на площадке.':'Собирай древесину и камень, отнеси на стройку площади · город платит PAPER за материалы и работу.';
  if(me.wallet>=c.plotPrice&&!state.plots.some(x=>x.owner===me.id))task='Ты заработал на участок. Выбери свободный.';
  if(cargo()>=c.capacity)task='Рюкзак полон: сдай лишнее на городской склад или выложи через «Рюкзак».';
  if(bridgeActive()&&!me.spirit&&me.hunger>=c.slowBelow&&cargo()<c.capacity&&(me.tools.axe||me.tools.pick))task=bridgeOpen()?'Мост открыт. Исследуй другой берег и добудь новые ресурсы.':'Принеси материалы на мост или возьми курьерский заказ на доске.';
  if(me.delivery&&!me.spirit)task=me.delivery.picked?`Доставь городской груз: ${deliveryLabel(me.delivery)}.`:'Забери заказ на городском складе · между нижними участками.';
  $('task').textContent=forgeActive()?task.replaceAll('на площадь','к кузнице').replace('Площадь готова','Кузница готова'):task;
  $('axeDurability').textContent=me.tools.axe?`${me.tools.axe} / ${me.toolInfo.axe.max}`:'в мэрии';$('pickDurability').textContent=me.tools.pick?`${me.tools.pick} / ${me.toolInfo.pick.max}`:'в мэрии';$('axeButton').classList.toggle('selected',me.equipped==='axe');$('pickButton').classList.toggle('selected',me.equipped==='pick');
  $('woodCount').querySelector('b').textContent=me.bag.wood;$('stoneCount').querySelector('b').textContent=me.bag.stone;$('foodCount').textContent=me.bag.food;$('cargo').textContent=`${Number(cargo().toFixed(1))} / ${c.capacity}`;$('cargo').parentElement.classList.toggle('full',cargo()>=c.capacity);$('eatButton').disabled=me.bag.food<1&&me.bag.carrot<1;
  $('socialButton').textContent=state.trades.length?'Сделки · '+state.trades.length:'Жители';if(state.scene!=='city'){document.querySelector('#quest h1').textContent=state.scene==='interior'?'Твоя палатка':'Жизнь на участке';$('task').textContent='☷ Места участка · расчистка, палатка, вода и огород';$('stageTitle').textContent=`Палатка ${state.home.tent}/3 · грядки ${state.home.beds.length}/6`;$('projectPercent').textContent='';$('projectBar').style.width=`${(state.home.tent+state.home.beds.length)/9*100}%`;}$('worldNote').textContent=state.scene==='city'?'Пустое поле сегодня. Наш город — завтра.':'Выращивай своё. Делись с соседями.';const chatSignature=JSON.stringify(state.chat.slice(-4));if(lastChatSignature!==chatSignature){const newIds=new Set(state.chat.map(m=>m.id));if(seenChatIds&&state.chat.some(m=>!seenChatIds.has(m.id)&&m.player!==me.id))playNeighborChime();seenChatIds=newIds;lastChatSignature=chatSignature;const chat=$('chatMessages');chat.replaceChildren();for(const m of state.chat.slice(-4)){const div=document.createElement('div'),b=document.createElement('b');b.textContent=m.name;div.append(b,document.createTextNode(m.text));chat.append(div);}}
  if($('details').open){const details=$('projectDetails');details.replaceChildren();const rows=[['Древесина',`${p.accepted.wood} / ${c.need.wood} принято`],['Камень',`${p.accepted.stone} / ${c.need.stone} принято`],...c.stages.map((s,i)=>[s.title,i<p.stage?'Готово':i===p.stage?`${p.work} / ${s.works} работ`:'Следующий этап'])];
  for(const [name,value]of rows){const row=document.createElement('div');row.className='stage-row';const b=document.createElement('b'),span=document.createElement('span');b.textContent=name;span.textContent=value;row.append(b,span);details.append(row);}$('cityBudget').textContent=`Казна города · ${state.treasury} PAPER. Выплачено за текущий проект · ${p.spent} PAPER. Тестовые значения прототипа.`;}
  if(typeof updateQuestTracker==='function')updateQuestTracker();if(typeof syncCityMusic==='function')syncCityMusic();updateContext();updateCityPanels();
}
let cityPanelMode=null,cityPanelSignature='';
function nearby(id){const t=allTargets().find(t=>t.id===id);return t&&Math.hypot(t.x-me.x,t.y-me.y)<=state.config.actionRange;}
function navigateTo(id){
  const t=allTargets().find(t=>t.id===id);if(!t)return;selected=id;keys.clear();holdAction=false;$('cityPanel').close();canvas.focus();
  if(nearby(id)){updateContext();return;}
  const paths=[[0,1.4],[-1.4,0],[1.4,0],[0,-1.4]].map(([dx,dy])=>findPath({x:t.x+dx,y:t.y+dy})).filter(Boolean).sort((a,b)=>pathDistance(a)-pathDistance(b));
  if(paths.length)setRoute(paths[0]);else toast('Путь недоступен — подойди самостоятельно');
}
function openCityPanel(mode){$('cityPanel').style.left='';$('cityPanel').style.top='';cityPanelMode=mode;cityPanelSignature='';keys.clear();holdAction=false;route=[];touchMove=null;api('input',{dx:0,dy:0}).catch(()=>{});updateCityPanels(true);$('cityPanel').dataset.mode=mode;if(!$('cityPanel').open)$('cityPanel').show();}
function updateCityPanels(force=false){
  if(!me||!cityPanelMode||(!force&&!$('cityPanel').open))return;
  const sig=cityPanelMode==='bag'?JSON.stringify([me.bag,me.toolItems,me.activeTools,me.delivery,me.spirit,!!me.job]):JSON.stringify([cityPanelMode,me.tools,me.toolInfo,me.wallet,me.bag,me.delivery,me.spirit,!!me.job,state.warehouse,state.courierOffers,state.project,state.forge,state.bridge,state.plaza,me.toolItems,me.activeTools,state.scene,state.home,state.trades,state.seedShop,state.seedMarket,state.gardenProject,state.publicGarden,state.materials,state.cityNetwork,state.thefts,state.players.map(p=>[p.id,p.name,p.online,sameScene(p),Math.hypot(p.x-me.x,p.y-me.y)<=state.config.actionRange]),state.landscape,me.terrainBag,state.plots,state.mayorMail,Math.floor(state.now/1000)*(cityPanelMode==='home'?1:0),nearby('warehouse'),nearby('board'),nearby('forge-use'),nearby('tool-shop')]);
  if(!force&&$('cityPanel').contains(document.activeElement)&&['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;if(!force&&sig===cityPanelSignature)return;cityPanelSignature=sig;
  $('cityPanel').classList.toggle('compact-bag',cityPanelMode==='bag');$('cityPanel').querySelector('.eyebrow').textContent=cityPanelMode==='bag'?'СНАРЯЖЕНИЕ':cityPanelMode==='social'?'ЖИТЕЛИ И СДЕЛКИ':'МИР И ХОЗЯЙСТВО';const rows=$('cityPanelRows');rows.replaceChildren();
  function row(title,description,buttons=[]){const el=document.createElement('section');el.className='city-row';const h=document.createElement('h3'),p=document.createElement('p');h.textContent=title;p.textContent=description;el.append(h,p);const actions=document.createElement('div');actions.className='city-actions';for(const b of buttons){const button=document.createElement('button');button.textContent=b.text;button.disabled=!!b.disabled;if(b.id)button.id=b.id;button.onclick=b.click;actions.append(button);}el.append(actions);rows.append(el);return el;}
  const canAct=!me.spirit&&!me.job,w=state.warehouse,c=state.config;
  if(typeof estatePanel==='function'&&estatePanel(cityPanelMode,rows,row,canAct))return;if(typeof plazaPanel==='function'&&plazaPanel(cityPanelMode,rows,row,canAct))return;if(lifePanel(cityPanelMode,rows,row,canAct))return;
  if(['public-garden','city-registry','landscape'].includes(cityPanelMode)&&typeof civicPanel==='function'&&civicPanel(cityPanelMode,rows,row,canAct))return;
  if(cityPanelMode==='places'){
    $('cityPanelTitle').textContent='Места города';$('cityPanelIntro').textContent='Камера всегда следует за тобой. Выбери место — герой пойдёт туда сам.';const services=row('Городские службы','Городские здания и материалы', [{text:'Семенная лавка',click:()=>openCityPanel('seeds')},{text:'Общий огород',click:()=>openCityPanel('public-garden')},{text:'Реестр городов',click:()=>openCityPanel('city-registry')},{text:'Благоустройство',click:()=>openCityPanel('landscape')},{text:'Земля и аренда',click:()=>openCityPanel('estate')},{text:'Мэрия · идеи',click:()=>openCityPanel('mayor')},{text:'Доска воров',click:()=>openCityPanel('thefts')}]);services.classList.add('place-services');
    for(const t of allTargets()){
      const title=({mission:'Выход · миссия расчистки',shop:'Магазин инструмента',forge:'Кузница · изготовление',warehouse:'Городской склад', 'seed-market':'Семенная лавка', 'city-garden':'Общий огород', 'city-registry':'Реестр городов',landscape:'Благоустройство',board:'Доска работ',mayor:'Мэрия · идеи',tools:'Бесплатные инструменты',explore:'Другой берег',project:t.id==='bridge-drop'?'Приёмка моста':t.id==='project'?'Приёмка площади':'Приёмка кузницы',build:t.id==='bridge-build'?'Стройка моста':t.id==='build'?'Стройка площади':'Стройка кузницы',wood:'Дерево',stone:'Камень',food:'Ягоды',plot:'Участок',pickup:'Вещи на земле',give:t.name,social:t.name})[t.type];
      const placeTitle=t.title||title||'Место города';const placeRow=row(placeTitle,t.stock!==undefined?`${t.x>state.config.river.x?'Другой берег':'Стартовый берег'} · запас: ${t.stock}`:'Выбери место для движения',[{id:'goto-'+t.id,text:t.x>=state.config.river.x&&!bridgeOpen()?'Нужен мост':'➤',disabled:t.x>=state.config.river.x&&!bridgeOpen(),click:()=>navigateTo(t.id)}]);placeRow.classList.add('place-row');placeRow.prepend(placeThumbnail(t));const go=placeRow.querySelector('button');go.setAttribute('aria-label','Идти: '+placeTitle);go.title='Идти: '+placeTitle;
    }
    $('cityPanelNote').textContent='Масштаб меняется кнопками + и − или колесом мыши; привязка камеры сохраняется.';
  }else if(cityPanelMode==='shop'||cityPanelMode==='forge'){
    const craft=cityPanelMode==='forge',spec=craft?c.toolMaking:c.toolShop,target=craft?'forge-use':'tool-shop';
    $('cityPanelTitle').textContent=craft?'Инструменты кузницы':'Магазин инструмента';
    $('cityPanelIntro').textContent=craft?`Изготовление из твоих материалов: ${spec.recipe.wood} древесины и ${spec.recipe.stone} камня за инструмент. Прочность ${spec.durability}.`:`Особо прочные инструменты: ${spec.durability} использований, цена ${spec.price} PAPER за каждый. Стартовый инструмент служит ${c.toolDurability} использований.`;
    for(const tool of ['axe','pick']){
      const info=me.toolInfo[tool],enough=craft?Object.entries(spec.recipe).every(([k,n])=>me.bag[k]>=n):me.wallet>=spec.price;
      row(toolNames[tool],`Сейчас: ${me.tools[tool]} / ${info.max}. Новый: ${spec.durability}. Новый инструмент сохранится отдельным экземпляром в рюкзаке.`,[{id:(craft?'craft-':'buy-')+tool,text:craft?'Изготовить':`Купить · ${spec.price} PAPER`,disabled:!canAct||!nearby(target)||!enough||me.toolItems.length>=12,click:()=>act(craft?'craftTool':'buyTool',target,{tool})}]);
    }
    $('cityPanelNote').textContent='Каждая добытая единица тратит 1 прочность. Бесплатная выдача не ремонтирует и не заменяет целый улучшенный инструмент. На сломанный можно получить стартовую замену.';
  }else if(cityPanelMode==='bag'){
    $('cityPanelTitle').textContent='Твой рюкзак';$('cityPanelIntro').textContent=`Занято веса: ${cargo()} / ${c.capacity}. Выложенные вещи остаются на земле и доступны всем жителям.`;
    for(const kind of ['wood','stone','food'])row(`${names[kind]} · ${me.bag[kind]}`,`Вес одной единицы: ${c.weights[kind]}`,[{id:'drop-one-'+kind,text:'Выложить 1',disabled:!canAct||!me.bag[kind],click:()=>act('drop',null,{kind,quantity:1})},{id:'drop-all-'+kind,text:'Выложить всё',disabled:!canAct||!me.bag[kind],click:()=>act('drop',null,{kind})}]);
    if(me.delivery)row('Городской груз',`${me.delivery.quantity} · ${names[me.delivery.kind]}. ${me.delivery.picked?'У тебя; не продаётся и не выкладывается.':'Ожидает на складе.'}`,[{text:me.delivery.picked?'Доставить груз':'Идти на склад',click:()=>navigateTo(me.delivery.picked?deliveryTarget(me.delivery):'warehouse')}]);
    $('cityPanelNote').textContent='Для продажи личных ресурсов подойди к городскому складу. Для подбора с земли — нажми на кучку и E.';
  }else if(cityPanelMode==='warehouse'){
    $('cityPanelTitle').textContent='Городской склад';$('cityPanelIntro').textContent='Сдай лишние материалы за небольшую плату. После приёмки они принадлежат городу. Оплата на стройке выше.';
    for(const kind of ['wood','stone']){
      const price=c.warehouse.pay[kind],quantity=Math.min(me.bag[kind],w.free[kind],Math.floor(w.funds/price));
      row(names[kind],`Свободный склад: ${w.stock[kind]}; мэрия: ${w.municipal[kind]}; в пути: ${state.materials[kind].inTransit}; стройки: ${state.materials[kind].onConstruction}; уже в зданиях: ${state.materials[kind].inStructures}; у тебя: ${me.bag[kind]}; общий баланс: ${state.materials[kind].total}. Приёмка: ${price} PAPER/шт.`,[{id:'sell-'+kind,text:`Сдать ${quantity} · +${quantity*price} PAPER`,disabled:!canAct||!nearby('warehouse')||quantity<=0,click:()=>act('warehouseSell','warehouse',{kind})}]);
    }
    if(me.delivery){const d=me.delivery;row('Твой курьерский заказ',`${d.quantity} · ${names[d.kind]} → ${deliveryLabel(d)}. Награда ${d.reward} PAPER после доставки.`,[{id:'courier-pickup',text:d.picked?'Груз уже у тебя':'Забрать городской груз',disabled:!canAct||!nearby('warehouse')||d.picked||cargo()+d.quantity*c.weights[d.kind]>c.capacity,click:()=>act('courierPickup','warehouse')},{id:'courier-cancel',text:d.picked?'Вернуть груз и отменить':'Отменить заказ',disabled:!canAct||(d.picked&&!nearby('warehouse')),click:()=>act('courierCancel','warehouse')}]);}
    else row('Курьерские работы','Заказ берётся на доске у мэрии. Городской груз переносится на выбранное место назначения.',[{text:'Идти к доске',click:()=>navigateTo('board')}]);
    $('cityPanelNote').textContent=`В запасе мэрии: ${w.municipal.wood} древесины, ${w.municipal.stone} камня. Свободный бюджет склада: ${w.funds} PAPER. Бюджет незавершённых строек защищён. Слоты груза в пути сохраняются для его возврата.`;
  }else{
    $('cityPanelTitle').textContent='Доска работ мэрии';$('cityPanelIntro').textContent='Актуальные работы города. Оплата за принятые материалы и выполненную работу — сразу; за курьерский заказ — после доставки.';
    for(const [project,pc,label,drop,build]of [[state.project,c,'Площадь','project','build'],...(forgeActive()?[[state.forge,{...c,...c.forge},'Кузница','forge-drop','forge-build']]:[]),...(bridgeActive()?[[state.bridge,{...c,...c.bridge},'Мост','bridge-drop','bridge-build']]:[]),[state.seedMarket,{...c,...c.seedMarket},'Семенная лавка','seed-shop-drop','seed-shop-build'],[state.gardenProject,{...c,...c.cityGarden},'Общий огород','public-garden-drop','public-garden-build']]){
      const missing=['wood','stone'].filter(k=>pc.need[k]>project.accepted[k]);
      if(missing.length)row(`${label} · поставка материалов`,missing.map(k=>`${names[k]}: ещё ${pc.need[k]-project.accepted[k]} · ${pc.pay[k]} PAPER/шт.`).join(' / '),[{text:'Идти к приёмке',click:()=>navigateTo(drop)}]);
      if(project.stage<pc.stages.length)row(`${label} · ${pc.stages[project.stage].title}`,`${project.work} / ${pc.stages[project.stage].works} работ. Награда ${pc.pay.work} PAPER за работу. ${projectReady(project,pc)?'Материалы готовы.':'Сначала доставьте материалы этапа.'}`,[{text:'Идти на стройку',click:()=>navigateTo(build)}]);
    }
    row('Склад · приёмка лишних ресурсов',`Древесина ${c.warehouse.pay.wood}, камень ${c.warehouse.pay.stone} PAPER/шт. Приёмка зависит от места и свободного бюджета.`,[{text:'Идти на склад',click:()=>navigateTo('warehouse')}]);
    row('Баланс материалов',`🪵 ${state.materials.wood.total} · 🪨 ${state.materials.stone.total}. Склад, мэрия, строения и грузы учитываются отдельно.`,[{text:'Открыть склад',click:()=>openCityPanel('warehouse')}]);
    if(me.delivery){const d=me.delivery;row('Твой курьерский заказ',`${d.quantity} · ${names[d.kind]}. ${d.picked?'Доставь: '+deliveryLabel(d)+'.':'Забери на складе до истечения 5 минут с принятия.'} Награда ${d.reward} PAPER.`,[{text:d.picked?'Доставить груз':'Идти на склад',click:()=>navigateTo(d.picked?deliveryTarget(d):'warehouse')},{text:d.picked?'Вернуть груз на склад':'Отменить заказ',disabled:!canAct,click:()=>d.picked?navigateTo('warehouse'):act('courierCancel','board')}]);}
    else for(const offer of state.courierOffers)row(`Курьер · ${names[offer.kind]} со склада → ${deliveryLabel(offer)}`,`${offer.quantity} шт. · вес ${offer.quantity*c.weights[offer.kind]} · награда ${offer.reward} PAPER. Груз городской; повторно продать его нельзя.`,[{id:(offer.destination==='bridge'?'accept-bridge-':'accept-')+offer.kind,text:'Взять заказ',disabled:!canAct||!nearby('board'),click:()=>act('courierAccept','board',{kind:offer.kind,destination:offer.destination})}]);
    if(!me.delivery&&!state.courierOffers.length)row('Курьерских заказов сейчас нет','Они появятся при наличии материалов, потребности мэрии или моста и свободного бюджета.');
    $('cityPanelNote').textContent='Один курьерский заказ на жителя. До получения груз резервируется на 5 минут. Полученный груз сохраняется при выходе; отмена с возвратом — на складе. Бесплатные инструменты — справа от палатки.';
  }
}
$('bagButton').onclick=()=>{if(me)openCityPanel('bag');};
function quickHomeAction(){
 if(context?.type!=='home'||!state?.home)return false;
 const id=context.id,h=state.home;
 if(['plot-exit','home-exit','tent','bed'].includes(id)){act('homeUse',id);return true;}
 if(id==='well'){act('homeWater',id);return true;}
 if(id==='garden'){if(h.owner===me.id){act('homePrepare',id);return true;}return false;}
 const node=h.nodes?.find(n=>n.id===id&&n.left>0);
 if(node){act('homeClear',id);return true;}
 const bed=h.beds?.find(b=>b.id===id);
 if(bed?.crop&&!bed.watered){act('homeWater',id);return true;}
 if(bed?.crop&&bed.watered&&state.now>=bed.readyAt){act('homeHarvest',id);return true;}
 return false;
}
function doContext(){if(!context||!context.enabled||me?.job||performance.now()-lastAction<(context.type==='homeClear'?570:180))return;lastAction=performance.now();if(context.type==='combat'){holdAction=false;location.href='/combat';return;}if(['mine','homeClear'].includes(context.type)&&heldResource()&&['wood','stone'].includes(state.home?.nodes.find(n=>n.id===context.id)?.kind||allTargets().find(t=>t.id===context.id)?.type)){holdAction=false;toast('Возьми топор или кирку в быстрой панели');return;}if(quickHomeAction())return;if(['board','warehouse','forge','shop','home','social','monument','jukebox','thefts','donation-box','donation-board','seeds','public-garden','city-registry','landscape','estate','mayor'].includes(context.type)){holdAction=false;if(context.type==='social')selected=context.id;openCityPanel(context.type==='social'?'resident':context.type);return;}act(context.type,context.id);}
$('actionButton').onclick=doContext;$('axeButton').onclick=()=>act('equip','axe');$('pickButton').onclick=()=>act('equip','pick');$('eatButton').onclick=()=>act(me.bag.food?'eat':'eatCarrot');
$('detailsButton').onclick=()=>{$('details').show();updateUI();};$('helpButton').onclick=()=>$('help').show();document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());
$('secondPlayer').onclick=()=>window.open('/?new=1','_blank','noopener');
$('chatForm').onsubmit=async e=>{e.preventDefault();const input=$('chatInput');if(input.value.trim()){await act('chat',null,{text:input.value});input.value='';}input.blur();canvas.focus();};
window.addEventListener('keydown',e=>{
  if($('welcome').open)return;
  if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){if(e.code==='Escape'){document.activeElement.blur();canvas.focus();}return;}
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyE'].includes(e.code))e.preventDefault();keys.add(e.code);
  if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))route=[];
  if(e.code==='KeyE'){holdAction=true;doContext();}if(e.repeat)return;if(/^Digit[1-6]$/.test(e.code))selectQuick(Number(e.code.slice(-1))-1);if(e.code==='KeyQ')placeQuick();if(e.code==='KeyF')act(me.bag.food?'eat':'eatCarrot');if(e.code==='Enter'){$('chatInput').focus();keys.clear();}if(e.code==='Escape'){if(placementKind){setPlacementKind(null);return;}document.querySelectorAll('dialog[open]').forEach(d=>d.close());route=[];selected=null;act('cancel');}
});
window.addEventListener('keyup',e=>{keys.delete(e.code);if(e.code==='KeyE')holdAction=false;});window.addEventListener('blur',()=>{keys.clear();holdAction=false;touchMove=null;route=[];if(token)api('input',{dx:0,dy:0}).catch(()=>{});});
// Mobile city input: one analog pad left, no directional arrow buttons.
const cityPad=$('cityMovePad'),cityThumb=$('cityMoveThumb');
let cityPointerId=null;
function updateCityStick(e){
  const r=cityPad.getBoundingClientRect(),radius=r.width*.31;
  const x=(e.clientX-(r.left+r.width/2))/radius,y=(e.clientY-(r.top+r.height/2))/radius;
  const distance=Math.hypot(x,y),length=Math.max(1,distance);
  const sx=x/length,sy=y/length,dead=.13;
  cityThumb.style.transform='translate('+Math.round(sx*radius)+'px,'+Math.round(sy*radius)+'px)';
  touchMove=distance>dead?[sx,sy]:null;route=[];selected=null;
}
cityPad.addEventListener('pointerdown',e=>{
  if(cityPointerId!==null)return;
  cityPointerId=e.pointerId;
  try{cityPad.setPointerCapture(e.pointerId);}catch{}
  updateCityStick(e);e.preventDefault();
});
cityPad.addEventListener('pointermove',e=>{if(cityPointerId===e.pointerId){updateCityStick(e);e.preventDefault();}});
function releaseCityStick(e){if(cityPointerId!==e.pointerId)return;cityPointerId=null;touchMove=null;cityThumb.style.transform='';}
for(const event of ['pointerup','pointercancel','lostpointercapture'])cityPad.addEventListener(event,releaseCityStick);
$('mobileActionButton').addEventListener('click',()=>{
  if(!me||!connected){toast('Нет связи с городом');return;}
  if(!context?.enabled){toast('Подойди к объекту или нажми «К БОЮ»');return;}
  doContext();
});
$('mobileCombatButton').addEventListener('click',()=>{
  if(!me||!connected){toast('Нет связи с городом');return;}
  if(state.scene!=='city'){toast('Сначала вернись в город');return;}
  if(me.spirit||me.job||me.delivery?.picked){toast('Заверши городское задание перед боем');return;}
  const gate=allTargets().find(t=>t.id==='combat-gate');
  if(!gate){toast('В этом городе пока нет боевой зоны');return;}
  selected=gate.id;
  if(Math.hypot(me.x-gate.x,me.y-gate.y)<=state.config.actionRange){
    updateContext();if(context?.type==='combat'&&context.enabled)doContext();
    else toast('Не удалось войти в боевую зону');
    return;
  }
  let paths=[];
  for(const [x,y] of [[0,1.4],[-1.4,0],[1.4,0],[0,-1.4]]){
    const candidate=findPath({x:gate.x+x,y:gate.y+y});if(candidate)paths.push(candidate);
  }
  paths.sort((a,b)=>pathDistance(a)-pathDistance(b));
  if(!paths.length){toast('Путь к боевой зоне заблокирован');return;}
  setRoute(paths[0]);toast('Идём к боевой зоне. Когда подойдёшь — нажми «В БОЙ».');
});
$('mobileEatButton').addEventListener('click',()=>{if(me)act(me.bag.food?'eat':'eatCarrot');});
const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
if(('ontouchstart' in window||navigator.maxTouchPoints>0)&&!standalone&&!sessionStorage.getItem('dementor-standalone-tip')){
  setTimeout(()=>{if($('standaloneTip'))$('standaloneTip').hidden=false;},3000);
}
$('standaloneDismiss').onclick=()=>{$('standaloneTip').hidden=true;sessionStorage.setItem('dementor-standalone-tip','1');};
window.__cityMobileInput=()=>({active:cityPointerId!==null,movement:touchMove,selected,nearCombat:!!(me&&Math.hypot(me.x-29,me.y-35)<=state?.config?.actionRange)});
function screenAlignedMotion(dx,dy){if(state?.scene!=='city')return [dx,dy];const n=Math.hypot(dx,dy);if(!n)return [0,0];const sx=dx/n,sy=dy/n;return [(sy+sx)/Math.SQRT2,(sy-sx)/Math.SQRT2];}
setInterval(()=>{if(!connected||!me)return;let dx=0,dy=0;if(!$('welcome').open&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){
  dx=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft'));dy=Number(keys.has('KeyS')||keys.has('ArrowDown'))-Number(keys.has('KeyW')||keys.has('ArrowUp'));if(touchMove)[dx,dy]=touchMove;
  if(!dx&&!dy&&route.length){
     while(route.length&&Math.hypot(route[0].x-me.x,route[0].y-me.y)<.32)route.shift();
     if(route.length){
       const now=performance.now();
       if(Math.hypot(me.x-routeActivity.x,me.y-routeActivity.y)>.16)routeActivity={x:me.x,y:me.y,at:now};
       if(now-routeActivity.at>2500){route=[];selected=null;toast('Путь заблокирован. Нажми на свободную точку.');}
       else {dx=route[0].x-me.x;dy=route[0].y-me.y;const n=Math.hypot(dx,dy);if(n){const throttle=Math.min(1,n/.85);dx=dx/n*throttle;dy=dy/n*throttle;}}
     }
   }
  if(holdAction)doContext();
  }if((touchMove||[...keys].some(k=>['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(k)))&&(dx||dy))[dx,dy]=screenAlignedMotion(dx,dy);if(!inputPending){inputPending=true;api('input',{dx,dy,sprint:keys.has('ShiftLeft')||keys.has('ShiftRight')}).catch(()=>{}).finally(()=>{inputPending=false;});}
},80);

// ISO30 is a projection of the existing world coordinates, not a change to gameplay.
const ISO_COS=Math.sqrt(3)/2;
function screen(x,y){
  if(state?.scene&&state.scene!=='city')return {x:view.w/2+(x-view.cx)*view.s,y:view.h/2+(y-view.cy)*view.s*.76};
  const dx=x-view.cx,dy=y-view.cy;
  return {x:view.w/2+(dx-dy)*view.s*ISO_COS,y:view.h/2+(dx+dy)*view.s*.5};
}
function worldPoint(x,y){
  if(state?.scene&&state.scene!=='city')return {x:(x-view.w/2)/view.s+view.cx,y:(y-view.h/2)/(view.s*.76)+view.cy};
  const u=(x-view.w/2)/(view.s*ISO_COS),v=(y-view.h/2)/(view.s*.5);
  return {x:view.cx+(u+v)/2,y:view.cy+(v-u)/2};
}
function blocked(x,y){const c=state.config,r=.35;if(state.scene!=='city'){return x<r||y<r||x>16-r||y>16-r||(['plot','expedition'].includes(state.scene)&&(state.home.nodes.some(n=>n.left&&Math.hypot(x-n.x,y-n.y)<.63)||state.scene==='plot'&&state.home.plantedTrees?.some(t=>t.wateredAt&&state.now-t.wateredAt>=180000&&Math.hypot(x-t.x,y-t.y)<.6)));}if(x<r||y<r||x>c.width-r||y>c.height-r)return true;if(x+r>c.river.x&&x-r<c.river.x+c.river.w&&!(bridgeOpen()&&y-r>=c.bridge.y&&y+r<=c.bridge.y+c.bridge.h))return true;
  if((state.citySolids||[{x:4,y:4,w:4,h:3}]).some(o=>x+r>o.x&&x-r<o.x+o.w&&y+r>o.y&&y-r<o.y+o.h))return true;if((state.worldTravel?.obstacles||[]).some(o=>x+r>o.x&&x-r<o.x+o.w&&y+r>o.y&&y-r<o.y+o.h))return true;return state.resources.some(o=>o.stock>0&&o.type!=='food'&&Math.hypot(x-o.x,y-o.y)<.63);
}
function pathDistance(path){return path.reduce((distance,p,i)=>distance+Math.hypot(p.x-(i?path[i-1].x:me.x),p.y-(i?path[i-1].y:me.y)),0);}
function findPath(dest){const step=.5,start={x:Math.round(me.x/step),y:Math.round(me.y/step)},goal={x:Math.round(dest.x/step),y:Math.round(dest.y/step)};const key=p=>p.x+','+p.y;
  if(blocked(goal.x*step,goal.y*step))return null;
  const queue=[start],seen=new Map([[key(start),null]]);let found=null;
  for(let i=0;i<queue.length&&i<20000;i++){const p=queue[i];if(p.x===goal.x&&p.y===goal.y){found=p;break;}for(const[dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const q={x:p.x+dx,y:p.y+dy};if(!seen.has(key(q))&&!blocked(q.x*step,q.y*step)){seen.set(key(q),p);queue.push(q);}}}
  if(!found)return null;
   const out=[];for(let p=found;p;p=seen.get(key(p)))out.push({x:p.x*step,y:p.y*step});
   const path=out.reverse();
   return path.slice(1).filter((point,i)=>{
     const previous=path[i],next=path[i+2];
     return !next||(point.x-previous.x)*(next.y-point.y)!==(point.y-previous.y)*(next.x-point.x);
   });
}
function selectWorldTarget(e){if(e.button===2)return;if(!me||$('welcome').open)return;canvas.focus();const r=canvas.getBoundingClientRect(),w=worldPoint(e.clientX-r.left,e.clientY-r.top);
 if(placementKind){if(state.scene!=='city'){toast('Покрытие можно уложить только в городе');return;}const kind=placementKind;act('landscapePlace',null,{kind,x:Math.floor(w.x),y:Math.floor(w.y)}).then(result=>{if(result?.ok&&!(me.terrainBag?.[kind]>1))setPlacementKind(null);});return;}const targets=allTargets().sort((a,b)=>Math.hypot(a.x-w.x,a.y-w.y)-Math.hypot(b.x-w.x,b.y-w.y));const pile=targets.find(t=>t.type==='pickup'&&Math.hypot(t.x-w.x,t.y-w.y)<.7);const plot=pile||state.scene!=='city'?null:state.plots.find(p=>w.x>=p.x&&w.x<=p.x+p.w&&w.y>=p.y&&w.y<=p.y+p.h);let t=pile||(plot?targets.find(t=>t.id===plot.id):targets[0]);const insideSquare=state.scene==='city'&&w.x>=14&&w.x<=24&&w.y>=10&&w.y<=18;if(!plot&&insideSquare&&Math.hypot(t.x-w.x,t.y-w.y)>=1.3)t=targets.find(t=>t.id==='build');
  if(t&&(plot||insideSquare||Math.hypot(t.x-w.x,t.y-w.y)<1.3)){selected=t.id;if(Math.hypot(t.x-me.x,t.y-me.y)<=state.config.actionRange){updateContext();return;}
    let candidates=[];for(const[dx,dy]of [[0,1.4],[-1.4,0],[1.4,0],[0,-1.4]]){let dest={x:t.x+dx,y:t.y+dy};const path=findPath(dest);if(path)candidates.push(path);}candidates.sort((a,b)=>pathDistance(a)-pathDistance(b));if(candidates[0])setRoute(candidates[0]);else toast('Пока нет доступного пути');
  }else{selected=null;const path=findPath(w);if(path)setRoute(path);else toast(w.x>=state.config.river.x&&!bridgeOpen()?'Здесь нужна переправа. Сначала достройте мост.':'Не получается пройти — выбери свободное место.');}
}

canvas.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){const r=canvas.getBoundingClientRect();hoverWorld=worldPoint(e.clientX-r.left,e.clientY-r.top);}});canvas.addEventListener('pointerleave',()=>{hoverWorld=null;});
const activeTouches=new Map();
let pinchDistance=0,gestureActive=false,tapStart=null;
canvas.addEventListener('pointerdown',e=>{
  if(e.button!==0||!me||$('welcome').open)return;
  if(e.pointerType!=='touch'){selectWorldTarget(e);return;}
  activeTouches.set(e.pointerId,{x:e.clientX,y:e.clientY});
  try{canvas.setPointerCapture(e.pointerId);}catch{}
  if(activeTouches.size===1){tapStart={x:e.clientX,y:e.clientY,at:performance.now()};gestureActive=false;}
  if(activeTouches.size>=2){gestureActive=true;tapStart=null;const [a,b]=[...activeTouches.values()];pinchDistance=Math.hypot(a.x-b.x,a.y-b.y);}
});
canvas.addEventListener('pointermove',e=>{
  if(!activeTouches.has(e.pointerId))return;
  activeTouches.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(activeTouches.size>=2){const [a,b]=[...activeTouches.values()],distance=Math.hypot(a.x-b.x,a.y-b.y);if(pinchDistance>0&&distance>0)zoom(distance/pinchDistance);pinchDistance=distance;gestureActive=true;}
  else if(tapStart&&Math.hypot(e.clientX-tapStart.x,e.clientY-tapStart.y)>12)gestureActive=true;
});
function endTouch(e,cancelled=false){
  if(!activeTouches.has(e.pointerId))return;
  const tap=!cancelled&&!gestureActive&&activeTouches.size===1&&tapStart&&performance.now()-tapStart.at<600&&Math.hypot(e.clientX-tapStart.x,e.clientY-tapStart.y)<12;
  activeTouches.delete(e.pointerId);pinchDistance=0;
  if(tap)selectWorldTarget(e);
  if(!activeTouches.size){gestureActive=false;tapStart=null;}
}
canvas.addEventListener('pointerup',e=>endTouch(e));
canvas.addEventListener('pointercancel',e=>endTouch(e,true));

function setPlacementKind(kind){placementKind=kind;canvas.classList.toggle('placing-terrain',!!kind);if(kind){$('cityPanel').close();toast('Укладка: нажми на свободную клетку рядом. Esc — выход.');}else toast('Режим укладки выключен');}
function zoom(value){if(!Number.isFinite(value)||value<=0)return;view.zoom=Math.max(.65,Math.min(2.5,view.zoom*value));resize();}
$('zoomIn').onclick=()=>zoom(1.2);$('zoomOut').onclick=()=>zoom(1/1.2);$('centerButton').onclick=()=>{if(me)openCityPanel('places');};
canvas.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?1.08:1/1.08);},{passive:false});
function resize(){const dpr=devicePixelRatio||1;view.w=innerWidth;view.h=innerHeight;canvas.width=view.w*dpr;canvas.height=view.h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);view.s=Math.max(view.w<760?20:12,Math.min((view.w-50)/48,(view.h-80)/(32*.76)))*view.zoom*(state?.scene&&state.scene!=='city'?1.8:1);}
window.addEventListener('resize',resize);resize();
function poly(points,fill,stroke='#595d4b',width=1){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
function rounded(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}}
function line(x,y,x2,y2,color,width=1){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
function label(text,x,y,small=false){if(me&&Math.hypot(me.x-x,me.y-y)>3.1&&(!hoverWorld||Math.hypot(hoverWorld.x-x,hoverWorld.y-y)>1.4))return;const p=screen(x,y);ctx.font=`${small?9:10}px Paper, Arial`;const width=ctx.measureText(text).width;rounded(p.x-width/2-7,p.y-10,width+14,18,6,'#f6f3e5dc');ctx.textAlign='center';ctx.fillStyle=small?'#939781':'#6c7460';ctx.fillText(text,p.x,p.y+2);}
function groundRect(o,color,border,dash=false){
  if(state?.scene&&state.scene!=='city'){const p=screen(o.x,o.y),w=o.w*view.s,h=o.h*view.s*.76;ctx.setLineDash(dash?[4,6]:[]);rounded(p.x,p.y,w,h,3,color,border);ctx.setLineDash([]);return {...p,w,h};}
  const corners=[[o.x,o.y],[o.x+o.w,o.y],[o.x+o.w,o.y+o.h],[o.x,o.y+o.h]].map(([x,y])=>{const p=screen(x,y);return [p.x,p.y];});
  ctx.setLineDash(dash?[4,6]:[]);poly(corners,color,border,1);ctx.setLineDash([]);
  const xs=corners.map(v=>v[0]),ys=corners.map(v=>v[1]);
  return {x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)};
}
function shadow(x,y,rx,ry){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle='#4f584013';ctx.fill();}
// Shared paper volumes: front, right side and upper fold under one oblique projection.
function paperBox(x,y,w,h,dx,dy,front='#c9b796',side='#a38e70',top='#e0d2b4'){
 poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],front,'#7b806a');
 poly([[x+w,y],[x+w+dx,y+dy],[x+w+dx,y+h+dy],[x+w,y+h]],side,'#7b806a');
 poly([[x,y],[x+dx,y+dy],[x+w+dx,y+dy],[x+w,y]],top,'#7b806a');
}
function paperWarehouse(o){const s=view.s,p=screen(o.x,o.y+o.h),w=o.w*s,y=p.y-s*1.38;
 shadow(p.x+w*.5,p.y,s*1.3,s*.2);groundRect(o,'#bfb49b','#a49a80');
 for(const off of [.08,.83])paperBox(p.x+w*off,y+s*.35,s*.15,s*1.3,s*.15,-s*.09,'#a79170','#80725c','#cdbb96');
 poly([[p.x-s*.14,y+s*.24],[p.x+w*.53,y-s*.35],[p.x+w+s*.22,y+s*.18],[p.x+w*.32,y+s*.62]],'#c8b691','#7f7e67');
 for(let i=0;i<3;i++)paperBox(p.x+s*(.18+i*.55),p.y-s*.40,s*.45,s*.42,s*.16,-s*.1,i===1?'#8d9b92':'#b09a79','#887c65','#d8c5a1');
}
function drawToolSign(x,y){const p=screen(x,y),s=view.s;const a=p.x,b=p.y-s*.9;paperBox(a-s*.47,b,s*.94,s*.38,s*.10,-s*.07,'#85947d','#61745e','#aebba1');line(a-s*.27,b+s*.12,a-s*.05,b+s*.29,'#f7ebc9',2.5);poly([[a-s*.35,b+s*.08],[a-s*.16,b+s*.06],[a-s*.12,b+s*.17],[a-s*.33,b+s*.17]],'#e9e1ca','#f5eddb');line(a+s*.09,b+s*.12,a+s*.32,b+s*.29,'#f7ebc9',2.5);poly([[a+s*.16,b+s*.09],[a+s*.37,b+s*.09],[a+s*.40,b+s*.18],[a+s*.13,b+s*.18]],'#e9e1ca','#f5eddb');}
function paperHouse(o,variant='warehouse'){
 const s=view.s,p=screen(o.x,o.y+o.h),w=o.w*s,h=Math.min(o.h*.76,2.1)*s,dx=s*.65,dy=-s*.45,y=p.y-h,peak=y-s*.75;
 shadow(p.x+w*.5+dx*.4,p.y+4,w*.63,s*.2);paperBox(p.x,y,w,h,dx,dy,variant==='forge'?'#bfad8c':'#d2c2a3','#aa9778','#e5d9bb');
 poly([[p.x-s*.12,y],[p.x+w*.45,peak],[p.x+w+s*.12,y]],'#d8c7a6','#7c8069');
 poly([[p.x+w*.45,peak],[p.x+w*.45+dx,peak+dy],[p.x+w+dx+s*.12,y+dy],[p.x+w+s*.12,y]],variant==='forge'?'#9b8270':'#b09a79','#7c8069');
 line(p.x+w*.45,peak,p.x+w*.45+dx,peak+dy,'#eee5cc',1);
 const doorw=Math.min(w*.26,s*.9),doorx=p.x+w*.45-doorw*.5;poly([[doorx,p.y-h*.62],[doorx+doorw,p.y-h*.62],[doorx+doorw,p.y],[doorx,p.y]],'#63705d','#7b806a');
 line(doorx+doorw*.5,p.y-h*.62,doorx+doorw*.5,p.y,'#a4ac8c');
 for(const rel of (variant==='shop'?[.73]:[.13,.73])){const wx=p.x+w*rel,wy=y+h*.24,ww=Math.min(s*.55,w*.15),wh=s*.42;paperBox(wx,wy,ww,wh,s*.06,-s*.04,'#8b9f91','#718575','#d2d8c2');line(wx+ww*.5,wy,wx+ww*.5,wy+wh,'#d8dfcb');}
 if(variant==='warehouse')for(let i=0;i<2;i++)paperBox(p.x+s*.12+i*s*.5,p.y-s*.35,s*.4,s*.35,s*.14,-s*.1,'#b6a07e','#978464','#d2be99');
 if(variant==='shop'){poly([[p.x+w*.04,y+h*.05],[p.x+w*.92,y+h*.05],[p.x+w*.98,y+h*.22],[p.x,y+h*.22]],'#98a487','#77846b');line(p.x+w*.2,y+h*.07,p.x+w*.2,y+h*.2,'#dfe3cd');line(p.x+w*.65,y+h*.07,p.x+w*.65,y+h*.2,'#dfe3cd');}
 if(variant==='forge'){paperBox(p.x+w*.75,peak-s*.5,s*.42,s*1.15,s*.25,-s*.16,'#a99980','#8e806b','#c9bda2');const q=screen(o.x+o.w*.65,o.y+o.h-.45);poly([[q.x-s*.18,q.y],[q.x,q.y-s*.45],[q.x+s*.18,q.y]],'#c89160','#9a785a');}
 if(variant==='museum'){
  for(const i of [.16,.44,.74])paperBox(p.x+w*i,p.y-h*.7,s*.14,h*.7,s*.1,-s*.06,'#e4d4b7','#b6a88c','#f4e8cf');
  poly([[p.x+w*.04,y-s*.05],[p.x+w*.5,y-s*.74],[p.x+w*.96,y-s*.05]],'#c8b596','#788573');
 }else if(variant==='arena'){
  for(let i=0;i<3;i++)poly([[p.x+i*w/3,y],[p.x+(i+.5)*w/3,y-s*.54],[p.x+(i+1)*w/3,y]],i===1?'#c9aa7e':'#adb699','#798670');
  for(const rel of [.18,.79])line(p.x+w*rel,y,p.x+w*rel,y-s*.83,'#7d806e',2);
 }else if(variant==='factory'){
  paperBox(p.x+w*.72,peak-s*.91,s*.28,s*1.32,s*.16,-s*.1,'#ada28d','#877f6e','#d9cbb0');
  paperBox(p.x+w*.42,peak-s*.52,s*.20,s*.83,s*.12,-s*.08,'#9a9f89','#77826e','#c0c9af');
 }else if(variant==='gate'){
  for(const rel of [.04,.73])paperBox(p.x+w*rel,y-s*.60,w*.24,h+s*.6,s*.1,-s*.07,'#c2b294','#9c8b75','#ded1b4');
  poly([[p.x+w*.25,y-s*.35],[p.x+w*.49,y-s*.84],[p.x+w*.73,y-s*.35]],'#9baf99','#7b8c7c');
 }
}
function paperTent(o,stage=3){const s=view.s,p=screen(o.x,o.y+o.h),w=o.w*s*.8,dx=o.w*s*.2,dy=-o.h*s*.43,h=s*1.9;
 shadow(p.x+w*.5+dx*.3,p.y+4,w*.66,s*.2);
 if(stage<2){for(const off of [0,dx]){line(p.x+off,p.y+(off?dy:0),p.x+w*.5+off,p.y-h+(off?dy:0),'#8a8268',2);line(p.x+w*.5+off,p.y-h+(off?dy:0),p.x+w+off,p.y+(off?dy:0),'#8a8268',2);}line(p.x+w*.5,p.y-h,p.x+w*.5+dx,p.y-h+dy,'#8a8268',2);return;}
 poly([[p.x,p.y],[p.x+w*.5,p.y-h],[p.x+w,p.y]],'#e8dfc3','#85816a');
 poly([[p.x+w*.5,p.y-h],[p.x+w*.5+dx,p.y-h+dy],[p.x+w+dx,p.y+dy],[p.x+w,p.y]],'#bdad8e','#85816a');
 poly([[p.x+w*.25,p.y],[p.x+w*.5,p.y-h*.7],[p.x+w*.7,p.y]],'#626d59','#85816a');
 poly([[p.x+w*.25,p.y],[p.x+w*.5,p.y-h*.7],[p.x+w*.38,p.y]],'#f1e7cc','#a59b7e');
 line(p.x+w*.5,p.y-h,p.x+w*.5+dx,p.y-h+dy,'#faf0d7');
 for(const [x,y,sign]of [[p.x,p.y,-1],[p.x+w,p.y,1]]){line(x,y-s*.25,x+sign*s*.35,y+s*.1,'#aaa184');line(x+sign*s*.35,y,x+sign*s*.35,y+s*.19,'#7e8268',2);}
}
function paperBoard(x,y,title,thefts=false){const s=view.s,p=screen(x,y),w=s*1.65,h=s*1.1,top=p.y-s*1.55;
 shadow(p.x,p.y+s*.12,s*.95,s*.2);for(const off of [-.63,.63])paperBox(p.x+off*s,top+h*.55,s*.09,s*1.1,s*.12,-s*.08,'#ad9b78','#887e62','#c9bc97');
 paperBox(p.x-w*.5,top,w,h,s*.23,-s*.15,'#b9a483','#927e62','#d1bf9d');
 for(let i=0;i<3;i++){const xx=p.x-w*.37+i*w*.25,yy=top+h*.23+(i%2)*s*.09;poly([[xx,yy],[xx+w*.2,yy-s*.025],[xx+w*.2,yy+h*.52],[xx,yy+h*.5]],'#eee6cd','#a6987b');line(xx+w*.03,yy+h*.18,xx+w*.16,yy+h*.18,thefts?'#a77563':'#8b967b');line(xx+w*.03,yy+h*.27,xx+w*.15,yy+h*.27,'#b6ad95');}
 // One standard wooden board, distinct tiny hand-drawn graphics.
 const cx=p.x,cy=top+h*.57,k=s*.24;
 if(/пожертв/i.test(title)){poly([[cx,cy+k*.52],[cx-k*.7,cy-k*.22],[cx-k*.4,cy-k*.58],[cx,cy-k*.27],[cx+k*.4,cy-k*.58],[cx+k*.7,cy-k*.22]],'#b5a07c','#6e8068');}
 else if(/вор/i.test(title)){rounded(cx-k*.45,cy-k*.07,k*.9,k*.55,1,'#a88272','#776e65');line(cx-k*.3,cy-k*.07,cx-k*.3,cy-k*.55,'#756f63',2);line(cx-k*.3,cy-k*.55,cx+k*.3,cy-k*.55,'#756f63',2);line(cx+k*.3,cy-k*.55,cx+k*.3,cy-k*.07,'#756f63',2);}
 else if(/работ|строй|мост/i.test(title)){line(cx-k*.65,cy+k*.55,cx+k*.65,cy-k*.6,'#657863',3);line(cx-k*.65,cy-k*.6,cx+k*.65,cy+k*.55,'#887052',3);}
 else if(/город|реестр/i.test(title)){poly([[cx-k*.65,cy],[cx,cy-k*.65],[cx+k*.65,cy]],'#758d7b','#4c6758');rounded(cx-k*.45,cy,k*.9,k*.52,1,'#b0bca6','#6f7d69');}
 else if(/боев|мисси/i.test(title)){poly([[cx-k*.4,cy-k*.6],[cx+k*.4,cy-k*.6],[cx+k*.5,cy+k*.1],[cx,cy+k*.65],[cx-k*.5,cy+k*.1]],'#8f786b','#6d655f');}
 else{line(cx-k*.5,cy+k*.45,cx+k*.5,cy-k*.45,'#70836f',3);poly([[cx+k*.2,cy-k*.45],[cx+k*.55,cy-k*.65],[cx+k*.5,cy-k*.1]],'#91a287','#637c67');}
 label(title,x,y+.65,true);
}
function paperBench(x,y){const s=view.s,p=screen(x,y),w=s*1.8;shadow(p.x,p.y+4,s*1.1,s*.21);
 for(const off of [-.65,.65])paperBox(p.x+off*s,p.y-s*.34,s*.14,s*.44,s*.2,-s*.13,'#8d977a','#727e65','#b3bc9b');
 paperBox(p.x-w*.5,p.y-s*.4,w,s*.14,s*.34,-s*.23,'#bba17c','#958362','#d8c29c');
 paperBox(p.x-w*.5,p.y-s*1.02,w,s*.34,s*.12,-s*.08,'#c3ac87','#998767','#dfcda8');line(p.x-w*.48,p.y-s*.84,p.x+w*.48,p.y-s*.84,'#a18e6b');
}
function drawTent(){paperTent({x:4,y:4,w:4,h:3});label('Временная мэрия',6,3.05);
 const s=view.s,t=screen(9,6);paperBox(t.x-s*.5,t.y-s*.9,s,s*.12,s*.3,-s*.18,'#ad9a74','#8a8064','#d5c59e');for(const off of [-.42,.42])paperBox(t.x+off*s,t.y-s*.8,s*.09,s*.88,s*.12,-s*.08,'#9b8d6e','#7d7860','#c4b48f');for(let i=0;i<2;i++){line(t.x+i*s*.28-s*.15,t.y-s*.8,t.x+i*s*.28-s*.15,t.y-s*.1,'#9b8462',3);line(t.x+i*s*.28-s*.28,t.y-s*.7,t.x+i*s*.28,t.y-s*.65,'#72816a',4);}label('Инструменты',9,7.1,true);
 paperBoard(3.2,8,'Доска работ');label('Доставка в мэрию',9,2,true);
}
function drawProject(){const pr=state?.project||{stage:0,work:0,accepted:{wood:0,stone:0}},o={x:14,y:10,w:10,h:8};let col=pr.stage===0?'#cfc8b419':pr.stage===1?'#d6d5c2':'#dedfce';const p=groundRect(o,col,pr.stage<3?'#aaa88a':'#b3baa0',pr.stage===0);
  if(pr.stage>0){const work=pr.stage>=2?1:pr.work/4;ctx.save();ctx.beginPath();ctx.rect(p.x,p.y,p.w,p.h*work);ctx.clip();for(let y=0;y<8;y++)for(let x=0;x<10;x++){const q=screen(14+x,10+y);rounded(q.x+1,q.y+1,view.s-2,view.s*.76-2,1,(x+y)%3?'#e6e4d1':'#d2d5c0','#c1c6ae66');}ctx.restore();}
  if(pr.stage<3){for(const[x,y]of [[14,10],[24,10],[14,18],[24,18]]){const a=screen(x,y);line(a.x,a.y-11,a.x,a.y+4,'#8d8b6c',3);}}
  if(pr.stage>=2){paperBench(16,16);paperBench(22,16);}
  if(pr.stage===3){for(const[x,y]of [[15,11],[23,11],[15,17],[23,17]]){drawFood({x,y:y-.35,stock:0});const a=screen(x,y);paperBox(a.x-view.s*.35,a.y-view.s*.28,view.s*.7,view.s*.3,view.s*.2,-view.s*.13,'#a7ad8d','#869474','#c5cbae');}label('Наша площадь',19,9.1);}
  else label('Будущая площадь',19,9.05);
  if(pr.stage<3)paperOpenBox(15,11,'Материалы площади');const q=screen(18,14);ctx.beginPath();ctx.arc(q.x,q.y,view.s*.55,0,Math.PI*2);ctx.fillStyle='#84936b13';ctx.fill();ctx.fillStyle='#7e8d6666';ctx.font='18px Arial';ctx.textAlign='center';ctx.fillText(pr.stage===3?'✓':'⌑',q.x,q.y+5);
  if(pr.stage<3)label(`${pr.accepted.wood} древесины · ${pr.accepted.stone} камня`,19,18.9,true);
}
function paperOpenBox(x,y,title){const p=screen(x,y),s=view.s;shadow(p.x,p.y+4,s*.65,s*.2);paperBox(p.x-s*.4,p.y-s*.25,s*.8,s*.45,s*.3,-s*.2,'#b7aa85','#93896c','#665f48');poly([[p.x-s*.4,p.y-s*.25],[p.x-s*.7,p.y-s*.53],[p.x+s*.1,p.y-s*.53],[p.x+s*.4,p.y-s*.25]],'#d6c7a3','#93896c');poly([[p.x+s*.4,p.y-s*.25],[p.x+s*.7,p.y-s*.45],[p.x+s*.95,p.y-s*.65],[p.x+s*.7,p.y-s*.45]],'#c9b78f','#93896c');if(title)label(title,x,y+1,true);}
function drawForge(){const stage=state?.forge.stage||0;
 if(stage<2){const p=groundRect({x:24,y:23,w:6,h:5},stage?'#c3b79b':'#d7d7bd15','#999078',!stage);if(stage)for(let i=0;i<6;i++)line(p.x+i*view.s,p.y,p.x+i*view.s,p.y+p.h,'#aaa18c');}
 else paperHouse({x:24,y:23,w:6,h:5},stage>=3?'forge':'construction');
 if(forgeActive()&&stage<3)paperOpenBox(24.5,24,'Материалы кузницы');
 label(stage>=3?'Наша кузница':forgeActive()?'Строим кузницу':'Будущая кузница',27,22,true);if(forgeActive())label(stage>=3?'Изготовить инструмент · E':'Работа · E',27,29.5,true);
}
function drawBridge(){
  const stage=state?.bridge.stage||0,p=groundRect({x:32,y:12,w:8,h:3},stage>=2?'#c4b18a':'#b4b99c15','#929c7b88',stage===0);
  if(stage>=1){for(const x of [33,39])for(const y of [12,15]){const q=screen(x,y);line(q.x,q.y-12,q.x,q.y+5,'#86816a',5);}}
  if(stage>=2){const a=screen(32,15);paperBox(a.x,a.y,p.w,view.s*.13,view.s*.18,-view.s*.12,'#b49c77','#8f8064','#d3bf98');for(let x=32;x<40;x+=.5){const q=screen(x,12);line(q.x,q.y,q.x,q.y+p.h,'#998c70',1);}}
  if(stage>=3){for(const y of [12,15]){const a=screen(32,y),b=screen(40,y);line(a.x,a.y-8,b.x,b.y-8,'#7b775f',3);}}
  label(stage>=3?'Общий мост · проход открыт':stage?'Строим переправу':'Будущий мост',36,10.6,true);
  if(bridgeActive()&&stage<3){paperOpenBox(32.5,12.3,'Материалы моста');label('Работа · E',32,15.8,true);}
}
function drawPlot(o){const owner=state?.players.find(p=>p.id===o.owner);const mine=o.owner===me?.id;groundRect(o,o.owner?(mine?'#9baa7a18':'#9aa58d12'):'#c8c9a31a',o.owner?'#9da980':'#b9b99b',!o.owner);
  for(const[x,y]of [[o.x,o.y],[o.x+o.w,o.y],[o.x,o.y+o.h],[o.x+o.w,o.y+o.h]]){const p=screen(x,y);line(p.x,p.y-7,p.x,p.y+3,o.owner?'#86936d':'#aca78a',2);}
  label(o.owner?(o.shop?.sign|| (mine?'Твой участок':o.ownerName||owner?.name||'Житель')):o.locked?'Откроется после расчистки':`Участок · ${state?.config.plotPrice||120} PAPER`,o.x+o.w/2,o.y+o.h/2,true);
  if(o.owner&&o.homeVisual){const t=screen(o.x+o.w*.55,o.y+o.h*.56),s=view.s,k=o.homeVisual.tent;if(k){poly([[t.x-s*.28,t.y],[t.x,t.y-s*.60],[t.x+s*.28,t.y]],k===3?'#d8c6a7':'#c1b198','#87907c');poly([[t.x,t.y-s*.60],[t.x+s*.40,t.y-s*.48],[t.x+s*.52,t.y-s*.10],[t.x+s*.28,t.y]],'#a4ab94','#788475');}if(o.homeVisual.beds){for(let i=0;i<Math.min(4,o.homeVisual.beds);i++){const q=screen(o.x+1+(i%2)*.8,o.y+o.h-1-Math.floor(i/2)*.8);rounded(q.x-3,q.y-3,6,5,1,i<o.homeVisual.crops?'#8fa67e':'#c5ae89','#839179');}}}
   if(o.owner){const p=screen(o.x+1,o.y+1);ctx.fillStyle=colors[owner?.color||0];ctx.fillRect(p.x-1,p.y-20,2,21);poly([[p.x+1,p.y-20],[p.x+16,p.y-17],[p.x+1,p.y-10]],colors[owner?.color||0],null);}
}
function drawTree(o){if(o.stock<=0)return;const p=screen(o.x,o.y),s=view.s;shadow(p.x+6,p.y+3,s*.65,s*.17);const n=Number.isInteger(o.visualVariant)?o.visualVariant:String(o.id||o.x+'-'+o.y).split('').reduce((a,c)=>a+c.charCodeAt(0),0)%5;
 const trunk=[.19,.27,.24,.17,.13][n],height=[.86,1.08,.77,1.12,.62][n];rounded(p.x-s*trunk*.5,p.y-s*height,s*trunk,s*height,2,'#a08a68','#7e8467');
 const top=p.y-s*(height+.25),r=s*[.68,.77,.62,.59,.46][n],green=['#a1a78a','#8ca08a','#9aa580','#788f80','#b2b68d'][n];
 if(n===3){for(let i=0;i<3;i++){const y=top+s*i*.32,k=r*(.65+i*.22);poly([[p.x,y-s*.55],[p.x-k,y+s*.29],[p.x+k,y+s*.29]],green,'#637e70');}return;}
 const points=n===4?[[-.8,.2],[-.6,-.45],[0,-.7],[.75,-.3],[1,.15],[.3,.55],[-.65,.45]]:n===1?[[-1,0],[-.76,-.86],[.22,-1.1],[1,-.55],[.96,.4],[.25,.88],[-.83,.64]]:n===2?[[-.95,-.12],[-.40,-1.07],[.45,-.8],[1,-.25],[.65,.8],[-.48,.76]]:[[-.9,-.35],[-.55,-.95],[.35,-1],[1,-.35],[.95,.4],[.2,.75],[-.65,.6]];
 poly(points.map(([dx,dy])=>[p.x+dx*r,top+dy*r]),green,'#788d73');poly([[p.x-r*.6,top-r*.4],[p.x-r*.4,top-r*.7],[p.x+r*.25,top-r*.7],[p.x,top]],'#c3c5a4',null);
}
function drawHempBush(x,y){const p=screen(x,y),s=view.s;shadow(p.x,p.y+3,s*.4,s*.12);line(p.x,p.y,p.x,p.y-s*.48,'#8e9272',2);for(const [dx,dy,k] of [[-.23,-.35,.38],[.22,-.38,.38],[0,-.62,.5]]){const a=p.x+dx*s,b=p.y+dy*s,r=k*s;poly([[a,b-r],[a+r*.18,b-r*.21],[a+r,b-r*.36],[a+r*.36,b+r*.1],[a+r*.7,b+r*.6],[a,b+r*.24],[a-r*.7,b+r*.6],[a-r*.36,b+r*.1],[a-r,b-r*.36],[a-r*.18,b-r*.21]],'#8da581','#738d70');}}
function drawStone(o){if(o.stock<=0)return;const p=screen(o.x,o.y),s=view.s*(o.rockSize?Math.max(.8,o.rockSize*Math.sqrt(o.stock/Math.max(1,o.initial||o.stock))):1);shadow(p.x+5,p.y+2,s*.55,s*.18);poly([[p.x-s*.5,p.y],[p.x-s*.38,p.y-s*.55],[p.x+s*.05,p.y-s*.84],[p.x+s*.45,p.y-s*.4],[p.x+s*.55,p.y+s*.05]],'#a8ada2','#899487');poly([[p.x-s*.38,p.y-s*.55],[p.x+s*.05,p.y-s*.84],[p.x+s*.12,p.y-s*.18]],'#c4c6b9',null);poly([[p.x+s*.05,p.y-s*.84],[p.x+s*.45,p.y-s*.4],[p.x+s*.55,p.y+s*.05],[p.x+s*.12,p.y-s*.18]],'#949e94',null);}
function drawFood(o){const p=screen(o.x,o.y),s=view.s;shadow(p.x+4,p.y+3,s*.5,s*.17);
  for(const[dx,dy,r]of [[-.25,-.2,.34],[.24,-.22,.36],[0,-.49,.38]]){const x=p.x+dx*s,y=p.y+dy*s,k=r*s;poly([[x-k,y],[x-k*.6,y-k*.8],[x+k*.4,y-k],[x+k,y-k*.15],[x+k*.7,y+k*.6],[x-k*.5,y+k*.5]],'#8d9d7c','#788b6e');poly([[x-k*.6,y-k*.8],[x+k*.4,y-k],[x,y+k*.2]],'#aabb92',null);line(x,y+k*.2,x+k,y-k*.15,'#74866b77');}
  if(o.stock){for(let i=0;i<Math.min(o.stock,5);i++){const x=p.x+Math.sin(i*2)*s*.25,y=p.y-s*.27+Math.cos(i*2)*s*.19,r=Math.max(2,s*.065);poly([[x-r,y],[x,y-r],[x+r,y],[x,y+r]],o.kind?.startsWith('seed_')?'#d0b47e':'#b66c59','#916a51');}}
}
const visualPlayers=new Map();
// Render between received positions with a short buffer; never alter authoritative game state.
function updateVisualPlayers(time){
  if(!state)return;const target=time-120;let left=motionFrames[0],right=left;
  for(const frame of motionFrames){if(frame.at<=target){left=frame;right=frame;}else{right=frame;break;}}
  const blend=left&&right&&right.at>left.at?Math.max(0,Math.min(1,(target-left.at)/(right.at-left.at))):1;
  const visible=new Set();
  for(const p of state.players){if(!p.online&&p.id!==me?.id)continue;visible.add(p.id);
    const a=left?.players.get(p.id)||p,b=right?.players.get(p.id)||a;
    const snap=a.spirit!==b.spirit||Math.hypot(b.x-a.x,b.y-a.y)>4;
    const x=snap?b.x:a.x+(b.x-a.x)*blend,y=snap?b.y:a.y+(b.y-a.y)*blend,old=visualPlayers.get(p.id);
    visualPlayers.set(p.id,{x,y,moving:!!old&&Math.hypot(x-old.x,y-old.y)>.0001});
  }
  for(const id of visualPlayers.keys())if(!visible.has(id))visualPlayers.delete(id);
}
function drawSpeechBubble(p,q,headY,s){const msg=[...(state?.chat||[])].reverse().find(m=>m.player===p.id&&state.now-m.at<6000);if(!msg)return;const words=msg.text.slice(0,110).split(/\s+/),lines=[];ctx.font='11px Arial';let row='';for(const word of words){const next=row?row+' '+word:word;if(ctx.measureText(next).width>153&&row){lines.push(row);row=word;}else row=next;}if(row)lines.push(row);const shown=lines.slice(0,3),w=Math.max(75,Math.min(178,...shown.map(l=>ctx.measureText(l).width+20))),h=shown.length*15+14,x=Math.max(7,Math.min(view.w-w-7,q.x-w/2)),y=Math.max(6,headY-s*.75-h);rounded(x,y,w,h,8,'#fffaf0','#c4bda9');poly([[q.x-6,y+h-1],[q.x+5,y+h-1],[q.x-2,y+h+8]],'#fffaf0','#c4bda9');ctx.fillStyle='#354337';ctx.textAlign='left';shown.forEach((v,i)=>ctx.fillText(v,x+10,y+17+i*15));}
function drawPlayer(p,time){const v=visualPlayers.get(p.id)||p,moving=v.moving;
const q=screen(v.x,v.y),s=view.s*.9;const bob=moving?Math.sin(time*.015)*s*.05:0;const body=colors[p.color];
  shadow(q.x,q.y+3,s*.48,s*.14);ctx.save();if(p.spirit)ctx.globalAlpha=.6;const headY=q.y-s*1.55+bob;
  if(p.spirit){ctx.beginPath();ctx.ellipse(q.x,q.y-s*.6,s*.4,s*.6,0,0,Math.PI*2);ctx.fillStyle='#d9e2db';ctx.fill();ctx.strokeStyle='#9caea0';ctx.stroke();}
  else{const step=moving?Math.sin(time*.018)*3:0;rounded(q.x-s*.26,q.y-s*.38,s*.19,s*.43+step,1,'#424b3f','#343f35');rounded(q.x+s*.07,q.y-s*.38,s*.19,s*.43-step,1,'#424b3f','#343f35');rounded(q.x-s*.38,q.y-s*.95+bob,s*.76,s*.62,1,body,'#3c4739');ctx.fillStyle='#ffffff18';ctx.fillRect(q.x-s*.3,q.y-s*.88+bob,s*.25,s*.45);line(q.x-s*.4,q.y-s*.9+bob,q.x-s*.4,q.y-s*.42+bob,'#3f493b',3);line(q.x+s*.4,q.y-s*.9+bob,q.x+s*.4,q.y-s*.42+bob,'#3f493b',3);}
  rounded(q.x-s*.32,headY,s*.64,s*.61,1,p.spirit?'#e4ece0':'#e8dab9','#374132');poly([[q.x-s*.32,headY],[q.x-s*.19,headY-s*.1],[q.x+s*.42,headY-s*.1],[q.x+s*.32,headY]],'#f5ecd5','#3e4837');poly([[q.x+s*.32,headY],[q.x+s*.42,headY-s*.1],[q.x+s*.42,headY+s*.5],[q.x+s*.32,headY+s*.61]],p.spirit?'#d8e4d6':'#ccbf9d','#3e4837');ctx.fillStyle='#364231';ctx.fillRect(q.x-s*.13,headY+s*.28,s*.065,s*.075);ctx.fillRect(q.x+s*.13,headY+s*.28,s*.065,s*.075);
  if(p.id===me?.id&&!p.spirit&&!heldResource()&&me.tools[me.equipped]){const toolX=q.x+s*.5,toolY=q.y-s*.66+((me.job&&me.job.kind==='mine')?Math.sin(time*.03)*s*.2:0);line(toolX,toolY,toolX+s*.23,toolY-s*.48,'#927f5e',3);line(toolX+s*.12,toolY-s*.42,toolX+s*.4,toolY-s*.32,'#6c7b69',5);}
  ctx.restore();ctx.textAlign='center';ctx.font='9px Paper, Arial';ctx.fillStyle=p.id===me?.id?'#5b6b4e':'#818d74';ctx.fillText(p.id===me?.id?`${p.name} · ты`:p.name,q.x,headY-s*.35);
  if(p.id===me?.id&&heldResource()){paperBox(q.x+s*.35,q.y-s*.65,s*.25,s*.25,s*.12,-s*.1,'#b8b09a','#938e7b','#ddd4bc');}
  if(p.id===me?.id){ctx.beginPath();ctx.ellipse(q.x,q.y+3,s*.53,s*.21,0,0,Math.PI*2);ctx.strokeStyle='#8ca46999';ctx.lineWidth=1.5;ctx.stroke();}drawSpeechBubble(p,q,headY,s);
}
function render(time){positionWindows();ctx.clearRect(0,0,view.w,view.h);ctx.fillStyle='#efebdf';ctx.fillRect(0,0,view.w,view.h);
  updateVisualPlayers(time);if(me){const hero=visualPlayers.get(me.id)||me;view.cx=hero.x;view.cy=hero.y;}
  if(state&&state.scene!=='city'){drawHome(time);requestAnimationFrame(render);return;}
  // Sparse paper grain; all world geometry below stays interactive and separate.
  ctx.fillStyle='#6b6f4b0a';for(let i=0;i<340;i++){const x=(i*137.23)%view.w,y=(i*211.71)%view.h;ctx.fillRect(x,y,1,1);}
  const c=state?.config||{width:48,height:32,river:{x:34,w:4}};
  groundRect({x:0,y:0,w:c.width,h:c.height},'#f3efdf88','#cbd0b230');
 if(state?.landscape?.tiles)for(const tile of state.landscape.tiles){const col=tile.kind==='paving'?'#d6c7a6':tile.kind==='grass'?'#b4c49f':'#d5c2aa';groundRect({x:tile.x,y:tile.y,w:1,h:1},col,'#a8aa93');if(tile.kind==='flowers'){const p=screen(tile.x+.5,tile.y+.5),r=Math.max(2,view.s*.11);for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]]){ctx.beginPath();ctx.arc(p.x+dx*r,p.y+dy*r,r*.7,0,7);ctx.fillStyle='#c68981';ctx.fill();}ctx.beginPath();ctx.arc(p.x,p.y,r*.45,0,7);ctx.fillStyle='#e8d5a8';ctx.fill();}}
  ctx.strokeStyle='#9ca27e12';ctx.lineWidth=.6;for(let x=0;x<=c.width;x+=2){const a=screen(x,0),b=screen(x,c.height);line(a.x,a.y,b.x,b.y,'#9ca27e12',.6);}for(let y=0;y<=c.height;y+=2){const a=screen(0,y),b=screen(c.width,y);line(a.x,a.y,b.x,b.y,'#9ca27e12',.6);}
  // No pre-painted footpaths: paving will be placed by players.
  groundRect({x:c.river.x,y:0,w:c.river.w,h:c.height},'#becdc8','#96ada256');
  for(const bank of [c.river.x,c.river.x+c.river.w]){const a=screen(bank,0),b=screen(bank,c.height);line(a.x,a.y,b.x,b.y,'#96ada256',2);}
  for(let i=0;i<20;i++){const p=screen(34.5+(i%3)*.95,.8+i*1.6);line(p.x,p.y,p.x+view.s*.7,p.y,'#e6ede352',1);}
  drawBridge();if(typeof window.__worldGround==='function')window.__worldGround();label('Другой берег',42,3,true);
  if(!state){for(const[x,y]of [[41,7],[44,10],[42,23],[45,26]])drawTree({x,y,stock:10});for(const[x,y]of [[42,16],[45,20]])drawStone({x,y,stock:10});}
  if(state?.expedition){const gate=state.config.expedition.gate;paperBoard(gate.x,gate.y,'Миссия · расчистка');}
  if(state)paperBoard(29,35,'⚔ Боевая зона');
  drawProject();if(typeof drawPlaza==='function')drawPlaza();
  if(state){for(const plot of state.plots)drawPlot(plot);}else for(const o of [{x:4,y:15,w:6,h:6},{x:4,y:23,w:6,h:6},{x:14,y:23,w:6,h:6}])drawPlot(o);
  drawForge();
  drawToolSign(24,3);drawHempBush(16.7,3.3);label('Благоустройство',16.7,1,true);label('Магазин инструмента',24,.3,true);
  if(state?.seedMarket){label(state.seedMarket.stage>=state.config.seedMarket.stages.length?'Семенная лавка':'Стройка лавки',23,4.9,true);}
  if(state?.gardenProject){const built=state.gardenProject.stage>=state.config.cityGarden.stages.length;groundRect({x:25.5,y:8.4,w:5.6,h:2.5},built?'#e0dfc6':'#eae5d7','#a7ad89',!built);label(built?'Городской огород':'Стройка огорода',28,8,true);if(built)for(const bed of state.publicGarden.beds){const x=26+(Number(bed.id.split('-').at(-1))%3)*1.6,y=9;groundRect({x,y,w:1.2,h:1},bed.crop?'#98a981':'#c4b49b','#8d956f');}}
  paperBoard(19,6,'Реестр городов');
  label('Городской склад',12,29,true);
  for(const pile of state?.drops||[]){const q=screen(pile.x,pile.y);rounded(q.x-8,q.y-5,16,9,2,pile.kind==='wood'?'#ae9673':pile.kind==='stone'?'#a3aaa0':'#b17b68','#818970');label(`${names[pile.kind]} · ${pile.quantity}`,pile.x,pile.y+.8,true);}
  const resources=state?.resources||[];
   // The extended world contributes its sprites to this SAME z-sort, never a second paint pass.
   const entities=[
      ...(typeof window.__worldEntities==='function'?window.__worldEntities():[]),
     {depth:4+4+4+3,draw:drawTent},
     {depth:22.7+1+2.6+2,draw:()=>paperHouse({x:22.7,y:1,w:2.6,h:2},'shop')},
     {depth:15.5+1.5+2.5+2.2,draw:()=>paperHouse({x:15.5,y:1.5,w:2.5,h:2.2},'garden-shop')},
     {depth:10.7+25+2.6+3,draw:()=>paperWarehouse({x:10.7,y:25,w:2.6,h:3})},
     ...(state?.seedMarket?[{depth:21.8+7.3,draw:()=>paperHouse({x:21.8,y:5.3,w:2.5,h:2},state.seedMarket.stage>=state.config.seedMarket.stages.length?'shop':'construction')}]:[]),
     ...resources.filter(o=>(o.stock>0||o.type==='food')&&!o.id.startsWith('forest-wood-')).map(o=>({depth:o.x+o.y+(o.rockSize?o.rockSize:0),draw:()=>o.type==='wood'?drawTree(o):o.type==='stone'?drawStone(o):drawFood(o)})),
     ...(state?.players||[]).filter(p=>(p.online||p.id===me?.id)&&sameScene(p)).map(p=>({depth:p.x+p.y,draw:()=>drawPlayer(p,time)}))
   ];entities.sort((a,b)=>a.depth-b.depth);for(const e of entities)e.draw();
  if(route.length){const p=screen(route.at(-1).x,route.at(-1).y);ctx.beginPath();ctx.ellipse(p.x,p.y,7,4,0,0,Math.PI*2);ctx.strokeStyle='#82956a99';ctx.lineWidth=1.4;ctx.stroke();}
  if(context){const p=screen(context.x,context.y);ctx.beginPath();ctx.ellipse(p.x,p.y+4,view.s*.7,view.s*.25,0,0,Math.PI*2);ctx.strokeStyle='#82956999';ctx.lineWidth=1.5;ctx.stroke();}
  if(me?.job){const left=Math.max(0,me.job.ends-(state.now+80)),duration=me.job.ends-me.job.started;$('actionProgress').style.width=`${Math.min(100,(1-left/duration)*100)}%`;}else $('actionProgress').style.width='0';
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

$('socialButton').onclick=()=>{if(me)openCityPanel('social');};

// Six local quick assignments belong to this resident and browser; inventory remains authoritative.
const itemEmoji={wood:'🪵',stone:'🪨',food:'🫐',seed_hemp:'🌰',seed_carrot:'🫘',hemp:'🌿',carrot:'🥕',water:'💧',axe:'🪓',pick:'⛏️'};
let quickOwner=null,quickSlots=['axe','pick','wood','stone','food',null],quickIndex=0,quickSignature='';
const quick=document.createElement('div');quick.id='quickbar';quick.className='quickbar';document.querySelector('.inventory').prepend(quick);
const place=document.createElement('button');place.id='placeQuick';place.textContent='Положить · Q';place.onclick=placeQuick;document.querySelector('.inventory .bag').prepend(place);
function saveQuick(){try{localStorage.setItem('dementor-quick-'+me.id,JSON.stringify({slots:quickSlots,index:quickIndex}));}catch{}quickSignature='';}
function assignQuick(index,value){const old=quickSlots.indexOf(value);if(old>=0)quickSlots[old]=quickSlots[index];quickSlots[index]=value;saveQuick();renderQuick();toast('Быстрая ячейка '+(index+1)+' настроена');}
function heldResource(){const k=quickSlots[quickIndex];return me&&state?.items[k]?k:null;}
function selectQuick(index){if(!me)return;quickIndex=index;saveQuick();const k=quickSlots[index],t=me.toolItems.find(t=>t.id===k);if(t)act('equipItem',t.id);else if(['axe','pick'].includes(k))act('equip',k);renderQuick();}
function placeQuick(){const k=heldResource();if(k&&me.bag[k])act('drop',null,{kind:k,quantity:1});else toast('Выбери ресурс в нижней панели');}
function renderQuick(){if(!me)return;if(quickOwner!==me.id){quickOwner=me.id;try{const saved=JSON.parse(localStorage.getItem('dementor-quick-'+me.id));if(saved&&Array.isArray(saved.slots)&&saved.slots.length===6){quickSlots=saved.slots.map(k=>typeof k==='string'?k:null);quickIndex=Number.isInteger(saved.index)&&saved.index>=0&&saved.index<6?saved.index:0;}}catch{}}
const signature=JSON.stringify([quickSlots,quickIndex,me.bag,me.toolItems,me.tools]);if(signature===quickSignature)return;quickSignature=signature;quick.replaceChildren();quickSlots.forEach((k,i)=>{const t=me.toolItems.find(t=>t.id===k),kind=t?.kind||k,b=document.createElement('button');b.className='quick-slot'+(i===quickIndex?' selected':'');b.title=(names[k]||toolNames[k]||toolNames[t?.kind]||'Пустая ячейка')+' · '+(i+1);b.setAttribute('aria-label',b.title);const n=document.createElement('kbd'),g=document.createElement('span'),count=document.createElement('small');n.textContent=i+1;g.textContent=itemEmoji[kind]||'·';count.textContent=t?t.durability+'/'+t.max:state.items[k]?me.bag[k]||0:['axe','pick'].includes(k)?me.tools[k]||0:'';b.append(n,g,count);b.onclick=()=>selectQuick(i);quick.append(b);});place.disabled=!heldResource()||!me.bag[heldResource()];}
function positionWindows(){if(!me)return;const dock=$('actionDock');dock.hidden=!context;const target=context&&(visualPlayers.get(context.id)||context);if(innerWidth<760){dock.style.left='';dock.style.top='';}else if(target){const q=screen(target.x,target.y);dock.style.left=Math.max(8,Math.min(innerWidth-Math.min(300,innerWidth-16)-8,q.x-140))+'px';dock.style.top=Math.max(70,Math.min(innerHeight-200,q.y-115))+'px';}
const panel=$('cityPanel');if(panel.open&&cityPanelMode==='resident'){const p=state.players.find(p=>p.id===selected);if(p){const q=screen(p.x,p.y),w=panel.offsetWidth;panel.style.left=Math.max(8,Math.min(innerWidth-w-8,q.x+35+w<innerWidth?q.x+35:q.x-w-35))+'px';panel.style.top=Math.max(70,Math.min(innerHeight-panel.offsetHeight-100,q.y-95))+'px';}}else {panel.style.left='';panel.style.top='';}}
canvas.addEventListener('contextmenu',e=>{e.preventDefault();placeQuick();});

// Sidebar preference is independent of game progress.
function setQuestCollapsed(collapsed){$('quest').classList.toggle('collapsed',collapsed);$('questToggle').setAttribute('aria-expanded',String(!collapsed));$('questChevron').textContent=collapsed?'▸':'▾';try{localStorage.setItem(innerWidth<760?'dementor-mobile-quest-collapsed':'dementor-quests-collapsed',String(collapsed));}catch{}}
$('questToggle').onclick=()=>setQuestCollapsed(!$('quest').classList.contains('collapsed'));
function setQuestFocused(f){$('quest').classList.toggle('focus',f);$('questViewToggle').textContent=f?'Показать все задания ▾':'Только текущее задание ▴';$('questViewToggle').setAttribute('aria-expanded',String(!f));try{localStorage.setItem('dementor-quest-focused',String(f));}catch{}}
$('questViewToggle').onclick=()=>setQuestFocused(!$('quest').classList.contains('focus'));
$('questDoneToggle').onclick=()=>{const el=$('questDoneList');el.hidden=!el.hidden;$('questDoneToggle').setAttribute('aria-expanded',String(!el.hidden));};
try{setQuestFocused(localStorage.getItem('dementor-quest-focused')!=='false');}catch{setQuestFocused(true);}
try{
  const mobile=matchMedia('(max-width:760px)').matches;
  const saved=localStorage.getItem(mobile?'dementor-mobile-quest-collapsed':'dementor-quests-collapsed');
  setQuestCollapsed(saved===null?mobile:saved==='true');
}catch{setQuestCollapsed(innerWidth<760);}
function placeThumbnail(t){
 const frame=document.createElement('span');frame.className='place-thumbnail';frame.setAttribute('aria-hidden','true');
 const stroke='#7f856c',roof='#c9b995',wall='#d7ceb3',side='#a69d80';let shape='';
 if(t.id==='jukebox')shape='<path d="M17 13L41 9L49 15V53L25 57L17 51Z" fill="#baa17f"/><path d="M17 13L41 9L49 15L25 19Z" fill="#dfcda9"/><path d="M23 22L39 19V31L23 34Z" fill="#5b7267"/><path d="M24 39L39 36M24 44L39 41M24 49L39 46" stroke-width="2"/>';
 else if(t.id==='monument')shape='<path d="M6 48L32 40L58 48L32 57Z" fill="#d9d6c3"/><path d="M21 24L35 19L45 25V45L31 50L21 44Z" fill="#bfbea8"/><path d="M21 24L35 19L45 25L31 30Z" fill="#eee8d2"/>';
 else if(t.type==='social')shape='<path d="M20 36L42 33V48L20 51Z" fill="#a87059"/><path d="M22 48V58M38 46V56" stroke-width="5"/><path d="M20 13L40 10L46 16V35L26 38L20 32Z" fill="#e7dbb9"/><path d="M27 25V28M36 23V26" stroke="#374132" stroke-width="2"/>';
 else if(t.id==='tools')shape='<path d="M9 13L45 7L57 14L20 21Z" fill="#d5c5a3"/><path d="M12 17V49M49 16V46" stroke-width="4"/><path d="M13 38L46 32L55 38L21 45Z" fill="#ad9a76"/><path d="M19 43V55M47 38V51" stroke-width="3"/>';
 else if(t.id==='well')shape='<path d="M12 31L39 22L53 30V48L26 56L12 48Z" fill="#b9aa88"/><path d="M17 31L38 25L47 30L26 37Z" fill="#8daea7"/>';
 else if(t.id==='garden'||t.id.includes('-bed-'))shape='<path d="M5 40L39 20L59 34L24 55Z" fill="#b7a083"/><path d="M21 40V24M36 35V16M46 30V12" stroke-width="2"/><path d="M21 32L12 24L21 27L28 18L25 30M36 26L29 18L36 20L43 13" fill="#91a779"/>';
 else if(t.id.includes('exit'))shape='<path d="M12 18L44 10V49L12 57Z" fill="#ccbea0"/><path d="M20 35L44 29M35 23L44 29L35 37" stroke-width="3"/>';
 else if(t.id==='chest')shape='<path d="M8 27L40 20L57 28V47L24 55L8 46Z" fill="#b29a75"/><path d="M8 27L40 20L57 28L24 36Z" fill="#d2bd96"/><path d="M31 35V46" stroke-width="4"/>';
 else if(t.id==='bed')shape='<path d="M7 31L40 16L59 32L25 49Z" fill="#eee6d2"/><path d="M7 31V42L25 56L59 40V32L25 49Z" fill="#c0b59b"/><path d="M32 22L41 19L51 27L42 31Z" fill="#faf3df"/>';
 else if(t.type==='plot')shape='<path d="M4 40L35 20L60 37L27 58Z" fill="#dce0c6" stroke-dasharray="4 2"/><path d="M21 43V13L42 17L21 23Z" fill="#a87059"/>';
 else if(t.id.includes('bridge')||t.type==='explore')shape='<path d="M7 38L43 29L58 36L21 46Z" fill="#c6ae85"/><path d="M10 27V43M23 30V47M44 19V36M56 23V40M10 27L44 19M23 30L56 23" fill="none" stroke-width="3"/><path d="M18 35L31 42M28 33L41 39M39 31L51 37" fill="none"/>';
 else if(t.type==='mission'||t.type==='board'||t.id.includes('board'))shape='<path d="M17 39V55M47 33V50" stroke-width="4"/><path d="M9 14L45 8L56 15L20 22Z" fill="#c5b48f"/><path d="M9 14L45 8V38L9 44Z" fill="#b2a380"/><path d="M45 8L56 15V44L45 38Z" fill="#92896e"/><path d="M16 22L25 20V32L16 34ZM29 19L38 17V29L29 31Z" fill="#eee7d2"/>';
 else if((t.type==='wood'||t.kind==='wood'))shape='<path d="M29 32V55H35V30" fill="#aa9774"/><path d="M9 24L20 7L39 5L56 23L48 39L24 44L8 34Z" fill="#9faa86"/><path d="M20 7L30 28L39 5M30 28L48 39" fill="none"/>';
 else if(t.type==='stone'||t.kind==='stone'||t.type==='pickup')shape='<path d="M8 44L15 24L31 13L48 25L56 45L30 51Z" fill="#a2aca0"/><path d="M15 24L31 13L34 39Z" fill="#c5c8bb"/><path d="M31 13L48 25L56 45L34 39Z" fill="#929e93"/>';
 else if((t.type==='food'||t.kind==='food'||t.kind?.startsWith('seed_')))shape='<path d="M8 37L13 22L28 17L37 21L50 19L58 36L46 47L19 47Z" fill="#91a17d"/><path d="M13 22L30 36L50 19" fill="#afba94"/><circle cx="24" cy="34" r="3" fill="#b46d58"/><circle cx="39" cy="31" r="3" fill="#b46d58"/><circle cx="45" cy="40" r="3" fill="#b46d58"/>';
 else if(t.type==='plot'||t.id==='mayor'||t.id==='tent')shape='<path d="M8 48L29 13L56 38L38 53Z" fill="#bcae8c"/><path d="M8 48L29 13L38 53Z" fill="#e5dbc0"/><path d="M18 48L28 31L31 50Z" fill="#65715b"/>';
 else if(t.id==='project'||t.id==='build'||t.id==='donation-box')shape='<path d="M9 28L39 22L54 30L24 37Z" fill="#716951"/><path d="M9 28L24 37V53L9 45Z" fill="#c6b58c"/><path d="M24 37L54 30V46L24 53Z" fill="#a89873"/><path d="M9 28L4 19L34 13L39 22Z" fill="#dacaa6"/>';
 else {shape='<path d="M12 27L36 18L53 27V48L29 56L12 47Z" fill="'+wall+'"/><path d="M36 18L53 27V48L36 41Z" fill="'+side+'"/><path d="M7 27L27 10L58 25L37 34Z" fill="'+roof+'"/><path d="M7 27L27 10L37 34Z" fill="#e0d4b4"/><path d="M21 36L30 39V54L21 51Z" fill="#66735d"/>';if(t.id.includes('forge')||t.type==='forge')shape+='<path d="M42 20V7L48 10V24" fill="#9c8c71"/><path d="M37 41L46 39V49L37 51Z" fill="#554f3e"/><path d="M39 48L42 42L44 47" fill="#bb8059"/>';else if(t.type==='warehouse')shape+='<path d="M5 46L15 43L23 47V55L12 58L5 54Z" fill="#b8a17b"/>';else if(t.type==='shop'||t.id==='tools')shape+='<path d="M16 30L38 37" fill="none" stroke-width="4"/>';}
 frame.innerHTML='<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="'+stroke+'" stroke-width="1.2" stroke-linejoin="round">'+shape+'</svg>';return frame;
}
