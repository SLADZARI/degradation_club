// COMBAT-01 P0 — isolated authoritative gameplay model.
// NOT wired to public HTTP routes or the production save. Uses existing player IDs.
import { randomUUID, randomInt } from 'node:crypto';

export const COMBAT_P0 = Object.freeze({
  maxPlayers: 2, maxHp: 100, downedMs: 30_000, feedMs: 2_000,
  reviveProtectionMs: 3_000, dashCooldownMs: 2_000, dashDistance: 1.6,
  shotCooldownMs: 320, shotRange: 9, enemyAttackMs: 1_500,
  worldSize: 16, moveSpeed: 2.9, lootPerStage: 3, stages: 3,
});
export const COMBAT_WEAPONS=Object.freeze({rifle:{label:'Автомат',magazine:12,cooldown:260,reloadMs:1300},pistol:{label:'Пистолет',magazine:8,cooldown:620,reloadMs:1050,damage:8}});
const WALLS = Object.freeze([{x:6,y:4,w:2,h:5},{x:4,y:11,w:4,h:1}]);
const ENCOUNTERS = [
  [{type:'CHASER',x:11,y:2,hp:24}],
  [{type:'CHASER',x:12,y:4,hp:24},{type:'RANGED',x:12,y:11,hp:20}],
  [{type:'GUARD',x:13,y:13,hp:45}],
];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const hypot=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const clampToWorld=n=>clamp(n,.45,COMBAT_P0.worldSize-.45);
const intersectRect=(ax,ay,bx,by,r)=>{
  let lo=0,hi=1;for(const [a,b,min,max] of [[ax,bx,r.x,r.x+r.w],[ay,by,r.y,r.y+r.h]]){
    const d=b-a;if(Math.abs(d)<1e-8){if(a<min||a>max)return false;continue;}
    const t1=(min-a)/d,t2=(max-a)/d;lo=Math.max(lo,Math.min(t1,t2));hi=Math.min(hi,Math.max(t1,t2));
    if(lo>hi)return false;
  }return true;
};
export const lineClear=(a,b)=>!WALLS.some(w=>intersectRect(a.x,a.y,b.x,b.y,w));
export const walkable=(x,y)=>finite(x)&&finite(y)&&x>=.45&&y>=.45&&x<=15.55&&y<=15.55&&!WALLS.some(w=>x>w.x-.3&&x<w.x+w.w+.3&&y>w.y-.3&&y<w.y+w.h+.3);
function moveBody(body,dx,dy,step){
  const tx=clampToWorld(body.x+dx*step),ty=clampToWorld(body.y+dy*step);
  if(walkable(tx,body.y))body.x=tx;
  if(walkable(body.x,ty))body.y=ty;
}
// 1-unit walkable grid for the small P0 combat map. Prevents chasing a player through a solid wall.
function nextWaypoint(start,target){
  const point=p=>({x:Math.max(1,Math.min(15,Math.round(p.x))),y:Math.max(1,Math.min(15,Math.round(p.y)))});
  const a=point(start),goal=point(target),key=p=>p.x+','+p.y;
  const queue=[a],parents=new Map([[key(a),null]]);
  let best=a,bestDistance=hypot(a,target);
  for(let i=0;i<queue.length;i++){
    const cur=queue[i],dist=hypot(cur,target);
    if(dist<bestDistance){best=cur;bestDistance=dist;}
    if(cur.x===goal.x&&cur.y===goal.y){best=cur;break;}
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const p={x:cur.x+dx,y:cur.y+dy},k=key(p);
      if(!parents.has(k)&&walkable(p.x,p.y)){parents.set(k,cur);queue.push(p);}
    }
  }
  let next=best,parent=parents.get(key(next));
  if(next===a)return target;
  while(parent&&key(parent)!==key(a)){next=parent;parent=parents.get(key(next));}
  return next;
}
function profile(p){
  if(!p||!p.id)throw Error('Unknown character');
  if(!p.combatP0){p.combatP0={weapon:{id:randomUUID(),kind:'starter-rifle',damage:9+randomInt(3),tier:1},ammo:24,receivedStarter:true};}
  const v=p.combatP0;v.selectedWeapon||='rifle';if(!Object.hasOwn(COMBAT_WEAPONS,v.selectedWeapon))v.selectedWeapon='rifle';if(!Number.isSafeInteger(v.magazine))v.magazine=Math.min(v.ammo,COMBAT_WEAPONS[v.selectedWeapon].magazine);v.magazine=Math.max(0,Math.min(v.magazine,v.ammo,COMBAT_WEAPONS[v.selectedWeapon].magazine));v.reloadEndsAt||=0;return v;
}
export function combatRoot(world){
  if(!world||typeof world!=='object')throw Error('World state required');
  world.combatP0 ||= {sessions:{},firstWins:{}};
  return world.combatP0;
}
function person(session,id){const p=session.members[id];if(!p)throw Error('Not a combat participant');return p;}
function encounter(session){
  session.enemies=ENCOUNTERS[session.stage-1].map((e,i)=>({...e,id:session.id+':s'+session.stage+':r'+session.attempt+':'+i,alive:true,lastAttack:session.lastTick}));
}
function awardLoot(session,e){
  const key=String(session.stage);
  if(session.issuedStages[key])return;
  session.issuedStages[key]=true;
  const id=session.id+':loot:'+key;
  session.loot[id]={id,origin:e.id,kind:'ammo',quantity:COMBAT_P0.lootPerStage,x:e.x,y:e.y,claimedBy:null};
}
function newMember(id){return {id,x:2,y:2,hp:100,status:'ACTIVE',downedDeadline:0,invulnerableUntil:0,
  aim:{x:1,y:0},input:{x:0,y:0},inputAt:0,nextShotAt:0,nextDashAt:0,feed:null,selfFeed:null};}
