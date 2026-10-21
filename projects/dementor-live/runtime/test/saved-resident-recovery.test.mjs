import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorld,Game} from '../world-expansion-adapter.mjs';
import {CityNetwork} from '../city-network.mjs';

test('Legacy residents at removed static payphone locations keep their saved coordinates',()=>{
 const game=new Game(createWorld()),a=game.join('First'),b=game.join('Second');
 a.x=10;a.y=12;b.x=10.1;b.y=12.2;
 a.wallet=187;a.bag.wood=7;b.wallet=41;b.bag.stone=4;
 const previous=structuredClone(game.state);
 const upgraded=new Game(structuredClone(previous));
 for(const p of [a,b]){
  const q=upgraded.auth(p.token);
  assert.ok(upgraded.walkable(q.x,q.y,q),'after upgrade, character must stand on walkable ground');
  assert.equal(q.wallet,p.wallet);assert.deepEqual(q.bag,p.bag);
  assert.equal(q.token,p.token);assert.deepEqual({x:q.x,y:q.y},{x:p.x,y:p.y});
 }
 assert.equal((upgraded.state.residentRelocations||[]).length,2);
 const notes=upgraded.state.residentRelocations;
 assert.deepEqual(new Set(notes.map(r=>JSON.stringify(r.from))),new Set([JSON.stringify({x:10,y:12}),JSON.stringify({x:10.1,y:12.2})]));
 assert.ok(upgraded.dirty,'startup migration must be persisted');
 const reloaded=new Game(structuredClone(upgraded.state));
 assert.deepEqual(reloaded.state.residentRelocations,notes,'restart must never duplicate ledger');
 assert.equal(reloaded.dirty,false,'second cold start must not move player a second time');
});
test('RC4 valid saved residents are never moved or marked dirty',()=>{
 const g=new Game(createWorld()),p=g.join('Nomad');p.x=8;p.y=8;
 const restarted=new Game(structuredClone(g.state));
 assert.equal(restarted.auth(p.token).x,8);
 assert.equal(restarted.auth(p.token).y,8);
 assert.equal((restarted.state.residentRelocations||[]).length,0);
 assert.equal(restarted.dirty,false);
});
test('RC4 protected private scene remains untouched; no unwanted map teleports',()=>{
 const g=new Game(createWorld()),p=g.join('Private');p.scene='plot';p.plotId='plot-1';p.x=7;p.y=7;
 const restarted=new Game(structuredClone(g.state));
 assert.equal(restarted.auth(p.token).x,7);
 assert.equal(restarted.auth(p.token).scene,'plot');
 assert.equal((restarted.state.residentRelocations||[]).length,0);
});
test('RC4 failing move within 24 tiles is fail-closed without partial mutation',()=>{
 const g=new Game(createWorld()),p=g.join('Blocked');p.x=-1000;p.y=-1000; p.wallet=99;
 const saved=structuredClone(g.state);
 assert.throws(()=>new Game(saved),/no walkable exit within 24 tiles/);
 assert.equal(saved.players[p.id].x,-1000);
 assert.equal(saved.players[p.id].wallet,99);
 assert.equal(saved.residentRelocations,undefined);
});
test('RC4 multi-city legacy save preserves all wallets, documents and owner plots on migration',()=>{
 const n=new CityNetwork(createWorld()),g=n.origin,p=g.join('Owner');
 p.x=10;p.y=12;p.wallet=402;
 g.state.plots[0].owner=p.id;
 const original=structuredClone(n.serialize());
 const migrated=new CityNetwork(structuredClone(original));
 const q=migrated.findId(p.id).p;
 assert.equal(q.x,p.x);assert.equal(q.y,p.y);assert.equal(q.wallet,402);
 assert.equal(migrated.origin.state.plots[0].owner,p.id);
 assert.ok(migrated.origin.walkable(q.x,q.y,q));
 assert.equal((migrated.origin.state.residentRelocations||[]).length,0);
});
