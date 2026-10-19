// WORLD ORGANISM v0.9.1 STORY LOOP LAB — standalone synthetic integration.
// All prices, world routes, map and reward mechanics are experimental, not deployed.
import assert from 'node:assert/strict';
import {createRoleWorld,getPerson,getTown,money,validate,encounter,offerCourse} from './role-agents-v09.mjs';
export function scenario({population=20,cities=3,npcWorkers=2}={}){
 const w=createRoleWorld({population,cities,npcWorkers});
 w.map={city:['forest'],forest:['city','ruins'],ruins:['forest','monument'],monument:['ruins']};
 w.trip=[];w.shipments=[];w.completed=[];w.tourMaps=[];w.buildSites=[];w.review=[];
 return w;
}
const actor=(w,id,type)=>{const p=getPerson(w,id);assert.ok(p&&(!type||p.type===type),'actor role mismatch');return p};
const reserved=(w,city,asset)=>w.shipments.filter(s=>s.status==='IN_TRANSIT'&&s.from===city&&s.asset===asset).reduce((x,s)=>x+s.units,0);
const validateStory=w=>{validate(w);for(const c of w.towns)for(const k of Object.keys(c.stock))assert.ok(c.stock[k]>=reserved(w,c.id,k),'shipment exceeds source stock');assert.equal(new Set(w.shipments.map(s=>s.id)).size,w.shipments.length);return true};
export function hireBuild(w,{mayorId,workerId,jobId,price=18,wood=4,stone=2}){
 const mayor=actor(w,mayorId,'MAYOR'),c=getTown(w,mayor.city),npc=actor(w,workerId,'NPC_WORKER');
 assert.equal(c.mayor,mayor.id);assert.equal(npc.city,c.id);
 if(w.buildSites.some(x=>x.id===jobId))return false;
 if(c.treasury<price||c.stock.WOOD-reserved(w,c.id,'WOOD')<wood||c.stock.STONE-reserved(w,c.id,'STONE')<stone)return false;
 c.treasury-=price;w.escrow.push({id:jobId,amount:price,workerId:npc.id,cityId:c.id});
 w.buildSites.push({id:jobId,city:c.id,wood,stone,workerId:npc.id,status:'FUNDED'});
 validateStory(w);return true;
}
export function finishBuild(w,id){
 const b=w.buildSites.find(x=>x.id===id);if(!b||b.status!=='FUNDED')return false;
 const c=getTown(w,b.city),h=w.escrow.find(e=>e.id===id);
 if(c.stock.WOOD-reserved(w,c.id,'WOOD')<b.wood||c.stock.STONE-reserved(w,c.id,'STONE')<b.stone)return false;
 c.stock.WOOD-=b.wood;c.stock.STONE-=b.stone;
 for(const [asset,amount] of [['WOOD',b.wood],['STONE',b.stone]])w.ledger.push({kind:'BUILD',asset,amount,id});
 const npc=actor(w,b.workerId,'NPC_WORKER');npc.wallet+=h.amount;npc.earnings+=h.amount;
 w.escrow=w.escrow.filter(e=>e!==h);b.status='BUILT';c.buildings.push(id);validateStory(w);return true;
}
export function dispatch(w,{mayorId,courierId,from,to,asset='WOOD',units=3,fee=8,id}){
 const p=actor(w,courierId,'COURIER'),m=actor(w,mayorId,'MAYOR'),a=getTown(w,from),b=getTown(w,to);
 assert.ok(a&&b&&a!==b&&m.city===to&&b.mayor===mayorId&&p.city===from);
 if(w.shipments.some(s=>s.id===id))return false;
 if(a.stock[asset]-reserved(w,from,asset)<units||b.treasury<fee)return false;
 b.treasury-=fee;w.escrow.push({id,amount:fee,workerId:courierId,cityId:to});
 w.shipments.push({id,from,to,asset,units,fee,courierId,status:'IN_TRANSIT',route:['city','forest','city']});
 validateStory(w);return true;
}
export function deliver(w,id){const s=w.shipments.find(x=>x.id===id);if(!s||s.status!=='IN_TRANSIT')return false;
 const a=getTown(w,s.from),b=getTown(w,s.to);assert.ok(a.stock[s.asset]>=s.units);
 a.stock[s.asset]-=s.units;b.stock[s.asset]+=s.units;
 const p=actor(w,s.courierId),h=w.escrow.find(x=>x.id===id);p.wallet+=h.amount;p.earnings+=h.amount;
 w.escrow=w.escrow.filter(x=>x!==h);s.status='DELIVERED';validateStory(w);return true;
}
export function buyMap(w,{touristId,cityId,id,price=5}){
 const p=actor(w,touristId,'TOURIST'),c=getTown(w,cityId);assert.equal(p.city,cityId);
 if(w.tourMaps.some(x=>x.id===id))return false;
 if(p.wallet<price)return false;
 p.wallet-=price;c.treasury+=price;w.tourMaps.push({id,touristId,cityId});validateStory(w);return true;
}
export function walk(w,{playerId,from,to,id}){
 const p=actor(w,playerId);assert.ok(p.type!=='NPC_STORY'&&p.type!=='NPC_HOSTILE');
 if(w.trip.some(x=>x.id===id))return false;
 assert.ok(w.map[from]?.includes(to),'illegal teleport/nonadjacent region');
 const prior=w.trip.filter(x=>x.playerId===playerId).at(-1);
 assert.equal(prior?.to||'city',from,'player did not reach this physical region');
 w.trip.push({id,playerId,from,to});validateStory(w);return true;
}
export function explore(w,{playerId,id,choice='help'}){
 const p=actor(w,playerId,'EXPLORER');const place=w.trip.filter(x=>x.playerId===playerId).at(-1)?.to;
 assert.equal(place,'ruins','explorer not in ruins');
 if(w.completed.includes(id))return false;
 const success=encounter(w,{eventId:id,playerId,kind:choice==='fight'?'PVE':'STORY',choice:choice==='fight'?'fight':choice==='leave'?'decline':'accept'});
 if(!success)return false;w.completed.push(id);validateStory(w);return true;
}
export function integratedRun(opts={}){
 const w=scenario(opts);
 const mayor='mayor-0',npc='worker-0',courier=w.persons.find(p=>p.type==='COURIER'&&p.city==='city-1'),tourist=w.persons.find(p=>p.type==='TOURIST'),explorer=w.persons.find(p=>p.type==='EXPLORER');
 assert.ok(courier&&tourist&&explorer,'required different human roles are missing');
 // Mayor from city 0 authorizes the job, NPC does finite work.
 assert.ok(hireBuild(w,{mayorId:mayor,workerId:npc,jobId:'square-1'}));
 assert.ok(finishBuild(w,'square-1'));
 // Courier works for a separate city's mayor and actually moves wood there.
 assert.ok(dispatch(w,{mayorId:mayor,courierId:courier.id,from:'city-1',to:'city-0',id:'cargo-1'}));
 assert.ok(deliver(w,'cargo-1'));
 // Tourist chooses a real PAPER map and receives persistent entitlement.
 assert.ok(buyMap(w,{touristId:tourist.id,cityId:tourist.city,id:'map-1'}));
 // Explorer chooses a physically connected path and voluntary encounter.
 for(const [from,to] of [['city','forest'],['forest','ruins']])walk(w,{playerId:explorer.id,from,to,id:'walk-'+to});
 assert.ok(explore(w,{playerId:explorer.id,id:'ruins-1',choice:'fight'}));
 // Same character can train, without a second duplicated certificate.
 assert.ok(offerCourse(w,{eventId:'university-1',playerId:explorer.id,completed:true}));
 validateStory(w);return w;
}
export function storyStats(w){return {moneyTotal:money(w),openingMoney:w.sourceCash,buildings:w.buildSites.filter(x=>x.status==='BUILT').length,deliveries:w.shipments.filter(x=>x.status==='DELIVERED').length,mapPurchases:w.tourMaps.length,expeditions:w.persons.reduce((n,p)=>n+p.expeditions,0),certificates:w.persons.filter(x=>x.certified).length,ledgerItems:w.ledger.length,escrow:w.escrow.reduce((n,e)=>n+e.amount,0)}}
