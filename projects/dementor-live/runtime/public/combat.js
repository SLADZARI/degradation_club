// 2D PvE screen for the existing Dementor Live CharacterId. Public game world remains unchanged.
const $ = id => document.getElementById(id);
const canvas = $('field'), ctx = canvas.getContext('2d');
const token = sessionStorage.getItem('dementor-token');
const keys = new Set();
let data=null, battle=null, self=null, me=null, scale=23, vw=0, vh=0, mouseAim={x:1,y:0};
let moveStick={x:0,y:0}, aimStick=null, firing=false, fetching=false, inputPending=false, firePending=false, lastShotTime=0, msgTimer=null;
const shotEffects=[], visualPositions=new Map();
let camera=null, lastRender=0, fpsFrames=0, fpsSince=0;
const combatQa={fps:0,shots:0,hits:0,tracesRendered:0,lastShot:null,lastLatencyMs:0,hitFeedbackCount:0};
window.__combatQa=combatQa;
function screenStickToWorld(v){
  // Isometric screen right/up must correspond to what the player sees, not raw world x/y.
  const x=v.x+v.y*2, y=v.y*2-v.x, length=Math.hypot(x,y);
  return length>.001?{x:x/length,y:y/length}:{x:0,y:0};
}
function acceptShot(r,startedAt){
  combatQa.lastLatencyMs=performance.now()-startedAt;
  if(!r?.shot)return;
  const effect={...r.shot,hit:!!r.hit,at:performance.now(),duration:280};
  shotEffects.push(effect);
  combatQa.lastShot=effect;combatQa.shots++;
  if(r.hit){combatQa.hits++;combatQa.hitFeedbackCount++;combatQa.lastHitShot=effect;}
  if(shotEffects.length>12)shotEffects.shift();
  $('shotFeedback').textContent=r.hit?'ПОПАДАНИЕ −'+(r.shot.damage||0):r.shot.blocked?'ПРЕПЯТСТВИЕ':'ПРОМАХ';
  $('shotFeedback').dataset.kind=r.hit?'hit':r.shot.blocked?'blocked':'miss';
  $('shotFeedback').classList.add('active');
  clearTimeout(acceptShot.timeout);
  acceptShot.timeout=setTimeout(()=>$('shotFeedback').classList.remove('active'),350);
}
if(!token)location.replace('/');
function notify(txt){const el=$('message');el.textContent=String(txt);el.classList.add('visible');clearTimeout(msgTimer);msgTimer=setTimeout(()=>el.classList.remove('visible'),2600);}
const id=()=>crypto.randomUUID();
async function api(path,payload){
  const res=await fetch('/api/combat/'+path,{method:payload?'POST':'GET',headers:{...(token?{Authorization:'Bearer '+token}:{}),'Content-Type':'application/json'},
    ...(payload?{body:JSON.stringify({requestId:id(),...payload})}:{})});
  const o=await res.json();if(res.status===401)location.replace('/');
  if(!res.ok||o.ok===false)throw Error(o.message||'Ошибка игрового сервера');return o;
}
async function act(type,more={}){
  try{const r=await api('action',{type,...more});if(type==='create'||type==='join'||type==='start')await load();
    if(type==='extract'||type==='retreat'){notify(type==='extract'?'Экспедиция завершена!':'Вы отступили. Сохранённые расходы остаются.');await load();}
    return r;
  }catch(e){notify(e.message);return null;}
}
async function load(){
  if(fetching)return;
  fetching=true;
  try{
    const s=await api('state');
    data=s;battle=s.battle;self=battle?.members?.[s.me]||null;me=s.me;
    const live=!!(battle&&battle.status!=='CLOSED');
    $('play').hidden=!live;$('lobby').hidden=live;
    if(live&&!camera&&self)camera={x:self.x,y:self.y};
    $('connection').textContent='● В сети';
    if(!live){$('inventory').textContent=(s.profile?'Автомат '+s.profile.weapon.damage+' ур. · патроны '+s.profile.ammo:'Стартовое оружие появится при создании отряда')+
      ' · еда '+s.food+' · PAPER '+s.wallet+' · у продавца '+s.ammoShop.ammo+' патронов.';
      if(battle?.status==='CLOSED')$('inventory').textContent+=' Предыдущая экспедиция завершена.';
    }else{
      let stage=battle.stage;
      $('objective').textContent=battle.status==='LOBBY'?'Сбор отряда · стартует командир':
        battle.status==='EXTRACT_READY'?'Победа · дойди до выхода (14,14) и нажми E':
        stage===1?'Этап 1/3 · прорыв к ретранслятору':
        stage===2?(battle.objectiveReady?'Этап 2/3 · активируй ретранслятор (9,8)':'Этап 2/3 · очисти территорию'):'Этап 3/3 · эвакуация';
      $('ammo').textContent='Патроны: '+s.profile?.ammo;
      $('health').textContent='HP: '+Math.ceil(self?.hp||0)+(self?.status==='DOWNED'?' · РАНЕН':'');
      $('food').textContent='Еда: '+s.food;
      $('start').hidden=battle.status!=='LOBBY'||battle.ownerId!==s.me;
      $('interact').disabled=battle.status==='LOBBY';
      $('revive').disabled=battle.status==='LOBBY';
      $('retreat').disabled=battle.status==='CLOSED';
    }
  }catch(e){$('connection').textContent='● Нет связи';notify(e.message);}
  finally{fetching=false;}
}
async function loadLobbies(){
  if(!$('play').hidden)return;
  try{const o=await api('lobbies'),l=$('lobbies');l.replaceChildren();
    if(!o.lobbies.length){const text=document.createElement('p');text.textContent='Пока никто не собирает отряд.';l.append(text);}
    for(const s of o.lobbies){const b=document.createElement('button');b.textContent='Присоединиться: '+s.owner+' · '+s.participants+'/2';
      b.onclick=()=>act('join',{sessionId:s.id});l.append(b);}
  }catch{}
}
$('create').onclick=()=>act('create');
$('buyAmmo').onclick=()=>act('buyAmmo').then(load);
$('start').onclick=()=>act('start');
$('retreat').onclick=()=>{if(confirm('Отступить всей командой? Подтверждённые расходы сохранятся.'))act('retreat');};
function nearestDowned(){
  if(!battle||!self)return null;
  return Object.values(battle.members).find(p=>p.id!==me&&p.status==='DOWNED'&&Math.hypot(self.x-p.x,self.y-p.y)<1.25);
}
$('revive').onclick=()=>{const t=nearestDowned();if(t)act('feed',{target:t.id});else notify('Подойди к раненому товарищу (расстояние ≤1,25).');};
$('selfFeed').onclick=()=>act('selfFeed');
function tryInteract(){
  if(!battle||battle.status==='LOBBY')return;
  if(battle.status==='EXTRACT_READY'){act('extract');return;}
  if(battle.stage===2&&battle.objectiveReady){act('activate');return;}
  const nearby=Object.values(battle.loot||{}).find(p=>!p.claimedBy&&Math.hypot(p.x-self.x,p.y-self.y)<1.3);
  if(nearby){act('pickup',{target:nearby.id});return;}
  notify('Подойди к добыче или к отмеченной цели.');
}
$('interact').onclick=tryInteract;
$('melee').onclick=()=>{if(self)act('melee',{dx:mouseAim.x,dy:mouseAim.y});};
$('dash').onclick=()=>dash();
function dash(){
  if(!self)return;
  const x=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft'));
  const y=Number(keys.has('KeyS')||keys.has('ArrowDown'))-Number(keys.has('KeyW')||keys.has('ArrowUp'));
  const v=Math.hypot(x+moveStick.x,y+moveStick.y)>0.2?{x:x+moveStick.x,y:y+moveStick.y}:mouseAim;
  act('dash',{dx:v.x,dy:v.y});
}
addEventListener('keydown',e=>{
 if(e.target.tagName==='BUTTON')e.target.blur();
 if(['Space','ArrowUp','ArrowDown','ArrowRight','ArrowLeft'].includes(e.code))e.preventDefault();
 keys.add(e.code);if(e.repeat)return;
 if(e.code==='KeyE')tryInteract();
 if(e.code==='KeyF')$('revive').click();
 if(e.code==='KeyH')$('selfFeed').click();
 if(e.code==='KeyQ')$('melee').click();
 if(e.code==='Space')dash();
});
addEventListener('keyup',e=>keys.delete(e.code));
addEventListener('blur',()=>{keys.clear();moveStick={x:0,y:0};aimStick=null;firing=false;});
function aimDirection(x,y){if(!self)return mouseAim;const p=project(self.x,self.y);const dx=(x-p.x)/scale,dy=(y-p.y)/(scale*.5);
  const wx=(dx+dy)/2,wy=(dy-dx)/2,n=Math.hypot(wx,wy);
  if(n>.05)mouseAim={x:wx/n,y:wy/n};return mouseAim;
}
canvas.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')aimDirection(e.offsetX,e.offsetY);});
canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;if(e.button===0){aimDirection(e.offsetX,e.offsetY);firing=true;canvas.focus();}});
addEventListener('pointerup',()=>{firing=false;});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
function pad(el,cb){
 const dot=el.querySelector('i');let active=null;
 function sample(e){const r=el.getBoundingClientRect(),x=(e.clientX-(r.left+r.width/2))/(r.width*.37),y=(e.clientY-(r.top+r.height/2))/(r.height*.37);
 const length=Math.max(1,Math.hypot(x,y)),v={x:x/length,y:y/length};
 dot.style.transform='translate('+(v.x*27)+'px,'+(v.y*27)+'px)';cb(v,true);}
 el.addEventListener('pointerdown',e=>{active=e.pointerId;try{el.setPointerCapture(active);}catch{}sample(e);e.preventDefault();});
 el.addEventListener('pointermove',e=>{if(e.pointerId===active)sample(e);});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(name,e=>{if(e.pointerId!==active)return;active=null;dot.style.transform='';cb({x:0,y:0},false);});
}
pad($('movePad'),(v,on)=>{moveStick=on?screenStickToWorld(v):{x:0,y:0};});
pad($('aimPad'),(v,on)=>{aimStick=on?v:null;if(on&&Math.hypot(v.x,v.y)>.2){mouseAim=screenStickToWorld(v);firing=true;}else firing=false;});
setInterval(async()=>{
 if(!battle||battle.status!=='ACTIVE'||!self||self.status!=='ACTIVE')return;
 const dx=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft'))+moveStick.x;
 const dy=Number(keys.has('KeyS')||keys.has('ArrowDown'))-Number(keys.has('KeyW')||keys.has('ArrowUp'))+moveStick.y;
 if(!inputPending){inputPending=true;api('action',{type:'input',dx,dy}).catch(()=>{}).finally(()=>{inputPending=false;});}
 if(firing&&!firePending&&(data?.profile?.ammo||0)>0&&performance.now()-lastShotTime>=430){
  lastShotTime=performance.now();firePending=true;const startedAt=performance.now();
  api('action',{type:'fire',dx:mouseAim.x,dy:mouseAim.y}).then(r=>acceptShot(r,startedAt))
    .catch(e=>{if(!/cooling down/.test(e.message))notify(e.message);}).finally(()=>{firePending=false;});
 }
},125);
function resize(){const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);vw=rect.width;vh=rect.height;
 const nextW=Math.round(vw*dpr),nextH=Math.round(vh*dpr);
 if(canvas.width!==nextW||canvas.height!==nextH){canvas.width=nextW;canvas.height=nextH;ctx.setTransform(dpr,0,0,dpr,0,0);}
 scale=Math.max(16,Math.min(34,Math.min(vw/27,vh/13)*1.35));
}
const project=(x,y)=>{const mep=camera||self||{x:8,y:8};return {x:vw/2+(x-y-(mep.x-mep.y))*scale,y:vh/2+(x+y-mep.x-mep.y)*scale*.5};};
function poly(pts,fill,stroke){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.2;ctx.stroke();}}
function diamond(x,y,r,fill){const p=project(x,y);poly([{x:p.x,y:p.y-r/2},{x:p.x+r,y:p.y},{x:p.x,y:p.y+r/2},{x:p.x-r,y:p.y}],fill,'#58644c55');}
function label(text,x,y){const p=project(x,y);ctx.fillStyle='#43523e';ctx.font='600 11px system-ui';ctx.textAlign='center';ctx.fillText(text,p.x,p.y);}
function actor(p,kind,isMe=false){
 const stableKey=p.id||kind+':'+p.x+':'+p.y;
 const current=visualPositions.get(stableKey)||{x:p.x,y:p.y};
 const alpha=Math.min(1,Math.max(.06,1-Math.exp(-Math.max(1,performance.now()-lastRender)/100)));
 current.x+=(p.x-current.x)*alpha;current.y+=(p.y-current.y)*alpha;
 visualPositions.set(stableKey,current);
 const q=project(current.x,current.y),enemy=kind!=='player',color=enemy?(kind==='CHASER'?'#ad6856':kind==='RANGED'?'#8f6659':'#704e54'):(isMe?'#6a866d':'#718e97');
 ctx.beginPath();ctx.ellipse(q.x,q.y+4,scale*.43,scale*.15,0,0,Math.PI*2);ctx.fillStyle='#34423433';ctx.fill();
 ctx.fillStyle='#464d41';ctx.fillRect(q.x-7,q.y-13,5,14);ctx.fillRect(q.x+2,q.y-13,5,14);
 ctx.fillStyle=color;ctx.strokeStyle='#333e32';ctx.lineWidth=1.4;ctx.fillRect(q.x-10,q.y-35,20,23);ctx.strokeRect(q.x-10,q.y-35,20,23);
 ctx.fillStyle=enemy?'#bdad96':'#e1d3b2';ctx.fillRect(q.x-8,q.y-49,16,14);ctx.strokeRect(q.x-8,q.y-49,16,14);
 ctx.fillStyle='#303b31';ctx.fillRect(q.x-5,q.y-43,3,2);ctx.fillRect(q.x+3,q.y-43,3,2);
 if(kind==='player'&&p.status==='DOWNED'){ctx.fillStyle='#ae544c';ctx.fillRect(q.x-16,q.y-60,32,5);}
 if(enemy){ctx.fillStyle='#382e2a';ctx.fillRect(q.x-16,q.y-59,32,4);ctx.fillStyle='#a55953';ctx.fillRect(q.x-16,q.y-59,32*Math.max(0,p.hp)/(kind==='GUARD'?45:kind==='RANGED'?20:24),4);}
 if(!enemy){ctx.fillStyle=isMe?'#4b664d':'#52636a';ctx.fillRect(q.x-15,q.y-57,30*Math.max(0,p.hp)/100,3);}
}
function draw(timestamp=performance.now()){
 const delta=lastRender?Math.min(timestamp-lastRender,100):16;
 if(!fpsSince)fpsSince=timestamp;fpsFrames++;
 if(timestamp-fpsSince>1000){combatQa.fps=Math.round(fpsFrames*1000/(timestamp-fpsSince));fpsSince=timestamp;fpsFrames=0;}
 if(self){
   if(!camera)camera={x:self.x,y:self.y};
   const a=1-Math.exp(-delta/115);
   camera.x+=(self.x-camera.x)*a;camera.y+=(self.y-camera.y)*a;
 }
 lastRender=timestamp;
 ctx.clearRect(0,0,vw,vh);ctx.fillStyle='#ece7d9';ctx.fillRect(0,0,vw,vh);
 if(battle&&self){
  for(let x=0;x<=16;x++){const a=project(x,0),b=project(x,16);ctx.strokeStyle='#83927726';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  for(let y=0;y<=16;y++){const a=project(0,y),b=project(16,y);ctx.strokeStyle='#83927726';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  diamond(8,8,scale*.7,'#b3bc9c');
  for(const w of battle.walls||[]){const p1=project(w.x,w.y),p2=project(w.x+w.w,w.y),p3=project(w.x+w.w,w.y+w.h),p4=project(w.x,w.y+w.h);
    poly([p1,p2,p3,p4],'#9d9f90','#747c6d');}
  diamond(9,8,scale*.75,battle.stage===2?'#c5b37d':'#ddd8c6');
  label('Ретранслятор',9,7.5);
  diamond(14,14,scale*.9,battle.status==='EXTRACT_READY'?'#84a98a':'#c4c9a6');
  label('Выход',14,13.4);
  for(const item of Object.values(battle.loot||{}))if(!item.claimedBy){diamond(item.x,item.y,scale*.6,'#e0b267');label('Патроны',item.x,item.y-.7);}
  for(const e of battle.enemies)if(e.alive)actor(e,e.type);
  for(const p of Object.values(battle.members))actor(p,'player',p.id===me);
  // Reticle is always visible while combat is active. Direction matches the server aim vector.
  if(self.status==='ACTIVE'){
    const aimEnd={x:self.x+mouseAim.x*3,y:self.y+mouseAim.y*3},q=project(aimEnd.x,aimEnd.y);
    ctx.save();ctx.strokeStyle='#275b38';ctx.lineWidth=2;ctx.beginPath();
    ctx.arc(q.x,q.y,11,0,Math.PI*2);ctx.moveTo(q.x-18,q.y);ctx.lineTo(q.x-6,q.y);
    ctx.moveTo(q.x+6,q.y);ctx.lineTo(q.x+18,q.y);ctx.moveTo(q.x,q.y-18);ctx.lineTo(q.x,q.y-6);
    ctx.moveTo(q.x,q.y+6);ctx.lineTo(q.x,q.y+18);ctx.stroke();ctx.restore();
    combatQa.reticleVisible=true;
  }
  const now=performance.now();
  for(let i=shotEffects.length-1;i>=0;i--){
    const e=shotEffects[i],age=now-e.at;
    if(age>e.duration){shotEffects.splice(i,1);continue;}
    const from=project(e.from.x,e.from.y),to=project(e.to.x,e.to.y),t=Math.min(1,age/170);
    const head={x:from.x+(to.x-from.x)*t,y:from.y+(to.y-from.y)*t};
    ctx.save();ctx.globalAlpha=Math.max(.2,1-age/e.duration);
    ctx.strokeStyle=e.hit?'#e98f2d':e.blocked?'#b98252':'#ead067';ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(from.x,from.y-19);ctx.lineTo(head.x,head.y-19);ctx.stroke();
    ctx.fillStyle=e.hit?'#ff7433':'#fff2a3';ctx.beginPath();ctx.arc(head.x,head.y-19,4,0,Math.PI*2);ctx.fill();
    if(e.hit){ctx.strokeStyle='#df513b';ctx.lineWidth=3;ctx.beginPath();ctx.arc(to.x,to.y-25,10+age/35,0,Math.PI*2);ctx.stroke();}
    ctx.restore();combatQa.tracesRendered++;
  }
 }
 requestAnimationFrame(draw);
}
addEventListener('resize',resize);
new ResizeObserver(resize).observe(canvas);
load();loadLobbies();
setInterval(load,160);setInterval(loadLobbies,1300);
requestAnimationFrame(draw);
