import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,createWorld} from '../world-expansion-adapter.mjs';
import {WORLD_CITY_TARGETS,WORLD_SCENES,TOURIST_PRICES,worldTravelView} from '../world-expansion.mjs';
// Actual P0 world expansion runtime, not the synthetic v0.9.1 role simulation.
// No production server, save or browser action is touched by these tests.
let sequence=0;
const make=()=>{const game=new Game(createWorld());const p=game.join('Сквозной QA');p.wallet=100;return {game,p}};
const command=(game,p,type,target,params={})=>game.command(p,{requestId:'runtime-q-'+(++sequence),type,target,...params});
const at=(game,p,target)=>{const t=game.target(target);assert.ok(t,target+' must exist');p.x=t.x;p.y=t.y};
const treasuryAndWallet=(g,p)=>g.state.treasury+p.wallet;
test('R01 tourist prices are finite, map is owned once and city PAPER does not inflate',()=>{
 const {game:g,p}=make();at(g,p,'tourist-kiosk');
 const start=treasuryAndWallet(g,p);
 const res=command(g,p,'touristBuy','tourist-kiosk',{kind:'map'});
 assert.equal(res.ok,true);assert.equal(p.worldTravel.mapOwned,true);
 assert.equal(treasuryAndWallet(g,p),start);
 assert.equal(command(g,p,'touristBuy','tourist-kiosk',{kind:'map'}).ok,false);
 assert.equal(treasuryAndWallet(g,p),start);
});
test('R02 consumable souvenir repeat requestId never sells twice, including after restart',()=>{
 const {game:g,p}=make();at(g,p,'tourist-kiosk');
 const request={requestId:'souvenir-idempotent-A',type:'touristBuy',target:'tourist-kiosk',kind:'souvenir'};
 const before=treasuryAndWallet(g,p),first=g.command(p,request);
 assert.equal(first.ok,true);assert.equal(p.worldTravel.souvenirs.souvenir,1);
 assert.deepEqual(g.command(p,request),first);
 const copy=new Game(structuredClone(g.state)),again=copy.auth(p.token);
 assert.deepEqual(copy.command(again,request),first);
 assert.equal(again.worldTravel.souvenirs.souvenir,1);
 assert.equal(treasuryAndWallet(copy,again),before);
});
test('R03 invalid kiosk kinds, poor users and unreachable kiosk do not debit money',()=>{
 const {game:g,p}=make(),sum=treasuryAndWallet(g,p);
 assert.equal(command(g,p,'touristBuy','tourist-kiosk',{kind:'map'}).ok,false);
 at(g,p,'tourist-kiosk');p.wallet=0;
 assert.equal(command(g,p,'touristBuy','tourist-kiosk',{kind:'shirt'}).ok,false);
 assert.equal(command(g,p,'touristBuy','tourist-kiosk',{kind:'weapon'}).ok,false);
 assert.equal(treasuryAndWallet(g,p),g.state.treasury);
 assert.equal(TOURIST_PRICES.map,10);
 assert.ok(sum>g.state.treasury);
});
test('R04 museum/farlands entry returns to exact portal arrival position after reloading state',()=>{
 for(const [entry,scene,exit] of [['museum-entry','museum','museum-exit'],['farlands-entry','farlands','farlands-exit']]){
  const {game:g,p}=make();
  at(g,p,entry);const orig={x:p.x,y:p.y};const m=treasuryAndWallet(g,p);
  assert.equal(command(g,p,'worldUse',entry).ok,true);
  assert.equal(p.scene,scene);assert.equal(g.snapshot(p).scene,scene);
  const restarted=new Game(structuredClone(g.state)),rp=restarted.auth(p.token);
  at(restarted,rp,exit);assert.equal(command(restarted,rp,'worldUse',exit).ok,true);
  assert.equal(rp.scene,'city');assert.deepEqual([rp.x,rp.y],[orig.x,orig.y]);
  assert.equal(treasuryAndWallet(restarted,rp),m);
 }
});
test('R05 a player may not use world portals during a courier delivery',()=>{
 const {game:g,p}=make();p.delivery={kind:'wood',quantity:1,picked:true,reward:2};
 at(g,p,'museum-entry');const before={scene:p.scene||'city',x:p.x,y:p.y};
 const result=command(g,p,'worldUse','museum-entry');
 assert.equal(result.ok,false);assert.equal(p.scene||'city',before.scene);
 assert.deepEqual([p.x,p.y],[before.x,before.y]);assert.ok(p.delivery);
});
test('R06 a player may not use world portals during a live combat session',()=>{
 const {game:g,p}=make();p.combatP0={activeSessionId:'battle-active-test'};
 at(g,p,'farlands-entry');const before=[p.x,p.y];
 const result=command(g,p,'worldUse','farlands-entry');
 assert.equal(result.ok,false);assert.equal(p.scene||'city','city');
 assert.deepEqual([p.x,p.y],before);
});
test('R07 preview objects do not charge, build, teleport or grant fictional certificates',()=>{
 const {game:g,p}=make();
 const treasury=treasuryAndWallet(g,p),buildings=JSON.stringify(g.state.cityExpansion||{});
 for(const target of ['university-site','robo-stadium-site','industry-site']){
  at(g,p,target);const response=command(g,p,'worldUse',target);
  assert.equal(response.ok,true);
  assert.match(response.message,/проект|следующих/i);
  assert.equal(p.scene||'city','city');
 }
 assert.equal(p.certified,undefined);
 assert.equal(JSON.stringify(g.state.cityExpansion||{}),buildings);
 assert.equal(treasuryAndWallet(g,p),treasury);
});
test('R08 travel snapshots show actual region and maintain persistent visit history',()=>{
 const {game:g,p}=make();at(g,p,'museum-entry');
 assert.equal(command(g,p,'worldUse','museum-entry').ok,true);
 const first=g.snapshot(p);
 assert.equal(first.scene,'museum');
 assert.equal(first.worldTravel.scene,'museum');
 assert.equal(first.worldTravel.profile.visited.includes('museum'),true);
 assert.deepEqual(worldTravelView(g,p).targets.map(x=>x.id),['museum-exit','laugh-exhibit']);
 const copy=new Game(structuredClone(g.state)),rp=copy.auth(p.token);
 assert.ok(rp.worldTravel.visited.includes('museum'));
 assert.equal(copy.snapshot(rp).scene,'museum');
});
test('R09 world signs and exhibits do not create physical inventory or money',()=>{
 const {game:g,p}=make();const before=treasuryAndWallet(g,p);
 for(const target of ['travel-sign','forest-sign','mountain-sign']){
  at(g,p,target);assert.equal(command(g,p,'worldUse',target).ok,true);
 }
 at(g,p,'museum-entry');assert.equal(command(g,p,'worldUse','museum-entry').ok,true);
 at(g,p,'laugh-exhibit');assert.equal(command(g,p,'worldUse','laugh-exhibit').ok,true);
 assert.equal(treasuryAndWallet(g,p),before);
});
test('R10 identity and two-player state do not leak across different regions',()=>{
 const g=new Game(createWorld()),a=g.join('Исследователь'),b=g.join('Курьер');
 a.wallet=50;b.wallet=50;
 at(g,a,'farlands-entry');assert.equal(command(g,a,'worldUse','farlands-entry').ok,true);
 assert.equal(g.snapshot(a).scene,'farlands');
 assert.equal(g.snapshot(b).scene,'city');
 assert.equal(b.worldTravel.visited.includes('farlands'),false);
 const restarted=new Game(structuredClone(g.state));
 assert.equal(restarted.auth(a.token).scene,'farlands');
 assert.equal(restarted.auth(b.token).scene||'city','city');
});
test('R11 every exposed entry/exit references one of the implemented P0 scenes',()=>{
 assert.equal(WORLD_CITY_TARGETS.filter(t=>t.type==='world-gate').length,2);
 for(const scene of Object.values(WORLD_SCENES)){
  assert.equal(scene.exit.to,'city');
  assert.ok(scene.width>0&&scene.height>0);
 }
});

