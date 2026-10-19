import test from 'node:test';import assert from 'node:assert/strict';
import {scenario,hireBuild,finishBuild,dispatch,deliver,buyMap,walk,explore,integratedRun,storyStats} from './story-loop-v091.mjs';
import {getPerson,getTown,validate,money} from './role-agents-v09.mjs';
test('story: mayor, NPC, courier, tourist and explorer complete a shared finite economic loop',()=>{
 const w=integratedRun(),r=storyStats(w);
 assert.deepEqual({buildings:r.buildings,deliveries:r.deliveries,mapPurchases:r.mapPurchases,expeditions:r.expeditions,certificates:r.certificates}, {buildings:1,deliveries:1,mapPurchases:1,expeditions:1,certificates:1});
 assert.equal(r.moneyTotal,r.openingMoney);assert.equal(r.escrow,0);validate(w);
});
test('story: actual worker receives pay once, materials become constructed building',()=>{
 const w=scenario(),npc=getPerson(w,'worker-0'),c=getTown(w,'city-0');
 assert.ok(hireBuild(w,{mayorId:'mayor-0',workerId:'worker-0',jobId:'work-a'}));
 assert.equal(finishBuild(w,'work-a'),true);assert.equal(finishBuild(w,'work-a'),false);
 assert.equal(npc.wallet,18);assert.equal(c.stock.WOOD,26);assert.ok(c.buildings.includes('work-a'));validate(w);
});
test('story: missing mayor funds or nonexistent building materials cannot generate contracts',()=>{
 const w=scenario();const c=getTown(w,'city-0');c.treasury=0;getPerson(w,'mayor-0').wallet+=300;
 assert.equal(hireBuild(w,{mayorId:'mayor-0',workerId:'worker-0',jobId:'no-budget'}),false);assert.equal(w.escrow.length,0);validate(w);
});
test('story: courier cargo reserved while in transit, single delivery settles only once',()=>{
 const w=scenario(),p=w.persons.find(x=>x.type==='COURIER'&&x.city==='city-1');
 const spec={mayorId:'mayor-0',courierId:p.id,from:'city-1',to:'city-0',id:'x1'};
 assert.equal(dispatch(w,spec),true);assert.equal(dispatch(w,spec),false);
 assert.equal(deliver(w,'x1'),true);assert.equal(deliver(w,'x1'),false);
 assert.equal(p.earnings,8);validate(w);
});
test('story: tourist map purchase charges once and does not teleport',()=>{
 const w=scenario(),p=w.persons.find(x=>x.type==='TOURIST'),initial=p.wallet;
 assert.ok(buyMap(w,{touristId:p.id,cityId:p.city,id:'tour-1'}));
 assert.equal(buyMap(w,{touristId:p.id,cityId:p.city,id:'tour-1'}),false);
 assert.equal(p.wallet,initial-5);assert.equal(w.trip.length,0);validate(w);
});
test('story: nonadjacent shortcut is rejected; return path requires actual stops',()=>{
 const w=scenario(),p=w.persons.find(x=>x.type==='EXPLORER');
 assert.throws(()=>walk(w,{playerId:p.id,from:'city',to:'ruins',id:'teleport'}),/illegal teleport/);
 assert.ok(walk(w,{playerId:p.id,from:'city',to:'forest',id:'trail'}));
 assert.ok(walk(w,{playerId:p.id,from:'forest',to:'ruins',id:'ruins'}));
 assert.ok(walk(w,{playerId:p.id,from:'ruins',to:'forest',id:'back-forest'}));
 assert.ok(walk(w,{playerId:p.id,from:'forest',to:'city',id:'back-city'}));
 validate(w);
});
test('story: PvE reward claimed only once and expedition voluntary',()=>{
 const w=scenario(),p=w.persons.find(x=>x.type==='EXPLORER');
 walk(w,{playerId:p.id,from:'city',to:'forest',id:'1'});walk(w,{playerId:p.id,from:'forest',to:'ruins',id:'2'});
 assert.ok(explore(w,{playerId:p.id,id:'ruins-event',choice:'leave'}));
 assert.equal(p.expeditions,0);assert.equal(explore(w,{playerId:p.id,id:'ruins-event',choice:'fight'}),false);
 validate(w);
});
test('story: serialize world, replay actions, no double payment, money stable',()=>{
 const w=integratedRun(),copy=JSON.parse(JSON.stringify(w)),initial=money(copy);
 assert.equal(finishBuild(copy,'square-1'),false);assert.equal(deliver(copy,'cargo-1'),false);
 assert.equal(buyMap(copy,{touristId:copy.tourMaps[0].touristId,cityId:copy.tourMaps[0].cityId,id:'map-1'}),false);
 assert.equal(storyStats(copy).moneyTotal,initial);validate(copy);
});
for(const population of [10,15,20,30])for(const cities of [2,3,4])for(const npcWorkers of [1,3]){
 test('integrated roles '+population+' players / '+cities+' cities / '+npcWorkers+' NPC',()=>{
  const w=integratedRun({population,cities,npcWorkers});
  assert.equal(storyStats(w).moneyTotal,w.sourceCash);validate(w);
 });
}
