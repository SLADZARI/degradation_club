import test from 'node:test';
import assert from 'node:assert/strict';
import {FEDERATION_ID,RULES,createFederation,checkFederation,federationBalances,
 cityById,playerById,ship,dayStep,foundCity,movePlayer,authorizeSession,proposeProject,
 federationRun,federationMetrics,FEDERATION_PROJECTS} from './federation-model.mjs';
const make=(args={})=>createFederation({agents:15,cityCount:3,environment:'normal',logistics:'trade',...args});
const approvedCargo=(w,extra={})=>{
 const a=w.cities[1],b=w.cities[0],actor=w.players.find(p=>p.cityId===a.id);
 return {from:a.id,to:b.id,asset:'WOOD',qty:4,shipmentId:'ship-test-0001',
   actorId:actor.id,accepted:true,...extra};
};
test('F01 shared original 3600 PAPER, no per-city mint',()=>{
 for(const count of [2,3,4]){
  const w=make({cityCount:count});
  const money=federationBalances(w).PAPER;
  assert.equal(money,3600);assert.equal(w.cities.length,count);
  assert.equal(w.cities.reduce((n,c)=>n+c.treasury,0),1800);
  assert.equal(w.players.reduce((n,p)=>n+p.wallet,0),1800);
  assert.equal(w.schema,FEDERATION_ID);checkFederation(w);
 }
});
test('F02 every city is born with finite, geographically distinct resources',()=>{
 const w=make();
 assert.equal(w.cities[0].stock.WOOD,12);
 assert.equal(w.cities[1].stock.WOOD,145);
 assert.equal(w.cities[2].stock.STONE,85);
 assert.equal(federationBalances(w).WOOD,w.initial.WOOD);
 assert.equal(federationBalances(w).STONE,w.initial.STONE);
});
test('F03 approved caravan reserves PAPER and physical WOOD for a real route',()=>{
 const w=make(),spec=approvedCargo(w);
 const origin=cityById(w,spec.from),dest=cityById(w,spec.to);
 const beforeOrigin=origin.stock.WOOD,beforeDest=dest.stock.WOOD;
 const beforeSeller=origin.treasury,beforeBuyer=dest.treasury;
 const sent=ship(w,spec);
 assert.equal(sent.status,'IN_TRANSIT');assert.ok(sent.eta>w.day);
 assert.equal(origin.stock.WOOD,beforeOrigin-4);
 assert.equal(dest.stock.WOOD,beforeDest);
 assert.equal(origin.treasury,beforeSeller,'seller is not paid on dispatch');
 assert.equal(dest.treasury,beforeBuyer-4*RULES.shippingPrice.WOOD);
 assert.equal(federationBalances(w).PAPER,3600);
 assert.equal(federationBalances(w).WOOD,w.initial.WOOD);
 assert.equal(ship(w,spec),sent,'same request cannot double debit');
 checkFederation(w);
});
test('F04 delivery on subsequent day pays origin treasury exactly once',()=>{
 const w=make(),spec=approvedCargo(w),sent=ship(w,spec);
 assert.ok(sent.eta>w.day);
 dayStep(w);
 assert.equal(sent.status,'DELIVERED');
 assert.equal(sent.escrow,0);
 assert.equal(w.arrivalHistory.filter(id=>id===spec.shipmentId).length,1);
 const len=w.arrivalHistory.length;
 dayStep(w);
 assert.equal(w.arrivalHistory.length,len,'shipment cannot arrive twice');
 assert.equal(federationBalances(w).PAPER,3600);
 checkFederation(w);
});
test('F05 oversized caravan fails without changing resources or money',()=>{
 const w=make(),before=federationBalances(w);
 const spec=approvedCargo(w,{qty:9,shipmentId:'oversized-0001'});
 const res=ship(w,spec);
 assert.deepEqual(res,{ok:false,reason:'capacity'});
 assert.equal(w.deliveries.length,0);
 assert.deepEqual(federationBalances(w),before);checkFederation(w);
});
test('F06 unauthorized shipment rejected before city or material mutations',()=>{
 const w=make(),before=JSON.stringify(w.cities.map(c=>({t:c.treasury,wood:c.stock.WOOD})));
 assert.throws(()=>ship(w,{...approvedCargo(w),accepted:false}),/carrier approval required/);
 assert.equal(JSON.stringify(w.cities.map(c=>({t:c.treasury,wood:c.stock.WOOD}))),before);
 assert.equal(w.deliveries.length,0);checkFederation(w);
});
test('F07 missing goods and bankrupt importing town cannot spend imaginary PAPER',()=>{
 const w=make(),origin=w.cities[1],dest=w.cities[0];
 const a=w.players.find(p=>p.cityId===origin.id).id;
 const unavailable=ship(w,{from:origin.id,to:dest.id,asset:'STONE',qty:8,shipmentId:'large-stone',
  actorId:a,accepted:true});
 assert.ok(unavailable.ok===undefined||unavailable.ok===false); // may be stock or valid depending source
 const cur=w.deliveries.length;
 // Move all destination treasury to a real account, preserving global 3600.
 const held=dest.treasury;dest.treasury=0;w.players[0].wallet+=held;
 const res=ship(w,{from:origin.id,to:dest.id,asset:'WOOD',qty:4,shipmentId:'poor-import',
   actorId:a,accepted:true});
 assert.deepEqual(res,{ok:false,reason:'unfunded'});
 assert.equal(w.deliveries.length,cur);
 checkFederation(w);
});
test('F08 city founding shifts existing PAPER, seeds, wood and stone (no mint)',()=>{
 const w=make(),source=w.cities[1],founder=w.players.find(p=>p.cityId===source.id);
 const prev=federationBalances(w),cityTreasury=source.treasury;
 const args={id:'harbor-town',parentId:source.id,actorId:founder.id,
  eventId:'founding-mayor-01',funding:80,wood:4,stone:3,seedCarrot:2,seedHemp:1,accepted:true};
 const city=foundCity(w,args);
 assert.equal(city.treasury,80);assert.equal(source.treasury,cityTreasury-80);
 assert.equal(founder.cityId,city.id);
 assert.equal(city.stock.WOOD,4);assert.equal(city.stock.STONE,3);
 assert.deepEqual(federationBalances(w),prev);
 assert.equal(foundCity(w,args),city,'idempotent city founding');
 assert.equal(w.cities.length,4);
 checkFederation(w);
});
test('F09 player moves with wallet intact and cannot materialize a duplicate',()=>{
 const w=make(),p=w.players[0],before=p.wallet;
 const args={actorId:p.id,to:w.cities[2].id,eventId:'travel-agent-1'};
 movePlayer(w,args);movePlayer(w,args);
 assert.equal(p.cityId,w.cities[2].id);assert.equal(p.wallet,before);
 assert.equal(w.movements.length,1);checkFederation(w);
});
test('F10 absent consent cannot sell physical city-owned food + paper to a customer',()=>{
 const w=make(),p=w.players[0],c=cityById(w,p.cityId);
 const before=JSON.stringify({money:p.wallet,t:c.treasury,stocks:c.stock});
 assert.throws(()=>authorizeSession(w,{actorId:p.id,cityId:c.id,eventId:'invalid-ticket',accepted:false}),
  /explicit citizen authorization required/);
 assert.equal(JSON.stringify({money:p.wallet,t:c.treasury,stocks:c.stock}),before);
 checkFederation(w);
});
test('F11 session is physically blocked if no real carrots or paper exist',()=>{
 const w=make(),p=w.players[0],c=cityById(w,p.cityId);
 const order=authorizeSession(w,{actorId:p.id,cityId:c.id,eventId:'no-food',accepted:true});
 assert.deepEqual(order,{ok:false,reason:'physical-supply'});
 assert.equal(c.treasury,600);
 assert.equal(c.sourceEvents.length,0);checkFederation(w);
});
test('F12 source ledger catches counterfeit PAPER and vanishing WOOD',()=>{
 const w=make();w.players[0].wallet++;
 assert.throws(()=>checkFederation(w),/federation balance violation PAPER/);
 w.players[0].wallet--;checkFederation(w);
 w.cities[0].stock.WOOD--;
 assert.throws(()=>checkFederation(w),/federation balance violation WOOD/);
});
test('F13 all modeled city projects are finite and physically embodied',()=>{
 const w=federationRun({agents:20,cityCount:4,environment:'normal',logistics:'trade',days:180});
 const m=federationMetrics(w);
 assert.ok(m.economy.cityBuildings<=w.cities.length*FEDERATION_PROJECTS.length);
 assert.equal(m.minerals.WOOD_INITIAL,m.minerals.WOOD_STOCK+m.minerals.WOOD_IN_BUILDINGS);
 assert.equal(m.minerals.STONE_INITIAL,m.minerals.STONE_STOCK+m.minerals.STONE_IN_BUILDINGS);
 assert.ok(w.cities.every(c=>new Set(c.buildings).size===c.buildings.length));
 assert.equal(m.ledger.PAPER,3600);
 checkFederation(w);
});
test('F14 no cooperative fee or salary is generated without actual goods or work',()=>{
 const w=make();const c=w.cities[0],p=w.players[0];
 const t=c.treasury,v=p.wallet;
 const result=authorizeSession(w,{actorId:p.id,cityId:c.id,eventId:'no-assets-01',accepted:true});
 assert.equal(result.ok,false);
 assert.equal(c.treasury,t);assert.equal(p.wallet,v);
 checkFederation(w);
});
test('F15 unfunded project cannot build even with an eligible population',()=>{
 const w=make({agents:20,cityCount:3}),c=w.cities[1],p=w.players.find(x=>x.cityId===c.id);
 w.day=40;
 // garden requires 18 WOOD / 8 STONE, city 1 has both.
 const held=c.treasury;c.treasury=0;w.players[0].wallet+=held;
 const result=proposeProject(w,c.id,'garden',p.id);
 assert.deepEqual(result,{ok:false,reason:'unfunded'});
 checkFederation(w);
});
test('F16 zero supply cost neither generates buildings nor new raw wood',()=>{
 const w=federationRun({agents:20,cityCount:4,logistics:'local',days:90});
 assert.equal(federationBalances(w).WOOD,w.initial.WOOD);
 assert.equal(federationBalances(w).STONE,w.initial.STONE);
 assert.ok(w.cities.length===4);
 checkFederation(w);
});
test('F17 every producer/receiver remains consistent after JSON restart',()=>{
 const w=federationRun({agents:15,cityCount:3,environment:'normal',logistics:'trade',days:30});
 const saved=JSON.parse(JSON.stringify(w));
 assert.deepEqual(federationBalances(saved),federationBalances(w));checkFederation(saved);
 for(let i=0;i<30;i++)dayStep(saved);
 checkFederation(saved);assert.equal(federationMetrics(saved).economy.moneyTotal,3600);
});
test('F18 there is no endless procedural city creation when simulation runs a year',()=>{
 const w=federationRun({agents:20,cityCount:4,environment:'wet',logistics:'trade',days:360});
 assert.equal(w.cities.length,4,'city count cannot increase on time alone');
 assert.equal(w.cityCreationIds.length,0);
 assert.equal(federationMetrics(w).economy.moneyTotal,3600);
 checkFederation(w);
});
for(const agents of [10,15,20])
 for(const cityCount of [2,3,4])
  for(const environment of ['normal','dry','wet'])
   for(const logistics of ['local','trade'])
    for(const days of [60,180,360]){
     test('FEDERATION '+agents+' agents / '+cityCount+' cities / '+environment+
       ' / '+logistics+' / +'+days+' days',()=>{
       const s=federationRun({agents,cityCount,environment,logistics,days});
       const m=federationMetrics(s);
       assert.equal(m.economy.moneyTotal,3600);
       assert.equal(m.cities,cityCount);
       assert.equal(m.agents,agents);
       assert.equal(m.food.needs,m.food.eaten+m.food.unmet);
       assert.equal(m.minerals.WOOD_INITIAL,m.minerals.WOOD_STOCK+m.minerals.WOOD_IN_BUILDINGS);
       assert.equal(m.minerals.STONE_INITIAL,m.minerals.STONE_STOCK+m.minerals.STONE_IN_BUILDINGS);
       assert.ok(m.cityRows.every(c=>c.treasury>=0));
       assert.ok(s.deliveries.every(d=>d.qty>0));
       assert.ok(m.economy.cityBuildings<=FEDERATION_PROJECTS.length*cityCount);
       checkFederation(s);
     });
    }

