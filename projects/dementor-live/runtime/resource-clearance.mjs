// Relocate still-physical deposits if new buildings overlap them. No mint, no depletion, no new IDs.
export function reconcileResourceClearance(game) {
 const buildings=game.rects().filter(b=>['mayor-tent','tool-shop','warehouse','landscape-shop','forge','seed-shop','public-garden','monument'].includes(b.id));
 const blocked=(x,y,pad=.95)=>buildings.some(b=>x+pad>b.x&&x-pad<b.x+b.w&&y+pad>b.y&&y-pad<b.y+b.h);
 const deposits=game.state.resources||[];
 let changed=false;
 for(const r of deposits){
  if(r.stock<=0||!['wood','stone'].includes(r.type)||!blocked(r.x,r.y))continue;
  const original={x:r.x,y:r.y},westSide=r.x<game.c.river.x;
  let next=null;
  for(let ring=1;ring<=12&&!next;ring++){
   const variants=[];
   for(let dx=-ring;dx<=ring;dx++)for(let dy=-ring;dy<=ring;dy++){
    if(Math.max(Math.abs(dx),Math.abs(dy))!==ring)continue;
    variants.push({x:Math.round((r.x+dx*.5)*2)/2,y:Math.round((r.y+dy*.5)*2)/2});
   }
   variants.sort((a,b)=>Math.hypot(a.x-r.x,a.y-r.y)-Math.hypot(b.x-r.x,b.y-r.y)||a.y-b.y||a.x-b.x);
   for(const p of variants){
    if(p.x<1.4||p.y<1.4||p.x>game.c.width-1.4||p.y>game.c.height-1.4)continue;
    if(westSide&&(p.x>=game.c.river.x-1.2))continue;
    if(!westSide&&(p.x<game.c.river.x+game.c.river.w+1.2))continue;
    if(blocked(p.x,p.y))continue;
    if(deposits.some(other=>other!==r&&other.stock>0&&other.type!=='food'&&Math.hypot(other.x-p.x,other.y-p.y)<1.65))continue;
    if(game.state.plots?.some(plot=>p.x>plot.x-1&&p.x<plot.x+plot.w+1&&p.y>plot.y-1&&p.y<plot.y+plot.h+1))continue;
    next=p;break;
   }
  }
  if(next){r.x=next.x;r.y=next.y;game.state.resourceRelocations||=[];game.state.resourceRelocations.push({id:r.id,from:original,to:next,reason:'building-clearance'});game.state.resourceRelocations=game.state.resourceRelocations.slice(-24);changed=true;}
 }
 if(changed)game.changed();
 return changed;
}
