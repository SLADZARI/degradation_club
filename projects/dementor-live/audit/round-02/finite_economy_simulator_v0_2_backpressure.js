// DEMENTOR LIVE · Global Audit GA-02 · Finite-economy discrete-event model
// Version 0.1, independent specification fixture, NOT existing game-server code.
// All numerical inputs are TEST scenarios and policy assumptions, NOT APPROVED canon.
const TEST_CONFIG = Object.freeze({
  cityMoney:10000, farmMoney:500, farmStartingSeeds:4, farmStartingWaterML:40000,
  citySeedStock:64, seedRestockPerRealDay:32, seedPricePAPER:4,
  paperCityBuyPAPER:3, cityPaperDemandPerRealDay:64, cityPaperSpendCapPerRealDay:300,
  cityPaperStorageCapacity:128, cityPaperConsumePerRealDay:64,
  cityWaterPackML:10000, cityWaterPackPAPER:2, cityWaterPackEveryMinutes:5,
  riverMLPerMinute:500, tankCapacityML:40000,
  factoryOutputBuffer:32, warehouseCapacity:128,
  deliveryIntervalMinutes:60, deliveryTripMinutes:15, deliveryBatchMax:32,
  deliveryMinLoad:16, deliveryFeePAPER:5, maintenancePerPaperBatchPAPER:2
});
const CROP = Object.freeze({
  HEMP:{growthMin:45,seedWaterML:2000,yield:3,input:3,preTime:2,paperTime:4,paperOut:6,paperWaterML:8000,fiberId:"HEMP_FIBER"},
  FLAX:{growthMin:75,seedWaterML:3000,yield:4,input:4,preTime:3,paperTime:5,paperOut:8,paperWaterML:6000,fiberId:"FLAX_FIBER"}
});
function runFiniteScenario(overrides={}) {
  const cfg={minimumWorkingCapitalPAPER:60,maxRawInputBeforePause:24,maxFinishedStockBeforePause:96,...TEST_CONFIG,...overrides};
  const cropId=cfg.crop||"HEMP", c=CROP[cropId], n=cfg.farms||1, days=cfg.days||1;
  const minutes=1440*days, waterSource=cfg.waterSource||"CITY";
  if(!c || n<1 || n>200 || days<1 || days>30)throw Error("invalid test fixture");
  const city={money:cfg.cityMoney,seeds:cfg.citySeedStock,sheets:0,
    demand:cfg.cityPaperDemandPerRealDay,buyBudget:cfg.cityPaperSpendCapPerRealDay};
  const farms=Array.from({length:n},(_,id)=>({
    id,money:cfg.farmMoney,seeds:cfg.farmStartingSeeds,tank:cfg.farmStartingWaterML,
    plants:Array(4).fill(null),raw:0,output:0,warehouse:0,
    machine:null,shipment:null,returnSpaceReserved:0,
    cropsHarvested:0,planted:0,batches:0,sheetsMade:0,sheetsSold:0,
    purchasedSeeds:0,seedSpent:0,waterBoughtML:0,waterIntakeML:0,waterSpentML:0,
    seedDenials:0,waterDenials:0,storageDenials:0,shopDenials:0,shipments:0
  }));
  const logs={mints:0,burns:0,treasuryStart:city.money,paperInitialSum:city.money+n*cfg.farmMoney,
    seedRestocked:0,cityPaperConsumed:0,cityPaperBought:0,shopWaterPackets:0,citySeedsSold:0,
    citySeedReceipts:0,cityWaterReceipts:0,cityMaintenanceReceipts:0,cityShippingReceipts:0,
    cityPaperSpending:0,sourceRiverIntakeML:0,shipmentsDispatched:0,deniedDueCityBudget:0,
    peakCityMoney:city.money,minCityMoney:city.money,negativeMoney:false};
  function playerPays(f,amount,category) {
    if(!Number.isInteger(amount)||amount<0||f.money<amount)return false;
    f.money-=amount;city.money+=amount;
    if(category==="SEED")logs.citySeedReceipts+=amount;
    else if(category==="WATER")logs.cityWaterReceipts+=amount;
    else if(category==="MAINTENANCE")logs.cityMaintenanceReceipts+=amount;
    else if(category==="SHIP")logs.cityShippingReceipts+=amount;
    return true;
  }
  function cityPays(f,quantity){
    if(quantity<=0)return;
    const amt=quantity*cfg.paperCityBuyPAPER;
    if(city.money<amt||city.buyBudget<amt||city.demand<quantity)throw Error("unfunded city trade");
    city.money-=amt;f.money+=amt;city.buyBudget-=amt;city.demand-=quantity;
    f.sheetsSold+=quantity;city.sheets+=quantity;logs.cityPaperBought+=quantity;logs.cityPaperSpending+=amt;
  }
  function plant(f,t) {
    // Optional inventory/cash policy (PROPOSED not user-approved)
    if(cfg.backpressure===true&&(f.money<cfg.minimumWorkingCapitalPAPER
       ||f.raw>=cfg.maxRawInputBeforePause
       ||f.output+f.warehouse+f.returnSpaceReserved>=cfg.maxFinishedStockBeforePause))return;
    if(cfg.autoReplant===false&&f.planted>=4)return;
    for(let i=0;i<4;i++){
      if(f.plants[i]!==null)continue;
      if(f.tank<c.seedWaterML){f.waterDenials++;break;}
      if(f.seeds===0){
        if(city.seeds===0||!playerPays(f,cfg.seedPricePAPER,"SEED")){f.seedDenials++;break;}
        f.seeds++;city.seeds--;logs.citySeedsSold++;f.purchasedSeeds++;
      }
      f.seeds--;f.seedSpent++;f.tank-=c.seedWaterML;f.waterSpentML+=c.seedWaterML;
      f.plants[i]=t+c.growthMin;f.planted++;
    }
  }
  function stepFarm(f,t) {
    // River is a physically limited incoming water source.
    if(waterSource==="RIVER") {
      const added=Math.min(cfg.riverMLPerMinute,cfg.tankCapacityML-f.tank);
      f.tank+=added;f.waterIntakeML+=added;logs.sourceRiverIntakeML+=added;
    } else if(t>0&&t%cfg.cityWaterPackEveryMinutes===0&&f.tank<=cfg.tankCapacityML-cfg.cityWaterPackML) {
      if(playerPays(f,cfg.cityWaterPackPAPER,"WATER")){
        f.tank+=cfg.cityWaterPackML;f.waterBoughtML+=cfg.cityWaterPackML;f.waterIntakeML+=cfg.cityWaterPackML;logs.shopWaterPackets++;
      }
    }
    // Delivery is in transit for 15 REAL minutes and reserves return space for unsold stock.
    if(f.shipment&&t>=f.shipment.arrival) {
      const volume=f.shipment.quantity;
      const sale=Math.min(volume,city.demand,Math.floor(city.buyBudget/cfg.paperCityBuyPAPER),
        Math.floor(city.money/cfg.paperCityBuyPAPER),cfg.cityPaperStorageCapacity-city.sheets);
      if(sale>0)cityPays(f,sale);
      const unsold=volume-sale;
      if(unsold>0){f.warehouse+=unsold;f.shopDenials+=unsold;}
      f.returnSpaceReserved-=volume;f.shipment=null;
    }
    // Crops have independent real-time clocks; irrigation was debited at planting.
    for(let i=0;i<4;i++){
      if(f.plants[i]!==null&&f.plants[i]<=t){
        f.plants[i]=null;f.raw+=c.yield;f.cropsHarvested++;
      }
    }
    if(cfg.autoReplant!==false||f.planted<4)plant(f,t);
    // Factory phases: PREP turns raw crop into held fiber; WAIT_WATER delays,
    // PAPER consumes water+maintenance; output materializes only at completion.
    if(f.machine&&f.machine.phase==="PREP"&&t>=f.machine.doneAt){
      f.machine.phase="WAIT_WATER";f.machine.doneAt=null;
    }
    if(f.machine&&f.machine.phase==="PAPER"&&t>=f.machine.doneAt){
      f.output+=c.paperOut;f.sheetsMade+=c.paperOut;f.batches++;f.machine=null;
    }
    // Output buffer is finite, transfer to a local finite warehouse when enabled.
    if(cfg.autoUnload!==false&&f.output>0){
      const room=Math.max(0,cfg.warehouseCapacity-f.warehouse-f.returnSpaceReserved);
      const moved=Math.min(room,f.output);
      f.output-=moved;f.warehouse+=moved;
    }
    if(f.machine&&f.machine.phase==="WAIT_WATER"){
      if(f.tank>=c.paperWaterML&&f.money>=cfg.maintenancePerPaperBatchPAPER) {
        f.tank-=c.paperWaterML;f.waterSpentML+=c.paperWaterML;
        playerPays(f,cfg.maintenancePerPaperBatchPAPER,"MAINTENANCE");
        f.machine.phase="PAPER";f.machine.doneAt=t+c.paperTime;
      } else f.waterDenials++;
    }
    if(!f.machine&&f.raw>=c.input&&f.output+c.paperOut<=cfg.factoryOutputBuffer){
      f.raw-=c.input;
      f.machine={phase:"PREP",doneAt:t+c.preTime,
        source:cropId,fiberId:c.fiberId,input:c.input,output:c.paperOut};
    } else if(!f.machine&&f.raw>=c.input)f.storageDenials++;
    // Hourly paid courier pickup: no instantaneous teleport between remote properties.
    const cityDemandAvailable=city.demand>=cfg.deliveryMinLoad &&
       city.buyBudget>=cfg.paperCityBuyPAPER*cfg.deliveryMinLoad &&
       city.money>=cfg.paperCityBuyPAPER*cfg.deliveryMinLoad &&
       city.sheets+cfg.deliveryMinLoad<=cfg.cityPaperStorageCapacity;
    if(cfg.autoShip!==false&&t>0&&t%cfg.deliveryIntervalMinutes===0&&!f.shipment
       &&f.warehouse>=cfg.deliveryMinLoad&&f.money>=cfg.deliveryFeePAPER &&
       (cfg.backpressure!==true||cityDemandAvailable)) {
      const q=Math.min(cfg.deliveryBatchMax,f.warehouse);
      if(playerPays(f,cfg.deliveryFeePAPER,"SHIP")){
        f.warehouse-=q;f.returnSpaceReserved+=q;
        f.shipment={quantity:q,arrival:t+cfg.deliveryTripMinutes};
        f.shipments++;logs.shipmentsDispatched++;
      }
    }
  }
  for(let t=0;t<minutes;t++){
    if(t>0&&t%1440===0){
      const consumed=Math.min(city.sheets,cfg.cityPaperConsumePerRealDay);
      city.sheets-=consumed;logs.cityPaperConsumed+=consumed;
      city.seeds+=cfg.seedRestockPerRealDay;logs.seedRestocked+=cfg.seedRestockPerRealDay;
      city.demand=cfg.cityPaperDemandPerRealDay;city.buyBudget=cfg.cityPaperSpendCapPerRealDay;
    }
    // Rotating allocation priority prevents fixed index advantage for contested city seed stocks.
    const start=t%n;
    for(let k=0;k<n;k++)stepFarm(farms[(start+k)%n],t);
    if(city.money<0||farms.some(f=>f.money<0)){logs.negativeMoney=true;throw Error("negative balance");}
    logs.minCityMoney=Math.min(logs.minCityMoney,city.money);
    logs.peakCityMoney=Math.max(logs.peakCityMoney,city.money);
  }
  const sum=(key)=>farms.reduce((total,f)=>total+f[key],0);
  const playerMoney=farms.reduce((a,f)=>a+f.money,0);
  const sheetsHeld=farms.reduce((a,f)=>a+f.output+f.warehouse+(f.shipment?f.shipment.quantity:0),0);
  const sheetsMade=sum("sheetsMade"),waterIntake=sum("waterIntakeML"),waterSpent=sum("waterSpentML");
  const tankLeft=sum("tank"),seedEnd=city.seeds+sum("seeds");
  const seedInitial=cfg.citySeedStock+n*cfg.farmStartingSeeds;
  const moneyConserved=playerMoney+city.money===logs.paperInitialSum;
  const waterConserved=cfg.farmStartingWaterML*n+waterIntake===waterSpent+tankLeft;
  const seedsConserved=seedInitial+logs.seedRestocked===seedEnd+sum("seedSpent");
  const sheetsConserved=sheetsMade===sheetsHeld+city.sheets+logs.cityPaperConsumed;
  const noCapacityViolations=farms.every(f=>f.output<=cfg.factoryOutputBuffer&&
     f.warehouse+f.returnSpaceReserved<=cfg.warehouseCapacity&&
     f.tank>=0&&f.tank<=cfg.tankCapacityML&&f.returnSpaceReserved>=0&&
     (f.shipment?f.returnSpaceReserved===f.shipment.quantity:f.returnSpaceReserved===0));
  const checks={moneyConserved,waterConserved,seedsConserved,sheetsConserved,noCapacityViolations,
    noNegativeMoney:!logs.negativeMoney,citySpendWithinDayBudget:logs.cityPaperBought<=days*cfg.cityPaperDemandPerRealDay,
    cityStockValid:city.sheets<=cfg.cityPaperStorageCapacity};
  if(Object.values(checks).some(v=>!v))throw Error("invariant failure "+JSON.stringify({checks,config:{n,days,cropId,waterSource}}));
  const summaries={
    farms:n,days,crop:cropId,waterSource,backpressure:cfg.backpressure===true,
    autoReplant:cfg.autoReplant!==false,autoUnload:cfg.autoUnload!==false,
    autoShip:cfg.autoShip!==false,
    papersProduced:sheetsMade,papersSold:logs.cityPaperBought,papersHeld:sheetsHeld,
    cityHeldSheets:city.sheets,cityConsumedSheets:logs.cityPaperConsumed,
    waterUsedLitres:waterSpent/1000,waterIntakeLitres:waterIntake/1000,waterLeftLitres:tankLeft/1000,
    seedsUsed:sum("seedSpent"),seedsRestocked:logs.seedRestocked,seedsInCity:city.seeds,
    cityPaperSpent:logs.cityPaperSpending,citySeedReceipts:logs.citySeedReceipts,
    cityWaterReceipts:logs.cityWaterReceipts,cityMaintenanceReceipts:logs.cityMaintenanceReceipts,
    cityShippingReceipts:logs.cityShippingReceipts,
    cityCash:city.money,playerCash:playerMoney,initialMoney:logs.paperInitialSum,
    cityMinCash:logs.minCityMoney,shipments:logs.shipmentsDispatched,
    cropPlanted:sum("planted"),cropHarvested:sum("cropsHarvested"),factoryBatches:sum("batches"),
    seedDenials:sum("seedDenials"),waterDenials:sum("waterDenials"),storageDenials:sum("storageDenials"),
    unsoldOnReturn:sum("shopDenials"),
    bankruptFarmCount:farms.filter(f=>f.money===0).length,
    belowReserveFarmCount:farms.filter(f=>f.money<cfg.minimumWorkingCapitalPAPER).length,
    zeroSaleFarmCount:farms.filter(f=>f.sheetsSold===0).length,
    minSheetsSoldPerFarm:Math.min(...farms.map(f=>f.sheetsSold)),
    maxSheetsSoldPerFarm:Math.max(...farms.map(f=>f.sheetsSold)),
    avgSheetsSoldPerFarm:logs.cityPaperBought/n,checks
  };
  return summaries;
}
function runAuditMatrix(){
  const scenarios=[];
  for(const crop of ["HEMP","FLAX"])for(const farms of [1,20,100])for(const days of [1,7,30]){
    scenarios.push(runFiniteScenario({crop,farms,days}));
  }
  for(const days of [1,7,30])scenarios.push(runFiniteScenario({crop:"HEMP",farms:1,days,waterSource:"RIVER"}));
  scenarios.push(runFiniteScenario({crop:"HEMP",farms:1,days:1,autoReplant:false}));
  scenarios.push(runFiniteScenario({crop:"HEMP",farms:1,days:1,autoUnload:false}));
  scenarios.push(runFiniteScenario({crop:"HEMP",farms:1,days:1,autoShip:false}));
  const a=runFiniteScenario({crop:"HEMP",farms:1,days:7});
  const b=runFiniteScenario({crop:"HEMP",farms:1,days:7});
  const deterministic=JSON.stringify(a)===JSON.stringify(b);
  if(!deterministic)throw Error("nondeterministic replay fixture");
  return {model:"FINITE_DISCRETE_MINUTE_SYNTHETIC",version:"GA-02-v0.1",date:"2026-10-17",
    config:TEST_CONFIG,crops:CROP,scenarioCount:scenarios.length,
    passedInvariants:scenarios.length*8,deterministicReplay:deterministic,
    scenarios,limitations:[
      "Not the game server, Supabase, SQL, real multiplayer, real transactions or actual world geometry",
      "Crops debit all growth water at planting, not staged irrigation — model simplification",
      "No seed growth variance, land CAPEX, labor, weather or fully staffed courier system",
      "Dedicated city water connection per farm at maximum one 10L package/5 REAL minutes; no shared city water budget",
      "City consumer demand, shops and funding are intentionally fixed TEST policy knobs, not user-approved",
      "Unpaid land/build/automation CAPEX outside independent mature-farm scenario; starting farm money 500 PAPER TEST",
      "All returns unsold goods to local warehouse with reserved return capacity; no cargo loss, theft or further routing",
      "Starting city treasury 10k and city seed stock64 are arbitrary stress fixtures, not canon",
      "Automated replant, unload and shipping presumed already installed and enabled (no hardware costs)",
      "No cross-plant water event priority other than per-minute rotating farm iteration; production output checked"
    ]};
}
if(typeof module!=="undefined"&&module.exports)module.exports={TEST_CONFIG,CROP,runFiniteScenario,runAuditMatrix};