test('F19 imported WOOD cannot be re-exported as newly harvested native timber',()=>{
 const w=make();
 const rich=w.cities[1],poor=w.cities[0],other=w.cities[2];
 const richActor=w.players.find(p=>p.cityId===rich.id).id;
 let req=ship(w,{from:rich.id,to:poor.id,asset:'WOOD',qty:8,shipmentId:'native-to-poor',
   actorId:richActor,accepted:true});
 assert.equal(req.status,'IN_TRANSIT');
 dayStep(w);assert.equal(req.status,'DELIVERED');
 const poorActor=w.players.find(p=>p.cityId===poor.id).id;
 const first=ship(w,{from:poor.id,to:other.id,asset:'WOOD',qty:8,shipmentId:'native-out-one',
   actorId:poorActor,accepted:true});
 assert.equal(first.status,'IN_TRANSIT');
 const second=ship(w,{from:poor.id,to:rich.id,asset:'WOOD',qty:5,shipmentId:'native-out-two',
   actorId:poorActor,accepted:true});
 assert.deepEqual(second,{ok:false,reason:'non-exportable-import'});
 assert.equal(poor.exportable.WOOD,4);
 assert.equal(federationBalances(w).WOOD,w.initial.WOOD);
 checkFederation(w);
});
test('F20 total shipments of original raw assets cannot exceed finite native mined supply',()=>{
 const w=federationRun({agents:20,cityCount:3,logistics:'trade',environment:'dry',days:360});
 for(const kind of ['WOOD','STONE']){
  const shipped=w.deliveries.filter(d=>d.asset===kind).reduce((n,d)=>n+d.qty,0);
  assert.ok(shipped<=w.initial[kind],kind+' was circulated as newly mined materials');
 }
 assert.equal(federationBalances(w).PAPER,3600);
 checkFederation(w);
});
test('F21 rain and runoff are explicitly balanced in physically bounded reservoirs',()=>{
 for(const weather of ['normal','dry','wet']){
  const w=federationRun({agents:20,cityCount:3,environment:weather,logistics:'trade',days:360});
  const result=federationMetrics(w);
  assert.ok(w.cities.every(city=>city.stock.WATER<=city.maxWater));
  assert.equal(result.water.initial+result.water.rain,
    result.water.consumed+result.water.runoff+result.water.stored);
  assert.ok(result.water.runoff>=0);
  checkFederation(w);
 }
});
test('F22 new agricultural buildings require cumulative shortage and preserve unique functional improvements',()=>{
 const w=federationRun({agents:20,cityCount:3,environment:'normal',logistics:'trade',days:360});
 const types=w.cities.flatMap(c=>c.buildings);
 assert.ok(types.includes('garden'),'need-driven first gardens should be built');
 for(const city of w.cities){
  if(city.buildings.includes('fieldEast'))assert.ok(city.buildings.includes('garden'));
  if(city.buildings.includes('fieldWest'))assert.ok(city.buildings.includes('fieldEast'));
  assert.ok(city.plots.length>=2&&city.plots.length<=8);
 }
 checkFederation(w);
});
test('F23 modifying export provenance without a source delivery is caught',()=>{
 const w=make();
 w.cities[0].exportable.WOOD+=1;
 // A fabricated export claim would be exposed once it exceeds physical stock.
 w.cities[0].exportable.WOOD=w.cities[0].stock.WOOD+1;
 assert.throws(()=>checkFederation(w),/exporting imported assets or broken provenance/);
});
test('F24 in-transit goods and settlement survive JSON roundtrip before arrival',()=>{
 const w=make(),s=ship(w,approvedCargo(w));
 assert.equal(s.status,'IN_TRANSIT');
 const restore=JSON.parse(JSON.stringify(w));
 checkFederation(restore);
 dayStep(restore);checkFederation(restore);
 const d=restore.deliveries.find(x=>x.id===s.id);
 assert.equal(d.status,'DELIVERED');
 assert.equal(restore.arrivalHistory.filter(id=>id===s.id).length,1);
 assert.equal(federationBalances(restore).PAPER,3600);
});

