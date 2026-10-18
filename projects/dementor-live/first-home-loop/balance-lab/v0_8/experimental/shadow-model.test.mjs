import test from 'node:test';
import assert from 'node:assert/strict';
import {MODEL_ID,SETTINGS,simulate,step,check,balance,metrics,submitDemand,tradeHemp} from './shadow-model.mjs';

// A new experimental shadow simulator, NOT the historical 52 original v0.8 tests.
// Additional independent safeguards should fail when assets or PAPER disappear/duplicate.
const c={agents:3,environment:'normal',policy:'upkeep'};
const projection=extras=>simulate({...c,...extras});

test('00. explicit provenance prevents confusing shadow projection with 52 historical tests',()=>{
  const a=projection({days:1});
  assert.match(a.schema,/shadow-sustainability/);
  assert.match(a.source,/synthetic/);
  assert.notEqual(a.schema,'DL_BALANCE_CASE/0.8');
  assert.equal(MODEL_ID,a.schema);
});
test('01. PAPER balance holds for each mode when city cannot fund demand',()=>{
  const t=projection({days:90,environment:'treasury'});
  const m=metrics(t);
  assert.equal(m.money.total,m.money.city+m.money.players+m.money.escrow);
  assert.equal(m.money.total,3600);
  assert.ok(m.demand.unfunded>0,'small treasury should reject unfunded public buyouts');
  assert.equal(Object.keys(m.accounting).filter(k=>k!=='PAPER'&&m.accounting[k]!==0).length,0);
});
test('02. static future creates no project-completion replay nor speculative unlimited city orders',()=>{
  const t=projection({days:90,policy:'static'});
  const m=metrics(t);
  assert.equal(m.demand.posted,0);
  assert.equal(m.demand.paid,0);
  assert.equal(m.sheets.made,0);
  assert.equal(m.buildings.completed,0);
  assert.equal(m.money.city,SETTINGS.cityPAPER);
});
test('03. finite upkeep events post fresh ID for each service and cannot reissue same event twice',()=>{
  const t=projection({days:8});
  const m=metrics(t);
  assert.equal(t.orders.length,12,'two events x three buildings x two SKUs');
  assert.equal(new Set(t.postedEvents).size,t.postedEvents.length);
  const before=t.city;
  const result=submitDemand(t,'public-session:square:0','CARROT',1,3);
  assert.equal(result,null);
  assert.equal(t.city,before);
  assert.equal(t.orders.length,12);
});
test('04. funded order escrows PAPER and does not mint money',()=>{
  const s=projection({days:1});
  const before=metrics(s).money;
  const order=submitDemand(s,'manual-event:test-offer','CARROT',2,3);
  assert.ok(order);
  assert.equal(order.escrow,order.remaining*order.unitPrice);
  assert.equal(s.city,before.city-6);
  assert.equal(metrics(s).money.total,before.total);
  const again=submitDemand(s,'manual-event:test-offer','CARROT',2,3);
  assert.equal(again,null);
  assert.equal(order.escrow,6);
});
test('05. demand cannot be posted twice after failure to fund',()=>{
  const s=projection({days:1,environment:'treasury'});
  const before=s.city;
  const result=submitDemand(s,'costly:one-off','PAPER_SHEET',100,12);
  assert.equal(result,null);
  assert.equal(s.city,before);
  assert.equal(submitDemand(s,'costly:one-off','PAPER_SHEET',100,12),null);
  assert.equal(s.postedEvents.filter(x=>x==='costly:one-off:PAPER_SHEET').length,1);
});
test('06. ledger rejects counterfeit PAPER and depleted carrots',()=>{
  const s=projection({days:5});
  s.city++;
  assert.throws(()=>check(s),/PAPER minted/);
  s.city--;
  check(s);
  s.produced.CARROT++;
  assert.throws(()=>check(s),/CARROT accounting/);
});
test('07. storage cap and natural material use preserve physical stocks',()=>{
  const s=projection({days:90,policy:'needs-growth'});
  check(s);
  assert.ok(s.players.every(p=>p.hemp+p.sheets+p.carrotBatches.reduce((n,b)=>n+b.qty,0)<=12));
  assert.equal(s.wood+s.embodied.WOOD,s.woodInitial);
  assert.equal(s.stone+s.embodied.STONE,s.stoneInitial);
  assert.ok(s.projects.every(name=>['pantry','irrigation'].includes(name)));
});
test('08. a real consented P2P sale is atomic, never repeated by offerId',()=>{
  const s=projection({days:1,policy:'static'});
  const from=s.players[0],to=s.players[1],beforeWallets=[from.wallet,to.wallet],beforeHemp=[from.hemp,to.hemp];
  const offer={offerId:'trade-01',seller:from.id,buyer:to.id,quantity:2,pricePerUnit:3,accepted:true,online:true};
  const first=tradeHemp(s,offer);
  assert.equal(first.status,'COMMITTED');
  assert.deepEqual(first.steps,['PROPOSED','ACCEPTED','SALE','COMMITTED']);
  assert.deepEqual([from.wallet,to.wallet],[beforeWallets[0]+6,beforeWallets[1]-6]);
  assert.deepEqual([from.hemp,to.hemp],[beforeHemp[0]-2,beforeHemp[1]+2]);
  assert.equal(tradeHemp(s,offer),first);
  assert.equal(s.trades.length,1);
  check(s);
});
test('09. no trade if buyer offline or consent missing; no money or resources move',()=>{
  const s=projection({days:1,policy:'static'});
  const before=JSON.stringify(s.players);
  const params={offerId:'trade-02',seller:s.players[0].id,buyer:s.players[1].id,quantity:2,accepted:true,online:false};
  assert.equal(tradeHemp(s,params).status,'REJECTED');
  assert.equal(tradeHemp(s,{...params,offerId:'trade-03',online:true,accepted:false}).status,'REJECTED');
  assert.equal(JSON.stringify(s.players),before);
  check(s);
});
test('10. early spoilage justifies finite pantry intervention; no phantom building in upkeep',()=>{
  const p=metrics(projection({days:90,policy:'needs-growth'}));
  const b=metrics(projection({days:90,policy:'upkeep'}));
  assert.ok(p.buildings.new.includes('pantry'),'spoilage must trigger pantry by policy');
  assert.equal(b.buildings.completed,0);
  assert.ok(p.buildings.completed<=2);
  assert.ok(p.food.spoiled<=b.food.spoiled,'pantry should not increase spoilage');
});
test('11. dry shock exposes greater food shortage than normal weather',()=>{
  const normal=metrics(projection({days:60,environment:'normal'}));
  const dry=metrics(projection({days:60,environment:'dry'}));
  assert.ok(dry.food.unmet>=normal.food.unmet);
  assert.ok(dry.block.waitingResource>=normal.block.waitingResource);
});
test('12. shortage triggers only explicitly registered finite projects, never fake recurring new buildings',()=>{
  const x=metrics(projection({days:90,policy:'needs-growth',environment:'dry'}));
  assert.ok(x.buildings.completed<=2);
  assert.equal(new Set(x.buildings.new).size,x.buildings.new.length);
  assert.equal(x.money.total,3600);
});
test('13. orders are finite and refunds preserve total PAPER',()=>{
  const s=projection({days:60,environment:'dry',policy:'upkeep'});
  assert.ok(s.orders.every(o=>Number.isSafeInteger(o.remaining)&&Number.isSafeInteger(o.escrow)));
  assert.ok(s.orders.some(o=>o.status==='EXPIRED'),'dry scenario should leave at least one expired order');
  assert.equal(metrics(s).money.total,3600);
  check(s);
});
test('14. serialization / restart cannot introduce PAPER or goods',()=>{
  const before=projection({days:37,policy:'needs-growth',environment:'dry'});
  // The shadow simulator is deliberately fully JSON serializable.
  const clone=JSON.parse(JSON.stringify(before));
  assert.deepEqual(balance(clone),balance(before));
  check(clone);
  for(let i=0;i<20;i++)step(clone);
  check(clone);
  assert.equal(metrics(clone).money.total,3600);
});
test('15. model assumptions are clearly TEST and not a game rule',()=>{
  assert.equal(SETTINGS.carrotShelfDays,1);
  assert.equal(SETTINGS.pantryShelfDays,3);
  assert.equal(SETTINGS.maintenanceIntervalDays,7);
  assert.equal(SETTINGS.oldProjects,3);
  assert.deepEqual(SETTINGS.experiments,['static','upkeep','needs-growth']);
});
for(const activity of SETTINGS.activityProfiles){
 for(const policy of SETTINGS.experiments){
 for(const environment of SETTINGS.environments){
  for(const agents of [3,4,5]){
   for(const days of [30,60,90]){
    test(`PROJECTION ${activity} / ${policy} / ${environment} / ${agents} agents / +${days} days`,()=>{
      const s=simulate({policy,environment,agents,days,activity});
      check(s);
      const m=metrics(s);
      assert.equal(m.day,30+days);
      assert.equal(m.money.total,3600);
      assert.ok(s.orders.every(o=>o.escrow===o.remaining*o.unitPrice));
      assert.equal(m.accounting.CARROT,0);
      assert.equal(m.accounting.PAPER_SHEET,0);
      assert.equal(m.accounting.HEMP,0);
    });
   }
  }
 }
}}

test('16. hunger needs exist only during active synthetic sessions',()=>{
 const daily=metrics(simulate({agents:3,environment:'normal',policy:'needs-growth',days:90,activity:'daily'}));
 const weekend=metrics(simulate({agents:3,environment:'normal',policy:'needs-growth',days:90,activity:'weekends'}));
 assert.equal(daily.food.mealNeeds,270);
 assert.ok(weekend.food.mealNeeds<daily.food.mealNeeds);
 assert.equal(weekend.food.mealNeeds,weekend.food.eaten+weekend.food.unmet);
 assert.equal(daily.food.mealNeeds,daily.food.eaten+daily.food.unmet);
});
test('17. normal 90-day progression still has no money or carrot losses after off-hours',()=>{
 const s=simulate({agents:3,environment:'normal',policy:'needs-growth',days:90,activity:'weekends'});
 check(s);
 assert.equal(metrics(s).money.total,3600);
 assert.ok(s.projects.length<=2);
});
