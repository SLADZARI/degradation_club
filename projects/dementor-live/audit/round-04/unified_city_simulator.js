// DEMENTOR LIVE — GA04 Unified City Simulation (synthetic, unapproved TEST inputs)
const DEFAULTS={n:20,days:7,treasury:50000,arrivalEvery:0,
 cityWood:600,citySheets:400,citySeeds:600,plots:200,seedRestockDay:100,
 tutorialGrant:80,trainingJobs:4,tutorialWage:90,trainingMin:7,
 landPrice:360,cabinFee:60,cabinWood:6,cabinSheets:4,buildMin:10,
 extraWage:30,extraWorkMin:7,maxExtraWork:12,startCashNeed:37,
 equipmentCAPEX:0,workshopSlots:4,sourceMLperMin:2000,tankMaxML:40000,
 waterPacketML:10000,waterPrice:2,seedQty:4,seedPrice:4,
 growthMin:45,growthWaterML:8000,harvestRaw:12,
 paperRaw:3,paperOut:6,paperWaterML:8000,paperMin:6,paperMaint:2,
 playerStorage:32,maxRawForReplant:12,
 cityDailyBuy:64,cityDailyBudget:300,cityWarehouseCap:128,cityDailyConsume:64,
 buyPrice:3,shipPrice:5,shipMin:16,shipMax:32,shipMinTravel:15,
 cashFloor:10};
