import test from 'node:test';
import assert from 'node:assert/strict';
import {RULES,createFederation,dayStep,federationRun,checkFederation,federationMetrics} from './federation-model.mjs';
const options={agents:20,cityCount:3,environment:'normal',logistics:'trade',days:360};
const scenario=(foodMarket,environment='normal')=>federationMetrics(federationRun({...options,foodMarket,environment}));
const measure=(m)=>({unmet:m.food.unmet,noCash:m.food.noCash,noFood:m.food.noFood,treasury:m.economy.cityMoney,subsidy:m.food.subsidiesSpent,helped:m.food.subsidized,zero:m.food.zeroWalletMeals,
 worst:Math.max(...m.residentFood.map(p=>p.unmet)),neverHelped:m.residentFood.filter(p=>p.helped===0).length});
test('G01 personal meal ledger reconciles to city and entire world',()=>{
 for(const foodMarket of ['municipal','consignment','cooperative','cooperative-basic','cooperative-guarded']){
 const m=scenario(foodMarket);
 assert.equal(m.residentFood.reduce((n,p)=>n+p.needs,0),m.food.needs);
 assert.equal(m.residentFood.reduce((n,p)=>n+p.eaten,0),m.food.eaten);
 assert.equal(m.residentFood.reduce((n,p)=>n+p.unmet,0),m.food.unmet);
 assert.equal(m.economy.moneyTotal,3600);
 }
});
test('G02 every city/week welfare payment is bounded and all treasuries nonnegative',()=>{
 for(const env of ['normal','dry','wet']){
 const m=scenario('cooperative-guarded',env);
 for(const c of m.cityRows){
  assert.ok(c.treasury>=0);
  assert.ok(Object.values(c.weeklyWelfare).every(v=>v<=RULES.welfareWeeklyLimit));
 }
 }
});
test('G03 no phantom food and no PAPER issuance after full year with guarded grants',()=>{
 const w=federationRun({...options,foodMarket:'cooperative-guarded'});
 checkFederation(w);
 const m=federationMetrics(w);
 assert.equal(m.economy.moneyTotal,3600);
 assert.equal(m.food.needs,m.food.eaten+m.food.unmet);
 assert.equal(m.minerals.WOOD_INITIAL,m.minerals.WOOD_STOCK+m.minerals.WOOD_IN_BUILDINGS);
});
test('G04 spent subsidies reflect actual physical meals and belong to residents',()=>{
 const m=scenario('cooperative-guarded');
 assert.ok(m.food.subsidiesSpent<=3*m.food.subsidized);
 assert.equal(m.residentFood.reduce((n,p)=>n+p.helped,0),m.food.subsidized);
 assert.ok(m.residentFood.every(p=>p.helped<=p.eaten));
});
test('G05 subsidy cannot spend below reserve on a depleted local treasury',()=>{
 const w=createFederation({agents:10,cityCount:2,foodMarket:'cooperative-guarded'});
 const city=w.cities[0],resident=w.players.find(p=>p.cityId===city.id);
 const moved=city.treasury-(RULES.welfareMinTreasury+1);city.treasury-=moved;w.players[1].wallet+=moved;
 const stolen=resident.wallet;resident.wallet=0;w.players[1].wallet+=stolen;
 city.carrots=[{at:w.day,qty:8,ownerId:w.players[2].id}];city.stock.CARROT=8;w.grown.CARROT=8;
 checkFederation(w);dayStep(w);checkFederation(w);
 assert.equal(city.subsidizedZeroWallet,0,'must refuse zero-wallet grant when it would cross reserve');
 assert.ok(city.treasury>=RULES.welfareMinTreasury);
});
test('G06 zero-wallet aid uses finite daily capacity, not unbounded automatic awards',()=>{
 const w=federationRun({...options,foodMarket:'cooperative-guarded'});
 assert.ok(w.cities.every(c=>c.subsidizedZeroWallet<=options.days));
 checkFederation(w);
});
test('G07 compare budget and citizen welfare side by side, do not encode hoped-for outcome as a PASS',()=>{
 const results=Object.fromEntries(['consignment','cooperative','cooperative-basic','cooperative-guarded'].map(k=>[k,measure(scenario(k))]));
 console.log('FAIRNESS_BUDGET_NORMAL',JSON.stringify(results));
 assert.equal(Object.keys(results).length,4);
});
test('G08 drought outcome and fairness data are recorded separately',()=>{
 const results=Object.fromEntries(['consignment','cooperative-basic','cooperative-guarded'].map(k=>[k,measure(scenario(k,'dry'))]));
 console.log('FAIRNESS_BUDGET_DRY',JSON.stringify(results));
 assert.equal(Object.keys(results).length,3);
});
for(const activity of ['daily','weekends'])
 for(const environment of ['normal','dry','wet'])
  for(const agents of [10,15,20])
   for(const cityCount of [2,3,4])
    for(const days of [60,180,360]){
     test('GUARD '+activity+' / '+environment+' / '+agents+' people / '+cityCount+' cities / +'+days,()=>{
      const w=federationRun({foodMarket:'cooperative-guarded',activity,environment,agents,cityCount,logistics:'trade',days});
      checkFederation(w);
      const m=federationMetrics(w);
      assert.equal(m.economy.moneyTotal,3600);
      assert.ok(m.cityRows.every(c=>c.treasury>=0));
      assert.equal(m.residentFood.reduce((n,p)=>n+p.unmet,0),m.food.unmet);
     });
    }
