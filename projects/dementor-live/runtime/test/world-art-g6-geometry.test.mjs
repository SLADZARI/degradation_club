import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=fs.readFileSync(path.join(root,'public','world-art-g6.js'),'utf8');
const sandbox={window:{},location:{search:'?artG6=compare'},URLSearchParams,console,Image:function Image(){}};
vm.runInNewContext(source,sandbox,{filename:'world-art-g6.js'});
const qa=sandbox.window.DLWorldArtG6;
const nearly=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} is not ${b}`);

test('CU footprint projects to exact 30-degree diamond with real southern foot anchor',()=>{
 const unit=36,cos=Math.sqrt(3)/2;
 const project=(x,y)=>({x:(x-y)*unit*cos,y:(x+y)*unit*.5});
 for(const shape of [
  {x:4,y:4,w:4,h:3},{x:22.7,y:1,w:2.6,h:2},
  {x:24,y:23,w:6,h:5},{x:15.5,y:1.5,w:2.5,h:2.2}]){
  const bbox={w:183,h:205},a=qa.footprintLayout(shape,project,unit,bbox);
  assert.ok(a);
  nearly(a.foot.x,project(shape.x+shape.w,shape.y+shape.h).x);
  nearly(a.foot.y,project(shape.x+shape.w,shape.y+shape.h).y);
  nearly(a.left+a.width/2,a.foot.x);
  nearly(a.top+a.height,a.foot.y);
  nearly(a.groundWidth,(shape.w+shape.h)*unit*cos);
  nearly(a.groundDepth,(shape.w+shape.h)*unit*.5);
  nearly(a.groundDepth/a.groundWidth,Math.tan(Math.PI/6));
 }
});
test('CU geometry scales uniformly with zoom, preserving anchored foot position',()=>{
 const o={x:4,y:5,w:3,h:2},bbox={w:182,h:216};
 const screen=unit=>(x,y)=>({x:(x-y)*unit*Math.sqrt(3)/2,y:(x+y)*unit*.5});
 const a=qa.footprintLayout(o,screen(20),20,bbox),b=qa.footprintLayout(o,screen(40),40,bbox);
 nearly(b.width/a.width,2);nearly(b.height/a.height,2);
 nearly(b.foot.x,2*a.foot.x);nearly(b.foot.y,2*a.foot.y);
 assert.equal(qa.footprintLayout({...o,w:0},screen(20),20,bbox),null);
 assert.equal(qa.footprintLayout(o,screen(20),20,{w:0,h:20}),null);
});
test('construction art maps only to REAL server stage counts; finished art is distinct',()=>{
 assert.deepEqual([0,1,2,3].map(i=>qa.forgeArtId(i,3)),[
  'city-forge--stage-0','city-forge--stage-1','city-forge--stage-2','city-forge']);
 assert.deepEqual([0,1].map(i=>qa.seedArtId(i,1)),[
  'city-seed-shop--stage-0','city-seed-shop']);
 assert.equal(qa.forgeArtId(2,1),null);
 assert.equal(qa.seedArtId(2,1),null);
 assert.equal(qa.forgeArtId(3,2),null);
});
test('bed art follows existing server-authoritative crop/water/readyAt states',()=>{
 assert.equal(qa.bedArtId({crop:null},150),'plot-garden-bed-empty');
 assert.equal(qa.bedArtId({crop:'hemp',watered:false},150),'plot-garden-bed-seeded');
 assert.equal(qa.bedArtId({crop:'hemp',watered:true,readyAt:300},150),'plot-garden-bed-hemp');
 assert.equal(qa.bedArtId({crop:'carrot',watered:true,readyAt:300},150),'plot-garden-bed-carrot');
 assert.equal(qa.bedArtId({crop:'carrot',watered:true,readyAt:150},150),'plot-garden-bed-ready');
});
test('QA only: derived sprite pixels never change hitbox or save model',()=>{
 assert.doesNotMatch(source,/\.wallet\s*=|\.owner\s*=|world\.json|requestId|\.landUse\s*=/);
 assert.match(source,/candidate|G6/i);
 assert.match(source,/const mode=new URLSearchParams\(location.search\).get\('artG6'\)/);
});

test('8 private-plot tent candidates mirror saved-game identity without rerolling after restart',async()=>{
 const {stablePlotTentVariant}=await import('../assets-source/world-art-unique-houses/visual-variants.mjs');
 for(const city of ['origin','city-01','city-02','test-other-city']){
  const ids=Array.from({length:8},(_,i)=>qa.tentArtId(city,'plot-'+(i+1),3));
  assert.equal(new Set(ids).size,8);
  for(let i=1;i<=8;i++){
   const expected='plot-personal-tent-plot-'+stablePlotTentVariant(city,'plot-'+i);
   assert.equal(ids[i-1],expected);
   assert.equal(qa.tentArtId(city,'plot-'+i,2),null);
   assert.equal(qa.tentArtId(city,'plot-'+i,0),null);
  }
 }
});