test('R12 delayed souvenir retry after 140 other commands and restart never debits again',()=>{
 const {game:g,p}=make();at(g,p,'tourist-kiosk');
 const cmd={requestId:'durable-souvenir-transaction-1',type:'touristBuy',target:'tourist-kiosk',kind:'souvenir'};
 const initial=treasuryAndWallet(g,p),wallet=p.wallet,first=g.command(p,cmd);
 assert.equal(first.ok,true);assert.equal(p.worldTravel.souvenirs.souvenir,1);
 // Intentionally exceed Game.command's capped 128-result replay cache.
 at(g,p,'travel-sign');
 for(let i=0;i<140;i++)assert.equal(command(g,p,'worldUse','travel-sign').ok,true);
 assert.ok(!p.results.some(e=>e.id===cmd.requestId));
 at(g,p,'tourist-kiosk');
 const oldWallet=p.wallet,oldTreasury=g.state.treasury;
 const repeat=g.command(p,cmd);
 assert.deepEqual(repeat,first);
 assert.equal(p.wallet,oldWallet);
 assert.equal(g.state.treasury,oldTreasury);
 assert.equal(p.worldTravel.souvenirs.souvenir,1);
 const restored=new Game(structuredClone(g.state)),rp=restored.auth(p.token);
 at(restored,rp,'tourist-kiosk');
 assert.deepEqual(restored.command(rp,cmd),first);
 assert.equal(rp.worldTravel.souvenirs.souvenir,1);
 assert.equal(treasuryAndWallet(restored,rp),initial);
 assert.equal(wallet-TOURIST_PRICES.souvenir,rp.wallet);
});

test('R13 paid purchase retry succeeds after leaving kiosk and changing scenes, without buying again',()=>{
 const {game:g,p}=make();at(g,p,'tourist-kiosk');
 const request={requestId:'paid-while-near-retried-from-museum',type:'touristBuy',target:'tourist-kiosk',kind:'shirt'};
 const first=g.command(p,request);
 assert.equal(first.ok,true);
 assert.equal(p.worldTravel.souvenirs.shirt,1);
 const sum=treasuryAndWallet(g,p),saved=p.wallet;
 // Exhaust the regular 128-command cache while the player leaves the shop.
 at(g,p,'travel-sign');
 for(let i=0;i<140;i++)assert.equal(command(g,p,'worldUse','travel-sign').ok,true);
 at(g,p,'museum-entry');
 assert.equal(command(g,p,'worldUse','museum-entry').ok,true);
 assert.equal(p.scene,'museum');
 assert.ok(!p.results.some(entry=>entry.id===request.requestId));
 const replay=g.command(p,request);
 assert.deepEqual(replay,first);
 assert.equal(p.worldTravel.souvenirs.shirt,1);
 assert.equal(p.wallet,saved);
 assert.equal(treasuryAndWallet(g,p),sum);
 const restored=new Game(structuredClone(g.state)),rp=restored.auth(p.token);
 assert.deepEqual(restored.command(rp,request),first);
 assert.equal(rp.worldTravel.souvenirs.shirt,1);
});