export function createCombat(world,players,ownerId,now=Date.now()){
  if(!finite(now))throw Error('Server time required');
  const p=players[ownerId];profile(p);const root=combatRoot(world);
  if(Object.values(root.sessions).some(s=>s.status!=='CLOSED'&&ownerId in s.members))throw Error('Already in combat');
  const id=randomUUID();root.sessions[id]={id,ownerId,status:'LOBBY',members:{[ownerId]:newMember(ownerId)},
    stage:0,attempt:0,enemies:[],loot:{},issuedStages:{},lastTick:now,completedAt:null,commands:{},objectiveReady:false};
  return id;
}
export function joinCombat(world,players,sessionId,playerId){
  const s=combatRoot(world).sessions[sessionId];if(!s||s.status!=='LOBBY')throw Error('Combat is closed to joining');
  if(playerId in s.members)return;
  if(Object.keys(s.members).length>=COMBAT_P0.maxPlayers)throw Error('Squad is full');
  if(Object.values(combatRoot(world).sessions).some(other=>other.status!=='CLOSED'&&playerId in other.members))throw Error('Already in combat');
  profile(players[playerId]);s.members[playerId]=newMember(playerId);
}
function down(s,p,now){
  if(p.status!=='ACTIVE'||now<p.invulnerableUntil)return;
  p.hp=0;p.status='DOWNED';p.downedDeadline=now+COMBAT_P0.downedMs;p.input={x:0,y:0};p.feed=null;p.selfFeed=null;
  for(const other of Object.values(s.members))if(other.feed?.target===p.id)other.feed=null;
}
function checkpoint(stage){return stage===3?{x:9,y:9}:stage===2?{x:9,y:3}:{x:2,y:2};}
function wipe(s,now){
  s.attempt++;s.objectiveReady=false;encounter(s);
  for(const m of Object.values(s.members)){
    m.status='ACTIVE';m.hp=100;m.downedDeadline=0;m.feed=null;m.selfFeed=null;Object.assign(m,checkpoint(s.stage));
    m.invulnerableUntil=now+COMBAT_P0.reviveProtectionMs;m.input={x:0,y:0};m.inputAt=now;
  }
}
function damage(s,p,hp,now){if(p.status!=='ACTIVE'||now<p.invulnerableUntil)return; p.feed=null;p.selfFeed=null;p.hp=Math.max(0,p.hp-hp);if(p.hp===0)down(s,p,now);}
function advanceStage(s,now){
  if(s.enemies.some(e=>e.alive))return;
  if(s.stage===2){s.objectiveReady=true;return;} // Retранслятор нужно включить вручную.
  if(s.stage<COMBAT_P0.stages){s.stage++;s.attempt=0;s.objectiveReady=false;encounter(s);}
  else{s.status='EXTRACT_READY';s.completedAt=now;}
}
export function advanceCombat(world,sessionId,now){
  const s=combatRoot(world).sessions[sessionId];if(!s)throw Error('Combat missing');
  if(!finite(now)||now<s.lastTick)throw Error('Nonmonotonic server clock');
  const dt=Math.min((now-s.lastTick)/1000,.25);s.lastTick=now;
  if(s.status!=='ACTIVE')return;
  if(Object.values(s.members).every(m=>m.status!=='ACTIVE')){wipe(s,now);return;}
  for(const m of Object.values(s.members)){
    if(m.status==='DOWNED'){
      if(now>=m.downedDeadline){
        // A single member returns at checkpoint while survivors continue the encounter.
        m.status='ACTIVE';m.hp=30;m.feed=null;m.selfFeed=null;Object.assign(m,checkpoint(s.stage));
        m.invulnerableUntil=now+COMBAT_P0.reviveProtectionMs;m.input={x:0,y:0};m.inputAt=now;
      }
      continue;
    }
    if(m.status!=='ACTIVE')continue;
    const profileState=profile(world.players[m.id]);if(profileState.reloadEndsAt&&now>=profileState.reloadEndsAt){profileState.magazine=Math.min(profileState.ammo,COMBAT_WEAPONS[profileState.selectedWeapon].magazine);profileState.reloadEndsAt=0;}if(!profileState.magazine&&profileState.ammo>0&&!profileState.reloadEndsAt)profileState.reloadEndsAt=now+COMBAT_WEAPONS[profileState.selectedWeapon].reloadMs;const oldX=m.x,oldY=m.y;
    if(now-m.inputAt<400)moveBody(m,m.input.x,m.input.y,COMBAT_P0.moveSpeed*dt);
    if(hypot(m,{x:oldX,y:oldY})>.025){m.feed=null;m.selfFeed=null;}
    if(m.feed){
      const t=s.members[m.feed.target];
      if(!t||t.status!=='DOWNED'||hypot(m,t)>1.25||now>t.downedDeadline){m.feed=null;continue;}
      if(now>=m.feed.completeAt){
        const bag=world.players?.[m.id]?.bag,kind=(bag?.food||0)>0?'food':(bag?.carrot||0)>0?'carrot':null;
        if(kind){bag[kind]--;t.hp=kind==='carrot'?60:40;t.status='ACTIVE';t.downedDeadline=0;t.invulnerableUntil=now+COMBAT_P0.reviveProtectionMs;}
        m.feed=null;
      }
    }
    if(m.selfFeed&&now>=m.selfFeed.completeAt){
      const bag=world.players?.[m.id]?.bag,kind=(bag?.food||0)>0?'food':(bag?.carrot||0)>0?'carrot':null;
      if(kind){bag[kind]--;m.hp=Math.min(100,m.hp+(kind==='carrot'?40:15));}
      m.selfFeed=null;
    }
    if(s.stage===2&&s.objectiveReady&&m.hp<30)m.hp=Math.min(30,m.hp+dt*2);
  }
  for(const e of s.enemies.filter(x=>x.alive)){
    const active=Object.values(s.members).filter(m=>m.status==='ACTIVE');if(!active.length)break;
    const target=active.reduce((a,b)=>hypot(e,a)<hypot(e,b)?a:b);
    if(e.type!=='GUARD'){
      const dist=hypot(e,target),desired=e.type==='RANGED'?4:1.1;
      if(dist>desired){
        const waypoint=lineClear(e,target)?target:nextWaypoint(e,target);
        const d=Math.max(.001,hypot(e,waypoint));
        moveBody(e,(waypoint.x-e.x)/d,(waypoint.y-e.y)/d,(e.type==='CHASER'?1.25:.8)*dt);
      }
    }
    const range=e.type==='RANGED'?7:e.type==='GUARD'?2.6:1.35;
    if(now-e.lastAttack>=COMBAT_P0.enemyAttackMs&&hypot(e,target)<=range&&lineClear(e,target)){
      e.lastAttack=now;damage(s,target,e.type==='GUARD'?24:12,now);
    }
  }
  if(Object.values(s.members).every(m=>m.status!=='ACTIVE'))wipe(s,now);
}
function command(s,world,players,actorId,cmd,now){
  const actor=person(s,actorId);if(!finite(now))throw Error('Server time required');
  if(cmd.type==='start'){
    if(s.status!=='LOBBY'||actorId!==s.ownerId)throw Error('Cannot start');
    s.status='ACTIVE';s.stage=1;s.attempt=0;s.lastTick=now;encounter(s);return {stage:1};
  }
  if(cmd.type==='extract'){
    if(s.status!=='EXTRACT_READY'||actor.status!=='ACTIVE')throw Error('Objectives incomplete');
    if(hypot(actor,{x:14,y:14})>2.0)throw Error('Go to extraction point');
    s.status='CLOSED';s.completedAt=now;
    for(const memberId of Object.keys(s.members))combatRoot(world).firstWins[memberId] ||= now;
    return {completed:true,firstWinAt:combatRoot(world).firstWins[s.ownerId]};
  }
  if(cmd.type==='retreat'){
    if(s.status==='CLOSED')throw Error('Already closed');
    s.status='CLOSED';s.completedAt=now;return {retreated:true};
  }
  if(s.status!=='ACTIVE'||actor.status!=='ACTIVE')throw Error('Actor is not active');
  if(cmd.type==='activate'){
    if(s.stage!==2||!s.objectiveReady)throw Error('Clear enemies first');
    if(hypot(actor,{x:9,y:8})>1.7)throw Error('Approach the repeater');
    s.stage=3;s.attempt=0;s.objectiveReady=false;encounter(s);return {stage:3};
  }
  if(cmd.type==='input'){
    if(!finite(cmd.dx)||!finite(cmd.dy))throw Error('Invalid movement');
    const d=Math.hypot(cmd.dx,cmd.dy);actor.input={x:d?cmd.dx/Math.max(1,d):0,y:d?cmd.dy/Math.max(1,d):0};actor.inputAt=now;
    if(d>.01){actor.feed=null;actor.selfFeed=null;}
    return {accepted:true};
  }
  if(cmd.type==='dash'){
    if(now<actor.nextDashAt)throw Error('Dash cooling down');
    if(!finite(cmd.dx)||!finite(cmd.dy)||Math.hypot(cmd.dx,cmd.dy)<.01)throw Error('Invalid dash');
    const d=Math.hypot(cmd.dx,cmd.dy);let count=0;
    for(let i=0;i<8;i++){const x=actor.x+cmd.dx/d*COMBAT_P0.dashDistance/8,y=actor.y+cmd.dy/d*COMBAT_P0.dashDistance/8;
      if(!walkable(x,y))break;actor.x=x;actor.y=y;count++;
    }
    actor.nextDashAt=now+COMBAT_P0.dashCooldownMs;actor.feed=null;actor.selfFeed=null;
    return {dashSteps:count};
  }
  if(cmd.type==='weaponSelect'){const prof=profile(players[actorId]);if(!Object.hasOwn(COMBAT_WEAPONS,cmd.weapon))throw Error('Unknown weapon');prof.selectedWeapon=cmd.weapon;prof.magazine=Math.min(prof.magazine,COMBAT_WEAPONS[cmd.weapon].magazine);actor.nextShotAt=Math.max(actor.nextShotAt,now+250);if(!prof.magazine&&prof.ammo>0&&!prof.reloadEndsAt)prof.reloadEndsAt=now+COMBAT_WEAPONS[cmd.weapon].reloadMs;return {weapon:cmd.weapon,magazine:prof.magazine,ammo:prof.ammo};}
   if(cmd.type==='fire'){
    if(now<actor.nextShotAt)throw Error('Shot cooling down');
    const prof=profile(players[actorId]);if(!Number.isSafeInteger(prof.ammo)||prof.ammo<1)throw Error('Out of ammo');if(prof.reloadEndsAt||prof.magazine<1)throw Error('Reloading');
    if(!finite(cmd.dx)||!finite(cmd.dy)||Math.hypot(cmd.dx,cmd.dy)<.001)throw Error('Invalid aim');
    const d=Math.hypot(cmd.dx,cmd.dy),aim={x:cmd.dx/d,y:cmd.dy/d};
    actor.aim=aim;actor.nextShotAt=now+COMBAT_WEAPONS[prof.selectedWeapon].cooldown;actor.feed=null;actor.selfFeed=null;prof.ammo--;prof.magazine--;if(prof.magazine===0&&prof.ammo>0)prof.reloadEndsAt=now+COMBAT_WEAPONS[prof.selectedWeapon].reloadMs;
    // A hitscan shot is instantaneous but reports its actual ray for a visible tracer on the client.
    // Clamp the ray at the first solid wall; no phantom hits on opponents behind cover.
    let wallDistance=COMBAT_P0.shotRange;
    for(const w of WALLS){
      let enter=0,leave=COMBAT_P0.shotRange,valid=true;
      for(const [p,d,lo,hi] of [[actor.x,aim.x,w.x,w.x+w.w],[actor.y,aim.y,w.y,w.y+w.h]]){
        if(Math.abs(d)<1e-8){if(p<lo||p>hi){valid=false;break;}}
        else{const t0=(lo-p)/d,t1=(hi-p)/d;enter=Math.max(enter,Math.min(t0,t1));leave=Math.min(leave,Math.max(t0,t1));if(leave<enter){valid=false;break;}}
      }
      if(valid)wallDistance=Math.min(wallDistance,Math.max(0,enter));
    }
    const hits=s.enemies.filter(e=>e.alive).map(e=>({e,dot:(e.x-actor.x)*aim.x+(e.y-actor.y)*aim.y}))
      .filter(h=>h.dot>=0&&h.dot<=wallDistance+.001&&Math.hypot(h.e.x-actor.x-aim.x*h.dot,h.e.y-actor.y-aim.y*h.dot)<.44)
      .sort((a,b)=>a.dot-b.dot);
    const nearest=hits[0],travel=nearest?nearest.dot:wallDistance;
    const shot={from:{x:actor.x,y:actor.y},to:{x:actor.x+aim.x*travel,y:actor.y+aim.y*travel},
      blocked:!nearest&&wallDistance<COMBAT_P0.shotRange-.001,damage:0};
    if(!nearest)return {hit:false,ammo:prof.ammo,magazine:prof.magazine,reloadEndsAt:prof.reloadEndsAt,shot};
    const damage=prof.selectedWeapon==='pistol'?COMBAT_WEAPONS.pistol.damage:prof.weapon.damage;const actualDamage=Math.min(nearest.e.hp,damage);
    nearest.e.hp-=damage;
    shot.damage=actualDamage;
    if(nearest.e.hp<=0){nearest.e.alive=false;awardLoot(s,nearest.e);advanceStage(s,now);}
    return {hit:true,enemyId:nearest.e.id,ammo:prof.ammo,magazine:prof.magazine,reloadEndsAt:prof.reloadEndsAt,shot};
  }
  if(cmd.type==='melee'){
    if(!finite(cmd.dx)||!finite(cmd.dy))throw Error('Invalid melee');
    if(now<(actor.nextMeleeAt||0))throw Error('Melee cooling down');
    actor.nextMeleeAt=now+800;actor.feed=null;actor.selfFeed=null;
    const enemy=s.enemies.find(e=>e.alive&&hypot(actor,e)<1.35&&lineClear(actor,e));
    if(enemy){enemy.hp-=4;if(enemy.type!=='GUARD'){const d=hypot(actor,enemy)||1;moveBody(enemy,(enemy.x-actor.x)/d,(enemy.y-actor.y)/d,.5);}
      if(enemy.hp<=0){enemy.alive=false;awardLoot(s,enemy);advanceStage(s,now);}}
    return {hit:!!enemy};
  }
  if(cmd.type==='feed'){
    const target=person(s,cmd.target);if(target.id===actorId||target.status!=='DOWNED'||now>target.downedDeadline||hypot(actor,target)>1.25)throw Error('Cannot feed');
    if((players[actorId]?.bag?.food||0)+(players[actorId]?.bag?.carrot||0)<1)throw Error('No food');
    actor.input={x:0,y:0};actor.selfFeed=null;actor.feed={target:target.id,completeAt:now+COMBAT_P0.feedMs,owner:actorId};
    return {feedEndsAt:actor.feed.completeAt};
  }
  if(cmd.type==='selfFeed'){
    if(actor.hp>=100)throw Error('Already fully healed');
    if((players[actorId]?.bag?.food||0)+(players[actorId]?.bag?.carrot||0)<1)throw Error('No food');
    actor.input={x:0,y:0};actor.feed=null;actor.selfFeed={completeAt:now+COMBAT_P0.feedMs};
    return {feedEndsAt:actor.selfFeed.completeAt};
  }
  if(cmd.type==='pickup'){
    const obj=s.loot[cmd.target];if(!obj||obj.claimedBy||hypot(actor,obj)>1.3)throw Error('Loot unavailable');
    obj.claimedBy=actorId;profile(players[actorId]).ammo+=obj.quantity;
    return {kind:obj.kind,quantity:obj.quantity};
  }
  throw Error('Unknown combat action');
}
export function combatAction(world,players,sessionId,actorId,cmd,now=Date.now()){
  const s=combatRoot(world).sessions[sessionId];if(!s)throw Error('Combat missing');
  if(!cmd||typeof cmd.requestId!=='string'||cmd.requestId.length<4||cmd.requestId.length>100)throw Error('Invalid requestId');
  person(s,actorId);
  const key=actorId+':'+cmd.requestId;
  if(s.commands[key])return s.commands[key];
  const result=command(s,world,players,actorId,cmd,now);
  if(cmd.type==='input')return {ok:true,...result}; // 10 Hz input must not bloat persisted idempotency log.
  s.commands[key]={ok:true,...result};
  if(Object.keys(s.commands).length>512)delete s.commands[Object.keys(s.commands)[0]];
  return s.commands[key];
}
export function combatView(world,sessionId,actorId){
  const s=combatRoot(world).sessions[sessionId];if(!s)throw Error('Combat missing');person(s,actorId);
  return {sessionId:s.id,status:s.status,stage:s.stage,attempt:s.attempt,ownerId:s.ownerId,objectiveReady:s.objectiveReady,
    members:s.members,enemies:s.enemies,loot:s.loot,walls:WALLS,firstWins:combatRoot(world).firstWins};
}
