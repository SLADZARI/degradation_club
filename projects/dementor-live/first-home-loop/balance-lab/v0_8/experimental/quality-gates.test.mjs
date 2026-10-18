import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {simulate,metrics,SETTINGS,check} from './shadow-model.mjs';
const B0=JSON.parse(readFileSync(new URL('./BASELINE_B0_108_SUMMARY.json',import.meta.url),'utf8'));
const B1=JSON.parse(readFileSync(new URL('./B1_PROPAGATION_108_SUMMARY.json',import.meta.url),'utf8'));
const past=(baseline,policy)=>baseline.normal3.find(p=>p.policy===policy).normalThreeAgents.at(-1);
const run=(extra={})=>metrics(simulate({agents:3,environment:'normal',policy:'needs-growth',days:90,activity:'daily',...extra}));
test('quality: avoid regressing behind the B0 first shadow sustainability trial',()=>{
  const current=run(),b=past(B0,'needs-growth');
  assert.ok(current.food.unmet<b.foodUnmet,'food access worse than B0');
  assert.ok(current.food.spoiled<b.foodSpoiled*2+1,'food spoilage abnormal relative to B0');
  assert.ok(current.sheets.made>b.paperMade,'paper chain has stalled');
});
test('quality: B1 seed-propagation benchmark improves household access',()=>{
 const now=run(),b=past(B1,'needs-growth');
 assert.ok(now.food.unmet<b.foodUnmet,'new six-bed architecture is a food regression');
 assert.ok(now.sheets.made>=b.paperMade,'paper throughput regressed');
 assert.ok(now.food.spoiled<=b.foodSpoiled,'food spoilage regressed');
});
test('quality: finite construction is triggered by real modeled losses, not arbitrary time ticks',()=>{
 const g=run();
 assert.deepEqual(g.buildings.new,['pantry','irrigation']);
 const staticMode=run({policy:'static'});
 assert.equal(staticMode.buildings.completed,0);
 assert.equal(staticMode.demand.posted,0);
 assert.equal(staticMode.money.city,SETTINGS.cityPAPER);
});
test('quality: demand and products remain funded/physical in normal 90-day schedule',()=>{
 const m=run();
 assert.equal(m.money.total,3600);
 assert.equal(m.demand.unfunded,0);
 assert.ok(m.demand.posted>m.demand.filled);
 assert.ok(m.demand.filled>80);
 assert.ok(m.sheets.made>30);
 assert.equal(m.sheets.made-m.sheets.used-m.sheets.stock,0);
 assert.equal(Object.values(m.accounting).filter((v,i)=>i>0&&v!==0).length,0);
});
test('quality: dry-weather scarcity cannot be hidden by balancing aggregate funds',()=>{
 const dry=run({environment:'dry'}),normal=run();
 assert.ok(dry.food.unmet>normal.food.unmet*3);
 assert.ok(dry.demand.expired>normal.demand.expired);
 assert.equal(dry.money.total,3600);
});
test('quality: no daily starvation debt is accumulated during offline weekend-profile days',()=>{
 const daily=run(),weekend=run({activity:'weekends'});
 assert.equal(daily.food.mealNeeds,270);
 assert.equal(weekend.food.mealNeeds,78);
 assert.equal(daily.food.mealNeeds,daily.food.eaten+daily.food.unmet);
 assert.equal(weekend.food.mealNeeds,weekend.food.eaten+weekend.food.unmet);
 assert.ok(weekend.food.unmet<daily.food.unmet);
});
test('quality: plots have six finite beds, public crates capped and still conserve every item',()=>{
 const s=simulate({agents:5,environment:'normal',policy:'needs-growth',days:90});
 assert.ok(s.players.every(p=>Object.keys(p.plotBeds).length===6));
 assert.ok(s.players.every(p=>p.civicBatches.reduce((n,b)=>n+b.qty,0)<=SETTINGS.civicCrateCapacity));
 check(s);
});
