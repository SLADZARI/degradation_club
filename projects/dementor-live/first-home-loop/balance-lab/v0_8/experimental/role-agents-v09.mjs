// WORLD ORGANISM v0.9 Role Lab. Synthetic TEST assumptions, not the game server.
// Sources: MAYOR_OWNERSHIP_LABOR_MARKET_v0.2; WORLD_EXPANSION_NEXT_BIG_LOOP_v0.4;
// WILDERNESS_FOG_ENCOUNTERS candidate; COMBAT_ALPHA_P0 scope. No live player writes.
import assert from 'node:assert/strict';
export const ROLES=['MAYOR','RESIDENT','COURIER','FARMER','BUILDER','TOURIST','EXPLORER','NPC_WORKER','NPC_STORY','NPC_HOSTILE'];
const role=(id,type,city,wealth=0)=>({id,type,city,wallet:wealth,earnings:0,expeditions:0,events:0});
export function createRoleWorld({population=20,cities=3,npcWorkers=3}={}){
 assert.ok(population>=10&&population<=30&&cities>=2&&cities<=4);
 const towns=Array.from({length:cities},(_,i)=>({id:'city-'+i,mayor:'mayor-'+i,treasury:300,stock:{WOOD:30,STONE:20,CARROT:40,HEMP:30,PAPER_SHEET:8},buildings:[],jobs:[],bankrupt:false}));
 const persons=[];
 for(let i=0;i<cities;i++)persons.push(role('mayor-'+i,'MAYOR',towns[i].id,150));
 const kinds=['RESIDENT','COURIER','FARMER','BUILDER','TOURIST','EXPLORER'];
 for(let i=0;i<population-cities;i++)persons.push(role('player-'+i,kinds[i%kinds.length],towns[i%cities].id,45));
 for(let i=0;i<npcWorkers;i++)persons.push(role('worker-'+i,'NPC_WORKER',towns[i%cities].id,0));
 persons.push(role('story-1','NPC_STORY',towns[0].id,0),role('wild-1','NPC_HOSTILE','wilderness',0));
 const world={schema:'WORLD_ORGANISM_ROLE_LAB/0.9',day:0,towns,persons,ledger:[],eventIds:[],escrow:[],unpaid:0,stories:[],claimed:[],sourceCash:0,
  materials:{WOOD:0,STONE:0,CARROT:0,HEMP:0,PAPER_SHEET:0},roleCounts:{}};
 world.sourceCash=money(world);
 for(const town of towns)for(const [k,v]of Object.entries(town.stock))world.materials[k]+=v;
 validate(world);return world;
}
export const money=w=>w.towns.reduce((v,c)=>v+c.treasury,0)+w.persons.reduce((v,p)=>v+p.wallet,0)+w.escrow.reduce((v,e)=>v+e.amount,0);
export const getPerson=(w,id)=>w.persons.find(x=>x.id===id);
export const getTown=(w,id)=>w.towns.find(x=>x.id===id);
const once=(w,key)=>{if(w.eventIds.includes(key))return false;w.eventIds.push(key);return true};
export function validate(w){
 assert.equal(money(w),w.sourceCash,'PAPER created or destroyed');
 assert.ok(w.towns.every(c=>c.treasury>=0&&!Object.values(c.stock).some(x=>x<0)));
 assert.ok(w.persons.every(p=>p.wallet>=0));
 assert.ok(w.escrow.every(x=>x.amount>=0));
 for(const k of Object.keys(w.materials)){
  const stock=w.towns.reduce((n,c)=>n+(c.stock[k]||0),0);
  const consumed=w.ledger.filter(e=>e.kind==='CONSUME'&&e.asset===k).reduce((n,e)=>n+e.amount,0);
  const embodied=w.ledger.filter(e=>e.kind==='BUILD'&&e.asset===k).reduce((n,e)=>n+e.amount,0);
  assert.equal(stock+consumed+embodied,w.materials[k],k+' resource balance');
 }
 return true;
}
export function fundJob(w,{cityId,workerId,amount=5,jobId,asset='WOOD',units=1}){
 const c=getTown(w,cityId),p=getPerson(w,workerId);
 assert.ok(c&&p&&['NPC_WORKER','COURIER','FARMER','BUILDER','RESIDENT'].includes(p.type));
 assert.ok(p.city===cityId,'worker location mismatch');
 if(w.eventIds.includes('job:'+jobId))return false;
 if(c.treasury<amount||c.stock[asset]<units){w.unpaid++;return false}
 once(w,'job:'+jobId);c.treasury-=amount;w.escrow.push({id:jobId,amount,workerId,cityId});c.jobs.push({id:jobId,asset,units,status:'FUNDED'});validate(w);return true;
}
export function completeJob(w,jobId){const hold=w.escrow.find(x=>x.id===jobId);if(!hold)return false;const p=getPerson(w,hold.workerId),c=getTown(w,hold.cityId),job=c.jobs.find(x=>x.id===jobId);assert.ok(job&&job.status==='FUNDED');assert.ok(c.stock[job.asset]>=job.units);c.stock[job.asset]-=job.units;w.ledger.push({kind:'CONSUME',asset:job.asset,amount:job.units,jobId});p.wallet+=hold.amount;p.earnings+=hold.amount;w.escrow=w.escrow.filter(x=>x!==hold);job.status='DONE';validate(w);return true}
export function move(w,personId,to){const p=getPerson(w,personId);assert.ok(p&&p.type!=='NPC_STORY'&&p.type!=='NPC_HOSTILE');assert.ok(getTown(w,to));p.city=to;validate(w)}
export function encounter(w,{eventId,playerId,kind='STORY',choice='accept'}){
 const p=getPerson(w,playerId);assert.ok(p&&p.type!=='NPC_HOSTILE'&&p.type!=='NPC_STORY');
 if(!once(w,'enc:'+eventId))return false;
 if(kind==='PVE'){assert.ok(['EXPLORER','RESIDENT','COURIER','FARMER','BUILDER','MAYOR','TOURIST'].includes(p.type));if(choice==='fight')p.expeditions++}
 if(kind==='STORY'&&choice==='accept'){p.events++;w.stories.push({eventId,playerId})}
 validate(w);return true;
}
export function offerCourse(w,{eventId,playerId,completed=false}){const p=getPerson(w,playerId);assert.ok(p);if(!completed)return false;if(!once(w,'course:'+eventId+':'+playerId))return false;p.certified=true;p.bonusSlots=(p.bonusSlots||0)+20;validate(w);return true}
export function day(w,{npcHiring=true}={}){
 w.day++;
 for(const c of w.towns){
  for(const p of w.persons.filter(p=>p.city===c.id&&p.type==='NPC_WORKER')){
   if(!npcHiring)continue;
   const jobId='npc-work:'+w.day+':'+p.id;
   if(fundJob(w,{cityId:c.id,workerId:p.id,amount:6,jobId,asset:'WOOD',units:1}))completeJob(w,jobId);
  }
 }
 validate(w);return w;
}
export function simulate(opts={}){const w=createRoleWorld(opts);for(let i=0;i<(opts.days||90);i++)day(w,opts);return w}
export function stats(w){return {day:w.day,persons:w.persons.length,cities:w.towns.length,money:money(w),treasuries:w.towns.map(c=>c.treasury),unfunded:w.unpaid,npcJobs:w.ledger.filter(x=>x.jobId).length,roles:Object.fromEntries(ROLES.map(r=>[r,w.persons.filter(p=>p.type===r).length])),events:w.stories.length,balances:w.materials}}