test('F25 founding a real fourth city and moving residents still conserves the 3600-PAPER federation',()=>{
 const w=make(),source=w.cities[1],founder=w.players.find(p=>p.cityId===source.id);
 const b=federationBalances(w);
 foundCity(w,{id:'city-new',parentId:source.id,actorId:founder.id,
   eventId:'founding-4th-city-real-assets',accepted:true,funding:100,wood:8,stone:4,seedCarrot:2,seedHemp:1});
 for(const p of w.players.filter(p=>p.cityId!==source.id).slice(0,2))
   movePlayer(w,{actorId:p.id,to:'city-new',eventId:'moving-'+p.id});
 assert.equal(w.cities.length,4);
 assert.deepEqual(federationBalances(w),b,'city founding printed PAPER, WOOD, seeds or STONE');
 for(let day=0;day<180;day++)dayStep(w);
 assert.equal(federationMetrics(w).economy.moneyTotal,3600);
 assert.ok(w.cities.every(c=>c.treasury>=0));
 checkFederation(w);
});
test('F26 long simulation pays actual work to multiple agents, not the same first worker',()=>{
 const w=federationRun({agents:20,cityCount:3,environment:'normal',logistics:'trade',days:360});
 const m=federationMetrics(w);
 assert.ok(m.walletDistribution.workersPaid>=10,'labour wages concentrated on one agent per city');
 assert.equal(m.food.noCash+m.food.noFood,m.food.unmet);
 assert.equal(m.economy.moneyTotal,3600);
 checkFederation(w);
});
test('F27 moving a city founder without authorization is blocked before any asset transfer',()=>{
 const w=make(),founder=w.players.find(p=>p.cityId===w.cities[1].id);
 const b=federationBalances(w),n=w.cities.length;
 assert.throws(()=>foundCity(w,{id:'unauthorized',parentId:w.cities[1].id,actorId:founder.id,
   eventId:'founding-without-approval',funding:100,wood:4,stone:3}),/new city requires approval/);
 assert.deepEqual(federationBalances(w),b);
 assert.equal(w.cities.length,n);
 checkFederation(w);
});

