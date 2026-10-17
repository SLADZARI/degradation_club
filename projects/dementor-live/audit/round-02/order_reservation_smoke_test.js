// DEMENTOR LIVE GA-02: synthetic purchase-order reservations, NOT the game server.
const assert=require("node:assert/strict");
const {runFiniteScenario}=require("./finite_economy_simulator_v0_3_reserved_orders.js");
const s=(options)=>runFiniteScenario({crop:"HEMP",backpressure:true,reserveCityOrders:true,fairDispatch:true,...options});
const inFlight=s({farms:1,days:1,deliveryIntervalMinutes:1380,deliveryTripMinutes:90});
assert.ok(inFlight.cityMoneyHeldEscrow>0 && inFlight.cityPendingSheets>0);
assert.ok(inFlight.checks.moneyConserved);
assert.ok(inFlight.checks.sheetsConserved);
for(const k of ["cityPaperDemandPerRealDay","cityPaperSpendCapPerRealDay","cityPaperStorageCapacity"]){
 const o=s({farms:1,days:1,[k]:0});assert.equal(o.papersSold,0);assert.equal(o.shipments,0);
}
for(const n of [20,100]){
 const base=runFiniteScenario({crop:"HEMP",farms:n,days:30,backpressure:true});
 const improved=s({farms:n,days:30});
 assert.ok(improved.zeroSaleFarmCount<base.zeroSaleFarmCount);
 assert.ok(improved.checks.moneyConserved&&improved.papersSold<=30*64);
}
process.stdout.write("10/10 synthetic order reservation assertions PASS\\n");
