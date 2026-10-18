import {mkdirSync,writeFileSync} from 'node:fs';
import {SETTINGS,MODEL_ID,simulate,metrics} from './shadow-model.mjs';
const outputDir=process.argv[2]||'./reports';
const records=[];
for(const policy of SETTINGS.experiments)
 for(const environment of SETTINGS.environments)
  for(const agents of [3,4,5])
   for(const days of [30,60,90]){
     const record=metrics(simulate({policy,environment,agents,days}));
     records.push(record);
   }
const combinations=SETTINGS.experiments.map(policy=>{
  const data=records.filter(r=>r.policy===policy&&r.environment==='normal'&&r.agents===3);
  return {policy,normalThreeAgents:data.map(r=>({
    day:r.day,newBuildings:r.buildings.new,orders:r.demand.posted,
    fulfilled:r.demand.filled,expired:r.demand.expired,unfunded:r.demand.unfunded,
    cityPAPER:r.money.city,escrow:r.money.escrow,foodGrown:r.food.grown,
    foodSpoiled:r.food.spoiled,foodUnmet:r.food.unmet,
    paperMade:r.sheets.made,paperUsed:r.sheets.used,
    blocked:r.block.unique
  }))};
});
const stress=SETTINGS.environments.map(environment=>{
 const data=records.filter(r=>r.environment===environment&&r.policy==='needs-growth'&&r.projectionDays===90);
 return {environment,agents:data.map(r=>({
   count:r.agents,cityPAPER:r.money.city,orders:r.demand.posted,
   filled:r.demand.filled,expired:r.demand.expired,unfunded:r.demand.unfunded,
   foodUnmet:r.food.unmet,spoilage:r.food.spoiled,
   buildings:r.buildings.new,waitingResource:r.block.waitingResource,
   blocked:r.block.unique,wood:r.finiteMaterials.wood,stone:r.finiteMaterials.stone
 }))};
});
const result={
 schema:'WORLD_ORGANISM_SHADOW_PROJECTION/0.8.1',
 status:'EXPERIMENTAL_NOT_ORIGINAL_V08_NOT_SERVER',
 provenance:{source:'published WORLD ORGANISM v0.8 D30 aggregate and contract, not original simulator code',
   checkpointDay:30,checkpointPAPER:3600,checkpointCityPAPER:2301,checkpointHempRemaining:4,
   note:'Synthetic per-player wallets, food, seed, water, wood, stone, and forward policy values; compare policies within this model only.'},
 model:MODEL_ID,
 parameters:SETTINGS,numberOfRuns:records.length,
 assumptions:{
  static:'No new city demand. Home food need follows hypothesized always-active agents.',
  upkeep:'Hypothetical finite weekly public sessions each buying a paper sheet and carrot per active facility. This event calendar is not approved server logic.',
  'needs-growth':'Same event calendar plus one pantry after measured spoilage, one irrigation station after measured unmet need; each one-time project requires physical wood and stone plus funded wages.',
  dry:'Cropland grows at double duration, rain recharge 1 WATER/day. Not a measured real drought.',
  treasury:'City wallet test-reallocated to 35 PAPER while global supply stays 3600.',
  carrots:'TEST 3 carrots/seedbed harvest, each player eats one/day, unsold produce lasts one day unless pantry has been built.',
  activeSession:'All synthetic agents active daily. A real game must only apply hunger during actual online sessions.',
 },
 sample:combinations,stress,records
};
mkdirSync(outputDir,{recursive:true});
writeFileSync(outputDir+'/v08-shadow-projection-108.json',JSON.stringify(result,null,2)+'\n');
writeFileSync(outputDir+'/v08-shadow-summary.json',JSON.stringify({...result,records:undefined},null,2)+'\n');
console.log('RUN_COUNT',records.length);
console.log('PROVENANCE',result.status);
console.log('NORMAL_3_AGENTS',JSON.stringify(combinations));
console.log('STRESS_90_DAYS',JSON.stringify(stress));
console.log('ARTIFACT',outputDir+'/v08-shadow-projection-108.json');
