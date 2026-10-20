// Read-only, aggregate-only observer for WORLD ORGANISM. No mutation, no save or player identifiers.
export const BRIDGE_SCHEMA='dementor-organism-live-v1';
const quantity=x=>Number.isFinite(Number(x))&&Number(x)>0?Number(x):0;
const add=(map,key,value)=>{const n=quantity(value);if(n)map[key]=(map[key]||0)+n;};
const iterate=o=>o&&typeof o==='object'?Object.entries(o):[];
export function aggregateWorld(network,{version='unknown',testMode=false,now=new Date().toISOString()}={}){
 const cities=[],stock={},stockByLocation={field:{},warehouse:{},municipal:{},bag:{},shop:{},ground:{},transit:{}};
 let treasury=0,wallets=0,tills=0,playerCount=0,onlineCount=0,plots=0,houses=0,leasedPlots=0,deliveries=0,pendingDelivery=0;
 for(const [cityId,g] of network.games){
  const s=g.state||{},users=Object.values(s.players||{}),cityTreasury=quantity(s.treasury);
  treasury+=cityTreasury;playerCount+=users.length;onlineCount+=g.online?.size||0;
  let homes=0,owned=0,rented=0,shopTills=0;
  for(const p of s.plots||[]){if(p.owner){owned++;if(p.home?.tent||p.home?.beds?.length)homes++;}if(p.lease)rented++;shopTills+=quantity(p.shop?.till);for(const [k,v]of iterate(p.shop?.stock))add(stockByLocation.shop,k,v);}
  plots+=owned;houses+=homes;leasedPlots+=rented;tills+=shopTills;
  for(const p of users){wallets+=quantity(p.wallet);for(const [k,v]of iterate(p.bag))add(stockByLocation.bag,k,v);
   if(p.delivery){if(p.delivery.picked){deliveries++;add(stockByLocation.transit,p.delivery.kind,p.delivery.quantity);}else pendingDelivery++;}
  }
  for(const r of s.resources||[])add(stockByLocation.field,r.type,r.stock);
  for(const [k,v]of iterate(s.warehouse?.stock))add(stockByLocation.warehouse,k,v);
  for(const [k,v]of iterate(s.warehouse?.municipal))add(stockByLocation.municipal,k,v);
  for(const d of s.drops||[])add(stockByLocation.ground,d.kind,d.quantity);
  const projects={};for(const [key,def] of [['plaza',s.project],['forge',s.forge],['bridge',s.bridge],['seedMarket',s.seedMarket],['publicGarden',s.gardenProject],['secondBridge',s.secondBridge]])if(def)projects[key]={stage:def.stage??null,work:def.work??null,accepted:{wood:quantity(def.accepted?.wood),stone:quantity(def.accepted?.stone)},stock:{wood:quantity(def.stock?.wood),stone:quantity(def.stock?.stone)}};
  cities.push({cityId,treasury:cityTreasury,freeBudget:typeof g.cityFunds==='function'?quantity(g.cityFunds()):null,players:users.length,online:g.online?.size||0,plots:owned,housing:homes,leases:rented,shopsTill:shopTills,revision:s.revision??null,projects,ledgerEvents:{transactions:s.transactions?.length||0,materialEvents:s.materialEvents?.length||0}});
 }
 for(const map of Object.values(stockByLocation))for(const [kind,n]of Object.entries(map))add(stock,kind,n);
 return {schema:BRIDGE_SCHEMA,source:testMode?'ISOLATED_RUNTIME':'SERVER_READ_ONLY',version,at:now,scope:'all-server-cities',privacy:'AGGREGATE_ONLY',coverage:{treasuryWalletTill:true,knownInventories:true,unknownEscrowsNotAsserted:true,sceneTransitionsNotSimulated:true,globalMoneyConservationNotAsserted:true},money:{cityTreasury:treasury,playerWallets:wallets,shopTills:tills,trackedTotal:treasury+wallets+tills},population:{players:playerCount,online:onlineCount},housing:{ownedPlots:plots,housing:houses,leases:leasedPlots},logistics:{cargoPickedUp:deliveries,courierReservations:pendingDelivery},resources:{total:stock,byLocation:stockByLocation},cities};
}
