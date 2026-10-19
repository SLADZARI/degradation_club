// WORLD ORGANISM 0.8.3 -- federation stress TEST ONLY, not original v0.8, not live game.
// Uses the B5 civic ticket price/physical recipe, but ALL distribution, population,
// city budgets, plant wages and federation policies are experimental assumptions.
import {SESSION_CONTRACT} from './sponsored-services.mjs';
export const FEDERATION_ID='WORLD-ORGANISM/0.8.3-federation-shadow';
export const RULES=Object.freeze({
 totalPAPER:3600,startingCityPAPER:1800,carrotPrice:3,sessionPrice:SESSION_CONTRACT.price,
 harvestCarrot:4,carrotSeeds:2,harvestHemp:6,hempSeeds:2,
 cropWater:2,hempWater:2,craftWater:2,carrotGrowDays:3,hempGrowDays:4,
 // EXPERIMENT: a 4-CARROT harvest receives the same 12 PAPER that 4 residents pay.
 // Physical production and real municipal escrow remain required.
 carrotWage:12,hempWage:6,craftWage:6,freightCapacity:8,
 initialCarrotCapacity:12,carrotShelf:2,initialServiceSlots:1,
 shippingPrice:{WOOD:2,STONE:3},minPAPERForFounding:80,
 // TEST guardrail: baseline operating reserve and weekly 24 PAPER welfare ceiling.
 welfareMinTreasury:90,welfareWeeklyLimit:24,
});
const must=(yes,message)=>{if(!yes)throw new Error(message);};
const sum=(xs)=>xs.reduce((a,b)=>a+b,0);
const cityMaterials={
 WOOD:[12,145,20,8],STONE:[6,15,85,4],WATER:[24,32,18,8],
 SEED_CARROT:[6,8,10,3],SEED_HEMP:[3,5,3,1],
};
const buildings=[
 {id:'garden',signal:'UNMET_MEALS_OR_POPULATION',wood:18,stone:8,wage:24,afterDay:38},
 {id:'fieldEast',signal:'REAL_MEAL_SHORTAGE',wood:14,stone:6,wage:19,afterDay:75},
 {id:'fieldWest',signal:'PROLONGED_MEAL_SHORTAGE',wood:16,stone:8,wage:21,afterDay:110},
 {id:'cistern',signal:'WATER_SHORTAGE',wood:14,stone:12,wage:20,afterDay:45},
 {id:'marketHall',signal:'UNSERVED_CIVIC',wood:20,stone:10,wage:26,afterDay:48},
 {id:'coldStore',signal:'SPOILAGE',wood:16,stone:10,wage:24,afterDay:52},
 {id:'freightDepot',signal:'CARGO_BLOCKAGE',wood:18,stone:14,wage:28,afterDay:65},
];
export const FEDERATION_PROJECTS=buildings.map(x=>({...x}));
const unique=(a)=>new Set(a).size===a.length;
function createCity(id,index,treasury,environment){
 const stock=Object.fromEntries(['WOOD','STONE','WATER','CARROT','HEMP','PAPER_SHEET','SEED_CARROT','SEED_HEMP'].map(k=>[k,cityMaterials[k]?.[index]||0]));
 return {id,index,treasury,stock,exportable:{WOOD:stock.WOOD,STONE:stock.STONE},carrots:[],plots:[{ready:0},{ready:0}],
  hempBed:{ready:0},buildings:[],rainBonus:0,storageCapacity:RULES.initialCarrotCapacity,
  carrotShelf:RULES.carrotShelf,maxWater:100,serviceSlots:RULES.initialServiceSlots,
  freightCapacity:RULES.freightCapacity,
  unmetMeals:0,unmetNoCash:0,unmetNoFood:0,spoiledCarrot:0,unservedCivic:0,waterShortage:0,
  blockedCargo:0,blockedStorage:0,unfundedWorks:0,harvests:0,services:0,serviceRevenue:0,
  foodSales:0,foodNeeds:0,foodServed:0,subsidizedMeals:0,subsidySpent:0,subsidizedZeroWallet:0,welfareWeeklySpent:{},welfareDeniedBudget:0,workWages:0,workerTurn:0,consignmentPayout:0,ownMeals:0,transportBought:0,
  sourceEvents:[],version:0,environment};
}
const active=(world,player)=>world.activity==='daily'||world.day%7<2;
function residents(world,city){return world.players.filter(p=>p.cityId===city.id);}
function working(world,city){
 const eligible=residents(world,city).filter(p=>active(world,p));
 if(!eligible.length)return undefined;
 const worker=eligible[city.workerTurn%eligible.length];
 city.workerTurn++; // distribute real, funded work among eligible local residents
 return worker;
}
function refillRain(world,city){
 const rain=world.environment==='dry'?1:world.environment==='wet'?10:6;
 const v=rain+city.rainBonus; // all inflow originates in the weather ledger
 const prior=city.stock.WATER;
 city.stock.WATER=Math.min(city.maxWater,prior+v);
 world.waterFromRain+=v;
 world.waterRunoff+=Math.max(0,prior+v-city.maxWater); // excess is discharged, not mysteriously lost
}
const carrotCount=city=>city.carrots.reduce((n,b)=>n+b.qty,0);
function takeCarrot(city,qty=1){
 must(carrotCount(city)>=qty,'trying to sell nonexistent CARROT');
 let remaining=qty,owners=[];
 for(const b of city.carrots){
   const n=Math.min(remaining,b.qty);
   if(n>0)owners.push({ownerId:b.ownerId,qty:n});
   b.qty-=n;remaining-=n;if(!remaining)break;
 }
 city.carrots=city.carrots.filter(x=>x.qty>0);city.stock.CARROT-=qty;
 return owners;
}
function takeOwnFood(city,actorId){
 const owned=city.carrots.find(b=>b.ownerId===actorId&&b.qty>0);
 if(!owned)return false;
 owned.qty--;city.stock.CARROT--;
 city.carrots=city.carrots.filter(b=>b.qty>0);return true;
}
function payGrowers(world,city,portions){
 for(const p of portions){
   const owner=playerById(world,p.ownerId);
   must(owner,'carrot delivery from unknown grower');
   owner.wallet+=p.qty*RULES.carrotPrice;
   owner.workIncome+=p.qty*RULES.carrotPrice;
   city.consignmentPayout+=p.qty*RULES.carrotPrice;
 }
}
function expireCarrot(world,city){
 const retained=[];
 for(const b of city.carrots){
   if(world.day-b.at>=city.carrotShelf){
     city.stock.CARROT-=b.qty;city.spoiledCarrot+=b.qty;world.consumed.CARROT_SPOILED+=b.qty;
   }else retained.push(b);
 }
 city.carrots=retained;
}
const payWorker=(world,city,person,wage)=>{
 if(!person||city.treasury<wage)return false;
 city.treasury-=wage;person.wallet+=wage;person.workIncome+=wage;city.workWages+=wage;world.wages+=wage;return true;
};
function foodForResidents(world,city){
 const residentsToday=residents(world,city);
 // Rotate the service queue, rather than permanently favoring player #1.
 const shift=['cooperative-basic','cooperative-guarded'].includes(world.foodMarket)?world.day%Math.max(1,residentsToday.length):0;
 const queue=residentsToday.slice(shift).concat(residentsToday.slice(0,shift));
 let basicMealsIssued=0;
 for(const p of queue){
   if(!active(world,p))continue;
   city.foodNeeds++;world.foodNeeds++;p.foodNeeds++;
   const guarded=world.foodMarket==='cooperative-guarded';
   const basic=world.foodMarket==='cooperative-basic'||guarded;
   const week=Math.floor(world.day/7),weekKey=String(week);
   const potentialCover=Math.max(0,RULES.carrotPrice-p.wallet);
   const budgetAllows=!guarded||(
     city.treasury-potentialCover>=RULES.welfareMinTreasury&&
     (city.welfareWeeklySpent[weekKey]||0)+potentialCover<=RULES.welfareWeeklyLimit
   );
   const eligibleHelp=(world.foodMarket==='cooperative'||basic)&&
     p.wallet<RULES.carrotPrice&&(p.wallet>=1||(basic&&basicMealsIssued<1));
   const assistance=eligibleHelp&&city.treasury>=potentialCover&&budgetAllows;
   if(guarded&&eligibleHelp&&carrotCount(city)>0&&!budgetAllows)city.welfareDeniedBudget++;
   if(carrotCount(city)>0&&(p.wallet>=RULES.carrotPrice||assistance)){
     const contribution=assistance?p.wallet:RULES.carrotPrice;
     const cityCover=RULES.carrotPrice-contribution;
     if(basic&&p.wallet===0&&cityCover===3){basicMealsIssued++;city.subsidizedZeroWallet++;}
     p.wallet-=contribution;
     if(cityCover){city.treasury-=cityCover;city.subsidySpent+=cityCover;city.subsidizedMeals++;p.helpedMeals++;
       if(guarded)city.welfareWeeklySpent[weekKey]=(city.welfareWeeklySpent[weekKey]||0)+cityCover;}
     const portions=takeCarrot(city);
     if(['consignment','cooperative','cooperative-basic','cooperative-guarded'].includes(world.foodMarket))payGrowers(world,city,portions);
     else city.treasury+=RULES.carrotPrice;
     city.foodSales+=RULES.carrotPrice;
     city.foodServed++;p.foodEaten++;world.consumed.CARROT_PLAYER++;
   }else if(['consignment','cooperative','cooperative-basic','cooperative-guarded'].includes(world.foodMarket)&&takeOwnFood(city,p.id)){
     // A grower can eat their own physical carrot without first purchasing it.
     city.foodServed++;city.ownMeals++;p.foodEaten++;world.consumed.CARROT_PLAYER++;
   }else{
     city.unmetMeals++;world.unmetMeals++;p.foodUnmet++;
     if(carrotCount(city)===0)city.unmetNoFood++;
     else city.unmetNoCash++;
   }
 }
}
function farm(world,city){
 const worker=working(world,city);
 if(!worker)return;
 for(const [plotIndex,bed] of city.plots.entries()){
   if(bed.ready>0&&bed.ready<=world.day){
     if(carrotCount(city)+RULES.harvestCarrot<=city.storageCapacity&&
        (['consignment','cooperative','cooperative-basic','cooperative-guarded'].includes(world.foodMarket)||city.treasury>=RULES.carrotWage)){
       if(!['consignment','cooperative','cooperative-basic','cooperative-guarded'].includes(world.foodMarket))
         must(payWorker(world,city,worker,RULES.carrotWage),'CARROT wages not paid');
       city.stock.CARROT+=RULES.harvestCarrot;
       city.carrots.push({at:world.day,qty:RULES.harvestCarrot,ownerId:worker.id});
       city.stock.SEED_CARROT+=RULES.carrotSeeds;
       world.grown.CARROT+=RULES.harvestCarrot;world.grown.SEED_CARROT+=RULES.carrotSeeds;
       city.harvests++;bed.ready=0;
     }else{
       if(carrotCount(city)+RULES.harvestCarrot>city.storageCapacity)city.blockedStorage++;
       else city.unfundedWorks++;
     }
   }
   if(!bed.ready){
     if(city.stock.SEED_CARROT>0&&city.stock.WATER>=RULES.cropWater){
       city.stock.SEED_CARROT--;world.consumed.SEED_CARROT++;
       city.stock.WATER-=RULES.cropWater;world.consumed.WATER+=RULES.cropWater;
       // Each plot has its own crop schedule: stagger FIRST sowing across days.
       // After harvest, a plot keeps its 3-day cycle; no additional CARROT is minted.
       bed.ready=world.day+RULES.carrotGrowDays+(bed.plantedOnce?0:plotIndex%RULES.carrotGrowDays);
       bed.plantedOnce=true;
     }else if(city.stock.WATER<RULES.cropWater)city.waterShortage++;
   }
 }
 if(city.hempBed.ready>0&&city.hempBed.ready<=world.day){
   if(city.treasury>=RULES.hempWage&&city.stock.HEMP<=24){
     must(payWorker(world,city,worker,RULES.hempWage),'HEMP wages not paid');
     city.stock.HEMP+=RULES.harvestHemp;world.grown.HEMP+=RULES.harvestHemp;
     city.stock.SEED_HEMP+=RULES.hempSeeds;world.grown.SEED_HEMP+=RULES.hempSeeds;
     city.hempBed.ready=0;
   }else city.unfundedWorks++;
 }
 if(!city.hempBed.ready&&city.stock.SEED_HEMP>0&&city.stock.WATER>=RULES.hempWater){
   city.stock.SEED_HEMP--;world.consumed.SEED_HEMP++;
   city.stock.WATER-=RULES.hempWater;world.consumed.WATER+=RULES.hempWater;
   city.hempBed.ready=world.day+RULES.hempGrowDays;
 }
 if(city.stock.HEMP>=6&&city.stock.WATER>=RULES.craftWater&&city.stock.PAPER_SHEET<3
    &&city.treasury>=RULES.craftWage){
   must(payWorker(world,city,worker,RULES.craftWage),'paper crafting wages not paid');
   city.stock.HEMP-=6;world.consumed.HEMP_CRAFT+=6;
   city.stock.WATER-=RULES.craftWater;world.consumed.WATER+=RULES.craftWater;
   city.stock.PAPER_SHEET++;world.grown.PAPER_SHEET++;
 }
}
export function cityById(world,id){return world.cities.find(c=>c.id===id);}
export function playerById(world,id){return world.players.find(p=>p.id===id);}
export function createFederation({agents=15,cityCount=3,environment='normal',
  logistics='trade',activity='daily',foodMarket='municipal'}={}){
 must(Number.isInteger(agents)&&agents>=10&&agents<=20,'federation agents range 10-20');
 must(Number.isInteger(cityCount)&&cityCount>=2&&cityCount<=4,'federation cities range 2-4');
 must(['normal','dry','wet'].includes(environment),'unknown weather');
 must(['trade','local'].includes(logistics),'unknown logistics');
 must(['daily','weekends'].includes(activity),'unknown activity');
 must(['municipal','consignment','cooperative','cooperative-basic','cooperative-guarded'].includes(foodMarket),'unknown food ownership policy');
 const treasuries=Array.from({length:cityCount},(_,i)=>Math.floor(RULES.startingCityPAPER/cityCount)+(i===0?RULES.startingCityPAPER%cityCount:0));
 const cities=treasuries.map((money,i)=>createCity('city-'+(i+1),i,money,environment));
 const walletPool=RULES.totalPAPER-RULES.startingCityPAPER;
 const players=Array.from({length:agents},(_,i)=>({
   id:'agent-'+(i+1),cityId:cities[i%cityCount].id,
   wallet:Math.floor(walletPool/agents)+(i<walletPool%agents?1:0),workIncome:0,foodNeeds:0,foodEaten:0,foodUnmet:0,helpedMeals:0,active:true
 }));
 const initial={...Object.fromEntries(['WOOD','STONE','WATER','SEED_CARROT','SEED_HEMP'].map(k=>
   [k,sum(cities.map(c=>c.stock[k]))]))};
 const world={schema:FEDERATION_ID,day:30,activity,environment,logistics,foodMarket,
   cities,players,initial,moneyAtStart:RULES.totalPAPER,
   deliveries:[],deliveryIds:[],arrivalHistory:[],rejectedShipments:0,nextShipment:1,
   movements:[],movementIds:[],cityCreationIds:[],
   grown:{CARROT:0,HEMP:0,PAPER_SHEET:0,SEED_CARROT:0,SEED_HEMP:0},
   consumed:{CARROT_PLAYER:0,CARROT_CIVIC:0,CARROT_SPOILED:0,PAPER_SHEET_CIVIC:0,
     HEMP_CRAFT:0,SEED_CARROT:0,SEED_HEMP:0,WATER:0},
   embodied:{WOOD:0,STONE:0},waterFromRain:0,waterRunoff:0,foodNeeds:0,unmetMeals:0,
   wages:0,totalServices:0,totalBuildings:0,processedDays:0};
 checkFederation(world);return world;
}
const goods=(world,key)=>sum(world.cities.map(c=>c.stock[key]))+
 sum(world.deliveries.filter(d=>d.status==='IN_TRANSIT'&&d.asset===key).map(d=>d.qty));
