import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {Game,createWorld} from '../world-expansion-adapter.mjs';
import {landscapeIndex,landscapeSpeed} from '../landscape.mjs';
const c=(g,p,type,extra={},requestId='terrain-'+Math.random().toString(36).slice(2))=>g.command(p,{type,requestId,...extra});
const dir=path.dirname(fileURLToPath(import.meta.url)),runtime=path.resolve(dir,'..');
test('DL-TERRAIN-01 17 SVG, hashed atlas and manifest paths',()=>{
 const file=path.join(runtime,'public/assets/terrain/manifest.json');const m=JSON.parse(fs.readFileSync(file,'utf8'));
 assert.equal(m.schema,'DL-TERRAIN-01');assert.equal(m.tile_names.length,17);
 for(const id of m.tile_names){const svg=fs.readFileSync(path.join(runtime,'assets-source/terrain',id+'.svg'),'utf8');assert.match(svg,/viewBox="0 0 256 148"/);assert.doesNotMatch(svg,/<(?:script|image|foreignObject|text)\b/i);}
 for(const v of ['128','256']){assert.ok(fs.existsSync(path.join(runtime,'public/assets/terrain',m.atlas[v].file)));assert.ok(fs.existsSync(path.join(runtime,'public/assets/terrain',m.atlas[v].fallback_png)));}
});
test('shop previews use derived atlas, assets do not replace old icon folder',()=>{
 const js=fs.readFileSync(path.join(runtime,'public/terrain-01.js'),'utf8'),city=fs.readFileSync(path.join(runtime,'public/city-ui.js'),'utf8');
 assert.match(js,/function catalogImage/);assert.match(city,/DLTerrain01\.catalogImage/);assert.match(js,/Math\.imul/);
 assert.ok(!js.includes("'/assets/paper-icons/'"));
});
test('municipal material purchases persist and duplicate request never deducts again',()=>{
 const g=new Game(createWorld()),p=g.join('Roadworker');p.x=16.7;p.y=4;p.wallet=10;
 const t=g.state.treasury;
 assert.equal(c(g,p,'landscapeBuy',{kind:'paving'},'land-b-001').ok,true);
 assert.equal(p.wallet,9);assert.equal(g.state.treasury,t+1);assert.equal(p.terrainBag.paving,10);
 assert.equal(c(g,p,'landscapeBuy',{kind:'paving'},'land-b-001').ok,true);
 assert.equal(p.terrainBag.paving,10);
 p.x=14;p.y=9;
 assert.equal(c(g,p,'landscapePlace',{kind:'paving',x:14,y:9},'land-p-001').ok,true);
 assert.equal(p.terrainBag.paving,9);
 assert.equal(c(g,p,'landscapePlace',{kind:'paving',x:14,y:9},'land-p-002').ok,false);
 assert.equal(g.state.landscape.revision,1);
 const restored=new Game(JSON.parse(JSON.stringify(g.state))),q=restored.auth(p.token);
 assert.equal(q.terrainBag.paving,9);assert.equal(restored.state.landscape.tiles.length,1);
});
test('private plots deny strangers and unsold land is reserved',()=>{
 const g=new Game(createWorld()),a=g.join('Builder'),b=g.join('Visitor');
 const plot=g.state.plots.find(x=>!x.owner);assert.ok(plot,'need an unsold plot');
 let cell=null;
 for(let y=Math.ceil(plot.y);y<plot.y+plot.h&&!cell;y++)for(let x=Math.ceil(plot.x);x<plot.x+plot.w&&!cell;x++)
   if(g.walkable(x+.5,y+.5,a))cell={x,y};
 assert.ok(cell,'expected free plot cell');
 a.x=b.x=cell.x+.5;a.y=b.y=cell.y+.5;a.terrainBag.grass=b.terrainBag.grass=3;
 const unsold=c(g,a,'landscapePlace',{kind:'grass',...cell});assert.equal(unsold.ok,false);
 assert.match(unsold.message,/зарезервирован/);
 plot.owner=a.id;
 const denied=c(g,b,'landscapePlace',{kind:'grass',...cell});assert.equal(denied.ok,false);
 assert.match(denied.message,/Чужая территория/);
 assert.equal(c(g,a,'landscapePlace',{kind:'grass',...cell}).ok,true);
 assert.equal(b.terrainBag.grass,3);assert.equal(a.terrainBag.grass,2);
});
test('indexed landscape lookup scales 100, 500, 1200 without rebuilding on each movement frame',()=>{
 for(const count of [100,500,1200]){
  const g=new Game(createWorld()),p=g.join('SpeedTest');
  const tiles=Array.from({length:count},(_,i)=>({x:i%g.c.width,y:Math.floor(i/g.c.width),kind:i===0?'paving':'grass',owner:p.id,at:100}));
  g.state.landscape={version:1,revision:count,tiles};
  const idx=landscapeIndex(g);assert.equal(idx.size,count);
  const same=landscapeIndex(g);assert.strictEqual(same,idx);
  p.x=.25;p.y=.25;assert.equal(landscapeSpeed(g,p),1.2);
  p.x=2.25;p.y=2.25;assert.equal(landscapeSpeed(g,p),1);
  assert.strictEqual(landscapeIndex(g),idx);
 }
});
test('two players preserve independent terrainBag and shared authoritative placed tile',()=>{
 const g=new Game(createWorld()),a=g.join('A'),b=g.join('B');
 a.terrainBag.flowers=2;b.terrainBag.flowers=3;a.x=14;b.x=14;a.y=9;b.y=9;
 assert.equal(c(g,a,'landscapePlace',{kind:'flowers',x:14,y:9}).ok,true);
 assert.equal(a.terrainBag.flowers,1);assert.equal(b.terrainBag.flowers,3);
 assert.equal(c(g,b,'landscapePlace',{kind:'flowers',x:14,y:9}).ok,false);
 assert.equal(g.state.landscape.tiles.length,1);
});

