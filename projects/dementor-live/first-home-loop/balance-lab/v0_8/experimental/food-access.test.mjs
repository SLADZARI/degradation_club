import test from 'node:test';
import assert from 'node:assert/strict';
import {createFederation,federationRun,checkFederation,federationMetrics,federationBalances,dayStep} from './federation-model.mjs';
const run=(policy,weather='normal',days=360)=>federationMetrics(federationRun({agents:20,cityCount:3,environment:weather,logistics:'trade',foodMarket:policy,days}));
test('A01 all policies preserve exactly 3600 PAPER and physical crops across a year',()=>{
 for(const policy of ['municipal','consignment','cooperative'])
  for(const env of ['normal','dry','wet']){
   const s=federationRun({agents:20,cityCount:3,environment:env,logistics:'trade',foodMarket:policy,days:360});
   assert.equal(federationBalances(s).PAPER,3600);checkFederation(s);
  }
});
test('A02 cooperative food is paid at full grower price with no city money minting',()=>{
 const x=run('cooperative');
 assert.ok(x.food.subsidized>0,'No targeted assistance happened');
 assert.ok(x.food.subsidiesSpent>=x.food.subsidized);
 assert.ok(x.food.subsidiesSpent<=2*x.food.subsidized,'Per-meal support cannot exceed 2 PAPER');
 assert.equal(x.economy.moneyTotal,3600);
});
test('A03 municipal subsidies are optional, never negative, no credit or forced fees',()=>{
 const s=createFederation({agents:10,cityCount:2,foodMarket:'cooperative'});
 s.cities[0].treasury=0;s.players[0].wallet+=900;
 // City 0 originally had 900 PAPER: shift to actual registered player.
 checkFederation(s);
 for(let i=0;i<30;i++)dayStep(s);
 checkFederation(s);
 assert.ok(s.cities.every(c=>c.treasury>=0));
});
test('A04 physical food provenance and citizen owned produce survive JSON restart',()=>{
 const s=federationRun({agents:15,cityCount:3,foodMarket:'cooperative',days:45});
 const restored=JSON.parse(JSON.stringify(s));checkFederation(restored);
 for(let i=0;i<50;i++)dayStep(restored);
 assert.equal(federationMetrics(restored).economy.moneyTotal,3600);
 checkFederation(restored);
});
test('A05 affordability aid should reduce no-cash hunger relative to farmer-only consignment',()=>{
 const c=run('cooperative'),b=run('consignment');
 assert.ok(c.food.noCash<=b.food.noCash,
   'targeted 1/2 PAPER assistance must not worsen affordability in matched normal scenario');
});
for(const env of ['normal','dry','wet'])
 for(const pop of [10,15,20])
  for(const cities of [2,3,4])
   for(const days of [60,180,360]){
    test('COOP '+env+' / '+pop+' agents / '+cities+' cities / +'+days,()=>{
     const s=federationRun({agents:pop,cityCount:cities,environment:env,logistics:'trade',foodMarket:'cooperative',days});
     const m=federationMetrics(s);
     assert.equal(m.economy.moneyTotal,3600);
     assert.equal(m.food.noCash+m.food.noFood,m.food.unmet);
     assert.equal(m.food.needs,m.food.eaten+m.food.unmet);
     assert.ok(m.cityRows.every(c=>c.treasury>=0));
     checkFederation(s);
    });
   }
