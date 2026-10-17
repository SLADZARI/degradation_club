// DEMENTOR LIVE GA04 - reproducible standalone Node.js runner (no npm dependencies).
// node unified_city_test_runner.js
// Validates only synthetic design fixtures; not real game or database transactions.
const assert=require("node:assert/strict");
const {runCity,runMatrix}=require("./unified_city_simulator.js");
const suite=runMatrix();
assert.equal(suite.scenarios,16);
assert.equal(suite.assertions,208);
assert.equal(suite.deterministicReplay,true);
for(const s of suite.results)assert.ok(Object.values(s.invariants).every(Boolean),s.name);
const base=suite.results.find(x=>x.name==="BASE_100_1");
assert.equal(base.outcomes.homes,100);
assert.equal(base.outcomes.paperSold,0); // design finding, NOT desirable behavior
assert.equal(base.outcomes.farmersCraftedAtLeast6,100);
const seven=suite.results.find(x=>x.name==="BASE_100_7");
assert.equal(seven.outcomes.sellersWithSales,15);
assert.equal(seven.outcomes.activeWithZeroSales,85);
const deadlocked=suite.results.find(x=>x.name==="100_TREASURY10K");
assert.equal(deadlocked.outcomes.homes,0); // expected synthetic liquidity deadlock
const staggered=suite.results.find(x=>x.name==="100_STAGGERED10K");
assert.equal(staggered.outcomes.homes,100);
const min6=runCity({n:100,days:7,treasury:50000,shipMin:6});
assert.equal(min6.outcomes.paperSold,436);
assert.equal(min6.outcomes.sellersWithSales,27);
assert.ok(Object.values(min6.invariants).every(Boolean));
process.stdout.write("GA04 SYNTHETIC PASS: 16 primary scenarios, 208 repeated invariants, 8 case-level checks, plus 13 from one min-shipment case.\\n");