test('renderer is read-only, chooses deterministically and culls outside camera',async()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(runtime,'public/assets/terrain/manifest.json'),'utf8'));
 const source=fs.readFileSync(path.join(runtime,'public/terrain-01.js'),'utf8');
 let images=0,background=0;
 const ctx={canvas:{width:1200,height:900},getTransform:()=>({a:1}),drawImage(){images++;},
 clearRect(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){background++;},set fillStyle(v){this._fill=v;}};
 const fakeCanvas={width:0,height:0,className:'',setAttribute(){},getContext:()=>ctx};
 const context={console,window:{},document:{createElement:()=>fakeCanvas},Image:class{set src(value){Promise.resolve().then(()=>this.onload?.());}},fetch:()=>Promise.resolve({ok:true,json:()=>Promise.resolve(manifest)})};
 vm.runInNewContext(source,context);
 await new Promise(resolve=>setTimeout(resolve,20));
 const terrain=context.window.DLTerrain01;assert.equal(terrain.ready,true);
 assert.equal(terrain.variant('paving',9,11),terrain.variant('paving',9,11));
 const state={scene:'city',cityNetwork:{current:'origin'},landscape:{revision:4,tiles:[{x:0,y:0,kind:'grass'},{x:1,y:0,kind:'paving'},{x:2,y:0,kind:'paving'},{x:1,y:1,kind:'flowers'}]}};
 const before=JSON.stringify(state),screen=(x,y)=>({x:600+(x-y)*24,y:200+(x+y)*14});
 const wp=(x,y)=>({x:(x-600)/24,y:(y-200)/14});
 assert.equal(terrain.draw(ctx,state,screen,28,wp),true);
 assert.ok(images>=4);assert.equal(terrain.kindAt(state,1,0),'paving');
 const same=terrain.rebuild(state);assert.strictEqual(terrain.rebuild(state),same);
 assert.equal(JSON.stringify(state),before);
 assert.equal(terrain.draw(ctx,{...state,scene:'museum'},screen,28,wp),false);
 terrain.catalogImage('grass');assert.ok(images>=5);
});
