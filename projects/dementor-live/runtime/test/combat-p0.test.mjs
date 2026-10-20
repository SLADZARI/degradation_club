import test from 'node:test';
import assert from 'node:assert/strict';
import {createCombat,joinCombat,combatAction,advanceCombat,walkable,lineClear} from '../combat-p0.mjs';
function ctx(){return {world:{players:{a:{id:'a',bag:{food:3},wallet:21},b:{id:'b',bag:{food:2},wallet:16},c:{id:'c',bag:{food:1}}}},now:1_000};}
function setup(two=false){const x=ctx();x.sid=createCombat(x.world,x.world.players,'a',x.now);if(two)joinCombat(x.world,x.world.players,x.sid,'b');let i=0;x.act=(p,type,rest={},when=x.now)=>combatAction(x.world,x.world.players,x.sid,p,{requestId:'req-'+(++i),type,...rest},when);x.start=()=>x.act('a','start');return x;}
test('starter rifle is permanent and assigned only once',()=>{
  const x=setup();const p=x.world.players.a.combatP0;assert.equal(p.ammo,24);assert.equal(p.receivedStarter,true);
  assert.throws(()=>createCombat(x.world,x.world.players,'a',2000),/Already/);
  assert.equal(x.world.players.a.combatP0.weapon.id,p.weapon.id);
});
test('join allowed before mission start, forbidden after it',()=>{const x=setup();x.start();assert.throws(()=>joinCombat(x.world,x.world.players,x.sid,'b'),/closed/);});
test('owner cannot add third player to first net test',()=>{const x=setup(true);assert.throws(()=>joinCombat(x.world,x.world.players,x.sid,'c'),/full/);});
test('idempotent fire spends one shot and returns same response',()=>{
  const x=setup();x.start();const cmd={type:'fire',requestId:'fire-unique',dx:1,dy:0};const r=combatAction(x.world,x.world.players,x.sid,'a',cmd,1200);
  assert.deepEqual(combatAction(x.world,x.world.players,x.sid,'a',cmd,1200),r);assert.equal(x.world.players.a.combatP0.ammo,23);
  assert.throws(()=>x.act('a','fire',{dx:1,dy:0},1200),/cooling/);
});
test('shots do not pass walls; movement collides with solid walls',()=>{
  assert.equal(lineClear({x:5,y:6},{x:9,y:6}),false);
  assert.equal(walkable(6.1,6),false);assert.equal(walkable(2,2),true);
});
test('movement uses server clock and caps tick delta',()=>{
  const x=setup();x.start();x.act('a','input',{dx:1,dy:0});advanceCombat(x.world,x.sid,11_000);
  assert.ok(x.world.combatP0.sessions[x.sid].members.a.x<3);
});
test('dash respects obstacles and cooldown',()=>{
  const x=setup();x.start();const s=x.world.combatP0.sessions[x.sid];s.members.a.x=5.2;s.members.a.y=6;
  x.act('a','dash',{dx:1,dy:0},1100);assert.ok(s.members.a.x<6);
  assert.throws(()=>x.act('a','dash',{dx:1,dy:0},1200),/cooling/);
});
test('invalid inputs do not alter ammo or coordinates',()=>{
  const x=setup();x.start();const s=x.world.combatP0.sessions[x.sid];
  assert.throws(()=>x.act('a','fire',{dx:NaN,dy:0}),/Invalid/);assert.equal(x.world.players.a.combatP0.ammo,24);
  assert.throws(()=>x.act('a','input',{dx:Infinity,dy:0}),/Invalid/);assert.equal(s.members.a.x,2);
});
test('downed teammate fed in 2s once, spending food at completion; movement interrupts',()=>{
  const x=setup(true);x.start();const s=x.world.combatP0.sessions[x.sid];s.enemies=[];
  s.members.b.hp=0;s.members.b.status='DOWNED';s.members.b.downedDeadline=40_000;
  x.act('a','feed',{target:'b'},2_000);assert.equal(x.world.players.a.bag.food,3);
  x.act('a','input',{dx:1,dy:0},2_100);advanceCombat(x.world,x.sid,4_500);
  assert.equal(s.members.b.status,'DOWNED');assert.equal(x.world.players.a.bag.food,3);
  x.act('a','input',{dx:0,dy:0},4_600);x.act('a','feed',{target:'b'},4_650);
  advanceCombat(x.world,x.sid,6_650);assert.equal(s.members.b.status,'ACTIVE');assert.equal(s.members.b.hp,40);
  assert.equal(x.world.players.a.bag.food,2);assert.equal(s.members.b.invulnerableUntil,9650);
});
test('full wipe restarts current stage, does not replenish ammo or reset issued loot',()=>{
  const x=setup(true);x.start();const s=x.world.combatP0.sessions[x.sid];s.stage=2;s.issuedStages['2']=true;
  s.members.a.status='DOWNED';s.members.a.downedDeadline=1500;s.members.b.status='DOWNED';s.members.b.downedDeadline=1500;
  x.world.players.a.combatP0.ammo=7;advanceCombat(x.world,x.sid,1600);
  assert.equal(s.stage,2);assert.equal(s.attempt,1);assert.equal(x.world.players.a.combatP0.ammo,7);
  assert.equal(s.members.a.status,'ACTIVE');assert.equal(s.issuedStages['2'],true);
});
test('one stage issues one limited loot even after repeated kills',()=>{
  const x=setup();x.start();const s=x.world.combatP0.sessions[x.sid];s.members.a.x=11;s.members.a.y=1;const e=s.enemies[0];
  x.act('a','fire',{dx:0,dy:1},1400);x.act('a','fire',{dx:0,dy:1},1800);x.act('a','fire',{dx:0,dy:1},2200);
  assert.equal(e.alive,false);assert.equal(s.stage,2);assert.equal(Object.keys(s.loot).length,1);
  assert.equal(x.world.players.a.wallet,21);
});
test('loot picked by at most one player; duplicate requests cannot mint ammo',()=>{
  const x=setup(true);x.start();const s=x.world.combatP0.sessions[x.sid];const lootId='fixed-1';
  s.loot[lootId]={id:lootId,kind:'ammo',quantity:3,x:2,y:2,claimedBy:null};
  const first=x.act('a','pickup',{target:lootId},1300);assert.equal(first.quantity,3);
  assert.equal(x.world.players.a.combatP0.ammo,27);
  assert.throws(()=>x.act('b','pickup',{target:lootId},1301),/unavailable/);
  assert.equal(x.world.players.b.combatP0.ammo,24);
});
test('a mission can extract only after completing all three stages, first win persists once',()=>{
  const x=setup();x.start();const s=x.world.combatP0.sessions[x.sid];assert.throws(()=>x.act('a','extract'),/incomplete/);
  s.stage=3;s.status='EXTRACT_READY';s.members.a.x=14;s.members.a.y=14;const first=x.act('a','extract',{},5000);assert.equal(first.completed,true);
  assert.equal(s.status,'CLOSED');assert.equal(x.world.combatP0.firstWins.a,5000);
  const another=createCombat(x.world,x.world.players,'a',6000);assert.ok(another!==x.sid);
  assert.equal(x.world.combatP0.firstWins.a,5000);
});
test('serialized state retains weapon, session, loot, ammunition and world state',()=>{
  const x=setup(true);x.start();x.act('a','fire',{dx:1,dy:0},1200);
  const cloned=JSON.parse(JSON.stringify(x.world));assert.equal(cloned.players.a.combatP0.ammo,23);
  assert.equal(cloned.combatP0.sessions[x.sid].status,'ACTIVE');assert.equal(cloned.players.a.wallet,21);
});
test('invalid session commands and impersonation are rejected',()=>{
  const x=setup();x.start();assert.throws(()=>x.act('b','fire',{dx:1,dy:0}),/participant/);
  assert.throws(()=>combatAction(x.world,x.world.players,x.sid,'a',{type:'fire',requestId:'x',dx:1,dy:0},1200),/requestId/);
});

