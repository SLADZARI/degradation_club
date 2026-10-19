import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,createWorld} from '../world.mjs';
import {MENTALHUMOR,MENTAL_HALL,MENTAL_OBJECTS,MENTAL_TREES,mentalWalkable} from '../mentalhumor.mjs';
import {WORLD01} from '../world-01.mjs';
let seq=0;const setup=()=>{const g=new Game(createWorld());const p=g.join('Mental resident'),b=g.join('Mental neighbour');
  g.connect(p);g.connect(b);const act=(actor,type,target)=>g.command(actor,{type,target,requestId:'mentaltest-'+(++seq)});
  return {g,p,b,act};};
const at=(p,o)=>{p.x=o.x;p.y=o.y;};
const own=p=>({id:p.id,token:p.token,wallet:p.wallet,bag:structuredClone(p.bag),tools:structuredClone(p.tools)});
const enterCity=v=>{at(v.p,MENTALHUMOR.cityGate);const r=v.act(v.p,'mentalEnter','mental-city-gate');assert.equal(r.ok,true,r.message);return r;};
test('Museum is central to a larger walkable park with generated trees and multiple stations',()=>{
 assert.equal(MENTALHUMOR.width,80);assert.equal(MENTALHUMOR.height,60);
 assert.ok(MENTAL_TREES.length>70);assert.equal(MENTAL_OBJECTS.filter(o=>o.type==='mental-display').length,4);
 assert.equal(MENTAL_HALL.objects.filter(o=>o.type==='mental-exhibit').length,3);
 for(let y=34;y<58;y+=.5)assert.equal(mentalWalkable(39,y),true,'main museum avenue '+y);
 assert.equal(mentalWalkable(35,20),false,'Museum building must block walking through walls');
 assert.equal(mentalWalkable(MENTAL_TREES[0].x,MENTAL_TREES[0].y),false);
 assert.equal(mentalWalkable(0,30),false);
});
test('Museum gate enforces physical approach from city and does not mint wallet or materials',()=>{
 const v=setup();v.p.wallet=93;v.p.bag.wood=5;v.p.bag.food=3;
 const snapshot=own(v.p);
 assert.equal(v.act(v.p,'mentalEnter','mental-city-gate').ok,false);
 assert.equal(v.p.scene,'city');
 assert.equal(enterCity(v).region,'mentalhumor');assert.equal(v.p.scene,'mentalhumor');
 assert.deepEqual(own(v.p),snapshot);
});
test('Forest footpath reaches MentalHumor and can return to original forest',()=>{
 const v=setup();at(v.p,WORLD01.cityGate);assert.equal(v.act(v.p,'world01Enter',WORLD01.cityGate.id).ok,true);
 at(v.p,MENTALHUMOR.forestGate);
 assert.equal(v.act(v.p,'mentalEnter','mental-forest-gate').region,'mentalhumor');
 at(v.p,MENTALHUMOR.trailForest);
 assert.equal(v.act(v.p,'mentalReturnForest','mental-to-forest').region,'ideas-forest');
 assert.equal(v.p.scene,'forest');
});
test('Museum entrance is spatial, gallery exists and an exit returns player to grounds',()=>{
 const v=setup();enterCity(v);
 assert.equal(v.act(v.p,'mentalMuseumEnter','mental-museum-entry').ok,false);
 at(v.p,MENTALHUMOR.hallEntrance);
 assert.equal(v.act(v.p,'mentalMuseumEnter','mental-museum-entry').region,'mentalhumor-hall');
 assert.equal(v.g.snapshot(v.p).mentalhumor.objects.filter(o=>o.type==='mental-exhibit').length,3);
 assert.equal(v.g.walkable(10,10,v.p),true);
 assert.equal(v.g.walkable(50,10,v.p),false);
 at(v.p,MENTALHUMOR.hallExit);
 assert.equal(v.act(v.p,'mentalMuseumLeave','mental-hall-exit').region,'mentalhumor');
 assert.equal(v.p.scene,'mentalhumor');
});
test('Real museum source is linked but its partnership and copyright clearance are NOT implied',()=>{
 const v=setup();enterCity(v);at(v.p,MENTALHUMOR.hallEntrance);v.act(v.p,'mentalMuseumEnter','mental-museum-entry');
 assert.equal(v.act(v.p,'mentalInspect','mental-museum-about').ok,false);
 const museum=MENTAL_HALL.objects.find(o=>o.id==='mental-museum-about');
 at(v.p,museum);const r=v.act(v.p,'mentalInspect',museum.id);
 assert.equal(r.card.href,'https://eestihuumor.ee/');
 assert.equal(r.card.mode,'RESEARCH_DEMO_NOT_PARTNERED');
 assert.equal(r.card.audio,undefined);assert.equal(r.card.license,undefined);
 assert.equal(r.card.sourceRef,'museum:eesti-huumorimuuseum');
 const idea=MENTAL_HALL.objects.find(o=>o.id==='mental-museum-laughter');
 at(v.p,idea);const r2=v.act(v.p,'mentalInspect',idea.id);
 assert.equal(r2.card.href,undefined);assert.match(r2.card.body,/не действующая экспозиция/);
});
test('Gallery contents are not accessible from the grounds or remotely',()=>{
 const v=setup();enterCity(v);
 const bad=v.act(v.p,'mentalInspect','mental-museum-about');
 assert.equal(bad.ok,false);
 assert.equal(v.act(v.p,'mentalMuseumLeave','mental-hall-exit').ok,false);
 assert.equal(v.act(v.p,'mentalReturnForest','mental-to-forest').ok,false);
});
test('Two residents share park presence without seeing each others money or bearer token',()=>{
 const v=setup();enterCity(v);at(v.b,MENTALHUMOR.cityGate);
 assert.equal(v.act(v.b,'mentalEnter','mental-city-gate').ok,true);
 const state=v.g.snapshot(v.p);
 assert.equal(state.scene,'mentalhumor');
 assert.equal(state.players.filter(x=>x.online&&x.scene==='mentalhumor').length,2);
 assert.equal(state.players.find(x=>x.id===v.b.id).wallet,undefined);
 assert.ok(!JSON.stringify(state).includes(v.b.token));
});
test('Leaving park and reloading save conserves character, PAPER, inventory and plots',()=>{
 const v=setup();v.p.wallet=181;v.p.bag.wood=8;v.p.bag.stone=2;
 const before=own(v.p);enterCity(v);
 at(v.p,MENTALHUMOR.hallEntrance);v.act(v.p,'mentalMuseumEnter','mental-museum-entry');
 const saved=new Game(JSON.parse(JSON.stringify(v.g.state)));const again=saved.auth(v.p.token);
 assert.equal(again.id,v.p.id);assert.equal(again.scene,'mentalhumor-hall');
 assert.deepEqual(own(again),before);
 at(again,MENTALHUMOR.hallExit);
 assert.equal(saved.command(again,{type:'mentalMuseumLeave',target:'mental-hall-exit',requestId:'mentalreload'}).ok,true);
 at(again,MENTALHUMOR.trailCity);
 assert.equal(saved.command(again,{type:'mentalReturnCity',target:'mental-to-city',requestId:'mentalreturn'}).ok,true);
 assert.deepEqual(own(again),before);
});
test('Request idempotency prevents duplicate transitions and wallet changes',()=>{
 const v=setup();at(v.p,MENTALHUMOR.cityGate);const cmd={type:'mentalEnter',target:'mental-city-gate',requestId:'travel-one'};
 const a=v.g.command(v.p,cmd),b=v.g.command(v.p,cmd);
 assert.deepEqual(a,b);assert.equal(v.p.scene,'mentalhumor');assert.equal(v.p.wallet,0);
});
test('Economy, housing, city jobs and harvesting are disabled in museum region',()=>{
 const v=setup();enterCity(v);
 for(const type of ['buy','mine','deliver','build','craftTool'])assert.equal(v.act(v.p,type,'wood-1').ok,false);
 assert.equal(v.p.bag.wood,0);assert.equal(v.p.wallet,0);
});
