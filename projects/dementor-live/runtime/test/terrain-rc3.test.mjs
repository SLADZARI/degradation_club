import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,createWorld} from '../world-expansion-adapter.mjs';
import {terrainIndex,terrainRight,terrainPlacementCheck,landscapeSpeed} from '../landscape.mjs';
import {packTerrainSse,reconcileTerrain} from '../terrain-delta.mjs';
const action=(g,p,type,extra={},id='terrain-'+Math.random().toString(36).slice(2))=>
  g.command(p,{type,requestId:id,...extra});

test('Municipal paving remains affordable, durable and no duplicate charge',()=>{
 const g=new Game(createWorld()),p=g.join('Paving');
 p.wallet=5;p.x=16.7;p.y=4;
 const before=g.state.treasury;
 assert.equal(action(g,p,'landscapeBuy',{kind:'paving'},'pack-1234').ok,true);
 assert.equal(action(g,p,'landscapeBuy',{kind:'paving'},'pack-1234').ok,true);
 assert.equal(p.wallet,4);assert.equal(p.terrainBag.paving,10);
 assert.equal(g.state.treasury,before+1);
 p.x=14;p.y=9;
 assert.equal(action(g,p,'landscapePlace',{kind:'paving',x:14,y:9},'place-1234').ok,true);
 assert.equal(p.terrainBag.paving,9);
 assert.equal(action(g,p,'landscapePlace',{kind:'paving',x:14,y:9},'place-1235').ok,false);
 assert.equal(p.terrainBag.paving,9);
 const restored=new Game(JSON.parse(JSON.stringify(g.state))),same=restored.auth(p.token);
 assert.equal(same.wallet,4);assert.equal(same.terrainBag.paving,9);
 assert.equal(terrainIndex(restored).get('14,9')?.owner,p.id);
 assert.equal(landscapeSpeed(restored,{...same,x:14.2,y:9.2}),1.2);
});

test('No use of private/unowned plots by neighbours; failed action never removes pack',()=>{
 const g=new Game(createWorld()),owner=g.join('Owner'),visitor=g.join('Visitor');
 const plot=g.state.plots[0],x=plot.x+1,y=plot.y+1;
 owner.x=visitor.x=x+.5;owner.y=visitor.y=y+.5;
 owner.terrainBag.paving=3;visitor.terrainBag.paving=3;
 assert.equal(terrainRight(g,visitor,x,y).allowed,false,'unsold parcel protected');
 const n=visitor.terrainBag.paving;
 assert.equal(action(g,visitor,'landscapePlace',{kind:'paving',x,y}).ok,false);
 assert.equal(visitor.terrainBag.paving,n);
 plot.owner=owner.id;
 assert.equal(terrainRight(g,visitor,x,y).allowed,false);
 assert.equal(terrainRight(g,owner,x,y).allowed,true);
 assert.equal(action(g,visitor,'landscapePlace',{kind:'paving',x,y}).ok,false);
 assert.equal(visitor.terrainBag.paving,n);
 const check=terrainPlacementCheck(g,owner,{kind:'paving',x,y});
 if(check.ok)assert.equal(action(g,owner,'landscapePlace',{kind:'paving',x,y}).ok,true);
 assert.equal(visitor.terrainBag.paving,n);
});

test('Derived occupancy index is stable at 100, 500 and 1200 tiles, no per-tick scan',()=>{
 for(const count of [100,500,1200]){
  const g=new Game(createWorld()),p=g.join('Perf');
  const width=g.c.width,height=g.c.height;
  assert.ok(width*height>=count);
  const tiles=Array.from({length:count},(_,i)=>({x:i%width,y:Math.floor(i/width),kind:'paving',owner:p.id,at:0}));
  g.state.landscape.tiles=tiles;
  const idx=terrainIndex(g);assert.equal(idx.size,count);
  assert.equal(terrainIndex(g),idx,'reuse same map object');
  const last=tiles.at(-1);
  p.x=last.x+.5;p.y=last.y+.5;
  for(let i=0;i<10000;i++)assert.equal(landscapeSpeed(g,p),1.2);
  assert.equal(terrainIndex(g),idx,'game ticks must not rebuild the index');
 }
});

test('Per-SSE-client receives full snapshot once; subsequent unchanged chunks are empty',()=>{
 const initial={cityNetwork:{current:'origin'},landscape:{version:1,revision:0,tiles:[{x:1,y:2,kind:'grass'}]}};
 const first=packTerrainSse(initial);
 assert.equal(first.snapshot.landscape.tiles.length,1);
 const second=packTerrainSse(initial,first.cursor);
 assert.equal(second.snapshot.landscape.tiles,undefined);
 assert.deepEqual(second.snapshot.landscapeDelta.tiles,[]);
 assert.equal(reconcileTerrain(first.snapshot,second.snapshot).landscape.tiles.length,1);
 const newer={cityNetwork:{current:'origin'},landscape:{version:1,revision:1,tiles:[...initial.landscape.tiles,{x:3,y:4,kind:'paving'}]}};
 const changed=packTerrainSse(newer,second.cursor);
 assert.equal(changed.snapshot.landscapeDelta.from,1);
 assert.equal(changed.snapshot.landscapeDelta.tiles.length,1);
 assert.equal(reconcileTerrain(initial,changed.snapshot).landscape.tiles.length,2);
 const switched=packTerrainSse({...newer,cityNetwork:{current:'elsewhere'}},changed.cursor);
 assert.ok(Array.isArray(switched.snapshot.landscape.tiles),'city switch forces full snapshot');
 assert.equal(reconcileTerrain(null,changed.snapshot),null,'out of sync client must reconnect');
});
