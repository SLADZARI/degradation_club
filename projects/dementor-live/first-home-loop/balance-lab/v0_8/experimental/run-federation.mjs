// Deterministic federation candidate tests, NOT historical v0.8 simulator.
import {writeFileSync,mkdirSync} from 'node:fs';
import {FEDERATION_ID,federationRun,federationMetrics,checkFederation} from './federation-model.mjs';
const results=[];
for(const foodMarket of ['municipal','consignment','cooperative'])
 for(const agents of [10,15,20])
 for(const cityCount of [2,3,4])
  for(const environment of ['normal','dry','wet'])
   for(const logistics of ['local','trade'])
    for(const days of [60,180,360]){
      const s=federationRun({agents,cityCount,environment,logistics,days,foodMarket});
      checkFederation(s);
      results.push(federationMetrics(s));
    }
const pick=(n,k,env,log,days,market='municipal')=>results.find(x=>x.agents===n&&x.cities===k&&x.environment===env&&x.logistics===log&&x.projectionDays===days&&x.foodMarket===market);
const comparison=[];
for(const foodMarket of ['municipal','consignment','cooperative'])
 for(const population of [10,15,20])
 for(const cityCount of [2,3,4])
  for(const weather of ['normal','dry','wet'])
   for(const days of [60,180,360]){
    const local=pick(population,cityCount,weather,'local',days,foodMarket),
          trading=pick(population,cityCount,weather,'trade',days,foodMarket);
    comparison.push({
      agents:population,cities:cityCount,environment:weather,days,foodMarket,
      local:{
        treasury:local.economy.cityMoney,buildings:local.economy.cityBuildings,
        unservedFood:local.food.unmet,unaffordableMeals:local.food.noCash,missingMeals:local.food.noFood,
        workersPaid:local.walletDistribution.workersPaid,services:local.economy.civicSessions,
        deliveries:local.logisticsReport.delivered,
      },trade:{
        treasury:trading.economy.cityMoney,buildings:trading.economy.cityBuildings,
        unservedFood:trading.food.unmet,unaffordableMeals:trading.food.noCash,missingMeals:trading.food.noFood,
        workersPaid:trading.walletDistribution.workersPaid,services:trading.economy.civicSessions,
        deliveries:trading.logisticsReport.delivered,
      },
      effect:{
        extraBuildings:trading.economy.cityBuildings-local.economy.cityBuildings,
        avoidedHunger:local.food.unmet-trading.food.unmet,
        freightTrades:trading.logisticsReport.delivered
      }
    });
   }
const marketComparison=['normal','dry','wet'].map(environment=>{
 const old=pick(20,3,environment,'trade',360,'municipal');
 const candidate=pick(20,3,environment,'trade',360,'consignment');
 return {environment,people:20,cities:3,days:360,
  municipal:{unmet:old.food.unmet,noCash:old.food.noCash,noFood:old.food.noFood,
    treasury:old.economy.cityMoney,workersPaid:old.walletDistribution.workersPaid,
    buildings:old.economy.cityBuildings,shipments:old.logisticsReport.delivered},
  consignment:{unmet:candidate.food.unmet,noCash:candidate.food.noCash,
    noFood:candidate.food.noFood,treasury:candidate.economy.cityMoney,
    workersPaid:candidate.walletDistribution.workersPaid,
    buildings:candidate.economy.cityBuildings,shipments:candidate.logisticsReport.delivered},
  cooperative:(()=>{const m=pick(20,3,environment,'trade',360,'cooperative');
   return {unmet:m.food.unmet,noCash:m.food.noCash,noFood:m.food.noFood,
     treasury:m.economy.cityMoney,subsidized:m.food.subsidized,subsidySpent:m.food.subsidiesSpent,
     buildings:m.economy.cityBuildings,shipments:m.logisticsReport.delivered};})(),
  effects:{avoidedHunger:old.food.unmet-candidate.food.unmet,
    avoidedNoCash:old.food.noCash-candidate.food.noCash}
 };
});
const stats={
  schema:'WORLD_ORGANISM_FEDERATION_STRESS/0.8.3',
  status:'EXPERIMENTAL_NOT_ORIGINAL_V08_NOT_SERVER',
  model:FEDERATION_ID,
  count:results.length,
  provenance:{
    source:'v0.8.2 shadow civic-service price and physical sheet recipe; all city, agents, mineral deposits, weather, work wages are 0.8.3 TEST assumptions',
    money:'3600 PAPER per entire federation, NOT minted per city',
    workload:'3 food-market policies x 3 populations x 3 existing city counts x 3 environments x 2 logistics policies x 3 horizons',
    restricted:'No game server access; no deployed or actual multiuser runtime; no original v0.8 full event-ledger replay'
  },
  summary:comparison,marketComparison,
  scenarios:results
};
const dir=process.argv[2]||'./reports';
mkdirSync(dir,{recursive:true});
writeFileSync(dir+'/v084-federation-all-486.json',JSON.stringify(stats,null,2)+'\n');
writeFileSync(dir+'/v083-federation-summary.json',JSON.stringify({...stats,scenarios:undefined},null,2)+'\n');
console.log('FEDERATION_RUNS',results.length);
console.log('FEDERATION_MODEL',FEDERATION_ID);
console.log('FEDERATION_ANCHORS',JSON.stringify(comparison.filter(x=>x.agents===20&&x.cities===3&&x.days===360)));
console.log('FEDERATION_CITY_SAMPLE',JSON.stringify(pick(20,3,'normal','trade',360).cityRows));
console.log('FEDERATION_CONSIGNMENT_CITY_SAMPLE',JSON.stringify(pick(20,3,'normal','trade',360,'consignment').cityRows));
console.log('FEDERATION_MARKET_COMPARISON',JSON.stringify(marketComparison));
console.log('FEDERATION_COOP_COMPARISON',JSON.stringify(marketComparison.map(x=>({weather:x.environment,consignment:x.consignment,cooperative:x.cooperative}))));
console.log('FEDERATION_ALL_ASSETS_CONSERVED',results.every(r=>r.ledger.PAPER===3600&&
  r.minerals.WOOD_INITIAL===r.minerals.WOOD_STOCK+r.minerals.WOOD_IN_BUILDINGS&&
  r.minerals.STONE_INITIAL===r.minerals.STONE_STOCK+r.minerals.STONE_IN_BUILDINGS));
