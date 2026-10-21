import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,createWorld} from '../world-expansion-adapter.mjs';
import {CONFIG} from '../config.mjs';
import {WORLD_SCENES,WORLD_CITY_TARGETS,SECOND_BRIDGE,WORLD_OBSTACLES} from '../world-expansion.mjs';

let n=0;
function command(g,p,type,target,extra={}){return g.command(p,{requestId:'world-p0-'+(++n),type,target,...extra});}

test('city area is 5x, old square and mission are preserved',()=>{
  const g=new Game(createWorld());
  assert.equal(g.c.width*g.c.height,5*64*40);
  assert.equal(g.target('frontier-gate').x,31);
  assert.equal(g.target('combat-gate'),null); // P0 combat entry is handled by the existing server.
  assert.ok(g.state.plots.some(p=>p.id==='plot-1'&&p.x===4));
  assert.equal(WORLD_CITY_TARGETS.filter(x=>x.type==='world-gate').length,2);
});

test('forest/mountain barriers, public crossing and preserved starter bridge',()=>{
  const g=new Game(createWorld()),p=g.join('Исследователь');
  const woods=WORLD_OBSTACLES.find(o=>o.biome==='forest');
  const rocks=WORLD_OBSTACLES.find(o=>o.biome==='mountain');
  assert.equal(g.walkable(woods.x+1,woods.y+1,p),false);
  assert.equal(g.walkable(rocks.x+1,rocks.y+1,p),false);
  assert.equal(g.walkable(35.5,45,p),false);
  assert.equal(g.walkable(35.5,SECOND_BRIDGE.y+3,p),false,'Second bridge starts unbuilt');
   g.state.secondBridgeProject.stage=2;assert.equal(g.walkable(35.5,SECOND_BRIDGE.y+3,p),true);
  assert.equal(g.walkable(-1,60,p),false);
  assert.equal(g.state.resources.filter(x=>x.id.startsWith('mountain-stone-')).length,3);
});

test('tourist map is a real one-time purchase and survives restart',()=>{
  const g=new Game(createWorld()),p=g.join('Турист');
  p.wallet=50;p.x=25;p.y=38;
  const id='world-purchase-once-12345',cmd={requestId:id,type:'touristBuy',target:'tourist-kiosk',kind:'map'};
  const treasury=g.state.treasury,first=g.command(p,cmd);
  assert.equal(first.ok,true);
  assert.equal(p.wallet,40);assert.equal(g.state.treasury,treasury+10);
  assert.deepEqual(g.command(p,cmd),first);
  assert.equal(p.wallet,40);
  assert.equal(command(g,p,'touristBuy','tourist-kiosk',{kind:'map'}).ok,false);
  const copy=new Game(structuredClone(g.state));
  const same=copy.auth(p.token);
  assert.equal(same.worldTravel.mapOwned,true);
  assert.equal(same.wallet,40);
});

test('museum and farlands are reachable from city gates and support return',()=>{
  const g=new Game(createWorld()),p=g.join('Пешеход');
  for(const [entry,scene,exit] of [['museum-entry','museum','museum-exit'],['farlands-entry','farlands','farlands-exit']]){
    const t=g.target(entry);p.x=t.x;p.y=t.y;
    const actual={x:p.x,y:p.y};
    assert.equal(command(g,p,'worldUse',entry).ok,true);
    assert.equal(p.scene,scene);
    assert.equal(p.worldTravel.visited.includes(scene),true);
    assert.equal(g.snapshot(p).scene,scene);
    assert.equal(g.snapshot(p).home,null);
    assert.ok(WORLD_SCENES[scene].width>16||WORLD_SCENES[scene].height>16);
    assert.equal(g.walkable(-3,5,p),false);
    const back=g.target(exit);p.x=back.x;p.y=back.y;
    assert.equal(command(g,p,'worldUse',exit).ok,true);
    assert.equal(p.scene,'city');
    assert.equal(p.x,actual.x);assert.equal(p.y,actual.y);
  }
  const after=new Game(structuredClone(g.state));const same=after.auth(p.token);
  assert.deepEqual([...same.worldTravel.visited].sort(),['city','farlands','museum']);
});

test('gates require proximity; public world actions cannot create PAPER or teleport on demand',()=>{
  const g=new Game(createWorld()),p=g.join('Прохожий');
  assert.equal(command(g,p,'worldUse','farlands-entry').ok,false);
  const start={x:p.x,y:p.y,coins:p.wallet};
  assert.equal(command(g,p,'worldUse','mountain-sign').ok,false);
  assert.equal(command(g,p,'touristBuy','tourist-kiosk',{kind:'map'}).ok,false);
  assert.equal(p.x,start.x);assert.equal(p.y,start.y);assert.equal(p.wallet,start.coins);
  assert.equal(command(g,p,'worldUse','missing').ok,false);
});

test('existing city warehouse, material accounting and discarded stones survive serialisation',()=>{
  const g=new Game(createWorld()),p=g.join('Каменщик');
  p.bag.stone=3;p.x=24;p.y=39;
  const before=g.snapshot(p).materials.stone.total;
  assert.equal(command(g,p,'drop',null,{kind:'stone',quantity:3}).ok,true);
  const pile=g.state.drops.find(d=>d.kind==='stone');
  assert.equal(pile.quantity,3);
  assert.equal(g.snapshot(p).materials.stone.total,before);
  const recovered=new Game(structuredClone(g.state)),same=recovered.auth(p.token);
  assert.equal(recovered.state.drops.find(d=>d.id===pile.id).quantity,3);
  assert.equal(recovered.snapshot(same).materials.stone.total,before);
});

test('world identity isolates persistent fog and survives state reload',()=>{
  const first=createWorld(),second=createWorld();
  assert.ok(first.worldId);
  assert.notEqual(first.worldId,second.worldId,'new worlds must not reuse browser discovery');
  const g=new Game(first),p=g.join('Исследователь');
  assert.equal(g.snapshot(p).worldId,first.worldId,'clients receive the stable world key');
  const legacy=createWorld();delete legacy.worldId;
  new Game(legacy);
  const migratedId=legacy.worldId;
  assert.ok(migratedId,'legacy saves receive a stable world identity');
  new Game(JSON.parse(JSON.stringify(legacy)));
  assert.equal(legacy.worldId,migratedId,'reload does not reset the migrated world identity');
});
