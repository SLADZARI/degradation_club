// DEMENTOR LIVE GA-03 — shared municipal water capacity / finite tanks.
const WATER_TEST={tankCapML:40000,initialTankML:40000,cityTrunkMLperMin:2000,
 riverPumpMLperMin:500,cycleMins:45,plantWaterML:8000,
 paperWaterML:8000,paperBatchMins:6,paperBatchesPerHarvest:4,sheetsPerBatch:6};
function makeWorld(n,source="CITY",config={}){
 if(!Number.isInteger(n)||n<1||n>100)throw Error("n");
 const cfg={...WATER_TEST,...config};
 return {n,source,cfg,cursor:0,sourceGranted:0,
  farms:Array.from({length:n},(_,id)=>({
   id,tank:cfg.initialTankML,activeCrop:false,due:-1,
   pendingBatches:0,nextPaperAt:0,harvests:0,plants:0,stalledSeedMinutes:0,stalledPaperMinutes:0,
   productionBatches:0,sheets:0,spentWaterML:0,intakeML:0
  }))};
}
function advance(state,toMin){
 if(toMin<state.cursor)throw Error("monotonic cursor");
 const {farms:nFarms,cfg}=state,n=state.n;
 for(let min=state.cursor;min<toMin;min++){
  // Shared city trunk limited to 120L per hour across the WHOLE district.
  if(state.source==="CITY"){
   let budget=cfg.cityTrunkMLperMin,open=nFarms.filter(f=>f.tank<cfg.tankCapML);
   const start=min%n;
   open.sort((a,b)=>(a.id-start+n)%n-(b.id-start+n)%n);
   for(let k=0;k<open.length;k++){
    const f=open[k],remain=open.length-k;
    const allowance=Math.min(cfg.tankCapML-f.tank,Math.floor(budget/remain));
    if(allowance>0){f.tank+=allowance;f.intakeML+=allowance;state.sourceGranted+=allowance;budget-=allowance;}
   }
  }else if(state.source==="RIVER"){
   for(const f of nFarms){const allowance=Math.min(cfg.riverPumpMLperMin,cfg.tankCapML-f.tank);
    f.tank+=allowance;f.intakeML+=allowance;state.sourceGranted+=allowance;}
  }else throw Error("source");
  // Time schedule of 4 HEMP crops: a 45min growth batch requires 8L at planting.
  for(const f of nFarms){
   if(f.activeCrop&&min>=f.due){
     f.harvests++;f.pendingBatches+=cfg.paperBatchesPerHarvest;
     f.activeCrop=false;f.due=-1;
   }
   if(!f.activeCrop){
     if(f.pendingBatches<=cfg.paperBatchesPerHarvest&&f.tank>=cfg.plantWaterML){
       f.tank-=cfg.plantWaterML;f.spentWaterML+=cfg.plantWaterML;
       f.plants++;f.activeCrop=true;f.due=min+cfg.cycleMins;
     }else f.stalledSeedMinutes++;
   }
   if(f.pendingBatches>0&&min>=f.nextPaperAt){
     if(f.tank>=cfg.paperWaterML){
       f.tank-=cfg.paperWaterML;f.spentWaterML+=cfg.paperWaterML;
       f.pendingBatches--;f.productionBatches++;f.sheets+=cfg.sheetsPerBatch;
       f.nextPaperAt=min+cfg.paperBatchMins;
     }else f.stalledPaperMinutes++;
   }
  }
 }
 state.cursor=toMin;
 const stats=state.farms.reduce((o,f)=>{
   o.consumedML+=f.spentWaterML;o.intakeML+=f.intakeML;o.storedML+=f.tank;
   o.sheets+=f.sheets;o.harvests+=f.harvests;o.plantings+=f.plants;
   o.waitPlantMinutes+=f.stalledSeedMinutes;o.waitPaperMinutes+=f.stalledPaperMinutes;return o;
 },{consumedML:0,intakeML:0,storedML:0,sheets:0,harvests:0,plantings:0,waitPlantMinutes:0,waitPaperMinutes:0});
 state.lastStats=stats;
 const initial=cfg.initialTankML*n;
 state.checks={globalWaterConserved:initial+state.sourceGranted===stats.consumedML+stats.storedML,
  perFarmConserved:state.farms.every(f=>cfg.initialTankML+f.intakeML===f.spentWaterML+f.tank),
  noOverfullTank:state.farms.every(f=>f.tank>=0&&f.tank<=cfg.tankCapML),
  sourceMaxBound:state.sourceGranted<=(state.source==="CITY"?cfg.cityTrunkMLperMin:cfg.riverPumpMLperMin*n)*toMin,
  paperRecipeWaterTracked:state.farms.every(f=>f.spentWaterML===f.plants*cfg.plantWaterML+f.productionBatches*cfg.paperWaterML),
  paperSheetsTracked:state.farms.every(f=>f.sheets===f.productionBatches*cfg.sheetsPerBatch),
  queuedProductionBackedByHarvest:state.farms.every(f=>f.productionBatches+f.pendingBatches===f.harvests*cfg.paperBatchesPerHarvest)};
 if(Object.values(state.checks).some(v=>!v))throw Error("WATER INVARIANT "+JSON.stringify(state.checks));
 return state;
}
function runWaterMatrix(){
 const configs=[];
 for(const source of ["CITY","RIVER"])for(const farms of [1,4,20,100])for(const days of [1,7])configs.push({source,farms,days});
 const runs=configs.map(c=>{
  const a=makeWorld(c.farms,c.source);advance(a,c.days*1440);
  const stats=a.lastStats;
  return {...c,totalLitresConsumed:stats.consumedML/1000,totalLitresImported:stats.intakeML/1000,
    litersStored:stats.storedML/1000,paperSheetsProduced:stats.sheets,harvestBatches:stats.harvests,
    plantBatches:stats.plantings,plantWaitMinutes:stats.waitPlantMinutes,
    factoryWaitMinutes:stats.waitPaperMinutes,
    checks:a.checks};
 });
 const uninterrupted=makeWorld(20,"CITY");advance(uninterrupted,7*1440);
 const checkpoint=makeWorld(20,"CITY");advance(checkpoint,600);
 const restored=JSON.parse(JSON.stringify(checkpoint));
 advance(restored,7*1440);
 const same=JSON.stringify(uninterrupted)===JSON.stringify(restored);
 if(!same)throw Error("offline replay mismatch");
 return {kind:"SYNTHETIC_SHARED_UTILITY_NOT_GAME_RUNTIME",
  date:"2026-10-17",params:WATER_TEST,runs,
  count:runs.length,checksExecuted:runs.length*7,offlineCheckpointMatches:same};
}
if(typeof module!=="undefined")module.exports={makeWorld,advance,runWaterMatrix};