function runCity(args={}){
 const c={...DEFAULTS,...args};
 if(![1,20,100].includes(c.n)||c.days<1||c.days>30)throw Error("scenario");
 const T=c.days*1440;
 const city={cash:c.treasury,escrow:0,wood:c.cityWood,sheets:c.citySheets,
  seeds:c.citySeeds,plots:c.plots,stock:0,pending:0,buyQty:c.cityDailyBuy,buyBudget:c.cityDailyBudget};
 const P=Array.from({length:c.n},(_,i)=>({i,stage:"NEW",due:i*c.arrivalEvery,cash:0,jobs:0,extras:0,home:false,
  growUntil:-1,raw:0,tank:0,workUntil:-1,warehouse:0,cargo:null,harvest:0,produced:0,sold:0,
  waterWait:0,cashWait:0,buyerWait:0}));
 const lg={mint:0,burn:0,woodBuilding:0,sheetsBuilding:0,seedsRestocked:0,seedsUsed:0,
  waterInML:0,waterSpentML:0,sheetsMade:0,sheetsCityConsumed:0,sheetsSold:0,
  started:0,homes:0,jobs:0,extraJobs:0,shipments:0,minCityCash:c.treasury,
  cashFlows:{grant:0,wage:0,extra:0,landAndBuild:0,equipment:0,seeds:0,water:0,maintenance:0,shipping:0,sales:0}};
 const doneTx=new Set();let token=0,waterPointer=0,machinesBusy=0;
 function pay(a,b,v,key,kind){if(doneTx.has(key))return true;if(a.cash<v)return false;
   a.cash-=v;b.cash+=v;doneTx.add(key);lg.cashFlows[kind]+=v;return true;}
 function tutorial(p,t){
  if(p.stage==="NEW"){
   if(t<p.due||!pay(city,p,c.tutorialGrant,"g"+p.i,"grant"))return;
   p.stage="JOB";p.due=t+c.trainingMin;lg.started++;return;}
  if(p.stage==="JOB"){
   if(t<p.due||!pay(city,p,c.tutorialWage,"j"+p.i+"-"+p.jobs,"wage"))return;
   p.jobs++;lg.jobs++;p.due=t+c.trainingMin;
   if(p.jobs===c.trainingJobs){p.stage="HOME";p.due=t+1;}return;}
  if(p.stage==="WAIT_KIT"){if(city.wood>=c.cabinWood&&city.sheets>=c.cabinSheets&&city.plots>0){
   p.stage="HOME";p.due=t+1;}return;}
  if(p.stage==="HOME"){
   if(t<p.due||p.cash<c.landPrice+c.cabinFee)return;
   if(city.wood<c.cabinWood||city.sheets<c.cabinSheets||city.plots<1){p.stage="WAIT_KIT";return;}
   // First home and finite one-time kit committed together.
   p.cash-=c.landPrice+c.cabinFee;city.cash+=c.landPrice+c.cabinFee;
   lg.cashFlows.landAndBuild+=c.landPrice+c.cabinFee;
   city.wood-=c.cabinWood;city.sheets-=c.cabinSheets;city.plots--;
   lg.woodBuilding+=c.cabinWood;lg.sheetsBuilding+=c.cabinSheets;lg.homes++;
   p.home=true;p.stage="BUILD";p.due=t+c.buildMin;return;}
  if(p.stage==="BUILD"){if(t>=p.due){p.stage="STARTUP";p.due=t+1;}return;}
  if(p.stage==="STARTUP"){
   if(t<p.due)return;
   if(p.cash<c.equipmentCAPEX+c.startCashNeed){
    if(p.extras>=c.maxExtraWork){p.stage="WAIT_STARTUP";return;}
    if(!pay(city,p,c.extraWage,"x"+p.i+"-"+p.extras,"extra"))return;
    p.extras++;lg.extraJobs++;p.due=t+c.extraWorkMin;return;
   }
   p.cash-=c.equipmentCAPEX;city.cash+=c.equipmentCAPEX;
   lg.cashFlows.equipment+=c.equipmentCAPEX;p.stage="FARM";return;}
 }
 function finish(p,t){
  if(p.cargo&&t>=p.cargo.arrives){
   const qty=p.cargo.qty,cost=qty*c.buyPrice;
   if(city.escrow<cost||city.pending<qty)throw Error("escrow");
   city.escrow-=cost;p.cash+=cost;city.pending-=qty;city.stock+=qty;
   lg.cashFlows.sales+=cost;lg.sheetsSold+=qty;p.sold+=qty;p.cargo=null;
  }
  if(p.growUntil!==-1&&t>=p.growUntil){p.growUntil=-1;p.raw+=c.harvestRaw;p.harvest++;}
  if(p.workUntil!==-1&&t>=p.workUntil){
   p.workUntil=-1;machinesBusy--;p.warehouse+=c.paperOut;
   p.produced+=c.paperOut;lg.sheetsMade+=c.paperOut;
  }
 }
 function needWater(p){if(p.stage!=="FARM"||p.cash<c.waterPrice||p.tank>c.tankMaxML-c.waterPacketML)return false;
  const toGrow=p.growUntil===-1&&p.raw<=c.maxRawForReplant&&p.warehouse<24&&
    city.seeds>=c.seedQty&&p.cash>=c.seedQty*c.seedPrice;
  const toPaper=p.raw>=c.paperRaw&&p.workUntil===-1&&p.cash>=c.paperMaint;
  return (toGrow&&p.tank<c.growthWaterML)||(toPaper&&p.tank<c.paperWaterML);
 }
 function provideWater(t){
  token=Math.min(c.waterPacketML,token+c.sourceMLperMin);
  if(token<c.waterPacketML)return;
  for(let k=0;k<c.n;k++){const p=P[(waterPointer+k)%c.n];if(!needWater(p))continue;
    if(pay(p,city,c.waterPrice,"water"+p.i+"-"+t,"water")){
      token-=c.waterPacketML;p.tank+=c.waterPacketML;lg.waterInML+=c.waterPacketML;
      waterPointer=(p.i+1)%c.n;break;}}
 }
 function farm(p,t){
  if(p.stage!=="FARM")return;
  if(p.growUntil===-1&&p.raw<=c.maxRawForReplant&&p.warehouse<24){
   const cashNeeded=c.seedQty*c.seedPrice+
     c.paperMaint*c.harvestRaw/c.paperRaw+c.shipPrice+c.cashFloor;
   if(p.cash>=cashNeeded&&p.tank>=c.growthWaterML&&city.seeds>=c.seedQty){
    const seedMoney=c.seedQty*c.seedPrice;
    p.cash-=seedMoney;city.cash+=seedMoney;lg.cashFlows.seeds+=seedMoney;
    city.seeds-=c.seedQty;lg.seedsUsed+=c.seedQty;p.tank-=c.growthWaterML;
    lg.waterSpentML+=c.growthWaterML;p.growUntil=t+c.growthMin;
   }else{if(p.tank<c.growthWaterML)p.waterWait++;
    if(p.cash<cashNeeded)p.cashWait++;}
  }
  if(p.raw>=c.paperRaw&&p.workUntil===-1&&machinesBusy<c.workshopSlots&&
   p.warehouse+c.paperOut<=c.playerStorage&&p.tank>=c.paperWaterML&&p.cash>=c.paperMaint){
    p.raw-=c.paperRaw;p.tank-=c.paperWaterML;lg.waterSpentML+=c.paperWaterML;
    p.cash-=c.paperMaint;city.cash+=c.paperMaint;lg.cashFlows.maintenance+=c.paperMaint;
    p.workUntil=t+c.paperMin;machinesBusy++;
  }
  if(p.warehouse>=c.shipMin&&p.cargo===null&&p.cash>=c.shipPrice){
    const qty=Math.min(p.warehouse,c.shipMax,city.buyQty,
      Math.floor(city.buyBudget/c.buyPrice),Math.floor(city.cash/c.buyPrice),
      c.cityWarehouseCap-city.stock-city.pending);
    if(qty>=c.shipMin){
      p.cash-=c.shipPrice;city.cash+=c.shipPrice;lg.cashFlows.shipping+=c.shipPrice;
      const owed=qty*c.buyPrice;city.cash-=owed;city.escrow+=owed;
      city.pending+=qty;city.buyQty-=qty;city.buyBudget-=owed;
      p.warehouse-=qty;p.cargo={qty,arrives:t+c.shipMinTravel};lg.shipments++;
    }else p.buyerWait++;
  }
 }
 for(let t=0;t<T;t++){
  if(t>0&&t%1440===0){
    const qty=Math.min(city.stock,c.cityDailyConsume);
    city.stock-=qty;lg.sheetsCityConsumed+=qty;
    city.buyQty=c.cityDailyBuy;city.buyBudget=c.cityDailyBudget;
    city.seeds+=c.seedRestockDay;lg.seedsRestocked+=c.seedRestockDay;
  }
  const shift=t%c.n;
  for(let i=0;i<c.n;i++)finish(P[(shift+i)%c.n],t);
  for(let i=0;i<c.n;i++)tutorial(P[(shift+i)%c.n],t);
  provideWater(t);
  for(let i=0;i<c.n;i++)farm(P[(shift+i)%c.n],t);
  if(city.cash<0||city.escrow<0||P.some(p=>p.cash<0))throw Error("negative cash");
  lg.minCityCash=Math.min(lg.minCityCash,city.cash);
 }
 const sum=k=>P.reduce((z,p)=>z+p[k],0);
 const cargo=P.reduce((z,p)=>z+(p.cargo?p.cargo.qty:0),0);
 const states={};for(const p of P)states[p.stage]=(states[p.stage]||0)+1;
 const inv={
  money:city.cash+city.escrow+sum("cash")===c.treasury,
  wood:city.wood+lg.woodBuilding===c.cityWood,
  sheets:city.sheets+lg.sheetsBuilding+city.stock+lg.sheetsCityConsumed+sum("warehouse")+cargo===
     c.citySheets+lg.sheetsMade,
  seeds:city.seeds+lg.seedsUsed===c.citySeeds+lg.seedsRestocked,
  water:lg.waterInML===lg.waterSpentML+sum("tank"),
  flow:lg.waterInML<=T*c.sourceMLperMin,
  noNegative:city.cash>=0&&city.escrow>=0&&city.wood>=0&&city.sheets>=0&&city.seeds>=0&&P.every(p=>p.cash>=0&&p.tank>=0&&p.raw>=0&&p.warehouse>=0),
  buffers:city.stock+city.pending<=c.cityWarehouseCap&&P.every(p=>p.warehouse<=c.playerStorage&&p.tank<=c.tankMaxML),
  build:lg.woodBuilding===lg.homes*c.cabinWood&&lg.sheetsBuilding===lg.homes*c.cabinSheets,
  cityBudget:city.buyBudget>=0&&city.buyQty>=0,
  escrow:city.escrow===P.reduce((z,p)=>z+(p.cargo?p.cargo.qty*c.buyPrice:0),0),
  noMint:lg.mint===0&&lg.burn===0,
  raw:sum("harvest")*c.harvestRaw===sum("raw")+lg.sheetsMade/c.paperOut*c.paperRaw+
     P.reduce((z,p)=>z+(p.workUntil!==-1?c.paperRaw:0),0)
 };
 if(Object.values(inv).some(v=>!v))throw Error("GA04 invariant "+JSON.stringify({inv,scenario:{n:c.n,days:c.days}}));
 return {config:{n:c.n,days:c.days,treasury:c.treasury,arrivalEvery:c.arrivalEvery,
  cityWood:c.cityWood,citySheets:c.citySheets,sourceMLperMin:c.sourceMLperMin,
  cityDailyBuy:c.cityDailyBuy,equipmentCAPEX:c.equipmentCAPEX},
  outcomes:{states,homes:lg.homes,started:lg.started,jobs:lg.jobs,extraJobs:lg.extraJobs,
   cityCash:city.cash,escrow:city.escrow,playersCash:sum("cash"),cityMin:lg.minCityCash,
   cityWood:city.wood,starterSheets:city.sheets,citySeeds:city.seeds,
   paperMade:lg.sheetsMade,paperSold:lg.sheetsSold,
   sellersWithSales:P.filter(p=>p.sold>0).length,
   activeWithZeroSales:P.filter(p=>p.stage==="FARM"&&p.sold===0).length,
   maxSellerQty:Math.max(...P.map(p=>p.sold)),
   minSellerQty:Math.min(...P.map(p=>p.sold)),
   cityPaperStock:city.stock,
   paperConsumed:lg.sheetsCityConsumed,playerPaperStock:sum("warehouse"),cargoPaper: cargo,
   waterDeliveredL:lg.waterInML/1000,waterConsumedL:lg.waterSpentML/1000,waterStoredL:sum("tank")/1000,
   harvests:sum("harvest"),seedsUsed:lg.seedsUsed,shipments:lg.shipments,
   waitingForWaterMin:sum("waterWait"),waitingForMoneyMin:sum("cashWait"),waitingForBuyerMin:sum("buyerWait")},
  accounting:lg,invariants:inv,checks:Object.keys(inv).length};
}
function runMatrix(){
 const Q=[];
 for(const n of [1,20,100])for(const days of [1,7,30])
  Q.push({name:"BASE_"+n+"_"+days,n,days,treasury:50000});
 Q.push({name:"100_TREASURY10K",n:100,days:7,treasury:10000},
  {name:"100_STAGGERED10K",n:100,days:7,treasury:10000,arrivalEvery:30},
  {name:"100_SHORT_KITS",n:100,days:7,treasury:50000,cityWood:120,citySheets:80},
  {name:"20_NO_DEMAND",n:20,days:7,treasury:50000,cityDailyBuy:0},
  {name:"20_WATER600LPH",n:20,days:7,treasury:50000,sourceMLperMin:10000},
  {name:"20_EQUIP120",n:20,days:7,treasury:50000,equipmentCAPEX:120},
  {name:"20_TREASURY10K",n:20,days:7,treasury:10000});
 const scenarios=Q.map(q=>({name:q.name,...runCity(q)}));
 const a=runCity({n:20,days:7,treasury:50000});
 const b=runCity({n:20,days:7,treasury:50000});
 if(JSON.stringify(a)!==JSON.stringify(b))throw Error("determinism");
 return {kind:"SYNTHETIC_UNIFIED_CITY",date:"2026-10-17",status:"TEST_ONLY",
  scenarios:scenarios.length,assertions:scenarios.reduce((v,x)=>v+x.checks,0),
  deterministicReplay:true,settings:DEFAULTS,results:scenarios,
  caveats:["Not game server or SQL","Work tasks simulated with fixed due times, not movement",
    "Water paid in 10L packets and growth water at planting",
    "Single municipal workshop slots, fixed city procurement and no player marketplace",
    "No actual geometry, NPC AI, service latency or capex material recipes",
    "All numerical values test fixtures, no automatic canon promotion"]};
}
if(typeof module!=="undefined")module.exports={DEFAULTS,runCity,runMatrix};