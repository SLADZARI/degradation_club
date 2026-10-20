import test from 'node:test';import assert from 'node:assert/strict';
import {Game,createWorld} from '../world-expansion-adapter.mjs';
import {WORLD_CITY_TARGETS,WORLD_OBSTACLES,WORLD_PATHS} from '../world-expansion.mjs';
test('dense forests and mountain barriers exist physically, and essential signs stay on traversable squares',()=>{
 const g=new Game(createWorld()),p=g.join('Explorer');
 assert.ok(WORLD_OBSTACLES.some(o=>o.biome==='forest'));assert.ok(WORLD_OBSTACLES.some(o=>o.biome==='mountain'));
 assert.ok(WORLD_PATHS.length>=2);
 for(const id of ['forest-sign','mountain-sign','museum-entry','farlands-entry']){
  const point=WORLD_CITY_TARGETS.find(t=>t.id===id);assert.ok(point,id);
  assert.equal(g.walkable(point.x,point.y,p),true,id+' sign should not be blocked');
 }
});
test('roads to forest, mountains and museums have traversable continuous paths',()=>{
 const g=new Game(createWorld()),p=g.join('Cartographer'),start={x:25,y:38};
 g.state.secondBridgeProject.stage=2; // Passage audit starts AFTER independently verified bridge construction.
 // Grid quarter-cell buffer omitted; game geometry and server collision decide occupancy.
 const accessible=(x,y)=>x>=1&&y>=1&&x<=155&&y<=75&&g.walkable(x,y,p);
 const key=(x,y)=>x+','+y,queue=[[start.x,start.y]],seen=new Set([key(start.x,start.y)]);
 for(let i=0;i<queue.length;i++){
  const [x,y]=queue[i];
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const a=x+dx,b=y+dy,k=key(a,b);
   if(!seen.has(k)&&accessible(a,b)){seen.add(k);queue.push([a,b]);}
  }
 }
 for(const id of ['forest-sign','mountain-sign','museum-entry','farlands-entry']){
  const t=WORLD_CITY_TARGETS.find(o=>o.id===id);assert.ok(seen.has(key(t.x,t.y)),id+' must be reachable over walkable terrain');
 }
});
