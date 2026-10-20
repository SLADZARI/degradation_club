// P5 shared collision footprints: source of truth for world objects and axonometric depth.
// Derived on demand from persisted entities. Never delete or relocate a saved object.
import {WORLD_OBSTACLES,WORLD_CITY_TARGETS,WORLD_CACTI} from './world-expansion.mjs';
import {PHONE_BOOTHS} from './telecom.mjs';
export const BODY_RADIUS=.3;
export const rectOverlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export const blockedByRect=(x,y,r,box)=>x+r>box.x&&x-r<box.x+box.w&&y+r>box.y&&y-r<box.y+box.h;
export const isoDepth=box=>box.x+box.w+box.y+box.h;
export function stoneSize(resource){
 if(resource.type!=='stone'||!resource.rockSize||resource.stock<=0)return 0;
 const initial=Math.max(1,resource.initial||resource.stock);
 return Math.max(.8,Math.min(resource.rockSize,resource.rockSize*Math.sqrt(Math.max(0,resource.stock)/initial)));
}
export function footprintForResource(r){
 if(r.stock<=0||r.type==='food')return null;
 const size=r.type==='stone'?stoneSize(r):0;
 if(!size)return null; // normal legacy deposits retain their original round collision
 return {id:r.id,kind:'rock',x:r.x-size/2,y:r.y-size/2,w:size,h:size,depth:r.x+r.y+size};
}
const STRUCTURES=Object.freeze(WORLD_CITY_TARGETS.filter(t=>['world-gate','world-preview','tourist'].includes(t.type))
 .map(t=>{const w=t.id==='university-site'?3.2:t.id==='museum-entry'?2.8:2.35;
 // Actual illustrated body occupies rear of the sign; the interactive doorway remains traversable.
 const h=t.id==='robo-stadium-site'?1.0:1.25;
 return Object.freeze({id:'structure-'+t.id,kind:'building',x:t.x-1.3,y:t.y-1.8,w,h,depth:t.x-1.3+w+t.y-1.8+h});
 }));
export const WORLD_STRUCTURE_FOOTPRINTS=STRUCTURES;
export function worldFootprints(g){
 const resources=new Map(g.state.resources.map(r=>[r.id,r]));
 const forests=WORLD_OBSTACLES.filter(o=>o.biome==='forest')
   .filter(o=>(resources.get('forest-wood-'+o.x+'-'+o.y)?.stock||0)>0)
   .map(o=>({id:'forest-wood-'+o.x+'-'+o.y,kind:'forest',x:o.x,y:o.y,w:o.w,h:o.h,depth:isoDepth(o)}));
 const mountains=WORLD_OBSTACLES.filter(o=>o.biome==='mountain')
   .map((o,i)=>({id:'mountain-'+i,kind:'mountain',x:o.x,y:o.y,w:o.w,h:o.h,depth:isoDepth(o)}));
 const phone=PHONE_BOOTHS.filter(o=>o.scene==='city').map(o=>({id:o.id,kind:'payphone',x:o.x-.5,y:o.y-.5,w:1,h:1,depth:o.x+o.y}));
 const oversized=g.state.resources.map(footprintForResource).filter(Boolean);
 return [...STRUCTURES,...mountains,...forests,...phone,...WORLD_CACTI,...oversized];
}
// Non-mutating audit: detects new overlapping static objects before adding any procedural prop.
// Existing persisted residents and original building footprints remain checked by release audit.
export function footprintConflicts(footprints){
 const collisions=[];
 for(let i=0;i<footprints.length;i++)for(let j=i+1;j<footprints.length;j++){
   const a=footprints[i],b=footprints[j];
   if(a.kind==='mountain'&&b.kind==='mountain')continue; // contiguous mountain ranges deliberately overlap
   if(rectOverlaps(a,b))collisions.push([a.id,b.id]);
 }
 return collisions;
}