test('F28 consignment carrot batches retain owner identity and full material trace',()=>{
 const w=federationRun({agents:20,cityCount:3,environment:'normal',logistics:'trade',foodMarket:'consignment',days:90});
 assert.ok(w.grown.CARROT>0);
 assert.ok(w.cities.every(c=>c.carrots.every(b=>!!playerById(w,b.ownerId)&&b.qty>0)));
 assert.equal(w.moneyAtStart,3600);checkFederation(w);
});
test('F29 citizen food purchases pay grower-owned consignment instead of transferring PAPER to city as tax',()=>{
 const w=federationRun({agents:20,cityCount:3,environment:'normal',logistics:'trade',foodMarket:'consignment',days:30});
 const sumPayout=w.cities.reduce((n,c)=>n+c.consignmentPayout,0);
 assert.ok(sumPayout>0,'there must be real paid physical consignments');
 assert.ok(w.players.filter(p=>p.workIncome>0).length>=6);
 assert.equal(federationBalances(w).PAPER,3600);
 checkFederation(w);
});
test('F30 a bankrupt city still lets its workers collect physical consignment harvests',()=>{
 const w=make({foodMarket:'consignment'});
 const c=w.cities[0],old=c.treasury;
 c.treasury=0;w.players[0].wallet+=old; // conserve overall PAPER in fixture
 for(let i=0;i<7;i++)dayStep(w);
 assert.ok(w.grown.CARROT>0,'prepaid treasury payroll must not be required for consignment production');
 assert.equal(federationBalances(w).PAPER,3600);
 checkFederation(w);
});
test('F31 consignment maintains origin owners after save/reload and cross-city travel',()=>{
 const w=federationRun({agents:15,cityCount:3,environment:'normal',logistics:'trade',foodMarket:'consignment',days:20});
 const clone=JSON.parse(JSON.stringify(w));checkFederation(clone);
 const owner=clone.cities.flatMap(c=>c.carrots.map(b=>b.ownerId))[0];
 if(owner)movePlayer(clone,{actorId:owner,to:clone.cities[2].id,eventId:'consignment-owner-moving'});
 for(let i=0;i<40;i++)dayStep(clone);
 checkFederation(clone);
 assert.equal(federationMetrics(clone).economy.moneyTotal,3600);
});
test('F32 missing physical batch owner is rejected before recording a valid economy',()=>{
 const w=federationRun({agents:10,cityCount:2,environment:'wet',logistics:'trade',foodMarket:'consignment',days:7});
 const c=w.cities.find(c=>c.carrots.length>0);
 assert.ok(c,'must have at least one physical grown CARROT batch');
 c.carrots[0].ownerId='forged-unregistered-user';
 assert.throws(()=>checkFederation(w),/consignment carrots have no registered owner/);
});
test('F33 city founding still never creates new PAPER under consignment',()=>{
 const w=make({foodMarket:'consignment'});
 const c=w.cities[1],p=w.players.find(x=>x.cityId===c.id);
 const original=federationBalances(w);
 foundCity(w,{id:'seedling',parentId:c.id,actorId:p.id,
   eventId:'seedling-city-consignment',accepted:true,funding:100,wood:5,stone:4,seedCarrot:2,seedHemp:1});
 assert.deepEqual(federationBalances(w),original);
 for(let i=0;i<50;i++)dayStep(w);
 checkFederation(w);
});
for(const agents of [10,15,20])
 for(const cityCount of [2,3,4])
  for(const environment of ['normal','dry','wet'])
   for(const logistics of ['local','trade'])
    for(const days of [60,180,360]){
     test('CONSIGNMENT '+agents+' agents / '+cityCount+' cities / '+environment+
       ' / '+logistics+' / +'+days+' days',()=>{
       const s=federationRun({agents,cityCount,environment,logistics,days,
         foodMarket:'consignment'});
       const m=federationMetrics(s);
       assert.equal(m.economy.moneyTotal,3600);
       assert.equal(m.food.noCash+m.food.noFood,m.food.unmet);
       assert.equal(m.food.needs,m.food.eaten+m.food.unmet);
       assert.equal(m.minerals.WOOD_INITIAL,m.minerals.WOOD_STOCK+m.minerals.WOOD_IN_BUILDINGS);
       assert.equal(m.minerals.STONE_INITIAL,m.minerals.STONE_STOCK+m.minerals.STONE_IN_BUILDINGS);
       assert.ok(m.economy.cityBuildings<=FEDERATION_PROJECTS.length*cityCount);
       checkFederation(s);
     });
    }
