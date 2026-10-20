import test from 'node:test';import assert from 'node:assert/strict';
import {Game,createWorld} from '../world-expansion-adapter.mjs';
import {WORLD_SUMMIT_TRAIL,WORLD_DESERT,WORLD_CACTI,WORLD_OBSTACLES} from '../world-expansion.mjs';
import {worldFootprints,stoneSize,blockedByRect,footprintConflicts,isoDepth} from '../world-footprints.mjs';
import {mountainMovement,summitPosition} from '../mountain-trail.mjs';
let counter=0;const command=(g,p,type,target,extra={})=>g.command(p,{type,target,requestId:'geometry-p5-'+(++counter),...extra});
test('Every world structure has a footprint; markers, public routes and existing spawn still work',()=>{
 const g=new Game(createWorld()),p=g.join('Картограф');g.connect(p);
 const f=worldFootprints(g);
 assert.ok(f.some(o=>o.id==='structure-museum-entry'));
 assert.ok(f.some(o=>o.id==='structure-university-site'));
 assert.ok(f.some(o=>o.id==='phone-square'));
 assert.ok(f.some(o=>o.kind==='mountain'));
 assert.ok(f.some(o=>o.kind==='forest'));
 assert.ok(f.some(o=>o.id==='tiered-rock-5'));
 assert.ok(f.some(o=>o.kind==='cactus'));
 assert.ok(isoDepth(f.find(o=>o.id==='structure-museum-entry'))>0);
 assert.equal(g.walkable(p.x,p.y,p),true);
 for(const id of ['museum-entry','farlands-entry','forest-sign','mountain-sign']){
  const t=g.target(id);assert.equal(g.walkable(t.x,t.y,p),true,id+' entrance must remain usable');
 }
 assert.ok(WORLD_DESERT.x>WORLD_SUMMIT_TRAIL.at(-1)[0]);
 assert.ok(WORLD_CACTI.length>=3);
 const clashes=footprintConflicts(f);
 assert.deepEqual(clashes,[],'New procedural rocks and cacti must never overlap any physical footprint');
});
test('Tier 2–5 rocks have finite, shrinking, persisted bounds; mining near perimeter works',()=>{
 const g=new Game(createWorld()),p=g.join('Каменотёс');g.connect(p);p.equipped='pick';p.tools.pick=48;
 for(let tier=2;tier<=5;tier++){
  const r=g.target('tiered-rock-'+tier);assert.equal(r.rockSize,tier);assert.ok(r.stock>0&&r.stock<1000);
  const f=worldFootprints(g).find(o=>o.id===r.id);assert.ok(f);
  assert.equal(blockedByRect(r.x,r.y,.3,f),true);
  const oldSize=stoneSize(r),stock=r.stock;
  p.x=r.x-tier/2-.7;p.y=r.y;
  assert.equal(g.walkable(p.x,p.y,p),true,'mining stance outside deposit');
  const result=command(g,p,'mine',r.id);assert.equal(result.ok,true,result.message);
  g.tick(600);
  assert.equal(r.stock,stock-1);
  assert.ok(stoneSize(r)<oldSize);
 }
 const restarted=new Game(structuredClone(g.state));
 assert.equal(restarted.target('tiered-rock-5').stock,g.target('tiered-rock-5').stock);
 const big=restarted.target('tiered-rock-5');big.stock=0;
 // Test fixture modifies server state directly; publish a revision to invalidate the P5 footprint cache.
 restarted.changed();
 assert.equal(worldFootprints(restarted).some(o=>o.id==='tiered-rock-5'),false);
 assert.equal(restarted.walkable(big.x,big.y,p),true);
});
test('Summit trail is passable through mountain barriers; off-route remains blocked',()=>{
 const g=new Game(createWorld()),p=g.join('Альпинист');g.connect(p);
 assert.ok(WORLD_SUMMIT_TRAIL.length>=8);
 assert.equal(g.walkable(51,45,p),true);
 assert.equal(g.walkable(54,45,p),false);
 assert.equal(summitPosition(75,37)?.elevation,100);
 p.x=51;p.y=53;p.hunger=100;p.stamina=70;
 g.input(p,{dx:0,dy:-1,sprint:false});
 const first=p.stamina;g.tick(200);
 assert.ok(p.stamina<first);
 assert.ok(p.hunger<100-.14*.2,'uphill should increase hunger cost');
 assert.ok(p.y<53,'ascending the trail still moves forward');
 const effects=mountainMovement(p,{dx:0,dy:-1});assert.ok(effects.onTrail&&effects.speed<1);
});
test('Player-laid road still yields 20% movement boost; no new double-spending',()=>{
 const g=new Game(createWorld()),p=g.join('Дорожник');g.connect(p);
 g.state.landscape.tiles.push({kind:'paving',x:9,y:42,owner:p.id});
 p.x=9.5;p.y=42.5;g.input(p,{dx:1,dy:0,sprint:false});
 const x=p.x;g.tick(200);
 assert.ok(p.x-x>.80&&p.x-x<1,'Paving applies ~1.2x of 4 cells/sec');
});

test('Mountain summit grants treasury-backed one-time recognition, persists across reload and never double-pays',()=>{
 const g=new Game(createWorld()),p=g.join('Восходитель');g.connect(p);
 const t=g.target('mountain-summit');p.x=t.x;p.y=t.y;
 assert.equal(g.walkable(p.x,p.y,p),true);
 const money=g.state.treasury+p.wallet;
 const first=command(g,p,'worldUse','mountain-summit');
 assert.equal(first.ok,true,first.message);assert.equal(first.reward,40);
 assert.equal(p.wallet,40);assert.equal(g.state.treasury+p.wallet,money);
 const second=command(g,p,'worldUse','mountain-summit');
 assert.equal(second.ok,true);assert.equal(p.wallet,40);
 const old=new Game(structuredClone(g.state)),resident=old.auth(p.token);
 assert.ok(resident.worldTravel.summitReachedAt);
 assert.equal(command(old,resident,'worldUse','mountain-summit').reward,undefined);
 assert.equal(resident.wallet,40);
});
