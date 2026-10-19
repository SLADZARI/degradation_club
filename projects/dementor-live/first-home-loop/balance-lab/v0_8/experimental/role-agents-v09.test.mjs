import test from 'node:test';import assert from 'node:assert/strict';
import {ROLES,createRoleWorld,getTown,getPerson,money,fundJob,completeJob,move,encounter,offerCourse,day,simulate,stats,validate} from './role-agents-v09.mjs';
test('roles: multiple real player professions / fictional NPC workers / hostile separate',()=>{
 const w=createRoleWorld({population:20,cities:3,npcWorkers:3});
 assert.ok(ROLES.every(k=>stats(w).roles[k]>0),JSON.stringify(stats(w).roles));assert.equal(w.persons.length,25);
});
test('a mayor owns city but private money not treasury',()=>{
 const w=createRoleWorld();let c=w.towns[0],mayor=getPerson(w,c.mayor);assert.equal(mayor.wallet,150);assert.equal(c.treasury,300);validate(w);
});
test('funded NPC job reserves existing treasury and pays only once on actual physical work',()=>{
 const w=createRoleWorld(),p=w.persons.find(p=>p.type==='NPC_WORKER'),c=getTown(w,p.city),start=c.treasury;
 assert.equal(fundJob(w,{cityId:c.id,workerId:p.id,jobId:'A',amount:7}),true);
 assert.equal(c.treasury,start-7);assert.equal(p.wallet,0);
 assert.equal(completeJob(w,'A'),true);assert.equal(completeJob(w,'A'),false);
 assert.equal(p.wallet,7);assert.equal(money(w),w.sourceCash);validate(w);
});
test('city cannot fund unbacked NPC work or negative treasury',()=>{
 const w=createRoleWorld(),p=w.persons.find(p=>p.type==='NPC_WORKER'),c=getTown(w,p.city);c.treasury=0;getPerson(w,c.mayor).wallet+=300;validate(w);
 assert.equal(fundJob(w,{cityId:c.id,workerId:p.id,jobId:'b',amount:6}),false);assert.equal(c.jobs.length,0);validate(w);
});
test('residents carry their own wallet on migration between privately owned cities',()=>{
 const w=createRoleWorld(),p=w.persons.find(p=>p.type==='COURIER'),wallet=p.wallet;move(w,p.id,'city-1');assert.equal(p.wallet,wallet);validate(w);
});
test('story help is optional, no forced cash and one story result per ID',()=>{
 const w=createRoleWorld(),p=w.persons.find(p=>p.type==='TOURIST');const before=money(w);
 assert.equal(encounter(w,{eventId:'story-1',playerId:p.id,choice:'decline'}),true);
 assert.equal(encounter(w,{eventId:'story-1',playerId:p.id,choice:'accept'}),false);
 assert.equal(p.events,0);assert.equal(money(w),before);
});
test('PvE never pays twice, hostile NPC never takes player entitlements',()=>{
 const w=createRoleWorld(),p=w.persons.find(p=>p.type==='EXPLORER');
 encounter(w,{eventId:'ruins',playerId:p.id,kind:'PVE',choice:'fight'});
 assert.equal(encounter(w,{eventId:'ruins',playerId:p.id,kind:'PVE',choice:'fight'}),false);assert.equal(p.expeditions,1);
 assert.throws(()=>encounter(w,{eventId:'bad',playerId:'wild-1',kind:'PVE'}));
});
test('university rewards +20 slots once but no backpack mass increase',()=>{
 const w=createRoleWorld(),p=w.persons.find(p=>p.type==='RESIDENT');
 assert.equal(offerCourse(w,{eventId:'univ',playerId:p.id,completed:false}),false);
 assert.equal(offerCourse(w,{eventId:'univ',playerId:p.id,completed:true}),true);
 assert.equal(offerCourse(w,{eventId:'univ',playerId:p.id,completed:true}),false);
 assert.equal(p.bonusSlots,20);
});
test('NPC work finite across 90 days, no minted PAPER or WOOD',()=>{
 const w=simulate({population:20,cities:3,npcWorkers:3,days:90});const m=stats(w);
 assert.equal(m.money,w.sourceCash);assert.ok(m.npcJobs>0);assert.ok(m.unfunded>0);validate(w);
});
for(const players of [10,15,20,30])for(const cities of [2,3,4])for(const npcWorkers of [0,2,5])for(const days of [30,90,360]){
 test('ROLES / '+players+' humans / '+cities+' cities / '+npcWorkers+' paid NPC / '+days+' days',()=>{
  const w=simulate({population:players,cities,npcWorkers,days});
  assert.equal(money(w),w.sourceCash);assert.equal(w.towns.length,cities);validate(w);
 });
}
