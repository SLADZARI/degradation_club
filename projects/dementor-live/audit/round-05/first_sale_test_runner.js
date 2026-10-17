// DEMENTOR LIVE GA05 — deterministic policy smoke test, runnable with Node.js.
// Run: node first_sale_test_runner.js
// Synthetic design model only; does not test PostgreSQL, actual game runtime or multiplayer.
const assert=require("node:assert/strict");
const {runCity,runMatrix}=require("./first_sale_unified_city_simulator.js");
const GA04=runMatrix();
assert.equal(GA04.scenarios,16);
for(const s of GA04.results)assert.ok(Object.values(s.invariants).every(Boolean),s.name);
function scenario(n,days,extra={}){
 const q=runCity({n,days,firstSaleMode:"FUNDED_6",...extra});
 assert.ok(Object.values(q.invariants).every(Boolean),"bad ledger "+JSON.stringify({n,days,extra}));
 return q.outcomes;
}
const one=scenario(1,1),twenty=scenario(20,1),
  hundredDay=scenario(100,1),hundredWeek=scenario(100,7);
assert.equal(one.firstSpecialSales,1);
assert.equal(twenty.firstSpecialSales,20);
assert.equal(hundredDay.firstSpecialSales,96);
assert.equal(hundredWeek.firstSpecialSales,100);
assert.equal(hundredWeek.playersWithAnySale,100);
assert.equal(hundredWeek.firstHubConsumed,600);
assert.equal(hundredWeek.firstHeldFunds,0);
assert.equal(hundredWeek.medianFirstSaleRealMin,915);
const noPolicy=runCity({n:100,days:7});
assert.equal(noPolicy.outcomes.sellersWithSales,15);
assert.equal(scenario(100,7,{firstSaleBudget:900}).firstSpecialSales,50);
assert.equal(scenario(100,7,{firstSaleBudget:0}).firstSpecialSales,0);
assert.equal(scenario(100,7,{firstSaleHubConsumePerHour:0}).firstSpecialSales,21);
assert.equal(scenario(100,7,{firstSaleGraceMinutes:60}).firstSpecialSales,0);
assert.equal(scenario(100,7,{treasury:10000}).firstOffers,0);
assert.equal(scenario(100,7,{treasury:10000,arrivalEvery:30}).firstSpecialSales,100);
assert.equal(scenario(100,7,{cityWood:120,citySheets:80}).firstOffers,20);
assert.deepEqual(scenario(100,7),scenario(100,7),"same input deterministic");
console.log("GA05 PASS: regression16, core first-sale checks, boundaries, replay and conservation. Synthetic only.");
