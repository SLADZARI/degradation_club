// DEMENTOR LIVE GA-02 | 12x12 parcel logical placement and walk-path proof.
// SYNTHETIC GRID ONLY — not an actual map, SVG scale/collision or approved BUILD/UNITS geometry.
function validateStarterPlot(){
 const W=12,H=12;
 const objects=[
 {id:"CABIN",x:1,y:1,w:4,h:4,door:[3,5]},
 {id:"WORKSHOP",x:6,y:1,w:5,h:5,door:[8,6]},
 {id:"STORAGE",x:1,y:7,w:2,h:3,door:[2,10]},
 {id:"WATER_TANK",x:4,y:8,w:2,h:2,door:[5,7]},
 {id:"GARDEN_BED",x:8,y:8,w:2,h:2,door:[8,7]}
 ];
 const cell=(x,y)=>y*W+x,inBounds=(x,y)=>x>=0&&y>=0&&x<W&&y<H;
 const occupied=new Map(),findings=[];
 for(const o of objects){
  for(let dy=0;dy<o.h;dy++)for(let dx=0;dx<o.w;dx++){
   const x=o.x+dx,y=o.y+dy;
   if(!inBounds(x,y))findings.push({type:"OUTSIDE",o:o.id,x,y});
   else if(occupied.has(cell(x,y)))findings.push({type:"OVERLAP",objects:[occupied.get(cell(x,y)),o.id],x,y});
   else occupied.set(cell(x,y),o.id);
  }
 }
 const gate=[5,11];const todo=[gate];const seen=new Set([cell(...gate)]);
 while(todo.length){const [x,y]=todo.shift();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const nx=x+dx,ny=y+dy,k=cell(nx,ny);
    if(inBounds(nx,ny)&&!occupied.has(k)&&!seen.has(k)){seen.add(k);todo.push([nx,ny]);}
 }}
 const doorChecks=objects.map(o=>({id:o.id,door:o.door,doorOnFreeCell:inBounds(...o.door)&&!occupied.has(cell(...o.door)),reachable:seen.has(cell(...o.door))}));
 const perimeterClear=Array.from({length:W},(_,x)=>!occupied.has(cell(x,11))).every(Boolean);
 const perObjectMarginal=objects.map(o=>({id:o.id,hasOneCellBoundaryMargin:o.x>=1&&o.y>=1&&o.x+o.w<=W-1&&o.y+o.h<=H-1}));
 const result={type:"SYNTHETIC_12X12_GRID",date:"2026-10-17",gate,objects,footprintCells:occupied.size,freeCells:W*H-occupied.size,walkableFromGate:seen.size,
  doorChecks,perimeterClear,perObjectMarginal,findings,
  passed:findings.length===0&&doorChecks.every(o=>o.reachable&&o.doorOnFreeCell)&&perimeterClear&&perObjectMarginal.every(o=>o.hasOneCellBoundaryMargin)};
 return result;
}
if(typeof module!=="undefined"&&module.exports)module.exports={validateStarterPlot};