test('repeater must be activated manually after stage two cleared',()=>{
  const x=setup();x.start();const s=x.world.combatP0.sessions[x.sid];
  s.stage=2;s.enemies=[];s.objectiveReady=false;
  assert.throws(()=>x.act('a','activate',{},1100),/Clear enemies/);
  s.objectiveReady=true;s.members.a.x=9;s.members.a.y=8;
  assert.equal(x.act('a','activate',{},1200).stage,3);
  assert.equal(s.stage,3);assert.ok(s.enemies.some(e=>e.type==='GUARD'));
});
test('extract requires physically reaching exit, not just completing stage',()=>{
  const x=setup();x.start();const s=x.world.combatP0.sessions[x.sid];s.status='EXTRACT_READY';
  assert.throws(()=>x.act('a','extract',{},2000),/extraction/);
  s.members.a.x=14;s.members.a.y=14;
  assert.equal(x.act('a','extract',{},2200).completed,true);
});
test('retreat leaves permanent personal gear and consumed ammunition unchanged',()=>{
  const x=setup(true);x.start();const starter=x.world.players.a.combatP0.weapon.id;
  x.act('a','fire',{dx:1,dy:0},1200);
  x.act('a','retreat',{},1400);
  assert.equal(x.world.players.a.combatP0.weapon.id,starter);
  assert.equal(x.world.players.a.combatP0.ammo,23);
  assert.equal(x.world.combatP0.sessions[x.sid].status,'CLOSED');
});
test('high frequency movement input does not accumulate commands in save',()=>{
  const x=setup();x.start();const s=x.world.combatP0.sessions[x.sid];
  for(let i=0;i<300;i++)x.act('a','input',{dx:1,dy:0},1500+i);
  assert.ok(Object.keys(s.commands).length<=2);
});

test('CHASER navigates around blocking wall instead of oscillating into it',()=>{
  const x=setup();x.start();
  const s=x.world.combatP0.sessions[x.sid],chaser=s.enemies[0];
  chaser.x=9.2;chaser.y=6;chaser.lastAttack=1e15;
  s.members.a.x=5;s.members.a.y=6;
  let now=1000;
  for(let i=0;i<135;i++){now+=250;advanceCombat(x.world,x.sid,now);}
  assert.ok(Math.hypot(chaser.x-5,chaser.y-6)<3.5,'Enemy must navigate around wall, not remain at blocked side');
});
test('two second self-feeding consumes once only on completion and restores capped HP',()=>{
  const x=setup();x.start();const s=x.world.combatP0.sessions[x.sid];
  s.enemies=[];s.members.a.hp=50;
  x.act('a','selfFeed',{},2000);assert.equal(x.world.players.a.bag.food,3);
  advanceCombat(x.world,x.sid,4000);
  assert.equal(x.world.players.a.bag.food,2);assert.equal(s.members.a.hp,65);
});
test('downed teammate times out to checkpoint if a partner still stands',()=>{
  const x=setup(true);x.start();const s=x.world.combatP0.sessions[x.sid];
  s.enemies=[];s.members.b.status='DOWNED';s.members.b.downedDeadline=1600;
  advanceCombat(x.world,x.sid,1650);
  assert.equal(s.members.b.status,'ACTIVE');assert.equal(s.members.b.hp,30);
  assert.equal(s.stage,1);assert.equal(s.attempt,0);
});
