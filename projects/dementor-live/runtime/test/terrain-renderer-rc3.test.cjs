const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
test('DL-TERRAIN-01 keeps 17 editable ISO30 SVG sources separate from 20 UI icons',()=>{
 const names=fs.readdirSync(path.join(root,'assets-source','terrain')).filter(n=>n.endsWith('.svg'));
 assert.equal(names.length,17);
 for(const name of names){
  const svg=fs.readFileSync(path.join(root,'assets-source','terrain',name),'utf8');
  assert.match(svg,/viewBox="0 0 256 148"/);assert.ok(!/<script|<image|<foreignObject/i.test(svg));
 }
});
test('terrain renderer caches geometry and draws overlays without mutating state',async()=>{
 const names=fs.readdirSync(path.join(root,'assets-source','terrain')).filter(n=>n.endsWith('.svg'));
 const assets=Object.fromEntries(names.map(name=>[name.replace('.svg',''),{raster:{256:{x:0,y:0,w:256,h:148}}}]));
 const manifest={schema:'DL-TERRAIN-01',atlas:{256:{file:'atlas.webp'}},assets,
 variants:{paving:['road_01','road_02','road_03'],grass:['grass_01','grass_02','grass_03'],flowers:['flowers_01','flowers_02','flowers_03']}};
 let draws=0;
 const ctx={canvas:{width:1000,height:800},getTransform:()=>({a:1}),drawImage(){draws++},
 beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){}};
 const global={
  console,window:{},Image:class {set src(v){queueMicrotask(()=>this.onload())}},
  fetch:async()=>({ok:true,json:async()=>manifest}),queueMicrotask
 };
 vm.runInNewContext(fs.readFileSync(path.join(root,'public','terrain-01.js'),'utf8'),global);
 await new Promise(resolve=>setTimeout(resolve,0));
 const renderer=global.window.DLTerrain01;assert.equal(renderer.ready,true);
 const state={scene:'city',landscape:{tiles:[{x:1,y:1,kind:'paving'},{x:2,y:1,kind:'paving'},{x:2,y:2,kind:'flowers'}]}};
 const original=JSON.stringify(state),project=(x,y)=>({x:400+(x-y)*30,y:200+(x+y)*17.32});
 assert.equal(renderer.draw(ctx,state,project,34.64),true);
 assert.ok(draws>=3);assert.equal(renderer.occupied(state,1,1),true);
 assert.equal(renderer.occupied(state,50,50),false);
 assert.equal(renderer.variant('paving',2,3),renderer.variant('paving',2,3));
 assert.equal(JSON.stringify(state),original);
 assert.equal(renderer.draw(ctx,{...state,scene:'plot'},project,34.64),false);
});
