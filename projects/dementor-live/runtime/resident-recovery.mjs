// Save-preserving RC4 compatibility: bring only stranded legacy CITY residents to nearest walkable land.
// This runs after all P4/P5 static geometry and resources have been installed, before the server accepts traffic.
// It is intentionally NOT an editor: no saves, plots, balances, inventories or building footprints are removed.
const roundMillimeter=x=>Math.round(x*1000)/1000;
const close=(a,b)=>Math.abs(a-b)<.0001;
const samePoint=(a,b)=>close(a.x,b.x)&&close(a.y,b.y);
const MAX_RADIUS=24;
const MAX_RELOCATIONS=100;
export function recoverBlockedSavedResidents(game){
 const residents=Object.values(game.state.players).sort((a,b)=>a.id.localeCompare(b.id));
 const trapped=residents.filter(p=>(p.scene||'city')==='city'&&!game.walkable(p.x,p.y,p));
 if(trapped.length>MAX_RELOCATIONS)throw Error('Saved resident migration blocked: excessive invalid positions ('+trapped.length+')');
 if(!trapped.length)return [];
 // No writes or partial migrations if a resident is outside the reachable safety radius.
 const reservations=new Map(residents.map(p=>[p.id,{x:p.x,y:p.y,scene:p.scene||'city'}]));
 const planned=[];
 for(const p of trapped){
  if(!Number.isFinite(p.x)||!Number.isFinite(p.y))throw Error('Saved resident migration blocked: invalid numeric position');
  const start={x:p.x,y:p.y};
  let dest=null;
  // Deterministic near-first search, with 64 angular samples for each 0.5-tile ring.
  for(let radius=.5;radius<=MAX_RADIUS&&!dest;radius+=.5){
   for(let n=0;n<64;n++){
    const angle=2*Math.PI*n/64, point={x:roundMillimeter(start.x+radius*Math.cos(angle)),y:roundMillimeter(start.y+radius*Math.sin(angle))};
    if(!game.walkable(point.x,point.y,p))continue;
    if([...reservations].some(([id,r])=>id!==p.id&&r.scene==='city'&&Math.hypot(point.x-r.x,point.y-r.y)<.65))continue;
    dest=point;break;
   }
  }
  if(!dest)throw Error('Saved resident migration blocked: no walkable exit within 24 tiles');
  reservations.set(p.id,{...dest,scene:'city'});
  planned.push({p,from:start,to:dest});
 }
 const records=[];
 for(const {p,from,to} of planned){
  p.x=to.x;p.y=to.y;p.job=null;
  records.push({id:p.id,from,to,scene:'city',cause:'rc4-p4-p5-footprint',at:game.now});
 }
 // Ledger is append-only. Future migrations must not lose prior location history.
 game.state.residentRelocations ||= [];
 game.state.residentRelocations.push(...records);
 game.changed(); // ensure one authorized startup save persists all positions + ledger atomically
 return records;
}
