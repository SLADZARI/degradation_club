// WORLD ORGANISM v0.8 — independent forward-looking shadow model (EXPERIMENTAL).
// Not the historical v0.8 simulator. Does not import from or change the game runtime.
// Explicitly derived from the published D30 aggregate checkpoint + hypothetical post-D30 policies.
// All parameters in SETTINGS below are TEST assumptions, not approved game rules.
export const MODEL_ID='WORLD-ORGANISM/0.8.1-shadow-sustainability';
export const SETTINGS={
  checkpointDay:30, initialPAPER:3600, cityPAPER:2301, playerPAPER:1299,
  oldProjects:3, hempAtCheckpoint:4,
  capacity:12, carrotYield:3, hempYield:3, carrotSeedYield:4,
  carrotGrowthDays:3, hempGrowthDays:3, seedGrowthDays:4,
  cropWater:2, carrotShelfDays:1, pantryShelfDays:3,
  maintenanceIntervalDays:7, orderTtlDays:14,
  prices:{PAPER_SHEET:12,CARROT:3,HEMP:1},
  recipe:{HEMP:6,WATER:2,PAPER_SHEET:1},
  pantry:{WOOD:30,STONE:20,payout:50,minSpoiled:10,earliestDay:45},
  irrigation:{WOOD:20,STONE:10,payout:60,minUnmet:20,earliestDay:65},
  experiments:['static','upkeep','needs-growth'],
  environments:['normal','forest','dry','treasury'],
};
const required=(condition,message)=>{if(!condition)throw Error(message);};
const empty=()=>({});
const numeric=vals=>Object.values(vals).every(v=>Number.isSafeInteger(v)&&v>=0);
const scenarios={
  normal:{water:48,waterRecharge:9,wood:120,stone:70,growthMultiplier:1,treasury:2301},
  forest:{water:60,waterRecharge:11,wood:220,stone:100,growthMultiplier:1,treasury:2301},
  dry:{water:8,waterRecharge:1,wood:120,stone:70,growthMultiplier:2,treasury:2301},
  treasury:{water:48,waterRecharge:9,wood:120,stone:70,growthMultiplier:1,treasury:35},
};
function initialState({agents=3,environment='normal',policy='upkeep'}={}){
  required(Number.isInteger(agents)&&agents>=2&&agents<=10,'agents must be in [2,10]');
  required(scenarios[environment],'unknown scenario');
  required(SETTINGS.experiments.includes(policy),'unknown policy');
  const env=scenarios[environment];
  // Treasury-stress experiment moves the original city PAPER to players.
  // This does not create or destroy currency, but is NOT the reported historical distribution.
  const cityPAPER=env.treasury,playersPAPER=SETTINGS.initialPAPER-cityPAPER;
  const p=Array.from({length:agents},(_,i)=>({
    id:'p'+(i+1),wallet:Math.floor(playersPAPER/agents)+(i<playersPAPER%agents?1:0),
    hemp:i===0?SETTINGS.hempAtCheckpoint:0,sheets:0,
    seedCarrot:3,seedHemp:3,carrotBatches:[],plotBeds:{
      food:{kind:'food',ready:0,seedSpent:false},
      civicFood:{kind:'civicFood',ready:0,seedSpent:false},
      seed:{kind:'seed',ready:0,seedSpent:false},
      hemp:{kind:'hemp',ready:0,seedSpent:false},
      hempSeed:{kind:'hempSeed',ready:0,seedSpent:false}
    },lastTrade:null,
  }));
  return {
    schema:MODEL_ID,source:'D30 aggregate + synthetic forward projection; not actual D30 state',
    day:SETTINGS.checkpointDay, agents,environment,policy,well:env.water,
    recharge:env.waterRecharge,waterInitial:env.water,waterAdded:0,waterConsumed:0,
    woodInitial:env.wood,stoneInitial:env.stone,wood:env.wood,stone:env.stone,
    embodied:{WOOD:0,STONE:0},city:cityPAPER,players:p,
    oldProjects:SETTINGS.oldProjects,projects:[],
    orders:[],postedEvents:[],trades:[],tradeIds:[],
    nextOrder:1,produced:{CARROT:0,HEMP:0,SEED_CARROT:0,SEED_HEMP:0,PAPER_SHEET:0},
    used:{CARROT_PLAYER:0,CARROT_CITY:0,CARROT_SPOILED:0,HEMP_CRAFT:0,PAPER_SHEET_CITY:0,
      SEED_CARROT:0,SEED_HEMP:0},
    initial:{HEMP:SETTINGS.hempAtCheckpoint,SEED_CARROT:3*agents,SEED_HEMP:3*agents},
    unmetFood:0,waitingStorage:[],waitingResource:[],blocked:0,unfunded:0,
    refunds:0,paperPaid:0,buildPaid:0,tradePaid:0,cityProjectsDone:0,
    diagnostics:[],ledgerEvents:0,
  };
}
const carrotUnits=p=>p.carrotBatches.reduce((n,b)=>n+b.qty,0);
const bagWeight=p=>carrotUnits(p)+p.hemp+p.sheets+0.1*(p.seedCarrot+p.seedHemp);
const capacityLeft=p=>SETTINGS.capacity-bagWeight(p);
const escrowTotal=s=>s.orders.reduce((n,o)=>n+o.escrow,0);
export function balance(s){
  const balances={
    PAPER:s.city+s.players.reduce((n,p)=>n+p.wallet,0)+escrowTotal(s),
    CARROT:s.produced.CARROT-s.used.CARROT_PLAYER-s.used.CARROT_CITY-s.used.CARROT_SPOILED-s.players.reduce((n,p)=>n+carrotUnits(p),0),
    HEMP:s.initial.HEMP+s.produced.HEMP-s.used.HEMP_CRAFT-s.players.reduce((n,p)=>n+p.hemp,0),
    PAPER_SHEET:s.produced.PAPER_SHEET-s.used.PAPER_SHEET_CITY-s.players.reduce((n,p)=>n+p.sheets,0),
    WATER:s.waterInitial+s.waterAdded-s.waterConsumed-s.well,
    WOOD:s.woodInitial-s.wood-s.embodied.WOOD,
    STONE:s.stoneInitial-s.stone-s.embodied.STONE,
    SEED_CARROT:s.initial.SEED_CARROT+s.produced.SEED_CARROT-s.used.SEED_CARROT-s.players.reduce((n,p)=>n+p.seedCarrot,0),
    SEED_HEMP:s.initial.SEED_HEMP+s.produced.SEED_HEMP-s.used.SEED_HEMP-s.players.reduce((n,p)=>n+p.seedHemp,0),
  };
  return balances;
}
export function check(s){
  const residual=balance(s);
  required(residual.PAPER===SETTINGS.initialPAPER,'PAPER minted/lost '+JSON.stringify(residual));
  for(const [k,v] of Object.entries(residual))if(k!=='PAPER')required(v===0,k+' accounting residual '+v);
  required(numeric({city:s.city,well:s.well,wood:s.wood,stone:s.stone}),'negative world account');
  for(const p of s.players){
    required(numeric({wallet:p.wallet,hemp:p.hemp,sheets:p.sheets,seedCarrot:p.seedCarrot,seedHemp:p.seedHemp}),'negative player account');
    required(p.carrotBatches.every(b=>Number.isInteger(b.qty)&&b.qty>0),'broken carrot batch');
    required(bagWeight(p)<=SETTINGS.capacity+1e-9,'bag capacity overrun '+p.id);
  }
  for(const o of s.orders){
    required(o.escrow===o.remaining*o.unitPrice,'escrow invariant violated '+o.id);
    required(o.remaining>=0&&o.remaining<=o.quantity,'invalid order remaining '+o.id);
    required(o.status==='OPEN'||o.remaining===0||o.escrow===0,'bad finite-order status');
  }
  required(s.ledgerEvents>=0,'invalid event count');
  required(s.orders.length<=s.postedEvents.length*2+1,'duplicate demand amplification');
  required(s.tradeIds.length===s.trades.length,'trade idempotency tally');
  return true;
}
const hasDemand=(s,asset)=>s.orders.some(o=>o.asset===asset&&o.status==='OPEN'&&o.remaining>0);
const demandQty=(s,asset)=>s.orders.filter(o=>o.asset===asset&&o.status==='OPEN').reduce((n,o)=>n+o.remaining,0);
const shelfDays=s=>s.projects.includes('pantry')?SETTINGS.pantryShelfDays:SETTINGS.carrotShelfDays;
function expireFood(s){
  for(const p of s.players){
    const remaining=[];
    for(const batch of p.carrotBatches){
      if(s.day-batch.at>=shelfDays(s)){s.used.CARROT_SPOILED+=batch.qty;s.ledgerEvents++;}
      else remaining.push(batch);
    }
    p.carrotBatches=remaining;
  }
}
function consumeOneCarrot(s,p,consumer){
  const batch=p.carrotBatches.find(b=>b.qty>0);
  if(!batch)return false;
  batch.qty--;
  if(batch.qty===0)p.carrotBatches=p.carrotBatches.filter(x=>x.qty>0);
  s.used[consumer==='city'?'CARROT_CITY':'CARROT_PLAYER']++;
  s.ledgerEvents++;
  return true;
}
function plant(s,p,bed){
  if(bed.ready)return;
  if(bed.kind==='hemp'&&s.policy==='static')return; // no PAPER_SHEET buyer; prevent wasteful cultivation
  if(bed.kind==='hemp'&&!hasDemand(s,'PAPER_SHEET'))return;
  if(bed.kind==='food'&&carrotUnits(p)>=3)return;
  if(bed.kind==='seed'&&p.seedCarrot>=3)return;
  if(bed.kind==='hempSeed'&&p.seedHemp>=2)return; // explicit biological propagation; no free seed rebate on hemp harvest
  if(bed.kind==='civicFood'){
    if(!hasDemand(s,'CARROT'))return;
    // Reserve two household meals per grower; plant additional finite crop only for unfunded physical shortage.
    const storedSurplus=s.players.reduce((n,x)=>n+Math.max(0,carrotUnits(x)-2),0);
    const alreadyPlanted=s.players.reduce((n,x)=>n+(x.plotBeds.civicFood.ready?SETTINGS.carrotYield:0),0);
    if(demandQty(s,'CARROT')<=storedSurplus+alreadyPlanted)return;
  }
  const seedKind=['hemp','hempSeed'].includes(bed.kind)?'seedHemp':'seedCarrot';
  const usedKey=seedKind==='seedHemp'?'SEED_HEMP':'SEED_CARROT';
  const waterNeed=SETTINGS.cropWater+(s.environment==='dry'?1:0);
  if(p[seedKind]<1||s.well<waterNeed){
    const reason=p[seedKind]<1?'seed shortage':'water shortage';
    const key=p.id+':'+bed.kind+':'+reason;
    if(!s.waitingResource.includes(key)){s.waitingResource.push(key);s.blocked++;}
    return;
  }
  p[seedKind]--;s.used[usedKey]++;
  s.well-=waterNeed;s.waterConsumed+=waterNeed;
  const normal=['seed','hempSeed'].includes(bed.kind)?SETTINGS.seedGrowthDays:['food','civicFood'].includes(bed.kind)?SETTINGS.carrotGrowthDays:SETTINGS.hempGrowthDays;
  bed.ready=s.day+normal*scenarios[s.environment].growthMultiplier;
  bed.seedSpent=true;s.ledgerEvents++;
}
function collect(s,p,bed){
  if(!bed.ready||bed.ready>s.day)return;
  const type=bed.kind;
  const n=['seed','hempSeed'].includes(type)?SETTINGS.carrotSeedYield:['food','civicFood'].includes(type)?SETTINGS.carrotYield:SETTINGS.hempYield;
  const extraWeight=['food','civicFood','hemp'].includes(type)?n:n*0.1;
  const hempSeedReturn=0;
  if(capacityLeft(p)+1e-9<extraWeight+hempSeedReturn){
    const key=p.id+':'+type+':storage';
    if(!s.waitingStorage.includes(key)){s.waitingStorage.push(key);s.blocked++;}
    return;
  }
  if(type==='seed'){p.seedCarrot+=n;s.produced.SEED_CARROT+=n;}
  if(type==='hempSeed'){p.seedHemp+=n;s.produced.SEED_HEMP+=n;}
  if(['food','civicFood'].includes(type)){p.carrotBatches.push({qty:n,at:s.day});s.produced.CARROT+=n;}
  if(type==='hemp'){p.hemp+=n;s.produced.HEMP+=n;}
  bed.ready=0;bed.seedSpent=false;s.ledgerEvents++;
}
function startDemand(s,sourceId,asset,quantity,unitPrice){
  const key=sourceId+':'+asset;
  if(s.postedEvents.includes(key))return null;
  s.postedEvents.push(key); // no duplicate even if unfunded
  const amount=quantity*unitPrice;
  if(s.city<amount){s.unfunded++;return null;}
  s.city-=amount;
  const o={id:'D'+String(s.nextOrder++).padStart(6,'0'),referenceEvent:sourceId,asset,
    quantity,remaining:quantity,unitPrice,escrow:amount,status:'OPEN',
    postedAt:s.day,expiresAt:s.day+SETTINGS.orderTtlDays};
  s.orders.push(o);s.ledgerEvents++;return o;
}
export function submitDemand(s,referenceEvent,asset,quantity,unitPrice){
  required(s.schema===MODEL_ID,'bad projection state');
  required(['CARROT','PAPER_SHEET'].includes(asset),'unknown demand asset');
  required(Number.isSafeInteger(quantity)&&quantity>=1&&quantity<=100,'invalid quantity');
  required(Number.isSafeInteger(unitPrice)&&unitPrice>=1,'invalid payment');
  const result=startDemand(s,referenceEvent,asset,quantity,unitPrice);
  check(s);return result;
}
function postWeeklyEvents(s){
  if(s.policy==='static'||(s.day-31)%SETTINGS.maintenanceIntervalDays!==0)return;
  const period=Math.floor((s.day-31)/SETTINGS.maintenanceIntervalDays);
  const activeProjects=['square','forge','bridge',...s.projects];
  for(const name of activeProjects){
    const event='public-session:'+name+':'+period;
    // Hypothetical finite weekly events, NEVER automatic repost of original building completion.
    startDemand(s,event,'PAPER_SHEET',1,SETTINGS.prices.PAPER_SHEET);
    startDemand(s,event,'CARROT',1,SETTINGS.prices.CARROT);
  }
}
function refundOverdue(s){
  for(const o of s.orders.filter(o=>o.status==='OPEN'&&s.day>=o.expiresAt)){
    s.city+=o.escrow;s.refunds+=o.escrow;
    o.escrow=0;o.remaining=0;o.status='EXPIRED';s.ledgerEvents++;
  }
}
function createPaper(s,p){
  // Only produce physical sheets for paid finite demand. Actual delivery happens separately.
  const outstanding=demandQty(s,'PAPER_SHEET');
  const heldSheets=s.players.reduce((n,p)=>n+p.sheets,0);
  if(outstanding<=heldSheets)return;
  if(p.hemp<SETTINGS.recipe.HEMP||s.well<SETTINGS.recipe.WATER||capacityLeft(p)<1-SETTINGS.recipe.HEMP)return;
  p.hemp-=SETTINGS.recipe.HEMP;s.used.HEMP_CRAFT+=SETTINGS.recipe.HEMP;
  s.well-=SETTINGS.recipe.WATER;s.waterConsumed+=SETTINGS.recipe.WATER;
  p.sheets++;s.produced.PAPER_SHEET++;s.ledgerEvents++;
}
function settleDemand(s){
  for(const o of s.orders.filter(o=>o.status==='OPEN')){
    while(o.remaining>0){
      const supplier=s.players.find(p=>o.asset==='PAPER_SHEET'?p.sheets>=1:carrotUnits(p)>2); // protect 2 household meals before commercial sale
      if(!supplier)break;
      if(o.asset==='PAPER_SHEET'){supplier.sheets--;s.used.PAPER_SHEET_CITY++;}
      else required(consumeOneCarrot(s,supplier,'city'),'physical carrot absent at settlement');
      o.remaining--;o.escrow-=o.unitPrice;s.paperPaid+=o.unitPrice;
      supplier.wallet+=o.unitPrice;s.ledgerEvents++;
    }
    if(o.remaining===0)o.status='FILLED';
  }
}
function balancePressure(s){
  if(s.policy!=='needs-growth')return;
  const policies=[
    {id:'pantry',spec:SETTINGS.pantry,ready:s.used.CARROT_SPOILED>=SETTINGS.pantry.minSpoiled},
    {id:'irrigation',spec:SETTINGS.irrigation,ready:s.unmetFood>=SETTINGS.irrigation.minUnmet},
  ];
  for(const {id,spec,ready} of policies){
    if(!ready||s.day<spec.earliestDay||s.projects.includes(id))continue;
    // Demand justified by demonstrated loss/shortage; fixed cost and physical material source.
    if(s.wood<spec.WOOD||s.stone<spec.STONE||s.city<spec.payout)continue;
    s.wood-=spec.WOOD;s.stone-=spec.STONE;
    s.embodied.WOOD+=spec.WOOD;s.embodied.STONE+=spec.STONE;
    s.city-=spec.payout;s.buildPaid+=spec.payout;
    const worker=s.players[s.projects.length%s.players.length];
    worker.wallet+=spec.payout;s.projects.push(id);s.cityProjectsDone++;s.ledgerEvents++;
    if(id==='irrigation')s.recharge+=4;
  }
}
export function tradeHemp(s,{offerId,buyer,seller,quantity,pricePerUnit=1,accepted=false,online=true}){
  required(typeof offerId==='string'&&offerId.length>2,'invalid offerId');
  const old=s.trades.find(t=>t.id===offerId);
  if(old)return old; // idempotent replay of an already committed transaction
  const b=s.players.find(p=>p.id===buyer),a=s.players.find(p=>p.id===seller);
  required(b&&a&&a!==b,'bad counterparties');
  required(Number.isInteger(quantity)&&quantity>0,'bad quantity');
  if(!accepted||!online||a.hemp<quantity||b.wallet<quantity*pricePerUnit||capacityLeft(b)<quantity)
    return {id:offerId,status:'REJECTED'};
  a.hemp-=quantity;b.hemp+=quantity;
  a.wallet+=quantity*pricePerUnit;b.wallet-=quantity*pricePerUnit;
  const record={id:offerId,status:'COMMITTED',buyer,seller,quantity,pricePerUnit,steps:['PROPOSED','ACCEPTED','SALE','COMMITTED']};
  s.tradeIds.push(offerId);s.trades.push(record);s.tradePaid+=quantity*pricePerUnit;s.ledgerEvents++;
  check(s);return record;
}
function householdNeeds(s){
  for(const p of s.players){
    if(!consumeOneCarrot(s,p,'player'))s.unmetFood++;
  }
}
export function step(s){
  required(s.schema===MODEL_ID,'not a shadow simulation state');
  s.day++;
  // Chronology matters: previous day's fresh carrot expires before today's feeding.
  expireFood(s);
  s.well+=s.recharge;s.waterAdded+=s.recharge;
  refundOverdue(s);
  postWeeklyEvents(s);
  for(const p of s.players)for(const bed of Object.values(p.plotBeds))collect(s,p,bed);
  householdNeeds(s);
  // City demand and on-hand food get first claim before new sowing, no duplicate deliveries.
  for(const p of s.players)createPaper(s,p);
  settleDemand(s);
  balancePressure(s);
  for(const p of s.players)for(const bed of Object.values(p.plotBeds))plant(s,p,bed);
  check(s);return s;
}
export function simulate(options={}){
  const {days=30,...rest}=options;
  required(Number.isInteger(days)&&days>=1&&days<=180,'projection days must be 1..180');
  const s=initialState(rest);
  check(s);
  for(let i=0;i<days;i++)step(s);
  return s;
}
export function metrics(s){
  const filled=s.orders.filter(o=>o.status==='FILLED').length;
  const expired=s.orders.filter(o=>o.status==='EXPIRED').length;
  const open=s.orders.filter(o=>o.status==='OPEN').length;
  return {
    model:MODEL_ID,sourceStatus:'EXPERIMENTAL_SHADOW_NOT_ORIGINAL_NOT_SERVER',
    day:s.day,projectionDays:s.day-30,agents:s.agents,environment:s.environment,policy:s.policy,
    money:{total:SETTINGS.initialPAPER,city:s.city,players:s.players.reduce((n,p)=>n+p.wallet,0),escrow:escrowTotal(s)},
    buildings:{original:3,new:s.projects,completed:s.cityProjectsDone,embodied:s.embodied},
    demand:{posted:s.orders.length,filled,expired,open,unfunded:s.unfunded,paid:s.paperPaid,refunded:s.refunds},
    food:{grown:s.produced.CARROT,eaten:s.used.CARROT_PLAYER,cityConsumed:s.used.CARROT_CITY,spoiled:s.used.CARROT_SPOILED,carried:s.players.reduce((n,p)=>n+carrotUnits(p),0),unmet:s.unmetFood},
    hemp:{grown:s.produced.HEMP,crafted:s.used.HEMP_CRAFT,stock:s.players.reduce((n,p)=>n+p.hemp,0)},
    sheets:{made:s.produced.PAPER_SHEET,used:s.used.PAPER_SHEET_CITY,stock:s.players.reduce((n,p)=>n+p.sheets,0)},
    finiteMaterials:{wood:s.wood,stone:s.stone},water:{available:s.well,used:s.waterConsumed,added:s.waterAdded},
    block:{waitingStorage:s.waitingStorage.length,waitingResource:s.waitingResource.length,unique:s.blocked},
    p2p:{deals:s.trades.length},accounting:balance(s),
  };
}
