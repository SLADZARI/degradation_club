import test from 'node:test';import assert from 'node:assert/strict';
import {Game,createWorld} from '../world-expansion-adapter.mjs';
import {WORLD_SUMMIT_TRAIL,WORLD_DESERT,WORLD_CACTI,WORLD_OBSTACLES} from '../world-expansion.mjs';
import {worldFootprints,stoneSize,blockedByRect,footprintConflicts,isoDepth} from '../world-footprints.mjs';
import {mountainMovement,summitPosition} from '../mountain-trail.mjs';
import {MUNICIPAL_SITES} from '../municipal-buildings.mjs';
let counter=0;const command=(g,p,type,target,extra={})=>g.command(p,{type,target,requestId:'geometry-p5-'+(++counter),...extra});
test('Every world structure has a footprint; markers, public routes and existing spawn still work',()=>{
 const g=new Game(createWorld()),p=g.join('Картограф');g.connect(p);
 const f=worldFootprints(g);
 assert.ok(f.some(o=>o.id==='structure-museum-entry'));
 assert.ok(f.some(o=>o.id==='structure-university-site'));
 assert.ok(f.some(o=>o.id==='phone-square'));
 assert.ok(f.some(o=>o.kind==='mountain'));
 assert.ok(f.some(o=>o.kind==='forest'));
 const forests=WORLD_OBSTACLES.filter(o=>o.biome==='forest');
 assert.ok(forests.length>=30,'starter and eastern forests should form several substantial groups');
 assert.ok(forests.some(o=>Math.abs(o.x-Math.round(o.x))>.05),'forest positions should not align to a visible square grid');
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
  const r=g.target('tiered-rock-'+tier);assert.equal(r.rockSize,tier);assert.ok(r.stock>0&&r.stock<=250);
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

test('Fresh live world starts at the marked parcel and hides city services until it is cleared',()=>{
 const g=new Game(createWorld(undefined,{startingCity:true})),p=g.join('Первый житель');g.connect(p);
 assert.equal(g.state.startingCity,true);
 assert.equal(g.state.plots.find(plot=>plot.id==='plot-1').locked,true);
 assert.equal(g.state.plots.find(plot=>plot.id==='plot-1').clearanceParcel,true);
 assert.deepEqual(g.rects().map(o=>o.id).sort(),['mayor-tent','work-board']);
 assert.equal(g.walkable(23.4,2,p),true,'unbuilt tool shop must not block movement');
 assert.equal(g.walkable(12,26,p),true,'unbuilt warehouse must not block movement');
 const view=g.snapshot(p);
 assert.equal(view.startingCity,true);
 assert.deepEqual(view.worldTravel.targets,[]);
 assert.deepEqual(view.worldTravel.booths,[]);
 assert.ok(!view.worldTravel.footprints.some(o=>o.kind==='building'||o.kind==='payphone'),'city structures stay hidden before clearing');
 assert.ok(view.worldTravel.footprints.some(o=>['forest','mountain','rock'].includes(o.kind)),'natural barriers remain visible and solid');
 const hidden=command(g,p,'touristBuy','tourist-kiosk',{kind:'shirt'});
 assert.equal(hidden.ok,false);
 p.x=g.c.expedition.gate.x;p.y=g.c.expedition.gate.y;
 const entered=command(g,p,'missionEnter','plot-1');
 assert.equal(entered.ok,true);
 assert.equal(p.scene,'expedition');
 assert.equal(p.plotId,'plot-1');
});

test('Municipal phone opens only after three treasury-funded construction stages',()=>{
 const g=new Game(createWorld(undefined,{startingCity:true})),p=g.join('Городской строитель');g.connect(p);
 g.state.expedition.completedAt=g.now;g.state.plots.find(x=>x.id==='plot-1').locked=false;
 assert.equal(g.snapshot(p).worldTravel.booths.some(x=>x.id==='phone-square'),false);
 const hidden=command(g,p,'worldUse','phone-square');assert.equal(hidden.ok,false);
 p.x=22.7;p.y=1;
 assert.equal(command(g,p,'buyTool','tool-shop',{tool:'axe'}).ok,false,'unbuilt shop must reject direct purchase');
 p.x=15;p.y=13;
 assert.equal(command(g,p,'donate','donation-box',{kind:'wood',quantity:1}).ok,false,'plaza services remain closed until its project is complete');
 p.bag.wood=4;p.bag.stone=2;
 const site=MUNICIPAL_SITES['phone-square'];
 p.x=site.drop.x;p.y=site.drop.y;
 assert.equal(command(g,p,'deliver',site.drop.id).ok,true);
 p.x=site.build.x;p.y=site.build.y;
 for(let i=0;i<4;i++){const result=command(g,p,'build',site.build.id);assert.equal(result.ok,true);g.tick(g.c.buildMs+1);}
 assert.equal(g.state.municipalBuildings['phone-square'].stage,3);
 assert.equal(g.snapshot(p).worldTravel.booths.some(x=>x.id==='phone-square'),true);
 assert.equal(g.walkable(10.2,12.2,p),false,'built payphone occupies its real footprint');
 assert.ok(p.wallet>0,'municipality pays materials and work from treasury');
});