export function federationBalances(world){
 const held=world.deliveries.filter(s=>s.status==='IN_TRANSIT');
 const funds=sum(world.cities.map(c=>c.treasury))+sum(world.players.map(p=>p.wallet))+sum(held.map(d=>d.escrow));
 return {PAPER:funds,
   WOOD:goods(world,'WOOD')+world.embodied.WOOD,
   STONE:goods(world,'STONE')+world.embodied.STONE,
   WATER:goods(world,'WATER')+world.consumed.WATER+world.waterRunoff-world.waterFromRain,
   SEED_CARROT:goods(world,'SEED_CARROT')+world.consumed.SEED_CARROT-world.grown.SEED_CARROT,
   SEED_HEMP:goods(world,'SEED_HEMP')+world.consumed.SEED_HEMP-world.grown.SEED_HEMP,
   CARROT:goods(world,'CARROT')+world.consumed.CARROT_PLAYER+
     world.consumed.CARROT_CIVIC+world.consumed.CARROT_SPOILED-world.grown.CARROT,
   HEMP:goods(world,'HEMP')+world.consumed.HEMP_CRAFT-world.grown.HEMP,
   PAPER_SHEET:goods(world,'PAPER_SHEET')+world.consumed.PAPER_SHEET_CIVIC-world.grown.PAPER_SHEET};
}
export function checkFederation(world){
 must(world.schema===FEDERATION_ID,'not federation model');
 must(unique(world.cities.map(x=>x.id)),'duplicate city id');
 must(unique(world.players.map(x=>x.id)),'duplicate player id');
 must(unique(world.deliveries.map(x=>x.id)),'duplicate shipment id');
 must(unique(world.cityCreationIds),'duplicate city founding action ID');
 const b=federationBalances(world);
 for(const key of ['PAPER','WOOD','STONE','WATER','SEED_CARROT','SEED_HEMP'])
   must(b[key]=== (key==='PAPER'?world.moneyAtStart:world.initial[key]),
     'federation balance violation '+key+': '+b[key]);
 for(const key of ['CARROT','HEMP','PAPER_SHEET'])
   must(b[key]===0,'federation material violation '+key+': '+b[key]);
 for(const c of world.cities){
   if(['consignment','cooperative','cooperative-basic','cooperative-guarded'].includes(world.foodMarket))must(c.carrots.every(b=>!!playerById(world,b.ownerId)),
     'consignment carrots have no registered owner');
   must(c.treasury>=0&&Number.isSafeInteger(c.treasury),'negative treasury '+c.id);
   must(Object.values(c.stock).every(v=>Number.isSafeInteger(v)&&v>=0),'negative city stocks '+c.id);
   must(carrotCount(c)===c.stock.CARROT,'carrot provenance not reflected in stock '+c.id);
   must(unique(c.buildings),'building repeated '+c.id);
   if(world.foodMarket==='cooperative-guarded')for(const spent of Object.values(c.welfareWeeklySpent))
     must(spent<=RULES.welfareWeeklyLimit,'weekly subsidy cap exceeded');
   must(c.plots.length>=2&&c.plots.length<=8,'unbounded plot creation');
   for(const k of ['WOOD','STONE'])must(Number.isSafeInteger(c.exportable[k])&&c.exportable[k]>=0&&
     c.exportable[k]<=c.stock[k],'exporting imported assets or broken provenance '+c.id+' '+k);
 }
 for(const p of world.players){
   must(Number.isSafeInteger(p.wallet)&&p.wallet>=0,'negative player balance');
   must(p.foodNeeds===p.foodEaten+p.foodUnmet,'resident-level food ledger mismatch');
   must(!!cityById(world,p.cityId),'player in nonexistent city');
 }
 for(const d of world.deliveries){
   must(d.qty>0&&Number.isSafeInteger(d.qty)&&d.escrow>=0&&Number.isSafeInteger(d.escrow),
     'bad cargo or cargo escrow');
   must(['IN_TRANSIT','DELIVERED'].includes(d.status),'invalid shipment status');
   must(!!cityById(world,d.from)&&!!cityById(world,d.to),'shipment points to invalid city');
 }
 for(const c of world.cities)must(c.unmetMeals===c.unmetNoCash+c.unmetNoFood,'food-access attribution mismatch');
 must(world.totalBuildings===sum(world.cities.map(c=>c.buildings.length)),'missing building ledger');
 return true;
}
const projectNeed=(city,project,pop)=>({
 garden:pop>=5||city.unmetMeals>=9,
 fieldEast:city.buildings.includes('garden')&&city.unmetMeals>=70,
 fieldWest:city.buildings.includes('fieldEast')&&city.unmetMeals>=200,
 cistern:city.waterShortage>=12,
 marketHall:city.unservedCivic>=12,
 coldStore:city.spoiledCarrot>=8||city.blockedStorage>=8,
 freightDepot:city.blockedCargo>=8
})[project.id]===true;
function bookEvent(city,key){if(city.sourceEvents.includes(key))return false;city.sourceEvents.push(key);return true;}
export function proposeProject(world,cityId,projectId,actorId){
 const city=cityById(world,cityId),p=playerById(world,actorId);
 const x=buildings.find(b=>b.id===projectId);
 must(city&&x&&p,'missing project actors');
 must(p.cityId===cityId,'worker is not a local resident');
 if(city.buildings.includes(x.id)||world.day<x.afterDay||
     !projectNeed(city,x,residents(world,city).length))return {ok:false,reason:'not-needed'};
 if(city.stock.WOOD<x.wood||city.stock.STONE<x.stone)return {ok:false,reason:'missing-material'};
 if(city.treasury<x.wage)return {ok:false,reason:'unfunded'};
 city.stock.WOOD-=x.wood;city.stock.STONE-=x.stone;
 // Use imported stocks first when building; never let native export pool exceed stock.
 city.exportable.WOOD=Math.min(city.exportable.WOOD,city.stock.WOOD);
 city.exportable.STONE=Math.min(city.exportable.STONE,city.stock.STONE);
 world.embodied.WOOD+=x.wood;world.embodied.STONE+=x.stone;
 must(payWorker(world,city,p,x.wage),'building wage');
 city.buildings.push(x.id);world.totalBuildings++;bookEvent(city,'built:'+x.id);
 if(['garden','fieldEast','fieldWest'].includes(x.id))city.plots.push({ready:0},{ready:0});
 if(x.id==='cistern'){city.rainBonus+=3;city.maxWater+=30;}
 if(x.id==='marketHall')city.serviceSlots++;
 if(x.id==='coldStore'){city.carrotShelf+=2;city.storageCapacity+=8;}
 if(x.id==='freightDepot')city.freightCapacity+=4;
 checkFederation(world);
 return {ok:true,projectId:x.id,cityId};
}
export function ship(world,{from,to,asset,qty,shipmentId,actorId,accepted=false}){
 const old=world.deliveries.find(s=>s.id===shipmentId);
 if(old)return old;
 must(typeof shipmentId==='string'&&shipmentId.length>=4,'ship ID required');
 must(['WOOD','STONE','PAPER_SHEET'].includes(asset),'unsupported freight item');
 must(Number.isSafeInteger(qty)&&qty>0,'invalid freight quantity');
 const a=cityById(world,from),b=cityById(world,to),actor=playerById(world,actorId);
 must(a&&b&&a!==b&&actor,'invalid logistics parties');
 must(actor.cityId===from,'actor must be present at dispatch city');
 must(accepted===true,'carrier approval required');
 if(world.logistics==='local')return {ok:false,reason:'isolated-city'};
 const pathLength=Math.abs(a.index-b.index);
 const price=RULES.shippingPrice[asset]||1,escrow=price*qty;
 if(qty>a.freightCapacity){a.blockedCargo++;world.rejectedShipments++;return {ok:false,reason:'capacity'};}
 if(a.stock[asset]<qty){world.rejectedShipments++;return {ok:false,reason:'stock'};}
 if(['WOOD','STONE'].includes(asset)&&a.exportable[asset]<qty){
   world.rejectedShipments++;return {ok:false,reason:'non-exportable-import'};
 }
 if(b.treasury<escrow){world.rejectedShipments++;return {ok:false,reason:'unfunded'};}
 a.stock[asset]-=qty;
 if(['WOOD','STONE'].includes(asset))a.exportable[asset]-=qty;
 b.treasury-=escrow;
 const d={id:shipmentId,asset,qty,from,to,actorId,eta:world.day+pathLength,
   status:'IN_TRANSIT',escrow,sourcePayment:price,deliveredAt:null};
 world.deliveries.push(d);world.deliveryIds.push(shipmentId);
 checkFederation(world);return d;
}
function arrive(world){
 for(const d of world.deliveries.filter(x=>x.status==='IN_TRANSIT'&&x.eta<=world.day)){
   const seller=cityById(world,d.from),buyer=cityById(world,d.to);
   buyer.stock[d.asset]+=d.qty;seller.treasury+=d.escrow;
   d.escrow=0;d.status='DELIVERED';d.deliveredAt=world.day;
   world.arrivalHistory.push(d.id);
 }
}
export function foundCity(world,{id,parentId,actorId,eventId,funding=80,wood=4,stone=3,
  seedCarrot=2,seedHemp=1,accepted=false}){
 must(typeof eventId==='string'&&eventId.length>=4,'invalid founding ID');
 const existing=world.cityCreationIds.includes(eventId);
 if(existing)return cityById(world,id);
 must(accepted===true,'new city requires approval');
 const source=cityById(world,parentId),actor=playerById(world,actorId);
 must(source&&actor&&actor.cityId===parentId,'invalid founder authorization');
 must(!cityById(world,id),'duplicate city name');
 must(world.cities.length<5,'max five cities in this TEST');
 must(funding>=RULES.minPAPERForFounding,'unfunded city cannot be founded');
 for(const [asset,count] of [['WOOD',wood],['STONE',stone],
   ['SEED_CARROT',seedCarrot],['SEED_HEMP',seedHemp]])
   must(Number.isSafeInteger(count)&&count>=0&&source.stock[asset]>=count,'unsupported founding resources '+asset);
 must(source.treasury>=funding,'not enough source city treasury');
 const newCity=createCity(id,world.cities.length,0,world.environment);
 // New city gets NO naturally prefabricated materials or city PAPER. All assets
 // move from an existing owner. Natural rain subsequently follows city terrain.
 Object.keys(newCity.stock).forEach(key=>newCity.stock[key]=0);
 newCity.exportable.WOOD=0;newCity.exportable.STONE=0;
 newCity.treasury=funding;source.treasury-=funding;
 for(const [asset,count] of [['WOOD',wood],['STONE',stone],
   ['SEED_CARROT',seedCarrot],['SEED_HEMP',seedHemp]]){
     newCity.stock[asset]+=count;source.stock[asset]-=count;
     if(['WOOD','STONE'].includes(asset)){
       const nativeMoved=Math.min(source.exportable[asset],count);
       source.exportable[asset]-=nativeMoved;
       newCity.exportable[asset]+=nativeMoved;
       source.exportable[asset]=Math.min(source.exportable[asset],source.stock[asset]);
     }
 }
 world.cities.push(newCity);actor.cityId=id;world.cityCreationIds.push(eventId);
 checkFederation(world);return newCity;
}
export function movePlayer(world,{actorId,to,eventId}){
 if(world.movementIds.includes(eventId))return playerById(world,actorId);
 const p=playerById(world,actorId),city=cityById(world,to);
 must(p&&city,'invalid player move');
 must(typeof eventId==='string'&&eventId.length>3,'missing movement request ID');
 p.cityId=to;world.movementIds.push(eventId);world.movements.push({actorId,to,at:world.day});
 checkFederation(world);return p;
}
export function authorizeSession(world,{actorId,cityId,eventId,accepted=false}){
 must(accepted===true,'explicit citizen authorization required');
 const p=playerById(world,actorId),city=cityById(world,cityId);
 must(p&&city&&p.cityId===cityId,'not the paying citizen');
 if(city.sourceEvents.includes('service:'+eventId))return {ok:true,replay:true};
 if(p.wallet<RULES.sessionPrice)return {ok:false,reason:'wallet'};
 if(city.stock.PAPER_SHEET<1||city.stock.CARROT<1)return {ok:false,reason:'physical-supply'};
 must(bookEvent(city,'service:'+eventId),'service replay');
 p.wallet-=RULES.sessionPrice;
 city.stock.PAPER_SHEET--;world.consumed.PAPER_SHEET_CIVIC++;
 const portions=takeCarrot(city);world.consumed.CARROT_CIVIC++;
 const cityIncome=['consignment','cooperative','cooperative-basic','cooperative-guarded'].includes(world.foodMarket)?RULES.sessionPrice-RULES.carrotPrice:RULES.sessionPrice;
 city.treasury+=cityIncome;
 if(['consignment','cooperative','cooperative-basic','cooperative-guarded'].includes(world.foodMarket))payGrowers(world,city,portions);
 city.services++;city.serviceRevenue+=cityIncome;world.totalServices++;
 checkFederation(world);
 return {ok:true,paid:RULES.sessionPrice,realGoods:['PAPER_SHEET','CARROT']};
}
function weeklyServices(world,city){
 if(world.day%7!==0)return;
 const candidates=residents(world,city).filter(p=>active(world,p)&&p.wallet>=RULES.sessionPrice);
 const slots=city.serviceSlots;
 city.unservedCivic+=Math.max(0,candidates.length-slots);
 for(let i=0;i<Math.min(slots,candidates.length);i++){
  const p=candidates[i];
  const booked=authorizeSession(world,{actorId:p.id,cityId:city.id,
    eventId:'week:'+world.day+':'+city.id+':'+p.id,accepted:true});
  if(!booked.ok)city.unservedCivic++;
 }
}
function requestSupplies(world,city,project){
 const need=Object.entries({WOOD:project.wood,STONE:project.stone});
 for(const [kind,qty] of need){
  const incoming=sum(world.deliveries.filter(x=>x.status==='IN_TRANSIT'&&x.to===city.id&&x.asset===kind).map(x=>x.qty));
  const deficit=Math.max(0,qty-city.stock[kind]-incoming);
  if(!deficit)continue;
  for(const seller of world.cities){
   if(seller.id===city.id)continue;
   const sellerPop=residents(world,seller).length;
   const pending=buildings.filter(b=>!seller.buildings.includes(b.id)&&
     world.day>=b.afterDay&&projectNeed(seller,b,sellerPop));
   const reserve=Math.max(kind==='WOOD'?6:4,...pending.map(p=>kind==='WOOD'?p.wood:p.stone));
   const movable=Math.max(0,Math.min(seller.stock[kind],seller.exportable[kind])-reserve);
   if(!movable)continue;
   const shipmentQty=Math.min(deficit,movable,seller.freightCapacity);
   if(shipmentQty<=0)continue;
   const actor=working(world,seller);if(!actor)continue;
   ship(world,{from:seller.id,to:city.id,asset:kind,qty:shipmentQty,
     shipmentId:'restock:'+city.id+':'+project.id+':'+kind+':'+world.day+':'+seller.id,
     actorId:actor.id,accepted:true});
   return; // one shipment max per city per day; preserves transport capacity
  }
 }
}
function develop(world,city){
 const worker=working(world,city);if(!worker)return;
 for(const x of buildings){
  if(city.buildings.includes(x.id)||world.day<x.afterDay||
    !projectNeed(city,x,residents(world,city).length))continue;
  if(city.stock.WOOD<x.wood||city.stock.STONE<x.stone){
    if(world.logistics==='trade')requestSupplies(world,city,x);
    continue;
  }
  if(city.treasury<x.wage){city.unfundedWorks++;continue;}
  proposeProject(world,city.id,x.id,worker.id);
 }
}
export function dayStep(world){
 must(world.schema===FEDERATION_ID,'invalid world');
 world.day++;
 arrive(world);
 for(const c of world.cities){
   refillRain(world,c);
   expireCarrot(world,c);
   farm(world,c); // harvest before citizens shop: fresh produce is available on harvest day
   foodForResidents(world,c);
   weeklyServices(world,c);
 }
 for(const city of world.cities)develop(world,city);
 world.processedDays++;
 checkFederation(world);
 return world;
}
export function federationRun({days=180,...options}={}){
 must(Number.isInteger(days)&&days>=0&&days<=370,'future federation days must be 0..370');
 const world=createFederation(options);
 for(let i=0;i<days;i++)dayStep(world);
 return world;
}
export function federationMetrics(world){
 const cityRows=world.cities.map(c=>({id:c.id,population:residents(world,c).length,
  treasury:c.treasury,rawWOOD:c.stock.WOOD,rawSTONE:c.stock.STONE,
  water:c.stock.WATER,carrot:c.stock.CARROT,paperSheet:c.stock.PAPER_SHEET,
  founded:c.index>=4,buildings:c.buildings,unmetFood:c.unmetMeals,unmetNoCash:c.unmetNoCash,unmetNoFood:c.unmetNoFood,
  ownMeals:c.ownMeals,consignmentPayout:c.consignmentPayout,
  subsidizedMeals:c.subsidizedMeals,subsidySpent:c.subsidySpent,zeroWalletMeals:c.subsidizedZeroWallet,
  welfareDeniedBudget:c.welfareDeniedBudget,weeklyWelfare:c.welfareWeeklySpent,
  services:c.services,feesAndSales:c.serviceRevenue,unservedRequests:c.unservedCivic,
  spoilage:c.spoiledCarrot,missingWater:c.waterShortage,blockedCargo:c.blockedCargo,blockedStorage:c.blockedStorage,
  exportable:c.exportable,
  cargoImports:world.arrivalHistory.filter(id=>world.deliveries.find(d=>d.id===id)?.to===c.id).length}));
 return {status:'EXPERIMENTAL_FEDERATION_NOT_ORIGINAL_NOT_SERVER',
  model:FEDERATION_ID,day:world.day,projectionDays:world.day-30,
  agents:world.players.length,cities:world.cities.length,activity:world.activity,
  environment:world.environment,logistics:world.logistics,foodMarket:world.foodMarket,
  economy:{moneyTotal:federationBalances(world).PAPER,
    cityMoney:sum(world.cities.map(c=>c.treasury)),playerMoney:sum(world.players.map(p=>p.wallet)),
    escrow:sum(world.deliveries.filter(d=>d.status==='IN_TRANSIT').map(d=>d.escrow)),
    cityBuildings:world.totalBuildings,civicSessions:world.totalServices,
    workWages:world.wages},
  logisticsReport:{shipped:world.deliveries.length,
    delivered:world.arrivalHistory.length,inTransit:world.deliveries.filter(d=>d.status==='IN_TRANSIT').length,
    rejections:world.rejectedShipments},
  food:{needs:world.foodNeeds,unmet:world.unmetMeals,
    subsidized:sum(world.cities.map(c=>c.subsidizedMeals)),
    zeroWalletMeals:sum(world.cities.map(c=>c.subsidizedZeroWallet)),
    subsidiesSpent:sum(world.cities.map(c=>c.subsidySpent)),
    noCash:sum(world.cities.map(c=>c.unmetNoCash)),noFood:sum(world.cities.map(c=>c.unmetNoFood)),
    eaten:world.consumed.CARROT_PLAYER,
    civic:world.consumed.CARROT_CIVIC,spoiled:world.consumed.CARROT_SPOILED,
    grown:world.grown.CARROT},
  water:{initial:world.initial.WATER,rain:world.waterFromRain,consumed:world.consumed.WATER,
    runoff:world.waterRunoff,stored:goods(world,'WATER')},
  minerals:{WOOD_INITIAL:world.initial.WOOD,WOOD_STOCK:goods(world,'WOOD'),
    WOOD_IN_BUILDINGS:world.embodied.WOOD,STONE_INITIAL:world.initial.STONE,
    STONE_STOCK:goods(world,'STONE'),STONE_IN_BUILDINGS:world.embodied.STONE},
  residentFood:world.players.map(p=>({id:p.id,cityId:p.cityId,needs:p.foodNeeds,eaten:p.foodEaten,unmet:p.foodUnmet,helped:p.helpedMeals,wallet:p.wallet})),
  walletDistribution:{min:Math.min(...world.players.map(p=>p.wallet)),max:Math.max(...world.players.map(p=>p.wallet)),
    workersPaid:world.players.filter(p=>p.workIncome>0).length,zeroWallets:world.players.filter(p=>p.wallet===0).length},
  cityRows,ledger:federationBalances(world)};
}
